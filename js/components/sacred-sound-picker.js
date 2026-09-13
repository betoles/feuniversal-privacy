/**
 * SACRED SOUND PICKER MODAL COMPONENT (SELECTOR TÁCTIL DE FRECUENCIAS SAGRADAS)
 * FeUniversal - Faith & Prayers
 * 
 * Reemplaza el select nativo con un modal táctil, amplio, 100% responsivo
 * y con iconografía puramente vectorial SVG (cero emojis).
 */

import { renderIcon } from './icons.js';
import { soundManager } from '../services/sound-service.js';
import { StorageService } from '../services/storage-service.js';
import { MembershipComponent } from './membership.js';

export const SOUND_DEFINITIONS = [
  {
    "id": "silencio_profundo",
    "name": {
      "es": "Silencio Profundo (Sin Sonido)",
      "en": "Deep Silence (No Sound)",
      "pt": "Silêncio Profundo (Sem Som)",
      "fr": "Silence Profond (Sans Son)",
      "it": "Silenzio Profondo (Senza Suono)",
      "de": "Tiefe Stille (Kein Ton)",
      "ru": "Глубокая Тишина (Без Звука)",
      "ar": "الصمت العميق (بدون صوت)",
      "he": "דממה עמוקה (ללא צליל)",
      "hi": "गहरा सन्नाटा (ध्वनि रहित)",
      "zh": "深邃宁静（无声）",
      "la": "Silentium Profundum",
      "ja": "深い静寂（無音）",
      "bn": "গভীর নীরবতা (শব্দহীন)",
      "id": "Keheningan Mendalam (Tanpa Suara)",
      "ur": "گہری خاموشی (بغیر آواز)",
      "sw": "Ukimya Mkuu (Bila Sauti)"
    },
    "desc": {
      "es": "Meditación pura en silencio y calma interior",
      "en": "Pure meditation in silence and inner peace",
      "pt": "Meditação pura em silêncio e calma interior",
      "fr": "Méditation pure dans le silence et le calme intérieur",
      "it": "Pura meditazione nel silenzio e nella calma interiore",
      "de": "Reine Meditation in Stille und innerer Ruhe",
      "ru": "Чистая медитация в тишине и внутреннем покое",
      "ar": "تأمل نقي في صمت وسكينة داخلية",
      "he": "מדיטציה טהורה בדממה ובשלווה פנימית",
      "hi": "शांति और आंतरिक स्थिरता में शुद्ध ध्यान",
      "zh": "在寂静与内心安宁中纯粹冥想",
      "la": "Meditatio pura in silentio et pace interiori",
      "ja": "静寂と内なる静けさの中での純粋な瞑想",
      "bn": "নীরবতা এবং অন্তরের প্রশান্তিতে বিশুদ্ধ ধ্যান",
      "id": "Meditasi murni dalam keheningan dan ketenangan batin",
      "ur": "خاموشی اور اندرونی سکون میں خالص مراقبہ",
      "sw": "Tafakuri safi katika ukimya na utulivu wa ndani"
    },
    "category": "principal",
    "icon": "ui_volume_mute",
    "color": "var(--text-muted)"
  },
  {
    "id": "solfeggio_528",
    "name": {
      "es": "Frecuencia 528 Hz · Catedral del Corazón",
      "en": "Frequency 528 Hz · Heart Cathedral",
      "pt": "Frequência 528 Hz · Catedral do Coração",
      "fr": "Fréquence 528 Hz · Cathédrale du Cœur",
      "it": "Frequenza 528 Hz · Cattedrale del Cuore",
      "de": "Frequenz 528 Hz · Kathedrale des Herzens",
      "ru": "Частота 528 Гц · Собор Сердца",
      "ar": "تردد 528 هرتز · كاتدرائية القلب",
      "he": "תדר 528 הרץ · קתדרלת הלב",
      "hi": "आवृत्ति 528 हर्ट्ज · हृदय अभयारण्य",
      "zh": "528 Hz 频率 · 心灵大教堂",
      "la": "Frequentia 528 Hz · Cordis Cathedra",
      "ja": "528 Hz 周波数 · 心の大聖堂",
      "bn": "৫২৮ হার্টজ কম্পাঙ্ক · হৃদয়ের পবিত্র স্থান",
      "id": "Frekuensi 528 Hz · Katedral Hati",
      "ur": "تعدد 528 ہرٹز · دل کا مقدس مقام",
      "sw": "Masafa ya 528 Hz · Kanisa Kuu la Moyo"
    },
    "desc": {
      "es": "Transformación, sanación celular y arpa celestial",
      "en": "Transformation, cellular healing and celestial harp",
      "pt": "Transformação, cura celular e harpa celestial",
      "fr": "Transformation, guérison cellulaire et harpe céleste",
      "it": "Trasformazione, guarigione cellulare e arpa celeste",
      "de": "Transformation, Zellheilung und himmlische Harfe",
      "ru": "Трансформация, клеточное исцеление и небесная арфа",
      "ar": "التحول والشفاء الخلوي والقيثارة السماوية",
      "he": "התמרה, ריפוי תאי ונבל שמיימי",
      "hi": "परिवर्तन, कोशिकीय उपचार और दिव्य वीणा",
      "zh": "转化、细胞疗愈与天籁之琴",
      "la": "Transformatio, sanatio cellularis et cithara caelestis",
      "ja": "変容、細胞の癒し、天空のハープ",
      "bn": "রূপান্তর, কোষীয় নিরাময় এবং স্বর্গীয় বীণা",
      "id": "Transformasi, penyembuhan seluler dan harpa surgawi",
      "ur": "تبدیلی، خلیاتی شفا اور آسمانی بربط",
      "sw": "Ubadilishaji, uponyaji wa seli na kinubi cha mbinguni"
    },
    "category": "solfeggio",
    "icon": "intent_paz",
    "color": "var(--accent-gold)"
  },
  {
    "id": "solfeggio_432",
    "name": {
      "es": "Frecuencia 432 Hz · Amanecer Cósmico",
      "en": "Frequency 432 Hz · Cosmic Dawn",
      "pt": "Frequência 432 Hz · Amanhecer Cósmico",
      "fr": "Fréquence 432 Hz · Aube Cosmique",
      "it": "Frequenza 432 Hz · Alba Cosmica",
      "de": "Frequenz 432 Hz · Kosmische Dämmerung",
      "ru": "Частота 432 Гц · Космический Рассвет",
      "ar": "تردد 432 هرتز · الفجر الكوني",
      "he": "תדר 432 הרץ · שחר קוסמי",
      "hi": "आवृत्ति 432 हर्ट्ज · ब्रह्मांडीय भोर",
      "zh": "432 Hz 频率 · 宇宙之晓",
      "la": "Frequentia 432 Hz · Aurora Cosmica",
      "ja": "432 Hz 周波数 · 宇宙の夜明け",
      "bn": "৪৩২ হার্টজ কম্পাঙ্ক · মহাজাগতিক ভোর",
      "id": "Frekuensi 432 Hz · Fajar Kosmik",
      "ur": "تعدد 432 ہرٹز · کائناتی سحر",
      "sw": "Masafa ya 432 Hz · Alfajiri ya Ulimwengu"
    },
    "desc": {
      "es": "Armonía con la naturaleza y cuerdas de santuario",
      "en": "Harmony with nature and sanctuary strings",
      "pt": "Harmonia com a natureza e cordas de santuário",
      "fr": "Harmonie avec la nature et cordes de sanctuaire",
      "it": "Armonia con la natura e corde del santuario",
      "de": "Harmonie mit der Natur und Saiten des Heiligtums",
      "ru": "Гармония с природой и струны святилища",
      "ar": "الانسجام مع الطبيعة وأوتار الملاذ المقدس",
      "he": "הרמוניה עם הטבע ומיתרי המקדש",
      "hi": "प्रकृति के साथ सामंजस्य और पावन तार",
      "zh": "与自然的和谐及圣殿之音",
      "la": "Harmonia cum natura et chordae sanctuarii",
      "ja": "自然との調和と聖域の調べ",
      "bn": "প্রকৃতির সাথে সম্প্রীতি এবং পবিত্র বাদ্য",
      "id": "Harmoni dengan alam dan senar tempat suci",
      "ur": "فطرت کے ساتھ ہم آہنگی اور مقدس ساز",
      "sw": "Upatano na asili na nyuzi za patakatifu"
    },
    "category": "solfeggio",
    "icon": "time_dawn",
    "color": "#fbbf24"
  },
  {
    "id": "solfeggio_963",
    "name": {
      "es": "Frecuencia 963 Hz · Corona de Luz",
      "en": "Frequency 963 Hz · Crown of Light",
      "pt": "Frequência 963 Hz · Coroa de Luz",
      "fr": "Fréquence 963 Hz · Couronne de Lumière",
      "it": "Frequenza 963 Hz · Corona di Luce",
      "de": "Frequenz 963 Hz · Krone des Lichts",
      "ru": "Частота 963 Гц · Венец Света",
      "ar": "تردد 963 هرتز · تاج النور",
      "he": "תדר 963 הרץ · כתר האור",
      "hi": "आवृत्ति 963 हर्ट्ज · प्रकाश का मुकुट",
      "zh": "963 Hz 频率 · 光之王冠",
      "la": "Frequentia 963 Hz · Corona Lucis",
      "ja": "963 Hz 周波数 · 光の王冠",
      "bn": "৯৬৩ হার্টজ কম্পাঙ্ক · আলোর মুকুট",
      "id": "Frekuensi 963 Hz · Mahkota Cahaya",
      "ur": "تعدد 963 ہرٹز · نور کا تاج",
      "sw": "Masafa ya 963 Hz · Taji la Nuru"
    },
    "desc": {
      "es": "Conexión espiritual superior y coros celestiales",
      "en": "Higher spiritual connection and celestial choirs",
      "pt": "Conexão espiritual superior e coros celestiais",
      "fr": "Connexion spirituelle supérieure et chœurs célestes",
      "it": "Connessione spirituale superiore e cori celesti",
      "de": "Höhere spirituelle Verbindung und himmlische Chöre",
      "ru": "Высшая духовная связь и небесные хоры",
      "ar": "الاتصال الروحي الأسمى والجوقات السماوية",
      "he": "חיבור רוחני עליון ומקהלות שמיים",
      "hi": "उच्च आध्यात्मिक संबंध और दिव्य गान",
      "zh": "崇高灵性连结与天际合唱",
      "la": "Superior conexio spiritualis et chori caelestes",
      "ja": "崇高なスピリチュアルな繋がりと天空の合唱",
      "bn": "উচ্চতর আধ্যাত্মিক সংযোগ এবং স্বর্গীয় ঐকতান",
      "id": "Koneksi spiritual tinggi dan paduan suara surgawi",
      "ur": "اعلیٰ روحانی رابطہ اور آسمانی ترانے",
      "sw": "Muungano wa juu wa kiroho na kwaya za mbinguni"
    },
    "category": "solfeggio",
    "icon": "ui_sparkles",
    "color": "#a855f7"
  },
  {
    "id": "ondas_alfa",
    "name": {
      "es": "Ondas Alfa (10 Hz) · Paz Serena",
      "en": "Alpha Waves (10 Hz) · Serene Peace",
      "pt": "Ondas Alfa (10 Hz) · Paz Serena",
      "fr": "Ondes Alpha (10 Hz) · Paix Sereine",
      "it": "Onde Alfa (10 Hz) · Pace Serena",
      "de": "Alpha-Wellen (10 Hz) · Heitere Ruhe",
      "ru": "Альфа-волны (10 Гц) · Безмятежный Покой",
      "ar": "موجات ألفا (10 هرتز) · سلام هادئ",
      "he": "גלי אלפא (10 הרץ) · שלווה שלווה",
      "hi": "अल्फा तरंगें (10 हर्ट्ज) · शांत शांति",
      "zh": "阿尔法波（10 Hz）· 宁静和平",
      "la": "Undae Alpha (10 Hz) · Pax Serena",
      "ja": "アルファ波（10 Hz）· 穏やかな平和",
      "bn": "আলফা তরঙ্গ (১০ হার্টজ) · নির্মল শান্তি",
      "id": "Gelombang Alfa (10 Hz) · Kedamaian Tenang",
      "ur": "الفا لہریں (10 ہرٹز) · پرسکون امن",
      "sw": "Mawimbi ya Alfa (10 Hz) · Amani Tulivu"
    },
    "desc": {
      "es": "Estado de relajación consciente y cuerdas de cristal",
      "en": "Conscious relaxation state and crystal strings",
      "pt": "Estado de relaxamento consciente e cordas de cristal",
      "fr": "État de relaxation consciente et cordes de cristal",
      "it": "Stato di rilassamento cosciente e corde di cristallo",
      "de": "Bewusster Entspannungszustand und Kristallsaiten",
      "ru": "Состояние осознанного расслабления и хрустальные струны",
      "ar": "حالة الاسترخاء الواعي وأوتار الكريستال",
      "he": "מצב הרפיה מודעת ומיתרי קריסטל",
      "hi": "सचेत विश्राम की स्थिति और क्रिस्टल तार",
      "zh": "觉知放松状态与水晶琴弦",
      "la": "Status relaxationis consciae et chordae crystallinae",
      "ja": "意識的なリラクゼーション状態とクリスタルの弦",
      "bn": "সচেতন শিথিলতার অবস্থা এবং স্ফটিক বাদ্য",
      "id": "Kondisi relaksasi sadar dan senar kristal",
      "ur": "با ہوش سکون کی حالت اور بلوری تاریں",
      "sw": "Hali ya utulivu wa ufahamu na nyuzi za kioo"
    },
    "category": "brainwaves",
    "icon": "ui_audio",
    "color": "var(--accent-cyan)"
  },
  {
    "id": "ondas_theta",
    "name": {
      "es": "Ondas Theta (6 Hz) · Santuario Cósmico",
      "en": "Theta Waves (6 Hz) · Cosmic Sanctuary",
      "pt": "Ondas Theta (6 Hz) · Santuário Cósmico",
      "fr": "Ondes Thêta (6 Hz) · Sanctuaire Cosmique",
      "it": "Onde Theta (6 Hz) · Santuario Cosmico",
      "de": "Theta-Wellen (6 Hz) · Kosmisches Heiligtum",
      "ru": "Тета-волны (6 Гц) · Космическое Святилище",
      "ar": "موجات ثيتا (6 هرتز) · الملاذ الكوني",
      "he": "גלי תטא (6 הרץ) · מקדש קוסמי",
      "hi": "थीटा तरंगें (6 हर्ट्ज) · ब्रह्मांडीय अभयारण्य",
      "zh": "西塔波（6 Hz）· 宇宙圣所",
      "la": "Undae Theta (6 Hz) · Sanctuarium Cosmicum",
      "ja": "シータ波（6 Hz）· 宇宙の聖域",
      "bn": "থিটা তরঙ্গ (৬ হার্টজ) · মহাজাগতিক আশ্রয়",
      "id": "Gelombang Theta (6 Hz) · Suaka Kosmik",
      "ur": "تھیٹا لہریں (6 ہرٹز) · کائناتی پناہ گاہ",
      "sw": "Mawimbi ya Theta (6 Hz) · Patakatifu pa Ulimwengu"
    },
    "desc": {
      "es": "Meditación profunda, introspección y drones sagrados",
      "en": "Deep meditation, introspection and sacred drones",
      "pt": "Meditação profunda, introspecção e drones sagrados",
      "fr": "Méditation profonde, introspection et drones sacrés",
      "it": "Meditazione profonda, introspezione e droni sacri",
      "de": "Tiefe Meditation, Introspektion und heilige Drones",
      "ru": "Глубокая медитация, интроспекция и священные дроны",
      "ar": "التأمل العميق والاستبطان والنغمات المقدسة",
      "he": "מדיטציה עמוקה, התבוננות פנימית וצלילים מקודשים",
      "hi": "गहरा ध्यान, आत्मनिरीक्षण और पावन गूंज",
      "zh": "深度冥想、内省与神圣和鸣",
      "la": "Meditatio profunda, introspectio et soni sacri",
      "ja": "深い瞑想、内省、神聖なドローン",
      "bn": "গভীর ধ্যান, অন্তর্দৃষ্টি এবং পবিত্র ধ্বনি",
      "id": "Meditasi mendalam, introspeksi dan dengung sakral",
      "ur": "گہرا مراقبہ، خود شناسی اور مقدس گونج",
      "sw": "Tafakuri ya kina, kujitafakari na mivumo mitakatifu"
    },
    "category": "brainwaves",
    "icon": "nav_altar",
    "color": "var(--accent-indigo)"
  },
  {
    "id": "ondas_delta",
    "name": {
      "es": "Ondas Delta (2.5 Hz) · Manto de Noche",
      "en": "Delta Waves (2.5 Hz) · Night Mantle",
      "pt": "Ondas Delta (2.5 Hz) · Manto da Noite",
      "fr": "Ondes Delta (2.5 Hz) · Manteau de Nuit",
      "it": "Onde Delta (2.5 Hz) · Manto di Notte",
      "de": "Delta-Wellen (2.5 Hz) · Nachtmantel",
      "ru": "Дельта-волны (2.5 Гц) · Покров Ночи",
      "ar": "موجات دلتا (2.5 هرتز) · عباءة الليل",
      "he": "גלי דלתא (2.5 הרץ) · מעטה הלילה",
      "hi": "डेल्टा तरंगें (2.5 हर्ट्ज) · रात की चादर",
      "zh": "德尔塔波（2.5 Hz）· 夜之华盖",
      "la": "Undae Delta (2.5 Hz) · Pallium Noctis",
      "ja": "デルタ波（2.5 Hz）· 夜の帳",
      "bn": "ডেল্টা তরঙ্গ (২.৫ হার্টজ) · রাতের চাদর",
      "id": "Gelombang Delta (2.5 Hz) · Selimut Malam",
      "ur": "ڈیلٹا لہریں (2.5 ہرٹز) · رات کی چادر",
      "sw": "Mawimbi ya Delta (2.5 Hz) · Joho la Usiku"
    },
    "desc": {
      "es": "Sueño reparador, descanso profundo y sanación",
      "en": "Restful sleep, deep rest and healing",
      "pt": "Sono reparador, descanso profundo e cura",
      "fr": "Sommeil réparateur, repos profond et guérison",
      "it": "Sonno ristoratore, riposo profondo e guarigione",
      "de": "Erholsamer Schlaf, tiefe Ruhe und Heilung",
      "ru": "Восстановительный сон, глубокий отдых и исцеление",
      "ar": "نوم مريح وراحة عميقة وشفاء",
      "he": "שינה משקמת, מנוחה עמוקה וריפוי",
      "hi": "गहरी नींद, विश्राम और उपचार",
      "zh": "安眠、深沉休息与身心疗愈",
      "la": "Somnus reficiens, requies profunda et sanatio",
      "ja": "回復的な睡眠、深い休息、癒し",
      "bn": "শান্তিপূর্ণ ঘুম, গভীর বিশ্রাম এবং নিরাময়",
      "id": "Tidur nyenyak, istirahat mendalam dan penyembuhan",
      "ur": "پرسکون نیند، گہرا آرام اور شفا",
      "sw": "Usingizi mzuri, mapumziko mazito na uponyaji"
    },
    "category": "brainwaves",
    "icon": "ui_moon",
    "color": "#38bdf8"
  },
  {
    "id": "ondas_gamma",
    "name": {
      "es": "Ondas Gamma (40 Hz) · Resonancia Solar",
      "en": "Gamma Waves (40 Hz) · Solar Resonance",
      "pt": "Ondas Gamma (40 Hz) · Ressonância Solar",
      "fr": "Ondes Gamma (40 Hz) · Résonance Solaire",
      "it": "Onde Gamma (40 Hz) · Risonanza Solare",
      "de": "Gamma-Wellen (40 Hz) · Sonnenresonanz",
      "ru": "Гамма-волны (40 Гц) · Солнечный Резонанс",
      "ar": "موجات غاما (40 هرتز) · الرنين الشمسي",
      "he": "גלי גמא (40 הרץ) · תהודה סולארית",
      "hi": "गामा तरंगें (40 हर्ट्ज) · सौर अनुनाद",
      "zh": "伽马波（40 Hz）· 太阳共鸣",
      "la": "Undae Gamma (40 Hz) · Resonantia Solaris",
      "ja": "ガンマ波（40 Hz）· 太陽の共鳴",
      "bn": "গামা তরঙ্গ (৪০ হার্টজ) · সৌর অনুরণন",
      "id": "Gelombang Gamma (40 Hz) · Resonansi Surya",
      "ur": "گیما لہریں (40 ہرٹز) · شمسی گونج",
      "sw": "Mawimbi ya Gamma (40 Hz) · Mwangwi wa Jua"
    },
    "desc": {
      "es": "Claridad mental, despertar y alta percepción",
      "en": "Mental clarity, awakening and high perception",
      "pt": "Clareza mental, despertar e alta percepção",
      "fr": "Clarté mentale, éveil et haute perception",
      "it": "Chiarezza mentale, risveglio e alta percezione",
      "de": "Geistige Klarheit, Erwachen und hohe Wahrnehmung",
      "ru": "Ясность ума, пробуждение и высшее восприятие",
      "ar": "الوضوح العقلي واليقظة والإدراك العالي",
      "he": "בהירות מחשבתית, התעוררות ותפיסה גבוהה",
      "hi": "मानसिक स्पष्टता, जागृति और उच्च धारणा",
      "zh": "心灵澄明、觉醒与敏锐感知",
      "la": "Claritas mentis, experrectio et perceptio alta",
      "ja": "精神の明晰さ、覚醒、高い知覚",
      "bn": "মানসিক স্বচ্ছতা, জাগরণ এবং উচ্চ উপলব্ধি",
      "id": "Kejelasan pikiran, kebangkitan dan persepsi tinggi",
      "ur": "ذہنی وضاحت، بیداری اور اعلیٰ ادراک",
      "sw": "Uwazi wa kiakili, kuamka na utambuzi wa juu"
    },
    "category": "brainwaves",
    "icon": "ui_sun",
    "color": "#f59e0b"
  },
  {
    "id": "mantra_om",
    "name": {
      "es": "Mantra Sagrado AUM / OM",
      "en": "Sacred Mantra AUM / OM",
      "pt": "Mantra Sagrado AUM / OM",
      "fr": "Mantra Sacré AUM / OM",
      "it": "Mantra Sacro AUM / OM",
      "de": "Heiliges Mantra AUM / OM",
      "ru": "Священная Мантра АУМ / ОМ",
      "ar": "المانترا المقدسة أوم / AUM",
      "he": "מנטרה קדושה AUM / OM",
      "hi": "पवित्र मंत्र ॐ (AUM / OM)",
      "zh": "神圣颂歌 AUM / OM",
      "la": "Mantra Sacrum AUM / OM",
      "ja": "神聖なマントラ AUM / OM",
      "bn": "পবিত্র মন্ত্র ওঁ (AUM / OM)",
      "id": "Mantra Suci AUM / OM",
      "ur": "مقدس منتر اوم (AUM / OM)",
      "sw": "Mantra Takatifu AUM / OM"
    },
    "desc": {
      "es": "Resonancia primordial védica de unidad universal",
      "en": "Vedic primordial resonance of universal unity",
      "pt": "Ressonância primordial védica de unidade universal",
      "fr": "Résonance primordiale védique de l’unité universelle",
      "it": "Risonanza primordiale vedica di unità universale",
      "de": "Vedische Ur-Resonanz universeller Einheit",
      "ru": "Ведический изначальный резонанс вселенского единства",
      "ar": "الرنين الفيدي البدائي للوحدة الكونية",
      "he": "תהודה ודית קדמונית של אחדות קוסמית",
      "hi": "सार्वभौमिक एकता की वैदिक मौलिक गूंज",
      "zh": "宇宙合一的吠陀原始共鸣",
      "la": "Resonantia primordialis Vedica unitatis universalis",
      "ja": "普遍的な調和のヴェーダ原初の共鳴",
      "bn": "সার্বজনীন ঐক্যের বৈদিক আদি অনুরণন",
      "id": "Resonansi primordial Weda tentang kesatuan universal",
      "ur": "عالمگیر اتحاد کی ویدک بنیادی گونج",
      "sw": "Mwangwi wa kimsingi wa umoja wa ulimwengu wote"
    },
    "category": "temples",
    "icon": "ui_sacred_flame",
    "color": "#f97316"
  },
  {
    "id": "canto_ram",
    "name": {
      "es": "Vibración Semilla RAM · Fuego Solar",
      "en": "Seed Vibration RAM · Solar Fire",
      "pt": "Vibração Semente RAM · Fogo Solar",
      "fr": "Vibration Racine RAM · Feu Solaire",
      "it": "Vibrazione Radice RAM · Fuoco Solare",
      "de": "Samen-Vibration RAM · Sonnenfeuer",
      "ru": "Семя-вибрация РАМ · Солнечный Огонь",
      "ar": "اهتزاز البذرة رام · النار الشمسية",
      "he": "רטט הזרע RAM · אש שמש",
      "hi": "बीज ध्वनि रं (RAM) · सौर अग्नि",
      "zh": "种子音波 RAM · 太阳圣火",
      "la": "Vibratio Seminis RAM · Ignis Solaris",
      "ja": "シード音波 RAM · 太陽の炎",
      "bn": "বীজ ধ্বনি রং (RAM) · সৌর আগুন",
      "id": "Getaran Benih RAM · Api Surya",
      "ur": "بیج ارتعاش رام · شمسی آگ",
      "sw": "Mtetemo wa Mbegu RAM · Moto wa Jua"
    },
    "desc": {
      "es": "Energía de purificación, valor y protección",
      "en": "Purification energy, courage and divine protection",
      "pt": "Energia de purificação, coragem e proteção",
      "fr": "Énergie de purification, de courage et de protection",
      "it": "Energia di purificazione, coraggio e protezione",
      "de": "Reinigende Energie, Mut und Schutz",
      "ru": "Энергия очищения, мужества и защиты",
      "ar": "طاقة التطهير والشجاعة والحماية",
      "he": "אנרגיה של טיהור, אומץ והגנה",
      "hi": "शुद्धि, साहस और पावन सुरक्षा की ऊर्जा",
      "zh": "净化、勇气与护佑之能量",
      "la": "Energia purificationis, virtutis et tutelae",
      "ja": "浄化、勇気、保護のエネルギー",
      "bn": "শুদ্ধি, সাহস এবং সুরক্ষার শক্তি",
      "id": "Energi penyucian, keberanian dan perlindungan ilahi",
      "ur": "پاکیزگی، شجاعت اور حفاظت کی توانائی",
      "sw": "Nguvu ya utakaso, ujasiri na ulinzi mtakatifu"
    },
    "category": "temples",
    "icon": "intent_fortaleza",
    "color": "#ef4444"
  },
  {
    "id": "campanas_monasterio",
    "name": {
      "es": "Campanas de Monasterio Zen",
      "en": "Zen Monastery Bells",
      "pt": "Sinos de Mosteiro Zen",
      "fr": "Cloches de Monastère Zen",
      "it": "Campane del Monastero Zen",
      "de": "Zen-Klosteglocken",
      "ru": "Колокола Дзен-Монастыря",
      "ar": "أجراس دير الزن",
      "he": "פעמוני מנזר זן",
      "hi": "ज़ेन मठ की घंटियाँ",
      "zh": "禅宗寺院钟声",
      "la": "Campanae Monasterii Zen",
      "ja": "禅寺の鐘",
      "bn": "জেন মঠের ঘণ্টা",
      "id": "Lonceng Biara Zen",
      "ur": "زین خانقاہ کی گھنٹیاں",
      "sw": "Kengele za Monasteri ya Zen"
    },
    "desc": {
      "es": "Toques de campana tradicional y templo de paz",
      "en": "Traditional temple bell chimes for mindful peace",
      "pt": "Toques de sino tradicional e templo de paz",
      "fr": "Sons de cloches traditionnelles et temple de paix",
      "it": "Rintocchi di campana tradizionale e tempio di pace",
      "de": "Traditionelle Tempelglockenschläge und Ort des Friedens",
      "ru": "Традиционный колокольный звон храма мира",
      "ar": "دقات أجراس المعبد التقليدية لسلام العقل",
      "he": "צלצול פעמוני מקדש מסורתי לשלווה מודעת",
      "hi": "पारंपरिक मंदिर की घंटियों की शांतिदायक ध्वनि",
      "zh": "传统寺庙钟声带来静心安宁",
      "la": "Campanae traditionalis sonus et templum pacis",
      "ja": "伝統的な寺院の鐘の音と心の静寂",
      "bn": "ঐতিহ্যবাহী মন্দিরের ঘণ্টার প্রশান্ত ধ্বনি",
      "id": "Dentang lonceng kuil tradisional untuk kedamaian batin",
      "ur": "ذہنی سکون کے لیے روایتی مندر کی گھنٹیاں",
      "sw": "Milio ya kengele ya kitamaduni kwa amani ya moyo"
    },
    "category": "temples",
    "icon": "ui_bell",
    "color": "var(--accent-gold)"
  },
  {
    "id": "lluvia_zen",
    "name": {
      "es": "Lluvia Zen Purificadora",
      "en": "Zen Healing Rain",
      "pt": "Chuva Zen Purificadora",
      "fr": "Pluie Zen Purificatrice",
      "it": "Pioggia Zen Purificatrice",
      "de": "Reinigender Zen-Regen",
      "ru": "Очищающий Дзен-Дождь",
      "ar": "مطر الزن الشافي",
      "he": "גשם זן מטהר",
      "hi": "ज़ेन उपचारात्मक वर्षा",
      "zh": "禅意疗愈清雨",
      "la": "Pluvia Zen Purificans",
      "ja": "心を浄化する禅の雨",
      "bn": "জেন নিরাময়কারী বৃষ্টি",
      "id": "Hujan Penyembuhan Zen",
      "ur": "زین شفا بخش بارش",
      "sw": "Mvua ya Uponyaji ya Zen"
    },
    "desc": {
      "es": "Sonido continuo de agua y lluvia serena",
      "en": "Continuous serene rainfall for deep focus",
      "pt": "Som contínuo de água e chuva serena",
      "fr": "Son continu d’eau et de pluie sereine",
      "it": "Suono continuo di pioggia serena e acqua",
      "de": "Kontinuierliches sanftes Regengeräusch für Konzentration",
      "ru": "Непрерывный успокаивающий звук дождя для сосредоточения",
      "ar": "صوت هطول المطر المستمر للتركيز العميق",
      "he": "צליל גשם רגוע ומתמשך לריכוז עמוק",
      "hi": "गहरे ध्यान के लिए शांत वर्षा की ध्वनि",
      "zh": "持续宁静的雨声，助益深度专注",
      "la": "Sonitus continuus pluviae serenae ad attentionem",
      "ja": "深い集中のための静かな雨音",
      "bn": "গভীর মনঃসংযোগের জন্য অবিরাম শান্ত বৃষ্টি",
      "id": "Suara hujan tenang terus-menerus untuk fokus mendalam",
      "ur": "گہرے ارتکاز کے لیے مسلسل پرسکون بارش کی آواز",
      "sw": "Sauti endelevu ya mvua tulivu kwa umakini wa kina"
    },
    "category": "temples",
    "icon": "intent_perdon",
    "color": "#06b6d4"
  },
  {
    "id": "tambores_bata_yoruba",
    "name": {
      "es": "Tambores Batá Sagrados (Santería)",
      "en": "Sacred Batá Drums (Santería)",
      "pt": "Tambores Batá Sagrados (Santería)",
      "fr": "Tambours Batá Sacrés (Santería)",
      "it": "Tamburi Batá Sacri (Santería)",
      "de": "Heilige Batá-Trommeln (Santería)",
      "ru": "Священные Барабаны Бата (Сантерия)",
      "ar": "طبول باتا المقدسة (سانتيريا)",
      "he": "תופי בטה מקודשים (סנטריה)",
      "hi": "पवित्र बाटा ढोल (सेंटेरिया)",
      "zh": "神圣巴塔鼓（桑特里亚）",
      "la": "Tympana Bata Sacra (Santeria)",
      "ja": "神聖なバタドラム（サンテリア）",
      "bn": "পবিত্র বাটা ড্রাম (সান্তেরিয়া)",
      "id": "Gendang Batá Suci (Santería)",
      "ur": "مقدس باٹا ڈھول (سانٹیریا)",
      "sw": "Ngoma Takatifu za Batá (Santería)"
    },
    "desc": {
      "es": "Toque sagrado de Añá y percusión devocional",
      "en": "Sacred rhythm of Añá and devotional percussion",
      "pt": "Toque sagrado de Añá e percussão devocional",
      "fr": "Rythme sacré d’Añá et percussion dévotionnelle",
      "it": "Ritmo sacro di Añá e percussione devozionale",
      "de": "Heiliger Rhythmus von Añá und Andachtsrhythmen",
      "ru": "Священный ритм Анья и молитвенная перкуссия",
      "ar": "الإيقاع المقدس والقرع التعبدي",
      "he": "מקצב קדוש וכלי הקשה דבקותיים",
      "hi": "अन्या की पावन लय और भक्तिमय ताल",
      "zh": "神圣节拍与奉献击鼓",
      "la": "Rhythmus sacer de Añá et percussio devotionalis",
      "ja": "アニャの神聖なリズムと祈りの打楽器",
      "bn": "অনিয়ার পবিত্র তাল এবং ভক্তিমূলক বাদ্য",
      "id": "Ritme suci Añá dan perkusi devosional",
      "ur": "انیا کا مقدس تال اور عقیدت مندانہ موسیقی",
      "sw": "Mdundo mtakatifu wa Añá na ngoma za ibada"
    },
    "category": "temples",
    "icon": "bnav-icon-beads",
    "color": "#d97706"
  },
  {
    "id": "canto_gregoriano",
    "name": {
      "es": "Canto Gregoriano Monástico",
      "en": "Monastic Gregorian Chant",
      "pt": "Canto Gregoriano Monástico",
      "fr": "Chant Grégorien Monastique",
      "it": "Canto Gregoriano Monastico",
      "de": "Monastischer Gregorianischer Choral",
      "ru": "Монастырский Григорианский Хорал",
      "ar": "ترنيمة غريغورية رهبانية",
      "he": "מזמור גרגוריאני נזירי",
      "hi": "मठवासी ग्रेगोरियन भजन",
      "zh": "修道院格里高利圣咏",
      "la": "Cantus Gregorianus Monasticus",
      "ja": "修道院のグレゴリオ聖歌",
      "bn": "সন্ন্যাসীদের গ্রেগরিয়ান সংগীত",
      "id": "Kidung Gregorian Biara",
      "ur": "خانقاہی گریگورین ترانہ",
      "sw": "Nyimbo za Kigregori za Monasteri"
    },
    "desc": {
      "es": "Polifonía sacra medieval en abadía de piedra con resonancia solemne",
      "en": "Medieval sacred polyphony in a stone abbey with solemn resonance",
      "pt": "Polifonia sacra medieval em abadia de pedra com ressonância solene",
      "fr": "Polyphonie sacrée médiévale dans une abbaye de pierre",
      "it": "Polifonia sacra medievale in abbazia di pietra con risonanza solenne",
      "de": "Mittelalterliche sakrale Polyphonie in einer Steinabtei",
      "ru": "Средневековая священная полифония в каменном аббатстве",
      "ar": "بوليفونية مقدسة من العصور الوسطى في دير حجري",
      "he": "פוליפוניה מקודשת של ימי הביניים במנזר אבן",
      "hi": "पत्थर के मठ में मध्यकालीन पवित्र सामंजस्य",
      "zh": "石造修道院中的中世纪神圣复调与肃穆共鸣",
      "la": "Polyphonia sacra mediaevalis in abbatia lapidea",
      "ja": "石造りの修道院に響く中世の厳かな多声聖歌",
      "bn": "পাথরের অ্যাবেতে মধ্যযুগীয় পবিত্র সুরতরঙ্গ",
      "id": "Polifoni sakral abad pertengahan di biara batu yang khusyuk",
      "ur": "پتھر کی خانقاہ میں قرون وسطیٰ کی پرشکوہ روحانی موسیقی",
      "sw": "Sauti takatifu za zama za kati katika abasia ya mawe"
    },
    "category": "temples",
    "icon": "trad_catolicismo",
    "color": "var(--accent-gold)"
  },
  {
    "id": "flauta_shakuhachi_zen",
    "name": {
      "es": "Flauta Shakuhachi Zen",
      "en": "Zen Shakuhachi Flute",
      "pt": "Flauta Shakuhachi Zen",
      "fr": "Flûte Shakuhachi Zen",
      "it": "Flauto Shakuhachi Zen",
      "de": "Zen-Shakuhachi-Flöte",
      "ru": "Дзен Флейта Сякухати",
      "ar": "ناي الشاكو هاتشي الزن",
      "he": "חליל שקוהאצ'י זן",
      "hi": "ज़ेन शाकुहाची बांसुरी",
      "zh": "禅宗尺八长笛",
      "la": "Tibia Shakuhachi Zen",
      "ja": "禅尺八の調べ",
      "bn": "জেন শাকুহাটি বাঁশি",
      "id": "Seruling Shakuhachi Zen",
      "ur": "زین شاکوہاچی بانسری",
      "sw": "Filimbi ya Shakuhachi ya Zen"
    },
    "desc": {
      "es": "Melodía meditativa de bambú japonés y respiración contemplativa",
      "en": "Meditative Japanese bamboo melody for contemplative breathing",
      "pt": "Melodia meditativa de bambu japonês e respiração contemplativa",
      "fr": "Mélodie méditative de bambou japonais et respiration contemplative",
      "it": "Melodia meditativa di bambù giapponese e respiro contemplativo",
      "de": "Meditative japanische Bambusmelodie für kontemplatives Atmen",
      "ru": "Медитативная японская бамбуковая мелодия для созерцательного дыхания",
      "ar": "لحن خيزران ياباني تأملي للتنفس التأملي",
      "he": "מנגינת במבוק יפנית מדיטטיבית לנשימה מודעת",
      "hi": "चिंतनशील श्वास के लिए जापानी बांस की ध्यानमग्न धुन",
      "zh": "日本竹笛冥想旋律与沉思呼吸",
      "la": "Melodia meditativa bambusae iaponicae",
      "ja": "瞑想的な日本の竹笛と静寂の呼吸",
      "bn": "ধ্যানমগ্ন জাপানি বাঁশের সুর ও প্রশান্ত শ্বাস",
      "id": "Melodi bambu Jepang meditasi untuk pernapasan kontemplatif",
      "ur": "مراقباتی سانسوں کے لیے جاپانی بانس کی پرسکون دھن",
      "sw": "Mlio wa mianzi wa Kijapani kwa ajili ya kupumua kwa utulivu"
    },
    "category": "temples",
    "icon": "trad_budismo",
    "color": "#10b981"
  },
  {
    "id": "shofar_mistico",
    "name": {
      "es": "Shofar Místico del Desierto",
      "en": "Mystic Desert Shofar",
      "pt": "Shofar Místico do Deserto",
      "fr": "Chofar Mystique du Désert",
      "it": "Shofar Mistico del Deserto",
      "de": "Mystisches Wüsten-Schofar",
      "ru": "Мистический Шофар Пустыни",
      "ar": "بوق الشوفار الصوفي الصحراوي",
      "he": "שופר מדברי מיסטי",
      "hi": "रहस्यमय मरुस्थलीय शोफ़ार",
      "zh": "神秘荒漠羊角号",
      "la": "Shofar Mysticum Deserti",
      "ja": "荒野の神秘的なショファール",
      "bn": "মরুভূমির রহস্যময় শোফার",
      "id": "Shofar Mistis Padang Pasir",
      "ur": "صحرائی صوفیانہ شوفار",
      "sw": "Shofari ya Ajabu ya Jangwani"
    },
    "desc": {
      "es": "Llamada sagrada ancestral de cuerno y eco en las dunas sagradas",
      "en": "Ancestral sacred horn call echoing across desert dunes",
      "pt": "Chamada sagrada ancestral de chifre e eco nas dunas",
      "fr": "Appel sacré ancestral du cor résonnant dans le désert",
      "it": "Chiamata sacra ancestrale di corno ed eco nelle dune",
      "de": "Uralter heiliger Hornruf, der durch die Wüstendünen hallt",
      "ru": "Древний священный призыв рога в безмолвии пустыни",
      "ar": "نداء القرن المقدس القديم الذي يتردد عبر الكثبان الرملية",
      "he": "קריאת שופר מקודשת ועתיקה המהדהדת במדבר",
      "hi": "मरुस्थल के टीलों में गूंजती प्राचीन पावन पुकार",
      "zh": "回荡在神圣沙丘上的古老号角之声",
      "la": "Clamor sacer cornu antiqui in deserto",
      "ja": "砂漠の砂丘に響き渡る古代の神聖な角笛の呼び声",
      "bn": "মরুভূমির বালিয়াড়িতে প্রতিধ্বনিত প্রাচীন পবিত্র শৃঙ্গধ্বনি",
      "id": "Panggilan tanduk sakral kuno bergema di bukit pasir",
      "ur": "صحرائی ٹیلوں میں گونجتی ہوئی قدیم مقدس سینگ کی پکار",
      "sw": "Wito mtakatifu wa pembe ya kale ukivuma jangwani"
    },
    "category": "temples",
    "icon": "trad_hebreo",
    "color": "#f59e0b"
  },
  {
    "id": "fuego_copal",
    "name": {
      "es": "Fuego y Copal Sagrado",
      "en": "Sacred Fire & Copal Resin",
      "pt": "Fogo e Copal Sagrado",
      "fr": "Feu Sacré & Résine de Copal",
      "it": "Fuoco e Copale Sacro",
      "de": "Heiliges Feuer & Kopalharz",
      "ru": "Священный Огонь и Копаловая Смола",
      "ar": "النار المقدسة وراتنج الكوبال",
      "he": "אש מקודשת ושרף קופאל",
      "hi": "पवित्र अग्नि और लोबान की धूप",
      "zh": "神圣圣火与柯巴香脂",
      "la": "Ignis Sacer et Resina Copal",
      "ja": "聖なる炎とコパルの薫香",
      "bn": "পবিত্র অগ্নি ও সুগন্ধি ধূপ",
      "id": "Api Suci & Damar Kopal",
      "ur": "مقدس آگ اور لوبان کی دھونی",
      "sw": "Moto Mtakatifu na Uvumba wa Copal"
    },
    "desc": {
      "es": "Leña crepitante, brasas purificadoras y humo de resina ancestral",
      "en": "Crackling wood, purifying embers, and ancestral aromatic resin smoke",
      "pt": "Lenha estalando, brasas purificadoras e fumo de resina ancestral",
      "fr": "Bois crépitant, braises purificatrices et fumée d’encens",
      "it": "Legna scoppiettante, braci purificatrici e fumo di resina ancestrale",
      "de": "Knisterndes Holz, reinigende Glut und uralter Weihrauch",
      "ru": "Потрескивающие дрова, очищающие угли и ароматный дым смолы",
      "ar": "حطب طقطقة وجمر منقي ودخان راتينج عطري قديم",
      "he": "עצי בעירה מפצפצים, גחלים מטהרות ועשן קטורת עתיק",
      "hi": "चटकती लकड़ियाँ, शुद्ध करने वाले अंगारे और पवित्र धूप की सुगंध",
      "zh": "劈啪作响的木柴、净化心灵的炭火与古老树脂香烟",
      "la": "Lignum crepitans, carbones purificantes et fumus resinae",
      "ja": "パチパチとはぜる薪、浄化の熾火、古代の樹脂の神聖な煙",
      "bn": "অগ্নিশিখার মৃদু শব্দ, পবিত্র অঙ্গার এবং প্রাচীন সুগন্ধি ধোঁয়া",
      "id": "Kayu berderak, bara api pemurni dan asap damar aromatik",
      "ur": "جلتی لکڑیاں، پاک کرنے والے انگارے اور معطر دھواں",
      "sw": "Kuni zinazopasuka, makaa ya kutakasa na moshi wa manukato"
    },
    "category": "temples",
    "icon": "nav_altar",
    "color": "#ea580c"
  },
  {
    "id": "viento_monte",
    "name": {
      "es": "Viento en la Cumbre (Monte Sagrado)",
      "en": "Mountain Wind (Sacred Summit)",
      "pt": "Vento na Montanha (Cume Sagrado)",
      "fr": "Vent sur le Sommet (Mont Sacré)",
      "it": "Vento sulla Vetta (Monte Sacro)",
      "de": "Bergwind (Heiliger Gipfel)",
      "ru": "Горный Ветер (Священная Вершина)",
      "ar": "رياح الجبل (القمة المقدسة)",
      "he": "רוח הרים (פסגה מקודשת)",
      "hi": "पर्वतीय वायु (पवित्र शिखर)",
      "zh": "圣山清风（神圣之巅）",
      "la": "Ventus Montis (Vertex Sacer)",
      "ja": "聖峰の風（高山の静寂）",
      "bn": "পাহাড়ি বাতাস (পবিত্র শিখর)",
      "id": "Angin Gunung (Puncak Suci)",
      "ur": "پہاڑی ہوا (مقدس چوٹی)",
      "sw": "Upepo wa Mlima (Kilele Kitakatifu)"
    },
    "desc": {
      "es": "Brisa serena y profunda que despeja la mente y eleva el espíritu",
      "en": "Serene and deep mountain breeze that clears the mind and elevates the spirit",
      "pt": "Brisa serena e profunda que limpa a mente e eleva o espírito",
      "fr": "Brise sereine et profonde qui clarifie l'esprit et élève l'âme",
      "it": "Brezza serena e profonda che rasserena la mente ed eleva lo spirito",
      "de": "Ruhige und tiefe Bergbrise, die den Geist klärt und die Seele erhebt",
      "ru": "Безмятежный и глубокий горный бриз, очищающий разум и возвышающий дух",
      "ar": "نسيم جبلي هادئ وعميق يصفي الذهن ويرتقي بالروح",
      "he": "בריזת הרים שלווה ועמוקה המטהרת את הנפש ומרוממת את הרוח",
      "hi": "शांत और गंभीर पर्वतीय समीर जो मन को निर्मल और आत्मा को उन्नत बनाती है",
      "zh": "清澈深邃的圣山微风，澄澈心灵，升华精神",
      "la": "Aura serena et profunda mentem purificans et animum erigens",
      "ja": "心を研ぎ澄まし魂を高揚させる静かで深い山のそよ風",
      "bn": "প্রশান্ত ও গভীর পাহাড়ি সমীরণ যা মনকে স্থির ও আত্মাকে উন্নত করে",
      "id": "Hembusan angin gunung tenang yang menjernihkan pikiran dan membangkitkan jiwa",
      "ur": "پرسکون اور گہری پہاڑی ہوا جو ذہن کو پرسکون اور روح کو بلند کرتی ہے",
      "sw": "Upepo mwanana wa milimani unaotuliza akili na kuinua roho"
    },
    "category": "nature",
    "icon": "ui_audio",
    "color": "#38bdf8"
  }
];

