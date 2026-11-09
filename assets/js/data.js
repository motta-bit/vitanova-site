// ============================================================
// DATOS — Vita Nova Colombia
// ============================================================

window.VN_WHATSAPP = "573009802268"; // botón flotante y servicio al cliente

// ---------- Redes sociales ----------
// Deja "" en las que aún no existan y no se mostrarán.
window.VN_SOCIAL = {
  youtube:   "https://www.youtube.com/@vitanovacolombia",
  instagram: "https://www.instagram.com/vitanovacolombia",
  facebook:  "https://www.facebook.com/profile.php?id=61594821462218",
  tiktok:    "",
  linkedin:  ""
};

// ---------- Donaciones ----------
// Cuando exista el link de pago de Wompi (https://comercios.wompi.co → Links de pago),
// pégalo en wompiLink y el botón "Quiero donar" irá directo a la pasarela.
// Mientras esté vacío, el botón abre WhatsApp.
window.VN_PAY = { wompiLink: "" };

// Módulos del modelo. Son los mismos que muestra el mapa en cada territorio.
window.VN_MODULOS = {
  caracterizacion: "Caracterización y acompañamiento",
  formacion:       "Formación inclusiva",
  empleabilidad:   "Empleabilidad",
  nucleos:         "Núcleos de desarrollo",
  tecnologia:      "Tecnología para la Paz",
  sensibilizacion: "Sensibilización"
};

// Territorios del mapa interactivo de la página principal.
// estado: "sede" | "activo" (núcleo activo) | "creacion" (núcleo en creación) | "ruta" (ruta activa)
// lugar: [lon, lat] del punto; se proyecta al mapa en la página.
window.VN_TERRITORIOS = [
  { dpto: "05", nombre: "Antioquia",       lugar: "Medellín · sede",             coords: [-75.574, 6.244],  estado: "sede",
    modulos: ["caracterizacion","nucleos","sensibilizacion","formacion","empleabilidad","tecnologia"],
    texto: "Sede institucional en Medellín. Desde aquí salen las rutas hacia cada territorio y se coordinan todos los módulos." },
  { dpto: "44", nombre: "La Guajira",      lugar: "Maicao y Riohacha",           coords: [-72.24, 11.38],   estado: "activo",
    modulos: ["caracterizacion","nucleos","sensibilizacion","formacion"],
    texto: "Zona fronteriza y de alta diversidad étnica: caracterización psicosocial y núcleos de desarrollo con comunidades wayuu y población migrante." },
  { dpto: "47", nombre: "Magdalena",       lugar: "Santa Marta",                 coords: [-74.199, 11.241], estado: "creacion",
    modulos: ["caracterizacion","nucleos","sensibilizacion","formacion"],
    texto: "Turismo accesible y formación gastronómica y de servicios para poblaciones vulnerables." },
  { dpto: "08", nombre: "Atlántico",       lugar: "Barranquilla",                coords: [-74.796, 10.964], estado: "creacion",
    modulos: ["caracterizacion","nucleos","sensibilizacion","empleabilidad","tecnologia"],
    texto: "Modelo productivo portuario y logístico inclusivo, con tecnología y accesibilidad." },
  { dpto: "13", nombre: "Bolívar",         lugar: "Magangué",                    coords: [-74.754, 9.24],   estado: "activo",
    modulos: ["caracterizacion","nucleos","sensibilizacion","formacion","tecnologia"],
    texto: "Presencia en el Caribe interior, sobre el río Magdalena, con procesos de inclusión social y formación técnica." },
  { dpto: "20", nombre: "Cesar",           lugar: "Valledupar",                  coords: [-73.253, 10.464], estado: "creacion",
    modulos: ["caracterizacion","nucleos","sensibilizacion"],
    texto: "Núcleo en creación: caracterización y acompañamiento de familias, y sensibilización." },
  { dpto: "70", nombre: "Sucre",           lugar: "Sincelejo",                   coords: [-75.398, 9.305],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion"],
    texto: "Ruta activa: núcleos de desarrollo, caracterización y acompañamiento de familias, y sensibilización." },
  { dpto: "23", nombre: "Córdoba",         lugar: "Montería",                    coords: [-75.881, 8.748],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion"],
    texto: "Ruta activa: núcleos de desarrollo, caracterización y acompañamiento de familias, y sensibilización." },
  { dpto: "25", nombre: "Cundinamarca",    lugar: "Anapoima",                    coords: [-74.536, 4.55],   estado: "activo",
    modulos: ["caracterizacion","nucleos","sensibilizacion","formacion"],
    texto: "Formación y acompañamiento comunitario en el centro del país, punto de entrada de la ruta del proyecto." },
  { dpto: "11", nombre: "Bogotá D.C.",     lugar: "Bogotá",                      coords: [-74.072, 4.711],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion"],
    texto: "Ruta activa: núcleos de desarrollo, caracterización y acompañamiento de familias, y sensibilización." },
  { dpto: "73", nombre: "Tolima",          lugar: "Ibagué",                      coords: [-75.232, 4.438],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion"],
    texto: "Ruta activa: núcleos de desarrollo, caracterización y acompañamiento de familias, y sensibilización." },
  { dpto: "41", nombre: "Huila",           lugar: "Neiva",                       coords: [-75.282, 2.927],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion"],
    texto: "Ruta activa: núcleos de desarrollo, caracterización y acompañamiento de familias, y sensibilización." },
  { dpto: "76", nombre: "Valle del Cauca", lugar: "Cali",                        coords: [-76.532, 3.452],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion"],
    texto: "Ruta activa: núcleos de desarrollo, caracterización y acompañamiento de familias, y sensibilización." },
  { dpto: "52", nombre: "Nariño",          lugar: "Pasto",                       coords: [-77.277, 1.209],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion","formacion"],
    texto: "Bachillerato inclusivo por ciclos y núcleos de economía solidaria andino-pacífica." },
  { dpto: "99", nombre: "Vichada",         lugar: "Puerto Carreño",              coords: [-67.55, 6.12],    estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion","tecnologia"],
    texto: "Núcleos agropecuarios inclusivos y conectividad satelital para formación remota." },
  { dpto: "97", nombre: "Vaupés",          lugar: "Mitú",                        coords: [-70.234, 1.253],  estado: "ruta",
    modulos: ["caracterizacion","nucleos","sensibilizacion","tecnologia"],
    texto: "Etnoeducación y monitoreo de biodiversidad con drones y tecnología accesible." },
  { dpto: "91", nombre: "Amazonas",        lugar: "Puerto Nariño y Leticia",     coords: [-70.36, -3.77],   estado: "activo",
    modulos: ["caracterizacion","nucleos","sensibilizacion","formacion","tecnologia"],
    texto: "Cerca de 9.000 personas indígenas en 23 comunidades, con educación por competencias y un núcleo de desarrollo sostenible." }
];

