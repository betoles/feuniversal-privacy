/**
 * MEMBERSHIP COMPONENT - SANTUARIO CELESTIAL PRO
 * 7 Días de Prueba Gratis · $2.99 USD/año · $4.99 USD Vitalicio · CERO ANUNCIOS
 * FeUniversal - Faith & Prayers
 */

import { StorageService } from '../services/storage-service.js';
import { BillingService } from '../services/billing-service.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { t } from '../data/i18n.js';

export class MembershipComponent {
  constructor() {
    this.modal = null;
    this.isWeeklyReminder = false;
  }

  open(context = null) {
    this.context = typeof context === 'string' ? context : (context === true ? 'weekly_reminder' : null);
    if (this.context === 'weekly_reminder') {
      StorageService.recordPaywallReminderShown();
    }
    this.ensureModal();
    this.render();
    this.modal.style.display = 'flex';
    if (this.modal) this.modal.scrollTop = 0;
  }

  close() {
    if (this.modal) this.modal.style.display = 'none';
  }

  ensureModal() {
    let el = document.getElementById('modal-membership');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-membership';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 3500; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    this.modal = el;
  }

  render() {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const sub = StorageService.getSubscription();
    const daysLeft = StorageService.getTrialDaysRemaining();
    const isPro = sub.isPremium;
    const isNative = StorageService.isNativePlatform();

    let headline = t('membership_title', lang) || 'Membresía Santuario Celestial';
    let headlineIcon = 'ui_sparkles';
    let messageHtml = '';

    if (isPro) {
      headline = t('membership_active_headline', lang) || 'Membresía Celestial Activa';
      headlineIcon = 'ui_check';
      messageHtml = `<p style="font-size: 0.86rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 16px; line-height: 1.5;">${t('membership_active_msg', lang) || '¡Eres Miembro Sagrado Activo! Tienes acceso ilimitado a todas las bendiciones, música y funciones de FeUniversal.'}</p>`;
    } else if (this.context === 'prayer_limit') {
      headline = t('prayer_limit_headline', lang) || 'Cuota Diaria de Oraciones';
      headlineIcon = 'nav_scriptures';
      const quotaLimit = isNative ? '3' : '2';
      messageHtml = `
        <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: var(--radius-md); padding: 14px 16px; margin: 0 auto 16px; max-width: 500px; text-align: start;">
          <p style="font-size: 0.86rem; color: #fef08a; line-height: 1.55; margin: 0; font-style: italic;">
            «Con profundo respeto, has alcanzado tus ${quotaLimit} oraciones devocionales de hoy en la versión gratuita. Puedes regresar mañana con una nueva bendición diaria o, si deseas orar sin límites y acceder a todas las frecuencias sagradas y lecturas guiadas, te invitamos a unirte al Santuario PRO.»
          </p>
        </div>
      `;
    } else if (this.context === 'candle_limit') {
      headline = t('candle_limit_headline', lang) || 'Altar Mayor de 12 Veladoras';
      headlineIcon = 'nav_altar';
      messageHtml = `
        <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: var(--radius-md); padding: 14px 16px; margin: 0 auto 16px; max-width: 500px; text-align: start;">
          <p style="font-size: 0.86rem; color: #fef08a; line-height: 1.55; margin: 0; font-style: italic;">
            «En el modo devocional libre puedes mantener 1 veladora encendida con tu intención sagrada activa. Para consagrar múltiples veladoras de los 12 colores litúrgicos simultáneamente y preservar su llama perpetua, te invitamos a unirte al Santuario PRO.»
          </p>
        </div>
      `;
    } else if (this.context === 'weekly_reminder' || daysLeft === 0) {
      headline = t('membership_reminder_headline', lang) || 'Recordatorio de Bendición';
      headlineIcon = 'ui_sparkles';
      messageHtml = `
        <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: var(--radius-md); padding: 14px 16px; margin: 0 auto 16px; max-width: 500px; text-align: start;">
          <p style="font-size: 0.86rem; color: #fef08a; line-height: 1.55; margin: 0; font-style: italic;">
            ${t('membership_reminder_msg', lang) || '«Con profundo respeto, FeUniversal te recuerda que si te gustó la app y deseas seguir apoyando la plataforma puedes adquirir tu suscripción o compra, muchas gracias y eternas bendiciones.»'}
          </p>
        </div>
      `;
    } else {
      headline = t('membership_title', lang) || 'Membresía Santuario Celestial';
      headlineIcon = 'ui_sparkles';
      messageHtml = `<p style="font-size: 0.86rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 16px; line-height: 1.5;">${t('membership_trial_desc', lang) || `Disfruta de tu Prueba Gratuita con TODO desbloqueado. 100% libre de anuncios comerciales para preservar tu paz interior.`}</p>`;
    }

    this.modal.innerHTML = `
      <div class="crystal-card" style="max-width: 540px; width: 100%; margin: auto 0; padding: clamp(18px, 4vw, 28px) clamp(14px, 3.5vw, 24px); position: relative; max-height: calc(100vh - 36px); overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box; text-align: center; border: 1.5px solid var(--glass-border-highlight); box-shadow: 0 24px 60px rgba(0,0,0,0.75);">
        <button id="btn-close-membership-modal" class="btn-modal-close" title="Cerrar" style="position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--glass-surface-2); border: 1px solid var(--glass-border); color: var(--text-secondary); cursor: pointer; z-index: 10;">
          <span style="display: flex; width: 16px; height: 16px;">${renderIcon('ui_close')}</span>
        </button>

        <!-- Medallón Oficial FeUniversal -->
        <div style="width: 64px; height: 64px; margin: 0 auto 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 28px rgba(245, 158, 11, 0.55), 0 0 14px rgba(99, 102, 241, 0.4); box-sizing: border-box; overflow: hidden; border: 2px solid rgba(251, 191, 36, 0.6);">
          <img src="ico.png?v=5.0" alt="FeUniversal" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
        </div>

        <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-gold); margin-bottom: 4px;">
          FeUniversal · Faith & Prayers
        </div>

        <h2 style="font-family: var(--font-sacred); font-size: clamp(1.15rem, 3.5vw, 1.35rem); margin: 0 0 8px; color: var(--text-primary); display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;">
          <span style="width: 20px; height: 20px; display: inline-flex; color: var(--accent-gold); flex-shrink: 0;">${renderIcon(headlineIcon)}</span>
          <span>${headline}</span>
        </h2>
        ${messageHtml}

        <!-- PILARES DE VALOR CON ICONOS SVG PUROS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 16px; text-align: start;">
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: var(--accent-cyan); display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('ui_audio')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.86rem; font-weight: 700; line-height: 1.3; margin-bottom: 2px;">${t('pillar_music_title', lang) || 'Música & Frecuencias'}</div>
              <div style="color: var(--text-muted); font-size: 0.74rem; line-height: 1.35;">${t('pillar_music_desc', lang) || '11 frecuencias sagradas y solfeggio sin límites.'}</div>
            </div>
          </div>
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('nav_altar')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.86rem; font-weight: 700; line-height: 1.3; margin-bottom: 2px;">${t('pillar_altar_title', lang) || 'Altar Consagrado'}</div>
              <div style="color: var(--text-muted); font-size: 0.74rem; line-height: 1.35;">${t('pillar_altar_desc', lang) || 'Hasta 12 veladoras simultáneas y llama eterna.'}</div>
            </div>
          </div>
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: #60a5fa; display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('ui_compass')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.86rem; font-weight: 700; line-height: 1.3; margin-bottom: 2px;">${t('pillar_compass_title', lang) || 'Brújula 3D Mística'}</div>
              <div style="color: var(--text-muted); font-size: 0.74rem; line-height: 1.35;">${t('pillar_compass_desc', lang) || 'Skins 3D Kaaba, Surya Mandala y Dharma Zen.'}</div>
            </div>
          </div>
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('nav_vault')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.86rem; font-weight: 700; line-height: 1.3; margin-bottom: 2px;">${t('pillar_vault_title', lang) || 'Bóveda & FaithGPT'}</div>
              <div style="color: var(--text-muted); font-size: 0.74rem; line-height: 1.35;">${t('pillar_vault_desc', lang) || 'Oraciones con IA ilimitadas y diario cifrado.'}</div>
            </div>
          </div>
        </div>

        <!-- CUADRO COMPARATIVO MODO LIBRE VS PRO (100% SVG, I18N Y RESPONSIVO) -->
        <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 18px; text-align: start;">
          <div style="font-size: 0.72rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <span class="icon-inline" style="width: 14px; height: 14px; color: var(--accent-gold);">${renderIcon('ui_sparkles')}</span>
            <span>${t('benefits_comparison_title', lang) || 'Comparativa de Beneficios'}</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 8px; font-size: 0.74rem;">
            <div style="background: var(--glass-surface-1); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.06);">
              <div style="color: var(--text-muted); font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span class="icon-inline" style="width: 14px; height: 14px; color: var(--accent-cyan);">${renderIcon('ui_sun')}</span>
                <span>${t('benefits_free_title', lang) || 'Modo Gratuito'}</span>
              </div>
              <div style="color: var(--text-secondary); line-height: 1.45;">
                ${t(isNative ? 'benefits_free_prayers_3' : 'benefits_free_prayers_2', lang) || (isNative ? '• 3 oraciones diarias' : '• 2 oraciones diarias')}<br>
                ${t('benefits_free_candle', lang) || '• 1 veladora activa en altar'}<br>
                ${t('benefits_free_sounds', lang) || '• 3 sonidos de meditación'}<br>
                ${t('benefits_free_compass', lang) || '• Brújula clásica astrolabio'}
              </div>
            </div>
            <div style="background: rgba(234, 179, 8, 0.08); padding: 10px 12px; border-radius: var(--radius-sm); border: 1.5px solid rgba(234, 179, 8, 0.35);">
              <div style="color: var(--accent-gold); font-weight: 800; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span class="icon-inline" style="width: 14px; height: 14px; color: var(--accent-gold);">${renderIcon('ui_sparkles')}</span>
                <span>${t('benefits_pro_title', lang) || 'Santuario PRO'}</span>
              </div>
              <div style="color: var(--text-primary); font-weight: 600; line-height: 1.45;">
                ${t('benefits_pro_prayers', lang) || '• <strong>Oraciones ilimitadas</strong>'}<br>
                ${t('benefits_pro_candles', lang) || '• <strong>12 veladoras</strong> simultáneas'}<br>
                ${t('benefits_pro_frequencies', lang) || '• <strong>11 frecuencias</strong> completas'}<br>
                ${t('benefits_pro_compass_3d', lang) || '• <strong>Brújula 3D</strong> Kaaba/Surya/Zen'}<br>
                ${t('benefits_pro_vault_ai', lang) || '• <strong>Bóveda con IA</strong> ilimitada'}
              </div>
            </div>
          </div>
        </div>

        <!-- PLANES DE MEMBRESÍA -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 18px;">
          <!-- PLAN ANUAL: $2.99 -->
          <div class="crystal-card" style="padding: 16px 12px; border: 1.5px solid rgba(234, 179, 8, 0.4); background: var(--glass-surface-1); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="hud-pill dot-gold" style="font-size: 0.65rem; margin-bottom: 6px;">${t('plan_annual_badge', lang) || '7 DÍAS GRATIS'}</span>
              <div style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">${t('plan_annual_title', lang) || 'Plan Anual'}</div>
              <div style="font-size: 1.45rem; font-weight: 900; color: var(--accent-gold); margin: 6px 0 2px;">$2.99 <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${t('plan_annual_unit', lang) || 'USD/año'}</span></div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 12px;">${t('plan_annual_rate', lang) || 'Solo $0.25 al mes'}</div>
            </div>
            <button class="btn-crystal btn-crystal-gold btn-activate-plan" data-plan="annual" style="width: 100%; min-height: 48px; padding: 8px; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
              ${isPro && sub.planType === 'annual' ? (t('plan_active', lang) || '✓ Activo') : (t('plan_annual_btn', lang) || 'Elegir Anual')}
            </button>
          </div>

          <!-- PLAN VITALICIO FUNDADOR: $4.99 -->
          <div class="crystal-card" style="padding: 16px 12px; border: 2px solid var(--accent-gold); background: linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(99, 102, 241, 0.1)); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: visible;">
            <div style="position: absolute; top: -11px; right: 8px; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #ffffff; font-size: 0.62rem; font-weight: 900; padding: 2px 8px; border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.04em; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5); z-index: 10; border: 1px solid rgba(255,255,255,0.6);">
              ${t('plan_most_popular', lang) || 'MÁS POPULAR'}
            </div>
            <div>
              <span class="hud-pill dot-cyan" style="font-size: 0.65rem; margin-bottom: 6px;">${t('plan_lifetime_badge', lang) || 'PAGO ÚNICO'}</span>
              <div style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">${t('plan_lifetime_title', lang) || 'Pase Vitalicio'}</div>
              <div style="font-size: 1.45rem; font-weight: 900; color: var(--accent-gold); margin: 6px 0 2px;">$4.99 <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">USD</span></div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 12px;">${t('plan_lifetime_rate', lang) || 'De por vida · Sin renovar'}</div>
            </div>
            <button class="btn-crystal btn-crystal-primary btn-activate-plan" data-plan="lifetime" style="width: 100%; min-height: 48px; padding: 8px; font-size: 0.80rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
              ${isPro && sub.planType === 'lifetime' ? (t('plan_active', lang) || '✓ Activo') : (t('plan_lifetime_btn', lang) || 'Pase Vitalicio')}
            </button>
          </div>
        </div>

        <!-- TARJETA DE MICRO-OFRENDA VOLUNTARIA ($0.49 USD) -->
        <div class="crystal-card" style="padding: 14px 16px; background: var(--glass-surface-1); border-radius: var(--radius-md); border: 1.5px solid var(--glass-border); text-align: center; margin-bottom: 14px; box-shadow: var(--glass-shadow-sm);">
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 4px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;">
            ${t('micro_offering_title', lang) || 'Micro-Ofrenda Litúrgica ($0.49 USD)'}
          </div>
          <div style="font-size: 0.76rem; color: var(--text-primary); opacity: 0.92; margin-bottom: 10px; line-height: 1.45; font-weight: 500;">
            ${t('micro_offering_desc', lang) || 'Apadrina la traducción de nuevas oraciones desde lenguas sagradas y dialectos ancestrales. Puedes donar libremente cada vez que tu corazón tenga el deseo de apoyar a la fe del mundo entero; tu aportación es muy valiosa.'}
          </div>
          <button id="btn-membership-micro-offering" class="btn-crystal" style="min-height: 48px; padding: 10px 24px; font-size: 0.82rem; border-radius: var(--radius-full); color: var(--text-primary); font-weight: 800; background: linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.28)); border: 1.5px solid var(--accent-gold); box-shadow: 0 2px 8px var(--accent-gold-glow); display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
            <span style="width: 16px; height: 16px; display: inline-flex; color: var(--accent-gold);">${renderIcon('ui_heart')}</span>
            <span>${t('habit_offer_btn', lang) || 'Ofrendar $0.49 USD'}</span>
          </button>
        </div>

        <!-- NOTA DE TRANSPARENCIA GOOGLE PLAY & PAYPAL BILLING -->
        <div style="margin: 8px 0 12px; padding: 10px 14px; background: rgba(0,0,0,0.3); border-radius: var(--radius-sm); border: 1px solid var(--glass-border); font-size: 0.72rem; color: var(--text-muted); line-height: 1.45; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span style="width: 14px; height: 14px; display: inline-flex; color: var(--accent-cyan); flex-shrink: 0;">${renderIcon('ui_sparkles')}</span>
          <span>${BillingService.isNativePlatform() 
            ? (t('google_play_terms_note', lang) || 'Las suscripciones se renuevan automáticamente salvo cancelación. Puedes gestionar o cancelar en cualquier momento desde Google Play Store > Pagos y Suscripciones.') 
            : (t('paypal_terms_note', lang) || 'Pagos seguros procesados con cifrado SSL bancario a través de PayPal y tarjetas bancarias. Las suscripciones anuales incluyen 7 días de prueba gratuita.')}</span>
        </div>

        <!-- ACCIONES SECUNDARIAS & RESTAURAR COMPRAS -->
        <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <button id="btn-restore-purchases" class="btn-crystal" style="background: transparent; border: none; font-size: 0.76rem; color: var(--text-muted); text-decoration: underline; cursor: pointer; padding: 4px 8px; display: inline-flex; align-items: center; gap: 4px;">
              <span>${renderIcon('ui_refresh')}</span>
              <span>${t('restore_purchases_btn', lang) || 'Restaurar Compras'}</span>
            </button>
            <button id="btn-continue-free-mode" class="btn-crystal" style="background: transparent; border: none; font-size: 0.76rem; color: var(--text-muted); text-decoration: underline; cursor: pointer; padding: 4px 8px;">
              ${t('continue_free_mode_btn', lang) || 'Continuar en Modo Gratuito'}
            </button>
          </div>
          <div style="margin-top: 4px; font-size: 0.72rem; color: var(--text-muted); text-align: center;">
            <a href="privacy-policy.html" target="_blank" rel="noopener noreferrer" style="color: var(--accent-cyan); text-decoration: underline;">
              ${t('privacy_policy_title', lang) || 'Política de Privacidad y Términos de Servicio'} ↗
            </a>
          </div>
        </div>

      </div>
    `;

    const closeBtn = document.getElementById('btn-close-membership-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const continueBtn = document.getElementById('btn-continue-free-mode');
    if (continueBtn) continueBtn.addEventListener('click', () => this.close());

    const microBtn = document.getElementById('btn-membership-micro-offering');
    if (microBtn) {
      microBtn.addEventListener('click', async () => {
        const res = await BillingService.purchaseProduct('micro_offering');
        if (res && res.method === 'paypal_web') {
          SacredDialog.toast(t('paypal_redirecting_toast', lang) || 'Abriendo pasarela de ofrenda segura PayPal...', 3000, 'ui_heart');
        } else if (res && res.success) {
          SacredDialog.alert({
            title: t('micro_offering_thanks_title', lang) || 'Micro-Ofrenda Litúrgica ($0.49 USD)',
            message: t('micro_offering_thanks_msg', lang) || '¡Muchas gracias por tu generosidad! Tu ofrenda apadrina la traducción de nuevas oraciones y preserva el santuario universal.',
            icon: 'ui_heart',
            buttonText: t('close_label', lang) || 'Aceptar',
            type: 'gold'
          });
        }
      });
    }

    const restoreBtn = document.getElementById('btn-restore-purchases');
    if (restoreBtn) {
      restoreBtn.addEventListener('click', async () => {
        SacredDialog.toast(t('checking_purchases_msg', lang) || 'Verificando compras previas...', 2000, 'ui_refresh');
        const result = await BillingService.restorePurchases();
        if (result && result.restored) {
          SacredDialog.alert({
            title: t('membership_purchases_restored_title', lang) || 'Compras Restauradas',
            message: t('membership_purchases_restored_msg', lang) || 'Tu plan previo ha sido restaurado con éxito.',
            icon: 'ui_check',
            buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
            type: 'gold'
          });
          this.render();
          const badge = document.getElementById('header-membership-badge');
          if (badge) {
            badge.innerHTML = '<span>PRO</span>';
          }
        } else {
          SacredDialog.toast(t('membership_no_purchases_toast', lang) || 'No se encontraron compras previas activas.', 3000, 'ui_info');
        }
      });
    }

    this.modal.querySelectorAll('.btn-activate-plan').forEach(btn => {
      btn.addEventListener('click', async () => {
        const plan = btn.getAttribute('data-plan');
        const res = await BillingService.purchaseProduct(plan);
        if (res && res.method === 'paypal_web') {
          SacredDialog.toast(t('paypal_checkout_opened_toast', lang) || 'Abriendo pasarela de pago seguro en PayPal...', 3500, 'ui_sparkles');
        } else if (res && res.success) {
          SacredDialog.alert({
            title: t('membership_pass_activated_title', lang) || 'Bendición Activada con Éxito',
            message: t('membership_pass_activated_msg', lang) || 'Has adquirido tu plan. Disfruta de todas las funciones de tu Santuario Celestial.',
            icon: 'ui_check',
            buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
            type: 'gold'
          });
          this.render();
          const badge = document.getElementById('header-membership-badge');
          if (badge) {
            badge.innerHTML = '<span>PRO</span>';
          }
        }
      });
    });
  }
}


