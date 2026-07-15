// ============================================================
// DATOS — Vita Nova Colombia
// ============================================================

window.VN_WHATSAPP = "573009802268"; // botón flotante y servicio al cliente

// ---------- Redes sociales ----------
// Deja "" en las que aún no existan y no se mostrarán.
window.VN_SOCIAL = {
  youtube:   "https://youtube.com/@asovitanova",
  instagram: "https://www.instagram.com/vitanova_aso",
  facebook:  "",
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
  nit: "", // NIT de la fundación para el recibo (opcional)
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
    desc: "Costa norte: articulación con comunidades wayúu, zenú y poblaciones costeras. Puerta de entrada logística de la Fase 1.",
    municipios: 24, nucleos: 120
  },
  pacifico: {
    name: "Región Pacífico", color: "#4FB998",
    desc: "Del Chocó a Nariño: inclusión de comunidades afrodescendientes e indígenas con programas agro-ambientales y de economía solidaria.",
    municipios: 22, nucleos: 110
  },
  andina: {
    name: "Región Andina", color: "#1D9E75",
    desc: "Eje central del proyecto: sede en Medellín, alianzas universitarias y laboratorios de Tecnología para la Paz.",
    municipios: 46, nucleos: 230
  },
  orinoquia: {
    name: "Región Orinoquía", color: "#7BC9AC",
    desc: "Llanos orientales: núcleos agropecuarios inclusivos y conectividad satelital para formación remota.",
    municipios: 18, nucleos: 90
  },
  amazonia: {
    name: "Región Amazonía", color: "#2E8B6F",
    desc: "De la Amazonia al mundo: etnoeducación, biodiversidad y soluciones DeepTech con las comunidades originarias.",
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

// Nombres bonitos por código (el GeoJSON trae mayúsculas y sin tildes)
window.VN_DEPT_NAME = {
  "05":"Antioquia","08":"Atlántico","11":"Bogotá D.C.","13":"Bolívar","15":"Boyacá","17":"Caldas","18":"Caquetá",
  "19":"Cauca","20":"Cesar","23":"Córdoba","25":"Cundinamarca","27":"Chocó","41":"Huila","44":"La Guajira",
  "47":"Magdalena","50":"Meta","52":"Nariño","54":"Norte de Santander","63":"Quindío","66":"Risaralda",
  "68":"Santander","70":"Sucre","73":"Tolima","76":"Valle del Cauca","81":"Arauca","85":"Casanare",
  "86":"Putumayo","88":"San Andrés y Providencia","91":"Amazonas","94":"Guainía","95":"Guaviare","97":"Vaupés","99":"Vichada"
};

// Proyectos por ciudad con coordenadas reales [lon, lat]
window.VN_PROJECTS = [
  { city: "Medellín",      region: "andina",    coords: [-75.574, 6.244], flagship: true,
    areas: ["formacion","empleabilidad","nucleos","tecnologia","sensibilizacion","caracterizacion"],
    desc: "Sede institucional (Av. El Poblado N° 1-50). Centro de operaciones, caracterización integral y laboratorio de Tecnología para la Paz." },
  { city: "Bogotá",        region: "andina",    coords: [-74.072, 4.711],
    areas: ["formacion","sensibilizacion","tecnologia"],
    desc: "Alianzas con la Universidad Nacional de Colombia y programas de sensibilización certificada de 40 horas para entidades públicas." },
  { city: "Cali",          region: "pacifico",  coords: [-76.532, 3.452],
    areas: ["formacion","empleabilidad"],
    desc: "Formación técnica laboral con ajustes razonables (Ley 3011) y contratos de aprendizaje de dos años." },
  { city: "Quibdó",        region: "pacifico",  coords: [-76.649, 5.695],
    areas: ["nucleos","formacion","caracterizacion"],
    desc: "Núcleos inclusivos agro-ambientales con comunidades afrodescendientes del Chocó biogeográfico." },
  { city: "Barranquilla",  region: "caribe",    coords: [-74.796, 10.964],
    areas: ["empleabilidad","nucleos"],
    desc: "Modelo productivo portuario-logístico inclusivo: 50 familias por núcleo integradas a economías emergentes." },
  { city: "Santa Marta",   region: "caribe",    coords: [-74.199, 11.241],
    areas: ["formacion","sensibilizacion"],
    desc: "Programas de turismo accesible y formación gastronómica y de servicios para poblaciones vulnerables." },
  { city: "Riohacha",      region: "caribe",    coords: [-72.907, 11.545],
    areas: ["nucleos","caracterizacion"],
    desc: "Caracterización psicosocial y núcleos de desarrollo con comunidades wayúu de La Guajira." },
  { city: "Bucaramanga",   region: "andina",    coords: [-73.123, 7.119],
    areas: ["formacion","tecnologia"],
    desc: "Formación en tecnología e inteligencia artificial con sistemas de evaluación adaptados." },
  { city: "Villavicencio", region: "orinoquia", coords: [-73.627, 4.142],
    areas: ["nucleos","empleabilidad"],
    desc: "Núcleos agropecuarios inclusivos: puerta de la Orinoquía y despensa agrícola con empleo digno." },
  { city: "Arauca",        region: "orinoquia", coords: [-70.759, 7.084],
    areas: ["formacion","caracterizacion"],
    desc: "Formación remota vía conectividad satelital y diagnóstico integral de poblaciones de frontera." },
  { city: "Pasto",         region: "pacifico",  coords: [-77.277, 1.209],
    areas: ["formacion","nucleos"],
    desc: "Bachillerato inclusivo por ciclos y núcleos de economía solidaria andino-pacífica." },
  { city: "Mitú",          region: "amazonia",  coords: [-70.234, 1.253],
    areas: ["tecnologia","caracterizacion"],
    desc: "Etnoeducación y monitoreo de biodiversidad con drones y tecnología accesible." },
  { city: "Leticia",       region: "amazonia",  coords: [-69.941, -4.215],
    areas: ["nucleos","tecnologia","formacion"],
    desc: "De la Amazonia al Pacífico: núcleo insignia de desarrollo sostenible con comunidades originarias del trapecio amazónico." }
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
