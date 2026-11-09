/* Idioma de la página: ES (original) / EN. Traduce textos, atributos y el mapa; recuerda la elección. */
(function () {
  "use strict";
  var EN = {{EN_DICT}};
  var KEY = "vn_lang";
  var lang = "es";
  try { lang = localStorage.getItem(KEY) === "en" ? "en" : "es"; } catch (e) {}
  var norm = function (t) { return t.replace(/\s+/g, " ").trim(); };
  window.vnT = function (t) { return lang === "en" && EN[norm(t)] ? EN[norm(t)] : t; };
  var ATTRS = ["alt", "aria-label", "title", "placeholder", "data-label", "data-chapter"];
  var origText = new WeakMap(), origAttr = new WeakMap();

  function swapText(node) {
    if (!origText.has(node)) origText.set(node, node.nodeValue);
    var orig = origText.get(node), key = norm(orig);
    if (lang === "en" && EN[key]) {
      var lead = orig.match(/^\s*/)[0], trail = orig.match(/\s*$/)[0];
      node.nodeValue = lead + EN[key] + trail;
    } else node.nodeValue = orig;
  }
  function swapAttrs(el) {
    var store = origAttr.get(el);
    if (!store) { store = {}; origAttr.set(el, store); }
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      if (!(a in store)) store[a] = el.getAttribute(a);
      var orig = store[a];
      // las etiquetas "Nombre — lugar" del mapa se traducen por partes
      var val = orig;
      if (lang === "en") {
        val = EN[norm(orig)] || orig.split(" — ").map(function (p) { return EN[norm(p)] || p; }).join(" — ");
      }
      el.setAttribute(a, val);
    });
  }
  /* Titulares animados palabra por palabra (.word-reveal): se agrupan las palabras de cada
     contenedor en una frase, se traduce la frase completa y se vuelven a crear las palabras. */
  var runs = null;
  function collectRuns() {
    runs = [];
    document.querySelectorAll(".word-reveal").forEach(function (root) {
      [root].concat([].slice.call(root.querySelectorAll("*"))).forEach(function (box) {
        var cur = [];
        var flush = function () {
          var words = cur.filter(function (n) { return n.nodeType === 1; });
          if (words.length) runs.push({ box: box, es: cur.slice(), text: norm(cur.map(function (n) { return n.textContent; }).join("")), en: null });
          cur = [];
        };
        [].slice.call(box.childNodes).forEach(function (n) {
          var isWord = n.nodeType === 1 && n.classList.contains("w");
          var isGap = n.nodeType === 3 && !n.nodeValue.trim();
          if (isWord || (isGap && cur.length)) cur.push(n); else flush();
        });
        flush();
      });
    });
  }
  function swapRuns() {
    if (!runs) collectRuns();
    runs.forEach(function (r) {
      var tr = EN[r.text];
      if (!tr) return;
      if (!r.en) {
        r.en = [];
        var d = 0;
        tr.split(" ").forEach(function (word, i) {
          if (i) r.en.push(document.createTextNode(" "));
          var sp = document.createElement("span");
          sp.className = "w"; sp.style.setProperty("--d", (d++ * 55) + "ms"); sp.textContent = word;
          r.en.push(sp);
        });
        var last = r.es[r.es.length - 1];
        if (last && last.nodeType === 3) r.en.push(document.createTextNode(" "));
      }
      var show = lang === "en" ? r.en : r.es, hide = lang === "en" ? r.es : r.en;
      var anchor = hide[0];
      if (!anchor || !anchor.parentNode) return;
      show.forEach(function (n) { r.box.insertBefore(n, anchor); });
      hide.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    });
  }
  function apply() {
    document.documentElement.lang = lang;
    swapRuns();
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode && n.parentNode.nodeName;
        if (n.parentNode && n.parentNode.closest && n.parentNode.closest(".word-reveal, [data-dyn]")) return NodeFilter.FILTER_REJECT;
        return (p === "SCRIPT" || p === "STYLE" || !n.nodeValue.trim()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach(swapText);
    document.querySelectorAll("[alt],[aria-label],[title],[placeholder],[data-label],[data-chapter]").forEach(swapAttrs);
    var md = document.querySelector('meta[name="description"]');
    if (md) { if (!md.dataset.es) md.dataset.es = md.content; md.content = lang === "en" ? (EN[md.dataset.es] || md.dataset.es) : md.dataset.es; }
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.textContent = lang === "en" ? "ES" : "EN";
      b.title = lang === "en" ? "Español" : "English";
      b.setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    });
    // el panel del mapa, el botón de tema y la barra se vuelven a pintar en el idioma actual
    if (window.vnMapRender) window.vnMapRender();
    if (window.vnRefreshUI) window.vnRefreshUI();
    var running = document.getElementById("running");
    var vis = [].slice.call(document.querySelectorAll("[data-chapter]")).filter(function (c) { return c.getBoundingClientRect().top <= innerHeight * 0.3; }).pop();
    if (running && vis) running.textContent = vis.getAttribute("data-chapter");
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        lang = lang === "en" ? "es" : "en";
        try { localStorage.setItem(KEY, lang); } catch (e) {}
        apply();
      });
    });
    if (lang === "en") apply();
  });
})();
