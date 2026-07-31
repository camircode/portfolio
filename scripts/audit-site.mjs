import { chromium } from 'playwright';
import { readFile, readdir } from 'node:fs/promises';

const baseUrl = process.env.AUDIT_BASE_URL ?? 'http://localhost:4321';
const routes = ['/', '/en/', '/proyectos/', '/en/projects/', '/tecnologias/', '/en/technologies/', '/proyectos/2free/', '/proyectos/portal/', '/proyectos/portal/asistencia/', '/en/projects/portal/asistencia/', '/tecnologias/astro/', '/en/technologies/astro/', '/sobre-mi/'];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];
const failures = [];
const internalLinks = new Set();
const sourceRoot = new URL('../src/', import.meta.url);
const sourceEntries = await readdir(sourceRoot, { recursive: true });
const voseoPattern = /(?<![\p{L}\p{M}])(?:vos|sos|tenés|podés|querés|sabés|hacés|venís|decís|sentís|elegís|tocá|activá|explorá|descargá|conocé|mirá|visitá|volvé|revisá|usá|contactá|seleccioná|encendé|apagá|mantené|probá|iniciá|cambiá|navegá|completá|conectá|creá|diseñá|desplegá|leé|andá|elegí\s+cómo|abrí\s+cada)(?![\p{L}\p{M}])/giu;

async function verifyModuleArtifacts(page, expected, label) {
  const ready = await page.waitForFunction((count) => {
    const artifacts = [...document.querySelectorAll('[data-module-artifact]')];
    return artifacts.length === count && artifacts.every((artifact) => artifact.querySelector('[data-three-ready="true"]'));
  }, expected, { timeout: 5000 }).then(() => true).catch(() => false);
  if (!ready) {
    failures.push(`${label}: ${expected} module artifacts did not initialize`);
    return;
  }
  const invalidCanvases = await page.locator('[data-module-artifact-canvas]').evaluateAll((canvases) => canvases.filter((canvas) => canvas.width <= 2 || canvas.height <= 2).length);
  if (invalidCanvases > 0) failures.push(`${label}: ${invalidCanvases} module artifacts have an invalid canvas size`);
}

for (const entry of sourceEntries.filter((path) => /\.(?:astro|ts|tsx|js|mjs)$/.test(path))) {
  const source = await readFile(new URL(entry, sourceRoot), 'utf8');
  const matches = [...new Set(source.match(voseoPattern) ?? [])];
  if (matches.length) failures.push(`neutral Spanish: ${entry} contains voseo: ${matches.join(', ')}`);
}

const browser = await chromium.launch({ headless: true });

