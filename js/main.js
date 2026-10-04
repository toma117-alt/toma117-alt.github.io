import { projects, thesis, timeline, skills, interests, personalInterests, GITHUB_PROFILE } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- Theme ---------------- */
const mq = matchMedia('(prefers-color-scheme: dark)');
const getTheme = () => document.documentElement.dataset.theme || (mq.matches ? 'dark' : 'light');
const themeListeners = [];
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('theme', t); } catch (e) {}
  themeListeners.forEach((fn) => fn());
}
$('#themeToggle').addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));
mq.addEventListener?.('change', () => { if (!document.documentElement.dataset.theme) themeListeners.forEach((fn) => fn()); });

/* ---------------- Icons ---------------- */
const ICONS = {
  grid: '<path d="M4 18h16M6 18V9l6-4 6 4v9M9 18v-5h6v5"/><path d="M12 2v3"/>',
  wave: '<path d="M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0"/><path d="M2 20h20"/>',
  thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v7"/>',
  coil: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v16M15 4v16M9 8h6M9 12h6M9 16h6"/>',
  drone: '<circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="m7 7 2 2m8-2-2 2m-8 8 2-2m8 2-2-2"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 19 5"/><circle cx="12" cy="12" r="1"/>',
  meter: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="m12 16 4-6"/><path d="M3 20h18"/>',
  antenna: '<path d="M12 10v12M8 22h8"/><path d="M8.5 6.5a5 5 0 0 1 7 0M5.5 3.5a9 9 0 0 1 13 0"/><circle cx="12" cy="10" r="1.5"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  field: '<path d="M4 4h16v16H4z"/><path d="M4 12c4-4 12 4 16 0M4 8c4-4 12 4 16 0M4 16c4-4 12 4 16 0"/>',
};
const icon = (k) => `<span class="picon"><svg viewBox="0 0 24 24">${ICONS[k] || ICONS.chip}</svg></span>`;
const ghSvg = '<svg viewBox="0 0 24 24"><path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>';
const repoTag = (p) => p.hasRepo
  ? `<span class="repo-tag">${ghSvg} View repository →</span>`
  : `<span class="repo-tag soft">${ghSvg} Browse on GitHub →</span>`;
const linkAttrs = (p) => `href="${esc(p.repo)}" target="_blank" rel="noopener" aria-label="${esc(p.title)} — open on GitHub"`;

/* ---------------- Typer ---------------- */
(function typer() {
  const words = ['renewable energy systems.', 'hybrid PV-battery microgrids.', 'power-system optimizers.', 'embedded hardware.', 'smarter, cleaner grids.'];
  const el = $('#typer');
  if (reduced) { el.textContent = words[0]; return; }
  let w = 0, i = 0, del = false;
  (function tick() {
    const word = words[w];
    i += del ? -1 : 1;
    el.textContent = word.slice(0, i);
    let d = del ? 35 : 70;
    if (!del && i === word.length) { del = true; d = 1600; }
    else if (del && i === 0) { del = false; w = (w + 1) % words.length; d = 300; }
    setTimeout(tick, d);
  })();
})();

/* ---------------- Counters ---------------- */
function runCounter(el) {
  const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
  const t0 = performance.now(), dur = 1400;
  (function step(now) {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = (to * e).toFixed(dec);
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* ---------------- Reveal on scroll ---------------- */
const revealIO = new IntersectionObserver((ents) => {
  ents.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    $$('[data-count]', en.target).forEach(runCounter);
    revealIO.unobserve(en.target);
  });
}, { threshold: 0.12 });

/* ---------------- 3D tilt (cards rotate toward cursor) ---------------- */
function bindTilt(el, max = 12) {
  if (reduced || matchMedia('(hover: none)').matches) return;
  let raf = 0;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) scale3d(1.02,1.02,1.02)`;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
    });
  });
  el.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); el.style.transform = ''; });
}

/* ---------------- Hero orbit navigation ---------------- */
function orbitNav() {
  const planets = $$('#orbitNav .planet');
  const stage = $('#orbitStage');
  let a = 0, paused = false;
  stage.addEventListener('pointerenter', () => (paused = true));
  stage.addEventListener('pointerleave', () => (paused = false));
  (function loop() {
    if (!paused && !reduced) a += 0.0035;
    const R = stage.clientWidth * 0.56;
    planets.forEach((p, i) => {
      const th = a + (i / planets.length) * Math.PI * 2;
      const x = Math.cos(th) * R, z = Math.sin(th);
      const y = z * R * 0.26;
      const s = 0.78 + (z + 1) * 0.16;
      p.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${s})`;
      p.style.zIndex = z > 0 ? 3 : 1;
      p.style.opacity = (0.55 + (z + 1) * 0.225).toFixed(2);
    });
    requestAnimationFrame(loop);
  })();
}

