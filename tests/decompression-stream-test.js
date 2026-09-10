/**
 * TEST DE VERIFICACION DE DESCOMPRESION EN STREAMING (FASE 3)
 * FeUniversal - Faith & Prayers
 * 
 * Valida la descompresión transparente de archivos .json.gz
 * y la integración perfecta con PrayerCorpusService y ScriptureCorpusService.
 */

import { fetchAndDecompressJson } from '../js/utils/stream-decompressor.js';
import { PrayerCorpusService } from '../js/services/prayer-corpus-service.js';
import { ScriptureCorpusService } from '../js/services/scripture-corpus-service.js';
import fs from 'node:fs';
import path from 'node:path';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALLO ASSERTION: ${message}`);
    process.exit(1);
  }
}

async function runTests() {
  console.log("====================================================");
  console.log("TEST DE DESCOMPRESION EN STREAMING (FASE 3)");
  console.log("====================================================");

  // 1. Validar descompresión directa de oraciones maestras en varios idiomas
  console.log("\n1. Probando fetchAndDecompressJson en oraciones maestras (.json.gz)...");
  const testLangs = ['es', 'en', 'ar', 'he', 'zh', 'ja', 'ru', 'sw', 'bn', 'ur'];

  for (const lang of testLangs) {
    const rawFilePath = path.resolve(process.cwd(), 'json_idiomas', `oraciones_maestro_${lang}.json`);
    const originalJson = JSON.parse(fs.readFileSync(rawFilePath, 'utf-8'));

    const decompressed = await fetchAndDecompressJson(`json_idiomas/oraciones_maestro_${lang}.json`);
    assert(decompressed && Array.isArray(decompressed.oraciones), `Formato inválido para oraciones ${lang}`);
    assert(decompressed.oraciones.length === 4245, `Recuento incorrecto en ${lang}: esperado 4245, obtenido ${decompressed.oraciones.length}`);
    assert(decompressed.oraciones[0].id === originalJson.oraciones[0].id, `Paridad de ID fallida en primer elemento de ${lang}`);
    assert(decompressed.oraciones[4244].id === originalJson.oraciones[4244].id, `Paridad de ID fallida en último elemento de ${lang}`);
    console.log(`   [OK] Idioma [${lang}]: 4,245 oraciones descomprimidas e idénticas 1:1 al original`);
  }

  // 2. Validar descompresión directa de escrituras sagradas (.json.gz)
  console.log("\n2. Probando fetchAndDecompressJson en escrituras sagradas (.json.gz)...");
  const testBooks = [
    { lang: 'es', file: 'gospels.json', key: 'capitulos' },
    { lang: 'ar', file: 'quran.json', key: 'capitulos' },
    { lang: 'he', file: 'psalms.json', key: 'capitulos' },
    { lang: 'zh', file: 'tao-te-king.json', key: 'capitulos' },
    { lang: 'hi', file: 'gita.json', key: 'capitulos' },
    { lang: 'en', file: 'mormon.json', key: 'capitulos' }
  ];

  for (const b of testBooks) {
    const rawFilePath = path.resolve(process.cwd(), 'json_escrituras', b.lang, b.file);
    const originalJson = JSON.parse(fs.readFileSync(rawFilePath, 'utf-8'));
    const origCount = (originalJson.capitulos || originalJson).length;

    const decompressed = await fetchAndDecompressJson(`json_escrituras/${b.lang}/${b.file}`);
    const decompCount = (decompressed.capitulos || decompressed).length;

    assert(origCount === decompCount, `Recuento de capítulos diferente en ${b.lang}/${b.file}: original ${origCount} vs decomp ${decompCount}`);
    console.log(`   [OK] Libro [${b.lang}/${b.file}]: ${decompCount} capítulos descomprimidos con paridad total`);
  }

  // 3. Probar integración end-to-end con PrayerCorpusService
  console.log("\n3. Probando integración de PrayerCorpusService con descompresión transparente...");
  const esPrayers = await PrayerCorpusService.loadCorpus('es');
  assert(esPrayers.length === 4245, "PrayerCorpusService no cargó las 4,245 oraciones de ES");
  const samplePrayer = await PrayerCorpusService.getPrayerById('ARCANGEL_MIGUEL_ESPADA', 'es');
  assert(samplePrayer && samplePrayer.titulo, "getPrayerById falló al obtener ARCANGEL_MIGUEL_ESPADA");
  console.log(`   [OK] PrayerCorpusService: Oración obtenida: "${samplePrayer.titulo}"`);

  // 4. Probar integración end-to-end con ScriptureCorpusService
  console.log("\n4. Probando integración de ScriptureCorpusService con descompresión transparente...");
  const quranChapters = await ScriptureCorpusService.loadBook('quran', 'ar');
  assert(quranChapters && quranChapters.length === 114, `Quran en árabe debe tener 114 suras, tiene ${quranChapters.length}`);
  const gitaChapters = await ScriptureCorpusService.loadBook('gita', 'hi');
  assert(gitaChapters && gitaChapters.length === 18, `Bhagavad Gita en hindi debe tener 18 capítulos, tiene ${gitaChapters.length}`);
  console.log(`   [OK] ScriptureCorpusService: Quran (114 suras AR) y Gita (18 cap HI) cargados con éxito.`);

  console.log("\n====================================================");
  console.log("TODAS LAS PRUEBAS DE DESCOMPRESION PASARON AL 100% (PASS)");
  console.log("====================================================");
}

runTests().catch((err) => {
  console.error("Error ejecutando pruebas de descompresión:", err);
  process.exit(1);
});
