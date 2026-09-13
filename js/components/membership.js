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

  open(isWeeklyReminder = false) {
    this.isWeeklyReminder = isWeeklyReminder;
    if (isWeeklyReminder) {
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

    let headline = t('membership_title', lang) || 'Membresía Santuario Celestial';
    let messageHtml = '';

    if (isPro) {
      headline = t('membership_active_headline', lang) || 'Membresía Celestial Activa';
      messageHtml = `<p style="font-size: 0.86rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 18px; line-height: 1.5;">${t('membership_active_msg', lang) || '¡Eres Miembro Sagrado Activo! Tienes acceso ilimitado a todas las bendiciones, música y funciones de FeUniversal.'}</p>`;
    } else if (this.isWeeklyReminder || daysLeft === 0) {
      headline = t('membership_reminder_headline', lang) || 'Recordatorio de Bendición';
      messageHtml = `
        <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: var(--radius-md); padding: 14px 16px; margin: 0 auto 18px; max-width: 500px;">
          <p style="font-size: 0.88rem; color: #fef08a; line-height: 1.55; margin: 0; font-style: italic;">
            ${t('membership_reminder_msg', lang) || '«Con profundo respeto, FeUniversal te recuerda que si te gustó la app y deseas seguir apoyando la plataforma puedes adquirir tu suscripción o compra, muchas gracias y eternas bendiciones.»'}
          </p>
        </div>
      `;
    } else {
      headline = t('membership_title', lang) || 'Membresía Santuario Celestial';
      messageHtml = `<p style="font-size: 0.86rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 18px; line-height: 1.5;">${t('membership_trial_desc', lang) || `Disfruta de tu Prueba Gratuita con TODO desbloqueado. 100% libre de anuncios comerciales para preservar tu paz interior.`}</p>`;
    }

    this.modal.innerHTML = `
      <div class="crystal-card" style="max-width: 580px; width: 100%; margin: auto 0; padding: 28px 24px; position: relative; max-height: 90vh; overflow-y: auto; box-sizing: border-box; text-align: center;">
        <button id="btn-close-membership-modal" class="btn-modal-close" title="Cerrar">${renderIcon('ui_close')}</button>

        <!-- Medallón Oficial FeUniversal -->
        <div style="width: 72px; height: 72px; margin: 0 auto 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 32px rgba(245, 158, 11, 0.55), 0 0 16px rgba(99, 102, 241, 0.4); box-sizing: border-box; overflow: hidden;">
          <img src="ico.png?v=5.0" alt="FeUniversal" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
        </div>

        <div style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-gold); margin-bottom: 6px;">
          FeUniversal · Faith & Prayers
        </div>

        <h2 style="font-family: var(--font-sacred); font-size: 1.35rem; margin: 0 0 8px; color: var(--text-primary); hyphens: none; -webkit-hyphens: none; word-break: keep-all; line-height: 1.25;">${headline}</h2>
        ${messageHtml}

        <!-- PILARES DE VALOR CON ICONOS SVG PUROS -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; text-align: left;">
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: var(--accent-cyan); display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('ui_audio')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.88rem; font-weight: 700; line-height: 1.3; margin-bottom: 3px;">${t('pillar_music_title', lang) || 'Música & Frecuencias'}</div>
              <div style="color: var(--text-muted); font-size: 0.78rem; line-height: 1.4;">${t('pillar_music_desc', lang) || '11 frecuencias y solfeggio sagrado.'}</div>
            </div>
          </div>
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('nav_altar')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.88rem; font-weight: 700; line-height: 1.3; margin-bottom: 3px;">${t('pillar_altar_title', lang) || 'Altar de 12 Colores'}</div>
              <div style="color: var(--text-muted); font-size: 0.78rem; line-height: 1.4;">${t('pillar_altar_desc', lang) || 'Veladoras litúrgicas consagradas.'}</div>
            </div>
          </div>
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: #60a5fa; display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('ui_compass')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.88rem; font-weight: 700; line-height: 1.3; margin-bottom: 3px;">${t('pillar_compass_title', lang) || 'Brújula Espiritual 3D'}</div>
              <div style="color: var(--text-muted); font-size: 0.78rem; line-height: 1.4;">${t('pillar_compass_desc', lang) || 'Skins Kaaba, Surya, Dharma y Cristal.'}</div>
            </div>
          </div>
          <div class="crystal-card" style="padding: 12px 14px; font-size: 0.84rem; background: var(--glass-inset); display: flex; align-items: flex-start; gap: 10px;">
            <span style="color: var(--accent-gold); display: flex; align-items: center; flex-shrink: 0; width: 22px; height: 22px; margin-top: 2px;">${renderIcon('nav_vault')}</span>
            <div style="min-width: 0;">
              <div style="color: var(--text-primary); font-size: 0.88rem; font-weight: 700; line-height: 1.3; margin-bottom: 3px;">${t('pillar_vault_title', lang) || 'Bóveda & FaithGPT'}</div>
              <div style="color: var(--text-muted); font-size: 0.78rem; line-height: 1.4;">${t('pillar_vault_desc', lang) || 'Diario cifrado y oraciones con IA.'}</div>
            </div>
          </div>
        </div>

        <!-- PLANES DE MEMBRESÍA -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px;">
          <!-- PLAN ANUAL: $2.99 -->
          <div class="crystal-card" style="padding: 16px 12px; border: 1px solid rgba(234, 179, 8, 0.4); background: var(--glass-surface-1); display: flex; flex-direction: column; justify-content: space-between;">
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
          if (badge) badge.innerHTML = '👑 <span>PRO</span>';
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
            badge.innerHTML = '👑 <span>PRO</span>';
          }
        }
      });
    });
  }
}


