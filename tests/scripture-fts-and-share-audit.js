import { ScriptureSearchEngine } from '../js/services/scripture-search-engine.js';
import { SCRIPTURES_CATALOG, getScriptureById } from '../js/data/scriptures-catalog.js';
import { extractScriptureExcerpt, cleanScriptureTextNLP } from '../js/utils/text-sanitizer.js';
import { calculateOptimalTypography } from '../js/components/social-share.js';

console.log('====================================================');
console.log('TEST DE AUDITORÍA FASE E5: MOTOR FTS Y TARJETAS HD');
console.log('====================================================');

let passed = true;

// Mock Canvas context for testing typography and wrapping in Node.js
class MockCanvasContext {
  constructor() {
    this.font = '';
  }
  measureText(str) {
    // Estimación noble de ancho proporcional
    const len = (str || '').length;
    let avgCharWidth = 14;
    const fontMatch = this.font.match(/(\d+)px/);
    if (fontMatch) {
      avgCharWidth = parseInt(fontMatch[1], 10) * 0.55;
    }
    return { width: len * avgCharWidth };
  }
}

// 1. Verificación de Búsqueda FTS Multilingüe
console.log('1. Probando consultas FTS de citas exactas y conceptos...');

const searchTests = [
  { q: 'Juan 3:16', expectedPrefix: 'gospel_john', targetVerse: 16 },
  { q: 'Mateo 5:3', expectedPrefix: 'gospel_matthew', targetVerse: 3 },
  { q: 'Salmo 23', expectedPrefix: 'psalm_', targetVerse: null },
  { q: 'Psalm 91', expectedPrefix: 'psalm_', targetVerse: null },
  { q: 'Sura 1', expectedPrefix: 'quran_sura_1', targetVerse: null },
  { q: 'Surah 114', expectedPrefix: 'quran_sura_114', targetVerse: null },
  { q: 'Tao 1', expectedPrefix: 'tao_chapter_1', targetVerse: null },
  { q: 'Gita 2', expectedPrefix: 'gita_chapter_2', targetVerse: null },
  { q: 'Dhammapada 1', expectedPrefix: 'dhammapada_vagga_1', targetVerse: null },
  { q: '1 Nefi 3:7', expectedPrefix: 'mormon_1nephi_chapter_3', targetVerse: 7 },
  { q: 'Luz', minResults: 1 },
  { q: 'Amor', minResults: 1 },
  { q: 'Paz', minResults: 1 },
  { q: 'Light', minResults: 1 },
  { q: 'Grace', minResults: 1 }
];

let searchPassCount = 0;
for (const st of searchTests) {
  const res = ScriptureSearchEngine.search(st.q);
  if (st.expectedPrefix) {
    const match = res.length > 0 && (res[0].id.includes(st.expectedPrefix) || res[0].id.startsWith(st.expectedPrefix));
    if (match) {
      searchPassCount++;
      console.log(`   [OK] Cita "${st.q}" -> ID resuelto: ${res[0].id} (Versículo: ${res[0].verseNumber || 'Capítulo'})`);
    } else {
      console.error(`   [ERROR] Cita "${st.q}" no resolvió el ID esperado: ${st.expectedPrefix}. Obtenido: ${res[0]?.id}`);
      passed = false;
    }
  } else if (st.minResults) {
    if (res.length >= st.minResults) {
      searchPassCount++;
      console.log(`   [OK] Concepto "${st.q}" -> ${res.length} resultados encontrados.`);
    } else {
      console.error(`   [ERROR] Concepto "${st.q}" no obtuvo resultados.`);
      passed = false;
    }
  }
}

// 2. Verificación de Sanitizador NLP y Excerpting para Tarjetas HD
console.log('\n2. Probando Sanitizador NLP y Extractor de Pasajes para Tarjetas HD...');
const sampleLongText = `1. LIBRO de la generación de Jesucristo, hijo de David, hijo de Abraham.
2. Abraham engendró á Isaac: é Isaac engendró á Jacob: y Jacob engendró á Judas y á sus hermanos:
3. Y Judas engendró de Thamar á Phares y á Zara: y Phares engendró á Esrom: y Esrom engendró á Aram:
4. Y Aram engendró á Aminadab: y Aminadab engendró á Naassón: y Naassón engendró á Salmón:
5. Y Salmón engendró de Rachâb á Booz, y Booz engendró de Ruth á Obed y Obed engendró á Jessé:
6. Y Jessé engendró al rey David: y el rey David engendró á Salomón de la que fué mujer de Urías:
7. Y Salomón engendró á Roboam: y Roboam engendró á Abía: y Abía engendró á Asa:`;

const { excerpt, totalOriginalChars } = extractScriptureExcerpt(sampleLongText, 250);
console.log(`   Texto original: ${totalOriginalChars} chars -> Excerpt para tarjeta: ${excerpt.length} chars`);
console.log(`   Snippet: "${excerpt.substring(0, 80)}..."`);

if (excerpt.length > 0 && !excerpt.includes('{') && !excerpt.includes('}')) {
  console.log('   [OK] Excerpt limpio y libre de artefactos.');
} else {
  console.error('   [ERROR] Excerpt contiene artefactos o está vacío.');
  passed = false;
}

// 3. Verificación de Cálculo Tipográfico y Cero Desborde en Canvas
console.log('\n3. Probando cálculo de tipografía adaptativa para Canvas 1080x1920...');
const mockCtx = new MockCanvasContext();
const maxWidth = 860;
const availableHeight = 850;

const languagesToTest = ['es', 'en', 'fr', 'pt', 'de', 'it', 'ru', 'ar', 'he', 'hi', 'zh', 'ja'];

for (const lang of languagesToTest) {
  const typoResult = calculateOptimalTypography(mockCtx, sampleLongText, lang, maxWidth, availableHeight);
  if (typoResult.lines.length > 0 && typoResult.totalHeight <= availableHeight + 10) {
    console.log(`   [OK] [${lang}] Líneas calculadas: ${typoResult.lines.length} | Altura: ${typoResult.totalHeight}px / Max ${availableHeight}px | Truncado seguro: ${typoResult.isTruncated}`);
  } else {
    console.error(`   [ERROR] [${lang}] Desborde tipográfico detectado: Altura ${typoResult.totalHeight}px excede disponible ${availableHeight}px`);
    passed = false;
  }
}

console.log('\n====================================================');
if (passed) {
  console.log('TODAS LAS PRUEBAS DE FASE E5 PASARON AL 100% (PASS)');
} else {
  console.log('AUDITORÍA FASE E5 CON FALLOS');
  process.exit(1);
}
console.log('====================================================');
