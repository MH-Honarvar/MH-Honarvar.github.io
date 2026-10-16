import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;

export const story: L = {
  fa: 'صفحه برای من از حسِ لحظه‌ی ورود شروع می‌شود: حروف، فاصله، و مسیری که چشم طی می‌کند. صفحه‌ی فرود بازاریابی و محصول می‌سازم، و رابط دور همان صفحه. اگر فارسی و راست‌به‌چپ در همان طرح اول نباشد، بعداً وصله می‌شود و وصله دیده می‌شود. کار مشتری خصوصی می‌ماند. این سایت سمت عمومی است.',
  en: 'A page, for me, starts with how it feels the first time someone lands: the type, the space, and the path the eye takes. I build marketing and product landing pages, and the interface around them. If Persian and right-to-left are not in that first layout, they get patched in later, and the patch shows. Client work stays private. This site is the public side.',
};

export const values: { icon: string; title: L; body: L }[] = [
  {
    icon: 'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z',
    title: { fa: 'جزئیات مهم‌اند', en: 'Details matter' },
    body: { fa: 'فاصله‌ی یک پیکسل، وزن یک فونت، زمان یک انیمیشن؛ همین‌ها حس کار را می‌سازند.', en: 'A pixel of spacing, a font weight, an animation curve — these are what make a thing feel right.' },
  },
  {
    icon: 'M13 2L4 14h7l-1 8 9-12h-7z',
    title: { fa: 'سریع و سبک', en: 'Fast and light' },
    body: { fa: 'زیبایی نباید کندی بیاورد. اول کارایی، بعد افکت.', en: "Beauty shouldn't cost speed. Performance first, effects second." },
  },
  {
    icon: 'M4 6h16M4 12h10M4 18h16M18 9l3 3-3 3',
    title: { fa: 'دو زبانه از پایه', en: 'Bilingual by design' },
    body: { fa: 'راست‌به‌چپ یک وصله نیست؛ از روز اول در طراحی است.', en: 'Right-to-left is not a patch; it is part of the design from day one.' },
  },
  {
    icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 12l2 2 4-4',
    title: { fa: 'صادق و ساده', en: 'Honest and simple' },
    body: { fa: 'کد خوانا، نوشته‌ی روشن و قول‌هایی که عملی‌اند.', en: 'Readable code, clear writing and promises that are actually kept.' },
  },
];

export const toolbox: { name: string; icon: string }[] = [
  { name: 'HTML / CSS', icon: 'M4 3l1.5 16L12 21l6.5-2L20 3zM8 8h8l-.5 5-3.5 1-3.5-1' },
  { name: 'TypeScript', icon: 'M3 3h18v18H3zM8 11h6M11 11v7M19 12a2 2 0 0 0-4 0c0 2 4 1 4 3.5a2 2 0 0 1-4 .5' },
  { name: 'Astro', icon: 'M9 17c-1 2 0 4 3 4s4-2 3-4M7 15l5-12 5 12c-3-1-7-1-10 0z' },
  { name: 'Three.js / GLSL', icon: 'M12 2l9 5v10l-9 5-9-5V7zM12 22V12M21 7l-9 5-9-5' },
  { name: 'GSAP / Motion', icon: 'M3 17c4 0 4-10 9-10s5 10 9 10' },
  { name: 'Figma / UI', icon: 'M9 3h6a3 3 0 0 1 0 6H9a3 3 0 0 1 0-6zM9 9h6a3 3 0 1 1 0 6H9M9 15a3 3 0 1 0 3 3v-9' },
];

/** Public facts only: this site's repo (2025), bilingual pages (2026). */
export const timeline: { year: L; text: L }[] = [
  {
    year: { fa: '۱۴۰۴', en: '2025' },
    text: {
      fa: 'ریپازیتوری عمومی همین سایت شروع شد.',
      en: 'The public repository for this site started.',
    },
  },
  {
    year: { fa: '۱۴۰۵', en: '2026' },
    text: {
      fa: 'چیدمان دوزبانه است: فارسی و انگلیسی، با وبلاگ روی همین سایت.',
      en: 'The layout is bilingual, Persian and English, with the blog on this site.',
    },
  },
];

export const colophonLink: L = {
  fa: 'شناسنامه‌ی ساخت سایت',
  en: 'Colophon',
};

export const areas: { heading: L; same: L; writes: L } = {
  heading: { fa: 'حوزه‌های کار', en: 'Areas of work' },
  same: { fa: 'همان شخص در', en: 'the same person on' },
  writes: {
    fa: 'این موضوع‌ها را علنی می‌نویسد: رابط فارسی از طرح اول، حروف و فاصله، و صفحه‌ای که زود باز شود. پیام در',
    en: 'writes about these in public: a Persian interface from the first layout, type and space, and a page that opens quickly. A message goes to',
  },
};

export const faq: { q: L; a: L }[] = [
  {
    q: { fa: 'پروژه‌ی سفارشی هم قبول می‌کنی؟', en: 'Do you take on custom projects?' },
    a: { fa: 'بله، اگر وقت و موضوع جور باشد. در تلگرام بنویس چه در ذهن داری.', en: 'Yes, when the timing and subject fit. Tell me on Telegram what you have in mind.' },
  },
  {
    q: { fa: 'چرا بعضی پروژه‌ها خصوصی‌اند؟', en: 'Why are some projects private?' },
    a: { fa: 'کار مشتری و چیزی که هنوز آماده نیست روی این سایت نمی‌آید.', en: 'Client work, and anything that is not ready, does not appear on this site.' },
  },
  {
    q: { fa: 'این سایت با چه ساخته شده؟', en: 'What is this site built with?' },
    a: { fa: 'Astro، TypeScript و Three.js؛ کاملاً ایستا و روی GitHub Pages.', en: 'Astro, TypeScript and Three.js — fully static, on GitHub Pages.' },
  },
  {
    q: { fa: 'سریع‌ترین راه تماس؟', en: 'Fastest way to reach you?' },
    a: { fa: 'تلگرام. معمولاً همان روز جواب می‌دهم.', en: 'Telegram. I usually reply the same day.' },
  },
];
