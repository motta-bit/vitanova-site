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

// ---------- Meta (Facebook/Instagram) ----------
// pixelId: ID del píxel de Meta (Administrador de eventos) para medir visitas.
// Se activa solo cuando pegues el número aquí.
window.VN_META = { pixelId: "" };

// ---------- Pagos / Donaciones ----------
// Para activar pagos reales con Wompi (Bancolombia):
// 1. Crea tu cuenta de comercio en https://comercios.wompi.co
// 2. Crea un "Link de pago" (Herramientas → Links de pago) para donaciones
//    y configura como URL de redirección: https://motta-bit.github.io/vitanova-site/apoyar.html
// 3. Pega aquí la URL del link de pago (ej: "https://checkout.wompi.co/l/XXXXX")
// Mientras esté vacío, el módulo funciona en modo demostración.
window.VN_PAY = {
  wompiLink: "",
  nombreFundacion: "Asociación Vita Nova Colombia",
  nit: "901.778.613-2", // NIT de la fundación (aparece en recibo y pie de página)
  ciudad: "Medellín, Antioquia"
};

window.VN_AREAS = {
  formacion:       { label: "Formación",             color: "#1D9E75" },
  empleabilidad:   { label: "Empleabilidad",         color: "#0F6E56" },
  nucleos:         { label: "Núcleos de desarrollo", color: "#3C3489" },
  tecnologia:      { label: "Tecnología para la Paz",color: "#B07D2B" },
  sensibilizacion: { label: "Sensibilización",       color: "#C2503C" },
  caracterizacion: { label: "Caracterización",       color: "#2B7DB0" }
};

window.VN_REGIONS = {
  caribe: {
    name: "Región Caribe", color: "#8FD8C0",
    desc: "La Guajira, Magdalena, Atlántico, Bolívar, Cesar, Sucre y Córdoba: articulación con comunidades wayúu, zenú y poblaciones costeras.",
    municipios: 24, nucleos: 120
  },
  pacifico: {
    name: "Región Pacífico", color: "#4FB998",
    desc: "Cauca y Nariño: inclusión de comunidades afrodescendientes e indígenas con programas agroambientales y de economía solidaria.",
    municipios: 22, nucleos: 110
  },
  andina: {
    name: "Región Andina", color: "#1D9E75",
    desc: "Antioquia, Cundinamarca, Santander y Boyacá: sede en Medellín, convenio de investigación universitaria y laboratorios de Tecnología para la Paz.",
    municipios: 46, nucleos: 230
  },
  orinoquia: {
    name: "Región Orinoquía", color: "#7BC9AC",
    desc: "Vichada: núcleos agropecuarios inclusivos y conectividad satelital para formación remota.",
    municipios: 18, nucleos: 90
  },
  amazonia: {
    name: "Región Amazonía", color: "#2E8B6F",
    desc: "Amazonas, Vaupés y Putumayo: etnoeducación, biodiversidad y soluciones DeepTech con las comunidades originarias.",
    municipios: 20, nucleos: 100
  }
};

// Región de cada departamento por código DANE (DPTO del GeoJSON)
window.VN_DEPT_REGION = {
  "08":"caribe","13":"caribe","20":"caribe","23":"caribe","44":"caribe","47":"caribe","70":"caribe","88":"caribe",
  "27":"pacifico","19":"pacifico","52":"pacifico","76":"pacifico",
  "05":"andina","11":"andina","15":"andina","17":"andina","25":"andina","41":"andina","54":"andina","63":"andina","66":"andina","68":"andina","73":"andina",
  "50":"orinoquia","81":"orinoquia","85":"orinoquia","99":"orinoquia",
  "18":"amazonia","86":"amazonia","91":"amazonia","94":"amazonia","95":"amazonia","97":"amazonia"
};

