import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mh-honarvar.github.io',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname === '/') return false;
        if (pathname.startsWith('/og/')) return false;
        if (pathname.endsWith('/rss.xml')) return false;
        return true;
      },
      i18n: {
        defaultLocale: 'fa',
        locales: { fa: 'fa-IR', en: 'en-US' },
      },
    }),
  ],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
});
