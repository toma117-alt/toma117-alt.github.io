// Scroll-triggered camera flythrough: the camera travels through an
// "energy landscape" (core → solar farm → wind farm → storage → microgrid → sun)
// as the page scrolls.
import * as THREE from 'three';

const PALETTE = {
  dark: { bg: 0x060a13, grid: 0x14324a, line: 0x2dd4bf, warm: 0xfbbf24, panel: 0x1e3a8a, metal: 0x94a3b8, star: 0xcbd5e1, fog: 0.018 },
  light: { bg: 0xf3f5fa, grid: 0xc9d4e6, line: 0x0d9488, warm: 0xd97706, panel: 0x3b5bdb, metal: 0x64748b, star: 0x64748b, fog: 0.02 },
};

export function initBackground(canvas, getTheme) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 400);
  scene.fog = new THREE.FogExp2(0x000000, 0.018);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 1.1);
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
  sunLight.position.set(10, 20, 5);
  scene.add(hemi, sunLight);

  // Shared materials so theme switches recolour everything at once.
  const M = {
    line: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.85 }),
    grid: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.6 }),
    warm: new THREE.MeshStandardMaterial({ emissiveIntensity: 1.2, roughness: 0.4 }),
    glow: new THREE.MeshStandardMaterial({ emissiveIntensity: 1.4, roughness: 0.3 }),
    panel: new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.25 }),
    metal: new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.45 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }),
    wire: new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.55 }),
    stars: new THREE.PointsMaterial({ size: 0.12, transparent: true, opacity: 0.8, sizeAttenuation: true }),
  };

  // ---- Ground grid running the full length of the path
  {
    const pts = [];
    for (let x = -60; x <= 60; x += 4) pts.push(x, 0, 20, x, 0, -260);
    for (let z = 20; z >= -260; z -= 4) pts.push(-60, 0, z, 60, 0, z);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const grid = new THREE.LineSegments(g, M.grid);
    grid.position.y = -6;
    scene.add(grid);
  }

  // ---- Stars / energy particles
  {
    const n = 1800, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * 140;
      p[i * 3 + 1] = Math.random() * 60 - 5;
      p[i * 3 + 2] = 20 - Math.random() * 280;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, M.stars));
  }

  const spinners = [];

  // ---- Zone 1: energy core
  const core = new THREE.Group();
  core.position.set(7, 2, -12);
  const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), M.wire);
  const coreInner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), M.glow);
  core.add(coreMesh, coreInner);
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2 + i * 0.7, 0.03, 8, 90), M.glow);
    ring.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    ring.userData.spin = 0.2 + i * 0.15;
    core.add(ring);
    spinners.push(ring);
  }
  scene.add(core);

  // ---- Zone 2: solar farm
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const panel = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 1.8), M.panel);
      const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 0.1, 1.8)), M.line);
      const cells = [];
      for (let k = -1; k <= 1; k += 0.5) cells.push(k, 0.06, -0.9, k, 0.06, 0.9);
      const cg = new THREE.BufferGeometry();
      cg.setAttribute('position', new THREE.Float32BufferAttribute(cells, 3));
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2), M.metal);
      leg.position.y = -1;
      const tilt = new THREE.Group();
      tilt.add(body, frame, new THREE.LineSegments(cg, M.line));
      tilt.rotation.x = -0.45;
      panel.add(tilt, leg);
      panel.position.set(-16 + c * 4.2, -4, -40 - r * 4);
      scene.add(panel);
    }
  }

  // ---- Zone 3: wind farm
  const turbine = (x, z, s) => {
    const t = new THREE.Group();
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 12, 8), M.white);
    tower.position.y = 6;
    const hub = new THREE.Group();
    hub.position.set(0, 12, 0.35);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 10), M.white);
    hub.add(nose);
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5, 0.06), M.white);
      blade.position.y = 2.5;
      const holder = new THREE.Group();
      holder.rotation.z = (i * Math.PI * 2) / 3;
      holder.add(blade);
      hub.add(holder);
    }
    hub.userData.spin = 1.2 + Math.random() * 0.6;
    hub.userData.axis = 'z';
    spinners.push(hub);
    t.add(tower, hub);
    t.scale.setScalar(s);
    t.position.set(x, -6, z);
    t.rotation.y = 0.5;
    scene.add(t);
  };
  turbine(-12, -78, 1); turbine(10, -84, 1.1); turbine(-4, -96, 0.9); turbine(16, -100, 1); turbine(-18, -104, 1.2);

  // ---- Zone 4: battery storage
  for (let i = 0; i < 8; i++) {
    const b = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 3.2, 20), M.metal);
    const lvl = 0.4 + 0.6 * ((i * 37) % 10) / 10;
    const charge = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 3.2 * lvl, 20), M.glow);
    charge.position.y = -1.6 + (3.2 * lvl) / 2;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 12), M.warm);
    cap.position.y = 1.75;
    b.add(shell, charge, cap);
    b.position.set(-9 + (i % 4) * 4, -4.2, -122 - Math.floor(i / 4) * 5);
    b.userData.bob = i;
    scene.add(b);
    spinners.push(b);
  }

  // ---- Zone 5: microgrid network with travelling pulses
  const nodes = [];
  for (let i = 0; i < 14; i++) {
    const v = new THREE.Vector3((Math.random() - 0.5) * 34, Math.random() * 12 - 3, -145 - Math.random() * 35);
    nodes.push(v);
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.35 + Math.random() * 0.3, 12, 12), i % 3 ? M.glow : M.warm);
    m.position.copy(v);
    scene.add(m);
  }
  const edges = [];
  nodes.forEach((a, i) => {
    nodes.map((b, j) => ({ j, d: a.distanceTo(b) })).filter((o) => o.j > i).sort((x, y) => x.d - y.d).slice(0, 2)
      .forEach(({ j }) => edges.push([a, nodes[j]]));
  });
  {
    const g = new THREE.BufferGeometry().setFromPoints(edges.flat());
    scene.add(new THREE.LineSegments(g, M.line));
  }
  const pulses = edges.map(([a, b]) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), M.warm);
    m.userData = { a, b, t: Math.random(), s: 0.2 + Math.random() * 0.4 };
    scene.add(m);
    return m;
  });

  // ---- Transmission towers along the route
  const towerGeo = (() => {
    const p = [];
    const s = [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]];
    s.forEach(([x, , z], i) => {
      const [nx, , nz] = s[(i + 1) % 4];
      p.push(x, 0, z, x * 0.2, 12, z * 0.2);
      for (let h = 0; h < 12; h += 3) {
        const k1 = 1 - (h / 12) * 0.8, k2 = 1 - ((h + 3) / 12) * 0.8;
        p.push(x * k1, h, z * k1, nx * k2, h + 3, nz * k2);
      }
    });
    p.push(-3.5, 10, 0, 3.5, 10, 0, -2.5, 11.5, 0, 2.5, 11.5, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    return g;
  })();
  const towerTops = [];
  for (let z = -44; z > -240; z -= 28) {
    const t = new THREE.LineSegments(towerGeo, M.line);
    t.position.set(-34, -6, z);
    scene.add(t);
    towerTops.push(new THREE.Vector3(-37.5, 4, z), new THREE.Vector3(-30.5, 4, z));
  }
  {
    const pts = [];
    for (let i = 0; i < towerTops.length - 2; i++) {
      const a = towerTops[i], b = towerTops[i + 2];
      for (let k = 0; k < 12; k++) {
        const t0 = k / 12, t1 = (k + 1) / 12;
        const sag = (t) => -Math.sin(Math.PI * t) * 1.6;
        pts.push(new THREE.Vector3().lerpVectors(a, b, t0).add(new THREE.Vector3(0, sag(t0), 0)));
        pts.push(new THREE.Vector3().lerpVectors(a, b, t1).add(new THREE.Vector3(0, sag(t1), 0)));
      }
    }
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), M.line));
  }

  // ---- Finale: the sun
  const sun = new THREE.Mesh(new THREE.SphereGeometry(9, 32, 32), M.warm);
  sun.position.set(0, 10, -240);
  scene.add(sun);

  // ---- Camera path
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2, 10),
    new THREE.Vector3(-2, 3, -10),
    new THREE.Vector3(2, 6, -32),
    new THREE.Vector3(-4, 4, -58),
    new THREE.Vector3(3, 5, -76),
    new THREE.Vector3(0, 2, -108),
    new THREE.Vector3(-3, 4, -138),
    new THREE.Vector3(2, 6, -165),
    new THREE.Vector3(0, 6, -200),
  ]);

  function applyTheme() {
    const c = PALETTE[getTheme()];
    renderer.setClearColor(c.bg, 1);
    scene.fog.color.setHex(c.bg);
    scene.fog.density = c.fog;
    M.line.color.setHex(c.line);
    M.grid.color.setHex(c.grid);
    M.wire.color.setHex(c.line);
    M.glow.color.setHex(c.line); M.glow.emissive.setHex(c.line);
    M.warm.color.setHex(c.warm); M.warm.emissive.setHex(c.warm);
    M.panel.color.setHex(c.panel);
    M.metal.color.setHex(c.metal);
    M.stars.color.setHex(c.star);
  }
  applyTheme();

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  let target = 0, progress = 0;
  const mouse = { x: 0, y: 0 };
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    target = max > 0 ? scrollY / max : 0;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  addEventListener('pointermove', (e) => {
    mouse.x = e.clientX / innerWidth - 0.5;
    mouse.y = e.clientY / innerHeight - 0.5;
  });

  const clock = new THREE.Clock();
  const look = new THREE.Vector3();
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    progress += (target - progress) * (reduced ? 1 : Math.min(1, dt * 3));
    const p = Math.min(progress, 0.999);
    const pos = path.getPointAt(p);
    path.getPointAt(Math.min(p + 0.02, 1), look);
    camera.position.set(pos.x + mouse.x * 2, pos.y - mouse.y * 1.2, pos.z);
    camera.lookAt(look.x, look.y - 0.5, look.z);

    if (!reduced) {
      coreMesh.rotation.y += dt * 0.3; coreMesh.rotation.x += dt * 0.15;
      coreInner.rotation.y -= dt * 0.6;
      for (const s of spinners) {
        if (s.userData.axis === 'z') s.rotation.z -= dt * s.userData.spin;
        else if (s.userData.bob !== undefined) s.position.y = -4.2 + Math.sin(t * 1.5 + s.userData.bob) * 0.15;
        else { s.rotation.x += dt * s.userData.spin; s.rotation.y += dt * s.userData.spin * 0.5; }
      }
      for (const m of pulses) {
        const u = m.userData;
        u.t = (u.t + dt * u.s) % 1;
        m.position.lerpVectors(u.a, u.b, u.t);
      }
      sun.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { applyTheme };
}
