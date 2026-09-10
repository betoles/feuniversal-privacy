/**
 * HÁBITO DEL ALBA Y EL OCASO (3 MIN) & MICRO-OFRENDAS
 * FeUniversal - Faith & Prayers
 * 
 * Rutina espiritual breve de alta retención diaria:
 * - Alba (3 min): Oración matutina + Brújula de luz + Encendido de veladora.
 * - Ocaso (3 min): Oración de protección + Agradecimiento + Cierre del día.
 * - Micro-Ofrenda Voluntaria ($0.49 USD) para apadrinamiento de traducciones.
 */

import { StorageService } from "../services/storage-service.js";
import { SolarService } from "../services/solar-service.js";
import { renderIcon } from "./icons.js";
import { t, isRTL } from "../data/i18n.js";
import { SacredDialog } from "./sacred-dialog.js";

export class SacredHabitComponent {
  constructor(onOpenAltar, onOpenCompass, onOpenReader) {
    this.onOpenAltar = onOpenAltar;
    this.onOpenCompass = onOpenCompass;
    this.onOpenReader = onOpenReader;
    this.container = null;
  }

  ensureContainer() {
    let el = document.getElementById("modal-sacred-habit");
    if (!el) {
      el = document.createElement("div");
      el.id = "modal-sacred-habit";
      document.body.appendChild(el);
    }
    el.style.cssText = "display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); z-index: 6000; padding: calc(env(safe-area-inset-top, 24px) + 24px) 14px calc(env(safe-area-inset-bottom, 24px) + 80px); align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;";
    this.container = el;
  }

  open(habitType = "morning") {
    this.ensureContainer();
    this.render(habitType);
    this.container.style.display = "flex";
    if (this.container) this.container.scrollTop = 0;
  }

  close() {
    if (this.container) this.container.style.display = "none";
  }

