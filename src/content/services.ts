import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;

/** Public notes and the one public project. Same list on the collaboration and about pages. */
export const workLinks: { path: string; label: L }[] = [
  { path: '/blog/persian-rtl-interface/', label: { fa: 'دو مسیر، نه یک صفحه‌ی وارونه', en: 'Two routes, not a flipped page' } },
  { path: '/blog/persian-numerals-and-fonts/', label: { fa: 'عدد فارسی و قلم', en: 'Persian numerals and fonts' } },
  { path: '/blog/why-css-direction-is-not-enough/', label: { fa: 'چرا direction کافی نیست', en: 'Why direction is not enough' } },
  { path: '/blog/separate-locale-routes/', label: { fa: 'مسیر جدا برای هر زبان', en: 'A separate route for each language' } },
  { path: '/blog/type-and-space/', label: { fa: 'حروف، فاصله، و حرکت صفحه', en: 'Type, space, and the motion of a page' } },
  { path: '/blog/reading-measure-and-rhythm/', label: { fa: 'اندازه‌ی سطر و ریتم خواندن', en: 'Measure and the rhythm of reading' } },
  { path: '/blog/static-pages-and-webgl/', label: { fa: 'صفحه‌ی استاتیک و صحنه', en: 'A static page, and the scene' } },
  { path: '/blog/when-to-skip-the-animation/', label: { fa: 'کی حرکت را کنار بگذاریم', en: 'When to skip the motion' } },
  { path: '/blog/what-a-static-page-owes-the-reader/', label: { fa: 'صفحه‌ی استاتیک به خواننده چه بدهکار است', en: 'What a static page owes the reader' } },
  { path: '/projects/mh-honarvar.github.io/', label: { fa: 'همین سایت، به‌عنوان پروژه‌ی عمومی', en: 'This site, as a public project' } },
  { path: '/about/', label: { fa: 'درباره', en: 'About' } },
];

export const servicesPage: {
  title: L;
  description: L;
  h1: L;
  lede: L;
  sections: { heading: L; body: Record<Lang, string[]> }[];
  colophon: L;
  related: { heading: L; lede: L };
} = {
  title: { fa: 'شروع همکاری با یک پیام', en: 'A collaboration starts with a message' },
  description: {
    fa: 'چه کاری را برمی‌دارم، کار چطور پیش می‌رود، و چه چیزی خصوصی می‌ماند. تنها راه عمومی پیام تلگرام است، @MH759. هیچ ایمیلی روی این سایت نگذاشته‌ام.',
    en: 'What I take on, how the work proceeds, and what stays private. The only way to write is Telegram, @MH759. No email address is published on this site.',
  },
  h1: { fa: 'چطور با هم کار می‌کنیم', en: 'How we can work together' },
  lede: {
    fa: 'این صفحه جای نمونه‌کار مشتری نیست. می‌گوید چه جور کاری را برمی‌دارم، کار چطور پیش می‌رود، چه چیزی خصوصی می‌ماند، و تنها راهی که می‌شود پیامی فرستاد.',
    en: 'This page is not a gallery of client work. It says what kind of work I take on, how the work proceeds, what stays private, and the only way to send a message.',
  },
  sections: [
    {
      heading: { fa: 'چه جور کاری', en: 'What kind of work' },
      body: {
        fa: [
          'رابط، اگر فارسی و راست‌به‌چپ از طرح اول لازم باشد نه به‌صورت وصله. صفحه‌ی وب که باید زود باز شود؛ Astro و TypeScript همان ابزارهایی هستند که همین سایت با آن‌ها ساخته شده. گاهی یک صحنه‌ی Three.js، وقتی خود صحنه موضوع باشد نه تزئین هر صفحه.',
          'نوشتن هم هست: چیزی که حین ساختن یاد می‌گیرم، ساده، در وبلاگ. اگر موضوع با این‌ها جور نباشد، یا وقت نباشد، بهتر است همان اول بگوییم.',
        ],
        en: [
          'Interfaces, when Persian and right-to-left belong in the first layout rather than as a patch. Web pages that should open quickly — Astro and TypeScript are what this site is actually built with. Sometimes a Three.js scene, when the scene is the subject and not a decoration on every page.',
          'Writing is part of it too: what I learn while building, put plainly on the blog. If the subject does not fit, or the time does not, it is better to say so at the start.',
        ],
      },
    },
    {
      heading: { fa: 'روند همکاری', en: 'How it proceeds' },
      body: {
        fa: [
          'پیام را در تلگرام می‌نویسی، @MH759، و می‌گویی صفحه یا رابط قرار است چه کند. اگر موضوع با کاری که برمی‌دارم جور باشد و وقت باشد، همان‌جا می‌گویم. اگر نباشد، همان اول هم می‌گویم تا هیچ‌کدام معطل نشویم.',
          'قیمت و تاریخ تحویل این‌جا نیست. توافق، و خود کار، روی این دامنه شرح داده نمی‌شود. این صفحه فقط می‌گوید کار چطور شروع می‌شود.',
        ],
        en: [
          'You write on Telegram, @MH759, and say what the page or interface needs to do. If the subject fits the work I take and there is time, I say so there. If it does not, I say that at the start, so neither of us waits.',
          'There is no price and no delivery date here. The agreement, and the work itself, are not written up on this domain. This page only says how the work begins.',
        ],
      },
    },
    {
      heading: { fa: 'چه چیزی خصوصی می‌ماند', en: 'What stays private' },
      body: {
        fa: [
          'کار مشتری و چیزی که هنوز آماده نیست روی این دامنه شرح داده نمی‌شود و در فهرست پروژه‌ها نام نمی‌آید. توضیح، موضوع، لینک و پیام کامیت هم به صفحه نمی‌رسد.',
          'این سایت سمت عمومی است. آزمایش ابزار این‌جاست. تحویل کار یک نفر دیگر این‌جا نیست و اسم مشتری هم ساخته نمی‌شود.',
        ],
        en: [
          'Client work, and anything that is not ready, is not written up on this domain and is not named on the project list. The description, topics, link, and commit text never reach the page.',
          'This site is the public side. Trying a tool happens here. Someone else’s delivery does not, and neither does an invented client name.',
        ],
      },
    },
    {
      heading: { fa: 'چطور پیام بدهی', en: 'How to reach me' },
      body: {
        fa: [
          'تنها راه عمومی تلگرام است، @MH759. ایمیل روی سایت نگذاشته‌ام و این صفحه هم یکی نمی‌سازد. معمولاً همان روز جواب می‌دهم، اگر پیام روشن باشد که چه در ذهن توست.',
          'سؤال‌های کوتاه — از جمله اینکه پروژه‌ی سفارشی را کی قبول می‌کنم — در صفحه‌ی درباره مانده‌اند تا یک مجموعه‌ی سؤال تکراری روی دو آدرس ایندکس نشود.',
        ],
        en: [
          'The only public way is Telegram, @MH759. I have not put an email on the site, and this page does not invent one. I usually reply the same day, if the message is clear about what you have in mind.',
          'The short questions — including when I take a custom project — stay on the about page, so the same set of questions is not indexed at two URLs.',
        ],
      },
    },
  ],
  colophon: { fa: 'شناسنامه‌ی سایت', en: 'Colophon' },
  related: {
    heading: { fa: 'از همین کار', en: 'From the same work' },
    lede: {
      fa: 'نوشته‌هایی که حین ساختن همین سایت درآمده، و شرح خود پروژه. اگر موضوع کار تو این اطراف است، از همین‌جا بخوان.',
      en: 'Notes that came out of building this site, and the project itself. If your subject lives around here, start with these.',
    },
  },
};
