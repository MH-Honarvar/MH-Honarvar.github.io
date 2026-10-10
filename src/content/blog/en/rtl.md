---
title: Put right-to-left in on day one
description: This site gives Persian and English their own paths. Direction, type, and private cards were part of the layout from the start.
date: 2026-10-10
tags: [design, web]
---

Add right-to-left at the end and spacing, icons, and the menu slip. Here there are two pages from the start, not one page that gets flipped later.

## Each language has its own path

Persian lives under `/fa/` and English under `/en/`. A title, description, and a post with the same slug point at each other. If the pair does not exist, the page does not pretend there is a translation.

## Direction and type follow the language

The Persian page sets `dir` to right-to-left and uses Vazirmatn. English stays left-to-right and leads with Inter. Persian dates use the solar calendar.

## Private means a name and a span

A private project card has no description, topics, link, or commit message. You only see the name, the language, the activity window, and the past year's commit count. Client detail stays off this site.