/* ---------------- Nav: active section + rail progress + dock magnify ---------------- */
function navigation() {
  const ids = ['home', 'about', 'skills', 'journey', 'research', 'projects', 'contact'];
  const sections = ids.map((id) => document.getElementById(id));
  const railLinks = $$('.rail a'), dockLinks = $$('.dock a');
  const railCur = $('.rail-current');
  function update() {
    const mid = innerHeight * 0.4;
    let idx = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i; });
    [railLinks, dockLinks].forEach((L) => L.forEach((a, i) => a.classList.toggle('active', i === idx)));
    const max = document.documentElement.scrollHeight - innerHeight;
    railCur.style.height = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  }
  addEventListener('scroll', update, { passive: true });
  update();

  const dock = $('.dock');
  if (matchMedia('(hover: hover)').matches && !reduced) {
    dock.addEventListener('pointermove', (e) => {
      dockLinks.forEach((a) => {
        const r = a.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        a.style.setProperty('--s', (1 + Math.max(0, 1 - d / 120) * 0.45).toFixed(3));
      });
    });
    dock.addEventListener('pointerleave', () => dockLinks.forEach((a) => a.style.setProperty('--s', 1)));
  }
}

/* ---------------- Skills: 3D tag sphere ---------------- */
const CAT_COLORS = ['#2dd4bf', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa'];
function skillsSection() {
  const cats = Object.entries(skills);
  const tags = [];
  $('#skillCats').innerHTML = cats.map(([name, list], ci) => `
    <div class="skill-cat" style="--c:${CAT_COLORS[ci]}" data-cat="${ci}">
      <h4>${esc(name)}</h4>
      <div class="chip-row">${list.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    </div>`).join('');
  cats.forEach(([, list], ci) => list.forEach((s) => tags.push({ s, ci })));

  const sphere = $('#tagSphere');
  const els = tags.map(({ s, ci }) => {
    const el = document.createElement('span');
    el.textContent = s;
    el.style.setProperty('--c', CAT_COLORS[ci]);
    el.dataset.cat = ci;
    sphere.appendChild(el);
    return el;
  });
  const n = els.length;
  const pts = els.map((_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n), th = Math.PI * (1 + Math.sqrt(5)) * i;
    return [Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)];
  });

  let rx = 0, ry = 0, vx = 0.0025, vy = 0.004, drag = false, lx = 0, ly = 0;
  sphere.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; sphere.setPointerCapture(e.pointerId); });
  sphere.addEventListener('pointermove', (e) => {
    if (!drag) return;
    vy = (e.clientX - lx) * 0.0025; vx = -(e.clientY - ly) * 0.0025;
    lx = e.clientX; ly = e.clientY;
  });
  sphere.addEventListener('pointerup', () => (drag = false));

  $$('.skill-cat').forEach((c) => {
    c.addEventListener('pointerenter', () => els.forEach((e) => e.classList.toggle('lit', e.dataset.cat === c.dataset.cat)));
    c.addEventListener('pointerleave', () => els.forEach((e) => e.classList.remove('lit')));
  });

  let visible = false;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(sphere);
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    if (!drag && !reduced) { vx += (0.0015 - vx) * 0.02; vy += (0.0035 - vy) * 0.02; }
    if (reduced && !drag) { vx = 0; vy = 0; }
    rx += vx; ry += vy;
    const R = sphere.clientWidth * 0.42;
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    pts.forEach(([x, y, z], i) => {
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      const s = 0.62 + (z2 + 1) * 0.3;
      const el = els[i];
      el.style.transform = `translate(-50%,-50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${s.toFixed(3)})`;
      el.style.opacity = (0.3 + (z2 + 1) * 0.35).toFixed(2);
      el.style.zIndex = Math.round((z2 + 1) * 100);
    });
  })();

  $('#researchInterests').innerHTML = interests.map((s) => `<span class="chip">${esc(s)}</span>`).join('');
  $('#personalInterests').innerHTML = personalInterests.map((s) => `<span class="chip">${esc(s)}</span>`).join('');
}

