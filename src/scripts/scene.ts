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
varying vec2 vUv;
void main(){
  vec2 p = vUv; p.x *= uAspect;
  float g1 = smoothstep(0.75, 0.0, distance(p, vec2(0.7 * uAspect, 0.68 + sin(uTime * 0.1) * 0.04)));
  float g2 = smoothstep(0.6, 0.0, distance(p, vec2(0.2 * uAspect, 0.2)));
  vec3 c = uBg + (uA * g1 * 0.07 + uB * g2 * 0.045) * uGlow;
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const finishShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmount: { value: 0.006 }, uGrain: { value: 0.04 } },
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

  if (hero) {
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: { uA: uniforms.uA, uB: uniforms.uB, uBg, uAspect, uTime: uniforms.uTime, uGlow: uniforms.uGlow },
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
    scene.add(blob.mesh);

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
    if (bloom) bloom.strength = (isLight() ? 0.18 : 0.6) * (0.5 + 0.5 * glow);
    if (finish) finish.uniforms.uGrain.value = isLight() ? 0.02 : 0.04;
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

  const basePos = new THREE.Vector3();
  let baseScale = 1;
  const resize = () => {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    bloom?.resolution.set(w / 2, h / 2);
    camera.aspect = w / h;
    uAspect.value = w / h;
    camera.updateProjectionMatrix();
    const wide = w / h > 1.15;
    basePos.set(wide ? (document.dir === 'rtl' ? -1 : 1) * Math.min(2.2, 1.1 * (w / h)) : 0, wide ? 0 : 1.75, 0);
    baseScale = wide ? Math.min(1, 0.55 + 0.3 * (w / h)) : 0.5;
  };
  applyTheme();
  if (hero) applyTier();
  else resize();
  if (blob) blob.mesh.position.copy(basePos);
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
  addEventListener('pointerdown', () => {
    if (blob && uniforms.uMorph.value.x < 0.3 && castBlob()) uniforms.uRipple.value.set(hitLocal.x, hitLocal.y, hitLocal.z, 0);
  });

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

      springTarget.set(basePos.x + mouse.x * 0.35, basePos.y + mouse.y * 0.25 - uScroll.value * 0.6, 0);
      vel.addScaledVector(springTarget.sub(m.position), 38 * dt).multiplyScalar(Math.pow(0.0025, dt));
      m.position.addScaledVector(vel, dt);
      const speed = vel.length();
      m.scale.set(1 + Math.abs(vel.x) * 0.06, 1 + Math.abs(vel.y) * 0.06, 1).multiplyScalar(baseScale * Math.max(0.55, 1 - uScroll.value * 0.18));

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
