import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;

export const colophonPage: {
  title: L;
  description: L;
  h1: L;
  lede: L;
  sections: { heading: L; body: Record<Lang, string[]> }[];
  linksHeading: L;
  links: { path: string; label: L }[];
} = {
  title: { fa: 'شناسنامه‌ی سایت', en: 'Colophon' },
  description: {
    fa: 'شناسنامه‌ی سایت محمد هنرور: Astro استاتیک، فایل جدا برای فارسی و انگلیسی، راست‌به‌چپ از طرح اول. تماس فقط تلگرام @MH759 است. ایمیل، آمارگیر و مشتری ساختگی نیست.',
    en: 'How Mohammad Honarvar’s site is built: static Astro, separate /fa and /en files, RTL from the start. Only Telegram @MH759. No email, analytics, or invented clients.',
  },
  h1: { fa: 'این سایت چطور ساخته شده', en: 'How this site is built' },
  lede: {
    fa: 'این صفحه پیشنهاد کار نیست. می‌گوید همین سایت چطور ساخته شده، و چه چیزی را درباره‌اش ادعا نمی‌کنم.',
    en: 'This page is not an offer of work. It says how this site is built, and what I do not claim about it.',
  },
  sections: [
    {
      heading: { fa: 'خروجی', en: 'The output' },
      body: {
        fa: [
          'ساخت با Astro است و خروجی‌اش فایل استاتیک است. آداپتور سرور ندارد؛ هر آدرس، از جمله این صفحه، موقع ساخت نوشته می‌شود. سایت منتشرشده روی GitHub Pages است، همان دامنه‌ی mh-honarvar.github.io.',
          'جست‌وجوی داخل سایت یک نمایه‌ی استاتیک است که با خود ساخت در می‌آید. سرویس آمار نیست و از صفحه به جایی گزارش نمی‌فرستد.',
        ],
        en: [
          'The build is Astro and the output is static files. There is no server adapter; each address, including this page, is written at build time. The published site is on GitHub Pages, the domain mh-honarvar.github.io.',
          'On-site search is a static index made with the build. It is not an analytics service, and the page does not report anywhere.',
        ],
      },
    },
    {
      heading: { fa: 'دو فایل، از طرح اول', en: 'Two files, from the first layout' },
      body: {
        fa: [
          'فارسی زیر /fa/ است و انگلیسی زیر /en/. دو فایل‌اند، نه یک HTML که فقط جهت آن عوض شود. زبان سند fa-IR یا en-US است و جهت با همان انتخاب می‌آید: راست‌به‌چپ برای فارسی از طرح اول.',
          'روی فارسی قلم وزیرمتن جلوتر است و روی انگلیسی Inter. هر دو متغیرند و با خود صفحه می‌آیند.',
        ],
        en: [
          'Persian lives under /fa/ and English under /en/. They are two files, not one HTML document whose direction is flipped. The document language is fa-IR or en-US, and direction comes with that choice: right-to-left for Persian from the first layout.',
          'On a Persian page Vazirmatn comes first, and on an English page Inter does. Both are variable faces, and they ship with the page.',
        ],
      },
    },
    {
      heading: { fa: 'چه چیزی ادعا نمی‌شود', en: 'What is not claimed' },
      body: {
        fa: [
          'ایمیل عمومی ندارم و این صفحه هم یکی نمی‌سازد. اسکریپت آمارگیر روی صفحه نیست. اسم مشتری ساخته نمی‌شود؛ کار مشتری روی این دامنه شرح داده نمی‌شود.',
          'تنها راه عمومی برای پیام تلگرام است، @MH759.',
        ],
        en: [
          'I have no public email, and this page does not invent one. There is no analytics script on the page. Client names are not invented; client work is not written up on this domain.',
          'The only public way to send a message is Telegram, @MH759.',
        ],
      },
    },
  ],
  linksHeading: { fa: 'کنار همین ساخت', en: 'Beside this build' },
  links: [
    { path: '/projects/mh-honarvar.github.io/', label: { fa: 'همین سایت، به‌عنوان پروژه‌ی عمومی', en: 'This site, as a public project' } },
    { path: '/blog/static-pages-and-webgl/', label: { fa: 'صفحه‌ی استاتیک و صحنه', en: 'A static page, and the scene' } },
    { path: '/topics/speed/', label: { fa: 'سرعت', en: 'Speed' } },
    { path: '/about/', label: { fa: 'درباره', en: 'About' } },
  ],
};
