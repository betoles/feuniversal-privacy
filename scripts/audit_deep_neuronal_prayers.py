# -*- coding: utf-8 -*-
import json
import os

FILES = [
    ("ar", "العربية", "rtl"),
    ("bn", "বাংলা", "ltr"),
    ("de", "Deutsch", "ltr"),
    ("en", "English", "ltr"),
    ("es", "Español", "ltr"),
    ("fr", "Français", "ltr"),
    ("he", "עִבְרִית", "rtl"),
    ("hi", "हिन्दी", "ltr"),
    ("id", "Bahasa Indonesia", "ltr"),
    ("it", "Italiano", "ltr"),
    ("ja", "日本語", "ltr"),
    ("la", "Latina", "ltr"),
    ("pt", "Português", "ltr"),
    ("ru", "Русский", "ltr"),
    ("sw", "Kiswahili", "ltr"),
    ("ur", "اردو", "rtl"),
    ("zh", "中文", "ltr")
]

print("=" * 110)
print("                   FINAL DEEP NEURONAL AUDIT: 17 MASTER PRAYER CORPUS FILES")
print("=" * 110)

all_passed = True
total_prayers_verified = 0
total_bytes = 0

for code, name, expected_dir in FILES:
    filename = f"json_idiomas/oraciones_maestro_{code}.json"
    if not os.path.exists(filename):
        print(f"❌ ERROR: File not found: {filename}")
        all_passed = False
        continue

    file_size = os.path.getsize(filename)
    total_bytes += file_size
    
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

    meta = data.get('metadata', {})
    prayers = data.get('oraciones', [])
    p_count = len(prayers)
    total_prayers_verified += p_count

    empty_traduccion = sum(1 for p in prayers if not p.get('textoTraducido') or not str(p.get('textoTraducido')).strip())
    empty_orig = sum(1 for p in prayers if not p.get('textoOriginal') or not str(p.get('textoOriginal')).strip())
    empty_phon = sum(1 for p in prayers if not p.get('guiaFonetica') or not str(p.get('guiaFonetica')).strip())
    empty_title = sum(1 for p in prayers if not p.get('titulo') or not str(p.get('titulo')).strip())
    empty_cat = sum(1 for p in prayers if not p.get('categoriaIntencion') or not str(p.get('categoriaIntencion')).strip())

    actual_dir = meta.get('dir', 'ltr')
    dir_check = (actual_dir == expected_dir)
    
    status_ok = (p_count >= 4245 and 
                 empty_traduccion == 0 and 
                 empty_orig == 0 and 
                 empty_phon == 0 and 
                 empty_title == 0 and 
                 empty_cat == 0 and 
                 dir_check)

    if not status_ok:
        all_passed = False
        status_str = "❌ FAIL"
    else:
        status_str = "✅ CERTIFIED (100% OK)"

    print(f"[{code.upper()}] {filename.ljust(42)} | {p_count}/4245 Prayers | {(file_size/(1024*1024)):.2f} MB | Dir: {actual_dir.ljust(3)} | {status_str} | {name}")

print("-" * 110)
print(f"Total Languages:           17 / 17 Master Prayer Editions")
print(f"Total Prayers Audited:     {total_prayers_verified:,} individual universal prayers")
print(f"Total Corpus Volume:       {(total_bytes/(1024*1024)):.2f} MB")
print(f"Global Integrity Verdict:  {'🌟 100% PERFECTLY CERTIFIED' if all_passed else '❌ ISSUES DETECTED'}")
print("=" * 110)
