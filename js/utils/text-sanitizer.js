/**
 * TEXT SANITIZER & NLP SCRIPTURAL NORMALIZER
 * FeUniversal - Faith & Prayers
 * 
 * Limpia glosas editoriales arcaicas ({...: Heb. ...}, {...: or, ...}, {Gk. ...}),
 * normaliza llaves simples ({palabra} -> palabra), y purifica espacios y puntuación
 * para lecturas devocionales fluidas y tarjetas visuales impecables.
 */

/**
 * Limpia y normaliza textos sagrados y oraciones con técnicas de NLP ligero
 * @param {string} text Texto en bruto proveniente de bases canónicas
 * @returns {string} Texto purificado y legible
 */
export function cleanScriptureTextNLP(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // 1. Eliminar glosas editoriales complejas tipo {termino: Heb. glosa} o {termino: or, glosa} o {Gk. ...}
  cleaned = cleaned.replace(/\{[^{}]*(?:Heb\.|Greek\.|or,|Gk\.|i\.e\.|that is|meaning|see note)[^{}]*\}/gi, '');

  // 2. Eliminar referencias editoriales entre paréntesis alusivas a glosas hebreas/griegas
  cleaned = cleaned.replace(/\([^()]*:?\s*Heb\.[^()]*\)/gi, '');
  cleaned = cleaned.replace(/\([^()]*:?\s*Greek\.[^()]*\)/gi, '');

  // 3. Normalizar llaves simples: {palabra} -> palabra (conservar palabras suplementarias sin símbolos)
  cleaned = cleaned.replace(/\{([^{}]+)\}/g, '$1');

  // 4. Normalizar números de versículos al inicio de líneas en textos limpios
  const lines = cleaned.split('\n');
  const normalizedLines = lines.map(line => {
    let l = line.trim();
    // Limpiar espacios múltiples
    l = l.replace(/[ \t]+/g, ' ');
    // Limpiar espacios antes de signos ortográficos (ej. "luz , y" -> "luz, y")
    l = l.replace(/\s+([,.;:!?])/g, '$1');
    return l;
  });

  return normalizedLines.join('\n').trim();
}

/**
 * Extrae un pasaje de apertura significativo para tarjetas visuales de capítulos largos
 * @param {string} cleanText Texto previamente saneado
 * @param {number} maxChars Límite recomendado de caracteres para tarjetas HD (default: 650)
 * @returns {{ excerpt: string, isTruncated: boolean }}
 */
export function extractScriptureExcerpt(cleanText, maxChars = 650) {
  if (!cleanText) return { excerpt: '', isTruncated: false };

  const trimmed = cleanText.trim();
  if (trimmed.length <= maxChars) {
    return { excerpt: trimmed, isTruncated: false };
  }

  // Dividir por versículos o saltos de línea
  const lines = trimmed.split('\n').filter(Boolean);
  let accumulated = '';

  for (const line of lines) {
    const candidate = accumulated ? `${accumulated}\n${line}` : line;
    if (candidate.length > maxChars && accumulated.length > 200) {
      break;
    }
    accumulated = candidate;
    if (accumulated.length >= maxChars) break;
  }

  if (!accumulated) {
    const sub = trimmed.slice(0, maxChars);
    const lastSpace = sub.lastIndexOf(' ');
    accumulated = (lastSpace > 0 ? sub.slice(0, lastSpace) : sub).trim();
  }

  return {
    excerpt: accumulated.trim(),
    isTruncated: true
  };
}
