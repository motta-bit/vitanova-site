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
    "eventos.html": "Events", "apoyar.html": "Donate & support", "empresas.html": "Companies", "contacto.html": "Contact"
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
    ['footer a[href="legal.html#cookies"]', "Cookie policy"],
    [".footer-portal", "Partner portal"]
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
      [".stat-band-item .l", ["municipalities across Colombia prioritized in Phase 1", "Colombian departments in Phase 1", "inclusive development hubs projected", "beneficiary families with their own productive model"]],
      ["#video-home .section-label", "New life"],
      ["#video-home h2", "For those the world forgot"],
      ["#video-home p", "Inclusion · Education · High-impact entrepreneurship. Discover in one minute what we do and why we do it."],
      ["#vida .section-label", "Our community"],
      ["#vida h2", "The lives we transform, in motion"],
      ["#vida .section-center p", null, function (el) { el.innerHTML = 'Every bubble is a real moment of our community. See more in the <a href="galeria.html" style="color:var(--teal-deep)">full gallery</a>.'; }],
      [".b-label", ["Community", "Territory", "Education", "Learning", "Activities", "Inclusion", "Joy", "Future"]],
      ["#explora .section-label", "Explore the site"],
      ["#explora h2", "What would you like to discover today?"],
      ["#explora .support-card h3", ["Impact map", "Events & workshops", "Donate & support"]],
      ["#explora .support-card p", [
        "Travel across the real map of Colombia: active presence in 17 departments and routes across the country's 5 regions.",
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
      ["#empresas-home .section-label", "For companies"],
      ["#empresas-home h2", "Does your company want to be part of Vita Nova?"],
      ["#empresas-home .emp-copy > p", "Social responsibility, inclusive employment, in-kind donations and impact investment. We prepared a private dossier with the full project for companies and strategic partners."],
      ["#empresas-home .btn-secondary", "See how to get involved"],
      ["#empresas-home .emp-card h3", "Dossier for companies"],
      ["#empresas-home .emp-card > p:not(.emp-help)", "Enter the access code Vita Nova gave you."],
      ['label[for="home-codigo"]', "Access code"],
      ["#empresas-home .emp-form button", 'View the dossier <span aria-hidden="true">→</span>'],
      ["#empresas-home .emp-direct", "Or go straight to the partner portal ↗"],
      ["#empresas-home .emp-help", 'Don\'t have a code? Write to <a href="mailto:admin@vitanovacolombia.org">admin@vitanovacolombia.org</a>.'],
      ["#aliados .section-label", "Cooperation network"],
      ["#aliados h2", "Our allies"]
    ],
    "nosotros.html": [
      [".page-hero .section-label", "Who we are"],
      [".page-hero h1", "An organization founded from within"],
      [".ph-sub", "An NGO founded by people with disabilities. We don't intervene in communities from the outside: we are part of them. We guarantee every person a clear path to economic and social independence."],
      ["#nosotros .section-label", "Our essence"],
      ["#nosotros h2", "A human, cultural, academic and productive proposal"],
      [".quote-card", "“Disability is nothing more than an opportunity. There are no limits.”"],
      ["#enfoque .section-label", "Our approach"],
      ["#enfoque h2", "Being, knowing and doing"],
      ["#enfoque .section-center p", "Every person follows a complete path: first they grow stronger, then they learn, and finally they produce."],
      [".ssh-card h3", ["Being", "Knowing", "Doing"]],
      [".ssh-card p", ["Psychosocial strengthening", "Academic and technical education", "Employability and entrepreneurship"]],
      [".poblacion h3", "Target population"],
      [".poblacion li", ["People with visual, sensory, physical and cognitive disabilities", "Indigenous communities and reservations", "Migrants", "Displaced people and caregivers"]],
      ["#contexto .section-label", "Why Colombia needs Vita Nova"],
      ["#contexto h2", "A country with 3.1 million people with disabilities"],
      ["#contexto .impact-label", ["people with disabilities in Colombia (DANE)", "with visual disabilities, our priority population", "access formal education", "achieve stable employment"]],
      [".contexto-note", "Gaps deepen in rural territories, indigenous communities and post-conflict areas. The conventional market offers fragmented solutions: welfare without employability. Vita Nova breaks that cycle with an integral, scalable model."],
      [".contexto-foot", "Colombia ratified the UN Convention on the Rights of Persons with Disabilities (Law 1346 of 2009). Vita Nova works as a territorial compliance mechanism."],
      ["#formacion h2", "Education for every person"],
      ["#impacto h2", "Our impact in numbers"],
      ["#impacto .impact-label", ["Municipalities in Phase 1, from the Amazon to the Pacific", "Colombian departments", "Inclusive development hubs", "Beneficiary families"]],
      ["#alianzas .section-label", "Strategic alliances"],
      ["#alianzas h2", "An ecosystem built on trust and evidence"],
      [".ally-type", null, function (el) {
        const T = { "Convenio de investigación": "Research agreement", "Responsabilidad empresarial": "Corporate responsibility",
                    "Cooperación": "Cooperation", "Aliado estratégico": "Strategic partner" };
        if (T[el.textContent]) el.textContent = T[el.textContent];
      }],
      ["#vision .section-label", "Vision 2025 — 2035"],
      ["#vision h2", "Where we are heading"],
      [".timeline p", [
        "Agreements signed, psychosocial strengthening starts in 130 municipalities and partnership round.",
        "Technical programs running and the first 20 hubs in operation.",
        "650 hubs operating, break-even point and handover to beneficiaries.",
        "Phase 2 expansion, our own technology platform and national benchmark.",
        "More than 3,000 active hubs and the model replicated across Latin America."
      ]],
      ["#vision h3", "Join the movement"],
      ["#vision .btn-primary", "Donate & support"],
      ["#vision .btn-secondary", "Partnerships & CSR"]
    ],
    "programas.html": [
      [".page-hero .section-label", "Institutional path"],
      [".page-hero h1", "How we transform lives"],
      [".ph-sub", "A 24-month path in five stages, supported by six complementary programs: three for the beneficiary and three cross-cutting ones that guarantee sustainability."],
      ["#etapas .section-label", "Methodology"],
      ["#etapas h2", "The 5 stages of the Vita Nova Project"],
      ["#etapas .section-center p", "An integral 24-month process, from assessment to full economic independence."],
      [".stage h3", ["Psychosocial strengthening", "Education", "Employability", "Development hubs", "Technology for Peace"]],
      [".stage p", ["Comprehensive assessment and permanent support.", "74 technical and academic programs with the National University.", "2-year apprenticeship contract with family protection.", "50 families per hub · 7 hubs per municipality.", "Drones, IoT, satellites and inclusive DeepTech."]],
      [".stages-foot", "24 months from assessment to economic independence"],
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
      [".ph-sub", "Inclusive productive units structured as emerging economies. After 24 months, each hub is handed over to its beneficiaries with full administrative and economic autonomy."],
      ["#ecuacion .section-label", "The impact equation"],
      ["#ecuacion h2", "Economy with purpose"],
      [".eq-term span", ["Emerging economies", "Conventional investment", "Social responsibility", "High-impact solidarity economies"]],
      ["#nucleo-tipo .section-label", "Productive model"],
      ["#nucleo-tipo h2", "Model hub: export eggs"],
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
      [".gallery-tab", ["All", "Professional session", "Community"]],
      ["#videos h2", "Vita Nova in motion"],
      [".video-card figcaption", ["Opening video · 1 min", "Vertical version for mobile"]]
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
    "empresas.html": [
      [".page-hero .section-label", "Companies & partners"],
      [".page-hero h1", "Let's build impact together"],
      [".ph-sub", "Vita Nova is built with companies, universities and organizations that see inclusion as a driver of development. Explore the full project dossier with your access code."],
      ["#acceso .section-label", "Private dossier"],
      ["#acceso h2", "The full project, for your organization"],
      [".emp-copy > p", "We prepared a private tour for companies and strategic partners: presentation video, figures, productive model, territorial presence and alliances."],
      [".emp-list li", ["Project presentation video", "Figures and scale of impact", "The Inclusive Development Hubs model", "Territory, team and alliances"]],
      [".emp-card h3", "Access the dossier"],
      [".emp-card > p:not(.emp-help)", "Enter the access code Vita Nova gave you."],
      ['label[for="emp-codigo"]', "Access code"],
      [".emp-form button", 'View the dossier <span aria-hidden="true">→</span>'],
      [".emp-direct", "Or go straight to the partner portal ↗"],
      [".emp-help", 'Don\'t have a code? Write to <a href="mailto:admin@vitanovacolombia.org">admin@vitanovacolombia.org</a> or via <a href="https://wa.me/573009802268" target="_blank" rel="noopener">WhatsApp</a>.'],
      ["#formas .section-label", "Join the movement"],
      ["#formas h2", "Ways to involve your company"],
      ["#formas .ally-card h3", ["Corporate social responsibility", "In-kind donations", "International cooperation", "Impact investment", "Inclusive employment", "Awareness training"]],
      ["#formas .ally-card p", [
        "Inter-institutional agreements with measurable impact on inclusion, education and employment.",
        "Equipment, technology and resources that go straight to the hubs and programs.",
        "Coordination with agencies and NGOs to scale the model across the territory.",
        "Take part in the productive hubs and in Casa Raíz, our next big project.",
        "Hire talent trained by Vita Nova, with the reasonable accommodations each person needs.",
        "A certified 40-hour workshop so your team builds a truly inclusive culture."
      ]],
      ["#cta h2", "Let's talk about your organization"],
      ["#cta p", "We'll explain how your company can take part and give you your access code."],
      ["#cta .btn-primary", "Contact us"],
      ["#cta .btn-secondary", "About Vita Nova"]
    ],
    "contacto.html": [
      [".page-hero .section-label", "Let's talk"],
      [".page-hero h1", "Contact us"],
      [".ph-sub", "Want to join, contribute, donate or ask something? We are here for you."],
      ["#contacto h2", "Always close to you"],
      [".contact-item h4", ["Address", "WhatsApp", "Email", "Social media"]],
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
