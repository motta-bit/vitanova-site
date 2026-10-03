/* ============================================================
   MAPA — Colombia real e interactivo (D3 + GeoJSON)
   Clic en un departamento → zoom + información del territorio.
   Clic en una ciudad → zoom + proyectos de la ciudad.
   Departamentos con presencia activa (VN_ACTIVE_DEPTS) a color, el resto en gris;
   rutas animadas desde la sede (Medellín) hacia cada punto con "route: true".
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const wrap = $("#colombia-map");
  if (!wrap || typeof d3 === "undefined") return;

  const AREAS = window.VN_AREAS, REGIONS = window.VN_REGIONS, PROJECTS = window.VN_PROJECTS;
  const DEPT_REGION = window.VN_DEPT_REGION, DEPT_NAME = window.VN_DEPT_NAME;
  const ACTIVE = new Set(window.VN_ACTIVE_DEPTS || []);
  const INACTIVE_FILL = "#DCE3DF";
  const areasOf = p => p.areas || [];
  const colorOf = p => (AREAS[areasOf(p)[0]] || { color: "#1D9E75" }).color;
  const panel = $("#map-panel-body");
  const tooltip = $("#map-tooltip");
  const resetBtn = $("#map-reset");
  let activeArea = "all";

  const W = 640, H = 780;
  const svg = d3.select(wrap).append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("role", "img")
    .attr("aria-label", "Mapa interactivo de Colombia por departamentos");

  const gRoot = svg.append("g");
  const gDepts = gRoot.append("g");
  const gRoutes = gRoot.append("g").attr("class", "routes");
  const gCities = gRoot.append("g");

  const projection = d3.geoMercator();
  const path = d3.geoPath(projection);

  /* ---------- Zoom ---------- */
  let currentK = 1;
  const zoom = d3.zoom()
    .scaleExtent([1, 9])
    .on("zoom", ev => {
      currentK = ev.transform.k;
      gRoot.attr("transform", ev.transform);
      placeCities();
      if (resetBtn) resetBtn.style.display = currentK > 1.05 ? "" : "none";
      svg.classed("show-labels", currentK >= 2.2);
    });
  svg.call(zoom);

  function zoomToFeature(f) {
    const [[x0, y0], [x1, y1]] = path.bounds(f);
    const k = Math.min(8, 0.82 / Math.max((x1 - x0) / W, (y1 - y0) / H));
    const t = d3.zoomIdentity
      .translate(W / 2 - k * (x0 + x1) / 2, H / 2 - k * (y0 + y1) / 2)
      .scale(k);
    svg.transition().duration(850).ease(d3.easeCubicInOut).call(zoom.transform, t);
  }
  function zoomToPoint(coords, k) {
    const [x, y] = projection(coords);
    const t = d3.zoomIdentity.translate(W / 2 - k * x, H / 2 - k * y).scale(k);
    svg.transition().duration(850).ease(d3.easeCubicInOut).call(zoom.transform, t);
  }
  function resetZoom() {
    svg.transition().duration(750).ease(d3.easeCubicInOut).call(zoom.transform, d3.zoomIdentity);
    gDepts.selectAll(".dept").classed("active", false);
  }
  if (resetBtn) resetBtn.addEventListener("click", () => { resetZoom(); overview(); });

  /* ---------- Ciudades: tamaño constante al hacer zoom ---------- */
  function placeCities() {
    gCities.selectAll("g.city-dot").attr("transform", d => {
      const [x, y] = projection(d.coords);
      return `translate(${x},${y}) scale(${1 / currentK})`;
    });
  }

  let geoData = null;

  fetch("assets/geo/colombia.geo.json")
    .then(r => r.json())
    .then(geo => {
      geoData = geo;
      const continental = { type: "FeatureCollection", features: geo.features.filter(f => f.properties.DPTO !== "88") };
      projection.fitExtent([[10, 10], [W - 10, H - 10]], continental);

      gDepts.selectAll("path")
        .data(continental.features)
        .join("path")
        .attr("class", d => "dept" + (ACTIVE.has(d.properties.DPTO) ? " is-active" : " inactive"))
        .attr("d", path)
        .attr("data-region", d => DEPT_REGION[d.properties.DPTO] || "andina")
        .attr("data-code", d => d.properties.DPTO)
        .attr("fill", d => ACTIVE.has(d.properties.DPTO)
          ? (REGIONS[DEPT_REGION[d.properties.DPTO]] || REGIONS.andina).color
          : INACTIVE_FILL)
        .on("mousemove", (ev, d) => {
          const code = d.properties.DPTO;
          const reg = REGIONS[DEPT_REGION[code]];
          tooltip.style.display = "block";
          tooltip.style.left = (ev.clientX + 14) + "px";
          tooltip.style.top = (ev.clientY - 10) + "px";
          tooltip.innerHTML = `<b>${DEPT_NAME[code] || code}</b><span>${ACTIVE.has(code) ? "Presencia activa · " + (reg ? reg.name : "") : "Expansión futura"}</span>`;
        })
        .on("mouseleave", () => { tooltip.style.display = "none"; })
        .on("click", (ev, d) => {
          ev.stopPropagation();
          tooltip.style.display = "none";
          gDepts.selectAll(".dept").classed("active", x => x === d);
          zoomToFeature(d);
          renderDept(d);
        });

      // Rutas activas: arcos desde la sede hacia cada punto
      const hq = PROJECTS.find(p => p.flagship);
      if (hq) {
        const [hx, hy] = projection(hq.coords);
        gRoutes.selectAll("path")
          .data(PROJECTS.filter(p => p.route))
          .join("path")
          .attr("class", "route")
          .attr("d", d => {
            const [x, y] = projection(d.coords);
            const mx = (hx + x) / 2, my = (hy + y) / 2;
            const dx = x - hx, dy = y - hy;
            const bend = 0.18; // curvatura del arco
            return `M${hx},${hy} Q${mx - dy * bend},${my + dx * bend} ${x},${y}`;
          });
      }

      const cityG = gCities.selectAll("g")
        .data(PROJECTS)
        .join("g")
        .attr("class", d => "city-dot" + (d.flagship ? " flag" : ""))
        .style("cursor", "pointer")
        .on("click", (ev, d) => {
          ev.stopPropagation();
          zoomToPoint(d.coords, 5.5);
          renderCity(d);
        });
      cityG.append("circle").attr("class", "halo").attr("r", 7).attr("stroke", colorOf);
      cityG.append("circle").attr("class", "core").attr("r", d => d.flagship ? 7.5 : 5.5).attr("stroke", colorOf);
      cityG.append("text").attr("x", 10).attr("y", 4).text(d => d.city);
      placeCities();

      // Clic en el fondo del mapa = restablecer
      svg.on("click", () => { resetZoom(); overview(); });

      // Entrada suave del mapa completo (sin ocultar nunca los departamentos:
      // animar su opacidad chocaba con la transición CSS y quedaban invisibles)
      if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from(wrap, { autoAlpha: 0, y: 30, duration: .9, ease: "power2.out", clearProps: "all" });
      }

      buildFilters();
      overview();
    })
    .catch(err => {
      console.error("Mapa:", err);
      wrap.innerHTML = "<p style='padding:2rem;text-align:center'>No fue posible cargar el mapa. Recarga la página.</p>";
    });

  /* ---------- Filtros por área ---------- */
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
    const off = d => activeArea !== "all" && !d.flagship && !areasOf(d).includes(activeArea);
    gCities.selectAll(".city-dot").classed("dim", off);
    gRoutes.selectAll(".route").classed("dim", off);
    if (activeArea !== "all") {
      const deptsWith = new Set(PROJECTS.filter(p => areasOf(p).includes(activeArea)).map(p => p.dept));
      gDepts.selectAll(".dept.is-active").classed("dim", function () { return !deptsWith.has(this.dataset.code); });
    } else {
      gDepts.selectAll(".dept").classed("dim", false);
    }
  }

  /* ---------- Paneles de información ---------- */
  function animatePanel() {
    if (window.gsap) gsap.from(panel, { autoAlpha: 0, y: 14, duration: .45, ease: "power3.out" });
  }

  function overview() {
    panel.innerHTML = `
      <span class="mp-region">Colombia · Fase 1</span>
      <h3>Toca el mapa para explorar</h3>
      <p style="margin-top:.6rem">Haz clic en un <b>departamento</b> para acercarte y ver su territorio, o en un <b>punto</b> para conocer la ruta. Usa los filtros para ver dónde trabaja cada área.</p>
      <div class="mp-stats">
        <div class="mp-stat"><b>${ACTIVE.size}</b><span>departamentos con presencia</span></div>
        <div class="mp-stat"><b>130</b><span>municipios Fase 1</span></div>
        <div class="mp-stat"><b>${PROJECTS.filter(p => p.route).length}</b><span>rutas activas</span></div>
      </div>
      <div class="map-legend">
        <span><i class="lg-active"></i>Presencia activa</span>
        <span><i class="lg-inactive"></i>Expansión futura</span>
        <span><i class="lg-route"></i>Ruta desde la sede</span>
      </div>
      <p style="font-size:.78rem;color:var(--text-muted)">¿Quieres las cifras de núcleos por región? Visita la página <a href="nucleos.html" style="color:var(--teal-deep)">Núcleos de desarrollo</a>.</p>`;
    animatePanel();
  }

  function renderDept(f) {
    const code = f.properties.DPTO;
    const regionKey = DEPT_REGION[code] || "andina";
    const r = REGIONS[regionKey];
    const citiesIn = PROJECTS.filter(p => p.dept === code);
    const citiesRegion = PROJECTS.filter(p => p.region === regionKey);
    const activo = ACTIVE.has(code);
    panel.innerHTML = `
      <span class="mp-region">${activo ? "Presencia activa · " + r.name : "Expansión futura · " + r.name}</span>
      <h3>${DEPT_NAME[code] || code}</h3>
      ${activo
        ? `<p style="margin-top:.6rem">${r.desc}</p>
           ${citiesIn.length ? `<p style="font-size:.82rem;margin-top:.6rem"><b>Rutas en este departamento:</b></p>
           <div class="map-cities" style="border:none;padding-top:.3rem">${citiesIn.map(c => `<button class="map-city-chip" data-city="${c.city}">${c.city}</button>`).join("")}</div>` : ""}`
        : `<p style="margin-top:.6rem">Aún no tenemos presencia activa en ${DEPT_NAME[code] || "este departamento"}. Hace parte de la expansión futura de Vita Nova.</p>`}
      <div class="map-cities">${citiesRegion.map(c => `<button class="map-city-chip" data-city="${c.city}">${c.city}</button>`).join("")}
        <button class="map-city-chip" data-reset="1">⤺ Ver todo el mapa</button>
      </div>`;
    bindPanelChips();
    animatePanel();
  }

  function renderCity(p) {
    const r = REGIONS[p.region];
    panel.innerHTML = `
      <span class="mp-region">${r.name}${p.flagship ? " · Sede principal" : ""}</span>
      <h3>${p.city}</h3>
      <p style="margin-top:.6rem">${p.desc}</p>
      <div class="mp-areas">${areasOf(p).length
        ? areasOf(p).map(a => `<span class="mp-area" style="background:${AREAS[a].color}">${AREAS[a].label}</span>`).join("")
        : `<span class="mp-area" style="background:var(--teal-deep)">Ruta activa · Fase 1</span>`}</div>
      <div class="map-cities">
        ${PROJECTS.filter(x => x.region === p.region && x.city !== p.city).map(c => `<button class="map-city-chip" data-city="${c.city}">${c.city}</button>`).join("")}
        <button class="map-city-chip" data-reset="1">⤺ Ver todo el mapa</button>
      </div>`;
    bindPanelChips();
    animatePanel();
  }

  function bindPanelChips() {
    $$(".map-city-chip[data-city]", panel).forEach(ch => ch.addEventListener("click", () => {
      const p = PROJECTS.find(x => x.city === ch.dataset.city);
      if (p) { zoomToPoint(p.coords, 5.5); renderCity(p); }
    }));
    const rs = $("[data-reset]", panel);
    if (rs) rs.addEventListener("click", () => { resetZoom(); overview(); });
  }
})();
