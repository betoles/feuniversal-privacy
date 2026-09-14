/**
 * MIRROR READER COMPONENT (LECTOR ESPEJO PARALELO)
 * FeUniversal - Faith & Prayers
 * 
 * Incorpora Tarjeta Consagrada de Compartir Bendición con Segmentación Geo-Lingüística
 * y activación por aura tras finalización de la oración (TTS onend / scroll final).
 */

import { soundManager } from '../services/sound-service.js';
import { PrayerCorpusService } from '../services/prayer-corpus-service.js';
import { getTradition } from '../data/traditions.js';
import { StorageService } from '../services/storage-service.js';
import { renderIcon } from './icons.js';
import { SocialShareComponent, getHeroMessagingPlatform, executePlatformShare } from './social-share.js';
import { TranslationReportModalComponent } from './translation-report-modal.js';
import { MembershipComponent } from './membership.js';
import { SacredSoundPicker } from './sacred-sound-picker.js';
import { t, isRTL } from '../data/i18n.js';

export class MirrorReaderComponent {
  constructor() {
    this.container = typeof document !== 'undefined' ? document.getElementById('modal-reader') : null;
    this.socialShare = new SocialShareComponent();
    this.reportModal = new TranslationReportModalComponent();
    this.membership = new MembershipComponent();
    this.currentPrayer = null;
    this.currentSound = 'silencio_profundo';
  }

  formatTraditionName(tradKey, lang = 'es') {
    if (!tradKey) return '';
    try {
      const trad = getTradition(tradKey.toLowerCase());
      if (trad && trad.nombre) {
        const name = trad.nombre[lang] || trad.nombre['es'] || trad.nombre['en'];
        if (name) return name.toUpperCase();
      }
    } catch (e) {}
    const i18nKey = `trad_${tradKey.toLowerCase()}`;
    const translated = t(i18nKey, lang);
    if (translated && translated !== i18nKey) return translated.toUpperCase();
    return String(tradKey).replace(/_/g, ' ').toUpperCase();
  }

  formatLiturgicalRoot(rootStr, lang = 'es') {
    if (!rootStr) return t('liturgical_root', lang) || 'Litúrgico';
    const roots = String(rootStr).split('/').map(s => s.trim());
    const ROOT_MAP = {
      'sánscrito': { ru: 'Священный санскрит', en: 'Sacred Sanskrit', zh: '梵文', ja: 'サンスクリット語', es: 'Sánscrito Sagrado', ar: 'السنسكريتية المقدسة', he: 'סנסקריט קדושה' },
      'sanscrito': { ru: 'Священный санскрит', en: 'Sacred Sanskrit', zh: '梵文', ja: 'サンスクリット語', es: 'Sánscrito Sagrado', ar: 'السنسكريتية المقدسة', he: 'סנסקריט קדושה' },
      'pali': { ru: 'Пали', en: 'Pali', zh: '巴利文', ja: 'パーリ語', es: 'Pali', ar: 'البالية', he: 'פאלי' },
      'páli': { ru: 'Пали', en: 'Pali', zh: '巴利文', ja: 'パーリ語', es: 'Pali', ar: 'البالية', he: 'פאלי' },
      'tibetano': { ru: 'Тибетский', en: 'Tibetan', zh: '藏文', ja: 'チベット語', es: 'Tibetano', ar: 'التبتية', he: 'טיבטית' },
      'hebreo': { ru: 'Древнееврейский', en: 'Biblical Hebrew', zh: '希伯来圣经语', ja: 'ヘブライ語', es: 'Hebreo Bíblico', ar: 'العبرية التوراتية', he: 'עברית מקראית' },
      'arameo': { ru: 'Арамейский', en: 'Aramaic', zh: '亚兰文', ja: 'アラム語', es: 'Arameo', ar: 'الآرامية', he: 'ארמית' },
      'árabe': { ru: 'Коранический арабский', en: 'Quranic Arabic', zh: '古兰经阿拉伯语', ja: 'クルアーン・アラビア語', es: 'Árabe Coránico', ar: 'العربية القرآنية', he: 'ערבית קוראנית' },
      'arabe': { ru: 'Коранический арабский', en: 'Quranic Arabic', zh: '古兰经阿拉伯语', ja: 'クルアーン・アラビア語', es: 'Árabe Coránico', ar: 'العربية القرآنية', he: 'ערבית קוראנית' },
      'latín': { ru: 'Церковная латынь', en: 'Ecclesiastical Latin', zh: '教会拉丁语', ja: '教会ラテン語', es: 'Latín Eclesiástico', ar: 'اللاتينية الكنسية', he: 'לטינית כנסייתית' },
      'latin': { ru: 'Церковная латынь', en: 'Ecclesiastical Latin', zh: '教会拉丁语', ja: '教会ラテン語', es: 'Latín Eclesiástico', ar: 'اللاتينية الكنسية', he: 'לטינית כنسייתית' },
      'griego': { ru: 'Древнегреческий (Койне)', en: 'Koine Greek', zh: '通用希腊语', ja: '古代ギリシャ語', es: 'Griego Koiné', ar: 'اليونانية القديمة', he: 'יוונית קוינה' },
      'eslavo eclesiástico': { ru: 'Церковнославянский', en: 'Church Slavonic', zh: '教会斯拉夫语', ja: '教会スラヴ語', es: 'Eslavo Eclesiástico', ar: 'السلافية الكنسية', he: 'סלאבית כנסייתית' },
      'ruso': { ru: 'Русский', en: 'Russian', zh: '俄语', ja: 'ロシア語', es: 'Ruso', ar: 'الروسية', he: 'רוסית' },
      'chino': { ru: 'Классический китайский', en: 'Classical Chinese', zh: '文言文', ja: '漢文', es: 'Chino Clásico', ar: 'الصينية الكلاسيكية', he: 'סינית קלאסית' },
      'japonés': { ru: 'Японский', en: 'Japanese', zh: '日语', ja: '日本語', es: 'Japonés', ar: 'اليابانية', he: 'יפנית' },
      'japones': { ru: 'Японский', en: 'Japanese', zh: '日语', ja: '日本語', es: 'Japonés', ar: 'اليابانية', he: 'יפנית' },
      'español': { ru: 'Испанский', en: 'Spanish', zh: '西班牙语', ja: 'スペイン語', es: 'Español', ar: 'الإسبانية', he: 'ספרדית' },
      'espanol': { ru: 'Испанский', en: 'Spanish', zh: '西班牙语', ja: 'スペイン語', es: 'Español', ar: 'الإسبانية', he: 'ספרדית' },
      'yoruba': { ru: 'Йоруба', en: 'Yoruba', zh: '约鲁巴语', ja: 'ヨルバ語', es: 'Yoruba', ar: 'اليوروبا', he: 'יורובה' },
      'inglés': { ru: 'Английский', en: 'English', zh: '英语', ja: '英語', es: 'Inglés', ar: 'الإنجليزية', he: 'אנגלית' },
      'ingles': { ru: 'Английский', en: 'English', zh: '英语', ja: '英語', es: 'Inglés', ar: 'الإنجليزية', he: 'אנגלית' }
    };
    
    const localized = roots.map(r => {
      const lower = r.toLowerCase().trim();
      for (const [k, map] of Object.entries(ROOT_MAP)) {
        if (lower.includes(k)) {
          return map[lang] || map['en'] || map['es'] || r;
        }
      }
      return r.replace(/_/g, ' ');
    });
    return localized.join(' / ');
  }

