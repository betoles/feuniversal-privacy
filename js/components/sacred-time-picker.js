import { t } from '../data/i18n.js';
import { StorageService } from '../services/storage-service.js';
/**
 * SACRED TIME PICKER COMPONENT (SELECTOR DE HORARIO SAGRADO TÁCTIL)
 * FeUniversal - Faith & Prayers
 * 
 * Interfaz táctil, estética y amplia para seleccionar horas y minutos
 * sin depender de inputs nativos del navegador. 100% SVG & Glassmorphism.
 */

import { renderIcon } from './icons.js';

export class SacredTimePicker {
  static modalEl = null;
  static currentHour = 7;
  static currentMinute = 0;
  static currentPeriod = 'AM'; // 'AM' | 'PM'
  static onConfirmCallback = null;

  static ensureModal() {
    let el = document.getElementById('modal-sacred-time-picker');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-sacred-time-picker';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 5000; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    SacredTimePicker.modalEl = el;
  }

  /**
   * Abre el selector de hora sagrada
   * @param {string} initialTime - Hora en formato 'HH:MM' (24h) ej. '07:00' o '21:30'
   * @param {string} title - Título del momento de oración
   * @param {Function} onConfirm - Callback con la hora seleccionada en formato 'HH:MM'
   */
  static open({ initialTime = '07:00', title = 'Hora de Oración', onConfirm }) {
    SacredTimePicker.ensureModal();
    SacredTimePicker.onConfirmCallback = onConfirm;

    // Parsear hora inicial (24h a 12h AM/PM)
    let [h, m] = (initialTime || '07:00').split(':').map(Number);
    if (isNaN(h)) h = 7;
    if (isNaN(m)) m = 0;

    SacredTimePicker.currentPeriod = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    SacredTimePicker.currentHour = h12;
    SacredTimePicker.currentMinute = m;

    SacredTimePicker.render(title);
    SacredTimePicker.modalEl.style.display = 'flex';
    if (SacredTimePicker.modalEl) SacredTimePicker.modalEl.scrollTop = 0;
  }

  static close() {
    if (SacredTimePicker.modalEl) {
      SacredTimePicker.modalEl.style.display = 'none';
    }
  }

