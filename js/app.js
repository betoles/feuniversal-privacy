/**
 * FEUNIVERSAL - APP ORCHESTRATOR & DASHBOARD CONTROLLER
 * Unifica la arquitectura de datos, el HUD Glassmorphic y las funcionalidades interactivas.
 */

import { TRADITIONS, getTradition } from './data/traditions.js?v=9.3.0';
import { INTENTIONS, CANONICAL_INTENTIONS, EMOTIONAL_STATES, getCanonicalIntention } from './data/intentions.js?v=9.3.0';
import { PRAYERS_DB } from './data/prayers-db.js?v=9.3.0';
import { PrayerCorpusService } from './services/prayer-corpus-service.js?v=9.3.0';
import { StorageService } from './services/storage-service.js?v=9.3.0';
import { soundManager } from './services/sound-service.js?v=9.3.0';
import { renderIcon, renderLangBadge } from './components/icons.js?v=9.3.0';
import { t, isRTL } from './data/i18n.js?v=9.3.0';

import { OnboardingComponent } from './components/onboarding.js?v=9.3.0';
import { MirrorReaderComponent } from './components/mirror-reader.js?v=9.3.0';
import { AltarComponent } from './components/altar.js?v=9.3.0';
import { BeadCounterComponent } from './components/bead-counter.js?v=9.3.0';
import { VaultComponent } from './components/vault.js?v=9.3.0';
import { SpiritualCompassComponent } from './components/spiritual-compass.js?v=9.3.0';
import { SacredHabitComponent } from './components/sacred-habit.js?v=9.3.0';
import { SacredSoundPicker } from './components/sacred-sound-picker.js?v=9.3.0';
import { NovenaModalComponent } from './components/novena-modal.js?v=9.3.0';
import { NotificationModalComponent } from './components/notification-modal.js?v=9.3.0';
import { ScripturesViewComponent } from './components/scriptures-view.js?v=9.3.0';
import { MembershipComponent } from './components/membership.js?v=9.3.0';
import { LanguageModalComponent } from './components/language-modal.js?v=9.3.0';
import { SacredDialog } from './components/sacred-dialog.js?v=9.3.0';
import { PrivacyModalComponent } from './components/privacy-modal.js?v=9.3.0';


export class FeUniversalApp {
  constructor() {
    this.prefs = StorageService.getPreferences();
    this.mirrorReader = new MirrorReaderComponent();
    this.altar = new AltarComponent();
    this.beadCounter = new BeadCounterComponent();
    this.vault = new VaultComponent();
    this.novenasModal = new NovenaModalComponent();
    this.onboarding = new OnboardingComponent((newPrefs, isLangStepOnly) => this.handlePreferencesUpdated(newPrefs, isLangStepOnly));
    this.membership = new MembershipComponent();
    this.notificationModal = new NotificationModalComponent();
    this.scripturesView = new ScripturesViewComponent();
    this.languageModal = new LanguageModalComponent((newLang) => this.handleLanguageChanged(newLang));
    this.spiritualCompass = new SpiritualCompassComponent();
    this.sacredHabit = new SacredHabitComponent(
      () => {
        const altarTab = document.querySelector('.bottom-nav-item[data-tab="altar"]');
        if (altarTab) altarTab.click();
      },
      () => {
        this.spiritualCompass.open();
      },
      (prayer) => {
        if (prayer) {
          this.mirrorReader.open(prayer);
        } else {
          const prayers = this.getFilteredPrayers();
          if (prayers && prayers.length > 0) {
            this.mirrorReader.open(prayers[0]);
          }
        }
      }
    );

    this.currentFilterIntention = null;
    this.currentFilterEmotion = null;
    this.currentFilterTradition = null;
    this.searchQuery = '';
    this.activeSubview = 'hud'; // 'hud' | 'intentions' | 'prayers'
    this.catalogPageSize = 36;
    this.catalogCurrentPage = 1;
    this.debounceTimer = null;
    this.normCache = new Map();
  }

  init() {
    try { this.applyTheme(this.prefs.tema || 'dark'); } catch (e) { console.warn('Error applyTheme:', e); }
    try { this.initStaticIcons(); } catch (e) { console.warn('Error initStaticIcons:', e); }
    try { this.updateAllUITexts(this.prefs.idioma || 'es'); } catch (e) { console.warn('Error updateAllUITexts:', e); }
    try { this.renderHeader(); } catch (e) { console.warn('Error renderHeader:', e); }
    try { this.renderActiveTraditionsRibbon(); } catch (e) { console.warn('Error renderActiveTraditionsRibbon:', e); }
    try { this.renderNavigation(); } catch (e) { console.warn('Error renderNavigation:', e); }
    try { this.renderSegmentedControl(); } catch (e) { console.warn('Error renderSegmentedControl:', e); }
    try { this.renderDashboard(); } catch (e) { console.warn('Error renderDashboard:', e); }
    try { this.attachGlobalEvents(); } catch (e) { console.warn('Error attachGlobalEvents:', e); }
    try { this.initAndroidBackButtonHandler(); } catch (e) { console.warn('Error initAndroidBackButtonHandler:', e); }
    try { this.checkPayPalBillingReturn(); } catch (e) { console.warn('Error checkPayPalBillingReturn:', e); }

    if (!this.prefs.onboardingCompletado) {
      setTimeout(() => this.onboarding.open(1), 500);
    } else if (StorageService.shouldShowWeeklyPaywallReminder()) {
      setTimeout(() => this.membership.open(true), 1200);
    }
  }

