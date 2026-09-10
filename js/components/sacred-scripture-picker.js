/**
 * SACRED SCRIPTURE PICKER COMPONENT (GRAN BIBLIOTECA TÁCTIL DE SAGRADAS ESCRITURAS)
 * FeUniversal - Faith & Prayers
 * 
 * Flujo Jerárquico Táctil de Dos Fases:
 * 1. Selección de Obra Sagrada (Libros y Compendios Canónicos)
 * 2. Exploración y Búsqueda de Capítulos / Suras del Libro Elegido
 */

import { 
  SCRIPTURES_CATALOG, 
  SACRED_BOOKS_INDEX, 
  getScriptureById, 
  getScripturesByBook, 
  getLocalizedBookTitle, 
  getLocalizedBookSubtitle, 
  formatChapterLabel 
} from '../data/scriptures-catalog.js';
import { StorageService } from '../services/storage-service.js';
import { renderIcon } from './icons.js';
import { t } from '../data/i18n.js';

export class SacredScripturePicker {
  static modalEl = null;
  static currentScriptureId = null;
  static currentStep = 'books'; // 'books' | 'chapters'
  static selectedBookKey = 'tao';
  static onSelectCallback = null;
  static filterQuery = '';

  static ensureModal() {
    let el = document.getElementById('modal-sacred-scripture-picker');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-sacred-scripture-picker';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 5100; padding: 12px 10px 80px; align-items: center; justify-content: center; box-sizing: border-box; overflow-y: auto;';
      document.body.appendChild(el);
    }
    SacredScripturePicker.modalEl = el;
  }

  static open({ currentScriptureId = 'quran_sura_1_fatiha', onSelect, initialStep = 'books' }) {
    SacredScripturePicker.ensureModal();
    SacredScripturePicker.currentScriptureId = currentScriptureId;
    SacredScripturePicker.onSelectCallback = onSelect;
    SacredScripturePicker.filterQuery = '';

    const currentItem = getScriptureById(currentScriptureId);
    SacredScripturePicker.selectedBookKey = currentItem ? currentItem.libroKey : 'tao';
    SacredScripturePicker.currentStep = initialStep;

    SacredScripturePicker.render();
    SacredScripturePicker.modalEl.style.display = 'flex';
  }

  static close() {
    if (SacredScripturePicker.modalEl) {
      SacredScripturePicker.modalEl.style.display = 'none';
    }
  }

  static render() {
    if (SacredScripturePicker.currentStep === 'books') {
      SacredScripturePicker.renderBooksStep();
    } else {
      SacredScripturePicker.renderChaptersStep();
    }
  }

  /**
   * FASE 1: SELECTOR DE OBRAS SAGRADAS (LIBROS CANÓNICOS)
   */
  static booksTab = 'my_faith'; // 'my_faith' | 'all'

  static renderBooksStep() {
    const query = SacredScripturePicker.filterQuery.trim().toLowerCase();
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const userTraditions = (prefs && prefs.tradicionesActivas) || [];

    // Libros de mi fe vs todos
    const myFaithBooks = SACRED_BOOKS_INDEX.filter(b => userTraditions.includes(b.tradicion));
    const booksToDisplay = (SacredScripturePicker.booksTab === 'my_faith' && myFaithBooks.length > 0 && !query) 
      ? myFaithBooks 
      : SACRED_BOOKS_INDEX;

    // Filtrar libros si hay consulta de búsqueda
    const filteredBooks = booksToDisplay.filter(b => {
      if (!query) return true;
      const bTitle = getLocalizedBookTitle(b.key, lang) || b.title;
      const bSub = getLocalizedBookSubtitle(b.key, lang) || b.subtitle;
      const full = `${bTitle} ${bSub} ${b.language}`.toLowerCase();
      return full.includes(query);
    });

    const libraryTitle = t('scriptures_library_title', lang) || 'Biblioteca de Sagradas Escrituras';
    const libraryDesc = t('scriptures_library_subtitle', lang) || 'Elige la Obra Sagrada que deseas explorar para acceder a sus capítulos completos.';
    const tabMyFaithLabel = t('scriptures_tab_my_faith', lang) || 'Libros de Mi Fe';
    const tabAllLabel = t('scriptures_tab_all_library', lang) || 'Toda la Biblioteca';
    const searchPlaceholder = t('scriptures_search_placeholder', lang) || 'Buscar libro sagrado o tradición...';
    const closeLabel = t('close_label', lang) || 'Cerrar';
    const yourFaithBadge = t('scriptures_your_faith_badge', lang) || 'Tu Fe';
    const singleBadge = t('scriptures_chapters_badge_single', lang) || 'texto';
    const multiBadge = t('scriptures_chapters_badge_multi', lang) || 'capítulos';
    const noBooksFoundTpl = t('scriptures_no_books_found', lang) || 'No se encontraron libros sagrados para «{query}».';
    const noBooksFound = noBooksFoundTpl.replace('{query}', SacredScripturePicker.filterQuery);

    SacredScripturePicker.modalEl.innerHTML = `
      <div class="crystal-card" style="max-width: 540px; width: 100%; margin: auto; padding: 22px 16px 26px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box;">
        <button id="btn-close-scripture-picker" class="btn-modal-close" title="${closeLabel}">${renderIcon('ui_close')}</button>

        <!-- Cabecera de Nivel 1 -->
        <div style="text-align: center; margin-bottom: 14px;">
          <div style="width: 46px; height: 46px; margin: 0 auto 6px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #6366f1); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 18px rgba(56, 189, 248, 0.45);">
            ${renderIcon('nav_scriptures')}
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 0 0 4px; color: var(--text-primary); hyphens: none; -webkit-hyphens: none; word-break: keep-all; line-height: 1.25;">${libraryTitle}</h3>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">${libraryDesc}</p>
        </div>

        <!-- PESTAÑAS DE DEVOCIÓN ACTIVA / BIBLIOTECA UNIVERSAL (ICONOS SVG PUROS) -->
        ${myFaithBooks.length > 0 ? `
          <div style="display: flex; gap: 8px; margin-bottom: 14px;">
            <button type="button" id="tab-my-faith-books" class="btn-crystal ${SacredScripturePicker.booksTab === 'my_faith' ? 'btn-crystal-gold' : ''}" style="flex: 1; padding: 10px 8px; font-size: 0.80rem; font-weight: 800; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; text-align: center; gap: 7px; cursor: pointer;">
              <span style="display: inline-flex; width: 16px; height: 16px; color: var(--accent-gold); flex-shrink: 0;">${renderIcon('ui_sparkles')}</span>
              <span style="text-align: center; line-height: 1.25;">${tabMyFaithLabel} (${myFaithBooks.length})</span>
            </button>
            <button type="button" id="tab-all-books" class="btn-crystal ${SacredScripturePicker.booksTab === 'all' ? 'btn-crystal-gold' : ''}" style="flex: 1; padding: 10px 8px; font-size: 0.80rem; font-weight: 800; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; text-align: center; gap: 7px; cursor: pointer;">
              <span style="display: inline-flex; width: 16px; height: 16px; color: var(--accent-cyan); flex-shrink: 0;">${renderIcon('nav_explore')}</span>
              <span style="text-align: center; line-height: 1.25;">${tabAllLabel} (${SACRED_BOOKS_INDEX.length})</span>
            </button>
          </div>
        ` : ''}

        <!-- BARRA DE BÚSQUEDA DE LIBROS -->
        <div style="margin-bottom: 16px;">
          <div class="crystal-card" style="padding: 9px 12px; display: flex; align-items: center; gap: 8px; background: var(--glass-inset); border: 1px solid var(--glass-border); border-radius: var(--radius-md);">
            <span style="color: var(--accent-cyan); display: flex; align-items: center;">${renderIcon('ui_search')}</span>
            <input type="text" id="input-filter-books" placeholder="${searchPlaceholder}" style="flex: 1; background: transparent; border: none; outline: none; color: var(--text-primary); font-family: var(--font-main); font-size: 0.85rem;" value="${SacredScripturePicker.filterQuery}">
          </div>
        </div>
        <!-- LISTA DE OBRAS SAGRADAS (TARJETAS DE CRISTAL INTERACTIVAS MULTILÍNEA) -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; max-height: 52vh; overflow-y: auto; padding-right: 4px;">
          ${filteredBooks.length === 0 ? `
            <div style="text-align: center; padding: 30px 16px; color: var(--text-muted); font-size: 0.85rem;">
              ${noBooksFound}
            </div>
          ` : filteredBooks.map(b => {
            const isMyTradition = userTraditions.includes(b.tradicion);
            const isCurrentlyActiveBook = SacredScripturePicker.selectedBookKey === b.key;
            const bTitle = getLocalizedBookTitle(b.key, lang) || b.title;
            const bSub = getLocalizedBookSubtitle(b.key, lang) || b.subtitle;
            const chapUnit = b.totalChapters === 1 ? singleBadge : multiBadge;

            return `
              <button type="button" class="report-type-chip ${isCurrentlyActiveBook ? 'active' : ''} book-select-card" data-book-key="${b.key}" style="width: 100%; padding: 14px 16px; text-align: left; display: flex; align-items: flex-start; gap: 14px; box-sizing: border-box; height: auto; min-height: 70px; flex-shrink: 0; transition: all var(--transition-fast); cursor: pointer;">
                <div style="width: 42px; height: 42px; border-radius: var(--radius-sm); background: rgba(234, 179, 8, 0.12); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); flex-shrink: 0; border: 1px solid rgba(234, 179, 8, 0.25); margin-top: 2px;">
                  <span style="width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">${renderIcon(b.iconKey)}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
                    <span style="font-size: 1.02rem; font-weight: 800; color: var(--text-primary); line-height: 1.35; flex: 1; min-width: 160px;">${bTitle}</span>
                    <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                      <span class="hud-pill dot-gold" style="font-size: 0.70rem; font-weight: 800; padding: 3px 8px;">${b.totalChapters} ${chapUnit}</span>
                      ${isMyTradition ? `<span class="hud-pill dot-green" style="font-size: 0.65rem; padding: 2px 7px;">${yourFaithBadge}</span>` : ''}
                    </div>
                  </div>
                  <div style="font-size: 0.83rem; color: var(--text-secondary); opacity: 0.95; line-height: 1.45; white-space: normal;">
                    ${bSub}
                  </div>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" id="btn-cancel-picker" class="btn-crystal" style="padding: 10px 18px; font-size: 0.82rem; min-height: 44px; cursor: pointer;">${closeLabel}</button>
        </div>
      </div>
    `;

    SacredScripturePicker.attachBooksEvents();
  }

  static attachBooksEvents() {
    const closeBtn = document.getElementById('btn-close-scripture-picker');
    const doneBtn = document.getElementById('btn-done-scripture-picker');
    const cancelBtn = document.getElementById('btn-cancel-picker');
    const filterInput = document.getElementById('input-filter-books');
    const tabMyFaith = document.getElementById('tab-my-faith-books');
    const tabAll = document.getElementById('tab-all-books');

    if (closeBtn) closeBtn.addEventListener('click', () => SacredScripturePicker.close());
    if (doneBtn) doneBtn.addEventListener('click', () => SacredScripturePicker.close());
    if (cancelBtn) cancelBtn.addEventListener('click', () => SacredScripturePicker.close());

    if (tabMyFaith) {
      tabMyFaith.addEventListener('click', () => {
        SacredScripturePicker.booksTab = 'my_faith';
        SacredScripturePicker.filterQuery = '';
        SacredScripturePicker.renderBooksStep();
      });
    }

    if (tabAll) {
      tabAll.addEventListener('click', () => {
        SacredScripturePicker.booksTab = 'all';
        SacredScripturePicker.filterQuery = '';
        SacredScripturePicker.renderBooksStep();
      });
    }

    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        SacredScripturePicker.filterQuery = e.target.value;
        SacredScripturePicker.renderBooksStep();
        const updatedInput = document.getElementById('input-filter-books');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.selectionStart = updatedInput.selectionEnd = updatedInput.value.length;
        }
      });
    }

    const bookCards = SacredScripturePicker.modalEl.querySelectorAll('.book-select-card');
    bookCards.forEach(card => {
      card.addEventListener('click', () => {
        const bookKey = card.getAttribute('data-book-key');
        SacredScripturePicker.selectedBookKey = bookKey;
        SacredScripturePicker.filterQuery = '';
        SacredScripturePicker.currentStep = 'chapters';
        SacredScripturePicker.render();
      });
    });
  }

  /**
   * FASE 2: EXPLORADOR DE CAPÍTULOS / SURAS DEL LIBRO SELECCIONADO
   */
  static renderChaptersStep() {
    const bookKey = SacredScripturePicker.selectedBookKey;
    const bookInfo = SACRED_BOOKS_INDEX.find(b => b.key === bookKey) || SACRED_BOOKS_INDEX[0];
    const bookChapters = getScripturesByBook(bookKey);
    const query = SacredScripturePicker.filterQuery.trim().toLowerCase();
    const activeId = SacredScripturePicker.currentScriptureId;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const bookTitle = getLocalizedBookTitle(bookKey, lang) || bookInfo.title;
    const bookSubtitle = getLocalizedBookSubtitle(bookKey, lang) || bookInfo.subtitle;
    const closeLabel = t('close_label', lang) || 'Cerrar';
    const backToCatalog = t('scriptures_back_to_catalog', lang) || 'Volver al Catálogo de Obras';
    const singleBadge = t('scriptures_chapters_badge_single', lang) || 'texto';
    const multiBadge = t('scriptures_chapters_badge_multi', lang) || 'capítulos';
    const readingBadge = t('scriptures_reading_badge', lang) || 'Leyendo';

    const searchPlaceholderTpl = t('scriptures_search_chapter_placeholder', lang) || 'Buscar en {book}...';
    const searchPlaceholder = searchPlaceholderTpl.replace('{book}', bookTitle);

    const noChaptersTpl = t('scriptures_no_chapters_found', lang) || 'No se encontraron capítulos que coincidan con «{query}».';
    const noChaptersMsg = noChaptersTpl.replace('{query}', SacredScripturePicker.filterQuery);

    // Filtrar capítulos por búsqueda
    const filtered = bookChapters.filter(s => {
      if (!query) return true;
      const full = `
        ${s.capitulo} 
        ${s.seccion || ''} 
        ${s.capituloNumero} 
        ${s.versiculoNumero} 
        ${s.textoOriginal} 
        ${s.foneticaLiturgica || ''} 
        ${Object.values(s.traducciones || {}).join(' ')}
      `.toLowerCase();
      return full.includes(query);
    });

    // Agrupar por sección interna del libro (e.g. Daojing vs Dejing)
    const groups = {};
    filtered.forEach(s => {
      const gTitle = s.seccion || bookTitle;
      if (!groups[gTitle]) groups[gTitle] = [];
      groups[gTitle].push(s);
    });

    const totalChapsUnit = bookChapters.length === 1 ? singleBadge : multiBadge;

    SacredScripturePicker.modalEl.innerHTML = `
      <div class="crystal-card" style="max-width: 580px; width: 100%; margin: auto; padding: 22px 18px 26px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box;">
        <button id="btn-close-scripture-picker" class="btn-modal-close" title="${closeLabel}">${renderIcon('ui_close')}</button>

        <!-- BARRA DE RETORNO AL CATÁLOGO DE LIBROS -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed var(--glass-border);">
          <button type="button" id="btn-back-to-books" class="btn-crystal" style="padding: 8px 14px; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; color: var(--accent-gold); cursor: pointer; min-height: 40px;">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span>‹ ${backToCatalog}</span>
          </button>
          <span class="hud-pill dot-gold" style="font-size: 0.72rem; font-weight: 800;">${bookChapters.length} ${totalChapsUnit}</span>
        </div>

        <!-- Cabecera de la Obra Seleccionada -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="width: 46px; height: 46px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 18px var(--accent-gold-glow);">
            <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">${renderIcon(bookInfo.iconKey)}</span>
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.35rem; margin: 0 0 4px; color: var(--text-primary); line-height: 1.3;">${bookTitle}</h3>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.4; white-space: normal;">${bookSubtitle}</p>
        </div>

        <!-- BARRA DE BÚSQUEDA INTERNA DE CAPÍTULOS -->
        <div style="margin-bottom: 16px;">
          <div class="crystal-card" style="padding: 9px 12px; display: flex; align-items: center; gap: 8px; background: var(--glass-inset); border: 1px solid var(--glass-border); border-radius: var(--radius-md);">
            <span style="color: var(--accent-cyan); display: flex; align-items: center;">${renderIcon('ui_search')}</span>
            <input type="text" id="input-filter-chapters" placeholder="${searchPlaceholder}" style="flex: 1; background: transparent; border: none; outline: none; color: var(--text-primary); font-family: var(--font-main); font-size: 0.86rem;" value="${SacredScripturePicker.filterQuery}">
          </div>
        </div>

        <!-- LISTA DE CAPÍTULOS AGRUPADOS (TARJETAS MULTILÍNEA) -->
        <div id="chapters-list-container" style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; max-height: 48vh; overflow-y: auto; padding-right: 4px;">
          ${Object.keys(groups).length === 0 ? `
            <div style="text-align: center; padding: 28px 16px; color: var(--text-muted); font-size: 0.84rem;">
              ${noChaptersMsg}
            </div>
          ` : Object.entries(groups).map(([groupTitle, items]) => {
            const groupUnit = items.length === 1 ? singleBadge : multiBadge;
            return `
              <div>
                <div style="font-size: 0.74rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 6px; border-bottom: 1px dashed var(--glass-border); padding-bottom: 4px;">
                  <span>${groupTitle}</span>
                  <span style="font-size: 0.68rem; color: var(--text-secondary); opacity: 0.85;">${items.length} ${groupUnit}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${items.map(s => {
                    const isSelected = s.id === activeId;
                    const previewText = s.traducciones[lang] || s.traducciones.es || s.textoOriginal || '';
                    const shortExcerpt = previewText.replace(/^\d+\.\s*/, '').substring(0, 95) + '...';
                    const chapterTitle = formatChapterLabel(s, lang) || s.capitulo;

                    return `
                      <button type="button" class="report-type-chip ${isSelected ? 'active' : ''} chapter-item-btn" data-scripture-id="${s.id}" style="width: 100%; padding: 13px 14px; text-align: left; display: flex; align-items: flex-start; gap: 12px; box-sizing: border-box; height: auto; min-height: 56px; flex-shrink: 0; transition: all var(--transition-fast); cursor: pointer;">
                        <div style="width: 32px; height: 32px; border-radius: var(--radius-sm); background: ${isSelected ? 'var(--accent-gold)' : 'var(--glass-surface-3)'}; color: ${isSelected ? '#000000' : 'var(--accent-gold)'}; font-weight: 900; font-family: var(--font-mono); font-size: 0.80rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--glass-border); margin-top: 2px;">
                          ${s.capituloNumero}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0;">
                          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
                            <span style="font-size: 0.94rem; font-weight: 800; color: var(--text-primary); line-height: 1.35;">${chapterTitle}</span>
                            ${isSelected ? `<span class="hud-pill dot-gold" style="font-size: 0.65rem; padding: 2px 7px;">${readingBadge}</span>` : ''}
                          </div>
                          <span style="font-size: 0.78rem; color: var(--text-secondary); opacity: 0.9; line-height: 1.4; white-space: normal;">${shortExcerpt}</span>
                        </div>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <button type="button" id="btn-back-to-books-footer" class="btn-crystal" style="padding: 10px 16px; font-size: 0.82rem; min-height: 44px; cursor: pointer;">‹ ${backToCatalog}</button>
          <button type="button" id="btn-done-scripture-picker" class="btn-crystal btn-crystal-gold" style="padding: 10px 18px; font-size: 0.82rem; font-weight: 800; min-height: 44px; cursor: pointer;">${closeLabel}</button>
        </div>
      </div>
    `;

    SacredScripturePicker.attachChaptersEvents();
  }

  static attachChaptersEvents() {
    const closeBtn = document.getElementById('btn-close-scripture-picker');
    const doneBtn = document.getElementById('btn-done-scripture-picker');
    const backBtn = document.getElementById('btn-back-to-books');
    const backFooterBtn = document.getElementById('btn-back-to-books-footer');
    const filterInput = document.getElementById('input-filter-chapters');

    if (closeBtn) closeBtn.addEventListener('click', () => SacredScripturePicker.close());
    if (doneBtn) doneBtn.addEventListener('click', () => SacredScripturePicker.close());

    const goBack = () => {
      SacredScripturePicker.filterQuery = '';
      SacredScripturePicker.currentStep = 'books';
      SacredScripturePicker.render();
    };

    if (backBtn) backBtn.addEventListener('click', goBack);
    if (backFooterBtn) backFooterBtn.addEventListener('click', goBack);

    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        SacredScripturePicker.filterQuery = e.target.value;
        SacredScripturePicker.renderChaptersStep();
        const updatedInput = document.getElementById('input-filter-chapters');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.selectionStart = updatedInput.selectionEnd = updatedInput.value.length;
        }
      });
    }

    const chapterButtons = SacredScripturePicker.modalEl.querySelectorAll('.chapter-item-btn');
    chapterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-scripture-id');
        const selected = getScriptureById(id);
        if (selected && SacredScripturePicker.onSelectCallback) {
          SacredScripturePicker.onSelectCallback(selected);
          SacredScripturePicker.close();
        }
      });
    });
  }
}
