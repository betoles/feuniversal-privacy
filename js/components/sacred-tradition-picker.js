import { t } from '../data/i18n.js';
﻿/**
 * SACRED TRADITION PICKER (SELECTOR MODAL TÁCTIL DE TRADICIONES SAGRADAS)
 * FeUniversal - Faith & Prayers
 */

import { TRADITIONS } from '../data/traditions.js';
import { renderIcon } from './icons.js';
import { StorageService } from '../services/storage-service.js';

export class SacredTraditionPicker {
  static modalEl = null;
  static currentTradition = 'catolicismo';
  static onSelectCallback = null;

  static ensureModal() {
    let el = document.getElementById('modal-sacred-tradition-picker');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-sacred-tradition-picker';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 5200; padding: 12px 10px 80px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    SacredTraditionPicker.modalEl = el;
  }

  static open({ currentTradition = 'catolicismo', onSelect }) {
    SacredTraditionPicker.ensureModal();
    SacredTraditionPicker.currentTradition = currentTradition || 'catolicismo';
    SacredTraditionPicker.onSelectCallback = onSelect;

    SacredTraditionPicker.render();
    SacredTraditionPicker.modalEl.style.display = 'flex';
    if (SacredTraditionPicker.modalEl) SacredTraditionPicker.modalEl.scrollTop = 0;
  }

  static close() {
    if (SacredTraditionPicker.modalEl) {
      SacredTraditionPicker.modalEl.style.display = 'none';
    }
  }

  static render() {
    const activeTrad = SacredTraditionPicker.currentTradition;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const traditionsList = Object.values(TRADITIONS);

    SacredTraditionPicker.modalEl.innerHTML = `
      <div class="crystal-card" style="max-width: 480px; width: 100%; margin: auto; padding: 22px 16px 26px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box;">
        <button id="btn-close-tradition-picker" class="btn-modal-close" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>

        <!-- Cabecera -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="width: 44px; height: 44px; margin: 0 auto 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 16px var(--accent-gold-glow);">
            ${renderIcon('nav_altar')}
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 0 0 4px; color: var(--text-primary);">${t('picker_tradition_title', lang)}</h3>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">${t('onboarding_traditions_desc', lang) || 'Consagra tu plegaria bajo la corriente espiritual elegida.'}</p>
        </div>

        <!-- LISTADO DE TRADICIONES -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          ${traditionsList.map(trad => {
            const isSelected = activeTrad === trad.id;
            const titleText = trad.nombre[lang] || trad.nombre.es;
            return `
              <button type="button" class="report-type-chip ${isSelected ? 'active' : ''} tradition-item-btn" data-trad-id="${trad.id}" style="width: 100%; padding: 12px 14px; text-align: left; display: flex; align-items: center; gap: 12px; cursor: pointer;">
                <span class="chip-radio-dot"></span>
                <span style="width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${trad.colorAcento || 'var(--accent-gold)'};">${renderIcon(trad.iconKey)}</span>
                <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0;">
                  <span style="font-size: 0.84rem; font-weight: 800; color: var(--text-primary);">${titleText}</span>
                  <span style="font-size: 0.70rem; color: var(--text-secondary); opacity: 0.85;">${(trad.descripcion && (trad.descripcion[lang] || trad.descripcion.es)) || t('vault_tradition_canonical_universal', lang)}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- BOTÓN DE CERRAR -->
        <button type="button" id="btn-done-tradition-picker" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 12px; font-size: 0.88rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer;">
          <span style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px;">${renderIcon('ui_check')}</span>
          <span>${t('picker_tradition_confirm', lang)}</span>
        </button>
      </div>
    `;

    SacredTraditionPicker.attachEvents();
  }

  static attachEvents() {
    const closeBtn = document.getElementById('btn-close-tradition-picker');
    if (closeBtn) closeBtn.onclick = () => SacredTraditionPicker.close();

    const doneBtn = document.getElementById('btn-done-tradition-picker');
    if (doneBtn) doneBtn.onclick = () => SacredTraditionPicker.close();

    SacredTraditionPicker.modalEl.querySelectorAll('.tradition-item-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-trad-id');
        SacredTraditionPicker.currentTradition = id;
        if (typeof SacredTraditionPicker.onSelectCallback === 'function') {
          SacredTraditionPicker.onSelectCallback(id);
        }
        SacredTraditionPicker.close();
      };
    });
  }
}
