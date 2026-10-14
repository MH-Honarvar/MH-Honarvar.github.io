---
title: Persian digits are not a font feature
description: Persian digits here are fa-IR characters drawn by Vazirmatn. Inter omits that range, OpenType never swaps the figures, and GitHub stars stay Latin.
date: 2026-10-14
tags: [numerals, rtl]
---

The usual hope is that a font will turn a Latin digit into a Persian one. This site does not do that. The character is chosen before paint, with `fa-IR`. Vazirmatn then has a glyph for it, because Persian digits sit in the Arabic block and the variable file includes that block. Inter, in the global stylesheet, is Latin and Latin-extended only. Nothing in `fonts.css` swaps the figure.

The short note [Put right-to-left in on day one](/en/blog/rtl/) is the cluster piece. [Two routes, not a flipped page](/en/blog/persian-rtl-interface/) walks through `lang` and the calendar. This one stays with digits and type.

## A digit is a different character

`toLocaleString('fa-IR')` and `Intl.NumberFormat('fa-IR')` write Persian digits. That is not a CSS substitution. The code turns a number into a string of Persian characters, and the string is what enters the page.

Reading time on an article does this. So do the home-page stats, the language percentages on the projects page, and the counter that climbs in `motion.ts`. That counter uses `fa-IR` only when `document.documentElement.lang` starts with `fa`. A Persian document is `fa-IR`, so the check passes. An English document is `en-US`, and the same function builds Latin digits.

Post cards format on their own, with `useGrouping: false`, so a small count does not grow a thousands separator. The rail beside the home page does one more thing. `padStart` pads with the Persian character `۰`, not with a Latin `0`. A one-digit Persian string is still one character. A Latin pad would sit a foreign zero next to a Persian digit.

The date on that same page becomes Persian by another call, but the figure and the month name both come from the locale. `formatDate` lands in the `time` element. The minute count beside it is formatted on its own. One is the calendar day. The other is a reading count. On a Persian page both use Persian digits, because both received `fa-IR`.

## Two families, two ranges

On `html` the default stack is Inter, then Vazirmatn, then the system UI. `html:lang(fa)` reverses that order. The selector is `:lang(fa)`, which also matches `fa-IR`. An exact `html[lang='fa']` does not match a document whose language is `fa-IR`, so it never puts Vazirmatn first.

Vazirmatn comes from `@fontsource-variable/vazirmatn`. One of its ranges is the Arabic block, from `U+0600`. Persian digits, `U+06F0` through `U+06F9`, live in that block. Inter in `fonts.css` is two files, Latin and Latin-extended. Neither reaches the Arabic block. Inter cannot draw a Persian digit, even if one showed up on an English page. The glyph falls through to Vazirmatn or to the system font.

Latin digits, `U+0030` through `U+0039`, sit in the Latin range of both families. On a Persian page Vazirmatn is first, so a Latin digit inside a repository name usually comes from Vazirmatn’s Latin, not from Inter. A more specific family wins where one is set. The command palette starts with `ui-monospace` and keeps Vazirmatn behind it. The intro canvas asks for Vazirmatn first in both languages. Share images use the separate file `Vazirmatn-Bold.ttf`, not the variable face on the page.

Weight, line-height, and motion are in [Type, space, and the motion of a page](/en/blog/type-and-space/). This page does not repeat them.

## Not every number is Persian

Stars and forks on a project card are raw JavaScript numbers, inside `dir="ltr"`. They do not pass through `toLocaleString`. Repository names, languages, topics, and the `⌘K` button are left-to-right islands too. A code block in an article sets `direction: ltr`.

Direction and digit shape are two decisions. A left-to-right island can still hold a Persian digit if the string was formatted first. Month labels on the home activity strip are built with `fa-IR-u-ca-persian` and then placed in a grid with `dir="ltr"`. The month label is Persian. The week columns do not mirror.

Language percentages go through `num`, so on a Persian page they are Persian. The same page shows a star count in Latin digits beside them. That split is not one global rule applied halfway. Each place that builds a number decides the format there.

## The calendar and the figure are not the same choice

`formatDate` formats a post date with `fa-IR`. In current `Intl` that locale is both the Solar Hijri calendar and Persian digits. `formatMonth` and the home activity strip are more explicit: `fa-IR-u-ca-persian`. The busiest day on the projects page passes `calendar: 'persian'` to `Intl`.

The clock on the about page is an `Intl.DateTimeFormat` in the page locale, with `timeZone: 'Asia/Tehran'`. The label is “my time in Tehran.” The clock asks for `font-variant-numeric: tabular-nums`, and the home stat numbers ask for the same. That is a request for equal-width figures. The characters themselves still come from `Intl`. The global stylesheet has no OpenType feature that swaps Latin and Persian digits.

## A digit on the canvas, apart from the Latin grid

The commit city writes the busiest day’s count with `Intl.NumberFormat` in the page locale and puts it on a sprite. When the page is Persian, dates in that scene also pass `calendar: 'persian'`. The activity cells are a different object, and they stay `dir="ltr"`. One view can carry a Persian digit on a label and still keep week columns from mirroring.

Home stats and language percentages call `toLocaleString` with default grouping. Post cards turn grouping off with `useGrouping: false`. A large contribution total on the home page gets a separator. The reading time on a card does not. Both are Persian digits when the page is Persian. The difference is the separator, not the font.

Share images do not build these figures. They load Vazirmatn Bold and set direction on the SVG by themselves. If a post title already contains a digit, that is the character written in the markdown, not a fresh `fa-IR` format. The page’s stats never reach that PNG.

Page direction does not make this choice. `dir` says which edge a line starts from. It does not say which character `4` is. That difference is in [Direction does not finish the page](/en/blog/why-css-direction-is-not-enough/).

## A separate route keeps a separate digit

Persian and English do not share the HTML file. The Persian home page formats stats with `fa-IR`. The English home page uses `en-US`. If both languages were one document and only `dir` changed, the same number string would reach both. Here the formatter receives the language while the page is built. Addresses and `hreflang` are in [The translation is a second file](/en/blog/separate-locale-routes/).

The [collaboration](/en/services/) page says what kind of work is welcome. The only public contact is Telegram, [@MH759](https://t.me/MH759).

If one thing stays from this page, it is this: the font does not invent a Persian digit. `fa-IR` builds the character, Vazirmatn draws the Arabic block, and a number that never passed through that formatter stays Latin.

## Further reading

- [The measure of a line](/en/blog/reading-measure-and-rhythm/)
- [Persian and RTL](/en/topics/rtl/)
- [Focus starts where the reading starts](/en/blog/focus-and-rtl/)
- [The canonical address is the page itself](/en/blog/two-language-urls/)
