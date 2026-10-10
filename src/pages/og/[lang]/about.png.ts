import type { APIContext } from 'astro';
import { languages, ui, type Lang } from '../../../i18n/ui';
import { SITE } from '../../../config';
import { ogImage } from '../../../lib/og';

export function getStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

export function GET({ params }: APIContext) {
  const lang = params.lang as Lang;
  const png = ogImage({ title: ui[lang]['about.title'], subtitle: SITE.name[lang], rtl: lang === 'fa' });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
