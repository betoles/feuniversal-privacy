/**
 * BÓVEDA PRIVADA CIFRADA & GENERADOR INTELIGENTE FAITH-GPT (MULTI-IA & MOTOR MASTER)
 * FeUniversal - Faith & Prayers
 */

import { StorageService } from '../services/storage-service.js';
import { FaithGPT } from '../services/faith-gpt.js';
import { AIConnector } from '../services/ai-connector.js';
import { TRADITIONS } from '../data/traditions.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { MembershipComponent } from './membership.js';
import { PrivacyModalComponent } from './privacy-modal.js';
import { t } from '../data/i18n.js';

export const getGeminiModels = (lang = 'es') => [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    badge: t('gemini_badge_ultra_fast', lang) || 'Ultra Rápido',
    dot: 'dot-gold',
    desc: t('gemini_desc_ultra_fast', lang) || 'Última generación, latencia mínima y respuesta instantánea.'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    badge: t('gemini_badge_recommended', lang) || 'Recomendado',
    dot: 'dot-green',
    desc: t('gemini_desc_recommended', lang) || 'Alta velocidad y balance óptimo para devocionales diarios.'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    badge: t('gemini_badge_max_depth', lang) || 'Máxima Profundidad',
    dot: 'dot-cyan',
    desc: t('gemini_desc_max_depth', lang) || 'Máxima capacidad poética, contexto extenso y síntesis profunda.'
  }
];

export const GEMINI_MODELS = getGeminiModels('es');

export class VaultComponent {
  constructor() {
    this.container = typeof document !== 'undefined' ? document.getElementById('view-vault') : null;
    this.membership = new MembershipComponent();
    this.privacyModal = new PrivacyModalComponent();
    
    const aiConfig = AIConnector.getAIConfig();
    const prefs = StorageService.getPreferences();
    this.selectedProvider = aiConfig.activeProvider || 'auto';
    this.selectedTradition = (prefs.tradicionesActivas && prefs.tradicionesActivas[0]) || 'catolicismo';
  }

  static getProviderDefinitions(lang = 'es') {
    return [
      {
        id: 'auto',
        name: t('faithgpt_auto_title', lang) || 'Automático (Motor Master)',
        desc: t('vault_ai_master_desc', lang) || t('faithgpt_auto_desc', lang) || 'Conmutación inteligente: ultra rápido, offline y nube optimizada',
        badge: t('faithgpt_recommended', lang) || 'Recomendado',
        dot: 'dot-gold',
        icon: 'ui_sparkles'
      },
      {
        id: 'local',
        name: t('vault_ai_local_engine', lang) || 'Motor Local Canónico',
        desc: t('vault_ai_offline_no_cost', lang) || '0 descargas · 100% Offline · Privacidad absoluta sin costo ni datos',
        badge: '100% Offline',
        dot: 'dot-gold',
        icon: 'ui_cpu'
      },
      {
        id: 'gemini',
        name: 'Google Gemini 1.5/2.0 Flash',
        desc: t('vault_ai_cloud_inference', lang) || 'Inferencia en la nube de alta fidelidad litúrgica con tu API Key',
        badge: 'Google AI',
        dot: 'dot-green',
        icon: 'ai_gemini'
      },
      {
        id: 'ollama',
        name: 'Ollama Local (Desktop / Mac)',
        desc: t('vault_ai_local_server_conn', lang) || 'Conexión a servidor local en localhost:11434 para privacidad total',
        badge: 'Localhost',
        dot: 'dot-cyan',
        icon: 'ai_ollama'
      }
    ];
  }

