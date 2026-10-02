/* ============================================================
   SHELL — Navegación, footer, WhatsApp y modal de cuenta
   compartidos por todas las páginas.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const PAGES = [
    { href: "index.html",     label: "Inicio" },
    { href: "nosotros.html",  label: "Nosotros" },
    { href: "programas.html", label: "Programas" },
    { href: "mapa.html",      label: "Mapa" },
    { href: "nucleos.html",   label: "Núcleos" },
    { href: "galeria.html",   label: "Galería" },
    { href: "eventos.html",   label: "Eventos" },
    { href: "apoyar.html",    label: "Donar y apoyar" },
    { href: "empresas.html",  label: "Empresas" },
    { href: "contacto.html",  label: "Contacto" }
  ];
  const current = (location.pathname.split("/").pop() || "index.html");

  /* ---------- NAV ---------- */
  const nav = document.createElement("nav");
  nav.setAttribute("role", "navigation");
  nav.setAttribute("aria-label", "Navegación principal");
  nav.innerHTML = `
    <a href="index.html" class="nav-logo" aria-label="Vita Nova inicio">
      <img src="assets/img/img_00.jpg" alt="Logo Vita Nova">
      <span class="nav-logo-text">Vita <span>Nova</span></span>
    </a>
    <ul class="nav-links">
      ${PAGES.map(p => `<li><a href="${p.href}" ${p.href === current ? 'class="active" aria-current="page"' : ""}>${p.label}</a></li>`).join("")}
    </ul>
    <div class="nav-right">
      <div class="nav-user" id="nav-user"><span class="avatar"></span><span class="uname"></span></div>
      <button class="nav-cta" id="admin-export" style="display:none;background:var(--plum)">Exportar CSV</button>
      <button class="nav-cta" id="open-auth">Únete / Ingresa</button>
      <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>`;
  document.body.prepend(nav);

  const progress = document.createElement("div");
  progress.id = "scroll-progress";
  document.body.prepend(progress);

  // Barra inteligente: se oculta al bajar, aparece al subir
  let lastY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("solid", y > 40);
    if (y > lastY && y > 260 && !nav.classList.contains("open")) nav.classList.add("nav-hidden");
    else nav.classList.remove("nav-hidden");
    lastY = y;
    const h = document.documentElement;
    progress.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100 + "%";
    const darkEl = document.elementFromPoint(innerWidth / 2, 40);
    nav.classList.toggle("on-dark", !!(darkEl && darkEl.closest("[data-dark]")));
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const toggle = $(".nav-toggle", nav);
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) nav.classList.remove("nav-hidden");
  }
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$(".nav-links a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- REDES SOCIALES ---------- */
  const SOCIAL_ICONS = {
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.5 15.6V8.4L15.8 12l-6.3 3.6z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2a3.8 3.8 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M19.6 5.8a5 5 0 0 1-3.5-4.2H12.6v14.6a3 3 0 1 1-2.1-2.9V9.9a6.4 6.4 0 1 0 5.5 6.3V8.7a8.3 8.3 0 0 0 4.8 1.5V6.8c-.4 0-.8 0-1.2-.1z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zM7.1 20.4H3.5V9h3.6v11.4z"/></svg>'
  };
  function socialLinks(cls) {
    return Object.entries(window.VN_SOCIAL || {})
      .filter(([, url]) => url)
      .map(([net, url]) => `<a class="${cls}" href="${url}" target="_blank" rel="noopener" aria-label="${net}">${SOCIAL_ICONS[net] || net}</a>`)
      .join("");
  }

  /* ---------- FOOTER ---------- */
  const footer = document.createElement("footer");
  footer.innerHTML = `
    <div class="footer-grid">
      <div>
        <div class="nav-logo" style="margin-bottom:1rem"><img src="assets/img/img_00.jpg" alt=""><span class="nav-logo-text" style="color:#fff">Vita <span style="color:var(--teal-light)">Nova</span></span></div>
        <p style="color:rgba(255,255,255,.6);font-size:.85rem;max-width:34ch">Asociación Vita Nova Colombia. Inclusión, formación y tecnología para la paz — de la Amazonia al Pacífico.</p>
        <div class="footer-social">${socialLinks("fs-link")}</div>
      </div>
      <div><h4>Sitio</h4>${PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join("")}</div>
      <div><h4>Legal</h4>
        <a href="legal.html#privacidad">Política de privacidad</a>
        <a href="legal.html#datos">Tratamiento de datos (Ley 1581)</a>
        <a href="legal.html#terminos">Términos y condiciones</a>
        <a href="legal.html#cookies">Política de cookies</a>
      </div>
      <div><h4>Contacto</h4>
        <a href="mailto:admin@vitanovacolombia.org">admin@vitanovacolombia.org</a>
        <a href="https://wa.me/${window.VN_WHATSAPP}" target="_blank" rel="noopener">WhatsApp: 300 980 2268</a>
        <a href="https://maps.google.com/?q=Av.+El+Poblado+1-50+Medellin" target="_blank" rel="noopener">Av. El Poblado N° 1-50, Medellín</a>
        <a href="https://aliados.vitanovacolombia.org" target="_blank" rel="noopener" class="footer-portal" title="Acceso con código de invitación">Portal de aliados</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year">${new Date().getFullYear()}</span> Asociación Vita Nova Colombia${(window.VN_PAY || {}).nit ? " · NIT " + window.VN_PAY.nit : ""}. Todos los derechos reservados.</span>
      <span>Hecho con propósito en Colombia 🇨🇴</span>
    </div>`;
  document.body.appendChild(footer);

  // Redes también dentro del menú (útil en móvil)
  $(".nav-links", nav).insertAdjacentHTML("beforeend", `<li class="nav-social-row">${socialLinks("ns-link")}</li>`);

  /* ---------- Píxel de Meta (solo si está configurado) ---------- */
  const pixelId = (window.VN_META || {}).pixelId;
  if (pixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', pixelId);
    fbq('track', 'PageView');
  }

  /* ---------- WHATSAPP FLOTANTE ---------- */
  const wa = document.createElement("a");
  wa.className = "wa-fab";
  wa.href = `https://wa.me/${window.VN_WHATSAPP}?text=${encodeURIComponent("Hola Vita Nova, tengo una pregunta 👋")}`;
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Escríbenos por WhatsApp");
  wa.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.6c1.2.6 2.5.9 3.8.9 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-1.2 0-2.4-.3-3.5-.8l-.5-.3-4.9 1 1-4.7-.3-.5c-1-1.6-1.5-3.4-1.5-5.2C6.3 9.6 10.6 5.3 16 5.3S25.7 9.6 25.7 15 21.4 25 16 25zm5.3-7.2c-.3-.1-1.7-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1c-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.5-1.8-1.6-2.1s0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4z"/></svg>
    <span class="wa-tip">¿Preguntas? Escríbenos</span>`;
  document.body.appendChild(wa);

  /* ---------- TOAST ---------- */
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  /* ---------- MODAL DE CUENTA ---------- */
  const authWrap = document.createElement("div");
  authWrap.className = "modal-backdrop";
  authWrap.id = "auth-modal";
  authWrap.setAttribute("role", "dialog");
  authWrap.setAttribute("aria-modal", "true");
  authWrap.innerHTML = `
  <div class="modal">
    <button class="modal-close" aria-label="Cerrar">✕</button>
    <h3>Únete a Vita Nova</h3>
    <p class="m-sub">Crea tu cuenta para inscribirte a eventos, donar y recibir información de programas.</p>
    <div class="auth-tabs">
      <button class="auth-tab active" data-mode="registro" type="button">Registrarme</button>
      <button class="auth-tab" data-mode="login" type="button">Ya tengo cuenta</button>
    </div>
    <form id="auth-form">
      <div id="reg-fields" style="display:flex;flex-direction:column;gap:.9rem">
        <div>
          <label>Tipo de registro</label>
          <div class="tipo-grid">
            <button type="button" class="tipo-opt active" data-tipo="Persona natural">Persona natural</button>
            <button type="button" class="tipo-opt" data-tipo="Empresa">Empresa</button>
            <button type="button" class="tipo-opt" data-tipo="Fundación / ONG">Fundación / ONG</button>
            <button type="button" class="tipo-opt" data-tipo="Entidad pública">Entidad pública</button>
          </div>
        </div>
        <div><label for="f-nombre">Nombre completo / Representante</label><input id="f-nombre" autocomplete="name"></div>
        <div id="f-org-wrap" style="display:none"><label for="f-org">Nombre de la organización</label><input id="f-org" autocomplete="organization"></div>
        <div><label for="f-doc">Documento de identidad / NIT</label><input id="f-doc"></div>
        <div><label for="f-tel">Teléfono / WhatsApp</label><input id="f-tel" type="tel" autocomplete="tel"></div>
        <div><label for="f-ciudad">Ciudad</label><input id="f-ciudad" autocomplete="address-level2"></div>
      </div>
      <div><label for="f-email">Correo electrónico</label><input id="f-email" type="email" required autocomplete="email"></div>
      <div><label for="f-pass">Contraseña</label><input id="f-pass" type="password" required minlength="6" autocomplete="new-password"></div>
      <div class="consent-row">
        <input type="checkbox" id="f-consent">
        <label for="f-consent" style="font-weight:400">Autorizo a la Asociación Vita Nova Colombia el tratamiento de mis datos personales conforme a la <a href="legal.html#datos" target="_blank">Ley 1581 de 2012</a> y su <a href="legal.html#privacidad" target="_blank">política de privacidad</a>.</label>
      </div>
      <div class="form-msg" id="auth-msg"></div>
      <button class="btn-primary" id="auth-submit" type="submit" style="justify-content:center">Crear mi cuenta</button>
      <p class="demo-note" id="demo-note" style="display:none">Modo demostración: tus datos se guardan solo en este navegador mientras se activa la base de datos institucional.</p>
    </form>
  </div>`;
  document.body.appendChild(authWrap);

  // Utilidades de modal compartidas
  window.VN_openModal = m => { m.classList.add("active"); document.body.style.overflow = "hidden"; };
  window.VN_closeModal = m => { m.classList.remove("active"); document.body.style.overflow = ""; };
  function bindModal(m) {
    m.addEventListener("click", e => { if (e.target === m) window.VN_closeModal(m); });
    const c = $(".modal-close", m);
    if (c) c.addEventListener("click", () => window.VN_closeModal(m));
  }
  window.VN_bindModal = bindModal;
  bindModal(authWrap);
  addEventListener("keydown", e => {
    if (e.key === "Escape") $$(".modal-backdrop.active").forEach(m => window.VN_closeModal(m));
  });

  /* ---------- Lógica de cuenta ---------- */
  let authMode = "registro";
  $$(".auth-tab", authWrap).forEach(t => t.addEventListener("click", () => {
    authMode = t.dataset.mode;
    $$(".auth-tab", authWrap).forEach(x => x.classList.toggle("active", x === t));
    $("#reg-fields").style.display = authMode === "registro" ? "" : "none";
    $("#auth-submit").textContent = authMode === "registro" ? "Crear mi cuenta" : "Iniciar sesión";
  }));

  let tipoSel = "Persona natural";
  $$(".tipo-opt", authWrap).forEach(o => o.addEventListener("click", () => {
    tipoSel = o.dataset.tipo;
    $$(".tipo-opt", authWrap).forEach(x => x.classList.toggle("active", x === o));
    $("#f-org-wrap").style.display = tipoSel === "Persona natural" ? "none" : "";
  }));

  window.VN_requireAuth = function (thenFn) {
    if (window.VN_AUTH && window.VN_AUTH.user) { thenFn(); return; }
    window.__vnAfterAuth = thenFn;
    window.VN_TOAST && window.VN_TOAST("Crea tu cuenta o inicia sesión para continuar.");
    window.VN_openModal(authWrap);
  };

  $("#open-auth").addEventListener("click", () => {
    if (window.VN_AUTH && window.VN_AUTH.user) { window.VN_logout(); return; }
    window.VN_openModal(authWrap);
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
        if (!$("#f-nombre").value.trim()) throw new Error("Escribe tu nombre completo.");
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
      window.VN_closeModal(authWrap);
      authForm.reset();
      if (window.__vnAfterAuth) { const fn = window.__vnAfterAuth; window.__vnAfterAuth = null; fn(); }
    } catch (err) {
      authMsg.textContent = window.VN_friendlyError(err);
      authMsg.className = "form-msg err";
    }
  });

  window.VN_friendlyError = function (err) {
    const m = String(err && err.message || err);
    if (m.includes("email-already-in-use")) return "Este correo ya está registrado.";
    if (m.includes("invalid-credential") || m.includes("wrong-password") || m.includes("user-not-found")) return "Correo o contraseña incorrectos.";
    if (m.includes("weak-password")) return "La contraseña debe tener mínimo 6 caracteres.";
    if (m.includes("invalid-email")) return "El correo no es válido.";
    return m.replace(/^Firebase:\s*/i, "").replace(/\(auth.*\)\.?/, "").trim();
  };

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

  if (window.VN_DEMO) { const dn = $("#demo-note"); if (dn) dn.style.display = ""; }
})();
