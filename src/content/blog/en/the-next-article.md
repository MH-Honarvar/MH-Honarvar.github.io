---
title: Up to three notes that share a tag
description: "Related notes are at most three same-language posts that share a tag, ranked by shared tags and then by date. The previous and next links are a separate list."
date: 2026-10-16
tags: [reading, rtl]
---

Under an essay, after the previous and next links, the template may show a short list called Related posts. The rule is small. The list is built from the same language as the page. A candidate has to share at least one tag with the essay you are reading. The list keeps at most three. Order is the number of shared tags, highest first, and then the date, newest first.

That block is not the control labeled Next post. Next and previous walk the language’s posts by date. Related walks tags. They can point at different notes, and either one can be absent.

## How the three are chosen

`src/pages/[lang]/blog/[...slug].astro` loads `getPosts(lang)`. That helper reads the blog collection, keeps files whose folder is the current language, drops drafts outside development, and sorts by date descending, then by slug. The related list starts from that array. The current slug is removed. Each remaining post is scored by how many of its tags sit in the current post’s tag set. A score of zero is dropped. The rest are sorted by score descending, then by `date` descending. `slice(0, 3)` keeps the head of that ranking.

A tie on both score and date stays in the order `getPosts` already had. The date sort is stable for equal timestamps, and the collection’s order for those ties is not a third ranking key. I will not assign first and second place to two notes that share a date and a score.

`RelatedPosts.astro` receives the three titles and URLs. If the array is empty, it renders nothing. If it is not, it renders a `nav` with the heading Related posts. That heading is an `h2` in the component. The essay’s title is the only `h1`. The links are same-language paths from `postUrl`, so an English essay never offers a Persian related note here.

The tags on this essay are `reading` and `rtl`. A note enters the list by carrying one of those, or both. [The link you send is one language](/en/blog/sharing-in-two-languages/) is tagged `bilingual` and `persian`. [The HTML map is a page you can read](/en/blog/the-html-map/) is tagged `static` and `bilingual`. Neither shares a tag with this file, so neither is a candidate. The sentences above are how those two stay reachable. The related block will look at other English notes that already use `reading` or `rtl`.

## What the score does to the other two

The sharing note and the map note do share `bilingual` with each other. On the sharing note, two older English posts share both `bilingual` and `persian`: the canonical-address note and the second-file note, both dated 2026-10-14. A score of two ranks above the map’s score of one, even though the map is dated 2026-10-16. Those two older posts occupy two of the three seats. The map is the newest post with a score of one, so it takes the remaining seat. Their order against each other, the two posts with the same score and the same date, follows the list order. Both outrank the map.

On the map note every overlap is a score of one: `static` or `bilingual`. This cluster’s sharing note is the newest of those, so it leads. Several other notes are dated 2026-10-14. The slice keeps two of them and leaves one out. Which of the equal dates remains is the earlier order, not a judgment written in the template.

None of that ranking is a measure of visits. The template never reads a counter. Date and tags are the whole comparison.

## Previous and next are the date list

`getStaticPaths` also passes `newer` and `older`. The posts are in the same date order. The item before the current one is newer and is labeled Next post. The item after it is older and is labeled Previous post. If you are at the end of the list, that side is an empty span. These three essays share the date 2026-10-16, which is later than the other notes on the blog, so they sit at the front of the date list. Among themselves the date does not separate them. The pager breaks that tie by slug, so the order stays the same from build to build. It does not consult tags.

A topic page is a fourth list. [Persian and RTL](/en/topics/rtl/) names a fixed set of slugs in `src/content/topics.ts`. Membership is the array, not a tag intersection computed at request time. The [map](/en/map/) is a fifth list, described in [The HTML map is a page you can read](/en/blog/the-html-map/). Its notes group is every post `getPosts` returns for that language. This essay is on that list because the file is in the English collection. Being related to another note does not change that.

## Same language, then the link you choose

Related posts stay in one language because `getPosts` was called with `lang`. The Persian file of this essay runs the same steps on Persian tags: `خواندن` and `راست‌به‌چپ`. Its related notes are Persian posts. `hreflang` is a different mechanism. It is emitted for the other language when `hasTwin` is true, which it is for this slug, because the Persian file exists. The related list does not use that flag. You can open the translation from the language control. You can also send this English URL on its own, which is the subject of [The link you send is one language](/en/blog/sharing-in-two-languages/). [The canonical address is the page itself](/en/blog/two-language-urls/) is the contract those head links follow.

The [collaboration](/en/services/) page is not part of the calculation. It is where the work is described, and it links onward from the footer. A related note is only another essay.

Reading order on the page is the column, then the pager, then this block if any candidate survived. Right-to-left changes where the column starts; it does not change the three-note cap or the requirement that a tag match. On a Persian page the same component prints نوشته‌های مرتبط and the same limit. The tag still has to be shared, and the language still has to be the language of the URL.

If you came from one essay and wanted another, the block is the automatic offer: up to three, same language, at least one tag in common, more overlap first, newer date next. Anything outside that rule needs an ordinary link, which is what this note uses for its siblings.