  render() {
    const items = StorageService.getVaultItems();
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const aiConfig = AIConnector.getAIConfig();
    const geminiModels = getGeminiModels(lang);

    const providers = VaultComponent.getProviderDefinitions(lang);
    const activeProviderObj = providers.find(p => p.id === this.selectedProvider) || providers[0];

    const currentTradObj = TRADITIONS[this.selectedTradition] || TRADITIONS.catolicismo || {
      id: 'catolicismo',
      nombre: { es: 'Catolicismo Litúrgico' },
      icono: 'trad_catolicismo',
      subtitulo: 'Oraciones, Rosario y Liturgia'
    };

    const escapeHTML = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const itemsHTML = items.length === 0
      ? `<div style="text-align: center; padding: 28px 16px; color: var(--text-muted); font-size: 0.92rem; line-height: 1.5;">
           ${t('vault_empty_msg', lang)}
         </div>`
      : items.map(item => {
          const itemTitle = (item.id === 'vault_init_1' || item.id === 'entry_1')
            ? (t('sample_vault_title_1', lang) || item.titulo)
            : ((item.id === 'vault_init_2' || item.id === 'entry_2')
              ? (t('sample_vault_title_2', lang) || item.titulo)
              : item.titulo);
          const itemDesc = (item.id === 'vault_init_1' || item.id === 'entry_1')
            ? (t('sample_vault_desc_1', lang) || item.contenido)
            : ((item.id === 'vault_init_2' || item.id === 'entry_2')
              ? (t('sample_vault_desc_2', lang) || item.contenido)
              : item.contenido);
          const statusBadge = item.cumplido ? (t('vault_status_fulfilled', lang) || 'OK') : (t('vault_status_active', lang) || 'Active');
          const toggleText = item.cumplido ? (t('vault_btn_active', lang) || 'Activa') : (t('vault_btn_fulfilled', lang) || 'Cumplido');

          return `
            <div class="crystal-card" style="padding: 18px 16px; margin-bottom: 14px; position: relative;">
              <!-- Barra Superior: Estado (Badge) + Botón Eliminar (X) -->
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span class="hud-pill ${item.cumplido ? 'dot-green' : 'dot-gold'}" style="font-size: 0.74rem; padding: 3px 10px; font-weight: 700; display: inline-flex; align-items: center;">
                  ${statusBadge}
                </span>
                <button class="btn-crystal btn-delete-vault-item" data-id="${item.id}" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; padding: 0; font-size: 0.85rem; border-radius: 50%; color: var(--text-muted); cursor: pointer; flex-shrink: 0;" title="${t('close_label', lang) || 'Eliminar'}">
                  ${renderIcon('ui_close')}
                </button>
              </div>

              <!-- Título de la Petición a Ancho Completo -->
              <div style="font-weight: 800; font-size: 1.08rem; color: var(--text-primary); line-height: 1.35; margin-bottom: 8px;">
                ${escapeHTML(itemTitle)}
              </div>

              <!-- Contenido de la Petición -->
              <div style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.55; white-space: pre-line;">
                ${escapeHTML(itemDesc)}
              </div>

              <!-- Pie con Fecha y Acción Rápida -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--glass-border);">
                <div style="font-size: 0.78rem; font-family: var(--font-code); color: var(--text-muted);">${new Date(item.fecha).toLocaleDateString()}</div>
                <button class="btn-toggle-vault-status" data-id="${item.id}" style="background: none; border: none; font-size: 0.84rem; color: var(--accent-gold); font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 4px 6px;">
                  ${item.cumplido ? `<span style="display:inline-flex; align-items:center;">${renderIcon('ui_refresh')}</span> <span>${toggleText}</span>` : `<span style="display:inline-flex; align-items:center; color: #10b981;">${renderIcon('ui_check')}</span> <span style="color: var(--accent-gold);">${toggleText}</span>`}
                </button>
              </div>
            </div>
          `;
        }).join('');

    this.container.innerHTML = `
      <div style="max-width: 680px; margin: 0 auto; width: 100%; box-sizing: border-box;">
        <!-- Control Segmentado Sub-pestañas: Bóveda / FaithGPT -->
        <div class="crystal-segmented-control" style="max-width: 440px; margin: 0 auto 24px;">
          <button id="btn-subtab-vault" class="segmented-item active">
            <span style="display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 16px; height: 16px;">${renderIcon('nav_vault')}</span>
            <span>${t('nav_vault', lang)}</span>
          </button>
          <button id="btn-subtab-faithgpt" class="segmented-item">
            <span style="display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 16px; height: 16px;">${renderIcon('ui_faithgpt')}</span>
            <span>FaithGPT</span>
          </button>
        </div>

        <!-- VISTA 1: BÓVEDA PRIVADA -->
        <div id="subview-vault">
          <div class="crystal-card vault-form-card" style="margin-bottom: 24px;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem; margin: 0 0 14px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
              <span style="width: 20px; height: 20px; display: inline-flex; align-items: center;">${renderIcon('nav_vault')}</span>
              <span>${t('vault_new_petition_title', lang)}</span>
            </h3>
            <div class="form-group">
              <label class="form-label">${t('vault_title_label', lang)}</label>
              <input id="vault-input-title" class="form-input" placeholder="${t('vault_title_placeholder', lang)}">
            </div>
            <div class="form-group">
              <label class="form-label">${t('vault_detail_label', lang)}</label>
              <textarea id="vault-input-content" class="form-textarea" placeholder="${t('vault_detail_placeholder', lang)}"></textarea>
            </div>
            <button id="btn-save-vault-entry" class="btn-crystal btn-crystal-primary" style="width: 100%; min-height: 46px; font-weight: 700;">
              ${t('vault_save_btn', lang)}
            </button>
          </div>

          <div class="section-title" style="margin-bottom: 16px; font-size: 1.15rem; font-weight: 800; font-family: var(--font-display); color: var(--text-primary);">${t('vault_journal_title', lang)}</div>
          <div>${itemsHTML}</div>

          <!-- Enlace a Política de Privacidad (Data Safety) -->
          <div style="margin-top: 24px; text-align: center;">
            <button type="button" class="btn-open-privacy-link" style="background: none; border: none; color: var(--accent-cyan); cursor: pointer; text-decoration: underline; font-size: 0.76rem; padding: 8px 12px;">
              ${t('privacy_policy_btn', lang) || '🔒 Política de Privacidad & Seguridad de Datos (100% Local)'}
            </button>
          </div>
        </div>

        <!-- VISTA 2: ASISTENTE FAITHGPT MULTI-IA -->
        <div id="subview-faithgpt" style="display: none;">
          <div class="crystal-card faithgpt-form-card">
            
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="width: 48px; height: 48px; margin: 0 auto 10px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), var(--accent-indigo)); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 16px var(--accent-gold-glow);">
                <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">${renderIcon('ui_sparkles')}</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; margin: 0 0 6px; color: var(--text-primary);">
                ${t('faithgpt_title', lang)}
              </h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0 0 14px; line-height: 1.45;">
                ${t('faithgpt_desc', lang)}
              </p>

              <!-- Barra de Estado del Motor de IA -->
              <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--glass-inset); padding: 6px 12px; border-radius: var(--radius-full); border: 1px solid var(--glass-border); font-size: 0.76rem; flex-wrap: wrap; justify-content: center;">
                <span class="hud-pill ${activeProviderObj.dot}" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 800; padding: 3px 10px;">
                  <span style="width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center;">${renderIcon(activeProviderObj.icon)}</span>
                  <span>${activeProviderObj.name}</span>
                </span>
                <button id="btn-open-ai-settings" class="btn-crystal" style="padding: 5px 12px; font-size: 0.74rem; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; min-height: 32px;">
                  <span style="width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center;">${renderIcon('ui_settings')}</span>
                  <span>${t('vault_ai_config_btn', lang) || 'Configurar IA / Llaves'}</span>
                </button>
              </div>
            </div>

            <!-- SELECTOR 1: MOTOR DE INFERENCIA (ENCAPSULADO EN MODAL TÁCTIL) -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.80rem; font-weight: 700; margin-bottom: 6px;">
                <span>${t('vault_inference_engine_label', lang)}</span>
                <span class="hud-pill ${activeProviderObj.dot}" style="font-size: 0.68rem; padding: 2px 8px; font-weight: 800;">${activeProviderObj.badge}</span>
              </label>
              <button type="button" id="btn-open-provider-picker" class="hud-sound-pill" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; box-sizing: border-box; text-align: left; min-height: 56px; transition: all var(--transition-fast);">
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: rgba(234, 179, 8, 0.15); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(234, 179, 8, 0.3);">
                    <span style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${renderIcon(activeProviderObj.icon)}</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 2px; min-width: 0;">
                    <span id="label-selected-provider" style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${activeProviderObj.name}</span>
                    <span id="desc-selected-provider" style="font-size: 0.75rem; color: var(--text-secondary); opacity: 0.9; white-space: normal; line-height: 1.3;">${activeProviderObj.desc}</span>
                  </div>
                </div>
                <span style="color: var(--accent-cyan); font-size: 0.8rem; flex-shrink: 0; padding-left: 8px; display: flex; align-items: center;">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </button>
            </div>

            <!-- SELECTOR 2: TRADICIÓN LITÚRGICA (ENCAPSULADO EN MODAL TÁCTIL) -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" style="font-size: 0.80rem; font-weight: 700; margin-bottom: 6px; display: block;">${t('vault_tradition_label', lang)}</label>
              <button type="button" id="btn-open-faithgpt-tradition-picker" class="hud-sound-pill" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; box-sizing: border-box; text-align: left; min-height: 56px; transition: all var(--transition-fast);">
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: rgba(99, 102, 241, 0.15); color: var(--accent-indigo); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(99, 102, 241, 0.3);">
                    <span style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${renderIcon(currentTradObj.icono || currentTradObj.iconKey || 'trad_catolicismo')}</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 2px; min-width: 0;">
                    <span id="label-selected-faithgpt-tradition" style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${currentTradObj.nombre[lang] || currentTradObj.nombre.es}</span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary); opacity: 0.9;">${(currentTradObj.descripcion && (currentTradObj.descripcion[lang] || currentTradObj.descripcion.es)) || t('vault_tradition_canonical_active', lang)}</span>
                  </div>
                </div>
                <span style="color: var(--accent-cyan); font-size: 0.8rem; flex-shrink: 0; padding-left: 8px; display: flex; align-items: center;">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </button>
            </div>

            <!-- ÁREA DE INTENCIÓN DE ORACIÓN -->
            <div class="form-group" style="margin-bottom: 18px;">
              <label class="form-label" style="font-size: 0.80rem; font-weight: 700; margin-bottom: 6px; display: block;">${t('faithgpt_situation_label', lang)}</label>
              <textarea id="faithgpt-situation" class="form-textarea" placeholder="${t('faithgpt_situation_placeholder', lang)}" style="min-height: 85px; font-size: 0.88rem; line-height: 1.5;"></textarea>
            </div>

            <!-- BOTÓN GENERAR -->
            <button id="btn-generate-prayer" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 14px; font-size: 0.96rem; font-weight: 800; min-height: 52px; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 20px var(--accent-gold-glow);">
              <span style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${renderIcon('ui_sparkles')}</span>
              <span id="label-btn-generate">${t('faithgpt_generate_btn', lang)}</span>
            </button>

            <!-- Resultado Generado -->
            <div id="faithgpt-result-box" style="display: none; margin-top: 24px; padding: 20px; background: var(--glass-inset); border-radius: var(--radius-md); border: 1px solid var(--glass-border); position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--glass-border);">
                <div id="faithgpt-result-title" style="font-weight: 800; font-size: 1.12rem; color: var(--accent-gold); font-family: var(--font-sacred);"></div>
                <span class="hud-pill dot-gold" style="font-size: 0.72rem; font-weight: 700;">${t('faithgpt_consecrated_badge', lang)}</span>
              </div>
              
              <div id="faithgpt-result-text" style="font-size: 0.96rem; line-height: 1.8; color: var(--text-primary); white-space: pre-line;"></div>

              <!-- Banner de Transparencia de IA (Google AI Safety Policy) -->
              <div style="margin-top: 16px; padding: 10px 14px; background: rgba(251,191,36,0.06); border-radius: var(--radius-sm); border: 1px solid rgba(251,191,36,0.22); font-size: 0.72rem; color: var(--text-muted); line-height: 1.45;">
                ${t('ai_disclaimer', lang)}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--glass-border); flex-wrap: wrap;">
                <button id="btn-report-ai-prayer" class="btn-crystal" style="font-size: 0.76rem; padding: 7px 12px; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px;" title="${t('report_content', lang) || 'Reportar'}">
                  <span>🚩 ${t('report_content', lang) || 'Reportar'}</span>
                </button>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <button id="btn-copy-generated-prayer" class="btn-crystal" style="font-size: 0.82rem; padding: 8px 14px; display: inline-flex; align-items: center; gap: 6px; min-height: 40px;">
                    <span style="display: flex; align-items: center; color: var(--accent-gold); width: 16px; height: 16px;">${renderIcon('ui_copy')}</span>
                    <span>${t('copy_label', lang) || 'Copiar'}</span>
                  </button>
                  <button id="btn-save-generated-to-vault" class="btn-crystal btn-crystal-primary" style="font-size: 0.82rem; padding: 8px 16px; display: inline-flex; align-items: center; gap: 6px; min-height: 40px; font-weight: 700;">
                    <span style="display: flex; align-items: center; width: 16px; height: 16px;">${renderIcon('nav_vault')}</span>
                    <span>${t('vault_btn_save', lang)}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Enlace a Política de Privacidad (Data Safety) -->
            <div style="margin-top: 24px; text-align: center;">
              <button type="button" id="btn-open-privacy-vault" style="background: none; border: none; color: var(--accent-cyan); cursor: pointer; text-decoration: underline; font-size: 0.76rem; padding: 8px 12px;">
                ${t('privacy_policy_btn', lang) || '🔒 Política de Privacidad & Seguridad de Datos (100% Local)'}
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- MODAL 1: SELECTOR DE MOTOR DE INFERENCIA (ENCAPSULADO) -->
      <div id="modal-faithgpt-provider-picker" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); z-index: 6000; padding: 24px 12px 110px; align-items: flex-start; justify-content: center; overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box;">
        <div class="crystal-card" style="max-width: 500px; width: 100%; margin: auto 0; padding: 20px 18px 24px; position: relative; box-sizing: border-box; border-radius: var(--radius-lg);">
          <div style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 2px;">
            <button id="btn-close-provider-picker" class="btn-modal-close" style="position: static;" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>
          </div>
          
          <div style="text-align: center; margin-bottom: 16px;">
            <div style="width: 44px; height: 44px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 16px var(--accent-gold-glow);">
              <span style="width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">${renderIcon('ui_sparkles')}</span>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">
              ${t('vault_ai_engine_modal_title', lang) || 'Motor de Inferencia FaithGPT'}
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
              ${t('vault_ai_engine_select_desc', lang) || 'Selecciona el motor de procesamiento para sintetizar tus plegarias sagradas:'}
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${providers.map(p => {
              const isSelected = p.id === this.selectedProvider;
              return `
                <button type="button" class="report-type-chip ${isSelected ? 'active' : ''} provider-select-card" data-provider-id="${p.id}" style="width: 100%; padding: 14px 14px; text-align: left; display: flex; align-items: flex-start; gap: 12px; box-sizing: border-box; min-height: 60px; transition: all var(--transition-fast); cursor: pointer;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: ${isSelected ? 'var(--accent-gold)' : 'var(--glass-surface-3)'}; color: ${isSelected ? '#000000' : 'var(--accent-gold)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--glass-border); margin-top: 2px;">
                    <span style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${renderIcon(p.icon)}</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                      <span style="font-size: 0.94rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${p.name}</span>
                      <span class="hud-pill ${p.dot}" style="font-size: 0.65rem; padding: 2px 7px; flex-shrink: 0;">${p.badge}</span>
                    </div>
                    <span style="font-size: 0.76rem; color: var(--text-secondary); opacity: 0.9; line-height: 1.35; white-space: normal;">${p.desc}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>

          <button type="button" id="btn-cancel-provider-picker" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 11px; font-size: 0.85rem; font-weight: 800; cursor: pointer;">
            ${t('confirm_selection', lang) || 'Confirmar Selección'}
          </button>
        </div>
      </div>

      <!-- MODAL 2: SELECTOR DE TRADICIÓN LITÚRGICA (ENCAPSULADO) -->
      <div id="modal-faithgpt-tradition-picker" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); z-index: 6000; padding: 24px 12px 110px; align-items: flex-start; justify-content: center; overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box;">
        <div class="crystal-card" style="max-width: 520px; width: 100%; margin: auto 0; padding: 20px 18px 24px; position: relative; box-sizing: border-radius: var(--radius-lg);">
          <div style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 2px;">
            <button id="btn-close-faithgpt-tradition-picker" class="btn-modal-close" style="position: static;" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>
          </div>
          
