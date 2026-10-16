import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;

export interface TopicArticle {
  slug: string;
  fallback: L;
}

export interface Topic {
  id: string;
  title: L;
  description: L;
  summary: L;
  lede: L;
  articles: TopicArticle[];
}

export const topicsIndex = {
  title: { fa: 'سه موضوع، جدا از وبلاگ', en: 'Three subjects, apart from the blog' },
  description: {
    fa: 'اینجا فقط سه موضوعی جمع شده که هر کدام چند یادداشت دارند: رابط فارسی، اندازه‌ی سطر، و صفحه‌ای که فایل اضافه نمی‌گیرد. ترتیب تاریخ مال وبلاگ است.',
    en: 'Three subjects are gathered here, each with several notes: the Persian interface, line measure, and a page with no extra file. The dated list stays on the blog.',
  },
  lede: {
    fa: 'وبلاگ همه‌ی یادداشت‌ها را به ترتیب تاریخ می‌چیند. این صفحه فقط سه موضوعی را جدا می‌کند که خودشان چند نوشته دارند: فارسی و راست‌به‌چپ، اندازه‌ی سطر، و صفحه‌ای که فایل اضافه نمی‌گیرد.',
    en: 'The blog lists every note by date. This page keeps only three subjects that already have more than one note: Persian and right-to-left, the measure of a line, and a page that does not take an extra file.',
  },
  aside: {
    fa: 'یک یادداشت درباره‌ی نویسنده و خود کار است و در این سه موضوع جا نمی‌گیرد.',
    en: 'One note is about the author and the work, and it does not fit these three topics.',
  },
  articles: [
    { slug: 'author-and-trust', fallback: { fa: 'نویسنده همان صفحه‌ی درباره است', en: 'The author is the about page' } },
  ],
};

