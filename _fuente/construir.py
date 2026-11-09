# Arma index.html (la página única) a partir de las piezas de _fuente/.
# Uso:  python _fuente/construir.py
# La carpeta empieza por "_" para que GitHub Pages (Jekyll) no la publique.
import json, re, sys, time
from html.parser import HTMLParser
from pathlib import Path

F = Path(__file__).parent
RAIZ = F.parent
lee = lambda n: (F / n).read_text(encoding="utf-8")

V = time.strftime("%Y%m%d%H")
en = json.loads(lee("en-dossier.json"))
en.update(json.loads(lee("en.json")))

js_idioma = lee("idioma.js").replace("{{EN_DICT}}", json.dumps(en, ensure_ascii=False))
pagina = lee("pagina.html")
for k, v in {
    "{{SEO}}": lee("seo.html"),
    "{{FAVICON}}": lee("favicon.txt"),
    "{{CSS_DOSSIER}}": lee("dossier.css"),
    "{{CSS_MAPA}}": lee("mapa.css"),
    "{{CSS_PROPIO}}": lee("propio.css"),
    "{{DEPTOS}}": lee("deptos.svgfrag"),
    "{{LANDMASS}}": lee("landmass.txt"),
    "{{LOGO}}": lee("logo.svg"),
    "{{JS_PAGINA}}": lee("pagina.js"),
    "{{JS_IDIOMA}}": js_idioma,
    "{{V}}": V,
}.items():
    pagina = pagina.replace(k, v)
assert "{{" not in pagina, re.findall(r"\{\{\w+\}\}", pagina)
(RAIZ / "index.html").write_text(pagina, encoding="utf-8")
print("index.html", len(pagina) // 1024, "KB")

# ---- textos sin traducción: los nodos de texto visibles y los atributos que traduce idioma.js
class Textos(HTMLParser):
    def __init__(self):
        super().__init__(); self.pila = []; self.out = set()
    def handle_starttag(self, tag, attrs):
        if tag not in ("br", "img", "meta", "link", "input", "source", "path", "circle", "rect", "i"):
            self.pila.append(tag)
        for a, v in attrs:
            if a in ("alt", "aria-label", "title", "data-label", "data-chapter", "data-wa") and v:
                self.out.add(v)
    def handle_endtag(self, tag):
        if tag in self.pila:
            while self.pila and self.pila.pop() != tag: pass
    def handle_data(self, d):
        if self.pila and self.pila[-1] in ("script", "style"): return
        t = " ".join(d.split())
        if t and re.search(r"[A-Za-zÁÉÍÓÚáéíóúñ]", t): self.out.add(t)

p = Textos(); p.feed(pagina)
datos = lee("../assets/js/data.js")
dinamicos = set(re.findall(r'(?:nombre|lugar|texto|tipo|detalle): "([^"]+)"', datos))
dinamicos |= set(re.findall(r'^\s+\w+:\s+"([^"]+)",?$', datos.split("VN_MODULOS")[1].split("};")[0], re.M))
ignorar = {"Vita Nova", "Vita", "Nova", "EN", "AA", "Medellín", "+57 300 980 2268", "admin@vitanovacolombia.org"}
faltan = sorted(t for t in (p.out | dinamicos) - ignorar if t not in en and " ".join(t.split()) not in en)
if faltan:
    print("\nSIN TRADUCCIÓN (%d):" % len(faltan))
    for t in faltan: print("  ", json.dumps(t, ensure_ascii=False))
