---
title: The face swaps. The line stays.
description: "Persian pages set Vazirmatn first for fa-IR. Inter on this site is Latin and Latin-extended only, and both variable faces declare font-display: swap."
date: 2026-10-14
tags: [typography, persian]
---

The first paint has to show the sentence, even when the preferred face has not arrived. This site sets Persian in Vazirmatn and Latin in Inter. Both declare `font-display: swap`. Swap means the browser may draw with a fallback first and replace it when the file arrives. Hiding the sentence until that file finishes is not the trade this stylesheet makes.

The reading measure, and the way `ch` shifts a little when the zero changes face, is [The measure of a line](/en/blog/reading-measure-and-rhythm/). This note is only the face itself: which family, which subset, and why Persian does not fall through to Inter.

## The document language flips the stack

The default stack is Inter, then Vazirmatn, then `system-ui`. That order is for an English page. Two selectors reverse it for Persian: `:lang(fa)` and `[lang|='fa']`. A Persian document is `lang="fa-IR"`. Both selectors match `fa-IR`. A selector that demanded the exact attribute `fa` would not fire, because the language attribute is `fa-IR`, not the bare tag.

When Vazirmatn is first, a Persian letter does not fall through to Inter’s Latin design. Inter has no file for that letter. Vazirmatn does. If the order stayed reversed, the word would drop to a system face and the page would wear two designs. Flipping the stack is what prevents that. It is not a general rule about every bilingual site.

Both families are variable. The weight axis runs from 100 to 900 in one file. A heading does not need a separate file for weight 800. The weight comes from that file, provided the right family won. A variable font does not help if the stack is wrong.

## Inter does not carry the unused scripts

`fonts.css` keeps two faces for Inter. One is Latin. One is Latin-extended. The comment at the top says Greek, Cyrillic, and Vietnamese are unused on this site, and they are not in the `src`. Both faces set `font-display: swap` and the weight range 100 to 900. The file format is a variable `woff2`.

The Latin subset covers the ordinary Western European range. Latin-extended covers characters that show up in names and marks on these pages, without also downloading three other scripts. A Persian page does not need this file for a Persian word. An English page does need it for body text, because Inter is first in the English stack.

Swap is declared on these faces, not as a separate site-wide rule. Each `@font-face` has its own `font-display`. If one file is late, only that range stays on the fallback, and the rest can paint with the file that has arrived. That is the point of splitting the subsets. A delay in one script does not hold the whole sentence.

## Vazirmatn is the Persian face

Vazirmatn comes from the font package, with the same `font-display: swap` and the same weight range. It ships three files. The Arabic range is there for Persian, including the zero-width non-joiner and the forms the joins need. A Latin file and a Latin-extended file are there so a product name inside a Persian sentence, Astro or Three.js, has a glyph in the same family.

On a Persian page Vazirmatn is first, so both the Persian letters and the Latin inside the sentence ask Vazirmatn first, when the character is in its range. Inter sits behind it for anything Vazirmatn does not have. On an English page the order is reversed, and Latin body text is drawn with Inter, not with Vazirmatn’s Latin. Two stacks exist so each language gets its own face.

I do not ask the font to change digits. A Persian digit is produced as a `fa-IR` string in script, not by a feature in `fonts.css` that turns Latin numerals into Persian ones. Inter’s Latin file does not contain those digits. If a number should look Persian, the character has to be Persian first, and then Vazirmatn can draw it. This note does not walk that path. It only says the face does not invent a character that is not in its file.

## Swap means the sentence is visible

`swap` does not hide the text. A fallback face is used at once, and the real face replaces it later. The line may jump a little, because an article’s measure is in `ch`, and the zero in Inter, in Vazirmatn, and in the system face are not the same width. That jump is the cost of reading the sentence while the file is still on the way. Invisible text until the preferred file finishes is the cost I will not charge.

The home intro fits this fact, though the intro is not this note. The particle drawing waits at most 120 milliseconds on `document.fonts.load`, then starts with whatever face is present. The home heading is not in that race. The heading is read with the page’s own font swap, whether or not the particles have started.

I am not attaching a lab score to any of this. I do not have a number for how long the font load takes, and I am not going to make one. The claim that is visible in the stylesheet is smaller: two families, the subsets the pages actually use, and `swap` instead of hidden text.

The notes on measure and spacing are gathered under [Type and measure](/en/topics/type/). The work I take on is [Collaborate](/en/services/), and that page does not invent a client write-up either.
