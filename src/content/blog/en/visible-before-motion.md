---
title: The words are in the document first
description: "The reveal class is visible by default. Only html.is-motion hides those lines, and that class is added when home or projects actually start animating."
date: 2026-10-16
tags: [performance, reading]
---

A class named reveal is easy to misread. It sounds as if the text is waiting offstage. On this site the words are already in the HTML. The class does not take them out of the first paint. Someone opening an essay, the about page, or a topic page gets the sentence in the response itself. No script has to arrive before the line is allowed to be opaque.

Motion is a later decision, and a narrow one. The home page and the projects page are the routes that ask for an entrance. They ask by setting a flag. The flag does not hide anything by itself. Hiding starts only when the animation on one of those two pages has actually begun.

## The stylesheet shows the line

In the global stylesheet, `.reveal` sets opacity to 1 and transform to none. That is the rule a page receives if nothing else happens. The rule that hides text is a more specific selector: `html.is-motion .reveal` sets opacity to 0 and `translateY(30px)`. Two further selectors, `html:not(.is-motion) .reveal` and `html.no-motion .reveal`, set opacity back to 1 and clear the transform. They match every document that never received `is-motion`. That is most of the site.

Specificity is the point of those extra selectors. A bare class does not blank the block. Only the root class `is-motion` does. If that class is absent, the line stays visible, including where the markup still carries `reveal` because a shared pattern put the hook on a heading or a card. The hook is not a verdict that an entrance will run.

When `prefers-reduced-motion` is `reduce`, the same stylesheet sets `.reveal` and `html.is-motion .reveal` to opacity 1 and no transform. A request for less motion is not a request for an empty section.

## The class arrives with the animation

The layout writes `data-motion` on the root element. The default, in the layout props, is plain. The home page and the projects page pass motion on, so those two are `rich`. The motion script treats a page as rich only when that attribute says rich and the document has no element with the id `read-progress`. An article has that element. An article also sets motion off. It fails the test twice, which is deliberate. Reading is not the place that pays for an entrance library.

The imports sit inside one condition: the page is rich, and reduced motion is not set. GSAP, ScrollTrigger, and Lenis are dynamic imports in that branch. They are not fetched when the condition fails. After those imports resolve, and only then, the script adds `is-motion` to the document element, and only if reduced motion is still false. Reduced motion never enters the branch, so the class is never added for that reader. There is no path where the hide class is applied in hope that a library will catch up.

The entrances that follow call GSAP with `immediateRender: false`. What can disappear is the stylesheet reacting to `is-motion`, added at the moment this route is about to animate. It is not a resting opacity of zero left on `.reveal` in case a library might show up later and finish a fade. If the library is not started, the class is not added, and the opacity stays 1. The sequence in the file is the whole claim: load the library on a page that asked for it, then add the class, then run the entrance.

A separate loop wraps elements marked `data-split` into word spans. That loop sits outside the library import, so it can run on a page that never animates. The lift that would move those words, a `yPercent` and an opacity, stays inside the GSAP branch. On a plain page the words are still the text of the element. They are not parked offscreen waiting for a tween that will not be created.

## About and the blog stay readable

The about page does not pass motion. Its attribute stays plain. The blog index, a tag page, an article, a topic page, and the collaboration page are plain as well. Plain means the import branch does not run. GSAP and Lenis are not part of reading those routes. A small script on the layout is what makes the decision, and the decision is a refusal. The animation libraries stay out. About and the blog have to remain readable without them.

About still marks headings and blocks with `reveal`. That class, without `is-motion` on the root, does not blank them. The name is an `h1` in the document. The portrait is an image with a source. The paragraphs are paragraphs. None of them wait on a fade this route will not run. An essay is the same shape of fact. The prose was markdown, and the build already turned it into HTML. A thin bar at the top scales with scroll position. It is not a gate in front of the words. Find-in-page can find the sentence because the sentence is text, not a frame of an animation.

[The heading does not wait](/en/blog/first-screen/) is the other half of the first screen: the intro canvas and the skip control. That layer belongs to the home page, and the heading there is in the HTML whether or not the canvas runs. A `reveal` block lower on the same page can be hidden, briefly, once `is-motion` is on the root and the entrance has started. An article never takes that step. The home page’s intro and the reveal class are different mechanisms. Folding them into one sentence about “the animation” makes both of them sound like a cover over the type. The type is in the document either way.

## What this note will not turn into a score

I am not attaching a lab result, and I am not claiming a rank. I have not run a test for this note. What the code shows is a structure. The words are in the HTML. `.reveal` is visible unless `html.is-motion` is present. That class is added when the home page or the projects page actually starts the animation, after GSAP is loaded and reduced motion is not set. About and the blog do not start it. They stay readable with no animation library.

The notes about not sending a file the reader does not need in order to read are gathered under [A fast page](/en/topics/speed/). The person those notes name is the [about](/en/about/) page: the portrait, the name, and Telegram. The kind of work, and the only public contact, are on [Collaborate](/en/services/). That contact is Telegram, [@MH759](https://t.me/MH759). There is no public email on the site.

A topic page is a short list of notes, not every post that mentions motion. That limit is [A topic page is not the blog index](/en/blog/topic-hubs/). Why the articles point at the about page as the author is [The author is the about page](/en/blog/author-and-trust/).
