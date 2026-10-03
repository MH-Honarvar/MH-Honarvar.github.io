import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { snoise } from './noise';

const RADIUS = 1.5;

export interface BlobUniforms {
  uTime: { value: number };
  uMorph: { value: THREE.Vector2 };
  uHit: { value: THREE.Vector3 };
  uHitAmt: { value: number };
  uRipple: { value: THREE.Vector4 };
  uIntensity: { value: number };
  uA: { value: THREE.Color };
  uB: { value: THREE.Color };
  uGlow: { value: number };
}

/** Sphere positions projected onto a (2,3) torus-knot tube, so the same vertices can morph into it. */
function knotTarget(pos: THREE.BufferAttribute) {
  const samples = 720;
  const scale = 0.48;
  const tube = 0.36;
  const centers: THREE.Vector3[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const r = 2 + Math.cos(3 * t);
    centers.push(new THREE.Vector3(r * Math.cos(2 * t), r * Math.sin(2 * t), -Math.sin(3 * t) * 1.2).multiplyScalar(scale));
  }
  const out = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  const d = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).multiplyScalar(1.05);
    let best = 0;
    let bestD = Infinity;
    for (let k = 0; k < samples; k++) {
      const dd = v.distanceToSquared(centers[k]);
      if (dd < bestD) {
        bestD = dd;
        best = k;
      }
    }
    d.subVectors(v, centers[best]);
    if (d.lengthSq() < 1e-8) d.set(0, 1, 0);
    d.normalize().multiplyScalar(tube).add(centers[best]);
    out.set([d.x, d.y, d.z], i * 3);
  }
  return out;
}

/** A teardrop pointing up. */
function dropTarget(pos: THREE.BufferAttribute) {
  const out = new Float32Array(pos.count * 3);
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    n.fromBufferAttribute(pos, i).normalize();
    const w = Math.pow((1 - n.y) / 2, 0.65) * 1.3;
    out.set([n.x * RADIUS * w, n.y * RADIUS * 1.15 + 0.1, n.z * RADIUS * w], i * 3);
  }
  return out;
}

/** Laplacian smoothing pulls in the stretched fins left where many sphere vertices project onto one tube point. */
function smoothTarget(index: THREE.BufferAttribute, positions: Float32Array, iterations: number) {
  const n = positions.length / 3;
  const neighbors: Set<number>[] = Array.from({ length: n }, () => new Set());
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    neighbors[a].add(b).add(c);
    neighbors[b].add(a).add(c);
    neighbors[c].add(a).add(b);
  }
  const lists = neighbors.map((s) => [...s]);
  let src = positions;
  for (let it = 0; it < iterations; it++) {
    const dst = new Float32Array(src.length);
    for (let i = 0; i < n; i++) {
      let x = 0, y = 0, z = 0;
      for (const j of lists[i]) {
        x += src[j * 3];
        y += src[j * 3 + 1];
        z += src[j * 3 + 2];
      }
      const k = 1 / lists[i].length;
      dst[i * 3] = src[i * 3] * 0.4 + x * k * 0.6;
      dst[i * 3 + 1] = src[i * 3 + 1] * 0.4 + y * k * 0.6;
      dst[i * 3 + 2] = src[i * 3 + 2] * 0.4 + z * k * 0.6;
    }
    src = dst;
  }
  return src;
}

function normalsFor(index: THREE.BufferAttribute, positions: Float32Array) {
  const g = new THREE.BufferGeometry();
  g.setIndex(index);
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.computeVertexNormals();
  return g.getAttribute('normal').array as Float32Array;
}

const vertexHead = /* glsl */ `
uniform float uTime; uniform vec2 uMorph; uniform vec3 uHit; uniform float uHitAmt;
uniform vec4 uRipple; uniform float uIntensity;
attribute vec3 aKnot; attribute vec3 aKnotN; attribute vec3 aDrop; attribute vec3 aDropN;
varying float vDisp;
${snoise}
float disp(vec3 p){
  float knotness = uMorph.x * (1.0 - uMorph.y);
  float d = snoise(p * 0.65 + uTime * 0.28) * 0.2 + snoise(p * 1.5 - uTime * 0.2) * 0.04;
  d *= mix(1.0, 0.35, knotness) * (1.0 + uIntensity);
  float h = distance(p, uHit);
  d += uHitAmt * (0.32 * exp(-h * h * 3.5) - 0.06 * exp(-h * h * 0.8));
  if (uRipple.w >= 0.0) {
    float rd = distance(p, uRipple.xyz);
    float front = uRipple.w * 2.4;
    float env = (1.0 - smoothstep(front - 0.8, front, rd)) * exp(-uRipple.w * 1.4);
    d += 0.14 * sin(rd * 10.0 - uRipple.w * 14.0) * env;
  }
  return d;
}
`;

