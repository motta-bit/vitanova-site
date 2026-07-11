/* ============================================================
   APP — Animaciones inmersivas, mapa interactivo, UI
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Preloader ---------- */
  const pre = $("#preloader");
  const preBar = $("#preloader .pl-bar i");
  let loaded = false;
  const gallery = $$("#gallery-grid img").slice(0, 6);
  let done = 0;
  const bump = () => { done++; if (preBar) preBar.style.width = Math.min(100, (done / (gallery.length + 1)) * 100) + "%"; };
  gallery.forEach(img => { if (img.complete) bump(); else { img.addEventListener("load", bump); img.addEventListener("error", bump); } });
  window.addEventListener("load", () => { bump(); finishPreload(); });
  setTimeout(finishPreload, 3500); // failsafe
  function finishPreload() {
    if (loaded) return;
    loaded = true;
    pre.classList.add("done");
    heroIntro();
  }

  /* ---------- Nav ---------- */
  const nav = $("nav");
  const darkSections = ["#inicio", "#manifiesto", "#programas", "#impacto"];
  function navState() {
    const y = scrollY;
    nav.classList.toggle("solid", y > 40);
    const el = document.elementFromPoint(innerWidth / 2, 40);
    nav.classList.toggle("on-dark", !!(el && el.closest(darkSections.join(","))));
  }
  addEventListener("scroll", navState, { passive: true });
  navState();
  $(".nav-toggle").addEventListener("click", () => nav.classList.toggle("open"));
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- Scroll progress ---------- */
  const prog = $("#scroll-progress");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  }, { passive: true });

  /* ---------- Split words util ---------- */
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="word"><i>${w}</i></span>`).join(" ");
    return $$(".word>i", el);
  }

  /* ---------- Hero intro ---------- */
  function heroIntro() {
    if (reduced) return;
    const h1 = $("#inicio h1");
    const inner = splitWords(h1);
    h1.classList.add("wr");
    gsap.timeline()
      .to(inner, { y: 0, duration: 1.05, stagger: 0.045, ease: "power4.out" }, 0.15)
      .from(".hero-badge", { y: 18, autoAlpha: 0, duration: .7, ease: "power3.out" }, 0.1)
      .from(".hero-tagline", { y: 24, autoAlpha: 0, duration: .8, ease: "power3.out" }, 0.7)
      .from("#inicio .btn-group", { y: 24, autoAlpha: 0, duration: .8, ease: "power3.out" }, 0.9)
      .from(".hero-visual", { scale: .88, autoAlpha: 0, duration: 1.2, ease: "power3.out" }, 0.45)
      .from(".hero-stat", { y: 26, autoAlpha: 0, stagger: .15, duration: .7, ease: "back.out(1.6)" }, 1.1)
      .from(".hero-scroll", { autoAlpha: 0, duration: .8 }, 1.4);
  }

  if (!reduced) {
    /* Hero parallax blobs + exit */
    gsap.to(".hb-1", { yPercent: 26, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.to(".hb-2", { yPercent: -20, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.to(".hero-inner", { yPercent: -12, autoAlpha: .25, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom 30%", scrub: true } });

    /* Manifiesto scrub highlight */
    const man = $(".manifiesto-text");
    if (man) {
      const words = $$(".mw", man);
      gsap.to(words, {
        onUpdate: function () { /* class-driven below */ },
        scrollTrigger: {
          trigger: "#manifiesto", start: "top 70%", end: "bottom 60%", scrub: true,
          onUpdate: self => {
            const n = Math.floor(self.progress * words.length);
            words.forEach((w, i) => w.classList.toggle("lit", i <= n));
          }
        }
      });
    }

    /* Generic reveals */
    $$(".fade-up").forEach(el => {
      gsap.to(el, {
        y: 0, autoAlpha: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
        delay: parseFloat(el.dataset.delay || 0)
      });
    });
    $$(".reveal-img").forEach(el => {
      gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.25, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 82%" } });
    });

    /* Section headings word reveal */
    $$("h2[data-wr]").forEach(h => {
      const inner = splitWords(h);
      h.classList.add("wr");
      gsap.to(inner, { y: 0, duration: .9, stagger: .04, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 85%" } });
    });

    /* Counters */
    $$("[data-count]").forEach(el => {
      const end = parseFloat(el.dataset.count);
      const suf = el.dataset.suffix || "";
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 2, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
        onUpdate: () => { el.textContent = Math.round(obj.v) + suf; }
      });
    });

    /* Programas: pinned horizontal scroll */
    const track = $(".prog-track");
    if (track && innerWidth > 860) {
      const getScroll = () => track.scrollWidth - innerWidth;
      gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: "#programas", start: "top top",
          end: () => "+=" + getScroll(),
          pin: true, scrub: 1, invalidateOnRefresh: true
        }
      });
      $$(".prog-card").forEach(c => {
        gsap.from(c, { y: 60, autoAlpha: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: "#programas", start: "top 70%" } });
      });
    }

    /* Mapa: entrada de regiones y ciudades */
    gsap.from(".region", { autoAlpha: 0, scale: .92, transformOrigin: "50% 50%", stagger: .12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#mapa", start: "top 70%" } });
    gsap.from(".city-dot", { autoAlpha: 0, scale: 0, transformOrigin: "center", stagger: .06, duration: .55, ease: "back.out(2.2)", scrollTrigger: { trigger: "#mapa", start: "top 55%" } });

    /* Marquee aliados */
    const mq = $(".marquee");
    if (mq) {
      mq.innerHTML += mq.innerHTML;
      gsap.to(mq, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
    }
  } else {
    $$(".fade-up").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    $$("[data-count]").forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
  }

  /* ============================================================
     MAPA INTERACTIVO
     ============================================================ */
  const AREAS = window.VN_AREAS, REGIONS = window.VN_REGIONS, PROJECTS = window.VN_PROJECTS;
  const panel = $("#map-panel-body");
  let activeArea = "all", activeRegion = null;

  // filtros
  const filtersWrap = $(".map-filters");
  const mkFilter = (key, label, color) => {
    const b = document.createElement("button");
    b.className = "map-filter" + (key === "all" ? " active" : "");
    b.dataset.area = key;
    b.innerHTML = (color ? `<span class="dot" style="background:${color}"></span>` : "") + label;
    b.addEventListener("click", () => {
      activeArea = key;
      $$(".map-filter").forEach(f => {
        const on = f.dataset.area === key;
        f.classList.toggle("active", on);
        f.style.background = on && f.dataset.color ? f.dataset.color : "";
      });
      b.style.background = key !== "all" ? color : "";
      applyMapFilter();
    });
    if (color) b.dataset.color = color;
    filtersWrap.appendChild(b);
  };
  mkFilter("all", "Todas las áreas");
  Object.entries(AREAS).forEach(([k, a]) => mkFilter(k, a.label, a.color));

  function applyMapFilter() {
    $$(".city-dot").forEach(d => {
      const p = PROJECTS[+d.dataset.idx];
      const match = activeArea === "all" || p.areas.includes(activeArea);
      d.classList.toggle("dim", !match);
    });
    if (activeArea !== "all") {
      const regionsWith = new Set(PROJECTS.filter(p => p.areas.includes(activeArea)).map(p => p.region));
      $$(".region").forEach(r => r.classList.toggle("dim", !regionsWith.has(r.dataset.region)));
    } else {
      $$(".region").forEach(r => r.classList.remove("dim"));
    }
  }

  function renderRegion(key) {
    const r = REGIONS[key];
    const cities = PROJECTS.filter(p => p.region === key);
    panel.innerHTML = `
      <span class="mp-region">${r.name}</span>
      <h3>${r.name.replace("Región ", "")}</h3>
      <div class="mp-stats">
        <div class="mp-stat"><b>${r.municipios}</b><span>municipios Fase 1</span></div>
        <div class="mp-stat"><b>${r.nucleos}</b><span>núcleos proyectados</span></div>
        <div class="mp-stat"><b>${cities.length}</b><span>ciudades ancla</span></div>
      </div>
      <p>${r.desc}</p>
      <div class="map-cities">${cities.map(c => `<button class="map-city-chip" data-city="${c.city}">${c.city}</button>`).join("")}</div>`;
    bindCityChips();
  }

  function renderCity(p) {
    const r = REGIONS[p.region];
    panel.innerHTML = `
      <span class="mp-region">${r.name}${p.flagship ? " · Sede principal" : ""}</span>
      <h3>${p.city}</h3>
      <p style="margin-top:.6rem">${p.desc}</p>
      <div class="mp-areas">${p.areas.map(a => `<span class="mp-area" style="background:${AREAS[a].color}">${AREAS[a].label}</span>`).join("")}</div>
      <div class="map-cities"><button class="map-city-chip" data-region-back="${p.region}">← Ver toda la ${r.name}</button></div>`;
    $("[data-region-back]", panel).addEventListener("click", e => selectRegion(e.target.dataset.regionBack));
  }

  function bindCityChips() {
    $$(".map-city-chip[data-city]", panel).forEach(ch => ch.addEventListener("click", () => {
      const p = PROJECTS.find(x => x.city === ch.dataset.city);
      if (p) renderCity(p);
    }));
  }

  function selectRegion(key) {
    activeRegion = key;
    $$(".region").forEach(r => r.classList.toggle("active", r.dataset.region === key));
    renderRegion(key);
    if (!reduced) gsap.from(panel, { autoAlpha: 0, y: 16, duration: .5, ease: "power3.out" });
  }

  $$(".region").forEach(r => r.addEventListener("click", () => selectRegion(r.dataset.region)));

  // city dots
  const dotsLayer = $("#city-dots");
  PROJECTS.forEach((p, i) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "city-dot" + (p.flagship ? " flag" : ""));
    g.dataset.idx = i;
    const color = AREAS[p.areas[0]].color;
    g.innerHTML = `
      <circle class="halo" cx="${p.x}" cy="${p.y}" r="7" stroke="${color}"/>
      <circle class="core" cx="${p.x}" cy="${p.y}" r="${p.flagship ? 7.5 : 5.5}" stroke="${color}"/>
      <text x="${p.x + 11}" y="${p.y + 4}">${p.city}</text>`;
    g.addEventListener("click", e => { e.stopPropagation(); renderCity(p); $$(".region").forEach(r => r.classList.toggle("active", r.dataset.region === p.region)); });
    dotsLayer.appendChild(g);
  });

  selectRegion("andina");

  /* ============================================================
     GALERÍA + LIGHTBOX
     ============================================================ */
  const galImgs = $$("#gallery-grid .gal-item");
  let lbIndex = 0;
  const lb = $("#lightbox"), lbImg = $(".lightbox-img");
  function openLb(i) {
    const visible = galImgs.filter(g => g.style.display !== "none");
    lbIndex = visible.indexOf(galImgs[i]);
    lb._visible = visible;
    lbImg.src = $("img", visible[lbIndex]).src;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function moveLb(d) {
    const v = lb._visible || galImgs;
    lbIndex = (lbIndex + d + v.length) % v.length;
    lbImg.src = $("img", v[lbIndex]).src;
  }
  function closeLb() { lb.classList.remove("active"); document.body.style.overflow = ""; }
  galImgs.forEach((g, i) => g.addEventListener("click", () => openLb(i)));
  $(".lb-close").addEventListener("click", closeLb);
  $(".lb-prev").addEventListener("click", () => moveLb(-1));
  $(".lb-next").addEventListener("click", () => moveLb(1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", e => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") moveLb(-1);
    if (e.key === "ArrowRight") moveLb(1);
  });
  $$(".gallery-tab").forEach(t => t.addEventListener("click", () => {
    $$(".gallery-tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const range = t.dataset.range;
    galImgs.forEach((g, i) => {
      let show = true;
      if (range !== "all") { const [a, b] = range.split("-").map(Number); show = i >= a && i <= b; }
      g.style.display = show ? "" : "none";
    });
    ScrollTrigger.refresh();
  }));

  /* ============================================================
     EVENTOS
     ============================================================ */
  const evGrid = $("#eventos-grid");
  window.VN_EVENTS.forEach(ev => {
    const d = new Date(ev.date + "T12:00:00");
    const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
    const card = document.createElement("article");
    card.className = "evento-card fade-up";
    card.innerHTML = `
      <div class="evento-date"><b>${d.getDate()}</b><span>${months[d.getMonth()]} ${d.getFullYear()}</span></div>
      <span class="ev-mode">${ev.mode}</span>
      <h3>${ev.title}</h3>
      <div class="ev-meta"><span>📍 ${ev.place}</span><span>👥 ${ev.cupos} cupos disponibles</span></div>
      <p>${ev.desc}</p>
      <button class="btn-primary" data-ev="${ev.id}">Inscribirme</button>`;
    evGrid.appendChild(card);
    $("[data-ev]", card).addEventListener("click", () => startInscripcion(ev));
  });

  /* ============================================================
     MODALES: AUTH + INSCRIPCIÓN
     ============================================================ */
  const authModal = $("#auth-modal"), evModal = $("#evento-modal");
  const openModal = m => { m.classList.add("active"); document.body.style.overflow = "hidden"; };
  const closeModal = m => { m.classList.remove("active"); document.body.style.overflow = ""; };
  $$(".modal-backdrop").forEach(m => {
    m.addEventListener("click", e => { if (e.target === m) closeModal(m); });
    $(".modal-close", m).addEventListener("click", () => closeModal(m));
  });

  // Tabs login/registro
  let authMode = "registro";
  $$(".auth-tab").forEach(t => t.addEventListener("click", () => {
    authMode = t.dataset.mode;
    $$(".auth-tab").forEach(x => x.classList.toggle("active", x === t));
    $("#reg-fields").style.display = authMode === "registro" ? "" : "none";
    $("#auth-submit").textContent = authMode === "registro" ? "Crear mi cuenta" : "Iniciar sesión";
  }));

  // Tipo de persona
  let tipoSel = "Persona natural";
  $$(".tipo-opt").forEach(o => o.addEventListener("click", () => {
    tipoSel = o.dataset.tipo;
    $$(".tipo-opt").forEach(x => x.classList.toggle("active", x === o));
    $("#f-org-wrap").style.display = tipoSel === "Persona natural" ? "none" : "";
  }));

  $("#open-auth").addEventListener("click", () => {
    if (window.VN_AUTH.user) { window.VN_logout(); return; }
    openModal(authModal);
  });

  const authForm = $("#auth-form"), authMsg = $("#auth-msg");
  authForm.addEventListener("submit", async e => {
    e.preventDefault();
    authMsg.className = "form-msg";
    const email = $("#f-email").value.trim().toLowerCase();
    const pass = $("#f-pass").value;
    try {
      if (authMode === "login") {
        await window.VN_login(email, pass);
      } else {
        if (!$("#f-consent").checked) throw new Error("Debes autorizar el tratamiento de datos personales (Ley 1581 de 2012).");
        if (pass.length < 6) throw new Error("La contraseña debe tener mínimo 6 caracteres.");
        await window.VN_registrar({
          nombre: $("#f-nombre").value.trim(),
          email,
          tipo: tipoSel,
          organizacion: $("#f-org").value.trim(),
          documento: $("#f-doc").value.trim(),
          telefono: $("#f-tel").value.trim(),
          ciudad: $("#f-ciudad").value.trim(),
          consentimiento: true,
          consentimientoFecha: new Date().toISOString()
        }, pass);
      }
      closeModal(authModal);
      authForm.reset();
      if (pendingEvent) { const ev = pendingEvent; pendingEvent = null; startInscripcion(ev); }
    } catch (err) {
      authMsg.textContent = friendlyError(err);
      authMsg.className = "form-msg err";
    }
  });

  function friendlyError(err) {
    const m = String(err && err.message || err);
    if (m.includes("email-already-in-use")) return "Este correo ya está registrado.";
    if (m.includes("invalid-credential") || m.includes("wrong-password") || m.includes("user-not-found")) return "Correo o contraseña incorrectos.";
    if (m.includes("weak-password")) return "La contraseña debe tener mínimo 6 caracteres.";
    if (m.includes("invalid-email")) return "El correo no es válido.";
    return m.replace(/^Firebase:\s*/i, "").replace(/\(auth.*\)\.?/, "").trim();
  }

  // Inscripción a eventos
  let pendingEvent = null;
  function startInscripcion(ev) {
    if (!window.VN_AUTH.user) {
      pendingEvent = ev;
      window.VN_TOAST("Crea tu cuenta o inicia sesión para inscribirte.");
      openModal(authModal);
      return;
    }
    $("#ev-title").textContent = ev.title;
    $("#ev-meta").textContent = ev.dateLabel + " · " + ev.place;
    evModal.dataset.evId = ev.id;
    const u = window.VN_AUTH.user;
    $("#ev-user").innerHTML = `Inscripción como: <b>${u.nombre}</b> (${u.tipo}${u.organizacion ? " — " + u.organizacion : ""})`;
    openModal(evModal);
  }
  $("#evento-form").addEventListener("submit", async e => {
    e.preventDefault();
    const msg = $("#ev-msg");
    msg.className = "form-msg";
    try {
      await window.VN_inscribir(evModal.dataset.evId, {
        asistentes: +$("#ev-cant").value || 1,
        comentario: $("#ev-com").value.trim()
      });
      closeModal(evModal);
      $("#evento-form").reset();
    } catch (err) {
      msg.textContent = friendlyError(err);
      msg.className = "form-msg err";
    }
  });

  // Estado de sesión en la nav
  document.addEventListener("vn:auth", e => {
    const u = e.detail;
    const btn = $("#open-auth"), userBox = $("#nav-user");
    if (u) {
      btn.textContent = "Cerrar sesión";
      userBox.classList.add("visible");
      $(".avatar", userBox).textContent = (u.nombre || u.email || "?").trim()[0].toUpperCase();
      $(".uname", userBox).textContent = (u.nombre || u.email).split(" ")[0];
      const admin = (window.VN_ADMIN_EMAILS || []).includes((u.email || "").toLowerCase());
      $("#admin-export").style.display = admin ? "" : "none";
    } else {
      btn.textContent = "Únete / Ingresa";
      userBox.classList.remove("visible");
      $("#admin-export").style.display = "none";
    }
  });
  $("#admin-export").addEventListener("click", () => window.VN_exportCSV());

  /* ---------- Contacto (mailto compose) ---------- */
  $("#contact-form").addEventListener("submit", e => {
    e.preventDefault();
    const n = $("#c-nombre").value, em = $("#c-email").value, m = $("#c-msg").value;
    location.href = `mailto:asovitanova@gmail.com?subject=${encodeURIComponent("Contacto web — " + n)}&body=${encodeURIComponent(m + "\n\n" + n + "\n" + em)}`;
    window.VN_TOAST("Abriendo tu aplicación de correo…");
  });

  /* ---------- Año footer ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Recalcular triggers al cargar todo ---------- */
  addEventListener("load", () => ScrollTrigger.refresh());
})();