  checkPayPalBillingReturn() {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const billing = urlParams.get('billing');
    const plan = urlParams.get('plan') || 'annual';

    if (billing === 'paypal_success') {
      StorageService.activateSubscription(plan);
      const lang = this.prefs.idioma || 'es';
      setTimeout(() => {
        SacredDialog.alert({
          title: t('membership_pass_activated_title', lang) || 'Bendición Activada con Éxito',
          message: t('membership_paypal_success_msg', lang) || 'Tu membresía a FeUniversal Santuario PRO ha sido confirmada vía PayPal. ¡Disfruta de acceso total e ilimitado!',
          icon: 'ui_check',
          buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
          type: 'gold'
        });
        const badge = document.getElementById('header-membership-badge');
        if (badge) {
          badge.innerHTML = `<span style="display: inline-flex; width: 13px; height: 13px; color: var(--accent-gold); vertical-align: middle; margin-right: 4px;">${renderIcon('ui_sparkles')}</span><span>PRO</span>`;
        }
      }, 600);

      // Limpiar URL
      try {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {}
    } else if (billing === 'paypal_offering_success') {
      const lang = this.prefs.idioma || 'es';
      setTimeout(() => {
        SacredDialog.alert({
          title: t('micro_offering_thanks_title', lang) || 'Micro-Ofrenda Litúrgica ($0.49 USD)',
          message: t('micro_offering_thanks_msg', lang) || '¡Muchas gracias por tu generosidad! Tu ofrenda apadrina la traducción de nuevas oraciones y preserva el santuario universal.',
          icon: 'ui_heart',
          buttonText: t('dialog_accept', lang) || t('accept_label', lang) || 'Aceptar',
          type: 'gold'
        });
      }, 600);

      try {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {}
    }
  }

  initAndroidBackButtonHandler() {
    if (typeof window === 'undefined' || !window.history) return;
    try {
      window.history.replaceState({ appRoot: true }, '');
    } catch (e) {}

    window.addEventListener('popstate', () => {
      const closed = this.closeActiveModal();
      if (closed) {
        // Mantener ancla en el historial para futuros toques atrás
        try {
          window.history.pushState({ appRoot: true }, '');
        } catch (e) {}
        return;
      }

      // 2. Si no hay modales abiertos, regresar a la pestaña de Explorar (Dashboard) si está en otra vista
      const activeTab = document.querySelector('.bottom-nav-item.active');
      const tabId = activeTab?.getAttribute('data-tab');
      if (tabId && tabId !== 'dashboard') {
        const exploreTab = document.querySelector('.bottom-nav-item[data-tab="dashboard"]');
        if (exploreTab) {
          exploreTab.click();
          try {
            window.history.pushState({ appRoot: true }, '');
          } catch (e) {}
        }
      }
    });
  }

  closeActiveModal() {
    // 1. Diálogos emergentes de SacredDialog
    const sacredDialog = document.getElementById('sacred-dialog-overlay');
    if (sacredDialog && sacredDialog.style.display !== 'none' && sacredDialog.style.display !== '') {
      sacredDialog.style.display = 'none';
      return true;
    }

    // 2. Lista completa de modales en orden de prioridad LIFO
    const modalHandlers = [
      { id: 'modal-privacy', close: () => { const el = document.getElementById('modal-privacy'); if (el) el.style.display = 'none'; } },
      { id: 'modal-translation-report', close: () => { const el = document.getElementById('modal-translation-report'); if (el) el.style.display = 'none'; } },
      { id: 'modal-social-share', close: () => { const el = document.getElementById('modal-social-share'); if (el) el.style.display = 'none'; } },
      { id: 'modal-sacred-sound-picker', close: () => { const el = document.getElementById('modal-sacred-sound-picker'); if (el) el.style.display = 'none'; } },
      { id: 'modal-sacred-scripture-picker', close: () => { const el = document.getElementById('modal-sacred-scripture-picker'); if (el) el.style.display = 'none'; } },
      { id: 'modal-sacred-time-picker', close: () => { const el = document.getElementById('modal-sacred-time-picker'); if (el) el.style.display = 'none'; } },
      { id: 'modal-faithgpt-provider-picker', close: () => { const el = document.getElementById('modal-faithgpt-provider-picker'); if (el) el.style.display = 'none'; } },
      { id: 'modal-faithgpt-tradition-picker', close: () => { const el = document.getElementById('modal-faithgpt-tradition-picker'); if (el) el.style.display = 'none'; } },
      { id: 'modal-ai-settings', close: () => { const el = document.getElementById('modal-ai-settings'); if (el) el.style.display = 'none'; } },
      { id: 'modal-gemini-model-picker', close: () => { const el = document.getElementById('modal-gemini-model-picker'); if (el) el.style.display = 'none'; } },
      { id: 'modal-new-candle', close: () => { const el = document.getElementById('modal-new-candle'); if (el) el.style.display = 'none'; } },
      { id: 'modal-novenas-interactive', close: () => { if (this.novenasModal) this.novenasModal.close(); else { const el = document.getElementById('modal-novenas-interactive'); if (el) el.style.display = 'none'; } } },
      { id: 'modal-compass', close: () => { if (this.spiritualCompass) this.spiritualCompass.close(); else { const el = document.getElementById('modal-compass'); if (el) el.style.display = 'none'; } } },
      { id: 'modal-sacred-habit', close: () => { if (this.sacredHabit) this.sacredHabit.close(); else { const el = document.getElementById('modal-sacred-habit'); if (el) el.style.display = 'none'; } } },
      { id: 'modal-membership', close: () => { if (this.membership) this.membership.close(); else { const el = document.getElementById('modal-membership'); if (el) el.style.display = 'none'; } } },
      { id: 'modal-notification-schedule', close: () => { const el = document.getElementById('modal-notification-schedule'); if (el) el.style.display = 'none'; } },
      { id: 'modal-language', close: () => { if (this.languageModal) this.languageModal.close(); else { const el = document.getElementById('modal-language'); if (el) el.style.display = 'none'; } } },
      { id: 'modal-reader', close: () => { if (this.mirrorReader) this.mirrorReader.close(); else { const el = document.getElementById('modal-reader'); if (el) el.style.display = 'none'; } } },
      { id: 'modal-onboarding', close: () => { if (this.onboarding) this.onboarding.close(); else { const el = document.getElementById('modal-onboarding'); if (el) el.style.display = 'none'; } } }
    ];

    for (const item of modalHandlers) {
      const el = document.getElementById(item.id);
      if (el && el.style.display !== 'none' && el.style.display !== '') {
        item.close();
        return true;
      }
    }

    return false;
  }


  updateAllUITexts(lang) {
    const safeLang = lang || this.prefs.idioma || 'es';
    document.documentElement.setAttribute('data-lang', safeLang);
    if (typeof isRTL === 'function' && isRTL(safeLang)) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }

    const setTxt = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    };

    // Buscador
    const searchInput = document.getElementById('input-prayer-search');
    if (searchInput) searchInput.placeholder = t('search_placeholder', safeLang);

    // Tagline de Marca
    const tagline = document.querySelector('.brand-tagline');
    if (tagline) tagline.innerText = t('tagline', safeLang);

    // Botones del Header
    setTxt('label-btn-novenas', t('header_novenas', safeLang));
    setTxt('label-btn-compass', t('header_compass', safeLang));
    setTxt('label-btn-habit', t('header_habit', safeLang));
    setTxt('label-btn-notif', t('header_schedules', safeLang));
    setTxt('label-btn-traditions', t('header_traditions', safeLang));

    // Barra Segmentada
    setTxt('label-seg-hud', t('seg_balance', safeLang));
    setTxt('label-seg-intentions', t('seg_intentions', safeLang));
    setTxt('label-seg-prayers', t('seg_catalog', safeLang));

    // Barra de Navegación Inferior
    setTxt('label-bnav-explore', t('nav_explore', safeLang));
    setTxt('label-bnav-scriptures', t('nav_scriptures', safeLang));
    setTxt('label-bnav-altar', t('nav_altar', safeLang));
    setTxt('label-bnav-beads', t('nav_beads', safeLang));
    setTxt('label-bnav-vault', t('nav_vault', safeLang));

    // Estados Emocionales y Slider de Enfoque
    setTxt('label-title-emotion', t('how_feel_today', safeLang));
    setTxt('label-focus-level', t('focus_level_label', safeLang));
    setTxt('label-need-shelter', t('need_shelter', safeLang));
    setTxt('label-full-peace', t('full_peace', safeLang));

    // Modo Zen y Sonidos
    setTxt('label-focus-mode-title', t('zen_mode_label', safeLang));
    setTxt('label-focus-mode-desc', t('focus_mode_desc', safeLang));
    setTxt('label-zen-sound-header', t('zen_sound_label', safeLang));
    // Atajos Rápidos 2x2
    setTxt('label-quick-shortcuts', t('shortcuts_header', safeLang));
    const btnProtTitle = document.querySelector('button[data-intent="proteccion"] .hud-pillar-title');
    if (btnProtTitle) btnProtTitle.innerText = t('shortcut_protection', safeLang);
    const btnProtDesc = document.querySelector('button[data-intent="proteccion"] .hud-pillar-desc');
    if (btnProtDesc) btnProtDesc.innerText = t('shortcut_protection_sub', safeLang);

    const btnGuidTitle = document.querySelector('button[data-intent="sabiduria_guia"] .hud-pillar-title');
    if (btnGuidTitle) btnGuidTitle.innerText = t('shortcut_guidance', safeLang);
    const btnGuidDesc = document.querySelector('button[data-intent="sabiduria_guia"] .hud-pillar-desc');
    if (btnGuidDesc) btnGuidDesc.innerText = t('shortcut_guidance_sub', safeLang);

    const btnStrTitle = document.querySelector('button[data-intent="fortaleza_fe"] .hud-pillar-title');
    if (btnStrTitle) btnStrTitle.innerText = t('shortcut_strength', safeLang);
    const btnStrDesc = document.querySelector('button[data-intent="fortaleza_fe"] .hud-pillar-desc');
    if (btnStrDesc) btnStrDesc.innerText = t('shortcut_strength_sub', safeLang);

    const btnAbundTitle = document.querySelector('button[data-intent="prosperidad_trabajo"] .hud-pillar-title');
    if (btnAbundTitle) btnAbundTitle.innerText = t('shortcut_abundance', safeLang);
    const btnAbundDesc = document.querySelector('button[data-intent="prosperidad_trabajo"] .hud-pillar-desc');
    if (btnAbundDesc) btnAbundDesc.innerText = t('shortcut_abundance_sub', safeLang);

    // Títulos de Secciones y Donut
    setTxt('label-compendium-title', t('active_prayers_compendium', safeLang));
    setTxt('label-donut-available', t('available_label', safeLang));
    setTxt('label-intentions-title', t('intentions_balance', safeLang));
  }

