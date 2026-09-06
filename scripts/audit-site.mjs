import { chromium } from 'playwright';
import { readFile, readdir } from 'node:fs/promises';
/*
 * The route data is the source of truth, so the audit reads it instead of
 * restating it. Node strips the types on import; that needs Node 22.18 or 24,
 * which is what package.json engines and the CI workflow install.
 */
import {
  modulePath,
  projectPath,
  projects,
  technologies,
  technologyIndexEntries,
  technologyPath,
  text,
} from '../src/data/content.ts';

const baseUrl = process.env.AUDIT_BASE_URL ?? 'http://localhost:4321';

/*
 * The cyclic page sequence, rebuilt from src/data/content.ts.
 *
 * This used to be forty lines of hand-written URLs, and every new project or
 * technology reshuffled the chain and failed the audit on a site that was
 * correct. Derived, adding a project changes what the audit expects, never
 * whether it passes.
 *
 * It is deliberately re-derived here rather than imported from
 * SectionNavigation.astro: the audit needs an expectation the component cannot
 * satisfy by agreeing with itself. A project missing from the component's
 * `sections` list has to fail against this.
 */
function pageSequence(locale) {
  const isEs = locale === 'es';
  return [
    { label: isEs ? 'Inicio' : 'Home', path: isEs ? '/' : '/en/' },
    { label: isEs ? 'Sobre mí' : 'About', path: isEs ? '/sobre-mi/' : '/en/about/' },
    { label: isEs ? 'Proyectos' : 'Projects', path: isEs ? '/proyectos/' : '/en/projects/' },
    ...projects.flatMap((project) => [
      { label: project.title, path: projectPath(project, locale) },
      ...project.modules.map((module) => ({ label: text(module.title, locale), path: modulePath(project, module, locale) })),
    ]),
    { label: isEs ? 'Tecnologías' : 'Technologies', path: isEs ? '/tecnologias/' : '/en/technologies/' },
    ...technologyIndexEntries.map(({ technology }) => ({ label: technology.name, path: technologyPath(technology, locale) })),
  ];
}

const sequences = { es: pageSequence('es'), en: pageSequence('en') };

function sequenceNeighbours(locale, path) {
  const steps = sequences[locale];
  const index = steps.findIndex((step) => step.path === path);
  if (index === -1) throw new Error(`audit: ${path} is not part of the ${locale} sequence derived from src/data/content.ts`);
  return {
    label: steps[index].label,
    previous: steps[(index - 1 + steps.length) % steps.length].path,
    next: steps[(index + 1) % steps.length].path,
  };
}

const finalProject = projects.at(-1);
const finalModuleRoute = modulePath(finalProject, finalProject.modules.at(-1), 'es');
const firstTechnologyRoute = technologyPath(technologyIndexEntries[0].technology, 'es');
const finalTechnologyRoute = technologyPath(technologyIndexEntries.at(-1).technology, 'es');
const logolessTechnologies = technologies.filter((technology) => !technology.logo);

/*
 * Rail probes. Every project boundary, both ends of the technology run, and the
 * wrap back to Home; the English set covers the same joints to prove the
 * sequence stays inside /en/.
 */
const railProbes = [
  { locale: 'es', path: '/sobre-mi/', label: 'About' },
  { locale: 'es', path: '/proyectos/', label: 'Projects' },
  ...projects.flatMap((project) => [
    { locale: 'es', path: projectPath(project, 'es'), label: `${project.title} index` },
    { locale: 'es', path: modulePath(project, project.modules.at(-1), 'es'), label: `${project.title} final module` },
  ]),
  { locale: 'es', path: '/tecnologias/', label: 'Technologies' },
  { locale: 'es', path: firstTechnologyRoute, label: 'first technology' },
  { locale: 'es', path: finalTechnologyRoute, label: 'final technology' },
  { locale: 'en', path: '/en/about/', label: 'English About' },
  { locale: 'en', path: '/en/projects/', label: 'English Projects' },
  { locale: 'en', path: projectPath(projects[0], 'en'), label: `English ${projects[0].title} index` },
  { locale: 'en', path: modulePath(finalProject, finalProject.modules.at(-1), 'en'), label: 'English final module' },
  { locale: 'en', path: '/en/technologies/', label: 'English Technologies' },
  { locale: 'en', path: technologyPath(technologyIndexEntries.at(-1).technology, 'en'), label: 'English final technology' },
];

