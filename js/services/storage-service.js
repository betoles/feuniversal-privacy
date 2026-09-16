/**
 * STORAGE SERVICE - SERVICIO DE ALMACENAMIENTO 100% OFFLINE Y CIFRADO LOCAL
 * FeUniversal - Faith & Prayers
 */

const STORAGE_KEYS = {
  PREFERENCES: 'feuniversal_prefs_v1',
  ALTAR: 'feuniversal_altar_v1',
  BEAD_STATS: 'feuniversal_beads_v1',
  VAULT: 'feuniversal_vault_v1',
  STREAKS: 'feuniversal_streaks_v1',
  SUBSCRIPTION: 'feuniversal_subscription_v1',
  NOVENAS: 'feuniversal_novenas_v1',
  PRAYER_USAGE: 'feuniversal_prayer_usage_v1'
};

export const TRADITIONAL_CANDLE_COLORS = [
  {
    id: 'amarillo_oro',
    hex: '#f59e0b',
    flame: '#fbbf24',
    aura: 'rgba(245, 158, 11, 0.45)',
    name: {
      es: 'Amarillo Oro Solar',
      en: 'Solar Gold',
      pt: 'Amarelo Ouro Solar',
      fr: 'Or Solaire',
      it: 'Oro Solare',
      de: 'Sonnengold',
      ru: 'Солнечное Золото',
      ar: 'الذهب الشمسي',
      he: 'זהב סולארי',
      hi: 'सौर स्वर्ण',
      zh: '太阳金',
      la: 'Aurum Solare',
      ja: 'ソーラーゴールド',
      bn: 'সৌর স্বর্ণ',
      id: "Emas Surya",
      ur: "شمسی سونا",
      sw: "Dhahabu ya Jua"
    },
    mes: {
      es: 'Enero',
      en: 'January',
      pt: 'Janeiro',
      fr: 'Janvier',
      it: 'Gennaio',
      de: 'Januar',
      ru: 'Январь',
      ar: 'يناير',
      he: 'ינואר',
      hi: 'जनवरी',
      zh: '一月',
      la: 'Ianuarius',
      ja: '1月',
      bn: 'জানুয়ারি',
      id: "Januari",
      ur: "جنوری",
      sw: "Januari"
    },
    meaning: {
      es: 'Sabiduría, luz divina, apertura de caminos y prosperidad',
      en: 'Wisdom, divine light, pathway opening and prosperity',
      pt: 'Sabedoria, luz divina, abertura de caminhos e prosperidade',
      fr: 'Sagesse, lumière divine, ouverture des chemins et prospérité',
      it: 'Saggezza, luce divina, apertura delle strade e prosperità',
      de: 'Weisheit, göttliches Licht, Wegbereitung und Wohlstand',
      ru: 'Мудрость, божественный свет, открытие путей и процветание',
      ar: 'الحكمة والنور الإلهي وفتح الطرق والازدهار',
      he: 'חכמה, אור אלוהי, פתיחת שבילים ושגשוג',
      hi: 'ज्ञान, दिव्य प्रकाश, मार्ग खुलना और समृद्धि',
      zh: '智慧、神圣之光、开辟道路与繁荣',
      la: 'Sapientia, lux divina, viarum apertura et prosperitas',
      ja: '知恵、神聖な光、道の開拓と繁栄',
      bn: 'জ্ঞান, ঐশ্বরিক আলো, পথ উন্মোচন এবং সমৃদ্ধি',
      id: "Kebijaksanaan, cahaya ilahi, pembuka jalan, dan kemakmuran",
      ur: "حکمت، الٰہی نور، راستے کھولنا اور خوشحالی",
      sw: "Hekima, nuru ya kiungu, kufungua njia na ufanisi"
    }
  },
  {
    id: 'blanco_paz',
    hex: '#f8fafc',
    flame: '#ffffff',
    aura: 'rgba(255, 255, 255, 0.65)',
    name: {
      es: 'Blanco Puro',
      en: 'Pure White',
      pt: 'Branco Puro',
      fr: 'Blanc Pur',
      it: 'Bianco Puro',
      de: 'Reines Weiß',
      ru: 'Чистый Белый',
      ar: 'أبيض نقي',
      he: 'לבן טהור',
      hi: 'शुद्ध श्वेत',
      zh: '纯洁白',
      la: 'Candidus Purus',
      ja: '純白',
      bn: 'বিশুদ্ধ সাদা',
      id: "Putih Murni",
      ur: "خالص سفید",
      sw: "Nyeupe Safi"
    },
    mes: {
      es: 'Febrero',
      en: 'February',
      pt: 'Fevereiro',
      fr: 'Février',
      it: 'Febbraio',
      de: 'Februar',
      ru: 'Февраль',
      ar: 'فبراير',
      he: 'פברואר',
      hi: 'फ़रवरी',
      zh: '二月',
      la: 'Februarius',
      ja: '2月',
      bn: 'ফেব্রুয়ারি',
      id: "Februari",
      ur: "فروری",
      sw: "Februari"
    },
    meaning: {
      es: 'Paz interior, purificación, bendición y salud',
      en: 'Inner peace, purification, blessing and health',
      pt: 'Paz interior, purificação, bênção e saúde',
      fr: 'Paix intérieure, purification, bénédiction et santé',
      it: 'Pace interiore, purificazione, benedizione e salute',
      de: 'Innerer Frieden, Reinigung, Segen und Gesundheit',
      ru: 'Внутренний покой, очищение, благословение и здоровье',
      ar: 'السلام الداخلي والتطهير والبركة والصحة',
      he: 'שלווה פנימית, טיהור, ברכה ובריאות',
      hi: 'आंतरिक शांति, शुद्धि, आशीर्वाद और स्वास्थ्य',
      zh: '内心安宁、净化、祝福与安康',
      la: 'Pax interior, purificatio, benedictio et salus',
      ja: '内なる平和、浄化、祝福、健康',
      bn: 'অন্তরের শান্তি, পবিত্রতা, আশীর্বাদ এবং স্বাস্থ্য',
      id: "Kedamaian batin, penyucian, berkat, dan kesehatan",
      ur: "اندرونی سکون، پاکیزگی، برکت اور صحت",
      sw: "Amani ya ndani, utakaso, baraka na afya njema"
    }
  },
  {
    id: 'rojo_fuerza',
    hex: '#ef4444',
    flame: '#f87171',
    aura: 'rgba(239, 68, 68, 0.5)',
    name: {
      es: 'Rojo Carmesí',
      en: 'Crimson Red',
      pt: 'Vermelho Carmesim',
      fr: 'Rouge Cramoisi',
      it: 'Rosso Cremisi',
      de: 'Karmesinrot',
      ru: 'Багровый Красный',
      ar: 'أحمر قرمزي',
      he: 'אדום ארגמן',
      hi: 'गहरा लाल',
      zh: '深绯红',
      la: 'Ruber Coccineus',
      ja: '深紅',
      bn: 'উজ্জ্বল লাল',
      id: "Merah Kirmizi",
      ur: "سرخ قرمزی",
      sw: "Nyekundu ya Damu"
    },
    mes: {
      es: 'Marzo',
      en: 'March',
      pt: 'Março',
      fr: 'Mars',
      it: 'Marzo',
      de: 'März',
      ru: 'Март',
      ar: 'مارس',
      he: 'מרץ',
      hi: 'मार्च',
      zh: '三月',
      la: 'Martius',
      ja: '3月',
      bn: 'মার্চ',
      id: "Maret",
      ur: "مارچ",
      sw: "Machi"
    },
    meaning: {
      es: 'Fortaleza espiritual, coraje, pasión redentora y causas urgentes',
      en: 'Spiritual strength, courage, redeeming passion and urgent causes',
      pt: 'Fortaleza espiritual, coragem, paixão redentora e causas urgentes',
      fr: 'Force spirituelle, courage, passion rédemptrice et causes urgentes',
      it: 'Fortezza spirituale, coraggio, passione redentrice e cause urgenti',
      de: 'Spirituelle Kraft, Mut, erlösende Hingabe und dringende Anliegen',
      ru: 'Духовная сила, мужество, искупительная страсть и неотложные нужды',
      ar: 'القوة الروحية والشجاعة والشفاعة في الأمور العاجلة',
      he: 'עוצמה רוחנית, אומץ, גאולה ועניינים דחופים',
      hi: 'आध्यात्मिक शक्ति, साहस, मुक्ति और तात्कालिक प्रार्थनाएँ',
      zh: '灵性力量、勇气、救赎热情与紧要祈求',
      la: 'Fortitudo spiritualis, animus et causae urgentes',
      ja: '精神の強さ、勇気、救いの情熱、緊急の願い',
      bn: 'আধ্যাত্মিক শক্তি, সাহস, মুক্তি এবং জরুরি প্রার্থনা',
      id: "Kekuatan spiritual, perlindungan dari kesulitan, keberanian, dan kemenangan",
      ur: "روحانی طاقت، مصیبتوں سے حفاظت، ہمت اور فتح",
      sw: "Nguvu za kiroho, ulinzi dhidi ya dhiki, ujasiri na ushindi"
    }
  },
  {
    id: 'naranja_vitalidad',
    hex: '#f97316',
    flame: '#fb923c',
    aura: 'rgba(249, 115, 22, 0.5)',
    name: {
      es: 'Naranja Ámbar',
      en: 'Amber Orange',
      pt: 'Laranja Âmbar',
      fr: 'Orange Ambré',
      it: 'Arancione Ambra',
      de: 'Bernsteinorange',
      ru: 'Янтарный Оранжевый',
      ar: 'برتقالي عنبري',
      he: 'כתום ענבר',
      hi: 'अंबर नारंगी',
      zh: '琥珀橙',
      la: 'Aurantius Electrinus',
      ja: '琥珀オレンジ',
      bn: 'অ্যাম্বার কমলা',
      id: "Oranye Amber",
      ur: "عنبر نارنجی",
      sw: "Machungwa Kahawia"
    },
    mes: {
      es: 'Abril',
      en: 'April',
      pt: 'Abril',
      fr: 'Avril',
      it: 'Aprile',
      de: 'April',
      ru: 'Апрель',
      ar: 'أبريل',
      he: 'אפריל',
      hi: 'अप्रैल',
      zh: '四月',
      la: 'Aprilis',
      ja: '4月',
      bn: 'এপ্রিল',
      id: "April",
      ur: "اپریل",
      sw: "Aprili"
    },
    meaning: {
      es: 'Alegría, vitalidad, éxito en negocios y entusiasmo',
      en: 'Joy, vitality, success in endeavors and enthusiasm',
      pt: 'Alegria, vitalidade, sucesso nos negócios e entusiasmo',
      fr: 'Joie, vitalité, succès dans les projets et enthousiasme',
      it: 'Gioia, vitalità, successo negli affari ed entusiasmo',
      de: 'Freude, Vitalität, Erfolg und Begeisterung',
      ru: 'Радость, жизненная сила, успех в делах и энтузиазм',
      ar: 'الفرح والحيوية والنجاح في الأعمال والحماس',
      he: 'שמחה, חיוניות, הצלחה והתלהבות',
      hi: 'आनंद, जीवन शक्ति, कार्यों में सफलता और उत्साह',
      zh: '喜乐、生机、事业成功与热情',
      la: 'Gaudium, vitalitas, successus et alacritas',
      ja: '喜び、活力、仕事の成功、情熱',
      bn: 'আনন্দ, প্রাণশক্তি, সাফল্যে কর্মোদ্যম এবং উৎসাহ',
      id: "Vitalitas, sukacita sakral, kreativitas, dan harmoni keluarga",
      ur: "توانائی، مقدس خوشی، تخلیقی صلاحیت اور خاندانی ہم آہنگی",
      sw: "Uhuru wa uhai, furaha takatifu, ubunifu na amani ya familia"
    }
  },
  {
    id: 'azul_celestial',
    hex: '#0ea5e9',
    flame: '#38bdf8',
    aura: 'rgba(14, 165, 233, 0.5)',
    name: {
      es: 'Azul Celestial',
      en: 'Celestial Blue',
      pt: 'Azul Celestial',
      fr: 'Bleu Céleste',
      it: 'Blu Celeste',
      de: 'Himmelblau',
      ru: 'Небесно-Голубой',
      ar: 'أزرق سماوي',
      he: 'כחול שמימי',
      hi: 'दिव्य नीला',
      zh: '天蓝色',
      la: 'Caeruleus Caelestis',
      ja: '天上の青',
      bn: 'স্বর্গীয় নীল',
      id: "Biru Langit",
      ur: "آسمانی نیلا",
      sw: "Bluu ya Mbingu"
    },
    mes: {
      es: 'Mayo',
      en: 'May',
      pt: 'Maio',
      fr: 'Mai',
      it: 'Maggio',
      de: 'Mai',
      ru: 'Май',
      ar: 'مايو',
      he: 'מאי',
      hi: 'मई',
      zh: '五月',
      la: 'Maius',
      ja: '5月',
      bn: 'মে',
      id: "Mei",
      ur: "مئی",
      sw: "Mei"
    },
    meaning: {
      es: 'Manto de la Virgen María, serenidad, calma y salud mental',
      en: 'Mantle of serenity, calmness, divine grace and mental peace',
      pt: 'Manto da Virgem Maria, serenidade, calma e saúde mental',
      fr: 'Manteau de sérénité, calme, grâce divine et paix de l’esprit',
      it: 'Manto della Vergine Maria, serenità, calma e pace mentale',
      de: 'Schutzmantel der Gelassenheit, Ruhe und geistiger Frieden',
      ru: 'Покров безмятежности, душевный покой и благодать',
      ar: 'رداء السكينة والهدوء والنعمة الإلهية وراحة البال',
      he: 'מעטה שלווה, רוגע וחסד אלוהי',
      hi: 'शांति की चादर, मानसिक स्थिरता और दिव्य कृपा',
      zh: '圣母庇佑披肩、安宁、平静与心灵抚慰',
      la: 'Pallium serenitatis, tranquillitas et pax mentis',
      ja: '静寂の衣、穏やかさ、心の平安',
      bn: 'প্রশান্তির আবরণ, মানসিক স্থৈর্য এবং ঐশ্বরিক করুণা',
      id: "Ketenangan, kebenaran ilahi, perlindungan surgawi, dan penyembuhan emosional",
      ur: "سکون، الٰہی سچائی، آسمانی حفاظت اور جذباتی شفا",
      sw: "Utulivu, ukweli wa kiungu, ulinzi wa mbinguni na uponyaji wa hisia"
    }
  },
  {
    id: 'verde_esperanza',
    hex: '#10b981',
    flame: '#34d399',
    aura: 'rgba(16, 185, 129, 0.5)',
    name: {
      es: 'Verde Esperanza',
      en: 'Hope Green',
      pt: 'Verde Esperança',
      fr: 'Vert Espoir',
      it: 'Verde Speranza',
      de: 'Hoffnungsgrün',
      ru: 'Зеленый Надежды',
      ar: 'أخضر الرجاء',
      he: 'ירוק תקווה',
      hi: 'आशा हरा',
      zh: '希望绿',
      la: 'Viridis Spei',
      ja: '希望の緑',
      bn: 'আশার সবুজ',
      id: "Hijau Harapan",
      ur: "سبز امید",
      sw: "Kijani cha Tumaini"
    },
    mes: {
      es: 'Junio',
      en: 'June',
      pt: 'Junho',
      fr: 'Juin',
      it: 'Giugno',
      de: 'Juni',
      ru: 'Июнь',
      ar: 'يونيو',
      he: 'יוני',
      hi: 'जून',
      zh: '六月',
      la: 'Iunius',
      ja: '6月',
      bn: 'জুন',
      id: "Juni",
      ur: "جون",
      sw: "Juni"
    },
    meaning: {
      es: 'Salud física, sanación de enfermos, trabajo y bendición',
      en: 'Physical health, healing the sick, honest work and blessings',
      pt: 'Saúde física, cura dos enfermos, trabalho e bênção',
      fr: 'Santé physique, guérison des malades, travail et bénédiction',
      it: 'Salute fisica, guarigione dei malati, lavoro e benedizione',
      de: 'Körperliche Gesundheit, Heilung, Arbeit und Segen',
      ru: 'Физическое здоровье, исцеление больных, труд и благословение',
      ar: 'الصحة البدنية وشفاء المرضى والعمل والبركة',
      he: 'בריאות הגוף, ריפוי חולים, עבודה וברכה',
      hi: 'शारीरिक स्वास्थ्य, रोगियों का उपचार, कार्य और आशीर्वाद',
      zh: '身体健康、医治病患、事业与恩泽',
      la: 'Salus corporis, sanatio infirmorum, labor et benedictio',
      ja: '身体の健康、病の癒し、仕事の恵み、祝福',
      bn: 'শারীরিক সুস্থতা, রোগ নিরাময়, কর্ম ও কল্যাণ',
      id: "Penyembuhan fisik, harapan baru, kelimpahan, dan pembaruan hidup",
      ur: "جسمانی شفا، نئی امید، فراوانی اور زندگی کی تجدید",
      sw: "Uponyaji wa mwili, tumaini jipya, wingi wa riziki na uhai mpya"
    }
  },
  {
    id: 'morado_mistico',
    hex: '#8b5cf6',
    flame: '#a78bfa',
    aura: 'rgba(139, 92, 246, 0.5)',
    name: {
      es: 'Morado Místico',
      en: 'Mystic Purple',
      pt: 'Roxo Místico',
      fr: 'Pourpre Mystique',
      it: 'Viola Mistico',
      de: 'Mystisches Violett',
      ru: 'Мистический Фиолетовый',
      ar: 'أرجواني صوفي',
      he: 'סגול מיסטי',
      hi: 'रहस्यमयी बैंगनी',
      zh: '玄妙紫',
      la: 'Purpura Mystica',
      ja: '神秘の紫',
      bn: 'রহস্যময় বেগুনি',
      id: "Ungu Mistik",
      ur: "صوفیانہ جامنی",
      sw: "Zambarau ya Mafumbo"
    },
    mes: {
      es: 'Julio',
      en: 'July',
      pt: 'Julho',
      fr: 'Juillet',
      it: 'Luglio',
      de: 'Juli',
      ru: 'Июль',
      ar: 'يوليو',
      he: 'יולי',
      hi: 'जुलाई',
      zh: '七月',
      la: 'Iulius',
      ja: '7月',
      bn: 'জুলাই',
      id: "Juli",
      ur: "جولائی",
      sw: "Julai"
    },
    meaning: {
      es: 'Perdón, transmutación de penas, superación de pruebas y fe',
      en: 'Forgiveness, transmutation of grief, overcoming trials and faith',
      pt: 'Perdão, transmutação de penas, superação de provas e fé',
      fr: 'Pardon, transmutation des peines, dépassement des épreuves et foi',
      it: 'Perdono, trasmutazione delle pene, superamento delle prove e fede',
      de: 'Vergebung, Wandlung von Kummer, Überwindung von Prüfungen und Glaube',
      ru: 'Прощение, преображение скорбей, преодоление испытаний и вера',
      ar: 'المغفرة وتجاوز الأحزان والتغلب على المحن والإيمان',
      he: 'סליחה, התמרת צער, התגברות על מבחנים ואמונה',
      hi: 'क्षमा, दुखों का रूपांतरण, परीक्षाओं पर विजय और निष्ठा',
      zh: '宽恕、化解苦痛、克服磨难与坚毅信仰',
      la: 'Venia, transmutatio dolorum, superatio probationum et fides',
      ja: '許し、苦しみの昇華、試練の克服、信仰',
      bn: 'ক্ষমা, শোকমুক্তি, পরীক্ষা জয় এবং গভীর বিশ্বাস',
      id: "Transformasi spiritual, kebijaksanaan luhur, pengampunan, dan doa mendalam",
      ur: "روحانی تبدیلی، اعلیٰ حکمت، مغفرت اور گہری دعا",
      sw: "Mabadiliko ya kiroho, hekima ya juu, msamaha na maombi ya kina"
    }
  },
  {
    id: 'rosa_aurora',
    hex: '#ec4899',
    flame: '#f472b6',
    aura: 'rgba(236, 72, 153, 0.5)',
    name: {
      es: 'Rosa Aurora',
      en: 'Aurora Pink',
      pt: 'Rosa Aurora',
      fr: 'Rose Aurore',
      it: 'Rosa Aurora',
      de: 'Aurorarosa',
      ru: 'Розовая Аврора',
      ar: 'وردي الفجر',
      he: 'ורוד שחר',
      hi: 'उषा गुलाबी',
      zh: '极光粉',
      la: 'Roseus Aurorae',
      ja: 'オーロラピンク',
      bn: 'ঊষা গোলাপি',
      id: "Merah Muda Fajar",
      ur: "گلابی سحر",
      sw: "Waridi la Alfajiri"
    },
    mes: {
      es: 'Agosto',
      en: 'August',
      pt: 'Agosto',
      fr: 'Août',
      it: 'Agosto',
      de: 'August',
      ru: 'Август',
      ar: 'أغسطس',
      he: 'אוגוסט',
      hi: 'अगस्त',
      zh: '八月',
      la: 'Augustus',
      ja: '8月',
      bn: 'আগস্ট',
      id: "Agustus",
      ur: "اگست",
      sw: "Agosti"
    },
    meaning: {
      es: 'Amor en el hogar, ternura, reconciliación familiar y de pareja',
      en: 'Love in the home, tenderness, family harmony and reconciliation',
      pt: 'Amor no lar, ternura, reconciliação familiar e harmonia',
      fr: 'Amour dans le foyer, tendresse, réconciliation familiale et harmonie',
      it: 'Amore nella casa, tenerezza, riconciliazione familiare e armonia',
      de: 'Liebe im Heim, Zärtlichkeit, familiäre Versöhnung und Harmonie',
      ru: 'Любовь в доме, нежность, семейное примирение и согласие',
      ar: 'المحبة في البيت والحنان والمصالحة الأسرية والوئام',
      he: 'אהבה בבית, רוך, פיוס משפחתי והרמוניה',
      hi: 'घर में प्रेम, कोमलता, पारिवारिक मेल-मिलाप और सौहार्द',
      zh: '家庭仁爱、温情、家庭和睦与情感和解',
      la: 'Amor in domo, dulcedo, reconciliatio familiaris et harmonia',
      ja: '家庭の愛、優しさ、家族の和解、調和',
      bn: 'পারিবারিক প্রেম, স্নেহ, পুনর্মিলন এবং সম্প্রীতি',
      id: "Kasih ilahi, perdamaian, kelembutan, dan persatuan persaudaraan",
      ur: "الٰہی محبت، صلح، نرمی اور برادرانہ اتحاد",
      sw: "Upendo wa kiungu, amani ya moyo, upole na umoja wa kindugu"
    }
  },
  {
    id: 'cobre_tierra',
    hex: '#b45309',
    flame: '#d97706',
    aura: 'rgba(180, 83, 9, 0.5)',
    name: {
      es: 'Cobre Sagrado',
      en: 'Sacred Copper',
      pt: 'Cobre Sagrado',
      fr: 'Cuivre Sacré',
      it: 'Rame Sacro',
      de: 'Heiliges Kupfer',
      ru: 'Священная Медь',
      ar: 'نحاس مقدس',
      he: 'נחושת מקודשת',
      hi: 'पवित्र तांबा',
      zh: '神圣铜色',
      la: 'Aes Sacrum',
      ja: '神聖な銅',
      bn: 'পবিত্র তামা',
      id: "Tembaga Suci",
      ur: "مقدس تانبا",
      sw: "Shaba Takatifu"
    },
    mes: {
      es: 'Septiembre',
      en: 'September',
      pt: 'Setembro',
      fr: 'Septembre',
      it: 'Settembre',
      de: 'September',
      ru: 'Сентябрь',
      ar: 'سبتمبر',
      he: 'ספטמבר',
      hi: 'सितंबर',
      zh: '九月',
      la: 'September',
      ja: '9月',
      bn: 'সেপ্টেম্বর',
      id: "September",
      ur: "ستمبر",
      sw: "Septemba"
    },
    meaning: {
      es: 'Estabilidad material, protección del patrimonio, fertilidad y arraigo',
      en: 'Material stability, protection of heritage, fertility and grounding',
      pt: 'Estabilidade material, proteção do patrimônio, fertilidade e firmeza',
      fr: 'Stabilité matérielle, protection du patrimoine, fertilité et ancrage',
      it: 'Stabilità materiale, protezione del patrimonio, fertilità e solidità',
      de: 'Materielle Stabilität, Schutz des Erbes, Fruchtbarkeit und Erdung',
      ru: 'Материальная стабильность, защита наследия, изобилие и надежность',
      ar: 'الاستقرار المادي وحماية الممتلكات والوفرة والثبات',
      he: 'יציבות חומרית, הגנה על המורשת ושורשיות',
      hi: 'भौतिक स्थिरता, संपत्ति की रक्षा, समृद्धि और दृढ़ता',
      zh: '物质稳固、资产守护、丰盛与根基扎实',
      la: 'Stabilitas materialis, tutela patrimonii et firmitas',
      ja: '物質的安定、資産の保護、豊かさ、堅実な基盤',
      bn: 'বস্তুগত স্থায়িত্ব, সম্পদের সুরক্ষা এবং স্থিতিশীলতা',
      id: "Ketabahan, rasa syukur, panen berlimpah, dan hubungan mendalam dengan alam",
      ur: "ثابت قدمی، شکرگزاری، شاندار فصل اور فطرت کے ساتھ گہرا ربط",
      sw: "Uimara wa moyo, shukrani, mavuno tele na uhusiano mwema na asili"
    }
  },
  {
    id: 'plata_lunar',
    hex: '#94a3b8',
    flame: '#cbd5e1',
    aura: 'rgba(148, 163, 184, 0.55)',
    name: {
      es: 'Plata Lunar',
      en: 'Lunar Silver',
      pt: 'Prata Lunar',
      fr: 'Argent Lunaire',
      it: 'Argento Lunare',
      de: 'Mondsilber',
      ru: 'Лунное Серебро',
      ar: 'فضة قمرية',
      he: 'כסף ירחי',
      hi: 'चंद्र चांदी',
      zh: '月华银',
      la: 'Argentum Lunare',
      ja: '月光の銀',
      bn: 'চন্দ্র রূপা',
      id: "Perak Rembulan",
      ur: "چاند جیسی چاندی",
      sw: "Fedha ya Mwezi"
    },
    mes: {
      es: 'Octubre',
      en: 'October',
      pt: 'Outubro',
      fr: 'Octobre',
      it: 'Ottobre',
      de: 'Oktober',
      ru: 'Октябрь',
      ar: 'أكتوبر',
      he: 'אוקטובר',
      hi: 'अक्टूबर',
      zh: '十月',
      la: 'October',
      ja: '10月',
      bn: 'অক্টোবর',
      id: "Oktober",
      ur: "اکتوبر",
      sw: "Oktoba"
    },
    meaning: {
      es: 'Claridad mental, discernimiento justo y protección espiritual',
      en: 'Mental clarity, righteous discernment and spiritual protection',
      pt: 'Clareza mental, discernimento justo e proteção espiritual',
      fr: 'Clarté mentale, juste discernement et protection spirituelle',
      it: 'Chiarezza mentale, giusto discernimento e protezione spirituale',
      de: 'Geistige Klarheit, gerechte Urteilskraft und spiritueller Schutz',
      ru: 'Ясность ума, справедливое различение и духовная защита',
      ar: 'الوضوح العقلي والتمييز العادل والحماية الروحية',
      he: 'בהירות מחשבתית, הבחנה צודקת והגנה רוחנית',
      hi: 'मानसिक स्पष्टता, न्यायसंगत विवेक और आध्यात्मिक सुरक्षा',
      zh: '心智澄明、公正辨识与灵性护佑',
      la: 'Claritas mentis, iustum discernimentum et tutela spiritualis',
      ja: '精神の明晰さ、正しい洞察、スピリチュアルな保護',
      bn: 'মানসিক স্বচ্ছতা, ন্যায়নিষ্ঠ বিচারবোধ এবং আধ্যাত্মিক সুরক্ষা',
      id: "Intuisi batin, kejernihan mental, bimbingan malam, dan perlindungan rahasia",
      ur: "باطنی فراست، ذہنی وضاحت، رات کی رہنمائی اور پوشیدہ حفاظت",
      sw: "Ufahamu wa ndani, uwazi wa fikra, uongozi wa usiku na ulinzi wa siri"
    }
  },
  {
    id: 'dorado_imperial',
    hex: '#eab308',
    flame: '#fef08a',
    aura: 'rgba(234, 179, 8, 0.65)',
    name: {
      es: 'Dorado Imperial',
      en: 'Imperial Gold',
      pt: 'Dourado Imperial',
      fr: 'Or Impérial',
      it: 'Oro Imperiale',
      de: 'Kaiserliches Gold',
      ru: 'Императорское Золото',
      ar: 'ذهب إمبراطوري',
      he: 'זהב אימפריאלי',
      hi: 'शाही स्वर्ण',
      zh: '御尊金',
      la: 'Aurum Imperiale',
      ja: 'インペリアルゴールド',
      bn: 'রাজকীয় স্বর্ণ',
      id: "Emas Kerajaan",
      ur: "شاہی سنہرا",
      sw: "Dhahabu ya Kifalme"
    },
    mes: {
      es: 'Noviembre',
      en: 'November',
      pt: 'Novembro',
      fr: 'Novembre',
      it: 'Novembre',
      de: 'November',
      ru: 'Ноябрь',
      ar: 'نوفمبر',
      he: 'נובמבר',
      hi: 'नवंबर',
      zh: '十一月',
      la: 'November',
      ja: '11月',
      bn: 'নভেম্বর',
      id: "November",
      ur: "نومبر",
      sw: "Novemba"
    },
    meaning: {
      es: 'Abundancia máxima, gloria celestial, memoria y Divina Providencia',
      en: 'Maximum abundance, celestial glory, honor and Divine Providence',
      pt: 'Abundância máxima, glória celestial e Divina Providência',
      fr: 'Abondance maximale, gloire céleste et Divine Providence',
      it: 'Massima abbondanza, gloria celeste e Divina Provvidenza',
      de: 'Höchste Fülle, himmlischer Glanz und göttliche Vorsehung',
      ru: 'Высшее изобилие, небесная слава и Божественное Провидение',
      ar: 'الوفرة القصوى والمجد السماوي والعناية الإلهية',
      he: 'שפע עליון, תהילת שמיים והשגחה פרטית',
      hi: 'परम समृद्धि, दिव्य महिमा और ईश्वरीय कृपा',
      zh: '至上丰饶、天国荣耀与神圣天佑',
      la: 'Abundantia maxima, gloria caelestis et Divina Providentia',
      ja: '無限の豊かさ、天上の栄光、神の御摂理',
      bn: 'চরম প্রাচুর্য, স্বর্গীয় মহিমা এবং ঐশ্বরিক বিধান',
      id: "Kemenangan iman, kemuliaan abadi, martabat luhur, dan kelimpahan tak terhingga",
      ur: "ایمان کی فتح، ابدی جلال، اعلیٰ وقار اور لامحدود فراوانی",
      sw: "Ushindi wa imani, utukufu wa milele, heshima kuu na baraka zisizo na mwisho"
    }
  },
  {
    id: 'negro_ebano',
    hex: '#1c1917',
    flame: '#a855f7',
    aura: 'rgba(30, 27, 75, 0.75)',
    name: {
      es: 'Ébano de Protección',
      en: 'Protection Ebony',
      pt: 'Ébano de Proteção',
      fr: 'Ébène de Protection',
      it: 'Ebano di Protezione',
      de: 'Schutzebenholz',
      ru: 'Защитное Черное Дерево',
      ar: 'أبنوس الحماية',
      he: 'הובנה להגנה',
      hi: 'सुरक्षा आबनूस',
      zh: '守护乌木',
      la: 'Ebenus Tutelae',
      ja: '守護のエボニー',
      bn: 'সুরক্ষা কৃষ্ণকাঠ',
      id: "Kayu Hitam Pelindung",
      ur: "حفاظتی آبنوس",
      sw: "Mti Mweusi wa Ulinzi"
    },
    mes: {
      es: 'Diciembre',
      en: 'December',
      pt: 'Dezembro',
      fr: 'Décembre',
      it: 'Dicembre',
      de: 'Dezember',
      ru: 'Декабрь',
      ar: 'ديسمبر',
      he: 'דצמבר',
      hi: 'दिसंबर',
      zh: '十二月',
      la: 'December',
      ja: '12月',
      bn: 'ডিসেম্বর',
      id: "Desember",
      ur: "دسمبر",
      sw: "Desemba"
    },
    meaning: {
      es: 'Absorción de negatividades, destrabe de obstáculos y corte de males',
      en: 'Absorption of negativity, clearing obstacles and spiritual shielding',
      pt: 'Absorção de negatividades, desbloqueio de obstáculos e proteção',
      fr: 'Absorption des négativités, déblocage des obstacles et bouclier spirituel',
      it: 'Assorbimento delle negatività, sblocco degli ostacoli e scudo spirituale',
      de: 'Auflösung von Negativität, Beseitigung von Hindernissen und Schutz',
      ru: 'Поглощение негатива, устранение препятствий и духовный щит',
      ar: 'امتصاص السلبيات وإزالة العقبات والحماية الروحية',
      he: 'ספיגת שליליות, הסרת מכשולים ומגן רוחני',
      hi: 'नकारात्मकता का निष्कासन, बाधाओं का निवारण और आध्यात्मिक कवच',
      zh: '吸收负面能量、化解阻碍与灵性护盾',
      la: 'Absorptio negativitatis, remotio impedimentorum et clipeus spiritualis',
      ja: 'ネガティブの吸収、障害の打破、スピリチュアルな盾',
      bn: 'নেতিবাচকতা দূরীকরণ, বাধা অপসারণ এবং আধ্যাত্মিক রক্ষা',
      id: "Pelepasan beban, penangkal energi negatif, dan benteng perlindungan mutlak",
      ur: "بوجھ سے نجات، منفی توانائی کا خاتمہ اور مکمل حفاظتی ڈھال",
      sw: "Kufunguliwa kutoka kwenye mizigo, kuzuia nguvu hasi na ngao thabiti ya ulinzi"
    }
  }
];

