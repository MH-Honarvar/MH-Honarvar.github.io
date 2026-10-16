---
title: A topic page is not the blog index
description: "A topic page lists a few notes on purpose. /en/topics/rtl/, /type/, and /speed/ are not the blog, and the Persian hubs are separate addresses."
date: 2026-10-16
tags: [bilingual, rtl]
---

The blog lists notes by date. A topic page does something stricter. It keeps a few essays that belong together and leaves the rest on the blog. Three of those pages exist, in each language, and none of them is a dump of every post on the site. If a note is missing from a hub, that is the list doing its job, not the index failing to update.

The index of the three sits at `/en/topics/` in English and `/fa/topics/` in Persian. Each hub then has its own address. English is `/en/topics/rtl/`, `/en/topics/type/`, and `/en/topics/speed/`. Persian is `/fa/topics/rtl/`, `/fa/topics/type/`, and `/fa/topics/speed/`. Those are six pages. A query string does not switch the language. A cookie does not either. The Persian page is a Persian document, with its own title, its own lede, and its own list of Persian notes.

## What each hub is for

`/en/topics/rtl/` and `/fa/topics/rtl/` gather notes on a Persian interface: a separate route, page direction, digits, focus, and a translation that has to be a second file. The English title is Persian and RTL. The Persian title is رابط فارسی و راست‌به‌چپ. Right-to-left here is a subject of the notes, not a stylesheet flipped over an English essay. [The canonical address is the page itself](/en/blog/two-language-urls/) is one of the notes that belongs in that set, because the address is part of the language.

`/en/topics/type/` and `/fa/topics/type/` are the line: measure, the space between letters, and when motion would interrupt reading. The English title is Type and measure. The Persian title is تایپ و فاصله. Direction and the cost of a scene are not the job of this page. They have hubs of their own, which is why this one can stay short.

`/en/topics/speed/` and `/fa/topics/speed/` are about a static page and about not downloading an animation library the reader does not need. The English title is A fast page. The Persian title is صفحه‌ی سریع. “Fast” in that lede means a file that does not arrive. It is not a score, and this note will not invent one.

Each hub has a description and a lede written for that subject. The lede says, in both languages, that the list below is those notes and not the whole blog. The topics index says the same thing one level up: the blog is the full shelf, and the index keeps only subjects that already have more than one note.

## A list written by hand

The articles on a hub are slugs written into the topic data. The page reads each slug, takes the title from that language’s markdown when the file exists, and renders a link. It does not walk every post and ask which tags overlap. Adding a tag to a new essay does not place the essay on a hub. Someone has to put the slug in the list. Until that happens, the hub stays as it was. That is the difference between a subject and a search.

Tag pages are the other tool, and they are honest about being broader. A tag address under the blog collects every note that carries the tag. It can grow whenever a post is tagged. A hub does not. Using both for the same job would make the hub a second blog index with a narrower coat of paint. The hub is allowed to omit a good essay because the essay’s main subject lives somewhere else, or because one note is enough and a cluster would be padding.

The page also says, in a line under the lede, that collaboration is a separate question. The [collaboration](/en/services/) page is not an item in the three lists. It is where the work I take on is described, and where the only public contact sits: Telegram, [@MH759](https://t.me/MH759). There is no public email. A reader who came to a hub to find a person, rather than a subject, is on the wrong list. The person is [about](/en/about/).

## Two languages, two documents

The English hub and the Persian hub for the same subject are twins in the way this site uses that word. They share a slug after the language prefix. They do not share a body. The Persian list points at Persian essays. The English list points at English essays. Titles are read from the file for that language. A slug with no file in that language is left off the list, so the hub does not link to a missing note. A reader who switches language is sent to the other address, not to a translated overlay on the same HTML.

That is the same rule as the rest of the site, written out for these pages in particular. [The canonical address is the page itself](/en/blog/two-language-urls/) is the note on canonical URLs. The hub is a plain example. `/fa/topics/rtl/` is not an alternate view of `/en/topics/rtl/`. It is the Persian page. Linking to “the RTL topic” without the language prefix would be linking to a page this site does not publish.

Topic pages set motion to plain. They do not import the animation libraries. The list is a list of links under a heading. There is nothing on the page that has to fade in before the titles can be read. How `.reveal` stays visible unless a home or projects page has actually started an entrance is [The words are in the document first](/en/blog/visible-before-motion/). A topic page never takes that step.

The structured data on a hub is an item list of the notes that were written into it, each with its title and URL. It describes that list. It does not claim to be the blog, and it does not claim a ranking among the notes. Position in the list is the order they were written down in the topic data, which is an editorial order, not a measurement.

## What I leave off the hub

I am not going to put every new note onto a hub to make the hub look complete. Completeness is the blog’s job, at `/en/blog/` and `/fa/blog/`. A hub that listed everything would stop being a way to enter one subject. The three subjects are the ones the index already names: Persian and right-to-left, type and measure, and a page that does not take an extra file. A fourth subject waits until there are notes that form one, not until a tag happens to appear twice.

This note itself is about the hubs. It is not, by being about them, automatically a member of `/en/topics/rtl/` or of `/fa/topics/rtl/`. Membership is the slug in the list. The tag on an essay is a different door.

The author those doors name is not a byline invented per hub. It is the about page, which [The author is the about page](/en/blog/author-and-trust/) describes: Mohammad Honarvar, the portrait, and Telegram. The hubs can stay about the notes.
