---
title: The third shortcut sits beside the map
description: Ctrl K opens the command dialog. The bar and the HTML map stay where they are. The shortcut does not replace them.
date: 2026-11-22
tags: [static, bilingual]
---

`Ctrl K`, and `⌘ K` on a Mac, opens or closes the command dialog from `CommandPalette.astro`. The listener is in `palette.ts`: when `ctrlKey` or `metaKey` arrives with `KeyK`, it calls `preventDefault` and toggles the `#cmd` dialog.

The list inside the dialog comes from a JSON block in the page itself, with the id `site-index`. That list is written when the page is built. It is not a separate service. The list holds both languages. Search puts the language of the page first and keeps twelve hits.

The bar at the top of the page is still a way through. [The HTML map](/en/blog/the-html-map/) is still a page you can read, at its own address. The shortcut sits beside those two. Without a keyboard, the bar and the map are enough.
