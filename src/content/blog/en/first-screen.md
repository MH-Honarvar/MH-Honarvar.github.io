---
title: The heading does not wait
description: The home heading is already in the HTML. The intro canvas keeps to the free space beside it, and skip works at once, before the font or the particles.
date: 2026-10-14
tags: [performance, motion]
---

The first mistake a home page can make is to hold the title. On this site the heading is an `h1` in the document. The intro is a layer on that same page, not a screen that has to finish before the title exists. Its background is transparent. The heading does not wait on particles, a font load, or a timer.

The layout renders the intro only when the page asks. The home page asks. An article does not. Where GSAP and Lenis stay out of an essay is [When the animation stays out](/en/blog/when-to-skip-the-animation/). This note is only the first moment of the home page.

## The title is already in the document

The intro layer is `position: fixed`, with `pointer-events: none` and an automatic `z-index`. The background is transparent. The canvas inside it has a CSS width and height of zero until the script measures a free rectangle. Until that measurement, the canvas has no box to lay over the type.

The script reads the box of `.hero h1`. That heading is the line already on the page. It is not copy the canvas has to draw before anyone can read it. If the box is still tiny, under eight pixels in either dimension, the script treats the heading as unplaced and measures the canvas against a twenty-four-pixel inset of the whole viewport. In the ordinary case the box is there, and the canvas has to stay clear of it.

The skip control is outside that calculation. It is `position: fixed`, at `z-index` 80, with its own pointer events, on the inline end. It is visible on first paint. It does not wait for the font, and it does not wait for the first particle frame.

## The canvas takes the leftover rectangle

The pad is twenty-four pixels. If the heading is wide, more than sixty-two percent of the viewport, and it sits at least three pads down from the top, the canvas height is only the gap above the heading. The particles do not run underneath the title.

If the page is right to left and that wide case does not apply, the canvas width stops at the heading’s left edge. On a left-to-right page the canvas starts at the heading’s right edge plus the same pad. In all three cases the heading’s rectangle is not given to the canvas. The drawing is in the space left over, not on the `h1`.

If that leftover is narrower than 140 pixels or shorter than 96, the intro ends at once. No particles are drawn. The layer fades and leaves the document after 320 milliseconds. A crowded first screen does not grow a second screen on top of the words.

## Skip does not wait for the font

A click on the button and the Escape key both call `finish`. That function does not wait for `document.fonts.load`. It marks the session with `intro-seen`, adds the class `out`, dispatches `introout`, and removes the node after 320 milliseconds. The fade is opacity, 0.28 seconds. The layer does not scale.

The particle drawing does wait, briefly, and the heading is not part of that wait. The two name lines are requested at weight 800 and 40 pixels, from Vazirmatn and Inter. That request races a 120-millisecond timeout. Whichever finishes first lets the drawing start. If the font is late, the particles start with whatever face is already there, and the heading was already readable. The motion itself runs for about 0.62 seconds and then calls the same `finish`.

The offscreen canvas takes its direction from `document.dir`. Persian is drawn right to left. This canvas is two-dimensional. It is not Three.js, and it is not the hero renderer. Treating them as one thing makes the page sound heavier than this layer is.

## When the layer is never built

An inline script, ahead of the module, checks two things. If `sessionStorage` already holds `intro-seen`, or if `prefers-reduced-motion` matches, the intro element is removed. No canvas is created. A return in the same session does not see the intro again. A reader who asked for less motion does not get the layer.

The query `intro=1` clears that key so the layer can be watched again on purpose. The switch is for looking. It is not a gate. The heading stays in the document either way. Later motion on the page listens for `introout`, and if there is no layer it starts at once. Removing the intro does not hold the rest of the home page.

## The first screen is not the rest of the site

The home page can still have its own scene. That scene is not this intro. The intro is allowed to end, it stays off the heading, and it can be skipped from the first moment. An article you open does not include the layer. The article route sets motion to plain and does not mount this canvas.

I am not attaching a speed score to that. I did not run a lab for this note. What the code shows is simpler: the heading is in the HTML, the canvas does not take the heading’s rectangle, and skip does not depend on the font or the particles.

The notes about not sending an extra file down with the page are gathered under [A fast page](/en/topics/speed/). The work I take on, and what never becomes a public write-up, is [Collaborate](/en/services/).
