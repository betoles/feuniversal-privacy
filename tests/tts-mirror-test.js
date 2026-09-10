import { soundManager } from '../js/services/sound-service.js';
import { AIConnector } from '../js/services/ai-connector.js';
import { isRTL, t } from '../js/data/i18n.js';
import { PrayerCorpusService } from '../js/services/prayer-corpus-service.js';
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

async function runTTSMirrorTest() {
  console.log('====================================================');
  console.log('TEST DE AUDITORIA FASE 2: AUDIO TTS, MIRROR & FAITHGPT');
  console.log('====================================================');

  let passed = true;

  // 1. Verificación RTL
  console.log('1. Verificando deteccion RTL...');
  const rtlLangs = ['ar', 'ur', 'he'];
  const ltrLangs = ['es', 'en', 'fr', 'pt', 'it', 'de', 'ru', 'hi', 'zh', 'ja', 'bn', 'id', 'sw'];
  
  rtlLangs.forEach(l => {
    if (!isRTL(l)) {
      console.error('isRTL devolvio false para ' + l);
      passed = false;
    }
  });

  ltrLangs.forEach(l => {
    if (isRTL(l)) {
      console.error('isRTL devolvio true para ' + l);
      passed = false;
    }
  });
  console.log('   Reglas RTL y LTR 100% correctas.');

  // 2. Verificación de Prompts en AIConnector
  console.log('2. Verificando prompts liturgicos multi-idioma en AIConnector...');
  const promptES = AIConnector.buildLiturgicalSystemPrompt('catolicismo', 'es');
  const promptAR = AIConnector.buildLiturgicalSystemPrompt('islam', 'ar');
  const promptJA = AIConnector.buildLiturgicalSystemPrompt('sintoismo', 'ja');
  const promptSW = AIConnector.buildLiturgicalSystemPrompt('ancestral_indigena', 'sw');

  if (!promptES.includes('Español') || !promptAR.includes('العربية') || !promptJA.includes('日本語') || !promptSW.includes('Kiswahili')) {
    console.error('Falla en la resolucion de nombres de idioma en los prompts de IA');
    passed = false;
  } else {
    console.log('   Nombres de idioma y formulas liturgicas generadas con precision.');
  }

  // 3. Verificación de Oraciones con Guía Fonética y Rituales
  console.log('3. Verificando integridad de oraciones, fonetica y rituales...');
  const prayerES = await PrayerCorpusService.getPrayerById('ARCANGEL_MIGUEL_ESPADA', 'es');
  if (prayerES) {
    const hasTranslation = !!(prayerES.textoTraducido || prayerES.traducciones);
    if (!hasTranslation || !prayerES.textoOriginal || !prayerES.guiaFonetica || !prayerES.ritualesAsociados) {
      console.error('Campos faltantes en oracion maestra:', prayerES);
      passed = false;
    } else {
      console.log('   Oracion maestra validada con textoTraducido, fonetica y ritualesAsociados.');
      console.log('      Ritual:', JSON.stringify(prayerES.ritualesAsociados));
    }
  } else {
    console.error('No se encontro ARCANGEL_MIGUEL_ESPADA');
    passed = false;
  }

  // 4. Verificación de lectura TTS mock
  console.log('4. Verificando configuracion TTS en SoundService...');
  if (soundManager && typeof soundManager.speakPrayer === 'function') {
    console.log('   Metodo speakPrayer presente en soundManager.');
  } else {
    console.error('soundManager.speakPrayer no disponible');
    passed = false;
  }

  console.log('====================================================');
  if (passed) {
    console.log('TODOS LOS TESTS DE FASE 2 PASARON EXITOSAMENTE (100% PASS)');
    process.exit(0);
  } else {
    console.error('ALGUNAS PRUEBAS DE FASE 2 FALLARON');
    process.exit(1);
  }
}

runTTSMirrorTest().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
