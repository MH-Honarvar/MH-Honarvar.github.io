export const notFoundCopy = {
  fa: {
    eyebrow: 'سطرِ گم‌شده',
    title: 'این آدرس روی صفحه ننشست',
    body: 'چشم از عرض سطر بیرون رفت و این سطر هیچ‌وقت چیده نشد. از سطری ادامه بده که روی صفحه نشسته است.',
    description: 'این آدرس سطری است که روی صفحه ننشست. چشم از عرض سطر بیرون رفت و این سطر هیچ‌وقت چیده نشد.',
    also: 'سطرهایی که هنوز روی صفحه‌اند',
    homeCta: 'بازگشت به صفحه‌ی فرود',
    search: 'باز کردن جست‌وجو',
    missed: 'آدرسی که ننشست',
  },
  en: {
    eyebrow: 'The missing line',
    title: 'This address never landed',
    body: 'The eye ran off the measure, and this line was never set. Continue from a line that did land.',
    description: 'This address is a line that never sat on the page. The eye ran off the measure, and this line was never set.',
    also: 'Lines still on the page',
    homeCta: 'Back to the landing',
    search: 'Open search',
    missed: 'Address that never landed',
  },
} as const;

export const notFoundPaths = [
  { id: 'blog', fa: 'وبلاگ', en: 'Blog' },
  { id: 'projects', fa: 'پروژه‌ها', en: 'Projects' },
  { id: 'about', fa: 'درباره', en: 'About' },
  { id: 'services', fa: 'همکاری', en: 'Collaborate' },
  { id: 'map', fa: 'نقشه‌ی سایت', en: 'Map' },
] as const;