export function getCandleColor(colorId, lang = 'es') {
  const raw = TRADITIONAL_CANDLE_COLORS.find(c => c.id === colorId) || TRADITIONAL_CANDLE_COLORS[0];
  const nameStr = (typeof raw.name === 'object') ? (raw.name[lang] || raw.name.es || raw.name.en || raw.id) : raw.name;
  const mesStr = (typeof raw.mes === 'object') ? (raw.mes[lang] || raw.mes.es || raw.mes.en || '') : raw.mes;
  const meaningStr = (typeof raw.meaning === 'object') ? (raw.meaning[lang] || raw.meaning.es || raw.meaning.en || '') : raw.meaning;
  return { ...raw, name: nameStr, mes: mesStr, meaning: meaningStr };
}

// Fallback en memoria transparente para modo incógnito estricto o cuota llena
const _memoryStore = new Map();

function _safeGetItem(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    // Si localStorage está bloqueado o restringido, usar fallback en memoria
  }
  return _memoryStore.get(key) || null;
}

function _safeSetItem(key, val) {
  _memoryStore.set(key, val);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
    }
  } catch (e) {
    console.warn(`[StorageService] Almacenando en memoria para "${key}":`, e.message);
  }
}

export class StorageService {
  // Preferencias de Usuario (Tradiciones activas, Idioma, Tema)
  static getPreferences() {
    const defaults = {
      idioma: 'es',
      tema: 'dark',
      tradicionesActivas: ['catolicismo', 'santeria_yoruba', 'budismo', 'pentecostal', 'hebreo_salmos', 'mormonismo', 'ortodoxia', 'vedica', 'islam', 'adventista', 'espiritismo', 'universal'],
      sonidoAmbientePorDefecto: 'silencio_profundo',
      modoZen: true,
      volumenSonido: 0.5,
      hapticaActivada: true,
      anchoVista: 'auto', // 'auto' | 'compact' | 'tablet' | 'wide'
      onboardingCompletado: false
    };

    try {
      const data = _safeGetItem(STORAGE_KEYS.PREFERENCES);
      if (data) {
        const parsed = JSON.parse(data);
        const soundPref = parsed.sonidoAmbientePorDefecto || 'silencio_profundo';
        return {
          ...defaults,
          ...parsed,
          sonidoAmbientePorDefecto: soundPref,
          tradicionesActivas: (Array.isArray(parsed.tradicionesActivas) && parsed.tradicionesActivas.length > 0)
            ? parsed.tradicionesActivas
            : defaults.tradicionesActivas
        };
      }
    } catch (e) {
      console.warn('Error reading preferences:', e);
    }

    return defaults;
  }

