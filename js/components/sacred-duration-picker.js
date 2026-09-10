/**
 * SACRED DURATION PICKER (SELECTOR MODAL TÁCTIL DE DURACIÓN DE VELADORA)
 * FeUniversal - Faith & Prayers
 */

import { renderIcon } from './icons.js';
import { t } from '../data/i18n.js';
import { StorageService } from '../services/storage-service.js';

export const CANDLE_DURATIONS = [
  { hours: 1, key: 'dur_1h', title: '1 hora · Enfoque y Meditación', subtitle: 'Plegaria inmediata y momento de recogimiento', icon: 'ui_time' },
  { hours: 24, key: 'dur_24h', title: '24 horas · 1 Día Completo', subtitle: 'Vigilia devocional canónica diaria (Recomendado)', icon: 'ui_time', default: true },
  { hours: 72, key: 'dur_3d', title: '3 días · Triduo Devocional', subtitle: 'Consagración de tres días de oración continua', icon: 'ui_time' },
  { hours: 216, key: 'dur_9d', title: '9 días · Novena Sagrada', subtitle: 'Rezo de novenario litúrgico e intercesión', icon: 'ui_time' },
  { hours: 504, key: 'dur_21d', title: '21 días · Consagración Espiritual', subtitle: 'Ciclo de purificación, ayuno y bendición', icon: 'ui_time' },
  { hours: 720, key: 'dur_30d', title: '30 días · 1 Mes Devocional', subtitle: 'Vigilia mensual perpetua en el Altar', icon: 'ui_time' }
];

