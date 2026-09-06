// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://camir.tech';

/**
 * Spanish is canonical at `/`; English mirrors it under `/en/` with translated
 * first segments and identical slugs below them.
 */
/** @type {Record<string, string>} */
const spanishToEnglish = {
  proyectos: 'projects',
  tecnologias: 'technologies',
  'sobre-mi': 'about',
};
/** @type {Record<string, string>} */
const englishToSpanish = Object.fromEntries(
  Object.entries(spanishToEnglish).map(([es, en]) => [en, es]),
);

/**
 * Returns the translated path for a route, or `undefined` when it has no pair.
 *
 * `@astrojs/sitemap`'s own `i18n` pairing cannot do this: it strips the locale
 * prefix and matches on the remainder, so `/proyectos/portal/` never lines up
 * with `/en/projects/portal/` and only the two home pages get annotated.
 *
 * @param {string} pathname
 * @returns {string | undefined}
 */
function alternatePath(pathname) {
  if (pathname.startsWith('/en/')) {
    const rest = pathname.slice('/en'.length);
    if (rest === '/') return '/';
    const [, head, ...tail] = rest.split('/');
    return englishToSpanish[head] ? ['', englishToSpanish[head], ...tail].join('/') : undefined;
  }
  if (pathname === '/') return '/en/';
  const [, head, ...tail] = pathname.split('/');
  return spanishToEnglish[head] ? ['/en', spanishToEnglish[head], ...tail].join('/') : undefined;
}

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  // `prefetch` is deliberately unset. ClientRouter already calls the prefetch
  // runtime with `prefetchAll: true` and the default `hover` strategy; setting
  // it here would only inject a second, redundant init script on every page.
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
      serialize(item) {
        const { pathname } = new URL(item.url);
        const alternate = alternatePath(pathname);
        if (!alternate) return item;
        const isEnglish = pathname.startsWith('/en/');
        const spanish = new URL(isEnglish ? alternate : pathname, site).toString();
        const english = new URL(isEnglish ? pathname : alternate, site).toString();
        return {
          ...item,
          links: [
            { lang: 'es', url: spanish },
            { lang: 'en', url: english },
            { lang: 'x-default', url: spanish },
          ],
        };
      },
      // The site publishes no news, image, or video entries; declaring those
      // namespaces on every urlset is dead weight.
      namespaces: { xhtml: true, news: false, image: false, video: false },
    }),
  ],
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