          <div style="text-align: center; margin-bottom: 16px;">
            <div style="width: 44px; height: 44px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-indigo), #4338ca); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 16px rgba(99, 102, 241, 0.4);">
              <span style="width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">${renderIcon('nav_altar')}</span>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">
              ${t('vault_tradition_modal_title', lang) || t('vault_tradition_select_title', lang)}
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
              ${t('vault_tradition_modal_desc', lang) || t('vault_tradition_select_desc', lang)}
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 52vh; overflow-y: auto; padding-right: 2px;">
            ${Object.values(TRADITIONS).map(tObj => {
              const isSelected = tObj.id === this.selectedTradition;
              const isUserTrad = (prefs.tradicionesActivas || []).includes(tObj.id);

              return `
                <button type="button" class="report-type-chip ${isSelected ? 'active' : ''} faithgpt-tradition-select-card" data-tradition-id="${tObj.id}" style="width: 100%; padding: 13px 14px; text-align: start; display: flex; align-items: center; gap: 12px; box-sizing: border-box; min-height: 56px; transition: all var(--transition-fast); cursor: pointer;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: ${isSelected ? 'var(--accent-gold)' : 'var(--glass-surface-3)'}; color: ${isSelected ? '#000000' : 'var(--accent-gold)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--glass-border);">
                    <span style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${renderIcon(tObj.icono || tObj.iconKey || 'trad_catolicismo')}</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                      <span style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${tObj.nombre[lang] || tObj.nombre.es}</span>
                      ${isUserTrad ? `<span class="hud-pill dot-green" style="font-size: 0.65rem; padding: 2px 7px;">${t('scriptures_your_faith_badge', lang) || 'Tu Fe'}</span>` : ''}
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-secondary); opacity: 0.88; white-space: normal; line-height: 1.3;">${(tObj.descripcion && (tObj.descripcion[lang] || tObj.descripcion.es)) || t('vault_tradition_canonical_universal', lang)}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>

          <button type="button" id="btn-cancel-faithgpt-tradition-picker" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 11px; font-size: 0.85rem; font-weight: 800; cursor: pointer;">
            ${t('picker_tradition_confirm', lang) || 'Confirmar Tradición'}
          </button>
        </div>
      </div>

      <!-- MODAL DE CONFIGURACIÓN MULTI-IA (DISEÑO PERFECTO, SIN EMOJIS, CON SCROLL FLUIDO) -->
      <div id="modal-ai-settings" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); z-index: 6500; padding: 24px 12px 110px; align-items: flex-start; justify-content: center; overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box;">
        <div class="crystal-card" style="max-width: 500px; width: 100%; margin: auto 0; padding: 20px 18px 24px; position: relative; border-radius: var(--radius-lg); background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); box-shadow: 0 24px 60px rgba(0,0,0,0.65); box-sizing: border-box;">
          
          <div style="display: flex; justify-content: flex-end; align-items: center; width: 100%; margin-bottom: 2px;">
            <button id="btn-close-ai-settings" class="btn-modal-close" style="position: static;" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>
          </div>
          
          <div style="text-align: center; margin-bottom: 18px;">
            <div style="width: 44px; height: 44px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), var(--accent-indigo)); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 16px var(--accent-gold-glow);">
              <span style="width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">${renderIcon('ui_settings')}</span>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">${t('vault_ai_settings_title', lang)}</h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0;">${t('vault_ai_settings_subtitle', lang)}</p>
          </div>

          <!-- Google Gemini -->
          <div class="crystal-card" style="padding: 14px; margin-bottom: 12px; background: var(--glass-inset); border-radius: var(--radius-md);">
            <div style="font-weight: 800; font-size: 0.88rem; color: var(--accent-gold); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--accent-gold); display: inline-flex; width: 18px; height: 18px; flex-shrink: 0;">${renderIcon('ui_sparkles')}</span>
              <span>${t('vault_ai_gemini_cloud', lang)}</span>
            </div>
            <div class="form-group" style="margin-bottom: 8px;">
              <label class="form-label" style="font-size: 0.74rem;">${t('vault_ai_gemini_key_label', lang)}</label>
              <input type="password" id="ai-input-gemini-key" class="form-input" placeholder="AIzaSy..." value="${aiConfig.geminiKey || ''}" style="font-size: 0.8rem;">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.74rem; display: block; margin-bottom: 6px;">${t('vault_ai_model_label', lang)}</label>
              <input type="hidden" id="ai-input-gemini-model" value="${(aiConfig.geminiModel || 'gemini-2.0-flash')}">
              <button type="button" id="btn-open-gemini-model-picker" class="hud-sound-pill" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; box-sizing: border-box; text-align: left; min-height: 48px; transition: all var(--transition-fast);">
                <span style="display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden;">
                  <span style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('ui_sparkles')}</span>
                  <span id="label-gemini-model-selected" style="font-size: 0.85rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${(geminiModels.find(m => m.id === (aiConfig.geminiModel || 'gemini-2.0-flash')) || geminiModels[0]).name} (${(geminiModels.find(m => m.id === (aiConfig.geminiModel || 'gemini-2.0-flash')) || geminiModels[0]).badge})</span>
                </span>
                <span style="color: var(--accent-gold); font-size: 0.75rem; flex-shrink: 0; padding-left: 8px; display: flex; align-items: center;">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </button>
            </div>
          </div>

          <!-- Ollama Local -->
          <div class="crystal-card" style="padding: 14px; margin-bottom: 16px; background: var(--glass-inset); border-radius: var(--radius-md);">
            <div style="font-weight: 800; font-size: 0.88rem; color: var(--accent-cyan); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--accent-cyan); display: inline-flex; width: 18px; height: 18px; flex-shrink: 0;">${renderIcon('ui_shield')}</span>
              <span>${t('vault_ai_ollama_local', lang)}</span>
            </div>
            <div class="form-group" style="margin-bottom: 8px;">
              <label class="form-label" style="font-size: 0.74rem;">${t('vault_ai_ollama_host_label', lang)}</label>
              <input type="text" id="ai-input-ollama-host" class="form-input" placeholder="http://localhost:11434" value="${aiConfig.ollamaHost || 'http://localhost:11434'}" style="font-size: 0.8rem;">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.74rem;">${t('vault_ai_ollama_model_label', lang)}</label>
              <input type="text" id="ai-input-ollama-model" class="form-input" placeholder="llama3" value="${aiConfig.ollamaModel || 'llama3'}" style="font-size: 0.8rem;">
            </div>
          </div>

          <div id="ai-test-feedback" style="font-size: 0.76rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.45;"></div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-test-ai-connections" class="btn-crystal" style="flex: 1; padding: 10px; font-size: 0.82rem; font-weight: 700;">
              ${t('vault_ai_btn_test', lang)}
            </button>
            <button id="btn-save-ai-settings" class="btn-crystal btn-crystal-primary" style="flex: 1; padding: 10px; font-size: 0.82rem; font-weight: 800;">
              ${t('vault_ai_btn_save', lang)}
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL 3: SELECTOR MODAL DE MODELOS GEMINI (GLASSMORPHIC) -->
      <div id="modal-gemini-model-picker" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); z-index: 7000; padding: calc(env(safe-area-inset-top, 24px) + 24px) 12px calc(env(safe-area-inset-bottom, 24px) + 80px); align-items: flex-start; justify-content: center; overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box;">
        <div class="crystal-card" style="max-width: 480px; width: 100%; margin: 0 auto; padding: 20px 18px 24px; position: relative; box-sizing: border-box; border-radius: var(--radius-lg); background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); box-shadow: 0 24px 60px rgba(0,0,0,0.65);">
          <div style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 2px;">
            <button id="btn-close-gemini-model-picker" class="btn-modal-close" style="position: static;" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>
          </div>
          
          <div style="text-align: center; margin-bottom: 16px;">
            <div style="width: 44px; height: 44px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 0 16px var(--accent-gold-glow);">
              <span style="width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">${renderIcon('ui_sparkles')}</span>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">
              ${t('vault_ai_gemini_modal_title', lang)}
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
              ${t('vault_ai_gemini_modal_desc', lang)}
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${geminiModels.map(m => {
              const isSelected = m.id === (aiConfig.geminiModel || 'gemini-2.0-flash');
              return `
                <button type="button" class="report-type-chip ${isSelected ? 'active' : ''} gemini-model-select-card" data-model-id="${m.id}" data-model-label="${m.name} (${m.badge})" style="width: 100%; padding: 14px 14px; text-align: left; display: flex; align-items: flex-start; gap: 12px; box-sizing: border-box; min-height: 58px; transition: all var(--transition-fast); cursor: pointer;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: ${isSelected ? 'var(--accent-gold)' : 'var(--glass-surface-3)'}; color: ${isSelected ? '#000000' : 'var(--accent-gold)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--glass-border); margin-top: 2px;">
                    <span style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">${renderIcon('ui_sparkles')}</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                      <span style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${m.name}</span>
                      <span class="hud-pill ${m.dot}" style="font-size: 0.65rem; padding: 2px 7px; flex-shrink: 0;">${m.badge}</span>
                    </div>
                    <span style="font-size: 0.76rem; color: var(--text-secondary); opacity: 0.9; line-height: 1.35; white-space: normal;">${m.desc}</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>

          <button type="button" id="btn-cancel-gemini-model-picker" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 11px; font-size: 0.85rem; font-weight: 800; cursor: pointer;">
            ${t('vault_ai_gemini_modal_confirm', lang) || t('confirm_selection', lang) || 'Confirmar Selección'}
          </button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Sub-pestañas: Bóveda / FaithGPT
    const subtabVault = document.getElementById('btn-subtab-vault');
    const subtabFaithGPT = document.getElementById('btn-subtab-faithgpt');
    const subviewVault = document.getElementById('subview-vault');
    const subviewFaithGPT = document.getElementById('subview-faithgpt');

    if (subtabVault && subtabFaithGPT && subviewVault && subviewFaithGPT) {
      subtabVault.addEventListener('click', () => {
        subtabVault.classList.add('active');
        subtabFaithGPT.classList.remove('active');
        subviewVault.style.display = 'block';
        subviewFaithGPT.style.display = 'none';
      });

      subtabFaithGPT.addEventListener('click', () => {
        subtabFaithGPT.classList.add('active');
        subtabVault.classList.remove('active');
        subviewFaithGPT.style.display = 'block';
        subviewVault.style.display = 'none';
      });
    }

    // Modal Provider Picker
    const openProviderBtn = document.getElementById('btn-open-provider-picker');
    const modalProvider = document.getElementById('modal-faithgpt-provider-picker');
    const closeProviderBtn = document.getElementById('btn-close-provider-picker');
    const cancelProviderBtn = document.getElementById('btn-cancel-provider-picker');

    if (openProviderBtn && modalProvider) {
      openProviderBtn.addEventListener('click', () => {
        modalProvider.style.display = 'flex';
        modalProvider.scrollTop = 0;
      });
    }
    if (closeProviderBtn && modalProvider) {
      closeProviderBtn.addEventListener('click', () => {
        modalProvider.style.display = 'none';
      });
    }
    if (cancelProviderBtn && modalProvider) {
      cancelProviderBtn.addEventListener('click', () => {
        modalProvider.style.display = 'none';
      });
    }

    if (modalProvider) {
      modalProvider.querySelectorAll('.provider-select-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const pId = btn.getAttribute('data-provider-id');
          this.selectedProvider = pId;
          const conf = AIConnector.getAIConfig();
          conf.activeProvider = pId;
          AIConnector.saveAIConfig(conf);
          modalProvider.style.display = 'none';
          this.render();
          const fgptTab = document.getElementById('btn-subtab-faithgpt');
          if (fgptTab) fgptTab.click();
        });
      });
    }