const vertexNormal = /* glsl */ `
#include <beginnormal_vertex>
vec3 bp = mix(mix(position, aKnot, uMorph.x), aDrop, uMorph.y);
vec3 bn = normalize(mix(mix(normal, aKnotN, uMorph.x), aDropN, uMorph.y));
vec3 tg = normalize(cross(bn, abs(bn.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
vec3 bt = cross(bn, tg);
const float e = 0.012;
float d0 = disp(bp);
vec3 P0 = bp + bn * d0;
vec3 q1 = bp + tg * e; vec3 P1 = q1 + bn * disp(q1);
vec3 q2 = bp + bt * e; vec3 P2 = q2 + bn * disp(q2);
vec3 dn = normalize(cross(P1 - P0, P2 - P0));
if (dot(dn, bn) < 0.0) dn = -dn;
objectNormal = dn;
vDisp = d0;
`;

const fragmentHead = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform float uTime; uniform float uGlow;
varying float vDisp;
`;

const fragmentEmissive = /* glsl */ `
#include <emissivemap_fragment>
float fres = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);
vec3 rim = mix(uA, uB, 0.5 + 0.5 * sin(vDisp * 12.0 + uTime * 0.6));
totalEmissiveRadiance += rim * fres * 0.9 * uGlow;
`;

export function createBlob(detail: number, uniforms: BlobUniforms) {
  const base = new THREE.IcosahedronGeometry(RADIUS, detail);
  base.deleteAttribute('uv');
  base.deleteAttribute('normal');
  const geo = mergeVertices(base);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const index = geo.getIndex()!;
  const sphereN = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
    sphereN.set([v.x, v.y, v.z], i * 3);
  }
  geo.setAttribute('normal', new THREE.BufferAttribute(sphereN, 3));
  const knot = smoothTarget(index, knotTarget(pos), detail > 32 ? 14 : 8);
  const drop = dropTarget(pos);
  geo.setAttribute('aKnot', new THREE.BufferAttribute(knot, 3));
  geo.setAttribute('aKnotN', new THREE.BufferAttribute(normalsFor(index, knot), 3));
  geo.setAttribute('aDrop', new THREE.BufferAttribute(drop, 3));
  geo.setAttribute('aDropN', new THREE.BufferAttribute(normalsFor(index, drop), 3));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), RADIUS * 2);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.06,
    transmission: 1,
    thickness: 1.4,
    ior: 1.45,
    iridescence: 1,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [120, 720],
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    attenuationDistance: 1.2,
    envMapIntensity: 0.55,
    specularIntensity: 0.6,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${vertexHead}`)
      .replace('#include <beginnormal_vertex>', vertexNormal)
      .replace('#include <begin_vertex>', 'vec3 transformed = P0;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${fragmentHead}`)
      .replace('#include <emissivemap_fragment>', fragmentEmissive);
  };
  material.customProgramCacheKey = () => 'liquid-blob';

  const mesh = new THREE.Mesh(geo, material);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 48, 48),
    new THREE.ShaderMaterial({
      uniforms: { uTime: uniforms.uTime, uA: uniforms.uA, uB: uniforms.uB, uGlow: uniforms.uGlow },
      vertexShader: /* glsl */ `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform float uGlow; varying vec3 vP;
        ${snoise}
        void main(){
          float n = snoise(vP * 1.6 + uTime * 0.4) * 0.5 + 0.5;
          float m = snoise(vP * 3.0 - uTime * 0.3) * 0.5 + 0.5;
          vec3 c = mix(uA, uB, n) * (0.9 + m * 1.6) * uGlow;
          gl_FragColor = vec4(c, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  );
  mesh.add(core);

  const proxy = new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 1.05, 24, 24), new THREE.MeshBasicMaterial({ visible: false }));
  mesh.add(proxy);

  return { mesh, core, proxy, material };
}
