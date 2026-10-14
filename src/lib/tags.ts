import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { other, type Lang } from '../i18n/ui';

/** Visible, multi-sentence intros. A tag without a unique one stays noindex. */
export const tagIntro: Record<string, string> = {
  'راست‌به‌چپ':
    'این برچسب نوشته‌هایی را جمع می‌کند که جهت راست‌به‌چپ را از طرح اول جدی می‌گیرند: جهت صفحه، ویژگی منطقی، و مسیری فارسی که آینه‌ی صفحه‌ی انگلیسی نیست. فهرست اصلی وبلاگ موضوع‌های دیگری هم دارد و این صفحه فقط همان نوشته‌ها را نشان می‌دهد که این برچسب را دارند.',
  rtl: 'These notes treat right-to-left as part of the layout from the first pass: page direction, logical properties, and a Persian route that is not a mirrored English page. The main blog lists other subjects as well, so this archive is only the writing that carries this tag.',
  تایپوگرافی:
    'اینجا موضوع خود حروف است: انتخاب فونت، وزن، فاصله، و چهره‌ای که با عوض شدن زبان عوض می‌شود. این صفحه جای فهرست کامل وبلاگ را نمی‌گیرد و فقط یادداشت‌هایی را می‌آورد که تایپ صفحه‌اند.',
  typography:
    'This archive stays with the letters themselves: font choice, weight, spacing, and a face that changes when the language changes. It is not a stand-in for the full blog, and a note belongs here only when type is the subject.',
  اعداد:
    'عدد فارسی و عدد لاتین در یک رابط دوزبانه یکی نیستند: شکل رقم، جداکننده‌ی هزارگان، و جایی که عدد در جمله‌ی راست‌به‌چپ می‌نشیند. این صفحه فقط نوشته‌هایی را فهرست می‌کند که همین مسئله را باز کرده‌اند.',
  numerals:
    'Persian and Latin digits do not behave the same inside one bilingual interface: the glyph, the thousands separator, and the way a number sits inside a right-to-left sentence. Only notes that actually open that problem are listed here.',
  فارسی:
    'فارسی اینجا یک رشته‌ی ترجمه‌شده در آخر کار نیست؛ خط، زبان صفحه، و رابطی است که از اول برای فارسی طراحی شده. این فهرست همان یادداشت‌ها را کنار هم می‌گذارد، نه هر نوشته‌ی سایت را.',
  persian:
    'Persian on this site is a writing system and a layout direction, not a string that was translated at the end. These notes stay with the language of the page, the line, and an interface designed for Persian first.',
  دوزبانه:
    'دوزبانه یعنی دو مسیر واقعی، نه یک صفحه که زبانش بعد از طرح عوض شده باشد. نوشته‌های این برچسب فارسی و انگلیسی را همزمان در طرح، آدرس و متن نگه می‌دارند.',
  bilingual:
    'Bilingual here means two real routes, not one page with the language swapped after the fact. The notes in this list keep Persian and English together in the layout, the URL, and the writing.',
  خواندن:
    'خواندن روی صفحه به طول سطر، کنتراست، و مدتی برمی‌گردد که چشم بدون خستگی پیش می‌رود. این برچسب فقط یادداشت‌هایی را جمع می‌کند که تجربه‌ی خواندن موضوعشان است.',
  reading:
    'Reading on a screen comes down to line length, contrast, and how long the eye can move without fatigue. This tag collects the notes that take that reading experience as the subject.',
  سرعت:
    'سرعت صفحه یعنی چه چیزی واقعاً به مرورگر می‌رسد: فایل از قبل ساخته‌شده، اسکریپت اضافه، و هزینه‌ای که یک افکت پیش از دیده شدن می‌تراشد. این فهرست فقط یادداشت‌های همین هزینه است.',
  performance:
    'Page speed is whatever actually reaches the browser: a static file, an extra script, and the cost an effect charges before anyone sees it. This list is only the notes about that cost.',
  حرکت:
    'حرکت در این سایت تزئین خاموش نیست؛ باید معنا داشته باشد و وقتی سیستم حرکت کمتر می‌خواهد کنار برود. این صفحه نوشته‌هایی را نشان می‌دهد که انیمیشن، انتقال، یا سکون صفحه را تصمیم طراحی گرفته‌اند.',
  motion:
    'Motion on this site has to mean something, and it has to step aside when the system asks for less movement. The notes here are the ones that treat animation, transition, and stillness as a design decision.',
  ایستا:
    'صفحه‌ی ایستا پیش از بازدید ساخته می‌شود و میزبان فایل می‌فرستد، نه اینکه برای هر درخواست قالب بزند. این برچسب یادداشت‌هایی را جمع می‌کند که درباره‌ی همان خروجی، میزبان فایل، و حد یک سایت بدون بک‌اند حرف می‌زنند.',
  static:
    'A static page is built ahead of the visit, so the host sends files instead of rendering a template each time. This archive gathers the notes about that output, the file host, and how far a site can go without a backend.',
};

