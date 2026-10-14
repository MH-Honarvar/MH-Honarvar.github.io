---
title: The translation is a second file
description: An hreflang pair is the same filename in the other language folder. The new tags on these posts are not in tagPairs, so those archives stay out of the index.
date: 2026-10-14
tags: [persian, bilingual]
---

A translation on this site is not a flag on the same page. It is a second markdown file, with the same name, in the other language folder. If that file is missing, the head does not claim `hreflang`, and the language control goes to the other blog index. The Persian address and the English address are separate from the start: `/fa/` and `/en/`.

The short note [Put right-to-left in on day one](/en/blog/rtl/) is the cluster piece. [Two routes, not a flipped page](/en/blog/persian-rtl-interface/) walks the same routes with type and the calendar. This one stays on the address contract: what counts as a pair, and what is left unpaired on purpose.

## Built, not swapped in the browser

`src/pages/[lang]/` builds every public page once for `fa` and once for `en`. Home, blog, projects, about, and collaboration each take `lang` from the path. Interface copy comes from `src/i18n/ui.ts` while the static page is built. There is no dictionary the browser swaps after load.

Posts live in `src/content/blog/fa` and `src/content/blog/en`. The filename, without the extension, is the slug. `getStaticPaths` on the post route collects the other language’s slugs. `hasTwin` means the slug is in that set.

Two files are not only a language flag. A sentence can be short in English and long in Persian. If both languages shared one HTML file, the line lengths would fight. Here they never share it. Direction does not stand in for the two files. [Direction does not finish the page](/en/blog/why-css-direction-is-not-enough/) is what `dir` does not change. Digits come from the route as well, not from one shared document. That detail is in [Persian digits are not a font feature](/en/blog/persian-numerals-and-fonts/).

## The head speaks only when the twin is real

`Base.astro` emits three links when `alternate` is on: `hreflang` for the page itself (`fa-IR` or `en-US`), the other language, and `x-default` on the Persian URL. For a post, `alternate` is `hasTwin`.

When the twin exists, `altPath` is that slug in the other language, and the language control opens the translation. When it does not, `altPath` is the other blog index and `alternate` is false. The head does not advertise a translation. `og:locale:alternate` uses the same condition.

A paired slug is an English file that is a translation. A copy of the Persian markdown dropped into the English folder, with the same sentences, is not one. These three posts each have a Persian file and an English file under the same name, so the contract is on for them. The feed is separate too. Each language announces its own `/${lang}/rss.xml` in the head. That feed is not a translation of the other feed. It is the list of posts in that language.

## The sitemap is stricter than the button

The sitemap drops `/`, drops anything under `/og/`, and drops `rss.xml`. Each language has its own feed, and that feed is not in the sitemap.

For the remaining pages, if both languages are present in the sitemap links, `x-default` is added and points at the Persian URL. If either `fa-IR` or `en-US` is missing, the alternate links are cleared. A single language does not advertise a translation that is not there.

The 404 is separate. Its language is Persian, it is `noindex`, and it has no `alternate`. It is not the home page of either language. A project without a case study is also left out of the sitemap, aside from the Karkia page. That rule is not about translation. It says the sitemap keeps only addresses that are a real page worth introducing.

## A post pair is not a tag pair

A tag archive is indexed only when its name is in `tagPairs`, both sides have a multi-sentence introduction, and the tag list is a real subset of the blog rather than a copy of the whole index. The pairs listed today are `راست‌به‌چپ` with `rtl`, and `تایپوگرافی` with `typography`.

The tags on these three posts — `اعداد`, `فارسی`, `دوزبانه`, and their English names — are not in that list. Their archives stay `noindex` and out of the sitemap, even where the English name is a translation of the Persian one. The post itself still pairs by slug. A tag archive does not do that automatically.

If two tags were joined just by swapping the locale prefix, a Persian archive would point at a meaningless English URL. The code does not do that. `pairedTag` only knows the table. The tag link on the post still works, and it goes to `/fa/blog/tags/…/` or `/en/blog/tags/…/`. Leaving an archive out of the index is not the same as removing the page.

## The palette holds both trees and does not merge the page

`Base.astro` fills the command palette index from both languages while the page is built: the fixed pages, and every post title. Each row keeps its own language and its own URL. The dialog is `dir="ltr"`. A result link uses `dir="auto"`, so a Persian title keeps its own direction inside a list whose dialog is Latin.

That index is not a live translation of one page. It is two trees, already built, sitting side by side. Choosing a row goes to that language’s address. It does not flip `dir` on the page you are on. A post with no twin still appears under its own language. The palette does not claim `hreflang`. It only links.

`trailingSlash` is always on, so a post URL ends with a slash. The site origin is `https://mh-honarvar.github.io`, and `hreflang` is made absolute from that origin. A shared slug without the slash is not the URL the template builds.

## The root is not a third home

`/` is not a content page. It is `noindex, follow`. Its canonical URL is `https://mh-honarvar.github.io/fa/`. Without the script, a `noscript` refresh sends the browser to `/fa/`. With the script, the destination is `/fa/` when `navigator.language` starts with `fa`, and `/en/` otherwise. The document language on the root itself is `fa`, with no `dir`. Right-to-left direction comes from `/fa/`, not from this stop.

Two plain links sit on that page, one to Persian and one to English, for the case where the script does not run and the `noscript` refresh is not what the reader sees. Neither is a third home. The home page is `/fa/` or `/en/`, with its own copy.

## Collaboration is a route too

`/fa/services/` and `/en/services/` are two pages with their own copy, not a blog post that shares a slug. They are not in the header nav. The footer and the body link to them. The [collaboration](/en/services/) page says what kind of work is welcome and what stays private. The only public contact is Telegram, [@MH759](https://t.me/MH759).

If one thing stays, it is this: a translation you can announce is a file that is actually there. A shared slug is enough for a post. It is not enough for a tag, until that name is in the pair table.

## Further reading

- [Type, space, and the motion of a page](/en/blog/type-and-space/)
- [The measure of a line](/en/blog/reading-measure-and-rhythm/)
- [Persian and RTL](/en/topics/rtl/)
- [Focus starts where the reading starts](/en/blog/focus-and-rtl/)
- [The canonical address is the page itself](/en/blog/two-language-urls/)