/* ---------------- Timeline in 3D ---------------- */
const KIND_COLOR = { Education: 'var(--accent)', Experience: 'var(--accent-2)', Leadership: 'var(--accent-3)' };
function timelineSection() {
  const track = $('#timeline');
  track.innerHTML = timeline.map((t) => `
    <div class="tl-item" style="--k:${KIND_COLOR[t.kind]}">
      <span class="tl-node"></span>
      <div class="tl-card">
        <span class="tl-when">${esc(t.when)}</span><span class="tl-kind">${esc(t.kind)}</span>
        <h3>${esc(t.title)}</h3>
        <p class="tl-org">${esc(t.org)}</p>
        ${t.detail ? `<div class="tl-detail">${esc(t.detail)}</div>` : ''}
        ${t.points ? `<ul>${t.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('');
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.25 });
  $$('.tl-item', track).forEach((el) => io.observe(el));
}

/* ---------------- Thesis + exploded view ---------------- */
function researchSection() {
  $('#thesisCard').innerHTML = `
    <span class="ttype">${esc(thesis.type)}</span>
    <h3>${esc(thesis.title)}</h3>
    <p class="sup">Supervisor: ${esc(thesis.supervisor)}</p>
    <div class="metrics">${thesis.metrics.map((m) => `<div>${esc(m)}</div>`).join('')}</div>
    <ul>${thesis.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    <a class="btn-primary" href="${esc(thesis.repo)}" target="_blank" rel="noopener">${ghSvg} View thesis code on GitHub</a>`;

  const ex = $('#exploded');
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) setTimeout(() => ex.classList.add('open'), 500);
    else ex.classList.remove('open');
  }, { threshold: 0.5 });
  io.observe(ex);
  ex.addEventListener('click', () => ex.classList.toggle('open'));
  ex.addEventListener('pointerenter', () => ex.classList.add('open'));
}

