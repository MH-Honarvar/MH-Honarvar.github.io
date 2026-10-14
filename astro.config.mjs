import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { other, pairedTag } from './src/i18n/ui.ts';
import { studyFor } from './src/content/studies.ts';
import { tagIndexable } from './src/lib/tags.ts';

const originOf = (url) => new URL(url).origin;

export default defineConfig({
  site: 'https://mh-honarvar.github.io',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = decodeURIComponent(new URL(page).pathname);
        if (path === '/') return false;
        if (path.startsWith('/og/')) return false;
        if (path.endsWith('/rss.xml')) return false;
        const tag = path.match(/^\/(fa|en)\/blog\/tags\/([^/]+)\/$/);
        if (tag && !tagIndexable(tag[1], tag[2])) return false;
        const project = path.match(/^\/(fa|en)\/projects\/([^/]+)\/$/);
        if (project && project[2] !== 'karkia' && !studyFor(project[2])) return false;
        return true;
      },
      i18n: {
        defaultLocale: 'fa',
        locales: { fa: 'fa-IR', en: 'en-US' },
      },
      serialize(item) {
        const path = decodeURIComponent(new URL(item.url).pathname);
        const tag = path.match(/^\/(fa|en)\/blog\/tags\/([^/]+)\/$/);
        if (tag) {
          const lang = tag[1];
          const name = tag[2];
          const twin = pairedTag(lang, name);
          if (!twin || !tagIndexable(lang, name) || !tagIndexable(other(lang), twin)) return { ...item, links: undefined };
          const faName = lang === 'fa' ? name : twin;
          const enName = lang === 'en' ? name : twin;
          const origin = originOf(item.url);
          const faUrl = new URL(`/fa/blog/tags/${encodeURIComponent(faName)}/`, origin).href;
          const enUrl = new URL(`/en/blog/tags/${encodeURIComponent(enName)}/`, origin).href;
          return {
            ...item,
            links: [
              { lang: 'fa-IR', url: faUrl },
              { lang: 'en-US', url: enUrl },
              { lang: 'x-default', url: faUrl },
            ],
          };
        }
        if (!item.links?.length) return item;
        const fa = item.links.find((link) => link.lang === 'fa-IR');
        const en = item.links.find((link) => link.lang === 'en-US');
        if (!fa || !en) return { ...item, links: undefined };
        if (item.links.some((link) => link.lang === 'x-default')) return item;
        return { ...item, links: [...item.links, { lang: 'x-default', url: fa.url }] };
      },
    }),
  ],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
});
