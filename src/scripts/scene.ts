import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createBlob, type BlobUniforms } from './blob';

const pointsVertex = /* glsl */ `
uniform float uTime; uniform float uSize; uniform float uScroll;
attribute float aSeed;
varying float vSeed;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.3 + aSeed * 6.28) * 0.15;
  p.x += cos(uTime * 0.2 + aSeed * 3.14) * 0.15;
  p.z += uScroll * 4.0 * aSeed;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.4 + aSeed) * (8.0 / -mv.z);
  vSeed = aSeed;
  gl_Position = projectionMatrix * mv;
}`;

const pointsFragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB;
varying float vSeed;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(mix(uA, uB, vSeed), a * 0.8);
}`;

const backdropFragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uBg; uniform float uAspect; uniform float uTime; uniform float uGlow;
uniform vec3 uSph; uniform float uHalo; uniform sampler2D uText; uniform float uTextAmt; uniform float uLight;
varying vec2 vUv;
void main(){
  vec2 p = vUv; p.x *= uAspect;
  float g1 = smoothstep(0.75, 0.0, distance(p, vec2(0.7 * uAspect, 0.68 + sin(uTime * 0.1) * 0.04)));
  float g2 = smoothstep(0.6, 0.0, distance(p, vec2(0.2 * uAspect, 0.2)));
  vec3 c = uBg + (uA * g1 * 0.07 + uB * g2 * 0.045) * uGlow;

  vec2 sc = vec2(uSph.x * uAspect, uSph.y);
  vec2 q = (p - sc) / max(uSph.z, 1e-4);
  float d = length(q);
  float ang = atan(q.y, q.x);
  vec3 hue = mix(uA, uB, 0.5 + 0.5 * sin(ang * 2.0 + uTime * 0.35 + d * 1.5));
  float k = mix(1.0, 0.45, uLight);
  c += hue * exp(-d * d * 0.55) * 0.55 * uGlow * uHalo * k;
  c += mix(uB, uA, 0.5 + 0.5 * sin(ang * 3.0 - uTime * 0.5)) * (exp(-pow((d - 1.18) * 14.0, 2.0)) + 0.6 * exp(-pow((d - 1.55) * 20.0, 2.0))) * 0.22 * uGlow * uHalo * k;

  vec2 tuv = q / vec2(3.4, 1.7) + 0.5;
  if (uTextAmt > 0.0 && tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) {
    float a = texture2D(uText, tuv).a * uTextAmt * smoothstep(1.25, 0.75, d);
    vec3 ink = mix(mix(uA, uB, tuv.x) * 1.6 * uGlow + 0.15, uBg * 0.25, uLight);
    c = mix(c, ink, a);
  }
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const finishShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmount: { value: 0.0025 }, uGrain: { value: 0.018 } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uAmount; uniform float uGrain;
    varying vec2 vUv;
    void main(){
      vec2 c = vUv - 0.5;
      float r = dot(c, c);
      vec2 off = c * r * uAmount * 4.0;
      vec4 base = texture2D(tDiffuse, vUv);
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, base.g, texture2D(tDiffuse, vUv - off).b);
      float n = fract(sin(dot(vUv * 1000.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
      col += (n - 0.5) * uGrain;
      col *= 1.0 - r * 0.55;
      gl_FragColor = vec4(col, base.a);
    }`,
};

