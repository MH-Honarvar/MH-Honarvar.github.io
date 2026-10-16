---
title: The link you send is one language
description: "Copy, Telegram, and X send only this page URL. og:locale is fa_IR or en_US, and hreflang for the other language is written only when that twin file exists."
date: 2026-10-16
tags: [bilingual, persian]
---

A share on this site is one address. Under the essay, the row offers three ways to pass it on: copy the link, open Telegram’s share URL, or open the X intent. Each of them carries the page you are on. Persian is a path under `/fa/`. English is a path under `/en/`. This file is the English one. The Persian file has the same slug in `src/content/blog/fa`, and it is a different URL.

[The canonical address is the page itself](/en/blog/two-language-urls/) is the longer account of that contract. This note stays with the moment you send the link: which string leaves the browser, and what the head has already said about language.

## The row uses this URL

The copy button writes `location.href`. That is the address in the bar. If you followed a heading anchor, the fragment is still there, and the button keeps it. The anchors beside headings do a narrower copy. They take the current location, drop any hash already present, and append that heading’s hash. The share button does not do that trim. A section you have scrolled to can leave with the message.

Telegram and X do not read the bar. Their `href`s are built when the page is rendered. `pageUrl` is this post’s `postUrl`, resolved against the site origin `https://mh-honarvar.github.io`. For the page you are reading, the path is `/en/blog/sharing-in-two-languages/`. The title is the `text` parameter. There is no second URL in that query for the Persian file. The link opens a compose screen on the other site. It does not publish on its own, and it does not search for a translation.

The row has no mail link. `SITE.email` is empty, so the footer does not print one either. The public contact on the [collaboration](/en/services/) page is Telegram, [@MH759](https://t.me/MH759). That address is how someone writes to me. The share intent is how this URL is handed to someone else. They sit next to each other in the footer and the essay only in the sense that both are links. They do not share a job.

## What the head is willing to say

`Base.astro` sets `og:locale` from the route. On an English page the value is `en_US`. On a Persian page it is `fa_IR`. The tag is written for the page in front of you. It does not wait until a twin exists. A post with one language still names its own locale.

`og:url` is the current path, made absolute with the site origin. For a post, `og:type` is `article`. The image path is `/og/en/` plus the slug on this side, and `/og/fa/` plus the slug on the other. The markup points at the image for the language of the URL. `canonical` is that same current URL. English does not point its canonical link at Persian, and Persian does not point its canonical link at English.

`hreflang` is a smaller claim than `og:locale`. When the page is not `noindex`, the head includes `hreflang` for the page itself: `en-US` here, `fa-IR` on the Persian route. The other language, and `x-default`, are added only when `alternate` is on. For a post, that flag is `hasTwin`. `getStaticPaths` collects the other language’s slugs. `hasTwin` means this slug is in that set. A missing file is not a pair. Replacing `/en/` with `/fa/` in a string, when nobody wrote the second file, does not create one.

When the twin exists, `x-default` points at the Persian URL of the pair. From a Persian page that is the page itself. From an English page it is `altPath`, the same slug under `/fa/blog/`. `og:locale:alternate` follows the same flag: `fa_IR` on an English page that has a twin, `en_US` on a Persian page that has one. When `alternate` is off, those two tags are left out. `og:locale` for the language you opened stays.

The language control in the header is a separate piece. It is always drawn. With a twin, its `href` is the translation, and the control’s own `hreflang` names `fa-IR` from English or `en-US` from Persian. Without a twin, `altPath` is the other blog index and `alternate` is false, so the head does not advertise a translation. The control still goes somewhere useful: the other language’s list of notes.

## This file has a twin

This note and the Persian file share the slug `sharing-in-two-languages`, so the flag is on. The same is true of [The HTML map is a page you can read](/en/blog/the-html-map/) and [Up to three notes that share a tag](/en/blog/the-next-article/). Each subject is two markdown files. Sending the English URL sends the English document. The Persian sentence is `/fa/blog/` plus that slug, with a trailing slash.

The tags on this post are `bilingual` and `persian`. A tag is a label for the related-notes list and for the tag archive. It is not `hreflang`. The archive links a translation when `tagIndexable` in `src/lib/tags.ts` is true on both sides: the name is in `tagPairs`, the introduction is unique and at least two sentences, and the posts that carry the tag number at least two while remaining fewer than the whole blog in that language. The post pair does not wait on that function. The pair is the shared slug, and these two files already satisfy it.

## The other language is a different document

Direction travels with the document, not inside the shared string as a hint the other site must honor. An English page is `lang="en-US"` and `dir="ltr"`. A Persian page is `lang="fa-IR"` and `dir="rtl"`. Those attributes are written for the route that was built. Someone who opens the English link gets the English column, the English type stack, and the English feed, `/en/rss.xml`. The Persian feed is `/fa/rss.xml`. Each feed lists the posts of its own language.

[Persian and RTL](/en/topics/rtl/) gathers the notes about that route, including the canonical one. The [map](/en/map/) is the grouped list when you would rather walk than send a single essay. The map page does not pass `alternate`, so the layout default stays on, and both `/en/map/` and `/fa/map/` are real pages. A blog post gets that pair only when the second file exists. [Up to three notes that share a tag](/en/blog/the-next-article/) is the block under the essay, which is also same-language only. It will not attach the Persian twin to this English page.

The address in the message is the language you chose. The other language has its own URL. The head names that other URL when the twin file is there, and `og:locale` names the language of the URL you actually sent.
