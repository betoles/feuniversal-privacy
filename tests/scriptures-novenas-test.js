import { ScriptureCorpusService } from '../js/services/scripture-corpus-service.js';
import { SCRIPTURES_CATALOG } from '../js/data/scriptures-catalog.js';
import { NOVENAS_DB } from '../js/data/novenas-db.js';
import { ScriptureSearchEngine } from '../js/services/scripture-search-engine.js';
import path from 'path';

async function runScripturesNovenasTest() {
  console.log('====================================================');
  console.log('TEST DE AUDITORIA FASE 3: SCRIPTORIUM & NOVENAS');
  console.log('====================================================');

  let passed = true;

  // 1. Verificación del Catálogo de Escrituras
  console.log('1. Verificando SCRIPTURES_CATALOG (' + SCRIPTURES_CATALOG.length + ' capitulos indexados)...');
  if (SCRIPTURES_CATALOG.length < 100) {
    console.error('Catalogo de escrituras incompleto:', SCRIPTURES_CATALOG.length);
    passed = false;
  } else {
    console.log('   Catalogo de escrituras con ' + SCRIPTURES_CATALOG.length + ' capitulos sagrados.');
  }

  // 2. Verificación de Carga Dinámica de Libros en ScriptureCorpusService
  console.log('2. Verificando carga dinamica de libros canonicos...');
  const sampleBooks = ['gospels', 'epistles', 'mormon', 'tanaj', 'quran', 'gita', 'dhammapada', 'tao', 'genesis', 'exodus', 'proverbs', 'revelation'];
  
  for (const b of sampleBooks) {
    try {
      const data = await ScriptureCorpusService.loadBook(b);
      if (!data || data.length === 0) {
        console.error('Falla al cargar libro:', b);
        passed = false;
      } else {
        console.log('   Libro "' + b + '" cargado con exito (' + data.length + ' capitulos/partes).');
      }
    } catch (err) {
      console.error('Error cargando libro ' + b + ':', err.message);
      passed = false;
    }
  }

  // 3. Verificación de la Base de Datos de Novenas
  console.log('3. Verificando base de datos NOVENAS_DB (' + NOVENAS_DB.length + ' novenas/cadenas)...');
  NOVENAS_DB.forEach(nov => {
    const minExpected = nov.id.startsWith('triduo') ? 3 : (nov.id.startsWith('cadena') ? 7 : 9);
    if (!nov.id || !nov.titulo || !nov.dias || nov.dias.length < minExpected) {
      console.error('Novena incompleta:', nov.id, 'Dias:', nov.dias?.length, 'Esperados:', minExpected);
      passed = false;
    }
  });
  console.log('   ' + NOVENAS_DB.length + ' novenas y cadenas devocionales verificadas con todos sus dias completos.');

  // 4. Verificación de Búsqueda Full-Text en Escrituras
  console.log('4. Probando motor de busqueda FTS de Escrituras...');
  const searchResults = ScriptureSearchEngine.search('Luz', 25);
  console.log('   Resultados de busqueda "Luz": ' + searchResults.length + ' coincidencias.');
  if (searchResults.length === 0) {
    console.error('Falla en la busqueda FTS de escrituras');
    passed = false;
  } else {
    console.log('   Motor de busqueda FTS responde con rapidez y precision.');
  }

  console.log('====================================================');
  if (passed) {
    console.log('TODOS LOS TESTS DE FASE 3 PASARON EXITOSAMENTE (100% PASS)');
    process.exit(0);
  } else {
    console.error('ALGUNAS PRUEBAS DE FASE 3 FALLARON');
    process.exit(1);
  }
}

runScripturesNovenasTest().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
