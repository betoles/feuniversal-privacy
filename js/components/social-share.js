import { t } from '../data/i18n.js';
/**
 * SOCIAL SHARE COMPONENT - DIFUSIÓN DEVOCIONAL GLOBAL & VIRALIZACIÓN
 * Segmentación Geo-Lingüística Dinámica: WhatsApp, WeChat (微信), LINE, Telegram, X, FB
 * Generador Universal de Tarjetas HD en Canvas (1080x1920 px) para Estados/Stories
 * Enlaces Directos Litúrgicos (Deep Links Canónicos)
 * FeUniversal - Faith & Prayers
 */

import { TRADITIONS, getTradition } from '../data/traditions.js';
import { StorageService } from '../services/storage-service.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { getScriptureBookTitle, formatChapterLabel } from '../data/scriptures-catalog.js';
import { cleanScriptureTextNLP, extractScriptureExcerpt, normalizeLeadingCapitalization } from '../utils/text-sanitizer.js';

export const CANONICAL_WEB_URL = 'https://betoles.github.io/feuniversal-privacy/';

export function getShareItemTitle(item, lang) {
  if (!item) return 'Plegaria Sagrada';
  if (typeof item === 'string') return item;
  if (item.libroKey || item.libro) {
    const bookTitle = getScriptureBookTitle(item, lang);
    const chapLabel = formatChapterLabel(item, lang);
    return `${bookTitle}: ${chapLabel}`;
  }
  if (item.titulo) {
    if (typeof item.titulo === 'object') {
      return item.titulo[lang] || item.titulo.es || item.titulo.en || Object.values(item.titulo)[0] || 'Plegaria Sagrada';
    }
    return String(item.titulo);
  }
  if (item.nombre) {
    if (typeof item.nombre === 'object') {
      return item.nombre[lang] || item.nombre.es || item.nombre.en || Object.values(item.nombre)[0] || 'Plegaria Sagrada';
    }
    return String(item.nombre);
  }
  return 'Plegaria Sagrada';
}

export function getShareItemText(item, lang, customText = null) {
  let raw = '';
  if (customText) raw = customText;
  else if (!item) raw = '';
  else if (typeof item === 'string') raw = item;
  else {
    const transMap = item.traducciones || item.traduccion || {};
    if (transMap && typeof transMap === 'object' && Object.keys(transMap).length > 0) {
      raw = transMap[lang] || transMap.es || transMap.en || Object.values(transMap)[0] || item.textoOriginal || '';
    } else {
      raw = item.textoTraducido || item.textoOriginal || item.texto || '';
    }
  }
  return cleanScriptureTextNLP(raw);
}

export function getShareItemTradition(item, lang) {
  if (!item || typeof item === 'string') return 'UNIVERSAL';
  const tradKey = item.tradicion || 'universal';
  const tradObj = getTradition(tradKey);
  if (tradObj && tradObj.nombre) {
    return (tradObj.nombre[lang] || tradObj.nombre.es || tradObj.nombre.en || tradKey).toUpperCase();
  }
  return String(tradKey).toUpperCase().replace(/_/g, ' ');
}

export function getShareDeepLink(item, lang = 'es') {
  const base = CANONICAL_WEB_URL;
  const l = (lang || 'es').toLowerCase();
  if (!item) return `${base}?lang=${encodeURIComponent(l)}`;
  if (item.id) {
    return `${base}?p=${encodeURIComponent(item.id)}&lang=${encodeURIComponent(l)}`;
  }
  if (item.libroKey) {
    return `${base}?tab=scriptures&book=${encodeURIComponent(item.libroKey)}&cap=${encodeURIComponent(item.capitulo || 1)}&lang=${encodeURIComponent(l)}`;
  }
  return `${base}?lang=${encodeURIComponent(l)}`;
}