  async open(prayer) {
    const quota = StorageService.getDailyPrayerQuota();
    if (!quota.allowed) {
      this.membership.open('prayer_limit');
      return;
    }

    StorageService.recordPrayerRead();

    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    // 1. Carga asíncrona garantizada de la plegaria en el idioma activo
    if (prayer && prayer.id) {
      try {
        const fullPrayer = await PrayerCorpusService.getPrayerById(prayer.id, lang);
        if (fullPrayer) {
          prayer = fullPrayer;
        }
      } catch (e) {
        console.warn('[MirrorReader] Error cargando plegaria en idioma activo:', e);
      }
    }

    this.currentPrayer = prayer;
    window.activePrayerSession = prayer;

    // Sonido predeterminado siempre en silencio profundo para los 17 idiomas
    this.currentSound = 'silencio_profundo';

    this.render();
    if (this.container) {
      this.container.style.display = 'flex';
      this.container.style.flexDirection = 'column';
      this.container.style.alignItems = 'center';
      this.container.style.justifyContent = 'flex-start';
      this.container.scrollTop = 0;
    }
    StorageService.incrementSpiritualScore(5, prayer.categoriaIntencion || 'paz_interior');

    if (this.currentSound !== 'silencio_profundo' && prefs.modoZen !== false && StorageService.isFeatureUnlocked('music')) {
      setTimeout(() => {
        soundManager.playAmbient(this.currentSound);
        const toggleSoundBtn = document.getElementById('btn-toggle-sound');
        if (toggleSoundBtn) toggleSoundBtn.classList.add('active-glow-cyan');
      }, 300);
    }
  }

  close() {
    soundManager.stopTTS();
    soundManager.stopAmbient();
    if (this.container) this.container.style.display = 'none';
    const ttsBtn = document.getElementById('btn-read-tts');
    if (ttsBtn) {
      ttsBtn.innerHTML = `${renderIcon('ui_voice')}<span>Audio</span>`;
      ttsBtn.classList.remove('active-glow-cyan');
    }
  }