    // Modal Tradition Picker
    const openTradBtn = document.getElementById('btn-open-faithgpt-tradition-picker');
    const modalTrad = document.getElementById('modal-faithgpt-tradition-picker');
    const closeTradBtn = document.getElementById('btn-close-faithgpt-tradition-picker');
    const cancelTradBtn = document.getElementById('btn-cancel-faithgpt-tradition-picker');

    if (openTradBtn && modalTrad) {
      openTradBtn.addEventListener('click', () => {
        modalTrad.style.display = 'flex';
        modalTrad.scrollTop = 0;
      });
    }
    if (closeTradBtn && modalTrad) {
      closeTradBtn.addEventListener('click', () => {
        modalTrad.style.display = 'none';
      });
    }
    if (cancelTradBtn && modalTrad) {
      cancelTradBtn.addEventListener('click', () => {
        modalTrad.style.display = 'none';
      });
    }

    if (modalTrad) {
      modalTrad.querySelectorAll('.faithgpt-tradition-select-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const tId = btn.getAttribute('data-tradition-id');
          this.selectedTradition = tId;
          modalTrad.style.display = 'none';
          this.render();
          const fgptTab = document.getElementById('btn-subtab-faithgpt');
          if (fgptTab) fgptTab.click();
        });
      });
    }

    // Modal AI Settings
    const openSettingsBtn = document.getElementById('btn-open-ai-settings');
    const modalSettings = document.getElementById('modal-ai-settings');
    const closeSettingsBtn = document.getElementById('btn-close-ai-settings');
    const saveSettingsBtn = document.getElementById('btn-save-ai-settings');
    const testSettingsBtn = document.getElementById('btn-test-ai-connections');

    // Modal Gemini Model Picker
    const openGeminiModelBtn = document.getElementById('btn-open-gemini-model-picker');
    const modalGeminiModel = document.getElementById('modal-gemini-model-picker');
    const closeGeminiModelBtn = document.getElementById('btn-close-gemini-model-picker');
    const cancelGeminiModelBtn = document.getElementById('btn-cancel-gemini-model-picker');

    if (openGeminiModelBtn && modalGeminiModel) {
      openGeminiModelBtn.addEventListener('click', () => {
        modalGeminiModel.style.display = 'flex';
        modalGeminiModel.scrollTop = 0;
      });
    }
    if (closeGeminiModelBtn && modalGeminiModel) {
      closeGeminiModelBtn.addEventListener('click', () => {
        modalGeminiModel.style.display = 'none';
      });
    }
    if (cancelGeminiModelBtn && modalGeminiModel) {
      cancelGeminiModelBtn.addEventListener('click', () => {
        modalGeminiModel.style.display = 'none';
      });
    }

    if (modalGeminiModel) {
      modalGeminiModel.querySelectorAll('.gemini-model-select-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const mId = btn.getAttribute('data-model-id');
          const mLabel = btn.getAttribute('data-model-label');
          const inputEl = document.getElementById('ai-input-gemini-model');
          const labelEl = document.getElementById('label-gemini-model-selected');
          if (inputEl) inputEl.value = mId;
          if (labelEl) labelEl.innerText = mLabel;

          modalGeminiModel.querySelectorAll('.gemini-model-select-card').forEach(c => {
            if (c.getAttribute('data-model-id') === mId) {
              c.classList.add('active');
            } else {
              c.classList.remove('active');
            }
          });

          modalGeminiModel.style.display = 'none';
        });
      });
    }

    if (openSettingsBtn && modalSettings) {
      openSettingsBtn.addEventListener('click', () => {
        modalSettings.style.display = 'flex';
        modalSettings.scrollTop = 0;
      });
    }
    if (closeSettingsBtn && modalSettings) {
      closeSettingsBtn.addEventListener('click', () => {
        modalSettings.style.display = 'none';
      });
    }

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        const gemKey = document.getElementById('ai-input-gemini-key')?.value.trim() || '';
        const gemMod = document.getElementById('ai-input-gemini-model')?.value || 'gemini-2.0-flash';
        const ollHost = document.getElementById('ai-input-ollama-host')?.value.trim() || 'http://localhost:11434';
        const ollMod = document.getElementById('ai-input-ollama-model')?.value.trim() || 'llama3';

        const conf = AIConnector.getAIConfig();
        conf.geminiKey = gemKey;
        conf.geminiModel = gemMod;
        conf.ollamaHost = ollHost;
        conf.ollamaModel = ollMod;
        AIConnector.saveAIConfig(conf);

        const prefs = StorageService.getPreferences();
        const lang = prefs.idioma || 'es';
        SacredDialog.toast(t('vault_toast_ai_saved', lang) || '✨ Ajustes de IA guardados con éxito');
        if (modalSettings) modalSettings.style.display = 'none';
        this.render();
        const fgptTab = document.getElementById('btn-subtab-faithgpt');
        if (fgptTab) fgptTab.click();
      });
    }

    if (testSettingsBtn) {
      testSettingsBtn.addEventListener('click', async () => {
        const prefs = StorageService.getPreferences();
        const lang = prefs.idioma || 'es';

        const feedback = document.getElementById('ai-test-feedback');
        if (feedback) {
          feedback.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; color: var(--accent-gold); padding: 9px 12px; background: rgba(212,175,55,0.08); border-radius: 8px; border: 1px solid rgba(212,175,55,0.2); margin-top: 6px;">
              <span style="display: inline-flex; width: 16px; height: 16px; flex-shrink: 0;">${renderIcon('ui_refresh')}</span>
              <span>${t('vault_ai_testing_msg', lang) || t('vault_ai_verifying_msg', lang) || 'Verificando conexiones de IA en tiempo real...'}</span>
            </div>
          `;
        }

        const geminiKey = document.getElementById('ai-input-gemini-key')?.value.trim() || '';
        const geminiModel = document.getElementById('ai-input-gemini-model')?.value || 'gemini-2.0-flash';
        const ollamaHost = document.getElementById('ai-input-ollama-host')?.value.trim() || 'http://localhost:11434';
        const ollamaModel = document.getElementById('ai-input-ollama-model')?.value.trim() || 'llama3';

        // 1. Motor Local Canónico
        const localTest = await AIConnector.testProvider('local');

        // 2. Google Gemini
        let gemTest = { success: false, status: 'missing_key', message: t('vault_ai_key_not_entered', lang) || 'Clave no ingresada (opcional)' };
        if (geminiKey) {
          gemTest = await AIConnector.testProvider('gemini', { geminiKey, geminiModel });
        }

        // 3. Ollama Local
        const ollamaTest = await AIConnector.testProvider('ollama', { ollamaHost, ollamaModel });

        const items = [
          {
            icon: 'ui_shield',
            title: t('vault_ai_local_engine', lang) || 'Motor Local Canónico',
            subtitle: t('vault_ai_local_offline_desc', lang) || 'Base litúrgica offline integrada',
            res: localTest
          },
          {
            icon: 'ui_sparkles',
            title: `Google Gemini (${geminiModel})`,
            subtitle: gemTest.status === 'missing_key' ? (t('vault_ai_key_not_entered', lang) || 'Clave no ingresada (opcional)') : (gemTest.message || t('vault_ai_status_active', lang) || 'Activo'),
            res: gemTest
          },
          {
            icon: 'ui_laptop',
            title: `Ollama Local (${ollamaModel})`,
            subtitle: ollamaTest.success ? (ollamaTest.message || t('vault_ai_status_active', lang) || 'Activo') : (t('vault_ai_ollama_not_detected', lang) || ollamaTest.message || 'Inactivo'),
            res: ollamaTest
          }
        ];

        const renderBadge = (res) => {
          let badgeClass = 'status-connected';
          let iconName = 'ui_check';
          let labelText = res.latencyMs !== undefined ? `${res.latencyMs} ms` : (t('vault_ai_status_active', lang) || 'Activo');

          if (res.status === 'missing_key') {
            badgeClass = 'status-optional';
            iconName = 'ui_lock';
            labelText = t('vault_ai_status_optional', lang) || 'Opcional';
          } else if (!res.success) {
            badgeClass = 'status-inactive';
            iconName = 'ui_close';
            labelText = t('vault_ai_status_inactive', lang) || 'Inactivo';
          }

          return `
            <div class="ai-status-pill ${badgeClass}">
              <span class="status-icon">${renderIcon(iconName)}</span>
              <span class="status-text">${labelText}</span>
            </div>
          `;
        };

        const html = `
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
            ${items.map(it => `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                  <span class="ai-test-provider-icon" style="width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; color: var(--accent-gold); flex-shrink: 0;">${renderIcon(it.icon)}</span>
                  <div style="min-width: 0; flex: 1;">
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.78rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${it.title}</div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${it.subtitle}</div>
                  </div>
                </div>
                ${renderBadge(it.res)}
              </div>
            `).join('')}
          </div>
        `;

        if (feedback) feedback.innerHTML = html;
      });
    }


    // Guardar Petición en Bóveda
    const saveEntryBtn = document.getElementById('btn-save-vault-entry');
    if (saveEntryBtn) {
      saveEntryBtn.addEventListener('click', () => {
        if (!StorageService.isFeatureUnlocked('vault_ai')) {
          this.membership.open();
          return;
        }

        const title = document.getElementById('vault-input-title')?.value.trim();
        const content = document.getElementById('vault-input-content')?.value.trim();
        const prefs = StorageService.getPreferences();
        const lang = prefs.idioma || 'es';

        if (!title || !content) {
          SacredDialog.alert({
            title: t('vault_alert_required_title', lang) || t('vault_alert_fields_req_title', lang),
            message: t('vault_alert_required_msg', lang) || t('vault_alert_fields_req_msg', lang),
            icon: '🔒',
            buttonText: t('understood_label', lang) || t('dialog_accept', lang) || 'Entendido',
            type: 'warning'
          });
          return;
        }

        const items = StorageService.getVaultItems();
        items.unshift({
          id: 'entry_' + Date.now(),
          tipo: 'peticion',
          titulo: title,
          contenido: content,
          fecha: Date.now(),
          cumplido: false
        });

        StorageService.saveVaultItems(items);
        this.render();
      });
    }

    // Generar Plegaria con FaithGPT / Reiniciar para Nueva Petición
    const genBtn = document.getElementById('btn-generate-prayer');
    const labelGen = document.getElementById('label-btn-generate');
    const situationInput = document.getElementById('faithgpt-situation');
    const box = document.getElementById('faithgpt-result-box');
    const prefs = StorageService.getPreferences();
    const currentLang = prefs.idioma || 'es';

    if (situationInput && genBtn) {
      situationInput.addEventListener('input', () => {
        if (genBtn.getAttribute('data-mode') === 'reset') {
          genBtn.removeAttribute('data-mode');
          if (labelGen) labelGen.innerText = t('faithgpt_generate_btn', currentLang);
        }
      });
    }

    if (genBtn) {
      genBtn.addEventListener('click', async () => {
        if (!StorageService.isFeatureUnlocked('vault_ai')) {
          this.membership.open();
          return;
        }

        const activePrefs = StorageService.getPreferences();
        const lang = activePrefs.idioma || 'es';

        // Modo: Nueva Petición (Limpiar formulario y preparar otro motivo)
        if (genBtn.getAttribute('data-mode') === 'reset') {
          if (situationInput) {
            situationInput.value = '';
            situationInput.focus();
          }
          if (box) box.style.display = 'none';
          genBtn.removeAttribute('data-mode');
          if (labelGen) labelGen.innerText = t('faithgpt_generate_btn', lang);
          situationInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        const situacion = situationInput?.value.trim();
        const tradicion = document.getElementById('faithgpt-tradition')?.value || 'catolicismo';
        const proveedor = document.getElementById('faithgpt-provider-select')?.value || 'auto';

        if (!situacion) {
          SacredDialog.alert({
            title: t('vault_alert_intention_title', lang) || t('vault_alert_intention_req_title', lang),
            message: t('vault_alert_intention_msg', lang) || t('vault_alert_intention_req_msg', lang),
            icon: '✨',
            buttonText: t('understood_label', lang) || t('dialog_accept', lang) || 'Entendido',
            type: 'warning'
          });
          return;
        }

        genBtn.disabled = true;
        if (labelGen) labelGen.innerText = t('faithgpt_composing_msg', lang) || 'Componiendo Plegaria Sagrada...';

        const titleEl = document.getElementById('faithgpt-result-title');
        const textEl = document.getElementById('faithgpt-result-text');

        try {
          const generated = await FaithGPT.generatePrayer({
            proveedor,
            tradicion,
            situacion,
            idioma: activePrefs.idioma || 'es',
            onProgress: (msg) => {
              if (labelGen) labelGen.innerText = msg;
            },
            onToken: (chunk) => {
              if (box && textEl) {
                textEl.innerText = chunk;
                box.style.display = 'block';
              }
            }
          });

          if (box && titleEl && textEl) {
            titleEl.innerText = generated.titulo;
            textEl.innerText = generated.textoCompleto;
            box.style.display = 'block';

            // Transformar el botón para permitir iniciar una nueva petición fácilmente
            genBtn.setAttribute('data-mode', 'reset');
            if (labelGen) labelGen.innerText = '↺ ' + (t('faithgpt_new_petition_btn', lang) || 'Nueva Petición');

            box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } catch (e) {
          console.error(e);
          SacredDialog.alert({
            title: t('vault_alert_error_title', lang) || 'Error de Generación',
            message: `No fue posible sintetizar la plegaria: ${e.message}`,
            icon: '⚠️',
            buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
            type: 'warning'
          });
          if (labelGen) labelGen.innerText = t('faithgpt_generate_btn', lang);
        } finally {
          genBtn.disabled = false;
        }
      });
    }

    // Acciones sobre el resultado generado
    const copyBtn = document.getElementById('btn-copy-generated-prayer');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = document.getElementById('faithgpt-result-text')?.innerText;
        if (text) {
          const prefs = StorageService.getPreferences();
          const lang = prefs.idioma || 'es';
          const title = document.getElementById('faithgpt-result-title')?.innerText || 'Plegaria Sagrada';
          const attribLine = t('share_attribution_line', lang) || '✦ Compartido a través de FeUniversal · Faith & Prayers';
          const sanctuaryTagline = t('share_sanctuary_tagline', lang) || 'Santuario Espiritual Universal';
          const canonicalUrl = 'https://betoles.github.io/feuniversal.app';
          const fullPayload = `« ${title} »\n\n${text}\n\n—\n${attribLine}\n${sanctuaryTagline}\n${canonicalUrl}`;
          
          navigator.clipboard.writeText(fullPayload).then(() => {
            copyBtn.innerText = t('copied_label', lang) || 'Copiada';
            setTimeout(() => { copyBtn.innerText = t('copy_label', lang) || 'Copiar'; }, 2000);
            SacredDialog.toast(t('share_toast_success', lang) || 'Texto sagrado copiado al portapapeles');
          });
        }
      });
    }

    const saveGeneratedBtn = document.getElementById('btn-save-generated-to-vault');
    if (saveGeneratedBtn) {
      saveGeneratedBtn.addEventListener('click', () => {
        const title = document.getElementById('faithgpt-result-title')?.innerText || 'Plegaria Generada';
        const content = document.getElementById('faithgpt-result-text')?.innerText;
        if (!content) return;

        const items = StorageService.getVaultItems();
        items.unshift({
          id: 'prayer_' + Date.now(),
          tipo: 'plegaria_generada',
          titulo: title,
          contenido: content,
          fecha: Date.now(),
          cumplido: false
        });

        StorageService.saveVaultItems(items);
        const prefs = StorageService.getPreferences();
        const lang = prefs.idioma || 'es';
        saveGeneratedBtn.innerText = '✓ ' + (t('vault_btn_saved_toast', lang) || t('vault_btn_save', lang));
        setTimeout(() => { saveGeneratedBtn.innerText = t('vault_btn_save', lang); }, 2500);
      });
    }

    // Reporte de Contenido de IA (Google AI Safety Policy)
    const reportAiBtn = document.getElementById('btn-report-ai-prayer');
    if (reportAiBtn) {
      reportAiBtn.addEventListener('click', () => {
        const prefs = StorageService.getPreferences();
        const lang = prefs.idioma || 'es';
        SacredDialog.alert({
          title: t('vault_alert_report_title', lang) || '🚩 Reportar Contenido Litúrgico',
          message: t('vault_alert_report_msg', lang) || 'Agradecemos tu reporte. Nuestro equipo de moderación litúrgica revisa periódicamente las sugerencias y patrones de respuesta para mantener la pureza y reverencia de las oraciones.',
          icon: '🚩',
          buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
          type: 'gold'
        });
      });
    }

    // Política de Privacidad
    const privacyBtn = document.getElementById('btn-open-privacy-vault');
    if (privacyBtn) {
      privacyBtn.addEventListener('click', () => {
        this.privacyModal.open();
      });
    }

    this.container.querySelectorAll('.btn-open-privacy-link').forEach(btn => {
      btn.addEventListener('click', () => {
        this.privacyModal.open();
      });
    });

    // Eliminar Petición de la Bóveda
    this.container.querySelectorAll('.btn-delete-vault-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (!id) return;
        const currentItems = StorageService.getVaultItems();
        const updated = currentItems.filter(it => it.id !== id);
        StorageService.saveVaultItems(updated);
        this.render();
      });
    });

    // Cambiar estado (Cumplido / Activa)
    this.container.querySelectorAll('.btn-toggle-vault-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (!id) return;
        const currentItems = StorageService.getVaultItems();
        const item = currentItems.find(it => it.id === id);
        if (item) {
          item.cumplido = !item.cumplido;
          StorageService.saveVaultItems(currentItems);
          this.render();
        }
      });
    });
  }
}
