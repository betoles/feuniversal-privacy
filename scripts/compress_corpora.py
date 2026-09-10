#!/usr/bin/env python3
"""
Compress Corpora (Gzip Level 9) with Cryptographic SHA-256 Round-Trip Integrity Verification.
FeUniversal Faith & Prayers
"""
import os
import sys
import gzip
import hashlib
import json
import time

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRAYERS_DIR = os.path.join(BASE_DIR, "json_idiomas")
SCRIPTURES_DIR = os.path.join(BASE_DIR, "json_escrituras")

def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def compress_file(src_path: str, dst_path: str) -> tuple:
    """Compresses a file using gzip level 9 and verifies round-trip integrity."""
    with open(src_path, "rb") as f_in:
        raw_data = f_in.read()
    
    orig_sha = sha256_bytes(raw_data)
    orig_size = len(raw_data)
    
    # Compress with level 9
    compressed_data = gzip.compress(raw_data, compresslevel=9)
    comp_size = len(compressed_data)
    
    # Write to destination
    with open(dst_path, "wb") as f_out:
        f_out.write(compressed_data)
        
    # Verify round-trip decompression
    decompressed_data = gzip.decompress(compressed_data)
    decomp_sha = sha256_bytes(decompressed_data)
    
    if orig_sha != decomp_sha:
        raise ValueError(f"Integrity check failed for {src_path}: SHA256 mismatch!")
        
    return orig_size, comp_size

def main():
    start_time = time.time()
    print("=" * 65)
    print("INICIANDO PRECOMPRESION GZIP (NIVEL 9) DE CORPUS SAGRADOS")
    print("=" * 65)
    
    total_raw = 0
    total_comp = 0
    files_processed = 0
    
    # 1. Compress Prayer Master files
    print("\n1. Comprimiendo 17 Archivos Maestros de Oraciones (json_idiomas/)...")
    for filename in sorted(os.listdir(PRAYERS_DIR)):
        if filename.startswith("oraciones_maestro_") and filename.endswith(".json"):
            src = os.path.join(PRAYERS_DIR, filename)
            dst = os.path.join(PRAYERS_DIR, filename + ".gz")
            raw_s, comp_s = compress_file(src, dst)
            total_raw += raw_s
            total_comp += comp_s
            files_processed += 1
            ratio = (1 - (comp_s / raw_s)) * 100
            print(f"   [OK] {filename:32} | {raw_s/1024/1024:5.2f} MB -> {comp_s/1024/1024:5.2f} MB (-{ratio:4.1f}%)")

    # 2. Compress Scripture files
    print("\n2. Comprimiendo 204 Archivos de Escrituras (json_escrituras/)...")
    scripture_langs = sorted([d for d in os.listdir(SCRIPTURES_DIR) if os.path.isdir(os.path.join(SCRIPTURES_DIR, d))])
    
    for lang in scripture_langs:
        lang_dir = os.path.join(SCRIPTURES_DIR, lang)
        book_files = sorted([f for f in os.listdir(lang_dir) if f.endswith(".json") and not f.endswith(".json.gz")])
        lang_raw = 0
        lang_comp = 0
        for b_file in book_files:
            src = os.path.join(lang_dir, b_file)
            dst = os.path.join(lang_dir, b_file + ".gz")
            raw_s, comp_s = compress_file(src, dst)
            lang_raw += raw_s
            lang_comp += comp_s
            total_raw += raw_s
            total_comp += comp_s
            files_processed += 1
        
        ratio = (1 - (lang_comp / lang_raw)) * 100
        print(f"   [OK] Idioma [{lang:2}] ({len(book_files)} libros) | {lang_raw/1024/1024:5.2f} MB -> {lang_comp/1024/1024:5.2f} MB (-{ratio:4.1f}%)")

    elapsed = time.time() - start_time
    total_ratio = (1 - (total_comp / total_raw)) * 100
    
    print("\n" + "=" * 65)
    print("RESUMEN DE COMPRESION Y CERTIFICACION DE INTEGRIDAD")
    print("=" * 65)
    print(f"Archivos procesados y verificados con SHA-256: {files_processed}")
    print(f"Tamano original bruto:   {total_raw / 1024 / 1024:6.2f} MB")
    print(f"Tamano comprimido (.gz): {total_comp / 1024 / 1024:6.2f} MB")
    print(f"Ahorro neto de espacio:  {total_ratio:5.2f}% (Reduccion de {(total_raw - total_comp) / 1024 / 1024:5.2f} MB)")
    print(f"Tiempo total:            {elapsed:.2f} segundos")
    print("=" * 65)

if __name__ == "__main__":
    main()