export function getScriptSpecificFont(lang, weight = 'normal', size = 28, isSerif = false) {
  const l = (lang || 'es').toLowerCase();
  if (l === 'ar') {
    return `${weight} ${size}px 'Scheherazade New', 'Amiri', serif`;
  }
  if (l === 'ur') {
    return `${weight} ${size}px 'Noto Nastaliq Urdu', 'Scheherazade New', 'Amiri', serif`;
  }
  if (l === 'he') {
    return `${weight} ${size}px 'Frank Ruhl Libre', serif`;
  }
  if (l === 'hi') {
    return `${weight} ${size}px 'Noto Sans Devanagari', sans-serif`;
  }
  if (l === 'bn') {
    return `${weight} ${size}px 'Noto Sans Bengali', sans-serif`;
  }
  if (l === 'zh') {
    return `${weight} ${size}px 'Noto Serif SC', 'Songti SC', 'Source Han Serif SC', serif`;
  }
  if (l === 'ja') {
    return `${weight} ${size}px 'Noto Serif JP', 'Yu Mincho', serif`;
  }
  if (isSerif || l === 'la') {
    return `${weight} ${size}px 'Cinzel', Georgia, serif`;
  }
  return `${weight} ${size}px 'Plus Jakarta Sans', sans-serif`;
}

export function breakTextIntoLines(ctx, text, maxWidth, fontSize, lang = 'es') {
  if (!text) return [];
  const l = (lang || 'es').toLowerCase();
  const isCJK = ['zh', 'ja'].includes(l);

  const cleanedText = normalizeLeadingCapitalization(cleanScriptureTextNLP(text));

  const paragraphs = String(cleanedText)
    .replace(/^\d+[\.\:]\s*/gm, '')
    .split('\n')
    .map(p => p.trim())
    .filter(Boolean);

  const allLines = [];

  for (const para of paragraphs) {
    if (isCJK) {
      let currentLine = '';
      for (const char of para) {
        const testLine = currentLine + char;
        if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
          allLines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) allLines.push(currentLine);
    } else {
      const words = para.split(/\s+/);
      let currentLine = '';
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          allLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) allLines.push(currentLine);
    }
  }

  return allLines;
}

export function calculateOptimalTypography(ctx, fullText, lang, maxWidth, availableHeight) {
  if (!fullText) {
    return { fontSize: 28, lineHeight: 40, lines: [], totalHeight: 0, isTruncated: false };
  }

  // 1. Probar si el texto completo cabe en fuentes desde 34px hasta 20px
  for (let fontSize = 34; fontSize >= 20; fontSize -= 2) {
    const lineHeight = Math.round(fontSize * 1.48);
    ctx.font = getScriptSpecificFont(lang, 'normal', fontSize, false);
    const lines = breakTextIntoLines(ctx, fullText, maxWidth, fontSize, lang);
    const totalHeight = lines.length * lineHeight;
    if (totalHeight <= availableHeight) {
      return {
        fontSize,
        lineHeight,
        lines,
        totalHeight,
        isTruncated: false
      };
    }
  }

  // 2. Si es un capítulo largo de escrituras que excede el espacio disponible:
  // Fijar tipografía legible y noble (24px) y encuadrar el pasaje de apertura exacto
  const targetFontSize = 24;
  const targetLineHeight = Math.round(targetFontSize * 1.48);
  ctx.font = getScriptSpecificFont(lang, 'normal', targetFontSize, false);

  // Dejar espacio de 2 líneas para el separador "« ··· »" y margen de seguridad
  const maxLinesPossible = Math.max(4, Math.floor((availableHeight - (targetLineHeight * 1.5)) / targetLineHeight));
  const approxChars = maxLinesPossible * 42;
  const { excerpt } = extractScriptureExcerpt(fullText, approxChars);

  let lines = breakTextIntoLines(ctx, excerpt, maxWidth, targetFontSize, lang);
  if (lines.length > maxLinesPossible) {
    lines = lines.slice(0, maxLinesPossible);
  }
  lines.push('« ··· »');

  return {
    fontSize: targetFontSize,
    lineHeight: targetLineHeight,
    lines,
    totalHeight: lines.length * targetLineHeight,
    isTruncated: true
  };
}