  render() {
    if (!this.currentPrayer) return;

    const prefs = StorageService.getPreferences();
    const isZen = prefs.modoZen !== false;
    const lang = prefs.idioma || 'es';
    const prayer = this.currentPrayer;
    const origLangStr = (prayer.idiomaLiturgicoOriginal || '').toLowerCase();
    const heroPlatform = getHeroMessagingPlatform(lang);
    
    const isNativeLanguageMatch =
      (lang === 'es' && /español|castellano|mexic|latino|argentin|colomb|venezol|chile|peru|cuban|paraguay|uruguay|boliv|guatemal|costa rica|panam|salvador|honduras|nicaragua/i.test(origLangStr)) ||
      (lang === 'ar' && /árabe|arabic|qur|corán/i.test(origLangStr)) ||
      (lang === 'he' && /hebreo|hebrew|masorét/i.test(origLangStr)) ||
      (lang === 'zh' && /chino|chinese|hanzi|tao|confuc/i.test(origLangStr)) ||
      (lang === 'la' && /latín|latin/i.test(origLangStr)) ||
      (lang === 'en' && /inglés|english|anglican|bcp/i.test(origLangStr)) ||
      (lang === 'de' && /alemán|german|deutsch/i.test(origLangStr)) ||
      (lang === 'ru' && /ruso|russian|cirílic|eslavo/i.test(origLangStr)) ||
      (lang === 'it' && /italiano|italian/i.test(origLangStr)) ||
      (lang === 'pt' && /portugu|brazil/i.test(origLangStr)) ||
      (lang === 'hi' && /hindi|devanagari/i.test(origLangStr));

    let translationContentHtml = '';
    let translationHeaderLabel = 'Traducción';

    if (isNativeLanguageMatch && !prayer.textoTraducido) {
      translationHeaderLabel = 'Texto Sagrado en Idioma Nativo';
      translationContentHtml = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.35); padding: 14px; border-radius: var(--radius-md); text-align: center; margin-bottom: 14px;">
          <div style="font-size: 1.25rem; margin-bottom: 4px;">🌿</div>
          <div style="font-weight: 800; font-size: 0.86rem; color: #34d399; margin-bottom: 3px;">Texto en tu Idioma Nativo Original</div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); line-height: 1.35;">Estás leyendo la revelación/composición en su lengua de raíz (${lang.toUpperCase()}).</div>
        </div>
        <div class="pane-content-translation" style="white-space: pre-line; opacity: 0.92;">${prayer.textoOriginal}</div>
      `;
    } else if (prayer.textoTraducido) {
      translationHeaderLabel = `${t('scriptures_verified_translation', lang) || 'Traducción Oficial'} (${lang.toUpperCase()})`;
      translationContentHtml = `<div class="pane-content-translation" style="white-space: pre-line;">${prayer.textoTraducido}</div>`;
    } else if (prayer.traducciones && prayer.traducciones[lang]) {
      translationHeaderLabel = `Traducción Oficial (${lang.toUpperCase()})`;
      translationContentHtml = `<div class="pane-content-translation" style="white-space: pre-line;">${prayer.traducciones[lang]}</div>`;
    } else {
      const fallbackLang = (prayer.traducciones && prayer.traducciones.es) ? 'es' : 'en';
      const fallbackText = (prayer.traducciones && prayer.traducciones[fallbackLang]) || prayer.textoOriginal;
      const fbUpper = fallbackLang.toUpperCase();
      const targetUpper = lang.toUpperCase();

      let refHeader = `Traducción de Referencia (${fbUpper})`;
      if (lang === 'en') refHeader = `Reference Translation (${fbUpper})`;
      else if (lang === 'de') refHeader = `Referenzübersetzung (${fbUpper})`;
      else if (lang === 'fr') refHeader = `Traduction de Référence (${fbUpper})`;
      else if (lang === 'it') refHeader = `Traduzione di Riferimento (${fbUpper})`;
      else if (lang === 'pt') refHeader = `Tradução de Referência (${fbUpper})`;
      else if (lang === 'ru') refHeader = `Справочный перевод (${fbUpper})`;

      translationHeaderLabel = refHeader;

      let badgeMsg = `Traducción Canónica de Referencia (${fbUpper}) para tu idioma seleccionado (${targetUpper})`;
      if (lang === 'en') {
        badgeMsg = `Canonical Reference Translation (${fbUpper}) for your selected language (${targetUpper})`;
      } else if (lang === 'de') {
        badgeMsg = `Kanonische Referenzübersetzung (${fbUpper}) für deine ausgewählte Sprache (${targetUpper})`;
      } else if (lang === 'fr') {
        badgeMsg = `Traduction Canonique de Référence (${fbUpper}) pour votre langue sélectionnée (${targetUpper})`;
      } else if (lang === 'it') {
        badgeMsg = `Traduzione Canonica di Riferimento (${fbUpper}) per la tua lingua selezionata (${targetUpper})`;
      } else if (lang === 'pt') {
        badgeMsg = `Tradução Canônica de Referência (${fbUpper}) para o seu idioma selecionado (${targetUpper})`;
      } else if (lang === 'ru') {
        badgeMsg = `Канонический справочный перевод (${fbUpper}) для выбранного языка (${targetUpper})`;
      } else if (lang === 'ar') {
        badgeMsg = `الترجمة المرجعية المعتمدة (${fbUpper}) للغتك المختارة (${targetUpper})`;
      } else if (lang === 'he') {
        badgeMsg = `תרגום קנוני להשוואה (${fbUpper}) עבור השפה שנבחרה (${targetUpper})`;
      } else if (lang === 'zh') {
        badgeMsg = `所选语言 (${targetUpper}) 的权威参考译文 (${fbUpper})`;
      } else if (lang === 'ja') {
        badgeMsg = `選択した言語 (${targetUpper}) の標準参照訳 (${fbUpper})`;
      } else if (lang === 'ko') {
        badgeMsg = `선택한 언어 (${targetUpper})를 위한 표준 참조 번역 (${fbUpper})`;
      } else if (lang === 'hi') {
        badgeMsg = `आपकी चयनित भाषा (${targetUpper}) के लिए प्रामाणिक संदर्भ अनुवाद (${fbUpper})`;
      } else if (lang === 'tr') {
        badgeMsg = `Seçtiğiniz dil (${targetUpper}) için Kanonik Referans Çevirisi (${fbUpper})`;
      }

      translationContentHtml = `
        <div style="background: rgba(234, 179, 8, 0.12); border: 1px solid rgba(234, 179, 8, 0.35); padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.84rem; font-weight: 600; line-height: 1.45; color: var(--accent-gold); margin-bottom: 12px; text-align: center;">
          ${badgeMsg}
        </div>
        <div class="pane-content-translation" style="white-space: pre-line;">${fallbackText}</div>
      `;
    }

    const titleText = typeof prayer.titulo === 'string' ? prayer.titulo : ((prayer.titulo && (prayer.titulo[lang] || prayer.titulo.es)) || 'Oración');
    const soundDef = SacredSoundPicker.getSoundDef(this.currentSound, lang);
    const isLangRTL = isRTL(lang);

    // Ritual metadata formatting (SVG icons + CSS crystal badges)
    let ritualMetaHtml = '';
    if (prayer.ritualesAsociados) {
      const r = prayer.ritualesAsociados;
      
      let countLabel = '';
      if (r.tipoContador) {
        const key = r.tipoContador.toLowerCase().trim();
        if (key === 'rosario_10' || key === 'rosario') countLabel = `${t('bead_mode_rosary', lang) || 'Rosario'} (10)`;
        else if (key === 'treinta_y_tres' || key === 'coronilla_33' || key === 'coronilla') countLabel = `${t('bead_mode_chaplet', lang) || 'Coronilla'} (33)`;
        else if (key === 'tasbih_33' || key === 'tasbih') countLabel = `${t('bead_mode_tasbih', lang) || 'Tasbih'} (33)`;
        else if (key === 'tasbih_99') countLabel = `${t('bead_mode_tasbih', lang) || 'Tasbih'} (99)`;
        else if (key === 'japa_mala_108' || key === 'japa_mala') countLabel = `${t('bead_mode_japa_mala', lang) || 'Japa Mala'} (108)`;
        else if (key === 'decretos_21' || key === 'decretos') countLabel = `${t('bead_mode_decrees', lang) || 'Decretos'} (21)`;
        else if (key === 'libre') countLabel = t('bead_mode_free', lang) || 'Libre';
        else if (key === 'novena_9' || key === 'novena') countLabel = `${t('nav_novenas', lang) || 'Novena'} (9)`;
        else if (key === 'veinticuatro') countLabel = '24';
        else countLabel = r.tipoContador.replace(/_/g, ' ');
        countLabel = countLabel.replace(/\s*\(\d+\)\s*\(\d+\)/g, (m) => { const n = m.match(/\d+/); return n ? ` (${n[0]})` : ''; });
      }

      const candleLabel = r.duracionVeladoraSugeridaHoras ? `${r.duracionVeladoraSugeridaHoras}h` : '';

      let soundLabel = '';
      if (r.paisajeSonoroRecomendado) {
        const sDef = SacredSoundPicker.getSoundDef(r.paisajeSonoroRecomendado, lang);
        if (sDef && sDef.name) {
          soundLabel = sDef.name.split('•')[0].split('·')[0].split('(')[0].trim() || sDef.name;
        } else {
          soundLabel = r.paisajeSonoroRecomendado.replace(/_/g, ' ');
        }
      }

      const rawLabel = t('ritual_suggested_label', lang) || 'Ritual Sugerido:';
      const cleanLabel = rawLabel.replace(/^✨\s*/, '');

      ritualMetaHtml = `
        <div class="ritual-suggested-card">
          <div class="ritual-suggested-header">
            <span class="ritual-sparkle-icon">${renderIcon('ui_sparkles')}</span>
            <span class="ritual-suggested-title">${cleanLabel}</span>
          </div>
          <div class="ritual-suggested-pills">
            ${countLabel ? `
              <div class="ritual-badge badge-counter" title="${t('nav_beads', lang)}">
                <span class="ritual-icon">${renderIcon('nav_beads')}</span>
                <span class="ritual-text">${countLabel}</span>
              </div>
            ` : ''}
            ${candleLabel ? `
              <div class="ritual-badge badge-candle" title="${t('nav_altar', lang)}">
                <span class="ritual-icon">${renderIcon('nav_altar')}</span>
                <span class="ritual-text">${candleLabel}</span>
              </div>
            ` : ''}
            ${soundLabel ? `
              <div class="ritual-badge badge-sound" title="${t('ui_audio', lang)}">
                <span class="ritual-icon">${renderIcon('ui_audio')}</span>
                <span class="ritual-text">${soundLabel}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="crystal-card ${isZen ? 'zen-reader-card' : ''}" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="max-width: 1040px; width: 98%; margin: 0 auto 24px; padding: 28px 24px; position: relative; border-radius: var(--radius-xl); box-shadow: 0 16px 50px rgba(0,0,0,0.7); box-sizing: border-box; flex-shrink: 0;">
        <button id="btn-close-reader" class="btn-modal-close" title="${t('dialog_cancel', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>

        <!-- Cabecera del Rezo -->
        <div style="margin-bottom: 14px; padding-${isLangRTL ? 'left' : 'right'}: 40px;">
          <h2 style="font-family: var(--font-sacred); font-size: 1.45rem; color: var(--text-primary); margin: 0 0 8px; line-height: 1.35;">${titleText}</h2>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <span class="hud-pill dot-gold" style="font-size: 0.75rem; font-weight: 700;">${this.formatLiturgicalRoot(prayer.idiomaLiturgicoOriginal, lang)}</span>
            <span class="hud-pill dot-green" style="font-size: 0.75rem; font-weight: 700;">${this.formatTraditionName(prayer.tradicion, lang)}</span>
            ${isZen ? `<span class="hud-pill dot-cyan" style="font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;"><span>${renderIcon('intent_paz')}</span><span>${t('zen_mode_label', lang)}</span></span>` : ''}
          </div>
        </div>

        <!-- Ritual Sugerido Glassmorphic de Ancho Completo -->
        ${ritualMetaHtml}

        <!-- Barra de Audio y Paisajes Sonoros Táctil Glassmorphic -->
        <div style="background: var(--glass-inset); padding: 14px 16px; border-radius: var(--radius-lg); margin-bottom: 24px; border: 1px solid var(--glass-border); box-sizing: border-box;">
          <!-- Selector Táctil Modal de Sonido (Cero Dropdowns Nativos) -->
          <div style="margin-bottom: 12px; width: 100%;">
            <button type="button" id="btn-open-reader-sound-picker" class="hud-sound-pill" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer; box-sizing: border-box; text-align: left; min-height: 48px; transition: all var(--transition-fast);">
              <span style="display: flex; align-items: center; gap: 10px; min-width: 0; overflow: hidden;">
                <span id="icon-reader-sound-pill" style="color: ${soundDef.color || 'var(--accent-cyan)'}; display: flex; align-items: center; flex-shrink: 0; width: 20px; height: 20px;">${renderIcon(soundDef.icon || 'ui_audio')}</span>
                <span id="label-reader-sound-pill" style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${soundDef.name}</span>
              </span>
              <span style="color: var(--accent-cyan); font-size: 0.75rem; flex-shrink: 0; padding-left: 8px; display: flex; align-items: center;">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </button>
          </div>

          <!-- Cuadrícula de 2 Columnas Táctiles -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; box-sizing: border-box;">
            <!-- Columna Izquierda: Botón Ambiente y Botón Audio (TTS) -->
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button id="btn-toggle-sound" class="btn-crystal" style="padding: 10px 14px; font-size: 0.84rem; font-weight: 700; min-height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-sizing: border-box; border-radius: var(--radius-md);">
                <span style="display: flex; align-items: center; color: var(--accent-cyan);">${renderIcon('ui_audio')}</span>
                <span id="label-ambient-btn">${t('sound_ambient_btn', lang) || 'Ambiente'}</span>
              </button>
              <button id="btn-read-tts" class="btn-crystal btn-crystal-primary" style="padding: 10px 14px; font-size: 0.84rem; font-weight: 800; min-height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-sizing: border-box; border-radius: var(--radius-md);">
                <span style="display: flex; align-items: center;">${renderIcon('ui_voice')}</span>
                <span>${t('sound_audio_btn', lang) || 'Audio'}</span>
              </button>
            </div>

            <!-- Columna Derecha: Selector de Velocidad y Botón Compartir -->
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; align-items: center; background: var(--glass-surface-1); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 0 10px; min-height: 44px; width: 100%; box-sizing: border-box;">
                <span style="display: flex; align-items: center; color: var(--text-muted); margin-right: 6px; flex-shrink: 0;">${renderIcon('ui_speed')}</span>
                <select id="select-tts-speed" class="sound-select" style="width: 100%; border: none; background: transparent; padding: 6px 2px; font-size: 0.82rem; font-weight: 700; color: var(--text-primary); cursor: pointer;" title="${t('speed_label', lang) || 'Velocidad'}">
                  <option value="0.7">0.7x ${t('speed_label', lang) || 'Velocidad'}</option>
                  <option value="0.85" selected>0.85x ${t('speed_label', lang) || 'Velocidad'}</option>
                  <option value="1.0">1.0x ${t('speed_label', lang) || 'Velocidad'}</option>
                  <option value="1.2">1.2x ${t('speed_label', lang) || 'Velocidad'}</option>
                </select>
              </div>
              <button id="btn-share-prayer-top" class="btn-crystal btn-crystal-gold" style="padding: 10px 14px; font-size: 0.84rem; font-weight: 800; min-height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-sizing: border-box; border-radius: var(--radius-md);" title="${t('share_prayer', lang) || 'Compartir'}">
                <span style="display: inline-flex; width: 16px; height: 16px;">${renderIcon('ui_share_nodes')}</span>
                <span>${t('share_prayer', lang) || 'Compartir'}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- MODO ESPEJO PARALELO DUAL -->
        <div class="mirror-panes-wrapper">
          <!-- Columna Izquierda: Sagrado Original + Fonética -->
          <div class="pane-sacred">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
              <span style="font-size: 0.76rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;">${t('root_label', lang) || 'Raíz Sagrada'}</span>
              <span class="hud-pill dot-gold" style="font-size: 0.72rem;">${this.formatLiturgicalRoot(prayer.idiomaLiturgicoOriginal, lang)}</span>
            </div>
            <div class="pane-content-original">${prayer.textoOriginal || ''}</div>

            ${prayer.guiaFonetica ? `
            <div class="pane-phonetic-guide">
              <div class="phonetic-label">${t('phonetics_label', lang) || 'Fonética'}</div>
              <div class="phonetic-text">${prayer.guiaFonetica}</div>
            </div>` : ''}
          </div>

          <!-- Columna Derecha: Traducción Canónica -->
          <div class="pane-translation">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
              <span style="font-size: 0.76rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.06em;">${translationHeaderLabel}</span>
              <span class="hud-pill dot-cyan" style="font-size: 0.72rem;">${lang.toUpperCase()}</span>
            </div>
            ${translationContentHtml}
          </div>
        </div>

        <!-- TARJETA CONSAGRADA DE COMPARTIR BENDICIÓN (VIRAL GROWTH ENGINE) -->
        <div id="card-blessing-share" class="blessing-share-card">
          <div class="blessing-share-header">
            <div class="blessing-medallion">
              <img src="logo.png?v=5.0" alt="FeUniversal" class="blessing-logo-img" />
            </div>
            <div class="blessing-text-wrapper">
              <h4 class="blessing-share-title">${t('share_blessing_title', lang) || 'Comparte esta Bendición Sagrada'}</h4>
              <p class="blessing-share-desc">${t('share_blessing_desc', lang) || '¿Conoces a alguien que necesite consuelo o protección hoy? Envíale esta plegaria con su enlace directo.'}</p>
            </div>
          </div>
          
          <div class="blessing-actions-row">
            <button id="btn-blessing-hero-share" class="btn-crystal btn-blessing-hero" data-platform="${heroPlatform.key}" style="background: ${heroPlatform.bg}; border-color: ${heroPlatform.border}; color: ${heroPlatform.color}; box-shadow: 0 0 16px ${heroPlatform.glow};">
              <span class="blessing-btn-icon">${renderIcon(heroPlatform.icon)}</span>
              <span class="blessing-btn-text">${(t(heroPlatform.actionKey, lang) || t('share_blessing_hero_' + heroPlatform.key, lang) || `Enviar por ${heroPlatform.name}`).replace(/_/g, ' ')}</span>
            </button>
            <button id="btn-blessing-more-options" class="btn-crystal btn-blessing-more">
              <span class="blessing-btn-icon" style="color: var(--accent-gold);">${renderIcon('ui_camera')}</span>
              <span class="blessing-btn-text">${t('share_card_hd_title', lang) || 'Estados HD / Más'}</span>
            </button>
          </div>
        </div>

        <!-- Barra Inferior de Acciones Rituales (Distribución Sagrada y Estética) -->
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; text-align: center;">
          
          <!-- Mensaje Zen / Respiración Consciente -->
          <div style="margin-bottom: 14px; font-size: 0.78rem; color: var(--text-muted); display: inline-flex; align-items: center; justify-content: center; letter-spacing: 0.02em; padding: 4px 14px; border-radius: var(--radius-full); background: var(--glass-surface-1); border: 1px solid var(--glass-border);">
            <span style="font-style: italic;">${t('breathe_deeply_prompt', lang) || 'Respira profundamente 3 veces antes de entonar.'}</span>
          </div>

          <!-- Descargo de Responsabilidad Médica (Google Play Health Policy) -->
          ${(prayer.categoriaIntencion === 'salud_sanacion' || prayer.categoriaIntencion === 'sanacion') ? `
          <div style="margin-bottom: 14px; padding: 10px 14px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--radius-md); font-size: 0.74rem; color: var(--text-muted); line-height: 1.45; display: flex; align-items: flex-start; gap: 8px;">
            <span style="color: var(--accent-cyan); font-size: 0.95rem; flex-shrink: 0;">ℹ️</span>
            <span>${t('health_disclaimer', lang)}</span>
          </div>` : ''}

          <!-- Botón Principal Hero Altar -->
          <button id="btn-open-altar-from-reader" class="btn-crystal btn-crystal-gold" style="width: 100%; max-width: 320px; margin: 0 auto 12px; padding: 12px 22px; font-size: 0.88rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 9px; border-radius: var(--radius-full); box-shadow: 0 0 24px rgba(245, 158, 11, 0.4); text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer; transition: all var(--transition-fast);">
            <span style="display: inline-flex; width: 18px; height: 18px;">${renderIcon('nav_altar')}</span>
            <span>${t('altar_light_candle', lang) || 'Encender Veladora'}</span>
          </button>

          <!-- Fila de Acciones Secundarias Simétricas -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; max-width: 360px; margin: 0 auto;">
            <button id="btn-count-from-reader" class="btn-crystal" style="flex: 1; min-width: 140px; font-size: 0.78rem; font-weight: 700; padding: 9px 14px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: var(--radius-full); background: var(--glass-surface-1); border: 1px solid var(--glass-border); cursor: pointer; transition: all var(--transition-fast);">
              <span style="display: inline-flex; width: 15px; height: 15px; color: var(--accent-gold);">${renderIcon('nav_beads')}</span>
              <span>${t('nav_beads', lang) || 'Contador'}</span>
            </button>
            <button id="btn-open-liturgical-report" class="btn-crystal" style="flex: 1; min-width: 140px; font-size: 0.76rem; color: var(--text-secondary); padding: 9px 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: var(--radius-full); background: var(--glass-surface-1); border: 1px solid var(--glass-border); cursor: pointer; transition: all var(--transition-fast);">
              <span style="display: inline-flex; width: 15px; height: 15px; color: var(--accent-cyan);">${renderIcon('ui_dove')}</span>
              <span>${t('suggest_correction', lang) || 'Sugerir Corrección'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const prayer = this.currentPrayer;
    const heroPlatform = getHeroMessagingPlatform(lang);

    const closeBtn = document.getElementById('btn-close-reader');
    const shareBtn = document.getElementById('btn-share-prayer-top');
    const reportBtn = document.getElementById('btn-open-liturgical-report');
    const soundPickerBtn = document.getElementById('btn-open-reader-sound-picker');
    const toggleSoundBtn = document.getElementById('btn-toggle-sound');
    const labelAmbientBtn = document.getElementById('label-ambient-btn');
    const ttsSpeedSelect = document.getElementById('select-tts-speed');
    const ttsBtn = document.getElementById('btn-read-tts');
    const altarBtn = document.getElementById('btn-open-altar-from-reader');
    const countBtn = document.getElementById('btn-count-from-reader');
    const blessingHeroBtn = document.getElementById('btn-blessing-hero-share');
    const blessingMoreBtn = document.getElementById('btn-blessing-more-options');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (this.currentPrayer) {
          this.socialShare.open(this.currentPrayer);
        }
      });
    }

    if (blessingHeroBtn) {
      blessingHeroBtn.addEventListener('click', () => {
        if (this.currentPrayer) {
          executePlatformShare(heroPlatform.key, this.currentPrayer, lang);
        }
      });
    }

    if (blessingMoreBtn) {
      blessingMoreBtn.addEventListener('click', () => {
        if (this.currentPrayer) {
          this.socialShare.open(this.currentPrayer);
        }
      });
    }

    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        if (this.currentPrayer) {
          this.reportModal.open(this.currentPrayer);
        }
      });
    }

    if (soundPickerBtn) {
      soundPickerBtn.addEventListener('click', () => {
        SacredSoundPicker.open({
          currentSound: this.currentSound,
          currentSoundId: this.currentSound,
          onSelect: (selectedId, selectedDef) => {
            const id = (typeof selectedId === 'object' && selectedId) ? selectedId.id : selectedId;
            const def = selectedDef || SacredSoundPicker.getSoundDef(id, lang);
            this.currentSound = id;

            const label = document.getElementById('label-reader-sound-pill');
            const icon = document.getElementById('icon-reader-sound-pill');
            if (label) label.innerText = def.name;
            if (icon) {
              icon.innerHTML = renderIcon(def.icon || 'ui_audio');
              icon.style.color = def.color || 'var(--accent-cyan)';
            }

            if (id !== 'silencio_profundo') {
              soundManager.playAmbient(id);
              isSoundOn = true;
              if (labelAmbientBtn) labelAmbientBtn.innerText = t('stop_sound', lang) || 'Pausar';
              if (toggleSoundBtn) toggleSoundBtn.classList.add('active-glow-cyan');
            } else {
              soundManager.stopAmbient();
              isSoundOn = false;
              if (labelAmbientBtn) labelAmbientBtn.innerText = t('sound_ambient_btn', lang) || 'Ambiente';
              if (toggleSoundBtn) toggleSoundBtn.classList.remove('active-glow-cyan');
            }
          }
        });
      });
    }

    let isSoundOn = false;
    if (toggleSoundBtn) {
      toggleSoundBtn.addEventListener('click', () => {
        if (!StorageService.isFeatureUnlocked('music')) {
          this.membership.open();
          return;
        }

        if (!isSoundOn) {
          const snd = (this.currentSound && this.currentSound !== 'silencio_profundo') ? this.currentSound : 'solfeggio_528';
          this.currentSound = snd;
          soundManager.playAmbient(snd);
          const soundDef = SacredSoundPicker.getSoundDef(snd, lang);
          const label = document.getElementById('label-reader-sound-pill');
          const icon = document.getElementById('icon-reader-sound-pill');
          if (label) label.innerText = soundDef.name;
          if (icon) {
            icon.innerHTML = renderIcon(soundDef.icon || 'ui_audio');
            icon.style.color = soundDef.color || 'var(--accent-cyan)';
          }

          if (labelAmbientBtn) labelAmbientBtn.innerText = t('stop_sound', lang) || 'Pausar';
          toggleSoundBtn.classList.add('active-glow-cyan');
          isSoundOn = true;
        } else {
          soundManager.stopAmbient();
          if (labelAmbientBtn) labelAmbientBtn.innerText = t('sound_ambient_btn', lang) || 'Ambiente';
          toggleSoundBtn.classList.remove('active-glow-cyan');
          isSoundOn = false;
        }
      });
    }

    if (ttsSpeedSelect) {
      ttsSpeedSelect.addEventListener('change', (e) => {
        soundManager.setTTSRate(e.target.value);
      });
    }

    const updateTTSButton = (state) => {
      if (!ttsBtn) return;
      if (state === 'playing') {
        ttsBtn.innerHTML = `${renderIcon('ui_pause')}<span>${t('stop_sound', lang) || 'Pausar'}</span>`;
        ttsBtn.classList.add('active-glow-cyan');
      } else if (state === 'paused') {
        ttsBtn.innerHTML = `${renderIcon('ui_play')}<span>${t('test_sound', lang) || 'Reanudar'}</span>`;
        ttsBtn.classList.remove('active-glow-cyan');
      } else if (state === 'ended') {
        ttsBtn.innerHTML = `${renderIcon('ui_voice')}<span>${t('sound_audio_btn', lang) || 'Audio'}</span>`;
        ttsBtn.classList.remove('active-glow-cyan');
        
        // Iluminación áurea de la tarjeta de bendición al concluir el audio
        const card = document.getElementById('card-blessing-share');
        if (card) {
          card.classList.add('blessing-card-aura');
          try {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (e) {}
        }
      } else {
        ttsBtn.innerHTML = `${renderIcon('ui_voice')}<span>${t('sound_audio_btn', lang) || 'Audio'}</span>`;
        ttsBtn.classList.remove('active-glow-cyan');
      }
    };

    if (ttsBtn && prayer) {
      ttsBtn.addEventListener('click', () => {
        const prayerText = prayer.textoTraducido || (prayer.traducciones && (prayer.traducciones[lang] || prayer.traducciones.es)) || prayer.textoEspanol || prayer.textoOriginal;
        soundManager.speakPrayer(prayerText, lang, updateTTSButton);
      });
    }

    if (altarBtn) {
      altarBtn.addEventListener('click', () => {
        this.close();
        const altarTab = document.querySelector('.bottom-nav-item[data-tab="altar"]');
        if (altarTab) altarTab.click();
      });
    }

    if (countBtn) {
      countBtn.addEventListener('click', () => {
        this.close();
        const beadsTab = document.querySelector('.bottom-nav-item[data-tab="beads"]');
        if (beadsTab) beadsTab.click();
      });
    }

    // Scroll listener para activar el aura suavemente si el devoto llega al final de la lectura
    if (this.container) {
      const handleScrollAura = () => {
        const scrollBottom = this.container.scrollTop + this.container.clientHeight;
        const scrollHeight = this.container.scrollHeight;
        if (scrollHeight > 0 && scrollBottom >= scrollHeight - 220) {
          const card = document.getElementById('card-blessing-share');
          if (card && !card.classList.contains('blessing-card-aura')) {
            card.classList.add('blessing-card-aura');
          }
        }
      };
      this.container.removeEventListener('scroll', this._lastScrollHandler);
      this._lastScrollHandler = handleScrollAura;
      this.container.addEventListener('scroll', handleScrollAura, { passive: true });
    }
  }
}
