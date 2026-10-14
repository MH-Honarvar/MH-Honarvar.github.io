---
title: Direction does not finish the page
description: dir on the html element sets the line’s start, not the font, the digits, or the canvas. Gradients, transform origins, and a few ltr islands stay manual.
date: 2026-10-14
tags: [rtl, persian]
---

`dir="rtl"` starts the line from the right. That is the whole of it. It does not pick the font, it does not make a digit Persian, it does not reverse text inside a canvas, and it does not move the camera in the 3D scene. This site sets direction on `html`, next to the language, and then decides separately for the things direction never reaches.

The short note [Put right-to-left in on day one](/en/blog/rtl/) is the cluster piece. [Two routes, not a flipped page](/en/blog/persian-rtl-interface/) is why Persian and English are two addresses. This one stays on the `dir` property and shows where it is enough and where it is not.

## Language and direction arrive together

`Base.astro` sets both `lang` and `dir` on the `html` element. The language is `fa-IR` or `en-US`. Direction comes from `ui[lang].dir`: `rtl` for Persian, `ltr` for English. A page with only one of those two is unfinished. Language chooses the font and the voice of a date. Direction chooses where a line starts and which edge counts as the start.

The language control in the header does not flip `dir` on the same document. It replaces the `/fa/` or `/en/` prefix and opens the other page. Each page has its own direction from the start.

The site root, `/`, is the exception. It has `lang="fa"`, no `dir`, it is `noindex`, and its canonical URL is `/fa/`. A script sends the browser to `/fa/` or `/en/` from `navigator.language.startsWith('fa')`. That page is not a right-to-left home. Without the script, a `noscript` refresh still goes to `/fa/`. Direction comes from the language page, not from this short stop.

## Logical properties follow direction

A margin or padding that means “the start of the line” is written with `margin-inline`, `padding-inline`, and `inset-inline-start`. A quotation uses `border-inline-start`. The header bar, the breadcrumbs, and the back-to-top button use the inline edge. When `dir` changes, those edges change with it. They do not need a separate Persian rule.

`text-align: start` works the same way. The start is the right on a Persian page and the left on an English one. The text blocks do not each need an override. The skip link uses `inset-inline-start` too. Its edge comes with the page.

That part of the layout really does finish with one property. The rest of the page does not. Where a physical property is left in place, document direction never reaches it. The fix is either a `[dir='rtl']` rule, or an island that is left-to-right on purpose.

## Transform origin and gradients stay physical

The reading progress bar uses `transform-origin: left`. On a right-to-left page a separate rule sets the origin to `right`, both for an article and for the bar on the home page. The skill bar on the about page, and the fill on the timeline, follow the same pattern. `scaleX` starts from a physical edge. `dir` does not move that edge. Without the second rule, the bar would grow from the left while the line is read from the right.

The less-to-more key on the commit city is a `linear-gradient(90deg)`. A gradient does not listen to page direction. Under `[dir='rtl']` that ramp is mirrored with `scaleX(-1)`, so the brighter end still reads as “more.” `inset-inline-end` already places the box. The color inside the box has a direction of its own.

Blog search is a smaller exception. The Pagefind input uses `padding-left`, not `padding-inline-start`. Page direction does not move that gap to the right edge. The search icon stays on the left even when the rest of the page is right-to-left.

## Islands that should not flip

A code block sets `direction: ltr` and `text-align: left`. Its language label is placed with `left`, not with `inset-inline-start`. Repository names, language chips, topics, stars, forks, and the cells of the activity strip use `dir="ltr"`. The moving skill ticker on the home page is `direction: ltr` as well, so it does not reverse with the page.

The command palette is a `dialog` with `dir="ltr"`, even when the page itself is Persian. The `⌘K` button is the same. These are not mirrored Persian sentences. They are commands, Latin names, and a keyboard shortcut. A search result link uses `dir="auto"`, so a Persian title keeps its own direction while the dialog stays Latin.

Digits have their own island, but the split is the formatter, not direction. [Persian digits are not a font feature](/en/blog/persian-numerals-and-fonts/) opens that difference: `fa-IR` builds the character, and `dir` only places the line.

## Canvas and the scene do not inherit CSS direction

The opening intro is a `canvas`. It sets the drawing context from `document.dir`: `rtl` when the document is right-to-left, otherwise `ltr`. A CSS property does not reach the pixels. Without that line, the name on the canvas sits against the page, even if `html` is correct. The font family on that canvas asks for Vazirmatn first in both languages. Canvas direction and the font choice are two separate lines.

The 3D scene reads `document.dir` too. Canvas text in the scene takes its direction from that, and the camera’s side of the page changes with the sign of the direction. A `dir` on the document does not mirror a WebGL graph. The scene code has to decide which edge is the start.

The font is not tied to direction either. A Persian page puts Vazirmatn first with `:lang(fa)`. A page that only has `dir="rtl"` and stays English keeps Inter. The selector looks at the document language, not at the direction.

## The share image does not inherit page direction

`ogImage` places the type from an `rtl` flag. For Persian, `x` is 1120 and `text-anchor` is `end`. For English, `x` is 80 and `text-anchor` is `start`. The `direction` attribute is written on the SVG `text` element itself. The corner circle moves too: toward the left of the image in Persian, toward the right in English. The only font file is `Vazirmatn-Bold.ttf`. System fonts are not loaded.

`dir` on `html` does not render this PNG. The image is built when the page is built, once per language, and `og:image` then points at that language’s file. Mirroring the document in a browser, without rebuilding the image, leaves the share card on the old picture. The skip link, mentioned above, is not in this family. That one is live CSS. This one is a built file.

## Direction is not a translation

Two pages can both be `dir="rtl"` and still not be translations of each other. `hreflang` turns on when the other language has a file with the same slug. Direction is not part of that decision. [The translation is a second file](/en/blog/separate-locale-routes/) is that contract.

The [collaboration](/en/services/) page sits apart from this machinery. It says what kind of work is welcome, and that the only public contact is Telegram, [@MH759](https://t.me/MH759).

If one thing stays, it is this: `dir` fixes the start of a line and carries logical properties with it. Transform origin, gradients, the canvas, the scene, the font, and the digits are each decided somewhere else.

## Further reading

- [Type, space, and the motion of a page](/en/blog/type-and-space/)
- [The measure of a line](/en/blog/reading-measure-and-rhythm/)
- [Persian and RTL](/en/topics/rtl/)
- [Focus starts where the reading starts](/en/blog/focus-and-rtl/)
- [The canonical address is the page itself](/en/blog/two-language-urls/)
