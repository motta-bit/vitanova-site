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
  apiKey: "AIzaSyD9afswGPIMS1P7MrMu-yEjDgMlYWVEGvI",
  authDomain: "vitanovacolombia.firebaseapp.com",
  projectId: "vitanovacolombia",
  storageBucket: "vitanovacolombia.firebasestorage.app",
  messagingSenderId: "332759410490",
  appId: "1:332759410490:web:5f8d1726f30b9c3fbed203",
  measurementId: "G-JWTKJ85N43"
};
// Correo del administrador: puede exportar los registros a CSV
window.VN_ADMIN_EMAILS = ["admin@vitanovacolombia.org", "asovitanova@gmail.com", "cdparravargas@gmail.com"];