/** Explicit fa/en tag pairs. Do not invent a twin by swapping the locale prefix. */
export const tagPairs: readonly { fa: string; en: string }[] = [
  { fa: 'راست‌به‌چپ', en: 'rtl' },
  { fa: 'تایپوگرافی', en: 'typography' },
  { fa: 'اعداد', en: 'numerals' },
  { fa: 'فارسی', en: 'persian' },
  { fa: 'دوزبانه', en: 'bilingual' },
  { fa: 'خواندن', en: 'reading' },
  { fa: 'سرعت', en: 'performance' },
  { fa: 'حرکت', en: 'motion' },
  { fa: 'ایستا', en: 'static' },
];

export const pairedTag = (lang: Lang, tag: string) => tagPairs.find((pair) => pair[lang] === tag)?.[other(lang)];

interface PostMeta {
  slug: string;
  tags: string[];
  date?: string;
  updated?: string;
}

const sentences = (text: string) => text.split(/[.!?؟]+/).map((s) => s.trim()).filter((s) => s.length > 12);

function unquote(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function tagsOf(fm: string): string[] {
  const inline = fm.match(/^tags:\s*\[([^\]]*)\]/m);
  if (inline) return inline[1].split(',').map(unquote).filter(Boolean);
  const block = fm.match(/^tags:\s*\n((?:[ \t]*-[ \t]*[^\n]+\n?)*)/m);
  if (!block?.[1]) return [];
  return block[1]
    .split('\n')
    .map((line) => line.match(/^[ \t]*-[ \t]*(.*)$/)?.[1] ?? '')
    .map(unquote)
    .filter(Boolean);
}

function fieldDate(fm: string, key: string): string | undefined {
  const match = fm.match(new RegExp(`^${key}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm'));
  if (!match) return undefined;
  const [year, month, day] = match[1].split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return undefined;
  return match[1];
}

/** Re-read on each call so posts added during dev stay in the subset check. */
function postsOf(lang: Lang): PostMeta[] {
  return readLang(join(process.cwd(), 'src/content/blog', lang));
}

function readLang(dir: string, prefix = ''): PostMeta[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: PostMeta[] = [];
  for (const file of entries) {
    if (file.name.startsWith('.')) continue;
    const rel = prefix ? `${prefix}/${file.name}` : file.name;
    if (file.isDirectory()) {
      out.push(...readLang(join(dir, file.name), rel));
      continue;
    }
    if (!file.name.endsWith('.md')) continue;
    const raw = readFileSync(join(dir, file.name), 'utf8');
    const block = raw.match(/^---\n([\s\S]*?)\n---/);
    const fm = block?.[1] ?? '';
    if (/^draft:\s*true\s*$/m.test(fm)) continue;
    out.push({
      slug: rel.replace(/\.md$/, ''),
      tags: tagsOf(fm),
      date: fieldDate(fm, 'date'),
      updated: fieldDate(fm, 'updated'),
    });
  }
  return out;
}

function introOk(tag: string): boolean {
  const intro = tagIntro[tag]?.trim();
  if (!intro || sentences(intro).length < 2) return false;
  return Object.values(tagIntro).filter((text) => text.trim() === intro).length === 1;
}

/** Indexable only with a unique multi-sentence intro and a proper subset of that language's blog. */
export function tagIndexable(lang: Lang, tag: string): boolean {
  if (!introOk(tag) || !tagPairs.some((pair) => pair[lang] === tag)) return false;
  const all = postsOf(lang);
  const mine = all.filter((post) => post.tags.includes(tag));
  return mine.length >= 2 && mine.length < all.length;
}

/** Sitemap lastmod for one post: updated when the frontmatter has it, otherwise the publish date. */
export function postLastmod(lang: string, slug: string): string | undefined {
  if (lang !== 'fa' && lang !== 'en') return undefined;
  const post = postsOf(lang).find((item) => item.slug === slug);
  return post?.updated ?? post?.date;
}
