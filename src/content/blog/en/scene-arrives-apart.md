---
title: The scene arrives apart
description: The home page loads its Three module with a separate import. The projects city starts only once the canvas is in view. The home title is already HTML.
date: 2026-11-20
tags: [performance, motion]
---

The home title of this site is in the document. [The title and the button before the scene](/en/blog/title-before-the-scene/) already draws that line. This note only says when the scene file reaches the page.

`Scene3D.astro` puts the canvas in the HTML and loads the Three module with `import()`. That module is not in the first bundle of the page. The start function brings in `initScene` from `../scripts/scene/scene`. If the system asks for less motion, the start is immediate. Otherwise it waits on `requestIdleCallback` with a timeout of `700` milliseconds, or on one frame when that function is missing.

The city on the projects page is a different path. The `#city` canvas is watched with an `IntersectionObserver`. `initCity` is not imported from `../../scripts/scene/city` until the canvas enters the view. After the first intersection the observer disconnects. The canvas, the legend drawn on it, and the rotate control stay where they are. Only the city waits to be seen.

Essays do not carry this canvas. The home title waits on neither module.
