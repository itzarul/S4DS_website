import * as THREE from 'three';
import createDigitalScene from './DigitalScene.js';
import createRingBloom from './RingBloom.js';

export function createFooterWorld(host, footer) {
  const low = !!window.RenderQuality?.low;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !low,
    powerPreference: 'low-power',
  });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);
  const scene = new THREE.Scene(),
    world = new THREE.Group();
  scene.add(world);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  camera.position.set(0, 0.1, 11.5);
  scene.fog = new THREE.FogExp2(0x020811, 0.032);
  const geometries = new Set(),
    materials = new Set();
  const ownGeometry = (g) => (geometries.add(g), g),
    ownMaterial = (m) => (materials.add(m), m);
  function ring(radius) {
    const group = new THREE.Group();
    for (const [tube, opacity, color] of [
      [0.01, 1, 0xe9faff],
      [0.022, 0.2, 0x2684ff],
      [0.046, 0.035, 0x325bff],
    ]) {
      const m = ownMaterial(
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          toneMapped: false,
          fog: false,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      m.color.multiplyScalar(tube === 0.01 ? 2.6 : 1.5);
      const mesh = new THREE.Mesh(
        ownGeometry(new THREE.TorusGeometry(radius, tube, 8, low ? 96 : 192)),
        m,
      );
      mesh.userData.bloom = true;
      mesh.renderOrder = 2;
      group.add(mesh);
    }
    world.add(group);
    return group;
  }
  const upper = ring(3.65),
    lower = ring(2.24);
  upper.position.set(0.1, 2.85, -0.55);
  lower.position.set(0.1, -1.65, 0.1);
  const digital = createDigitalScene(world, ownGeometry, ownMaterial);
  const bloom = createRingBloom(renderer, scene, camera);
  let disposed = false,
    active = false,
    raf = 0,
    last = 0,
    time = 0,
    mobile = false,
    lastReveal = -1;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 },
    orbit = { x: 0, y: 0 };
  let drag = null;
  const texture = new THREE.TextureLoader().load('assets/footer-digital-obsidian.webp', (t) => {
    if (disposed) {
      t.dispose();
      return;
    }
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    digital.setTexture(t);
    draw();
  });
  function draw() {
    if (disposed) return;
    pointer.x += (pointer.tx - pointer.x) * 0.065;
    pointer.y += (pointer.ty - pointer.y) * 0.065;
    world.rotation.set(pointer.y * 0.06 + orbit.x, -pointer.x * 0.24 + orbit.y, pointer.x * 0.025);
    world.position.y = Math.sin(time * 0.55) * 0.07;
    upper.rotation.set(
      (mobile ? -1.51 : -1.39) + Math.sin(time * 0.22) * 0.012,
      pointer.x * 0.04,
      -0.035,
      'ZYX',
    );
    lower.rotation.set(1.34 + Math.sin(time * 0.3) * 0.06, -pointer.x * 0.08, -0.13, 'ZYX');
    digital.butterfly.update(time);
    for (const [i, p] of [...digital.panels, ...digital.fragments].entries()) {
      p.position.y = p.userData.origin.y + Math.sin(time * 0.35 + i) * 0.13;
      p.rotation.y = Math.sin(time * 0.15 + i) * 0.18;
    }
    digital.environment.rotation.y = -world.rotation.y * 0.6;
    digital.update(1);
    camera.lookAt(0, 0, 0);
    bloom.render(1.15 + Math.sin(time * 0.4) * 0.1);
    host.dataset.phase = time.toFixed(3);
  }
  function tick(now) {
    raf = 0;
    if (!active || disposed) return;
    const dt = last ? now - last : 0;
    if (!last || dt >= 1000 / (low ? 24 : 30)) {
      time += Math.min(dt / 1000, 0.08);
      last = now;
      draw();
    }
    raf = requestAnimationFrame(tick);
  }
  function setActive(value) {
    active = value;
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    host.dataset.motionState = active ? 'running' : 'paused';
    if (active) raf = requestAnimationFrame(tick);
    else draw();
  }
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    mobile = footer.clientWidth <= 700;
    renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : mobile ? 1.25 : 1.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.position.z = mobile ? 10.8 : 11.5;
    camera.updateProjectionMatrix();
    upper.scale.setScalar(mobile ? 0.57 : Math.min(1, camera.aspect / 1.4));
    upper.position.y = mobile ? 2.0 : 2.85;
    lower.scale.setScalar(mobile ? 0.75 : 1);
    lower.position.y = mobile ? -1.32 : -1.65;
    digital.resize(mobile, false);
    bloom.resize(w, h, renderer.getPixelRatio(), mobile || low);
    draw();
  }
  function move(e) {
    if (drag) {
      orbit.y = drag.y + (e.clientX - drag.px) * 0.005;
      orbit.x = THREE.MathUtils.clamp(drag.x + (e.clientY - drag.py) * 0.003, -0.35, 0.35);
      return;
    }
    if (mobile || e.pointerType === 'touch') return;
    const r = host.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
  }
  function down(e) {
    if (!active || e.button !== 0 || e.target.closest('a,button') || e.pointerType === 'touch')
      return;
    drag = { px: e.clientX, py: e.clientY, x: orbit.x, y: orbit.y };
    host.setPointerCapture(e.pointerId);
  }
  function up() {
    drag = null;
  }
  function leave() {
    pointer.tx = pointer.ty = 0;
    up();
  }
  host.addEventListener('pointermove', move, { passive: true });
  host.addEventListener('pointerdown', down);
  host.addEventListener('pointerup', up);
  host.addEventListener('pointercancel', up);
  host.addEventListener('pointerleave', leave);
  const sizes = new ResizeObserver(resize);
  sizes.observe(host);
  host.dataset.renderer = 'ready';
  resize();
  return {
    setActive,
    setReveal(value) {
      if (value === lastReveal) return;
      lastReveal = value;
      digital.butterfly.setReveal(value);
      host.dataset.reveal = value.toFixed(3);
      if (!active) draw();
    },
    dispose() {
      disposed = true;
      active = false;
      cancelAnimationFrame(raf);
      sizes.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerdown', down);
      host.removeEventListener('pointerup', up);
      host.removeEventListener('pointercancel', up);
      host.removeEventListener('pointerleave', leave);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      texture.dispose();
      bloom.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
