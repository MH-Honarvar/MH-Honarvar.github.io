import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const tagsIn = (lang) => {
  const dir = join('src/content/blog', lang);
  const tags = new Set();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(join(dir, file), 'utf8');
    const block = raw.match(/^---\n([\s\S]*?)\n---/);
    const line = block?.[1].match(/^tags:\s*\[([^\]]*)\]/m);
    if (!line) continue;
    for (const tag of line[1].split(',')) {
      const name = tag.trim().replace(/^['"]|['"]$/g, '');
      if (name) tags.add(name);
    }
  }
  return tags;
};
const faTags = tagsIn('fa');
const enTags = tagsIn('en');

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
      serialize(item) {
        const path = new URL(item.url).pathname;
        const tag = path.match(/^\/(fa|en)\/blog\/tags\/([^/]+)\/$/)?.[2];
        if (tag) {
          const name = decodeURIComponent(tag);
          const both = faTags.has(name) && enTags.has(name);
          if (!both) return { ...item, links: undefined };
        }
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false },
  },
});
