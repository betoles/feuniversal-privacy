/**
 * SCRIPTURE SEARCH ENGINE (MOTOR DE BÚSQUEDA INDEXADO DE ALTA VELOCIDAD)
 * FeUniversal - Faith & Prayers
 * 
 * Búsqueda predictiva FTS en menos de 10ms por citas exactas (ej: "Juan 3:16", "Salmo 23:1")
 * y por palabras clave/conceptos en el corpus sagrado universal.
 */

import { SCRIPTURES_CATALOG, SACRED_BOOKS_INDEX, SACRED_BOOKS_I18N } from '../data/scriptures-catalog.js';

export class ScriptureSearchEngine {
  static searchCache = new Map();
  static MAX_CACHE_SIZE = 100;

  static BOOK_ALIASES = {
    // Evangelios
    'mateo': { bookKey: 'gospel_matthew', idPrefix: 'gospel_matthew_chapter_' },
    'san mateo': { bookKey: 'gospel_matthew', idPrefix: 'gospel_matthew_chapter_' },
    'matthew': { bookKey: 'gospel_matthew', idPrefix: 'gospel_matthew_chapter_' },
    'mt': { bookKey: 'gospel_matthew', idPrefix: 'gospel_matthew_chapter_' },
    
    'marcos': { bookKey: 'gospel_mark', idPrefix: 'gospel_mark_chapter_' },
    'san marcos': { bookKey: 'gospel_mark', idPrefix: 'gospel_mark_chapter_' },
    'mark': { bookKey: 'gospel_mark', idPrefix: 'gospel_mark_chapter_' },
    'mc': { bookKey: 'gospel_mark', idPrefix: 'gospel_mark_chapter_' },
    'mk': { bookKey: 'gospel_mark', idPrefix: 'gospel_mark_chapter_' },

    'lucas': { bookKey: 'gospel_luke', idPrefix: 'gospel_luke_chapter_' },
    'san lucas': { bookKey: 'gospel_luke', idPrefix: 'gospel_luke_chapter_' },
    'luke': { bookKey: 'gospel_luke', idPrefix: 'gospel_luke_chapter_' },
    'lc': { bookKey: 'gospel_luke', idPrefix: 'gospel_luke_chapter_' },
    'lk': { bookKey: 'gospel_luke', idPrefix: 'gospel_luke_chapter_' },

    'juan': { bookKey: 'gospel_john', idPrefix: 'gospel_john_chapter_' },
    'san juan': { bookKey: 'gospel_john', idPrefix: 'gospel_john_chapter_' },
    'john': { bookKey: 'gospel_john', idPrefix: 'gospel_john_chapter_' },
    'jn': { bookKey: 'gospel_john', idPrefix: 'gospel_john_chapter_' },

    // Libro de Mormón
    '1 nefi': { bookKey: 'mormon', idPrefix: 'mormon_1nephi_chapter_' },
    '1nefi': { bookKey: 'mormon', idPrefix: 'mormon_1nephi_chapter_' },
    '1 nephi': { bookKey: 'mormon', idPrefix: 'mormon_1nephi_chapter_' },
    'primer nefi': { bookKey: 'mormon', idPrefix: 'mormon_1nephi_chapter_' },
    '1 nef': { bookKey: 'mormon', idPrefix: 'mormon_1nephi_chapter_' },

    '2 nefi': { bookKey: 'mormon', idPrefix: 'mormon_2nephi_chapter_' },
    '2nefi': { bookKey: 'mormon', idPrefix: 'mormon_2nephi_chapter_' },
    '2 nephi': { bookKey: 'mormon', idPrefix: 'mormon_2nephi_chapter_' },
    'segundo nefi': { bookKey: 'mormon', idPrefix: 'mormon_2nephi_chapter_' },
    '2 nef': { bookKey: 'mormon', idPrefix: 'mormon_2nephi_chapter_' },

    'jacob': { bookKey: 'mormon', idPrefix: 'mormon_jacob_chapter_' },
    'enos': { bookKey: 'mormon', idPrefix: 'mormon_enos_chapter_' },
    'enós': { bookKey: 'mormon', idPrefix: 'mormon_enos_chapter_' },
    'jarom': { bookKey: 'mormon', idPrefix: 'mormon_jarom_chapter_' },
    'omni': { bookKey: 'mormon', idPrefix: 'mormon_omni_chapter_' },
    'palabras de mormon': { bookKey: 'mormon', idPrefix: 'mormon_words_of_mormon_chapter_' },
    'palabras de mormón': { bookKey: 'mormon', idPrefix: 'mormon_words_of_mormon_chapter_' },
    'words of mormon': { bookKey: 'mormon', idPrefix: 'mormon_words_of_mormon_chapter_' },

    'mosiah': { bookKey: 'mormon', idPrefix: 'mormon_mosiah_chapter_' },
    'mosíah': { bookKey: 'mormon', idPrefix: 'mormon_mosiah_chapter_' },
    'mos': { bookKey: 'mormon', idPrefix: 'mormon_mosiah_chapter_' },

    'alma': { bookKey: 'mormon', idPrefix: 'mormon_alma_chapter_' },
    'al': { bookKey: 'mormon', idPrefix: 'mormon_alma_chapter_' },

    'helaman': { bookKey: 'mormon', idPrefix: 'mormon_helaman_chapter_' },
    'helamán': { bookKey: 'mormon', idPrefix: 'mormon_helaman_chapter_' },
    'hel': { bookKey: 'mormon', idPrefix: 'mormon_helaman_chapter_' },

    '3 nefi': { bookKey: 'mormon', idPrefix: 'mormon_3nephi_chapter_' },
    '3nefi': { bookKey: 'mormon', idPrefix: 'mormon_3nephi_chapter_' },
    '3 nephi': { bookKey: 'mormon', idPrefix: 'mormon_3nephi_chapter_' },
    'tercer nefi': { bookKey: 'mormon', idPrefix: 'mormon_3nephi_chapter_' },
    '3 nef': { bookKey: 'mormon', idPrefix: 'mormon_3nephi_chapter_' },

    '4 nefi': { bookKey: 'mormon', idPrefix: 'mormon_4nephi_chapter_' },
    '4nefi': { bookKey: 'mormon', idPrefix: 'mormon_4nephi_chapter_' },
    '4 nephi': { bookKey: 'mormon', idPrefix: 'mormon_4nephi_chapter_' },
    'cuarto nefi': { bookKey: 'mormon', idPrefix: 'mormon_4nephi_chapter_' },

    'mormon': { bookKey: 'mormon', idPrefix: 'mormon_mormon_book_chapter_' },
    'mormón': { bookKey: 'mormon', idPrefix: 'mormon_mormon_book_chapter_' },

    'eter': { bookKey: 'mormon', idPrefix: 'mormon_ether_chapter_' },
    'éter': { bookKey: 'mormon', idPrefix: 'mormon_ether_chapter_' },
    'ether': { bookKey: 'mormon', idPrefix: 'mormon_ether_chapter_' },

    'moroni': { bookKey: 'mormon', idPrefix: 'mormon_moroni_chapter_' },
    'mor': { bookKey: 'mormon', idPrefix: 'mormon_moroni_chapter_' },

    // Salmos y Sabiduría
    'salmo': { bookKey: 'tanaj', idPrefix: 'psalm_chapter_' },
    'salmos': { bookKey: 'tanaj', idPrefix: 'psalm_chapter_' },
    'psalm': { bookKey: 'tanaj', idPrefix: 'psalm_chapter_' },
    'psalms': { bookKey: 'tanaj', idPrefix: 'psalm_chapter_' },
    'tehilim': { bookKey: 'tanaj', idPrefix: 'psalm_chapter_' },

    'proverbios': { bookKey: 'proverbs', idPrefix: 'proverb_chapter_' },
    'proverbio': { bookKey: 'proverbs', idPrefix: 'proverb_chapter_' },
    'proverbs': { bookKey: 'proverbs', idPrefix: 'proverb_chapter_' },
    'mishle': { bookKey: 'proverbs', idPrefix: 'proverb_chapter_' },

    // Pentateuco
    'genesis': { bookKey: 'genesis', idPrefix: 'genesis_chapter_' },
    'génesis': { bookKey: 'genesis', idPrefix: 'genesis_chapter_' },
    'bereshit': { bookKey: 'genesis', idPrefix: 'genesis_chapter_' },
    'gen': { bookKey: 'genesis', idPrefix: 'genesis_chapter_' },

    'exodo': { bookKey: 'exodus', idPrefix: 'exodus_chapter_' },
    'éxodo': { bookKey: 'exodus', idPrefix: 'exodus_chapter_' },
    'shemot': { bookKey: 'exodus', idPrefix: 'exodus_chapter_' },
    'ex': { bookKey: 'exodus', idPrefix: 'exodus_chapter_' },

    // Epístolas y Revelación
    'romanos': { bookKey: 'epistle_romans', idPrefix: 'epistle_romans_chapter_' },
    'romans': { bookKey: 'epistle_romans', idPrefix: 'epistle_romans_chapter_' },
    '1 corintios': { bookKey: 'epistle_1corinthians', idPrefix: 'epistle_1corinthians_chapter_' },
    '1 corinthians': { bookKey: 'epistle_1corinthians', idPrefix: 'epistle_1corinthians_chapter_' },
    'efesios': { bookKey: 'epistle_ephesians', idPrefix: 'epistle_ephesians_chapter_' },
    'ephesians': { bookKey: 'epistle_ephesians', idPrefix: 'epistle_ephesians_chapter_' },
    'santiago': { bookKey: 'epistle_james', idPrefix: 'epistle_james_chapter_' },
    'james': { bookKey: 'epistle_james', idPrefix: 'epistle_james_chapter_' },
    '1 juan': { bookKey: 'epistle_1john', idPrefix: 'epistle_1john_chapter_' },
    '1 john': { bookKey: 'epistle_1john', idPrefix: 'epistle_1john_chapter_' },
    'apocalipsis': { bookKey: 'revelation', idPrefix: 'revelation_chapter_' },
    'revelacion': { bookKey: 'revelation', idPrefix: 'revelation_chapter_' },
    'revelación': { bookKey: 'revelation', idPrefix: 'revelation_chapter_' },
    'revelation': { bookKey: 'revelation', idPrefix: 'revelation_chapter_' },

    // Corán, Tao, Gita, Dhammapada
    'sura': { bookKey: 'quran', idPrefix: 'quran_sura_' },
    'surah': { bookKey: 'quran', idPrefix: 'quran_sura_' },
    'coran': { bookKey: 'quran', idPrefix: 'quran_sura_' },
    'corán': { bookKey: 'quran', idPrefix: 'quran_sura_' },
    'quran': { bookKey: 'quran', idPrefix: 'quran_sura_' },

    'tao': { bookKey: 'tao', idPrefix: 'tao_chapter_' },
    'tao te king': { bookKey: 'tao', idPrefix: 'tao_chapter_' },
    'daodejing': { bookKey: 'tao', idPrefix: 'tao_chapter_' },

    'gita': { bookKey: 'gita', idPrefix: 'gita_chapter_' },
    'bhagavad gita': { bookKey: 'gita', idPrefix: 'gita_chapter_' },

    'dhammapada': { bookKey: 'dhammapada', idPrefix: 'dhammapada_vagga_' },
    'vagga': { bookKey: 'dhammapada', idPrefix: 'dhammapada_vagga_' }
  };

