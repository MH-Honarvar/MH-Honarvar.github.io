---
title: When the animation stays out
description: GSAP and Lenis stay unloaded on articles and whenever reduced motion is set. The home intro is a CSS line, and a click or Escape dismisses it at once.
date: 2026-10-14
tags: [performance, motion]
---

Animation is easy to defend in the abstract and expensive in the file that actually arrives. A library has to be fetched, and a scroll hijack has to be worth more than the wheel the reader already has. The line does not have to start invisible for an entrance to exist. On this site those costs are gated. An article does not pay them. A reader who has asked for less motion does not pay them either.

The faces, the measure, and the decision not to split Persian into letters are in [Type, space, and the motion of a page](/en/blog/type-and-space/). This note is only about when the motion is allowed to start.

## The document carries a flag

The layout sets `data-motion` to `rich` or `plain`. The default, in the layout props, is `plain`. The home page and the projects page pass motion on, so those two are `rich`. The blog index and the about page keep that default. Article pages pass motion off. The collaboration page is plain as well. Plain is not a visual theme. It is a refusal to import the animation libraries.

A small script in the head checks `prefers-reduced-motion`. If it matches, the root element receives the class `no-motion` before the body is parsed. The motion module then treats the page as reduced when that class is present or when the media query matches on its own. Both checks exist because one of them can be true before the other has been observed.

GSAP, ScrollTrigger, and Lenis are dynamic imports inside a single condition: motion is rich, and the page is not reduced. If either half fails, those modules are not fetched. The file at the top of the motion script imports Lenis as a type only, which does not ship the library. Entrances, number counts, the smooth-scroll instance, and the word lift all live in that same block. Skip the block and none of them run. Skipping that download is the point. I am not turning it into a score.

## An essay does not earn a scroll library

Lenis, when it does start, uses a lerp of `0.1` and drives GSAP’s ticker. It takes the wheel. On a short home page I accept that trade. On an essay I do not. The reader is moving through paragraphs at their own rate, including a scrollbar, a keyboard, or a find-in-page jump. A smoothed scroll fights all three.

Article pages keep the native scroller. A bar at the top, three pixels tall, sets `scaleX` from the scroll position. Its origin flips to the right when the document direction is right to left. A chip counts minutes left from the prose block’s rectangle. The table of contents watches headings with an intersection observer and, on a narrow screen, scrolls the active link into the horizontal strip. If motion is reduced, that small scroll uses `auto` rather than `smooth`. None of this imports Lenis.

The back-to-top control follows the same split. If the page is reduced, it calls `scrollTo(0, 0)` and stops. Otherwise it fires a `site-scroll` event. If a Lenis instance exists, that instance scrolls over `1.05` seconds. If it does not, the page uses a native smooth scroll, or `auto` when reduced. An article never has the instance, so the button cannot offer a library it did not load.

Word splitting still runs for any element marked `data-split`, because that loop sits outside the library import. It wraps words, not letters, so a Persian join survives. Article titles are not marked. The blog index heading is. The lift itself, a `yPercent` of `110` with a stagger, stays inside the GSAP block and does not run when the libraries stay out.

## The entrance arrives with the motion

The resting state of `.reveal` is opacity `1`, with no transform. Opacity `0` and `translateY(30px)` apply only under `html.is-motion`, and that class is added after GSAP starts on the home page and the projects page. If the library does not arrive, the class is not added and the line stays visible. Reduced motion and `html.no-motion` keep that same opacity of `1`.

View transitions are the same bargain at the edge of a navigation. The stylesheet runs a `0.28s` opacity animation on the root, and turns it off when reduced motion is set or when `no-motion` is on the root. On `pageswap`, a reduced page skips the transition immediately. A transition that is still going after `400ms` is skipped too. It may be brief. It may not become the page.

The article does not dim its paragraphs. Nothing drops to opacity `0.55`, because that state is not on the page. The reading column does not depend on it. [The measure of a line](/en/blog/reading-measure-and-rhythm/) is still where that column is specified.

## The intro is optional from the first frame

The intro exists on the home page only. The layout renders it when the page asks, and the home page is the page that asks. It is a full-screen layer with the page color, `--bg`, not a canvas and not particles. A one-pixel line in the center scales from zero to full width in `0.9s`. On a right-to-left page the origin is the right edge. On a left-to-right page it is the left. `document.fonts.load` is not part of this layer.

A click on the layer, or Escape, ends it. Finish marks the session, adds the class `out`, and tells the rest of the page the intro is over so entrances may begin. The node is removed after the fade, on a `700ms` timer. If nobody clicks, the same ending starts itself after `980ms`. There is no separate skip button.

An inline script removes the intro before the line runs if `sessionStorage` already has `intro-seen`, or if `prefers-reduced-motion` matches. A return in the same session does not replay it. A query of `intro=1` clears the flag so the layer can be seen again on purpose. That switch is for looking at the intro, not a gate in front of the heading.

The intro is not Three.js, and it is not a canvas. It is a CSS line. The hero scene is a different thing, and the next section is about that.

## Where a scene is still allowed to start

Three.js is limited to two places. The home hero mounts a canvas and, from an idle callback, imports the scene module. If reduced motion matches, that canvas is removed before the import, so the library is not fetched for the hero. The projects page has a different canvas, the commit city. Its module is imported when the canvas scrolls into view, not on first paint. Inside that module, reduced motion turns auto-rotate off and does not keep a continuous animation loop. The scene draws when the camera changes or the pointer moves. The article template mounts neither canvas, so an essay never starts either import.

The reasons those two scenes exist, and why the other pages do not share them, are in [A static page, and when the scene earns its keep](/en/blog/static-pages-and-webgl/).

The custom cursor wants a fine pointer and no reduced motion. Card tilt returns immediately on a reduced page. A touch screen does not get a fake cursor.

## What I still let move

On a rich page, without a reduced-motion preference, the libraries do load: the number count, the reveals, the word lift, Lenis, and the home scene after the intro. That is the version I want when someone has not asked for a quieter page.

The other version is the one an article always gets, and the one every page gets when `prefers-reduced-motion` is set. Text at the real weight, native scrolling, reveals already visible, no intro canvas, no hero renderer. [What a static page owes the reader](/en/blog/what-a-static-page-owes-the-reader/) is the promise under that version: the words are in the file before any of these scripts decide to run. What I take on, and what stays off this domain, is [Collaborate](/en/services/).

If you trace one request, trace an article with reduced motion on. The document is `plain` and `no-motion`. GSAP and Lenis are not imported. The home scene is not on the page. The intro is not on the page. What remains is the column, at the measure the template already chose.

## Further reading

- [Type and measure](/en/topics/type/)
- [A fast page](/en/topics/speed/)
