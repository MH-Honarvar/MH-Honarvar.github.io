import type { APIContext } from 'astro';
import { languages, type Lang } from '../../../i18n/ui';
import { SITE } from '../../../config';
import { getPosts, postSlug } from '../../../lib/blog';
import { ogImage } from '../../../lib/og';
import { getRepos } from '../../../lib/github';
import { SITE_REPO, studyFor } from '../../../content/studies';
import { publicCases } from '../../../content/cases';

type Card = { title: string; subtitle: string };

export async function getStaticPaths() {
  const paths: { params: { lang: Lang; slug: string }; props: Card }[] = [];
  const repos = await getRepos();
  const studyNames = repos.filter((repo) => !repo.private && studyFor(repo.name)).map((repo) => repo.name);
  if (!studyNames.length && studyFor(SITE_REPO)) studyNames.push(SITE_REPO);

  for (const lang of languages) {
    const seen = new Set<string>();
    for (const post of await getPosts(lang)) {
      const slug = postSlug(post);
      seen.add(slug);
      paths.push({
        params: { lang, slug },
        props: { title: post.data.title, subtitle: `${SITE.name[lang]} · mh-honarvar.github.io` },
      });
    }
    for (const name of studyNames) {
      const study = studyFor(name);
      const slug = `case/${name}`;
      if (!study || seen.has(slug)) continue;
      seen.add(slug);
      paths.push({
        params: { lang, slug },
        props: { title: study.title[lang], subtitle: `${SITE.name[lang]} · ${name}` },
      });
    }
    for (const item of publicCases) {
      const slug = `case/${item.slug}`;
      if (seen.has(slug)) continue;
      paths.push({
        params: { lang, slug },
        props: { title: item.title[lang], subtitle: SITE.name[lang] },
      });
    }
  }
  return paths;
}

export function GET({ params, props }: APIContext<Card>) {
  const lang = params.lang as Lang;
  const png = ogImage({ title: props.title, subtitle: props.subtitle, rtl: lang === 'fa' });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
