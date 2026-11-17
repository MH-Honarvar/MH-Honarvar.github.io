---
title: Search comes after the build
description: The build script runs astro build first, then Pagefind on dist. The search index is a static file, not a service.
date: 2026-11-21
tags: [static, performance]
---

Search on this site is not a service. The `build` script in `package.json` is `astro build && pagefind --site dist`. Astro writes the output into `dist` first. Pagefind then reads that folder and leaves the index beside the files.

The order is deliberate. Until a page has been built, there is no index entry to point at it. The index ships with the build, in the same static files. A query is not reported to a server, and the index is not analytics.

A page that is not in `dist` is not in this index. A draft, if it is never built, is never found.
