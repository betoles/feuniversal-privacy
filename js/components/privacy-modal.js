/**
 * PRIVACY POLICY & LEGAL MODAL COMPONENT (15 LANGUAGES)
 * FeUniversal - Faith & Prayers
 */

import { LEGAL_TRANSLATIONS } from '../data/legal-translations.js';
import { StorageService } from '../services/storage-service.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { t } from '../data/i18n.js';

export class PrivacyModalComponent {
  constructor() {
    this.container = null;
  }

  ensureContainer() {
    let el = document.getElementById('modal-privacy');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-privacy';
      document.body.appendChild(el);
    }
    el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(10, 14, 26, 0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 9999; padding: 20px 14px; align-items: center; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
    this.container = el;
  }

  open(customLang = null) {
    this.ensureContainer();
    const prefs = StorageService.getPreferences();
    const lang = customLang || prefs.idioma || 'es';
    this.render(lang);
    this.container.style.display = 'flex';
  }

  close() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  render(lang = 'es') {
    if (!this.container) this.ensureContainer();

    const legalData = (LEGAL_TRANSLATIONS && LEGAL_TRANSLATIONS[lang]) 
                   || (LEGAL_TRANSLATIONS && LEGAL_TRANSLATIONS['es'])
                   || {
                     name: 'Español',
                     dir: 'ltr',
                     header: { title: 'Políticas de Privacidad', subtitle: 'FeUniversal' },
                     sec1: { num: '01', title: 'Santuario Sin Publicidad', p1: 'Sin anuncios comerciales ni rastreo.' },
                     sec2: { num: '02', title: 'Cero Recolección', p1: 'Sus datos no salen de su dispositivo.' },
                     sec9: { num: '09', title: 'Aviso Médico', p1: 'No sustituye atención médica.' },
                     sec13: { num: '13', title: 'Idioma Prevaleciente', p1: 'Versión oficial en Español (México).' }
                   };

    const isRtl = legalData.dir === 'rtl';

    this.container.innerHTML = `
      <div class="crystal-card" style="background: #131b2e; border: 1.5px solid rgba(255, 255, 255, 0.14); border-radius: 22px; width: 100%; max-width: 680px; max-height: 88vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.9); overflow: hidden; font-family: 'Outfit', sans-serif; color: #f8fafc; position: relative;" dir="${isRtl ? 'rtl' : 'ltr'}">
        
        <!-- Header con Icono y Botón de Cierre -->
        <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.75); flex-shrink: 0; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div style="width: 38px; height: 38px; min-width: 38px; border-radius: 50%; background: radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent); border: 1px solid rgba(245, 158, 11, 0.4); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); flex-shrink: 0;">
              ${renderIcon('ui_lock')}
            </div>
            <div style="min-width: 0;">
              <h3 style="font-size: 1.02rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.25; overflow: hidden; text-overflow: ellipsis;">${legalData.header?.title || 'Políticas de Privacidad y Términos de Uso'}</h3>
              <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px; line-height: 1.2;">${legalData.header?.subtitle || 'Iniciativa Espiritual y Fraterna Universal'}</div>
            </div>
          </div>
          <button id="btn-close-privacy-modal" class="btn-modal-close-custom" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12); color: #cbd5e1; cursor: pointer; width: 34px; height: 34px; min-width: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Cerrar">
            ${renderIcon('ui_close')}
          </button>
        </div>

        <!-- Contenido Justificado y Formateado -->
        <div style="padding: 20px 22px; overflow-y: auto; font-size: 0.88rem; line-height: 1.75; color: #cbd5e1; display: flex; flex-direction: column; gap: 16px; flex: 1; text-align: justify; text-justify: inter-word;">
          
          <!-- Cláusula de Idioma Canónico -->
          <div style="padding: 12px 16px; border-radius: 14px; background: rgba(197, 160, 89, 0.1); border: 1px solid rgba(197, 160, 89, 0.35); font-size: 0.82rem; color: #fef08a; text-align: justify; text-justify: inter-word;">
            <strong style="color: #fde047;">${legalData.sec13?.title || 'Idioma Prevaleciente y Referencia Canónica'}:</strong> ${legalData.sec13?.p1 || 'La versión oficial y jurídicamente vinculante de este documento ha sido redactada en Español (México).'}
          </div>

          <!-- Artículo 01: Sin Publicidad -->
          <div style="padding: 16px 18px; border-radius: 14px; background: rgba(30, 41, 59, 0.55); border: 1px solid rgba(255, 255, 255, 0.08);">
            <h4 style="color: #ffffff; font-size: 0.94rem; margin-bottom: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--accent-gold); font-family: var(--font-code); font-weight: 800;">${legalData.sec1?.num || '01'}.</span>
              <span>${legalData.sec1?.title || 'Santuario Devocional Libre de Publicidad Comercial y Rastreo'}</span>
            </h4>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.86rem; text-align: justify; text-justify: inter-word;">${legalData.sec1?.p1 || 'La plataforma FeUniversal es un santuario espiritual libre de publicidad invasiva, banners comerciales, rastreadores ni mecanismos de monetización por terceros.'}</p>
          </div>

          <!-- Artículo 02: Cero Recolección -->
          <div style="padding: 16px 18px; border-radius: 14px; background: rgba(30, 41, 59, 0.55); border: 1px solid rgba(255, 255, 255, 0.08);">
            <h4 style="color: #ffffff; font-size: 0.94rem; margin-bottom: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--accent-gold); font-family: var(--font-code); font-weight: 800;">${legalData.sec2?.num || '02'}.</span>
              <span>${legalData.sec2?.title || 'Política de Privacidad Estricta y Cero Recolección de Datos'}</span>
            </h4>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.86rem; text-align: justify; text-justify: inter-word;">${legalData.sec2?.p1 || 'En estricto cumplimiento con el principio de minimización de datos (RGPD, CCPA/CPRA, LGPD), las oraciones y notas personales residen exclusivamente en su dispositivo.'}</p>
          </div>

          <!-- Artículo 09: Descargo de Salud (Google Play Health) -->
          <div style="padding: 16px 18px; border-radius: 14px; background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.35);">
            <h4 style="color: #fb7185; font-size: 0.94rem; margin-bottom: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="color: #f43f5e; font-family: var(--font-code); font-weight: 800;">${legalData.sec9?.num || '09'}.</span>
              <span>${legalData.sec9?.title || 'Aviso Médico y Descargo de Salud (Google Play Health)'}</span>
            </h4>
            <p style="color: #fecdd3; margin: 0; font-size: 0.86rem; text-align: justify; text-justify: inter-word;">${legalData.sec9?.p1 || 'Las oraciones y reflexiones espirituales son un acompañamiento para la paz interior; no sustituyen el diagnóstico, tratamiento ni consejo de profesionales médicos cualificados.'}</p>
          </div>

          <!-- Botón de Derecho al Olvido / Borrado Seguro -->
          <div style="padding: 16px 18px; border-radius: 16px; background: rgba(239, 68, 68, 0.07); border: 1.5px dashed rgba(239, 68, 68, 0.35); text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.25);">
            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.86rem; font-weight: 800; color: #fca5a5; margin-bottom: 6px;">
              <span style="width: 18px; height: 18px; display: inline-flex; color: #f87171;">${renderIcon('ui_shield')}</span>
              <span>${t('privacy_wipe_box_title', lang) || 'Seguridad de Datos y Derecho al Olvido'}</span>
            </div>
            <p style="font-size: 0.78rem; color: #cbd5e1; margin-bottom: 12px; line-height: 1.6; text-align: justify; text-justify: inter-word;">
              ${t('privacy_wipe_box_desc', lang) || 'Puedes eliminar permanentemente todas tus oraciones guardadas, notas personales, veladoras del altar e historial local de este dispositivo.'}
            </p>
            <button id="btn-wipe-local-data" class="btn-crystal" style="background: rgba(239, 68, 68, 0.22); border: 1.5px solid #ef4444; color: #fecdd3; padding: 10px 22px; border-radius: var(--radius-full); font-weight: 800; font-size: 0.80rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); transition: all var(--transition-fast);">
              <span style="width: 16px; height: 16px; display: inline-flex;">${renderIcon('ui_trash')}</span>
              <span>${t('privacy_wipe_box_btn', lang) || 'Restablecer todos mis datos locales'}</span>
            </button>
          </div>

          <!-- Enlace al Documento Completo en 17 Idiomas -->
          <div style="text-align: center; margin-top: 4px; padding-bottom: 4px;">
            <a href="privacy-policy.html" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: var(--radius-full); background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); color: #7dd3fc; text-decoration: none; font-weight: 700; font-size: 0.84rem; transition: all 0.2s;">
              <span>${t('privacy_open_legal_btn', lang) || 'Abrir documento legal completo (17 idiomas)'}</span>
              <span style="width: 14px; height: 14px; display: inline-flex;">${renderIcon('ui_sparkles')}</span>
            </a>
          </div>

        </div>
      </div>
    `;

    // Conectar eventos
    const closeBtn = document.getElementById('btn-close-privacy-modal');
    if (closeBtn) closeBtn.onclick = () => this.close();

    this.container.onclick = (e) => {
      if (e.target === this.container) this.close();
    };

    const wipeBtn = document.getElementById('btn-wipe-local-data');
    if (wipeBtn) {
      wipeBtn.onclick = () => {
        SacredDialog.confirm({
          title: t('privacy_wipe_title', lang) || 'Derecho al Olvido y Borrado de Datos',
          message: t('privacy_wipe_msg', lang) || '¿Confirmas la eliminación permanente de todas tus notas locales, oraciones guardadas, veladoras del altar y preferencias? Esta acción no se puede deshacer.',
          icon: 'ui_trash',
          type: 'danger',
          confirmText: t('privacy_wipe_confirm_btn', lang) || 'Eliminar Todo',
          cancelText: t('privacy_wipe_cancel_btn', lang) || 'Cancelar',
          onConfirm: () => {
            try {
              localStorage.clear();
              sessionStorage.clear();
              SacredDialog.toast(t('privacy_wipe_success_toast', lang) || 'Datos locales eliminados con éxito.', 2500, 'ui_check');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } catch (err) {
              console.error('Error wiping data:', err);
            }
          }
        });
      };
    }
  }
}

export function showPrivacyModal(lang = 'es') {
  const modal = new PrivacyModalComponent();
  modal.open(lang);
}

if (typeof window !== 'undefined') {
  window.PrivacyModalComponent = PrivacyModalComponent;
  window.showPrivacyModal = showPrivacyModal;
}

