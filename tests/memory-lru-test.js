import { PrayerCorpusService } from '../js/services/prayer-corpus-service.js';
import fs from 'fs';
import path from 'path';

global.fetch = async (url) => {
  const cleanUrl = url.startsWith('./') ? url.slice(2) : url;
  const filePath = path.resolve(process.cwd(), cleanUrl);
  if (!fs.existsSync(filePath)) {
    return { ok: false, status: 404, json: async () => ({}) };
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return { ok: true, status: 200, json: async () => JSON.parse(content) };
};

async function runMemoryLRUTest() {
  console.log('====================================================');
  console.log('TEST DE ESTRES DE MEMORIA RAM Y CONTROL LRU');
  console.log('====================================================');

  const languages = ['es', 'en', 'fr', 'pt', 'it', 'de', 'ru', 'ar', 'he', 'zh', 'ja', 'hi', 'bn', 'id', 'ur', 'sw'];
  console.log('Cargando secuencialmente ' + languages.length + ' idiomas maestros (~90 MB brutos)...');

  const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log('Memoria inicial Heap: ' + initialMemory.toFixed(2) + ' MB');

  let maxCacheSizeObserved = 0;
  let maxIndexSizeObserved = 0;

  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    const corpus = await PrayerCorpusService.loadCorpus(lang);
    
    if (PrayerCorpusService.memoryCache.size > maxCacheSizeObserved) {
      maxCacheSizeObserved = PrayerCorpusService.memoryCache.size;
    }
    if (PrayerCorpusService.searchIndex.size > maxIndexSizeObserved) {
      maxIndexSizeObserved = PrayerCorpusService.searchIndex.size;
    }

    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(' [Paso ' + (i + 1) + '/' + languages.length + '] Idioma: ' + lang.toUpperCase() + ' | Oraciones: ' + corpus.length + ' | RAM Cache: ' + PrayerCorpusService.memoryCache.size + ' | LRU Order: [' + PrayerCorpusService.lruOrder.join(', ') + '] | Heap: ' + currentMemory.toFixed(2) + ' MB');
  }

  console.log('--- VERIFICACION DE REGLAS DE MEMORIA ---');
  console.log('Limite configurado MAX_RAM_LANGUAGES: ' + PrayerCorpusService.MAX_RAM_LANGUAGES);
  console.log('Maximo tamano observado en memoryCache: ' + maxCacheSizeObserved);
  console.log('Maximo tamano observado en searchIndex: ' + maxIndexSizeObserved);

  let passed = true;

  if (maxCacheSizeObserved > PrayerCorpusService.MAX_RAM_LANGUAGES) {
    console.error('FALLO: memoryCache supero el limite de idiomas en RAM.');
    passed = false;
  } else {
    console.log('EXITO: memoryCache nunca excedio el limite maximo configurado.');
  }

  if (maxIndexSizeObserved > PrayerCorpusService.MAX_RAM_LANGUAGES) {
    console.error('FALLO: searchIndex supero el limite de indices en RAM.');
    passed = false;
  } else {
    console.log('EXITO: searchIndex se desalojo correctamente en sincronia con LRU.');
  }

  // Verificar busqueda y recuperacion en el idioma activo
  console.log('--- VERIFICACION DE BUSQUEDA Y ACCESO A DATOS ---');
  const swPrayer = await PrayerCorpusService.getPrayerById('ARCANGEL_MIGUEL_ESPADA', 'sw');
  if (swPrayer && swPrayer.titulo) {
    console.log('getPrayerById ARCANGEL_MIGUEL_ESPADA sw exitoso: ' + swPrayer.titulo);
  } else {
    console.error('FALLO getPrayerById en sw');
    passed = false;
  }

  // Recargar un idioma antiguo para probar que se recarga fluidamente
  console.log('--- VERIFICACION DE RE-CARGA DE IDIOMA PREVIAMENTE DESALOJADO ---');
  const esCorpus = await PrayerCorpusService.loadCorpus('es');
  console.log('Re-cargado ES | Items: ' + esCorpus.length + ' | RAM Cache actual: [' + Array.from(PrayerCorpusService.memoryCache.keys()).join(', ') + ']');

  if (PrayerCorpusService.memoryCache.has('es') && PrayerCorpusService.memoryCache.size <= PrayerCorpusService.MAX_RAM_LANGUAGES) {
    console.log('EXITO: Idioma re-cargado correctamente y mantenido dentro del margen LRU.');
  } else {
    console.error('FALLO re-carga de idioma desalojado.');
    passed = false;
  }

  console.log('====================================================');
  if (passed) {
    console.log('TODOS LOS TESTS DE MEMORIA Y CACHE PASARON CON EXITO (100% PASS)');
    process.exit(0);
  } else {
    console.error('ALGUNAS PRUEBAS FALLARON');
    process.exit(1);
  }
}

runMemoryLRUTest().catch(err => {
  console.error('Error no capturado:', err);
  process.exit(1);
});
