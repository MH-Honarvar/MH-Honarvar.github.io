import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { languages, t, type Lang } from '../../i18n/ui';
import { SITE } from '../../config';
import { getPosts, postUrl } from '../../lib/blog';

export const getStaticPaths = () => languages.map((lang) => ({ params: { lang } }));

export async function GET({ params, site }: APIContext) {
  const lang = params.lang as Lang;
  const posts = await getPosts(lang);
  return rss({
    title: `${SITE.name[lang]} — ${t(lang)('blog.title')}`,
    description: t(lang)('blog.lede'),
    site: site!,
    customData: `<language>${lang}</language>`,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: postUrl(p),
      categories: p.data.tags,
    })),
  });
}
