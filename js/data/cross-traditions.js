/**
 * CROSS-TRADITIONS & ECUMENICAL HERITAGE MATRIX
 * FeUniversal - Faith & Prayers
 * 
 * Vincula textos sagrados y plegarias universales con raíces compartidas
 * entre Catolicismo, Judaísmo, Cristianismo Evangélico/Pentecostal,
 * Ortodoxia, Islam, Budismo, Védica, Espiritismo y Universalismo.
 * Soporta los 17 idiomas oficiales al 100%:
 * es, en, pt, it, fr, de, la, ru, ar, he, hi, bn, zh, ja, id, ur, sw.
 */

import { getTradition } from './traditions.js';

export const CROSS_TRADITION_RULES = [
  // 1. Salmos de David / Tehilim / Psalms (150 Salmos)
  {
    matcher: (p) => {
      const id = String(p.id || '').toLowerCase();
      const tit = String(p.titulo?.es || p.titulo || '').toLowerCase();
      return id.startsWith('tanaj_psalm_') || id.startsWith('salmo_') || id.startsWith('psalm_') || tit.includes('salmo') || tit.includes('psalm') || tit.includes('tehilim');
    },
    rootTradition: 'hebreo_salmos',
    sharedWith: ['catolicismo', 'pentecostal', 'ortodoxia', 'adventista', 'mormonismo', 'universal']
  },

  // 2. Padre Nuestro y Bienaventuranzas (Enseñanzas de Jesús)
  {
    matcher: (p) => {
      const id = String(p.id || '').toLowerCase();
      const tit = String(p.titulo?.es || p.titulo || '').toLowerCase();
      return id.includes('padre_nuestro') || id.includes('pater_noster') || id.includes('lord_prayer') || tit.includes('padre nuestro') || tit.includes('lord\'s prayer') || tit.includes('bienaventuranzas') || tit.includes('beatitudes');
    },
    rootTradition: 'catolicismo',
    sharedWith: ['pentecostal', 'ortodoxia', 'adventista', 'mormonismo', 'espiritismo', 'universal']
  },

  // 3. Arcángeles Sagrados (San Miguel, San Rafael, San Gabriel, Uriel)
  {
    matcher: (p) => {
      const id = String(p.id || '').toLowerCase();
      const tit = String(p.titulo?.es || p.titulo || '').toLowerCase();
      return id.includes('arcangel') || id.includes('archangel') || tit.includes('arcángel') || tit.includes('archangel') || tit.includes('san miguel') || tit.includes('san rafael') || tit.includes('san gabriel');
    },
    rootTradition: 'catolicismo',
    sharedWith: ['ortodoxia', 'hebreo_salmos', 'islam', 'espiritismo', 'universal']
  },

  // 4. San Francisco de Asís (Oración por la Paz / Cántico de las Criaturas)
  {
    matcher: (p) => {
      const id = String(p.id || '').toLowerCase();
      const tit = String(p.titulo?.es || p.titulo || '').toLowerCase();
      return id.includes('san_francisco') || tit.includes('san francisco') || tit.includes('saint francis');
    },
    rootTradition: 'catolicismo',
    sharedWith: ['pentecostal', 'ortodoxia', 'espiritismo', 'universal']
  },

  // 5. Santos Populares y Causas Urgentes (San Expedito, San Benito, San Judas, San Cayetano)
  {
    matcher: (p) => {
      const id = String(p.id || '').toLowerCase();
      const tit = String(p.titulo?.es || p.titulo || '').toLowerCase();
      return id.includes('expedito') || id.includes('benito') || id.includes('judas_tadeo') || id.includes('cayetano') || tit.includes('expedito') || tit.includes('benito') || tit.includes('judas tadeo') || tit.includes('cayetano');
    },
    rootTradition: 'catolicismo',
    sharedWith: ['ortodoxia', 'espiritismo', 'universal']
  },

  // 6. Tradición Budista & Védica Compartida (Compasión Tara, Metta, Paz Universal)
  {
    matcher: (p) => {
      const id = String(p.id || '').toLowerCase();
      const trad = String(p.tradicion || '').toLowerCase();
      return trad === 'budismo' || trad === 'vedica' || id.includes('tara') || id.includes('metta') || id.includes('om_') || id.includes('dhammapada') || id.includes('gita');
    },
    rootTradition: (p) => p.tradicion || 'budismo',
    sharedWith: ['budismo', 'vedica', 'universal']
  },

  // 7. Don Juan del Volteo / Plegarias de Volteo y Reversión Espiritual
  {
    matcher: (p) => {
      const id = String(p.id || '').toLowerCase();
      const tit = String(p.titulo?.es || p.titulo || '').toLowerCase();
      return id.includes('volteo') || id.includes('don_juan') || tit.includes('volteo') || tit.includes('don juan');
    },
    rootTradition: 'espiritismo',
    sharedWith: ['santeria_yoruba', 'universal', 'catolicismo']
  },

  // 8. Plegarias Universales de Paz y Conexión con la Creación
  {
    matcher: (p) => {
      const trad = String(p.tradicion || '').toLowerCase();
      return trad === 'universal';
    },
    rootTradition: 'universal',
    sharedWith: ['catolicismo', 'vedica', 'budismo', 'islam', 'hebreo_salmos', 'santeria_yoruba', 'ortodoxia', 'pentecostal', 'mormonismo', 'espiritismo', 'adventista', 'universal']
  }
];

