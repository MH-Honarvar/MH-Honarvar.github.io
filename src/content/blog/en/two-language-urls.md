---
title: The canonical address is the page itself
description: Persian and English are two files. hreflang is emitted only when the twin exists, and each page’s canonical URL is its own address, not the other language.
date: 2026-10-14
tags: [bilingual, persian]
---

A page on this site treats its own address as canonical. The Persian version does not point at English as the “real” one, or the other way around. `canonical` in `Base.astro` is the current path, made absolute with the origin `https://mh-honarvar.github.io`. The other language appears in `hreflang` only when that page actually exists.

The direction cluster is [the right-to-left topic](/en/topics/rtl/). The longer account of the routes is [Two routes, not a flipped page](/en/blog/persian-rtl-interface/).

## Two files, not one document with a switch

`src/pages/[lang]/` builds home, blog, projects, about, and collaboration separately for `fa` and `en`. Posts live in `src/content/blog/fa` and `src/content/blog/en`. The filename is the slug. `getStaticPaths` collects the other language’s slugs. `hasTwin` means that name is there.

Interface copy is chosen from `src/i18n/ui.ts` while the page is built. The browser does not later turn one HTML file into the other language. The language control replaces the `/fa/` or `/en/` prefix. A post with a twin opens the translation. A post without one gets an `altPath` of the other blog index, and `alternate` is false.

## What the head is allowed to say

On a page that is not `noindex`, `hreflang` for the page itself is always there: `fa-IR` or `en-US`. The other language and `x-default` are added only when `alternate` is on. `x-default` points at the Persian URL of that pair, not at the site root. `og:locale:alternate` uses the same condition.

A post takes this flag from `hasTwin`. A Persian copy dropped into the English folder is not a translation. This post and its English twin share the slug, so the flag is on for them. [Put right-to-left in on day one](/en/blog/rtl/) has a twin too. A tag page is different. `tagPairs` today pairs `راست‌به‌چپ` with `rtl`, and `تایپوگرافی` with `typography`. The names `bilingual` and `persian` are not in that table, so those tag archives do not claim a translated tag. The post still does.

## The root is the exception

`/` is not its own canonical URL. It is `noindex, follow`, and its canonical is `https://mh-honarvar.github.io/fa/`. A script sends the browser to `/fa/` or `/en/` from `navigator.language.startsWith('fa')`. Without the script, a `noscript` refresh goes to `/fa/`. The root itself has no `dir`. Do not treat that stop as the Persian home, except for that one canonical link.

The sitemap drops `/`, `rss.xml`, and `/og/`. If both languages are present in a page’s links, `x-default` is added and points at Persian. If one is missing, the alternates are cleared. Each language has its own feed, and the feed is not in the sitemap.

The 404 is Persian, `noindex`, and has no `alternate`. It is not either language’s home.

## Why this belongs to reading

Direction, type, and Tab order are decided on the document whose address is canonical. A Persian page has `dir="rtl"`, and the skip link goes to the right edge. An English page does not do that. If both were one file and only a property changed, one URL would stay canonical and the other would be a shadow. Here each has its own file. [Focus starts where the reading starts](/en/blog/focus-and-rtl/) is the order of that document.

[This site](/en/blog/this-site/) is the short introduction. [Hello world — why I rebuilt this site](/en/blog/hello-world/) is why it was rebuilt. The [collaboration](/en/services/) page is not in the header nav. It is reached from the footer, and its only public contact is Telegram, [@MH759](https://t.me/MH759).

If one thing stays, it is this: I do not announce a translation by flipping `dir`. A second file is required, and until that file exists the canonical address stays this page.