  initStaticIcons() {
    const setIcon = (id, iconKey) => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = renderIcon(iconKey);
        el.style.display = 'inline-flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
      }
    };

    setIcon('header-brand-icon', 'brand_logo');
    setIcon('icon-btn-novenas', 'ui_sparkles');
    setIcon('icon-btn-compass', 'ui_compass');
    setIcon('icon-btn-habit', 'ui_sunrise_sunset');
    setIcon('icon-btn-notif', 'ui_clock');
    setIcon('icon-btn-traditions', 'ui_settings');
    setIcon('icon-btn-lang', 'ui_globe');

    setIcon('icon-title-emotion', 'intent_paz');
    setIcon('icon-zen-sound-header', 'ui_audio');
    setIcon('icon-search-lens', 'ui_search');
    setIcon('icon-search-clear', 'ui_close');
    setIcon('icon-seg-hud', 'nav_explore');
    setIcon('icon-seg-intentions', 'ui_intentions');
    setIcon('icon-seg-prayers', 'ui_catalog');
    setIcon('bnav-icon-explore', 'nav_explore');
    setIcon('bnav-icon-scriptures', 'nav_scriptures');
    setIcon('bnav-icon-altar', 'nav_altar');
    setIcon('bnav-icon-beads', 'nav_beads');
    setIcon('bnav-icon-vault', 'nav_vault');

    const themeIcon = document.getElementById('icon-btn-theme');
    if (themeIcon) {
      themeIcon.innerHTML = this.prefs.tema === 'light' ? renderIcon('ui_sun') : renderIcon('ui_moon');
      themeIcon.style.display = 'inline-flex';
      themeIcon.style.alignItems = 'center';
      themeIcon.style.justifyContent = 'center';
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.prefs.tema = theme;
    StorageService.savePreferences(this.prefs);

    const themeIcon = document.getElementById('icon-btn-theme');
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'light' ? renderIcon('ui_sun') : renderIcon('ui_moon');
    }
  }

  handlePreferencesUpdated(newPrefs, isLangStepOnly = false) {
    this.prefs = StorageService.getPreferences();
    this.updateAllUITexts(this.prefs.idioma);
    this.renderHeader();
    this.renderActiveTraditionsRibbon();
    this.renderDashboard();

    // Sincronizar de inmediato todas las vistas secundarias
    if (this.altar && typeof this.altar.render === 'function') this.altar.render();
    if (this.scripturesView) {
      if (typeof this.scripturesView.syncWithUserTradition === 'function') {
        this.scripturesView.syncWithUserTradition(true);
      }
      if (typeof this.scripturesView.render === 'function') {
        this.scripturesView.render();
      }
    }
    if (this.vault && typeof this.vault.render === 'function') this.vault.render();
  }

  async handleLanguageChanged(newLang) {
    this.prefs = StorageService.getPreferences();
    this.prefs.idioma = newLang;
    StorageService.savePreferences(this.prefs);

    // Precargar corpus para el nuevo idioma de forma asíncrona
    try {
      await PrayerCorpusService.loadCorpus(newLang);
    } catch (e) {
      console.warn('[App] Error precargando corpus para:', newLang, e);
    }

    // 1. Textos globales y encabezados
    this.updateAllUITexts(newLang);
    this.renderHeader();
    this.renderActiveTraditionsRibbon();

    // 2. Re-renderizar catálogo y componentes con el nuevo idioma
    await this.renderDashboard();
    if (this.altar && typeof this.altar.render === 'function') this.altar.render();
    if (this.beadCounter && typeof this.beadCounter.render === 'function') this.beadCounter.render();
    if (this.scripturesView && typeof this.scripturesView.render === 'function') this.scripturesView.render();
    if (this.vault && typeof this.vault.render === 'function') this.vault.render();
    if (this.novenasModal && typeof this.novenasModal.render === 'function') this.novenasModal.render();
    if (this.spiritualCompass && typeof this.spiritualCompass.render === 'function') this.spiritualCompass.render();
    if (this.sacredHabit && typeof this.sacredHabit.render === 'function') this.sacredHabit.render();
    if (this.notificationModal && typeof this.notificationModal.render === 'function') this.notificationModal.render();
    if (this.membership && typeof this.membership.render === 'function') this.membership.render();
    if (this.privacyModal && typeof this.privacyModal.render === 'function') this.privacyModal.render();

    // 3. Si el lector de oración está abierto, actualizarlo en vivo
    if (this.mirrorReader && this.mirrorReader.container && this.mirrorReader.container.style.display !== 'none' && this.mirrorReader.currentPrayer) {
      const updatedPrayer = await PrayerCorpusService.getPrayerById(this.mirrorReader.currentPrayer.id, newLang);
      if (updatedPrayer) {
        this.mirrorReader.currentPrayer = updatedPrayer;
      }
      this.mirrorReader.render();
    }

    SacredDialog.toast(`✨ Idioma: ${newLang.toUpperCase()}`);
  }

  renderHeader() {
    // 1. Iconos del Header
    const brandIcon = document.getElementById('header-brand-icon');
    if (brandIcon) {
      brandIcon.innerHTML = renderIcon('brand_logo');
    }

    const notifIcon = document.getElementById('icon-btn-notif');
    if (notifIcon) {
      notifIcon.innerHTML = renderIcon('ui_clock');
    }

    const tradIcon = document.getElementById('icon-btn-traditions');
    if (tradIcon) {
      tradIcon.innerHTML = renderIcon('ui_settings');
    }

    const langIcon = document.getElementById('icon-btn-lang');
    if (langIcon) {
      langIcon.innerHTML = renderIcon('ui_globe');
    }

    const themeIcon = document.getElementById('icon-btn-theme');
    if (themeIcon) {
      themeIcon.innerHTML = this.prefs.tema === 'light' ? renderIcon('ui_sun') : renderIcon('ui_moon');
    }

    // 2. Badge de Membresía / Trial
    const sub = StorageService.getSubscription();
    const daysLeft = StorageService.getTrialDaysRemaining();
    const badge = document.getElementById('header-membership-badge');
    if (badge) {
      const sparkIcon = `<span style="display: inline-flex; width: 13px; height: 13px; color: var(--accent-gold); vertical-align: middle; margin-right: 4px;">${renderIcon('ui_sparkles')}</span>`;
      badge.innerHTML = sub.isPremium ? `${sparkIcon}<span>PRO</span>` : `${sparkIcon}<span>Trial: ${daysLeft}d</span>`;
    }

    // 3. Etiqueta de Idioma Activo y Botones de Acción
    const lang = this.prefs.idioma || 'es';
    const notifBtnText = document.getElementById('label-btn-notif');
    if (notifBtnText) notifBtnText.innerText = t('header_schedules', lang);

    const tradBtnText = document.getElementById('label-btn-traditions');
    if (tradBtnText) tradBtnText.innerText = t('header_traditions', lang);

    const langLabel = document.getElementById('label-lang-active');
    if (langLabel) {
      const flags = { es: '🇲🇽', en: '🇺🇸', fr: '🇫🇷', pt: '🇧🇷', it: '🇮🇹', de: '🇩🇪', ru: '🇷🇺', ar: '🇸🇦', he: '🇮🇱', hi: '🇮🇳', zh: '🇨🇳', la: '🏛️', ja: '🇯🇵', bn: '🇧🇩', id: '🇮🇩', ur: '🇵🇰', sw: '🌍' };
      const flag = flags[lang] || '🌐';
      langLabel.innerText = `${flag} ${lang.toUpperCase()}`;
    }
    
    // 4. Soporte RTL Universal (Árabe, Hebreo, Urdu, Farsi)
    document.documentElement.setAttribute('data-lang', lang);
    if (typeof isRTL === 'function' && isRTL(lang)) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }
  }

  renderActiveTraditionsRibbon() {
    const ribbon = document.getElementById('active-traditions-ribbon');
    if (!ribbon) return;

    this.prefs = StorageService.getPreferences();
    const lang = this.prefs.idioma || 'es';
    const activeTraditions = (Array.isArray(this.prefs.tradicionesActivas) && this.prefs.tradicionesActivas.length > 0)
      ? this.prefs.tradicionesActivas
      : ['catolicismo', 'santeria_yoruba', 'budismo', 'pentecostal', 'hebreo_salmos', 'mormonismo', 'ortodoxia', 'vedica'];

    ribbon.innerHTML = activeTraditions.map(id => {
      const t = TRADITIONS[id];
      if (!t) return '';
      return `
        <div class="tradition-chip" data-trad-id="${t.id}" title="${t.nombre[lang] || t.nombre.es}" style="cursor: pointer;">
          <span class="tradition-chip-icon" style="display: flex; align-items: center; color: ${t.colorAcento};">${renderIcon(t.iconKey)}</span>
          <span class="tradition-chip-label">${t.nombre[lang] || t.nombre.es}</span>
        </div>
      `;
    }).join('') + `
      <div class="tradition-chip tradition-chip-add" id="btn-ribbon-add" title="${t('ribbon_adjust', lang) || 'Ajustar'}" style="border-style: dashed !important; color: var(--text-muted) !important; cursor: pointer !important; display: inline-flex !important; align-items: center !important; gap: 6px !important; width: auto !important; min-width: max-content !important; max-width: none !important; white-space: nowrap !important; padding: 6px 14px !important; flex-shrink: 0 !important;">
        <span class="tradition-chip-icon" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; width: 14px !important; height: 14px !important; min-width: 14px !important; max-width: 14px !important; flex-shrink: 0 !important;">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="width: 13px !important; height: 13px !important; min-width: 13px !important;">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
        <span class="tradition-chip-label" style="display: inline-block !important; width: auto !important; max-width: none !important; min-width: 0 !important; overflow: visible !important; white-space: nowrap !important; font-size: 0.8rem !important; font-weight: 700 !important; line-height: 1 !important;">${(t('ribbon_adjust', lang) || 'Ajustar').replace(/^\+\s*/, '')}</span>
      </div>
    `;

    const addBtn = document.getElementById('btn-ribbon-add');
    if (addBtn) addBtn.addEventListener('click', () => this.onboarding.open(2));

    // Conectar clicks en los chips para filtrar de inmediato
    ribbon.querySelectorAll('.tradition-chip[data-trad-id]').forEach(chip => {
      chip.addEventListener('click', () => {
        const tradId = chip.getAttribute('data-trad-id');
        this.currentFilterTradition = tradId;
        this.currentFilterEmotion = null;
        this.currentFilterIntention = null;
        this.catalogCurrentPage = 1;
        this.switchSubview('prayers');
        this.renderDashboard();
        const catalogEl = document.getElementById('prayers-results-list');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  renderNavigation() {
    const navItems = document.querySelectorAll('.hud-bottom-bar .bottom-nav-item');
    navItems.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        // Liberar TTS y cerrar modales activos al cambiar de pestaña
        this.closeActiveModal();
        soundManager.stopTTS();

        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const tabId = item.getAttribute('data-tab');
        document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active-view'));

        const targetView = document.getElementById(`view-${tabId}`);
        if (targetView) targetView.classList.add('active-view');

        if (tabId === 'dashboard') this.renderDashboard();
        if (tabId === 'scriptures') {
          this.scripturesView.container = document.getElementById('view-scriptures');
          this.scripturesView.render();
        }
        if (tabId === 'altar') {
          this.altar.container = document.getElementById('view-altar');
          this.altar.render();
        }
        if (tabId === 'beads') {
          this.beadCounter.container = document.getElementById('view-beads');
          this.beadCounter.render();
        }
        if (tabId === 'vault') {
          this.vault.container = document.getElementById('view-vault');
          this.vault.render();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  }

  renderSegmentedControl() {
    const segButtons = document.querySelectorAll('#view-dashboard .crystal-segmented-control .segmented-item[data-subview]');
    segButtons.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const subview = btn.getAttribute('data-subview');
        this.switchSubview(subview);
      };
    });
  }

  switchSubview(subview) {
    if (!subview) return;
    this.activeSubview = subview;

    const segButtons = document.querySelectorAll('#view-dashboard .crystal-segmented-control .segmented-item[data-subview]');
    segButtons.forEach(b => {
      if (b.getAttribute('data-subview') === subview) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    document.querySelectorAll('#view-dashboard .segmented-subview').forEach(sv => sv.classList.remove('active-subview'));
    const targetSubview = document.getElementById(`seg-view-${subview}`);
    if (targetSubview) targetSubview.classList.add('active-subview');
  }

  async renderDashboard() {
    const lang = this.prefs.idioma || 'es';
    const scoreData = StorageService.getSpiritualScore();

    // Filtrar oraciones por tradiciones activas usando el Corpus cargado dinámicamente
    const activeTraditions = (Array.isArray(this.prefs.tradicionesActivas) && this.prefs.tradicionesActivas.length > 0)
      ? this.prefs.tradicionesActivas
      : ['catolicismo', 'santeria_yoruba', 'budismo', 'pentecostal', 'hebreo_salmos', 'mormonismo', 'ortodoxia', 'vedica', 'islam', 'adventista', 'espiritismo', 'universal'];
    
    let corpus = PrayerCorpusService.memoryCache.get(lang);
    if (!corpus || corpus.length === 0) {
      try {
        corpus = await PrayerCorpusService.loadCorpus(lang);
      } catch (e) {
        corpus = PRAYERS_DB;
      }
    }
    const rawList = (Array.isArray(corpus) && corpus.length > 0) ? corpus : PRAYERS_DB;
    const availablePrayers = rawList.filter(p => activeTraditions.includes(p.tradicion) || p.tradicion === 'universal');

    // 0. Actualizar Textos UI según el idioma
    const searchInput = document.getElementById('input-prayer-search');
    if (searchInput) searchInput.placeholder = t('search_placeholder', lang);

    const segHud = document.querySelector('.segmented-item[data-subview="hud"] span:last-child');
    if (segHud) segHud.innerText = t('seg_balance', lang);
    const segInt = document.querySelector('.segmented-item[data-subview="intentions"] span:last-child');
    if (segInt) segInt.innerText = t('seg_intentions', lang);
    const segPray = document.querySelector('.segmented-item[data-subview="prayers"] span:last-child');
    if (segPray) segPray.innerText = t('seg_catalog', lang);

    // Bottom Navigation
    const navExp = document.querySelector('.bottom-nav-item[data-tab="dashboard"] span:last-child');
    if (navExp) navExp.innerText = t('nav_explore', lang);
    const navScr = document.querySelector('.bottom-nav-item[data-tab="scriptures"] span:last-child');
    if (navScr) navScr.innerText = t('nav_scriptures', lang);
    const navAlt = document.querySelector('.bottom-nav-item[data-tab="altar"] span:last-child');
    if (navAlt) navAlt.innerText = t('nav_altar', lang);
    const navBead = document.querySelector('.bottom-nav-item[data-tab="beads"] span:last-child');
    if (navBead) navBead.innerText = t('nav_beads', lang);
    const navVlt = document.querySelector('.bottom-nav-item[data-tab="vault"] span:last-child');
    if (navVlt) navVlt.innerText = t('nav_vault', lang);

    // Atajos Rápidos de Auxilio 2x2
    const lblQuick = document.getElementById('label-quick-shortcuts');
    if (lblQuick) lblQuick.innerText = t('shortcuts_header', lang);

    const btnProtTitle = document.querySelector('button[data-intent="proteccion"] .hud-pillar-title');
    if (btnProtTitle) btnProtTitle.innerText = t('shortcut_protection', lang);
    const btnProtDesc = document.querySelector('button[data-intent="proteccion"] .hud-pillar-desc');
    if (btnProtDesc) btnProtDesc.innerText = t('shortcut_protection_sub', lang);

    const btnGuidTitle = document.querySelector('button[data-intent="sabiduria_guia"] .hud-pillar-title');
    if (btnGuidTitle) btnGuidTitle.innerText = t('shortcut_guidance', lang);
    const btnGuidDesc = document.querySelector('button[data-intent="sabiduria_guia"] .hud-pillar-desc');
    if (btnGuidDesc) btnGuidDesc.innerText = t('shortcut_guidance_sub', lang);

    const btnStrTitle = document.querySelector('button[data-intent="fortaleza_fe"] .hud-pillar-title');
    if (btnStrTitle) btnStrTitle.innerText = t('shortcut_strength', lang);
    const btnStrDesc = document.querySelector('button[data-intent="fortaleza_fe"] .hud-pillar-desc');
    if (btnStrDesc) btnStrDesc.innerText = t('shortcut_strength_sub', lang);

    const btnAbundTitle = document.querySelector('button[data-intent="prosperidad_trabajo"] .hud-pillar-title');
    if (btnAbundTitle) btnAbundTitle.innerText = t('shortcut_abundance', lang);
    const btnAbundDesc = document.querySelector('button[data-intent="prosperidad_trabajo"] .hud-pillar-desc');
    if (btnAbundDesc) btnAbundDesc.innerText = t('shortcut_abundance_sub', lang);

    // Conectar eventos click en los Atajos Rápidos de Auxilio 2x2
    document.querySelectorAll('.hud-pillar-btn[data-intent]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const intentId = btn.getAttribute('data-intent');
        if (intentId) {
          this.currentFilterIntention = intentId;
          this.currentFilterEmotion = null;
          this.catalogCurrentPage = 1;
          this.switchSubview('prayers');
          this.renderDashboard();
          const catalogEl = document.getElementById('prayers-results-list');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };
    });

    // Donut y Compendio
    const lblCompTitle = document.getElementById('label-compendium-title');
    if (lblCompTitle) lblCompTitle.innerText = t('active_prayers_compendium', lang);

    const lblDonutAvail = document.getElementById('label-donut-available');
    if (lblDonutAvail) lblDonutAvail.innerText = t('available_label', lang);

    const lblIntentsTitle = document.getElementById('label-intentions-title');
    if (lblIntentsTitle) lblIntentsTitle.innerText = t('intentions_balance', lang);

    const lblNeedShelter = document.getElementById('label-need-shelter');
    if (lblNeedShelter) lblNeedShelter.innerText = t('need_shelter', lang);

    const lblFullPeace = document.getElementById('label-full-peace');
    if (lblFullPeace) lblFullPeace.innerText = t('full_peace', lang);

    const lblFocusModeTitle = document.getElementById('label-focus-mode-title');
    if (lblFocusModeTitle) lblFocusModeTitle.innerText = t('zen_mode_label', lang);

    const lblZenHeader = document.getElementById('label-zen-sound-header');
    if (lblZenHeader) lblZenHeader.innerText = t('zen_sound_label', lang);

    const previewBtn = document.getElementById('btn-preview-zen-sound');
    if (previewBtn && !soundManager.isPlaying) {
      previewBtn.innerHTML = `${renderIcon('ui_play')}<span>${t('test_sound', lang)}</span>`;
    }

    // 1. Métrica HUD y Marcador Pin
    const userScore = scoreData.score || 0;
    const oracionesCompletadas = scoreData.oracionesCompletadas || 0;
    const scoreNumEl = document.getElementById('hud-main-score-num');
    if (scoreNumEl) {
      scoreNumEl.innerText = userScore;
      const compWord = oracionesCompletadas === 1 ? (t('prayer_singular', lang) || 'oración') : (t('prayer_plural', lang) || 'oraciones');
      scoreNumEl.title = `${oracionesCompletadas} ${compWord}`;
    }

    const markerPin = document.getElementById('hud-user-pin');
    if (markerPin) {
      markerPin.style.left = `calc(8px + (100% - 16px) * (${userScore} / 100))`;
      const badge = markerPin.querySelector('.hud-marker-badge');
      if (badge) badge.innerText = `${t('faith_level', lang)}: ${userScore} / 100`;

      // Flip badge direction near edges so it never overflows
      markerPin.classList.remove('near-left', 'near-right');
      if (userScore <= 15) {
        markerPin.classList.add('near-left');
      } else if (userScore >= 85) {
        markerPin.classList.add('near-right');
      }
    }

    // 2. Gráfico Donut de Oraciones y Compendio Sagrado Universal (4,245 oraciones)
    const totalUniversalCompendium = 4245;
    const activeTraditionsCompendium = availablePrayers.length > 0 
      ? availablePrayers.length 
      : activeTraditions.reduce((sum, tid) => sum + (getTradition(tid)?.totalRezosDisponibles || 0), 0);

    const donutTotal = document.getElementById('hud-donut-total-num');
    if (donutTotal) donutTotal.innerText = activeTraditionsCompendium.toLocaleString('es-ES');

    const donutValCircle = document.querySelector('.hud-donut-circle-val');
    if (donutValCircle) {
      const perimeter = 2 * Math.PI * 60; // 377px
      const pct = Math.min(1, activeTraditionsCompendium / totalUniversalCompendium);
      const dash = Math.max(30, Math.round(perimeter * pct));
      donutValCircle.setAttribute('stroke-dasharray', `${dash}, ${Math.round(perimeter)}`);
    }

    // 3. Barra de Categorías HUD
    const catContainer = document.getElementById('hud-categories-bars');
    if (catContainer) {
      const topIntents = Object.values(INTENTIONS).slice(0, 4);
      const userFreq = scoreData.categoriaFrecuencia || {};
      const totalUserPrayers = topIntents.reduce((sum, intent) => sum + (userFreq[intent.id] || 0), 0);
      const defaultPcts = [35, 25, 20, 20]; // Distribución de balance universal inicial

      const rowsHTML = topIntents.map((intent, idx) => {
        const count = userFreq[intent.id] || 0;
        const pct = totalUserPrayers > 0 
          ? Math.round((count / totalUserPrayers) * 100) 
          : defaultPcts[idx] || 25;
        const fillWidth = Math.max(8, pct);
        const prayerUnit = count === 1 ? (t('prayer_singular', lang) || 'oración') : (t('prayer_plural', lang) || 'oraciones');
        const metricLabel = `${count} ${prayerUnit}`;

        return `
          <div class="hud-category-row">
            <div class="hud-category-header">
              <span class="hud-category-label">
                <span style="display: flex; align-items: center; color: ${intent.colorAcento}; width: 18px; height: 18px;">${renderIcon(intent.iconKey)}</span>
                <span>${intent.nombre[lang] || intent.nombre.es}</span>
              </span>
              <span class="hud-category-metric">${metricLabel} (${pct}%)</span>
            </div>
            <div class="hud-category-bar-wrapper">
              <div class="hud-category-bar-fill" style="width: ${fillWidth}%; background: linear-gradient(90deg, ${intent.colorAcento}, ${intent.colorAcento}99);"></div>
            </div>
          </div>
        `;
      }).join('');

      catContainer.innerHTML = rowsHTML;
    }

    // 4. Buscador Emocional ("¿Cómo te sientes hoy?")
    const emotionalRow = document.getElementById('emotional-chips-row');
    if (emotionalRow) {
      const emoList = Array.isArray(EMOTIONAL_STATES) ? EMOTIONAL_STATES : Object.values(EMOTIONAL_STATES);
      emotionalRow.innerHTML = emoList.map(emo => {
        const lbl = emo.etiqueta ? (emo.etiqueta[lang] || emo.etiqueta.es) : (emo.label?.[lang] || emo.label?.es || emo.id);
        const isSelected = this.currentFilterEmotion === emo.id;
        const iconColor = emo.colorAcento || 'var(--accent-cyan)';
        return `
          <button class="emotional-chip ${isSelected ? 'selected' : ''}" data-emotion-id="${emo.id}" style="${isSelected ? `border-color: ${iconColor}; box-shadow: 0 0 14px ${iconColor}66;` : ''}">
            <span style="display: flex; align-items: center; color: ${iconColor};">${renderIcon(emo.iconKey || 'intent_paz')}</span>
            <span>${lbl}</span>
          </button>
        `;
      }).join('');

      emotionalRow.querySelectorAll('.emotional-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const emoId = btn.getAttribute('data-emotion-id');
          if (this.currentFilterEmotion === emoId) {
            this.currentFilterEmotion = null;
            this.currentFilterIntention = null;
          } else {
            this.currentFilterEmotion = emoId;
            this.currentFilterIntention = null;
            this.catalogCurrentPage = 1;
            this.switchSubview('prayers');
          }
          this.renderDashboard();
        });
      });
    }

    // 5. Matriz de Intenciones Universales (Grid Compacto 2x2 en mobile)
    const intentionsGrid = document.getElementById('intentions-matrix-grid');
    if (intentionsGrid) {
      intentionsGrid.innerHTML = CANONICAL_INTENTIONS.map(intent => {
        const count = availablePrayers.filter(p => getCanonicalIntention(p.categoriaIntencion, p.id) === intent.id).length;
        const isSelected = this.currentFilterIntention === intent.id;
        return `
          <div class="crystal-card intention-card-compact ${isSelected ? 'active-glow-gold' : ''}" data-intent-id="${intent.id}">
            <div class="intention-card-compact-header">
              <div style="color: ${intent.colorAcento};">${renderIcon(intent.iconKey)}</div>
              <span class="hud-pill dot-gold">${count}</span>
            </div>
            <div>
              <div class="intention-card-compact-title">${intent.nombre[lang] || intent.nombre.es}</div>
              <div class="intention-card-compact-desc">${intent.descripcion[lang] || intent.descripcion.es}</div>
            </div>
          </div>
        `;
      }).join('');

      intentionsGrid.querySelectorAll('.intention-card-compact').forEach(card => {
        card.addEventListener('click', () => {
          const intentId = card.getAttribute('data-intent-id');
          if (this.currentFilterIntention === intentId) {
            this.currentFilterIntention = null;
          } else {
            this.currentFilterIntention = intentId;
            this.currentFilterEmotion = null;
            this.catalogCurrentPage = 1;
            this.switchSubview('prayers');
          }
          this.renderDashboard();
        });
      });
    }

    // 6. Catálogo de Oraciones con Búsqueda en Tiempo Real y Paginación Infinita Optimizada
    this.renderCatalogView(availablePrayers, lang);
  }

  getFilteredPrayers(availablePrayers, lang) {
    let filtered = availablePrayers;

    // Filtro por Estado Emocional (Fluido y amplio)
    if (this.currentFilterEmotion) {
      const emoData = EMOTIONAL_STATES[this.currentFilterEmotion];
      const targetIntent = emoData?.intencionPrincipal;
      filtered = filtered.filter(p => {
        if (Array.isArray(p.estadosEmocionales) && p.estadosEmocionales.includes(this.currentFilterEmotion)) {
          return true;
        }
        if (targetIntent && getCanonicalIntention(p.categoriaIntencion, p.id) === targetIntent) {
          return true;
        }
        return false;
      });
    }

    // Filtro por Intención
    if (this.currentFilterIntention) {
      filtered = filtered.filter(p => getCanonicalIntention(p.categoriaIntencion, p.id) === this.currentFilterIntention);
    }

    // Filtro por Tradición específica
    if (this.currentFilterTradition) {
      filtered = filtered.filter(p => p.tradicion === this.currentFilterTradition);
    }

    // Filtro por Búsqueda de Texto Instantánea (Normalizada sin acentos)
    const hasSearch = this.searchQuery && this.searchQuery.trim().length > 0;
    if (hasSearch) {
      const q = this.normalizeStr(this.searchQuery.trim());
      filtered = filtered.filter(p => {
        const titleLang = typeof p.titulo === 'string' ? this.normalizeStr(p.titulo) : this.normalizeStr(p.titulo?.[lang] || p.titulo?.es || '');
        const titleOrig = this.normalizeStr(p.titulo?.lat || p.titulo?.he || p.titulo?.sa || p.titulo?.yo || p.titulo?.ar || p.titulo?.el || '');
        const textOrig = this.normalizeStr(p.textoOriginal || '');
        const tradText = this.normalizeStr(p.textoTraducido || p.traducciones?.[lang] || p.traducciones?.es || p.textoEspanol || '');
        const tradInfo = getTradition(p.tradicion);
        const tradName = this.normalizeStr(tradInfo ? (tradInfo.nombre?.[lang] || tradInfo.nombre?.es || '') : '');

        return titleLang.includes(q) ||
               titleOrig.includes(q) ||
               textOrig.includes(q) ||
               tradText.includes(q) ||
               tradName.includes(q);
      });
    }

    return filtered;
  }

  normalizeStr(str) {
    if (!str) return '';
    const key = String(str);
    if (this.normCache.has(key)) return this.normCache.get(key);

    const norm = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    // Limitar tamaño de caché para prevenir acumulación excesiva
    if (this.normCache.size > 5000) this.normCache.clear();
    this.normCache.set(key, norm);
    return norm;
  }

  renderPrayerCardHtml(p, lang) {
    const currentLang = lang || this.prefs.idioma || 'es';
    const tData = getTradition(p.tradicion);
    const title = typeof p.titulo === 'string' ? p.titulo : ((p.titulo && (p.titulo[currentLang] || p.titulo.es)) || 'Oración');
    const trad = p.textoTraducido || (p.traducciones && (p.traducciones[currentLang] || p.traducciones.es)) || p.textoEspanol || p.textoOriginal || '';
    const tradName = (tData && tData.nombre && (tData.nombre[currentLang] || tData.nombre.es)) || '';
    const tradColor = tData ? tData.colorAcento : '#d4af37';
    const iconSvg = tData ? renderIcon(tData.iconKey) : '';

    return `
      <div class="crystal-card prayer-item-card" data-prayer-id="${p.id}">
        <!-- Fila Superior de Metadatos (Tradición e Idioma Raíz) -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 8px; min-width: 0;">
          <span class="hud-pill dot-gold" style="font-size: 0.72rem; max-width: calc(100% - 85px); display: inline-flex; align-items: center; gap: 5px; min-width: 0;">
            <span style="color: ${tradColor}; display: flex; align-items: center; flex-shrink: 0;">${iconSvg}</span>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tradName}</span>
          </span>
          <span class="hud-pill dot-cyan" style="font-size: 0.68rem; flex-shrink: 0; white-space: nowrap;">
            ${p.idiomaLiturgicoOriginal || 'Litúrgico'}
          </span>
        </div>

        <!-- Título de la Oración -->
        <div style="font-weight: 800; font-size: 0.98rem; color: var(--text-primary); line-height: 1.3; margin-bottom: 8px; word-break: break-word;">
          ${title}
        </div>

        <!-- Extracto de la Oración -->
        <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 12px; max-height: 48px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; word-break: break-word;">
          «${trad}»
        </div>

        <!-- Acción Inferior -->
        <div style="display: flex; justify-content: flex-end; align-items: center;">
          <span style="font-weight: 700; font-size: 0.78rem; color: var(--accent-gold); display: inline-flex; align-items: center; gap: 4px;">
            ${t('open_mirror', currentLang)}
          </span>
        </div>
      </div>
    `;
  }

  renderCatalogView(availablePrayers, lang) {
    const prayersListContainer = document.getElementById('prayers-results-list');
    if (!prayersListContainer) return;

    // Desconectar observer previo si existe
    if (this.catalogObserver) {
      this.catalogObserver.disconnect();
      this.catalogObserver = null;
    }

    const filtered = this.getFilteredPrayers(availablePrayers, lang);
    const hasSearch = this.searchQuery && this.searchQuery.trim().length > 0;

    if (filtered.length === 0) {
      prayersListContainer.innerHTML = `
        <div class="crystal-card" style="padding: 28px 20px; text-align: center; color: var(--text-secondary); width: 100%; grid-column: 1/-1;">
          <div style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">${t('catalog_no_prayers', lang)}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">${t('catalog_no_prayers_sub', lang)}</div>
          <button id="btn-empty-reset-search" class="btn-crystal btn-crystal-gold" style="padding: 6px 18px; font-size: 0.76rem;">
            <span>${t('catalog_show_all', lang)}</span>
          </button>
        </div>
      `;
      const emptyResetBtn = document.getElementById('btn-empty-reset-search');
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', () => {
          this.resetSearch();
        });
      }
      return;
    }

    const totalFiltered = filtered.length;
    const initialItems = filtered.slice(0, this.catalogCurrentPage * this.catalogPageSize);

    let filterBadgeHtml = '';
    if (this.currentFilterEmotion) {
      const emoData = EMOTIONAL_STATES[this.currentFilterEmotion];
      const emoName = emoData ? (emoData.etiqueta[lang] || emoData.etiqueta.es) : this.currentFilterEmotion;
      const emoColor = emoData?.colorAcento || 'var(--accent-cyan)';
      const countWord = totalFiltered === 1 ? t('prayer_singular', lang) : t('prayer_plural', lang);
      filterBadgeHtml = `
        <div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--glass-surface-2); border-radius: var(--radius-md); border: 1px solid ${emoColor}; margin-bottom: 10px; box-shadow: 0 0 14px ${emoColor}33;">
          <span style="font-size: 0.82rem; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <span style="color: ${emoColor}; display: inline-flex; align-items: center;">${renderIcon(emoData?.iconKey || 'intent_paz')}</span>
            <span>${t('state_filter_prefix', lang)}: <strong>${emoName}</strong> · <strong>${totalFiltered}</strong> ${countWord}</span>
          </span>
          <button id="btn-clear-active-filter" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; font-size: 0.74rem; padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; font-weight: 700;">✕ ${t('remove_filter_btn', lang) || 'Quitar Filtro'}</button>
        </div>
      `;
    } else if (this.currentFilterIntention) {
      const intentData = INTENTIONS[this.currentFilterIntention];
      const intentName = intentData ? (intentData.nombre[lang] || intentData.nombre.es) : this.currentFilterIntention;
      const intentColor = intentData?.colorAcento || 'var(--accent-gold)';
      const countWord = totalFiltered === 1 ? t('prayer_singular', lang) : t('prayer_plural', lang);
      const isHealthCat = this.currentFilterIntention === 'salud_sanacion' || this.currentFilterIntention === 'sanacion';
      const healthDisclaimerHtml = isHealthCat ? `
        <div style="width: 100%; margin-top: 8px; padding: 8px 12px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px; font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; display: flex; align-items: flex-start; gap: 8px;">
          <span style="color: var(--accent-cyan); font-size: 0.85rem; flex-shrink: 0;">ℹ️</span>
          <span>${t('health_disclaimer', lang)}</span>
        </div>
      ` : '';

      filterBadgeHtml = `
        <div style="grid-column: 1/-1; display: flex; flex-direction: column; padding: 10px 14px; background: var(--glass-surface-2); border-radius: var(--radius-md); border: 1px solid ${intentColor}; margin-bottom: 10px; box-shadow: 0 0 14px ${intentColor}33;">
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <span style="font-size: 0.82rem; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
              <span style="color: ${intentColor}; display: inline-flex; align-items: center;">${renderIcon(intentData?.iconKey || 'intent_paz')}</span>
              <span>${t('intent_filter_prefix', lang)}: <strong>${intentName}</strong> · <strong>${totalFiltered}</strong> ${countWord}</span>
            </span>
            <button id="btn-clear-active-filter" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; font-size: 0.74rem; padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; font-weight: 700;">${t('remove_filter_btn', lang) || 'Quitar Filtro'} ✕</button>
          </div>
          ${healthDisclaimerHtml}
        </div>
      `;
    } else if (this.currentFilterTradition) {
      const tradData = getTradition(this.currentFilterTradition);
      const tradName = tradData ? (tradData.nombre[lang] || tradData.nombre.es) : this.currentFilterTradition;
      const tradColor = tradData?.colorAcento || 'var(--accent-gold)';
      const countWord = totalFiltered === 1 ? t('prayer_singular', lang) : t('prayer_plural', lang);
      filterBadgeHtml = `
        <div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--glass-surface-2); border-radius: var(--radius-md); border: 1px solid ${tradColor}; margin-bottom: 10px; box-shadow: 0 0 14px ${tradColor}33;">
          <span style="font-size: 0.82rem; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            <span style="color: ${tradColor}; display: inline-flex; align-items: center;">${renderIcon(tradData?.iconKey || 'ui_sparkles')}</span>
            <span>${t('trad_filter_prefix', lang)}: <strong>${tradName}</strong> · <strong>${totalFiltered}</strong> ${countWord}</span>
          </span>
          <button id="btn-clear-active-filter" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; font-size: 0.74rem; padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; font-weight: 700;">${t('remove_filter_btn', lang) || 'Quitar Filtro'} ✕</button>
        </div>
      `;
    }

    const cardsHtml = initialItems.map(p => this.renderPrayerCardHtml(p, lang)).join('');
    const hasMore = initialItems.length < totalFiltered;
    const sentinelHtml = hasMore ? `
      <div id="catalog-scroll-sentinel" style="grid-column: 1/-1; height: 50px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.8rem; padding: 12px 0;">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 14px; height: 14px; border: 2px solid var(--accent-gold); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
          ${t('loading_more', lang) || 'Cargando más oraciones...'} (${initialItems.length} de ${totalFiltered})
        </span>
      </div>
    ` : '';

    prayersListContainer.innerHTML = filterBadgeHtml + cardsHtml + sentinelHtml;

    // 1. Conectar botón de quitar filtro
    const clearFilterBtn = document.getElementById('btn-clear-active-filter');
    if (clearFilterBtn) {
      clearFilterBtn.addEventListener('click', () => {
        this.currentFilterEmotion = null;
        this.currentFilterIntention = null;
        this.currentFilterTradition = null;
        this.catalogCurrentPage = 1;
        this.renderDashboard();
      });
    }

    // 2. Conectar click en tarjetas de oración para abrir el Lector Espejo
    prayersListContainer.querySelectorAll('.prayer-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.getAttribute('data-prayer-id');
        const prayer = filtered.find(p => String(p.id) === String(pId) || String(p.numero) === String(pId));
        if (prayer) {
          soundManager.playBeadClick();
          this.mirrorReader.open(prayer);
        }
      });
    });

    // 3. Conectar IntersectionObserver para paginación infinita en DOM
    if (hasMore && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const sentinel = document.getElementById('catalog-scroll-sentinel');
      if (sentinel) {
        this.catalogObserver = new IntersectionObserver((entries) => {
          if (entries[0] && entries[0].isIntersecting) {
            this.catalogObserver.disconnect();
            this.catalogObserver = null;
            this.catalogCurrentPage++;
            this.renderCatalogView(availablePrayers, lang);
          }
        }, { rootMargin: '200px' });
        this.catalogObserver.observe(sentinel);
      }
    }
  }

  resetSearch() {
    const sInput = document.getElementById('input-prayer-search');
    const cBtn = document.getElementById('btn-clear-search');
    if (sInput) sInput.value = '';
    if (cBtn) cBtn.style.display = 'none';
    this.searchQuery = '';
    this.currentFilterEmotion = null;
    this.currentFilterIntention = null;
    this.currentFilterTradition = null;
    this.catalogCurrentPage = 1;
    this.renderDashboard();
  }

  attachGlobalEvents() {
    // Atajos Devocionales Rápidos 2x2 (Protección, Guía, Fortaleza, Abundancia)
    document.querySelectorAll('.hud-pillar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const intent = btn.getAttribute('data-intent');
        if (!intent) return;
        soundManager.playBeadClick();

        // Activar categoría y conmutar a sub-vista Catálogo
        this.activeCategory = intent;
        this.searchQuery = '';
        this.catalogCurrentPage = 1;

        // Actualizar tabs segmentados del Dashboard
        document.querySelectorAll('.segmented-item').forEach(i => {
          i.classList.toggle('active', i.getAttribute('data-subview') === 'prayers');
        });
        document.querySelectorAll('.segmented-subview').forEach(v => {
          v.classList.remove('active-subview');
        });
        const prayersView = document.getElementById('seg-view-prayers');
        if (prayersView) prayersView.classList.add('active-subview');
        this.activeSubview = 'prayers';

        // Renderizar Catálogo filtrado
        this.renderDashboard();

        // Scroll suave al Catálogo de Oraciones
        const catalogEl = document.getElementById('seg-view-prayers');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const searchInput = document.getElementById('input-prayer-search');
    const clearSearchBtn = document.getElementById('btn-clear-search');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        this.searchQuery = val;

        if (clearSearchBtn) {
          clearSearchBtn.style.display = val.trim().length > 0 ? 'inline-flex' : 'none';
        }

        if (val.trim().length > 0) {
          // Conmutar automáticamente a la sub-vista de Catálogo
          document.querySelectorAll('.segmented-item').forEach(i => {
            i.classList.toggle('active', i.getAttribute('data-subview') === 'prayers');
          });
          document.querySelectorAll('.segmented-subview').forEach(v => {
            v.classList.remove('active-subview');
          });
          const prayersView = document.getElementById('seg-view-prayers');
          if (prayersView) prayersView.classList.add('active-subview');
          this.activeSubview = 'prayers';
        }

        // Búsqueda fluida con debounce a 180ms para móviles
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.catalogCurrentPage = 1;
          this.renderDashboard();
        }, 180);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        this.resetSearch();
      });
    }

    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const newTheme = this.prefs.tema === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
      });
    }

    const novenasBtn = document.getElementById('btn-header-novenas');
    if (novenasBtn) {
      novenasBtn.addEventListener('click', () => {
        if (this.novenasModal) this.novenasModal.open();
      });
    }

    const compassBtn = document.getElementById('btn-header-compass');
    if (compassBtn) {
      compassBtn.addEventListener('click', () => {
        this.spiritualCompass.open();
      });
    }

    const habitBtn = document.getElementById('btn-header-habit');
    if (habitBtn) {
      habitBtn.addEventListener('click', () => {
        const currentHour = new Date().getHours();
        const habitType = (currentHour >= 18 || currentHour < 5) ? 'night' : 'morning';
        this.sacredHabit.open(habitType);
      });
    }

    const notifBtn = document.getElementById('btn-header-notif');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.notificationModal.open();
      });
    }

    const badgeEl = document.getElementById('header-membership-badge');
    if (badgeEl) {
      badgeEl.addEventListener('click', () => {
        this.membership.open();
      });
    }

    const langBtn = document.getElementById('btn-toggle-lang');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.languageModal.open();
      });
    }

    const prefsBtn = document.getElementById('btn-open-preferences');
    if (prefsBtn) {
      prefsBtn.addEventListener('click', () => this.onboarding.open(2));
    }

    const focusSwitch = document.getElementById('switch-focus-mode');
    const zenPanel = document.getElementById('zen-sound-config-panel');
    const zenSoundBtn = document.getElementById('btn-open-zen-sound-picker');
    const zenSoundHidden = document.getElementById('select-zen-ambient-sound');
    const zenPreviewBtn = document.getElementById('btn-preview-zen-sound');

    const updateZenSoundPillUI = (soundId) => {
      const currentLang = this.prefs.idioma || 'es';
      const def = SacredSoundPicker.getSoundDef(soundId, currentLang);
      const iconEl = document.getElementById('zen-sound-active-icon');
      const labelEl = document.getElementById('zen-sound-active-label');
      if (iconEl) {
        iconEl.innerHTML = renderIcon(def.icon);
        iconEl.style.color = def.color;
      }
      if (labelEl) labelEl.innerText = def.name;
      if (zenSoundHidden) zenSoundHidden.value = def.id;
    };

    if (focusSwitch && zenPanel) {
      const isZenActive = this.prefs.modoZen !== false;
      focusSwitch.checked = isZenActive;
      zenPanel.style.display = isZenActive ? 'flex' : 'none';

      const initialSound = this.prefs.sonidoAmbientePorDefecto || 'silencio_profundo';
      updateZenSoundPillUI(initialSound);

      // Abrir selector táctil modal al tocar la cápsula
      if (zenSoundBtn) {
        zenSoundBtn.addEventListener('click', () => {
          const curVal = zenSoundHidden ? zenSoundHidden.value : (this.prefs.sonidoAmbientePorDefecto || 'silencio_profundo');
          SacredSoundPicker.open({
            currentSound: curVal,
            onSelect: (selectedId) => {
              this.prefs.sonidoAmbientePorDefecto = selectedId;
              StorageService.savePreferences(this.prefs);
              updateZenSoundPillUI(selectedId);

              if (selectedId === 'silencio_profundo') {
                soundManager.stopAmbient();
                if (zenPreviewBtn) {
                  zenPreviewBtn.innerHTML = `${renderIcon('ui_play')}<span>Probar</span>`;
                  zenPreviewBtn.classList.remove('active-glow-cyan');
                }
              } else if (soundManager.isPlaying) {
                soundManager.playAmbient(selectedId);
              }
            }
          });
        });
      }

      focusSwitch.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        this.prefs.modoZen = isChecked;
        StorageService.savePreferences(this.prefs);
        zenPanel.style.display = isChecked ? 'flex' : 'none';
        if (!isChecked) {
          soundManager.stopAmbient();
          if (zenPreviewBtn) {
            zenPreviewBtn.innerHTML = `${renderIcon('ui_play')}<span>Probar</span>`;
            zenPreviewBtn.classList.remove('active-glow-cyan');
          }
        }
      });

      if (zenPreviewBtn) {
        let isPreviewing = false;
        zenPreviewBtn.innerHTML = `${renderIcon('ui_play')}<span>Probar</span>`;
        zenPreviewBtn.addEventListener('click', () => {
          const chosen = zenSoundHidden ? zenSoundHidden.value : 'silencio_profundo';
          if (!isPreviewing) {
            if (chosen === 'silencio_profundo') {
              soundManager.stopAmbient();
              SacredDialog.toast('Silencio profundo activado');
              return;
            }
            soundManager.playAmbient(chosen);
            zenPreviewBtn.innerHTML = `${renderIcon('ui_pause')}<span>Detener</span>`;
            zenPreviewBtn.classList.add('active-glow-cyan');
            isPreviewing = true;
          } else {
            soundManager.stopAmbient();
            zenPreviewBtn.innerHTML = `${renderIcon('ui_play')}<span>Probar</span>`;
            zenPreviewBtn.classList.remove('active-glow-cyan');
            isPreviewing = false;
          }
        });
      }
    }

    // Manejo de cambio de visibilidad de pestaña (evita congelamiento de Web Audio y fugas de TTS)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        soundManager.stopTTS();
      } else {
        if (soundManager.audioCtx && soundManager.audioCtx.state === 'suspended') {
          if (soundManager.isPlaying) {
            soundManager.audioCtx.resume().catch(() => {});
          }
        }
      }
    });
  }
}

// Global Error Boundary para atrapar excepciones no controladas y asegurar estabilidad 100%
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[FeUniversal Resilence] Promesa no manejada prevenida:', event.reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    console.warn('[FeUniversal Resilence] Error global atrapado:', event.message);
  });

  if (typeof document !== 'undefined') {
    const startApp = () => {
      try {
        if (!window.feApp) {
          window.feApp = new FeUniversalApp();
          window.feApp.init();
        }
      } catch (err) {
        console.error('Error durante la inicialización de FeUniversal:', err);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startApp);
    } else {
      startApp();
    }
  }
}