// ---------- Aliados ----------
// logo: ruta a la imagen en assets/img/aliados/ (déjalo "" y se muestra el nombre).
window.VN_ALIADOS = [
  { nombre: "Universidad Nacional de Colombia", tipo: "Convenio de investigación", detalle: "Convenio 037 de 2024 con el Centro de Excelencia: investigación, pasantes y especialistas, y verificación de que los impactos sean positivos y medibles.", logo: "assets/img/aliados/universidad-nacional.png" },
  { nombre: "Globaltiz SAS", tipo: "Responsabilidad empresarial", detalle: "Empresa de apoyo a la gestión.", logo: "assets/img/aliados/globaltiz.png" },
  { nombre: "Global Foods Trading", tipo: "Responsabilidad empresarial", detalle: "Empresa de apoyo a la gestión.", logo: "assets/img/aliados/global-foods-trading.png" },
  { nombre: "FOAL — Fundación ONCE América Latina", tipo: "Cooperación", detalle: "Beneficiario institucional principal: personas con discapacidad visual.", logo: "assets/img/aliados/foal.png" },
  { nombre: "Programa Ágora (ONCE)", tipo: "Cooperación", detalle: "Inclusión laboral de personas con discapacidad visual.", logo: "assets/img/aliados/agora.png" },
  { nombre: "Paz Ventures", tipo: "Aliado estratégico", detalle: "Brazo empresarial y aliado estratégico del modelo.", logo: "" },
  { nombre: "Tecnología para la Paz", tipo: "Aliado estratégico", detalle: "I+D: drones, satélites, IoT y DeepTech inclusivo.", logo: "" }
];
