# Presentación de Vita Nova en PDF (español e inglés), con la identidad de la página.
# Uso:  python _fuente/presentacion/generar.py
# Arma una página HTML por idioma (diapositivas 1920×1080) y la imprime a PDF con Chrome.
import json, re, subprocess, sys
from pathlib import Path
from PIL import Image

P = Path(__file__).parent
F = P.parent
RAIZ = F.parent
SALIDA = Path(sys.argv[1]) if len(sys.argv) > 1 else P / "pdf"
SALIDA.mkdir(parents=True, exist_ok=True)
CHROME = r"C:/Program Files/Google/Chrome/Application/chrome.exe"

# ---------- fotos reducidas: el PDF tiene que poder enviarse por correo ----------
FOTOS = P / "fotos"
FOTOS.mkdir(exist_ok=True)
def foto(rel, ancho=1600):
    src = RAIZ / rel
    dst = FOTOS / (src.stem + ".jpg")
    if not dst.exists():
        im = Image.open(src).convert("RGB")
        im.thumbnail((ancho, ancho))
        im.save(dst, quality=80, optimize=True)
    return dst.as_uri()

logo = (F / "logo.svg").read_text(encoding="utf-8")
deptos = (F / "deptos.svgfrag").read_text(encoding="utf-8")
landmass = (F / "landmass.txt").read_text(encoding="utf-8")

# ---------- datos del mapa, tomados de data.js para que nunca difieran del sitio ----------
datos = subprocess.run(["node", "-e", "global.window={};require(process.argv[1]);console.log(JSON.stringify({t:window.VN_TERRITORIOS,m:window.VN_MODULOS,a:window.VN_ALIADOS}))",
                        str(RAIZ / "assets/js/data.js")], capture_output=True, text=True, encoding="utf-8", check=True)
D = json.loads(datos.stdout)
EN = json.loads((F / "en-dossier.json").read_text(encoding="utf-8"))
EN.update(json.loads((F / "en.json").read_text(encoding="utf-8")))

def px(c):
    return 183.8 + 35.42 * (c[0] + 74.536), 304 - 35.5 * (c[1] - 4.55)

COLOR = {"sede": ("#2C8914", .85), "activo": ("#229B76", .78), "creacion": ("#229B76", .48), "ruta": ("#55CB81", .38)}

def mapa():
    svg = deptos
    for t in D["t"]:
        c, o = COLOR[t["estado"]]
        svg = svg.replace(f'data-dpto="{t["dpto"]}"', f'data-dpto="{t["dpto"]}" style="fill:{c};fill-opacity:{o}"')
    sede = px(D["t"][0]["coords"])
    rutas, puntos = [], []
    for i, t in enumerate(D["t"]):
        x, y = px(t["coords"])
        if t["estado"] != "sede":
            mx, my, dx, dy = (sede[0] + x) / 2, (sede[1] + y) / 2, x - sede[0], y - sede[1]
            rutas.append(f'<path d="M{sede[0]:.1f},{sede[1]:.1f} Q{mx - dy * .18:.1f},{my + dx * .18:.1f} {x:.1f},{y:.1f}"/>')
        r = 9 if t["estado"] == "sede" else 7.5
        puntos.append(f'<g class="pt {t["estado"]}"><circle cx="{x:.1f}" cy="{y:.1f}" r="{r}"/><text x="{x:.1f}" y="{y + 3.2:.1f}">{i + 1}</text></g>')
    return f'''<svg class="mapa" viewBox="0 0 480 640" aria-hidden="true">
<g class="dptos">{svg}</g>
<path class="borde" d="{landmass}"/>
<g class="rutas">{"".join(rutas)}</g>
{"".join(puntos)}
</svg>'''

