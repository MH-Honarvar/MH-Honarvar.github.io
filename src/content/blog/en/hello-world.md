---
title: "Why I rebuilt this site"
description: "The first post on this blog: the site is static Astro and Three.js, and motion loads only when that page asks for it and reduced motion is off."
date: 2026-10-03
updated: 2026-10-14
tags: [design, web]
---

This is the first post on the blog. I rebuilt the site because I wanted a page whose feeling is obvious in the moment it opens: the type, the space, and Persian in the layout from the start rather than patched on at the end. Client work is not here. This is the public side.

The short note [This site](/en/blog/this-site/) says the same limit in a few sentences. The right-to-left cluster is gathered under [the right-to-left topic](/en/topics/rtl/). The longer walk through the language routes is [Two routes, not a flipped page](/en/blog/persian-rtl-interface/).

## The page is finished when it is built

The main tool is Astro, with TypeScript. Every public page under `/fa/` or `/en/` is built once and stays a static file. It is published on GitHub Pages. There is no dictionary the browser swaps after load. Interface copy comes from `src/i18n/ui.ts`, and posts come from their own language folder.

Three.js builds the sphere on the first screen. The shader in `blob.ts` is attached to that material. It is not a canvas every page is required to load. If the system asks for less motion, the scene canvas is never created. The opening intro is removed too, once it has been seen or when reduced motion is on.

GSAP and Lenis load only when the page asks for rich motion, the reading-progress bar is absent, and reduced motion is off. Blog posts turn `motion` off and they have that bar, so smooth scrolling stays off the article. Motion is not decoration on every URL. The note [Put right-to-left in on day one](/en/blog/rtl/) is about direction, not about this toolchain.

## Two shortcuts, both from the keyboard

`Ctrl` and `K` open the command palette. Its index is filled at build time from both languages: the fixed pages and the post titles. Each row keeps its own address. The dialog is left-to-right. A Persian title inside a result keeps its own direction with `dir="auto"`. Keyboard selection uses the `sel` class, not the global focus ring. The palette input has no `outline`.

The `` ` `` key opens a terminal. That dialog is `dir="ltr"`. `help` means something there. These shortcuts do not replace the menu. The menu is still in the header, and Tab reaches it in document order. Why that order has to match Persian reading is in [Focus starts where the reading starts](/en/blog/focus-and-rtl/).

## What stays public

A private repository does not reach this page: not the name, not the description, not the link. No client name is invented.

The [collaboration](/en/services/) page says what kind of work is welcome. The only public contact is Telegram, [@MH759](https://t.me/MH759).

The addresses are not shared either. Persian and English are two files. If the twin is missing, the page does not claim a translation. That contract is in [The canonical address is the page itself](/en/blog/two-language-urls/).

## Each post is one markdown file

The blog collection requires `title`, `description`, and `date`. `updated` and tags are optional. `draft` defaults to off, and a draft is left out of the production list. The filename is the slug. That same file’s body is what the reading time is counted from, and the article page places it beside the date. The date goes through `formatDate` in the page language. The frontmatter title is the only `h1`. The body does not add another.

Comments under a post are wired for giscus, but only when `repoId` and `categoryId` are set. Both are empty in the current config, so the comments block is not on the page. I have not filled the gap with a fake box.

The blog index lists only that language’s posts. Counts are formatted with `fa-IR` or `en-US`. Search on that page is Pagefind, and it does not mix in the other language. The command palette does the opposite: it holds both trees, because it is a jump list, not one language’s index.

## Three themes, one document

The default theme is `neon`. The header button cycles `neon`, `cyber`, and `light`, and stores the name in `localStorage`. Before paint, a small script reads that value onto `html`, so a saved theme does not flash the default. `theme-color` changes with it: the dark ground, the cyber green, or the light ground.

The same script adds `no-motion` when `prefers-reduced-motion` is on. View transitions are cut in that case too. Rich motion and theme are two switches. One is `data-motion`, chosen when the page is built. The other is what the reader changes in the browser.

The about page shows a clock in `Asia/Tehran`, in the page’s locale. The label is “my time in Tehran.” It does not become a street address, and the site does not invent a public email beside it.

If one thing stays from this post, it is this: the site is built for the feeling of the first moment, as a static page in two languages, with motion that has to justify itself.