export const topics: Topic[] = [
  {
    id: 'rtl',
    title: { fa: 'فارسی از همان طرح اول', en: 'Persian in the first layout' },
    description: {
      fa: 'مسیر فارسی جهت، رقم و فوکوس خودش را دارد. این یادداشت‌ها همان تصمیم را باز می‌کنند: راست‌به‌چپ از طرح اول، نه یک صفحه‌ی انگلیسی که فقط وارونه شده باشد.',
      en: 'The Persian route keeps its own direction, digits, and focus. These notes open that choice: right-to-left from the first layout, not a flipped English page.',
    },
    summary: {
      fa: 'مسیر جدا برای فارسی، جهت صفحه، رقم، و فوکوس.',
      en: 'A separate Persian route, direction, digits, and focus.',
    },
    lede: {
      fa: 'فارسی این سایت مسیر خودش را دارد، زیر /fa/، با جهت و قلم و تقویم جدا. جهت CSS یکی از آن تصمیم‌هاست؛ رقم، فوکوس، و اینکه ترجمه باید فایل دوم باشد هم همین موضوع‌اند. فهرست پایین همان یادداشت‌هاست، نه همه‌ی وبلاگ.',
      en: 'Persian on this site has its own route, under /fa/, with its own direction, typeface, and calendar. CSS direction is only one of those choices; digits, focus, and a translation that has to be a second file belong here too. The list below is those notes, not the whole blog.',
    },
    articles: [
      { slug: 'persian-rtl-interface', fallback: { fa: 'دو مسیر، نه یک صفحه‌ی وارونه', en: 'Two routes, not a flipped page' } },
      { slug: 'rtl', fallback: { fa: 'راست‌به‌چپ را از روز اول بگذار', en: 'Put right-to-left in on day one' } },
      { slug: 'persian-numerals-and-fonts', fallback: { fa: 'رقم فارسی یک ویژگی فونت نیست', en: 'Persian digits are not a font feature' } },
      { slug: 'why-css-direction-is-not-enough', fallback: { fa: 'جهت صفحه همه‌ی کار را نمی‌کند', en: 'Direction does not finish the page' } },
      { slug: 'separate-locale-routes', fallback: { fa: 'ترجمه یک فایل دوم است', en: 'The translation is a second file' } },
      { slug: 'focus-and-rtl', fallback: { fa: 'تمرکز از همان لبه‌ای شروع می‌شود که خواندن', en: 'Focus starts where the reading starts' } },
      { slug: 'two-language-urls', fallback: { fa: 'نشانی متعارف خود صفحه است', en: 'The canonical address is the page itself' } },
      { slug: 'topic-hubs', fallback: { fa: 'صفحه‌ی موضوع، فهرست وبلاگ نیست', en: 'A topic page is not the blog index' } },
      { slug: 'sharing-in-two-languages', fallback: { fa: 'لینکی که می‌فرستی یک زبان است', en: 'The link you send is one language' } },
    ],
  },
  {
    id: 'type',
    title: { fa: 'عرض سطر و فاصله‌ی حروف', en: 'Line measure and letter-space' },
    description: {
      fa: 'این یادداشت‌ها خود سطر را می‌سنجند: حروف چقدر از هم فاصله دارند، عرض سطر چقدر است، و حرکت صفحه کی به خواندن کمک می‌کند. جهت صفحه موضوع این فهرست نیست.',
      en: 'These notes measure the line: how far the letters sit, how wide the measure runs, and when motion helps reading. Page direction is not the subject of this list.',
    },
    summary: {
      fa: 'عرض سطر، فاصله‌ی حروف، و ضرب خواندن.',
      en: 'Line measure, the space between letters, and the rhythm of reading.',
    },
    lede: {
      fa: 'این یادداشت‌ها درباره‌ی خود سطر هستند: حروف چقدر از هم فاصله دارند، عرض سطر چقدر است، و حرکت صفحه کی به خواندن کمک می‌کند. راست‌به‌چپ و هزینه‌ی صحنه موضوع صفحه‌های دیگرند.',
      en: 'These notes are about the line itself: how far apart the letters sit, how wide the measure is, and when motion on the page helps reading. Right-to-left, and what a scene costs, live on other pages.',
    },
    articles: [
      { slug: 'type-and-space', fallback: { fa: 'حروف، فاصله، و حرکت صفحه', en: 'Type, space, and the motion of a page' } },
      { slug: 'reading-measure-and-rhythm', fallback: { fa: 'عرض سطر، و ضرب خواندن', en: 'The measure of a line' } },
      { slug: 'font-display-and-persian', fallback: { fa: 'تعویض قلم، و سطر فارسی', en: 'The face swaps. The line stays.' } },
      { slug: 'the-next-article', fallback: { fa: 'حداکثر سه نوشته با برچسب مشترک', en: 'Up to three notes that share a tag' } },
    ],
  },
  {
    id: 'speed',
    title: { fa: 'صفحه‌ای بدون فایل اضافه', en: 'A page without the extra file' },
    description: {
      fa: 'سرعت این‌جا یعنی ساخت استاتیک و نیاوردن کتابخانه‌ای که برای خواندن لازم نیست. صحنه فقط دو جا اجازه دارد و بقیه‌ی مسیرها فایل انیمیشن را دانلود نمی‌کنند.',
      en: 'Speed here means a static build, and leaving out a library the reader does not need. The scene is allowed in two places. Other routes never download that file.',
    },
    summary: {
      fa: 'صفحه‌ی استاتیک، و کی فایل انیمیشن اصلاً نمی‌آید.',
      en: 'A static page, and when the animation file never arrives.',
    },
    lede: {
      fa: 'صفحه‌ی سریع در این یادداشت‌ها یعنی ساخت استاتیک، و نیاوردن کتابخانه‌ای که خواننده برای خواندن لازم ندارد. صحنه فقط دو جا اجازه دارد. بقیه‌ی مسیرها آن فایل را دانلود نمی‌کنند.',
      en: 'A fast page, in these notes, means a static build, and not shipping a library the reader does not need in order to read. The scene is allowed in two places. Everywhere else that file is not downloaded.',
    },
    articles: [
      { slug: 'static-pages-and-webgl', fallback: { fa: 'صفحه‌ی استاتیک، و وقتی صحنه هزینه‌اش را درمی‌آورد', en: 'A static page, and when the scene earns its keep' } },
      { slug: 'when-to-skip-the-animation', fallback: { fa: 'کی انیمیشن را نمی‌آوریم', en: 'When the animation stays out' } },
      { slug: 'what-a-static-page-owes-the-reader', fallback: { fa: 'صفحه‌ی استاتیک به خواننده چه بدهکار است', en: 'What a static page owes the reader' } },
      { slug: 'hello-world', fallback: { fa: 'چرا این سایت را از نو ساختم', en: 'Why I rebuilt this site' } },
      { slug: 'first-screen', fallback: { fa: 'عنوان منتظر معرفی نمی‌ماند', en: 'The heading does not wait' } },
      { slug: 'visible-before-motion', fallback: { fa: 'حرف پیش از حرکت در سند است', en: 'The words are in the document first' } },
      { slug: 'the-html-map', fallback: { fa: 'نقشه‌ی HTML صفحه‌ای برای خواندن است', en: 'The HTML map is a page you can read' } },
    ],
  },
];

export function topicById(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}

/** True only when that language has a non-draft file. Topic links must not point at a missing note. */
export function articlePublished(lang: Lang, slug: string): boolean {
  const file = resolve(process.cwd(), 'src/content/blog', lang, `${slug}.md`);
  if (!existsSync(file)) return false;
  const raw = readFileSync(file, 'utf8');
  const end = raw.startsWith('---') ? raw.indexOf('\n---', 3) : -1;
  const front = end > 0 ? raw.slice(3, end) : '';
  return !/^draft:\s*true\s*$/m.test(front);
}

export function articleTitle(lang: Lang, article: TopicArticle): string {
  const file = resolve(process.cwd(), 'src/content/blog', lang, `${article.slug}.md`);
  if (!existsSync(file)) return article.fallback[lang];
  const raw = readFileSync(file, 'utf8');
  const end = raw.startsWith('---') ? raw.indexOf('\n---', 3) : -1;
  const front = end > 0 ? raw.slice(3, end) : '';
  const line = front.split('\n').find((row) => row.startsWith('title:'));
  if (!line) return article.fallback[lang];
  let value = line.slice('title:'.length).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
  return value || article.fallback[lang];
}