const cssColor = (name: string) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#a855f7');
const isLight = () => document.documentElement.dataset.theme === 'light';
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export function initScene(canvas: HTMLCanvasElement, mode: 'hero' | 'ambient') {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 720px)').matches || navigator.hardwareConcurrency <= 4;
  const hero = mode === 'hero';

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return;
  }

  // Quality tiers: 2 = transmission + bloom, 1 = transmission only, 0 = no post-processing, chrome-like blob.
  let tier = !hero ? 0 : mobile ? 0 : 2;
  const dprFor = (t: number) => Math.min(devicePixelRatio, [1, 1.25, 1.75][t]);
  renderer.setPixelRatio(hero ? dprFor(tier) : Math.min(devicePixelRatio, mobile ? 1.25 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const uniforms: BlobUniforms = {
    uTime: { value: 0 },
    uMorph: { value: new THREE.Vector2() },
    uHit: { value: new THREE.Vector3(0, 0, 10) },
    uHitAmt: { value: 0 },
    uRipple: { value: new THREE.Vector4(0, 0, 0, -1) },
    uIntensity: { value: 0 },
    uA: { value: cssColor('--accent') },
    uB: { value: cssColor('--accent2') },
    uGlow: { value: 1 },
  };
  const uScroll = { value: 0 };
  const uBg = { value: cssColor('--bg') };
  const uAspect = { value: 1 };

  let blob: ReturnType<typeof createBlob> | undefined;
  let composer: EffectComposer | undefined;
  let bloom: UnrealBloomPass | undefined;
  let finish: ShaderPass | undefined;

  const rig = new THREE.Group();
  const rings: THREE.Mesh[] = [];
  const ringGroup = new THREE.Group();
  const drops: { mesh: THREE.Mesh; t: number; delay: number; axis: THREE.Vector3; start: THREE.Vector3 }[] = [];
  const light = new THREE.PointLight(0xffffff, 0, 0, 2);
  const uSph = { value: new THREE.Vector3(0.5, 0.5, 0.1) };
  const uHalo = { value: 1 };
  const uTextAmt = { value: 0 };
  const uLight = { value: 0 };
  const textCanvas = document.createElement('canvas');
  textCanvas.width = 1024;
  textCanvas.height = 512;
  const uText = { value: new THREE.CanvasTexture(textCanvas) };
  const drawText = () => {
    const ctx = textCanvas.getContext('2d');
    const h1 = document.querySelector<HTMLElement>('.hero h1');
    if (!ctx || !h1) return;
    const words = (h1.textContent ?? '').trim().split(/\s+/);
    const half = Math.ceil(words.length / 2);
    const lines = [words.slice(0, half).join(' '), words.slice(half).join(' ')].filter(Boolean);
    const family = getComputedStyle(h1).fontFamily;
    ctx.clearRect(0, 0, 1024, 512);
    ctx.direction = document.dir === 'rtl' ? 'rtl' : 'ltr';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    let size = 190;
    ctx.font = `800 ${size}px ${family}`;
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    size = Math.min(size, (size * 960) / widest, 480 / lines.length / 1.15);
    ctx.font = `800 ${size}px ${family}`;
    lines.forEach((l, i) => ctx.fillText(l, 512, 256 + (i - (lines.length - 1) / 2) * size * 1.15));
    uText.value.needsUpdate = true;
  };

  if (hero) {
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: { uA: uniforms.uA, uB: uniforms.uB, uBg, uAspect, uTime: uniforms.uTime, uGlow: uniforms.uGlow, uSph, uHalo, uText, uTextAmt, uLight },
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }`,
        fragmentShader: backdropFragment,
        depthWrite: false,
      }),
    );
    backdrop.frustumCulled = false;
    backdrop.renderOrder = -1;
    scene.add(backdrop);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    blob = createBlob(mobile ? 28 : 56, uniforms);
    rig.add(blob.mesh);
    scene.add(rig);

    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = dotCanvas.height = 64;
    const dctx = dotCanvas.getContext('2d')!;
    const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    dctx.fillStyle = grad;
    dctx.fillRect(0, 0, 64, 64);
    const dotMap = new THREE.CanvasTexture(dotCanvas);

    [1.32, 1.58].forEach((r, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.5 * r, i ? 0.006 : 0.01, 6, 220),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: i ? 0.35 : 0.6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      );
      const n = i ? 26 : 14;
      const pts = new Float32Array(n * 3);
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + Math.random() * 0.2;
        pts.set([Math.cos(a) * 1.5 * r, Math.sin(a) * 1.5 * r, 0], k * 3);
      }
      const pg = new THREE.BufferGeometry();
      pg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      ring.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: i ? 0.09 : 0.14, map: dotMap, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
      ring.rotation.set(i ? -0.75 : -0.25, i ? -0.35 : 0.2, 0);
      rings.push(ring);
      ringGroup.add(ring);
    });
    rig.add(ringGroup);

    if (!mobile) {
      const dropMat = new THREE.MeshPhysicalMaterial({
        transmission: 1, roughness: 0.04, thickness: 0.3, ior: 1.4, iridescence: 1, iridescenceIOR: 1.3, clearcoat: 1, envMapIntensity: 0.8,
      });
      for (let i = 0; i < 2; i++) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), dropMat);
        mesh.visible = false;
        rig.add(mesh);
        drops.push({ mesh, t: -1, delay: 3 + i * 4.5, axis: new THREE.Vector3(), start: new THREE.Vector3() });
      }
    }

    scene.add(light);
    drawText();
    document.fonts?.ready.then(drawText);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.55, 0.72);
    composer.addPass(bloom);
    finish = new ShaderPass(finishShader);
    composer.addPass(finish);
    composer.addPass(new OutputPass());
  }

  const count = mobile ? 900 : hero ? 2600 : 1800;
  const pos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 9;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph) - 3], i * 3);
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      uniforms: { uA: uniforms.uA, uB: uniforms.uB, uTime: uniforms.uTime, uScroll, uSize: { value: hero ? 7 : 5 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(points);

  const applyTheme = () => {
    uniforms.uA.value = cssColor('--accent');
    uniforms.uB.value = cssColor('--accent2');
    uBg.value = cssColor('--bg');
    const lum = (c: THREE.Color) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
    const glow = Math.min(1, Math.max(0.3, 0.22 / ((lum(uniforms.uA.value) + lum(uniforms.uB.value)) / 2)));
    uniforms.uGlow.value = glow;
    if (blob) blob.material.attenuationColor = uniforms.uA.value.clone().lerp(new THREE.Color(0xffffff), 0.2);
    if (bloom) bloom.strength = (isLight() ? 0.1 : 0.32) * (0.55 + 0.45 * glow);
    if (finish) finish.uniforms.uGrain.value = isLight() ? 0.01 : 0.018;
    uLight.value = isLight() ? 1 : 0;
    rings.forEach((r, i) => {
      const c = (i ? uniforms.uB.value : uniforms.uA.value).clone().multiplyScalar(isLight() ? 0.8 : glow * 1.6);
      (r.material as THREE.MeshBasicMaterial).color.copy(c);
      (r.material as THREE.MeshBasicMaterial).blending = isLight() ? THREE.NormalBlending : THREE.AdditiveBlending;
      (r.material as THREE.MeshBasicMaterial).needsUpdate = true;
      ((r.children[0] as THREE.Points).material as THREE.PointsMaterial).color.copy(c).lerp(new THREE.Color(isLight() ? 0x000000 : 0xffffff), 0.3);
    });
    light.color.copy(uniforms.uB.value).lerp(new THREE.Color(0xffffff), 0.55);
  };

  const applyTier = () => {
    renderer.setPixelRatio(dprFor(tier));
    canvas.dataset.tier = String(tier);
    if (bloom) bloom.enabled = tier >= 2;
    if (blob) {
      const m = blob.material;
      m.transmission = tier >= 1 ? 1 : 0;
      m.metalness = tier >= 1 ? 0 : 0.65;
      m.roughness = tier >= 1 ? 0.06 : 0.14;
      blob.core.visible = tier >= 1;
      m.needsUpdate = true;
    }
    resize();
  };

  const HALF_H = Math.tan(THREE.MathUtils.degToRad(22.5)) * 6;
  const EXTENT = 2.4;
  const basePos = new THREE.Vector3();
  const cornerPos = new THREE.Vector3();
  let baseScale = 1;
  let stacked = false;
  const resize = () => {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    bloom?.resolution.set(w / 2, h / 2);
    camera.aspect = w / h;
    uAspect.value = w / h;
    camera.updateProjectionMatrix();
    const halfW = HALF_H * (w / h);
    const dir = document.dir === 'rtl' ? -1 : 1;
    stacked = w < 860 || w / h < 1.05;
    document.documentElement.classList.toggle('hero-stacked', hero && stacked);
    if (stacked) {
      baseScale = Math.min(0.5, (halfW * 0.85) / EXTENT, (HALF_H * 0.32) / 1.9);
      basePos.set(0, HALF_H - 1.9 * baseScale - 0.6, 0);
    } else {
      baseScale = Math.min(0.95, (halfW * 0.48) / EXTENT, (HALF_H * 0.78) / 1.9);
      basePos.set(dir * (halfW * 0.93 - EXTENT * baseScale), 0.1, 0);
    }
    cornerPos.set(dir * (halfW - 0.5), -HALF_H + 0.55, 0);
    uTextAmt.value = stacked || mobile ? 0 : 1;
  };
  applyTheme();
  if (hero) applyTier();
  else resize();
  rig.position.copy(basePos);
  addEventListener('resize', resize);
  addEventListener('themechange', applyTheme);

  const ndc = new THREE.Vector2();
  const target = new THREE.Vector2();
  let pointerSeen = false;
  addEventListener('pointermove', (e) => {
    pointerSeen = true;
    target.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ndc.copy(target);
  });

  const raycaster = new THREE.Raycaster();
  const hitLocal = new THREE.Vector3();
  let hovering = false;
  const castBlob = () => {
    if (!blob || !pointerSeen) return false;
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(blob.proxy, false)[0];
    if (!hit) return false;
    hitLocal.copy(blob.mesh.worldToLocal(hit.point.clone()));
    return true;
  };
  let holding = false;
  let metal = 0;
  addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest?.('a, button, input, textarea')) return;
    if (blob && uniforms.uMorph.value.x < 0.3 && castBlob()) {
      uniforms.uRipple.value.set(hitLocal.x, hitLocal.y, hitLocal.z, 0);
      holding = true;
    }
  });
  const release = () => (holding = false);
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);
  const lightPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2.2);
  const lightPos = new THREE.Vector3();

  let party = false;
  addEventListener('party', () => (party = !party));

  let visible = true;
  document.addEventListener('visibilitychange', () => (visible = !document.hidden));

  const mouse = new THREE.Vector2();
  const vel = new THREE.Vector3();
  const springTarget = new THREE.Vector3();
  const clock = new THREE.Clock();
  let fpsFrames = 0;
  let fpsTime = 0;
  let warmup = 2;

  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    uniforms.uTime.value += dt * (party ? 4 : 1);
    mouse.lerp(target, 0.06);
    const sp = scrollY / Math.max(innerHeight, 1);
    uScroll.value += (Math.min(sp, 3) - uScroll.value) * 0.08;

    camera.position.x = mouse.x * 0.4;
    camera.position.y = mouse.y * 0.3 - uScroll.value * 0.6;
    camera.lookAt(0, -uScroll.value * 0.6, 0);
    points.rotation.y = uniforms.uTime.value * 0.02 + mouse.x * 0.1;

    if (blob) {
      const m = blob.mesh;
      const morph = uniforms.uMorph.value;
      morph.set(smooth(0.15, 0.9, uScroll.value), smooth(1.1, 1.9, uScroll.value));

      const corner = smooth(0.03, 0.75, uScroll.value);
      const follow = 1 - corner;
      springTarget
        .lerpVectors(basePos, cornerPos, corner)
        .add({ x: mouse.x * 0.3 * follow, y: mouse.y * 0.22 * follow - uScroll.value * 0.6, z: 0 } as THREE.Vector3);
      vel.addScaledVector(springTarget.sub(rig.position), 38 * dt).multiplyScalar(Math.pow(0.0025, dt));
      rig.position.addScaledVector(vel, dt);
      const speed = vel.length();
      const scale = THREE.MathUtils.lerp(baseScale, 0.11, corner);
      rig.scale.setScalar(scale);
      m.scale.set(1 + Math.min(Math.abs(vel.x), 3) * 0.06, 1 + Math.min(Math.abs(vel.y), 3) * 0.06, 1);

      const proj = rig.position.clone().project(camera);
      uSph.value.set((proj.x + 1) / 2, (proj.y + 1) / 2, (1.5 * scale) / (2 * HALF_H));
      uHalo.value = 1 - corner * 0.6;

      ringGroup.rotation.set(1.15 + mouse.y * 0.35, mouse.x * 0.45, 0);
      rings.forEach((r, i) => (r.rotation.z = uniforms.uTime.value * (i ? -0.12 : 0.18)));

      for (const d of drops) {
        if (d.t < 0) {
          d.delay -= dt;
          d.mesh.visible = false;
          if (d.delay > 0 || stacked || corner > 0.2 || holding) continue;
          d.t = 0;
          d.start.randomDirection();
          d.axis.randomDirection().cross(d.start).normalize();
        }
        d.t += dt / 5.5;
        if (d.t >= 1) {
          d.t = -1;
          d.delay = 5 + Math.random() * 6;
          continue;
        }
        const out = Math.sin(Math.PI * d.t);
        d.mesh.visible = true;
        d.mesh.position.copy(d.start).applyAxisAngle(d.axis, d.t * Math.PI * 1.6).multiplyScalar(1.5 * (0.92 + 0.5 * Math.pow(out, 0.6)));
        d.mesh.scale.setScalar(0.17 * Math.pow(out, 0.35));
      }

      if (pointerSeen) {
        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(lightPlane, lightPos)) light.position.copy(lightPos);
      }
      light.intensity += ((pointerSeen ? (isLight() ? 6 : 14) * follow : 0) - light.intensity) * 0.08;

      metal += ((holding ? 1 : 0) - metal) * (holding ? 0.05 : 0.08);
      if (tier >= 1) {
        const mat = blob.material;
        mat.metalness = metal;
        mat.transmission = 1 - metal * 0.98;
        mat.roughness = 0.06 - 0.04 * metal;
        mat.envMapIntensity = 0.55 + 1.2 * metal;
      }

      m.rotation.y = uniforms.uTime.value * 0.15 + morph.x * 0.6;
      m.rotation.x = mouse.y * 0.3 + morph.x * 0.4;

      hovering = morph.x < 0.3 && castBlob();
      if (hovering) uniforms.uHit.value.lerp(hitLocal, 0.25);
      uniforms.uHitAmt.value += ((hovering ? 1 : 0) - uniforms.uHitAmt.value) * 0.08;
      const rip = uniforms.uRipple.value;
      if (rip.w >= 0) rip.w = rip.w > 3.5 ? -1 : rip.w + dt;

      uniforms.uIntensity.value += ((party ? 1.6 : Math.min(speed * 0.5, 0.8) + mouse.length() * 0.25) - uniforms.uIntensity.value) * 0.05;
      const coreScale = Math.max(0.001, 1 - morph.x * (1 - morph.y) * 1.15 - morph.y * 0.2);
      blob.core.scale.setScalar(coreScale);
    }

    if (finish) finish.uniforms.uTime.value = uniforms.uTime.value;
    if (composer && tier >= 1) composer.render(dt);
    else renderer.render(scene, camera);

    if (hero && tier > 0) {
      warmup -= dt;
      if (warmup < 0) {
        fpsFrames++;
        fpsTime += dt;
        if (fpsTime > 2.5) {
          if (fpsFrames / fpsTime < 45) {
            tier--;
            applyTier();
            warmup = 1.5;
          }
          fpsFrames = 0;
          fpsTime = 0;
        }
      }
    }
  };

  frame();
  canvas.classList.add('ready');
  if (reduced) return;

  renderer.setAnimationLoop(() => visible && frame());
}
