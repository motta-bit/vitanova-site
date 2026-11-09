(function () {
  "use strict";
  var html = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = function (t) { return window.vnT ? window.vnT(t) : t; };

  /* ================= WhatsApp: todos los botones abren el mismo número ================= */
  var WA = window.VN_WHATSAPP || "573009802268";
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(a.getAttribute('data-wa'));
    a.target = '_blank'; a.rel = 'noopener';
  });
  // Cuando exista el link de pago de Wompi, el botón de donar va directo a la pasarela.
  var donate = document.getElementById('donateBtn');
  if (donate && window.VN_PAY && window.VN_PAY.wompiLink) { donate.href = window.VN_PAY.wompiLink; donate.target = '_blank'; donate.rel = 'noopener'; }

  /* ================= INTRO: video de presentación → apertura ================= */
  var intro = document.getElementById('intro');
  var opened = !intro || html.classList.contains('no-intro');
  var onScroll = function () {};
  if (intro && opened) { intro.parentNode.removeChild(intro); intro = null; }
  if (intro) {
    var iv = document.getElementById('introVideo');
    var startBox = document.getElementById('introStart');
    var progress = document.getElementById('introProgress');
    var timeEl = document.getElementById('introTime');
    var soundBtn = document.getElementById('introSound');
    try { sessionStorage.setItem('vn_intro', '1'); } catch (e) {}

    var finishOpen = function () {
      html.classList.remove('intro-on', 'opening');
      html.classList.add('page-open');
      try { iv.pause(); iv.removeAttribute('src'); iv.load(); } catch (e) {}
      if (intro.parentNode) intro.parentNode.removeChild(intro);
      var cover = document.getElementById('portada');
      if (cover) { cover.setAttribute('tabindex', '-1'); try { cover.focus({ preventScroll: true }); } catch (e) {} }
      onScroll();
    };
    var openPage = function () {
      if (opened) return;
      opened = true;
      html.classList.remove('intro-on');
      html.classList.add('page-open');
      if (reduceMotion) { finishOpen(); return; }
      html.classList.add('opening');
      intro.style.pointerEvents = 'none';
      var maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 60;
      var t0 = performance.now(), dur = 1300;
      var step = function (now) {
        var p = Math.min(1, (now - t0) / dur);
        var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        intro.style.setProperty('--r', (e * maxR) + 'px');
        if (p < 1) { requestAnimationFrame(step); } else { finishOpen(); }
      };
      requestAnimationFrame(step);
    };

    var showStart = function () { if (!opened) startBox.hidden = false; };
    var play = function () {
      var p = iv.play();
      if (p && p.then) p.then(function () { startBox.hidden = true; }).catch(showStart);
    };
    var fmt = function (s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };
    var tick = function () {
      if (opened) return;
      if (iv.duration) {
        progress.style.width = (iv.currentTime / iv.duration * 100) + '%';
        timeEl.textContent = fmt(iv.duration - iv.currentTime);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    var setSound = function (on) {
      iv.muted = !on;
      soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      soundBtn.textContent = T(on ? 'Silenciar' : 'Activar sonido');
    };

    iv.addEventListener('playing', function () { startBox.hidden = true; });
    iv.addEventListener('ended', function () { setTimeout(openPage, 300); });
    iv.addEventListener('error', showStart);
    soundBtn.addEventListener('click', function () { setSound(iv.muted); if (iv.paused) play(); });
    document.getElementById('introSkip').addEventListener('click', openPage);
    document.getElementById('introEnter').addEventListener('click', openPage);
    document.getElementById('introPlay').addEventListener('click', function () { startBox.hidden = true; try { iv.currentTime = 0; } catch (e) {} setSound(true); play(); });
    document.addEventListener('keydown', function (e) { if (!opened && e.key === 'Escape') openPage(); });

    if (reduceMotion) { showStart(); }
    else {
      play();
      setTimeout(function () { if (!opened && iv.currentTime < 0.1) showStart(); }, 3500);
    }
    try { document.getElementById('introSkip').focus({ preventScroll: true }); } catch (e) {}
  }
  window.__vnIntroReady = true;

  /* ================= video de la sección de presentación ================= */
  var film = document.getElementById('filmVideo');
  if (film) {
    // En teléfono vertical se usa el corte vertical del mismo video.
    var vertical = window.matchMedia('(orientation: portrait) and (max-width: 760px)').matches;
    film.src = vertical ? 'assets/video/apertura_vertical.mp4' : 'assets/video/apertura_horizontal.mp4';
    film.poster = vertical ? 'assets/img/apertura-poster-v.jpg' : 'assets/img/apertura-poster-h.jpg';
    if (vertical) film.parentNode.classList.add('vertical');
  }

  /* ================= tema y contraste ================= */
  var ICONS = {
    system: '<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path>',
    light: '<circle cx="12" cy="12" r="4.5"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>',
    dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>'
  };
  function getStored(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function setStored(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var themeBtns = document.querySelectorAll('[data-theme-toggle]');
  var theme = getStored('vn-theme') || 'system';
  function applyTheme() {
    if (theme === 'system') html.removeAttribute('data-theme'); else html.setAttribute('data-theme', theme);
    themeBtns.forEach(function (b) {
      b.querySelector('.theme-icon').innerHTML = ICONS[theme];
      b.setAttribute('aria-label', T('Tema') + ': ' + T(theme === 'system' ? 'del sistema' : theme === 'light' ? 'claro' : 'oscuro'));
    });
  }
  applyTheme();
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
      setStored('vn-theme', theme); applyTheme();
    });
  });
  var contrastBtns = document.querySelectorAll('[data-contrast-toggle]');
  var contrastOn = getStored('vn-contrast') === '1';
  function applyContrast() {
    if (contrastOn) html.setAttribute('data-contrast', 'high'); else html.removeAttribute('data-contrast');
    contrastBtns.forEach(function (b) { b.setAttribute('aria-pressed', contrastOn ? 'true' : 'false'); });
  }
  applyContrast();
  contrastBtns.forEach(function (b) {
    b.addEventListener('click', function () { contrastOn = !contrastOn; setStored('vn-contrast', contrastOn ? '1' : '0'); applyContrast(); });
  });
  window.vnRefreshUI = applyTheme;

  /* ================= mapa: territorios, rutas y panel ================= */
  (function () {
    var stage = document.getElementById('vnMapStage');
    var DATA = window.VN_TERRITORIOS || [];
    var MOD = window.VN_MODULOS || {};
    if (!stage || !DATA.length) return;
    var svg = stage.querySelector('svg');
    var routes = document.getElementById('vnRoutes');
    var list = document.getElementById('vnMapList');
    var panel = document.getElementById('vn-map-panel');
    var titleEl = document.getElementById('vn-map-panel-title');
    var subEl = document.getElementById('vn-map-panel-sub');
    var badgeEl = document.getElementById('vn-map-panel-badge');
    var textEl = document.getElementById('vn-map-panel-text');
    var tagsEl = document.getElementById('vn-map-panel-tags');
    var ESTADO = { sede: 'Sede', activo: 'Núcleo activo', creacion: 'Núcleo en creación', ruta: 'Ruta activa' };
    // Misma proyección que el contorno del mapa del dossier (480 × 640).
    var px = function (c) { return [183.8 + 35.42 * (c[0] + 74.536), 304 - 35.5 * (c[1] - 4.55)]; };
    var NS = 'http://www.w3.org/2000/svg';
    var sede = DATA.filter(function (t) { return t.estado === 'sede'; })[0];
    var home = sede ? px(sede.coords) : [147, 244];
    var markers = {}, chips = {}, rutas = {}, shapes = {};
    var selected = null;

    DATA.forEach(function (t, i) {
      var p = px(t.coords);
      var shape = svg.querySelector('.vn-dpto[data-dpto="' + t.dpto + '"]');
      if (shape) {
        shape.classList.add('on');
        shape.setAttribute('data-estado', t.estado);
        shape.style.setProperty('--i', i);
        shape.addEventListener('click', function () { select(t.dpto, true); });
        shapes[t.dpto] = shape;
      }
      if (t.estado !== 'sede') {
        var path = document.createElementNS(NS, 'path');
        var mx = (home[0] + p[0]) / 2, my = (home[1] + p[1]) / 2;
        var dx = p[0] - home[0], dy = p[1] - home[1];
        // curva hacia afuera, proporcional a la distancia
        path.setAttribute('d', 'M' + home[0].toFixed(1) + ',' + home[1].toFixed(1) + ' Q' + (mx - dy * 0.18).toFixed(1) + ',' + (my + dx * 0.18).toFixed(1) + ' ' + p[0].toFixed(1) + ',' + p[1].toFixed(1));
        path.style.setProperty('--i', i);
        routes.appendChild(path);
        rutas[t.dpto] = path;
      }
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'vn-map-marker vn-map-marker--' + t.estado + (p[0] > 330 ? ' label-left' : '');
      b.style.left = (p[0] / 480 * 100).toFixed(2) + '%';
      b.style.top = (p[1] / 640 * 100).toFixed(2) + '%';
      b.style.setProperty('--i', i);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('data-label', t.nombre);
      b.setAttribute('aria-label', t.nombre + ' — ' + t.lugar);
      b.innerHTML = '<span class="vn-map-marker-dot"></span><span class="vn-map-marker-label"></span>';
      b.lastChild.textContent = t.nombre;
      b.addEventListener('click', function () { select(t.dpto, true); });
      stage.appendChild(b);
      markers[t.dpto] = b;

      var li = document.createElement('li');
      var c = document.createElement('button');
      c.type = 'button';
      c.setAttribute('data-estado', t.estado);
      c.setAttribute('aria-pressed', 'false');
      c.innerHTML = '<i aria-hidden="true"></i><span></span>';
      c.lastChild.textContent = t.nombre;
      c.addEventListener('click', function () { select(t.dpto, true); });
      li.appendChild(c);
      list.appendChild(li);
      chips[t.dpto] = c;
    });

    function render() {
      var t = DATA.filter(function (x) { return x.dpto === selected; })[0];
      Object.keys(markers).forEach(function (k) {
        var on = k === selected;
        markers[k].classList.toggle('is-selected', on);
        markers[k].setAttribute('aria-pressed', on ? 'true' : 'false');
        chips[k].setAttribute('aria-pressed', on ? 'true' : 'false');
        if (shapes[k]) shapes[k].classList.toggle('is-selected', on);
        if (rutas[k]) rutas[k].classList.toggle('is-on', on);
      });
      if (!t) return;
      titleEl.textContent = T(t.nombre);
      subEl.textContent = T(t.lugar);
      badgeEl.textContent = T(ESTADO[t.estado]);
      badgeEl.setAttribute('data-status', t.estado === 'activo' ? 'activo' : t.estado);
      textEl.textContent = T(t.texto);
      tagsEl.innerHTML = '';
      t.modulos.forEach(function (m) {
        var li = document.createElement('li');
        li.textContent = T(MOD[m] || m);
        tagsEl.appendChild(li);
      });
    }
    function select(id, user) {
      selected = id;
      render();
      if (user && !reduceMotion) {
        panel.classList.remove('flash'); void panel.offsetWidth; panel.classList.add('flash');
        // reinicia el rebote del punto aunque se toque el mismo dos veces
        var dot = markers[id] && markers[id].firstChild;
        if (dot) { dot.style.animation = 'none'; void dot.offsetWidth; dot.style.animation = ''; }
      }
    }
    window.vnMapRender = render;
    select(sede ? sede.dpto : DATA[0].dpto, false);
  })();

  /* ================= aliados ================= */
  var wall = document.getElementById('allyWall');
  if (wall && window.VN_ALIADOS) {
    window.VN_ALIADOS.forEach(function (a, i) {
      var card = document.createElement('div');
      card.className = 'ally-card reveal' + (i % 3 ? ' d' + (i % 3) : '');
      var logo = document.createElement('div');
      logo.className = 'ally-logo';
      if (a.logo) {
        var img = document.createElement('img');
        img.src = a.logo; img.alt = a.nombre; img.loading = 'lazy';
        logo.appendChild(img);
      } else {
        var mono = document.createElement('span');
        mono.className = 'ally-mono'; mono.textContent = a.nombre;
        logo.appendChild(mono);
      }
      var body = document.createElement('div');
      body.innerHTML = '<span class="tag"></span><h3></h3><p></p>';
      body.children[0].textContent = a.tipo;
      body.children[1].textContent = a.nombre;
      body.children[2].textContent = a.detalle;
      card.appendChild(logo); card.appendChild(body);
      wall.appendChild(card);
    });
  }

  /* ================= redes ================= */
  var SOCIAL_ICON = {
    instagram: '<path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4.3 2.3 2.3 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.6 2.2 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.2 5.6-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.6-2.2-5.6-5.8-5.8C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C3.9 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1z"/>',
    facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>',
    youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3-5.8 3z"/>',
    tiktok: '<path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.3 7.3 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z"/>',
    linkedin: '<path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zM7.1 20.5H3.6V9h3.5v11.5z"/>'
  };
  var SOCIAL_NAME = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn' };
  var socials = document.getElementById('socials');
  if (socials && window.VN_SOCIAL) {
    Object.keys(SOCIAL_NAME).forEach(function (k) {
      var url = window.VN_SOCIAL[k];
      if (!url) return;
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + SOCIAL_ICON[k] + '</svg><span></span>';
      a.lastChild.textContent = SOCIAL_NAME[k];
      socials.appendChild(a);
    });
  }

  /* ================= titulares palabra a palabra (conserva <em>) ================= */
  function splitWords(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
      if (ch.nodeType === 3) {
        var frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span');
          s.className = 'w';
          s.style.setProperty('--d', (counter.i++ * 55) + 'ms');
          s.textContent = part;
          frag.appendChild(s);
        });
        node.replaceChild(frag, ch);
      } else if (ch.nodeType === 1) { splitWords(ch, counter); }
    });
  }
  document.querySelectorAll('.word-reveal').forEach(function (el) { splitWords(el, { i: 0 }); });

  /* ================= contadores ================= */
  function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  var counters = Array.prototype.slice.call(document.querySelectorAll('.count'));
  function runCount(el) {
    var to = parseInt(el.getAttribute('data-to'), 10) || 0;
    if (reduceMotion) { el.textContent = fmtNum(to); return; }
    var t0 = performance.now(), dur = 1600;
    function f(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmtNum(Math.round(to * e));
      if (p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }

  /* ================= apariciones al hacer scroll ================= */
  var revealEls = document.querySelectorAll('.reveal, .word-reveal, .scale');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    if (!reduceMotion) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
    }

    var dots = Array.prototype.slice.call(document.querySelectorAll('.step-dots i'));
    var steps = Array.prototype.slice.call(document.querySelectorAll('.scrolly .step'));
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var i = steps.indexOf(en.target);
          dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
        }
      });
    }, { threshold: 0.55 });
    steps.forEach(function (s) { sio.observe(s); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ================= barra superior, capítulo en curso, progreso, parallax ================= */
  var topbar = document.getElementById('topbar');
  var running = document.getElementById('running');
  var progressBar = document.getElementById('progressBar');
  var cover = document.getElementById('portada');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

  function updateHead() {
    var y = window.scrollY;
    var coverH = cover ? cover.offsetHeight : 400;
    topbar.classList.toggle('show', y > coverH * 0.72);
    var probe = window.innerHeight * 0.3;
    var current = chapters.length ? chapters[0].getAttribute('data-chapter') : '';
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].getBoundingClientRect().top <= probe) current = chapters[i].getAttribute('data-chapter');
    }
    if (running.textContent !== current) running.textContent = current;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? Math.min(100, Math.max(0, y / max * 100)) : 0) + '%';
  }
  function updateParallax() {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var host = el.tagName === 'IMG' ? el.parentElement : el;
      var r = host.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var f = parseFloat(el.getAttribute('data-parallax')) || 0.08;
      var shift = (r.top + r.height / 2 - vh / 2) * f * -1;
      if (el.tagName === 'IMG') {
        var lim = r.height * (host.classList.contains('opener-media') ? 0.095 : 0.075);
        shift = Math.max(-lim, Math.min(lim, shift));
      }
      el.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    });
  }
  var ticking = false;
  onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateHead(); updateParallax(); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ================= cuaderno de campo ================= */
  var essay = document.getElementById('essay');
  function essayStep(dir) {
    var fig = essay.querySelector('figure');
    var w = fig ? fig.getBoundingClientRect().width + 20 : 300;
    essay.scrollBy({ left: dir * w, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  if (essay) {
    document.getElementById('essayPrev').addEventListener('click', function () { essayStep(-1); });
    document.getElementById('essayNext').addEventListener('click', function () { essayStep(1); });
  }

  /* ================= animación del logo en la contraportada ================= */
  var logoFilm = document.getElementById('logoFilm');
  if (logoFilm) {
    var portrait = window.matchMedia('(orientation: portrait) and (max-width: 760px)').matches;
    logoFilm.poster = portrait ? 'assets/revista/logo-1x1-poster.jpg' : 'assets/revista/logo-16x9-poster.jpg';
    logoFilm.src = portrait ? 'assets/revista/logo-1x1.mp4' : 'assets/revista/logo-16x9.mp4';
    if (reduceMotion) {
      logoFilm.addEventListener('loadedmetadata', function () { try { logoFilm.currentTime = Math.max(0, logoFilm.duration - 0.3); } catch (e) {} });
    } else if ('IntersectionObserver' in window) {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { var p = logoFilm.play(); if (p && p.catch) p.catch(function () {}); }
          else { logoFilm.pause(); }
        });
      }, { threshold: 0.35 });
      fio.observe(logoFilm);
    }
  }

  /* ================= copiar correo ================= */
  var copyBtn = document.getElementById('copyEmail');
  var emailText = document.getElementById('emailText').textContent.trim();
  copyBtn.addEventListener('click', function () {
    function done(ok) { copyBtn.textContent = T(ok ? 'Copiado' : 'Copiar'); setTimeout(function () { copyBtn.textContent = T('Copiar'); }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailText).then(function () { done(true); }).catch(function () { done(false); });
    } else { done(false); }
  });
})();
