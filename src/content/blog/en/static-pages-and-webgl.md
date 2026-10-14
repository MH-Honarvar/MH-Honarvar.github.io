---
title: A static page, and when the scene earns its keep
description: This site is a static Astro build. Three.js runs on the home hero and the projects city, not on essays — and the intro can be skipped at once.
date: 2026-10-11
tags: [webgl]
---

A full-page WebGL scene is a nice first second and an expensive every other second. It costs a renderer, a shader, a pixel ratio, and often a post-processing pass. On a page whose job is reading, that cost buys nothing. This site is a static Astro build on GitHub Pages. The scene is allowed in two places. Everywhere else it is not downloaded.

The stack is short: Astro for the pages, Three.js only where a scene is the point, GSAP and Lenis only where motion is asked for.

## The page is finished before the browser opens it

Astro builds the HTML ahead of time. There is no request to a server for the article body, the about copy, or the navigation. The blog is markdown. Each language has its own folder. A post becomes a URL, an Open Graph image, and an RSS item at build time.

GitHub Pages serves those files. The site config sets the canonical host to `https://mh-honarvar.github.io` and asks for trailing slashes, so the sitemap and the links agree. Search on the blog is Pagefind, plus the command palette on Ctrl+K. Both run in the browser on files that were already built. There is no search URL a server answers. That is why `SearchAction` is not in the site schema. The palette stays. The schema claim is gone.

A scene cannot be just another component on the shared layout. A component imported from the layout is a script on every page that uses the layout. The home scene is not imported that way anymore.

## Two scenes, and a line around them

The home page mounts one canvas. Its script starts in an idle callback and imports `scripts/scene/scene.ts`, which pulls in Three.js. The scene is the hero: a shader backdrop, a blob, and on a desktop tier a bloom pass. The file still knows an ambient mode from when the same canvas sat behind every page. That mode is not wired. Posts, about, tags, and the collaboration page do not render the canvas and do not import the module.

The projects page has a different scene, the commit city. A canvas there carries a year of contribution counts. When it scrolls into view, the page imports `scripts/scene/city.ts`. Towers stand for days. Height is the count. If you never reach that section, the city module is not fetched. The repository cards and the language chart are ordinary HTML.

`prefers-reduced-motion` removes the home canvas before the import. The fallback is a CSS gradient, the same wash the other pages use as their only background. The renderer is created in a try block. If it throws, the function returns and the gradient remains.

Quality is tiered. A narrow screen or a machine with few cores stays on the lowest tier: no transmission pass and no bloom. A desktop hero can use bloom, and it drops a tier if a frame runs long. Pixel ratio is capped per tier. None of that belongs on an article, because the article never starts it.

## The intro is a moment, not a gate

The first visit can still play the name, as particles, over the home page. It used to be a solid plate for about two and a half seconds, sitting on the heading. Crawlers that run the script met the same wait, because they have no `sessionStorage` from a previous visit.

The plate is gone. The heading is in the document, under a transparent layer, and it is the same line as before. A skip control is visible at once. It does not wait for the font or for the particles. Escape skips it too. The pass is shorter. Reduced motion, or a return in the same session, removes the intro before it runs.

## When the scene is worth it

I keep the hero because the home page is a first look, and the look is part of the work: a soft field in the accent colors, reacting a little to the pointer, then getting out of the way. It is not a product demo and it does not encode a claim about clients. The city is worth it for a different reason. It pictures data the page already has — public contribution counts — and it sits below the list, not in front of the words.

I drop the scene where the job is a paragraph. An essay does not get clearer because a blob spins behind it. The about page already has small motions, a ring and a timeline, and those are CSS and a few listeners, not a renderer.

Type and the scroll library are the other half of this budget, in [Type, space, and the motion of a page](/en/blog/type-and-space/). Persian routing, which decides the heading’s direction before any shader runs, is [Two routes, not a flipped page](/en/blog/persian-rtl-interface/).

## What this is not

This is my public site, the repository `mh-honarvar.github.io`. It is not a client case study. Private repositories stay a name and an activity window. If the timing and the subject fit, the way to say so is Telegram, [@MH759](https://t.me/MH759). The kinds of work are on [Collaborate](/en/services/). A bit of personal context is on [about](/en/about/).
