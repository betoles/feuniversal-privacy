/**
 * ALTAR DIGITAL INTERACTIVO (12 COLORES TRADICIONALES DE LA DEVOCIÓN POPULAR)
 * FeUniversal - Faith & Prayers
 */

import { StorageService, TRADITIONAL_CANDLE_COLORS, getCandleColor } from '../services/storage-service.js';
import { getTradition, TRADITIONS } from '../data/traditions.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { MembershipComponent } from './membership.js';
import { SacredTraditionPicker } from './sacred-tradition-picker.js';
import { SacredDurationPicker, CANDLE_DURATIONS, getDurationDef } from './sacred-duration-picker.js';
import { novenaModal } from './novena-modal.js';
import { t } from '../data/i18n.js';

export class AltarComponent {
  constructor() {
    this.container = typeof document !== 'undefined' ? document.getElementById('view-altar') : null;
    this.selectedColorId = 'amarillo_oro';
    this.selectedTradition = 'catolicismo';
    this.selectedDuration = 24;
    this.membership = new MembershipComponent();
  }

  render() {
    const altarState = StorageService.getAltarState();
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const activePrayer = window.activePrayerSession;

    const tradObj = getTradition(this.selectedTradition);
    const durObj = getDurationDef(this.selectedDuration, lang);

    const prayerTitle = activePrayer ? (typeof activePrayer.titulo === 'string' ? activePrayer.titulo : ((activePrayer.titulo && (activePrayer.titulo[lang] || activePrayer.titulo.es || activePrayer.titulo.en)) || 'Oración')) : '';
    const tradIcon = activePrayer ? (getTradition(activePrayer.tradicion)?.icono || 'trad_catolicismo') : 'trad_catolicismo';
    const activeTradObj = activePrayer ? getTradition(activePrayer.tradicion) : null;
    const activeTradLabel = activeTradObj && activeTradObj.nombre ? (activeTradObj.nombre[lang] || activeTradObj.nombre.es || activeTradObj.nombre.en || activePrayer.tradicion).toUpperCase() : ((activePrayer?.tradicion || '').toUpperCase().replace(/_/g, ' '));

    const sessionBarHTML = activePrayer ? `
      <div class="active-prayer-session-bar">
        <div class="session-info">
          <span style="display: flex; align-items: center; color: var(--accent-gold); flex-shrink: 0;">${renderIcon(tradIcon)}</span>
          <div style="min-width: 0; flex: 1;">
            <div style="font-size: 0.68rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px;">${t('active_prayers_compendium', lang)}:</div>
            <div class="session-title">${prayerTitle}</div>
          </div>
          <span class="session-trad">${activeTradLabel}</span>
        </div>
        <button id="btn-altar-return-prayer" class="btn-return-reader" title="${t('return_to_reader_tooltip', lang) || 'Regresar al Lector de Oración'}" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
          <span style="display: inline-flex; width: 14px; height: 14px; color: var(--accent-gold); flex-shrink: 0;">${renderIcon('nav_scriptures')}</span>
          <span>${t('open_mirror', lang)}</span>
        </button>
      </div>
    ` : '';

    const colorSwatchesHTML = TRADITIONAL_CANDLE_COLORS.map(raw => {
      const c = getCandleColor(raw.id, lang);
      return `
      <button class="color-picker-item ${c.id === this.selectedColorId ? 'active' : ''}" 
              data-color-id="${c.id}" 
              title="${c.name} (${c.mes}): ${c.meaning}">
        <span class="color-swatch-circle" style="background: ${c.hex}; box-shadow: 0 0 10px ${c.aura};"></span>
        <span class="color-picker-name">${c.name}</span>
        <span class="color-picker-month">${c.mes}</span>
      </button>
    `;
    }).join('');

    const activeCandles = altarState.veladoras || altarState.veladorasActivas || [];
    const candlesHTML = activeCandles.length > 0 ? activeCandles.map(v => {
      const colorObj = getCandleColor(v.colorId || v.color, lang);
      const hoursAgo = Math.floor((Date.now() - (v.fechaEncendido || v.timestamp || Date.now())) / (1000 * 60 * 60));
      const tradIconKey = getTradition(v.tradicion)?.icono || 'trad_catolicismo';

      return `
        <div class="crystal-card candle-card ${colorObj.claseCss || ('candle-color-' + colorObj.id)}" 
             style="border-top: 3px solid ${colorObj.hex}; --candle-wax-color: ${colorObj.hex}; --candle-flame-color: ${colorObj.hex}; --candle-aura-glow: ${colorObj.aura};">
          <div class="candle-flame-wrapper">
            <div class="candle-flame"></div>
            <div class="candle-wick"></div>
          </div>
          <div class="candle-body">
            <span class="candle-symbol" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; color: ${colorObj.hex}; opacity: 0.85;">
              ${renderIcon(tradIconKey)}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 14px;">
            <span style="font-size: 0.84rem; font-weight: 800; color: ${colorObj.hex}; letter-spacing: 0.01em;">${colorObj.name}</span>
            <span class="hud-pill dot-cyan" style="font-size: 0.7rem; font-weight: 700;">${hoursAgo}h / ${v.duracionHoras || 24}h</span>
          </div>
          <div class="candle-peticion">«${v.id === 'candle_init_1' ? (t('sample_candle_petition', lang) || v.peticion) : v.peticion}»</div>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--glass-border);">
            <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">${(getTradition(v.tradicion).nombre[lang] || getTradition(v.tradicion).nombre.es)}</span>
            <button class="btn-crystal btn-delete-candle" data-id="${v.id}" style="padding: 5px 10px; font-size: 0.76rem; border-radius: var(--radius-full); color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px;" title="Apagar veladora">
              ${renderIcon('ui_close')}
            </button>
          </div>
        </div>
      `;
    }).join('') : `
      <div class="crystal-card altar-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 32px 16px;">
        <div style="width: 48px; height: 48px; margin: 0 auto 8px; border-radius: 50%; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); display: flex; align-items: center; justify-content: center; color: var(--accent-gold);">
          <span style="display: flex; width: 24px; height: 24px;">${renderIcon('nav_altar')}</span>
        </div>
        <p style="color: var(--text-secondary); margin: 0; font-size: 0.9rem;">
          ${t('altar_empty_candles', lang)}
        </p>
      </div>
    `;

    const currentColorObj = getCandleColor(this.selectedColorId, lang);

    this.container.innerHTML = `
      ${sessionBarHTML}

      <div class="altar-hero">
        <div style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 20px var(--accent-gold-glow);">
          ${renderIcon('nav_altar')}
        </div>
        <h2 style="font-family: var(--font-sacred); font-size: 1.6rem; margin: 0 0 6px; color: var(--text-primary);">${t('altar_title', lang)}</h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 560px; margin: 0 auto 18px; line-height: 1.4;">
          ${t('altar_desc', lang)}
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button id="btn-open-new-candle-modal" class="btn-crystal btn-crystal-gold" style="padding: 10px 24px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; line-height: 1.35; gap: 2px;">
            <span style="font-weight: 800; font-size: 0.95rem;">${t('altar_light_candle', lang)}</span>
            <span style="font-size: 0.78rem; font-weight: 600; opacity: 0.9;">${t('altar_choose_color', lang)}</span>
          </button>
          <button id="btn-altar-open-novenas" class="btn-crystal" style="padding: 10px 20px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; line-height: 1.35; gap: 2px; background: var(--glass-surface-2); border: 1.5px solid var(--accent-gold); color: var(--text-primary);">
            <span style="font-weight: 800; font-size: 0.95rem;">${t('novenas_title', lang) || 'Novenas & Ciclos'}</span>
            <span style="font-size: 0.78rem; font-weight: 600; color: var(--accent-gold);">${t('novenas_9days_guide', lang) || 'Guía de 9 Días'}</span>
          </button>
        </div>
      </div>

      <div class="candles-grid">
        ${candlesHTML}
      </div>

      <!-- Modal Encendido de Veladora (Optimizado Móvil) -->
      <div id="modal-new-candle" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 6000; padding: 24px 12px 100px; align-items: flex-start; justify-content: center; overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box;">
        <div class="crystal-card" style="max-width: 480px; width: 100%; margin: auto 0; padding: 22px 16px 28px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box;">
          <button id="btn-close-candle-modal" class="btn-modal-close" title="${t('dialog_cancel', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>
          
          <div style="text-align: center; margin-bottom: 14px;">
            <div style="width: 42px; height: 42px; margin: 0 auto 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 16px var(--accent-gold-glow);">
              ${renderIcon('nav_altar')}
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">${t('altar_modal_title', lang)}</h3>
            <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">${t('altar_modal_desc', lang)}</p>
          </div>
          
          <!-- Selector de los 12 Colores -->
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 0.82rem; margin-bottom: 8px;">
              <span style="font-weight: 700; color: var(--text-primary);">${t('altar_color_label', lang)}</span>
              <span id="selected-color-caption" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(15, 23, 42, 0.9); border: 1px solid var(--accent-gold); border-radius: var(--radius-full); box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                <span id="selected-color-dot" style="width: 12px; height: 12px; border-radius: 50%; background: ${currentColorObj.hex}; border: 1.5px solid #ffffff; box-shadow: 0 0 6px ${currentColorObj.aura}; flex-shrink: 0;"></span>
                <span id="selected-color-text" style="font-size: 0.84rem; font-weight: 800; color: #ffffff; letter-spacing: 0.02em;">${currentColorObj.name} (${currentColorObj.mes})</span>
              </span>
            </label>
            <div class="color-picker-grid" id="candle-color-picker-grid">
              ${colorSwatchesHTML}
            </div>
            <div id="selected-color-desc" style="font-size: 0.88rem; font-weight: 600; color: #fef08a; margin-top: 8px; font-style: italic; background: rgba(234, 179, 8, 0.12); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid rgba(234, 179, 8, 0.35); text-align: center; line-height: 1.45; box-shadow: inset 0 0 12px rgba(234, 179, 8, 0.08);">
              «${currentColorObj.meaning}»
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label" style="font-size: 0.76rem;">${t('altar_petition_label', lang)}</label>
            <textarea id="input-candle-peticion" class="form-textarea" rows="3" placeholder="${t('altar_petition_placeholder', lang)}" style="font-size: 0.82rem; min-height: 70px; width: 100%; box-sizing: border-box;"></textarea>
          </div>

          <!-- Selector Táctil Modal de Tradición (Estilo Biblioteca Sagrada) -->
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; display: block;">
              ${t('altar_tradition_label', lang)}
            </label>
            <button type="button" id="btn-open-tradition-picker" class="hud-sound-pill" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; box-sizing: border-box; text-align: left; transition: all var(--transition-fast);">
              <span style="display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden;">
                <span id="icon-selected-tradition" style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon(tradObj.icono || tradObj.iconKey || 'trad_catolicismo')}</span>
                <span id="label-selected-tradition" style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${tradObj.nombre[lang] || tradObj.nombre.es}</span>
              </span>
              <span style="color: var(--accent-cyan); font-size: 0.75rem; flex-shrink: 0; padding-left: 8px; display: flex; align-items: center;">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
          </div>

          <!-- Selector Táctil Modal de Duración (Estilo Biblioteca Sagrada) -->
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label" style="font-size: 0.78rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; display: block;">
              ${t('altar_duration_label', lang)}
            </label>
            <button type="button" id="btn-open-duration-picker" class="hud-sound-pill" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; box-sizing: border-box; text-align: left; transition: all var(--transition-fast);">
              <span style="display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden;">
                <span id="icon-selected-duration" style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('ui_time')}</span>
                <span id="label-selected-duration" style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${durObj.title}</span>
              </span>
              <span style="color: var(--accent-cyan); font-size: 0.75rem; flex-shrink: 0; padding-left: 8px; display: flex; align-items: center;">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
          </div>

          <div style="margin-top: 14px; padding-bottom: 4px;">
            <button id="btn-confirm-light-candle" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 12px; font-size: 0.92rem; font-weight: 800; box-shadow: 0 4px 20px var(--accent-gold-glow); display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span style="display: flex; align-items: center;">${renderIcon('nav_altar')}</span>
              <span>${t('altar_confirm_light', lang)}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const openModalBtn = document.getElementById('btn-open-new-candle-modal');
    const closeModalBtn = document.getElementById('btn-close-candle-modal');
    const modal = document.getElementById('modal-new-candle');
    const confirmBtn = document.getElementById('btn-confirm-light-candle');
    const colorGrid = document.getElementById('candle-color-picker-grid');

    const openNovenasBtn = document.getElementById('btn-altar-open-novenas');
    if (openNovenasBtn) {
      openNovenasBtn.addEventListener('click', () => {
        novenaModal.open();
      });
    }

    if (openModalBtn && modal) {
      openModalBtn.addEventListener('click', () => {
        const altarState = StorageService.getAltarState();
        const activeCandles = altarState.veladoras || [];
        const isUnlocked = StorageService.isAccessUnlocked();

        if (!isUnlocked && activeCandles.length >= 1) {
          this.membership.open('candle_limit');
          return;
        }
        modal.style.display = 'flex';
      });
    }
    if (closeModalBtn && modal) {
      closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    // Apertura de Pickers Modales Táctiles
    const traditionBtn = document.getElementById('btn-open-tradition-picker');
    if (traditionBtn) {
      traditionBtn.addEventListener('click', () => {
        SacredTraditionPicker.open({
          currentTradition: this.selectedTradition,
          onSelect: (tradId) => {
            this.selectedTradition = tradId;
            const tradObj = getTradition(tradId);
            const prefs = StorageService.getPreferences();
            const lang = prefs.idioma || 'es';
            const label = document.getElementById('label-selected-tradition');
            const iconEl = document.getElementById('icon-selected-tradition');
            if (label && tradObj) label.innerText = tradObj.nombre[lang] || tradObj.nombre.es;
            if (iconEl && tradObj) iconEl.innerHTML = renderIcon(tradObj.icono || tradObj.iconKey || 'trad_catolicismo');
          }
        });
      });
    }

    const durationBtn = document.getElementById('btn-open-duration-picker');
    if (durationBtn) {
      durationBtn.addEventListener('click', () => {
        SacredDurationPicker.open({
          currentHours: this.selectedDuration,
          onSelect: (selectedDur) => {
            this.selectedDuration = selectedDur.hours;
            const label = document.getElementById('label-selected-duration');
            if (label) label.innerText = selectedDur.title;
          }
        });
      });
    }

    // Selección de Color
    if (colorGrid) {
      colorGrid.querySelectorAll('.color-picker-item').forEach(item => {
        item.addEventListener('click', () => {
          colorGrid.querySelectorAll('.color-picker-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          this.selectedColorId = item.getAttribute('data-color-id');
          const prefs = StorageService.getPreferences();
          const lang = prefs.idioma || 'es';
          const colObj = getCandleColor(this.selectedColorId, lang);
          if (colObj) {
            const dot = document.getElementById('selected-color-dot');
            const text = document.getElementById('selected-color-text');
            const desc = document.getElementById('selected-color-desc');
            if (dot) {
              dot.style.background = colObj.hex;
              dot.style.boxShadow = `0 0 6px ${colObj.aura}`;
            }
            if (text) {
              text.innerText = `${colObj.name} (${colObj.mes})`;
            }
            if (desc) {
              desc.innerText = `«${colObj.meaning}»`;
            }
          }
        });
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const peticion = document.getElementById('input-candle-peticion')?.value.trim();
        const tradicion = this.selectedTradition || 'catolicismo';
        const duracionHoras = this.selectedDuration || 24;
        const prefs = StorageService.getPreferences();
        const lang = prefs.idioma || 'es';

        if (!peticion) {
          SacredDialog.alert({
            title: t('altar_alert_req_title', lang) || 'Petición Requerida',
            message: t('altar_alert_req_msg', lang) || 'Por favor escribe tu intención o plegaria para consagrar la veladora en el altar.',
            icon: 'nav_altar',
            buttonText: t('understood_label', lang) || t('dialog_accept', lang) || 'Entendido',
            type: 'warning'
          });
          return;
        }

        StorageService.addCandle({
          peticion,
          tradicion,
          duracionHoras,
          colorId: this.selectedColorId
        });

        if (modal) modal.style.display = 'none';
        this.render();
      });
    }


    // Botones de eliminación de veladoras
    this.container.querySelectorAll('.btn-delete-candle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        StorageService.removeCandle(id);
        this.render();
      });
    });

    // Botón volver a oración en curso
    const returnBtn = document.getElementById('btn-altar-return-prayer');
    if (returnBtn && window.activePrayerSession) {
      returnBtn.addEventListener('click', () => {
        const mirrorModal = document.getElementById('modal-reader');
        if (mirrorModal) {
          mirrorModal.style.display = 'flex';
        }
      });
    }
  }
}


