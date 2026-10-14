---
title: The measure of a line
description: "How this site sets the reading line: a 70ch article column, line-height 2 for Persian prose, and a drop cap that only English essays may use."
date: 2026-10-14
tags: [typography, reading]
---

Which face a page uses, and when a scroll library is allowed to load, is already written down in [Type, space, and the motion of a page](/en/blog/type-and-space/). This note stays with the line itself. How long may it run, how far does the next one sit, and what is allowed to break the column. A page can wear the right font and still be hard to finish. The failure is usually the measure, or a rhythm that never rests.

## The column is seventy characters

On an article the prose block is `max-width: 70ch` at `1.1rem`, with a line-height of `1.85`. In CSS, `1ch` is the width of the zero in the font that actually drew it, so the measure follows the face instead of a fixed pixel guess. Seventy is the width I set and then left alone. Long enough for a sentence to finish a clause. Short enough that the eye can find the start of the next line without searching for it.

Other widths on the site are shorter, and they are shorter for a reason. The home lede stops at `50ch`. A section lede elsewhere stops at `60ch`. The muted description under an article title is also capped at `60ch`. Those lines introduce. They are not the place you stay.

The home heading is a different object. It is weight `800`, sized with `clamp` from `2.4rem` to `5.2rem`, and its max measure is `14ch`. A headline is a shape. A paragraph is a path. Sharing one width would make the headline look like a paragraph that got large, or the paragraph look like a headline that forgot to stop.

Body text outside the article column uses a line-height of `1.7`. The article is looser on purpose. The template assumes you will remain in that column for more than a screen.

## Persian gets another step of air

When the article language is Persian, `.lang-fa .prose` sets the line-height to `2`. The same `70ch` feels tight once the letters carry dots and joins. Shrinking the type would save horizontal space and lose the dots. The open line-height is the correction, and it applies only to the article. The rest of a Persian page stays at the body value of `1.7`.

The faces behind that choice are the ones named in the type note. Vazirmatn comes first when the document language is `fa`. Inter comes first otherwise. Both fall through to the system UI. Both are variable fonts, weights `100` to `900` in one file, and both declare `font-display: swap`. Swap means the first paint may be a fallback face. Because the measure is in `ch`, it will shift a little when the real face arrives. The zero is not the same width in every family. I accept that shift. Hidden text, while a font file is still on the way, is the alternative I do not want.

Inter’s files on this site are Latin and Latin-extended. Vazirmatn keeps an Arabic range for Persian and a Latin range for names inside a Persian sentence. The subset work is in the type note. It matters here because `ch` belongs to whichever face drew the zero. The article title uses a letter-spacing of `-0.01em` in both languages. I do not tighten it, and I do not add a second value for Persian. The air stays in the line-height.

## The drop cap is an English habit

English articles float the first letter of the first paragraph. It is `3.6em`, weight `800`, and it takes the accent gradient. The selector is `.lang-en .prose > p:first-of-type::first-letter`. Persian articles do not match it. A dropped initial on a joining letter cuts the chain the same way a per-letter span does, and the float is `left`, which is the wrong edge for a right-to-left line. The opening of a Persian essay is the sentence, at the same size as the rest, with more air between the lines.

Paragraphs under the prose block have a bottom margin of `1.3rem`. That gap is ordinary. It is not the heading gap. The drop cap is a single event at the start of an English essay. It is not repeated, and it is not a decoration both languages have to share. The English opening has a large letter. The Persian opening has a line-height of `2`.

## Headings are rests

An `h2` in the article uses a line-height of `1.3` and a top margin of `2.8rem`. That margin is the rest between sections. If every paragraph were separated by the same distance, the outline would flatten, and the table of contents would point at breaks you could not feel while reading. The heading also sets `scroll-margin-top: 6rem`, and `8.5rem` once the layout is narrow, so a jump from the table of contents clears the sticky header. A heading you cannot see after you click it is not a heading. It is a target hidden under the chrome.

On hover, a hash anchor is prepended at the inline start. In English that is the left side. In Persian it is the right side. One rule, `inset-inline-start`, does both. The anchor copies the URL of the heading. It does not change the measure of the paragraph under it. The page title, the `h1`, sits outside the prose block: `clamp` from `2.2rem` to `3.8rem`, line-height `1.15`. Description, date, and reading time come next, then the column. The body does not have to shout. The title already did, and then it stopped.

## Beside the column, not inside it

The table of contents is a sticky column, `240px`, with a gap of `3rem` from the prose. It is not subtracted from the `70ch` by being placed inside it. The grid gives the article `minmax(0, 1fr)` and the contents their own track. On a narrow screen the contents become a horizontal strip, and the heading’s scroll margin grows so that strip does not cover the title you just jumped to.

A bar at the top of the viewport, `3px` tall, scales with scroll position. Its transform origin is the left in a left-to-right page and the right when `dir` is `rtl`, so the bar grows from the start of the line. A separate chip reports minutes left. It reads the prose block’s position, not a library’s scroll position. Article pages set motion to plain, which means the document carries `data-motion="plain"`. The motion script is still imported by the layout, but GSAP and Lenis are fetched only when motion is rich and the reader has not asked for less. On an essay those modules stay out. The bar is a `scaleX` on a native scroll listener. That is the whole path.

There is one optical change, and it is refused when it should be. If `prefers-reduced-motion` is not set, the prose receives a focus class. Paragraphs, lists, and quotes sit at opacity `0.55` until they cross a band in the middle of the viewport, where they return to full opacity. The band is an intersection observer with a root margin of `-35% 0px -45% 0px`. When reduced motion is set, the class is never added. Every block stays at full strength. I would rather lose the dimming than ask someone to track a fade they did not request.

## What the line is for

The measure is the part of the page a person feels without a lab. I am not publishing a speed score for `70ch`, and I am not translating line-height into one. I did not measure a lab result for this note. The practical test is whether you reach the end of the line and still know where it started.

Leaving animation off this template is the subject of [When the animation stays out](/en/blog/when-to-skip-the-animation/). Why the essay does not download a WebGL scene is [A static page, and when the scene earns its keep](/en/blog/static-pages-and-webgl/). What that finished HTML file owes you, before any of this spacing, is [What a static page owes the reader](/en/blog/what-a-static-page-owes-the-reader/). The kind of work I take on, and what never becomes a public write-up, is the [collaboration](/en/services/) page.

If you want the same facts from the stylesheet, start with the article column at `70ch`, then the Persian line-height of `2`, then the drop-cap selector that never matches a Persian article. The rest is spacing, so a heading can be a pause instead of another paragraph at a larger size.

## Further reading

- [Type and measure](/en/topics/type/)
- [A fast page](/en/topics/speed/)
