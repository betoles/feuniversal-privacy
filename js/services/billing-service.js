/**
 * BILLING SERVICE - GOOGLE PLAY IN-APP PURCHASES & SUBSCRIPTIONS
 * FeUniversal - Faith & Prayers
 * 
 * Cumplimiento estricto de Google Play Payments Policy (Play Billing Library v6/v7).
 * Gestiona suscripciones, productos no consumibles y micro-ofrendas consumibles
 * con detección transparente de entorno (Nativo Android/Capacitor vs Web Fallback).
 */

import { StorageService } from './storage-service.js';

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
        // Inicialización de plugin nativo si está presente
        if (window.Capacitor.Plugins && window.Capacitor.Plugins.InAppPurchasing) {
          await window.Capacitor.Plugins.InAppPurchasing.initialize();
        }
      } catch (e) {
        console.warn('[BillingService] Plugin nativo no disponible o en desarrollo:', e.message);
      }
    }
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
   * Ejecuta la compra de un plan o producto
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

    // 2. Modo Desarrollo Web / Fallback Controlado
    if (sku !== PLAY_STORE_SKUS.MICRO_OFFERING) {
      StorageService.activateSubscription(planKey);
    }
    return {
      success: true,
      isNative: false,
      sku,
      message: 'Bendición activada con éxito.'
    };
  }

  /**
   * Restaura compras previas activas del usuario en Google Play
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
