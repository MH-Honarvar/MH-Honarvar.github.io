import { SITE } from '../../config';
import { ui } from '../../i18n/ui';
import { ogImage } from '../../lib/og';

export function GET() {
  const png = ogImage({ title: ui.en['hero.title'], subtitle: `${SITE.name.en} · ${SITE.name.fa}`, rtl: false });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
