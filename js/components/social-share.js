import { t } from '../data/i18n.js';
/**
 * SOCIAL SHARE COMPONENT - DIFUSIÓN DEVOCIONAL GLOBAL
 * Redes: WhatsApp, Telegram, WeChat, LINE, ShareChat, Zalo, X/Twitter, Facebook, Instagram Stories
 * Generador de Tarjetas HD en Canvas (1080x1920 px) con Bloqueo Amable Pro y Footer Viral en Gratis
 * FeUniversal - Faith & Prayers
 */

import { TRADITIONS, getTradition } from '../data/traditions.js';
import { StorageService } from '../services/storage-service.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { MembershipComponent } from './membership.js';
import { getScriptureBookTitle, formatChapterLabel } from '../data/scriptures-catalog.js';

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
  if (customText) return customText;
  if (!item) return '';
  if (typeof item === 'string') return item;
  const transMap = item.traducciones || item.traduccion || {};
  if (transMap && typeof transMap === 'object' && Object.keys(transMap).length > 0) {
    return transMap[lang] || transMap.es || transMap.en || Object.values(transMap)[0] || item.textoOriginal || '';
  }
  return item.textoOriginal || item.texto || '';
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
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 3000; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    this.modal = el;
  }

  render() {
    if (!this.currentPrayer) return;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const isUnlocked = StorageService.isAccessUnlocked();

    this.modal.innerHTML = `
      <div class="crystal-card" style="max-width: 500px; width: 100%; padding: 24px 18px 20px; position: relative; box-sizing: border-box; margin: auto 0;">
        <!-- Botón de Cerrar (X) Ergonómico y Amplio -->
        <button id="btn-close-share-modal" class="btn-modal-close" title="${t('close_label', lang) || 'Cerrar'}">
          ${renderIcon('ui_close')}
        </button>

        <!-- Cabecera Sagrada -->
        <div style="text-align: center; margin-bottom: 14px; padding: 0 36px;">
          <div style="width: 54px; height: 54px; margin: 0 auto 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px var(--accent-gold-glow); box-sizing: border-box; overflow: hidden;">
            <img src="logo.png?v=5.0" alt="FeUniversal" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 0 0 3px; color: var(--text-primary); line-height: 1.2;">${t('share_modal_title', lang)}</h3>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">${t('share_modal_desc', lang)}</p>
        </div>

        <!-- GENERADOR DE TARJETAS HD PARA STORIES / ESTADOS (CANVAS) -->
        <div class="crystal-card" style="background: var(--glass-inset); border: 1px solid var(--glass-border); padding: 12px 14px; margin-bottom: 12px; text-align: center; border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em;">
            <span style="display: flex; align-items: center; color: var(--accent-gold); flex-shrink: 0;">${renderIcon('ui_camera')}</span>
            <span>${t('share_card_hd_title', lang)}</span>
            ${!isUnlocked ? '<span class="hud-pill dot-gold" style="font-size: 0.58rem; padding: 2px 6px;">PRO</span>' : ''}
          </div>
          <p style="font-size: 0.72rem; color: var(--text-muted); margin: 0 0 8px; line-height: 1.3;">${t('share_card_hd_desc', lang)}</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button id="btn-download-story-card" class="btn-crystal btn-crystal-gold" style="padding: 7px 14px; font-size: 0.78rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; border-radius: var(--radius-full);">
              <span style="display: flex; align-items: center;">${renderIcon('ui_download')}</span>
              <span>${isUnlocked ? t('share_download_hd', lang) : t('share_create_hd_pro', lang)}</span>
            </button>
            <button id="btn-share-native" class="btn-crystal btn-crystal-cyan" style="padding: 7px 14px; font-size: 0.78rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; border-radius: var(--radius-full);">
              <span style="display: flex; align-items: center;">${renderIcon('ui_share_nodes')}</span>
              <span>${t('share_native_btn', lang)}</span>
            </button>
          </div>
        </div>

        <!-- PESTAÑAS DE REDES SOCIALES POR REGIÓN Y TRADICIÓN (TEXTO GRATIS CON FOOTER VIRAL) -->
        <div style="font-size: 0.80rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em; text-align: center;">
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

    // FIRMA LITÚRGICA SAGRADA Y DIFUSIÓN VIRAL ELEGANTE (CERO EMOJIS, 17 IDIOMAS)
    const attribLine = t('share_attribution_line', lang) || '✦ Compartido a través de FeUniversal · Faith & Prayers';
    const sanctuaryTagline = t('share_sanctuary_tagline', lang) || 'Santuario Espiritual Universal';
    const canonicalUrl = 'https://betoles.github.io/feuniversal.app';
    const sacredAttribution = `\n\n—\n${attribLine}\n${sanctuaryTagline}\n${canonicalUrl}`;

    // Payload completo para copiar y compartir en mensajería
    const fullShareText = `« ${title} »\n\n${textToShare}${sacredAttribution}`;
    const encodedFullText = encodeURIComponent(fullShareText);
    const shareUrl = encodeURIComponent(canonicalUrl);

    // Texto sintético para plataformas con límite estricto de caracteres (X / Twitter)
    const twitterText = `« ${title} » · FeUniversal - Faith & Prayers\n${canonicalUrl} #FeUniversal #Prayers`;

    // Acciones por Plataforma
    this.modal.querySelectorAll('.btn-share-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-platform');
        let targetUrl = '';

        switch (platform) {
          case 'whatsapp':
            targetUrl = `https://api.whatsapp.com/send?text=${encodedFullText}`;
            break;
          case 'telegram':
            targetUrl = `https://t.me/share/url?url=${shareUrl}&text=${encodeURIComponent('« ' + title + ' »\n\n' + textToShare + '\n\n—\n' + attribLine)}`;
            break;
          case 'twitter':
            targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
            break;
          case 'facebook':
            targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodedFullText}`;
            break;
          case 'line':
            targetUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${encodedFullText}`;
            break;
          case 'sharechat':
            targetUrl = `https://sharechat.com/share?url=${shareUrl}&title=${encodedFullText}`;
            break;
          case 'zalo':
            targetUrl = `https://sp.zalo.me/share?url=${shareUrl}`;
            break;
          case 'wechat':
            copyToClipboardSafely(fullShareText);
            SacredDialog.alert({
              title: t('share_wechat_title', lang) || 'Texto Copiado para WeChat',
              message: t('share_wechat_msg', lang) || 'El texto sagrado ha sido copiado a tu portapapeles con su formato y atribución oficial.\n\nPuedes pegarlo en WeChat (微信) en tus Momentos o enviarlo a tus grupos.',
              icon: 'brand_wechat',
              buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
              type: 'gold'
            });
            return;
        }

        if (targetUrl) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      });
    });

    const copyToClipboardSafely = async (str) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(str);
          return true;
        }
      } catch (e) {}

      // Fallback universal con textarea invisible
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
    };

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
        if (navigator.share) {
          try {
            await navigator.share({
              title: title,
              text: fullShareText,
              url: canonicalUrl
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

    // Generador de Tarjeta Canvas HD 1080x1920 con Gate Pro
    const downloadCardBtn = document.getElementById('btn-download-story-card');
    if (downloadCardBtn) {
      downloadCardBtn.addEventListener('click', () => {
        const isUnlocked = StorageService.isAccessUnlocked();
        if (!isUnlocked) {
          this.close();
          const mem = new MembershipComponent();
          mem.open();
          return;
        }
        this.generateStoryCardCanvas(this.currentPrayer);
      });
    }
  }

  generateStoryCardCanvas(prayer) {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

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
    const radialHalo = ctx.createRadialGradient(540, 700, 50, 540, 700, 600);
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
    ctx.fillText('FEUNIVERSAL · FAITH & PRAYERS', 540, 175);

    const sanctuarySubtitle = (t('share_sanctuary_tagline', lang) || 'Santuario Espiritual Universal').toUpperCase();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(sanctuarySubtitle, 540, 218);

    // 5. Destello central decorativo
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 44px "Cinzel", Georgia, serif';
    ctx.fillText('✦ ✦ ✦', 540, 310);

    // 6. Tradición Pill Adaptativo
    const tradName = getShareItemTradition(prayer, lang);
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    const textMeasure = ctx.measureText(tradName);
    const pillWidth = Math.min(840, Math.max(340, textMeasure.width + 50));
    const pillX = 540 - pillWidth / 2;
    
    ctx.fillStyle = 'rgba(234, 179, 8, 0.20)';
    ctx.fillRect(pillX, 365, pillWidth, 50);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pillX, 365, pillWidth, 50);
    ctx.fillStyle = '#fef08a';
    ctx.fillText(tradName, 540, 398);

    // 7. Título de la Oración o Escritura (Multilínea)
    const titleText = getShareItemTitle(prayer, lang);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px "Cinzel", Georgia, serif';
    this.wrapText(ctx, titleText, 540, 485, 840, 48, 680);

    // 8. Texto Sagrado de la Plegaria / Versículo
    const rawPrayerText = getShareItemText(prayer, lang, this.customText);
    const cleanPrayerText = rawPrayerText.replace(/^\d+\.\s*/gm, '').replace(/\n+/g, ' ').trim();
    const snippet = cleanPrayerText.substring(0, 320) + (cleanPrayerText.length > 320 ? '...' : '');

    ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
    ctx.font = '30px "Plus Jakarta Sans", sans-serif';
    this.wrapText(ctx, '« ' + snippet + ' »', 540, 760, 840, 44, 1260);

    // 9. Pie de Foto / Invitación
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(t('share_story_card_cta_prefix', lang) || 'Reza la devoción completa y enciende tu veladora en:', 540, 1345);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.fillText('feuniversal.app', 540, 1390);

    // 9.1 MEDALLÓN OFICIAL FEUNIVERSAL EN EL PIE DE LA TARJETA
    const iconX = 540;
    const iconY = 1475;
    const iconRadius = 38;

    // Halo de resplandor áureo del logo
    const iconGlow = ctx.createRadialGradient(iconX, iconY, 10, iconX, iconY, 70);
    iconGlow.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
    iconGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
    iconGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = iconGlow;
    ctx.beginPath();
    ctx.arc(iconX, iconY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Medallón con Logo Oficial de FeUniversal
    if (this.logoImg && this.logoImg.complete && this.logoImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(iconX, iconY, iconRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.logoImg, iconX - iconRadius, iconY - iconRadius, iconRadius * 2, iconRadius * 2);
      ctx.restore();
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.arc(iconX, iconY, iconRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 40px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', iconX, iconY);
      ctx.textBaseline = 'alphabetic';
    }

    // Marco exterior dorado y bisel de cristal
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(iconX, iconY, iconRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(iconX, iconY, iconRadius + 4, 0, Math.PI * 2);
    ctx.stroke();

    // 9.2 CORREO DE OUTLOOK Y LEYENDA DE PETICIÓN (Debajo del ícono y dentro del marco)
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('feuniversal_faith_and_prayers@outlook.com', 540, 1565);

    const petitionLegend = t('share_card_petition_legend', lang) || '« Si deseas que tu oración favorita se incluya, escríbenos tu petición y haremos lo posible por integrarla a FeUniversal. Que así sea... »';
    
    ctx.fillStyle = 'rgba(241, 245, 249, 0.95)';
    ctx.font = 'italic 23px "Plus Jakarta Sans", sans-serif';
    this.wrapText(ctx, petitionLegend, 540, 1615, 840, 32, 1820);

    // 10. Descargar de forma instantánea
    try {
      const link = document.createElement('a');
      link.download = `FeUniversal_${prayer.id || 'oracion'}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Confirmación Sagrada con Logo de la App
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