const DURATION_SUBTITLES = {
  dur_1h: {
    es: 'Plegaria inmediata y momento de recogimiento',
    en: 'Immediate prayer and mindful reflection',
    fr: 'Prière immédiate et moment de recueillement',
    pt: 'Oração imediata e momento de reflexão',
    it: 'Preghiera immediata e momento di raccoglimento',
    de: 'Sofortiges Gebet und besinnlicher Moment',
    ru: 'Неотложная молитва и момент сосредоточения',
    ar: 'صلاة فورية ولحظة خشوع',
    he: 'תפילה מיידית ורגע של התייחדות',
    hi: 'तात्कालिक प्रार्थना और ध्यान का क्षण',
    zh: '即时祈祷与静思时刻',
    la: 'Prex immediata et momentum recollectionis',
    ja: '即座の祈りと瞑想のひととき',
    bn: 'তাৎক্ষণিক প্রার্থনা ও ধ্যানের মুহূর্ত',
    id: 'Doa spontan dan saat hening',
    ur: 'فوری دعا اور غور و فکر کا لمحہ',
    sw: 'Sala ya haraka na wakati wa tafakuri'
  },
  dur_24h: {
    es: 'Vigilia devocional canónica diaria (Recomendado)',
    en: 'Daily canonical devotional vigil (Recommended)',
    fr: 'Veillée dévotionnelle canonique quotidienne (Recommandé)',
    pt: 'Vigília devocional canônica diária (Recomendado)',
    it: 'Veglia devozionale canonica quotidiana (Consigliato)',
    de: 'Tägliche kanonische Andachtswache (Empfohlen)',
    ru: 'Ежедневное каноническое молитвенное бдение (Рекомендуется)',
    ar: 'سهرة تعبدية قانونية يومية (موصى به)',
    he: 'משמרת תפילה יומית קנונית (מומלץ)',
    hi: 'दैनिक धार्मिक सतर्कता (अनुशंसित)',
    zh: '每日正统虔敬守夜（推荐）',
    la: 'Vigilia devotionalis canonica cotidiana (Commendata)',
    ja: '毎日の正統な祈りの夜警（推奨）',
    bn: 'দৈনিক ধর্মীয় প্রার্থনা (প্রস্তাবিত)',
    id: 'Vigili devosi kanonik harian (Disarankan)',
    ur: 'روزانہ دعائیہ جاگرن (تجویز کردہ)',
    sw: 'Mkesha wa kila siku wa kiibada (Inapendekezwa)'
  },
  dur_3d: {
    es: 'Consagración de tres días de oración continua',
    en: 'Three-day continuous prayer consecration',
    fr: 'Consécration de trois jours de prière continue',
    pt: 'Consagração de três dias de oração contínua',
    it: 'Consacrazione di tre giorni di preghiera continua',
    de: 'Dreitägige Weihe im kontinuierlichen Gebet',
    ru: 'Трехдневное посвящение непрерывной молитвы',
    ar: 'تكريس ثلاثة أيام من الصلاة المستمرة',
    he: 'הקדשת שלושה ימי תפילה רצופה',
    hi: 'तीन दिनों की निरंतर प्रार्थना समर्पण',
    zh: '三日持续祈祷奉献',
    la: 'Consecratio triduana orationis continuae',
    ja: '3日間の継続的な祈りの奉献',
    bn: 'তিন দিনের অবিরাম প্রার্থনার উৎসর্গ',
    id: 'Pengudusan doa terus-menerus selama tiga hari',
    ur: 'تین دن کی مسلسل دعا کا وقف',
    sw: 'Kujitolea kwa siku tatu za sala mfululizo'
  },
  dur_9d: {
    es: 'Rezo de novenario litúrgico e intercesión',
    en: 'Liturgical novena prayer and intercession',
    fr: 'Prière de neuvaine liturgique et intercession',
    pt: 'Oração de novenário litúrgico e intercessão',
    it: 'Preghiera della novena liturgica e intercessione',
    de: 'Liturgisches Novenengebet und Fürbitte',
    ru: 'Литургическая новена и предстательство',
    ar: 'صلاة تساعية ليتورجية وشفاعة',
    he: 'תפילת נובנה ליטורגית ובקשת רחמים',
    hi: 'धर्मविधि नौ-दिवसीय प्रार्थना एवं मध्यस्थता',
    zh: '九日敬礼祈祷与代祷',
    la: 'Oratio novenaria liturgica et intercessio',
    ja: '典礼ノベナの祈りと執り成し',
    bn: 'নয় দিনের প্রার্থনানুষ্ঠান ও মধ্যস্থতা',
    id: 'Doa novena liturgis dan perantaraan',
    ur: 'نو روزہ دعائیہ مناجات اور شفاعت',
    sw: 'Sala ya novena ya kiibada na maombezi'
  },
  dur_21d: {
    es: 'Ciclo de purificación, ayuno y bendición',
    en: 'Cycle of purification, fasting and blessing',
    fr: 'Cycle de purification, jeûne et bénédiction',
    pt: 'Ciclo de purificação, jejum e bênção',
    it: 'Ciclo di purificazione, digiuno e benedizione',
    de: 'Zyklus der Reinigung, des Fastens und des Segens',
    ru: 'Цикл очищения, поста и благословения',
    ar: 'دورة التطهير والصوم والبركة',
    he: 'מחזור טיהור, צום וברכה',
    hi: 'शुद्धिकरण, उपवास और आशीर्वाद का चक्र',
    zh: '净化、斋戒与降福之周期',
    la: 'Cyclus purificationis, ieiunii et benedictionis',
    ja: '浄化、断食、祝福のサイクル',
    bn: 'শুদ্ধিকরণ, উপবাস ও আশীর্বাদের চক্র',
    id: 'Siklus pemurnian, puasa dan berkat',
    ur: 'تزکیہ، روزے اور برکت کا دور',
    sw: 'Mzunguko wa utakaso, mfungo na baraka'
  },
  dur_30d: {
    es: 'Vigilia mensual perpetua en el Altar',
    en: 'Perpetual monthly vigil at the Altar',
    fr: 'Veillée mensuelle perpétuelle à l’Autel',
    pt: 'Vigília mensal perpétua no Altar',
    it: 'Veglia mensile perpetua all’Altare',
    de: 'Fortwährende monatliche Wache am Altar',
    ru: 'Непрестанное ежемесячное бдение у Алтаря',
    ar: 'سهرة شهرية دائمة عند المذبح',
    he: 'משמרת חודשית מתמדת במזבח',
    hi: 'वेदी पर निरंतर मासिक जागरण',
    zh: '圣坛前永续月度守夜',
    la: 'Vigilia menstrua perpetua ad Altare',
    ja: '祭壇での月間継続の祈りの夜警',
    bn: 'বেদিতে স্থায়ী মাসিক প্রার্থনা',
    id: 'Vigili bulanan abadi di Altar',
    ur: 'قربان گاہ پر ماہانہ مستقل جاگرن',
    sw: 'Mkesha wa mwezi mzima wa daima Madhabahuni'
  }
};

