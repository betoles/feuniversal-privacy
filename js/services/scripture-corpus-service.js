/**
 * SCRIPTURE CORPUS SERVICE (CARGA MODULAR POR DEMANDA Y CACHÉ OFFLINE v9.1.0)
 * FeUniversal - Faith & Prayers
 * 
 * Gestiona la carga asíncrona ultra-eficiente por demanda (Lazy Loading) de libros sagrados
 * en el idioma específico del usuario (~20 KB a 1.18 MB por libro en lugar de 20 MB).
 * Almacena en caché de memoria e IndexedDB para funcionamiento perpetuo 100% offline.
 */

import { fetchAndDecompressJson } from '../utils/stream-decompressor.js';

export class ScriptureCorpusService {
  static memoryCache = new Map();
  static dbPromise = null;

  static getDB() {
    if (!ScriptureCorpusService.dbPromise) {
      ScriptureCorpusService.dbPromise = new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
          resolve(null);
          return;
        }
        const req = window.indexedDB.open('feuniversal_scriptures_db', 2);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('books')) {
            db.createObjectStore('books', { keyPath: 'bookKey' });
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => resolve(null);
      });
    }
    return ScriptureCorpusService.dbPromise;
  }

  /**
   * Obtiene el idioma activo del usuario desde localStorage o por defecto 'es'
   */
  static getActiveLanguage(explicitLang = null) {
    if (explicitLang && typeof explicitLang === 'string') {
      return explicitLang;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem('feuniversal_user_prefs');
        if (raw) {
          const prefs = JSON.parse(raw);
          if (prefs && prefs.idioma) return prefs.idioma;
        }
      } catch (e) { /* ignore */ }
    }
    return 'es';
  }

  /**
   * Mapa canónico de libros y sus archivos correspondientes en json_escrituras/
   */
  static FILE_MAP = {
    'quran': 'quran.json',
    'tanaj': 'psalms.json',
    'psalms': 'psalms.json',
    'gospels': 'gospels.json',
    'gospel_matthew': 'gospels.json',
    'gospel_mark': 'gospels.json',
    'gospel_luke': 'gospels.json',
    'gospel_john': 'gospels.json',
    'genesis': 'pentateuch.json',
    'exodus': 'pentateuch.json',
    'pentateuch': 'pentateuch.json',
    'epistles': 'epistles.json',
    'epistle_romans': 'epistles.json',
    'epistle_1corinthians': 'epistles.json',
    'epistle_ephesians': 'epistles.json',
    'epistle_james': 'epistles.json',
    'epistle_1john': 'epistles.json',
    'revelation': 'revelation.json',
    'proverbs': 'wisdom.json',
    'wisdom': 'wisdom.json',
    'tao': 'tao-te-king.json',
    'tao_te_king': 'tao-te-king.json',
    'gita': 'gita.json',
    'dhammapada': 'dhammapada.json',
    'mormon': 'mormon.json',
    'song_of_songs': 'song_of_songs.json',
    'prophets': 'song_of_songs.json'
  };

  /**
   * Obtiene un libro completo con todos sus capítulos y versículos para el idioma activo
   * @param {string} bookKey - Clave canónica del libro (ej. 'quran', 'tanaj', 'gospels')
   * @param {string|null} lang - Código ISO de idioma opcional (ej. 'es', 'en', 'ar')
   */
  static async loadBook(bookKey, lang = null) {
    const activeLang = ScriptureCorpusService.getActiveLanguage(lang);
    const cacheKey = `${bookKey}_${activeLang}`;

    // 1. Memoria RAM (Hit ultra-rápido 0ms)
    if (ScriptureCorpusService.memoryCache.has(cacheKey)) {
      return ScriptureCorpusService.memoryCache.get(cacheKey);
    }
    if (ScriptureCorpusService.memoryCache.has(bookKey)) {
      return ScriptureCorpusService.memoryCache.get(bookKey);
    }

    // 2. Intentar leer de IndexedDB (Hit offline 0ms en navegadores)
    try {
      const db = await ScriptureCorpusService.getDB();
      if (db) {
        const tx = db.transaction('books', 'readonly');
        const store = tx.objectStore('books');
        
        let req = store.get(cacheKey);
        let cached = await new Promise((resolve) => {
          req.onsuccess = () => resolve(req.result ? req.result.data : null);
          req.onerror = () => resolve(null);
        });

        if (!cached) {
          req = store.get(bookKey);
          cached = await new Promise((resolve) => {
            req.onsuccess = () => resolve(req.result ? req.result.data : null);
            req.onerror = () => resolve(null);
          });
        }

        if (cached) {
          ScriptureCorpusService.memoryCache.set(cacheKey, cached);
          return cached;
        }
      }
    } catch (err) {
      /* IndexedDB no disponible o entorno de pruebas */
    }

    // 3. Cargar vía fetchAndDecompressJson (Soporte DecompressionStream .gz + fallback .json)
    try {
      const targetFile = ScriptureCorpusService.FILE_MAP[bookKey];
      let bookData = null;

      if (targetFile) {
        // Intentar idioma activo
        try {
          const jsonDoc = await fetchAndDecompressJson(`./json_escrituras/${activeLang}/${targetFile}`);
          if (jsonDoc) {
            const allCaps = jsonDoc.capitulos || jsonDoc;
            if (bookKey.startsWith('gospel_') || bookKey.startsWith('epistle_') || bookKey === 'genesis' || bookKey === 'exodus') {
              bookData = allCaps.filter(c => c.libroKey === bookKey);
            } else {
              bookData = allCaps;
            }
          }
        } catch (langErr) {
          /* Fallback a español si no se encuentra en el idioma activo */
          if (activeLang !== 'es') {
            try {
              const jsonDocFallback = await fetchAndDecompressJson(`./json_escrituras/es/${targetFile}`);
              if (jsonDocFallback) {
                const allCaps = jsonDocFallback.capitulos || jsonDocFallback;
                if (bookKey.startsWith('gospel_') || bookKey.startsWith('epistle_') || bookKey === 'genesis' || bookKey === 'exodus') {
                  bookData = allCaps.filter(c => c.libroKey === bookKey);
                } else {
                  bookData = allCaps;
                }
              }
            } catch (fallbackErr) {
              /* ignore */
            }
          }
        }
      }

      if (bookData) {
        ScriptureCorpusService.memoryCache.set(cacheKey, bookData);
        try {
          const db = await ScriptureCorpusService.getDB();
          if (db) {
            const tx = db.transaction('books', 'readwrite');
            const store = tx.objectStore('books');
            store.put({ bookKey: cacheKey, data: bookData });
          }
        } catch (e) { /* ignore cache write error */ }
        return bookData;
      }
    } catch (err) {
      console.error(`Error al cargar libro ${bookKey} (${activeLang}):`, err);
    }

    return null;
  }

  /**
   * Obtiene un capítulo individual por ID con su texto completo, fonética y traducción
   * @param {string} chapterId - ID único del capítulo (ej. 'bible_psalms_23', 'quran_sura_001')
   * @param {string|null} lang - Código de idioma opcional
   */
  static async getChapter(chapterId, lang = null) {
    if (!chapterId) return null;
    
    let bookKey = null;
    for (const [key, file] of Object.entries(ScriptureCorpusService.FILE_MAP)) {
      if (chapterId.includes(key)) {
        bookKey = key;
        break;
      }
    }
    if (!bookKey) {
      if (chapterId.startsWith('quran_')) bookKey = 'quran';
      else if (chapterId.startsWith('bible_psalms_')) bookKey = 'psalms';
      else if (chapterId.startsWith('bible_genesis_')) bookKey = 'genesis';
      else if (chapterId.startsWith('bible_exodus_')) bookKey = 'exodus';
      else if (chapterId.startsWith('gospel_')) bookKey = 'gospels';
      else if (chapterId.startsWith('epistle_')) bookKey = 'epistles';
      else if (chapterId.startsWith('bible_revelation_')) bookKey = 'revelation';
      else if (chapterId.startsWith('bible_proverbs_')) bookKey = 'proverbs';
      else if (chapterId.startsWith('gita_')) bookKey = 'gita';
      else if (chapterId.startsWith('dhammapada_')) bookKey = 'dhammapada';
      else if (chapterId.startsWith('tao_te_king_')) bookKey = 'tao';
      else if (chapterId.startsWith('mormon_')) bookKey = 'mormon';
      else if (chapterId.startsWith('bible_song_of_songs_')) bookKey = 'song_of_songs';
    }

    if (bookKey) {
      const bookChapters = await ScriptureCorpusService.loadBook(bookKey, lang);
      if (bookChapters && Array.isArray(bookChapters)) {
        return bookChapters.find(c => c.id === chapterId) || null;
      }
    }

    return null;
  }
}