export function getHeroMessagingPlatform(lang = 'es') {
  const l = (lang || 'es').toLowerCase();
  if (l === 'zh') {
    return {
      key: 'wechat',
      name: 'WeChat (微信)',
      icon: 'brand_wechat',
      color: '#07c160',
      bg: 'rgba(7, 193, 96, 0.16)',
      border: 'rgba(7, 193, 96, 0.45)',
      glow: 'rgba(7, 193, 96, 0.35)',
      actionKey: 'share_blessing_hero_wechat'
    };
  }
  if (l === 'ja') {
    return {
      key: 'line',
      name: 'LINE',
      icon: 'brand_line',
      color: '#00b900',
      bg: 'rgba(0, 185, 0, 0.16)',
      border: 'rgba(0, 185, 0, 0.45)',
      glow: 'rgba(0, 185, 0, 0.35)',
      actionKey: 'share_blessing_hero_line'
    };
  }
  if (l === 'ru') {
    return {
      key: 'telegram',
      name: 'Telegram',
      icon: 'brand_telegram',
      color: '#0088cc',
      bg: 'rgba(0, 136, 204, 0.16)',
      border: 'rgba(0, 136, 204, 0.45)',
      glow: 'rgba(0, 136, 204, 0.35)',
      actionKey: 'share_blessing_hero_telegram'
    };
  }
  // Predeterminado para América Latina, Norteamérica, Europa, Medio Oriente, India, África
  return {
    key: 'whatsapp',
    name: 'WhatsApp',
    icon: 'brand_whatsapp',
    color: '#25d366',
    bg: 'rgba(37, 211, 102, 0.16)',
    border: 'rgba(37, 211, 102, 0.45)',
    glow: 'rgba(37, 211, 102, 0.35)',
    actionKey: 'share_blessing_hero_whatsapp'
  };
}

export async function copyToClipboardSafely(str) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(str);
      return true;
    }
  } catch (e) {}

  if (typeof document !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.value = str;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(textArea);
    return true;
  }
  return false;
}

export function executePlatformShare(platform, prayer, lang = 'es', customText = null) {
  const title = getShareItemTitle(prayer, lang);
  const textToShare = getShareItemText(prayer, lang, customText);
  const deepLink = getShareDeepLink(prayer, lang);
  const attribLine = t('share_attribution_line', lang) || '✦ FeUniversal · Faith & Prayers';
  const sanctuaryTagline = t('share_sanctuary_tagline', lang) || 'Santuario Espiritual Universal';
  
  const sacredAttribution = `\n\n—\n${attribLine}\n${sanctuaryTagline}\n${deepLink}`;
  const fullShareText = `« ${title} »\n\n${textToShare}${sacredAttribution}`;
  const encodedFullText = encodeURIComponent(fullShareText);
  const encodedDeepLink = encodeURIComponent(deepLink);

  const twitterText = `« ${title} » · FeUniversal - Faith & Prayers\n${deepLink} #FeUniversal #Faith`;

  let targetUrl = '';

  switch (platform) {
    case 'whatsapp':
      targetUrl = `https://api.whatsapp.com/send?text=${encodedFullText}`;
      break;
    case 'telegram':
      targetUrl = `https://t.me/share/url?url=${encodedDeepLink}&text=${encodeURIComponent('« ' + title + ' »\n\n' + textToShare + '\n\n—\n' + attribLine)}`;
      break;
    case 'twitter':
      targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
      break;
    case 'facebook':
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedDeepLink}&quote=${encodedFullText}`;
      break;
    case 'line':
      targetUrl = `https://social-plugins.line.me/lineit/share?url=${encodedDeepLink}&text=${encodedFullText}`;
      break;
    case 'sharechat':
      targetUrl = `https://sharechat.com/share?url=${encodedDeepLink}&title=${encodedFullText}`;
      break;
    case 'zalo':
      targetUrl = `https://sp.zalo.me/share?url=${encodedDeepLink}`;
      break;
    case 'wechat':
      copyToClipboardSafely(fullShareText);
      SacredDialog.alert({
        title: t('share_wechat_title', lang) || 'Texto Copiado para WeChat',
        message: t('share_wechat_msg', lang) || 'El texto sagrado y su enlace han sido copiados a tu portapapeles con formato oficial.\n\nPuedes pegarlo en WeChat (微信) en tus Momentos o enviarlo a tus chats.',
        icon: 'brand_wechat',
        buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
        type: 'gold'
      });
      return;
  }

  if (targetUrl && typeof window !== 'undefined') {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
}

export class SocialShareComponent {
  constructor() {
    this.modal = null;
    this.currentPrayer = null;
    this.customText = null;
    if (typeof Image !== 'undefined') {
      this.logoImg = new Image();
      this.logoImg.src = 'logo.png?v=5.0';
    } else {
      this.logoImg = null;
    }
  }

  open(prayer, customText = null) {
    this.currentPrayer = prayer;
    this.customText = customText;
    this.ensureModal();
    this.render();
    this.modal.style.display = 'flex';
    if (this.modal) this.modal.scrollTop = 0;
  }

  close() {
    if (this.modal) this.modal.style.display = 'none';
  }

  ensureModal() {
    let el = document.getElementById('modal-social-share');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-social-share';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 3000; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    this.modal = el;
  }

