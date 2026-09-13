/**
 * MODAL INTERACTIVO DE NOVENAS Y CADENAS DE ORACIÓN
 * FeUniversal - Faith & Prayers
 * 
 * Gestiona el progreso de 9 días (o 7/40), la lectura del día,
 * oraciones preparatorias, reflexiones y conexión con el Altar Virtual.
 */

import { NOVENAS_DB } from '../data/novenas-db.js?v=9.3.0';
import { StorageService } from '../services/storage-service.js';
import { soundManager } from '../services/sound-service.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { t, isRTL } from '../data/i18n.js';

function getNovenaI18n(obj, lang) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj[lang]) return obj[lang];
  if (obj['es']) return obj['es'];
  if (obj['en']) return obj['en'];
  return Object.values(obj)[0] || '';
}

export class NovenaModalComponent {
  constructor() {
    this.modalId = 'modal-novenas-interactive';
    this.currentNovenaId = 'novena_san_judas_tadeo';
    this.selectedDay = null; // null = follow stored currentDay
    this.initDOM();
  }

  initDOM() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(this.modalId)) return;

    const modal = document.createElement('div');
    modal.id = this.modalId;
    modal.className = 'modal-overlay';
    modal.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(3, 7, 18, 0.82); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); z-index: 6200; overflow-y: auto; -webkit-overflow-scrolling: touch; align-items: flex-start; justify-content: center; padding: 24px 12px 100px; box-sizing: border-box;';

    modal.innerHTML = `
      <div class="crystal-card" style="position: relative; width: 100%; max-width: 580px; margin: auto 0; padding: 28px 22px; box-sizing: border-box; border: 1.5px solid var(--glass-border-highlight); background: var(--glass-surface-modal); border-radius: var(--radius-2xl); box-shadow: 0 24px 60px rgba(0,0,0,0.65);">
        <!-- Botón de Cierre Superior -->
        <button id="btn-close-novenas" class="btn-modal-close-custom" aria-label="Cerrar modal de novenas" style="position: absolute; top: 16px; right: 16px; width: 34px; height: 34px; border-radius: 50%; background: var(--glass-surface-2); border: 1px solid var(--glass-border); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all var(--transition-fast); z-index: 10;">
          <span style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px;">
            ${renderIcon('ui_close')}
          </span>
        </button>

        <!-- Contenedor Dinámico -->
        <div id="novena-modal-body"></div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    const closeBtn = modal.querySelector('#btn-close-novenas');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
  }

  open(novenaId = null) {
    if (novenaId) this.currentNovenaId = novenaId;
    this.selectedDay = null;
    const modal = document.getElementById(this.modalId);
    if (!modal) return;

    this.render();
    modal.style.display = 'flex';
    modal.scrollTop = 0;
  }

  close() {
    const modal = document.getElementById(this.modalId);
    if (modal) modal.style.display = 'none';
  }

  render() {
    const container = document.getElementById('novena-modal-body');
    if (!container) return;

    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const isLangRTL = isRTL(lang);

    const activeTraditions = (Array.isArray(prefs.tradicionesActivas) && prefs.tradicionesActivas.length > 0)
      ? prefs.tradicionesActivas
      : ['catolicismo', 'santeria_yoruba', 'budismo', 'pentecostal', 'hebreo_salmos', 'mormonismo', 'ortodoxia', 'vedica'];

    // Filtrar novenas disponibles según tradiciones activas del usuario + universales
    let availableNovenas = NOVENAS_DB.filter(n => n.tradicion === 'universal' || activeTraditions.includes(n.tradicion));

    // Si la tradición activa es exclusivamente una que no practica novenas (ej: testigos_jehova) y el usuario no está viendo una universal
    const onlyNoNovenaTraditions = activeTraditions.length === 1 && activeTraditions.includes('testigos_jehova') && this.showUniversalOnly !== true;

    if (onlyNoNovenaTraditions) {
      container.innerHTML = `
        <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="text-align: center; padding: 28px 20px; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); border-radius: var(--radius-xl); box-shadow: var(--glass-shadow-md); margin-top: 10px; box-sizing: border-box;">
          <div style="width: 52px; height: 52px; margin: 0 auto 14px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #d97706); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 20px var(--accent-gold-glow);">
            ${renderIcon('ui_dove')}
          </div>
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; margin: 0 0 10px; color: var(--text-primary); line-height: 1.3;">
            ${t('novena_reverence_title', lang) || 'Reverencia y Respeto a tu Sagrada Tradición'}
          </h3>
          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin: 0 auto 20px; max-width: 440px; text-align: justify; hyphens: auto;">
            ${t('novena_reverence_desc', lang) || 'Con mucho respeto y reverencia te informamos que tu honorable tradición no practica novenas o devociones a intercesores, pues su fe se sustenta en la oración directa a Dios y en el estudio de las Sagradas Escrituras.'}
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px; max-width: 380px; margin: 0 auto;">
            <button id="btn-novena-go-scriptures" class="btn-crystal btn-crystal-primary" style="width: 100%; padding: 12px; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: var(--radius-full); cursor: pointer;">
              <span style="display: inline-flex; width: 18px; height: 18px;">${renderIcon('nav_scriptures')}</span>
              <span>${t('novena_reverence_btn_scriptures', lang) || 'Leer las Sagradas Escrituras (Scriptorium)'}</span>
            </button>
            <button id="btn-novena-show-universal" class="btn-crystal" style="width: 100%; padding: 11px; font-weight: 700; font-size: 0.82rem; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: var(--radius-full); color: var(--text-primary); background: var(--glass-surface-2); border: 1px solid var(--glass-border); cursor: pointer;">
              <span style="display: inline-flex; width: 16px; height: 16px; color: var(--accent-gold);">${renderIcon('nav_altar')}</span>
              <span>${t('novena_reverence_btn_universal', lang) || 'Ver Cadena Universal de 7 Días de Sanación'}</span>
            </button>
          </div>
        </div>
      `;

      const scripturesBtn = container.querySelector('#btn-novena-go-scriptures');
      if (scripturesBtn) {
        scripturesBtn.addEventListener('click', () => {
          this.close();
          const scrTab = document.querySelector('.bottom-nav-item[data-tab="scriptures"]');
          if (scrTab) scrTab.click();
        });
      }

      const universalBtn = container.querySelector('#btn-novena-show-universal');
      if (universalBtn) {
        universalBtn.addEventListener('click', () => {
          this.showUniversalOnly = true;
          this.currentNovenaId = 'cadena_7_dias_sanacion';
          this.render();
        });
      }

      return;
    }

    if (!availableNovenas || availableNovenas.length === 0) {
      availableNovenas = NOVENAS_DB;
    }

    let novena = availableNovenas.find(n => n.id === this.currentNovenaId);
    if (!novena) {
      novena = availableNovenas[0];
      this.currentNovenaId = novena.id;
    }

    const progress = StorageService.getNovenaProgress(novena.id);
    const activeDayNumber = this.selectedDay || progress.currentDay || 1;
    const currentDayData = novena.dias.find(d => d.dia === activeDayNumber) || novena.dias[0];
    const isCompleted = progress.completedDays.includes(activeDayNumber);
    const isAllFinished = progress.isFinished || (progress.completedDays.length >= novena.totalDias);

    // Selector de Novenas disponibles (Píldoras con límite de ancho responsivo)
    const novenasNavHTML = availableNovenas.map(n => {
      const isCur = n.id === novena.id;
      const nProg = StorageService.getNovenaProgress(n.id);
      const doneCount = (nProg.completedDays || []).length;
      const novTitle = getNovenaI18n(n.titulo, lang);
      return `
        <button class="btn-crystal novena-pill-btn ${isCur ? 'active-glow-gold' : ''}" data-novena-id="${n.id}" style="font-size: 0.76rem; padding: 7px 12px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; max-width: 240px; box-sizing: border-box;" title="${novTitle}">
          <span style="display: flex; align-items: center; width: 14px; height: 14px; color: var(--accent-gold); flex-shrink: 0;">${renderIcon(n.icono || 'trad_catolicismo')}</span>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${novTitle}</span>
          <span style="font-size: 0.68rem; opacity: 0.85; background: rgba(255,255,255,0.12); padding: 2px 6px; border-radius: 8px; flex-shrink: 0;">${doneCount}/${n.totalDias}</span>
        </button>
      `;
    }).join('');

    // Perlas de progreso de días
    const daysGridHTML = novena.dias.map(d => {
      const isDone = progress.completedDays.includes(d.dia);
      const isSelected = d.dia === activeDayNumber;
      let bgStyle = 'background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); color: var(--text-secondary);';
      
      if (isDone) {
        bgStyle = 'background: linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(217, 119, 6, 0.5)); border: 1.5px solid var(--accent-gold); color: #fff; box-shadow: 0 0 12px var(--accent-gold-glow);';
      } else if (isSelected) {
        bgStyle = 'background: var(--glass-surface-3); border: 2px solid var(--accent-cyan); color: var(--accent-cyan); font-weight: 900; box-shadow: 0 0 12px rgba(56, 189, 248, 0.4); transform: scale(1.08);';
      }

      return `
        <button class="novena-day-pearl" data-day="${d.dia}" style="width: 36px; height: 36px; min-width: 36px; min-height: 36px; max-width: 36px; max-height: 36px; border-radius: 50%; ${bgStyle} display: inline-flex; align-items: center; justify-content: center; text-align: center; cursor: pointer; transition: all var(--transition-fast); padding: 0; position: relative; box-sizing: border-box; flex-shrink: 0;">
          <span style="font-size: 0.85rem; font-weight: 800; line-height: 1; text-align: center; display: inline-flex; align-items: center; justify-content: center;">${d.dia}</span>
          ${isDone ? `<span style="display: flex; align-items: center; justify-content: center; width: 10px; height: 10px; position: absolute; bottom: 2px; color: var(--accent-gold);">${renderIcon('ui_check')}</span>` : ''}
        </button>
      `;
    }).join('');

    const novenaTitleText = getNovenaI18n(novena.titulo, lang);
    const novenaSubText = getNovenaI18n(novena.subtitulo, lang);
    const novenaDescText = getNovenaI18n(novena.descripcion, lang);

    const dayTemaText = getNovenaI18n(currentDayData.tema, lang);
    const dayMeditacionText = getNovenaI18n(currentDayData.meditacion, lang);
    const dayOracionText = getNovenaI18n(currentDayData.oracion, lang);

    const prepOracionText = getNovenaI18n(novena.oracionPreparatoria, lang);
    const finalOracionText = getNovenaI18n(novena.oracionFinal, lang);

    container.innerHTML = `
      <!-- Encabezado del Modal -->
      <div dir="${isLangRTL ? 'rtl' : 'ltr'}" style="text-align: center; margin-bottom: 18px; padding-right: 28px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); color: #fff; box-shadow: 0 0 20px var(--accent-gold-glow); margin-bottom: 8px;">
          <span style="display: flex; align-items: center; justify-content: center; width: 26px; height: 26px;">
            ${renderIcon(novena.icono || 'trad_catolicismo')}
          </span>
        </div>
        <h2 style="font-family: var(--font-display); font-size: 1.45rem; margin: 0 0 4px; color: var(--text-primary); line-height: 1.2;">
          ${novenaTitleText}
        </h2>
        <div style="font-size: 0.82rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 6px; line-height: 1.35;">
          ${novenaSubText}
        </div>
        <p style="font-size: 0.80rem; color: var(--text-secondary); line-height: 1.5; margin: 0 auto; max-width: 460px; text-align: center;">
          ${novenaDescText}
        </p>
      </div>

      <!-- Selector de Ciclos / Novenas -->
      <div dir="${isLangRTL ? 'rtl' : 'ltr'}" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 16px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
        ${novenasNavHTML}
      </div>

      <!-- Perlas de Días (Navegación Interactiva del Ciclo) -->
      <div dir="${isLangRTL ? 'rtl' : 'ltr'}" style="background: var(--glass-inset); border-radius: var(--radius-xl); border: 1.5px solid var(--glass-border); padding: 14px 12px; margin-bottom: 18px; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 0 4px;">
          <span style="font-size: 0.74rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
            ${t('novena_cycle_progress', lang) || 'Progreso del Ciclo'} (${progress.completedDays.length} ${t('of_label', lang) || 'de'} ${novena.totalDias})
          </span>
          ${isAllFinished ? `
            <span style="font-size: 0.72rem; font-weight: 800; color: var(--accent-emerald); display: inline-flex; align-items: center; gap: 4px;">
              <span style="display: flex; width: 12px; height: 12px;">${renderIcon('ui_check')}</span>
              ${t('novena_completed_badge', lang) || '¡Novena Concluida!'}
            </span>
          ` : ''}
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap;">
          ${daysGridHTML}
        </div>
      </div>

      <!-- Tarjeta del Día Seleccionado -->
      <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="background: var(--glass-surface-2); border: 1.5px solid var(--glass-border-highlight); border-radius: var(--radius-xl); padding: 20px 18px; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span style="display: inline-flex; align-items: center; justify-content: center; text-align: center; background: linear-gradient(135deg, var(--accent-gold), #d97706); color: #111; font-weight: 900; font-size: 0.75rem; letter-spacing: 0.04em; padding: 4px 12px; border-radius: var(--radius-full); white-space: nowrap; flex-shrink: 0; line-height: 1; box-shadow: 0 0 10px var(--accent-gold-glow); box-sizing: border-box;">
              ${t('novena_day_prefix', lang) || 'DÍA'} ${activeDayNumber}
            </span>
            <span style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-display); line-height: 1.3; min-width: 0; word-break: break-word;">
              ${dayTemaText}
            </span>
          </div>
          ${isCompleted ? `
            <span style="font-size: 0.72rem; color: var(--accent-gold); font-weight: 800; display: inline-flex; align-items: center; gap: 4px; background: rgba(245, 158, 11, 0.15); padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid var(--accent-gold-glow); flex-shrink: 0; white-space: nowrap;">
              <span style="display: flex; width: 12px; height: 12px;">${renderIcon('ui_check')}</span>
              ${t('novena_day_completed', lang) || 'Cumplido'}
            </span>
          ` : ''}
        </div>

        <!-- Meditación -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--accent-cyan); letter-spacing: 0.05em; margin-bottom: 6px;">
            ${t('novena_section_meditation', lang) || 'Meditación & Intención :'}
          </div>
          <div style="font-size: 0.94rem; color: var(--text-secondary); line-height: 1.6; font-style: italic; text-align: justify; hyphens: auto; word-break: break-word;">
            «${dayMeditacionText}»
          </div>
        </div>

        <!-- Oración del Día -->
        <div style="background: var(--glass-inset); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); padding: 16px 18px; margin-bottom: 18px; box-sizing: border-box;">
          <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--accent-gold); letter-spacing: 0.05em; margin-bottom: 8px;">
            ${t('novena_section_prayer', lang) || 'Plegaria del Día :'}
          </div>
          <div style="font-size: 1.02rem; color: var(--text-primary); line-height: 1.65; font-weight: 500; text-align: justify; hyphens: auto; word-break: break-word;">
            ${dayOracionText}
          </div>
        </div>

        <!-- Botón de Acción Principal (Completar Día) -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="btn-complete-novena-day" class="btn-crystal ${isCompleted ? 'btn-crystal-gold-glow' : 'btn-primary-action'}" style="width: 100%; font-size: 0.92rem; font-weight: 800; padding: 12px 18px; border-radius: var(--radius-full); display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: ${isCompleted ? 'var(--glass-surface-3)' : 'linear-gradient(135deg, var(--accent-gold), #d97706)'}; color: ${isCompleted ? 'var(--text-primary)' : '#111'}; border: ${isCompleted ? '1.5px solid var(--accent-gold)' : 'none'}; box-shadow: 0 4px 16px var(--accent-gold-glow); cursor: pointer; transition: all var(--transition-fast); box-sizing: border-box;">
            ${isCompleted ? `<span style="display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px;">${renderIcon('ui_check')}</span>` : ''}
            <span>${isCompleted ? `${t('novena_day_prefix', lang) || 'Día'} ${activeDayNumber} • ${t('novena_day_consecrated', lang) || 'Consagrado (Toca para repetir)'}` : `${t('novena_pray_and_complete', lang) || 'Rezar y Completar'} (${t('novena_day_prefix', lang) || 'Día'} ${activeDayNumber})`}</span>
          </button>

          <!-- Acciones Secundarias -->
          <div style="display: flex; gap: 8px;">
            <button id="btn-novena-light-candle" class="btn-crystal" style="flex: 1; font-size: 0.8rem; font-weight: 700; padding: 10px 14px; border-radius: var(--radius-full); display: inline-flex; align-items: center; justify-content: center; gap: 6px; color: var(--text-primary); background: var(--glass-surface-2); border: 1px solid var(--glass-border); cursor: pointer; box-sizing: border-box;">
              <span style="display: flex; width: 14px; height: 14px; color: var(--accent-gold);">${renderIcon('nav_altar')}</span>
              <span>${t('novena_btn_light_candle', lang) || 'Encender Veladora'}</span>
            </button>
            
            ${progress.completedDays.length > 0 ? `
              <button id="btn-novena-reset" class="btn-crystal" style="flex-shrink: 0; font-size: 0.8rem; font-weight: 700; padding: 10px 14px; border-radius: var(--radius-full); display: inline-flex; align-items: center; justify-content: center; gap: 6px; color: var(--text-secondary); background: var(--glass-surface-2); border: 1px solid var(--glass-border); cursor: pointer; box-sizing: border-box;" title="${t('novena_reset_cycle', lang) || 'Reiniciar Ciclo'}">
                <span style="display: flex; width: 14px; height: 14px;">${renderIcon('ui_refresh')}</span>
                <span>${t('novena_reset_cycle', lang) || 'Reiniciar'}</span>
              </button>
            ` : ''}
          </div>
        </div>

      </div>

      <!-- Oraciones Preparatoria y Final Canónica -->
      <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="padding: 18px; background: var(--glass-surface-1); border-radius: var(--radius-lg); border: 1px solid var(--glass-border); font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; box-sizing: border-box;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 10px 16px; margin-bottom: 14px; border-radius: var(--radius-full); background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); box-sizing: border-box; text-align: center;">
          <span style="color: var(--accent-gold); width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${renderIcon('nav_scriptures')}</span>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; line-height: 1.35;">
            <span style="font-size: 0.92rem; font-weight: 800; color: var(--accent-gold); text-align: center;">${t('novena_preparatory_final_header_1', lang) || 'Oración Preparatoria & Oración'}</span>
            <span style="font-size: 0.92rem; font-weight: 800; color: var(--accent-gold); text-align: center;">${t('novena_preparatory_final_header_2', lang) || 'Final Canónica'}</span>
          </div>
        </div>
        <div style="font-style: italic; margin-bottom: 8px; font-size: 0.95rem; line-height: 1.65; text-align: justify; hyphens: auto; word-break: break-word;">
          <p style="margin: 0 0 12px;">${prepOracionText}</p>
          <p style="margin: 0;">${finalOracionText}</p>
        </div>
      </div>
    `;

    this.attachEvents(novena, activeDayNumber);
  }

  attachEvents(novena, activeDayNumber) {
    const container = document.getElementById('novena-modal-body');
    if (!container) return;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    // Selector de Novenas
    container.querySelectorAll('.novena-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentNovenaId = btn.getAttribute('data-novena-id');
        this.selectedDay = null;
        this.render();
      });
    });

    // Selector de Perlas de Días
    container.querySelectorAll('.novena-day-pearl').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedDay = parseInt(btn.getAttribute('data-day'), 10);
        this.render();
      });
    });

    // Completar Día
    const completeBtn = container.querySelector('#btn-complete-novena-day');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        try {
          if (soundManager && typeof soundManager.playTibetanBowl === 'function') {
            soundManager.playTibetanBowl();
          } else if (soundManager && typeof soundManager.playBeadClick === 'function') {
            soundManager.playBeadClick();
          }
        } catch (e) {
          console.warn('Sound error:', e);
        }

        const updated = StorageService.completeNovenaDay(novena.id, activeDayNumber, novena.totalDias);
        
        if (updated.isFinished && activeDayNumber === novena.totalDias) {
          const novTitle = getNovenaI18n(novena.titulo, lang);
          const msgTemplate = t('novena_completed_alert_msg', lang) || 'Has culminado los {days} días del ciclo sagrado de {title}. Que las bendiciones de paz, gracia y fortaleza iluminen tu vida.';
          const alertMsg = msgTemplate.replace('{days}', novena.totalDias).replace('{title}', novTitle);

          SacredDialog.alert({
            title: t('novena_completed_alert_title', lang) || t('novena_completed_badge', lang) || '¡Novena Concluida!',
            message: alertMsg,
            icon: 'ui_sparkles',
            buttonText: t('novena_completed_alert_btn', lang) || t('dialog_ok', lang) || 'Agradecer y Continuar',
            type: 'gold'
          });
        } else {
          SacredDialog.toast(`✨ ${t('novena_day_prefix', lang) || 'Día'} ${activeDayNumber} (+15 pts)`);
        }
        this.selectedDay = Math.min(novena.totalDias, activeDayNumber + 1);
        this.render();
      });
    }

    // Encender Veladora en Altar
    const candleBtn = container.querySelector('#btn-novena-light-candle');
    if (candleBtn) {
      candleBtn.addEventListener('click', () => {
        this.close();
        if (window.feApp) {
          const altarTab = document.querySelector('.bottom-nav-item[data-tab="altar"]');
          if (altarTab) altarTab.click();
          const altarInst = window.feApp.altar || window.feApp.altarComponent;
          if (altarInst && typeof altarInst.lightCandle === 'function') {
            const novTitle = getNovenaI18n(novena.titulo, lang);
            const novSub = getNovenaI18n(novena.subtitulo, lang);
            altarInst.lightCandle(
              'amarillo_oro',
              `${t('novena_day_prefix', lang) || 'Novena Día'} ${activeDayNumber}: ${novTitle}`,
              `${novSub}`
            );
          }
        }
      });
    }

    // Reiniciar Ciclo
    const resetBtn = container.querySelector('#btn-novena-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        StorageService.resetNovena(novena.id);
        this.selectedDay = 1;
        SacredDialog.toast(t('dialog_ok', lang) || 'OK');
        this.render();
      });
    }
  }
}

export const novenaModal = new NovenaModalComponent();
