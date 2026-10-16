---
title: Focus starts where the reading starts
description: The skip link is first in Tab order and uses inset-inline-start, so on a Persian page it sits at the right. The focus ring does not invent a second edge.
date: 2026-10-14
tags: [rtl, focus]
---

Persian reading starts on the right. If Tab starts on the left, the eye and the hand take two paths. This site does not reorder focus with `tabindex`. Order is document order. What is read first has to come first in the document, and the right-to-left layout has to show that same order from the right edge.

The cluster is [the right-to-left topic](/en/topics/rtl/). The language routes are in [Two routes, not a flipped page](/en/blog/persian-rtl-interface/). The short direction note is [Put right-to-left in on day one](/en/blog/rtl/).

## The skip link is the first control

The first focusable thing in `body` is the skip link. Its `href` is `#main`, and the label comes from the dictionary: “Skip to content.” It sits off the page with `translateY(-140%)`, and `inset-inline-start: 1rem` pins it to the start edge. On a Persian page that edge is the right. On an English page it is the left. There is no separate `left` rule.

It returns on `:focus`, not only on `:focus-visible`. Until it is focused it cannot be seen, because there is nowhere to click it. After the jump, focus moves to `#main` and the header is skipped.

When the home intro is on, the “Skip intro” button comes after the skip link in the document and before the header. On screen it sits at the bottom, on the end edge, with `inset-inline-end`. Where it is seen and where Tab meets it are not the same place. That exception is a temporary control, not the pattern for the menu.

## The ring is around the element itself

`:focus-visible` in the global stylesheet is a 2px line in the accent color, with `outline-offset: 3px`. The ring is drawn around the element that has focus. Page direction does not throw the ring to the other edge. If `dir` has placed the element on the right, the ring is there too.

The ring is not everywhere. The command palette input sets `outline: none`, and the selected row is marked with a background and a `box-shadow`. Blog search draws its own line on `:focus`, not on `:focus-visible`. The rail beside the home page reveals its label on `:focus-visible`, the same way it does on hover. The custom cursor is `aria-hidden` and only exists for a fine pointer. It is not in the Tab order.

## Document order is the reading order

The header runs: mark, then home, blog, projects, and about, then the tools. The nav is `display: flex` without `row-reverse`. In a right-to-left document, the flex start is the right edge. The first link, home, sits where reading starts. Tab takes that same path.

`aria-current="page"` is set on the active link. It announces state. It does not move the link.

On a narrow width the same `nav` is moved to the bottom of the screen with CSS: `position: fixed` and `bottom`. In the document it is still inside the header. The eye sees it at the end of the page, and Tab still reaches it before `#main`. This is one place where placement and focus come apart. The touch target moved. The document order did not.

The back-to-top button is after the footer in the document, placed with `inset-inline-end`. Until it has the `show` class it is transparent and has no `pointer-events`, but it is not removed from the document. The keyboard can reach a button that is not yet visible. I have not hidden that behind a magical order.

## What should stay out of that order

The page atmosphere, the footer glow, and the scene canvas are `aria-hidden`. Click and Tab do not reach them. Repository names and code use `dir="ltr"` so Latin is not mirrored. That island is left-to-right inside itself. Around it, the page is still Persian.

This behavior is tied to the language. An English page has a left-to-right document, and the same skip link goes to the left edge. They are two files, not one page that only slides the ring. [The canonical address is the page itself](/en/blog/two-language-urls/).

The [collaboration](/en/services/) page keeps contact apart from this machinery. The only public way is Telegram, [@MH759](https://t.me/MH759). How the site is built is in [Why I rebuilt this site](/en/blog/hello-world/), and the short version is [This site](/en/blog/this-site/).

If one thing stays, it is this: I did not force focus to the right with a `tabindex` number. The document is arranged in reading order, and `dir` shows that order from the right edge.