  render(habitType = "morning") {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || "es";
    const sunTimes = SolarService.getSunTimes();
    const isMorning = habitType === "morning";
    const isLangRTL = isRTL(lang);

    const title = isMorning ? (t("habit_morning_title", lang) || "Ritual del Alba (3 min)") : (t("habit_night_title", lang) || "Ritual del Ocaso (3 min)");
    const badgeGrad = isMorning ? "var(--accent-gold)" : "var(--accent-indigo)";

    this.container.innerHTML = `
      <div class="crystal-card" dir="${isLangRTL ? 'rtl' : 'ltr'}" style="width: 100%; max-width: 480px; margin: 0 auto; padding: 20px 18px 24px; border-radius: var(--radius-xl); background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.65); box-sizing: border-box;">
        
        <!-- Fila Superior con Botón Cerrar -->
        <div style="display: flex; justify-content: flex-end; align-items: center; width: 100%; margin-bottom: 12px;">
          <button id="btn-close-habit" class="btn-modal-close" style="position: static; margin-left: auto; width: 36px; height: 36px; min-width: 36px; min-height: 36px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;" title="${t('dialog_cancel', lang) || 'Cerrar'}">
            ${renderIcon("ui_close")}
          </button>
        </div>

        <!-- Selector de Pestaña de Ritual (Alba / Ocaso) -->
        <div class="crystal-segmented-control" style="width: 100%; margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; box-sizing: border-box;">
          <button id="tab-habit-morning" class="segmented-item ${isMorning ? 'active' : ''}" style="min-height: 46px; padding: 6px 10px; font-size: 0.82rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer; text-align: center; box-sizing: border-box;">
            <span style="display: inline-flex; align-items: center; flex-shrink: 0; color: var(--accent-gold);">${renderIcon('ui_sunrise_sunset')}</span>
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t('habit_tab_morning', lang) || 'Alba (Mañana)'}</span>
          </button>
          <button id="tab-habit-night" class="segmented-item ${!isMorning ? 'active' : ''}" style="min-height: 46px; padding: 6px 10px; font-size: 0.82rem; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer; text-align: center; box-sizing: border-box;">
            <span style="display: inline-flex; align-items: center; flex-shrink: 0; color: var(--accent-indigo);">${renderIcon('ui_moon')}</span>
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t('habit_tab_night', lang) || 'Ocaso (Noche)'}</span>
          </button>
        </div>

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 18px;">
          <div style="width: 54px; height: 54px; margin: 0 auto 10px; border-radius: 50%; background: ${isMorning ? 'linear-gradient(135deg, rgba(251,191,36,0.22), rgba(244,63,94,0.25))' : 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.25))'}; border: 1.5px solid ${isMorning ? 'rgba(251,191,36,0.5)' : 'rgba(99,102,241,0.5)'}; display: flex; align-items: center; justify-content: center; color: ${badgeGrad}; box-shadow: 0 0 20px ${isMorning ? 'var(--accent-gold-glow)' : 'var(--accent-indigo-glow)'};">
            <span style="width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;">${renderIcon(isMorning ? 'ui_sunrise_sunset' : 'ui_moon')}</span>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: ${badgeGrad}; margin-bottom: 4px; font-family: var(--font-title); line-height: 1.3;">
            ${title}
          </h2>
          <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; line-height: 1.35;">
            <span style="color: var(--text-primary); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;"><span style="display: inline-flex; color: var(--accent-rose);">${renderIcon('ui_globe')}</span> ${sunTimes.cityName}</span>
            <span style="color: var(--text-muted); opacity: 0.6;">·</span>
            <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="display: inline-flex; color: ${isMorning ? 'var(--accent-gold)' : 'var(--accent-indigo)'};">${renderIcon(isMorning ? 'ui_sunrise_sunset' : 'ui_moon')}</span> ${isMorning ? `${t('compass_dawn', lang) || 'Alba'}: <strong style="color: var(--text-primary); font-weight: 800;">${sunTimes.sunrise}</strong>` : `${t('compass_dusk', lang) || 'Ocaso'}: <strong style="color: var(--text-primary); font-weight: 800;">${sunTimes.sunset}</strong>`}</span>
          </div>
        </div>

        <!-- 3 Pasos del Ritual (3 Minutos) -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;">
          
          <!-- Paso 1: Oración Breve -->
          <div class="crystal-card" style="padding: 12px 14px; background: var(--glass-surface-1); border-radius: var(--radius-md); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 12px; box-sizing: border-box;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: rgba(251,191,36,0.22); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.85rem; flex-shrink: 0; box-shadow: 0 0 10px rgba(251,191,36,0.3);">1</div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary); line-height: 1.35; margin-bottom: 2px;">
                ${isMorning 
                  ? (t('habit_step1_morning_title', lang) || 'Plegaria de Consagración Matutina') 
                  : (t('habit_step1_night_title', lang) || 'Oración de Protección y Paz')}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.3;">
                ${t('habit_step1_desc', lang) || '1 minuto de lectura y meditación serena'}
              </div>
            </div>
            <button id="btn-habit-open-reader" class="btn-crystal" style="height: 36px; padding: 0 14px; min-width: 82px; font-size: 0.78rem; font-weight: 800; border-radius: var(--radius-full); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; border: 1.5px solid var(--glass-border); box-shadow: var(--glass-shadow-sm); cursor: pointer;">
              <span style="color: var(--accent-gold); display: inline-flex; align-items: center; justify-content: center; line-height: 1;">${renderIcon("nav_explore")}</span>
              <span>${t('habit_step1_btn', lang) || 'Orar'}</span>
            </button>
          </div>

          <!-- Paso 2: Brújula Espiritual -->
          <div class="crystal-card" style="padding: 12px 14px; background: var(--glass-surface-1); border-radius: var(--radius-md); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 12px; box-sizing: border-box;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: rgba(56,189,248,0.22); color: var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.85rem; flex-shrink: 0; box-shadow: 0 0 10px rgba(56,189,248,0.3);">2</div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary); line-height: 1.35; margin-bottom: 2px;">
                ${isMorning 
                  ? (t('habit_step2_morning_title', lang) || 'Orientación a la Luz del Sol Naciente') 
                  : (t('habit_step2_night_title', lang) || 'Alineación Sagrada de Descanso')}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.3;">
                ${t('habit_step2_desc', lang) || 'Sincronización con la Brújula Espiritual'}
              </div>
            </div>
            <button id="btn-habit-open-compass" class="btn-crystal" style="height: 36px; padding: 0 14px; min-width: 82px; font-size: 0.78rem; font-weight: 800; border-radius: var(--radius-full); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; border: 1.5px solid var(--glass-border); box-shadow: var(--glass-shadow-sm); cursor: pointer;">
              <span style="color: var(--accent-cyan); display: inline-flex; align-items: center; justify-content: center; line-height: 1;">${renderIcon("ui_compass")}</span>
              <span>${t('habit_step2_btn', lang) || 'Brújula'}</span>
            </button>
          </div>

          <!-- Paso 3: Veladora en el Altar -->
          <div class="crystal-card" style="padding: 12px 14px; background: var(--glass-surface-1); border-radius: var(--radius-md); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 12px; box-sizing: border-box;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: rgba(244,63,94,0.22); color: var(--accent-rose); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.85rem; flex-shrink: 0; box-shadow: 0 0 10px rgba(244,63,94,0.3);">3</div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--text-primary); line-height: 1.35; margin-bottom: 2px;">
                ${isMorning 
                  ? (t('habit_step3_morning_title', lang) || 'Encendido de la Veladora del Día') 
                  : (t('habit_step3_night_title', lang) || 'Agradecimiento y Cierre Devocional')}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.3;">
                ${t('habit_step3_desc', lang) || 'Consagración activa en el Altar'}
              </div>
            </div>
            <button id="btn-habit-open-altar" class="btn-crystal" style="height: 36px; padding: 0 14px; min-width: 82px; font-size: 0.78rem; font-weight: 800; border-radius: var(--radius-full); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; border: 1.5px solid var(--glass-border); box-shadow: var(--glass-shadow-sm); cursor: pointer;">
              <span style="color: var(--accent-rose); display: inline-flex; align-items: center; justify-content: center; line-height: 1;">${renderIcon("nav_altar")}</span>
              <span>${t('habit_step3_btn', lang) || 'Altar'}</span>
            </button>
          </div>

        </div>

        <!-- Botón de Conclusión del Ritual -->
        <button id="btn-complete-habit" class="btn-crystal btn-crystal-gold" style="width: 100%; min-height: 52px; padding: 10px 14px; font-size: 0.90rem; font-weight: 800; margin-bottom: 14px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; line-height: 1.35; gap: 2px; cursor: pointer; box-sizing: border-box;">
          <span style="font-weight: 800; font-size: 0.95rem; text-align: center;">${t('habit_btn_consecrate', lang) || 'Consagrar Ritual'}</span>
          ${isMorning ? `<span style="font-size: 0.80rem; font-weight: 600; opacity: 0.95; text-align: center;">${t('habit_sub_start_day', lang) || '(Comenzar el Día)'}</span>` : ''}
        </button>

        <!-- Tarjeta de Micro-Ofrenda Voluntaria ($0.49 USD) -->
        <div class="crystal-card" style="padding: 14px 16px; background: var(--glass-surface-1); border-radius: var(--radius-md); border: 1.5px solid var(--glass-border); text-align: center; box-shadow: var(--glass-shadow-sm); box-sizing: border-box;">
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px; text-align: center; line-height: 1.35;">
            ${t("offering_title", lang) || 'Micro-Ofrenda Litúrgica ($0.49 USD)'}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-primary); opacity: 0.92; margin-bottom: 12px; line-height: 1.5; font-weight: 500; text-align: center;">
            ${t("offering_desc", lang) || 'Apadrina la traducción de nuevas oraciones desde lenguas sagradas y dialectos ancestrales.'}
          </div>
          <button id="btn-sponsor-translation" class="btn-crystal" style="min-height: 48px; padding: 10px 24px; font-size: 0.82rem; border-radius: var(--radius-full); color: var(--text-primary); font-weight: 800; background: linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.28)); border: 1.5px solid var(--accent-gold); box-shadow: 0 2px 8px var(--accent-gold-glow); display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-sizing: border-box;">
            <span style="width: 16px; height: 16px; display: inline-flex; color: var(--accent-gold);">${renderIcon("ui_heart")}</span>
            <span>${t("habit_offer_btn", lang) || 'Ofrendar $0.49 USD'}</span>
          </button>
        </div>

      </div>
    `;

    // Eventos
    const closeBtn = document.getElementById("btn-close-habit");
    if (closeBtn) closeBtn.onclick = () => this.close();

    const tabMorning = document.getElementById("tab-habit-morning");
    if (tabMorning) tabMorning.onclick = () => this.render("morning");

    const tabNight = document.getElementById("tab-habit-night");
    if (tabNight) tabNight.onclick = () => this.render("night");

    const readerBtn = document.getElementById("btn-habit-open-reader");
    if (readerBtn) {
      readerBtn.onclick = () => {
        this.close();
        if (this.onOpenReader) this.onOpenReader();
      };
    }

    const compassBtn = document.getElementById("btn-habit-open-compass");
    if (compassBtn) {
      compassBtn.onclick = () => {
        this.close();
        if (this.onOpenCompass) this.onOpenCompass();
      };
    }

    const altarBtn = document.getElementById("btn-habit-open-altar");
    if (altarBtn) {
      altarBtn.onclick = () => {
        this.close();
        if (this.onOpenAltar) this.onOpenAltar();
      };
    }

    const completeBtn = document.getElementById("btn-complete-habit");
    if (completeBtn) {
      completeBtn.onclick = () => {
        StorageService.recordSpiritualScoreAction("habit_completed", 15);
        SacredDialog.toast(t('habit_toast_success', lang) || "✨ ¡Ritual Consagrado con Éxito! +15 Puntos de Fortaleza Espiritual.");
        this.close();
      };
    }

    const sponsorBtn = document.getElementById("btn-sponsor-translation");
    if (sponsorBtn) {
      sponsorBtn.onclick = () => {
        SacredDialog.alert({
          title: t('offering_alert_title', lang) || '🕊️ Micro-Ofrenda Litúrgica ($0.49 USD)',
          message: t('offering_alert_msg', lang) || '¡Muchas gracias por tu generosidad! Tu ofrenda apadrina la traducción de nuevas oraciones y preserva el santuario universal.',
          buttonText: t('offering_alert_btn', lang) || t('dialog_accept', lang) || 'Aceptar',
          type: 'gold'
        });
      };
    }
  }
}


