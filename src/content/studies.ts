import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;

export const SITE_REPO = 'mh-honarvar.github.io';

export interface Study {
  title: L;
  description: L;
  lede: L;
  sections: { heading: L; body: Record<Lang, string[]> }[];
  further: { path: string; label: L }[];
}

const study: Study = {
  title: {
    fa: 'همین سایت، به‌عنوان یک پروژه‌ی عمومی',
    en: 'This site, as a public project',
  },
  description: {
    fa: 'شرح ساخت mh-honarvar.github.io: سایت استاتیک و دوزبانه‌ی محمد هنرور با Astro، نه نمونه‌کار مشتری. کار خصوصی این‌جا نمی‌آید.',
    en: 'How mh-honarvar.github.io is built: Mohammad Honarvar’s static bilingual site in Astro, not a client case study. Private work stays off the page.',
  },
  lede: {
    fa: 'این صفحه شرح خود سایت است، ریپازیتوری عمومی‌ای که همین صفحات از آن ساخته می‌شوند. مشتری‌ای در کار نیست و عددی برای جلوه‌فروشی اختراع نشده.',
    en: 'This page is about the site itself, the public repository these pages are built from. There is no client, and no number invented to make it sound larger.',
  },
  sections: [
    {
      heading: { fa: 'چه چیزی است', en: 'What it is' },
      body: {
        fa: [
          'ریپازیتوری mh-honarvar.github.io منبع همین دامنه است و روی GitHub Pages سرو می‌شود. ساخت با Astro است و خروجی‌اش فایل استاتیک است: هر زبان یک مسیر دارد، نوشته‌ها مارک‌داون هستند، و تصویری که برای اشتراک ساخته می‌شود موقع build در می‌آید.',
          'صفحه برای آزمایش ابزار عمومی است. در درباره‌ی سایت همین را گفته‌ام: کار مشتری این‌جا نمی‌آید. اگر در فهرست پروژه‌ها کارت خصوصی می‌بینی، فقط نام و بازه‌ی فعالیت است، چون توضیح و لینک پیش از رسیدن به قالب پاک شده‌اند.',
          'اگر همکاری مطرح باشد، [صفحه‌ی همکاری](/services/) جای این شرح است.',
        ],
        en: [
          'The repository mh-honarvar.github.io is the source of this domain, served on GitHub Pages. The build is Astro and the output is static files: each language has its own path, posts are markdown, and the image used for sharing is drawn at build time.',
          'The page is where I try tools in public. The about copy says the same thing: client work does not appear here. A private card on the project list is only a name and an activity window, because the description and the link are removed before the template sees them.',
          'If collaboration is the question, the [collaboration page](/services/) is separate from this write-up.',
        ],
      },
    },
    {
      heading: { fa: 'دو زبان، از طرح اول', en: 'Two languages, from the first layout' },
      body: {
        fa: [
          'فارسی زیر /fa/ است و انگلیسی زیر /en/. زبان سند fa-IR یا en-US است و جهت صفحه با همان انتخاب عوض می‌شود. فونت فارسی وزیرمتن است و انگلیسی Inter. تاریخ ماه‌ها در فارسی با تقویم خورشیدی قالب می‌شود.',
          'نوشته فقط وقتی به زبان دیگر لینک hreflang می‌دهد که فایلی با همان نام در پوشه‌ی دیگر باشد و آن فایل واقعاً ترجمه باشد. جفت ساختگی، با عوض کردن پیشوند زبان، ساخته نمی‌شود.',
        ],
        en: [
          'Persian lives under /fa/ and English under /en/. The document language is fa-IR or en-US, and direction changes with that choice. Persian is set in Vazirmatn and English in Inter. Month labels in Persian use the solar calendar.',
          'A post only advertises an hreflang twin when a file with the same slug exists in the other folder and that file is actually a translation. A fake pair, made by swapping the language prefix, is not generated.',
        ],
      },
    },
    {
      heading: { fa: 'صحنه کجا هست و کجا نیست', en: 'Where the scene is, and where it is not' },
      body: {
        fa: [
          'Three.js روی خانه‌ی سایت است، برای هیرو، و روی صفحه‌ی پروژه‌ها برای شهر کامیت‌ها، آن هم وقتی بوم به دید بیاید. نوشته، درباره، برچسب و صفحه‌ی همکاری این ماژول را نمی‌گیرند.',
          'معرفی اول خانه را می‌شود همان لحظه رد کرد. عنوان زیر لایه‌ی شفاف است و چند ثانیه پشت صفحه‌ی مات قفل نمی‌شود. اگر سیستم حرکت کم خواسته باشد، بوم اصلاً ساخته نمی‌شود.',
          'همان تصمیم در [صفحه‌ی استاتیک و صحنه](/blog/static-pages-and-webgl/) آمده است.',
        ],
        en: [
          'Three.js is on the home page for the hero, and on the projects page for the commit city, and only once that canvas is in view. Posts, about, tags, and the collaboration page do not load the module.',
          'The opening moment on the home page can be skipped immediately. The heading sits under a transparent layer instead of waiting behind a solid plate. If the system asks for less motion, the canvas is never created.',
          'That decision is written up in [the static page and the scene](/blog/static-pages-and-webgl/).',
        ],
      },
    },
  ],
  further: [
    { path: '/blog/persian-rtl-interface/', label: { fa: 'دو مسیر فارسی و انگلیسی', en: 'The two language routes' } },
    { path: '/about/', label: { fa: 'درباره', en: 'About' } },
  ],
};

export function studyFor(name: string): Study | undefined {
  return name.toLowerCase() === SITE_REPO ? study : undefined;
}
