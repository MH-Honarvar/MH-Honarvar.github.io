import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;

export const servicesPage: {
  title: L;
  description: L;
  h1: L;
  lede: L;
  sections: { heading: L; body: L[] }[];
} = {
  title: { fa: 'همکاری', en: 'Collaborate' },
  description: {
    fa: 'محمد هنرور برای رابط دوزبانه، صفحه‌ی وب و نوشتن وقت می‌گذارد، اگر موضوع جور باشد. کار مشتری خصوصی می‌ماند و ایمیل عمومی ندارد؛ تماس فقط با تلگرام @MH759 است.',
    en: 'Collaborate with Mohammad Honarvar on bilingual interfaces, web pages, and writing. Client work stays private. Reach him only on Telegram, @MH759.',
  },
  h1: { fa: 'چطور با هم کار می‌کنیم', en: 'How we can work together' },
  lede: {
    fa: 'این صفحه جای نمونه‌کار مشتری نیست. می‌گوید چه جور کاری را برمی‌دارم، چه چیزی خصوصی می‌ماند، و تنها راهی که می‌شود پیامی فرستاد.',
    en: 'This page is not a gallery of client work. It says what kind of work I take on, what stays private, and the only way to send a message.',
  },
  sections: [
    {
      heading: { fa: 'چه جور کاری', en: 'What kind of work' },
      body: {
        fa: [
          'رابط، اگر فارسی و راست‌به‌چپ از طرح اول لازم باشد نه به‌صورت وصله. صفحه‌ی وب که باید زود باز شود؛ Astro و TypeScript همان ابزارهایی هستند که همین سایت با آن‌ها ساخته شده. گاهی یک صحنه‌ی Three.js، وقتی خود صحنه موضوع باشد نه تزئین هر صفحه.',
          'نوشتن هم هست: یادداشت کوتاه درباره‌ی همین کار، در وبلاگ. اگر موضوع با این‌ها جور نباشد، یا وقت نباشد، بهتر است همان اول بگوییم.',
        ],
        en: [
          'Interfaces, when Persian and right-to-left belong in the first layout rather than as a patch. Web pages that should open quickly — Astro and TypeScript are what this site is actually built with. Sometimes a Three.js scene, when the scene is the subject and not a decoration on every page.',
          'Writing is part of it too: a short note on the same work, on the blog. If the subject does not fit, or the time does not, it is better to say so at the start.',
        ],
      },
    },
    {
      heading: { fa: 'چه چیزی خصوصی می‌ماند', en: 'What stays private' },
      body: {
        fa: [
          'کار مشتری و چیزی که هنوز آماده نیست روی این دامنه شرح داده نمی‌شود. در فهرست پروژه‌ها فقط می‌توانی ببینی که چنین کاری وجود دارد: نام، زبان، و بازه‌ی فعالیت. توضیح، موضوع، لینک و پیام کامیت به صفحه نمی‌رسد.',
          'این سایت سمت عمومی است. تحویل کار یک نفر دیگر این‌جا نیست و اسم مشتری هم ساخته نمی‌شود.',
        ],
        en: [
          'Client work, and anything that is not ready, is not written up on this domain. On the project list you can only see that such work exists: a name, a language, and an activity window. The description, topics, link, and commit text never reach the page.',
          'This site is the public side. Someone else’s delivery does not appear here, and neither does an invented client name.',
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
};