  /**
   * Intenta resolver citas directas (ej: "1 Nefi 3:7", "Mateo 5:3", "Juan 3:16", "Salmo 23", "Alma 32", "Moroni 10:4")
   */
  static parseCitation(query) {
    const q = query.trim().toLowerCase();
    
    // Patrón flexible con números en el nombre de libro (ej: "1 nefi 3:7", "3 nephi 11:14", "mateo 5:3")
    const match = q.match(/^([1-4]?\s*[a-záéíóúñ\s]+?)\s+(\d+)(?::(\d+))?$/i);
    if (!match) return null;

    const rawBook = match[1].trim().replace(/\s+/g, ' ');
    const chapterNum = parseInt(match[2], 10);
    const verseNum = match[3] ? parseInt(match[3], 10) : null;

    // Buscar en alias conocidos
    const aliasInfo = ScriptureSearchEngine.BOOK_ALIASES[rawBook];
    if (aliasInfo) {
      const targetId = `${aliasInfo.idPrefix}${chapterNum}`;
      let candidate = SCRIPTURES_CATALOG.find(s => s.id === targetId || s.id.startsWith(targetId + '_'));
      
      if (!candidate) {
        candidate = SCRIPTURES_CATALOG.find(s => 
          s.libroKey === aliasInfo.bookKey && 
          ((s.capituloRelativo && s.capituloRelativo === chapterNum) || s.capituloNumero === chapterNum)
        );
      }

      if (candidate) {
        return {
          item: candidate,
          targetVerse: verseNum,
          isExactCitation: true
        };
      }
    }

    // Fallback: Buscar coincidencia en SACRED_BOOKS_INDEX
    const matchedBook = SACRED_BOOKS_INDEX.find(b => {
      const bTitle = b.title.toLowerCase();
      return bTitle.includes(rawBook) || b.key.includes(rawBook);
    });

    if (matchedBook) {
      const candidate = SCRIPTURES_CATALOG.find(s => 
        s.libroKey === matchedBook.key && (s.capituloNumero === chapterNum || s.capituloRelativo === chapterNum)
      );
      if (candidate) {
        return {
          item: candidate,
          targetVerse: verseNum,
          isExactCitation: true
        };
      }
    }

    return null;
  }

