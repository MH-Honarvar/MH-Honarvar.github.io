---
title: What a static page owes the reader
description: "A static Astro page owes the sentence first: HTML already built, fonts that swap in, and no Three.js, GSAP, or Lenis billed to the essay itself."
date: 2026-10-14
tags: [static, performance]
---

A static page has a plain debt. The person who opened it should be able to read the sentence without waiting for a program to assemble that sentence, and without paying for a scene that belongs to a different URL. This site is a static Astro build. The article you are reading was markdown in a folder. At build time it became HTML, an address, and a feed item. GitHub Pages serves the file. Nothing in that path asks a server to render the paragraph on demand.

[A static page, and when the scene earns its keep](/en/blog/static-pages-and-webgl/) is the rule for where Three.js may run. This note is the other side of that rule: what the page owes even when no scene is involved.

## The words are already in the file

Astro writes the HTML ahead of time. The title, the description, the headings, and the paragraphs are in the response. There is no request that fills the article body after the document arrives. Navigation, the about copy, and this essay are the same kind of file. If a script later fails, the column is still there, because the column was not a render that the script owned.

That holds until a page hides its text in a canvas, or behind a component that will not paint until a bundle evaluates. The home page does have a canvas. It is the hero, and it is not the text. The heading is an element in the document. An essay does not have that canvas at all. The template never mounts it, and it never mounts the projects city either. Three.js is those two places. An article is neither of them, so the library is not part of opening this URL.

Search does not change the debt. The blog index can search with Pagefind in the browser, over files already built. There is no search endpoint a server answers. Why the site schema does not claim a `SearchAction` is in the scene note. Finding a page is optional. Reading the page you opened is not.

This note has no lab score attached. I did not run one for it. “Owes” means a structure: the sentence is in the HTML, and the extras are allowed to fail or to never start.

## A font that does not hide the sentence

The first paint still has to choose a face. English text is set in Inter, a variable font. Persian text is set in Vazirmatn, also variable. The document language decides the order. On an English page the stack is Inter, then Vazirmatn, then the system UI. On a Persian page Vazirmatn is first, so a Persian word is not drawn with Inter’s Latin design. Both families cover weights `100` to `900`. Inter on this site is Latin and Latin-extended only. Vazirmatn keeps its Arabic range for Persian and a Latin range for a product name inside a Persian sentence.

Both declare `font-display: swap`. The declaration is on the Inter faces in the site stylesheet, and on the Vazirmatn faces that the font package ships. Swap means the browser may draw with a fallback first and replace it when the file arrives. The line can move a little, because the measure of an article is `70ch` and `ch` follows the zero of the face that is currently in use. A small shift is the cost of showing the words during the load. Invisible text until the preferred file finishes is the cost I am not willing to charge.

The article column, the Persian line-height of `2`, and the English drop cap that Persian pages do not use are written out in [The measure of a line](/en/blog/reading-measure-and-rhythm/). They belong in this debt because a static file that is unreadable is not a gift just because it was prebuilt. The HTML has to be type you can actually follow, in the language of the URL you opened.

## Do not bill the essay for the hero

A component imported by the shared layout becomes a script on every page that uses the layout. That is why the home scene is not a casual child of the layout. The home page mounts its own canvas. The script starts from an idle callback and imports the scene module, which is what pulls Three.js. If `prefers-reduced-motion` matches, the canvas is removed before that import. The fallback is the same CSS gradient the other pages already use as their background. A failed renderer is also a return to that gradient. The essay never has to care which path the home page took, because the essay did not include the module.

The projects city is the second, and last, place. A canvas lower on that page imports its module when it enters the viewport. If you never scroll there, you do not download it. Reduced motion, inside that module, turns off auto-rotate and does not run a continuous loop. Again, none of that code is on an article route.

The intro gets lumped in with the scene, and it should not. It runs on the home page only, it draws with a 2D canvas rather than Three.js, and it can be skipped immediately. The button does not wait for the font load that the particles wait for. Escape skips it too. Reduced motion, or a return in the same session, removes the layer before it runs. An article does not render the intro component at all. You do not skip a gate that was never on the route. The heading of this page is the heading, from the first byte.

GSAP and Lenis follow the same separation. Article pages set motion to plain. The motion script imports those libraries only when the document is rich and reduced motion is off. An essay is never rich, so the imports do not happen. If the reader has set `prefers-reduced-motion`, they do not happen on the home page either. Blocks that would have animated in from opacity zero are forced visible in CSS, so a skipped library cannot hide a section. The mechanism is [When the animation stays out](/en/blog/when-to-skip-the-animation/). The debt is simply that refusing motion must leave a readable page, not a blank one.

## What “fast” is allowed to mean here

I use the word because the collaboration page uses it: pages that should open quickly, built with the tools this site is actually built with. On an essay, quickly has a specific shape. The HTML is done. The font swaps instead of holding the text. The route does not download a renderer. The route does not download a scroll library. Scroll position paints a three-pixel bar and a minutes-left chip with the browser’s own scroll events. The table of contents is a list of links to headings that are already in the document.

A slow connection can still delay a font file. The list above is a refusal, not a guarantee about the network.

## What this page is not for

This is my public site. It is not a client case study, and it does not invent a client in order to talk about speed. Private work stays a name and an activity window on the project list, without a write-up. The kinds of work I do take on are on [Collaborate](/en/services/). If the subject does not fit, the honest outcome is to say so, not to publish a fictional engagement as proof that the template is serious.

Why the pages are bilingual, and why right-to-left is part of the first layout, is the subject of [Type, space, and the motion of a page](/en/blog/type-and-space/). I am not repeating it. The debt in this essay is narrower. You opened a URL. The sentence at that URL should be in the file, in a face that is allowed to appear before it is perfect, in a column you can finish, without a hero, a city, an intro, or a scroll library attached to the visit.

If you want to see the boundary in the templates, open an article and look at what it does not import. Then open the home page and watch the idle callback ask for the scene only there. The split is the whole of the promise. A static page owes the reader the page they requested, and the chance to read it before anything decorative has its turn.

## Further reading

- [Type and measure](/en/topics/type/)
- [A fast page](/en/topics/speed/)
