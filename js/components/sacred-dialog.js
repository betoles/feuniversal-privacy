/**
 * SACRED DIALOG & CONFIRMATION COMPONENT (VENTANAS NATIVAS DE LA APP)
 * FeUniversal - Faith & Prayers
 * 
 * Reemplaza los diálogos del navegador por elegantes modales Glassmorphic
 * con auras luminosas, degradados litúrgicos, iconos vectoriales SVG puros y cero emojis.
 */

import { soundManager } from "../services/sound-service.js";
import { renderIcon } from "./icons.js";
import { StorageService } from "../services/storage-service.js";
import { t } from "../data/i18n.js";

export class SacredDialog {
  static getContainer() {
    let container = document.getElementById("modal-sacred-dialog");
    if (!container) {
      container = document.createElement("div");
      container.id = "modal-sacred-dialog";
      container.style.cssText = "display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 9999; padding: 16px; align-items: center; justify-content: center; box-sizing: border-box;";
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Muestra un diálogo de alerta estético nativo de FeUniversal (SVG + Glassmorphism)
   * @param {Object|string} options - Opciones o mensaje directo
   * @param {string} [options.title] - Título del diálogo
   * @param {string} [options.message] - Contenido del mensaje
   * @param {string} [options.icon] - Clave de icono SVG (por defecto 'ui_sparkles')
   * @param {string} [options.buttonText] - Texto del botón (por defecto "Aceptar")
   * @param {string} [options.type] - "gold" | "success" | "info" | "warning" | "danger"
   * @param {string} [options.lang] - Código de idioma forzado (opcional)
   * @returns {Promise<void>}
   */
  static alert(options, legacyMessage = '') {
    return new Promise((resolve) => {
      let title = "";
      let message = "";
      let icon = "ui_sparkles";
      let buttonText = "";
      let type = "gold";
      let lang = null;

      if (typeof options === "string") {
        if (legacyMessage) {
          title = options;
          message = legacyMessage;
        } else {
          message = options;
        }
      } else if (typeof options === "object" && options !== null) {
        title = options.title || "";
        message = options.message || message;
        icon = options.icon || icon;
        buttonText = options.buttonText || "";
        type = options.type || type;
        lang = options.lang || null;
      }

      const activeLang = lang || (typeof StorageService !== 'undefined' && StorageService.getPreferences ? StorageService.getPreferences().idioma : 'es') || 'es';
      if (!title) title = "FeUniversal";
      if (!buttonText) buttonText = t('dialog_accept', activeLang) || t('accept_label', activeLang) || "Aceptar";

      // Si el icono trae un emoji o texto no reconocido, mapear a clave SVG pura
      const iconKey = (icon && typeof icon === 'string' && icon.startsWith('ui_')) ? icon : 'ui_sparkles';

      const container = this.getContainer();

      const glowColors = {
        gold: "var(--accent-gold-glow)",
        success: "rgba(16, 185, 129, 0.4)",
        info: "rgba(56, 189, 248, 0.4)",
        warning: "rgba(245, 158, 11, 0.4)",
        danger: "rgba(239, 68, 68, 0.4)"
      };

      const glowColor = glowColors[type] || glowColors.gold;
      const isRtl = typeof activeLang === 'string' && ['ar', 'he', 'ur'].includes(activeLang);

      container.innerHTML = `
        <div class="crystal-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="max-width: 440px; width: 100%; margin: auto; padding: 28px 22px; text-align: center; position: relative; border-radius: var(--radius-lg); box-shadow: 0 0 40px ${glowColor}, var(--glass-shadow-lg); animation: fadeIn 0.25s ease-out; box-sizing: border-box; border: 1px solid var(--glass-border);">
          
          <!-- Medallón Oficial Vectorial / SVG -->
          <div style="width: 68px; height: 68px; margin: 0 auto 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 28px rgba(245, 158, 11, 0.5), 0 0 14px rgba(99, 102, 241, 0.35); box-sizing: border-box; overflow: hidden; border: 2px solid var(--accent-gold);">
            <img src="ico.png?v=5.0" alt="FeUniversal" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
          </div>

          <div style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-gold); margin-bottom: 8px;">
            FeUniversal · Faith & Prayers
          </div>

          <h3 style="font-family: var(--font-display); font-size: 1.20rem; font-weight: 800; margin: 0 0 10px; color: var(--text-primary); line-height: 1.3;">
            ${title}
          </h3>

          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.55; margin: 0 0 22px; white-space: pre-line;">
            ${message}
          </p>

          <button id="btn-sacred-dialog-ok" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 12px; font-size: 0.90rem; font-weight: 800; border-radius: var(--radius-full); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
            <span style="width: 18px; height: 18px; display: inline-flex;">${renderIcon(iconKey)}</span>
            <span>${buttonText}</span>
          </button>
        </div>
      `;

      container.style.display = "flex";

      const okBtn = document.getElementById("btn-sacred-dialog-ok");
      const closeDialog = () => {
        container.style.display = "none";
        resolve();
      };

      if (okBtn) {
        okBtn.addEventListener("click", closeDialog, { once: true });
        if (typeof okBtn.focus === 'function') okBtn.focus();
      }

      container.addEventListener("click", (e) => {
        if (e.target === container) closeDialog();
      }, { once: true });
    });
  }

  /**
   * Muestra una ventana modal de confirmación explícita estilizada con SVG-CSS Glassmorphic
   * @param {Object|string} options - Opciones o mensaje directo
   * @param {Function} [legacyOnConfirm] - Callback opcional para compatibilidad
   * @returns {Promise<boolean>}
   */
  static confirm(options, legacyOnConfirm = null) {
    return new Promise((resolve) => {
      let title = "";
      let message = "";
      let icon = "ui_shield";
      let confirmText = "";
      let cancelText = "";
      let type = "warning";
      let lang = null;
      let onConfirm = typeof legacyOnConfirm === 'function' ? legacyOnConfirm : null;
      let onCancel = null;

      if (typeof options === "string") {
        message = options;
      } else if (typeof options === "object" && options !== null) {
        title = options.title || "";
        message = options.message || "";
        icon = options.icon || icon;
        confirmText = options.confirmText || "";
        cancelText = options.cancelText || "";
        type = options.type || type;
        lang = options.lang || null;
        if (typeof options.onConfirm === 'function') onConfirm = options.onConfirm;
        if (typeof options.onCancel === 'function') onCancel = options.onCancel;
      }

      const activeLang = lang || (typeof StorageService !== 'undefined' && StorageService.getPreferences ? StorageService.getPreferences().idioma : 'es') || 'es';

      if (!title) title = t('dialog_confirm_title', activeLang) || "Confirmación Requerida";
      if (!confirmText) confirmText = t('dialog_confirm_btn', activeLang) || "Confirmar";
      if (!cancelText) cancelText = t('dialog_cancel_btn', activeLang) || "Cancelar";
      const securityProtocolLabel = t('dialog_security_protocol', activeLang) || "Protocolo de Seguridad";

      const iconKey = (icon && typeof icon === 'string' && icon.startsWith('ui_')) ? icon : 'ui_shield';
      const container = this.getContainer();

      const isDanger = type === 'danger' || type === 'warning' || iconKey === 'ui_trash';
      const badgeBorder = isDanger ? 'rgba(239, 68, 68, 0.4)' : 'rgba(234, 179, 8, 0.4)';
      const badgeBg = isDanger ? 'rgba(239, 68, 68, 0.12)' : 'rgba(234, 179, 8, 0.12)';
      const iconColor = isDanger ? '#f87171' : 'var(--accent-gold)';
      const confirmBtnBg = isDanger 
        ? 'background: linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(185, 28, 28, 0.9)); border: 1.5px solid #ef4444; color: #ffffff; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.35);'
        : 'background: linear-gradient(135deg, var(--accent-gold), #b45309); border: 1.5px solid var(--accent-gold); color: #ffffff; box-shadow: 0 4px 16px var(--accent-gold-glow);';

      const isRtl = typeof activeLang === 'string' && ['ar', 'he', 'ur'].includes(activeLang);

      container.innerHTML = `
        <div class="crystal-card" dir="${isRtl ? 'rtl' : 'ltr'}" style="max-width: 460px; width: 100%; margin: auto; padding: 26px 22px; text-align: center; position: relative; border-radius: var(--radius-lg); box-shadow: 0 0 45px rgba(0,0,0,0.8), var(--glass-shadow-lg); animation: fadeIn 0.25s ease-out; box-sizing: border-box; border: 1.5px solid ${badgeBorder}; background: var(--glass-surface-1);">
          
          <!-- Insignia Circular SVG -->
          <div style="width: 58px; height: 58px; margin: 0 auto 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${badgeBg}; border: 1.5px solid ${badgeBorder}; color: ${iconColor}; box-shadow: 0 0 20px ${isDanger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'};">
            <span style="width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center;">
              ${renderIcon(iconKey)}
            </span>
          </div>

          <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: ${iconColor}; margin-bottom: 6px;">
            FeUniversal · ${securityProtocolLabel}
          </div>

          <h3 style="font-family: var(--font-display); font-size: 1.18rem; font-weight: 800; margin: 0 0 10px; color: var(--text-primary); line-height: 1.3;">
            ${title}
          </h3>

          <div style="background: var(--glass-inset); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 20px; text-align: left;">
            <p style="font-size: 0.84rem; color: #e2e8f0; line-height: 1.55; margin: 0; white-space: pre-line;">
              ${message}
            </p>
          </div>

          <!-- Acciones Explícitas: Cancelar / Confirmar -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button id="btn-sacred-dialog-cancel" class="btn-crystal" style="padding: 11px; font-size: 0.86rem; font-weight: 700; border-radius: var(--radius-full); cursor: pointer; color: var(--text-secondary); background: var(--glass-surface-2); border: 1px solid var(--glass-border); display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
              <span style="width: 14px; height: 14px; display: inline-flex;">${renderIcon('ui_close')}</span>
              <span>${cancelText}</span>
            </button>

            <button id="btn-sacred-dialog-confirm" class="btn-crystal" style="padding: 11px; font-size: 0.86rem; font-weight: 800; border-radius: var(--radius-full); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; ${confirmBtnBg}">
              <span style="width: 14px; height: 14px; display: inline-flex;">${renderIcon(iconKey === 'ui_trash' ? 'ui_trash' : 'ui_check')}</span>
              <span>${confirmText}</span>
            </button>
          </div>

        </div>
      `;

      container.style.display = "flex";

      const confirmBtn = document.getElementById("btn-sacred-dialog-confirm");
      const cancelBtn = document.getElementById("btn-sacred-dialog-cancel");

      const cleanup = () => {
        container.style.display = "none";
      };

      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          cleanup();
          if (onConfirm) onConfirm();
          resolve(true);
        }, { once: true });
        if (typeof confirmBtn.focus === 'function') confirmBtn.focus();
      }

      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          cleanup();
          if (onCancel) onCancel();
          resolve(false);
        }, { once: true });
      }

      container.addEventListener("click", (e) => {
        if (e.target === container) {
          cleanup();
          if (onCancel) onCancel();
          resolve(false);
        }
      }, { once: true });
    });
  }

  /**
   * Muestra un toast flotante temporal estilizado con SVG-CSS
   */
  static toast(message, duration = 3000, iconKey = 'ui_sparkles') {
    let toastEl = document.getElementById("sacred-toast-bubble");
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "sacred-toast-bubble";
      document.body.appendChild(toastEl);
    }

    toastEl.style.cssText = `
      position: fixed;
      bottom: 92px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(245, 158, 11, 0.7);
      color: #ffffff;
      padding: 10px 20px;
      border-radius: var(--radius-full);
      font-size: 0.86rem;
      font-weight: 700;
      line-height: 1.45;
      box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.35);
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      text-align: center;
      width: max-content;
      max-width: min(92vw, 420px);
      box-sizing: border-box;
      white-space: normal;
      word-break: break-word;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    `;

    // Limpiar posibles emojis del mensaje y renderizar icono SVG puro
    const cleanMessage = typeof message === 'string' 
      ? message.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
      : message;

    toastEl.innerHTML = `
      <span style="width: 16px; height: 16px; display: inline-flex; color: var(--accent-gold); flex-shrink: 0;">
        ${renderIcon(iconKey)}
      </span>
      <span>${cleanMessage}</span>
    `;

    // Trigger reflow for smooth CSS transition
    void toastEl.offsetHeight;

    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(-50%) translateY(0)";

    if (window._sacredToastTimeout) clearTimeout(window._sacredToastTimeout);
    window._sacredToastTimeout = setTimeout(() => {
      if (toastEl) {
        toastEl.style.opacity = "0";
        toastEl.style.transform = "translateX(-50%) translateY(20px)";
      }
    }, duration);
  }
}

if (typeof window !== 'undefined') {
  window.SacredDialog = SacredDialog;
}
