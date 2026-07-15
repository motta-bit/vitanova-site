/* ============================================================
   I18N — Cambio de idioma Español / English (minimalista)
   Debe cargarse DESPUÉS de shell.js y ANTES de anim.js.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const LANG = localStorage.getItem("vn_lang") === "en" ? "en" : "es";
  const page = (location.pathname.split("/").pop() || "index.html");

  /* ---------- Switch en la barra (escritorio) y en el menú (móvil) ---------- */
  function switchHTML() {
    return `<div class="lang-switch" role="group" aria-label="Idioma / Language">
      <button type="button" data-lang="es" class="${LANG === "es" ? "active" : ""}">ES</button>
      <button type="button" data-lang="en" class="${LANG === "en" ? "active" : ""}">EN</button>
    </div>`;
  }
  const navRight = $(".nav-right");
  if (navRight) navRight.insertAdjacentHTML("afterbegin", switchHTML());
  const navLinks = $(".nav-links");
  if (navLinks) navLinks.insertAdjacentHTML("afterbegin", `<li class="nav-lang-row">${switchHTML()}</li>`);
  $$(".lang-switch button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.lang === LANG) return;
    localStorage.setItem("vn_lang", b.dataset.lang);
    location.reload();
  }));

  if (LANG === "es") return; // el sitio ya está en español
  document.documentElement.lang = "en";

  /* ---------- Diccionario EN ----------
     [selector, texto] — si el selector devuelve varios, usar array de textos. */
  const NAV = {
    "index.html": "Home", "nosotros.html": "About us", "programas.html": "Programs",
    "mapa.html": "Map", "nucleos.html": "Hubs", "galeria.html": "Gallery",
    "eventos.html": "Events", "apoyar.html": "Donate & support", "contacto.html": "Contact"
  };
  const GLOBAL = [
    ["#open-auth", $("#open-auth") && $("#open-auth").textContent.includes("Cerrar") ? "Sign out" : "Join / Sign in"],
    ["footer h4", ["Site", "Legal", "Contact"]],
    ["footer .footer-grid > div:first-child p", "Vita Nova Colombia Association. Inclusion, education and technology for peace — from the Amazon to the Pacific."],
    ["footer .footer-bottom span:last-child", "Made with purpose in Colombia 🇨🇴"],
    [".wa-tip", "Questions? Chat with us"],
    ['footer a[href="legal.html#privacidad"]', "Privacy policy"],
    ['footer a[href="legal.html#datos"]', "Data protection (Law 1581)"],
    ['footer a[href="legal.html#terminos"]', "Terms and conditions"],
    ['footer a[href="legal.html#cookies"]', "Cookie policy"]
  ];
  const PAGES = {
    "index.html": [
      [".hero-badge", "Vita Nova Colombia Association · NGO"],
      ["#inicio h1", "A living cell of human transformation"],
      [".hero-tagline", "Real inclusion, transformative education and technology for peace — from the Amazon to the Pacific, for people with disabilities, indigenous communities and vulnerable populations."],
      ['#inicio .btn-group a.btn-primary', "Explore the impact map"],
      ['#inicio .btn-group a.btn-secondary', "I want to donate"],
      [".hero-stat-l", ["municipalities across Colombia<br>reached in Phase 1", "development hubs<br>for 32,500 families"]],
      [".hero-scroll span", "Scroll"],
      [".manifiesto-text", null, function (el) {
        el.innerHTML = '<span class="mw">We</span> <span class="mw">believe</span> <span class="mw accent">real</span> <span class="mw accent">integration</span> <span class="mw">needs</span> <span class="mw">no</span> <span class="mw">labels.</span> <span class="mw">Our</span> <span class="mw">proposal</span> <span class="mw">is</span> <span class="mw accent">human,</span> <span class="mw accent">cultural,</span> <span class="mw accent">academic</span> <span class="mw">and</span> <span class="mw accent">productive</span> <span class="mw">—</span> <span class="mw">a</span> <span class="mw">living</span> <span class="mw">cell</span> <span class="mw">that</span> <span class="mw">grows</span> <span class="mw">with</span> <span class="mw">every</span> <span class="mw accent">person.</span>';
      }],
      [".stat-band-item .l", ["municipalities across Colombia prioritized in Phase 1", "inclusive development hubs projected", "families integrated into each productive hub", "technical and professional training programs"]],
      ["#vida .section-label", "Our community"],
      ["#vida h2", "The lives we transform, in motion"],
      ["#vida .section-center p", null, function (el) { el.innerHTML = 'Every bubble is a real moment of our community. See more in the <a href="galeria.html" style="color:var(--teal-deep)">full gallery</a>.'; }],
      [".b-label", ["Community", "Territory", "Education", "Learning", "Activities", "Inclusion", "Joy", "Future"]],
      ["#explora .section-label", "Explore the site"],
      ["#explora h2", "What would you like to discover today?"],
      ["#explora .support-card h3", ["Impact map", "Events & workshops", "Donate & support"]],
      ["#explora .support-card p", [
        "Travel across the real map of Colombia: 32 departments, 5 regions and 13 anchor cities with active projects.",
        "Sign up for the certified awareness workshop, webinars and the inclusive education fair.",
        "Your contribution with an instant receipt: secure donations, administrative support or institutional agreements."
      ]],
      ["#proyectos .teaser-badge", null, function (el) { el.innerHTML = '<span class="teaser-pulse"></span>Coming soon'; }],
      ['[data-i18n="teaser-label"]', "Upcoming projects"],
      ['[data-i18n="teaser-sub"]', "The next chapter of Vita Nova is already taking root. A project that will take inclusion and sustainable development to a new level — details coming very soon."],
      ['[data-i18n="teaser-h1"]', "Territory"],
      ['[data-i18n="teaser-h2"]', "Community"],
      ['[data-i18n="teaser-h3"]', "Sustainable impact"],
      ['[data-i18n="teaser-invite"]', "Are you a company, or interested in impact investing? Be among the first to discover Casa Raíz and explore how to be part of it from the very beginning."],
      ['[data-i18n="teaser-cta1"]', "I want to know Casa Raíz"],
      ['[data-i18n="teaser-cta2"]', "Partnerships & impact investment"],
      ["#aliados .section-label", "Cooperation network"],
      ["#aliados h2", "Our allies"]
    ],
    "nosotros.html": [
      [".page-hero .section-label", "Who we are"],
      [".page-hero h1", "Founded by those who live inclusion"],
      [".ph-sub", "An NGO created by people with disabilities and allies committed to Colombia's human development."],
      ["#nosotros .section-label", "Our essence"],
      ["#nosotros h2", "A human, cultural, academic and productive proposal"],
      ["#formacion h2", "Education for every person"],
      ["#impacto h2", "Our impact in numbers"]
    ],
    "programas.html": [
      [".page-hero .section-label", "Institutional path"],
      [".page-hero h1", "How we transform lives"],
      [".ph-sub", "Six complementary programs travelled like a path: three for the beneficiary and three cross-cutting ones that guarantee sustainability. Scroll to move along the route."],
      [".prog-card h3", ["Education", "Employability", "Development hubs", "Assessment", "Technology for Peace", "Awareness"]],
      ["#cta h2", "Want to be part of the path?"],
      ["#cta .btn-primary", "See events"],
      ["#cta .btn-secondary", "Donate & support"]
    ],
    "mapa.html": [
      [".page-hero .section-label", "Territorial presence"],
      [".page-hero h1", "The living map of Vita Nova"],
      [".ph-sub", "The real Colombia, department by department: tap a region or a city to discover the projects, and filter by area of work."]
    ],
    "nucleos.html": [
      [".page-hero .section-label", "Territorial model"],
      [".page-hero h1", "Inclusive Development Hubs"],
      [".ph-sub", "Each hub integrates ~50 families into a sustainable, high-impact productive model: Phase 1 aims for 650 hubs across 130 municipalities, organized by Colombia's five natural regions."],
      ["#regiones h2", "The goal, region by region"],
      ["#modelo h2", "How does a hub work?"],
      ["#cta h2", "Make the next hub possible"],
      ["#cta .btn-primary", "Donate now"],
      ["#cta .btn-secondary", "See the interactive map"]
    ],
    "galeria.html": [
      [".page-hero .section-label", "Our work in pictures"],
      [".page-hero h1", "Gallery"],
      [".ph-sub", "Real moments of our community — people, processes and transformations."],
      [".gallery-tab", ["All", "Community", "Education", "Activities"]]
    ],
    "eventos.html": [
      [".page-hero .section-label", "Agenda"],
      [".page-hero h1", "Upcoming events"],
      [".ph-sub", "Sign up with your account: we classify your registration as an individual, company, foundation or public entity, and we take care of your accessibility needs."]
    ],
    "apoyar.html": [
      [".page-hero .section-label", "Join the change"],
      [".page-hero h1", "Donate and support inclusion"],
      [".ph-sub", "Your contribution drives education, decent work and technology for peace. You receive your donation receipt right after a successful payment."],
      ["#donar h2", "Your contribution transforms lives"],
      ["#donar-form h3", "Make my donation"],
      ["#donar-btn-label", "Donate $50.000"],
      ["#apoyar h2", "How else can you support us?"],
      ["#apoyar .support-card h3", ["Administrative & legal support", "In-kind donations", "Institutional agreements"]]
    ],
    "contacto.html": [
      [".page-hero .section-label", "Let's talk"],
      [".page-hero h1", "Contact us"],
      [".ph-sub", "Want to join, contribute, donate or ask something? We are here for you."],
      ["#contacto h2", "Always close to you"],
      [".contact-item h4", ["Address", "WhatsApp", "Email"]],
      [".contact-form h3", "Write to us"],
      ['.contact-form label[for="c-nombre"]', "Full name"],
      ['.contact-form label[for="c-email"]', "Email address"],
      ['.contact-form label[for="c-msg"]', "Message"],
      [".contact-form .btn-primary", "Send message"]
    ],
    "legal.html": [
      [".legal-wrap h1", "Legal information"]
    ]
  };

  function apply(entries) {
    entries.forEach(([sel, val, fn]) => {
      const els = $$(sel);
      if (!els.length) return;
      if (fn) { els.forEach(fn); return; }
      if (Array.isArray(val)) {
        els.forEach((el, i) => { if (val[i] != null) el.innerHTML = val[i]; });
      } else if (val != null) {
        els[0].innerHTML = val;
      }
    });
  }

  // Nav y footer (enlaces generados por shell.js a partir de las páginas)
  Object.entries(NAV).forEach(([href, label]) => {
    $$(`.nav-links a[href="${href}"], footer a[href="${href}"]`).forEach(a => { a.textContent = label; });
  });
  apply(GLOBAL);
  apply(PAGES[page] || []);

  // El botón de sesión cambia con el estado: retraducir al cambiar
  document.addEventListener("vn:auth", e => {
    const btn = $("#open-auth");
    if (btn) btn.textContent = e.detail ? "Sign out" : "Join / Sign in";
  });
})();
