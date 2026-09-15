/**
 * SCRIPTORIUM VIEW COMPONENT - GRAN BIBLIOTECA DE LAS SAGRADAS ESCRITURAS
 * FeUniversal - Faith & Prayers
 * 
 * Soporte de Lectura Continua Fluida ◀ / ▶, Motor de Búsqueda Indexado (FTS),
 * Renderizado Exhaustivo Versículo por Versículo y Resaltado Dinámico.
 */

import { SCRIPTURES_CATALOG, getAdjacentScriptures, getScriptureById, getScriptureBookTitle, getScriptureSection, getScriptureOrigLang, formatChapterLabel } from '../data/scriptures-catalog.js';
import { ScriptureSearchEngine } from '../services/scripture-search-engine.js';
import { ScriptureCorpusService } from '../services/scripture-corpus-service.js';
import { StorageService } from '../services/storage-service.js';
import { SocialShareComponent } from './social-share.js';
import { TranslationReportModalComponent } from './translation-report-modal.js';
import { cleanScriptureTextNLP } from '../utils/text-sanitizer.js';
import { renderIcon } from './icons.js';
import { t, isRTL } from '../data/i18n.js';

export class ScripturesViewComponent {
  constructor() {
    this.container = typeof document !== 'undefined' ? document.getElementById('view-scriptures') : null;
    this.currentScripture = this.getDefaultScriptureForUser();
    this.socialShare = new SocialShareComponent();
    this.reportModal = new TranslationReportModalComponent();
    this.searchQuery = '';
    this.highlightVerse = null;
    this.hasUserManuallySelected = false;
    this.boundKeyHandler = this.handleKeyboardNav.bind(this);
  }

  static getScriptureForTradition(tradId) {
    const mapTradToScripture = {
      'islam': 'islam',                       // El Sagrado Corán
      'mormonismo': 'mormonismo',             // El Libro de Mormón
      'catolicismo': 'catolicismo',           // La Santa Biblia · Nuevo Testamento
      'pentecostal': 'catolicismo',           // La Santa Biblia · Nuevo Testamento
      'ortodoxia': 'catolicismo',             // La Santa Biblia · Nuevo Testamento
      'adventista': 'catolicismo',            // La Santa Biblia · Nuevo Testamento
      'testigos_jehova': 'catolicismo',       // La Santa Biblia · Nuevo Testamento
      'hebreo_salmos': 'hebreo_salmos',       // El Tanaj & Tehilim
      'vedica': 'vedica',                     // El Srimad Bhagavad Gita
      'budismo': 'budismo',                   // El Dhammapada
      'espiritismo': 'espiritismo',           // El Tao Te King
      'santeria_yoruba': 'catolicismo'        // La Santa Biblia / Salmos
    };

    const targetTrad = mapTradToScripture[tradId];
    if (targetTrad) {
      return SCRIPTURES_CATALOG.find(s => s.tradicion === targetTrad) || null;
    }
    return null;
  }

  getDefaultScriptureForUser() {
    const prefs = StorageService.getPreferences();
    const activas = (prefs && prefs.tradicionesActivas) || [];
    
    // Auto-detectar la escritura de la tradición del usuario
    if (activas.length > 0) {
      for (const trad of activas) {
        const found = ScripturesViewComponent.getScriptureForTradition(trad);
        if (found) return found;
      }
    }

    return SCRIPTURES_CATALOG[0];
  }

  syncWithUserTradition(force = false) {
    if (force || !this.hasUserManuallySelected) {
      this.currentScripture = this.getDefaultScriptureForUser();
      this.hasUserManuallySelected = false;
    }
  }

