/**
 * BILLING SERVICE - DUAL ENGINE (GOOGLE PLAY & PAYPAL MERCHANT CHECKOUT)
 * FeUniversal - Faith & Prayers
 * 
 * - Móvil / Android Nativo (Capacitor): Google Play Billing Library v6/v7
 * - Web / PC / iOS Web: Pasarela Segura PayPal Merchant (ID: EQNTHLAVHUL52)
 *   * Plan Anual: $2.99 USD/año con 7 días de prueba gratuita ($0.00 hoy)
 *   * Pase Vitalicio: $4.99 USD Pago único de por vida
 *   * Micro-Ofrenda: $0.49 USD Donación de apadrinamiento litúrgico
 */

import { StorageService } from './storage-service.js';

export const PAYPAL_MERCHANT_ID = 'EQNTHLAVHUL52';

export const PLAY_STORE_SKUS = {
  ANNUAL_SUB: 'feuniversal_annual_sub',       // $2.99 USD/año (7 días prueba gratuita)
  LIFETIME_PASS: 'feuniversal_lifetime_pass', // $4.99 USD (Pago único de por vida)
  MICRO_OFFERING: 'feuniversal_micro_offering_49' // $0.49 USD (Consumible de apadrinamiento)
};

export class BillingService {
  static #isNative = false;
  static #productsCache = null;

