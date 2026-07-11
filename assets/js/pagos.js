/* ============================================================
   PAGOS Y DONACIONES — Wompi (Bancolombia) + recibo
   - Con VN_PAY.wompiLink configurado: redirige al checkout oficial
     de Wompi y al volver verifica la transacción con la API pública.
   - Sin configurar: modo demostración con simulación de éxito/fallo.
   - Recibo: solo se genera cuando el pago es EXITOSO. Si falla,
     se pide reintentar o contactar servicio al cliente (WhatsApp).
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const form = $("#donar-form");
  if (!form) return;

  const PAY = window.VN_PAY || {};
  const REAL = !!PAY.wompiLink;
  const fmt = n => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  /* ---------- Selector de monto ---------- */
  let monto = 50000;
  $$(".monto-opt").forEach(b => b.addEventListener("click", () => {
    $$(".monto-opt").forEach(x => x.classList.toggle("active", x === b));
    if (b.dataset.monto === "otro") {
      $("#monto-otro-wrap").style.display = "";
      monto = +$("#monto-otro").value || 0;
    } else {
      $("#monto-otro-wrap").style.display = "none";
      monto = +b.dataset.monto;
    }
    $("#donar-btn-label").textContent = monto > 0 ? `Donar ${fmt(monto)}` : "Donar";
  }));
  $("#monto-otro").addEventListener("input", e => {
    monto = +e.target.value || 0;
    $("#donar-btn-label").textContent = monto > 0 ? `Donar ${fmt(monto)}` : "Donar";
  });

  if (!REAL) $("#pay-demo-note").style.display = "";

  /* ---------- Envío ---------- */
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (monto < 1000) { showFail("El monto mínimo de donación es $1.000 COP."); return; }
    const donante = {
      nombre: $("#d-nombre").value.trim(),
      email: $("#d-email").value.trim(),
      tipo: $("#d-tipo").value
    };
    if (!donante.nombre || !donante.email) { showFail("Completa tu nombre y correo para emitir el recibo."); return; }
    sessionStorage.setItem("vn_don_pend", JSON.stringify({ ...donante, monto, t: Date.now() }));

    if (REAL) {
      // Checkout oficial de Wompi (el link redirige de vuelta con ?id=TRANSACCION)
      location.href = PAY.wompiLink;
    } else {
      demoCheckout(donante);
    }
  });

  /* ---------- Modo demostración ---------- */
  function demoCheckout(donante) {
    $("#pay-sim").classList.add("active");
    document.body.style.overflow = "hidden";
    $("#sim-monto").textContent = fmt(monto);
    $("#sim-ok").onclick = () => {
      closeSim();
      settle({ status: "APPROVED", id: "DEMO-" + Date.now(), amount_in_cents: monto * 100, payment_method_type: "SIMULADO", customer_email: donante.email, finalized_at: new Date().toISOString() }, donante);
    };
    $("#sim-fail").onclick = () => {
      closeSim();
      settle({ status: "DECLINED" }, donante);
    };
  }
  function closeSim() { $("#pay-sim").classList.remove("active"); document.body.style.overflow = ""; }
  $("#pay-sim") && $("#pay-sim").addEventListener("click", e => { if (e.target.id === "pay-sim") closeSim(); });

  /* ---------- Verificación al volver de Wompi ---------- */
  const txId = new URLSearchParams(location.search).get("id");
  if (txId && !txId.startsWith("DEMO")) {
    verifyWompi(txId);
  }
  async function verifyWompi(id) {
    const box = $("#pay-status");
    box.className = "pay-status wait";
    box.innerHTML = "⏳ Verificando el estado de tu donación…";
    box.style.display = "block";
    try {
      let tx = null;
      for (let i = 0; i < 6; i++) {
        const res = await fetch("https://production.wompi.co/v1/transactions/" + encodeURIComponent(id));
        if (res.ok) {
          tx = (await res.json()).data;
          if (tx.status !== "PENDING") break;
        }
        await new Promise(r => setTimeout(r, 2500));
      }
      if (!tx) throw new Error("No se encontró la transacción.");
      const donante = JSON.parse(sessionStorage.getItem("vn_don_pend") || "{}");
      settle(tx, donante);
    } catch (err) {
      showFail("No pudimos verificar la transacción. Si el dinero fue debitado, contáctanos y te enviaremos tu recibo.");
    }
    history.replaceState(null, "", location.pathname);
  }

  /* ---------- Resultado ---------- */
  async function settle(tx, donante) {
    if (tx.status === "APPROVED") {
      const recibo = {
        numero: "VN-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 900000) + 100000),
        fecha: new Date().toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" }),
        nombre: donante.nombre || "Donante",
        email: donante.email || tx.customer_email || "",
        tipo: donante.tipo || "Persona natural",
        monto: (tx.amount_in_cents || 0) / 100,
        metodo: tx.payment_method_type || "—",
        transaccion: tx.id || "—"
      };
      try { if (window.VN_BACKEND && window.VN_BACKEND.donar) await window.VN_BACKEND.donar(recibo); } catch (e) { console.warn(e); }
      sessionStorage.removeItem("vn_don_pend");
      showReceipt(recibo);
    } else {
      showFail();
    }
  }

  function showFail(customMsg) {
    const box = $("#pay-status");
    box.className = "pay-status err";
    box.style.display = "block";
    box.innerHTML = `
      <b>❌ El pago no pudo completarse.</b>
      <p>${customMsg || "Tu donación no fue procesada. Por favor reintenta el proceso; si el problema continúa, comunícate con nuestro servicio al cliente."}</p>
      <div class="btn-group" style="margin-top:.8rem">
        <button class="btn-primary" id="retry-pay" style="padding:10px 22px;font-size:.83rem">Reintentar</button>
        <a class="btn-secondary" style="padding:10px 22px;font-size:.83rem" target="_blank" rel="noopener"
           href="https://wa.me/${window.VN_WHATSAPP}?text=${encodeURIComponent("Hola, tuve un problema con mi donación en el sitio web y necesito ayuda.")}">Servicio al cliente (WhatsApp)</a>
      </div>`;
    $("#retry-pay").onclick = () => { box.style.display = "none"; form.scrollIntoView({ behavior: "smooth", block: "center" }); };
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showReceipt(r) {
    const modal = $("#recibo-modal");
    $("#recibo-body").innerHTML = `
      <div class="recibo" id="recibo-print">
        <div class="recibo-head">
          <img src="assets/img/img_00.jpg" alt="">
          <div>
            <b>${(window.VN_PAY || {}).nombreFundacion || "Asociación Vita Nova Colombia"}</b>
            <span>${(window.VN_PAY || {}).nit ? "NIT " + window.VN_PAY.nit + " · " : ""}${(window.VN_PAY || {}).ciudad || "Medellín, Colombia"}</span>
          </div>
        </div>
        <h4>Recibo de donación</h4>
        <table>
          <tr><td>N° de recibo</td><td>${r.numero}</td></tr>
          <tr><td>Fecha</td><td>${r.fecha}</td></tr>
          <tr><td>Donante</td><td>${r.nombre} (${r.tipo})</td></tr>
          <tr><td>Correo</td><td>${r.email}</td></tr>
          <tr><td>Método de pago</td><td>${r.metodo}</td></tr>
          <tr><td>Transacción</td><td>${r.transaccion}</td></tr>
          <tr class="total"><td>Monto donado</td><td>${fmt(r.monto)}</td></tr>
        </table>
        <p class="recibo-gracias">¡Gracias! Tu aporte impulsa la inclusión, la formación y la tecnología para la paz en Colombia. 💚</p>
      </div>`;
    window.VN_openModal(modal);
    $("#recibo-print-btn").onclick = () => window.print();
  }
  const reciboModal = $("#recibo-modal");
  if (reciboModal) window.VN_bindModal(reciboModal);
})();
