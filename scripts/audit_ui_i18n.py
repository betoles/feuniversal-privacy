import os
import re
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_DIR = os.path.join(BASE_DIR, "js")
COMP_DIR = os.path.join(JS_DIR, "components")

print("=" * 65)
print("AUDITORIA DETALLADA DE INTERNACIONALIZACION EN COMPONENTES UI")
print("=" * 65)

for fname in sorted(os.listdir(COMP_DIR)):
    if not fname.endswith(".js"):
        continue
    fpath = os.path.join(COMP_DIR, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    has_t = "t(" in content
    
    # Extract hardcoded text between HTML tags >Text<
    raw_tags = re.findall(r'>([^<>{}$]+)<', content)
    meaningful = []
    for txt in raw_tags:
        clean = txt.strip()
        # filter out symbols, single words without letters, numbers, etc.
        if len(clean) > 3 and any(c.isalpha() for c in clean) and not clean.startswith("&"):
            meaningful.append(clean)

    print(f"\n📁 Componente: {fname} | Utiliza t(i18n): {has_t}")
    if meaningful:
        print(f"   Posibles textos fijos detectados ({len(meaningful)}):")
        for m in meaningful[:6]:
            print(f"     • \"{m}\"")
    else:
        print("   ✅ Sin textos fijos evidentes.")

print("\n" + "=" * 65)
print("AUDITORIA DE INDEX.HTML")
print("=" * 65)
with open(os.path.join(BASE_DIR, "index.html"), "r", encoding="utf-8") as f:
    html_content = f.read()

html_tags = re.findall(r'>([^<>{}$]+)<', html_content)
html_meaningful = [t.strip() for t in html_tags if len(t.strip()) > 3 and any(c.isalpha() for c in t.strip()) and not t.strip().startswith("&")]
print(f"Textos fijos iniciales en index.html ({len(html_meaningful)}):")
for hm in html_meaningful[:15]:
    print(f"   • \"{hm}\"")
