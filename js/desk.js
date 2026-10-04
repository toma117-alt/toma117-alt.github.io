// Isometric workspace with a low-poly, rigged character that types, waves and thinks.
import * as THREE from 'three';

const THEME = {
  dark: { floor: 0x1e293b, wall: 0x172036, wall2: 0x1b2540, desk: 0x8b5e3c, rug: 0x134e4a, lamp: 0xfbbf24, screen: 0x2dd4bf },
  light: { floor: 0xe2e8f0, wall: 0xf8fafc, wall2: 0xeef2ff, desk: 0xb7835a, rug: 0x99f6e4, lamp: 0xf59e0b, screen: 0x0d9488 },
};

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.75, ...extra });
const box = (w, h, d, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.castShadow = o.receiveShadow = true; return o; };
const cyl = (rt, rb, h, seg, m) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.castShadow = true; return o; };

export function initDesk(container, getTheme) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  camera.position.set(10, 8.5, 10);
  camera.lookAt(0.35, 1.35, -1.3);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(5, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
  scene.add(key);
  const lampLight = new THREE.PointLight(0xffd27a, 6, 6, 1.5);
  scene.add(lampLight);

  const world = new THREE.Group();
  scene.add(world);

  // ---------- Room ----------
  const M = {
    floor: mat(0), wall: mat(0), wall2: mat(0), desk: mat(0), rug: mat(0),
    lamp: mat(0, { emissiveIntensity: 1.5 }), screen: mat(0, { emissiveIntensity: 0.9 }),
    dark: mat(0x1f2937), metal: mat(0x9ca3af, { metalness: 0.6, roughness: 0.3 }),
    chair: mat(0x334155), leaf: mat(0x22c55e), pot: mat(0xc2410c), mug: mat(0xf1f5f9),
    pv: mat(0x1d4ed8, { metalness: 0.5, roughness: 0.3 }), white: mat(0xf8fafc),
    book1: mat(0xef4444), book2: mat(0x3b82f6), book3: mat(0xf59e0b), book4: mat(0x10b981),
  };
  const floor = box(7, 0.3, 7, M.floor); floor.position.y = -0.15; world.add(floor);
  const rug = box(3.6, 0.04, 3, M.rug); rug.position.set(0.3, 0.02, 0.4); world.add(rug);
  const wallBack = box(7, 4.2, 0.25, M.wall); wallBack.position.set(0, 2.1, -3.375); world.add(wallBack);
  const wallLeft = box(0.25, 4.2, 7, M.wall2); wallLeft.position.set(-3.375, 2.1, 0); world.add(wallLeft);

  // window on back wall
  const win = box(1.8, 1.3, 0.05, mat(0x93c5fd, { emissive: 0x60a5fa, emissiveIntensity: 0.35 }));
  win.position.set(1.4, 2.7, -3.23); world.add(win);
  const winBar = box(0.06, 1.3, 0.08, M.white); winBar.position.set(1.4, 2.7, -3.2); world.add(winBar);
  const winBar2 = box(1.8, 0.06, 0.08, M.white); winBar2.position.set(1.4, 2.7, -3.2); world.add(winBar2);

  // shelf with books on left wall
  const shelf = box(0.4, 0.08, 1.8, M.desk); shelf.position.set(-3.05, 2.6, -0.8); world.add(shelf);
  [M.book1, M.book2, M.book3, M.book4, M.book2].forEach((m, i) => {
    const b = box(0.32, 0.45 + (i % 3) * 0.08, 0.14, m);
    b.position.set(-3.05, 2.88 + (i % 3) * 0.04, -1.5 + i * 0.2);
    b.rotation.x = i === 4 ? 0.3 : 0;
    world.add(b);
  });
  // framed "certificate"
  const certFrame = box(0.05, 0.8, 1.1, M.dark); certFrame.position.set(-3.22, 1.75, 1.4); world.add(certFrame);
  const paper = box(0.02, 0.66, 0.96, M.white); paper.position.set(-3.19, 1.75, 1.4); world.add(paper);

  // Desk, chair and character live in a 'station' rotated to face the viewer.
  const station = new THREE.Group();
  station.rotation.y = Math.PI + 0.45;
  station.position.set(-0.3, 0, -2.6);
  world.add(station);

  // ---------- Desk ----------
  const deskTop = box(3.2, 0.12, 1.4, M.desk); deskTop.position.set(0, 1.5, -1.9); station.add(deskTop);
  [[-1.5, -2.5], [1.5, -2.5], [-1.5, -1.3], [1.5, -1.3]].forEach(([x, z]) => {
    const leg = box(0.1, 1.45, 0.1, M.dark); leg.position.set(x, 0.72, z); station.add(leg);
  });

  // laptop
  const laptop = new THREE.Group();
  const base = box(1.1, 0.05, 0.75, M.metal);
  const lid = new THREE.Group();
  const lidPanel = box(1.1, 0.75, 0.04, M.metal); lidPanel.position.y = 0.375;
  const screen = box(1.0, 0.65, 0.01, M.screen); screen.position.set(0, 0.375, 0.025);
  const logo = box(0.16, 0.16, 0.01, M.screen); logo.position.set(0, 0.4, -0.025); logo.rotation.z = Math.PI / 4;
  lid.add(lidPanel, screen, logo);
  lid.position.set(0, 0.03, -0.37);
  lid.rotation.x = -0.25;
  laptop.add(base, lid);
  laptop.position.set(0, 1.585, -1.75);
  station.add(laptop);
  // code lines on the screen
  const codeLines = [];
  for (let i = 0; i < 6; i++) {
    const l = box(0.2 + Math.random() * 0.5, 0.035, 0.01, mat(i % 2 ? 0xfbbf24 : 0xffffff, { emissive: i % 2 ? 0xfbbf24 : 0xffffff, emissiveIntensity: 0.6 }));
    l.position.set(-0.4 + l.geometry.parameters.width / 2, 0.62 - i * 0.08, 0.035);
    lid.add(l);
    codeLines.push(l);
  }

  // lamp
  const lamp = new THREE.Group();
  const lBase = cyl(0.22, 0.25, 0.06, 10, M.dark);
  const lArm = cyl(0.03, 0.03, 0.9, 6, M.dark); lArm.position.set(0, 0.45, 0); lArm.rotation.z = 0.25;
  const lHead = cyl(0.08, 0.22, 0.25, 10, M.dark); lHead.position.set(-0.22, 0.88, 0); lHead.rotation.z = 0.9;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), M.lamp); bulb.position.set(-0.3, 0.8, 0);
  lamp.add(lBase, lArm, lHead, bulb);
  lamp.position.set(1.25, 1.56, -2.25);
  station.add(lamp);
  station.add(lampLight);
  lampLight.position.set(0.9, 2.4, -2.2);

  // mini solar panel model + mini wind turbine on the desk
  const miniPv = new THREE.Group();
  const pvPanel = box(0.6, 0.03, 0.4, M.pv); pvPanel.rotation.x = -0.5; pvPanel.position.y = 0.22;
  const pvLeg = cyl(0.02, 0.02, 0.22, 6, M.metal); pvLeg.position.y = 0.11;
  miniPv.add(pvPanel, pvLeg);
  miniPv.position.set(-1.1, 1.56, -2.25);
  station.add(miniPv);

  const miniWt = new THREE.Group();
  const wtTower = cyl(0.02, 0.04, 0.9, 6, M.white); wtTower.position.y = 0.45;
  const rotor = new THREE.Group(); rotor.position.set(0, 0.9, 0.05);
  for (let i = 0; i < 3; i++) {
    const h = new THREE.Group(); h.rotation.z = (i * Math.PI * 2) / 3;
    const bl = box(0.05, 0.35, 0.01, M.white); bl.position.y = 0.175; h.add(bl); rotor.add(h);
  }
  miniWt.add(wtTower, rotor);
  miniWt.position.set(-1.45, 1.56, -1.6);
  miniWt.rotation.y = 0.6;
  station.add(miniWt);

  // mug with steam
  const mug = cyl(0.11, 0.1, 0.22, 10, M.mug); mug.position.set(0.95, 1.67, -1.4); station.add(mug);
  const steam = [];
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
    s.position.set(0.95, 1.85, -1.4);
    s.userData.o = i / 3;
    station.add(s); steam.push(s);
  }

  // plant
  const plant = new THREE.Group();
  const pot = cyl(0.3, 0.22, 0.5, 8, M.pot); pot.position.y = 0.25;
  plant.add(pot);
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.9, 4), M.leaf);
    leaf.castShadow = true;
    leaf.position.y = 0.8;
    leaf.rotation.set(Math.cos(i) * 0.5, i, Math.sin(i * 2) * 0.5);
    plant.add(leaf);
  }
  plant.position.set(2.5, 0, -2.6);
  world.add(plant);

  // chair
  const chair = new THREE.Group();
  const seat = box(1, 0.12, 0.95, M.chair); seat.position.y = 0.95;
  const back = box(1, 1.1, 0.12, M.chair); back.position.set(0, 1.6, 0.48); back.rotation.x = -0.08;
  const post = cyl(0.06, 0.06, 0.8, 6, M.metal); post.position.y = 0.5;
  const star = box(0.9, 0.06, 0.1, M.metal); star.position.y = 0.1;
  const star2 = star.clone(); star2.rotation.y = Math.PI / 2;
  chair.add(seat, back, post, star, star2);
  chair.position.set(0, 0, -0.75);
  station.add(chair);

  // ---------- Character rig ----------
  const C = {
    skin: mat(0xc98a62), hair: mat(0x1c1410), kurta: mat(0xeab308), trim: mat(0xdc2626),
    dupatta: mat(0x14b8a6), pants: mat(0xf5f5f4), eye: mat(0x111111), bindi: mat(0xb91c1c),
    lip: mat(0x9f3a38), watch: mat(0x111827),
  };
  // The rig is modelled facing local +z; turn it 180° so she faces the desk (station −z).
  const rig = new THREE.Group();
  rig.position.set(0, 1.01, -0.95);
  rig.rotation.y = Math.PI;
  station.add(rig);

  const hips = new THREE.Group(); rig.add(hips);
  const pelvis = box(0.62, 0.22, 0.42, C.kurta); pelvis.position.y = 0.1; hips.add(pelvis);
  // legs (sitting: thighs forward, shins down)
  [-0.16, 0.16].forEach((x) => {
    const thigh = box(0.22, 0.2, 0.62, C.kurta); thigh.position.set(x, 0.08, 0.32); hips.add(thigh);
    const shin = box(0.18, 0.85, 0.18, C.pants); shin.position.set(x, -0.38, 0.6); hips.add(shin);
    const foot = box(0.2, 0.08, 0.3, C.trim); foot.position.set(x, -0.82, 0.68); hips.add(foot);
  });

  const spine = new THREE.Group(); spine.position.y = 0.2; hips.add(spine);
  const torso = cyl(0.27, 0.34, 0.78, 7, C.kurta); torso.position.y = 0.39; spine.add(torso);
  const neckline = box(0.18, 0.04, 0.02, C.trim); neckline.position.set(0, 0.7, 0.24); spine.add(neckline);
  const embroidery = box(0.08, 0.42, 0.02, C.trim); embroidery.position.set(0, 0.45, 0.31); embroidery.rotation.x = -0.08; spine.add(embroidery);
  // dupatta draped over the left shoulder, crossing the chest
  const dup1 = box(0.2, 0.95, 0.04, C.dupatta); dup1.position.set(0.05, 0.42, 0.32); dup1.rotation.set(-0.08, 0, -0.55); spine.add(dup1);
  const dup2 = box(0.2, 0.9, 0.04, C.dupatta); dup2.position.set(0.24, 0.38, -0.3); dup2.rotation.z = 0.12; spine.add(dup2);
  const dupShoulder = box(0.22, 0.05, 0.62, C.dupatta); dupShoulder.position.set(0.26, 0.79, 0); spine.add(dupShoulder);

  const neck = cyl(0.08, 0.09, 0.14, 6, C.skin); neck.position.y = 0.84; spine.add(neck);
  const head = new THREE.Group(); head.position.y = 1.08; spine.add(head);
  const skull = new THREE.Mesh(new THREE.IcosahedronGeometry(0.25, 1), C.skin); skull.scale.set(0.92, 1.08, 0.95); skull.castShadow = true; head.add(skull);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.27, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), C.hair);
  hairCap.position.set(0, 0.04, -0.03); hairCap.rotation.x = -0.25; hairCap.castShadow = true; head.add(hairCap);
  const hairBack = box(0.5, 0.75, 0.16, C.hair); hairBack.position.set(0, -0.25, -0.17); head.add(hairBack);
  [-0.21, 0.21].forEach((x) => { const s = box(0.08, 0.5, 0.14, C.hair); s.position.set(x, -0.16, 0.0); head.add(s); });
  const eyes = [];
  [-0.08, 0.08].forEach((x) => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), C.eye); e.position.set(x, 0.02, 0.225); head.add(e); eyes.push(e);
  });
  const bindi = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), C.bindi); bindi.position.set(0, 0.1, 0.235); head.add(bindi);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 4, 10, Math.PI), C.lip);
  smile.position.set(0, -0.09, 0.22); smile.rotation.z = Math.PI; head.add(smile);

  // arms: shoulder → upper arm → elbow → forearm → hand
  const makeArm = (side) => {
    const shoulder = new THREE.Group(); shoulder.position.set(side * 0.36, 0.7, 0); spine.add(shoulder);
    const upper = cyl(0.075, 0.07, 0.42, 6, C.kurta); upper.position.y = -0.21; shoulder.add(upper);
    const cuff = cyl(0.075, 0.075, 0.06, 6, C.trim); cuff.position.y = -0.42; shoulder.add(cuff);
    const elbow = new THREE.Group(); elbow.position.y = -0.44; shoulder.add(elbow);
    const fore = cyl(0.06, 0.05, 0.38, 6, C.skin); fore.position.y = -0.19; elbow.add(fore);
    const hand = box(0.09, 0.13, 0.05, C.skin); hand.position.y = -0.42; elbow.add(hand);
    if (side > 0) { const w = box(0.13, 0.05, 0.13, C.watch); w.position.y = -0.33; elbow.add(w); }
    return { shoulder, elbow, hand };
  };
  const armL = makeArm(1);   // her left (at +x in rig space)
  const armR = makeArm(-1);  // her right

  // thought bulb
  const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 1.5, transparent: true, opacity: 0 });
  const idea = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 1), bulbMat);
  idea.position.set(0.2, 2.25, 0);
  rig.add(idea);

  // ---------- Theme ----------
  function applyTheme() {
    const c = THEME[getTheme()];
    M.floor.color.setHex(c.floor); M.wall.color.setHex(c.wall); M.wall2.color.setHex(c.wall2);
    M.desk.color.setHex(c.desk); M.rug.color.setHex(c.rug);
    M.lamp.color.setHex(c.lamp); M.lamp.emissive.setHex(c.lamp);
    M.screen.color.setHex(c.screen); M.screen.emissive.setHex(c.screen);
    lampLight.intensity = getTheme() === 'dark' ? 8 : 3;
  }
  applyTheme();

  // ---------- Sizing ----------
  function resize() {
    const w = container.clientWidth, h = container.clientHeight || 380;
    renderer.setSize(w, h, false);
    const aspect = w / h, zoom = 3.5;
    camera.left = -zoom * aspect; camera.right = zoom * aspect;
    camera.top = zoom; camera.bottom = -zoom;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  // ---------- Interaction: drag to rotate ----------
  let yaw = -0.25, yawTarget = -0.25, dragging = false, lastX = 0;
  container.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; });
  addEventListener('pointerup', () => { dragging = false; });
  container.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    yawTarget = Math.max(-1.1, Math.min(0.7, yawTarget + (e.clientX - lastX) * 0.008));
    lastX = e.clientX;
  });

  // ---------- Animation state machine ----------
  let mode = 'type', modeT = 0, autoWaveDone = false;
  const setMode = (m) => { mode = m; modeT = 0; };
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = (obj, prop, val, k) => { obj[prop] = lerp(obj[prop], val, k); };

  let visible = false;
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !autoWaveDone) { autoWaveDone = true; setMode('wave'); onModeChange?.('wave'); }
  }, { threshold: 0.3 }).observe(container);

  let onModeChange = null;
  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    modeT += dt;
    const k = Math.min(1, dt * 8);

    yaw = lerp(yaw, yawTarget, Math.min(1, dt * 6));
    world.rotation.y = yaw;

    // breathing + idle sway
    spine.rotation.z = Math.sin(t * 0.8) * 0.02;
    spine.scale.y = 1 + Math.sin(t * 2) * 0.008;

    // blink
    const blink = (t % 4) < 0.12 ? 0.1 : 1;
    eyes.forEach((e) => (e.scale.y = blink));

    // laptop code shimmer
    codeLines.forEach((l, i) => (l.scale.x = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.5 + i))));
    rotor.rotation.z -= dt * 4;
    steam.forEach((s) => {
      const u = (t * 0.35 + s.userData.o) % 1;
      s.position.y = 1.82 + u * 0.6;
      s.position.x = 0.95 + Math.sin(u * 6 + s.userData.o * 5) * 0.05;
      s.material.opacity = 0.5 * (1 - u);
      s.scale.setScalar(0.6 + u);
    });

    const tgt = {
      lSx: -0.75, lSz: 0.12, lEx: -0.95, lEz: 0,
      rSx: -0.75, rSz: -0.12, rEx: -0.95, rEz: 0,
      hx: 0.18, hy: 0, hz: 0, spX: 0.06, bulb: 0,
    };

    if (mode === 'type' || reduced) {
      tgt.lEx += Math.sin(t * 18) * 0.12;
      tgt.rEx += Math.sin(t * 18 + 1.7) * 0.12;
      tgt.lSz += Math.sin(t * 3) * 0.05;
      tgt.hy = Math.sin(t * 0.6) * 0.12;
      if (!reduced && modeT > 9) { setMode('wave'); onModeChange?.('wave', true); }
    } else if (mode === 'wave') {
      // turn toward the viewer and wave with the right hand
      tgt.rSx = -0.2; tgt.rSz = -2.5; tgt.rEz = -0.35 + Math.sin(t * 10) * 0.45; tgt.rEx = 0;
      tgt.hy = 0.1; tgt.hx = -0.05; tgt.hz = -0.12; tgt.spX = 0;
      if (modeT > 3.2) { setMode('type'); onModeChange?.('type'); }
    } else if (mode === 'think') {
      // right hand under chin, eyes up, idea bulb appears
      tgt.rSx = -1.15; tgt.rSz = 0.25; tgt.rEx = -2.0; tgt.rEz = 0.2;
      tgt.hx = -0.25 + Math.sin(t * 1.2) * 0.04; tgt.hy = 0.25; tgt.hz = 0.1; tgt.spX = 0.12;
      tgt.bulb = modeT > 0.7 ? 1 : 0;
      if (modeT > 5) { setMode('type'); onModeChange?.('type'); }
    }

    ease(armL.shoulder.rotation, 'x', tgt.lSx, k); ease(armL.shoulder.rotation, 'z', tgt.lSz, k);
    ease(armL.elbow.rotation, 'x', tgt.lEx, k); ease(armL.elbow.rotation, 'z', tgt.lEz, k);
    ease(armR.shoulder.rotation, 'x', tgt.rSx, k); ease(armR.shoulder.rotation, 'z', tgt.rSz, k);
    ease(armR.elbow.rotation, 'x', tgt.rEx, k); ease(armR.elbow.rotation, 'z', tgt.rEz, k);
    ease(head.rotation, 'x', tgt.hx, k); ease(head.rotation, 'y', tgt.hy, k); ease(head.rotation, 'z', tgt.hz, k);
    ease(spine.rotation, 'x', tgt.spX, k);
    bulbMat.opacity = lerp(bulbMat.opacity, tgt.bulb, k);
    idea.position.y = 2.25 + Math.sin(t * 3) * 0.05;
    idea.rotation.y += dt;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  return {
    applyTheme,
    setMode,
    onMode(fn) { onModeChange = fn; },
  };
}