  static get24HourString() {
    let h = SacredTimePicker.currentHour;
    if (SacredTimePicker.currentPeriod === 'PM' && h < 12) h += 12;
    if (SacredTimePicker.currentPeriod === 'AM' && h === 12) h = 0;
    const hh = String(h).padStart(2, '0');
    const mm = String(SacredTimePicker.currentMinute).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  static get12HourDisplay() {
    const hh = String(SacredTimePicker.currentHour).padStart(2, '0');
    const mm = String(SacredTimePicker.currentMinute).padStart(2, '0');
    return { hh, mm, period: SacredTimePicker.currentPeriod };
  }

  static render(title) {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const { hh, mm, period } = SacredTimePicker.get12HourDisplay();

    SacredTimePicker.modalEl.innerHTML = `
      <div class="crystal-card time-picker-card" style="max-width: 440px; width: 100%; margin: auto 0; padding: 22px 18px 26px; position: relative; max-height: 90vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box;">
        <button id="btn-close-time-picker" class="btn-modal-close" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>

        <!-- Cabecera con Icono Vectorial SVG -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="width: 44px; height: 44px; margin: 0 auto 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), var(--accent-indigo)); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 16px var(--accent-gold-glow);">
            ${renderIcon('ui_clock')}
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 0 0 4px; color: var(--text-primary);">${title}</h3>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0;">${t('picker_time_desc', lang)}</p>
        </div>

        <!-- VISOR DIGITAL GIGANTE SAGRADO -->
        <div class="time-display-box" style="background: var(--glass-inset); padding: 14px 18px; border-radius: var(--radius-lg); border: 1px solid var(--glass-border); margin-bottom: 18px; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.4);">
          <div style="display: flex; align-items: baseline; gap: 4px; font-family: var(--font-code); font-size: 2.2rem; font-weight: 800; color: var(--text-primary); letter-spacing: 2px;">
            <span id="display-time-hour" style="color: var(--accent-gold); min-width: 48px; text-align: center;">${hh}</span>
            <span style="color: var(--text-muted); opacity: 0.7;">:</span>
            <span id="display-time-minute" style="color: var(--accent-cyan); min-width: 48px; text-align: center;">${mm}</span>
          </div>

          <!-- Selector AM / PM Segmentado -->
          <div style="display: flex; flex-direction: column; gap: 4px; margin-left: 8px;">
            <button type="button" id="btn-period-am" class="btn-crystal ${period === 'AM' ? 'period-btn-active' : ''}" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 800; border-radius: var(--radius-sm);">AM</button>
            <button type="button" id="btn-period-pm" class="btn-crystal ${period === 'PM' ? 'period-btn-active' : ''}" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 800; border-radius: var(--radius-sm);">PM</button>
          </div>
        </div>

        <!-- SECCIÓN 1: SELECCIÓN DE HORA (1 AL 12) -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <span style="color: var(--accent-gold); display: flex;">${renderIcon('ui_clock')}</span>
            <span>${t('hour_label', lang) || 'Hora'}:</span>
          </div>
          <div class="time-hours-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px;">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(hNum => `
              <button type="button" class="time-num-btn time-hour-btn ${SacredTimePicker.currentHour === hNum ? 'active' : ''}" data-hour="${hNum}">
                ${hNum}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- SECCIÓN 2: SELECCIÓN DE MINUTOS (TÁCTIL & RÁPIDA) -->
        <div style="margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
              <span style="color: var(--accent-cyan); display: flex;">${renderIcon('ui_speed')}</span>
              <span>${t('minute_label', lang) || 'Minutos'}:</span>
            </div>
            <!-- Controles de ajuste fino +/- -->
            <div style="display: flex; align-items: center; gap: 4px;">
              <button type="button" id="btn-min-minus" class="btn-crystal" style="width: 28px; height: 28px; padding: 0; font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; justify-content: center;" title="-">-</button>
              <button type="button" id="btn-min-plus" class="btn-crystal" style="width: 28px; height: 28px; padding: 0; font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; justify-content: center;" title="+">+</button>
            </div>
          </div>

          <div class="time-minutes-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px;">
            ${[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(mNum => `
              <button type="button" class="time-num-btn time-minute-btn ${SacredTimePicker.currentMinute === mNum ? 'active' : ''}" data-minute="${mNum}">
                :${String(mNum).padStart(2, '0')}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- SECCIÓN 3: ATAJOS LITÚRGICOS RÁPIDOS (100% SVG) -->
        <div style="margin-bottom: 20px; background: var(--glass-surface-1); padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
          <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            ${t('usual_schedules', lang) || 'Horarios Litúrgicos Habituales'}:
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button type="button" class="time-shortcut-btn" data-time="06:30">
              <span style="color: var(--accent-gold); display: flex;">${renderIcon('time_dawn')}</span>
              <span>06:30 AM · ${t('compass_dawn', lang) || 'Amanecer'}</span>
            </button>
            <button type="button" class="time-shortcut-btn" data-time="12:00">
              <span style="color: #fbbf24; display: flex;">${renderIcon('ui_sun')}</span>
              <span>12:00 PM · ${t('noon_pause', lang) || 'Mediodía'}</span>
            </button>
            <button type="button" class="time-shortcut-btn" data-time="18:30">
              <span style="color: #f97316; display: flex;">${renderIcon('time_dawn')}</span>
              <span>06:30 PM · ${t('compass_dusk', lang) || 'Vísperas'}</span>
            </button>
            <button type="button" class="time-shortcut-btn" data-time="21:30">
              <span style="color: var(--accent-indigo); display: flex;">${renderIcon('ui_moon')}</span>
              <span>09:30 PM · ${t('night_prayer', lang) || 'Completas'}</span>
            </button>
          </div>
        </div>

        <!-- BOTONES DE ACCIÓN (CONFIRMAR / CANCELAR) -->
        <div style="display: flex; gap: 10px;">
          <button type="button" id="btn-cancel-time-picker" class="btn-crystal" style="flex: 1; padding: 12px; font-size: 0.84rem; font-weight: 700;">
            ${t('picker_time_cancel', lang) || 'Cancelar'}
          </button>
          <button type="button" id="btn-confirm-time-picker" class="btn-crystal btn-crystal-gold" style="flex: 1.5; padding: 12px; font-size: 0.88rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span style="display: flex;">${renderIcon('ui_sparkles')}</span>
            <span>${t('picker_time_confirm', lang) || 'Confirmar Hora'}</span>
          </button>
        </div>
      </div>
    `;

    SacredTimePicker.attachEvents(title);
  }

  static updateDisplay() {
    const { hh, mm, period } = SacredTimePicker.get12HourDisplay();
    const hourEl = document.getElementById('display-time-hour');
    const minEl = document.getElementById('display-time-minute');
    const amBtn = document.getElementById('btn-period-am');
    const pmBtn = document.getElementById('btn-period-pm');

    if (hourEl) hourEl.innerText = hh;
    if (minEl) minEl.innerText = mm;

    if (amBtn && pmBtn) {
      if (period === 'AM') {
        amBtn.classList.add('period-btn-active');
        pmBtn.classList.remove('period-btn-active');
      } else {
        pmBtn.classList.add('period-btn-active');
        amBtn.classList.remove('period-btn-active');
      }
    }

    // Actualizar estados visuales de botones de hora
    const hourBtns = SacredTimePicker.modalEl.querySelectorAll('.time-hour-btn');
    hourBtns.forEach(btn => {
      const h = Number(btn.getAttribute('data-hour'));
      if (h === SacredTimePicker.currentHour) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Actualizar estados de botones de minutos
    const minBtns = SacredTimePicker.modalEl.querySelectorAll('.time-minute-btn');
    minBtns.forEach(btn => {
      const m = Number(btn.getAttribute('data-minute'));
      if (m === SacredTimePicker.currentMinute) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  static attachEvents(title) {
    const closeBtn = document.getElementById('btn-close-time-picker');
    const cancelBtn = document.getElementById('btn-cancel-time-picker');
    const confirmBtn = document.getElementById('btn-confirm-time-picker');
    const amBtn = document.getElementById('btn-period-am');
    const pmBtn = document.getElementById('btn-period-pm');
    const minMinusBtn = document.getElementById('btn-min-minus');
    const minPlusBtn = document.getElementById('btn-min-plus');

    if (closeBtn) closeBtn.addEventListener('click', () => SacredTimePicker.close());
    if (cancelBtn) cancelBtn.addEventListener('click', () => SacredTimePicker.close());

    if (amBtn) {
      amBtn.addEventListener('click', () => {
        SacredTimePicker.currentPeriod = 'AM';
        SacredTimePicker.updateDisplay();
      });
    }

    if (pmBtn) {
      pmBtn.addEventListener('click', () => {
        SacredTimePicker.currentPeriod = 'PM';
        SacredTimePicker.updateDisplay();
      });
    }

    // Eventos de botones de hora
    const hourBtns = SacredTimePicker.modalEl.querySelectorAll('.time-hour-btn');
    hourBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const h = Number(btn.getAttribute('data-hour'));
        SacredTimePicker.currentHour = h;
        SacredTimePicker.updateDisplay();
      });
    });

    // Eventos de botones de minutos
    const minBtns = SacredTimePicker.modalEl.querySelectorAll('.time-minute-btn');
    minBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const m = Number(btn.getAttribute('data-minute'));
        SacredTimePicker.currentMinute = m;
        SacredTimePicker.updateDisplay();
      });
    });

    // Ajuste fino minutos
    if (minMinusBtn) {
      minMinusBtn.addEventListener('click', () => {
        SacredTimePicker.currentMinute = (SacredTimePicker.currentMinute - 1 + 60) % 60;
        SacredTimePicker.updateDisplay();
      });
    }

    if (minPlusBtn) {
      minPlusBtn.addEventListener('click', () => {
        SacredTimePicker.currentMinute = (SacredTimePicker.currentMinute + 1) % 60;
        SacredTimePicker.updateDisplay();
      });
    }

    // Atajos Litúrgicos
    const shortcutBtns = SacredTimePicker.modalEl.querySelectorAll('.time-shortcut-btn');
    shortcutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-time');
        if (t) {
          let [h, m] = t.split(':').map(Number);
          SacredTimePicker.currentPeriod = h >= 12 ? 'PM' : 'AM';
          let h12 = h % 12;
          if (h12 === 0) h12 = 12;
          SacredTimePicker.currentHour = h12;
          SacredTimePicker.currentMinute = m;
          SacredTimePicker.updateDisplay();
        }
      });
    });

    // Botón Confirmar
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const result24 = SacredTimePicker.get24HourString();
        if (typeof SacredTimePicker.onConfirmCallback === 'function') {
          SacredTimePicker.onConfirmCallback(result24);
        }
        SacredTimePicker.close();
      });
    }
  }
}
