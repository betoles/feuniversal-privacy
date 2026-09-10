import { SCRIPTURES_CATALOG } from './scriptures-catalog.js';

/**
 * Mapeo inteligente canónico de intenciones y estados emocionales para escrituras
 */
const mapScriptureToDevotionalMeta = (item) => {
  const id = item.id || '';
  const lk = item.libroKey || '';
  
  if (id.startsWith('tanaj_psalm_')) {
    const num = item.capituloNumero;
    if ([91, 23, 27, 35, 59, 121, 140, 144].includes(num)) return { cat: 'proteccion', emos: ['miedo_angustia', 'peligro_enemigos', 'desesperacion'] };
    if ([6, 30, 38, 41, 103, 107, 147].includes(num)) return { cat: 'salud_sanacion', emos: ['enfermedad_dolor', 'cansancio_agotamiento', 'tristeza_duelo'] };
    if ([4, 42, 46, 62, 131].includes(num)) return { cat: 'paz_interior', emos: ['miedo_angustia', 'soledad_vacio', 'tristeza_duelo'] };
    if ([23, 65, 67, 90, 112, 128, 144].includes(num)) return { cat: 'prosperidad_trabajo', emos: ['necesidad_escasez', 'confusion_duda'] };
    if ([1, 19, 25, 37, 73, 119].includes(num)) return { cat: 'sabiduria_guia', emos: ['confusion_duda', 'conflicto_familiar'] };
    if ([8, 29, 34, 66, 95, 96, 98, 100, 104, 111, 136, 145, 148, 150].includes(num)) return { cat: 'gratitud_alabanza', emos: ['gratitud_gozo'] };
    if ([25, 32, 51, 130, 143].includes(num)) return { cat: 'perdon_reconciliacion', emos: ['culpa_arrepentimiento', 'rabia_resentimiento'] };
    return { cat: 'fortaleza_fe', emos: ['miedo_angustia', 'tristeza_duelo', 'cansancio_agotamiento', 'desesperacion'] };
  }
  
  if (id.startsWith('quran_sura_')) {
    const num = item.capituloNumero;
    if ([1, 2, 36, 55, 67, 112, 113, 114].includes(num)) return { cat: 'proteccion', emos: ['miedo_angustia', 'peligro_enemigos', 'desesperacion'] };
    if ([93, 94].includes(num)) return { cat: 'paz_interior', emos: ['tristeza_duelo', 'soledad_vacio'] };
    if ([56, 108].includes(num)) return { cat: 'prosperidad_trabajo', emos: ['necesidad_escasez'] };
    return { cat: 'sabiduria_guia', emos: ['confusion_duda', 'conflicto_familiar', 'miedo_angustia'] };
  }
  
  if (lk === 'gita' || id.startsWith('gita_chapter_')) {
    return { cat: 'sabiduria_guia', emos: ['confusion_duda', 'cansancio_agotamiento', 'conflicto_familiar'] };
  }
  
  if (lk === 'dhammapada' || id.startsWith('dhammapada_vagga_')) {
    return { cat: 'paz_interior', emos: ['rabia_resentimiento', 'soledad_vacio', 'tristeza_duelo'] };
  }
  
  if (lk === 'tao' || id.startsWith('tao_chapter_')) {
    return { cat: 'paz_interior', emos: ['confusion_duda', 'soledad_vacio'] };
  }
  
  if (id.startsWith('proverb_chapter_')) {
    return { cat: 'prosperidad_trabajo', emos: ['confusion_duda', 'necesidad_escasez'] };
  }
  
  if (id.startsWith('genesis_chapter_') || id.startsWith('exodus_chapter_')) {
    return { cat: 'fortaleza_fe', emos: ['miedo_angustia', 'gratitud_gozo'] };
  }
  
  if (id.startsWith('epistle_')) {
    return { cat: 'fortaleza_fe', emos: ['desesperacion', 'tristeza_duelo', 'conflicto_familiar'] };
  }
  
  if (id.startsWith('gospel_') || id.startsWith('revelation_')) {
    return { cat: 'proteccion', emos: ['miedo_angustia', 'peligro_enemigos', 'gratitud_gozo'] };
  }
  
  if (id.startsWith('mormon_')) {
    return { cat: 'sabiduria_guia', emos: ['confusion_duda', 'miedo_angustia'] };
  }
  
  return { cat: 'fortaleza_fe', emos: ['miedo_angustia', 'tristeza_duelo'] };
};