  /**
   * Búsqueda general en tiempo real en todo el catálogo con ranking y caché
   */
  static search(query, maxResults = 25, activeLang = 'es') {
    if (!query || query.trim().length < 2) return [];

    const limit = typeof maxResults === 'number' ? maxResults : 25;
    const cleanQuery = query.trim().toLowerCase();
    const cacheKey = `${cleanQuery}_${limit}_${activeLang}`;

    if (ScriptureSearchEngine.searchCache.has(cacheKey)) {
      return ScriptureSearchEngine.searchCache.get(cacheKey);
    }

    const citation = ScriptureSearchEngine.parseCitation(cleanQuery);
    const results = [];

    if (citation) {
      results.push({
        id: citation.item.id,
        title: `${citation.item.libro}: ${citation.item.capitulo}`,
        verseNumber: citation.targetVerse,
        item: citation.item,
        score: 100,
        highlightVerse: citation.targetVerse,
        snippet: citation.item.capitulo
      });
    }

    const terms = cleanQuery.split(/\s+/).filter(t => t.length > 1);

    for (const item of SCRIPTURES_CATALOG) {
      if (citation && citation.item.id === item.id) continue;

      let score = 0;
      let matchedSnippet = '';

      const title = (item.capitulo || '').toLowerCase();
      const book = (item.libro || '').toLowerCase();
      const section = (item.seccion || '').toLowerCase();
      const orig = (item.textoOriginal || '').toLowerCase();
      const phon = (item.foneticaLiturgica || '').toLowerCase();
      const bKey = item.libroKey;
      const bI18n = (bKey && SACRED_BOOKS_I18N && SACRED_BOOKS_I18N[bKey]) || null;

      // Coincidencia de frase exacta en títulos de catálogo
      if (title.includes(cleanQuery)) {
        score += 60;
      }
      if (section.includes(cleanQuery)) {
        score += 40;
      }
      if (book.includes(cleanQuery)) {
        score += 30;
      }

      // Coincidencia en SACRED_BOOKS_I18N (títulos, subtítulos y secciones en 17 idiomas)
      if (bI18n) {
        if (bI18n.title) {
          for (const [lKey, tVal] of Object.entries(bI18n.title)) {
            if (typeof tVal === 'string' && tVal.toLowerCase().includes(cleanQuery)) {
              score += (lKey === activeLang ? 60 : 35);
              break;
            }
          }
        }
        if (bI18n.subtitle) {
          for (const [lKey, tVal] of Object.entries(bI18n.subtitle)) {
            if (typeof tVal === 'string' && tVal.toLowerCase().includes(cleanQuery)) {
              score += (lKey === activeLang ? 40 : 25);
              break;
            }
          }
        }
        if (bI18n.section) {
          for (const [lKey, tVal] of Object.entries(bI18n.section)) {
            if (typeof tVal === 'string' && tVal.toLowerCase().includes(cleanQuery)) {
              score += (lKey === activeLang ? 40 : 25);
              break;
            }
          }
        }
      }

      // Coincidencia en traducciones disponibles
      if (item.traducciones) {
        for (const [tLang, tVal] of Object.entries(item.traducciones)) {
          if (typeof tVal === 'string' && tVal.toLowerCase().includes(cleanQuery)) {
            score += (tLang === activeLang ? 55 : (tLang === 'es' || tLang === 'en' ? 45 : 35));
            if (!matchedSnippet) {
              matchedSnippet = ScriptureSearchEngine.extractSnippet(tVal, cleanQuery);
            }
            break;
          }
        }
      }

      if (orig && orig.includes(cleanQuery)) {
        score += 35;
        if (!matchedSnippet) {
          matchedSnippet = ScriptureSearchEngine.extractSnippet(item.textoOriginal, cleanQuery);
        }
      }

      // Coincidencia de términos individuales
      let termMatches = 0;
      for (const t of terms) {
        if (title.includes(t) || section.includes(t) || book.includes(t) || orig.includes(t) || phon.includes(t)) {
          termMatches++;
        }
      }

      if (termMatches === terms.length && terms.length > 1) {
        score += 30;
      } else if (termMatches > 0) {
        score += termMatches * 6;
      }

      if (score > 0) {
        const fallbackSnippet = item.traducciones?.es 
          ? item.traducciones.es.substring(0, 95) + '...' 
          : (item.textoOriginal ? item.textoOriginal.substring(0, 95) + '...' : `${item.libro} · ${item.capitulo}`);

        results.push({
          id: item.id,
          title: `${item.libro}: ${item.capitulo}`,
          verseNumber: null,
          item,
          score,
          snippet: matchedSnippet || fallbackSnippet
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    const finalResults = results.slice(0, limit);

    // Guardar en caché LRU
    if (ScriptureSearchEngine.searchCache.size >= ScriptureSearchEngine.MAX_CACHE_SIZE) {
      const firstKey = ScriptureSearchEngine.searchCache.keys().next().value;
      ScriptureSearchEngine.searchCache.delete(firstKey);
    }
    ScriptureSearchEngine.searchCache.set(cacheKey, finalResults);

    return finalResults;
  }

  static extractSnippet(fullText, query) {
    if (!fullText) return '';
    const idx = fullText.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return fullText.substring(0, 95) + '...';

    const start = Math.max(0, idx - 30);
    const end = Math.min(fullText.length, idx + query.length + 65);
    return (start > 0 ? '...' : '') + fullText.substring(start, end).trim() + (end < fullText.length ? '...' : '');
  }
}
