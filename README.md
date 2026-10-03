# mh-honarvar.github.io

Public personal site of **Mohammad Honarvar** — bilingual (فارسی / English) blog, projects and about page with an interactive 3D background.

Live: https://mh-honarvar.github.io/

## Writing a post

Add a Markdown file to `src/content/blog/fa/` or `src/content/blog/en/`:

```md
---
title: Post title
description: One-line summary
date: 2026-10-03
tags: [design, web]
---

Text...
```

Use the same file name in both folders to link the two translations. Set `draft: true` to hide a post.

## Local development

```sh
npm install
npm run dev     # http://localhost:4321
npm run build   # static site + search index in dist/
```

## Deploy

Pushing to `main` builds and publishes through GitHub Actions (also rebuilt daily to refresh GitHub stats). In the repo settings, **Pages → Source** must be set to **GitHub Actions**.

## Comments

Enable Discussions on the repo, get the ids from https://giscus.app and fill `giscus` in `src/config.ts`.

## Hidden extras

`Ctrl K` command palette · `` ` `` terminal · ◐ theme switcher · Konami code.