// Departamentos con presencia activa de Vita Nova (código DANE): la sede en Antioquia
// y los 16 territorios donde se trabaja.
window.VN_ACTIVE_DEPTS = ["05","44","47","08","13","20","70","23","25","11","52","97","99","76","41","73","91"];

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
    modulos: ["caracterizacion","formacion","empleabilidad","nucleos","tecnologia","sensibilizacion"],
    texto: "Sede institucional en Medellín. Desde aquí salen las rutas hacia cada territorio y se coordinan todos los módulos." },
  { dpto: "44", nombre: "La Guajira",      lugar: "Maicao y Riohacha",           coords: [-72.24, 11.38],   estado: "activo",
    modulos: ["caracterizacion","nucleos","formacion"],
    texto: "Zona fronteriza y de alta diversidad étnica: caracterización psicosocial y núcleos de desarrollo con comunidades wayuu y población migrante." },
  { dpto: "47", nombre: "Magdalena",       lugar: "Santa Marta",                 coords: [-74.199, 11.241], estado: "creacion",
    modulos: ["formacion","sensibilizacion"],
    texto: "Turismo accesible y formación gastronómica y de servicios para poblaciones vulnerables." },
  { dpto: "08", nombre: "Atlántico",       lugar: "Barranquilla",                coords: [-74.796, 10.964], estado: "creacion",
    modulos: ["empleabilidad","nucleos","tecnologia"],
    texto: "Modelo productivo portuario y logístico inclusivo, con tecnología y accesibilidad." },
  { dpto: "13", nombre: "Bolívar",         lugar: "Magangué",                    coords: [-74.754, 9.24],   estado: "activo",
    modulos: ["formacion","tecnologia"],
    texto: "Presencia en el Caribe interior, sobre el río Magdalena, con procesos de inclusión social y formación técnica." },
  { dpto: "20", nombre: "Cesar",           lugar: "Valledupar",                  coords: [-73.253, 10.464], estado: "creacion",
    modulos: ["formacion","caracterizacion"],
    texto: "Núcleo en creación: caracterización de familias y formación inclusiva." },
  { dpto: "70", nombre: "Sucre",           lugar: "Sincelejo",                   coords: [-75.398, 9.305],  estado: "ruta",
    modulos: ["caracterizacion","formacion"],
    texto: "Ruta activa: caracterización de familias y formación con ajustes razonables." },
  { dpto: "23", nombre: "Córdoba",         lugar: "Montería",                    coords: [-75.881, 8.748],  estado: "ruta",
    modulos: ["caracterizacion","formacion"],
    texto: "Ruta activa: caracterización de familias y formación con ajustes razonables." },
  { dpto: "25", nombre: "Cundinamarca",    lugar: "Anapoima",                    coords: [-74.536, 4.55],   estado: "activo",
    modulos: ["formacion","caracterizacion"],
    texto: "Formación y acompañamiento comunitario en el centro del país, punto de entrada de la ruta del proyecto." },
  { dpto: "11", nombre: "Bogotá D.C.",     lugar: "Bogotá",                      coords: [-74.072, 4.711],  estado: "ruta",
    modulos: ["formacion","sensibilizacion"],
    texto: "Ruta activa: formación inclusiva y sensibilización con organizaciones." },
  { dpto: "73", nombre: "Tolima",          lugar: "Ibagué",                      coords: [-75.232, 4.438],  estado: "ruta",
    modulos: ["caracterizacion","formacion"],
    texto: "Ruta activa: caracterización de familias y formación con ajustes razonables." },
  { dpto: "41", nombre: "Huila",           lugar: "Neiva",                       coords: [-75.282, 2.927],  estado: "ruta",
    modulos: ["caracterizacion","formacion"],
    texto: "Ruta activa: caracterización de familias y formación con ajustes razonables." },
  { dpto: "76", nombre: "Valle del Cauca", lugar: "Cali",                        coords: [-76.532, 3.452],  estado: "ruta",
    modulos: ["caracterizacion","formacion","empleabilidad"],
    texto: "Ruta activa: caracterización, formación y vinculación laboral." },
  { dpto: "52", nombre: "Nariño",          lugar: "Pasto",                       coords: [-77.277, 1.209],  estado: "ruta",
    modulos: ["formacion","nucleos"],
    texto: "Bachillerato inclusivo por ciclos y núcleos de economía solidaria andino-pacífica." },
  { dpto: "99", nombre: "Vichada",         lugar: "Puerto Carreño",              coords: [-67.55, 6.12],    estado: "ruta",
    modulos: ["nucleos","tecnologia"],
    texto: "Núcleos agropecuarios inclusivos y conectividad satelital para formación remota." },
  { dpto: "97", nombre: "Vaupés",          lugar: "Mitú",                        coords: [-70.234, 1.253],  estado: "ruta",
    modulos: ["tecnologia","caracterizacion"],
    texto: "Etnoeducación y monitoreo de biodiversidad con drones y tecnología accesible." },
  { dpto: "91", nombre: "Amazonas",        lugar: "Puerto Nariño y Leticia",     coords: [-70.36, -3.77],   estado: "activo",
    modulos: ["nucleos","formacion","tecnologia","caracterizacion"],
    texto: "Cerca de 9.000 personas indígenas en 23 comunidades, con educación por competencias y un núcleo de desarrollo sostenible." }
];