export function getDurationDef(hours, lang = 'es') {
  const h = parseInt(hours, 10) || 24;
  const match = CANDLE_DURATIONS.find(d => d.hours === h) || CANDLE_DURATIONS[1];
  const subs = DURATION_SUBTITLES[match.key];
  const subText = (subs && (subs[lang] || subs.en || subs.es)) || match.subtitle;
  return {
    ...match,
    title: t(match.key, lang) || match.title,
    subtitle: subText
  };
}

export class SacredDurationPicker {
  static modalEl = null;
  static currentHours = 24;
  static onSelectCallback = null;

  static ensureModal() {
    let el = document.getElementById('modal-sacred-duration-picker');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-sacred-duration-picker';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 5200; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    SacredDurationPicker.modalEl = el;
  }

  static open({ currentHours = 24, onSelect }) {
    SacredDurationPicker.ensureModal();
    SacredDurationPicker.currentHours = parseInt(currentHours, 10) || 24;
    SacredDurationPicker.onSelectCallback = onSelect;

    SacredDurationPicker.render();
    SacredDurationPicker.modalEl.style.display = 'flex';
    if (SacredDurationPicker.modalEl) SacredDurationPicker.modalEl.scrollTop = 0;
  }

  static close() {
    if (SacredDurationPicker.modalEl) {
      SacredDurationPicker.modalEl.style.display = 'none';
    }
  }

  static render() {
    const activeHours = SacredDurationPicker.currentHours;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const optionsHTML = CANDLE_DURATIONS.map(dur => {
      const isSelected = activeHours === dur.hours;
      const def = getDurationDef(dur.hours, lang);
      return `
        <button type="button" class="report-type-chip ${isSelected ? 'active' : ''} duration-item-btn" data-dur-hours="${dur.hours}" style="width: 100%; padding: 12px 14px; text-align: left; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; box-sizing: border-box; cursor: pointer;">
          <span class="chip-radio-dot"></span>
          <span style="width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--accent-gold);">${renderIcon('ui_time')}</span>
          <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
              <span style="font-size: 0.84rem; font-weight: 800; color: var(--text-primary);">${def.title}</span>
              ${dur.default ? `<span class="hud-pill dot-green" style="font-size: 0.60rem; padding: 1px 6px;">Canónico</span>` : ''}
            </div>
            <span style="font-size: 0.70rem; color: var(--text-secondary); opacity: 0.85;">${dur.subtitle}</span>
          </div>
        </button>
      `;
    }).join('');

    SacredDurationPicker.modalEl.innerHTML = `
      <div class="crystal-card" style="max-width: 460px; width: 100%; margin: auto 0; padding: 22px 16px 26px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box;">
        <button id="btn-close-duration-picker" class="btn-modal-close" title="${t('close_label', lang) || 'Cerrar'}">${renderIcon('ui_close')}</button>

        <!-- Cabecera 100% SVG -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="width: 44px; height: 44px; margin: 0 auto 6px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold), #b45309); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 16px var(--accent-gold-glow);">
            ${renderIcon('ui_time')}
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.25rem; margin: 0 0 4px; color: var(--text-primary);">${t('altar_duration_label', lang)}</h3>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">${t('picker_duration_desc', lang)}</p>
        </div>

        <!-- LISTADO DE DURACIONES -->
        <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 20px;">
          ${optionsHTML}
        </div>

        <!-- BOTÓN DE CERRAR -->
        <button type="button" id="btn-done-duration-picker" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 12px; font-size: 0.88rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer;">
          <span style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px;">${renderIcon('ui_time')}</span>
          <span>${t('picker_duration_confirm', lang)}</span>
        </button>
      </div>
    `;

    SacredDurationPicker.attachEvents();
  }

  static attachEvents() {
    const closeBtn = document.getElementById('btn-close-duration-picker');
    const doneBtn = document.getElementById('btn-done-duration-picker');

    if (closeBtn) closeBtn.addEventListener('click', () => SacredDurationPicker.close());
    if (doneBtn) doneBtn.addEventListener('click', () => SacredDurationPicker.close());

    const itemBtns = SacredDurationPicker.modalEl.querySelectorAll('.duration-item-btn');
    itemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const hours = parseInt(btn.getAttribute('data-dur-hours'), 10);
        SacredDurationPicker.currentHours = hours;

        if (typeof SacredDurationPicker.onSelectCallback === 'function') {
          const selectedItem = CANDLE_DURATIONS.find(d => d.hours === hours);
          if (selectedItem) {
            SacredDurationPicker.onSelectCallback(selectedItem);
          }
        }

        SacredDurationPicker.close();
      });
    });
  }
}
