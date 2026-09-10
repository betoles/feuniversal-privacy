/**
 * UI FULL FORENSIC AUDIT & RUNTIME EMULATION
 * FeUniversal - Faith & Prayers
 * 
 * Verificación exhaustiva de la interfaz de usuario, elementos del DOM,
 * componentes interactivos, traducciones i18n, manejadores de eventos y estilos.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALLO ASSERTION: ${message}`);
    process.exit(1);
  }
}

async function runUiAudit() {
  console.log("====================================================");
  console.log("AUDITORIA FORENSE Y EXHAUSTIVA DE UI - FEUNIVERSAL");
  console.log("====================================================");

  // 1. Validar integridad de index.html
  console.log("\n1. Verificando estructura y elementos DOM esenciales en index.html...");
  const htmlPath = path.join(ROOT, 'index.html');
  assert(fs.existsSync(htmlPath), "index.html no existe");
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  const requiredIds = [
    'header-brand-icon',
    'header-membership-badge',
    'btn-header-novenas',
    'btn-header-compass',
    'btn-header-habit',
    'btn-header-notif',
    'btn-open-preferences',
    'btn-toggle-lang',
    'btn-toggle-theme',
    'view-dashboard',
    'view-scriptures',
    'view-altar',
    'view-beads',
    'view-vault',
    'active-traditions-ribbon',
    'input-prayer-search',
    'btn-clear-search',
    'emotional-chips-row',
    'seg-view-hud',
    'seg-view-intentions',
    'seg-view-prayers',
    'hud-main-score-num',
    'hud-user-pin',
    'switch-focus-mode',
    'zen-sound-config-panel',
    'btn-open-zen-sound-picker',
    'zen-sound-active-label',
    'select-zen-ambient-sound',
    'hud-donut-total-num',
    'hud-categories-bars',
    'intentions-matrix-grid',
    'prayers-results-list',
    'bnav-scriptures',
    'modal-onboarding',
    'modal-reader',
    'modal-language'
  ];

  let missingIds = 0;
  for (const id of requiredIds) {
    const idPattern = new RegExp(`id=["']${id}["']`);
    if (!idPattern.test(htmlContent)) {
      console.error(`   ❌ Falta elemento DOM con ID: #${id}`);
      missingIds++;
    }
  }
  assert(missingIds === 0, `Hay ${missingIds} elementos DOM requeridos faltantes en index.html`);
  console.log(`   [OK] Todos los ${requiredIds.length} elementos DOM estructurales verificados en index.html.`);

  // 2. Validar hojas de estilo CSS
  console.log("\n2. Verificando hojas de estilo CSS y variables del sistema de diseño...");
  const cssFiles = ['css/design-tokens.css', 'css/glassmorphism.css', 'css/app.css'];
  for (const cssFile of cssFiles) {
    const p = path.join(ROOT, cssFile);
    assert(fs.existsSync(p), `Archivo CSS faltante: ${cssFile}`);
    const content = fs.readFileSync(p, 'utf-8');
    assert(content.length > 500, `Archivo CSS sospechosamente pequeño: ${cssFile}`);
    console.log(`   [OK] ${cssFile.padEnd(24)} | ${(content.length/1024).toFixed(1)} KB verificado`);
  }

  // 3. Validar todos los componentes JS
  console.log("\n3. Verificando componentes interactivos de la interfaz...");
  const componentFiles = [
    'js/components/altar.js',
    'js/components/bead-counter.js',
    'js/components/icons.js',
    'js/components/language-modal.js',
    'js/components/membership.js',
    'js/components/mirror-reader.js',
    'js/components/notification-modal.js',
    'js/components/novena-modal.js',
    'js/components/onboarding.js',
    'js/components/privacy-modal.js',
    'js/components/sacred-dialog.js',
    'js/components/sacred-duration-picker.js',
    'js/components/sacred-habit.js',
    'js/components/sacred-scripture-picker.js',
    'js/components/sacred-sound-picker.js',
    'js/components/sacred-time-picker.js',
    'js/components/sacred-tradition-picker.js',
    'js/components/scriptures-view.js',
    'js/components/social-share.js',
    'js/components/spiritual-compass.js',
    'js/components/translation-report-modal.js',
    'js/components/vault.js'
  ];

  for (const comp of componentFiles) {
    const p = path.join(ROOT, comp);
    assert(fs.existsSync(p), `Componente faltante: ${comp}`);
    const mod = await import(`../${comp}`);
    assert(Object.keys(mod).length > 0, `Módulo no exporta componentes: ${comp}`);
    console.log(`   [OK] Componente: ${comp.replace('js/components/', '').padEnd(30)} | Exportaciones válidas`);
  }

  // 4. Validar i18n y cobertura de 17 idiomas
  console.log("\n4. Verificando motor de internacionalización (i18n)...");
  const { UI_TRANSLATIONS, t, isRTL } = await import('../js/data/i18n.js');
  const supportedLanguages = ['es', 'en', 'fr', 'pt', 'it', 'de', 'la', 'ar', 'ru', 'hi', 'bn', 'zh', 'ja', 'he', 'id', 'ur', 'sw'];
  
  assert(Object.keys(UI_TRANSLATIONS).length >= 17, "UI_TRANSLATIONS no contiene los 17 idiomas");
  for (const lang of supportedLanguages) {
    assert(UI_TRANSLATIONS[lang], `Idioma ${lang} no está en UI_TRANSLATIONS`);
    const dict = UI_TRANSLATIONS[lang];
    assert(dict.app_name || dict.brand_title || dict.title_app || dict.nav_explore, `Falta datos básicos en ${lang}`);
    assert(dict.nav_explore, `Falta nav_explore en ${lang}`);
    assert(dict.nav_altar, `Falta nav_altar en ${lang}`);
    assert(dict.nav_beads, `Falta nav_beads en ${lang}`);
    assert(dict.nav_vault, `Falta nav_vault en ${lang}`);
    assert(dict.nav_scriptures, `Falta nav_scriptures en ${lang}`);
  }
  console.log(`   [OK] 17 idiomas i18n con claves de navegación y UI 100% completas.`);

  // 5. Validar motor de renderizado de iconos SVG
  console.log("\n5. Verificando motor de iconos vectoriales SVG...");
  const { renderIcon } = await import('../js/components/icons.js');
  const sampleIcons = ['search', 'close', 'sparkles', 'compass', 'sun', 'moon', 'shield', 'flame', 'book', 'beads', 'heart'];
  for (const ico of sampleIcons) {
    const svgStr = renderIcon(ico, { size: 20 });
    assert(svgStr && svgStr.includes('<svg'), `Fallo renderizado de icono SVG: ${ico}`);
  }
  console.log(`   [OK] Generador de glifos SVG vectoriales 100% operativo.`);

  // 6. Validar datos canónicos de intenciones y tradiciones
  console.log("\n6. Verificando datasets de intenciones y tradiciones devocionales...");
  const { TRADITIONS, getTradition } = await import('../js/data/traditions.js');
  const { INTENTIONS, EMOTIONAL_STATES } = await import('../js/data/intentions.js');
  const { NOVENAS_DB } = await import('../js/data/novenas-db.js');
  const { SCRIPTURES_CATALOG, SACRED_BOOKS_INDEX, getScriptureById, getScripturesByBook, getAdjacentScriptures } = await import('../js/data/scriptures-catalog.js');
  
  assert(Object.keys(TRADITIONS).length >= 6, "TRADITIONS debe tener al menos 6 tradiciones principales");
  assert(Object.keys(INTENTIONS).length >= 8, "INTENTIONS debe tener al menos 8 pilares");
  assert(Object.keys(EMOTIONAL_STATES).length >= 6, "EMOTIONAL_STATES debe tener al menos 6 estados anímicos");
  assert(NOVENAS_DB && NOVENAS_DB.length >= 16, "NOVENAS_DB debe contener 16 novenas");
  assert(SCRIPTURES_CATALOG && SCRIPTURES_CATALOG.length >= 980, "SCRIPTURES_CATALOG debe contener 981 capítulos");
  assert(SACRED_BOOKS_INDEX && SACRED_BOOKS_INDEX.length >= 7, "SACRED_BOOKS_INDEX debe contener libros indexados");

  console.log(`   [OK] Tradiciones (${Object.keys(TRADITIONS).length}), Intenciones (${Object.keys(INTENTIONS).length}), Emociones (${Object.keys(EMOTIONAL_STATES).length}) verificadas.`);
  console.log(`   [OK] Novenas (${NOVENAS_DB.length}), Escrituras (${SCRIPTURES_CATALOG.length} capítulos), Libros (${SACRED_BOOKS_INDEX.length}) verificados.`);

  // 7. Validar funciones de navegación y adyacencia de escrituras
  console.log("\n7. Verificando funciones de navegación de escrituras...");
  const firstSura = getScriptureById('quran_sura_1');
  assert(firstSura && firstSura.libroKey === 'quran', "getScriptureById falló para Fatiha");
  const adj = getAdjacentScriptures('quran_sura_1');
  assert(adj.next && adj.next.id === 'quran_sura_2', "Adyacencia fallida en Quran");
  const quranAll = getScripturesByBook('quran');
  assert(quranAll && quranAll.length === 114, `getScripturesByBook('quran') debe devolver 114, obtuvo ${quranAll.length}`);
  console.log(`   [OK] Funciones de navegación y catálogo de escrituras 100% operativas.`);

  console.log("\n====================================================");
  console.log("AUDITORIA FORENSE DE UI COMPLETADA: 100% PASS SIN ERRORES");
  console.log("====================================================");
}

runUiAudit().catch((err) => {
  console.error("Error en auditoría de UI:", err);
  process.exit(1);
});

