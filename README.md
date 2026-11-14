# mh-honarvar.github.io

Personal site of Mohammad Honarvar (محمد هنرور). Persian and English, on separate locale routes.

https://mh-honarvar.github.io/

Astro and TypeScript build the pages. Three.js is the scene. GSAP and Lenis handle motion. Vazirmatn and Inter are the type. Pagefind indexes the built site. Sitemap and RSS ship with the build.

The blog is paired: the same essays in `src/content/blog/en` and `src/content/blog/fa`, on RTL, the first screen, Persian type, and when a static page should skip animation.

```sh
npm install
npm run dev
```

`npm run build` runs the Astro build, then Pagefind on `dist`.
