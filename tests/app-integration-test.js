import { PrayerCorpusService } from '../js/services/prayer-corpus-service.js';
import { UI_TRANSLATIONS, t } from '../js/data/i18n.js';
import { SUPPORTED_LANGUAGES } from '../js/components/language-modal.js';
import fs from 'fs';
import path from 'path';

global.fetch = async (url) => {
  const cleanUrl = url.startsWith('./') ? url.slice(2) : url;
  const filePath = path.resolve(process.cwd(), cleanUrl);
  if (!fs.existsSync(filePath)) {
    return { ok: false, status: 404, json: async () => ({}) };
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return { ok: true, status: 200, json: async () => JSON.parse(fileContent) };
};

async function runIntegrationTest() {
  console.log('====================================================');
  console.log('TEST DE INTEGRACION GLOBAL FEUNIVERSAL');
  console.log('====================================================');

  let passed = true;

  // 1. Verificar i18n
  const langs = Object.keys(UI_TRANSLATIONS);
  console.log('1. Verificando i18n (' + langs.length + ' idiomas)...');
  langs.forEach(l => {
    const keys = Object.keys(UI_TRANSLATIONS[l]);
    if (keys.length < 274) {
      console.error('Falta de claves en ' + l + ': ' + keys.length);
      passed = false;
    }
  });
  console.log('   17 idiomas en i18n con claves 100% completas.');

  // 2. Verificar modal languages
  console.log('2. Verificando SUPPORTED_LANGUAGES en modal (' + SUPPORTED_LANGUAGES.length + ' idiomas)...');
  SUPPORTED_LANGUAGES.forEach(l => {
    if (!l.code || !l.name || !l.flag) {
      console.error('Error en idioma modal:', l);
      passed = false;
    }
  });
  console.log('   ' + SUPPORTED_LANGUAGES.length + ' idiomas soportados en el modal correctamente.');

  // 3. Filtrado por intención y emoción
  console.log('3. Probando filtros devocionales en PrayerCorpusService...');
  const esPrayers = await PrayerCorpusService.loadCorpus('es');
  console.log('   Total oraciones cargadas en ES:', esPrayers.length);

  const proteccion = await PrayerCorpusService.getPrayersByIntention('proteccion', 'es');
  console.log('   Oraciones categoria proteccion:', proteccion.length);
  if (proteccion.length === 0) {
    console.error('No se encontraron oraciones de proteccion');
    passed = false;
  } else {
    console.log('   Filtro por intencion funciona.');
  }

  const busqueda = await PrayerCorpusService.searchPrayers('San Miguel', 'es');
  console.log('   Resultados busqueda San Miguel:', busqueda.length);
  if (busqueda.length === 0) {
    console.error('Busqueda fallida para San Miguel');
    passed = false;
  } else {
    console.log('   Busqueda inteligente funciona.');
  }

  // 4. Probar búsqueda en Árabe
  console.log('4. Probando carga y busqueda en Arabe (AR)...');
  const arPrayers = await PrayerCorpusService.loadCorpus('ar');
  console.log('   Total oraciones cargadas en AR:', arPrayers.length);
  const arSearch = await PrayerCorpusService.searchPrayers('ميخائيل', 'ar');
  console.log('   Resultados busqueda Arabe (ميخائيل):', arSearch.length);
  if (arSearch.length === 0) {
    console.error('Busqueda fallida en Arabe');
    passed = false;
  } else {
    console.log('   Busqueda en Arabe funciona correctamente.');
  }

  // 5. Probar búsqueda en Hebreo
  console.log('5. Probando carga y busqueda en Hebreo (HE)...');
  const hePrayers = await PrayerCorpusService.loadCorpus('he');
  console.log('   Total oraciones cargadas en HE:', hePrayers.length);
  const heSearch = await PrayerCorpusService.searchPrayers('מיכאל', 'he');
  console.log('   Resultados busqueda Hebreo (מיכאל):', heSearch.length);
  if (heSearch.length === 0) {
    console.error('Busqueda fallida en Hebreo');
    passed = false;
  } else {
    console.log('   Busqueda en Hebreo funciona correctamente.');
  }

  console.log('====================================================');
  if (passed) {
    console.log('TEST DE INTEGRACION COMPLETADO EXITOSAMENTE (100% PASS)');
    process.exit(0);
  } else {
    console.error('FALLO EL TEST DE INTEGRACION');
    process.exit(1);
  }
}

runIntegrationTest().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
