---
title: Type, space, and the motion of a page
description: Font weight, Persian line height, and motion on this site — Vazirmatn, Inter, word-level splits, and when Lenis is allowed to load.
date: 2026-10-12
tags: [typography]
---

The first thing I trust on a page is not the hero object. It is the type: which face, which weight, how far the next line sits, and whether anything moves without a reason. The about page says the same thing in one line — a pixel of spacing, a font weight, an animation curve. This note is where those choices live in the CSS and in the motion script.

Routes and direction are a different article, [Two routes, not a flipped page](/en/blog/persian-rtl-interface/). Read that for `lang`, hreflang, and the solar calendar. This one stays with the letters.

## Two variable faces, and no extra subsets

English text is set in Inter, a variable font, weights 100 to 900 in one file. Persian text is set in Vazirmatn the same way. On an English page the stack is Inter, then Vazirmatn, then the system UI. On a Persian page the order flips, so a Persian word does not fall through to Inter’s Latin design.

The Persian switch is `:lang(fa)`. That matches `fa-IR`, which is what the document says. A selector that demanded the exact attribute `fa` never fired, and the Persian pages stayed on Inter. A variable font does not help if the wrong family wins.

Inter’s global file used to include Greek, Cyrillic, and Vietnamese. None of the copy uses them. The stylesheet keeps Latin and Latin-extended. Vazirmatn keeps its Arabic range for Persian and a Latin range for product names inside Persian sentences: Astro, GSAP, Three.js.

## Weight is a decision

The home heading is weight 800. The eyebrow is 600. Body text stays at the regular weight, with a line-height of 1.7. Persian prose on an article is looser: the post template sets line-height 2 when the article language is Persian, because the same measure feels tight once the letters carry dots and joins.

I do not animate weight. A heading that eases from thin to black looks like a loading state. The weight is there on first paint. Motion, when it happens, moves position and opacity, and only on pages that ask for it.

Buttons are 600, on a pill radius, with the primary one on the accent gradient. The muted color is for the lede, the dates, and the footer, so the heading does not have to shout with size alone. On a small screen the home heading drops its max measure. The type scale uses `clamp`, so the heading does not jump from a desktop size to a phone size in one step.

## Space uses the inline axis

Margins that mean “the start of the line” are `margin-inline` and `padding-inline`, not `left` and `right`. The header, the breadcrumbs, the table of contents, and the stat dividers use the inline start, so a right-to-left page does not need an override for every gap. The skill ticker on the home page is `direction: ltr` on purpose. That exception is local.

The reading measure on an article is about seventy characters. The home lede is shorter. Those numbers live in the component CSS. If a line feels long in Persian, the fix is the measure or the line-height, not a smaller font that loses the dots.

## Splitting letters breaks Persian

The motion script splits headings into words. It does not split letters. A Persian word is a chain of joins. A span around each letter cuts the chain. The code splits on whitespace, wraps each word, and if the word is the one marked in `data-highlight`, that inner span gets the gradient. In Persian the highlighted word is «حسِ». In English it is “feels.”

The animation lifts the words. It does not run when the system asks for less motion, and it does not run on article pages at all.

## What is allowed to move

Lenis is not on every page. Article pages set the document to plain motion, so the script never imports Lenis or GSAP there. On home, the blog index, projects, and about, the import still waits. If `prefers-reduced-motion` is set, or the head script has already added `no-motion`, neither library is fetched. The back-to-top button then uses a plain `scrollTo`.

GSAP counts the stat numbers and fades the `.reveal` blocks. Those blocks start at opacity 0 so the fade has somewhere to begin. Reduced motion turns that off in CSS: `.reveal` is visible. I would rather lose the entrance than make someone wait on a fade they did not ask for.

The custom cursor and the card tilt check for a fine pointer and for reduced motion before they attach. A touch screen does not get a fake cursor.

Lenis takes over the scroll. That trade is acceptable on a short home page. It is a bad trade on an essay. The post template keeps native scrolling, a thin reading bar, and a table of contents.

## Still can mean finished

The type system is what I am willing to spend on: two variable fonts, a real weight on the heading, a looser line-height for Persian, and gaps that follow the writing direction. A scroll library and a full-page scene are not spent on every URL. That second cost is [A static page, and when the scene earns its keep](/en/blog/static-pages-and-webgl/).

The skills list is on [about](/en/about/). What I take on, and what never gets a public write-up, is the [collaboration](/en/services/) page.
