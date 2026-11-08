(() => {
  'use strict';

  const rand = (min, max) => Math.random() * (max - min) + min;

  /* ================= STARS & PARTICLES ================= */
  function buildStars() {
    const el = document.getElementById('stars');
    if (!el) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('i');
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.animationDelay = rand(0, 4) + 's';
      s.style.animationDuration = rand(3, 6) + 's';
      if (Math.random() > 0.7) { s.style.width = '3px'; s.style.height = '3px'; }
      frag.appendChild(s);
    }
    el.appendChild(frag);
  }
  function buildParticles() {
    const el = document.getElementById('particles');
    if (!el) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('i');
      p.style.left = rand(0, 100) + '%';
      p.style.bottom = rand(-10, 10) + '%';
      p.style.animationDuration = rand(10, 22) + 's';
      p.style.animationDelay = rand(0, 12) + 's';
      p.style.transform = `scale(${rand(0.5, 1.4)})`;
      frag.appendChild(p);
    }
    el.appendChild(frag);
  }

  /* ================= SVG FACTORIES ================= */
  function diyaSVG(lit = true, uid) {
    const gid = 'dg' + uid;
    return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="${gid}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff5d1" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#ffb347" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle class="flame-glow" cx="20" cy="14" r="10" fill="url(#${gid})"/>
      <path class="flame" d="M20 6 Q24 13 20 17 Q16 13 20 6 Z" fill="#ffdd8a"/>
      <path d="M6 22 Q20 16 34 22 Q31 31 20 32 Q9 31 6 22 Z" fill="#8b3a1a"/>
      <path d="M6 22 Q20 19 34 22" stroke="#e8b06a" stroke-width="0.6" fill="none" opacity="0.8"/>
    </svg>`;
  }

  function buildDiyaRow(container, count, startLit = true) {
    if (!container) return [];
    const items = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 'diya-mini';
      if (startLit) d.classList.add('lit');
      d.innerHTML = diyaSVG(startLit, `e${i}-${Math.floor(rand(0, 9999))}`);
      d.style.animationDelay = rand(0, 3) + 's';
      container.appendChild(d);
      items.push(d);
    }
    return items;
  }

  /* ================= SCENE MANAGER ================= */
  const scenes = document.querySelectorAll('.scene');
  let current = 1;

  function goTo(next) {
    if (next === current) return;
    const currEl = document.querySelector(`.scene[data-scene="${current}"]`);
    const nextEl = document.querySelector(`.scene[data-scene="${next}"]`);
    if (!nextEl) return;

    const dir = next > current ? 'left' : 'right';
    currEl.classList.add('exit-' + dir);
    currEl.classList.remove('active');
    setTimeout(() => currEl.classList.remove('exit-' + dir), 950);

    nextEl.classList.add('active');
    current = next;

    if (next === 5) startPetals();
  }

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-next]');
    if (btn) {
      const n = parseInt(btn.dataset.next, 10);
      if (!isNaN(n)) goTo(n);
    }
  });

  /* ================= SCENE 2 — ONE-TAP LIGHT ALL DIYAS ================= */
  let diyaItems = [];
  let diyasLit = false;

  function initScene2Diyas() {
    diyaItems = buildDiyaRow(document.getElementById('scene2Diyas'), 13, false);
  }

  function lightAllDiyas() {
    if (diyasLit) return;
    diyasLit = true;

    // Light central diya
    const central = document.getElementById('centralDiya');
    if (central) central.classList.add('lit');

    // Ripple through the diyas in sequence
    diyaItems.forEach((d, i) => {
      setTimeout(() => d.classList.add('lit'), 120 + i * 90);
    });

    // Reveal the continue button after ripple completes
    const next = document.getElementById('scene2Next');
    if (next) {
      setTimeout(() => next.classList.add('show'), 120 + diyaItems.length * 90 + 400);
    }

    // Hide the "light" button
    const lightBtn = document.getElementById('lightDiyasBtn');
    if (lightBtn) {
      lightBtn.style.transition = 'opacity 0.4s, transform 0.4s';
      lightBtn.style.opacity = '0';
      lightBtn.style.transform = 'translateY(-6px)';
      lightBtn.style.pointerEvents = 'none';
      setTimeout(() => lightBtn.remove(), 500);
    }
  }

  const lightBtn = document.getElementById('lightDiyasBtn');
  if (lightBtn) lightBtn.addEventListener('click', lightAllDiyas);
  const centralDiya = document.getElementById('centralDiya');
  if (centralDiya) centralDiya.addEventListener('click', lightAllDiyas);

  /* ================= SCENE 3 — LANTERNS ================= */
  const LANTERNS = [
    { wish: 'May every ordinary day bring you an extraordinary reason to smile.' },
    { wish: 'May every dream you hold close slowly turn into something beautiful.' },
    { wish: 'May your efforts always find their reward, and may you keep surprising yourself.' },
    { wish: 'May your heart always find peace, even when the world gets a little chaotic.' },
    { wish: 'May life gift you countless moments worth remembering.' },
    { wish: 'May beautiful surprises find you when you least expect them.' }
  ];

  function lanternSVG() {
    return `<svg viewBox="0 0 60 110" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lg" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stop-color="#fff5d1"/>
          <stop offset="60%" stop-color="#ffb347"/>
          <stop offset="100%" stop-color="#e08a3b"/>
        </radialGradient>
      </defs>
      <path d="M30 4 V14" stroke="#c8933b" stroke-width="1.2" fill="none"/>
      <path d="M20 14 Q30 8 40 14 L42 16 Q30 12 18 16 Z" fill="#c8933b"/>
      <path d="M18 20 Q30 14 42 20 L44 70 Q30 78 16 70 Z" fill="url(#lg)" opacity="0.95"/>
      <path d="M18 20 Q30 14 42 20" stroke="#f5d68a" stroke-width="0.8" fill="none" opacity="0.7"/>
      <path d="M16 70 Q30 78 44 70 L42 78 Q30 84 18 78 Z" fill="#c8933b"/>
      <path d="M30 78 V88" stroke="#c8933b" stroke-width="1" fill="none"/>
      <circle cx="30" cy="90" r="1.5" fill="#f5d68a"/>
    </svg>`;
  }

  function buildLanterns() {
    const field = document.getElementById('lanternField');
    if (!field) return;
    field.innerHTML = '';
    // spread lanterns along bottom, jittered
    const n = LANTERNS.length;
    for (let i = 0; i < n; i++) {
      const btn = document.createElement('button');
      btn.className = 'lantern';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Release a wish lantern');
      btn.innerHTML = lanternSVG();
      const pct = (i + 0.5) / n * 88 + 6;
      btn.style.left = `calc(${pct}% - clamp(22px, 3vw, 35px))`;
      btn.style.bottom = rand(6, 22) + '%';
      btn.style.animationDelay = rand(0, 2) + 's';
      btn.addEventListener('click', () => releaseLantern(btn, i));
      field.appendChild(btn);
    }
  }

  const wishReveal = document.getElementById('wishReveal');
  const wishText   = document.getElementById('wishText');

  function releaseLantern(btn, index) {
    if (btn.classList.contains('released')) return;
    btn.classList.add('released');
    setTimeout(() => showWish(LANTERNS[index].wish), 500);
  }

  function showWish(text) {
    if (!wishReveal || !wishText) return;
    wishText.textContent = text;
    wishReveal.classList.add('show');
    clearTimeout(showWish._t);
    showWish._t = setTimeout(() => wishReveal.classList.remove('show'), 4200);
  }

  if (wishReveal) {
    wishReveal.addEventListener('click', () => wishReveal.classList.remove('show'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') wishReveal.classList.remove('show');
    });
  }

  /* ================= SCENE 4 — CRACKERS ================= */
  function crackerSVG(uid) {
    return `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="c${uid}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#8b1e2d"/>
          <stop offset="50%" stop-color="#c8933b"/>
          <stop offset="100%" stop-color="#8b1e2d"/>
        </linearGradient>
      </defs>
      <path d="M20 6 Q22 2 24 4" stroke="#c8933b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M20 6 Q18 3 16 5" stroke="#c8933b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <circle cx="20" cy="6" r="1.5" fill="#f5d68a"/>
      <rect x="14" y="10" width="12" height="42" rx="2" fill="url(#c${uid})"/>
      <rect x="14" y="18" width="12" height="2" fill="#f5d68a" opacity="0.7"/>
      <rect x="14" y="30" width="12" height="2" fill="#f5d68a" opacity="0.7"/>
      <rect x="14" y="42" width="12" height="2" fill="#f5d68a" opacity="0.7"/>
      <path d="M14 52 L18 56 M26 52 L22 56" stroke="#c8933b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  let crackerCount = 0;
  const crackerCountEl = document.getElementById('crackerCount');

  function buildCrackers() {
    const field = document.getElementById('crackerField');
    if (!field) return;
    field.innerHTML = '';
    const cols = window.innerWidth < 640 ? 5 : 8;
    const rows = 3;
    const total = cols * rows;
    for (let i = 0; i < total; i++) {
      const c = document.createElement('button');
      c.className = 'cracker';
      c.type = 'button';
      c.setAttribute('aria-label', 'Light a cracker');
      c.innerHTML = crackerSVG(i + '-' + Math.floor(rand(0, 9999)));
      const col = i % cols;
      const row = Math.floor(i / cols);
      const xPct = (col + 0.5) / cols * 92 + 4;
      const yPct = 55 + row * 14;
      c.style.left = `calc(${xPct}% - clamp(13px, 2vw, 20px))`;
      c.style.top = yPct + '%';
      c.style.animationDelay = rand(0, 2) + 's';
      c.addEventListener('click', () => lightCracker(c));
      field.appendChild(c);
    }
  }

  // --------- Cracker sound (optional file) ---------
  const crackerAudio = new Audio('assets/crackers.mp3');
  crackerAudio.preload = 'auto';
  crackerAudio.volume = 0.5;
  let crackerAudioOk = true;
  crackerAudio.addEventListener('error', () => { crackerAudioOk = false; });

  function playCrackerSound() {
    if (!crackerAudioOk) return;
    try {
      const clone = crackerAudio.cloneNode();
      clone.volume = crackerAudio.volume;
      clone.play().catch(() => {});
    } catch (err) { /* silent */ }
  }

  function lightCracker(el) {
    if (el.classList.contains('lit')) return;
    el.classList.add('lit');
    playCrackerSound();

    // Launch + burst
    const rect = el.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;
    burstFirework(startX, startY);

    crackerCount++;
    if (crackerCountEl) {
      crackerCountEl.textContent = crackerCount + (crackerCount === 1 ? ' cracker lit' : ' crackers lit');
    }
  }

  // --------- Firework burst (page-level overlay) ---------
  function burstFirework(x, y) {
    const container = document.body;
    const hue = Math.floor(rand(0, 360));
    const count = 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'fw-particle';
      p.style.position = 'fixed';
      p.style.left = x + 'px';
      p.style.top  = y + 'px';
      const color = `hsl(${(hue + rand(-25, 25)) % 360}, 90%, ${rand(60, 78)}%)`;
      p.style.background = color;
      p.style.boxShadow = `0 0 10px ${color}, 0 0 22px ${color}`;
      container.appendChild(p);

      const angle = (Math.PI * 2 * i) / count + rand(-0.1, 0.1);
      const dist  = rand(60, 160);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 60;

      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 }
      ], {
        duration: rand(900, 1500),
        easing: 'cubic-bezier(0.15, 0.8, 0.3, 1)',
        fill: 'forwards'
      }).onfinish = () => p.remove();
    }
  }

  /* ================= SCENE 5 — FINALE ================= */
  function startPetals() {
    const container = document.getElementById('petals');
    if (!container || container.dataset.started) return;
    container.dataset.started = '1';
    const interval = setInterval(() => {
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = rand(0, 100) + '%';
      p.style.animationDuration = rand(6, 12) + 's';
      p.style.width = p.style.height = rand(8, 16) + 'px';
      container.appendChild(p);
      setTimeout(() => p.remove(), 13000);
    }, 350);
    setTimeout(() => clearInterval(interval), 90000);
  }

  function launchFinaleBurst(container) {
    if (!container) return;
    const w = container.clientWidth, h = container.clientHeight;
    const cx = rand(w * 0.15, w * 0.85);
    const cy = rand(h * 0.12, h * 0.55);
    const hue = Math.floor(rand(0, 360));
    const count = 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'fw-particle';
      p.style.left = cx + 'px';
      p.style.top  = cy + 'px';
      const color = `hsl(${(hue + rand(-25, 25)) % 360}, 90%, ${rand(60, 78)}%)`;
      p.style.background = color;
      p.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
      container.appendChild(p);
      const angle = (Math.PI * 2 * i) / count + rand(-0.1, 0.1);
      const dist  = rand(80, 170);
      const dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist;
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 }
      ], { duration: rand(900, 1500), easing: 'cubic-bezier(0.15, 0.8, 0.3, 1)', fill: 'forwards' })
        .onfinish = () => p.remove();
    }
  }

  function celebrateSequence() {
    const container = document.getElementById('finaleFireworks');
    if (!container) return;
    let count = 0;
    const total = 8;
    const launch = () => {
      launchFinaleBurst(container);
      playCrackerSound();
      count++;
      if (count < total) setTimeout(launch, rand(250, 550));
    };
    launch();
  }

  // Rangoli petals (built once)
  function buildRangoli() {
    const g = document.getElementById('rangoliPetals');
    if (!g) return;
    const NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 16; i++) {
      const angle = (360 / 16) * i;
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', 'M150 60 Q165 110 150 150 Q135 110 150 60 Z');
      path.setAttribute('transform', `rotate(${angle} 150 150)`);
      path.setAttribute('fill', i % 2 ? '#e08a3b' : 'none');
      path.setAttribute('stroke', '#e08a3b');
      path.setAttribute('stroke-width', '0.8');
      path.setAttribute('opacity', '0.7');
      g.appendChild(path);
    }
  }

  /* ================= MUSIC ================= */
  const audio = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicStarted = false;

  function startMusic() {
    if (!audio) return;
    audio.volume = 0.35;
    const p = audio.play();
    if (p && p.catch) p.catch(() => { musicStarted = false; musicToggle.classList.remove('playing'); });
    musicStarted = true;
    musicToggle.classList.add('playing');
  }
  function stopMusic() {
    if (!audio) return;
    audio.pause(); musicStarted = false;
    musicToggle.classList.remove('playing');
  }
  if (musicToggle && audio) {
    musicToggle.addEventListener('click', () => { musicStarted ? stopMusic() : startMusic(); });
    const gesture = () => {
      if (!musicStarted) startMusic();
      document.removeEventListener('pointerdown', gesture);
      document.removeEventListener('keydown', gesture);
    };
    document.addEventListener('pointerdown', gesture, { once: true });
    document.addEventListener('keydown', gesture, { once: true });
  }

  /* ================= INIT ================= */
  function init() {
    buildStars();
    buildParticles();
    buildDiyaRow(document.getElementById('entranceDiyas'), 11, true);
    initScene2Diyas();
    buildLanterns();
    buildCrackers();
    buildRangoli();

    const celebrate = document.getElementById('celebrateBtn');
    if (celebrate) celebrate.addEventListener('click', celebrateSequence);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();