import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Split by words, not letters: per-letter spans break Persian glyph joining.
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const words = (el.textContent ?? '').trim().split(/\s+/);
    el.textContent = '';
    el.setAttribute('aria-label', words.join(' '));
    for (const w of words) {
      const outer = document.createElement('span');
      outer.className = 'split-word';
      outer.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.textContent = w;
      outer.append(inner);
      el.append(outer, ' ');
    }
    gsap.from(el.querySelectorAll('.split-word > span'), {
      yPercent: 110,
      opacity: 0,
      rotate: 4,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.06,
      delay: Number(el.dataset.delay ?? 0),
    });
  });

  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      delay: (i % 4) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

const progress = document.getElementById('read-progress');
if (progress) {
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
  if (reduced) return;
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(0)`;
    card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  });
  card.addEventListener('pointerleave', () => (card.style.transform = ''));
});

document.querySelectorAll('pre').forEach((pre) => {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'copy';
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? '');
    btn.textContent = '✓';
    setTimeout(() => (btn.textContent = 'copy'), 1500);
  });
  pre.append(btn);
});
