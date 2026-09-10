/**
 * NOTIFICATION & DEVOTIONAL SCHEDULE SERVICE
 * FeUniversal - Faith & Prayers
 */

import { StorageService } from './storage-service.js';

const NOTIF_STORAGE_KEY = 'feuniversal_notif_schedule_v1';

export class NotificationService {
  static getSchedule() {
    const defaults = {
      morningEnabled: true,
      morningTime: '07:00',
      morningTitle: 'Oración del Amanecer',
      morningMsg: 'Comienza tu día con bendición y paz bajo el amparo celestial.',

      middayEnabled: true,
      middayTime: '12:00',
      middayTitle: 'Pausa Sagrada del Mediodía',
      middayMsg: '2 minutos de gratitud y serenidad para renovar tus fuerzas.',

      nightEnabled: true,
      nightTime: '21:30',
      nightTitle: 'Oración de la Noche',
      nightMsg: 'Descansa bajo el amparo divino con serenidad y sueño reparador.',

      altarReminderEnabled: true,
      chimeSound: 'campana_zen', // 'campana_zen' | 'cuenco_tibet' | 'catedral' | 'silencio'
      streakGoal: 1 // 1 oración al día
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
    } catch (e) {
      console.error('Error saving notification schedule:', e);
    }
  }

  static requestPermission() {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && typeof Notification.requestPermission === 'function') {
        return Notification.requestPermission().catch(() => 'denied');
      }
    } catch (e) {
      console.warn('Error solicitando permisos de notificación:', e);
    }
    return Promise.resolve('denied');
  }

  static triggerTestNotification(title, body) {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: 'ico.png'
        });
      }
    } catch (e) {
      console.warn('No fue posible disparar la notificación:', e);
    }
  }
}
