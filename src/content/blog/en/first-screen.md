---
title: The heading does not wait
description: The home heading is already in the HTML. The intro is a CSS line over the page, and a click or Escape dismisses it without waiting for a font.
date: 2026-10-14
tags: [performance, motion]
---

The first mistake a home page can make is to hold the title. On this site the heading is an `h1` in the document. The intro is a layer on that same page, not a screen that has to finish before the title exists. Its background is the page color, `--bg`. The heading does not wait on the line.

The layout renders the intro only when the page asks. The home page asks. An article does not. Where GSAP and Lenis stay out of an essay is [When the animation stays out](/en/blog/when-to-skip-the-animation/). This note is only the first moment of the home page.

## The line is CSS

The layer is `position: fixed`, covering the viewport, at `z-index` 90. A one-pixel rule sits in the center. It scales from zero to full width in `0.9s`. On a right-to-left page the origin is the right edge. On a left-to-right page a separate rule moves that origin to the left. There is no canvas, no particle, and no `document.fonts.load`.

A click on the layer, or Escape, ends it. The script marks `intro-seen`, adds the class `out`, and dispatches `introout`. The node is removed after `700ms`. If nobody clicks, the same ending starts itself after `980ms`. There is no separate skip button.

## When the layer is never built

An inline script checks two things. If `sessionStorage` already holds `intro-seen`, or if `prefers-reduced-motion` matches, the intro element is removed before the line runs. A return in the same session does not see the intro again. A reader who asked for less motion does not get the layer.

The query `intro=1` clears that key so the layer can be watched again on purpose. The switch is for looking. It is not a gate. The heading stays in the document either way. Later motion on the page listens for `introout`, and if there is no layer it starts at once. Removing the intro does not hold the rest of the home page.

## The first screen is not the rest of the site

The home page can still have its own scene. That scene is not this intro. The intro is a CSS line, and it can be dismissed from the first moment. An article you open does not include the layer. The article route sets motion to plain and does not mount this layer.

I am not attaching a speed score to that. I did not run a lab for this note. What the code shows is simpler: the heading is in the HTML, the intro is a line, and dismissing it does not depend on a font.

The notes about not sending an extra file down with the page are gathered under [A fast page](/en/topics/speed/). The work I take on, and what never becomes a public write-up, is [Collaborate](/en/services/).
