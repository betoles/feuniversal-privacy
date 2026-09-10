/**
 * GLOBAL ERROR HANDLER & RESILIENCE SERVICE
 * FeUniversal - Faith & Prayers
 * 
 * Requisito estricto de Google Play (Android Vitals - Crash Rate < 1.09%).
 * Captura excepciones globales no controladas y promesas rechazadas de forma silenciosa
 * para evitar cierres inesperados (crashes) o bloqueos de renderizado en dispositivos Android/iOS.
 */

export class ErrorHandler {
  static #initialized = false;
  static #errorBuffer = [];
  static #maxBufferSize = 30;

  /**
   * Inicializa los interceptores globales de la ventana
   */
  static init() {
    if (this.#initialized) return;
    this.#initialized = true;

    if (typeof window !== 'undefined') {
      // 1. Interceptor de errores sincrónicos no controlados
      window.onerror = (message, source, lineno, colno, error) => {
        this.logError({
          type: 'UNHANDLED_ERROR',
          message: String(message || 'Unknown error'),
          source: String(source || 'anonymous'),
          lineno,
          colno,
          stack: error ? error.stack : null,
          timestamp: new Date().toISOString()
        });
        // Prevenir que el error rompa el hilo global
        return true;
      };

      // 2. Interceptor de promesas asíncronas rechazadas no capturadas
      window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        this.logError({
          type: 'UNHANDLED_PROMISE_REJECTION',
          message: reason instanceof Error ? reason.message : String(reason || 'Unhandled Promise Rejection'),
          stack: reason instanceof Error ? reason.stack : null,
          timestamp: new Date().toISOString()
        });
        if (event.preventDefault) {
          event.preventDefault();
        }
      });
    }
  }

  /**
   * Registra un error en el buffer circular seguro en memoria
   */
  static logError(errObj) {
    try {
      this.#errorBuffer.push(errObj);
      if (this.#errorBuffer.length > this.#maxBufferSize) {
        this.#errorBuffer.shift();
      }
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(`[FeUniversal ErrorHandler Guard] ${errObj.type}:`, errObj.message);
      }
    } catch (e) {
      // Failsafe absoluto
    }
  }

  /**
   * Ejecuta una función síncrona dentro de un límite de seguridad
   */
  static safeRun(fn, fallback = null, contextLabel = 'anonymous') {
    try {
      return fn();
    } catch (err) {
      this.logError({
        type: 'CAUGHT_IN_SAFE_RUN',
        context: contextLabel,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : null,
        timestamp: new Date().toISOString()
      });
      return fallback;
    }
  }

  /**
   * Ejecuta una función asíncrona dentro de un límite de seguridad
   */
  static async safeAsync(asyncFn, fallback = null, contextLabel = 'anonymous') {
    try {
      return await asyncFn();
    } catch (err) {
      this.logError({
        type: 'CAUGHT_IN_SAFE_ASYNC',
        context: contextLabel,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : null,
        timestamp: new Date().toISOString()
      });
      return fallback;
    }
  }

  /**
   * Retorna el historial diagnóstico local para soporte
   */
  static getDiagnostics() {
    return [...this.#errorBuffer];
  }

  /**
   * Limpia el buffer de diagnósticos
   */
  static clearDiagnostics() {
    this.#errorBuffer = [];
  }
}

// Auto-inicializar de inmediato al importar
ErrorHandler.init();
