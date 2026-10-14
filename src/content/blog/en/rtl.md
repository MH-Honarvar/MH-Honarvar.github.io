---
title: Put right-to-left in on day one
description: Persian and English here are two pages from the start. Direction, Vazirmatn, and the private card arrive with that layout, not as a patch added at the end.
date: 2026-10-10
updated: 2026-10-14
tags: [rtl]
---

Add right-to-left at the end and spacing, icons, and the menu slip. Here there are two pages from the start, not one page that gets flipped later. Persian lives under `/fa/` and English under `/en/`. This is the short note of that decision. The cluster sits under [the right-to-left topic](/en/topics/rtl/), and the longer piece is [Two routes, not a flipped page](/en/blog/persian-rtl-interface/).

## Each language has its own path

A title, a description, and a post with the same slug point at each other, but only when the second file is actually there. `hreflang` on a post turns on when that slug exists in the other folder. If the twin is missing, the language control goes to the other blog index and the head does not claim a translation. The canonical URL is the page itself, not the other language. The address detail is in [The canonical address is the page itself](/en/blog/two-language-urls/).

The root `/` is not a third home. It is `noindex`, it has no `dir`, and it sends the browser to `/fa/` or `/en/`. Right-to-left direction comes from the Persian page.

## Direction and type follow the language

A Persian document is `lang="fa-IR"` and `dir="rtl"`. English stays `en-US` and `ltr`. The font follows `:lang(fa)`, not direction: a Persian page puts Vazirmatn first and an English page leads with Inter. Direction does not build a Persian digit either. `fa-IR` builds the character.

Logical properties, such as `inset-inline-start` and `margin-inline`, change edge with `dir`. Gradients, the origin of `scaleX`, and a canvas do not. A page that only flips `dir` and leaves those alone still looks mirrored. [Focus starts where the reading starts](/en/blog/focus-and-rtl/) is why the Tab order has to share that same edge.

Persian numbers and dates use the Solar Hijri calendar where the code passes `fa-IR` or `calendar: 'persian'`. The Tehran clock label is not a street address.

## Private means a name and a span

A private project card has no description, topics, link, or commit message. You only see the name, the language, the activity window, and the past year’s commit count. Client detail stays off this site, and no client name is invented.

The [collaboration](/en/services/) page states the same limit for contact. The only public way is Telegram, [@MH759](https://t.me/MH759).

## Which notes sit beside this one

[Hello world — why I rebuilt this site](/en/blog/hello-world/) says what the tools are and when motion is allowed. [This site](/en/blog/this-site/) is the very short version of that introduction. This page wants right-to-left on day one. The longer pages walk the same code more slowly.

## The start edge, not a last-minute mirror

The header puts the mark first, then home, blog, projects, and about, then the tools. The nav is flex, and in a right-to-left document it lines up from the right. Spacing that means “the start of the line” uses `margin-inline` and `inset-inline-start`. The skip link is pinned to that same edge. If those had been `left`, Persian would need a second rule for every gap.

The pieces that must not flip were separated at the start, not after a complaint. Repository names, languages, stars, activity cells, and code blocks use `dir="ltr"`. The `⌘K` button does too. The palette and the terminal are Latin dialogs. These islands are not patches. Latin was never meant to be mirrored.

The font switch is not patched onto direction either. The global stylesheet has both `:lang(fa)` and `html[lang|='fa']`. Both match `fa-IR`, because the document language is not exactly `fa`. An exact `html[lang='fa']` would miss this document. If that were the only selector, Vazirmatn would stay behind and Inter would sit in front of the Persian.

## Where direction arrives late, it shows

A `90deg` gradient does not listen to page direction. The less-to-more ramp on the commit city is mirrored with `scaleX(-1)` for Persian. The origin of `scaleX` on the reading bar and the skill bar is physical, and right-to-left sets it to `right` in a separate rule. The intro canvas and the 3D scene read `document.dir` themselves. Add those lines at the end and each one fixes a spot while leaving the others.

The blog search input still uses `padding-left`. I do not present that as finished right-to-left work. It shows that a physical property, even beside the rest of the layout, does not find the right edge on its own.

On a narrow width the nav moves to the bottom of the screen, but in the document it stays in the header. Where it is seen and where Tab meets it are not the same. The focus note opens that up. It belongs here only because a visual move, if it was not thought through at the start, also scrambles reading order.

A Persian digit does not come from `dir` either. Stats and dates are formatted with `fa-IR` or the `persian` calendar. A GitHub star on a card, inside the Latin island, stays a raw number. A late rule that said “make every figure Persian” would have erased that difference.

If one thing stays, it is this: right-to-left is not a late patch. The route, the direction, the type, and the limit on a private card are part of the first layout.
