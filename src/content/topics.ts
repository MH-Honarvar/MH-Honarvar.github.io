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
  title: { fa: 'موضوع‌ها', en: 'Topics' },
  description: {
    fa: 'سه موضوع عمومی این سایت: رابط فارسی و راست‌به‌چپ، تایپ و فاصله، و صفحه‌ی سریع. هر کدام چند یادداشت را کنار هم می‌گذارد و فهرست کامل وبلاگ نیست.',
    en: 'Three public topics on this site: Persian and right-to-left, type and measure, and a fast page. Each gathers a few notes. It is not the full blog.',
  },
  lede: {
    fa: 'وبلاگ همه‌ی یادداشت‌ها را به ترتیب تاریخ می‌چیند. این صفحه فقط سه موضوعی را جدا می‌کند که خودشان چند نوشته دارند: فارسی و راست‌به‌چپ، اندازه‌ی سطر، و صفحه‌ای که فایل اضافه نمی‌گیرد.',
    en: 'The blog lists every note by date. This page keeps only three subjects that already have more than one note: Persian and right-to-left, the measure of a line, and a page that does not take an extra file.',
  },
};

export const topics: Topic[] = [
  {
    id: 'rtl',
    title: { fa: 'رابط فارسی و راست‌به‌چپ', en: 'Persian and RTL' },
    description: {
      fa: 'یادداشت‌های محمد هنرور درباره‌ی مسیر جدا برای فارسی، جهت صفحه، رقم، و فوکوس. راست‌به‌چپ از همان طرح اول است، نه ورقه‌ی انگلیسی که فقط وارونه شده باشد.',
      en: 'Notes by Mohammad Honarvar on a separate Persian route, page direction, digits, and focus. Right-to-left is in the first layout, not a flipped English page.',
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
    ],
  },
  {
    id: 'type',
    title: { fa: 'تایپ و فاصله', en: 'Type and measure' },
    description: {
      fa: 'یادداشت‌های محمد هنرور درباره‌ی عرض سطر، فاصله‌ی حروف، و ضرب خواندن در یک صفحه‌ی دوزبانه. حرکت فقط جایی می‌آید که سطر را برای خواندن قطع نکند.',
      en: 'Notes by Mohammad Honarvar on line measure, the space between letters, and the rhythm of reading. Motion appears only where it does not interrupt the line.',
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
    ],
  },
  {
    id: 'speed',
    title: { fa: 'صفحه‌ی سریع', en: 'A fast page' },
    description: {
      fa: 'یادداشت‌های محمد هنرور درباره‌ی صفحه‌ی استاتیک، جایی که صحنه مجاز است، و کی انیمیشن دانلود نمی‌شود. سرعت این‌جا یعنی فایل اضافه به صفحه نرسد.',
      en: 'Notes by Mohammad Honarvar on a static page, where a scene is allowed, and when animation is never downloaded. The extra file does not arrive.',
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
      { slug: 'hello-world', fallback: { fa: 'سلام دنیا؛ چرا این سایت را از نو ساختم', en: 'Hello world — why I rebuilt this site' } },
      { slug: 'first-screen', fallback: { fa: 'عنوان منتظر معرفی نمی‌ماند', en: 'The heading does not wait' } },
    ],
  },
];

export function topicById(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
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
