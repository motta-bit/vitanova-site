// ============================================================
// DATOS — Mapa interactivo, proyectos y eventos Vita Nova
// ============================================================

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
    name: "Región Caribe",
    desc: "Costa norte: articulación con comunidades wayúu, zenú y poblaciones costeras. Puerta de entrada logística de la Fase 1.",
    municipios: 24, nucleos: 120, stats: "24 municipios · 120 núcleos proyectados"
  },
  pacifico: {
    name: "Región Pacífico",
    desc: "Del Chocó a Nariño: inclusión de comunidades afrodescendientes e indígenas con programas agro-ambientales y de economía solidaria.",
    municipios: 22, nucleos: 110, stats: "22 municipios · 110 núcleos proyectados"
  },
  andina: {
    name: "Región Andina",
    desc: "Eje central del proyecto: sede en Medellín, alianzas universitarias y laboratorios de Tecnología para la Paz.",
    municipios: 46, nucleos: 230, stats: "46 municipios · 230 núcleos proyectados"
  },
  orinoquia: {
    name: "Región Orinoquía",
    desc: "Llanos orientales: núcleos agropecuarios inclusivos y conectividad satelital para formación remota.",
    municipios: 18, nucleos: 90, stats: "18 municipios · 90 núcleos proyectados"
  },
  amazonia: {
    name: "Región Amazonía",
    desc: "De la Amazonia al mundo: etnoeducación, biodiversidad y soluciones DeepTech con las comunidades originarias.",
    municipios: 20, nucleos: 100, stats: "20 municipios · 100 núcleos proyectados"
  }
};

window.VN_PROJECTS = [
  { city: "Medellín",      region: "andina",    x: 255, y: 235, flagship: true,
    areas: ["formacion","empleabilidad","nucleos","tecnologia","sensibilizacion","caracterizacion"],
    desc: "Sede institucional (Av. El Poblado N° 1-50). Centro de operaciones, caracterización integral y laboratorio de Tecnología para la Paz." },
  { city: "Bogotá",        region: "andina",    x: 322, y: 302,
    areas: ["formacion","sensibilizacion","tecnologia"],
    desc: "Alianzas con la Universidad Nacional de Colombia y programas de sensibilización certificada de 40 horas para entidades públicas." },
  { city: "Cali",          region: "pacifico",  x: 232, y: 345,
    areas: ["formacion","empleabilidad"],
    desc: "Formación técnica laboral con ajustes razonables (Ley 3011) y contratos de aprendizaje de dos años." },
  { city: "Quibdó",        region: "pacifico",  x: 218, y: 252,
    areas: ["nucleos","formacion","caracterizacion"],
    desc: "Núcleos inclusivos agro-ambientales con comunidades afrodescendientes del Chocó biogeográfico." },
  { city: "Barranquilla",  region: "caribe",    x: 300, y: 88,
    areas: ["empleabilidad","nucleos"],
    desc: "Modelo productivo portuario-logístico inclusivo: 50 familias por núcleo integradas a economías emergentes." },
  { city: "Santa Marta",   region: "caribe",    x: 332, y: 80,
    areas: ["formacion","sensibilizacion"],
    desc: "Programas de turismo accesible y formación gastronómica y de servicios para poblaciones vulnerables." },
  { city: "Riohacha",      region: "caribe",    x: 372, y: 62,
    areas: ["nucleos","caracterizacion"],
    desc: "Caracterización psicosocial y núcleos de desarrollo con comunidades wayúu de La Guajira." },
  { city: "Bucaramanga",   region: "andina",    x: 348, y: 208,
    areas: ["formacion","tecnologia"],
    desc: "Formación en tecnología e inteligencia artificial con sistemas de evaluación adaptados." },
  { city: "Villavicencio", region: "orinoquia", x: 420, y: 350,
    areas: ["nucleos","empleabilidad"],
    desc: "Núcleos agropecuarios inclusivos: puerta de la Orinoquía y despensa agrícola con empleo digno." },
  { city: "Arauca",        region: "orinoquia", x: 468, y: 232,
    areas: ["formacion","caracterizacion"],
    desc: "Formación remota vía conectividad satelital y diagnóstico integral de poblaciones de frontera." },
  { city: "Pasto",         region: "pacifico",  x: 212, y: 442,
    areas: ["formacion","nucleos"],
    desc: "Bachillerato inclusivo por ciclos y núcleos de economía solidaria andino-pacífica." },
  { city: "Mitú",          region: "amazonia",  x: 468, y: 528,
    areas: ["tecnologia","caracterizacion"],
    desc: "Etnoeducación y monitoreo de biodiversidad con drones y tecnología accesible." },
  { city: "Leticia",       region: "amazonia",  x: 330, y: 700,
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
