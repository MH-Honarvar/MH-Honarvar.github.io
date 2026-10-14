---
title: Two routes, not a flipped page
description: How this site keeps Persian and English apart — separate URLs, direction, Vazirmatn, and a solar calendar — without pretending a missing translation exists.
date: 2026-10-13
tags: [rtl, typography]
---

A Persian page drawn in English and then mirrored still looks mirrored. Spacing that was left becomes a guess, icons point the wrong way, and the menu crowds an edge it was not designed for. This site does not do that. Persian and English are two routes from the first layout: `/fa/` and `/en/`.

## Two trees, one site

`src/pages/[lang]/` builds every public page twice. Home, blog, projects, and about each receive `lang` as `fa` or `en`. Copy is chosen while the static page is built, from `src/i18n/ui.ts` and from `src/content/blog/fa` and `src/content/blog/en`. It is not a dictionary the browser swaps after load.

That split is the point. A string can be short in English and long in Persian. A heading can break on different words. If both languages shared one HTML file and only a `dir` switch, the line lengths would fight. Here they never share the file.

The root URL, `/`, is different. It is `noindex`, its canonical points at `/fa/`, and a tiny script sends the browser to `/fa/` or `/en/` from `navigator.language`. It is not a third home page. Search engines are told to keep the Persian home page as the default.

## `lang` and `dir` move together

The document is `lang="fa-IR"` or `lang="en-US"`, and `dir` comes from the same dictionary: `rtl` or `ltr`. A page that claims Persian but stays left-to-right will hyphenate as if it were English. A page that flips direction and leaves `lang` as English picks the wrong font and the wrong voice for dates.

Hreflang uses `fa-IR` and `en-US`, plus `x-default` on the Persian URL. The alternate is emitted only when the other language has that page. For a post, that means a file with the same slug in the other folder. The blog route collects the other language’s slugs and sets `alternate` only when the slug is in that set. If the twin is missing, the page does not advertise a translation. The language switch points at the other blog index.

Tag archives are stricter. A Persian tag and an English tag are paired only when both names are real translations and both archives are worth indexing. When two early posts shared both tags, those archives were the blog index under another URL. They stay out of the index until a tag has its own introduction and a shorter list.

## Type follows the language

Persian pages ask for Vazirmatn first. English pages ask for Inter first. The switch is `:lang(fa)`, which matches `fa-IR`. A selector written `html[lang='fa']` does not match `fa-IR`, so Vazirmatn never won and Inter sat in front of the Persian text.

Inter is a variable font, Latin and Latin-extended only. Greek, Cyrillic, and Vietnamese are not in the copy, so they are not in the global stylesheet. Vazirmatn keeps its Arabic block for the Persian and its Latin block for names like Astro and Three.js inside Persian sentences.

Weight, spacing, and motion are in [Type, space, and the motion of a page](/en/blog/type-and-space/).

## Where the solar calendar actually appears

Month labels go through `formatMonth`, which formats a `YYYY-MM` value with `fa-IR-u-ca-persian`. The busiest day on the projects page passes `calendar: 'persian'` to `Intl`. Ordinary post dates use `fa-IR`, which already formats in the Solar Hijri calendar.

The clock on the about page formats the current time in `Asia/Tehran`. That is a clock label, “my time in Tehran,” not a street address. Nothing in the layout turns that timezone into a postal address.

## What a private card may show

`scrub` in the GitHub helper strips a private repository to a name, a language, an empty URL, and no description. The card can still show an activity window and a past-year commit count, because those are counts, not messages or file names. Topics, the homepage, and the commit text never reach the template.

The [collaboration](/en/services/) page says what kind of work is welcome and that the only public contact is Telegram, [@MH759](https://t.me/MH759). There is no public email, so the page does not invent one. The personal version of the same limit is on [about](/en/about/).

## What the language switch may not do

The header switch replaces the `/fa/` or `/en/` prefix. A post with a twin lands on the translation. A post without one gets an `altPath` of the other blog index, and `alternate` is false so the head does not claim hreflang. The sitemap does the same: one language does not grow an alternate, and `x-default` is added only when both URLs are real.

A paired slug is an English file that is actually a translation, not the Persian markdown with the folder name changed. The next piece, on when the WebGL scene is worth loading, is [A static page, and when the scene earns its keep](/en/blog/static-pages-and-webgl/).
