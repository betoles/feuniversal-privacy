import { t } from '../data/i18n.js';
import { StorageService } from '../services/storage-service.js';
import { NotificationService } from '../services/notification-service.js';
import { soundManager } from '../services/sound-service.js';
import { renderIcon } from './icons.js';
import { SacredDialog } from './sacred-dialog.js';
import { SacredTimePicker } from './sacred-time-picker.js';

function formatTime12(time24) {
  let [h, m] = (time24 || '07:00').split(':').map(Number);
  if (isNaN(h)) h = 7;
  if (isNaN(m)) m = 0;
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

export class NotificationModalComponent {
  constructor() {
    this.modal = null;
  }

  open() {
    this.ensureModal();
    this.render();
    this.modal.style.display = 'flex';
    if (this.modal) this.modal.scrollTop = 0;
  }

  close() {
    if (this.modal) this.modal.style.display = 'none';
  }

  ensureModal() {
    let el = document.getElementById('modal-notification-schedule');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-notification-schedule';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 3600; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    this.modal = el;
  }

  render() {
    const s = NotificationService.getSchedule();
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const currentChime = s.chimeSound || 'campana_zen';

    this.modal.innerHTML = `
      <div class="crystal-card" style="max-width: 520px; width: 100%; margin: auto 0; padding: 26px 18px 28px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box;">
        <button id="btn-close-notif-modal" class="btn-modal-close" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>

        <div style="text-align: center; margin-bottom: 18px;">
          <div style="width: 44px; height: 44px; margin: 0 auto 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 16px var(--accent-gold-glow);">
            ${renderIcon('ui_bell')}
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 0 0 4px; color: var(--text-primary);">${t('notif_center_title', lang)}</h3>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">${t('notif_center_desc', lang)}</p>
        </div>

        <!-- LISTA DE HORARIOS PROGRAMABLES -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; width: 100%; box-sizing: border-box;">
          
          <!-- Alba -->
          <div class="crystal-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2rem; color: var(--accent-gold); display: flex; align-items: center;">${renderIcon('time_alba')}</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${t('notif_dawn_title', lang)}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${t('notif_dawn_sub', lang)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn-crystal btn-pick-time" data-slot="alba" style="padding: 5px 10px; font-size: 0.76rem; font-weight: 700;">
                ${formatTime12(s.albaTime || '06:00')}
              </button>
              <label class="hud-switch">
                <input type="checkbox" id="notif-toggle-alba" ${s.albaEnabled ? 'checked' : ''}>
                <span class="hud-slider"></span>
              </label>
            </div>
          </div>

          <!-- Mediodía -->
          <div class="crystal-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2rem; color: var(--accent-cyan); display: flex; align-items: center;">${renderIcon('time_mediodia')}</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${t('notif_midday_title', lang)}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${t('notif_midday_sub', lang)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn-crystal btn-pick-time" data-slot="mediodia" style="padding: 5px 10px; font-size: 0.76rem; font-weight: 700;">
                ${formatTime12(s.mediodiaTime || '12:00')}
              </button>
              <label class="hud-switch">
                <input type="checkbox" id="notif-toggle-mediodia" ${s.mediodiaEnabled ? 'checked' : ''}>
                <span class="hud-slider"></span>
              </label>
            </div>
          </div>

          <!-- Ocaso -->
          <div class="crystal-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2rem; color: #f59e0b; display: flex; align-items: center;">${renderIcon('time_ocaso')}</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${t('notif_dusk_title', lang)}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${t('notif_dusk_desc', lang)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn-crystal btn-pick-time" data-slot="ocaso" style="padding: 5px 10px; font-size: 0.76rem; font-weight: 700;">
                ${formatTime12(s.ocasoTime || '18:30')}
              </button>
              <label class="hud-switch">
                <input type="checkbox" id="notif-toggle-ocaso" ${s.ocasoEnabled ? 'checked' : ''}>
                <span class="hud-slider"></span>
              </label>
            </div>
          </div>

          <!-- Noche -->
          <div class="crystal-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.2rem; color: var(--accent-indigo); display: flex; align-items: center;">${renderIcon('time_noche')}</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary);">${t('notif_night_title', lang)}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${t('notif_night_sub', lang)}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn-crystal btn-pick-time" data-slot="noche" style="padding: 5px 10px; font-size: 0.76rem; font-weight: 700;">
                ${formatTime12(s.nocheTime || '21:30')}
              </button>
              <label class="hud-switch">
                <input type="checkbox" id="notif-toggle-noche" ${s.nocheEnabled ? 'checked' : ''}>
                <span class="hud-slider"></span>
              </label>
            </div>
          </div>

        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button id="btn-save-notif-schedule" class="btn-crystal btn-crystal-primary" style="width: 100%; padding: 12px; font-size: 0.9rem; font-weight: 800; cursor: pointer;">
            ${t('notif_btn_save_activate', lang)}
          </button>

          <button id="btn-sync-calendar-ics" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 11px; font-size: 0.85rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;">
            <span>${t('notif_btn_sync_calendar', lang) || '📅 Sincronizar con Calendario del Móvil (.ics)'}</span>
          </button>

          <p style="font-size: 0.68rem; color: var(--text-muted); text-align: center; margin: 4px 0 0; line-height: 1.35;">
            ${t('notif_calendar_hint', lang) || 'Recomendado para iPhone y Android: Suena con alarma nativa aunque la pantalla esté apagada o en reposo.'}
          </p>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('btn-close-notif-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const syncCalendarBtn = document.getElementById('btn-sync-calendar-ics');
    if (syncCalendarBtn) {
      syncCalendarBtn.addEventListener('click', () => {
        const sched = NotificationService.getSchedule();
        sched.albaEnabled = document.getElementById('notif-toggle-alba')?.checked || false;
        sched.mediodiaEnabled = document.getElementById('notif-toggle-mediodia')?.checked || false;
        sched.ocasoEnabled = document.getElementById('notif-toggle-ocaso')?.checked || false;
        sched.nocheEnabled = document.getElementById('notif-toggle-noche')?.checked || false;
        NotificationService.saveSchedule(sched);

        const ok = NotificationService.downloadICSFile(sched, lang);
        if (ok) {
          SacredDialog.toast(t('notif_calendar_synced_toast', lang) || '✨ Calendario devocional generado con éxito.');
        } else {
          SacredDialog.toast('⚠️ Activa al menos un horario para exportar al calendario.');
        }
      });
    }

    this.modal.querySelectorAll('.btn-pick-time').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = btn.getAttribute('data-slot');
        const sched = NotificationService.getSchedule();
        const currentVal = sched[`${slot}Time`] || '07:00';
        SacredTimePicker.open({
          initialTime: currentVal,
          title: `Horario: ${slot.toUpperCase()}`,
          onConfirm: (newTime) => {
            sched[`${slot}Time`] = newTime;
            NotificationService.saveSchedule(sched);
            btn.textContent = formatTime12(newTime);
          }
        });
      });
    });

    const saveBtn = document.getElementById('btn-save-notif-schedule');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const sched = NotificationService.getSchedule();
        sched.albaEnabled = document.getElementById('notif-toggle-alba')?.checked || false;
        sched.mediodiaEnabled = document.getElementById('notif-toggle-mediodia')?.checked || false;
        sched.ocasoEnabled = document.getElementById('notif-toggle-ocaso')?.checked || false;
        sched.nocheEnabled = document.getElementById('notif-toggle-noche')?.checked || false;
        NotificationService.saveSchedule(sched);

        // Solicitar permisos nativos si hay algún horario activado
        const anyActive = sched.albaEnabled || sched.mediodiaEnabled || sched.ocasoEnabled || sched.nocheEnabled;
        if (anyActive) {
          await NotificationService.requestPermission();
          NotificationService.startAlarmEngine();
        }

        const prefs = StorageService.getPreferences();
        const lang = prefs.idioma || 'es';
        SacredDialog.toast(t('notification_toast_saved', lang) || '✨ Horarios sagrados y alarma devocional activados con éxito.');
        this.close();
      });
    }
  }
}