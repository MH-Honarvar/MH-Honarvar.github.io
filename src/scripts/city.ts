import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const cssColor = (name: string) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim());

export function initCity(canvas: HTMLCanvasElement, counts: number[]) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);
  camera.position.set(-12, 30, 45);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(-20, 40, 20);
  scene.add(sun);

  const weeks = Math.ceil(counts.length / 7);
  const max = Math.max(1, ...counts);
  const geo = new THREE.BoxGeometry(0.85, 1, 0.85);
  geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2 });
  const mesh = new THREE.InstancedMesh(geo, mat, counts.length);
  const m = new THREE.Matrix4();
  const a = cssColor('--accent');
  const b = cssColor('--accent2');
  const base = new THREE.Color(0x2a2540);
  const c = new THREE.Color();
  const heights = counts.map((n) => (n === 0 ? 0.15 : 0.6 + Math.log2(1 + n) * 1.6));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  counts.forEach((n, i) => {
    const w = Math.floor(i / 7);
    const d = i % 7;
    m.makeScale(1, reduced ? heights[i] : 0.001, 1).setPosition(w - weeks / 2, 0, d * 1.1 - 3.5);
    mesh.setMatrixAt(i, m);
    c.copy(n === 0 ? base : a.clone().lerp(b, n / max));
    mesh.setColorAt(i, c);
  });
  scene.add(mesh);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(weeks + 6, 14), new THREE.MeshStandardMaterial({ color: 0x0d0b18, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -0.2;
  scene.add(ground);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = 0.35;
  controls.minAzimuthAngle = -Math.PI / 4;
  controls.maxAzimuthAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 2.2;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.setLength(w < 700 ? 95 : 62);
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);

  const start = performance.now();
  renderer.setAnimationLoop(() => {
    if (!reduced) {
      const t = (performance.now() - start) / 1000;
      if (t < 3) {
        counts.forEach((_, i) => {
          const k = Math.min(Math.max((t - (i / counts.length) * 1.5) / 0.8, 0), 1);
          const e = 1 - Math.pow(1 - k, 3);
          m.makeScale(1, Math.max(heights[i] * e, 0.001), 1).setPosition(Math.floor(i / 7) - weeks / 2, 0, (i % 7) * 1.1 - 3.5);
          mesh.setMatrixAt(i, m);
        });
        mesh.instanceMatrix.needsUpdate = true;
      }
    }
    controls.update();
    renderer.render(scene, camera);
  });
}
