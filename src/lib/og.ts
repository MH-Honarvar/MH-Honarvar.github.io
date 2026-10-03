import { Resvg } from '@resvg/resvg-js';
import { resolve } from 'node:path';

const fontFile = resolve(process.cwd(), 'src/assets/fonts/Vazirmatn-Bold.ttf');
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function wrap(text: string, max: number) {
  const lines: string[] = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function ogImage({ title, subtitle, rtl }: { title: string; subtitle: string; rtl: boolean }) {
  const lines = wrap(title, 26);
  const x = rtl ? 1120 : 80;
  const anchor = rtl ? 'end' : 'start';
  const startY = 330 - (lines.length - 1) * 40;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="80%" cy="20%" r="60%"><stop offset="0" stop-color="#a855f7" stop-opacity=".55"/><stop offset="1" stop-color="#07060d" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="10%" cy="100%" r="55%"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="1" stop-color="#07060d" stop-opacity="0"/></radialGradient>
    <linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#07060d"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <circle cx="${rtl ? 140 : 1060}" cy="140" r="70" fill="none" stroke="url(#l)" stroke-width="6"/>
  ${lines.map((l, i) => `<text x="${x}" y="${startY + i * 80}" font-family="Vazirmatn" font-size="64" font-weight="700" fill="#ece9ff" text-anchor="${anchor}" direction="${rtl ? 'rtl' : 'ltr'}">${esc(l)}</text>`).join('\n  ')}
  <rect x="${rtl ? 1120 - 160 : 80}" y="${startY + lines.length * 80 - 20}" width="160" height="6" rx="3" fill="url(#l)"/>
  <text x="${x}" y="560" font-family="Vazirmatn" font-size="32" fill="#9a94bd" text-anchor="${anchor}" direction="${rtl ? 'rtl' : 'ltr'}">${esc(subtitle)}</text>
</svg>`;
  return new Resvg(svg, { font: { fontFiles: [fontFile], loadSystemFonts: false, defaultFontFamily: 'Vazirmatn' } }).render().asPng();
}
