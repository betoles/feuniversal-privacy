import { t, isRTL } from '../data/i18n.js';
import { SacredDialog } from './sacred-dialog.js';
import { renderIcon } from './icons.js';
import { StorageService } from '../services/storage-service.js';

export const SUPPORT_EMAIL = 'feuniversal_faith_and_prayers@outlook.com';

export class TranslationReportModalComponent {
  constructor() {
    this.modal = null;
    this.currentPrayer = null;
    this.selectedScreenshot = null;
  }

  ensureModal() {
    let el = document.getElementById('modal-translation-report');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-translation-report';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 4000; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    this.modal = el;
  }

  open(prayer) {
    this.currentPrayer = prayer;
    this.selectedScreenshot = null;
    this.ensureModal();
    this.render();
    this.modal.style.display = 'flex';
    if (this.modal) this.modal.scrollTop = 0;
  }

  close() {
    if (this.modal) this.modal.style.display = 'none';
  }

  render() {
    const p = this.currentPrayer || {};
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const isLangRTL = isRTL(lang);
    const prayerTitle = (p.titulo && (p.titulo[lang] || p.titulo.es)) || p.titulo || 'Oración Litúrgica';
    const tradKey = p.tradicion || 'Universal';
    const origLang = p.idiomaLiturgicoOriginal || 'la';

    const defaultType = t('report_option_fidelity', lang);

    this.modal.innerHTML = `
      <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="max-width: 480px; width: 100%; margin: auto 0; padding: 22px 16px 28px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box; text-align: ${isLangRTL ? 'right' : 'left'};">
        <button id="btn-close-report-modal" class="btn-modal-close" title="${t('close_label', lang) || 'Cerrar'}" style="${isLangRTL ? 'left: 12px; right: auto;' : 'right: 12px; left: auto;'}">${renderIcon('ui_close')}</button>

        <div style="text-align: center; margin-bottom: 16px;">
          <div style="width: 48px; height: 48px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), var(--accent-indigo)); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 18px var(--accent-gold-glow);">
            ${renderIcon('ui_dove')}
          </div>
          <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; margin: 0 0 8px; color: var(--text-primary); line-height: 1.25;">
            ${t('report_modal_title', lang)}
          </h3>
          <p style="font-size: 0.94rem; color: #f3f4f6; margin: 0 auto; line-height: 1.6; max-width: 450px; text-align: center; text-wrap: balance; font-weight: 500;">
            ${t('report_modal_desc', lang)}
          </p>
        </div>

        <div class="crystal-card" style="padding: 10px 14px; background: var(--glass-inset); margin-bottom: 14px; font-size: 0.88rem; ${isLangRTL ? 'border-right: 3px solid var(--accent-gold); border-left: none;' : 'border-left: 3px solid var(--accent-gold); border-right: none;'} box-sizing: border-box; width: 100%;">
          <div style="font-weight: 800; font-size: 0.96rem; color: var(--accent-gold); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prayerTitle}</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 3px;">
            ${t('report_tradition_label', lang)} <strong>${tradKey.toUpperCase()}</strong> · ${t('root_label', lang) || 'Idioma raíz'}: <strong>${origLang.toUpperCase()}</strong>
          </div>
        </div>

        <div style="margin-bottom: 14px;">
          <label style="display: block; font-size: 0.88rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">${t('report_type_label', lang)}</label>
          <div id="report-type-chips" style="display: grid; grid-template-columns: 1fr; gap: 7px; width: 100%; box-sizing: border-box;">
            <button type="button" class="report-type-chip active" data-type="${t('report_option_fidelity', lang)}" style="font-size: 0.88rem; padding: 11px 14px; text-align: ${isLangRTL ? 'right' : 'left'};">
              <span class="chip-radio-dot"></span>
              <span>${t('report_option_fidelity', lang)}</span>
            </button>
            <button type="button" class="report-type-chip" data-type="${t('report_option_grammar', lang)}" style="font-size: 0.88rem; padding: 11px 14px; text-align: ${isLangRTL ? 'right' : 'left'};">
              <span class="chip-radio-dot"></span>
              <span>${t('report_option_grammar', lang)}</span>
            </button>
            <button type="button" class="report-type-chip" data-type="${t('report_option_root_text', lang)}" style="font-size: 0.88rem; padding: 11px 14px; text-align: ${isLangRTL ? 'right' : 'left'};">
              <span class="chip-radio-dot"></span>
              <span>${t('report_option_root_text', lang)} (${origLang.toUpperCase()})</span>
            </button>
            <button type="button" class="report-type-chip" data-type="${t('report_option_phonetics', lang)}" style="font-size: 0.88rem; padding: 11px 14px; text-align: ${isLangRTL ? 'right' : 'left'};">
              <span class="chip-radio-dot"></span>
              <span>${t('report_option_phonetics', lang)}</span>
            </button>
            <button type="button" class="report-type-chip" data-type="${t('report_option_doctrine', lang)}" style="font-size: 0.88rem; padding: 11px 14px; text-align: ${isLangRTL ? 'right' : 'left'};">
              <span class="chip-radio-dot"></span>
              <span>${t('report_option_doctrine', lang)}</span>
            </button>
          </div>
          <input type="hidden" id="report-type" value="${defaultType}">
        </div>

        <div style="margin-bottom: 14px;">
          <label style="display: block; font-size: 0.88rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">${t('report_detail_label', lang)}</label>
          <textarea id="report-details" class="form-textarea" placeholder="${t('report_placeholder_suggest', lang)}" style="font-size: 0.90rem; min-height: 85px; width: 100%; box-sizing: border-box; line-height: 1.45; text-align: ${isLangRTL ? 'right' : 'left'}; direction: ${isLangRTL ? 'rtl' : 'ltr'};"></textarea>
        </div>

        <input type="file" id="report-screenshot-input" accept="image/*" style="display: none;">
        
        <div id="btn-trigger-screenshot" class="crystal-card" style="padding: 11px 14px; margin-bottom: 16px; background: rgba(99, 102, 241, 0.08); border: 1px dashed rgba(99, 102, 241, 0.45); font-size: 0.84rem; color: var(--text-secondary); line-height: 1.4; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; gap: 4px; box-sizing: border-box; width: 100%;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px; color: var(--text-primary); font-weight: 700; font-size: 0.88rem;">
              <span style="display: flex; align-items: center; color: var(--accent-cyan);">${renderIcon('ui_camera')}</span>
              <span>${t('report_attach_screenshot', lang)}</span>
            </div>
            <span class="hud-pill dot-gold" style="font-size: 0.72rem; font-weight: 800; padding: 3px 8px;">${t('report_tap_to_choose', lang)}</span>
          </div>
          <div id="screenshot-status-text" style="font-size: 0.80rem; color: var(--text-muted); margin-top: 2px;">
            ${t('report_gallery_hint', lang)}
          </div>
        </div>

        <!-- ACCIONES DE ENVÍO -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 4px; width: 100%; box-sizing: border-box;">
          <button id="btn-send-email" class="btn-crystal btn-crystal-primary" style="width: 100%; padding: 13px 16px; font-weight: 800; font-size: 0.96rem; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: var(--radius-md); box-sizing: border-box; text-align: center;">
            <span style="display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('ui_sparkles')}</span>
            <span style="line-height: 1.3;">${t('report_btn_send', lang)}</span>
          </button>

          <button id="btn-copy-report" class="btn-crystal" style="width: 100%; padding: 11px 14px; font-size: 0.86rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: var(--radius-md); color: var(--text-secondary); background: var(--glass-surface-2); border: 1px solid var(--glass-border); box-sizing: border-box; text-align: center; cursor: pointer;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;">
              <span style="display: inline-flex; align-items: center; justify-content: center; color: var(--accent-gold); flex-shrink: 0; width: 16px; height: 16px;">${renderIcon('ui_copy')}</span>
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.88rem;">${t('report_btn_copy', lang)}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); word-break: break-all; max-width: 100%; line-height: 1.25; opacity: 0.9;">
              ${SUPPORT_EMAIL}
            </div>
          </button>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const closeBtn = document.getElementById('btn-close-report-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Chips de Tipo de Aporte
    const chips = this.modal.querySelectorAll('.report-type-chip');
    const typeInput = document.getElementById('report-type');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (typeInput) typeInput.value = chip.getAttribute('data-type');
      });
    });

    // Captura de Pantalla
    const triggerScreenshotBtn = document.getElementById('btn-trigger-screenshot');
    const fileInput = document.getElementById('report-screenshot-input');
    const statusText = document.getElementById('screenshot-status-text');

    if (triggerScreenshotBtn && fileInput) {
      triggerScreenshotBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          this.selectedScreenshot = file;
          if (statusText) {
            statusText.innerHTML = `✅ <strong>${t('report_screenshot_ready', lang)}</strong> ${file.name} (${Math.round(file.size / 1024)} KB)`;
            statusText.style.color = 'var(--accent-cyan)';
          }
        }
      });
    }

    // Botón Enviar Correo
    const sendEmailBtn = document.getElementById('btn-send-email');
    if (sendEmailBtn) {
      sendEmailBtn.addEventListener('click', async () => {
        const p = this.currentPrayer || {};
        const currentPrefs = StorageService.getPreferences();
        const currentLang = currentPrefs.idioma || 'es';
        const prayerTitle = (p.titulo && (p.titulo[currentLang] || p.titulo.es)) || p.titulo || 'Oración Litúrgica';
        const type = document.getElementById('report-type')?.value || t('report_option_fidelity', currentLang);
        const details = document.getElementById('report-details')?.value || '';

        if (!details.trim()) {
          SacredDialog.alert({
            title: t('report_alert_required_title', currentLang),
            message: t('report_alert_required_msg', currentLang),
            icon: 'ui_dove',
            buttonText: t('dialog_understood', currentLang) || t('offering_alert_btn', currentLang) || 'OK',
            type: 'warning'
          });
          return;
        }

        const subjectText = `🕊️ ${t('report_email_subject_prefix', currentLang)} ${prayerTitle} [${p.id || 'N/A'}]`;
        const screenshotText = this.selectedScreenshot 
          ? `\n- ${t('report_email_screenshot_attached', currentLang)} (${this.selectedScreenshot.name})` 
          : `\n- ${t('report_email_screenshot_hint', currentLang)}`;
        
        const bodyText = `${t('report_email_greeting', currentLang)}\n\n${t('report_email_intro', currentLang)}\n- ${t('prayer_label', currentLang) || 'Oración'}: ${prayerTitle}\n- ${t('report_email_tradition', currentLang)} ${p.tradicion || 'Universal'}\n- ${t('report_email_root_lang', currentLang)} ${p.idiomaLiturgicoOriginal || 'N/A'}\n- ${t('report_email_type', currentLang)} ${type}${screenshotText}\n\n${t('report_email_obs', currentLang)}\n${details.trim()}\n\n---\n${t('report_email_footer', currentLang)}`;

        if (this.selectedScreenshot && navigator.canShare && navigator.canShare({ files: [this.selectedScreenshot] })) {
          try {
            await navigator.share({
              title: subjectText,
              text: bodyText,
              files: [this.selectedScreenshot]
            });
            this.close();
            return;
          } catch (err) {
            console.log('Share canceled or fallback to mailto:', err);
          }
        }

        const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
        window.location.href = mailtoUrl;

        SacredDialog.alert({
          title: t('report_alert_sent_title', currentLang),
          message: t('report_alert_sent_msg', currentLang),
          icon: 'ui_dove',
          buttonText: t('dialog_accept', currentLang) || t('offering_alert_btn', currentLang) || 'OK',
          type: 'success'
        });

        this.close();
      });
    }

    // Botón Copiar con Diálogo Nativo Estético
    const copyBtn = document.getElementById('btn-copy-report');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const p = this.currentPrayer || {};
        const currentPrefs = StorageService.getPreferences();
        const currentLang = currentPrefs.idioma || 'es';
        const prayerTitle = (p.titulo && (p.titulo[currentLang] || p.titulo.es)) || p.titulo || 'Oración Litúrgica';
        const type = document.getElementById('report-type')?.value || t('report_option_fidelity', currentLang);
        const details = document.getElementById('report-details')?.value || '';

        const fullText = `${t('report_recipient_label', currentLang)} ${SUPPORT_EMAIL}\n${t('report_subject_label', currentLang)} ${t('report_email_subject_prefix', currentLang)} ${prayerTitle}\n${t('report_email_type', currentLang)} ${type}\n${t('report_email_obs', currentLang)} ${details || '(N/A)'}`;

        const copySafely = (str) => {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              return navigator.clipboard.writeText(str);
            }
          } catch (e) {}

          const textArea = document.createElement('textarea');
          textArea.value = str;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
          } catch (err) {}
          document.body.removeChild(textArea);
          return Promise.resolve();
        };

        await copySafely(fullText);

        SacredDialog.alert({
          title: t('report_alert_copied_title', currentLang),
          message: `${t('report_alert_copied_msg', currentLang)}\n\n${SUPPORT_EMAIL}`,
          icon: 'ui_dove',
          buttonText: t('dialog_accept', currentLang) || t('offering_alert_btn', currentLang) || 'OK',
          type: 'gold'
        });
      });
    }
  }
}