const BASE_CANONICAL_PRAYERS = [
  // 1. PROTECCIÓN & RESGUARDO (Catolicismo)
  {
    "id": "ARCANGEL_MIGUEL_ESPADA",
    "tradicion": "catolicismo",
    "categoriaIntencion": "proteccion",
    "estadosEmocionales": ["miedo_angustia", "peligro_enemigos", "angustia", "desesperacion"],
    "titulo": {
      "es": "San Miguel Arcángel · Corte y Defensa con Espada de Fuego",
      "en": "Saint Michael the Archangel · Shield & Flaming Sword Defense",
      "fr": "Saint Michel Archange · Épée de Feu et Protection",
      "pt": "São Miguel Arcanjo · Defesa com a Espada de Fogo",
      "lat": "Oratio ad Sanctum Michaelem Archangelum"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Sancte Michael Archangele, defende nos in proelio;\ncontra nequitiam et insidias diaboli esto praesidium.\nImperet illi Deus, supplices deprecamur:\ntuque, Princeps militiae caelestis, Satanam aliosque spiritus malignos,\nqui ad perditionem animarum pervagantur in mundo,\ndivina virtute, in infernum detrude. Amen.",
    "guiaFonetica": "[Sánc-te Mí-ka-el Ar-kán-ye-le, de-fén-de nos in pré-li-o; cón-tra ne-kuí-tzi-am et in-sí-di-as di-á-bo-li és-to pre-sí-di-um...]",
    "traducciones": {
      "es": "San Miguel Arcángel, defiéndenos en la batalla. Sé nuestro amparo contra la perversidad y las acechanzas del demonio. Reprímale Dios, pedimos suplicantes; y tú, Príncipe de la milicia celestial, arroja al infierno con el divino poder a Satanás y a los demás espíritus malignos que andan dispersos por el mundo para la perdición de las almas. Amén.",
      "en": "Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the Heavenly Host, by the power of God, cast into hell Satan and all the evil spirits who prowl throughout the world seeking the ruin of souls. Amen.",
      "fr": "Saint Michel Archange, défendez-nous dans le combat. Soyez notre secours contre la malice et les embûches du démon. Que Dieu lui commande, nous vous en supplions; et vous, Prince de la milice céleste, repoussez en enfer, par la force divine, Satan et les autres esprits mauvais qui rôdent dans le monde pour la perte des âmes. Amen.",
      "pt": "São Miguel Arcanjo, defendei-nos no combate. Sede o nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos; e vós, Príncipe da milícia celeste, pela virtude divina, precipitai no inferno a Satanás e aos outros espíritus malignos que andam pelo mundo para a perdição das almas. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "treinta_y_tres",
      "duracionVeladoraSugeridaHoras": 9,
      "paisajeSonoroRecomendado": "ondas_gamma"
    }
  },

  // 2. SALUD & SANACIÓN (Catolicismo / San Rafael)
  {
    "id": "ARCANGEL_RAFAEL_SANACION",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "tristeza_duelo", "cansancio_agotamiento", "desesperacion"],
    "titulo": {
      "es": "San Rafael Arcángel · Medicina Divina y Alivio del Cuerpo",
      "en": "Saint Raphael the Archangel · Divine Healing & Restoration",
      "fr": "Saint Raphaël Archange · Guérison Divine et Réconfort",
      "pt": "São Rafael Arcanjo · Cura Divina e Alívio do Sofrimento"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Raphael, custos et dux noster, afflictorum consolator et aegrotantium medicus,\ncorporis et animae morbos propelle, lucemque caelestem nobis impetra. Amen.",
    "guiaFonetica": "[Rá-fa-el, cús-tos et duks nós-ter...]",
    "traducciones": {
      "es": "Glorioso San Rafael Arcángel, medicina de Dios, extiende tus alas sobre mi cuerpo y mi alma. Disipa toda dolencia, alivia el dolor físico y renueva mis fuerzas con la bendición del Altísimo. Amén.",
      "en": "Glorious Saint Raphael, medicine of God, extend your healing presence upon my body and soul. Dispel all sickness and restore my vital energy. Amen.",
      "fr": "Glorieux Saint Raphaël, remède de Dieu, répands ta grâce de guérison sur mon être tout entier. Amen.",
      "pt": "Glorioso São Rafael, medicina de Deus, estende tuas asas curadoras sobre mim e renova minha saúde. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "cuencos_tibetanos"
    }
  },

  // 3. PAZ INTERIOR & SERENIDAD (Budismo / Védica)
  {
    "id": "BUDISMO_COMPASION_TARA",
    "tradicion": "budismo",
    "categoriaIntencion": "paz_interior",
    "estadosEmocionales": ["tristeza_duelo", "miedo_angustia", "rabia_resentimiento", "soledad_vacio"],
    "titulo": {
      "es": "Tara Verde · Protección Maternal y Calma Profunda",
      "en": "Green Tara Mantra · Liberating Compassion & Peace",
      "fr": "Tara Verte · Compassion et Sérénité Profonde",
      "pt": "Tara Verde · Proteção Compassiva e Paz Mental"
    },
    "idiomaLiturgicoOriginal": "Sánscrito Sagrado (संस्कृतम्)",
    "textoOriginal": "ॐ तारे तुत्तारे तुरे स्वाहा ॥",
    "guiaFonetica": "[Om Ta-re Tu-ta-re Tu-re Soa-ja]",
    "traducciones": {
      "es": "Om. Me postro ante Tara, la libertadora que disipa todos los miedos, sana las aflicciones del alma y derrama serenidad inagotable en el corazón. Svaha.",
      "en": "Om. I bow to Tara, who frees all beings from fears, sorrow and suffering, bringing endless peace. Svaha.",
      "fr": "Om. Hommage à Tara, la libératrice qui dissipe les peurs et apaise l’esprit. Svaha.",
      "pt": "Om. Saúdo a nobre Tara que dissipa todos os medos e acalma a mente em paz profunda. Svaha."
    },
    "ritualesAsociados": {
      "tipoContador": "japa_mala_108",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "lluvia_zen"
    }
  },

  // 4. PROSPERIDAD & TRABAJO (Catolicismo / San Cayetano)
  {
    "id": "SAN_CAYETANO_PROSPERIDAD",
    "tradicion": "catolicismo",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["necesidad_escasez", "confusion_duda", "desesperacion"],
    "titulo": {
      "es": "San Cayetano · Apertura de Caminos, Trabajo y Provisión Honrada",
      "en": "Saint Cajetan · Blessing for Work, Provision & Honest Bread",
      "fr": "Saint Gaétan · Travail, Prospérité et Providence",
      "pt": "São Caetano · Abertura de Caminhos e Pão Sagrado"
    },
    "idiomaLiturgicoOriginal": "Español Canónico",
    "textoOriginal": "San Cayetano glorioso, padre de la divina providencia,\nintercede ante el Señor para que en mi hogar nunca falte la paz, la salud y el trabajo bendito. Amén.",
    "guiaFonetica": "[San Ka-ye-tá-no glo-rió-so...]",
    "traducciones": {
      "es": "Glorioso San Cayetano, intercesor del trabajo y la provisión, abre puertas de bendición laboral y multiplica el sustento honrado en mi hogar. Amén.",
      "en": "Glorious Saint Cajetan, patron of labor and provision, open doors of opportunity and bless our daily bread. Amen.",
      "fr": "Glorieux Saint Gaétan, ouvre les portes de l'abondance et du travail béni pour notre famille. Amen.",
      "pt": "Glorioso São Caetano, abri caminhos de trabalho e prosperidade para o nosso lar. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "treinta_y_tres",
      "duracionVeladoraSugeridaHoras": 72,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },

  // 5. SABIDURÍA & GUÍA ESPIRITUAL (Catolicismo / San Gabriel)
  {
    "id": "ARCANGEL_GABRIEL_NOTICIAS",
    "tradicion": "catolicismo",
    "categoriaIntencion": "sabiduria_guia",
    "estadosEmocionales": ["confusion_duda", "miedo_angustia", "conflicto_familiar"],
    "titulo": {
      "es": "San Gabriel Arcángel · Sabiduría, Guía y Buenas Noticias",
      "en": "Saint Gabriel the Archangel · Wisdom, Guidance & Good News",
      "fr": "Saint Gabriel Archange · Sagesse et Bonnes Nouvelles",
      "pt": "São Gabriel Arcanjo · Sabedoria e Boas Novas",
      "lat": "Oratio ad Sanctum Gabrielem Archangelum"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "O Gabriel, sancte Archangele, qui nuntius fuisti divinae incarnationis,\naperi aures nostras ad monitiones cordis clementis Iesu et Mariae.\nAmen.",
    "guiaFonetica": "[O Gá-bri-el, sánc-te Ar-kán-ye-le...]",
    "traducciones": {
      "es": "Oh Santo Arcángel Gabriel, mensajero de los misterios divinos, abre nuestros corazones a la luz de la sabiduría, el discernimiento y las buenas noticias. Amén.",
      "en": "O Holy Archangel Gabriel, messenger of divine mysteries, open our hearts to the light of wisdom, discernment and peace. Amen.",
      "fr": "Ô Saint Archange Gabriel, messager des mystères divins, ouvrez nos cœurs à la lumière de la sagesse. Amen.",
      "pt": "Ó Santo Arcanjo Gabriel, mensageiro dos mistérios divinos, abri nossos corações à luz da sabedoria. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "treinta_y_tres",
      "duracionVeladoraSugeridaHoras": 9,
      "paisajeSonoroRecomendado": "ondas_alfa"
    }
  },

  // 6. GRATITUD & ALABANZA (Hebreo / Salmos)
  {
    "id": "SALMO_100_GRATITUD",
    "tradicion": "hebreo_salmos",
    "categoriaIntencion": "gratitud_alabanza",
    "estadosEmocionales": ["gratitud_gozo", "soledad_vacio", "tristeza_duelo"],
    "titulo": {
      "es": "Salmo 100 (Mizmor LeTodah) · Cántico de Gratitud y Jubilo",
      "en": "Psalm 100 · A Psalm of Thanksgiving & Radiant Praise",
      "fr": "Psaume 100 · Hymne d’Action de Grâce et de Louange",
      "pt": "Salmo 100 · Cântico de Ação de Graças e Alegria"
    },
    "idiomaLiturgicoOriginal": "Hebreo Bíblico (עברית מקראית)",
    "dir": "rtl",
    "textoOriginal": "מִזְמוֹר לְתוֹדָה: הָרִיעוּ לַיהוָה, כָּל-הָאָרֶץ. עִבְדוּ אֶת-יְהוָה בְּשִׂמְחָה; בֹּאוּ לְפָנָיו, בִּרְנָנָה.",
    "guiaFonetica": "[Miz-mór le-to-dáh: Ha-rí-u l'Adonai kol ha-á-retz. Iv-dú et Adonai b'sim-cháh...]",
    "traducciones": {
      "es": "Cantad alegres a Dios, habitantes de toda la tierra. Servid al Señor con alegría; venid ante su presencia con regocijo. Porque el Señor es bueno y para siempre es su misericordia. Amén.",
      "en": "Make a joyful noise unto the Lord, all ye lands. Serve the Lord with gladness: come before his presence with singing. For the Lord is good. Amen.",
      "fr": "Poussez des cris de joie vers l'Éternel, habitants de toute la terre! Servez l'Éternel avec joie, venez avec allégresse en sa présence. Amen.",
      "pt": "Celebrai com júbilo ao Senhor, todos os moradores da terra. Servi ao Senhor com alegria e apresentai-vos a Ele com cânticos. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "veinticuatro",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "campanas_catedral"
    }
  },

  // 7. PERDÓN & RECONCILIACIÓN (Cristiano / Universal)
  {
    "id": "ORACION_PERDON_SANACION",
    "tradicion": "catolicismo",
    "categoriaIntencion": "perdon_reconciliacion",
    "estadosEmocionales": ["culpa_arrepentimiento", "rabia_resentimiento", "conflicto_familiar"],
    "titulo": {
      "es": "Plegaria de Reconciliación, Liberación de Culpas y Paz del Alma",
      "en": "Prayer of Forgiveness, Inner Healing & Divine Mercy",
      "fr": "Prière de Pardon, Réconciliation et Miséricorde",
      "pt": "Oração de Perdão, Reconciliação e Limpeza da Alma"
    },
    "idiomaLiturgicoOriginal": "Español Canónico",
    "textoOriginal": "Señor de infinita misericordia, hoy elijo perdonar de corazón toda ofensa y herida del pasado.\nLibérame de la culpa, purifica mis pensamientos y restáurame en tu amor incondicional. Amén.",
    "guiaFonetica": "[Se-ñor de in-fi-ní-ta mi-se-ri-cór-dia...]",
    "traducciones": {
      "es": "Señor de infinita misericordia, hoy elijo perdonar de corazón a quienes me ofendieron y pido perdón por mis propias faltas. Rompe las cadenas del rencor y llena mi alma de concordia y paz. Amén.",
      "en": "Lord of boundless mercy, today I choose to forgive from the bottom of my heart. Cleanse my spirit from resentment and grant me your enduring peace. Amen.",
      "fr": "Seigneur de miséricorde, je choisis de pardonner et d'être libéré de toute rancœur. Rétablis la paix dans mon cœur. Amen.",
      "pt": "Senhor de infinita misericórdia, perdoo de coração e liberto toda mágoa para viver na Tua paz. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "ondas_theta"
    }
  },

  // 8. FORTALEZA ESPIRITUAL & FE (Pentecostal / Salmo 91)
  {
    "id": "SALMO_91_FORTALEZA_FE",
    "tradicion": "pentecostal",
    "categoriaIntencion": "fortaleza_fe",
    "estadosEmocionales": ["miedo_angustia", "desesperacion", "cansancio_agotamiento"],
    "titulo": {
      "es": "Salmo 91 · Fortaleza Inquebrantable y Morada del Altísimo",
      "en": "Psalm 91 · Unshakable Strength & Abiding in the Almighty",
      "fr": "Psaume 91 · Forteresse Spirituelle et Protection Divine",
      "pt": "Salmo 91 · Fortaleza Espiritual e Abrigo do Altíssimo"
    },
    "idiomaLiturgicoOriginal": "Español Reina-Valera",
    "textoOriginal": "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.\nDiré yo al Señor: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.",
    "guiaFonetica": "[El ke a-bí-ta al a-brí-go del Al-tí-si-mo...]",
    "traducciones": {
      "es": "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo al Señor: Esperanza mía, y castillo mío; mi Dios, en quien confiaré. No temerás el terror nocturno, ni saeta que vuele de día. Amén.",
      "en": "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust. Amen.",
      "fr": "Celui qui demeure sous l'abri du Très-Haut repose à l'ombre du Tout-Puissant. Je dis à l'Éternel: Mon refuge et ma forteresse, mon Dieu en qui je me confie! Amen.",
      "pt": "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "treinta_y_tres",
      "duracionVeladoraSugeridaHoras": 72,
      "paisajeSonoroRecomendado": "viento_monte"
    }
  },

  // 9. TRADICIÓN VÉDICA (Gayatri Mantra · Iluminación y Fuerza)
  {
    "id": "VEDICA_GAYATRI_MANTRA",
    "tradicion": "vedica",
    "categoriaIntencion": "sabiduria_guia",
    "estadosEmocionales": ["confusion_duda", "cansancio_agotamiento", "miedo_angustia"],
    "titulo": {
      "es": "Gāyatrī Mantra · Luz Solar Suprema y Discernimiento Cósmico",
      "en": "Gāyatrī Mantra · Divine Illumination & Spiritual Wisdom",
      "fr": "Mantra Gayatri · Lumière Suprême et Clarté Mentale",
      "pt": "Gayatri Mantra · Iluminação Espiritual e Sabedoria"
    },
    "idiomaLiturgicoOriginal": "Sánscrito Védico (संस्कृतम्)",
    "textoOriginal": "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
    "guiaFonetica": "[Om Bhur Bhu-vah Svah, Tat Sa-vi-tur Va-ren-yam, Bhar-go De-vas-ya Dhi-ma-hi, Dhi-yo Yo Nah Pra-cho-da-yat]",
    "traducciones": {
      "es": "Meditamos en la gloria del Creador supremo, el Sol de la Conciencia Divina. Que su resplandor celestial ilumine nuestro entendimiento y guíe nuestros pasos hacia la verdad y la paz. Om.",
      "en": "We meditate upon the supreme splendor of the Divine Sun. May that radiant light illuminate our intellect and guide our spiritual path. Om.",
      "fr": "Nous méditons sur la lumière éclatante du Divin Soleil. Puisse-t-elle illuminer notre esprit et dissiper les ténèbres. Om.",
      "pt": "Meditamos na luz suprema do Criador do Universo. Que essa energia divina ilumine nossa mente e consciência. Om."
    },
    "ritualesAsociados": {
      "tipoContador": "japa_mala_108",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "cuencos_tibetanos"
    }
  },

  // 10. TRADICIÓN ISLÁMICA (Dua de Protección y Alivio)
  {
    "id": "ISLAM_DUA_ALIVIO_YUNUS",
    "tradicion": "islam",
    "categoriaIntencion": "proteccion",
    "estadosEmocionales": ["miedo_angustia", "desesperacion", "tristeza_duelo", "culpa_arrepentimiento"],
    "titulo": {
      "es": "Dua de Yunus (Dua al-Karb) · Rescate en la Oscuridad y Esperanza",
      "en": "Dua of Yunus · Deliverance from Distress & Calamity",
      "fr": "Invocation de Jonas · Délivrance de l’Angoisse",
      "pt": "Dua de Yunus · Libertação da Angústia e Socorro Divino"
    },
    "idiomaLiturgicoOriginal": "Árabe Clásico (عربي فصيح)",
    "dir": "rtl",
    "textoOriginal": "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    "guiaFonetica": "[Lā ilāha illā anta subḥānaka innī kuntu mina ẓ-ẓālimīn]",
    "traducciones": {
      "es": "No hay más divinidad que Tú. ¡Glorificado seas! Ciertamente he sido de los que yerran. Sálvame de la angustia y concédeme Tu auxilio y paz. Amén.",
      "en": "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers. Deliver me from distress. Amen.",
      "fr": "Pas de divinité à part Toi! Pureté à Toi! J'ai été vraiment du nombre des injustes. Délivre-moi de l'angoisse. Amen.",
      "pt": "Não há divindade além de Ti; glorificado sejas! Em verdade, tenho errado. Salva-me da aflição. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "tasbih_33",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "viento_monte"
    }
  },

  // 11. NUESTRA SEÑORA DE LUJÁN (Patrona de Argentina)
  {
    "id": "VIRGEN_LUJAN_ARGENTINA",
    "tradicion": "catolicismo",
    "categoriaIntencion": "proteccion",
    "estadosEmocionales": ["miedo_angustia", "soledad_vacio", "tristeza_duelo", "desesperacion"],
    "titulo": {
      "es": "Nuestra Señora de Luján · Manto Maternal de la Patria y el Hogar",
      "en": "Our Lady of Luján · Maternal Cloak & Protection of the Homeland",
      "fr": "Notre-Dame de Luján · Protection Maternelle",
      "pt": "Nossa Senhora de Luján · Manto Maternal e Proteção da Família"
    },
    "idiomaLiturgicoOriginal": "Español Litúrgico & Latín",
    "textoOriginal": "¡Virgen Santísima de Luján, Madre de Dios y Madre nuestra!\nHumildemente postrados a tus plantas, te consagramos nuestros hogares, nuestras alegrías y nuestras penas.\nGuarda a nuestra tierra, defiende a los desvalidos y alcánzanos de tu divino Hijo la paz y la concordia.\nBajo tu manto celeste y blanco ponemos nuestra esperanza. Amén.",
    "guiaFonetica": "[Vír-jen San-tí-si-ma de Lu-ján, Má-dre de Diós y Má-dre nués-tra...]",
    "traducciones": {
      "es": "¡Virgen Santísima de Luján, Madre de Dios y Madre nuestra! Humildemente postrados a tus plantas, te consagramos nuestros hogares, nuestras alegrías y nuestras penas. Guarda a nuestra tierra, defiende a los desvalidos y alcánzanos de tu divino Hijo la paz y la concordia. Amén.",
      "en": "Holy Virgin of Luján, Mother of God and our Mother! Humbly at your feet, we consecrate our homes, joys, and sorrows. Protect our land, defend the vulnerable, and grant us peace and harmony through your divine Son. Amen.",
      "fr": "Sainte Vierge de Luján, Mère de Dieu et notre Mère! Nous vous consacrons nos foyers et nos peines. Protégez notre terre et obtenez-nous la paix. Amen.",
      "pt": "Santíssima Virgem de Luján, Mãe de Deus e nossa Mãe! Consagramos a ti nossos lares e aflições. Guarda nossa terra e concede-nos a paz. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "canto_gregoriano"
    }
  },

  // 12. SEÑOR DE LOS MILAGROS (Cristo Moreno de las Nazarenas - Perú)
  {
    "id": "SENOR_MILAGROS_PERU",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "desesperacion", "miedo_angustia", "culpa_arrepentimiento"],
    "titulo": {
      "es": "Señor de los Milagros · Cristo Moreno y Médico de Almas",
      "en": "Lord of Miracles · Holy Christ of Nazarenas & Soul Healer",
      "fr": "Seigneur des Miracles · Guérison et Rédemption",
      "pt": "Senhor dos Milagres · Cristo Moreno e Médico das Almas"
    },
    "idiomaLiturgicoOriginal": "Español Litúrgico",
    "textoOriginal": "Señor de los Milagros, que clavado en la Cruz derramas torrentes de misericordia sobre quienes acuden a Ti:\nMira con piedad nuestras dolencias del cuerpo y del alma.\nSana nuestras heridas, levanta al caído y concede a nuestras familias salud, trabajo y santa fortaleza.\n¡Señor de los Milagros, en Ti confío! Amén.",
    "guiaFonetica": "[Se-ñór de los Mi-lá-gros, que cla-vá-do en la Cruz de-rrá-mas to-rrén-tes de mi-se-ri-cór-dia...]",
    "traducciones": {
      "es": "Señor de los Milagros, que clavado en la Cruz derramas torrentes de misericordia sobre quienes acuden a Ti: mira con piedad nuestras dolencias del cuerpo y del alma. Sana nuestras heridas, levanta al caído y concede a nuestras familias salud, trabajo y santa fortaleza. Amén.",
      "en": "Lord of Miracles, who nailed upon the Cross pours out torrents of mercy: look with compassion upon the ailments of our body and soul. Heal our wounds and grant our families health and strength. Amen.",
      "fr": "Seigneur des Miracles, qui répands Ta miséricorde depuis la Croix: guéris nos corps et nos âmes, et accorde-nous Ta sainte force. Amen.",
      "pt": "Senhor dos Milagres, que da Cruz derramas torrentes de misericórdia: cura nossas enfermidades e concede às nossas famílias saúde e paz. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 33,
      "paisajeSonoroRecomendado": "canto_gregoriano"
    }
  },

  // 13. BEATO DR. JOSÉ GREGORIO HERNÁNDEZ (Médico de los Pobres - Venezuela)
  {
    "id": "DR_JOSE_GREGORIO_HERNANDEZ",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "desesperacion", "tristeza_duelo", "cansancio_agotamiento"],
    "titulo": {
      "es": "Beato Dr. José Gregorio Hernández · Médico de los Pobres y Sanación",
      "en": "Blessed Dr. José Gregorio Hernández · Physician of the Poor & Healing",
      "fr": "Bienheureux Dr. José Gregorio Hernández · Guérison des Malades",
      "pt": "Beato Dr. José Gregorio Hernández · Médico dos Pobres e Cura"
    },
    "idiomaLiturgicoOriginal": "Español Litúrgico",
    "textoOriginal": "¡Oh Dios todopoderoso y misericordioso, que diste al Beato Dr. José Gregorio Hernández la vocación sagrada de servir a los enfermos con ciencia y profundo amor cristiano!\nTe suplicamos por su intercesión la salud y el alivio de esta enfermedad que hoy nos aflige.\nGuía las manos de los médicos y restaura en nosotros la plenitud de la vida para alabarte siempre. Amén.",
    "guiaFonetica": "[Oh Diós to-do-po-de-ró-so y mi-se-ri-cor-dió-so, que dís-te al Be-á-to Doc-tór Jo-sé Gre-gó-rio Her-nán-dez...]",
    "traducciones": {
      "es": "¡Oh Dios todopoderoso y misericordioso, que diste al Beato Dr. José Gregorio Hernández la vocación de servir a los enfermos con ciencia y amor cristiano! Te suplicamos por su intercesión la salud y el alivio de esta enfermedad. Restaura en nosotros la plenitud de la vida. Amén.",
      "en": "Almighty and merciful God, who endowed Blessed Dr. José Gregorio Hernández with the vocation to serve the sick with medical skill and Christian love: grant us through his intercession relief and healing in our illness. Amen.",
      "fr": "Dieu tout-puissant, accorde-nous par l’intercession du Bienheureux Dr José Gregorio Hernández la guérison de notre maladie et le soulagement. Amen.",
      "pt": "Deus onipotente, que destes ao Beato Dr. José Gregorio Hernández a vocação de servir aos enfermos: concede-nos por sua intercessão a cura e a saúde. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_528"
    }
  },

  // 14. NUESTRA SEÑORA DE CAACUPÉ (Paraguay)
  {
    "id": "VIRGEN_CAACUPE_PARAGUAY",
    "tradicion": "catolicismo",
    "categoriaIntencion": "fortaleza_fe",
    "estadosEmocionales": ["miedo_angustia", "cansancio_agotamiento", "soledad_vacio", "tristeza_duelo"],
    "titulo": {
      "es": "Virgen de Caacupé · Estrella de los Caminos y Esperanza",
      "en": "Our Lady of Caacupé · Star of Hope & Travelers",
      "fr": "Notre-Dame de Caacupé · Étoile de l’Espérance",
      "pt": "Nossa Senhora de Caacupé · Estrela da Esperança e Fé"
    },
    "idiomaLiturgicoOriginal": "Guaraní & Español",
    "textoOriginal": "Tupãsy Caacupé, Tupã Sy marangatu:\nEma\'ẽmi orerehe ko py\'atarovápe.\nVirgen Santa de Caacupé, Madre de los humildes y peregrinos, acompáñanos en las fatigas del camino de la vida, bendice el pan de nuestras mesas y conserva viva la fe en nuestros corazones. Amén.",
    "guiaFonetica": "[Tu-pã-sy Caa-cu-pé, Tu-pã Sy ma-ran-ga-tu: E-ma-'ẽ-mi o-re-re-he ko py-'a-ta-ro-vá-pe...]",
    "traducciones": {
      "es": "Madre de Dios de Caacupé, Madre Santa: míranos en nuestras tribulaciones. Virgen Santa de Caacupé, acompáñanos en las fatigas del camino, bendice el pan de nuestras mesas y conserva viva la fe en nuestros corazones. Amén.",
      "en": "Holy Mother of Caacupé, look upon us in our struggles. Guide our steps along life's pilgrimage, bless the bread on our tables, and keep our faith ever burning. Amen.",
      "fr": "Sainte Mère de Caacupé, regarde nos peines. Guide nos pas et bénis nos familles. Amen.",
      "pt": "Mãe Santa de Caacupé, olha por nós em nossas aflições. Guia nossos passos, abençoa nosso pão e conserva nossa fé. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_432"
    }
  },

  // 15. CANTO SAGRADO A OCHÚN Y YEMAYÁ (Tradición Yoruba / Santería Lucumí)
  {
    "id": "CANTO_OCHUN_YEMAYA_LUCUMI",
    "tradicion": "santeria",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["tristeza_duelo", "soledad_vacio", "necesidad_escasez", "confusion_duda"],
    "titulo": {
      "es": "Canto a Ochún y Yemayá · Dulzura, Fertilidad y Manto de Aguas Vivas",
      "en": "Sacred Chant to Oshun & Yemoja · Waters of Abundance & Sweetness",
      "fr": "Chant Sacré à Oshun et Yemaya · Eaux Vives et Douceur",
      "pt": "Canto Sagrado a Oxum e Iemanjá · Águas Doces e Abundância"
    },
    "idiomaLiturgicoOriginal": "Lucumí / Yoruba Sagrado (Èdè Yorùbá)",
    "textoOriginal": "Yeye o, Oshun mori yeyeo, obinrin koro, afide owo, lade koyu!\nOmio Yemaya, Iya orisha, asesu oni Yemaya, oku ayo ba mi o.\nAshé, Ashé, Ashé to ibán Èṣù.",
    "guiaFonetica": "[Ye-ye o, O-shun mó-ri ye-ye-o, o-bin-rin kó-ro, a-fi-de o-wo, la-de ko-yu! O-mio Ye-ma-ya, I-ya o-ri-sha... A-shé, A-shé, A-shé to i-bán E-shu]",
    "traducciones": {
      "es": "¡Madre venerable Ochún, reina de las aguas dulces, de la miel, la belleza y la abundancia! ¡Madre Yemayá, reina inmensa del mar azul y protectora de la vida! Derramen sobre mi ser salud, prosperidad, dulzura y serenidad profunda. Que así sea con la gracia divina.",
      "en": "Venerable Mother Oshun, queen of sweet waters, honey, and divine abundance! Mother Yemoja, vast queen of the ocean and protector of life! Pour upon me health, sweet blessings, and serene peace. Ashé.",
      "fr": "Mère Oshun des eaux douces et Mère Yemaya des mers infinies: apportez la douceur, la santé et la prospérité dans ma vie. Ashé.",
      "pt": "Mãe Oxum das águas doces e Mãe Iemanjá do mar sagrado: derramai sobre nós doçura, cura, fartura e paz. Axé."
    },
    "ritualesAsociados": {
      "tipoContador": "decretos_21",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "tambores_bata_yoruba"
    }
  },

  // 16. QOHÉLET / ECLESIASTÉS 3: TODO TIENE SU TIEMPO (Hebreo Bíblico Masorético)
  {
    "id": "QOHELET_ECLESIASTES_3",
    "tradicion": "hebreo_salmos",
    "categoriaIntencion": "sabiduria_guia",
    "estadosEmocionales": ["confusion_duda", "desesperacion", "tristeza_duelo", "cansancio_agotamiento"],
    "titulo": {
      "es": "Eclesiastés 3 (Qohélet) · Todo Tiene su Tiempo Bajo el Cielo",
      "en": "Ecclesiastes 3 · A Time for Every Purpose Under Heaven",
      "fr": "Ecclésiaste 3 · Il y a un temps pour tout sous le ciel",
      "pt": "Eclesiastes 3 · Tudo tem o seu tempo determinado",
      "he": "קהלת פרק ג׳ · לַכֹּל זְמָן וְעֵת לְכָל־חֵפֶץ"
    },
    "idiomaLiturgicoOriginal": "Hebreo Bíblico (עברית מקראית)",
    "dir": "rtl",
    "textoOriginal": "לַכֹּל זְמָן וְעֵת לְכָל־חֵפֶץ תַּחַת הַשָּׁמָיִם׃\nעֵת לָלֶדֶת וְעֵת לָמוּת עֵת לָטַעַת וְעֵת לַעֲקוֹר נָטוּעַ׃\nעֵת לִרְפּוֹא וְעֵת לִבְנוֹת עֵת לִבְכּוֹת וְעֵת לִשְׂחוֹק׃\nאֶת־הַכֹּל עָשָׂה יָפֶה בְעִתּוֹ גַּם אֶת־הָעֹלָם נָתַן בְּלִבָּם.",
    "guiaFonetica": "[La-kol zman ve-'et le-kol che-fetz ta-chat ha-sha-má-yim. 'Et la-le-det ve-'et la-mut, 'et la-ta-'at ve-'et la-'a-kor na-tú-a... Et ha-kol a-sah ya-feh ve-'i-to...]",
    "traducciones": {
      "es": "Todo tiene su momento, y cada cosa su tiempo bajo el cielo: tiempo de nacer y tiempo de morir; tiempo de plantar y tiempo de cosechar; tiempo de sanar y tiempo de edificar; tiempo de llorar y tiempo de reír. Dios ha hecho todo hermoso en su debido tiempo.",
      "en": "To everything there is a season, and a time to every purpose under heaven: a time to be born, and a time to die; a time to plant, and a time to pluck up that which is planted; a time to heal, and a time to build; a time to weep, and a time to laugh. He hath made everything beautiful in his time.",
      "fr": "Il y a un moment pour tout, et un temps pour toute chose sous le ciel: un temps pour naître, et un temps pour mourir; un temps pour guérir, et un temps pour bâtir. Dieu fait toute chose belle en son temps.",
      "pt": "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu: tempo de nascer, e tempo de morrer; tempo de plantar, e tempo de colher; tempo de curar, e tempo de edificar. Tudo fez Deus formoso no seu devido tempo."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "shofar_mistico"
    }
  },

  // 17. INVOCACIÓN DEL G.A.D.U. (Espiritualidad Masónica / Constructores)
  {
    "id": "TRAZADO_GADU_MASONERIA",
    "tradicion": "espiritismo",
    "categoriaIntencion": "sabiduria_guia",
    "estadosEmocionales": ["confusion_duda", "miedo_angustia", "soledad_vacio"],
    "titulo": {
      "es": "Invocación al G.A.D.U. · Orden, Rectitud y Fraternidad Universal",
      "en": "Invocation to the G.A.O.T.U. · Sacred Geometry, Light & Universal Brotherhood",
      "fr": "Invocation au G.A.D.L.U. · Sagesse, Force et Beauté",
      "pt": "Invocação ao G.A.D.U. · Retidão, Luz e Fraternidade Universal"
    },
    "idiomaLiturgicoOriginal": "Español e Inglés Universal",
    "textoOriginal": "A la Gloria del Gran Arquitecto del Universo:\nQue la Sabiduría dirija nuestros pensamientos, que la Fuerza sostenga nuestras obras, y que la Belleza adorne nuestras vidas.\nDesbasta la piedra tosca de nuestro ser, alinea nuestras acciones con la escuadra de la virtud y el compás del amor fraternal hacia toda la humanidad. Así sea.",
    "guiaFonetica": "[A la Gló-ria del Gran Ar-qui-téc-to del U-ni-vér-so... Que la Sa-bi-du-rí-a di-rí-ja nués-tros pen-sa-mién-tos...]",
    "traducciones": {
      "es": "A la Gloria del Gran Arquitecto del Universo: Que la Sabiduría dirija nuestros pensamientos, que la Fuerza sostenga nuestras obras, y que la Belleza adorne nuestras vidas. Desbasta la piedra tosca de nuestro ser y alinea nuestras acciones con la virtud y el amor fraternal. Así sea.",
      "en": "To the Glory of the Grand Architect of the Universe: May Wisdom direct our thoughts, Strength sustain our labors, and Beauty adorn our lives. Smooth the rough ashlar of our being and guide our actions with virtue and fraternal love. So mote it be.",
      "fr": "À la Gloire du Grand Architecte de l'Univers: Que la Sagesse éclaire nos esprits, la Force soutienne nos travaux, et la Beauté orne nos vies. Qu'il en soit ainsi.",
      "pt": "À Glória do Grande Arquiteto do Universo: Que a Sabedoria dirija nossos pensamentos, a Força sustente nossas obras e a Beleza adorne nossas vidas. Assim seja."
    },
    "ritualesAsociados": {
      "tipoContador": "decretos_21",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_963"
    }
  },

  // =========================================================================
  // --- PROSPERIDAD, TRABAJO Y APERTURA (prosperidad_trabajo) ---
  // =========================================================================
  {
    "id": "SAN_JOSE_OBRERO_TRABAJO",
    "tradicion": "catolicismo",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["necesidad_escasez", "cansancio_agotamiento", "confusion_duda"],
    "titulo": {
      "es": "San José Obrero · Dignidad del Trabajo, Sustento y Paz en el Hogar",
      "en": "Saint Joseph the Worker · Dignity of Labor, Provision & Peace",
      "fr": "Saint Joseph Artisan · Sanctification du Travail et du Foyer",
      "pt": "São José Operário · Dignidade do Trabalho e Sustento Familiar",
      "lat": "Oratio ad Sanctum Ioseph Opificem"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Sancte Ioseph, custos sanctae Familiae et opificum exemplar, opus manuum nostrarum sanctifica, panem quotidianum nobis impetra, et in omni labore pacem atque iustitiam concede. Amen.",
    "guiaFonetica": "[Sánc-te Yó-sef, cús-tos sánc-te Fa-mí-li-e et o-pí-fi-cum ek-sém-plar...]",
    "traducciones": {
      "es": "Glorioso San José Obrero, custodio de la Sagrada Familia y modelo de todos los trabajadores: bendice la obra de mis manos, abre caminos laborales donde haya escasez, y concédeme un sustento digno, honesto y abundante para mi familia. Amén.",
      "en": "Glorious Saint Joseph the Worker, protector of the Holy Family and model for all workers: bless the work of my hands, open employment opportunities in times of need, and grant honest and abundant provision for my household. Amen.",
      "fr": "Glorieux Saint Joseph Artisan, patron des travailleurs: bénis le travail de nos mains, accorde-nous un labeur digne et assure la juste subsistance de notre famille. Amen.",
      "pt": "Glorioso São José Operário, modelo dos trabalhadores: abençoai o trabalho de nossas mãos, abri caminhos de emprego e concedei o pão honesto e a paz em nosso lar. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_528"
    }
  },
  {
    "id": "SAN_JUDAS_TADEO_TRABAJO",
    "tradicion": "catolicismo",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["desesperacion", "necesidad_escasez", "miedo_angustia"],
    "titulo": {
      "es": "San Judas Tadeo · Auxilio Urgente en Causas Laborales y Económicas",
      "en": "Saint Jude Thaddeus · Urgent Aid in Work & Financial Distress",
      "fr": "Saint Jude Thaddée · Secours Urgent dans les Épreuves Matérielles",
      "pt": "São Judas Tadeu · Socorro Urgente nas Causas do Trabalho e Finanças",
      "lat": "Oratio ad Sanctum Iudam Thaddaeum"
    },
    "idiomaLiturgicoOriginal": "Español y Latín Tradicional",
    "textoOriginal": "Sancte Iuda Thaddaei, apostole gloriose, afflictorum patronus in causis arduis, respice angustias nostras, auxilium tempestivum confer et spem nostram firma. Amen.",
    "guiaFonetica": "[Sánc-te Yú-da Ta-dé-i, a-pós-to-le glo-ri-ó-se...]",
    "traducciones": {
      "es": "San Judas Tadeo, apóstol glorioso y patrono de los casos difíciles y desesperados: intercede ante Dios por mi situación económica y laboral. Haz que se abran puertas cerradas, que no me falte un trabajo digno y que la provisión divina llegue a mi hogar con prontitud. Amén.",
      "en": "Saint Jude Thaddeus, glorious apostle and patron of difficult and desperate causes: intercede before God in my financial and employment distress. Open closed doors, grant me honest work, and let divine provision quickly reach my home. Amen.",
      "fr": "Saint Jude Thaddée, apôtre fidèle et patron des causes difficiles: viens à mon secours dans mes épreuves matérielles et professionnelles. Ouvre les chemins fermés et accorde-moi la grâce d'un travail digne. Amen.",
      "pt": "São Judas Tadeu, apóstolo glorioso e patrono dos casos desesperados: intercedei pelas minhas necessidades de trabalho e sustento. Abri as portas fechadas e trazei providência divina com prontidão. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "novena_9",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_528"
    }
  },
  {
    "id": "SAN_ONOFRE_TRABAJO_VIVIENDA",
    "tradicion": "catolicismo",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["necesidad_escasez", "soledad_vacio", "desesperacion"],
    "titulo": {
      "es": "San Onofre · Provisión de Trabajo Digno, Techo y Prosperidad",
      "en": "Saint Onuphrius · Blessing for Employment, Shelter & Sustenance",
      "fr": "Saint Onuphre · Prière pour le Travail, le Logement et le Pain",
      "pt": "São Onofre · Oração para Conseguir Trabalho, Casa e Sustento"
    },
    "idiomaLiturgicoOriginal": "Español Litúrgico Devocional",
    "textoOriginal": "Oh glorioso San Onofre, humilde anacoreta del desierto que fuiste sostenido por la bondad celestial: así como nunca te faltó el auxilio de Dios, asísteme en esta hora de necesidad para que obtenga un trabajo honrado, un techo seguro y los medios para vivir en paz y bienestar. Amén.",
    "guiaFonetica": "[O glo-rió-so San O-nó-fre, u-míl-de a-na-co-ré-ta del de-siér-to...]",
    "traducciones": {
      "es": "Oh glorioso San Onofre, humilde siervo de Dios sostenido por la Divina Providencia: concédeme auxilio en mis necesidades materiales, abre fuentes de trabajo y trae abundancia justa a mi vida. Amén.",
      "en": "O glorious Saint Onuphrius, humble servant sustained by Divine Providence: assist me in my material needs, open pathways to work, and bring righteous abundance into my life. Amen.",
      "fr": "Ô glorieux Saint Onuphre, serviteur soutenu par la Divine Providence: viens à mon aide, ouvre-moi les portes du travail et apporte la juste prospérité. Amen.",
      "pt": "Ó glorioso São Onofre, amparado pela Providência Divina: ajudai-me a conquistar emprego, moradia e sustento com fartura e bênçãos. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },
  {
    "id": "SAN_PANCRACIO_TRABAJO_SALUD",
    "tradicion": "catolicismo",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["necesidad_escasez", "enfermedad_dolor", "confusion_duda"],
    "titulo": {
      "es": "San Pancracio · Salud y Trabajo para el Emprendedor y la Familia",
      "en": "Saint Pancras · Health, Work & Prosperity for Businesses",
      "fr": "Saint Pancrace · Santé et Prospérité dans le Travail",
      "pt": "São Pancrácio · Saúde e Trabalho nos Negócios e no Lar"
    },
    "idiomaLiturgicoOriginal": "Español Tradicional",
    "textoOriginal": "Glorioso San Pancracio, joven mártir que fuiste fiel al Señor: te pido humildemente salud del cuerpo y prosperidad en mis labores y negocios. Que con tu intercesión prospere lo que emprendo, rinda el fruto de mi esfuerzo y nunca falte el bienestar en mi hogar. Amén.",
    "guiaFonetica": "[Glo-rió-so San Pan-crá-cio, jó-ven már-tir...]",
    "traducciones": {
      "es": "Glorioso San Pancracio: concédeme salud para trabajar y éxito honrado en mis ocupaciones y negocios. Que cada paso que dé sea bendecido y mi esfuerzo dé frutos de prosperidad. Amén.",
      "en": "Glorious Saint Pancras: grant me good health to labor and honest prosperity in my occupations and ventures. Bless every endeavor with fruitfulness and peace. Amen.",
      "fr": "Glorieux Saint Pancrace: accorde-moi la santé pour œuvrer et la prospérité honnête dans mes entreprises. Amen.",
      "pt": "Glorioso São Pancrácio: concedei-me saúde para trabalhar e prosperidade justa em meus negócios e ofícios. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_528"
    }
  },
  {
    "id": "GANESHA_MAHA_MANTRA_PROSPERIDAD",
    "tradicion": "vedica",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["confusion_duda", "necesidad_escasez", "miedo_angustia"],
    "titulo": {
      "es": "Ganesha Maha Mantra · Om Gam Ganapataye Namaha · Apertura y Éxito",
      "en": "Ganesha Maha Mantra · Obstacle Removal & Auspicious Beginnings",
      "fr": "Mantra de Ganesh · Dissolution des Obstacles et Succès",
      "pt": "Ganesha Maha Mantra · Remoção de Obstáculos e Prosperidade",
      "san": "गणेश महा मन्त्र"
    },
    "idiomaLiturgicoOriginal": "Sánscrito Sagrado (संस्कृतम्)",
    "textoOriginal": "ॐ गं गणपतये नमः ॥\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    "guiaFonetica": "[Om Gam Ga-na-pa-ta-ye Na-ma-ha; Va-kra-tún-da Ma-ha-ká-ya Súr-ya-ko-ti Sa-ma-pra-bha; Nir-vig-nam Ku-ru Me De-va Sár-va-kar-yé-shu Sár-va-da]",
    "traducciones": {
      "es": "Om. Me postro ante Ganesha, el Señor de la sabiduría y de todos los comienzos, cuyo resplandor iguala a diez millones de soles. Elimina todos los obstáculos en mis caminos, mis proyectos y bendice mis labores en todo momento.",
      "en": "Om. I bow to Lord Ganesha, lord of wisdom and auspicious beginnings, whose radiance equals ten million suns. Remove all obstacles from my path and bless my endeavors forever.",
      "fr": "Om. Salutations au Seigneur Ganesh, dispensateur de sagesse et dissipateur d'obstacles. Puisse chaque entreprise être couronnée de succès et de clarté.",
      "pt": "Om. Saudações a Ganesha, o senhor que remove todos os obstáculos e abençoa os novos começos com prosperidade e sabedoria."
    },
    "ritualesAsociados": {
      "tipoContador": "japa_mala_108",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "cuencos_tibetanos"
    }
  },
  {
    "id": "LAKSHMI_GAYATRI_ABUNDANCIA",
    "tradicion": "vedica",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["necesidad_escasez", "gratitud_gozo"],
    "titulo": {
      "es": "Maha Lakshmi Gayatri · Bendición de Abundancia y Provisión Divina",
      "en": "Lakshmi Gayatri Mantra · Divine Wealth, Grace & Abundance",
      "fr": "Gayatri de Lakshmi · Bénédiction d'Abondance et de Grâce",
      "pt": "Lakshmi Gayatri Mantra · Abundância Espiritual e Material",
      "san": "महालक्ष्मी गायत्री"
    },
    "idiomaLiturgicoOriginal": "Sánscrito Sagrado (संस्कृतम्)",
    "textoOriginal": "ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि ।\nतन्नो लक्ष्मीः प्रचोदयात् ॥",
    "guiaFonetica": "[Om Ma-ha-laksh-myai Cha Vid-ma-he Vish-nu-pat-nyai Cha Dhi-ma-hi; Tan-no Laksh-mih Pra-cho-da-yát]",
    "traducciones": {
      "es": "Om. Meditemos en la Gran Deidad Lakshmi, consorte de Vishnu. Que Ella derrame su gracia suprema, inspirando nuestra mente y colmando nuestra vida de abundancia, virtud y bienestar integral.",
      "en": "Om. Let us meditate on the Great Goddess Lakshmi, the eternal consort of Vishnu. May She enlighten our intellect and shower us with spiritual and material abundance.",
      "fr": "Om. Méditons sur la Grande Déesse Lakshmi. Qu'Elle éclaire notre conscience et répande sur nous la grâce de la prospérité bienfaisante.",
      "pt": "Om. Meditamos na Suprema Deusa Lakshmi. Que Ela ilumine nossos caminhos e nos conceda plenitude, pureza e abundância."
    },
    "ritualesAsociados": {
      "tipoContador": "japa_mala_108",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_528"
    }
  },
  {
    "id": "PLEGARIA_SAN_JUAN_BOSCO_SUSTENTO",
    "tradicion": "catolicismo",
    "categoriaIntencion": "prosperidad_trabajo",
    "estadosEmocionales": ["confusion_duda", "cansancio_agotamiento", "necesidad_escasez"],
    "titulo": {
      "es": "San Juan Bosco · Bendición de Emprendimientos, Estudio y Provisión",
      "en": "Saint John Bosco · Blessing for Enterprises, Studies & Provision",
      "fr": "Saint Jean Bosco · Prière pour les Projets, Études et le Pain",
      "pt": "São João Bosco · Bênção dos Projetos, Estudos e Prosperidade"
    },
    "idiomaLiturgicoOriginal": "Español e Italiano Litúrgico",
    "textoOriginal": "Oh San Juan Bosco, padre y maestro de la juventud, ejemplo de confianza infinita en la Divina Providencia: tú que viste cómo Dios provee para cada obra justa, bendice mis proyectos, estudios y emprendimientos. Que el fruto de mi trabajo sirva para el bien de mi prójimo y la estabilidad de mi hogar. Amén.",
    "guiaFonetica": "[O San Juan Bós-co, pá-dre y ma-és-tro de la ju-ven-túd...]",
    "traducciones": {
      "es": "Oh San Juan Bosco, ejemplo de confianza viva en la Divina Providencia: bendice mis esfuerzos, guía mis proyectos y provee el sustento digno para mi hogar, recordando que quien confía en el Señor nunca queda defraudado. Amén.",
      "en": "O Saint John Bosco, beacon of trust in Divine Providence: bless my endeavors, guide my studies and work, and provide abundant sustenance for my household. Amen.",
      "fr": "Ô Saint Jean Bosco, modèle de confiance en la Providence: bénis mes projets et assure le pain de notre maison dans la droiture. Amen.",
      "pt": "Ó São João Bosco, testemunha da Providência Divina: abençoai meus projetos e estudos, trazendo prosperidade honrada e paz. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },

  // =========================================================================
  // --- PERDÓN, RECONCILIACIÓN Y PURIFICACIÓN (perdon_reconciliacion) ---
  // =========================================================================
  {
    "id": "ACTO_CONTRICION_TRADICIONAL",
    "tradicion": "catolicismo",
    "categoriaIntencion": "perdon_reconciliacion",
    "estadosEmocionales": ["culpa_arrepentimiento", "tristeza_duelo", "miedo_angustia"],
    "titulo": {
      "es": "Acto de Contrición Tradicional · Señor Mío Jesucristo",
      "en": "Act of Contrition · Traditional Prayer of Repentance & Grace",
      "fr": "Acte de Contrition · Prière de Repentir et de Grâce",
      "pt": "Ato de Contrição Tradicional · Senhor Meu Jesus Cristo",
      "lat": "Actus Contritionis"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico y Español Clásico",
    "textoOriginal": "Deus meus, ex toto corde me paenitet de omnibus quae commisi, quia peccando Te offendi, summum et infinitum Bonum. Propone firmiter, adiuvante gratia tua, de cetero non peccare, atque occasiones proximas peccati fugere. Amen.",
    "guiaFonetica": "[Dé-us mé-us, eks tó-to cór-de me pe-ní-tet de om-ní-bus que com-mí-si...]",
    "traducciones": {
      "es": "Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío: por ser Tú quien eres, Bondad infinita, me pesa de todo corazón haberte ofendido. Propongo firmemente nunca más pecar, apartarme de todas las ocasiones de ofensa y confiar en tu infinita misericordia. Amén.",
      "en": "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more. Amen.",
      "fr": "Mon Dieu, j'ai un très grand regret de vous avoir offensé, parce que vous êtes infiniment bon, infiniment aimable, et que le péché vous déplaît. Je prends la ferme résolution, avec le secours de votre sainte grâce, de ne plus vous offenser. Amen.",
      "pt": "Senhor meu Jesus Cristo, Deus e Homem verdadeiro, pesa-me de todo o coração de Vos ter ofendido, por serdes Vós quem sois, sumamente bom e digno de ser amado sobre todas as coisas. Proponho firmemente nunca mais pecar. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "treinta_y_tres",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_396"
    }
  },
  {
    "id": "SAN_FRANCISCO_ORACION_PAZ_PERDON",
    "tradicion": "catolicismo",
    "categoriaIntencion": "perdon_reconciliacion",
    "estadosEmocionales": ["rabia_resentimiento", "conflicto_familiar", "soledad_vacio"],
    "titulo": {
      "es": "San Francisco de Asís · Instrumento de Paz, Perdón y Reconciliación",
      "en": "Prayer of Saint Francis · Instrument of Peace & Forgiveness",
      "fr": "Prière de Saint François d'Assise · Instrument de Paix et Pardon",
      "pt": "Oração de São Francisco de Assis · Instrumento de Paz e Perdão",
      "lat": "Oratio Sancti Francisci Assisiensis"
    },
    "idiomaLiturgicoOriginal": "Italiano Clásico y Latín",
    "textoOriginal": "Domine, fac me instrumentum pacis tuae:\nUbi odium, ibi amorem seram;\nUbi iniuria, ibi veniam;\nUbi discordia, ibi concordiam;\nUbi dubium, ibi fidem;\nUbi desperatio, ibi spem;\nUbi tenebrae, ibi lucem;\nUbi maestitia, ibi laetitiam. Amen.",
    "guiaFonetica": "[Dó-mi-ne, fak me in-stru-mén-tum pá-chis tú-e: U-bi ó-di-um, í-bi a-mó-rem sé-ram...]",
    "traducciones": {
      "es": "Señor, hazme un instrumento de tu paz: donde haya odio, siembre yo amor; donde haya ofensa, perdón; donde haya discordia, unión; donde haya duda, fe; donde haya desesperación, esperanza; donde haya tinieblas, luz; donde haya tristeza, alegría. Amén.",
      "en": "Lord, make me an instrument of Thy peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; where there is sadness, joy. Amen.",
      "fr": "Seigneur, fais de moi un instrument de ta paix: là où est la haine, que je mette l'amour; là où est l'offense, que je mette le pardon; là où est la discorde, que je mette l'union; là où est l'erreur, que je mette la vérité. Amen.",
      "pt": "Senhor, fazei-me instrumento de vossa paz: onde houver ódio, que eu leve o amor; onde houver ofensa, que eu leve o perdão; onde houver discórdia, que eu leve a união; onde houver dúvida, que eu leve a fé. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },
  {
    "id": "HOOPONOPONO_ORACION_PURIFICACION",
    "tradicion": "espiritismo",
    "categoriaIntencion": "perdon_reconciliacion",
    "estadosEmocionales": ["culpa_arrepentimiento", "rabia_resentimiento", "conflicto_familiar"],
    "titulo": {
      "es": "Ho'oponopono Sagrado · Lo Siento, Perdóname, Te Amo, Gracias",
      "en": "Sacred Ho'oponopono · I'm Sorry, Please Forgive Me, I Love You, Thank You",
      "fr": "Ho'oponopono Sacré · Pardon, Réconciliation et Guérison",
      "pt": "Ho'oponopono Sagrado · Sinto Muito, Me Perdoe, Eu Te Amo, Sou Grato"
    },
    "idiomaLiturgicoOriginal": "Hawaiano Tradicional",
    "textoOriginal": "E Kala Mai Ia'u, E Aloha Au Ia 'Oe, Mahalo, Aloha.\nDivina Presencia, Creador Universal:\nLimpia, borra y transmuta en pura luz cualquier memoria, patrón de dolor o discordia que exista en mí o en mis ancestros. Lo siento, Perdóname, Te amo, Gracias.",
    "guiaFonetica": "[E Ka-la Mai Ia-u, E A-lo-ha Au Ia O-e, Ma-ha-lo, A-lo-ha...]",
    "traducciones": {
      "es": "Divina Fuente de Amor: Si he causado dolor consciente o inconscientemente, o si cargo memorias de aflicción con mis semejantes, pido reconciliación y limpieza espiritual. Lo siento, por lo que hay en mí que creó esta situación. Perdóname. Te amo. Gracias por la sanación de nuestros vínculos. Amén.",
      "en": "Divine Source of Love: Cleanse, release, and transmute into light all painful memories and conflicts. I am sorry. Please forgive me. I love you. Thank you for the restoration of harmony and peace.",
      "fr": "Source Divine: Purifie et transforme en pure lumière toute mémoire de souffrance et de discorde. Je suis désolé. Pardonne-moi. Je t'aime. Merci.",
      "pt": "Divino Criador: Limpa, purifica e liberta todas as memórias de mágoa e conflito. Sinto muito. Me perdoe. Eu te amo. Sou grato pela cura e reconciliação."
    },
    "ritualesAsociados": {
      "tipoContador": "japa_mala_108",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_396"
    }
  },
  {
    "id": "ALMA_DE_CRISTO_PURIFICACION",
    "tradicion": "catolicismo",
    "categoriaIntencion": "perdon_reconciliacion",
    "estadosEmocionales": ["culpa_arrepentimiento", "miedo_angustia", "desesperacion"],
    "titulo": {
      "es": "Alma de Cristo (Anima Christi) · Santificación, Lavatorio y Amparo",
      "en": "Anima Christi · Soul of Christ, Sanctify & Purify Me",
      "fr": "Âme du Christ (Anima Christi) · Sanctification et Purification",
      "pt": "Alma de Cristo (Anima Christi) · Santificação e Proteção",
      "lat": "Anima Christi"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Anima Christi, sanctifica me.\nCorpus Christi, salva me.\nSanguis Christi, inebria me.\nAqua lateris Christi, lava me.\nPassio Christi, conforta me.\nO bone Iesu, exaudi me.\nIntra tua vulnera absconde me.\nNe permittas me separari a te.\nAb hoste maligno defende me.\nIn hora mortis meae voca me.\nEt iube me venire ad te,\nut cum Sanctis tuis laudem te\nin saecula saeculorum. Amen.",
    "guiaFonetica": "[Á-ni-ma Krís-ti, sank-tí-fi-ka me; Cór-pus Krís-ti, sál-va me; Sán-guis Krís-ti, in-é-bri-a me...]",
    "traducciones": {
      "es": "Alma de Cristo, santifícame. Cuerpo de Cristo, sálvame. Sangre de Cristo, embriágame. Agua del costado de Cristo, lávame. Pasión de Cristo, confórtame. ¡Oh, buen Jesús!, óyeme. Dentro de tus llagas, escóndeme. No permitas que me aparte de Ti. Del enemigo maligno, defiéndeme. En la hora de mi muerte, llámame y mándame ir a Ti, para que con tus santos te alabe por los siglos de los siglos. Amén.",
      "en": "Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me. O good Jesus, hear me. Within Thy wounds hide me. Suffer me not to be separated from Thee. From the malicious enemy defend me. In the hour of my death call me, and bid me come unto Thee, that with Thy saints I may praise Thee forever and ever. Amen.",
      "fr": "Âme du Christ, sanctifie-moi. Corps du Christ, sauve-moi. Sang du Christ, enivre-moi. Eau du côté du Christ, lave-moi. Passion du Christ, fortifie-moi. Ô bon Jésus, exauce-moi. Dans tes blessures, cache-moi. Ne permets pas que je sois séparé de toi. Du mauvais ennemi, défends-moi. À l'heure de ma mort, appelle-moi, et ordonne-moi de venir à toi, pour qu'avec tes saints je te loue dans les siècles des siècles. Amen.",
      "pt": "Alma de Cristo, santificai-me. Corpo de Cristo, salvai-me. Sangue de Cristo, inebriai-me. Água do lado de Cristo, lavai-me. Paixão de Cristo, confortai-me. Ó bom Jesus, ouvi-me. Dentro de vossas chagas, escondei-me. Não permitais que me separe de Vós. Do inimigo maligno, defendei-me. Na hora da minha morte, chamai-me e mandai-me ir para Vós, para que com os vossos Santos Vos louve por todos os séculos dos séculos. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "treinta_y_tres",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_396"
    }
  },
  {
    "id": "PADRE_PIO_PERDON_RENOVACION",
    "tradicion": "catolicismo",
    "categoriaIntencion": "perdon_reconciliacion",
    "estadosEmocionales": ["culpa_arrepentimiento", "miedo_angustia", "cansancio_agotamiento"],
    "titulo": {
      "es": "Padre Pío de Pietrelcina · Plegaria de Humildad, Confianza y Perdón",
      "en": "Padre Pio · Prayer of Surrender, Forgiveness & Trust",
      "fr": "Padre Pio · Prière d'Humilité, de Confiance et de Pardon",
      "pt": "Padre Pio de Pietrelcina · Oração de Humildade e Perdão"
    },
    "idiomaLiturgicoOriginal": "Italiano y Español Clásico",
    "textoOriginal": "Quédate conmigo, Señor, porque es necesario tenerte presente para no olvidarte. Tú sabes con qué facilidad te abandono. Quédate conmigo, Señor, porque soy débil y necesito de tu fuerza para no caer tantas veces. Quédate conmigo, Señor, porque Tú eres mi vida y sin Ti me falta el fervor. Amén.",
    "guiaFonetica": "[Ké-da-te con-mí-go, Se-ñór, por-ke es ne-ce-sá-rio te-nér-te pre-sén-te...]",
    "traducciones": {
      "es": "Señor Jesús, por intercesión de San Pío de Pietrelcina, limpia mi corazón de todo rencor, borra mis faltas pasadas y renueva en mí la paz interior. Haz que viva con la certeza de que tu misericordia es infinitamente más grande que mis errores. Amén.",
      "en": "Stay with me, Lord, through the intercession of Saint Padre Pio. Cleanse my soul, heal my past mistakes, and renew my heart in total trust and peace. Amen.",
      "fr": "Reste avec moi, Seigneur, par l'intercession de Saint Padre Pio. Purifie mon cœur et accorde-moi la grâce du pardon et de la confiance sereine. Amen.",
      "pt": "Ficai comigo, Senhor, pela intercessão de São Padre Pio. Limpai meu coração, perdoai minhas faltas e renovai a minha esperança. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },

  // =========================================================================
  // --- SALUD, SANACIÓN Y FORTALEZA FÍSICA (salud_sanacion) ---
  // =========================================================================
  {
    "id": "SAN_PEREGRINO_SANACION_ENFERMOS",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "desesperacion", "tristeza_duelo"],
    "titulo": {
      "es": "San Peregrino Laziosi · Patrono de los Enfermos y Sanación del Cuerpo",
      "en": "Saint Peregrine Laziosi · Patron Saint of the Sick & Healing",
      "fr": "Saint Pérégrin Laziosi · Patron des Malades et Guérison",
      "pt": "São Peregrino Laziosi · Padroeiro dos Enfermos e Cura Física",
      "lat": "Oratio ad Sanctum Peregrinum"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico y Español",
    "textoOriginal": "Sancte Peregrine, quem Christus ipse a gravi morbo mirabiliter sanavit: impetra aegrotantibus salutem corporis et robur animae, ut divino adiutorio confortati, laeti Deum glorificent. Amen.",
    "guiaFonetica": "[Sánc-te Pe-re-grí-ne, kuem Krís-tus íp-se a grá-vi mór-bo mi-ra-bí-li-ter sa-ná-vit...]",
    "traducciones": {
      "es": "Glorioso San Peregrino, tú que fuiste sanado milagrosamente por Cristo en la cruz: extiende tu mano compasiva sobre todos los que sufren enfermedades graves, cáncer y dolores corporales. Pide para nosotros la sanación del cuerpo, la fortaleza de ánimo y la gracia de una pronta recuperación. Amén.",
      "en": "Glorious Saint Peregrine, who was miraculously cured by the touch of Christ on the cross: reach out to all who suffer serious illness, cancer, and physical affliction. Obtain for us bodily healing, strength of soul, and renewed health. Amen.",
      "fr": "Glorieux Saint Pérégrin, guéri miraculeusement par le Christ: intercède pour tous les malades qui souffrent d'affections graves. Obtiens-nous la guérison du corps et la paix du cœur. Amen.",
      "pt": "Glorioso São Peregrino, curado milagrosamente por Cristo: olhai por todos os que enfrentam doenças graves e dores físicas. Alcançai-nos a graça da cura e a renovação das forças. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "novena_9",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_528"
    }
  },
  {
    "id": "SAN_PANTALEON_MEDICO_SANACION",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "cansancio_agotamiento", "desesperacion"],
    "titulo": {
      "es": "San Pantaleón · Médico y Mártir · Alivio del Sufrimiento y Salud",
      "en": "Saint Pantaleon · Physician & Martyr · Relief of Suffering & Health",
      "fr": "Saint Pantaléon · Médecin et Martyr · Soulagement et Santé",
      "pt": "São Pantaleão · Médico e Mártir · Alívio das Dores e Cura"
    },
    "idiomaLiturgicoOriginal": "Griego y Latín Clásico",
    "textoOriginal": "Sancte Pantaleon, medicus misericors et athleta Christi: infunde medicinam caelestem super languentes, dolores mitiga, et plenam sanitatem impetra. Amen.",
    "guiaFonetica": "[Sánc-te Pan-ta-lé-on, mé-di-kus mi-se-rí-kors et at-lé-ta Krís-ti...]",
    "traducciones": {
      "es": "San Pantaleón, médico compasivo que curaste con la ciencia y la fe: mira nuestras dolencias y sufrimientos. Derrama el bálsamo de la medicina divina sobre nuestro cuerpo, alivia el dolor de los enfermos y guía la mano de los médicos que nos asisten. Amén.",
      "en": "Saint Pantaleon, compassionate physician who healed through knowledge and faith: look upon our infirmities. Pour divine healing upon our bodies, soothe pain, and guide the healthcare professionals caring for us. Amen.",
      "fr": "Saint Pantaléon, médecin bienveillant: apporte ton secours aux malades, soulage leurs douleurs et bénis le travail des soignants. Amen.",
      "pt": "São Pantaleão, médico bondoso e mártir: derramai o bálsamo da saúde sobre os enfermos, confortai os aflitos e guiai os médicos. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "rosario_10",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_528"
    }
  },
  {
    "id": "SAN_BLAS_BENDICION_SALUD",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "miedo_angustia"],
    "titulo": {
      "es": "San Blas · Auxilio en Afecciones de Garganta, Respiración y Salud",
      "en": "Saint Blaise · Protection from Throat Illness & Bodily Healing",
      "fr": "Saint Blaise · Protection de la Gorge et Guérison Physique",
      "pt": "São Brás · Proteção da Garganta e Saúde do Corpo"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Per intercessionem Sancti Blasii Episcopi et Martyris, liberet te Deus a malo gulae et a quolibet alio malo. In nomine Patris, et Filii, et Spiritus Sancti. Amen.",
    "guiaFonetica": "[Per in-ter-ces-si-ó-nem Sánc-ti Blá-si-i E-pís-co-pi et Már-ti-ris...]",
    "traducciones": {
      "es": "Por la intercesión de San Blas, obispo y mártir, líbrenos el Señor de los males de garganta, de las afecciones respiratorias y de toda enfermedad del cuerpo y del espíritu. Amén.",
      "en": "Through the intercession of Saint Blaise, Bishop and Martyr, may God deliver you from every ailment of the throat and from every other evil. Amen.",
      "fr": "Par l'intercession de Saint Blaise, évêque et martyr, que le Seigneur nous préserve de tout mal de gorge et de toute autre maladie. Amen.",
      "pt": "Pela intercessão de São Brás, bispo e mártir, livre-nos Deus de todos os males da garganta e de qualquer enfermidade corporal. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },
  {
    "id": "SANTA_LUCIA_SALUD_VISTA",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "confusion_duda", "miedo_angustia"],
    "titulo": {
      "es": "Santa Lucía · Salud de la Vista, Claridad de Ojos y Luz Espiritual",
      "en": "Saint Lucy · Health of Eyesight, Clarity of Vision & Inner Light",
      "fr": "Sainte Lucie · Santé des Yeux et Clarté Spirituelle",
      "pt": "Santa Luzia · Saúde dos Olhos, Clareza da Visão e Luz da Alma"
    },
    "idiomaLiturgicoOriginal": "Italiano y Latín Clásico",
    "textoOriginal": "Sancta Lucia, virgo et martyr, oculos nostros a morbis et caecitate custodi, ac lucem gratiae in mentibus nostris accende. Amen.",
    "guiaFonetica": "[Sánc-ta Lu-chí-a, vír-go et már-tir, ó-cu-los nós-tros a mór-bis et che-chi-tá-te cus-tó-di...]",
    "traducciones": {
      "es": "Santa Lucía, protectora de la vista: conserva la salud y claridad de mis ojos físicos y alumbra los ojos de mi alma para caminar siempre en la luz de la verdad y la paz. Amén.",
      "en": "Saint Lucy, guardian of eyesight: preserve the health and sharpness of my eyes and enlighten the eyes of my heart with divine clarity and peace. Amen.",
      "fr": "Sainte Lucie, protectrice de la vue: préserve la santé de nos yeux et éclaire notre âme de ta sainte lumière. Amen.",
      "pt": "Santa Luzia, guardiã da visão: protegei a saúde dos meus olhos e iluminai minha alma com a luz da fé e da paz. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_528"
    }
  },
  {
    "id": "SAN_CAMILO_LELIS_ENFERMOS",
    "tradicion": "catolicismo",
    "categoriaIntencion": "salud_sanacion",
    "estadosEmocionales": ["enfermedad_dolor", "cansancio_agotamiento", "soledad_vacio"],
    "titulo": {
      "es": "San Camilo de Lelis · Amparo a Convalecientes y Cuidadores de la Salud",
      "en": "Saint Camillus de Lellis · Protection for the Sick & Healthcare Workers",
      "fr": "Saint Camille de Lellis · Prière pour les Malades et les Soignants",
      "pt": "São Camilo de Léllis · Amparo aos Doentes e Cuidadores da Saúde"
    },
    "idiomaLiturgicoOriginal": "Español e Italiano Tradicional",
    "textoOriginal": "Señor Jesús, que infundiste en el corazón de San Camilo un amor inmenso hacia los enfermos: mira con misericordia a quienes hoy padecen en camas de hospital y en sus hogares. Da paciencia al convaleciente, fortaleza al cuidador y restaura la plenitud de la vida. Amén.",
    "guiaFonetica": "[Se-ñór Je-sús, ke in-fun-dís-te en el co-ra-zón de San Ca-mí-lo...]",
    "traducciones": {
      "es": "San Camilo de Lelis, patrono universal de los enfermos y hospitales: asiste a quienes están postrados por el dolor, devuelve la vitalidad a sus cuerpos y colma de bendición a los médicos y enfermeros que entregan su vida por el prójimo. Amén.",
      "en": "Saint Camillus de Lellis, patron of hospitals and the sick: comfort those confined to illness, restore their vitality, and bless all caregivers who tend to them with devotion. Amen.",
      "fr": "Saint Camille de Lellis, protecteur des malades: apporte soulagement et force aux convalescents et bénis les mains qui les soignent. Amen.",
      "pt": "São Camilo de Léllis, padroeiro dos enfermos e hospitais: confortai os que sofrem, restaurai a saúde e abençoai todos os cuidadores. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },

  // =========================================================================
  // --- GRATITUD, ALABANZA Y ADORACIÓN (gratitud_alabanza) ---
  // =========================================================================
  {
    "id": "CANTICO_MAGNIFICAT_MARIA",
    "tradicion": "catolicismo",
    "categoriaIntencion": "gratitud_alabanza",
    "estadosEmocionales": ["gratitud_gozo", "fortaleza_fe", "paz_interior"],
    "titulo": {
      "es": "El Magníficat · Cántico de la Virgen María · Proclama mi Alma la Grandeza del Señor",
      "en": "The Magnificat · Canticle of Mary · My Soul Doth Magnify the Lord",
      "fr": "Le Magnificat · Cantique de Marie · Mon Âme Exalte le Seigneur",
      "pt": "O Magnificat · Cântico de Maria · A Minha Alma Engrandece o Senhor",
      "lat": "Canticum B. Mariae Virginis (Magnificat)"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Magnificat anima mea Dominum,\net exsultavit spiritus meus in Deo salvatore meo,\nquia respexit humilitatem ancillae suae.\nEcce enim ex hoc beatam me dicent omnes generationes,\nquia fecit mihi magna, qui potens est,\net sanctum nomen eius.\nEt misericordia eius in progenies et progenies\ntimentibus eum. Amen.",
    "guiaFonetica": "[Mag-ní-fi-kat á-ni-ma mé-a Dó-mi-num, et ek-sul-tá-vit spí-ri-tus mé-us in Dé-o sal-va-tó-re mé-o...]",
    "traducciones": {
      "es": "Proclama mi alma la grandeza del Señor, se alegra mi espíritu en Dios mi Salvador, porque ha mirado la humildad de su sierva. Desde ahora me felicitarán todas las generaciones, porque el Poderoso ha hecho obras grandes por mí: su nombre es santo, y su misericordia llega a sus fieles de generación en generación. Amén.",
      "en": "My soul doth magnify the Lord, and my spirit hath rejoiced in God my Savior. For He hath regarded the lowliness of His handmaiden: for behold from henceforth all generations shall call me blessed. For He that is mighty hath magnified me: and holy is His Name. Amen.",
      "fr": "Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur! Il s'est penché sur son humble servante; désormais tous les âges me diront bienheureuse. Le Puissant fit pour moi des merveilles; saint est son nom! Amen.",
      "pt": "A minha alma engrandece o Senhor, e o meu espírito se alegra em Deus meu Salvador, porque olhou para a humildade de sua serva. Doravante todas as gerações me chamarão bem-aventurada, porque o Todo-Poderoso fez em mim grandes coisas. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_963"
    }
  },
  {
    "id": "TE_DEUM_HIMNO_SOLEMNE",
    "tradicion": "catolicismo",
    "categoriaIntencion": "gratitud_alabanza",
    "estadosEmocionales": ["gratitud_gozo", "fortaleza_fe"],
    "titulo": {
      "es": "Te Deum Laudamus · Himno Solemne Universal de Acción de Gracias",
      "en": "Te Deum Laudamus · Solemn Hymn of Thanksgiving & Praise",
      "fr": "Te Deum Laudamus · Grand Hymne Solennel d'Action de Grâce",
      "pt": "Te Deum Laudamus · Hino Solene de Louvor e Ação de Graças",
      "lat": "Te Deum Laudamus"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Te Deum laudamus: te Dominum confitemur.\nTe aeternum Patrem omnis terra veneratur.\nTibi omnes Angeli, tibi Caeli et universae Potestates,\ntibi Cherubim et Seraphim incessabili voce proclamant:\nSanctus, Sanctus, Sanctus Dominus Deus Sabaoth.\nPleni sunt caeli et terra maiestatis gloriae tuae. Amen.",
    "guiaFonetica": "[Te Dé-um lau-dá-mus: te Dó-mi-num con-fi-té-mur. Te e-tér-num Pá-trem óm-nis tér-ra ve-ne-rá-tur...]",
    "traducciones": {
      "es": "A ti, oh Dios, te alabamos, a ti, Señor, te reconocemos. A ti, eterno Padre, te venera toda la creación. Los ángeles, los cielos y todas las potestades te cantan sin cesar: Santo, Santo, Santo es el Señor, Dios del universo. Llenos están el cielo y la tierra de la majestad de tu gloria. Amén.",
      "en": "We praise Thee, O God; we acknowledge Thee to be the Lord. All the earth doth worship Thee, the Father everlasting. To Thee all Angels cry aloud, the Heavens and all the Powers therein. Holy, Holy, Holy, Lord God of Sabaoth; Heaven and earth are full of the Majesty of Thy Glory. Amen.",
      "fr": "À toi, Dieu, notre louange! Nous te proclamons Seigneur. Ciel et terre sont remplis de ta gloire. Les anges et les puissances chantent sans fin: Saint, Saint, Saint le Seigneur, Dieu de l'univers! Amen.",
      "pt": "A Vós, ó Deus, louvamos, a Vós por Senhor confessamos. A Vós, Eterno Pai, venera toda a terra. Os anjos e os céus proclamam sem cessar: Santo, Santo, Santo é o Senhor Deus do universo. Céus e terra estão cheios da vossa glória. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "shofar_mistico"
    }
  },
  {
    "id": "CANTICO_DE_LAS_CRIATURAS_ASIS",
    "tradicion": "catolicismo",
    "categoriaIntencion": "gratitud_alabanza",
    "estadosEmocionales": ["gratitud_gozo", "paz_interior"],
    "titulo": {
      "es": "Cántico de las Criaturas de San Francisco · Alabanza Cósmica al Creador",
      "en": "Canticle of the Creatures by Saint Francis · Cosmic Praise",
      "fr": "Cantique des Créatures de Saint François · Louange Universelle",
      "pt": "Cântico das Criaturas de São Francisco · Louvor ao Criador",
      "lat": "Laudes Creaturarum"
    },
    "idiomaLiturgicoOriginal": "Italiano Umbro Antiguo",
    "textoOriginal": "Altissimu, onnipotente, bon Signore,\ntue so le laude, la gloria e l'honore et onne benedictione.\nLaudato sie, mi Signore, cum tucte le tue creature,\nspetialmente messor lo frate sole,\nlo qual è iorno, et allumini noi per lui.\nEt ellu è bellu e radiante cum grande splendore:\nde te, Altissimu, porta significatione. Amen.",
    "guiaFonetica": "[Al-tís-si-mu, on-ni-po-tén-te, bon Si-ñó-re, tú-e so le láu-de, la gló-ria e lo-nó-re...]",
    "traducciones": {
      "es": "Altísimo, omnipotente, buen Señor: tuyas son las alabanzas, la gloria y el honor. Alabado seas, mi Señor, en todas tus criaturas, especialmente en el hermano Sol, que alumbra el día y es bello y radiante, llevando tu significado. Alabado seas por la hermana Luna, el viento, el agua y la madre tierra. Amén.",
      "en": "Most High, all-powerful, all-good Lord: All praise is Yours, all glory, all honour and all blessings. Praised be You, my Lord, with all Your creatures, especially Brother Sun, who brings the day and light. He is fair and radiant with great splendour; of You, Most High, he bears the likeness. Amen.",
      "fr": "Très-Haut, tout-puissant, bon Seigneur: à toi appartiennent les louanges, la gloire et toute bénédiction. Loué sois-tu, mon Seigneur, avec toutes tes créatures, spécialement messire frère Soleil qui donne le jour et la lumière. Amen.",
      "pt": "Altíssimo, onipotente, bom Senhor: a Vós o louvor, a glória, a honra e toda a bênção. Louvado sejais, meu Senhor, com todas as vossas criaturas, especialmente o irmão Sol, que ilumina o dia com beleza e resplendor. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "frecuencia_432"
    }
  },
  {
    "id": "CANTICO_BENEDICTUS_ZACARIAS",
    "tradicion": "catolicismo",
    "categoriaIntencion": "gratitud_alabanza",
    "estadosEmocionales": ["gratitud_gozo", "fortaleza_fe", "sabiduria_guia"],
    "titulo": {
      "es": "El Benedictus · Cántico de Zacarías · Bendito sea el Señor Dios de Israel",
      "en": "The Benedictus · Canticle of Zechariah · Blessed be the Lord God of Israel",
      "fr": "Le Benedictus · Cantique de Zacharie · Béni soit le Seigneur",
      "pt": "O Benedictus · Cântico de Zacarias · Bendito seja o Senhor Deus de Israel",
      "lat": "Canticum Zachariae (Benedictus)"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Benedictus Dominus Deus Israel,\nquia visitavit et fecit redemptionem plebis suae,\net erexit cornu salutis nobis in domo David pueri sui,\nsicut locutus est per os sanctorum,\nqui a saeculo sunt, prophetarum eius. Amen.",
    "guiaFonetica": "[Be-ne-dík-tus Dó-mi-nus Dé-us Ís-ra-el, kuí-a vi-si-tá-vit et fé-chit re-demp-tsi-ó-nem plé-bis sú-e...]",
    "traducciones": {
      "es": "Bendito sea el Señor, Dios de Israel, porque ha visitado y redimido a su pueblo, suscitándonos una fuerza de salvación en la casa de David, su siervo, según lo había predicho desde antiguo por boca de sus santos profetas. Nos concederá servirle con santidad y justicia todos nuestros días. Amén.",
      "en": "Blessed be the Lord God of Israel; for He hath visited and redeemed His people, and hath raised up a mighty salvation for us in the house of His servant David, as He spake by the mouth of His holy prophets, which have been since the world began. Amen.",
      "fr": "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple. Il a fait surgir pour nous une force de salut dans la maison de David, son serviteur, comme il l'avait dit par la bouche des prophètes. Amen.",
      "pt": "Bendito seja o Senhor Deus de Israel, porque visitou e redimiu o seu povo, e nos suscitou um poderoso Salvador na casa de Davi seu servo, como havia anunciado pela boca dos seus santos profetas. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_963"
    }
  },
  {
    "id": "GLORIA_IN_EXCELSIS_DEO",
    "tradicion": "catolicismo",
    "categoriaIntencion": "gratitud_alabanza",
    "estadosEmocionales": ["gratitud_gozo", "paz_interior", "fortaleza_fe"],
    "titulo": {
      "es": "Gloria in Excelsis Deo · Doxología Mayor y Alabanza Celestial",
      "en": "Gloria in Excelsis Deo · Greater Doxology & Heavenly Praise",
      "fr": "Gloria in Excelsis Deo · Gloire à Dieu au Plus Haut des Cieux",
      "pt": "Glória a Deus nas Alturas · Doxologia Maior Litúrgica",
      "lat": "Gloria in Excelsis Deo"
    },
    "idiomaLiturgicoOriginal": "Latín Eclesiástico",
    "textoOriginal": "Gloria in excelsis Deo\net in terra pax hominibus bonae voluntatis.\nLaudamus te, benedicimus te, adoramus te, glorificamus te,\ngratias agimus tibi propter magnam gloriam tuam,\nDomine Deus, Rex caelestis, Deus Pater omnipotens. Amen.",
    "guiaFonetica": "[Gló-ri-a in ek-shél-sis Dé-o et in tér-ra paks ho-mí-ni-bus bó-ne vo-lun-tá-tis. Lau-dá-mus te, be-ne-dí-chi-mus te...]",
    "traducciones": {
      "es": "Gloria a Dios en el cielo, y en la tierra paz a los hombres que ama el Señor. Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias, Señor Dios, Rey celestial, Dios Padre todopoderoso. Amén.",
      "en": "Glory to God in the highest, and on earth peace to people of good will. We praise you, we bless you, we adore you, we glorify you, we give you thanks for your great glory, Lord God, heavenly King, O God, almighty Father. Amen.",
      "fr": "Gloire à Dieu, au plus haut des cieux, et paix sur la terre aux hommes qu'il aime. Nous te louons, nous te bénissons, nous t'adorons, nous te glorifions, nous te rendons grâce pour ton immense gloire, Seigneur Dieu, Roi du ciel, Dieu le Père tout-puissant. Amen.",
      "pt": "Glória a Deus nas alturas, e paz na terra aos homens por Ele amados. Senhor Deus, Rei dos céus, Deus Pai todo-poderoso: nós Vos louvamos, nós Vos bendizemos, nós Vos adoramos, nós Vos glorificamos, nós Vos damos graças por vossa imensa glória. Amém."
    },
    "ritualesAsociados": {
      "tipoContador": "libre",
      "duracionVeladoraSugeridaHoras": 24,
      "paisajeSonoroRecomendado": "solfeggio_963"
    }
  }
];

/**
 * Adaptar todas las Sagradas Escrituras al catálogo devocional universal
 */
const SCRIPTURES_AS_PRAYERS = SCRIPTURES_CATALOG.map(s => {
  const meta = mapScriptureToDevotionalMeta(s);
  const titleText = `${s.libro} · ${s.capitulo}`;
  const excerptText = (s.traducciones && (s.traducciones.es || s.traducciones.en || s.textoOriginal)) || s.textoOriginal || '';

  return {
    id: s.id,
    tradicion: s.tradicion,
    categoriaIntencion: meta.cat,
    estadosEmocionales: meta.emos,
    titulo: {
      es: titleText,
      en: titleText,
      pt: titleText,
      fr: titleText,
      ar: s.capitulo,
      he: s.capitulo,
      lat: s.capitulo
    },
    idiomaLiturgicoOriginal: s.idiomaLiturgicoOriginal || 'Sagrado',
    dir: s.dir || 'ltr',
    textoOriginal: s.textoOriginal,
    guiaFonetica: s.foneticaLiturgica || '',
    traducciones: s.traducciones || { es: excerptText, en: excerptText },
    ritualesAsociados: {
      tipoContador: s.tradicion === 'islam' ? 'tasbih_33' : ((s.tradicion === 'vedica' || s.tradicion === 'budismo') ? 'japa_mala_108' : (s.tradicion === 'catolicismo' ? 'rosario_10' : 'libre')),
      duracionVeladoraSugeridaHoras: 24,
      paisajeSonoroRecomendado: 'frecuencia_432'
    }
  };
});

export const PRAYERS_DB = [
  ...BASE_CANONICAL_PRAYERS,
  ...SCRIPTURES_AS_PRAYERS
];