const sampledTechnologies = ['astro', 'kubernetes', 'terraform', 'tanstack', 'claude-code'];
const routes = [
  '/',
  '/en/',
  '/sobre-mi/',
  '/en/about/',
  '/proyectos/',
  '/en/projects/',
  '/tecnologias/',
  '/en/technologies/',
  ...projects.map((project) => projectPath(project, 'es')),
  ...projects.map((project) => modulePath(project, project.modules[0], 'es')),
  projectPath(projects[0], 'en'),
  '/en/projects/portal/asistencia/',
  ...sampledTechnologies.map((slug) => `/tecnologias/${slug}/`),
  '/en/technologies/astro/',
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];
const themeSurfaces = { dark: 'rgb(8, 9, 9)', light: 'rgb(233, 235, 228)' };
const failures = [];
const internalLinks = new Set();
const sourceRoot = new URL('../src/', import.meta.url);
const sourceEntries = await readdir(sourceRoot, { recursive: true });
const voseoPattern = /(?<![\p{L}\p{M}])(?:vos|sos|tenés|podés|querés|sabés|hacés|venís|decís|sentís|elegís|tocá|activá|explorá|descargá|conocé|mirá|visitá|volvé|revisá|usá|contactá|seleccioná|encendé|apagá|mantené|probá|iniciá|cambiá|navegá|completá|conectá|creá|diseñá|desplegá|leé|andá|elegí\s+cómo|abrí\s+cada)(?![\p{L}\p{M}])/giu;

/*
 * Readiness is asserted without scrolling on purpose. The first artifact sits
 * ~1300px below the fold on desktop, so the viewport gate alone would leave a
 * reader who never scrolls looking at the CSS fallback; src/scripts/module-
 * artifacts.ts therefore starts on idle time as well, and this is the check
 * that keeps that floor in place. The per-route pass below scrolls every page,
 * so the visitor-facing path is covered there.
 */
async function verifyModuleArtifacts(page, expected, label) {
  const ready = await page.waitForFunction((count) => {
    const artifacts = [...document.querySelectorAll('[data-module-artifact]')];
    return artifacts.length === count && artifacts.every((artifact) => artifact.querySelector('[data-three-ready="true"]'));
  }, expected, { timeout: 5000 }).then(() => true).catch(() => false);
  if (!ready) {
    const rendered = await page.locator('[data-module-artifact]').count();
    failures.push(`${label}: expected ${expected} ready module artifacts, ${rendered} rendered`);
    return;
  }
  const invalidCanvases = await page.locator('[data-module-artifact-canvas]').evaluateAll((canvases) => canvases.filter((canvas) => canvas.width <= 2 || canvas.height <= 2).length);
  if (invalidCanvases > 0) failures.push(`${label}: ${invalidCanvases} module artifacts have an invalid canvas size`);
}

