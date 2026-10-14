---
title: This site
description: Mohammad Honarvar’s personal site, static in Astro, TypeScript, and Three.js. Persian and English are two addresses, and client work is not written up here.
date: 2026-10-13
updated: 2026-10-14
tags: [web]
---

This is my personal site. It is the public side: bilingual pages, in Persian and English. It is built with Astro, TypeScript, and Three.js, and published as a static site on GitHub Pages. Client work stays in private repositories. It is not written up here.

Those three sentences used to be the whole page. This version keeps the same claims and shows where they sit in the code.

## Two addresses, one origin

Persian lives under `/fa/` and English under `/en/`. The document is `fa-IR` or `en-US`, and `dir` comes from that choice. The root `/` is not content. It is `noindex`, and its canonical URL is `/fa/`. A post with a twin emits `hreflang` to the translation. A post without one does not claim a translation. The contract is in [The canonical address is the page itself](/en/blog/two-language-urls/), and the longer route note is [Two routes, not a flipped page](/en/blog/persian-rtl-interface/).

The direction cluster is [the right-to-left topic](/en/topics/rtl/). The short note in that cluster is [Put right-to-left in on day one](/en/blog/rtl/).

## What is allowed on the page

The first screen may ask for a scene. A blog post turns rich motion off. Lenis and GSAP do not load on an article, because the reading bar is there and `data-motion` is `plain`. If the system asks for less motion, the intro and the scene canvas step aside.

`Ctrl` and `K` open the palette. The palette lists both languages and does not merge the page. Keyboard focus has another order: the skip link is first, then the header, then `#main`. That order is opened up in [Focus starts where the reading starts](/en/blog/focus-and-rtl/).

The first post, [Hello world — why I rebuilt this site](/en/blog/hello-world/), says the same tools with the reason the site was rebuilt.

## What does not appear

A private card is a name and a span, not a write-up of the work. There is no public email on the site. The [collaboration](/en/services/) page leaves the only contact on Telegram, [@MH759](https://t.me/MH759).

If one thing stays, it is this: this domain is the public side, static and bilingual, and it does not show what a file or a card has not allowed.