// Nombres bonitos por código (el GeoJSON trae mayúsculas y sin tildes)
window.VN_DEPT_NAME = {
  "05":"Antioquia","08":"Atlántico","11":"Bogotá D.C.","13":"Bolívar","15":"Boyacá","17":"Caldas","18":"Caquetá",
  "19":"Cauca","20":"Cesar","23":"Córdoba","25":"Cundinamarca","27":"Chocó","41":"Huila","44":"La Guajira",
  "47":"Magdalena","50":"Meta","52":"Nariño","54":"Norte de Santander","63":"Quindío","66":"Risaralda",
  "68":"Santander","70":"Sucre","73":"Tolima","76":"Valle del Cauca","81":"Arauca","85":"Casanare",
  "86":"Putumayo","88":"San Andrés y Providencia","91":"Amazonas","94":"Guainía","95":"Guaviare","97":"Vaupés","99":"Vichada"
};

// Rutas activas: puntos del mapa con coordenadas reales [lon, lat].
// "route: true" dibuja la ruta desde la sede (Medellín). Los puntos sin "areas"
// representan la presencia departamental sin detallar programas.
window.VN_PROJECTS = [
  { city: "Medellín",      dept: "05", region: "andina",    coords: [-75.574, 6.244], flagship: true,
    areas: ["formacion","empleabilidad","nucleos","tecnologia","sensibilizacion","caracterizacion"],
    desc: "Sede institucional (Av. El Poblado N° 1-50). Centro de operaciones, caracterización integral y laboratorio de Tecnología para la Paz." },
  { city: "Cundinamarca",  dept: "25", region: "andina",    coords: [-74.05, 4.95], route: true,
    desc: "Presencia activa en el departamento, articulada con el convenio de investigación universitaria." },
  { city: "Bucaramanga",   dept: "68", region: "andina",    coords: [-73.123, 7.119], route: true,
    areas: ["formacion","tecnologia"],
    desc: "Formación en tecnología e inteligencia artificial con sistemas de evaluación adaptados." },
  { city: "Tunja",         dept: "15", region: "andina",    coords: [-73.362, 5.535], route: true,
    desc: "Ruta activa en Boyacá dentro de la Fase 1." },
  { city: "Barranquilla",  dept: "08", region: "caribe",    coords: [-74.796, 10.964], route: true,
    areas: ["empleabilidad","nucleos"],
    desc: "Modelo productivo portuario-logístico inclusivo: 50 familias por núcleo integradas a economías emergentes." },
  { city: "Santa Marta",   dept: "47", region: "caribe",    coords: [-74.199, 11.241], route: true,
    areas: ["formacion","sensibilizacion"],
    desc: "Programas de turismo accesible y formación gastronómica y de servicios para poblaciones vulnerables." },
  { city: "Riohacha",      dept: "44", region: "caribe",    coords: [-72.907, 11.545], route: true,
    areas: ["nucleos","caracterizacion"],
    desc: "Caracterización psicosocial y núcleos de desarrollo con comunidades wayúu de La Guajira." },
  { city: "Cartagena",     dept: "13", region: "caribe",    coords: [-75.479, 10.391], route: true,
    desc: "Ruta activa en Bolívar dentro de la Fase 1." },
  { city: "Valledupar",    dept: "20", region: "caribe",    coords: [-73.253, 10.464], route: true,
    desc: "Ruta activa en el Cesar dentro de la Fase 1." },
  { city: "Sincelejo",     dept: "70", region: "caribe",    coords: [-75.398, 9.305], route: true,
    desc: "Ruta activa en Sucre dentro de la Fase 1." },
  { city: "Montería",      dept: "23", region: "caribe",    coords: [-75.881, 8.748], route: true,
    desc: "Ruta activa en Córdoba dentro de la Fase 1." },
  { city: "Popayán",       dept: "19", region: "pacifico",  coords: [-76.606, 2.444], route: true,
    desc: "Ruta activa en el Cauca dentro de la Fase 1." },
  { city: "Pasto",         dept: "52", region: "pacifico",  coords: [-77.277, 1.209], route: true,
    areas: ["formacion","nucleos"],
    desc: "Bachillerato inclusivo por ciclos y núcleos de economía solidaria andino-pacífica." },
  { city: "Puerto Carreño",dept: "99", region: "orinoquia", coords: [-67.55, 6.12], route: true,
    desc: "Ruta activa en Vichada dentro de la Fase 1." },
  { city: "Mocoa",         dept: "86", region: "amazonia",  coords: [-76.647, 1.149], route: true,
    desc: "Ruta activa en Putumayo dentro de la Fase 1." },
  { city: "Mitú",          dept: "97", region: "amazonia",  coords: [-70.234, 1.253], route: true,
    areas: ["tecnologia","caracterizacion"],
    desc: "Etnoeducación y monitoreo de biodiversidad con drones y tecnología accesible." },
  { city: "Leticia",       dept: "91", region: "amazonia",  coords: [-69.96, -4.12], route: true,
    areas: ["nucleos","tecnologia","formacion"],
    desc: "Núcleo insignia de desarrollo sostenible con comunidades originarias del trapecio amazónico." }
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

window.VN_EVENTS = [
  {
    id: "ev-sensibilizacion-agosto",
    title: "Taller de Sensibilización Certificado — 40 horas",
    date: "2026-08-14", dateLabel: "14 de agosto, 2026",
    place: "Medellín · Av. El Poblado N° 1-50, Piso 6",
    mode: "Presencial",
    desc: "Taller certificado para organizaciones públicas y privadas. Construye entornos verdaderamente inclusivos desde adentro: lenguaje, accesibilidad, ajustes razonables y cultura organizacional.",
    cupos: 40
  },
  {
    id: "ev-nucleos-webinar",
    title: "Webinar: Núcleos Inclusivos de Desarrollo",
    date: "2026-08-28", dateLabel: "28 de agosto, 2026",
    place: "Virtual · Transmisión en vivo",
    mode: "Virtual",
    desc: "Conoce el modelo de Núcleos Inclusivos de Desarrollo Social y Tecnológico: cómo 50 familias por núcleo se integran a economías emergentes de alto impacto.",
    cupos: 300
  },
  {
    id: "ev-feria-formacion",
    title: "Feria de Formación Inclusiva — Matrículas 2027",
    date: "2026-10-09", dateLabel: "9 de octubre, 2026",
    place: "Medellín · Sede institucional",
    mode: "Presencial",
    desc: "74+ programas técnicos y 14 carreras profesionales con evaluación adaptada. Orientación vocacional gratuita para personas con discapacidad, cuidadores y familias.",
    cupos: 200
  }
];
