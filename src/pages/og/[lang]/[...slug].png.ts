import type { APIContext } from 'astro';
import { languages, type Lang } from '../../../i18n/ui';
import { SITE } from '../../../config';
import { getPosts, postSlug, type Post } from '../../../lib/blog';
import { ogImage } from '../../../lib/og';

export async function getStaticPaths() {
  const paths = [];
  for (const lang of languages) for (const post of await getPosts(lang)) paths.push({ params: { lang, slug: postSlug(post) }, props: { post } });
  return paths;
}

export function GET({ params, props }: APIContext<{ post: Post }>) {
  const lang = params.lang as Lang;
  const png = ogImage({ title: props.post.data.title, subtitle: `${SITE.name[lang]} · mh-honarvar.github.io`, rtl: lang === 'fa' });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