export class SacredSoundPicker {
  static modalEl = null;
  static selectedSoundId = 'silencio_profundo';
  static onSelectCallback = null;

  static ensureModal() {
    let el = document.getElementById('modal-sacred-sound-picker');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-sacred-sound-picker';
      el.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); z-index: 6200; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;';
      document.body.appendChild(el);
    }
    SacredSoundPicker.modalEl = el;
  }

  static open(params = {}) {
    SacredSoundPicker.ensureModal();
    const initialId = params.currentSound || params.currentSoundId || 'silencio_profundo';
    SacredSoundPicker.selectedSoundId = initialId;
    SacredSoundPicker.onSelectCallback = params.onSelect;

    SacredSoundPicker.render();
    SacredSoundPicker.modalEl.style.display = 'flex';
    if (SacredSoundPicker.modalEl) SacredSoundPicker.modalEl.scrollTop = 0;
  }

  static close() {
    if (SacredSoundPicker.modalEl) {
      SacredSoundPicker.modalEl.style.display = 'none';
    }
  }

  static getSoundDef(soundId, lang = 'es') {
    let sid = soundId;
    if (sid === 'frecuencia_432' || sid === 'solfeggio_396') sid = 'solfeggio_432';
    if (sid === 'frecuencia_528') sid = 'solfeggio_528';
    if (sid === 'campanas_catedral') sid = 'campanas_monasterio';
    const raw = SOUND_DEFINITIONS.find(s => s.id === sid) || SOUND_DEFINITIONS.find(s => s.id === soundId) || SOUND_DEFINITIONS[0];
    const nameStr = (typeof raw.name === 'object') ? (raw.name[lang] || raw.name.es || raw.name.en || raw.id) : raw.name;
    const descStr = (typeof raw.desc === 'object') ? (raw.desc[lang] || raw.desc.es || raw.desc.en || '') : raw.desc;
    return {
      ...raw,
      id: raw.id,
      name: nameStr,
      desc: descStr,
      nameObj: raw.name,
      descObj: raw.desc,
      icon: raw.icon || 'ui_audio',
      color: raw.color || 'var(--accent-gold)'
    };
  }

    static render() {
    const activeId = SacredSoundPicker.selectedSoundId;
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';

    const i18n = {
      title: {
        es: 'Frecuencias & Paisajes Sonoros',
        en: 'Frequencies & Soundscapes',
        fr: 'Fréquences & Paysages Sonores',
        pt: 'Frequências & Paisagens Sonoras',
        it: 'Frequenze & Paesaggi Sonori',
        de: 'Frequenzen & Klanglandschaften',
        ru: 'Частоты и Звуковые Пейзажи',
        ar: 'الترددات والمشاهد الصوتية',
        he: 'תדרים ונופי צליל',
        hi: 'आवृत्तियाँ और पावन ध्वनियाँ',
        zh: '频率与神圣音景',
        la: 'Frequentiae et Sonitus Sacri',
        ja: '周波数と神聖な音風景',
        bn: 'কম্পাঙ্ক ও পবিত্র সুরতরঙ্গ',
        id: 'Frekuensi & Lanskap Suara',
        ur: 'تعدد اور مقدس آوازیں',
        sw: 'Masafa na Sauti Takatifu'
      },
      subtitle: {
        es: 'Elige el ambiente acústico para acompañar tus lecturas y rezos.',
        en: 'Choose acoustic ambience to accompany your reading and prayers.',
        fr: 'Choisissez l’ambiance acoustique pour accompagner vos lectures et prières.',
        pt: 'Escolha o ambiente acústico para acompanhar suas leituras e orações.',
        it: 'Scegli l’ambiente acustico per accompagnare le tue letture e preghiere.',
        de: 'Wählen Sie die akustische Atmosphäre für Ihre Lesungen und Gebete.',
        ru: 'Выберите акустическую атмосферу для сопровождения чтения и молитв.',
        ar: 'اختر الأجواء الصوتية لمرافقة قراءاتك وصلواتك.',
        he: 'בחר את האווירה האקוסטית ללוות את קריאותיך ותפילותיך.',
        hi: 'अपने पठन और प्रार्थना के साथ सुनने के लिए शांत वातावरण चुनें।',
        zh: '选择清幽声境陪伴您的诵读与祷告。',
        la: 'Elige ambientem acusticum ad lectiones et orationes comitandas.',
        ja: '読書や祈りに寄り添う神聖な音響空間をお選びください。',
        bn: 'আপনার পাঠ ও প্রার্থনার জন্য পবিত্র ধ্বনি পরিবেশ নির্বাচন করুন।',
        id: 'Pilih suasana akustik untuk menemani bacaan dan doa Anda.',
        ur: 'اپنے مطالعے اور دعاؤں کے لیے پرسکون صوتی ماحول منتخب کریں۔',
        sw: 'Chagua mazingira ya sauti ya kuandamana na masomo na sala zako.'
      },
      catSolfeggio: {
        es: 'Frecuencias Sagradas Solfeggio',
        en: 'Sacred Solfeggio Frequencies',
        fr: 'Fréquences Sacrées Solfeggio',
        pt: 'Frequências Sagradas Solfeggio',
        it: 'Frequenze Sacre Solfeggio',
        de: 'Heilige Solfeggio-Frequenzen',
        ru: 'Священные Частоты Сольфеджио',
        ar: 'ترددات سولفيجيو المقدسة',
        he: 'תדרי סולפג׳יו מקודשים',
        hi: 'पवित्र सोल्फगियो आवृत्तियाँ',
        zh: '神圣索尔菲吉奥频率',
        la: 'Frequentiae Sacrae Solfeggio',
        ja: '神聖ソルフェジオ周波数',
        bn: 'পবিত্র সলফেজিও কম্পাঙ্ক',
        id: 'Frekuensi Solfeggio Kudus',
        ur: 'مقدس سولفیجیو فریکوئنسی',
        sw: 'Masafa Matakatifu ya Solfeggio'
      },
      catBrainwaves: {
        es: 'Ondas Cerebrales & Armonía',
        en: 'Brainwaves & Harmony',
        fr: 'Ondes Cérébrales & Harmonie',
        pt: 'Ondas Cerebrais & Harmonia',
        it: 'Onde Cerebrali & Armonia',
        de: 'Gehirnwellen & Harmonie',
        ru: 'Мозговые Волны и Гармония',
        ar: 'الموجات الدماغية والانسجام',
        he: 'גלי מוח והרמוניה',
        hi: 'मस्तिष्क तरंगें एवं सामंजस्य',
        zh: '脑波共振与和谐',
        la: 'Undae Cerebri et Harmonia',
        ja: '脳波とハーモニー',
        bn: 'মস্তিষ্কের তরঙ্গ ও সম্প্রীতি',
        id: 'Gelombang Otak & Harmoni',
        ur: 'دماغی لہریں اور ہم آہنگی',
        sw: 'Mawimbi ya Ubongo na Maelewano'
      },
      catTemples: {
        es: 'Cánticos, Mantras & Templos',
        en: 'Chants, Mantras & Temples',
        fr: 'Chants, Mantras & Temples',
        pt: 'Cânticos, Mantras & Templos',
        it: 'Canti, Mantra & Templi',
        de: 'Gesänge, Mantras & Tempel',
        ru: 'Песнопения, Мантры и Храмы',
        ar: 'الترانيم والمانترا والمعابد',
        he: 'מזמורים, מנטרות ומקדשים',
        hi: 'भजन, मंत्र और मंदिर',
        zh: '颂歌、真言与圣殿',
        la: 'Cantus, Mantra et Templa',
        ja: '聖歌、マントラ、寺院',
        bn: 'স্তোত্র, মন্ত্র ও মন্দির',
        id: 'Kidung, Mantra & Kuil',
        ur: 'نغمات، منتر اور عبادت گاہیں',
        sw: 'Nyimbo, Mantra na Hekalu'
      },
      confirmBtn: {
        es: 'Aceptar y Guardar Selección',
        en: 'Confirm Selection',
        fr: 'Confirmer la Sélection',
        pt: 'Confirmar Seleção',
        it: 'Conferma Selezione',
        de: 'Auswahl Bestätigen',
        ru: 'Подтвердить выбор',
        ar: 'تأكيد الاختيار',
        he: 'אישור ובחירה',
        hi: 'चयन की पुष्टि करें',
        zh: '确认并保存选择',
        la: 'Electionem Confirmare',
        ja: '選択を確定して保存',
        bn: 'নির্বাচন নিশ্চিত করুন',
        id: 'Konfirmasi Pilihan',
        ur: 'انتخاب کی تصدیق کریں',
        sw: 'Thibitisha Chaguo'
      },
      close: {
        es: 'Cerrar',
        en: 'Close',
        fr: 'Fermer',
        pt: 'Fechar',
        it: 'Chiudi',
        de: 'Schließen',
        ru: 'Закрыть',
        ar: 'إغلاق',
        he: 'סגור',
        hi: 'बंद करें',
        zh: '关闭',
        la: 'Claudere',
        ja: '閉じる',
        bn: 'বন্ধ করুন',
        id: 'Tutup',
        ur: 'بند کریں',
        sw: 'Funga'
      }
    };

    const getTxt = (field) => (i18n[field] && (i18n[field][lang] || i18n[field].en || i18n[field].es)) || '';

    // Agrupar por categorías
    const categories = [
      { key: 'solfeggio', name: getTxt('catSolfeggio'), icon: 'ui_sparkles' },
      { key: 'brainwaves', name: getTxt('catBrainwaves'), icon: 'ui_audio' },
      { key: 'temples', name: getTxt('catTemples'), icon: 'ui_bell' }
    ];

    const silenceDef = SacredSoundPicker.getSoundDef('silencio_profundo', lang);

    const isUnlocked = StorageService.isAccessUnlocked();
    const FREE_SOUND_IDS = ['silencio_profundo', 'solfeggio_432', 'campanas_tibetanas', 'lluvia_templo'];

    SacredSoundPicker.modalEl.innerHTML = `
      <div class="crystal-card" style="max-width: 480px; width: 100%; margin: auto 0; padding: 24px 18px 28px; position: relative; max-height: 88vh; overflow-y: auto; overflow-x: hidden; box-sizing: border-box; border: 1.5px solid var(--glass-border-highlight); box-shadow: 0 20px 50px rgba(0,0,0,0.65);">
        <button id="btn-close-sound-picker" class="btn-modal-close" title="${getTxt('close')}" style="position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--glass-surface-2); border: 1px solid var(--glass-border); color: var(--text-secondary); cursor: pointer;">
          <span style="display: flex; width: 16px; height: 16px;">${renderIcon('ui_close')}</span>
        </button>

        <!-- Cabecera 100% SVG -->
        <div style="text-align: center; margin-bottom: 18px; padding-right: 24px;">
          <div style="width: 44px; height: 44px; margin: 0 auto 8px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo)); display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 0 16px var(--accent-cyan-glow);">
            <span style="display: flex; width: 22px; height: 22px;">${renderIcon('ui_audio')}</span>
          </div>
          <h3 style="font-family: var(--font-sacred); font-size: 1.3rem; margin: 0 0 4px; color: var(--text-primary); line-height: 1.25;">
            ${getTxt('title')}
          </h3>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">
            ${getTxt('subtitle')}
          </p>
        </div>

        <!-- OPCIÓN DESTACADA: SILENCIO PROFUNDO -->
        <div style="margin-bottom: 16px;">
          <button type="button" class="sound-choice-btn ${activeId === silenceDef.id ? 'active' : ''}" data-sound-id="${silenceDef.id}" style="width: 100%; padding: 12px 14px;">
            <span class="chip-radio-dot"></span>
            <div style="display: flex; flex-direction: column; text-align: start; gap: 2px; flex: 1; min-width: 0;">
              <span style="font-size: 0.86rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                <span style="color: ${silenceDef.color}; display: flex; width: 16px; height: 16px; flex-shrink: 0;">${renderIcon(silenceDef.icon)}</span>
                <span>${silenceDef.name}</span>
              </span>
              <span style="font-size: 0.72rem; color: var(--text-muted); padding-left: 24px; line-height: 1.3;">${silenceDef.desc}</span>
            </div>
          </button>
        </div>

        <!-- CATEGORÍAS DE FRECUENCIAS Y SONIDOS -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 22px;">
          ${categories.map(cat => {
            const items = SOUND_DEFINITIONS.filter(s => s.category === cat.key).map(s => SacredSoundPicker.getSoundDef(s.id, lang));
            return `
              <div>
                <div style="font-size: 0.74rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                  <span style="display: flex; width: 14px; height: 14px;">${renderIcon(cat.icon)}</span>
                  <span>${cat.name}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${items.map(s => {
                    const isSoundLocked = !isUnlocked && !FREE_SOUND_IDS.includes(s.id);
                    return `
                    <button type="button" class="sound-choice-btn ${activeId === s.id ? 'active' : ''}" data-sound-id="${s.id}" style="width: 100%; padding: 11px 13px; position: relative;">
                      <span class="chip-radio-dot"></span>
                      <div style="display: flex; flex-direction: column; text-align: start; gap: 2px; flex: 1; min-width: 0;">
                        <span style="font-size: 0.84rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                          <span style="display: inline-flex; align-items: center; gap: 8px;">
                            <span style="color: ${s.color}; display: flex; width: 16px; height: 16px; flex-shrink: 0;">${renderIcon(s.icon)}</span>
                            <span>${s.name}</span>
                          </span>
                          ${isSoundLocked ? `<span style="font-size: 0.6rem; background: var(--accent-gold); color: #000; font-weight: 900; padding: 1px 5px; border-radius: 4px; box-shadow: 0 0 6px rgba(245,158,11,0.5);">PRO</span>` : ''}
                        </span>
                        <span style="font-size: 0.7rem; color: var(--text-muted); padding-left: 24px; line-height: 1.3;">${s.desc}</span>
                      </div>
                    </button>
                  `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- BOTÓN DE CONFIRMACIÓN / LISTO -->
        <button type="button" id="btn-confirm-sound-picker" class="btn-crystal btn-crystal-gold" style="width: 100%; padding: 13px; font-size: 0.92rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 18px var(--accent-gold-glow); cursor: pointer;">
          <span style="display: flex; width: 18px; height: 18px;">${renderIcon('ui_check')}</span>
          <span>${getTxt('confirmBtn')}</span>
        </button>
      </div>
    `;

    SacredSoundPicker.attachEvents();
  }

  static attachEvents() {
    const closeBtn = document.getElementById('btn-close-sound-picker');
    const confirmBtn = document.getElementById('btn-confirm-sound-picker');
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || 'es';
    const FREE_SOUND_IDS = ['silencio_profundo', 'solfeggio_432', 'campanas_tibetanas', 'lluvia_templo'];

    const handleConfirm = () => {
      const soundId = SacredSoundPicker.selectedSoundId;
      const def = SacredSoundPicker.getSoundDef(soundId, lang);
      if (typeof SacredSoundPicker.onSelectCallback === 'function') {
        SacredSoundPicker.onSelectCallback(soundId, def);
      }
      SacredSoundPicker.close();
    };

    if (closeBtn) closeBtn.addEventListener('click', () => handleConfirm());
    if (confirmBtn) confirmBtn.addEventListener('click', () => handleConfirm());

    const soundBtns = SacredSoundPicker.modalEl.querySelectorAll('.sound-choice-btn');
    soundBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const soundId = btn.getAttribute('data-sound-id');
        const isFree = FREE_SOUND_IDS.includes(soundId);
        
        if (!isFree && !StorageService.isAccessUnlocked()) {
          SacredSoundPicker.close();
          const mem = new MembershipComponent();
          mem.open();
          return;
        }

        SacredSoundPicker.selectedSoundId = soundId;

        // Actualizar UI activa en tiempo real
        soundBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const def = SacredSoundPicker.getSoundDef(soundId, lang);

        // Notificar selección inmediata al componente padre
        if (typeof SacredSoundPicker.onSelectCallback === 'function') {
          SacredSoundPicker.onSelectCallback(soundId, def);
        }

        // Reproducir sonido seleccionado de forma continua
        if (soundId === 'silencio_profundo') {
          soundManager.stopAmbient();
        } else {
          soundManager.playAmbient(soundId);
        }
      });
    });
  }
}
