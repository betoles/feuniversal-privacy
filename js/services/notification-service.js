/**
 * NOTIFICATION & DEVOTIONAL SCHEDULE SERVICE (SACRED ALARM ENGINE)
 * FeUniversal - Faith & Prayers
 * 
 * Alta compatibilidad con PWA, Navegadores Web, Android e iOS.
 * - Despertador y llamada ritual con síntesis Web Audio (Campana Zen / Cuenco Tibetano / Catedral a 432/528 Hz).
 * - Notificaciones Nativas PWA (Service Worker) y Web Notifications.
 * - Patrón de vibración espiritual táctil para dispositivos móviles.
 * - Ciclo de vigilancia de alarmas en segundo plano con prevención de duplicados.
 */

import { StorageService } from './storage-service.js';
import { t } from '../data/i18n.js';

const NOTIF_STORAGE_KEY = 'feuniversal_notif_schedule_v1';

export class NotificationService {
  static alarmInterval = null;
  static lastFiredMinute = '';
  static onAlarmCallback = null;

  static getSchedule() {
    const defaults = {
      albaEnabled: true,
      albaTime: '06:00',
      morningTitle: 'Oración del Amanecer',
      morningMsg: 'Comienza tu día con bendición y paz bajo el amparo celestial.',

      mediodiaEnabled: true,
      mediodiaTime: '12:00',
      middayTitle: 'Pausa Sagrada del Mediodía',
      middayMsg: '2 minutos de gratitud y serenidad para renovar tus fuerzas.',

      ocasoEnabled: true,
      ocasoTime: '18:30',
      duskTitle: 'Oración del Ocaso / Vísperas',
      duskMsg: 'Gratitud al caer la tarde y serenidad en tu santuario.',

      nocheEnabled: true,
      nocheTime: '21:30',
      nightTitle: 'Oración de la Noche',
      nightMsg: 'Descansa bajo el amparo divino con serenidad y sueño reparador.',

      altarReminderEnabled: true,
      chimeSound: 'campana_zen', // 'campana_zen' | 'cuenco_tibet' | 'catedral' | 'silencio'
      streakGoal: 1
    };

    try {
      const data = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (data) return { ...defaults, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Error reading notification schedule:', e);
    }

    return defaults;
  }

  static saveSchedule(schedule) {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(schedule));
      NotificationService.startAlarmEngine();
    } catch (e) {
      console.error('Error saving notification schedule:', e);
    }
  }

  static async requestPermission() {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && typeof Notification.requestPermission === 'function') {
        const perm = await Notification.requestPermission();
        return perm;
      }
    } catch (e) {
      console.warn('Error solicitando permisos de notificación:', e);
    }
    return 'denied';
  }

  /**
   * Inicia el motor continuo de alarmas y llamadas devocionales
   */
  static startAlarmEngine(onAlarmCallback) {
    if (onAlarmCallback) {
      NotificationService.onAlarmCallback = onAlarmCallback;
    }
    if (NotificationService.alarmInterval) {
      clearInterval(NotificationService.alarmInterval);
    }

    NotificationService.checkAlarms();
    NotificationService.alarmInterval = setInterval(() => {
      NotificationService.checkAlarms();
    }, 10000);
  }

  /**
   * Compara el minuto actual del reloj con los horarios configurados
   */
  static checkAlarms() {
    if (typeof window === 'undefined') return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentHM = `${hours}:${minutes}`;
    const dateStr = now.toISOString().slice(0, 10);
    const currentMinuteKey = `${dateStr}-${currentHM}`;

    if (NotificationService.lastFiredMinute === currentMinuteKey) {
      return;
    }

    const sched = NotificationService.getSchedule();
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const slots = [
      { key: 'alba', enabled: sched.albaEnabled, time: sched.albaTime || '06:00', icon: '🌅', titleKey: 'notif_dawn_title', subKey: 'notif_dawn_sub' },
      { key: 'mediodia', enabled: sched.mediodiaEnabled, time: sched.mediodiaTime || '12:00', icon: '☀️', titleKey: 'notif_midday_title', subKey: 'notif_midday_sub' },
      { key: 'ocaso', enabled: sched.ocasoEnabled, time: sched.ocasoTime || '18:30', icon: '🌇', titleKey: 'notif_dusk_title', subKey: 'notif_dusk_desc' },
      { key: 'noche', enabled: sched.nocheEnabled, time: sched.nocheTime || '21:30', icon: '🌙', titleKey: 'notif_night_title', subKey: 'notif_night_sub' }
    ];

    for (const slot of slots) {
      if (slot.enabled && slot.time === currentHM) {
        NotificationService.lastFiredMinute = currentMinuteKey;
        NotificationService.triggerAlarm(slot, lang);
        break;
      }
    }
  }

  /**
   * Ejecuta el despertar sagrado: sonido armónico + vibración + notificación + modal
   */
  static async triggerAlarm(slot, lang = 'es') {
    const title = `${slot.icon} ${t(slot.titleKey, lang) || 'Momento de Oración Sagrada'}`;
    const body = t(slot.subKey, lang) || 'Haz una pausa de gratitud, paz y conexión celestial.';

    // 1. Reproducir campana sagrada procedural en Web Audio
    NotificationService.playSacredAlarmSound();

    // 2. Patrón de vibración háptica espiritual
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([500, 250, 500, 250, 1000]);
      } catch (e) {}
    }

    // 3. Disparar notificación nativa PWA / Service Worker / Web Notification
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          if (reg && reg.showNotification) {
            reg.showNotification(title, {
              body: body,
              icon: './ico.png',
              badge: './ico.png',
              tag: `feuniversal-alarm-${slot.key}`,
              renotify: true,
              requireInteraction: true,
              data: { url: './?tab=prayers', slot: slot.key }
            });
          } else {
            new Notification(title, { body: body, icon: './ico.png' });
          }
        } else {
          new Notification(title, { body: body, icon: './ico.png' });
        }
      }
    } catch (e) {
      console.warn('Error mostrando notificación del sistema:', e);
    }

    // 4. Invocar callback de interfaz en primer plano
    if (typeof NotificationService.onAlarmCallback === 'function') {
      NotificationService.onAlarmCallback(slot, title, body);
    }
  }

  /**
   * Síntesis de Campana Sagrada / Despertador Espiritual (100% Offline con Web Audio API)
   */
  static playSacredAlarmSound() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.85, now);
      masterGain.connect(ctx.destination);

      // Armónicos de Campana Monástica y Cuenco Tibetano (432 Hz, 528 Hz, 864 Hz, 1296 Hz)
      const harmonics = [
        { freq: 432, gain: 0.50, decay: 4.8 },
        { freq: 528, gain: 0.40, decay: 5.2 },
        { freq: 864, gain: 0.28, decay: 3.6 },
        { freq: 1296, gain: 0.15, decay: 2.4 }
      ];

      harmonics.forEach(h => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(h.freq, now);
        
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(h.gain, now + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(g);
        g.connect(masterGain);

        osc.start(now);
        osc.stop(now + h.decay + 0.1);
      });

      // Segunda pulsación áurea tras 1.8 segundos
      setTimeout(() => {
        if (ctx.state === 'closed') return;
        const now2 = ctx.currentTime;
        harmonics.forEach(h => {
          const osc2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(h.freq * 1.05, now2);
          
          g2.gain.setValueAtTime(0.001, now2);
          g2.gain.linearRampToValueAtTime(h.gain * 0.88, now2 + 0.04);
          g2.gain.exponentialRampToValueAtTime(0.0001, now2 + h.decay);

          osc2.connect(g2);
          g2.connect(masterGain);

          osc2.start(now2);
          osc2.stop(now2 + h.decay + 0.1);
        });
      }, 1800);

    } catch (err) {
      console.warn('Audio alarm chime error:', err);
    }
  }

  static triggerTestNotification(title, body) {
    try {
      NotificationService.playSacredAlarmSound();
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title || '✦ FeUniversal · Notificación de Prueba', {
          body: body || 'Alarma devocional y campana sagrada funcionando con éxito.',
          icon: 'ico.png'
        });
      }
    } catch (e) {
      console.warn('No fue posible disparar la notificación:', e);
    }
  }
}