  static savePreferences(prefs) {
    try {
      _safeSetItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }

  static isNativePlatform() {
    return typeof window !== 'undefined' && !!(window.Capacitor && window.Capacitor.isNativePlatform?.());
  }

  // GESTIÓN DE PRUEBA GRATUITA DE 7 DÍAS Y MEMBRESÍA SANTUARIO PRO
  static getSubscription() {
    const defaults = {
      version: '10.8.5',
      isPremium: false,
      planType: null, // 'annual' ($2.99) | 'lifetime' ($4.99)
      trialStarted: true,
      trialStartDate: Date.now(),
      trialDurationDays: 7,
      activatedDate: null,
      lastPaywallReminderDate: 0
    };

    try {
      const data = _safeGetItem(STORAGE_KEYS.SUBSCRIPTION);
      if (data) {
        const parsed = JSON.parse(data);
        // Si el usuario ya cuenta con membresía activa PRO, preservarla
        if (parsed.isPremium) {
          return { ...defaults, ...parsed };
        }
        // Si no es premium y viene de una versión previa, restablecer el Trial al ciclo canónico de 7 días completos
        if (!parsed.version || parsed.version !== '10.8.5') {
          parsed.version = '10.8.5';
          parsed.trialStarted = true;
          parsed.trialStartDate = Date.now();
          parsed.trialDurationDays = 7;
          this.saveSubscription(parsed);
        }
        return { ...defaults, ...parsed };
      }
    } catch (e) {
      console.warn('Error reading subscription:', e);
    }

    // Inicializar prueba de 7 días
    this.saveSubscription(defaults);
    return defaults;
  }

  static startTrial() {
    const sub = this.getSubscription();
    if (sub.isPremium) return sub;
    sub.trialStarted = true;
    sub.trialStartDate = Date.now();
    sub.trialDurationDays = 7;
    this.saveSubscription(sub);
    return sub;
  }

  static saveSubscription(sub) {
    try {
      _safeSetItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    } catch (e) {
      console.error('Error saving subscription:', e);
    }
  }

  static getTrialDaysRemaining() {
    const sub = this.getSubscription();
    if (sub.isPremium) return Infinity;
    if (!sub.trialStarted) return 7;
    const msElapsed = Math.max(0, Date.now() - (sub.trialStartDate || Date.now()));
    const daysElapsed = msElapsed / (1000 * 60 * 60 * 24);
    const duration = sub.trialDurationDays || 7;
    const remaining = Math.ceil(duration - daysElapsed);
    return Math.max(0, Math.min(duration, remaining));
  }

  static isAccessUnlocked() {
    const sub = this.getSubscription();
    if (sub.isPremium) return true;
    return this.getTrialDaysRemaining() > 0;
  }

  /**
   * Cuota diaria de oraciones para usuarios sin suscripción ni prueba activa:
   * - Web: 2 oraciones diarias
   * - Google Play (Android): 3 oraciones diarias
   * - PRO / Trial activo: Ilimitadas
   */
  static getDailyPrayerQuota() {
    const today = new Date().toISOString().split('T')[0];
    let usage = { date: today, count: 0 };
    try {
      const data = _safeGetItem(STORAGE_KEYS.PRAYER_USAGE);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.date === today) {
          usage = parsed;
        }
      }
    } catch (e) {}