/* ---------------- Projects ---------------- */
function projectsSection() {
  const pad = (i) => String(i + 1).padStart(2, '0');

  // 1) Tilt cards
  const grid = $('#tiltGrid');
  grid.innerHTML = projects.map((p, i) => `
    <a class="pcard" ${linkAttrs(p)}>
      <span class="card-shine"></span>
      <span class="pnum">${pad(i)}</span>
      ${icon(p.icon)}
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.points.join(' '))}</p>
      <div class="chip-row">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      ${repoTag(p)}
    </a>`).join('');
  $$('.pcard', grid).forEach((c) => bindTilt(c, 16));

  // 2) Flipping cubes: four projects per cube, plus a "more" face to fill.
  const faces = [...projects];
  while (faces.length % 4) faces.push(null);
  const cubeGrid = $('#cubeGrid');
  const cubes = [];
  for (let c = 0; c < faces.length / 4; c++) {
    const set = faces.slice(c * 4, c * 4 + 4);
    cubeGrid.insertAdjacentHTML('beforeend', `
      <div class="cube-scene"><div class="cube">
        ${set.map((p) => p ? `
          <a class="cube-face" ${linkAttrs(p)}>
            ${icon(p.icon)}
            <h3>${esc(p.short)}</h3>
            <p>${esc(p.points[0])}</p>
            ${repoTag(p)}
          </a>` : `
          <a class="cube-face more" href="${GITHUB_PROFILE}?tab=repositories" target="_blank" rel="noopener">
            <h3>More on GitHub</h3><p>Browse all repositories →</p>
          </a>`).join('')}
      </div></div>`);
  }
  $$('.cube', cubeGrid).forEach((cube, i) => {
    const st = { cube, step: 0, hover: false };
    cube.addEventListener('pointerenter', () => (st.hover = true));
    cube.addEventListener('pointerleave', () => (st.hover = false));
    cubes.push(st);
    setTimeout(() => {
      setInterval(() => {
        if (st.hover || reduced || !$('.pview[data-view="cubes"]').classList.contains('active')) return;
        st.step++;
        cube.style.transform = `translateZ(-125px) rotateY(${-90 * st.step}deg) rotateX(${st.step % 2 ? 6 : -6}deg)`;
      }, 3200);
    }, i * 700);
  });

  // 3) Orbit carousel
  const ring = $('#ocRing');
  const n = projects.length, step = 360 / n;
  ring.innerHTML = projects.map((p, i) => `
    <div class="oc-item" data-i="${i}">
      <a class="pcard" ${linkAttrs(p)}>
        ${icon(p.icon)}
        <h3>${esc(p.short)}</h3>
        <p>${esc(p.points[0])}</p>
        ${repoTag(p)}
      </a>
    </div>`).join('');
  const items = $$('.oc-item', ring);
  const core = $('.oc-core');
  ring.prepend(core); // inside the 3D ring so cards in front can occlude it
  let cur = 0, ocHover = false;
  function layout() {
    const w = ring.clientWidth;
    const radius = Math.round((w / 2) / Math.tan(Math.PI / n) + 30);
    items.forEach((it, i) => (it.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`));
    ring.style.transform = `translateZ(${-radius}px) rotateX(-6deg) rotateY(${-cur * step}deg)`;
    core.style.transform = `rotateY(${cur * step}deg)`;
    items.forEach((it, i) => {
      let d = Math.abs(((i - cur) % n + n) % n);
      d = Math.min(d, n - d);
      it.style.opacity = d === 0 ? 1 : d <= 1 ? 0.75 : d <= 2 ? 0.45 : 0.15;
      it.style.pointerEvents = d <= 1 ? 'auto' : 'none';
      it.style.filter = d === 0 ? 'none' : 'blur(0.5px)';
    });
    const p = projects[((cur % n) + n) % n];
    $('#ocLabel').textContent = `${pad(((cur % n) + n) % n)} / ${n} · ${p.short}`;
  }
  const go = (d) => { cur += d; layout(); };
  $('#ocPrev').addEventListener('click', () => go(-1));
  $('#ocNext').addEventListener('click', () => go(1));
  ring.addEventListener('pointerenter', () => (ocHover = true));
  ring.addEventListener('pointerleave', () => (ocHover = false));
  // Clicking a side card brings it to the front instead of navigating.
  items.forEach((it, i) => it.addEventListener('click', (e) => {
    const idx = ((cur % n) + n) % n;
    if (i !== idx) { e.preventDefault(); let d = i - idx; if (d > n / 2) d -= n; if (d < -n / 2) d += n; go(d); }
  }));
  let sx = null;
  const oc = $('#orbitCarousel');
  oc.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  oc.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
  setInterval(() => {
    if (!ocHover && !reduced && $('.pview[data-view="orbit"]').classList.contains('active')) go(1);
  }, 3500);
  addEventListener('resize', layout);

  // View switcher
  $$('.view-switch button').forEach((b) => b.addEventListener('click', () => {
    $$('.view-switch button').forEach((x) => x.classList.toggle('active', x === b));
    $$('.pview').forEach((v) => v.classList.toggle('active', v.dataset.view === b.dataset.view));
    if (b.dataset.view === 'orbit') requestAnimationFrame(layout);
  }));
}

/* ---------------- Boot ---------------- */
skillsSection();
timelineSection();
researchSection();
projectsSection();
navigation();
orbitNav();
$$('.tilt').forEach((el) => bindTilt(el, +el.dataset.tiltMax || 10));
$$('.reveal').forEach((el) => revealIO.observe(el));
$('#year').textContent = new Date().getFullYear();

// 3D scenes load after the page content so a WebGL/CDN failure never blanks the site.
const hideLoader = () => $('#loader').classList.add('done');
setTimeout(hideLoader, 2500);
Promise.all([import('./bg.js'), import('./desk.js')]).then(([bg, desk]) => {
  try {
    const b = bg.initBackground($('#bg3d'), getTheme);
    themeListeners.push(b.applyTheme);
  } catch (e) { console.warn('Background 3D disabled:', e); }
  try {
    const d = desk.initDesk($('#deskScene'), getTheme);
    themeListeners.push(d.applyTheme);
    const btns = $$('.desk-controls .pill');
    const mark = (m) => btns.forEach((b) => b.classList.toggle('active', b.dataset.anim === m));
    d.onMode(mark);
    btns.forEach((b) => b.addEventListener('click', () => { d.setMode(b.dataset.anim); mark(b.dataset.anim); }));
  } catch (e) { console.warn('Desk 3D disabled:', e); }
}).catch((e) => console.warn('3D modules failed to load:', e)).finally(hideLoader);