async function verifySequenceRails(page, { locale, path, label }) {
  const { previous, next } = sequenceNeighbours(locale, path);
  await page.goto(new URL(path, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
  const rails = await page.evaluate(() => ({
    previous: document.querySelector('.section-step--previous')?.getAttribute('href') ?? null,
    next: document.querySelector('.section-step--next')?.getAttribute('href') ?? null,
  }));
  if (rails.previous !== previous) failures.push(`navigation: ${label} previous rail points at ${rails.previous} instead of ${previous}`);
  if (rails.next !== next) failures.push(`navigation: ${label} next rail points at ${rails.next} instead of ${next}`);
}

/*
 * The ClientRouter pushes the new URL before it swaps the document, so
 * `waitForURL` can resolve while the previous page is still on screen — and a
 * click that lands there follows the old rail. The canonical link is per route,
 * so it is the cheapest proof that the swap actually happened.
 */
async function waitForSwap(page, path) {
  await page.waitForURL(new URL(path, baseUrl).toString());
  await page.waitForFunction((expected) => {
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? new URL(canonical.href).pathname === expected : false;
  }, path, { timeout: 10000 });
}

const bodySurface = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

for (const entry of sourceEntries.filter((path) => /\.(?:astro|ts|tsx|js|mjs)$/.test(path))) {
  const source = await readFile(new URL(entry, sourceRoot), 'utf8');
  const matches = [...new Set(source.match(voseoPattern) ?? [])];
  if (matches.length) failures.push(`neutral Spanish: ${entry} contains voseo: ${matches.join(', ')}`);
}

if (sequences.es.length !== sequences.en.length) failures.push(`sequence: Spanish has ${sequences.es.length} steps and English ${sequences.en.length}`);
for (const [locale, steps] of Object.entries(sequences)) {
  const paths = steps.map((step) => step.path);
  const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
  if (duplicates.length) failures.push(`sequence: ${locale} visits ${[...new Set(duplicates)].join(', ')} more than once`);
  const misplaced = locale === 'en' ? paths.filter((path) => !path.startsWith('/en/')) : paths.filter((path) => path.startsWith('/en/'));
  if (misplaced.length) failures.push(`sequence: ${locale} contains routes from the other language: ${misplaced.join(', ')}`);
}

const browser = await chromium.launch({ headless: true });

try {
  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: viewports[1] });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(new URL('/', baseUrl).toString(), { waitUntil: 'load' });
  const bootDisplay = await noJsPage.locator('.boot-screen').evaluate((element) => getComputedStyle(element).display);
  if (bootDisplay !== 'none') failures.push(`no-js: boot screen is ${bootDisplay} instead of hidden`);
  if (!(await noJsPage.locator('h1').isVisible())) failures.push('no-js: primary content is not visible');
  if ((await noJsPage.locator('.site-header').count()) !== 0) failures.push('no-js: the immersive home must not render the site header');
  await noJsPage.goto(new URL('/proyectos/portal/', baseUrl).toString(), { waitUntil: 'load' });
  if (!(await noJsPage.locator('h1').isVisible())) failures.push('no-js: internal project content is not visible');
  if ((await noJsPage.locator('.site-header').count()) !== 1) failures.push('no-js: internal routes must render the site header without scripts');
  const fallbackOpacity = await noJsPage.locator('.module-artifact-fallback').first().evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
  if (fallbackOpacity < 0.99) failures.push(`no-js: module artifact fallback opacity is ${fallbackOpacity}`);
  await noJsPage.goto(new URL('/proyectos/infraestructura/', baseUrl).toString(), { waitUntil: 'load' });
  if (!(await noJsPage.locator('h1').isVisible())) failures.push('no-js: infrastructure project content is not visible');
  await noJsContext.close();

  const noJsLightContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light', viewport: viewports[0] });
  const noJsLightPage = await noJsLightContext.newPage();
  await noJsLightPage.goto(new URL('/tecnologias/', baseUrl).toString(), { waitUntil: 'load' });
  const noJsLightSurface = await bodySurface(noJsLightPage);
  if (noJsLightSurface !== themeSurfaces.light) failures.push(`no-js: the light system preference resolves to ${noJsLightSurface} instead of ${themeSurfaces.light}`);
  await noJsLightContext.close();

  const bootContext = await browser.newContext({ colorScheme: 'light', viewport: viewports[0] });
  const bootPage = await bootContext.newPage();
  await bootPage.route('**/*', async (route) => {
    if (route.request().resourceType() === 'script') await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await bootPage.goto(new URL('/', baseUrl).toString(), { waitUntil: 'commit' });
  await bootPage.locator('.boot-screen').waitFor({ state: 'attached' });
  const earlyBootDisplay = await bootPage.locator('.boot-screen').evaluate((element) => getComputedStyle(element).display);
  if (earlyBootDisplay !== 'grid') failures.push(`home: boot screen is ${earlyBootDisplay} before client modules initialize`);
  await bootContext.close();

  const interactionContext = await browser.newContext({ colorScheme: 'dark', viewport: viewports[0] });
  const interactionPage = await interactionContext.newPage();
  interactionPage.on('console', (message) => {
    if (message.type() === 'error') failures.push(`interaction: console error: ${message.text()}`);
  });
  interactionPage.on('pageerror', (error) => failures.push(`interaction: page error: ${error.message}`));
  await interactionPage.goto(new URL('/', baseUrl).toString(), { waitUntil: 'networkidle' });
  if ((await interactionPage.locator('.section-navigation').count()) !== 0) failures.push('home: section navigation must not render inside the immersive rack');
  if ((await interactionPage.locator('[data-rack-step].is-revealed').count()) !== 1) failures.push('home: initial state must reveal only the portrait module');
  if ((await interactionPage.locator('.contact-actions a[href="mailto:carlosmir.code@gmail.com"]').count()) !== 1) failures.push('home: email contact is missing');
  if ((await interactionPage.locator('.contact-actions a[href="https://github.com/camircode"] svg.brand-mark').count()) !== 1) failures.push('home: GitHub contact or its inline mark is missing');
  if ((await interactionPage.locator('.contact-actions a[href="https://www.linkedin.com/in/camircode/"] img.brand-mark').count()) !== 1) failures.push('home: LinkedIn contact or icon is missing');
  await interactionPage.locator('[data-rack-step="5"]').click();
  const serverReady = await interactionPage.waitForFunction(() => document.querySelector('[data-server-canvas]')?.hasAttribute('data-server-ready'), undefined, { timeout: 5000 }).then(() => true).catch(() => false);
  if (!serverReady) failures.push('home: Three.js server scene did not initialize');
  else {
    const serverSize = await interactionPage.locator('[data-server-canvas]').evaluate((canvas) => ({ width: canvas.width, height: canvas.height, clientWidth: canvas.clientWidth, clientHeight: canvas.clientHeight }));
    if (serverSize.width <= 300 || serverSize.height <= 150) failures.push(`home: Three.js canvas remained at ${serverSize.width}x${serverSize.height}`);
    if (serverSize.clientWidth <= 0 || serverSize.clientHeight <= 0) failures.push('home: Three.js canvas has no rendered dimensions');
  }
  await interactionPage.locator('[data-rack-step="1"]').click();
  if (new URL(interactionPage.url()).pathname !== '/') failures.push('home: first module touch navigated instead of revealing');
  if ((await interactionPage.locator('[data-rack-step="1"]').getAttribute('aria-expanded')) !== 'true') failures.push('home: first module touch did not reveal its content');
  await interactionPage.locator('[data-rack-step="1"]').click();
  await interactionPage.waitForURL('**/sobre-mi/');
  if ((await interactionPage.locator('.about-portrait').count()) !== 0) failures.push('about: portrait must not be repeated');
  if ((await interactionPage.locator('.about-page > header .kicker').count()) !== 0) failures.push('about: removed development and operations kicker is still rendered');
  if ((await interactionPage.locator('.about-actions a[href="mailto:carlosmir.code@gmail.com"]').count()) !== 1) failures.push('about: email contact is missing');
  if ((await interactionPage.locator('.about-actions a[href="https://github.com/camircode"] svg.brand-mark').count()) !== 1) failures.push('about: GitHub contact or its inline mark is missing');
  if ((await interactionPage.locator('.about-actions a[href="https://www.linkedin.com/in/camircode/"] img.brand-mark').count()) !== 1) failures.push('about: LinkedIn contact or icon is missing');
  await interactionPage.locator('.section-step--previous').click();
  await interactionPage.waitForURL(new URL('/', baseUrl).toString());
  if ((await interactionPage.locator('[data-language-option="es"]').getAttribute('aria-current')) !== 'page') failures.push('home: Spanish must be selected on the canonical route');
  await interactionPage.locator('[data-language-option="en"]').click();
  await interactionPage.waitForURL(new URL('/en/', baseUrl).toString());
  if ((await interactionPage.locator('[data-language-option="en"]').getAttribute('aria-current')) !== 'page') failures.push('home: English selector did not update after client navigation');
  if ((await interactionPage.locator('html').getAttribute('lang')) !== 'en') failures.push('home: document language did not change to English');
  await interactionPage.locator('[data-language-option="es"]').click();
  await interactionPage.waitForURL(new URL('/', baseUrl).toString());
  if ((await interactionPage.locator('[data-language-option="es"]').getAttribute('aria-current')) !== 'page') failures.push('home: Spanish selector did not update after client navigation');
  if ((await interactionPage.locator('html').getAttribute('lang')) !== 'es') failures.push('home: document language did not return to Spanish');

  for (const probe of railProbes) await verifySequenceRails(interactionPage, probe);

  for (const project of projects) {
    await interactionPage.goto(new URL(projectPath(project, 'es'), baseUrl).toString(), { waitUntil: 'networkidle' });
    await verifyModuleArtifacts(interactionPage, project.modules.length, project.title);
  }

  await interactionPage.goto(new URL(finalModuleRoute, baseUrl).toString(), { waitUntil: 'networkidle' });
  await interactionPage.locator('.section-step--next').click();
  await interactionPage.waitForURL(new URL(sequenceNeighbours('es', finalModuleRoute).next, baseUrl).toString());
  const introOpacity = await interactionPage.locator('.page-intro').evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
  if (introOpacity < 0.99) failures.push(`navigation: destination intro opacity is ${introOpacity} after client navigation`);
  const transitionAnimations = await interactionPage.evaluate(() => document.getAnimations().filter((animation) => /view-transition|astroFade/.test(animation.animationName)).length);
  if (transitionAnimations === 0) failures.push('navigation: client route changed without a visible View Transition animation');
  await interactionPage.waitForTimeout(350);
  const runningTransitionAnimations = await interactionPage.evaluate(() => document.getAnimations().filter((animation) => /view-transition|astroFade/.test(animation.animationName) && animation.playState === 'running').length);
  if (runningTransitionAnimations > 0) failures.push(`navigation: ${runningTransitionAnimations} View Transition animations still run after 350ms`);

  /*
   * Three consecutive rail hops without a fresh load. A `const` declared at the
   * top level of a `<script is:inline data-astro-rerun>` block throws on the
   * second view transition and takes the rest of the block with it, which is
   * how every Portal demo ended up paused for the rest of a visit. A single
   * clean goto per route cannot see that, so the walk has to stay.
   */
  let walkRoute = modulePath(projects.find((project) => project.slug === 'portal'), projects.find((project) => project.slug === 'portal').modules[0], 'es');
  await interactionPage.goto(new URL(walkRoute, baseUrl).toString(), { waitUntil: 'networkidle' });
  for (let hop = 1; hop <= 3; hop += 1) {
    const expected = sequenceNeighbours('es', walkRoute).next;
    await interactionPage.locator('.section-step--next').click();
    await waitForSwap(interactionPage, expected);
    walkRoute = expected;
    const alive = await interactionPage.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      headers: document.querySelectorAll('.site-header').length,
      steps: document.querySelectorAll('.section-step').length,
      themeReady: document.documentElement.hasAttribute('data-theme-ready'),
    }));
    if (alive.h1 !== 1) failures.push(`rail walk: hop ${hop} to ${walkRoute} has ${alive.h1} h1 elements`);
    if (alive.headers !== 1) failures.push(`rail walk: hop ${hop} to ${walkRoute} renders ${alive.headers} site headers`);
    if (alive.steps !== 2) failures.push(`rail walk: hop ${hop} to ${walkRoute} renders ${alive.steps} rails`);
    if (!alive.themeReady) failures.push(`rail walk: hop ${hop} to ${walkRoute} lost the theme script`);
    const demosPlaying = await interactionPage.waitForFunction(() => {
      const videos = [...document.querySelectorAll('.module-demo video')];
      return videos.length > 0 && videos.every((video) => !video.paused && video.currentTime > 0);
    }, undefined, { timeout: 4000 }).then(() => true).catch(() => false);
    if (!demosPlaying) failures.push(`rail walk: hop ${hop} to ${walkRoute} left its demo video paused`);
  }
  await interactionContext.close();

  const reducedContext = await browser.newContext({ reducedMotion: 'reduce', viewport: viewports[0] });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(new URL('/proyectos/portal/asistencia/', baseUrl).toString(), { waitUntil: 'networkidle' });
  const demoLayout = await reducedPage.locator('.module-demo').evaluate((figure) => {
    const videoBounds = figure.querySelector('video')?.getBoundingClientRect();
    const captionBounds = figure.querySelector('figcaption')?.getBoundingClientRect();
    return {
      videoBottom: videoBounds?.bottom ?? 0,
      captionTop: captionBounds?.top ?? 0,
    };
  });
  if (demoLayout.captionTop < demoLayout.videoBottom - 1) failures.push('video: disclaimer overlaps the native media controls');
  if (!(await reducedPage.locator('.module-demo video').evaluate((video) => video.paused))) failures.push('reduced-motion: Portal demo video continued playing');
  if (await reducedPage.locator('html').evaluate((html) => html.classList.contains('reveal-ready'))) failures.push('reduced-motion: scroll reveal state remained enabled');
  await reducedContext.close();

  const revealContext = await browser.newContext({ viewport: viewports[0] });
  const revealPage = await revealContext.newPage();
  await revealPage.goto(new URL('/tecnologias/', baseUrl).toString(), { waitUntil: 'networkidle' });
  const technologyIntro = await revealPage.locator('.technology-intro').evaluate((element) => ({
    childCount: element.childElementCount,
    title: element.querySelector('h1')?.textContent?.trim(),
  }));
  if (technologyIntro.childCount !== 1 || technologyIntro.title !== 'Software con el que trabajo') failures.push('technologies: intro must contain only the requested title');
  const renderedTechnologies = await revealPage.locator('.technology-card').count();
  if (renderedTechnologies !== technologyIndexEntries.length) failures.push(`technologies: ${renderedTechnologies} cards rendered for ${technologyIndexEntries.length} technologies`);
  const leadingTechnologies = await revealPage.locator('.technology-card').evaluateAll((cards) => cards.slice(0, 4).map((card) => {
    return { title: card.querySelector('h2')?.textContent?.trim(), x: card.offsetLeft, y: card.offsetTop, width: card.offsetWidth, background: getComputedStyle(card).backgroundColor };
  }));
  const expectedLeading = technologyIndexEntries.slice(0, 4).map(({ technology }) => technology.name);
  if (leadingTechnologies.map((card) => card.title).join(',') !== expectedLeading.join(',')) failures.push(`technologies: visible order starts with ${leadingTechnologies.map((card) => card.title).join(', ')} instead of ${expectedLeading.join(', ')}`);
  if (Math.abs(leadingTechnologies[0].width - leadingTechnologies[1].width) > 1) failures.push('technologies: desktop columns are not equal widths');
  if (Math.abs(leadingTechnologies[0].x - leadingTechnologies[2].x) > 1 || Math.abs(leadingTechnologies[1].x - leadingTechnologies[3].x) > 1) failures.push('technologies: the third and fourth cards do not sit below the first and second');
  if (leadingTechnologies[0].background !== leadingTechnologies[3].background || leadingTechnologies[1].background !== leadingTechnologies[2].background || leadingTechnologies[0].background === leadingTechnologies[1].background) failures.push('technologies: leading cards do not form the diagonal color pattern');
  await revealPage.waitForTimeout(3000);
  if (!(await revealPage.locator('html').evaluate((html) => html.classList.contains('reveal-ready')))) failures.push('scroll reveal: enhancement expired after successful initialization');
  if ((await revealPage.locator('.technology-card:not(.is-visible)').count()) === 0) failures.push('scroll reveal: below-fold technology cards were revealed before scrolling');
  const finalTechnology = revealPage.locator('.technology-card').last();
  const hiddenOpacity = await finalTechnology.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
  if (hiddenOpacity > 0.01) failures.push(`scroll reveal: below-fold card starts at opacity ${hiddenOpacity} instead of hidden`);
  await finalTechnology.scrollIntoViewIfNeeded();
  await revealPage.waitForTimeout(180);
  if (!(await finalTechnology.evaluate((element) => element.classList.contains('is-visible')))) failures.push('scroll reveal: final technology card did not appear after scrolling');
  const revealMidpoint = await finalTechnology.evaluate((element) => ({
    opacity: Number.parseFloat(getComputedStyle(element).opacity),
    transform: getComputedStyle(element).transform,
  }));
  if (revealMidpoint.opacity <= 0.05 || revealMidpoint.opacity >= 0.98) failures.push(`scroll reveal: card has no perceptible midpoint at opacity ${revealMidpoint.opacity}`);
  if (revealMidpoint.transform === 'none') failures.push('scroll reveal: card has no spatial movement at its midpoint');
  await revealPage.waitForTimeout(700);
  const revealedOpacity = await finalTechnology.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
  if (revealedOpacity < 0.99) failures.push(`scroll reveal: card finishes at opacity ${revealedOpacity} instead of visible`);
  await revealContext.close();

  /*
   * Two themes, every route included. The home rack followed neither the system
   * preference nor the stored choice until this check changed with it, so it is
   * asserted exactly like an internal route: --rack-black is a light-dark()
   * pair, read where a visitor sees it, on the resolved body background.
   */
  for (const colorScheme of ['dark', 'light']) {
    const themeContext = await browser.newContext({ colorScheme, viewport: viewports[0] });
    const themePage = await themeContext.newPage();
    await themePage.goto(new URL('/tecnologias/', baseUrl).toString(), { waitUntil: 'networkidle' });
    const internalSurface = await bodySurface(themePage);
    if (internalSurface !== themeSurfaces[colorScheme]) failures.push(`theme: /tecnologias/ resolves to ${internalSurface} under the ${colorScheme} system preference instead of ${themeSurfaces[colorScheme]}`);
    await themePage.goto(new URL('/', baseUrl).toString(), { waitUntil: 'networkidle' });
    const homeSurface = await bodySurface(themePage);
    if (homeSurface !== themeSurfaces[colorScheme]) failures.push(`theme: the immersive home resolves to ${homeSurface} under the ${colorScheme} system preference instead of ${themeSurfaces[colorScheme]}`);
    await themeContext.close();
  }

  const toggleContext = await browser.newContext({ colorScheme: 'dark', viewport: viewports[0] });
  const togglePage = await toggleContext.newPage();
  await togglePage.goto(new URL('/tecnologias/', baseUrl).toString(), { waitUntil: 'networkidle' });
  await togglePage.locator('[data-theme-toggle]').click();
  const toggledSurface = await bodySurface(togglePage);
  if (toggledSurface !== themeSurfaces.light) failures.push(`theme: the toggle left /tecnologias/ at ${toggledSurface} instead of overriding the dark system preference`);
  const storedChoice = await togglePage.evaluate(() => localStorage.getItem('camir-theme'));
  if (storedChoice !== 'light') failures.push(`theme: the toggle stored ${storedChoice} instead of light`);
  await togglePage.reload({ waitUntil: 'networkidle' });
  const reloadedSurface = await bodySurface(togglePage);
  if (reloadedSurface !== themeSurfaces.light) failures.push(`theme: the stored light choice resolved to ${reloadedSurface} after a reload`);
  await togglePage.goto(new URL('/', baseUrl).toString(), { waitUntil: 'networkidle' });
  const storedHomeSurface = await bodySurface(togglePage);
  if (storedHomeSurface !== themeSurfaces.light) failures.push(`theme: the stored light choice left the immersive home at ${storedHomeSurface}`);
  await toggleContext.close();

  /*
   * Every route in both sequences, at the narrowest viewport the site claims to
   * support. The pass below is deep and therefore sampled; this one is shallow
   * and complete, because sideways scroll and a missing rail depend on the
   * length of one word and never show up where you sampled. It costs about
   * twenty seconds for the whole site.
   */
  const sweepContext = await browser.newContext({ viewport: viewports[1] });
  const sweepPage = await sweepContext.newPage();
  for (const [locale, steps] of Object.entries(sequences)) {
    for (const step of steps) {
      const isHome = step.path === '/' || step.path === '/en/';
      const response = await sweepPage.goto(new URL(step.path, baseUrl).toString(), { waitUntil: 'domcontentloaded' });
      if (!response?.ok()) {
        failures.push(`sweep: ${step.path} returned ${response?.status() ?? 'no response'}`);
        continue;
      }
      const measured = await sweepPage.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        widest: (() => {
          const candidates = [...document.querySelectorAll('h1, h2, .lead, .kicker')];
          const worst = candidates.map((element) => ({ tag: element.tagName.toLowerCase(), excess: element.scrollWidth - element.clientWidth, text: element.textContent?.trim().slice(0, 40) ?? '' })).sort((first, second) => second.excess - first.excess)[0];
          return worst && worst.excess > 1 ? worst : null;
        })(),
        h1: document.querySelectorAll('h1').length,
        headers: document.querySelectorAll('.site-header').length,
        steps: document.querySelectorAll('.section-step').length,
        lang: document.documentElement.lang,
      }));
      const culprit = measured.widest ? ` — widest ${measured.widest.tag} “${measured.widest.text}” exceeds its column by ${measured.widest.excess}px` : '';
      if (measured.overflow > 1) failures.push(`sweep: ${step.path} overflows horizontally by ${measured.overflow}px at ${viewports[1].width}px${culprit}`);
      if (measured.h1 !== 1) failures.push(`sweep: ${step.path} has ${measured.h1} h1 elements`);
      if (measured.headers !== (isHome ? 0 : 1)) failures.push(`sweep: ${step.path} renders ${measured.headers} site headers instead of ${isHome ? 0 : 1}`);
      if (measured.steps !== (isHome ? 0 : 2)) failures.push(`sweep: ${step.path} renders ${measured.steps} rails instead of ${isHome ? 0 : 2}`);
      if (measured.lang !== locale) failures.push(`sweep: ${step.path} declares lang="${measured.lang}" instead of "${locale}"`);
    }
  }
  await sweepContext.close();

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error') failures.push(`${viewport.name}: console error: ${message.text()}`);
    });
    page.on('pageerror', (error) => failures.push(`${viewport.name}: page error: ${error.message}`));

    for (const route of routes) {
      const isHome = route === '/' || route === '/en/';
      const response = await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle' });
      if (!response?.ok()) failures.push(`${viewport.name}: ${route} returned ${response?.status() ?? 'no response'}`);
      await page.evaluate(async () => {
        for (let position = 0; position <= document.body.scrollHeight; position += Math.max(window.innerHeight * 0.7, 300)) {
          window.scrollTo(0, position);
          await new Promise((resolve) => setTimeout(resolve, 35));
        }
        await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
      });
      const result = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        missingImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
        links: [...document.querySelectorAll('a[href^="/"]')].map((link) => link.getAttribute('href')).filter(Boolean),
        media: [
          ...[...document.querySelectorAll('video source[src^="/"]')].map((source) => source.getAttribute('src')),
          ...[...document.querySelectorAll('video[poster^="/"]')].map((video) => video.getAttribute('poster')),
        ].filter(Boolean),
        siteHeaders: document.querySelectorAll('.site-header').length,
        sectionSteps: document.querySelectorAll('.section-step').length,
        monograms: document.querySelectorAll('.technology-monogram').length,
      }));
      if (result.h1 !== 1) failures.push(`${viewport.name}: ${route} has ${result.h1} h1 elements`);
      if (result.overflow > 1) failures.push(`${viewport.name}: ${route} overflows horizontally by ${result.overflow}px`);
      if (result.missingImages.length) failures.push(`${viewport.name}: ${route} has missing images: ${result.missingImages.join(', ')}`);
      const expectedSiteHeaders = isHome ? 0 : 1;
      if (result.siteHeaders !== expectedSiteHeaders) failures.push(`${viewport.name}: ${route} renders ${result.siteHeaders} site headers instead of ${expectedSiteHeaders}`);
      const expectedSectionSteps = isHome ? 0 : 2;
      if (result.sectionSteps !== expectedSectionSteps) failures.push(`${viewport.name}: ${route} has ${result.sectionSteps} section navigation controls instead of ${expectedSectionSteps}`);
      // A technology without a logo file draws a typographic monogram; the
      // strict image check above still applies to every technology that has one.
      const expectedMonograms = route === '/tecnologias/' || route === '/en/technologies/'
        ? logolessTechnologies.length
        : route === '/tecnologias/claude-code/' ? 1 : null;
      if (expectedMonograms !== null && result.monograms !== expectedMonograms) failures.push(`${viewport.name}: ${route} draws ${result.monograms} monograms instead of ${expectedMonograms}`);
      result.links.forEach((link) => internalLinks.add(link));
      result.media.forEach((link) => internalLinks.add(link));
    }
    await context.close();
  }

  const request = await browser.newPage();
  for (const link of internalLinks) {
    if (link.startsWith('/downloads/')) continue;
    const response = await request.request.get(new URL(link, baseUrl).toString());
    if (!response.ok()) failures.push(`internal link ${link} returned ${response.status()}`);
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Audited ${sequences.es.length + sequences.en.length} sequence steps, ${railProbes.length} rail probes, ${routes.length} sampled routes at ${viewports.length} viewports and ${internalLinks.size} internal links.`);
}
