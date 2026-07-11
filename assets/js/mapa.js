/* ============================================================
   MAPA — Colombia real (D3 + GeoJSON de departamentos)
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const wrap = $("#colombia-map");
  if (!wrap || typeof d3 === "undefined") return;

  const AREAS = window.VN_AREAS, REGIONS = window.VN_REGIONS, PROJECTS = window.VN_PROJECTS;
  const DEPT_REGION = window.VN_DEPT_REGION, DEPT_NAME = window.VN_DEPT_NAME;
  const panel = $("#map-panel-body");
  const tooltip = $("#map-tooltip");
  let activeArea = "all";

  const W = 640, H = 780;
  const svg = d3.select(wrap).append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("role", "img")
    .attr("aria-label", "Mapa de Colombia por departamentos");

  const gDepts = svg.append("g");
  const gCities = svg.append("g");

  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);

  fetch("assets/geo/colombia.geo.json")
    .then(r => r.json())
    .then(geo => {
      // San Andrés queda fuera del encuadre continental
      const continental = { type: "FeatureCollection", features: geo.features.filter(f => f.properties.DPTO !== "88") };
      projection.fitExtent([[10, 10], [W - 10, H - 10]], continental);

      gDepts.selectAll("path")
        .data(continental.features)
        .join("path")
        .attr("class", "dept")
        .attr("d", path)
        .attr("data-region", d => DEPT_REGION[d.properties.DPTO] || "andina")
        .attr("fill", d => (REGIONS[DEPT_REGION[d.properties.DPTO]] || REGIONS.andina).color)
        .on("mousemove", (ev, d) => {
          const code = d.properties.DPTO;
          const reg = REGIONS[DEPT_REGION[code]];
          tooltip.style.display = "block";
          tooltip.style.left = (ev.clientX + 14) + "px";
          tooltip.style.top = (ev.clientY - 10) + "px";
          tooltip.innerHTML = `<b>${DEPT_NAME[code] || code}</b><span>${reg ? reg.name : ""}</span>`;
        })
        .on("mouseleave", () => { tooltip.style.display = "none"; })
        .on("click", (ev, d) => selectRegion(DEPT_REGION[d.properties.DPTO] || "andina"));

      // Ciudades ancla
      const cityG = gCities.selectAll("g")
        .data(PROJECTS)
        .join("g")
        .attr("class", d => "city-dot" + (d.flagship ? " flag" : ""))
        .attr("transform", d => {
          const [x, y] = projection(d.coords);
          return `translate(${x},${y})`;
        })
        .style("cursor", "pointer")
        .on("click", (ev, d) => { ev.stopPropagation(); renderCity(d); highlightRegion(d.region); });

      cityG.append("circle").attr("class", "halo").attr("r", 7)
        .attr("stroke", d => AREAS[d.areas[0]].color);
      cityG.append("circle").attr("class", "core")
        .attr("r", d => d.flagship ? 7.5 : 5.5)
        .attr("stroke", d => AREAS[d.areas[0]].color);
      cityG.append("text").attr("x", 10).attr("y", 4).text(d => d.city);

      // Entrada animada (sin depender del scroll, para que el mapa nunca quede oculto)
      if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from(".dept", { autoAlpha: 0, stagger: .02, duration: .6, ease: "power2.out", delay: .2 });
        gsap.from(".city-dot", { autoAlpha: 0, scale: 0, transformOrigin: "center", stagger: .05, duration: .5, ease: "back.out(2)", delay: .7 });
      }

      buildFilters();
      selectRegion("andina");
    })
    .catch(err => {
      console.error("Mapa:", err);
      wrap.innerHTML = "<p style='padding:2rem;text-align:center'>No fue posible cargar el mapa. Recarga la página.</p>";
    });

  function buildFilters() {
    const filtersWrap = $(".map-filters");
    const mk = (key, label, color) => {
      const b = document.createElement("button");
      b.className = "map-filter" + (key === "all" ? " active" : "");
      b.dataset.area = key;
      if (color) b.dataset.color = color;
      b.innerHTML = (color ? `<span class="dot" style="background:${color}"></span>` : "") + label;
      b.addEventListener("click", () => {
        activeArea = key;
        $$(".map-filter").forEach(f => {
          const on = f.dataset.area === key;
          f.classList.toggle("active", on);
          f.style.background = on && f.dataset.color ? f.dataset.color : "";
          f.style.color = on && f.dataset.color ? "#fff" : "";
        });
        applyFilter();
      });
      filtersWrap.appendChild(b);
    };
    mk("all", "Todas las áreas");
    Object.entries(AREAS).forEach(([k, a]) => mk(k, a.label, a.color));
  }

  function applyFilter() {
    gCities.selectAll(".city-dot").classed("dim", d => activeArea !== "all" && !d.areas.includes(activeArea));
    if (activeArea !== "all") {
      const regionsWith = new Set(PROJECTS.filter(p => p.areas.includes(activeArea)).map(p => p.region));
      gDepts.selectAll(".dept").classed("dim", function () {
        return !regionsWith.has(this.dataset.region);
      });
    } else {
      gDepts.selectAll(".dept").classed("dim", false);
    }
  }

  function highlightRegion(key) {
    gDepts.selectAll(".dept").classed("active", function () { return this.dataset.region === key; });
  }

  function selectRegion(key) {
    highlightRegion(key);
    const r = REGIONS[key];
    const cities = PROJECTS.filter(p => p.region === key);
    const depts = Object.entries(DEPT_REGION).filter(([, v]) => v === key).map(([c]) => DEPT_NAME[c]).filter(Boolean);
    panel.innerHTML = `
      <span class="mp-region">${r.name}</span>
      <h3>${r.name.replace("Región ", "")}</h3>
      <div class="mp-stats">
        <div class="mp-stat"><b>${r.municipios}</b><span>municipios Fase 1</span></div>
        <div class="mp-stat"><b>${r.nucleos}</b><span>núcleos proyectados</span></div>
        <div class="mp-stat"><b>${cities.length}</b><span>ciudades ancla</span></div>
      </div>
      <p>${r.desc}</p>
      <p style="font-size:.78rem;color:var(--text-muted);margin-top:.8rem"><b>Departamentos:</b> ${depts.join(" · ")}</p>
      <div class="map-cities">${cities.map(c => `<button class="map-city-chip" data-city="${c.city}">${c.city}</button>`).join("")}</div>`;
    $$(".map-city-chip[data-city]", panel).forEach(ch => ch.addEventListener("click", () => {
      const p = PROJECTS.find(x => x.city === ch.dataset.city);
      if (p) renderCity(p);
    }));
    if (window.gsap) gsap.from(panel, { autoAlpha: 0, y: 14, duration: .45, ease: "power3.out" });
  }

  function renderCity(p) {
    const r = REGIONS[p.region];
    panel.innerHTML = `
      <span class="mp-region">${r.name}${p.flagship ? " · Sede principal" : ""}</span>
      <h3>${p.city}</h3>
      <p style="margin-top:.6rem">${p.desc}</p>
      <div class="mp-areas">${p.areas.map(a => `<span class="mp-area" style="background:${AREAS[a].color}">${AREAS[a].label}</span>`).join("")}</div>
      <div class="map-cities"><button class="map-city-chip" data-back="${p.region}">← Ver toda la ${r.name}</button></div>`;
    $("[data-back]", panel).addEventListener("click", e => selectRegion(e.target.dataset.back));
    if (window.gsap) gsap.from(panel, { autoAlpha: 0, y: 14, duration: .45, ease: "power3.out" });
  }
})();
