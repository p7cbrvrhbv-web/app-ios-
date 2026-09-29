/* Anachro : écrans, navigation et boucle de jeu. */
(function (A) {
  'use strict';

  const D = A.data, S = A.store, U = A.ui, W = D.SCENE_W, H = D.SCENE_H;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const screens = { home: $('#screen-home'), era: $('#screen-era'), ranking: $('#screen-ranking'), profile: $('#screen-profile'), game: $('#screen-game') };
  const tabbar = $('#tabbar');
  const toastEl = $('#toast');
  const scene = $('#scene'), inner = $('#sceneInner'), stage = $('#stage');
  const overlay = $('#overlay'), hudTop = $('#hudTop'), hudBottom = $('#hudBottom'), corner = $('#mascotCorner');

  const clock = (ms, up) => { const t = up ? Math.floor(ms / 1000) : Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
  const levelNumber = l => D.levels.indexOf(l) + 1;
  const eraOf = l => D.eras.find(e => e.id === l.era);
  const progress = id => S.get().levels[id] || { stars: 0, points: 0, best: null, plays: 0 };
  const unlocked = l => { const ls = D.inEra(l.era), i = ls.indexOf(l); return i === 0 || progress(ls[i - 1].id).stars > 0; };
  const pct = (v, max) => `${(v / max) * 100}%`;

  let current = 'home';
  let eraView = null;

  /* ---------- navigation ---------- */

  function show(name) {
    current = name;
    for (const k in screens) screens[k].classList.toggle('active', k === name);
    tabbar.hidden = name === 'game';
    $$('.tab', tabbar).forEach(t => t.classList.toggle('active', t.dataset.tab === (name === 'era' ? 'home' : name)));
    screens[name].scrollTop = 0;
  }

  function go(name) {
    if (name === 'home') renderHome();
    if (name === 'era') renderEra();
    if (name === 'ranking') renderRanking();
    if (name === 'profile') renderProfile();
    show(name);
  }

  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ---------- écrans ---------- */

  function renderHome() {
    const st = S.get();
    const daily = D.levels[S.dailyIndex(D.levels.length)];
    const done = S.dailyDone(), streak = S.streak();
    const cards = D.eras.map(e => {
      const ls = D.inEra(e.id);
      const got = ls.reduce((n, l) => n + progress(l.id).stars, 0);
      return `<button class="era-card" data-era="${e.id}" style="--accent:${e.accent}">
        <span class="era-art" style="--shift:${e.shift}%">${D.artHTML(ls[0])}</span><span class="era-shade"></span>
        <span class="era-name">${e.name}</span><span class="era-count">${got}/${ls.length * 3} ${U.icon('star', 14)}</span></button>`;
    }).join('');

    screens.home.innerHTML = `
      <header class="hero">
        ${U.logo()}
        <p class="tagline">Trouve l'objet qui n'a rien à faire là</p>
        <div class="hero-row"><div class="hero-mascot">${U.mascot('search')}</div>
          <p class="hero-pitch">Des époques réelles.<br>Un intrus.<br><b>À toi de le trouver !</b></p></div>
      </header>
      <div class="content">
        <button class="daily ${done ? 'done' : ''}" data-daily="${daily.id}">
          <span class="daily-flame">${U.icon('flame', 30)}<b>${streak}</b></span>
          <span class="daily-text"><small>Niveau du jour</small><strong>${daily.title}</strong><em>${eraOf(daily).name}</em></span>
          <span class="daily-go">${done ? 'Fait ✓' : U.icon('next', 22)}</span>
        </button>
        <h2 class="section">Choisis ton époque</h2>
        <div class="era-list">${cards}</div>
        <p class="foot">${st.points} pts · ${D.levels.length} niveaux · un nouveau niveau chaque jour</p>
      </div>`;
  }

  function renderEra() {
    const e = D.eras.find(x => x.id === eraView);
    const ls = D.inEra(e.id);
    const tiles = ls.map(l => {
      const p = progress(l.id), open = unlocked(l);
      return `<button class="tile ${open ? '' : 'locked'}" ${open ? `data-level="${l.id}"` : 'disabled'} aria-label="${open ? '' : 'Verrouillé : '}Niveau ${levelNumber(l)}, ${l.title}">
        <span class="tile-num">${open ? levelNumber(l) : U.icon('lock', 26)}</span><span class="tile-title">${l.title}</span>${U.stars(p.stars, 3, 18)}
        ${p.best !== null ? `<span class="tile-best">${clock(p.best, true)}</span>` : ''}</button>`;
    }).join('');
    screens.era.innerHTML = `
      <header class="topbar"><button class="icon-btn" data-act="home" aria-label="Retour">${U.icon('back', 24)}</button><h2>${e.name}</h2><span></span></header>
      <div class="content">
        <div class="era-banner" style="--accent:${e.accent}"><span class="era-art" style="--shift:${e.shift}%">${D.artHTML(ls[0])}</span><span class="era-shade"></span><span class="era-name">${e.period}</span></div>
        <p class="lead">${ls.length} niveaux. Un seul objet n'appartient pas à l'époque : 30 secondes, 3 vies.</p>
        <div class="tiles">${tiles}</div>
      </div>`;
  }

  function renderRanking() {
    const rows = D.levels.map(l => {
      const p = progress(l.id);
      return `<li class="rank-row"><span class="rank-n">${levelNumber(l)}</span>
        <span class="rank-t"><strong>${l.title}</strong><small>${eraOf(l).name}</small></span>
        <span class="rank-r">${p.best !== null ? `<b>${clock(p.best, true)}</b><small>${p.points} pts</small>` : '<small>—</small>'}</span></li>`;
    }).join('');
    screens.ranking.innerHTML = `
      <header class="topbar"><span></span><h2>Classement</h2><span></span></header>
      <div class="content">
        <div class="card challenge"><h3>Défie tes potes</h3>
          <p>Envoie un lien : ton pote joue le même niveau et doit battre ton temps.</p>
          <button class="btn btn-primary" data-act="challenge">${U.icon('share', 20)} Défier un ami</button></div>
        <h2 class="section">Tes meilleurs temps</h2>
        <ul class="rank-list">${rows}</ul>
        <p class="foot">Classement mondial : à venir (il faudra un serveur).</p>
      </div>`;
  }

  function renderProfile() {
    const st = S.get();
    const stars = D.levels.reduce((n, l) => n + progress(l.id).stars, 0);
    const done = D.levels.filter(l => progress(l.id).stars > 0).length;
    screens.profile.innerHTML = `
      <header class="topbar"><span></span><h2>Profil</h2><span></span></header>
      <div class="content">
        <div class="profile-head"><div class="profile-mascot">${U.mascot('happy')}</div><div><strong>Apprenti détective</strong><small>${st.points} points</small></div></div>
        <div class="stats">
          <div class="stat"><b>${stars}</b><small>étoiles</small></div>
          <div class="stat"><b>${done}/${D.levels.length}</b><small>niveaux</small></div>
          <div class="stat"><b>${S.streak()}</b><small>jours d'affilée</small></div>
        </div>
        <div class="card plus"><h3>Anachro+ <span class="soon">Bientôt</span></h3>
          <p>Tous les niveaux, sans pub, indices illimités : 4,99 € / mois. Non actif dans ce prototype, aucun paiement n'est proposé.</p></div>
        <button class="btn btn-ghost danger" data-act="reset">Effacer ma progression</button>
      </div>`;
  }

  /* ---------- partie ---------- */

  const G = { level: null, ctx: 'era', beat: null, state: 'idle', left: 0, last: 0, lives: 0, hints: 0, hintsUsed: 0, shown: -1, raf: 0, focus: { x: 0.5, y: 0.5 } };
  const Z = { s: 1, tx: 0, ty: 0, MAX: 2.3 };
  let drag = null;

  function applyZoom(animate) {
    inner.style.transition = animate ? 'transform .28s ease' : 'none';
    inner.style.transform = `translate(${Z.tx}px, ${Z.ty}px) scale(${Z.s})`;
  }
  function clampPan() {
    Z.tx = Math.min(0, Math.max(scene.clientWidth * (1 - Z.s), Z.tx));
    Z.ty = Math.min(0, Math.max(scene.clientHeight * (1 - Z.s), Z.ty));
  }
  function resetZoom(animate) {
    Z.s = 1; Z.tx = 0; Z.ty = 0; applyZoom(animate);
    const b = $('#zoomBtn'); if (b) b.classList.remove('on');
  }
  function toggleZoom() {
    if (G.state !== 'playing') return;
    if (Z.s > 1) { resetZoom(true); return; }
    const w = scene.clientWidth, h = scene.clientHeight;
    Z.s = Z.MAX;
    Z.tx = w / 2 - G.focus.x * w * Z.s;
    Z.ty = h / 2 - G.focus.y * h * Z.s;
    clampPan(); applyZoom(true);
    $('#zoomBtn').classList.add('on');
  }

  function buildHud() {
    hudTop.innerHTML = `
      <button class="hud-btn" data-act="pause" aria-label="Pause">${U.icon('pause', 22)}</button>
      <div class="pill timer" id="timer">${U.icon('clock', 20)}<span id="timerText">0:30</span></div>
      <div class="hearts" id="hearts" aria-live="polite"></div>
      <div class="pill level" id="levelPill"></div>`;
    hudBottom.innerHTML = `
      <button class="btn-hint" id="hintBtn" data-act="hint">${U.icon('bulb', 22)}<span>Indice</span><b id="hintCount">3</b></button>
      <button class="btn-zoom" id="zoomBtn" data-act="zoom">${U.icon('search', 22)}<span>Zoom</span></button>`;
    corner.innerHTML = U.mascot('search');
  }

  function updateHud() {
    $('#hearts').innerHTML = Array.from({ length: D.LIVES }, (_, i) => `<span class="heart ${i < G.lives ? '' : 'lost'}">${U.icon('heart', 26)}</span>`).join('');
    $('#hearts').setAttribute('aria-label', `${G.lives} vie${G.lives > 1 ? 's' : ''}`);
    $('#hintCount').textContent = G.hints;
    $('#hintBtn').disabled = G.hints === 0 || G.state !== 'playing';
    $('#levelPill').textContent = `Niveau ${levelNumber(G.level)}`;
  }

  function updateTimer() {
    const t = Math.max(0, Math.ceil(G.left / 1000));
    if (t === G.shown) return;
    G.shown = t;
    $('#timerText').textContent = clock(G.left);
    $('#timer').classList.toggle('low', t <= 10);
  }

  function startLevel(id, opts = {}) {
    const level = D.byId[id];
    if (!level) return;
    cancelAnimationFrame(G.raf);
    Object.assign(G, { level, ctx: opts.ctx || 'era', beat: opts.beat || null, state: 'ready', left: D.TIME_LIMIT * 1000, lives: D.LIVES, hints: D.HINTS, hintsUsed: 0, shown: -1, focus: { x: 0.5, y: 0.5 }, result: null });
    inner.innerHTML = `${D.artHTML(level)}<div class="fx" id="fx"></div>`;
    stage.style.transform = '';
    $$('.confetti', screens.game).forEach(n => n.remove());
    resetZoom(false);
    buildHud(); updateHud(); updateTimer();
    const era = eraOf(level);
    const challenge = G.beat ? `<p class="challenge-line">Défi d'un ami : trouve l'intrus en moins de ${G.beat} s !</p>` : '';
    overlay.innerHTML = `<div class="scrim"><div class="modal">
      <p class="eyebrow">Niveau ${levelNumber(level)} · ${era.name}</p>
      <h2>${level.title}</h2>
      <p>Un seul objet n'a rien à faire ici. Tu as <b>${D.TIME_LIMIT} secondes</b> et <b>${D.LIVES} vies</b>.</p>
      ${challenge}
      <button class="btn btn-primary" data-act="go">C'est parti !</button>
      <button class="btn btn-link" data-act="quit">Retour</button></div></div>`;
    overlay.hidden = false;
    preloadNext(level);
    show('game');
  }

  function begin() {
    if (G.state !== 'ready') return;
    G.state = 'loading';
    // avec de vraies images, on n'ouvre la scène (et le chrono) qu'une fois l'image affichable
    const img = $('img', inner);
    const loaded = img && !img.complete ? new Promise(res => { img.onload = img.onerror = res; }) : Promise.resolve();
    loaded.then(() => {
      if (G.state !== 'loading') return;
      overlay.hidden = true; overlay.innerHTML = '';
      G.state = 'playing'; G.last = performance.now();
      updateHud();
      G.raf = requestAnimationFrame(tick);
    });
  }

  function preloadNext(level) {
    const n = D.levels[D.levels.indexOf(level) + 1];
    if (n && n.image) new Image().src = n.image;
  }

  function tick(now) {
    if (G.state !== 'playing') return;
    G.left -= Math.min(now - G.last, 250);
    G.last = now;
    updateTimer();
    if (G.left <= 0) { G.left = 0; updateTimer(); lose('time'); return; }
    G.raf = requestAnimationFrame(tick);
  }

  function pause() {
    if (G.state !== 'playing') return;
    G.state = 'paused'; cancelAnimationFrame(G.raf);
    overlay.innerHTML = `<div class="scrim"><div class="modal"><h2>Pause</h2>
      <button class="btn btn-primary" data-act="resume">Reprendre</button>
      <button class="btn btn-ghost" data-act="retry">Recommencer</button>
      <button class="btn btn-link" data-act="quit">Quitter</button></div></div>`;
    overlay.hidden = false;
  }
  function resume() {
    if (G.state !== 'paused') return;
    overlay.hidden = true; overlay.innerHTML = '';
    G.state = 'playing'; G.last = performance.now();
    G.raf = requestAnimationFrame(tick);
  }

  function fxAdd(html) {
    const t = document.createElement('div');
    t.innerHTML = html.trim();
    const el = t.firstChild;
    $('#fx').appendChild(el);
    return el;
  }

  function useHint() {
    if (G.state !== 'playing' || G.hints <= 0) return;
    G.hints--; G.hintsUsed++;
    const t = G.level.target;
    const a = (levelNumber(G.level) * 2.4 + G.hintsUsed * 1.9);
    const rr = Math.max(t.r * 3.4, 150);
    const cx = Math.min(W - rr * 0.6, Math.max(rr * 0.6, t.x + Math.cos(a) * rr * 0.4));
    const cy = Math.min(H - rr * 0.6, Math.max(rr * 0.6, t.y + Math.sin(a) * rr * 0.4));
    const el = fxAdd(`<div class="ring hint" style="left:${pct(cx, W)};top:${pct(cy, H)};width:${pct(rr * 2, W)}"></div>`);
    setTimeout(() => el.remove(), 3600);
    updateHud();
  }

  function handleTap(clientX, clientY) {
    if (G.state !== 'playing') return;
    const r = inner.getBoundingClientRect();
    const nx = (clientX - r.left) / r.width, ny = (clientY - r.top) / r.height;
    if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;
    G.focus = { x: nx, y: ny };
    const vx = nx * W, vy = ny * H;
    const slop = 16 * (W / r.width); // tolérance de doigt, constante à l'écran
    if (D.zones(G.level).some(t => Math.hypot(vx - t.x, vy - t.y) <= t.r + slop)) win();
    else miss(nx, ny);
  }

  function miss(nx, ny) {
    G.lives--;
    const el = fxAdd(`<div class="miss" style="left:${pct(nx, 1)};top:${pct(ny, 1)}"><svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M5 5l14 14M19 5L5 19" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M5 5l14 14M19 5L5 19" stroke="#e5384b" stroke-width="3.6" stroke-linecap="round"/></svg></div>`);
    setTimeout(() => el.remove(), 700);
    scene.classList.remove('shake'); void scene.offsetWidth; scene.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate(40);
    updateHud();
    if (G.lives <= 0) lose('lives');
  }

  function reveal() {
    const t = G.level.target;
    resetZoom(false);
    const ring = D.zones(G.level).map(z => fxAdd(`<div class="ring found" style="left:${pct(z.x, W)};top:${pct(z.y, H)};width:${pct(Math.max(z.r * 2.6, 110), W)}"></div>`))[0];
    const below = t.y < 420;
    const tip = fxAdd(`<div class="callout ${below ? 'below' : ''}" style="left:50%;top:${pct(t.y + (below ? t.r * 1.9 : -t.r * 1.9), H)}">${G.level.fact}</div>`);
    // garde l'infobulle dans l'écran, la flèche continue de pointer l'intrus
    const sw = $('#fx').offsetWidth, cw = tip.offsetWidth, tx = (t.x / W) * sw;
    const cx = Math.min(sw - cw / 2 - 8, Math.max(cw / 2 + 8, tx));
    tip.style.left = `${(cx / sw) * 100}%`;
    tip.style.setProperty('--arrow', `${Math.min(cw / 2 - 20, Math.max(-(cw / 2 - 20), tx - cx))}px`);
    return ring;
  }

  /* Décale la scène vers le haut si l'intrus se retrouve sous la fiche de résultat. */
  function clearOfSheet() {
    const sheet = $('.sheet', overlay);
    if (!sheet) return;
    const sr = scene.getBoundingClientRect(), t = G.level.target;
    const y = sr.top + (t.y / H) * sr.height;
    const need = y + 80 - sheet.getBoundingClientRect().top;
    if (need > 0) stage.style.transform = `translateY(${-Math.min(need, sr.top + sr.height * 0.35)}px)`;
  }

  function scoreFor(left, lives, hintsUsed) {
    const secs = left / 1000;
    const points = Math.max(50, 100 + Math.round(secs * 5) + lives * 10 - hintsUsed * 25);
    const stars = secs >= 15 && hintsUsed === 0 ? 3 : secs >= 8 ? 2 : 1;
    return { points, stars };
  }

  function win() {
    G.state = 'won'; cancelAnimationFrame(G.raf);
    const elapsed = D.TIME_LIMIT * 1000 - G.left;
    const { points, stars } = scoreFor(G.left, G.lives, G.hintsUsed);
    const { record } = S.record(G.level.id, { stars, points, elapsed });
    if (G.ctx === 'daily') S.completeDaily();
    reveal(); updateHud();
    let chal = '';
    if (G.beat) chal = elapsed / 1000 <= G.beat ? '<p class="record">Défi relevé !</p>' : `<p class="challenge-line">Il fallait faire moins de ${G.beat} s.</p>`;
    const next = nextLevel(G.level);
    overlay.innerHTML = `<div class="sheet win">
      <div class="sheet-row"><div class="sheet-mascot">${U.mascot('happy')}</div>
        <div class="sheet-main"><h2 class="sheet-title">TROUVÉ !</h2>${U.stars(stars, 3, 34)}
          <p class="pts">+${points} pts</p><p class="time">${U.icon('clock', 16)} ${clock(elapsed, true)}</p>${record ? '<p class="record">Nouveau record !</p>' : ''}${chal}</div></div>
      <button class="btn btn-primary" data-act="next">${next ? 'Niveau suivant' : 'Retour à l\'accueil'} ${U.icon('next', 20)}</button>
      <div class="btn-row"><button class="btn btn-ghost" data-act="share">${U.icon('share', 18)} Défier un ami</button><button class="btn btn-ghost" data-act="retry">${U.icon('retry', 18)} Rejouer</button></div></div>`;
    overlay.hidden = false;
    G.result = { elapsed };
    confetti();
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    requestAnimationFrame(clearOfSheet);
  }

  function lose(reason) {
    G.state = 'lost'; cancelAnimationFrame(G.raf);
    reveal(); updateHud();
    overlay.innerHTML = `<div class="sheet lose">
      <div class="sheet-row"><div class="sheet-mascot">${U.mascot('search')}</div>
        <div class="sheet-main"><h2 class="sheet-title">${reason === 'time' ? 'Temps écoulé !' : 'Plus de vies !'}</h2>
          <p class="lead">L'intrus était : <b>${G.level.object}</b>.</p></div></div>
      <button class="btn btn-primary" data-act="retry">${U.icon('retry', 20)} Réessayer</button>
      <button class="btn btn-link" data-act="quit">Retour</button></div>`;
    overlay.hidden = false;
    requestAnimationFrame(clearOfSheet);
  }

  const nextLevel = l => D.levels[D.levels.indexOf(l) + 1] || null;

  function confetti() {
    const box = document.createElement('div');
    box.className = 'confetti';
    const cols = ['#ffc93c', '#e5384b', '#2f5da8', '#2fb36b', '#ff8ac8'];
    box.innerHTML = Array.from({ length: 46 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${cols[i % 5]};animation-delay:${Math.random() * 0.4}s;animation-duration:${1.7 + Math.random() * 1.5}s;--r:${Math.round(Math.random() * 720 - 360)}deg"></i>`).join('');
    screens.game.appendChild(box);
    setTimeout(() => box.remove(), 3800);
  }

  function leaveGame() {
    cancelAnimationFrame(G.raf); G.state = 'idle';
    overlay.hidden = true; overlay.innerHTML = '';
    clearHash();
    if (G.ctx === 'era') { eraView = G.level.era; go('era'); } else go('home');
  }

  function clearHash() {
    try { if (location.hash) history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
  }

  async function share(level, elapsed) {
    const url = `${location.origin === 'null' ? '' : location.origin}${location.pathname}#niveau=${level.id}${elapsed ? `&t=${Math.max(1, Math.floor(elapsed / 1000))}` : ''}`;
    const text = elapsed
      ? `J'ai trouvé l'intrus en ${clock(elapsed, true)} sur Anachro. Tu fais mieux ?`
      : `Trouve l'intrus dans ce niveau d'Anachro. Tu fais mieux que moi ?`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Anachro', text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(`${text} ${url}`); toast('Lien du défi copié !'); }
    catch (e) { toast(url); }
  }

  /* ---------- événements ---------- */

  scene.addEventListener('pointerdown', e => {
    if (G.state !== 'playing') return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, tx: Z.tx, ty: Z.ty, moved: false };
    try { scene.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  scene.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 8) drag.moved = true;
    if (drag.moved && Z.s > 1) { Z.tx = drag.tx + dx; Z.ty = drag.ty + dy; clampPan(); applyZoom(false); }
  });
  scene.addEventListener('pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const wasTap = !drag.moved;
    drag = null;
    if (wasTap) handleTap(e.clientX, e.clientY);
  });
  scene.addEventListener('pointercancel', () => { drag = null; });
  scene.addEventListener('contextmenu', e => e.preventDefault());

  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act],[data-era],[data-level],[data-daily],[data-tab]');
    if (!el) return;
    const d = el.dataset;
    if (d.tab) { go(d.tab); return; }
    if (d.era) { eraView = d.era; go('era'); return; }
    if (d.daily) { startLevel(d.daily, { ctx: 'daily' }); return; }
    if (d.level) { startLevel(d.level, { ctx: 'era' }); return; }
    switch (d.act) {
      case 'home': go('home'); break;
      case 'go': begin(); break;
      case 'pause': pause(); break;
      case 'resume': resume(); break;
      case 'hint': useHint(); break;
      case 'zoom': toggleZoom(); break;
      case 'retry': startLevel(G.level.id, { ctx: G.ctx, beat: G.beat }); break;
      case 'quit': leaveGame(); break;
      case 'next': {
        const n = nextLevel(G.level);
        if (n && unlocked(n)) startLevel(n.id, { ctx: 'era' }); else { clearHash(); go('home'); }
        break;
      }
      case 'share': share(G.level, G.result && G.result.elapsed); break;
      case 'challenge': {
        const l = D.levels[S.dailyIndex(D.levels.length)];
        const best = progress(l.id).best;
        share(l, best); break;
      }
      case 'reset':
        // confirmation dans la page (confirm() est bloqué dans certains contextes d'affichage)
        if (!el.classList.contains('armed')) {
          el.classList.add('armed');
          el.textContent = 'Toucher encore pour tout effacer';
          setTimeout(() => { if (el.isConnected) { el.classList.remove('armed'); el.textContent = 'Effacer ma progression'; } }, 4000);
        } else { S.reset(); go('profile'); toast('Progression effacée'); }
        break;
    }
  });

  /* ---------- démarrage ---------- */

  function fromHash() {
    const m = new URLSearchParams(location.hash.slice(1));
    const id = m.get('niveau');
    if (id && D.byId[id]) { startLevel(id, { ctx: 'challenge', beat: Number(m.get('t')) || null }); return true; }
    return false;
  }

  window.addEventListener('hashchange', fromHash);
  renderHome();
  if (!fromHash()) show('home');
})(window.Anachro = window.Anachro || {});
