/* ============================================================
   ANIM — Animaciones de scroll compartidas (GSAP ScrollTrigger)
   Cada bloque se activa solo si sus elementos existen en la página.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.registerPlugin(ScrollTrigger);

  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="word"><i>${w}</i></span>`).join(" ");
    return $$(".word>i", el);
  }

  /* ---------- Preloader (solo si existe) ---------- */
  const pre = $("#preloader");
  if (pre) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      pre.classList.add("done");
      heroIntro();
    };
    addEventListener("load", finish);
    setTimeout(finish, 2600);
  } else {
    heroIntro();
  }

  function heroIntro() {
    const h1 = $(".page-hero h1, #inicio h1");
    if (!h1 || reduced) return;
    const inner = splitWords(h1);
    h1.classList.add("wr");
    const tl = gsap.timeline();
    tl.to(inner, { y: 0, duration: 1.05, stagger: 0.045, ease: "power4.out" }, 0.15);
    if ($(".hero-badge")) tl.from(".hero-badge", { y: 18, autoAlpha: 0, duration: .7 }, 0.1);
    if ($(".hero-tagline")) tl.from(".hero-tagline", { y: 24, autoAlpha: 0, duration: .8 }, 0.7);
    if ($("#inicio .btn-group")) tl.from("#inicio .btn-group", { y: 24, autoAlpha: 0, duration: .8 }, 0.9);
    if ($(".hero-visual")) tl.from(".hero-visual", { scale: .88, autoAlpha: 0, duration: 1.2 }, 0.45);
    if ($(".hero-stat")) tl.from(".hero-stat", { y: 26, autoAlpha: 0, stagger: .15, duration: .7, ease: "back.out(1.6)" }, 1.1);
    if ($(".hero-scroll")) tl.from(".hero-scroll", { autoAlpha: 0, duration: .8 }, 1.4);
  }

  if (reduced) {
    $$(".fade-up").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    $$("[data-count]").forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
    $$(".reveal-img").forEach(el => { el.style.clipPath = "none"; });
    return;
  }

  /* ---------- Parallax hero (index) ---------- */
  if ($("#inicio")) {
    gsap.to(".hb-1", { yPercent: 26, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.to(".hb-2", { yPercent: -20, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.to(".hero-inner", { yPercent: -12, autoAlpha: .25, scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom 30%", scrub: true } });
  }

  /* ---------- Manifiesto scrub ---------- */
  const man = $(".manifiesto-text");
  if (man) {
    const words = $$(".mw", man);
    ScrollTrigger.create({
      trigger: "#manifiesto", start: "top 70%", end: "bottom 60%", scrub: true,
      onUpdate: self => {
        const n = Math.floor(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle("lit", i <= n));
      }
    });
  }

  /* ---------- Reveals genéricos ---------- */
  $$(".fade-up").forEach(el => {
    gsap.to(el, {
      y: 0, autoAlpha: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      delay: parseFloat(el.dataset.delay || 0)
    });
  });
  $$(".reveal-img").forEach(el => {
    gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: 1.25, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 84%" } });
  });
  $$("h2[data-wr]").forEach(h => {
    const inner = splitWords(h);
    h.classList.add("wr");
    gsap.to(inner, { y: 0, duration: .9, stagger: .04, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 86%" } });
  });
  $$("[data-count]").forEach(el => {
    const end = parseFloat(el.dataset.count);
    const suf = el.dataset.suffix || "";
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 2, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: () => { el.textContent = Math.round(obj.v) + suf; }
    });
  });

  /* ---------- Burbujas flotantes con fotos ---------- */
  $$(".bubble").forEach((b, i) => {
    gsap.to(b, {
      y: "random(-26, 26)", x: "random(-16, 16)", rotation: "random(-6, 6)",
      duration: "random(3.5, 6)", ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * .25
    });
  });
  const bubbleWrap = $(".bubbles-field");
  if (bubbleWrap) {
    gsap.from(".bubble", {
      scale: 0, autoAlpha: 0, stagger: .09, duration: .9, ease: "back.out(1.7)",
      scrollTrigger: { trigger: bubbleWrap, start: "top 80%" }
    });
  }

  /* ---------- Programas: scroll horizontal anclado ---------- */
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
  }

  /* ---------- Marquee ---------- */
  const mq = $(".marquee");
  if (mq) {
    mq.innerHTML += mq.innerHTML;
    gsap.to(mq, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
  }

  addEventListener("load", () => ScrollTrigger.refresh());
})();
