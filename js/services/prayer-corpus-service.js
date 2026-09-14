/**
 * PRAYER CORPUS SERVICE (MOTOR DE CARGA ASÍNCRONA & CACHÉ OFFLINE)
 * FeUniversal - Faith & Prayers
 * 
 * Gestiona el compendio canónico de 4,245 oraciones por idioma (15 idiomas certificados)
 * con carga perezosa (Lazy Loading), indexación en memoria y persistencia en IndexedDB.
 */

import { PRAYERS_DB as FALLBACK_PRAYERS } from '../data/prayers-db.js';
import { fetchAndDecompressJson } from '../utils/stream-decompressor.js';
import { getCanonicalIntention } from '../data/intentions.js';

export class PrayerCorpusService {
  static memoryCache = new Map();
  static searchIndex = new Map();
  static dbPromise = null;
  static activeLanguage = 'es';
  static MAX_RAM_LANGUAGES = 2;
  static lruOrder = [];

  /**
   * Registra un dataset en caché aplicando política de desalojo LRU
   */
  static _setInCache(lang, oraciones) {
    // Si ya existe, eliminar de la lista LRU para reinsertar al final (más reciente)
    const idx = PrayerCorpusService.lruOrder.indexOf(lang);
    if (idx !== -1) {
      PrayerCorpusService.lruOrder.splice(idx, 1);
    }

    // Si alcanzamos el límite de RAM, desalojar el idioma menos recientemente usado
    while (PrayerCorpusService.lruOrder.length >= PrayerCorpusService.MAX_RAM_LANGUAGES) {
      const oldestLang = PrayerCorpusService.lruOrder.shift();
      if (oldestLang && oldestLang !== lang) {
        PrayerCorpusService.memoryCache.delete(oldestLang);
        PrayerCorpusService.searchIndex.delete(oldestLang);
      }
    }

    PrayerCorpusService.memoryCache.set(lang, oraciones);
    PrayerCorpusService.lruOrder.push(lang);
    PrayerCorpusService._buildIndex(lang, oraciones);
  }

  /**
   * Marca un idioma como recientemente usado
   */
  static _touchLRU(lang) {
    const idx = PrayerCorpusService.lruOrder.indexOf(lang);
    if (idx !== -1) {
      PrayerCorpusService.lruOrder.splice(idx, 1);
      PrayerCorpusService.lruOrder.push(lang);
    }
  }

