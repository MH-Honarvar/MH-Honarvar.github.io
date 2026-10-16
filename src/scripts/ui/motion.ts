import type Lenis from 'lenis';

const reduced = document.documentElement.classList.contains('no-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const reading = !!document.getElementById('read-progress');
const rich = document.documentElement.dataset.motion === 'rich' && !reading;

addEventListener('pageswap', (e) => {
  const vt = (e as PageSwapEvent).viewTransition;
  if (!vt) return;
  if (reduced) {
    vt.skipTransition();
    return;
  }
  const timer = setTimeout(() => vt.skipTransition(), 400);
  vt.finished.finally(() => clearTimeout(timer));
});

// Split by words, not letters: per-letter spans break Persian glyph joining.
document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  const hl = el.dataset.highlight;
  el.textContent = '';
  el.setAttribute('aria-label', words.join(' '));
  for (const w of words) {
    const outer = document.createElement('span');
    outer.className = 'split-word';
    outer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.textContent = w;
    if (hl && w.replace(/[.,،]/g, '') === hl) inner.className = 'hl';
    outer.append(inner);
    el.append(outer, ' ');
  }
});

let lenis: Lenis | undefined;

const startEntrances = async () => {
if (rich && !reduced) {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  const { default: Lenis } = await import('lenis');
  gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const end = Number(el.dataset.count);
  if (reduced || !end) return;
  const fmt = new Intl.NumberFormat(document.documentElement.lang.startsWith('fa') ? 'fa-IR' : 'en-US');
  const state = { v: 0 };
  gsap.to(state, {
    v: end,
    duration: 1.8,
    ease: 'power3.out',
    delay: 0.4,
    onStart: () => (el.textContent = fmt.format(0)),
    onUpdate: () => (el.textContent = fmt.format(Math.round(state.v))),
    scrollTrigger: { trigger: el, start: 'top 95%' },
  });
});

const depth = document.querySelector<HTMLElement>('[data-depth]');
if (depth && !reduced && matchMedia('(pointer: fine)').matches) {
  let px = 0;
  let py = 0;
  let raf = 0;
  const paint = () => {
    raf = 0;
    const rect = depth.getBoundingClientRect();
    const x = px / innerWidth - 0.5;
    const y = py / innerHeight - 0.5;
    depth.style.transform = `translate3d(${(-x * 14).toFixed(2)}px, ${(-y * 10).toFixed(2)}px, 0)`;
    depth.style.setProperty('--hx', `${px - rect.left}px`);
    depth.style.setProperty('--hy', `${py - rect.top}px`);
    depth.classList.add('lit');
  };
  addEventListener('pointermove', (e) => {
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(paint);
  }, { passive: true });
  depth.addEventListener('pointerleave', () => depth.classList.remove('lit'));
}

  const smooth = new Lenis({ lerp: 0.1 });
  lenis = smooth;
  smooth.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => smooth.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const inHero = !!el.closest('.hero');
    if (inHero && el.tagName === 'H1') return;
    gsap.from(el.querySelectorAll('.split-word > span'), {
      yPercent: 110,
      opacity: 0,
      immediateRender: false,
      rotate: inHero ? 0 : 4,
      duration: inHero ? 1.15 : 1,
      ease: inHero ? 'power4.out' : 'expo.out',
      stagger: {
        each: inHero ? 0.042 : 0.06,
        from: inHero && document.dir === 'rtl' ? 'end' : 'start',
      },
      delay: Number(el.dataset.delay ?? 0),
    });
  });

  // Hide .reveal only after GSAP is loaded and this route will animate.
  // Reduced motion never reaches here, so is-motion is never added.
  if (!reduced) document.documentElement.classList.add('is-motion');

  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: (i % 4) * 0.08,
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      },
    );
  });
}
};
document.addEventListener('site-scroll', (e) => {
  const id = (e as CustomEvent<string>).detail;
  if (id === 'top') {
    if (lenis) lenis.scrollTo(0, { duration: 1.05 });
    else scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.05 });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
});

const introEl = document.getElementById('intro');
if (introEl && !introEl.classList.contains('out')) addEventListener('introout', startEntrances, { once: true });
else startEntrances();

const progress = document.getElementById('read-progress');
if (progress) {
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

const canTilt = !reduced && matchMedia('(hover: hover) and (pointer: fine)').matches;
document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
  if (!canTilt) return;
  const rest = () => {
    card.style.transform = '';
  };
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(0)`;
    card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  });
  card.addEventListener('pointerleave', rest);
  card.addEventListener('pointercancel', rest);
});

const fa = document.documentElement.lang.startsWith('fa');
const copyLabel = fa ? 'کپی' : 'copy';
const copiedLabel = fa ? 'کپی شد' : 'copied';
document.querySelectorAll('pre').forEach((pre) => {
  if (pre.querySelector('.copy-btn')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.textContent = copyLabel;
  btn.setAttribute('aria-label', fa ? 'کپی کردن کد' : 'Copy code');
  btn.addEventListener('click', async () => {
    const code = pre.querySelector('code')?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = '✓';
      btn.setAttribute('aria-label', copiedLabel);
    } catch {
      btn.setAttribute('aria-label', fa ? 'کپی ناموفق بود' : 'Copy failed');
    }
    setTimeout(() => {
      btn.textContent = copyLabel;
      btn.setAttribute('aria-label', fa ? 'کپی کردن کد' : 'Copy code');
    }, 1500);
  });
  pre.append(btn);
});
