/* Prosperity Financial Academy - LP curso de investimentos para iniciantes - v2 */
(function () {
  "use strict";

  // Link do checkout Hotmart: trocar SO aqui quando existir (hoje placeholder).
  var CHECKOUT_URL = "#checkout";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- CTAs: destino unico + evento de clique */
  document.querySelectorAll("a[data-cta]").forEach(function (a) {
    a.setAttribute("href", CHECKOUT_URL);
    a.addEventListener("click", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "cta_click", cta_local: a.getAttribute("data-cta") });
    });
  });

  /* ---------- nav solida ao rolar */
  var nav = document.getElementById("topo");
  function navSolida() { nav.classList.toggle("is-solid", window.scrollY > 40); }

  /* ---------- contadores (so numeros reais da copy: 13, 53, 7, 1) */
  function conta(el) {
    var fim = parseInt(el.getAttribute("data-count"), 10);
    if (reduz || !fim || fim < 2) { el.textContent = fim; return; }
    var t0 = null, dur = 1500;
    el.textContent = "0";
    function passo(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(2, -10 * k);
      el.textContent = Math.round(fim * (k === 1 ? 1 : e));
      if (k < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  /* ---------- reveal com stagger por grupo (irmaos .rv) */
  var rvs = [].slice.call(document.querySelectorAll(".rv"));
  rvs.forEach(function (el) {
    var irmaos = [].filter.call(el.parentNode.children, function (c) { return c.classList.contains("rv"); });
    var i = irmaos.indexOf(el);
    var passo = el.closest(".hero") ? 60 : 90;
    el.style.setProperty("--d", Math.min(i, 8) * passo + "ms");
  });
  var contadores = [].slice.call(document.querySelectorAll("[data-count]"));

  if (reduz || !("IntersectionObserver" in window)) {
    rvs.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rvs.forEach(function (el) { io.observe(el); });

    var ioc = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        conta(en.target);
        ioc.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { ioc.observe(el); });
  }

  /* ---------- barras ligadas ao scroll: progresso (aprender) e linha do tempo (como funciona) */
  var barra = document.querySelector(".progresso__barra");
  var secAprender = document.getElementById("aprender");
  var passos = document.querySelector(".passos");
  function fracao(el, ini, fim) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    var a = vh * ini, b = vh * fim;
    return Math.max(0, Math.min(1, (a - r.top) / (r.height + a - b)));
  }
  function barras() {
    if (barra && secAprender) barra.style.setProperty("--p", fracao(secAprender, 0.85, 0.35).toFixed(3));
    if (passos) passos.style.setProperty("--t", fracao(passos, 0.8, 0.45).toFixed(3));
  }

  /* ---------- parallax leve (cena do problema): deslocamento em px proporcional a posicao da secao na tela */
  var paralaxe = [].slice.call(document.querySelectorAll("[data-parallax]"));
  function parallax() {
    var vh = window.innerHeight;
    paralaxe.forEach(function (el) {
      var r = el.closest("section").getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var k = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      k = Math.max(-1, Math.min(1, k));
      el.style.setProperty("--py", (k * parseFloat(el.getAttribute("data-parallax"))).toFixed(1) + "px");
    });
  }

  var pend = false;
  function onScroll() {
    if (pend) return;
    pend = true;
    requestAnimationFrame(function () { pend = false; navSolida(); if (!reduz) { barras(); parallax(); } });
  }
  navSolida();
  if (!reduz) { barras(); parallax(); }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