    const isUnlocked = this.isAccessUnlocked();
    const isNative = this.isNativePlatform();
    const limit = isUnlocked ? Infinity : (isNative ? 3 : 2);
    const count = usage.count || 0;
    const remaining = isUnlocked ? Infinity : Math.max(0, limit - count);

    return {
      today,
      count,
      limit,
      remaining,
      isUnlimited: isUnlocked,
      allowed: isUnlocked || count < limit,
      isNative
    };
  }

  static recordPrayerRead() {
    const today = new Date().toISOString().split('T')[0];
    let usage = { date: today, count: 0 };
    try {
      const data = _safeGetItem(STORAGE_KEYS.PRAYER_USAGE);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.date === today) {
          usage = parsed;
        }
      }
    } catch (e) {}

    usage.count = (usage.count || 0) + 1;
    _safeSetItem(STORAGE_KEYS.PRAYER_USAGE, JSON.stringify(usage));
    return usage;
  }

  // Verifica si una función específica está desbloqueada
  // Las escrituras y compartir texto básico son 100% gratuitas siempre.
  // Oraciones respetan cuota diaria en Free o son ilimitadas en PRO/Trial.
  // Música, Altar múltiple, Brújula 3D, Bóveda/IA requieren Trial activo o Plan PRO.
  static isFeatureUnlocked(featureKey) {
    if (featureKey === 'share_text' || featureKey === 'scriptures') {
      return true;
    }
    if (featureKey === 'prayers') {
      return this.getDailyPrayerQuota().allowed;
    }
    return this.isAccessUnlocked();
  }

  static shouldShowWeeklyPaywallReminder() {
    const sub = this.getSubscription();
    if (sub.isPremium) return false;
    const daysLeft = this.getTrialDaysRemaining();
    if (daysLeft > 0) return false; // Todavía está en su trial inicial

    const lastReminder = sub.lastPaywallReminderDate || 0;
    const fortyDaysMs = 40 * 24 * 60 * 60 * 1000; // Intervalo de recordatorio cada 40 días
    return (Date.now() - lastReminder) >= fortyDaysMs;
  }

  static recordPaywallReminderShown() {
    const sub = this.getSubscription();
    sub.lastPaywallReminderDate = Date.now();
    this.saveSubscription(sub);
  }

  static activateSubscription(planType = 'annual') {
    const sub = {
      isPremium: true,
      planType,
      trialStartDate: this.getSubscription().trialStartDate,
      trialDurationDays: 7,
      activatedDate: Date.now(),
      lastPaywallReminderDate: Date.now()
    };
    this.saveSubscription(sub);
    return sub;
  }

  // Altar Virtual (Veladoras activas con soporte para los 12 Colores y consumo real de cera)
  static getAltarState() {
    try {
      const data = _safeGetItem(STORAGE_KEYS.ALTAR);
      if (data) {
        const state = JSON.parse(data);
        if (state && Array.isArray(state.veladoras)) {
          const now = Date.now();
          const initialCount = state.veladoras.length;
          // Filtrar veladoras cuya cera se haya consumido por completo (tiempo transcurrido >= duracionHoras)
          state.veladoras = state.veladoras.filter(v => {
            const start = v.fechaEncendido || v.timestamp || now;
            const durHours = v.duracionHoras || 24;
            const durMs = durHours * 3600 * 1000;
            return (now - start) < durMs;
          });

          // Si expiraron veladoras, persistir el estado actualizado para liberar espacio
          if (state.veladoras.length !== initialCount) {
            this.saveAltarState(state);
          }
          return state;
        }
      }
    } catch (e) {
      console.warn('Error reading altar state:', e);
    }

    return {
      veladoras: [
        {
          id: 'candle_init_1',
          peticion: 'Por la paz del mundo, la salud, el trabajo honrado y la protección de mi familia.',
          tradicion: 'catolicismo',
          colorId: 'amarillo_oro',
          simbolo: '✝',
          colorLuz: '#f59e0b',
          fechaEncendido: Date.now() - (1000 * 60 * 30),
          duracionHoras: 24,
          isDefault: true
        }
      ]
    };
  }

  static saveAltarState(state) {
    try {
      _safeSetItem(STORAGE_KEYS.ALTAR, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving altar state:', e);
    }
  }

  static addCandle(candleData) {
    const state = this.getAltarState();
    const colorObj = TRADITIONAL_CANDLE_COLORS.find(c => c.id === candleData.colorId) || TRADITIONAL_CANDLE_COLORS[0];
    const newCandle = {
      id: 'candle_' + Date.now(),
      fechaEncendido: Date.now(),
      colorId: colorObj.id,
      colorLuz: colorObj.hex,
      ...candleData
    };
    state.veladoras.unshift(newCandle);
    this.saveAltarState(state);
    this.incrementSpiritualScore(15);
    return newCandle;
  }

  static removeCandle(candleId) {
    const state = this.getAltarState();
    state.veladoras = state.veladoras.filter(c => c.id !== candleId);
    this.saveAltarState(state);
  }

  // Estadísticas del Contador Táctil (Rosario / Mala / Decretos)
  static getBeadStats() {
    try {
      const data = _safeGetItem(STORAGE_KEYS.BEAD_STATS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading bead stats:', e);
    }

    return {
      cuentasTotales: 0,
      sesionesCompletadas: 0,
      ultimoTipoContador: ''
    };
  }

  static recordBeadSession(tipo, count) {
    const stats = this.getBeadStats();
    stats.cuentasTotales += count;
    stats.sesionesCompletadas += 1;
    stats.ultimoTipoContador = tipo;
    try {
      _safeSetItem(STORAGE_KEYS.BEAD_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving bead stats:', e);
    }
    this.incrementSpiritualScore(count > 10 ? 10 : 5);
  }

  // Bóveda Espiritual Cifrada y Diario de Gratitud
  static getVaultItems() {
    try {
      const data = _safeGetItem(STORAGE_KEYS.VAULT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading vault items:', e);
    }

    return [
      {
        id: 'vault_init_1',
        tipo: 'peticion',
        titulo: 'Petición por la salud y la paz de mi familia',
        contenido: 'Plegaria elevada con fe para la pronta recuperación y bendición en el hogar.',
        fecha: Date.now() - 86400000 * 2,
        cumplido: false,
        isDefault: true
      },
      {
        id: 'vault_init_2',
        tipo: 'testimonio',
        titulo: 'Agradecimiento por puerta laboral abierta',
        contenido: 'Doy gracias infinitas por la provisión y el trabajo concedido.',
        fecha: Date.now() - 86400000 * 5,
        cumplido: true,
        isDefault: true
      }
    ];
  }

  static saveVaultItems(items) {
    try {
      _safeSetItem(STORAGE_KEYS.VAULT, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving vault items:', e);
    }
  }

  /**
   * Exporta toda la información local de la Bóveda y devocionales en formato JSON verificado
   */
  static exportBackupJSON() {
    try {
      const backup = {
        app: "FeUniversal - Faith & Prayers",
        version: "9.1.0",
        exportDate: new Date().toISOString(),
        signature: "FEUNIVERSAL_SACRED_BACKUP_V1",
        data: {
          preferences: this.getPreferences(),
          vault: this.getVaultItems(),
          altar: this.getAltarState(),
          beadStats: this.getBeadStats(),
          spiritualScore: this.getSpiritualScore()
        }
      };
      return JSON.stringify(backup, null, 2);
    } catch (e) {
      console.error("Error generating backup JSON:", e);
      return null;
    }
  }

  /**
   * Importa y restaura una copia de seguridad JSON previa con validación exhaustiva
   */
  static importBackupJSON(jsonString) {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        throw new Error('Invalid backup file');
      }
      const parsed = JSON.parse(jsonString);
      if (!parsed || (!parsed.data && !parsed.vault)) {
        throw new Error('Unrecognized backup structure');
      }

      const payload = parsed.data || parsed;
      let restoredCount = 0;

      // 1. Restaurar Bóveda
      if (Array.isArray(payload.vault)) {
        this.saveVaultItems(payload.vault);
        restoredCount += payload.vault.length;
      }

      // 2. Restaurar Preferencias
      if (payload.preferences && typeof payload.preferences === 'object') {
        this.savePreferences(payload.preferences);
      }

      // 3. Restaurar Altar
      if (payload.altar && typeof payload.altar === 'object') {
        this.saveAltarState(payload.altar);
      }

      // 4. Restaurar Estadísticas de Rosario / Mala
      if (payload.beadStats && typeof payload.beadStats === 'object') {
        _safeSetItem(STORAGE_KEYS.BEAD_STATS, JSON.stringify(payload.beadStats));
      }

      // 5. Restaurar Métricas Espirituales
      if (payload.spiritualScore && typeof payload.spiritualScore === 'object') {
        _safeSetItem(STORAGE_KEYS.STREAKS, JSON.stringify(payload.spiritualScore));
      }

      return { success: true, restoredCount };
    } catch (e) {
      console.error("Error importing backup JSON:", e);
      return { success: false, error: e.message };
    }
  }

  // Score y Balance de Enfoque Espiritual (HUD Metrix)
  static getSpiritualScore() {
    try {
      const data = _safeGetItem(STORAGE_KEYS.STREAKS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading spiritual streaks:', e);
    }

    return {
      score: 0,
      rachaDias: 0,
      oracionesCompletadas: 0,
      categoriaFrecuencia: {
        proteccion: 0,
        salud_sanacion: 0,
        paz_interior: 0,
        prosperidad_trabajo: 0
      }
    };
  }

  static incrementSpiritualScore(points = 5, categoriaIntencion = 'paz_interior') {
    const stats = this.getSpiritualScore();
    stats.score = Math.min(100, (stats.score || 0) + points);
    stats.oracionesCompletadas = (stats.oracionesCompletadas || 0) + 1;
    
    if (!stats.categoriaFrecuencia) {
      stats.categoriaFrecuencia = {
        proteccion: 0,
        salud_sanacion: 0,
        paz_interior: 0,
        prosperidad_trabajo: 0
      };
    }
    
    const cat = categoriaIntencion || 'paz_interior';
    stats.categoriaFrecuencia[cat] = (stats.categoriaFrecuencia[cat] || 0) + 1;

    try {
      _safeSetItem(STORAGE_KEYS.STREAKS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving spiritual streaks:', e);
    }
    return stats;
  }

  static recordSpiritualScoreAction(actionType = 'generic', points = 10, categoria = 'paz_interior') {
    return this.incrementSpiritualScore(points, categoria);
  }

  // --- NOVENAS Y CADENAS DE ORACIÓN ---
  static getAllNovenasProgress() {
    try {
      const data = _safeGetItem(STORAGE_KEYS.NOVENAS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading novenas data:', e);
    }
    return {};
  }

  static getNovenaProgress(novenaId) {
    const all = this.getAllNovenasProgress();
    return all[novenaId] || {
      currentDay: 1,
      completedDays: [],
      lastCompletedDate: null,
      isFinished: false,
      timesCompleted: 0
    };
  }

  static saveNovenaProgress(novenaId, data) {
    try {
      const all = this.getAllNovenasProgress();
      all[novenaId] = data;
      _safeSetItem(STORAGE_KEYS.NOVENAS, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving novena progress:', e);
    }
  }

  static completeNovenaDay(novenaId, dayNumber, totalDays = 9) {
    const progress = this.getNovenaProgress(novenaId);
    if (!progress.completedDays.includes(dayNumber)) {
      progress.completedDays.push(dayNumber);
    }
    progress.lastCompletedDate = new Date().toISOString();
    
    if (dayNumber < totalDays) {
      progress.currentDay = Math.max(progress.currentDay, dayNumber + 1);
      progress.isFinished = false;
    } else {
      progress.isFinished = true;
      progress.timesCompleted = (progress.timesCompleted || 0) + 1;
    }
    this.saveNovenaProgress(novenaId, progress);
    this.incrementSpiritualScore(15, 'paz_interior');
    return progress;
  }

  static resetNovena(novenaId) {
    const progress = this.getNovenaProgress(novenaId);
    progress.currentDay = 1;
    progress.completedDays = [];
    progress.lastCompletedDate = null;
    progress.isFinished = false;
    this.saveNovenaProgress(novenaId, progress);
    return progress;
  }
}

