---
title: The title and the button before the scene
description: On this site’s home page the heading and the work button are in the HTML. The Three.js scene sits behind them, and if it is late the words stay put.
date: 2026-11-13
tags: [performance, motion]
---

The home page of this site has an `h1` in the document and a button that goes to the work. Both are HTML. The Three.js scene sits behind that block. If the scene is late, or never arrives, the title and the button can still be read and used.

This is not the Karkia landing. That page is static and has no 3D scene. Here the scene exists, so it has to be clear what does not depend on it.

## What does not wait on the canvas

The title comes from the page’s type, not from a texture WebGL draws. The button is a link. Its destination is the work page, not a point on the canvas. The click is not tied to the renderer being ready.

The particles and the intro, when they are there, are a layer beside the title. The title itself is described more closely in [the note on this site’s first moment](/en/blog/first-screen/). This note is only the boundary: the scene is decoration behind the words, not a substitute for them.

## When less motion is requested

If the system asks for less motion, the page still has the title and the button. The scene does not have to finish for the home page to be understood. Someone who only reads the text still gets the introduction and the link to the work.

A landing that draws its button inside the canvas has no next step until the scene arrives. Here the next step is in the document from the start.
