/**
 * ONBOARDING & PREFERENCES COMPONENT
 * FeUniversal - Faith & Prayers
 */

import { TRADITIONS } from '../data/traditions.js';
import { StorageService } from '../services/storage-service.js';
import { SUPPORTED_LANGUAGES } from './language-modal.js';
import { renderIcon, renderLangBadge } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { PrivacyModalComponent } from './privacy-modal.js';
import { t } from '../data/i18n.js';

export class OnboardingComponent {
  constructor(onUpdateCallback) {
    this.onUpdateCallback = onUpdateCallback;
    this.container = document.getElementById('modal-onboarding');
    this.privacyModal = new PrivacyModalComponent();
    this.currentStep = 1; // 1: Idioma, 2: Tradiciones
  }

  ensureContainer() {
    let el = document.getElementById('modal-onboarding');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-onboarding';
      document.body.appendChild(el);
    }
    el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 4000; padding: 12px 10px 80px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
    this.container = el;
  }

  open(step = 1) {
    this.ensureContainer();
    this.currentStep = step || 1;
    this.render();
    this.container.style.display = 'flex';
    if (this.container) this.container.scrollTop = 0;
  }

  close() {
    if (this.container) this.container.style.display = 'none';
  }

  render() {
    const prefs = StorageService.getPreferences();
    const currentLang = prefs.idioma || 'es';

    if (this.currentStep === 1) {
      this.renderStep1Language(currentLang);
    } else {
      this.renderStep2Traditions(prefs, currentLang);
    }
  }

  renderStep1Language(currentLang) {
    const isLangRTL = typeof currentLang === 'string' && ['ar', 'he', 'ur'].includes(currentLang);
    const scrollList = this.container ? this.container.querySelector('.onboarding-scroll-list') : null;
    const prevScrollTop = scrollList ? scrollList.scrollTop : null;

    const langGridHTML = SUPPORTED_LANGUAGES.map(lang => {
      const isSelected = lang.code === currentLang;
      return `
        <div class="crystal-card lang-card onboarding-lang-btn ${isSelected ? 'selected' : ''}" data-lang-code="${lang.code}" style="padding: 10px 14px; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; border: 1.5px solid ${isSelected ? 'var(--accent-gold)' : 'var(--glass-border)'}; background: ${isSelected ? 'rgba(234, 179, 8, 0.14)' : 'var(--glass-surface-1)'}; border-radius: var(--radius-md); transition: all 0.2s ease; text-align: start; box-sizing: border-box;">
          <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; text-align: start;">
            <div style="flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;">
              ${renderLangBadge(lang.code)}
            </div>
            <div style="display: flex; flex-direction: column; text-align: start; min-width: 0; flex: 1;">
              <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-primary); line-height: 1.3;">${lang.name}</div>
              <div style="font-size: 0.70rem; color: var(--text-muted); line-height: 1.3; margin-top: 2px;">${lang.subtitle}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${isSelected ? `<span class="hud-pill dot-gold" style="font-size: 0.65rem;">${t('selected_badge', currentLang) || 'Activo'}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="max-width: 520px; width: 100%; margin: auto; padding: 22px 18px; position: relative; max-height: 88vh; display: flex; flex-direction: column; box-sizing: border-box; text-align: ${isLangRTL ? 'right' : 'left'};">
        <button id="btn-close-onboarding" class="btn-modal-close" style="position: absolute; top: 12px; inset-inline-end: 12px;" title="Cerrar">${renderIcon('ui_close')}</button>
        
        <div style="text-align: center; margin-bottom: 14px; flex-shrink: 0;">
          <div style="width: 44px; height: 44px; margin: 0 auto 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), var(--accent-indigo)); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 16px var(--accent-gold-glow);">
            ${renderIcon('ui_globe')}
          </div>
          <div class="hud-pill dot-gold" style="display: inline-block; font-size: 0.65rem; margin-bottom: 4px;">${t('onboarding_step_1_of_2', currentLang) || 'PASO 1 DE 2'}</div>
          <h2 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; text-align: center;">${t('onboarding_choose_lang', currentLang) || 'Elige tu Idioma Principal'}</h2>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0 auto; line-height: 1.4; max-width: 440px; text-align: center;">
            ${t('onboarding_lang_desc', currentLang) || 'Configura el idioma preferido para tus oraciones, traducciones y experiencia litúrgica.'}
          </p>
        </div>

        <div class="onboarding-scroll-list" style="overflow-y: auto; padding-right: 4px; flex: 1; margin-bottom: 12px; overscroll-behavior: contain;">
          ${langGridHTML}
        </div>

        <div style="flex-shrink: 0;">
          <button id="btn-step1-next" class="btn-crystal btn-crystal-primary" style="width: 100%; padding: 11px; font-size: 0.88rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;">
            <span>${t('onboarding_next_traditions', currentLang) || 'Siguiente: Elegir Tradiciones →'}</span>
          </button>
          <div style="text-align: center; margin-top: 8px;">
            <button type="button" id="btn-open-privacy-onboarding" style="background: none; border: none; color: var(--text-muted); cursor: pointer; text-decoration: underline; font-size: 0.68rem; padding: 4px; display: inline-flex; align-items: center; gap: 4px;">
              <span>${renderIcon('ui_lock')}</span>
              <span>${t('privacy_policy_title', currentLang) || 'Política de Privacidad & Seguridad de Datos (100% Local)'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachStep1Events();

    if (prevScrollTop !== null) {
      const newScrollList = this.container.querySelector('.onboarding-scroll-list');
      if (newScrollList) {
        newScrollList.scrollTop = prevScrollTop;
      }
    }
  }

  renderStep2Traditions(prefs, lang) {
    const isLangRTL = typeof lang === 'string' && ['ar', 'he', 'ur'].includes(lang);
    const scrollList = this.container ? this.container.querySelector('.onboarding-scroll-list') : null;
    const prevScrollTop = scrollList ? scrollList.scrollTop : null;

    const traditionsHTML = Object.values(TRADITIONS).map(trad => {
      const isChecked = prefs.tradicionesActivas.includes(trad.id);
      const color = trad.colorAcento || 'var(--accent-gold)';
      return `
        <div class="crystal-card tradition-item-card" style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
            <span style="width: 32px; height: 32px; border-radius: 50%; background: ${color}22; border: 1px solid ${color}44; display: inline-flex; align-items: center; justify-content: center; color: ${color}; flex-shrink: 0; box-shadow: 0 0 10px ${color}22;">
              ${renderIcon(trad.iconKey)}
            </span>
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 800; font-size: 0.88rem; color: var(--text-primary); margin-bottom: 3px; line-height: 1.3; word-break: break-word;">
                ${trad.nombre[lang] || trad.nombre.es}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">
                ${trad.descripcion[lang] || trad.descripcion.es}
              </div>
            </div>
          </div>
          <label class="hud-switch" style="flex-shrink: 0; margin-left: 6px;">
            <input type="checkbox" class="tradition-toggle" data-trad-id="${trad.id}" ${isChecked ? 'checked' : ''}>
              <span class="hud-slider"></span>
          </label>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="max-width: 520px; width: 100%; margin: auto; padding: 22px 18px; position: relative; max-height: 88vh; display: flex; flex-direction: column; box-sizing: border-box; text-align: ${isLangRTL ? 'right' : 'left'};">
        <button id="btn-close-onboarding" class="btn-modal-close" style="position: absolute; top: 12px; inset-inline-end: 12px;" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>
        
        <div style="text-align: center; margin-bottom: 12px; flex-shrink: 0;">
          <div style="width: 44px; height: 44px; margin: 0 auto 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px var(--accent-gold-glow); border: 1.5px solid rgba(212, 175, 55, 0.4); overflow: hidden; background: #000;">
            <img src="ico.png?v=5.0" alt="FeUniversal" style="width: 44px; height: 44px; min-width: 44px; min-height: 44px; max-width: 44px; max-height: 44px; object-fit: cover; border-radius: 50%; display: block;" />
          </div>
          <div class="hud-pill dot-cyan" style="display: inline-block; font-size: 0.65rem; margin-bottom: 4px;">${t('onboarding_step_2_of_2', lang) || 'PASO 2 DE 2'}</div>
          <h2 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; text-align: center;">${t('onboarding_customize_traditions', lang) || 'Personaliza tus Tradiciones'}</h2>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0; line-height: 1.4; max-width: 440px; margin: 0 auto; text-align: center;">
            ${t('onboarding_traditions_desc', lang) || 'Selecciona las corrientes devocionales para tu santuario sagrado e íntimo.'}
          </p>
        </div>

        <div class="onboarding-scroll-list" style="overflow-y: auto; padding-right: 4px; flex: 1; margin-bottom: 12px; overscroll-behavior: contain;">
          ${traditionsHTML}
        </div>

        <div style="display: flex; gap: 8px; flex-shrink: 0;">
          <button id="btn-step2-back" class="btn-crystal" style="padding: 11px 16px; font-size: 0.82rem; cursor: pointer;">${t('onboarding_btn_back', lang) || '← Atrás'}</button>
          <button id="btn-save-onboarding" class="btn-crystal btn-crystal-primary" style="flex: 1; padding: 11px; font-size: 0.88rem; font-weight: 800; cursor: pointer;">${t('onboarding_btn_consecrate', lang) || 'Consagrar y Comenzar'}</button>
        </div>
      </div>
    `;

    this.attachStep2Events();

    if (prevScrollTop !== null) {
      const newScrollList = this.container.querySelector('.onboarding-scroll-list');
      if (newScrollList) {
        newScrollList.scrollTop = prevScrollTop;
      }
    }
  }

  attachStep1Events() {
    const closeBtn = document.getElementById('btn-close-onboarding');
    if (closeBtn) closeBtn.onclick = () => this.close();

    const langBtns = this.container.querySelectorAll('.onboarding-lang-btn');
    langBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const langCode = btn.getAttribute('data-lang-code');
        if (!langCode) return;
        const prefs = StorageService.getPreferences();
        prefs.idioma = langCode;
        StorageService.savePreferences(prefs);
        if (typeof this.onUpdateCallback === 'function') {
          this.onUpdateCallback(prefs, true);
        }
        this.renderStep1Language(langCode);
      };
    });

    const nextBtn = document.getElementById('btn-step1-next');
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        this.currentStep = 2;
        this.render();
      };
    }

    const privacyBtn = document.getElementById('btn-open-privacy-onboarding');
    if (privacyBtn) {
      privacyBtn.onclick = (e) => {
        e.preventDefault();
        this.privacyModal.open();
      };
    }
  }

  attachStep2Events() {
    const closeBtn = document.getElementById('btn-close-onboarding');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const backBtn = document.getElementById('btn-step2-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.currentStep = 1;
        this.render();
      });
    }

    const saveBtn = document.getElementById('btn-save-onboarding');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const checkboxes = this.container.querySelectorAll('.tradition-toggle');
        const selected = [];
        checkboxes.forEach(cb => {
          if (cb.checked) selected.push(cb.getAttribute('data-trad-id'));
        });

        if (selected.length === 0) {
          const prefs = StorageService.getPreferences();
          const lang = prefs.idioma || 'es';
          SacredDialog.alert({
            title: t('onboarding_trad_req_title', lang) || 'Tradición Requerida',
            message: t('onboarding_trad_req_msg', lang) || 'Por favor selecciona al menos una tradición sagrada para comenzar tu experiencia.',
            icon: 'ui_compass',
            buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
            type: 'warning'
          });
          return;
        }

        const prefs = StorageService.getPreferences();
        prefs.tradicionesActivas = selected;
        prefs.onboardingCompletado = true;
        StorageService.savePreferences(prefs);
        if (this.onUpdateCallback) this.onUpdateCallback(prefs, false);
        this.close();
      });
    }
  }
}