/**
 * LANGUAGE SELECTION MODAL COMPONENT
 * FeUniversal - Faith & Prayers
 */

import { StorageService } from "../services/storage-service.js";
import { renderIcon, renderLangBadge } from "./icons.js";
import { t } from '../data/i18n.js';

export const SUPPORTED_LANGUAGES = [
  { code: "es", flag: "🇲🇽", name: "Español", subtitle: "Versión Canónica Oficial" },
  { code: "en", flag: "🇺🇸", name: "English", subtitle: "Global Liturgy & Devotion" },
  { code: "fr", flag: "🇫🇷", name: "Français", subtitle: "Liturgie Sacrée" },
  { code: "pt", flag: "🇧🇷", name: "Português", subtitle: "Orações Sagradas" },
  { code: "it", flag: "🇮🇹", name: "Italiano", subtitle: "Preghiere e Tradizioni" },
  { code: "de", flag: "🇩🇪", name: "Deutsch", subtitle: "Heilige Gebete" },
  { code: "la", flag: "🏛️", name: "Latina", subtitle: "Lingua Sacra Ecclesiae" },
  { code: "ru", flag: "🇷🇺", name: "Русский", subtitle: "Священные Молитвы" },
  { code: "zh", flag: "🇨🇳", name: "中文", subtitle: "神圣祈祷与典籍" },
  { code: "ja", flag: "🇯🇵", name: "日本語", subtitle: "神聖な祈りと黙想" },
  { code: "hi", flag: "🇮🇳", name: "हिन्दी", subtitle: "पवित्र मंत्र एवं प्रार्थना" },
  { code: "bn", flag: "🇧🇩", name: "বাংলা", subtitle: "পবিত্র প্রার্থনা ও স্তোত্র" },
  { code: "id", flag: "🇮🇩", name: "Bahasa Indonesia", subtitle: "Doa dan Tradisi Suci" },
  { code: "ar", flag: "🇸🇦", name: "العربية", subtitle: "الأدعية والأذكار (RTL)" },
  { code: "he", flag: "🇮🇱", name: "עברית", subtitle: "תפילות ומסורות קדושות (RTL)" },
  { code: "ur", flag: "🇵🇰", name: "اردو", subtitle: "دعائیں اور مناجات (RTL)" },
  { code: "sw", flag: "🌍", name: "Kiswahili", subtitle: "Sala na Tafakari (Umoja wa Afrika)" }
];

export class LanguageModalComponent {
  constructor(onLanguageChange) {
    this.onLanguageChange = onLanguageChange;
    this.container = typeof document !== 'undefined' ? document.getElementById("modal-language") : null;
  }

  ensureContainer() {
    let el = document.getElementById("modal-language");
    if (!el) {
      el = document.createElement("div");
      el.id = "modal-language";
      document.body.appendChild(el);
    }
    el.style.cssText = "display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 5000; padding: 12px 10px 80px; align-items: center; justify-content: center; box-sizing: border-box; overflow-y: auto;";
    this.container = el;
  }

  open() {
    this.ensureContainer();
    this.render();
    this.container.style.display = "flex";
  }

  close() {
    if (!this.container) return;
    this.container.style.display = "none";
  }

  render() {
    const prefs = StorageService.getPreferences();
    const currentLang = prefs.idioma || "es";
    const isLangRTL = typeof currentLang === 'string' && ['ar', 'he', 'ur'].includes(currentLang);

    const langItemsHTML = SUPPORTED_LANGUAGES.map(lang => {
      const isSelected = lang.code === currentLang;
      return `
        <button type="button" class="btn-crystal lang-select-item ${isSelected ? 'active' : ''}" data-lang-code="${lang.code}" style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 12px 16px; margin-bottom: 8px; border-radius: var(--radius-md); cursor: pointer; text-align: start; box-sizing: border-box; ${isSelected ? 'border-color: var(--accent-gold); background: var(--glass-surface-2);' : ''}">
          <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; pointer-events: none; text-align: start;">
            <div style="flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;">
              ${renderLangBadge(lang.code)}
            </div>
            <div style="display: flex; flex-direction: column; text-align: start; min-width: 0; flex: 1;">
              <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); line-height: 1.3;">${lang.name}</div>
              <div style="font-size: 0.74rem; color: var(--text-muted); line-height: 1.3; margin-top: 2px;">${lang.subtitle}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex-shrink: 0; pointer-events: none;">
            ${isSelected ? `<span style="color: var(--accent-gold); display: inline-flex; align-items: center; justify-content: center;">${renderIcon('ui_check')}</span>` : ''}
          </div>
        </button>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="max-width: 480px; width: 100%; margin: auto; padding: 24px 20px; position: relative; max-height: 85vh; display: flex; flex-direction: column; box-sizing: border-box; text-align: ${isLangRTL ? 'right' : 'left'};">
        <button id="btn-close-lang-modal" class="btn-modal-close" style="position: absolute; top: 14px; inset-inline-end: 14px; background: none; border: none; color: var(--text-muted); font-size: 1.1rem; cursor: pointer; padding: 6px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;" title="${t('close_label', currentLang) || 'Cerrar'}">
          ${renderIcon('ui_close')}
        </button>

        <div style="text-align: center; margin-bottom: 18px; flex-shrink: 0;">
          <div style="width: 52px; height: 52px; margin: 0 auto 10px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px var(--accent-gold-glow); box-sizing: border-box;">
            <img src="ico.png?v=5.0" alt="FeUniversal" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
          </div>
          <h2 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0 0 6px; color: var(--text-primary); text-align: center;">${t('lang_modal_title', currentLang)}</h2>
          <p style="font-size: 0.80rem; color: var(--text-secondary); margin: 0; line-height: 1.4; text-align: center;">${t('lang_modal_subtitle', currentLang)}</p>
        </div>

        <div style="overflow-y: auto; padding-inline-end: 4px; flex: 1; margin-bottom: 8px;">
          ${langItemsHTML}
        </div>
      </div>
    `;

    const closeBtn = document.getElementById("btn-close-lang-modal");
    if (closeBtn) closeBtn.onclick = () => this.close();

    this.container.querySelectorAll(".lang-select-item").forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const langCode = btn.getAttribute("data-lang-code");
        if (!langCode) return;
        const p = StorageService.getPreferences();
        p.idioma = langCode;
        StorageService.savePreferences(p);
        if (typeof this.onLanguageChange === 'function') {
          this.onLanguageChange(langCode);
        }
        this.close();
      };
    });
  }
}