try {
  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: viewports[1] });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(new URL('/', baseUrl).toString(), { waitUntil: 'load' });
  const bootDisplay = await noJsPage.locator('.boot-screen').evaluate((element) => getComputedStyle(element).display);
  if (bootDisplay !== 'none') failures.push(`no-js: boot screen is ${bootDisplay} instead of hidden`);
  if (!(await noJsPage.locator('h1').isVisible())) failures.push('no-js: primary content is not visible');
  await noJsPage.goto(new URL('/proyectos/portal/', baseUrl).toString(), { waitUntil: 'load' });
  if (!(await noJsPage.locator('h1').isVisible())) failures.push('no-js: internal project content is not visible');
  const fallbackOpacity = await noJsPage.locator('.module-artifact-fallback').first().evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
  if (fallbackOpacity < 0.99) failures.push(`no-js: module artifact fallback opacity is ${fallbackOpacity}`);
  await noJsContext.close();

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
  if ((await interactionPage.locator('.contact-actions a[href="https://github.com/camircode"] img').count()) !== 1) failures.push('home: GitHub contact or icon is missing');
  if ((await interactionPage.locator('.contact-actions a[href="https://www.linkedin.com/in/camircode/"] img').count()) !== 1) failures.push('home: LinkedIn contact or icon is missing');
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
  if ((await interactionPage.locator('.about-actions a[href="https://github.com/camircode"] img').count()) !== 1) failures.push('about: GitHub contact or icon is missing');
  if ((await interactionPage.locator('.about-actions a[href="https://www.linkedin.com/in/camircode/"] img').count()) !== 1) failures.push('about: LinkedIn contact or icon is missing');
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/') failures.push('navigation: About previous section must be Home');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/proyectos/') failures.push('navigation: About next section must be Projects');
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
  await interactionPage.goto(new URL('/proyectos/', baseUrl).toString(), { waitUntil: 'networkidle' });
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/sobre-mi/') failures.push('navigation: Projects previous section must be About');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/proyectos/portal/') failures.push('navigation: Projects next page must be Portal');
  await interactionPage.locator('a[href="/proyectos/portal/"]').first().click();
  await interactionPage.waitForURL(new URL('/proyectos/portal/', baseUrl).toString());
  await verifyModuleArtifacts(interactionPage, 10, 'Portal');
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/proyectos/') failures.push('navigation: Portal previous page must be Projects');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/proyectos/portal/asistencia/') failures.push('navigation: Portal next page must be Attendance');
  await interactionPage.goto(new URL('/proyectos/portal/infraestructura-ha/', baseUrl).toString(), { waitUntil: 'networkidle' });
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/proyectos/portal/notificaciones/') failures.push('navigation: final Portal module previous page must be Notifications');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/proyectos/2free/') failures.push('navigation: final Portal module next page must be 2 Free');
  await interactionPage.locator('.section-step--next').click();
  await interactionPage.waitForURL(new URL('/proyectos/2free/', baseUrl).toString());
  await verifyModuleArtifacts(interactionPage, 6, '2 Free');
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/proyectos/portal/infraestructura-ha/') failures.push('navigation: 2 Free previous page must be the final Portal module');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/proyectos/2free/web/') failures.push('navigation: 2 Free next page must be Web application');
  await interactionPage.goto(new URL('/proyectos/2free/arquitectura/', baseUrl).toString(), { waitUntil: 'networkidle' });
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/proyectos/2free/api/') failures.push('navigation: final 2 Free module previous page must be API');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/tecnologias/') failures.push('navigation: final 2 Free module next page must be Technologies');
  await interactionPage.locator('.section-step--next').click();
  await interactionPage.waitForURL(new URL('/tecnologias/', baseUrl).toString());
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/proyectos/2free/arquitectura/') failures.push('navigation: Technologies previous page must be the final 2 Free module');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/tecnologias/html/') failures.push('navigation: Technologies next page must be HTML');
  const introOpacity = await interactionPage.locator('.page-intro').evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
  if (introOpacity < 0.99) failures.push(`navigation: destination intro opacity is ${introOpacity} after client navigation`);
  const transitionAnimations = await interactionPage.evaluate(() => document.getAnimations().filter((animation) => /view-transition|astroFade/.test(animation.animationName)).length);
  if (transitionAnimations === 0) failures.push('navigation: client route changed without a visible View Transition animation');
  await interactionPage.waitForTimeout(350);
  const runningTransitionAnimations = await interactionPage.evaluate(() => document.getAnimations().filter((animation) => /view-transition|astroFade/.test(animation.animationName) && animation.playState === 'running').length);
  if (runningTransitionAnimations > 0) failures.push(`navigation: ${runningTransitionAnimations} View Transition animations still run after 350ms`);
  await interactionPage.goto(new URL('/tecnologias/html/', baseUrl).toString(), { waitUntil: 'networkidle' });
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/tecnologias/') failures.push('navigation: HTML previous page must be Technologies');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/tecnologias/css/') failures.push('navigation: HTML next page must be CSS');
  await interactionPage.goto(new URL('/tecnologias/pnpm/', baseUrl).toString(), { waitUntil: 'networkidle' });
  if ((await interactionPage.locator('.section-step--previous').getAttribute('href')) !== '/tecnologias/git/') failures.push('navigation: final technology previous page must follow the visible technology order');
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/') failures.push('navigation: final technology next page must wrap to Home');
  await interactionPage.goto(new URL('/en/projects/2free/arquitectura/', baseUrl).toString(), { waitUntil: 'networkidle' });
  if ((await interactionPage.locator('.section-step--next').getAttribute('href')) !== '/en/technologies/') failures.push('navigation: English project sequence must stay localized');
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
  const leadingTechnologies = await revealPage.locator('.technology-card').evaluateAll((cards) => cards.slice(0, 4).map((card) => {
    return { title: card.querySelector('h2')?.textContent?.trim(), x: card.offsetLeft, y: card.offsetTop, width: card.offsetWidth, background: getComputedStyle(card).backgroundColor };
  }));
  if (leadingTechnologies.slice(0, 2).map((card) => card.title).join(',') !== 'HTML,CSS') failures.push(`technologies: unexpected leading order ${leadingTechnologies.map((card) => card.title).join(', ')}`);
  if (Math.abs(leadingTechnologies[0].width - leadingTechnologies[1].width) > 1) failures.push('technologies: desktop columns are not equal widths');
  if (Math.abs(leadingTechnologies[0].x - leadingTechnologies[2].x) > 1 || Math.abs(leadingTechnologies[1].x - leadingTechnologies[3].x) > 1) failures.push('technologies: Supabase and Flutter are not placed below Astro and Preact respectively');
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

  const themeValues = [];
  for (const colorScheme of ['dark', 'light']) {
    const themeContext = await browser.newContext({ colorScheme, viewport: viewports[0] });
    const themePage = await themeContext.newPage();
    await themePage.goto(new URL('/tecnologias/', baseUrl).toString(), { waitUntil: 'networkidle' });
    themeValues.push(await themePage.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--rack-black').trim()));
    await themeContext.close();
  }
  if (themeValues[0] !== '#080909' || themeValues[1] !== '#080909') failures.push(`theme: expected one dark palette, received ${themeValues.join(' and ')}`);

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error') failures.push(`${viewport.name}: console error: ${message.text()}`);
    });
    page.on('pageerror', (error) => failures.push(`${viewport.name}: page error: ${error.message}`));

    for (const route of routes) {
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
      }));
      if (result.h1 !== 1) failures.push(`${viewport.name}: ${route} has ${result.h1} h1 elements`);
      if (result.overflow > 1) failures.push(`${viewport.name}: ${route} overflows horizontally by ${result.overflow}px`);
      if (result.missingImages.length) failures.push(`${viewport.name}: ${route} has missing images: ${result.missingImages.join(', ')}`);
      if (result.siteHeaders !== 0) failures.push(`${viewport.name}: ${route} still renders a site header`);
      const expectedSectionSteps = route === '/' || route === '/en/' ? 0 : 2;
      if (result.sectionSteps !== expectedSectionSteps) failures.push(`${viewport.name}: ${route} has ${result.sectionSteps} section navigation controls instead of ${expectedSectionSteps}`);
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
  console.log(`Audited ${routes.length} routes at ${viewports.length} viewports and ${internalLinks.size} internal links.`);
}