  /**
   * Inicializa la conexión con IndexedDB para almacenamiento local persistente
   */
  static getDB() {
    if (!PrayerCorpusService.dbPromise) {
      PrayerCorpusService.dbPromise = new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
          resolve(null);
          return;
        }
        const req = window.indexedDB.open('feuniversal_prayers_corpus_db_v2', 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('language_corpuses')) {
            db.createObjectStore('language_corpuses', { keyPath: 'idioma' });
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => resolve(null);
      });
    }
    return PrayerCorpusService.dbPromise;
  }

  /**
   * Carga el compendio de oraciones para el idioma especificado (o el activo)
   * @param {string} lang Código de idioma (es, en, fr, pt, it, de, ru, ar, he, hi, zh, la, ja, bn, id, ur, sw)
   * @returns {Promise<Array>} Lista de 4,252 oraciones
   */
  static async loadCorpus(lang = 'es') {
    const targetLang = (lang || 'es').toLowerCase();
    PrayerCorpusService.activeLanguage = targetLang;

    // 1. Verificar caché en memoria RAM
    if (PrayerCorpusService.memoryCache.has(targetLang)) {
      const memCorpus = PrayerCorpusService.memoryCache.get(targetLang);
      if (Array.isArray(memCorpus) && memCorpus.length >= 4252) {
        PrayerCorpusService._touchLRU(targetLang);
        return memCorpus;
      }
    }

    // 2. Intentar cargar desde IndexedDB (Ultra-rápido offline con validación de versión)
    try {
      const db = await PrayerCorpusService.getDB();
      if (db) {
        const tx = db.transaction('language_corpuses', 'readonly');
        const store = tx.objectStore('language_corpuses');
        const req = store.get(targetLang);
        const cached = await new Promise((resolve) => {
          req.onsuccess = () => resolve(req.result ? req.result.oraciones : null);
          req.onerror = () => resolve(null);
        });

        if (cached && Array.isArray(cached) && cached.length >= 4252) {
          PrayerCorpusService._setInCache(targetLang, cached);
          return cached;
        }
      }
    } catch (err) {
      console.warn('[CorpusService] IndexedDB no disponible para lectura:', err);
    }

    // 3. Cargar archivo JSON/GZ vía Fetch con descompresión transparente
    const jsonPath = `./json_idiomas/oraciones_maestro_${targetLang}.json?v=10.4.0`;
    try {
      const data = await fetchAndDecompressJson(jsonPath);
      const oraciones = data.oraciones || [];

      if (oraciones.length > 0) {
        PrayerCorpusService._setInCache(targetLang, oraciones);

        // Guardar en IndexedDB en segundo plano para próximos arranques instantáneos
        PrayerCorpusService._saveToIndexedDB(targetLang, oraciones);
        return oraciones;
      }
    } catch (fetchErr) {
      console.warn(`[CorpusService] Error cargando ${jsonPath}, usando fallback:`, fetchErr);
    }

    // 4. Fallback de emergencia a Español o datos base
    if (targetLang !== 'es') {
      try {
        return await PrayerCorpusService.loadCorpus('es');
      } catch (_) {}
    }

    // Fallback estático canónico
    return FALLBACK_PRAYERS;
  }

  /**
   * Guarda el dataset en IndexedDB de forma no bloqueante
   */
  static async _saveToIndexedDB(lang, oraciones) {
    try {
      const db = await PrayerCorpusService.getDB();
      if (!db) return;
      const tx = db.transaction('language_corpuses', 'readwrite');
      const store = tx.objectStore('language_corpuses');
      store.put({ idioma: lang, oraciones: oraciones, timestamp: Date.now() });
    } catch (err) {
      console.warn('[CorpusService] Error guardando en IndexedDB:', err);
    }
  }

  /**
   * Construye índices en memoria para acelerar búsquedas
   */
  static _buildIndex(lang, oraciones) {
    const idMap = new Map();
    oraciones.forEach(p => {
      if (p.id) {
        idMap.set(p.id, p);
        idMap.set(String(p.id).toLowerCase(), p);
        idMap.set(String(p.id).toUpperCase(), p);
      }
      if (p.numero) idMap.set(String(p.numero), p);
    });
    PrayerCorpusService.searchIndex.set(lang, idMap);
  }

  /**
   * Obtiene una oración por su ID o número en el idioma solicitado
   */
  static async getPrayerById(id, lang = 'es') {
    if (!id) return null;
    const prayers = await PrayerCorpusService.loadCorpus(lang);
    const index = PrayerCorpusService.searchIndex.get(lang);
    if (index) {
      if (index.has(id)) return index.get(id);
      if (index.has(String(id).toLowerCase())) return index.get(String(id).toLowerCase());
      if (index.has(String(id).toUpperCase())) return index.get(String(id).toUpperCase());
    }

    const stripped = String(id).replace(/_(es|en|pt|fr|it|de|ru|ar|he|hi|zh|la|ja|bn|id|ur|sw)$/i, '');
    if (index) {
      if (index.has(stripped)) return index.get(stripped);
      if (index.has(stripped.toLowerCase())) return index.get(stripped.toLowerCase());
      if (index.has(stripped.toUpperCase())) return index.get(stripped.toUpperCase());
    }

    const cleanId = stripped.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = prayers.find(p => {
      if (!p) return false;
      if (p.id === id || String(p.numero) === String(id) || p.id === stripped) return true;
      const pClean = String(p.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return pClean === cleanId || (cleanId.length >= 5 && (pClean.includes(cleanId) || cleanId.includes(pClean)));
    });

    if (found) return found;

    // Fallback con FALLBACK_PRAYERS si no se encontró en el corpus dinámico
    return FALLBACK_PRAYERS.find(p => p.id === id || String(p.id).toLowerCase() === String(id).toLowerCase() || p.id === stripped) || null;
  }

  /**
   * Obtiene todas las oraciones filtradas por tradiciones activas
   */
  static async getAvailablePrayers(lang = 'es', activeTraditions = []) {
    const prayers = await PrayerCorpusService.loadCorpus(lang);
    if (!activeTraditions || activeTraditions.length === 0) {
      return prayers;
    }
    return prayers.filter(p => activeTraditions.includes(p.tradicion));
  }

  /**
   * Búsqueda inteligente por texto libre en el catálogo del idioma activo
   */
  static async searchPrayers(query, lang = 'es', activeTraditions = []) {
    const prayers = await PrayerCorpusService.loadCorpus(lang);
    if (!query || !query.trim()) {
      return (!activeTraditions || activeTraditions.length === 0)
        ? prayers
        : prayers.filter(p => activeTraditions.includes(p.tradicion));
    }

    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(t => t.length > 0);

    const matches = (p) => {
      const t = (typeof p.titulo === 'string' ? p.titulo : (p.titulo?.[lang] || p.titulo?.es || '')).toLowerCase();
      const txt = (p.textoTraducido || (p.traducciones && (p.traducciones[lang] || p.traducciones.es)) || p.textoEspanol || '').toLowerCase();
      const orig = (p.textoOriginal || '').toLowerCase();
      const cat = (p.categoriaIntencion || '').toLowerCase();
      const trad = (p.tradicion || '').toLowerCase();
      const pId = (p.id || '').toLowerCase();
      const composite = `${t} ${txt} ${orig} ${cat} ${trad} ${pId}`;

      return tokens.every(tok => composite.includes(tok));
    };

    let results = prayers.filter(matches);
    if (activeTraditions && activeTraditions.length > 0) {
      const traditionFiltered = results.filter(p => activeTraditions.includes(p.tradicion));
      if (traditionFiltered.length > 0) {
        return traditionFiltered;
      }
    }
    return results;
  }

  /**
   * Filtra oraciones por estado emocional (¿Cómo te sientes hoy?)
   */
  static async getPrayersByEmotion(emotionKey, lang = 'es', activeTraditions = []) {
    const prayers = await PrayerCorpusService.getAvailablePrayers(lang, activeTraditions);
    if (!emotionKey) return prayers;

    return prayers.filter(p => {
      const emos = p.estadosEmocionales || [];
      return emos.includes(emotionKey);
    });
  }

  /**
   * Filtra oraciones por categoría de intención universal
   */
  static async getPrayersByIntention(categoryKey, lang = 'es', activeTraditions = []) {
    const prayers = await PrayerCorpusService.getAvailablePrayers(lang, activeTraditions);
    if (!categoryKey) return prayers;

    return prayers.filter(p => getCanonicalIntention(p.categoriaIntencion, p.id) === categoryKey);
  }

  /**
   * Precarga en segundo plano el idioma indicado para respuesta instantánea
   */
  static preloadLanguage(lang) {
    setTimeout(() => {
      PrayerCorpusService.loadCorpus(lang).catch(() => {});
    }, 100);
  }
}
