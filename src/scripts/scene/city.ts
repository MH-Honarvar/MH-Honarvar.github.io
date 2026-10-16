import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const cssColor = (name: string, fallback: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  try {
    return new THREE.Color(value || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
};
const isLight = () => document.documentElement.dataset.theme === 'light';

const DAY_GAP = 1.1;

const towerHead = /* glsl */ `
attribute float aGlow; attribute float aIdx;
uniform float uHover;
varying float vY; varying float vGlow; varying float vHover;
`;
const towerVertex = /* glsl */ `
#include <begin_vertex>
vY = position.y; vGlow = aGlow; vHover = abs(aIdx - uHover) < 0.5 ? 1.0 : 0.0;
`;
const towerFragHead = /* glsl */ `
uniform float uLight;
varying float vY; varying float vGlow; varying float vHover;
`;
const towerFrag = /* glsl */ `
#include <emissivemap_fragment>
diffuseColor.rgb *= mix(mix(0.28, 0.7, uLight), 1.0, smoothstep(0.0, 1.0, vY));
float cap = smoothstep(0.82, 1.0, vY);
totalEmissiveRadiance += diffuseColor.rgb * (cap * vGlow * mix(1.4, 0.35, uLight) + vHover * 0.9);
`;

const groundVertex = /* glsl */ `
varying vec2 vP;
void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const groundFragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uBg; uniform float uTime; uniform vec2 uToday; uniform float uLight; uniform vec2 uSize; uniform float uOdd;
varying vec2 vP;
void main(){
  vec2 p = vP;
  vec2 g = abs(fract(vec2(p.x + 0.5 * uOdd, (p.y - 3.5) / ${DAY_GAP.toFixed(2)})) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.035, min(g.x, g.y * ${DAY_GAP.toFixed(2)}));
  float fade = 1.0 - smoothstep(0.35, 1.0, length(p / uSize));
  float d = distance(p, uToday);
  float wave = exp(-pow(d - mod(uTime * 9.0, 90.0), 2.0) * 0.08);
  vec3 c = mix(uA, uB, clamp(p.x / uSize.x + 0.5, 0.0, 1.0));
  float a = (line * (0.16 + wave * 0.7) + wave * 0.05) * fade;
  gl_FragColor = vec4(c * mix(1.0, 0.8, uLight), a * mix(1.0, 0.7, uLight));
}`;

const haloVertex = /* glsl */ `
attribute float aGlow; varying vec2 vUv; varying float vGlow;
void main(){ vUv = uv; vGlow = aGlow; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`;
const haloFragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform float uLight; varying vec2 vUv; varying float vGlow;
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d) * vGlow * mix(0.55, 0.25, uLight);
  gl_FragColor = vec4(mix(uA, uB, vGlow), a);
}`;

export function initCity(canvas: HTMLCanvasElement, counts: number[], start: string, lang: 'fa' | 'en') {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return;
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 720px)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 60, 140);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);
  camera.position.set(-12, 30, 45);

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-20, 40, 20);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(25, 10, -30);
  scene.add(rim);

  const n = counts.length;
  const weeks = Math.ceil(n / 7);
  const max = Math.max(1, ...counts);
  const xOf = (i: number) => Math.floor(i / 7) - weeks / 2;
  const zOf = (i: number) => (i % 7) * DAY_GAP - 3.5;
  const heights = counts.map((c) => (c === 0 ? 0.035 : 1.1 + Math.log2(1 + c) * 2.2));
  const glow = new Float32Array(counts.map((c) => (c === 0 ? 0 : 0.25 + 0.75 * (c / max))));
  const idx = new Float32Array(counts.map((_, i) => i));

  const uLight = { value: 0 };
  const uHover = { value: -1 };
  const uA = { value: new THREE.Color() };
  const uB = { value: new THREE.Color() };
  const uBg = { value: new THREE.Color() };
  const uTime = { value: 0 };

  const geo = new THREE.BoxGeometry(0.82, 1, 0.82);
  geo.translate(0, 0.5, 0);
  geo.setAttribute('aGlow', new THREE.InstancedBufferAttribute(glow, 1));
  geo.setAttribute('aIdx', new THREE.InstancedBufferAttribute(idx, 1));
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.25 });
  mat.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, { uHover, uLight });
    s.vertexShader = s.vertexShader.replace('#include <common>', `#include <common>\n${towerHead}`).replace('#include <begin_vertex>', towerVertex);
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>\n${towerFragHead}`).replace('#include <emissivemap_fragment>', towerFrag);
  };
  const mesh = new THREE.InstancedMesh(geo, mat, n);

  const mirror = mobile ? undefined : new THREE.InstancedMesh(geo, mat.clone(), n);
  if (mirror) {
    const mm = mirror.material as THREE.MeshStandardMaterial;
    mm.onBeforeCompile = mat.onBeforeCompile;
    mm.transparent = true;
    mm.opacity = 0.12;
    mm.depthWrite = false;
    mm.side = THREE.BackSide;
    mirror.scale.y = -1;
    scene.add(mirror);
  }

  const m = new THREE.Matrix4();
  const place = (k: (i: number) => number) => {
    for (let i = 0; i < n; i++) {
      m.makeScale(1, Math.max(heights[i] * k(i), 0.001), 1).setPosition(xOf(i), 0, zOf(i));
      mesh.setMatrixAt(i, m);
      mirror?.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mirror) mirror.instanceMatrix.needsUpdate = true;
  };
  place(() => (reduced ? 1 : 0));
  scene.add(mesh);

  const size = new THREE.Vector2(weeks / 2 + 8, 14);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(size.x * 2, size.y * 2),
    new THREE.ShaderMaterial({
      uniforms: { uA, uB, uBg, uTime, uLight, uSize: { value: size }, uOdd: { value: weeks % 2 }, uToday: { value: new THREE.Vector2(xOf(n - 1), -zOf(n - 1)) } },
      vertexShader: groundVertex,
      fragmentShader: groundFragment,
      transparent: true,
      depthWrite: false,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.01;
  ground.renderOrder = 1;
  scene.add(ground);
  if (mirror) mirror.renderOrder = -2;

  const tall = counts.map((c, i) => [c, i]).filter(([c]) => c > 0);
  const haloGeo = new THREE.PlaneGeometry(1, 1);
  haloGeo.rotateX(-Math.PI / 2);
  haloGeo.setAttribute('aGlow', new THREE.InstancedBufferAttribute(new Float32Array(tall.map(([, i]) => glow[i])), 1));
  const halos = new THREE.InstancedMesh(
    haloGeo,
    new THREE.ShaderMaterial({ uniforms: { uA, uB, uLight }, vertexShader: haloVertex, fragmentShader: haloFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    Math.max(tall.length, 1),
  );
  tall.forEach(([, i], k) => {
    const s = 1.6 + glow[i] * 2.4;
    m.makeScale(s, 1, s).setPosition(xOf(i), 0.03, zOf(i));
    halos.setMatrixAt(k, m);
  });
  halos.count = tall.length;
  halos.renderOrder = 2;
  scene.add(halos);

  const labels: THREE.Mesh[] = [];
  const locale = lang === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US';
  const monthFmt = new Intl.DateTimeFormat(locale, { month: 'short' });
  const dayFmt = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', ...(lang === 'fa' ? { calendar: 'persian' } : {}) });
  const dateOf = (i: number) => new Date(new Date(start + 'T00:00:00').getTime() + i * 86400000);
  const textTex = (text: string, w = 320, h = 112, size = 64) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d')!;
    const family = getComputedStyle(document.documentElement).fontFamily;
    ctx.font = `700 ${size}px ${family}`;
    const wText = ctx.measureText(text).width;
    if (wText > w * 0.92) ctx.font = `700 ${Math.floor((size * w * 0.92) / wText)}px ${family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(text, w / 2, h / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  };
  const makeLabel = (text: string) => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.4), new THREE.MeshBasicMaterial({ map: textTex(text), transparent: true, depthWrite: false }));
    plane.rotation.x = -Math.PI / 2;
    return plane;
  };
  let lastMonth = '';
  for (let w = 0; w < weeks; w++) {
    const label = monthFmt.format(dateOf(w * 7));
    if (label === lastMonth) continue;
    const first = lastMonth === '';
    lastMonth = label;
    if (first && w > weeks - 3) continue;
    const plane = makeLabel(label);
    plane.position.set(w - weeks / 2 + 1.5, 0.02, -3.5 - 1.9);
    plane.userData.current = label === monthFmt.format(dateOf(n - 1));
    labels.push(plane);
    scene.add(plane);
  }

  const todayPos = new THREE.Vector3(xOf(n - 1), 0, zOf(n - 1));
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.4, 24, 16, 1, true).translate(0, 12, 0),
    new THREE.ShaderMaterial({
      uniforms: { uB, uTime },
      vertexShader: `varying float vY; void main(){ vY = position.y / 24.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uB; uniform float uTime; varying float vY; void main(){ float a = (1.0 - vY) * (0.35 + 0.15 * sin(uTime * 3.0)); gl_FragColor = vec4(uB, a * (1.0 - vY)); }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  beam.position.copy(todayPos);
  scene.add(beam);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 48), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.copy(todayPos).setY(0.05);
  scene.add(ring);

  const bestI = counts.reduce((b, c, i) => (c > counts[b] ? i : b), 0);
  const flag = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTex(`★ ${new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(counts[bestI])}`, 256, 96, 56), transparent: true, depthWrite: false }));
  flag.scale.set(3.4, 1.27, 1);
  flag.position.set(xOf(bestI), heights[bestI] + 1.4, zOf(bestI));
  flag.visible = counts[bestI] > 0;
  scene.add(flag);

  const applyTheme = () => {
    const a = cssColor('--accent', '#7c5cff');
    const b = cssColor('--accent2', '#3ee0c5');
    const bg = cssColor('--bg', '#07060d');
    uA.value.copy(a);
    uB.value.copy(b);
    uBg.value.copy(bg);
    uLight.value = isLight() ? 1 : 0;
    const base = bg.clone().lerp(a, isLight() ? 0.07 : 0.05);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      c.copy(counts[i] === 0 ? base : a.clone().lerp(b, counts[i] / max));
      mesh.setColorAt(i, c);
      mirror?.setColorAt(i, c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (mirror?.instanceColor) mirror.instanceColor.needsUpdate = true;
    (scene.fog as THREE.Fog).color.copy(bg);
    ambient.intensity = isLight() ? 1.1 : 0.55;
    const gm = ground.material as THREE.ShaderMaterial;
    gm.blending = isLight() ? THREE.NormalBlending : THREE.AdditiveBlending;
    gm.needsUpdate = true;
    rim.color.copy(b);
    labels.forEach((l) => {
      const lm = l.material as THREE.MeshBasicMaterial;
      if (l.userData.current) lm.color.copy(b);
      else lm.color.copy(isLight() ? new THREE.Color(0x5d5878) : a.clone().lerp(new THREE.Color(0xffffff), 0.5));
      lm.opacity = l.userData.current ? 1 : 0.7;
    });
    (beam.material as THREE.ShaderMaterial).blending = isLight() ? THREE.NormalBlending : THREE.AdditiveBlending;
    (ring.material as THREE.MeshBasicMaterial).color.copy(b);
    flag.material.color.copy(isLight() ? a : b.clone().lerp(new THREE.Color(0xffffff), 0.3));
  };
  applyTheme();
  addEventListener('themechange', applyTheme);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = !mobile;
  controls.autoRotate = !reduced && !mobile;
  controls.autoRotateSpeed = 0.35;
  controls.minAzimuthAngle = -Math.PI / 4;
  controls.maxAzimuthAngle = Math.PI / 4;
  controls.minPolarAngle = 0.02;
  controls.maxPolarAngle = Math.PI / 2.3;

  const rotateBtn = document.querySelector<HTMLButtonElement>('[data-city-rotate]');
  if (rotateBtn) {
    rotateBtn.hidden = reduced || mobile;
    rotateBtn.setAttribute('aria-pressed', String(controls.autoRotate));
    rotateBtn.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      rotateBtn.setAttribute('aria-pressed', String(controls.autoRotate));
    });
  }

  const presets: Record<string, { dir: THREE.Vector3; k: number }> = {
    full: { dir: new THREE.Vector3(-12, 30, 45).normalize(), k: 1 },
    top: { dir: new THREE.Vector3(0, 1, 0.06).normalize(), k: 1.05 },
    cine: { dir: new THREE.Vector3(-0.55, 0.16, 0.8).normalize(), k: 0.62 },
  };
  let view = 'full';
  const fit = () => {
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const half = weeks / 2 + 2;
    return Math.max(40, (half / Math.tan(hfov / 2)) * 1.35);
  };
  let tween: { p0: THREE.Vector3; p1: THREE.Vector3; t0: THREE.Vector3; t1: THREE.Vector3; s: number; d: number } | null = null;
  const fly = (pos: THREE.Vector3, target: THREE.Vector3, d = 1.4) => {
    if (reduced) {
      camera.position.copy(pos);
      controls.target.copy(target);
      controls.update();
      renderer.render(scene, camera);
      return;
    }
    tween = { p0: camera.position.clone(), p1: pos, t0: controls.target.clone(), t1: target, s: performance.now(), d: d * 1000 };
  };
  const goView = (v: string, d?: number) => {
    view = v;
    const p = presets[v] ?? presets.full;
    fly(p.dir.clone().multiplyScalar(fit() * p.k), new THREE.Vector3(), d);
  };
  let zoomed = false;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!zoomed && !tween) camera.position.setLength(fit() * (presets[view]?.k ?? 1));
  };
  resize();
  if (!reduced) {
    camera.position.copy(presets.cine.dir).multiplyScalar(fit() * 0.35).add(new THREE.Vector3(0, 2, 0));
    goView('full', 2.6);
  }
  canvas.addEventListener('cityview', (e) => {
    zoomed = false;
    goView((e as CustomEvent<string>).detail);
  });
  addEventListener('resize', resize);

  const tip = document.querySelector<HTMLElement>('[data-city-tip]');
  const unit = canvas.dataset.unit ?? '';
  const numFmt = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US');
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let pointer: { x: number; y: number } | null = null;
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    ndc.set((pointer.x / r.width) * 2 - 1, -(pointer.y / r.height) * 2 + 1);
  });
  canvas.addEventListener('pointerleave', () => {
    pointer = null;
    uHover.value = -1;
    if (tip) tip.hidden = true;
  });
  const hover = () => {
    if (!pointer) return;
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(mesh, false)[0];
    const i = hit?.instanceId ?? -1;
    uHover.value = i;
    if (!tip) return;
    tip.hidden = i < 0;
    if (i < 0) return;
    tip.innerHTML = `<b>${numFmt.format(counts[i])}</b> ${unit}<br><span>${dayFmt.format(dateOf(i))}</span>`;
    tip.style.transform = `translate(${pointer.x + 14}px, ${pointer.y - 10}px)`;
  };

  let down: { x: number; y: number } | null = null;
  canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }));
  canvas.addEventListener('click', (e) => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
    const i = uHover.value;
    if (i < 0) {
      if (zoomed) {
        zoomed = false;
        goView(view);
      }
      return;
    }
    zoomed = true;
    const target = new THREE.Vector3(xOf(i), heights[i] / 2, zOf(i));
    fly(target.clone().add(new THREE.Vector3(-6, 9, 14)), target);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && zoomed) {
      zoomed = false;
      goView(view);
    }
  });

  const t0 = performance.now();
  let growing = !reduced;
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    uTime.value = t;
    if (growing) {
      place((i) => {
        const k = Math.min(Math.max((t - (i / n) * 1.5) / 0.8, 0), 1);
        return 1 - Math.pow(1 - k, 3);
      });
      if (t > 2.4) growing = false;
    }
    if (tween) {
      const k = Math.min((performance.now() - tween.s) / tween.d, 1);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      camera.position.lerpVectors(tween.p0, tween.p1, e);
      controls.target.lerpVectors(tween.t0, tween.t1, e);
      if (k >= 1) tween = null;
    }
    const pk = (t % 2.2) / 2.2;
    ring.scale.setScalar(1 + pk * 4);
    (ring.material as THREE.MeshBasicMaterial).opacity = (1 - pk) * 0.8;
    hover();
    const auto = controls.autoRotate;
    if (tween || zoomed) controls.autoRotate = false;
    controls.update();
    controls.autoRotate = auto;
    renderer.render(scene, camera);
  };
  if (reduced) {
    controls.addEventListener('change', () => renderer.render(scene, camera));
    canvas.addEventListener('pointermove', () => requestAnimationFrame(frame));
    frame();
  } else {
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    renderer.setAnimationLoop(() => visible && frame());
  }
}
