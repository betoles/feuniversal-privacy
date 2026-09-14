/**
 * CONTADOR TÁCTIL MULTISISTEMA (ROSARIO / JAPA MALA / CORONILLAS / DECRETOS)
 * FeUniversal - Faith & Prayers
 */

import { soundManager } from '../services/sound-service.js';
import { StorageService } from '../services/storage-service.js';
import { PrayerCorpusService } from '../services/prayer-corpus-service.js';
import { getTradition } from '../data/traditions.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { t } from '../data/i18n.js';

export class BeadCounterComponent {
  constructor() {
    this.container = typeof document !== 'undefined' ? document.getElementById('view-beads') : null;
    this.currentCount = 0;
    this.targetCount = 10;
    this.currentMode = 'rosario_10';
    this.lapsCompleted = 0;
  }

  async render() {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    let activePrayer = window.activePrayerSession;

    // Sincronización asíncrona garantizada con el idioma activo
    if (activePrayer && activePrayer.id) {
      try {
        const fresh = await PrayerCorpusService.getPrayerById(activePrayer.id, lang);
        if (fresh) {
          activePrayer = fresh;
          window.activePrayerSession = fresh;
        }
      } catch (e) {
        console.warn('[BeadCounter] Error cargando plegaria activa en idioma:', lang, e);
      }
    }

    // Auto-ajuste de modo de conteo según la tradición de la oración activa
    if (activePrayer) {
      if (activePrayer.tradicion === 'ortodoxia' && this.currentMode === 'rosario_10') {
        this.currentMode = 'coronilla_33';
        this.targetCount = 33;
      } else if (activePrayer.tradicion === 'vedica' && this.currentMode === 'rosario_10') {
        this.currentMode = 'japa_mala_108';
        this.targetCount = 108;
      } else if (activePrayer.tradicion === 'islam' && this.currentMode === 'rosario_10') {
        this.currentMode = 'tasbih_99';
        this.targetCount = 99;
      }
    }

    const tradIconKey = activePrayer ? (`trad_${activePrayer.tradicion}`) : 'nav_beads';
    const tradObj = activePrayer ? getTradition(activePrayer.tradicion) : null;
    const tradLabel = tradObj && tradObj.nombre ? (tradObj.nombre[lang] || tradObj.nombre.es || tradObj.nombre.en || activePrayer.tradicion).toUpperCase() : ((activePrayer?.tradicion || '').toUpperCase().replace(/_/g, ' '));

    const prayerTitle = activePrayer ? (typeof activePrayer.titulo === 'string' ? activePrayer.titulo : ((activePrayer.titulo && (activePrayer.titulo[lang] || activePrayer.titulo.es || activePrayer.titulo.en)) || 'Oración')) : '';
    const prayerTradText = activePrayer ? (activePrayer.textoTraducido || (activePrayer.traducciones && (activePrayer.traducciones[lang] || activePrayer.traducciones.es || activePrayer.traducciones.en)) || activePrayer.textoEspanol || activePrayer.textoOriginal || '') : '';

    const sessionBarHTML = activePrayer ? `
      <div class="active-prayer-session-bar" style="margin-bottom: 14px;">
        <div class="session-info">
          <span style="display: flex; align-items: center; color: var(--accent-gold); flex-shrink: 0;">${renderIcon(tradIconKey)}</span>
          <div style="min-width: 0; flex: 1;">
            <div style="font-size: 0.68rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px;">${t('active_prayers_compendium', lang)}:</div>
            <div class="session-title">${prayerTitle}</div>
          </div>
          <span class="session-trad">${tradLabel}</span>
        </div>
        <button id="btn-bead-return-prayer" class="btn-return-reader" title="${t('return_to_reader_tooltip', lang) || 'Regresar al Lector de Oración'}" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
          <span style="display: inline-flex; width: 14px; height: 14px; color: var(--accent-gold); flex-shrink: 0;">${renderIcon('nav_scriptures')}</span>
          <span>${t('open_mirror', lang)}</span>
        </button>
      </div>
    ` : '';

    const prayerPreviewHTML = activePrayer ? `
      <div class="bead-prayer-card-preview">
        <div class="preview-sacred-text">«${activePrayer.textoOriginal || ''}»</div>
        <div class="preview-trans-text">${prayerTradText}</div>
      </div>
    ` : '';

    const modes = [
      { id: 'rosario_10', label: t('bead_mode_rosary', lang) || 'Rosario (10)', target: 10, iconKey: 'trad_catolicismo' },
      { id: 'coronilla_33', label: t('bead_mode_chaplet', lang) || 'Coronilla (33)', target: 33, iconKey: 'trad_ortodoxia' },
      { id: 'tasbih_99', label: t('bead_mode_tasbih', lang) || 'Tasbih (99)', target: 99, iconKey: 'trad_islam' },
      { id: 'japa_mala_108', label: t('bead_mode_japa_mala', lang) || 'Japa Mala (108)', target: 108, iconKey: 'trad_vedica' },
      { id: 'decretos_21', label: t('bead_mode_decrees', lang) || 'Decretos (21)', target: 21, iconKey: 'trad_santeria' },
      { id: 'libre_1000', label: t('bead_mode_free', lang) || 'Libre', target: 9999, iconKey: 'nav_beads' }
    ];

    const modesHTML = modes.map(m => `
      <button class="btn-crystal bead-mode-btn ${this.currentMode === m.id ? 'active-glow-gold' : ''}" data-mode="${m.id}" data-target="${m.target}" style="font-size: 0.86rem; font-weight: 700; padding: 10px 16px; border-radius: var(--radius-full); display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; cursor: pointer; transition: all var(--transition-fast);">
        <span style="display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center; flex-shrink: 0;">${renderIcon(m.iconKey)}</span>
        <span>${m.label}</span>
      </button>
    `).join('');

    this.container.innerHTML = `
      ${sessionBarHTML}

      <div class="bead-counter-panel crystal-card">
        <div style="width: 44px; height: 44px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan)); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 16px var(--accent-cyan-glow);">
          ${renderIcon('nav_beads')}
        </div>
        <h2 style="font-family: var(--font-display); font-size: 1.4rem; margin: 0 0 4px; color: var(--text-primary);">${t('bead_title', lang)}</h2>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 14px;">
          ${t('bead_desc', lang)}
        </p>

        <!-- Selector de Modo con Espaciado y Ergonomía Táctil -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 16px;">
          ${modesHTML}
        </div>

        <!-- Jaculatoria / Mantra en Curso -->
        ${prayerPreviewHTML}

        <!-- Disco Central de Conteo -->
        <div id="bead-touch-trigger" class="bead-interactive-circle">
          <div class="bead-big-number" id="bead-display-num">${this.currentCount}</div>
          <div class="bead-target-label" id="bead-display-target">${t('bead_target_label', lang) || 'TARGET'}: ${this.targetCount === 9999 ? '∞' : this.targetCount}</div>
        </div>

        <!-- Progreso y Reinicio Generoso y Táctil -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 20px; padding: 12px 16px; background: var(--glass-inset); border-radius: var(--radius-lg); border: 1.5px solid var(--glass-border); box-shadow: 0 4px 16px rgba(0,0,0,0.25); box-sizing: border-box; width: 100%;">
          <div style="text-align: left; min-width: 0; flex: 1;">
            <div id="bead-display-laps" style="font-size: 1.9rem; font-weight: 900; color: var(--accent-cyan); font-family: var(--font-code); line-height: 1.1; text-shadow: 0 0 16px var(--accent-cyan-glow);">${this.lapsCompleted}</div>
            <div style="font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 800; letter-spacing: 0.04em; margin-top: 3px; line-height: 1.25;">${t('bead_laps_completed', lang)}</div>
          </div>
          <div style="flex-shrink: 0;">
            <button id="btn-reset-counter" class="btn-crystal" style="font-size: 0.84rem; font-weight: 800; padding: 9px 16px; border-radius: var(--radius-full); display: inline-flex; align-items: center; justify-content: center; gap: 7px; color: var(--text-primary); background: var(--glass-surface-2); border: 1px solid var(--glass-border); cursor: pointer; transition: all var(--transition-fast);">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; color: var(--accent-gold); flex-shrink: 0;">${renderIcon('ui_refresh')}</span>
              <span>${t('bead_reset', lang)}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const trigger = document.getElementById('bead-touch-trigger');
    const resetBtn = document.getElementById('btn-reset-counter');
    const modeBtns = this.container.querySelectorAll('.bead-mode-btn');
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    if (trigger) {
      trigger.addEventListener('click', () => {
        this.currentCount++;
        soundManager.playBeadClick();

        if (this.currentCount >= this.targetCount && this.targetCount !== 9999) {
          this.lapsCompleted++;
          StorageService.recordBeadSession(this.currentMode, this.targetCount);
          this.currentCount = 0;
          const lapsEl = document.getElementById('bead-display-laps');
          if (lapsEl) lapsEl.innerText = this.lapsCompleted;
          SacredDialog.alert({
            title: t('bead_consecrated_title', lang),
            message: t('bead_consecrated_msg', lang),
            icon: 'nav_beads',
            buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'OK',
            type: 'gold'
          });
        }

        const numEl = document.getElementById('bead-display-num');
        if (numEl) numEl.innerText = this.currentCount;
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.currentCount = 0;
        this.lapsCompleted = 0;
        const numEl = document.getElementById('bead-display-num');
        const lapsEl = document.getElementById('bead-display-laps');
        if (numEl) numEl.innerText = '0';
        if (lapsEl) lapsEl.innerText = '0';
        
        try {
          soundManager.playBeadClick();
        } catch (err) { /* ignore */ }

        const resetMsg = t('bead_toast_reset', lang) || t('bead_reset_toast', lang) || '✨ Contador y ciclos reiniciados a cero';
        SacredDialog.toast(resetMsg);
      });
    }

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentMode = btn.getAttribute('data-mode');
        this.targetCount = parseInt(btn.getAttribute('data-target'), 10);
        this.currentCount = 0;
        this.render();
      });
    });

    const returnBtn = document.getElementById('btn-bead-return-prayer');
    if (returnBtn && window.activePrayerSession) {
      returnBtn.addEventListener('click', () => {
        if (window.feApp && window.feApp.mirrorReader) {
          window.feApp.mirrorReader.open(window.activePrayerSession);
        }
      });
    }
  }
}