  render() {
    if (!this.currentPrayer) return;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const heroPlatform = getHeroMessagingPlatform(lang);

    this.modal.innerHTML = `
      <div class="crystal-card" style="max-width: 500px; width: 100%; padding: 24px 18px 20px; position: relative; box-sizing: border-box; margin: auto 0;">
        <!-- Botón de Cerrar (X) Ergonómico y Amplio -->
        <button id="btn-close-share-modal" class="btn-modal-close" title="${t('close_label', lang) || 'Cerrar'}">
          ${renderIcon('ui_close')}
        </button>

        <!-- Cabecera Sagrada -->
        <div style="text-align: center; margin-bottom: 16px; padding: 0 36px;">
          <div style="width: 54px; height: 54px; margin: 0 auto 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px var(--accent-gold-glow); box-sizing: border-box; overflow: hidden; border: 1.5px solid var(--accent-gold);">
            <img src="logo.png?v=5.0" alt="FeUniversal" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 0 0 4px; color: var(--text-primary); line-height: 1.25;">${t('share_modal_title', lang)}</h3>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">${t('share_modal_desc', lang)}</p>
        </div>

        <!-- BOTÓN HÉROE REGIONAL DESTACADO (Segmentación Geo-Lingüística) -->
        <div style="margin-bottom: 16px;">
          <button id="btn-hero-share" class="btn-crystal" data-platform="${heroPlatform.key}" style="width: 100%; min-height: 50px; padding: 12px 18px; display: flex; align-items: center; justify-content: center; gap: 10px; background: ${heroPlatform.bg}; border: 1.5px solid ${heroPlatform.border}; color: ${heroPlatform.color}; font-weight: 800; font-size: 0.95rem; border-radius: var(--radius-full); box-shadow: 0 0 20px ${heroPlatform.glow}; cursor: pointer; transition: all var(--transition-fast);">
            <span style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex-shrink: 0;">${renderIcon(heroPlatform.icon)}</span>
            <span style="letter-spacing: 0.02em;">${t(heroPlatform.actionKey, lang) || `Enviar por ${heroPlatform.name}`}</span>
          </button>
        </div>

        <!-- GENERADOR DE TARJETAS HD PARA STORIES / ESTADOS (CANVAS) -->
        <div class="crystal-card" style="background: var(--glass-inset); border: 1px solid var(--glass-border); padding: 14px 14px; margin-bottom: 14px; text-align: center; border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em;">
            <span style="display: flex; align-items: center; color: var(--accent-gold); flex-shrink: 0; width: 16px; height: 16px;">${renderIcon('ui_camera')}</span>
            <span>${t('share_card_hd_title', lang)}</span>
            <span class="hud-pill dot-gold" style="font-size: 0.60rem; padding: 2px 7px;">1080×1920 HD</span>
          </div>
          <p style="font-size: 0.74rem; color: var(--text-muted); margin: 0 0 10px; line-height: 1.35;">${t('share_card_hd_desc', lang)}</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button id="btn-download-story-card" class="btn-crystal btn-crystal-gold" style="padding: 8px 16px; font-size: 0.80rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; border-radius: var(--radius-full); cursor: pointer;">
              <span style="display: flex; align-items: center; width: 15px; height: 15px;">${renderIcon('ui_download')}</span>
              <span>${t('share_download_hd', lang)}</span>
            </button>
            <button id="btn-share-native" class="btn-crystal btn-crystal-cyan" style="padding: 8px 16px; font-size: 0.80rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; border-radius: var(--radius-full); cursor: pointer;">
              <span style="display: flex; align-items: center; width: 15px; height: 15px;">${renderIcon('ui_share_nodes')}</span>
              <span>${t('share_native_btn', lang)}</span>
            </button>
          </div>
        </div>

        <!-- PESTAÑAS DE REDES SOCIALES POR REGIÓN Y TRADICIÓN (TEXTO GRATIS CON FOOTER VIRAL) -->
        <div style="font-size: 0.76rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.06em; text-align: center;">
          ${t('share_free_channels_title', lang)}
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;">
          <!-- WhatsApp (Occidente / Global) -->
          <button class="btn-crystal btn-share-action" data-platform="whatsapp" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(37, 211, 102, 0.12); border-color: rgba(37, 211, 102, 0.35); color: #25d366; font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_whatsapp')}</span>
            <span style="white-space: nowrap;">WhatsApp</span>
          </button>

          <!-- Telegram (Mundo Islámico / Védico / Global) -->
          <button class="btn-crystal btn-share-action" data-platform="telegram" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(0, 136, 204, 0.12); border-color: rgba(0, 136, 204, 0.35); color: #0088cc; font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_telegram')}</span>
            <span style="white-space: nowrap;">Telegram</span>
          </button>

          <!-- WeChat / 微信 (Mundo Budista / China) -->
          <button class="btn-crystal btn-share-action" data-platform="wechat" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(7, 193, 96, 0.12); border-color: rgba(7, 193, 96, 0.35); color: #07c160; font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_wechat')}</span>
            <span style="white-space: nowrap;">WeChat (微信)</span>
          </button>

          <!-- LINE (Tailandia / Japón / Taiwán Budista) -->
          <button class="btn-crystal btn-share-action" data-platform="line" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(0, 185, 0, 0.12); border-color: rgba(0, 185, 0, 0.35); color: #00b900; font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_line')}</span>
            <span style="white-space: nowrap;">LINE</span>
          </button>

          <!-- ShareChat (India / Tradición Hindú) -->
          <button class="btn-crystal btn-share-action" data-platform="sharechat" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(235, 87, 87, 0.12); border-color: rgba(235, 87, 87, 0.35); color: #eb5757; font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_sharechat')}</span>
            <span style="white-space: nowrap;">ShareChat</span>
          </button>

          <!-- Zalo (Vietnam Budista) -->
          <button class="btn-crystal btn-share-action" data-platform="zalo" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(0, 104, 255, 0.12); border-color: rgba(0, 104, 255, 0.35); color: #0068ff; font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_zalo')}</span>
            <span style="white-space: nowrap;">Zalo</span>
          </button>

          <!-- X / Twitter (Medio Oriente / Global) -->
          <button class="btn-crystal btn-share-action" data-platform="twitter" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); color: var(--text-primary); font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_x')}</span>
            <span style="white-space: nowrap;">X (Twitter)</span>
          </button>

          <!-- Facebook (América Latina / Global) -->
          <button class="btn-crystal btn-share-action" data-platform="facebook" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; min-height: 44px; background: rgba(24, 119, 242, 0.12); border-color: rgba(24, 119, 242, 0.35); color: #1877f2; font-weight: 700; font-size: 0.86rem; border-radius: var(--radius-md); text-align: center; cursor: pointer;">
            <span style="display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('brand_facebook')}</span>
            <span style="white-space: nowrap;">Facebook</span>
          </button>
        </div>

        <!-- COPIAR TEXTO SAGRADO AL PORTAPAPELES (CENTRADO Y BALANCEADO) -->
        <button id="btn-copy-prayer-text" class="btn-crystal" style="width: 100%; padding: 13px 20px; font-size: 0.90rem; font-weight: 800; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; gap: 9px; border-radius: var(--radius-full); background: var(--glass-surface-2); border: 1px solid var(--glass-border); cursor: pointer; transition: all var(--transition-fast);">
          <span style="display: inline-flex; align-items: center; justify-content: center; color: var(--accent-gold); flex-shrink: 0; width: 18px; height: 18px;">${renderIcon('ui_copy')}</span>
          <span style="text-align: center; line-height: 1.35; display: inline-block;">${t('share_copy_text_btn', lang) || 'Copiar Texto Sagrado al Portapapeles'}</span>
        </button>

        <div id="share-toast-msg" style="display: none; margin-top: 10px; padding: 8px 14px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: var(--radius-md); text-align: center; font-size: 0.76rem; color: var(--accent-gold); font-weight: 700; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
          <span style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; margin-right: 6px; width: 14px; height: 14px;">${renderIcon('ui_check')}</span>
          <span style="vertical-align: middle;">${t('share_toast_success', lang) || 'Texto sagrado copiado al portapapeles con éxito'}</span>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = document.getElementById('btn-close-share-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const item = this.currentPrayer;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const title = getShareItemTitle(item, lang);
    const textToShare = getShareItemText(item, lang, this.customText);
    const deepLink = getShareDeepLink(item, lang);

    // FIRMA LITÚRGICA SAGRADA Y DIFUSIÓN VIRAL ELEGANTE (CERO EMOJIS, 17 IDIOMAS)
    const attribLine = t('share_attribution_line', lang) || '✦ FeUniversal · Faith & Prayers';
    const sanctuaryTagline = t('share_sanctuary_tagline', lang) || 'Santuario Espiritual Universal';
    const sacredAttribution = `\n\n—\n${attribLine}\n${sanctuaryTagline}\n${deepLink}`;

    // Payload completo para copiar y compartir en mensajería
    const fullShareText = `« ${title} »\n\n${textToShare}${sacredAttribution}`;

    // Botón Héroe Regional
    const heroBtn = document.getElementById('btn-hero-share');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        const platform = heroBtn.getAttribute('data-platform') || 'whatsapp';
        executePlatformShare(platform, this.currentPrayer, lang, this.customText);
      });
    }

    // Acciones por Plataforma en la Cuadrícula
    this.modal.querySelectorAll('.btn-share-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-platform');
        executePlatformShare(platform, this.currentPrayer, lang, this.customText);
      });
    });

    // Copiar Texto Sagrado Completo al Portapapeles
    const copyBtn = document.getElementById('btn-copy-prayer-text');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        await copyToClipboardSafely(fullShareText);
        const toast = document.getElementById('share-toast-msg');
        if (toast) {
          toast.style.display = 'block';
          setTimeout(() => { toast.style.display = 'none'; }, 3500);
        }
        SacredDialog.toast(t('share_toast_success', lang) || 'Texto sagrado copiado al portapapeles');
      });
    }

    // Botón "Compartir en Redes" (Web Share API Nativo con Fallback Inteligente)
    const nativeShareBtn = document.getElementById('btn-share-native');
    if (nativeShareBtn) {
      nativeShareBtn.addEventListener('click', async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: fullShareText,
              url: deepLink
            });
            SacredDialog.toast(t('share_native_success', lang) || 'Plegaria compartida con éxito');
          } catch (err) {
            if (err && err.name !== 'AbortError') {
              await copyToClipboardSafely(fullShareText);
              SacredDialog.alert({
                title: t('share_alert_copied_title', lang) || 'Texto Sagrado Copiado',
                message: t('share_alert_copied_msg', lang) || 'La bendición y su enlace oficial han sido copiados a tu portapapeles.\n\nPuedes pegarlo en cualquier red social o chat de mensajería.',
                icon: 'brand_logo',
                buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
                type: 'gold'
              });
            }
          }
        } else {
          await copyToClipboardSafely(fullShareText);
          SacredDialog.alert({
            title: t('share_alert_copied_title', lang) || 'Texto Sagrado Copiado',
            message: t('share_alert_copied_msg', lang) || 'La bendición y su enlace oficial han sido copiados a tu portapapeles con éxito.\n\nPuedes pegarlo directamente en cualquier red social o grupo devocional.',
            icon: 'brand_logo',
            buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
            type: 'gold'
          });
        }
      });
    }

    // Generador de Tarjeta Canvas HD 1080x1920 (Totalmente Desbloqueado para Todos)
    const downloadCardBtn = document.getElementById('btn-download-story-card');
    if (downloadCardBtn) {
      downloadCardBtn.addEventListener('click', async () => {
        downloadCardBtn.disabled = true;
        try {
          await this.generateStoryCardCanvas(this.currentPrayer);
        } finally {
          downloadCardBtn.disabled = false;
        }
      });
    }
  }

  async generateStoryCardCanvas(prayer) {
    if (typeof document === 'undefined') return;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const deepLink = getShareDeepLink(prayer, lang);
    const deepLinkDisplay = deepLink.replace(/^https?:\/\//, '');

    // Blindaje de Tipografía Sagrada: Esperar a que el motor de fuentes esté 100% cargado
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
        const fontToLoad = getScriptSpecificFont(lang, 'normal', 28, false);
        if (document.fonts.load) {
          await Promise.race([
            Promise.all([
              document.fonts.load('bold 36px "Cinzel"'),
              document.fonts.load(fontToLoad),
              document.fonts.load('bold 22px "JetBrains Mono"')
            ]),
            new Promise(res => setTimeout(res, 1200))
          ]);
        }
      } catch (e) {
        console.warn('[CanvasFonts] Precarga tipográfica completada con fallback:', e);
      }
    }

    // Asegurar carga de imagen del medallón sagrado si aún no está en caché
    if (!this.logoImg || !this.logoImg.complete || this.logoImg.naturalWidth === 0) {
      try {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => { this.logoImg = img; resolve(img); };
          img.onerror = () => resolve(null);
          img.src = 'ico.png';
        });
      } catch (_) {}
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // 1. Fondo degradado místico cósmico
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, '#0a0f1d');
    grad.addColorStop(0.35, '#1e1b4b');
    grad.addColorStop(0.7, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Halo de resplandor áureo central
    const radialHalo = ctx.createRadialGradient(540, 750, 50, 540, 750, 650);
    radialHalo.addColorStop(0, 'rgba(234, 179, 8, 0.28)');
    radialHalo.addColorStop(0.5, 'rgba(99, 102, 241, 0.16)');
    radialHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialHalo;
    ctx.fillRect(0, 0, 1080, 1920);

    // 3. Borde decorativo de cristal
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 960, 1800);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(76, 76, 928, 1768);

    // 4. Encabezado / Logo FeUniversal
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('FEUNIVERSAL · FAITH & PRAYERS', 540, 160);

    const sanctuarySubtitle = (t('share_sanctuary_tagline', lang) || 'Santuario Espiritual Universal').toUpperCase();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = getScriptSpecificFont(lang, 'normal', 22, false);
    ctx.fillText(sanctuarySubtitle, 540, 202);

    // 5. Destello central decorativo
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 38px "Cinzel", Georgia, serif';
    ctx.fillText('✦ ✦ ✦', 540, 260);

    // 6. Tradición Pill Adaptativo
    const tradName = getShareItemTradition(prayer, lang);
    ctx.font = getScriptSpecificFont(lang, 'bold', 22, false);
    const textMeasure = ctx.measureText(tradName);
    const pillWidth = Math.min(840, Math.max(320, textMeasure.width + 48));
    const pillX = 540 - pillWidth / 2;
    
    ctx.fillStyle = 'rgba(234, 179, 8, 0.20)';
    ctx.fillRect(pillX, 295, pillWidth, 46);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pillX, 295, pillWidth, 46);
    ctx.fillStyle = '#fef08a';
    ctx.fillText(tradName, 540, 326);

    // 7. Título de la Oración o Escritura (Multilínea Dinámico)
    const titleText = getShareItemTitle(prayer, lang);
    ctx.fillStyle = '#ffffff';
    ctx.font = getScriptSpecificFont(lang, 'bold', 34, true);
    const titleLines = breakTextIntoLines(ctx, titleText, 860, 34, lang);
    const titleLineHeight = 44;
    let titleY = 388;
    for (const tl of titleLines) {
      ctx.fillText(tl, 540, titleY);
      titleY += titleLineHeight;
    }
    const titleEndY = titleY - titleLineHeight + 16;

    // 8. Pie de Foto / Elementos Inferiores (Cálculo adaptativo de abajo hacia arriba)
    const petitionLegend = t('share_card_petition_legend', lang) || '« Si deseas que tu oración favorita se incluya, escríbenos tu petición y haremos lo posible por integrarla a FeUniversal. Que así sea... »';
    ctx.font = getScriptSpecificFont(lang, 'italic', 20, false);
    const legendLines = breakTextIntoLines(ctx, petitionLegend, 840, 20, lang);
    const legendLineHeight = 28;
    const totalLegendHeight = legendLines.length * legendLineHeight;
    
    const legendStartY = 1825 - totalLegendHeight;
    const emailY = legendStartY - 28;
    const medallionY = emailY - 62;
    const iconRadius = 34;

    // 8.2 Separar Deep Link URL en 2 renglones armónicos
    let urlLine1 = 'betoles.github.io/feuniversal-privacy/';
    let urlLine2 = '';

    if (deepLinkDisplay.includes('?')) {
      const parts = deepLinkDisplay.split('?');
      urlLine1 = parts[0] + (parts[0].endsWith('/') ? '' : '/');
      urlLine2 = '?' + parts[1];
    } else {
      urlLine1 = deepLinkDisplay;
      urlLine2 = '';
    }

    const hasTwoUrlLines = !!urlLine2;
    const deepLinkY2 = medallionY - 48;
    const deepLinkY1 = hasTwoUrlLines ? deepLinkY2 - 28 : deepLinkY2;
    const ctaY = deepLinkY1 - 32;
    const topOfFooter = ctaY - 26;

    // 8.1 Dibujar CTA dinámico según el tipo de contenido
    const isScriptureOrLong = !!(prayer.libroKey || prayer.capitulo);
    const ctaPrefix = isScriptureOrLong
      ? (t('share_read_full_chapter_cta', lang) || 'Reza y lee el capítulo completo en:')
      : (t('share_story_card_cta_prefix', lang) || 'Reza la devoción completa y enciende tu veladora en:');

    ctx.fillStyle = '#f59e0b';
    ctx.font = getScriptSpecificFont(lang, 'bold', 22, false);
    ctx.fillText(ctaPrefix, 540, ctaY);

    // 8.2 Dibujar Deep Link URL en 2 renglones con tipografía nítida
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "JetBrains Mono", "Plus Jakarta Sans", monospace';
    ctx.fillText(urlLine1, 540, deepLinkY1);

    if (hasTwoUrlLines) {
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 20px "JetBrains Mono", "Plus Jakarta Sans", monospace';
      ctx.fillText(urlLine2, 540, deepLinkY2);
    }

    // 8.3 Dibujar Medallón Oficial FeUniversal
    const iconX = 540;
    const iconGlow = ctx.createRadialGradient(iconX, medallionY, 8, iconX, medallionY, 60);
    iconGlow.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
    iconGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
    iconGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = iconGlow;
    ctx.beginPath();
    ctx.arc(iconX, medallionY, 60, 0, Math.PI * 2);
    ctx.fill();

    if (this.logoImg && this.logoImg.complete && this.logoImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(iconX, medallionY, iconRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, iconX - iconRadius, medallionY - iconRadius, iconRadius * 2, iconRadius * 2);
      ctx.restore();
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.arc(iconX, medallionY, iconRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', iconX, medallionY);
      ctx.textBaseline = 'alphabetic';
    }

    // Marco exterior dorado y bisel de cristal
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(iconX, medallionY, iconRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(iconX, medallionY, iconRadius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // 8.4 Dibujar Correo Oficial
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('feuniversal_faith_and_prayers@outlook.com', 540, emailY);

    // 8.5 Dibujar Leyenda de Petición
    ctx.fillStyle = 'rgba(241, 245, 249, 0.95)';
    ctx.font = getScriptSpecificFont(lang, 'italic', 20, false);
    let curLegendY = legendStartY;
    for (const legLine of legendLines) {
      ctx.fillText(legLine, 540, curLegendY);
      curLegendY += legendLineHeight;
    }

    // 9. Texto Sagrado de la Plegaria Completa o Pasaje de Apertura (NLP Sanado)
    const rawPrayerText = getShareItemText(prayer, lang, this.customText);
    const cleanPrayerText = cleanScriptureTextNLP(rawPrayerText.replace(/^\d+\.\s*/gm, '').trim());

    const prayerStartY = titleEndY + 28;
    const availableHeight = topOfFooter - prayerStartY - 24;

    const typo = calculateOptimalTypography(ctx, cleanPrayerText, lang, 860, availableHeight);

    ctx.fillStyle = 'rgba(248, 250, 252, 0.96)';
    ctx.font = getScriptSpecificFont(lang, 'normal', typo.fontSize, false);

    const totalTextH = typo.lines.length * typo.lineHeight;
    const offsetVertical = Math.max(0, (availableHeight - totalTextH) / 2);
    let drawTextY = prayerStartY + offsetVertical + typo.fontSize;

    for (const pline of typo.lines) {
      if (drawTextY <= (topOfFooter - 8)) {
        ctx.fillText(pline, 540, drawTextY);
      }
      drawTextY += typo.lineHeight;
    }

    // 10. Descargar de forma instantánea
    try {
      const link = document.createElement('a');
      link.download = `FeUniversal_${prayer.id || 'oracion'}_${lang}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      SacredDialog.alert({
        title: t('share_hd_card_title', lang) || '¡Tarjeta HD Consagrada!',
        message: t('share_hd_card_msg', lang) || 'Tu tarjeta visual en alta resolución (1080×1920 px) ha sido descargada con éxito en tu dispositivo.\n\nLista para compartir en tus Stories o Estados.',
        icon: 'brand_logo',
        buttonText: t('share_hd_card_btn', lang) || 'Continuar Devoción',
        type: 'gold'
      });
    } catch (e) {
      console.error('Error exportando tarjeta:', e);
      SacredDialog.toast(t('share_hd_toast_success', lang) || '✨ Tarjeta HD generada con éxito');
    }
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight, maxY = 1820) {
    if (!text) return;
    const words = String(text).split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        if (currentY > maxY) break;
      } else {
        line = testLine;
      }
    }
    if (currentY <= maxY) {
      ctx.fillText(line.trim(), x, currentY);
    }
  }
}
