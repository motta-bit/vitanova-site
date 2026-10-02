/* ============================================================
   GALERÍA — grid, filtros y lightbox (fotos en assets/img/galeria)
   Usa window.VN_GALERIA = { total, pro, comunidad } (galeria-fotos.js)
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const grid = $("#gallery-grid");
  if (!grid) return;

  const G = window.VN_GALERIA || { total: 40, pro: 20, comunidad: 20 };
  let html = "";
  for (let i = 1; i <= G.total; i++) {
    const n = String(i).padStart(2, "0");
    const cat = i <= G.pro ? "pro" : "comunidad";
    html += `<figure class="gal-item" data-cat="${cat}" role="button" tabindex="0" aria-label="Ver foto ${i}"><img src="assets/img/galeria/g_${n}.jpg" alt="Vita Nova — fotografía ${i}" loading="lazy"></figure>`;
  }
  grid.innerHTML = html;

  const galImgs = $$(".gal-item", grid);
  const lb = $("#lightbox"), lbImg = $(".lightbox-img");
  let lbIndex = 0;

  function visibleItems() { return galImgs.filter(g => g.style.display !== "none"); }
  function openLb(item) {
    const v = visibleItems();
    lbIndex = v.indexOf(item);
    lbImg.src = $("img", item).src;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function moveLb(d) {
    const v = visibleItems();
    lbIndex = (lbIndex + d + v.length) % v.length;
    lbImg.src = $("img", v[lbIndex]).src;
  }
  function closeLb() { lb.classList.remove("active"); document.body.style.overflow = ""; }

  galImgs.forEach(g => {
    g.addEventListener("click", () => openLb(g));
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(g); } });
  });
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
    $$(".gallery-tab").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
    t.classList.add("active");
    t.setAttribute("aria-selected", "true");
    const cat = t.dataset.cat;
    galImgs.forEach(g => { g.style.display = (cat === "all" || g.dataset.cat === cat) ? "" : "none"; });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));
})();