export const STOPWORDS_BY_LANG = {
  es: new Set(['de', 'la', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'mas', 'pero', 'sus', 'le', 'ya', 'o', 'este', 'oracion', 'oraciones', 'rezo', 'rezos', 'plegaria', 'plegarias']),
  en: new Set(['the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'prayer', 'prayers']),
  pt: new Set(['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'nao', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'ao', 'oracao', 'oracoes']),
  fr: new Set(['de', 'la', 'le', 'et', 'les', 'des', 'en', 'un', 'du', 'une', 'que', 'est', 'pour', 'qui', 'dans', 'a', 'par', 'sur', 'au', 'priere', 'prieres']),
  it: new Set(['di', 'e', 'il', 'la', 'che', 'in', 'a', 'per', 'un', 'del', 'i', 'si', 'da', 'della', 'dei', 'delle', 'preghiera', 'preghiere']),
  de: new Set(['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'fur', 'ist', 'im', 'gebet', 'gebete']),
  la: new Set(['et', 'in', 'ad', 'de', 'ut', 'non', 'qui', 'quod', 'cum', 'est', 'oratio', 'orationes']),
  ru: new Set(['и', 'в', 'не', 'на', 'я', 'с', 'что', 'а', 'по', 'это', 'она', 'этот', 'к', 'но', 'они', 'мы', 'как', 'из', 'молитва', 'молитвы']),
  ar: new Set(['في', 'من', 'على', 'و', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'دعاء', 'صلاة']),
  he: new Set(['של', 'את', 'על', 'אל', 'עם', 'זה', 'כי', 'כל', 'תפילה', 'מזמור']),
  hi: new Set(['का', 'के', 'की', 'में', 'है', 'और', 'से', 'को', 'पर', 'यह', 'प्रार्थना']),
  bn: new Set(['এর', 'এবং', 'এ', 'থেকে', 'একটি', 'বা', 'প্রার্থনা']),
  zh: new Set(['的', '了', '和', '在', '是', '有', '我', '他', '为', '祷告', '祈祷']),
  ja: new Set(['の', 'に', 'は', 'を', 'た', 'が', 'で', 'と', '祈り']),
  id: new Set(['yang', 'dan', 'di', 'dari', 'untuk', 'ini', 'dengan', 'doa']),
  ur: new Set(['کا', 'کے', 'کی', 'میں', 'ہے', 'اور', 'سے', 'دعا']),
  sw: new Set(['ya', 'na', 'wa', 'kwa', 'katika', 'ni', 'sala', 'maombi'])
};

const ECUMENICAL_PREFIXES = {
  es: "✦ Tradición Compartida: Raíz en {root} · Presente en {others}",
  en: "✦ Shared Spiritual Heritage: Root in {root} · Embraced in {others}",
  pt: "✦ Tradição Compartilhada: Raiz em {root} · Presente em {others}",
  it: "✦ Tradizione Condivisa: Radice in {root} · Presente in {others}",
  fr: "✦ Tradition Partagée: Racine en {root} · Présente en {others}",
  de: "✦ Gemeinsames Erbe: Wurzel in {root} · Vertreten in {others}",
  la: "✦ Traditio Communis: Radix in {root} · Recepta in {others}",
  ru: "✦ Общее духовное наследие: Истоки в {root} · Принято в {others}",
  ar: "✦ تراث روحي مشترك: الجذور في {root} · معتمدة في {others}",
  he: "✦ מורשת רוחנית משותפת: שורשים ב-{root} · נהוגה ב-{others}",
  hi: "✦ साझा आध्यात्मिक विरासत: {root} में मूल · {others} में मान्य",
  bn: "✦ যৌথ আধ্যাত্মিক ঐতিহ্য: {root}-এ মূল · {others}-এ প্রচলিত",
  zh: "✦ 普世共通传统：根植于 {root} · 融汇于 {others}",
  ja: "✦ 共通の霊的遺産：{root}に起源 · {others}で親しまれる祈り",
  id: "✦ Warisan Spiritual Bersama: Berakar di {root} · Diterima di {others}",
  ur: "✦ مشترکہ روحانی ورثہ: بنیاد {root} · رائج {others}",
  sw: "✦ Urithi wa Pamoja: Asili katika {root} · Inakubaliwa katika {others}"
};

export function getSharedTraditions(prayer) {
  if (!prayer) return [];
  const directTrad = prayer.tradicion || 'universal';
  const sharedSet = new Set([directTrad]);

  for (const rule of CROSS_TRADITION_RULES) {
    if (rule.matcher(prayer)) {
      rule.sharedWith.forEach(t => sharedSet.add(t));
      break;
    }
  }

  return Array.from(sharedSet);
}

export function matchesTraditionInclusive(prayer, traditionKey) {
  if (!prayer || !traditionKey) return true;
  if (prayer.tradicion === traditionKey || prayer.tradicion === 'universal' || traditionKey === 'universal') return true;
  const shared = getSharedTraditions(prayer);
  return shared.includes(traditionKey);
}

export function getEcumenicalBadgeText(prayer, lang = 'es') {
  if (!prayer) return null;
  const l = (lang || 'es').toLowerCase();

  for (const rule of CROSS_TRADITION_RULES) {
    if (rule.matcher(prayer)) {
      const rootKey = typeof rule.rootTradition === 'function' ? rule.rootTradition(prayer) : rule.rootTradition;
      const rootInfo = getTradition(rootKey);
      const rootName = rootInfo?.nombre?.[l] || rootInfo?.nombre?.es || rootKey;

      const otherNames = rule.sharedWith
        .filter(t => t !== rootKey && t !== 'universal')
        .slice(0, 3)
        .map(t => {
          const tInfo = getTradition(t);
          return tInfo?.nombre?.[l] || tInfo?.nombre?.es || t;
        });

      if (otherNames.length === 0) return null;

      const template = ECUMENICAL_PREFIXES[l] || ECUMENICAL_PREFIXES.es;
      return template.replace('{root}', rootName).replace('{others}', otherNames.join(', '));
    }
  }

  return null;
}