  render() {
    if (!this.container) return;

    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    // Sincronizar automáticamente si la escritura actual no pertenece a las tradiciones activas del usuario
    if (!this.hasUserManuallySelected) {
      this.currentScripture = this.getDefaultScriptureForUser();
    }

    this.container.innerHTML = `
      <div class="altar-hero" style="padding: 20px 16px 14px;">
        <div style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #6366f1); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);">
          ${renderIcon('nav_scriptures')}
        </div>
        <h2 style="font-family: var(--font-sacred); font-size: 1.6rem; margin: 0 0 6px; color: var(--text-primary);">${t('scriptures_title', lang)}</h2>
        <p class="scripture-hero-desc">
          ${t('scriptures_desc', lang)}
        </p>

        <!-- MOTOR DE BÚSQUEDA INDEXADO FTS (CITAS & VERSÍCULOS EN TIEMPO REAL) -->
        <div class="scripture-controls-wrap" style="margin-bottom: 12px;">
          <div class="crystal-card" style="padding: 8px 14px; display: flex; align-items: center; gap: 10px; background: var(--glass-inset); border: 1px solid var(--glass-border); border-radius: var(--radius-md);">
            <span style="color: var(--accent-cyan); display: flex; align-items: center;">${renderIcon('ui_search')}</span>
            <input type="text" id="input-search-scriptures" placeholder="${t('scriptures_search_placeholder', lang)}" style="flex: 1; background: transparent; border: none; outline: none; color: var(--text-primary); font-family: var(--font-main); font-size: 0.85rem;" value="${this.searchQuery}">
            ${this.searchQuery ? `<button type="button" id="btn-clear-search" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 2px 6px; font-size: 0.8rem;">✕</button>` : ''}
          </div>

          <!-- CONTENEDOR FLOTANTE DE RESULTADOS PREDICTIVOS -->
          <div id="search-results-dropdown" style="display: none; position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: var(--radius-md); max-height: 280px; overflow-y: auto; padding: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"></div>
        </div>

        <!-- CÁPSULA TÁCTIL GLASSMORPHIC DE ESCRITURAS (CERO DESBORDAMIENTOS) -->
        <div class="scripture-controls-wrap">
          <button type="button" id="btn-open-scripture-picker" class="hud-sound-pill" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--glass-surface-2); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; box-sizing: border-box; text-align: left; transition: all var(--transition-fast);">
            <span style="display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden;">
              <span style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('nav_scriptures')}</span>
              <span id="label-selected-scripture" style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${getScriptureBookTitle(this.currentScripture, lang)}: ${formatChapterLabel(this.currentScripture, lang)} (${this.currentScripture.versiculoNumero})</span>
            </span>
            <span style="color: var(--accent-cyan); font-size: 0.75rem; flex-shrink: 0; padding-left: 8px; display: flex; align-items: center;">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- LECTOR DE PERGAMINO DE CRISTAL (CONTENEDOR DINÁMICO RESPONSIVO) -->
      <div id="scripture-card-wrapper" class="scripture-card-container">
        ${this.renderScriptureCardHtml(this.currentScripture, lang)}
      </div>
    `;

    this.attachEvents();
    this.updateScriptureDisplay();
  }

  formatVersesHtml(rawText, isRTL = false) {
    if (!rawText) return '';
    const cleanedText = cleanScriptureTextNLP(rawText);
    const lines = cleanedText.split('\n').map(l => l.trim()).filter(Boolean);

    return lines.map((line, idx) => {
      // Detectar si la línea empieza con un número de versículo (ej. "1.", "255.", "47.")
      const match = line.match(/^(\d+)\.\s*(.+)$/);
      let vNum = idx + 1;
      let vContent = line;

      if (match) {
        vNum = match[1];
        vContent = match[2];
      }

      const isHighlighted = this.highlightVerse && parseInt(vNum, 10) === parseInt(this.highlightVerse, 10);

      return `
        <div class="verse-row ${isHighlighted ? 'verse-highlighted' : ''}" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: flex-start; ${isHighlighted ? 'background: rgba(234, 179, 8, 0.15); border-radius: 6px; padding: 6px 8px; border-left: 3px solid var(--accent-gold);' : ''}">
          <span class="verse-num-badge" style="font-size: 0.70rem; font-weight: 800; color: var(--accent-gold); opacity: 0.9; min-width: 22px; flex-shrink: 0; padding-top: 3px; font-family: var(--font-mono); text-align: ${isRTL ? 'left' : 'right'};">${vNum}.</span>
          <div class="verse-text-body" style="flex: 1; min-width: 0; font-size: ${isRTL ? '1.40rem' : '1.02rem'}; line-height: ${isRTL ? '1.85' : '1.75'}; color: var(--text-primary); text-align: ${isRTL ? 'right' : 'left'};">${vContent}</div>
        </div>
      `;
    }).join('');
  }

  renderScriptureCardHtml(item, lang) {
    const translationText = (item.traducciones && (item.traducciones[lang] || item.traducciones.es || Object.values(item.traducciones)[0])) || item.textoOriginal || '';
    const adj = getAdjacentScriptures(item.id);
    const isOrigRTL = item.dir === 'rtl';
    const isTranslationRTL = isRTL(lang);

    const currChapNum = (typeof adj.currentIndex === 'number' && !isNaN(adj.currentIndex)) ? (adj.currentIndex + 1) : (item.capituloNumero || 1);
    const totalChapsInBook = (typeof adj.totalInBook === 'number' && !isNaN(adj.totalInBook) && adj.totalInBook > 0) ? adj.totalInBook : 1;
    const chapterProgressText = (t('scriptures_chapter_of', lang) || 'Cap. {current} de {total}')
      .replace('{current}', currChapNum)
      .replace('{curr}', currChapNum)
      .replace('{total}', totalChapsInBook);

    return `
      <div class="crystal-card" style="padding: 24px 18px; position: relative; border: 1px solid rgba(234, 179, 8, 0.35);">
        
        <!-- BARRA SUPERIOR DE NAVEGACIÓN SECUENCIAL (LECTURA CONTINUA) -->
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 6px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px dashed var(--glass-border); width: 100%; box-sizing: border-box;">
          <button type="button" id="btn-prev-chapter-top" class="btn-crystal btn-nav-chapter ${adj.prev ? '' : 'disabled'}" style="padding: 7px 10px; font-size: 0.76rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 38px; min-width: 0; white-space: nowrap; ${adj.prev ? 'cursor: pointer;' : 'opacity: 0.35; pointer-events: none;'}" title="${t('scriptures_title_prev_chap', lang)}">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0;"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span style="overflow: hidden; text-overflow: ellipsis;">${t('scriptures_previous', lang)}</span>
          </button>

          <button type="button" id="btn-toc-quick" class="hud-pill dot-gold" style="font-size: 0.72rem; font-weight: 800; padding: 6px 10px; cursor: pointer; border: 1px solid rgba(234,179,8,0.4); white-space: nowrap; justify-self: center;" title="${t('scriptures_title_all_chaps', lang)}">
            <span>${chapterProgressText}</span>
            <span style="font-size: 0.68rem; opacity: 0.8; margin-left: 4px;">▼</span>
          </button>

          <button type="button" id="btn-next-chapter-top" class="btn-crystal btn-nav-chapter ${adj.next ? '' : 'disabled'}" style="padding: 7px 10px; font-size: 0.76rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 38px; min-width: 0; white-space: nowrap; ${adj.next ? 'cursor: pointer;' : 'opacity: 0.35; pointer-events: none;'}" title="${t('scriptures_title_next_chap', lang)}">
            <span style="overflow: hidden; text-overflow: ellipsis;">${t('scriptures_next', lang)}</span>
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <!-- Cabecera del Capítulo -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px dashed var(--glass-border);">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px;">
              <span class="hud-pill dot-gold" style="font-size: 0.70rem; font-weight: 800;">${getScriptureBookTitle(item, lang).toUpperCase()}</span>
              ${getScriptureSection(item, lang) ? `<span class="hud-pill dot-cyan" style="font-size: 0.65rem;">${getScriptureSection(item, lang)}</span>` : ''}
            </div>
            <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 4px 0 2px; color: var(--text-primary); line-height: 1.35;">${formatChapterLabel(item, lang)}</h3>
            <div style="font-size: 0.76rem; color: var(--accent-cyan); font-weight: 700;">${t('scriptures_full_passage', lang)}</div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button id="btn-share-scripture" class="btn-crystal btn-crystal-gold" style="padding: 7px 14px; font-size: 0.78rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
              <span style="display: flex;">${renderIcon('ui_share_nodes')}</span>
              <span>${t('share_prayer', lang)}</span>
            </button>
          </div>
        </div>

        <!-- CUADRÍCULA PARALELA DE LECTURA (1 COLUMNA EN MÓVIL / MODO ESPEJO 2 COLUMNAS EN IPAD & DESKTOP) -->
        <div class="scripture-panes-wrapper">
          <!-- MODO ESPEJO: TEXTO LITÚRGICO ORIGINAL (RTL/LTR) -->
          <div class="pane-sacred" style="padding: 18px; background: rgba(0,0,0,0.25); border-radius: var(--radius-md); border: 1px solid var(--glass-border); box-sizing: border-box; width: 100%; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 0.72rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.06em;">${t('scriptures_root_text', lang)}</span>
              <span class="hud-pill dot-green" style="font-size: 0.68rem;">${getScriptureOrigLang(item, lang)}</span>
            </div>
            
            <div style="direction: ${item.dir || 'ltr'}; font-family: 'Amiri', 'Cinzel', Georgia, serif; flex: 1;">
              ${this.formatVersesHtml(item.textoOriginal, isOrigRTL)}
            </div>

            <!-- FONÉTICA LITÚRGICA -->
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--glass-border);">
              <div style="font-size: 0.68rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 4px;">${t('scriptures_phonetics', lang)}</div>
              <div style="font-family: var(--font-mono); font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6;">
                ${item.foneticaLiturgica || '—'}
              </div>
            </div>
          </div>

          <!-- TRADUCCIÓN CANÓNICA OFICIAL CON VERSÍCULOS NUMERADOS -->
          <div class="pane-translation-block" style="padding: 18px; background: var(--glass-inset); border-radius: var(--radius-md); border: 1px solid var(--glass-border); box-sizing: border-box; width: 100%; min-width: 0;">
            <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; border-bottom: 1px dashed var(--glass-border); padding-bottom: 6px;">
              ${t('scriptures_verified_translation', lang)} (${lang.toUpperCase()}):
            </div>
            <div style="direction: ${isTranslationRTL ? 'rtl' : 'ltr'}; flex: 1;">
              ${this.formatVersesHtml(translationText, isTranslationRTL)}
            </div>
          </div>
        </div>

        <!-- BARRA INFERIOR ERGONÓMICA DE NAVEGACIÓN CONTINUA (AL FINALIZAR LA LECTURA) -->
        <div class="scripture-nav-bottom" style="display: flex; gap: 8px; align-items: stretch; justify-content: space-between; margin-bottom: 16px; margin-top: 20px; position: relative; z-index: 5; width: 100%; box-sizing: border-box; clear: both;">
          <button type="button" id="btn-prev-chapter-bottom" class="btn-crystal ${adj.prev ? '' : 'disabled'}" style="flex: 1 1 0; min-width: 0; min-height: 46px; padding: 8px 10px; font-size: 0.80rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: flex-start; gap: 6px; box-sizing: border-box; ${adj.prev ? 'cursor: pointer;' : 'opacity: 0.35; pointer-events: none;'}">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0;"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <div style="text-align: start; min-width: 0; flex: 1; overflow: hidden;">
              <div style="font-size: 0.60rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.15; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t('scriptures_previous', lang)}</div>
              <div style="font-size: 0.76rem; font-weight: 800; color: var(--text-primary); line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${adj.prev ? formatChapterLabel(adj.prev, lang) : t('scriptures_beginning_book', lang)}</div>
            </div>
          </button>

          <button type="button" id="btn-next-chapter-bottom" class="btn-crystal ${adj.next ? '' : 'disabled'}" style="flex: 1 1 0; min-width: 0; min-height: 46px; padding: 8px 10px; font-size: 0.80rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: flex-end; gap: 6px; box-sizing: border-box; ${adj.next ? 'cursor: pointer;' : 'opacity: 0.35; pointer-events: none;'}">
            <div style="text-align: end; min-width: 0; flex: 1; overflow: hidden;">
              <div style="font-size: 0.60rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.15; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t('scriptures_next', lang)}</div>
              <div style="font-size: 0.76rem; font-weight: 800; color: var(--text-primary); line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${adj.next ? formatChapterLabel(adj.next, lang) : t('scriptures_end_book', lang)}</div>
            </div>
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; flex-shrink: 0;"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div style="text-align: center; border-top: 1px dashed var(--glass-border); padding-top: 10px;">
          <button id="btn-report-scripture" class="btn-crystal" style="font-size: 0.76rem; width: 100%; color: var(--text-secondary); padding: 9px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="display: flex; color: var(--accent-gold);">${renderIcon('ui_dove')}</span>
            <span>${t('report_content', lang)}</span>
          </button>
        </div>
      </div>
    `;
  }

  async updateScriptureDisplay() {
    const wrapper = document.getElementById('scripture-card-wrapper');
    const labelEl = document.getElementById('label-selected-scripture');
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    if (labelEl && this.currentScripture) {
      labelEl.innerText = `${getScriptureBookTitle(this.currentScripture, lang)}: ${formatChapterLabel(this.currentScripture, lang)} (${this.currentScripture.versiculoNumero || ''})`;
    }

    // Carga asíncrona no bloqueante de texto enriquecido si aún no está en memoria para el idioma activo
    if (this.currentScripture && (!this.currentScripture.textoOriginal || !this.currentScripture.traducciones || !this.currentScripture.traducciones[lang])) {
      try {
        const fullChap = await ScriptureCorpusService.getChapter(this.currentScripture.id, lang);
        if (fullChap) {
          const mergedTrads = {
            ...(this.currentScripture.traducciones || {}),
            ...(fullChap.traducciones || {})
          };
          this.currentScripture = {
            ...this.currentScripture,
            ...fullChap,
            traducciones: mergedTrads
          };
        }
      } catch (e) {
        console.warn('Carga diferida de capítulo:', e);
      }
    }

    if (wrapper && this.currentScripture) {
      wrapper.innerHTML = this.renderScriptureCardHtml(this.currentScripture, lang);
      this.attachEventsToCard();
    }
  }

  async navigateToScripture(scripture, targetVerse = null, scrollToTop = false) {
    if (!scripture) return;
    this.currentScripture = scripture;
    this.highlightVerse = targetVerse;
    this.hasUserManuallySelected = true;
    await this.updateScriptureDisplay();

    // Si hay un versículo resaltado, hacer scroll suave hacia él
    if (targetVerse) {
      setTimeout(() => {
        const highlightedEl = document.querySelector('.verse-highlighted');
        if (highlightedEl) {
          highlightedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 60);
    } else if (scrollToTop) {
      setTimeout(() => {
        const wrapper = document.getElementById('scripture-card-wrapper');
        if (wrapper) {
          const headerOffset = 80;
          const elementPosition = wrapper.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      }, 40);
    }
  }

  handleKeyboardNav(e) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    
    if (this.container && this.container.offsetParent !== null) {
      const adj = getAdjacentScriptures(this.currentScripture.id);
      if (e.key === 'ArrowLeft' && adj.prev) {
        this.navigateToScripture(adj.prev, null, false);
      } else if (e.key === 'ArrowRight' && adj.next) {
        this.navigateToScripture(adj.next, null, false);
      }
    }
  }

  attachEvents() {
    window.removeEventListener('keydown', this.boundKeyHandler);
    window.addEventListener('keydown', this.boundKeyHandler);

    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const pickerBtn = document.getElementById('btn-open-scripture-picker');
    if (pickerBtn) {
      pickerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        SacredScripturePicker.open({
          currentScriptureId: this.currentScripture.id,
          onSelect: (selectedScripture) => {
            this.navigateToScripture(selectedScripture, null, true);
          }
        });
      });
    }

    const searchInput = document.getElementById('input-search-scriptures');
    const dropdown = document.getElementById('search-results-dropdown');
    const clearBtn = document.getElementById('btn-clear-search');

    if (searchInput && dropdown) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        this.searchQuery = query;
        if (!query) {
          dropdown.style.display = 'none';
          return;
        }

        const results = ScriptureSearchEngine.search(query);
        if (results.length === 0) {
          dropdown.innerHTML = `<div style="padding: 10px; font-size: 0.78rem; color: var(--text-muted); text-align: center;">${t('scriptures_no_verses_found', lang)}</div>`;
          dropdown.style.display = 'block';
        } else {
          dropdown.innerHTML = results.map(r => `
            <div class="search-result-row" data-id="${r.id}" data-verse="${r.verseNumber || ''}" style="padding: 8px 10px; border-radius: var(--radius-sm); cursor: pointer; border-bottom: 1px dashed var(--glass-border); transition: background 0.2s ease;">
              <div style="font-size: 0.82rem; font-weight: 800; color: var(--accent-gold);">${r.title}</div>
              <div style="font-size: 0.74rem; color: var(--text-secondary); line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.snippet}</div>
            </div>
          `).join('');
          dropdown.style.display = 'block';

          dropdown.querySelectorAll('.search-result-row').forEach(row => {
            row.addEventListener('click', () => {
              const id = row.getAttribute('data-id');
              const vNum = row.getAttribute('data-verse');
              const found = getScriptureById(id);
              if (found) {
                this.navigateToScripture(found, vNum, true);
                dropdown.style.display = 'none';
              }
            });
          });
        }
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.searchQuery = '';
          searchInput.value = '';
          dropdown.style.display = 'none';
        });
      }
    }

    this.attachEventsToCard();
  }

  attachEventsToCard() {
    const adj = getAdjacentScriptures(this.currentScripture.id);

    const prevTop = document.getElementById('btn-prev-chapter-top');
    if (prevTop && adj.prev) {
      prevTop.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToScripture(adj.prev, null, false);
      });
    }

    const nextTop = document.getElementById('btn-next-chapter-top');
    if (nextTop && adj.next) {
      nextTop.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToScripture(adj.next, null, false);
      });
    }

    const prevBottom = document.getElementById('btn-prev-chapter-bottom');
    if (prevBottom && adj.prev) {
      prevBottom.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToScripture(adj.prev, null, true);
      });
    }

    const nextBottom = document.getElementById('btn-next-chapter-bottom');
    if (nextBottom && adj.next) {
      nextBottom.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToScripture(adj.next, null, true);
      });
    }

    const tocBtn = document.getElementById('btn-toc-quick');
    if (tocBtn) {
      tocBtn.addEventListener('click', (e) => {
        e.preventDefault();
        SacredScripturePicker.open({
          currentScriptureId: this.currentScripture.id,
          initialBookKey: this.currentScripture.libroKey,
          onSelect: (selectedScripture) => {
            this.navigateToScripture(selectedScripture, null, true);
          }
        });
      });
    }

    const shareBtn = document.getElementById('btn-share-scripture');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.socialShare.open(this.currentScripture);
      });
    }

    const reportBtn = document.getElementById('btn-report-scripture');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        this.reportModal.open(this.currentScripture);
      });
    }
  }
}


