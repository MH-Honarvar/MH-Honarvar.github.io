import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { other, tagPairs, type Lang } from '../i18n/ui';

/** Visible, multi-sentence intros. A tag without one stays noindex. */
export const tagIntro: Record<string, string> = {
  'راست‌به‌چپ':
    'این فهرست فقط دو نوشته است: یادداشت کوتاه راست‌به‌چپ، و مقاله‌ی بلندتر درباره‌ی مسیر فارسی همین سایت. فهرست اصلی وبلاگ بلندتر است و همین‌ها همه‌ی آن نیستند.',
  rtl: 'Two notes live here: the short right-to-left note, and the longer piece on how Persian is routed on this site. The blog index is a longer list than this one.',
  تایپوگرافی:
    'این دو نوشته به حروف همین سایت برمی‌گردند: وزن، فاصله، و فونتی که با زبان عوض می‌شود. یادداشتی که فقط مسیر زبان است، یا صحنه‌ی سه‌بعدی، در این فهرست نیست.',
  typography:
    'These two notes stay with the letters on this site: weight, spacing, and a font that follows the language. A note that is only about routes, or about the 3D scene, is not in this list.',
};

interface PostMeta {
  slug: string;
  tags: string[];
  draft: boolean;
}

let cache: Record<Lang, PostMeta[]> | undefined;

function postsOf(lang: Lang): PostMeta[] {
  if (!cache) cache = { fa: readLang('fa'), en: readLang('en') };
  return cache[lang];
}

function readLang(lang: Lang): PostMeta[] {
  const dir = join(process.cwd(), 'src/content/blog', lang);
  const out: PostMeta[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(join(dir, file), 'utf8');
    const block = raw.match(/^---\n([\s\S]*?)\n---/);
    const fm = block?.[1] ?? '';
    if (/^draft:\s*true\s*$/m.test(fm)) continue;
    const line = fm.match(/^tags:\s*\[([^\]]*)\]/m);
    const tags = line
      ? line[1]
          .split(',')
          .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      : [];
    out.push({ slug: file.replace(/\.md$/, ''), tags, draft: false });
  }
  return out;
}

const sentences = (text: string) => text.split(/[.!?؟]+/).map((s) => s.trim()).filter((s) => s.length > 12);

/** Indexable only with a unique multi-sentence intro and a real subset of the blog. */
export function tagIndexable(lang: Lang, tag: string): boolean {
  const intro = tagIntro[tag];
  if (!intro || sentences(intro).length < 2) return false;
  const pair = tagPairs.find((p) => p[lang] === tag);
  if (!pair) return false;
  const all = postsOf(lang);
  const mine = all.filter((p) => p.tags.includes(tag));
  if (mine.length < 2 || mine.length >= all.length) return false;
  const twin = pair[other(lang)];
  const otherPosts = postsOf(other(lang));
  const twinPosts = otherPosts.filter((p) => p.tags.includes(twin));
  if (twinPosts.length < 2 || twinPosts.length >= otherPosts.length) return false;
  return true;
}