  /**
   * Inicializa la pasarela de Google Play Billing si se ejecuta en entorno nativo
   */
  static async init() {
    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
      this.#isNative = true;
      try {
        if (window.Capacitor.Plugins && window.Capacitor.Plugins.InAppPurchasing) {
          await window.Capacitor.Plugins.InAppPurchasing.initialize();
        }
      } catch (e) {
        console.warn('[BillingService] Plugin nativo no disponible o en desarrollo:', e.message);
      }
    }
  }

  /**
   * Retorna si la app corre en entorno nativo con Google Play
   */
  static isNativePlatform() {
    return this.#isNative || (typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.());
  }

  /**
   * Obtiene la lista de productos y precios oficiales
   */
  static async getProducts() {
    if (this.#productsCache) return this.#productsCache;

    const catalog = [
      {
        id: PLAY_STORE_SKUS.ANNUAL_SUB,
        planType: 'annual',
        type: 'subs',
        priceUSD: '$2.99',
        priceDisplay: '$2.99 USD/año',
        trialPeriod: '7 días',
        monthlyEquivalent: '$0.25 al mes',
        title: 'Plan Anual Santuario PRO',
        desc: 'Acceso ilimitado a frecuencias de sonido, altar litúrgico, bóveda ilimitada y cero anuncios.'
      },
      {
        id: PLAY_STORE_SKUS.LIFETIME_PASS,
        planType: 'lifetime',
        type: 'inapp',
        priceUSD: '$4.99',
        priceDisplay: '$4.99 USD',
        trialPeriod: null,
        monthlyEquivalent: 'De por vida',
        title: 'Pase Vitalicio Fundador',
        desc: 'Un solo pago de por vida sin cargos recurrentes ni renovaciones.'
      },
      {
        id: PLAY_STORE_SKUS.MICRO_OFFERING,
        planType: 'micro_offering',
        type: 'consumable',
        priceUSD: '$0.49',
        priceDisplay: '$0.49 USD',
        trialPeriod: null,
        title: 'Micro-Ofrenda Litúrgica',
        desc: 'Apadrinamiento voluntario de nuevas traducciones de lenguas ancestrales.'
      }
    ];

    this.#productsCache = catalog;
    return catalog;
  }

  /**
   * Lanza la pasarela de PayPal para pagos en la Web
   */
  static launchPayPalPurchase(planKey) {
    if (typeof window === 'undefined') return { success: false };

    const currentUrl = window.location.href.split('?')[0].split('#')[0];
    const returnUrl = `${currentUrl}?billing=paypal_success&plan=${planKey}`;
    const cancelUrl = `${currentUrl}?billing=paypal_cancel`;
    const offeringReturnUrl = `${currentUrl}?billing=paypal_offering_success`;

    let params;

    if (planKey === 'annual') {
      // Cálculo de días restantes de prueba gratuita (Mínimo 1 día de gracia)
      const trialDays = Math.max(1, StorageService.getTrialDaysRemaining() || 7);

      params = new URLSearchParams({
        cmd: '_xclick-subscriptions',
        business: PAYPAL_MERCHANT_ID,
        item_name: 'FeUniversal Santuario PRO - Plan Anual (7 Dias Gratis)',
        item_number: PLAY_STORE_SKUS.ANNUAL_SUB,
        no_shipping: '1',
        no_note: '1',
        currency_code: 'USD',
        a1: '0',
        p1: trialDays.toString(),
        t1: 'D',
        a3: '2.99',
        p3: '1',
        t3: 'Y',
        src: '1',
        sra: '1',
        return: returnUrl,
        cancel_return: cancelUrl
      });
    } else if (planKey === 'lifetime') {
      params = new URLSearchParams({
        cmd: '_xclick',
        business: PAYPAL_MERCHANT_ID,
        item_name: 'FeUniversal - Pase Vitalicio Fundador (Acceso de por Vida)',
        item_number: PLAY_STORE_SKUS.LIFETIME_PASS,
        amount: '4.99',
        currency_code: 'USD',
        no_shipping: '1',
        no_note: '1',
        return: returnUrl,
        cancel_return: cancelUrl
      });
    } else if (planKey === 'micro_offering') {
      params = new URLSearchParams({
        cmd: '_xclick',
        business: PAYPAL_MERCHANT_ID,
        item_name: 'FeUniversal - Micro-Ofrenda Liturgica ($0.49 USD)',
        item_number: PLAY_STORE_SKUS.MICRO_OFFERING,
        amount: '0.49',
        currency_code: 'USD',
        no_shipping: '1',
        no_note: '1',
        return: offeringReturnUrl,
        cancel_return: cancelUrl
      });
    } else {
      return { success: false, message: 'Plan no reconocido' };
    }

    const checkoutUrl = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    return {
      success: true,
      method: 'paypal_web',
      checkoutUrl
    };
  }

  /**
   * Ejecuta la compra de un plan o producto (Google Play en Android o PayPal en Web)
   */
  static async purchaseProduct(planKey) {
    const sku = planKey === 'lifetime'
      ? PLAY_STORE_SKUS.LIFETIME_PASS
      : (planKey === 'micro_offering' ? PLAY_STORE_SKUS.MICRO_OFFERING : PLAY_STORE_SKUS.ANNUAL_SUB);

    // 1. Entorno Nativo Android (Google Play Billing)
    if (this.#isNative && window.Capacitor?.Plugins?.InAppPurchasing) {
      try {
        const result = await window.Capacitor.Plugins.InAppPurchasing.purchase({ productId: sku });
        if (result && result.success) {
          if (sku !== PLAY_STORE_SKUS.MICRO_OFFERING) {
            StorageService.activateSubscription(planKey);
          }
          return { success: true, isNative: true, sku, message: 'Compra completada exitosamente vía Google Play.' };
        }
      } catch (err) {
        console.error('[BillingService] Error en Google Play Billing:', err);
        return { success: false, isNative: true, error: err.message };
      }
    }

    // 2. Entorno Web / PC / iOS Web (Pasarela Segura PayPal)
    return this.launchPayPalPurchase(planKey);
  }

  /**
   * Restaura compras previas activas del usuario en Google Play o comprueba estado local
   */
  static async restorePurchases() {
    if (this.#isNative && window.Capacitor?.Plugins?.InAppPurchasing) {
      try {
        const activeSubs = await window.Capacitor.Plugins.InAppPurchasing.getPurchases();
        if (activeSubs && activeSubs.length > 0) {
          const hasLifetime = activeSubs.some(p => p.productId === PLAY_STORE_SKUS.LIFETIME_PASS);
          const hasAnnual = activeSubs.some(p => p.productId === PLAY_STORE_SKUS.ANNUAL_SUB);
          if (hasLifetime) {
            StorageService.activateSubscription('lifetime');
            return { restored: true, plan: 'lifetime' };
          } else if (hasAnnual) {
            StorageService.activateSubscription('annual');
            return { restored: true, plan: 'annual' };
          }
        }
        return { restored: false, message: 'No se encontraron compras previas en tu cuenta de Google Play.' };
      } catch (err) {
        console.warn('[BillingService] Error al restaurar compras nativas:', err);
      }
    }

    // Comprobación de estado local
    const currentSub = StorageService.getSubscription();
    if (currentSub && currentSub.isPremium) {
      return { restored: true, plan: currentSub.planType || 'annual' };
    }
    return { restored: false, message: 'No hay compras previas activas.' };
  }
}

// Inicialización asíncrona no bloqueante
BillingService.init().catch(() => {});