def construir(lang):
    es = lang == "es"
    t = lambda s: s if es else EN.get(" ".join(s.split()), s)  # textos que ya existen en la página
    L = lambda a, b: a if es else b                            # textos propios de la presentación
    ESTADO = {"sede": L("Sede", "Headquarters"), "activo": L("Núcleo activo", "Active hub"),
              "creacion": L("Núcleo en creación", "Hub being created"), "ruta": L("Ruta activa", "Active route")}
    MOD = {k: t(v) for k, v in D["m"].items()}
    # los tres módulos comunes se dicen una vez en el texto; en la lista va solo lo adicional
    extra = lambda x: "<small>+ %s</small>" % " · ".join(MOD[m] for m in x["modulos"][3:]) if len(x["modulos"]) > 3 else ""

    filas = "".join(
        f'<li><b class="n {x["estado"]}">{i + 1}</b><div><strong>{t(x["nombre"])}</strong> <span class="lugar">{t(x["lugar"])}</span>'
        f'<em>{ESTADO[x["estado"]]}</em>{extra(x)}</div></li>'
        for i, x in enumerate(D["t"]))
    aliados = "".join(
        f'<div class="ally">{"<img src=%s alt=%s>" % (json.dumps(foto(a["logo"], 500)), json.dumps(a["nombre"])) if a["logo"] else "<span class=mono>%s</span>" % a["nombre"]}'
        f'<span class="tag">{t(a["tipo"])}</span><h4>{t(a["nombre"])}</h4><p>{t(a["detalle"])}</p></div>'
        for a in D["a"])

    S = []  # diapositivas
    S.append(f'''
<section class="s cover">
  <div class="cover-txt">
    <div class="nameplate">{logo}<div><div class="word">Vita Nova</div><span class="tagline">{L("INCLUSIÓN · FORMACIÓN · PAZ", "INCLUSION · EDUCATION · PEACE")}</span></div></div>
    <div>
      <div class="kicker">{L("Asociación Vita Nova Colombia · Presentación institucional 2026", "Asociación Vita Nova Colombia · 2026 institutional presentation")}</div>
      <h1>{L("Nadie camina <em>solo.</em>", "No one walks <em>alone.</em>")}</h1>
      <p class="dek">{t("Inclusión, formación y paz escritas en el territorio. Acompañamos a cada persona, familia y comunidad hasta que camina por sí misma, de La Guajira al Amazonas.")}</p>
    </div>
    <div class="issue"><span>{L("Fundada por personas con discapacidad", "Founded by people with disabilities")}</span><span>Medellín, Colombia</span><span>vitanovacolombia.org</span></div>
  </div>
  <div class="cover-img" style="background-image:url({foto("assets/revista/portada.jpg", 1400)})"></div>
</section>''')

    S.append(f'''
<section class="s">
  <div class="grid2">
    <div>
      <div class="kicker">01 · {t("Quiénes somos")}</div>
      <h2>{L("El problema no es de talento. Es de <em>estructura.</em>", "The problem isn't talent. It's <em>structure.</em>")}</h2>
      <p class="lead">{t("Vita Nova es una organización social sin ánimo de lucro con sede en Medellín, fundada por personas con discapacidad. No llegamos a las comunidades desde afuera: somos parte de ellas. Trabajamos con personas con discapacidad, comunidades indígenas y poblaciones vulnerables, y también con sus familias y cuidadores.")}</p>
      <blockquote>{L("Ningún territorio es pobre por falta de talento. Lo es por falta de estructuras que permitan a ese talento convertirse en <em>ingreso, propiedad y decisión.</em>", "No territory is poor for lack of talent. It is poor for lack of structures that allow that talent to become <em>income, ownership and decision-making.</em>")}</blockquote>
    </div>
    <div class="cards2">
      <div class="card"><span class="tag">{L("Misión", "Mission")}</span><p>{L("Restituir de manera integral los derechos de las personas con discapacidad, las comunidades indígenas y las poblaciones vulnerables mediante acompañamiento emocional, formación con ajustes razonables, tecnología accesible y unidades productivas de economía solidaria.", "To fully restore the rights of people with disabilities, indigenous communities and vulnerable populations through emotional support, education with reasonable accommodations, accessible technology and solidarity-economy production units.")}</p></div>
      <div class="card"><span class="tag">{L("Visión", "Vision")}</span><p>{L("Una red nacional de comunidades autónomas y productivas, conectadas con mercados internacionales, en la que la inclusión deje de ser un programa y se convierta en la estructura misma de la economía local.", "A national network of autonomous, productive communities connected to international markets, where inclusion stops being a program and becomes the very structure of the local economy.")}</p></div>
      <div class="card"><span class="tag">{L("Sostenibilidad", "Sustainability")}</span><p>{t("Trabajamos sin financiación estatal. Nos sostienen la autogestión, las alianzas con empresas, la responsabilidad social empresarial y la cooperación internacional. Nuestro lema lo resume:")} <em>{t("Inclusión, Formación y Paz.")}</em></p></div>
    </div>
  </div>
</section>''')

    S.append(f'''
<section class="s forest bgimg" style="background-image:linear-gradient(90deg,rgba(10,34,28,.95) 0%,rgba(10,34,28,.86) 55%,rgba(10,34,28,.55) 100%),url({foto("assets/revista/cifras.jpg")})">
  <div class="kicker">02 · {t("Las cifras")}</div>
  <h2>{L("Lo que nadie más <em>ve.</em>", "What no one else <em>sees.</em>")}</h2>
  <p class="lead">{t("La discapacidad en Colombia no es un asunto marginal: es una brecha estructural de ingreso, educación y salud.")}</p>
  <div class="stats">
    <div><b>{L("3,1 M", "3.1 M")}</b><span>{t("personas con discapacidad en Colombia, según el DANE.")}</span></div>
    <div><b>95%</b><span>{t("no tiene un ingreso formal estable. Solo el 5% lo tiene.")}</span></div>
    <div><b>60%+</b><span>{t("no ha terminado el bachillerato.")}</span></div>
    <div><b>{L("Rural", "Rural")}</b><span>{t("Fuera de las ciudades, la cobertura de salud especializada es deficiente: el territorio decide quién recibe atención.")}</span></div>
  </div>
  <div class="triad">
    <div><span class="tag">i.</span><h4>{t("Pobreza")}</h4><p>{t("Ausencia de ingreso estable e imposibilidad de acumular activos, agravada por intermediarios que capturan el margen de la producción local.")}</p></div>
    <div><span class="tag">ii.</span><h4>{t("Seguridad alimentaria")}</h4><p>{t("Dietas insuficientes y pérdida de cultivos y prácticas alimentarias propias del territorio.")}</p></div>
    <div><span class="tag">iii.</span><h4>{t("Desequilibrio ecosistémico")}</h4><p>{t("Vivienda precaria, acceso deficiente a agua potable y presión sobre los ecosistemas por actividades de subsistencia.")}</p></div>
  </div>
</section>''')

    S.append(f'''
<section class="s">
  <div class="grid-map">
    <div class="map-box">{mapa()}
      <ul class="legend"><li><i class="sede"></i>{ESTADO["sede"]}</li><li><i class="activo"></i>{ESTADO["activo"]}</li><li><i class="creacion"></i>{ESTADO["creacion"]}</li><li><i class="ruta"></i>{ESTADO["ruta"]}</li></ul>
    </div>
    <div>
      <div class="kicker">03 · {t("Territorios")}</div>
      <h2 class="h-sm">{L("Un mapa, diecisiete <em>territorios.</em>", "One map, seventeen <em>territories.</em>")}</h2>
      <p class="small-lead">{L("Desde la sede en Medellín salen las rutas hacia cada territorio. En todos se trabajan núcleos de desarrollo, caracterización y acompañamiento, y sensibilización.", "Routes to every territory start from our headquarters in Medellín. Development hubs, assessment and support, and awareness training run in all of them.")}</p>
      <ol class="terr">{filas}</ol>
    </div>
  </div>
</section>''')

    S.append(f'''
<section class="s">
  <div class="grid2 wide-img">
    <div class="photo" style="background-image:url({foto("assets/revista/par-amigo.jpg", 1200)})"></div>
    <div>
      <div class="kicker">04 · {t("Cómo trabajamos")}</div>
      <h2>{L("Nadie camina <em>solo.</em>", "No one walks <em>alone.</em>")}</h2>
      <p class="lead">{t("Formar a la persona y abrirle un lugar productivo no son etapas separadas: ocurren al mismo tiempo, y siempre en compañía.")}</p>
      <div class="block"><span class="tag">{t("Método")}</span><h3>{L("El modelo <em>Dual</em>", "The <em>Dual</em> model")}</h3><p>{t("Cada proceso combina dos frentes que avanzan juntos: la formación de la persona —con ajustes razonables, pensada para sus necesidades reales— y su inserción productiva dentro de un núcleo. Aprender y producir se sostienen mutuamente.")}</p></div>
      <div class="block"><span class="tag">{t("Acompañamiento")}</span><h3>{L("El <em>Par Amigo</em>", "The <em>Peer Buddy</em>")}</h3><p>{t("Nadie recorre el proceso solo. Cada participante tiene un Par Amigo: un acompañante cercano que sostiene el camino en lo emocional, lo práctico y lo comunitario, hasta que la persona camina por sí misma.")}</p></div>
    </div>
  </div>
</section>''')

    mods = [("I", "Caracterización y acompañamiento", "Diagnóstico psicológico, social y funcional de cada familia antes de intervenir, con acompañamiento psicosocial durante todo el proceso."),
            ("II", "Formación inclusiva", "Bachillerato por ciclos, más de 74 programas técnicos y 14 carreras profesionales con evaluación adaptada y ajustes razonables. Una red de 16 universidades —10 privadas y 6 públicas— sostiene hoy 470 becas."),
            ("III", "Empleabilidad", "Contratos de aprendizaje de dos años dentro de los modelos de negocio del proyecto, con ingresos dignos durante todo el proceso."),
            ("IV", "Núcleos de desarrollo", "Unidades productivas solidarias de 50 familias, con estándares certificables, destino de exportación y propiedad comunitaria."),
            ("V", "Tecnología para la Paz", "Drones, conectividad satelital, IoT y herramientas digitales accesibles, para que la brecha digital no sea una barrera más."),
            ("VI", "Sensibilización", "Taller certificado de 40 horas para organizaciones públicas y privadas que quieren construir entornos inclusivos desde adentro.")]
    S.append(f'''
<section class="s paper">
  <div class="kicker">{t("Lo que encuentras en el mapa")}</div>
  <h2>{L("Seis <em>módulos</em>", "Six <em>modules</em>")}</h2>
  <div class="mods">{"".join(f'<div><span class="pn">{n}</span><h4>{t(h)}</h4><p>{t(p)}</p></div>' for n, h, p in mods)}</div>
</section>''')

    ruta = [("MES 0", "Ingreso y caracterización", "Cada familia entra con un diagnóstico propio."),
            ("MES 6", "Contrato de aprendizaje", "La formación se vuelve vínculo laboral formal."),
            ("MES 12–18", "Producción solidaria", "El núcleo produce con destino de exportación."),
            ("MES 24", "Autonomía", "La familia opera dentro de un núcleo dirigido por su comunidad.")]
    pob = ["Personas con discapacidad visual, sensorial, física y cognitiva", "Comunidades indígenas y resguardos", "Migrantes", "Personas desplazadas", "Familias y cuidadores"]
    S.append(f'''
<section class="s">
  <div class="kicker">{t("Ser · Saber · Hacer")}</div>
  <h2>{L("Veinticuatro meses hacia la <em>autonomía</em>", "Twenty-four months toward <em>autonomy</em>")}</h2>
  <p class="lead">{t("Primero la persona se fortalece, luego se forma y después produce. El núcleo como un todo completa su ciclo en cuatro años, hasta quedar plenamente en manos de la comunidad.")}</p>
  <div class="route">{"".join(f'<div><span class="m">{t(m)}</span><h4>{t(h)}</h4><p>{t(p)}</p></div>' for m, h, p in ruta)}</div>
  <div class="kicker" style="margin-top:70px">{t("A quién acompañamos")}</div>
  <div class="tags">{"".join(f"<span>{t(x)}</span>" for x in pob)}</div>
</section>''')

    escala = [("Hoy", "28.000", "personas registradas"), ("En curso", "10", "núcleos en creación"),
              ("Fase 1", "120.000", "personas, meta de la primera fase"), ("Objetivo", "650", "núcleos en el modelo completo"),
              ("A 5 años", "1.000.000", "personas alcanzadas")]
    num = lambda s: s if es else s.replace(".", ",")
    S.append(f'''
<section class="s paper">
  <div class="grid2">
    <div>
      <div class="kicker">05 · {t("Los núcleos")}</div>
      <h2 class="h-sm">{L("Núcleos Inclusivos de Desarrollo Social y <em>Tecnológico.</em>", "Inclusive Hubs for Social and <em>Technological Development.</em>")}</h2>
      <p class="lead">{t("Un núcleo es una unidad productiva de 50 familias que se organiza bajo principios de economía solidaria para producir, con estándares certificables, un bien con destino de exportación. Al menos el 40% de sus integrantes pertenece a población vulnerable: personas con discapacidad, comunidades indígenas y víctimas del conflicto.")}</p>
      <p class="lead">{t("Tres decisiones de diseño lo distinguen de un proyecto productivo convencional: una escala fija que permite volumen exportable sin perder gobernanza comunitaria, una vocación exportadora definida desde el inicio y la propiedad comunitaria. El núcleo pertenece a quienes lo trabajan.")}</p>
    </div>
    <div>
      <div class="kicker">{t("Dónde estamos y hacia dónde vamos")}</div>
      <div class="scale">{"".join(f'<div style="--s:{60 + i * 26}px"><i></i><small>{t(a)}</small><b>{num(b)}</b><span>{t(c)}</span></div>' for i, (a, b, c) in enumerate(escala))}</div>
    </div>
  </div>
</section>''')

    S.append(f'''
<section class="s forest">
  <div class="grid2">
    <div>
      <div class="kicker">{t("Núcleo tipo")}</div>
      <h2>{L("Huevo de <em>exportación</em>", "Eggs for <em>export</em>")}</h2>
      <p class="lead">{t("La producción se vende al 100% mediante contratos de compra a 10, 15 y 20 años con corporaciones internacionales. Cada familia trabaja con un mercado asegurado desde el primer día.")}</p>
      <ul class="ficha">
        <li><span>{t("Galpones por núcleo")}</span><b>41</b></li>
        <li><span>{t("Aves ponedoras por galpón")}</span><b>{num("4.500")}</b></li>
        <li><span>{t("Ventas aseguradas")}</span><b>{t("10, 15 y 20 años")}</b></li>
        <li><span>{t("Autonomía de la comunidad")}</span><b>{t("Desde el mes 24")}</b></li>
      </ul>
    </div>
    <div>
      <div class="kicker">{t("Inversión y distribución")}</div>
      <h2>{L("Cifras <em>verificables.</em>", "Verifiable <em>figures.</em>")}</h2>
      <p class="lead">{t("El modelo se financia por bloques de 10 núcleos. La transparencia en las cifras es parte de la propuesta.")}</p>
      <div class="ledger">
        <div><b>{L("$11.800M", "COP 11.8B")}</b><span>{t("por núcleo de 50 familias")}</span></div>
        <div><b>{L("$118.000M", "COP 118B")}</b><span>{t("por bloque de 10 núcleos")}</span></div>
        <div><b>80%</b><span>{t("de los excedentes, para la comunidad")}</span></div>
        <div><b>20%</b><span>{t("para escalamiento y aliados")}</span></div>
      </div>
      <p class="fine">{t("Cifras en pesos colombianos, ajustables según el comportamiento de las divisas y formalizadas en el acuerdo específico con cada aliado.")}</p>
    </div>
  </div>
</section>''')

    S.append(f'''
<section class="s">
  <div class="grid2 wide-img">
    <div class="photo" style="background-image:url({foto("assets/revista/cartilla.jpg", 1200)})"></div>
    <div>
      <div class="kicker">06 · {t("Instrumento propio")}</div>
      <h2>{L("Cartilla de Acondicionamiento Académico <em>7.0</em>", "Academic Accommodation Handbook <em>7.0</em>")}</h2>
      <p class="lead">{t("Una herramienta pedagógica propia de Vita Nova, diseñada para fortalecer los Planes Individuales de Ajustes Razonables (PIAR) en procesos de educación inclusiva. Ya está en uso en los territorios donde opera el proyecto.")}</p>
      <p class="lead">{t("El siguiente paso es escalarla a nivel nacional, con el respaldo de aliados que compartan esa visión.")}</p>
      <div class="tags"><span>{t("Educación inclusiva")}</span><span>{t("Decreto 1421 de 2017")}</span><span>{t("Escalamiento nacional")}</span></div>
    </div>
  </div>
</section>''')

    S.append(f'''
<section class="s paper">
  <div class="kicker">07 · {t("Alianzas")}</div>
  <h2>{L("No se trabaja <em>solo.</em>", "No one works <em>alone.</em>")}</h2>
  <div class="allies">{aliados}</div>
  <p class="note">{t("Además, una red de 16 universidades —10 privadas y 6 públicas— abre cupos y 470 becas para los participantes del modelo y certifica su formación.")}</p>
</section>''')

    eco = [("Empresas privadas", "Recursos, conocimiento técnico y capacidad logística.", "Beneficios tributarios e impacto verificable para sus reportes de sostenibilidad."),
           ("ESAL e instituciones educativas", "Presencia territorial y oferta formativa.", "Reconocimiento, prioridad contractual y participación en los excedentes."),
           ("Cooperantes internacionales", "Financiación y estándares de impacto.", "Un modelo replicable, documentado y auditable.")]
    formas = [("Movilidad", "Logística y transporte territorial"), ("Tecnología", "Herramientas y conectividad"), ("Educación", "Formación y becas"),
              ("Empleabilidad", "Vinculación laboral"), ("Mercado", "Compras y cadena de suministro"), ("Inversión", "Recursos y voluntariado")]
    S.append(f'''
<section class="s forest">
  <div class="kicker">08 · {t("Participar")}</div>
  <h2>{L("Hay un lugar para <em>cada uno.</em>", "There is a place for <em>everyone.</em>")}</h2>
  <div class="eco">{"".join(f'<div><h4>{t(a)}</h4><span class="tag">{t("Aportan")}</span><p>{t(b)}</p><span class="tag">{t("Reciben")}</span><p>{t(c)}</p></div>' for a, b, c in eco)}</div>
  <div class="kicker" style="margin-top:56px">{t("Seis formas de sumarse")}</div>
  <div class="formas">{"".join(f'<div><span class="mn">0{i + 1}</span><span class="tag">{t(a)}</span><h4>{t(b)}</h4></div>' for i, (a, b) in enumerate(formas))}</div>
</section>''')

    pasos = [("Manifestación de interés", "La entidad comunica su intención de vincularse y el sector desde el que quiere aportar."),
             ("Sesión de alineación", "Se presenta el modelo en detalle y se identifican los territorios de mayor valor conjunto."),
             ("Valoración del aporte", "Se cuantifica y documenta el aporte, y se define su destinación."),
             ("Suscripción del acuerdo", "Se firma el convenio, con obligaciones, indicadores y beneficios."),
             ("Ejecución y seguimiento", "Reportes periódicos, con verificación académica independiente.")]
    S.append(f'''
<section class="s">
  <div class="kicker">{t("Cómo empieza una alianza")}</div>
  <h2>{L("Un modelo abierto a la <em>coinversión.</em>", "A model open to <em>co-investment.</em>")}</h2>
  <p class="lead">{t("Cada aliado realiza un aporte equivalente en conocimiento, en especie o en recursos, destinado a la gestión del territorio.")}</p>
  <div class="steps">{"".join(f'<div><span class="m">{L("PASO", "STEP")} 0{i + 1}</span><h4>{t(a)}</h4><p>{t(b)}</p></div>' for i, (a, b) in enumerate(pasos))}</div>
  <div class="soon"><span class="tag">{t("Próximamente")}</span><h3>Casa <em>Raíz</em></h3><p>{t("Lo próximo de Vita Nova ya está echando raíces: un proyecto de territorio, comunidad e impacto sostenible. Si tu empresa quiere conocerlo desde el comienzo, escríbenos.")}</p></div>
</section>''')

    S.append(f'''
<section class="s forest bgimg quote" style="background-image:linear-gradient(rgba(10,34,28,.74),rgba(10,34,28,.74)),url({foto("assets/revista/cierre.jpg")})">
  <blockquote>{L("«Cuando una comunidad deja de esperar que alguien la salve y descubre que puede producir, decidir y exportar por sí misma, la transformación ya no es un proyecto: es una <em>vida nueva.</em>»", "“When a community stops waiting for someone to save it and discovers it can produce, decide and export on its own, the transformation is no longer a project: it is a <em>new life.</em>”")}</blockquote>
</section>''')

    S.append(f'''
<section class="s back">
  <div class="grid2">
    <div>
      <div class="kicker">09 · {t("Contacto")}</div>
      <h2>{L("Súmate. <em>Conversemos.</em>", "Join us. <em>Let's talk.</em>")}</h2>
      <p class="lead">{L("Cuéntanos tu caso o el de tu organización: escríbenos y te enviamos más información o coordinamos una sesión de alineación.", "Tell us about yourself or your organization: write to us and we'll send you more information or set up an alignment session.")}</p>
      <ul class="contact">
        <li><span>WhatsApp</span><a href="https://wa.me/573009802268">+57 300 980 2268</a></li>
        <li><span>{L("Correo", "Email")}</span><a href="mailto:admin@vitanovacolombia.org">admin@vitanovacolombia.org</a></li>
        <li><span>{L("Sitio web", "Website")}</span><a href="https://vitanovacolombia.org">vitanovacolombia.org</a></li>
        <li><span>{L("Redes", "Social media")}</span><div><a href="https://www.instagram.com/vitanovacolombia">Instagram @vitanovacolombia</a> · <a href="https://www.youtube.com/@vitanovacolombia">YouTube</a> · <a href="https://www.facebook.com/profile.php?id=61594821462218">Facebook</a></div></li>
        <li><span>{L("Dirección", "Address")}</span>{t("Av. El Poblado N° 1-50, piso 6 · Medellín, Antioquia")}, Colombia</li>
      </ul>
    </div>
    <div class="back-logo">{logo}<div class="word">Vita Nova</div><span class="tagline">{L("INCLUSIÓN · FORMACIÓN · PAZ", "INCLUSION · EDUCATION · PEACE")}</span></div>
  </div>
  <div class="colophon">{t("Asociación Vita Nova Colombia · NIT 901.778.613-2 · Entidad sin ánimo de lucro")}</div>
</section>''')

    html = (P / "estilo.html").read_text(encoding="utf-8").replace("{{LANG}}", lang).replace(
        "{{TITULO}}", L("Vita Nova — Presentación institucional", "Vita Nova — Institutional presentation")).replace("{{SLIDES}}", "\n".join(S))
    out = P / f"presentacion-{lang}.html"
    out.write_text(html, encoding="utf-8")
    pdf = SALIDA / L("Vita Nova - Presentacion (ES).pdf", "Vita Nova - Presentation (EN).pdf")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=15000",
                    "--run-all-compositor-stages-before-draw", f"--print-to-pdf={pdf}", out.as_uri()],
                   check=True, capture_output=True)
    print(pdf, round(pdf.stat().st_size / 1e6, 1), "MB")

for lang in ("es", "en"):
    construir(lang)
