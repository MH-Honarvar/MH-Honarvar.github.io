---
title: The HTML map is a page you can read
description: "The HTML map at /fa/map/ and /en/map/ groups pages, the topics, every note in that language, and two cases. A new post is on the map after the next build."
date: 2026-10-16
tags: [static, bilingual]
---

The map is an HTML page. Persian is `/fa/map/` and English is [/en/map/](/en/map/). `src/pages/[lang]/map.astro` builds both, because `getStaticPaths` walks the two languages. You get a document with a title, a short lede, and four groups of links. The groups are pages, topics, notes, and cases. The links in each group use the language of the URL you opened.

This is the page I mean when I say there is an HTML map. It is not a dump of every route the build can emit, and it is not a report from a crawler. The four groups are written in the file. The notes inside one of them are every published post of that language, newest first, the same order `getPosts` uses for the blog.

## What the four groups contain

The first group is pages. The labels come from the interface copy and from the page modules: Home, About me, the collaboration page, the colophon, and Projects. Collaboration is [How we collaborate](/en/services/). It is the same page the footer links to. It is not in the header. The header is home, blog, projects, and about.

The second group is topics. The first link is the topics index. The three hubs come from `topicById`: Persian and RTL, Type and measure, and A fast page. Their paths are `/en/topics/rtl/`, `/en/topics/type/`, and `/en/topics/speed/`. [A fast page](/en/topics/speed/) is the cluster this map belongs with, in the sense that the map is a static document. `motion` is passed as false. The template does not mount a scene.

The third group is notes. The first link is the blog index. After it, every post `getPosts(lang)` returns for this language is listed, with that post’s title. A new markdown file in the language folder is on the map after the next build. Drafts stay off the list outside development.

The fourth group is cases. One link is the study of this site, the repository `mh-honarvar.github.io`, titled from that study. The other is the Karkia page. Both are same-language paths under `/en/projects/`.

## What the list leaves out

The notes group is the language’s blog, not a hand-picked `noteSlugs` array. [The link you send is one language](/en/blog/sharing-in-two-languages/), this page’s essay, and [Up to three notes that share a tag](/en/blog/the-next-article/) are files in `src/content/blog/en`, so they are on `/en/map/`. A post that exists only in the other folder is not on this map.

The command palette is a different index. `Base.astro` fills it with home, blog, projects, about, collaboration, and every post in both languages. The map, the colophon, and the topic pages are not in that array. Search keeps twelve hits and puts this language first, so the other language appears only when this language has not already filled the list. The footer links GitHub, Telegram, collaboration, and the feed. The map is not among those links. The terminal command `open map` does go to `/${lang}/map/`. You can also open [/en/map/](/en/map/) directly, or follow a link, including the one in this sentence.

[The canonical address is the page itself](/en/blog/two-language-urls/) explains when a blog post may name the other language. The map is simpler, because both language files are the same Astro page. The template does not pass `alternate`. The layout default is true, and the page is not `noindex`. The head therefore includes `hreflang` for this language, `hreflang` for the other, and `x-default` on the Persian map URL. `og:locale` is `en_US` here and `fa_IR` on `/fa/map/`. `og:locale:alternate` follows the same default. The language control swaps the `/en/` prefix for `/fa/` and opens the Persian map, because `altPath` is not overridden.

## A static list, grouped for a person

The sitemap filter keeps this path. The expression that allows topics, the colophon, the map, and collaboration returns true for `/en/map/` and for `/fa/map/`. That is a build rule about which URLs are listed for discovery. It is not a measurement of visits, and I am not treating the sitemap as a score. The HTML page is the thing a person can read without opening that file.

Each link is an anchor with a visible label. The headings are Pages, Topics, Notes, and Cases. The Persian page uses the Persian labels and the Persian titles, because `getPosts('fa')` supplies the titles for `/fa/map/` and `getPosts('en')` supplies them here. A Persian title is not reused on the English map. A post that exists in only one language appears only on that language’s map.

The page sets `data-pagefind-body` on the section, so the built search can see the labels. Search still runs in the browser over files that were already written. The map does not ask a server to assemble the groups. Astro wrote the lists when the site was built. GitHub Pages sends the file.

The blog’s related-notes block is a third kind of list, and it is not this page. [Up to three notes that share a tag](/en/blog/the-next-article/) describes it. That block looks at tags on the current post and stays inside one language. The map lists every note `getPosts` returns for this language, and stays inside that language because `postUrl` keeps the post’s folder and the `href` helper prefixes `/${lang}`. Sharing a map link, like sharing any other page, sends one of those two URLs. [The link you send is one language](/en/blog/sharing-in-two-languages/) is that rule.

If you only needed a place to start, the map is that place: a short page, two addresses, four groups someone chose, and, inside the notes, every essay of the language you opened.
