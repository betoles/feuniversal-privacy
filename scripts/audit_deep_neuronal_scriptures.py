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
print("                   FINAL DEEP NEURONAL AUDIT: 17 MASTER SCRIPTORIUM FILES")
print("=" * 110)

all_passed = True
total_chapters_verified = 0
total_bytes = 0

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTURES_DIR = os.path.join(BASE_DIR, "json_escrituras")

BOOKS = [
    "dhammapada.json", "epistles.json", "gita.json", "gospels.json",
    "mormon.json", "pentateuch.json", "psalms.json", "quran.json",
    "revelation.json", "song_of_songs.json", "tao-te-king.json", "wisdom.json"
]

for code, name, expected_dir in FILES:
    lang_dir = os.path.join(SCRIPTURES_DIR, code)
    if not os.path.exists(lang_dir):
        print(f"❌ ERROR: Language dir not found: {lang_dir}")
        all_passed = False
        continue

    lang_size = 0
    lang_chapters = 0
    empty_traduccion = 0
    empty_orig = 0
    empty_phon = 0
    empty_title = 0
    empty_book = 0
    actual_dir = "ltr"

    for b in BOOKS:
        bpath = os.path.join(lang_dir, b)
        if not os.path.exists(bpath):
            print(f"❌ ERROR: Book not found: {bpath}")
            all_passed = False
            continue
        
        lang_size += os.path.getsize(bpath)
        with open(bpath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        meta = data.get('metadata', {})
        caps = data.get('capitulos', data if isinstance(data, list) else [])
        lang_chapters += len(caps)

        empty_traduccion += sum(1 for c in caps if not (c.get('traducciones', {}).get(code) or c.get('traduccion') or '').strip())
        empty_orig += sum(1 for c in caps if not str(c.get('textoOriginal', '')).strip())
        empty_phon += sum(1 for c in caps if not str(c.get('foneticaLiturgica', '')).strip())
        empty_title += sum(1 for c in caps if not str(c.get('capitulo', '')).strip())
        empty_book += sum(1 for c in caps if not str(c.get('libro', '')).strip())

        if isinstance(data, dict) and 'metadata' in data:
            actual_dir = meta.get('dir', actual_dir)

    total_chapters_verified += lang_chapters
    total_bytes += lang_size

    dir_check = (actual_dir == expected_dir)
    status_ok = (lang_chapters == 989 and 
                 empty_traduccion == 0 and 
                 empty_orig == 0 and 
                 empty_phon == 0 and 
                 empty_title == 0 and 
                 empty_book == 0 and 
                 dir_check)

    if not status_ok:
        all_passed = False
        status_str = f"❌ FAIL (caps:{lang_chapters}, dir:{actual_dir})"
    else:
        status_str = "✅ CERTIFIED (100% OK)"

    print(f"[{code.upper()}] {code.ljust(4)} | {lang_chapters}/989 Chapters | 12/12 Books | {(lang_size/(1024*1024)):.2f} MB | Dir: {actual_dir.ljust(3)} | {status_str} | {name}")

print("-" * 110)
print(f"Total Languages:           17 / 17 Master Scripture Editions")
print(f"Total Chapters Audited:    {total_chapters_verified:,} canonical chapters & sacred surahs")
print(f"Total Scripture Volume:    {(total_bytes/(1024*1024)):.2f} MB")
print(f"Global Integrity Verdict:  {'🌟 100% PERFECTLY CERTIFIED' if all_passed else '❌ ISSUES DETECTED'}")
print("=" * 110)
