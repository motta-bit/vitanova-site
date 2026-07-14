// ============================================================
// CONFIGURACIÓN DE FIREBASE — Vita Nova Colombia
// ============================================================
// Para activar la base de datos real:
// 1. Ve a https://console.firebase.google.com y crea un proyecto "vitanova"
// 2. Agrega una "Web App" y copia el objeto firebaseConfig aquí
// 3. En Authentication habilita "Correo electrónico/contraseña"
// 4. En Firestore Database crea la base en modo producción
// 5. Sube este archivo actualizado al repositorio
//
// Mientras los valores sean "DEMO", el sitio funciona en modo
// demostración guardando los datos en el navegador (localStorage).
// ============================================================
window.FIREBASE_CONFIG = {
  apiKey: "DEMO",
  authDomain: "DEMO",
  projectId: "DEMO",
  storageBucket: "DEMO",
  messagingSenderId: "DEMO",
  appId: "DEMO"
};
// Correo del administrador: puede exportar los registros a CSV
window.VN_ADMIN_EMAILS = ["admin@vitanovacolombia.org", "asovitanova@gmail.com", "cdparravargas@gmail.com"];
