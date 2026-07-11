/* ============================================================
   AUTENTICACIÓN Y BASE DE DATOS — Vita Nova
   Firebase (Auth + Firestore) con modo demo (localStorage)
   ============================================================ */
(function () {
  "use strict";

  const cfg = window.FIREBASE_CONFIG || {};
  const DEMO = !cfg.apiKey || cfg.apiKey === "DEMO";

  const state = { user: null, ready: false };
  window.VN_AUTH = state;

  // ---------- Utilidades ----------
  const $ = (s, r) => (r || document).querySelector(s);
  const toast = (msg) => {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 3400);
  };
  window.VN_TOAST = toast;

  function emitAuthChange() {
    document.dispatchEvent(new CustomEvent("vn:auth", { detail: state.user }));
  }

  // ============================================================
  // BACKEND DEMO (localStorage)
  // ============================================================
  const LS_USERS = "vn_users";
  const LS_SESSION = "vn_session";
  const LS_INSCRIPCIONES = "vn_inscripciones";

  const lsGet = (k, d) => {
    try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; }
  };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  const demoBackend = {
    async register(data, password) {
      const users = lsGet(LS_USERS, []);
      if (users.some(u => u.email === data.email)) throw new Error("Este correo ya está registrado.");
      const user = { ...data, uid: "demo_" + Date.now(), passHash: await sha256(password), createdAt: new Date().toISOString() };
      users.push(user);
      lsSet(LS_USERS, users);
      lsSet(LS_SESSION, user.uid);
      return user;
    },
    async login(email, password) {
      const users = lsGet(LS_USERS, []);
      const hash = await sha256(password);
      const user = users.find(u => u.email === email && u.passHash === hash);
      if (!user) throw new Error("Correo o contraseña incorrectos.");
      lsSet(LS_SESSION, user.uid);
      return user;
    },
    async logout() { localStorage.removeItem(LS_SESSION); },
    async currentUser() {
      const uid = lsGet(LS_SESSION, null);
      if (!uid) return null;
      return lsGet(LS_USERS, []).find(u => u.uid === uid) || null;
    },
    async inscribir(eventoId, user, extra) {
      const ins = lsGet(LS_INSCRIPCIONES, []);
      if (ins.some(i => i.eventoId === eventoId && i.uid === user.uid)) throw new Error("Ya estás inscrito en este evento.");
      ins.push({ eventoId, uid: user.uid, nombre: user.nombre, email: user.email, tipo: user.tipo, organizacion: user.organizacion || "", telefono: user.telefono, ciudad: user.ciudad, ...extra, fecha: new Date().toISOString() });
      lsSet(LS_INSCRIPCIONES, ins);
    },
    async exportar() {
      return { usuarios: lsGet(LS_USERS, []).map(({ passHash, ...u }) => u), inscripciones: lsGet(LS_INSCRIPCIONES, []) };
    }
  };

  // ============================================================
  // BACKEND FIREBASE
  // ============================================================
  let fb = null;
  const firebaseBackend = {
    async init() {
      const [{ initializeApp }, authMod, fsMod] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
      ]);
      const app = initializeApp(cfg);
      fb = { auth: authMod.getAuth(app), db: fsMod.getFirestore(app), authMod, fsMod };
      return new Promise(resolve => {
        authMod.onAuthStateChanged(fb.auth, async fu => {
          if (fu) {
            const snap = await fsMod.getDoc(fsMod.doc(fb.db, "usuarios", fu.uid));
            state.user = snap.exists() ? { uid: fu.uid, ...snap.data() } : { uid: fu.uid, email: fu.email, nombre: fu.email };
          } else state.user = null;
          emitAuthChange();
          resolve();
        });
      });
    },
    async register(data, password) {
      const { authMod, fsMod } = fb;
      const cred = await authMod.createUserWithEmailAndPassword(fb.auth, data.email, password);
      const user = { ...data, uid: cred.user.uid, createdAt: new Date().toISOString() };
      await fsMod.setDoc(fsMod.doc(fb.db, "usuarios", cred.user.uid), user);
      return user;
    },
    async login(email, password) {
      const { authMod, fsMod } = fb;
      const cred = await authMod.signInWithEmailAndPassword(fb.auth, email, password);
      const snap = await fsMod.getDoc(fsMod.doc(fb.db, "usuarios", cred.user.uid));
      return snap.exists() ? { uid: cred.user.uid, ...snap.data() } : { uid: cred.user.uid, email };
    },
    async logout() { await fb.authMod.signOut(fb.auth); },
    async currentUser() { return state.user; },
    async inscribir(eventoId, user, extra) {
      const { fsMod } = fb;
      const id = eventoId + "_" + user.uid;
      const ref = fsMod.doc(fb.db, "inscripciones", id);
      const prev = await fsMod.getDoc(ref);
      if (prev.exists()) throw new Error("Ya estás inscrito en este evento.");
      await fsMod.setDoc(ref, { eventoId, uid: user.uid, nombre: user.nombre, email: user.email, tipo: user.tipo, organizacion: user.organizacion || "", telefono: user.telefono || "", ciudad: user.ciudad || "", ...extra, fecha: new Date().toISOString() });
    },
    async exportar() {
      const { fsMod } = fb;
      const out = { usuarios: [], inscripciones: [] };
      (await fsMod.getDocs(fsMod.collection(fb.db, "usuarios"))).forEach(d => out.usuarios.push(d.data()));
      (await fsMod.getDocs(fsMod.collection(fb.db, "inscripciones"))).forEach(d => out.inscripciones.push(d.data()));
      return out;
    }
  };

  const backend = DEMO ? demoBackend : firebaseBackend;
  window.VN_BACKEND = backend;
  window.VN_DEMO = DEMO;

  // ---------- API pública ----------
  window.VN_registrar = async function (data, password) {
    const user = await backend.register(data, password);
    state.user = user;
    emitAuthChange();
    toast("¡Bienvenido a Vita Nova, " + (user.nombre || "").split(" ")[0] + "!");
    return user;
  };
  window.VN_login = async function (email, password) {
    const user = await backend.login(email, password);
    state.user = user;
    emitAuthChange();
    toast("Sesión iniciada. ¡Hola de nuevo!");
    return user;
  };
  window.VN_logout = async function () {
    await backend.logout();
    state.user = null;
    emitAuthChange();
    toast("Sesión cerrada.");
  };
  window.VN_inscribir = async function (eventoId, extra) {
    if (!state.user) throw new Error("Inicia sesión para inscribirte.");
    await backend.inscribir(eventoId, state.user, extra || {});
    toast("¡Inscripción confirmada! Te contactaremos por correo.");
  };
  window.VN_exportCSV = async function () {
    const { usuarios, inscripciones } = await backend.exportar();
    const toCSV = rows => {
      if (!rows.length) return "";
      const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
      const esc = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
      return cols.join(",") + "\n" + rows.map(r => cols.map(c => esc(r[c])).join(",")).join("\n");
    };
    const dl = (name, text) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" }));
      a.download = name;
      a.click();
    };
    dl("vitanova_usuarios.csv", toCSV(usuarios));
    dl("vitanova_inscripciones.csv", toCSV(inscripciones));
    toast("Exportado: usuarios e inscripciones (CSV).");
  };

  // ---------- Inicio ----------
  (async function boot() {
    try {
      if (DEMO) {
        state.user = await demoBackend.currentUser();
      } else {
        await firebaseBackend.init();
      }
    } catch (e) {
      console.warn("Auth init:", e);
    }
    state.ready = true;
    emitAuthChange();
  })();
})();
