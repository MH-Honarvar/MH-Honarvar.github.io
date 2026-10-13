import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;

export interface PublicCase {
  slug: string;
  title: L;
  summary: L;
  description: L;
  sections: { heading: L; body: L }[];
  site: string;
}

/** Curated public work. These are not GitHub repos, so they are not loaded from the API. */
export const publicCases: PublicCase[] = [
  {
    slug: 'karkia',
    title: { fa: 'کارکیا ترابر آسیا', en: 'Karkia Tarabar Asia' },
    summary: {
      fa: 'لندینگ بازاریابی که روی karkiatarabar.com زنده است، و یک صفحه‌ی لجستیک جدا با صحنه‌ی Three.js.',
      en: 'The marketing landing live at karkiatarabar.com, and a separate logistics page with a Three.js scene.',
    },
    description: {
      fa: 'سایت بازاریابی کارکیا ترابر آسیا و یک صفحه‌ی جدا با کره‌ی زمین و مسیر بار. برند مال من نیست.',
      en: 'A marketing site for Karkia Tarabar Asia, and a separate page with a globe and a freight journey. I do not own the brand.',
    },
    sections: [
      {
        heading: { fa: 'سایت عمومی', en: 'The public site' },
        body: {
          fa: 'کارکیا ترابر آسیا به یک سایت بازاریابی عمومی نیاز داشت. لندینگ استاتیکی که الان روی https://www.karkiatarabar.com/ بالا است را ساختم.',
          en: 'Karkia Tarabar Asia needed a public marketing site. I built the static landing that is live at https://www.karkiatarabar.com/.',
        },
      },
      {
        heading: { fa: 'صفحه‌ی دوم', en: 'A second page' },
        body: {
          fa: 'جدا از آن لندینگ، یک صفحه‌ی لجستیک ساختم که با اسکرول جلو می‌رود: صحنه‌ی Three.js با کره‌ی زمین و مسیر بار. این کد برای همین برند نوشته شده و کپی بسته‌ی شرکت دیگری نیست.',
          en: 'Apart from that landing, I built a logistics homepage that moves with the scroll: a Three.js scene with a globe and a freight journey. That code was written for this brand. It is not a copy of another company’s bundle.',
        },
      },
      {
        heading: { fa: 'حد این صفحه', en: 'The limit of this page' },
        body: {
          fa: 'برند مال من نیست. ریپازیتوری‌های آن کار خصوصی می‌مانند و این صفحه به آن‌ها لینک نمی‌دهد.',
          en: 'I do not own the brand. Those repositories stay private, and this page does not link to them.',
        },
      },
    ],
    site: 'https://www.karkiatarabar.com/',
  },
];
