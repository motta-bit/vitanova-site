/* ============================================================
   EVENTOS — listado e inscripción (requiere sesión)
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const grid = $("#eventos-grid");
  if (!grid) return;

  const evModal = $("#evento-modal");
  window.VN_bindModal(evModal);

  const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  window.VN_EVENTS.forEach(ev => {
    const d = new Date(ev.date + "T12:00:00");
    const card = document.createElement("article");
    card.className = "evento-card fade-up";
    card.innerHTML = `
      <div class="evento-date"><b>${d.getDate()}</b><span>${months[d.getMonth()]} ${d.getFullYear()}</span></div>
      <span class="ev-mode">${ev.mode}</span>
      <h3>${ev.title}</h3>
      <div class="ev-meta"><span>📍 ${ev.place}</span><span>👥 ${ev.cupos} cupos disponibles</span></div>
      <p>${ev.desc}</p>
      <button class="btn-primary" data-ev="${ev.id}">Inscribirme</button>`;
    grid.appendChild(card);
    $("[data-ev]", card).addEventListener("click", () => start(ev));
  });

  function start(ev) {
    window.VN_requireAuth(() => {
      $("#ev-title").textContent = ev.title;
      $("#ev-meta").textContent = ev.dateLabel + " · " + ev.place;
      evModal.dataset.evId = ev.id;
      const u = window.VN_AUTH.user;
      $("#ev-user").innerHTML = `Inscripción como: <b>${u.nombre}</b> (${u.tipo}${u.organizacion ? " — " + u.organizacion : ""})`;
      window.VN_openModal(evModal);
    });
  }

  $("#evento-form").addEventListener("submit", async e => {
    e.preventDefault();
    const msg = $("#ev-msg");
    msg.className = "form-msg";
    try {
      await window.VN_inscribir(evModal.dataset.evId, {
        asistentes: +$("#ev-cant").value || 1,
        comentario: $("#ev-com").value.trim()
      });
      window.VN_closeModal(evModal);
      $("#evento-form").reset();
    } catch (err) {
      msg.textContent = window.VN_friendlyError(err);
      msg.className = "form-msg err";
    }
  });
})();
