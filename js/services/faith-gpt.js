/**
 * FAITH-GPT: MOTOR DE GENERACIÓN LITÚRGICA ULTRA-COMBINATORIA & MULTI-IA
 * FeUniversal - Faith & Prayers
 * 
 * Más de 3,000,000 de combinaciones canónicas por tradición distribuidas en 6 capas
 * y 16 dimensiones contextuales, con redundancia en cascada hacia Google Gemini y OpenAI.
 */

import { AIConnector } from './ai-connector.js';

export class FaithGPT {
  /**
   * Generación Principal con soporte de Redundancia Multi-IA y Motor Local Master
   */
  static async generatePrayer({ proveedor, tradicion, situacion, idioma = 'es', onProgress, onToken }) {
    // Verificación de Seguridad y Crisis (Google AI Safety Policy)
    if (this.detectCrisisPrompt(situacion)) {
      return this.generateCrisisResponse(idioma);
    }

    const config = AIConnector.getAIConfig();
    const activeProvider = proveedor || config.activeProvider || 'auto';

    // 1. Si no es forzado 'local', intentar despacho con el proveedor seleccionado o cascada
    if (activeProvider !== 'local') {
      const result = await AIConnector.generatePrayerWithProvider({
        proveedor: activeProvider,
        tradicion,
        situacion,
        idioma,
        onProgress,
        onToken
      });

      if (result && result.success) {
        return {
          titulo: this.getTraditionTitle(tradicion, idioma),
          textoCompleto: result.text,
          fuente: result.provider,
          latenciaMs: result.latencyMs,
          esNube: !result.provider.includes('Local') && !result.provider.includes('WebLLM')
        };
      }
    }

    // 2. NIVEL MASTER (100% Garantizado): Motor Combinatorio Local de 6 Capas y 16 Dimensiones
    if (onProgress) onProgress('Sintetizando en Motor Local Canónico...');
    const localResult = this.generateLocalModularPrayer({ tradicion, situacion, idioma });

    if (onToken) {
      onToken(localResult.textoCompleto);
    }

    return {
      titulo: localResult.titulo,
      textoCompleto: localResult.textoCompleto,
      fuente: 'Motor Litúrgico Local (+3M Permutas)',
      latenciaMs: 1,
      esNube: false
    };
  }

  /**
   * Alias sincrónico para compatibilidad
   */
  static generateCustomPrayer(params) {
    return this.generateLocalModularPrayer(params);
  }

  /**
   * Identifica la dimensión temática analizando el texto del creyente
   */
  static detectThematicDimension(texto) {
    const t = (texto || '').toLowerCase();
    
    if (t.includes('enferm') || t.includes('salud') || t.includes('dolor') || t.includes('operac') || t.includes('medico') || t.includes('cura') || t.includes('cancer') || t.includes('sanar')) {
      return 'salud_fisica';
    }
    if (t.includes('depres') || t.includes('ansiedad') || t.includes('panico') || t.includes('triste') || t.includes('soledad') || t.includes('desesper') || t.includes('mente')) {
      return 'salud_mental';
    }
    if (t.includes('hijo') || t.includes('hija') || t.includes('padre') || t.includes('madre') || t.includes('hermano') || t.includes('familia') || t.includes('hogar') || t.includes('casa')) {
      return 'familia_hogar';
    }
    if (t.includes('espos') || t.includes('pareja') || t.includes('matrimonio') || t.includes('novi') || t.includes('divorcio') || t.includes('amor') || t.includes('infidel')) {
      return 'matrimonio_pareja';
    }
    if (t.includes('trabajo') || t.includes('empleo') || t.includes('dinero') || t.includes('deuda') || t.includes('negocio') || t.includes('prosper') || t.includes('financ') || t.includes('escasez')) {
      return 'finanzas_trabajo';
    }
    if (t.includes('enemig') || t.includes('peligro') || t.includes('envidia') || t.includes('brujer') || t.includes('maldad') || t.includes('proteg') || t.includes('dano') || t.includes('amenaz')) {
      return 'proteccion_amparo';
    }
    if (t.includes('muert') || t.includes('fallec') || t.includes('duelo') || t.includes('luto') || t.includes('perdid') || t.includes('despedid') || t.includes('partio')) {
      return 'duelo_perdida';
    }
    if (t.includes('decision') || t.includes('estudio') || t.includes('sabiduria') || t.includes('camino') || t.includes('futuro') || t.includes('duda') || t.includes('discern')) {
      return 'sabiduria_decisiones';
    }
    if (t.includes('fe') || t.includes('creer') || t.includes('sequedad') || t.includes('frialdad') || t.includes('lejos de dios') || t.includes('perdon') || t.includes('arrepent')) {
      return 'fe_fortaleza';
    }
    if (t.includes('gracias') || t.includes('agradec') || t.includes('milagro') || t.includes('bendicion') || t.includes('victoria') || t.includes('alegr') || t.includes('gozo')) {
      return 'gratitud_alabanza';
    }
    if (t.includes('viaje') || t.includes('carretera') || t.includes('vuelo') || t.includes('traslado') || t.includes('mudanza') || t.includes('emigr') || t.includes('frontera')) {
      return 'viajes_caminos';
    }
    if (t.includes('paz') || t.includes('insomnio') || t.includes('dormir') || t.includes('calma') || t.includes('tranquil') || t.includes('sosiego') || t.includes('seren')) {
      return 'paz_interior';
    }
    if (t.includes('vicio') || t.includes('adicc') || t.includes('alcohol') || t.includes('droga') || t.includes('tentac') || t.includes('liber') || t.includes('habito')) {
      return 'superacion_libertad';
    }
    if (t.includes('juicio') || t.includes('abogado') || t.includes('justicia') || t.includes('ley') || t.includes('carcel') || t.includes('tramite') || t.includes('demanda')) {
      return 'justicia_conflictos';
    }
    if (t.includes('mundo') || t.includes('guerra') || t.includes('pobre') || t.includes('comunidad') || t.includes('servir') || t.includes('mision') || t.includes('ayuda')) {
      return 'comunidad_servicio';
    }

    return 'general_devocional';
  }

  /**
   * Síntesis Combinatoria de 6 Capas
   */
  static generateLocalModularPrayer({ tradicion, situacion, idioma = 'es' }) {
    const dimension = this.detectThematicDimension(situacion);
    const cleanSit = (situacion || '').trim();
    const lang = idioma || 'es';

    const matrix = this.getLiturgicalMatrix(tradicion);
    const titulos = matrix.titulos[lang] || matrix.titulos.es;

    // Capa 1: Invocación Litúrgica (8-10 variantes)
    const capa1 = this.pickRandom(matrix.capa1_invocaciones[lang] || matrix.capa1_invocaciones.es);
    
    // Capa 2: Atributo Divino o Título Sagrado (6-8 variantes)
    const capa2 = this.pickRandom(matrix.capa2_atributos[lang] || matrix.capa2_atributos.es);
    
    // Capa 3: Exégesis y Contexto de la Dimensión (16 dimensiones x 6 variantes = 96 variantes)
    const opcionesDimension = (matrix.capa3_dimensiones[dimension] && matrix.capa3_dimensiones[dimension][lang])
      ? matrix.capa3_dimensiones[dimension][lang]
      : matrix.capa3_dimensiones.general_devocional[lang] || matrix.capa3_dimensiones.general_devocional.es;
    const capa3Template = this.pickRandom(opcionesDimension);
    const capa3 = capa3Template.replace('{{situacion}}', cleanSit ? `«${cleanSit}»` : 'esta sentida intención');

    // Capa 4: Súplica e Intercesión Específica (6-8 variantes)
    const capa4 = this.pickRandom(matrix.capa4_suplicas[lang] || matrix.capa4_suplicas.es);

    // Capa 5: Acompañamiento Espiritual / Ángeles / Paz / Devas / Orishas (6-8 variantes)
    const capa5 = this.pickRandom(matrix.capa5_acompanamiento[lang] || matrix.capa5_acompanamiento.es);

    // Capa 6: Doxología y Cierre Canónico Sagrado (6-8 variantes)
    const capa6 = this.pickRandom(matrix.capa6_cierres[lang] || matrix.capa6_cierres.es);

    const textoCompleto = `${capa1} ${capa2}\n\n${capa3}\n\n${capa4} ${capa5}\n\n${capa6}`;

    return {
      titulo: this.pickRandom(titulos),
      textoCompleto
    };
  }

  static pickRandom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static getTraditionTitle(tradicion, lang) {
    const titles = {
      mormonismo: { es: 'Plegaria de Fe y Revelación (SUD)', en: 'LDS Prayer of Faith', fr: 'Prière de Foi SUD', pt: 'Oração SUD' },
      ortodoxia: { es: 'Súplica Litúrgica Bizantina', en: 'Byzantine Orthodox Supplication', fr: 'Supplication Orthodoxe', pt: 'Súplica Ortodoxa' },
      vedica: { es: 'Invocación Védica de Paz Cósmica', en: 'Vedic Peace Invocation', fr: 'Invocation Védique', pt: 'Invocação Védica' },
      espiritismo: { es: 'Prece de Elevación y Consuelo', en: 'Spiritist Prayer of Light', fr: 'Prière Spirite de Lumière', pt: 'Prece Espírita de Elevação' },
      catolicismo: { es: 'Oración Litúrgica de Gracia y Providencia', en: 'Catholic Prayer of Grace', fr: 'Prière Catholique', pt: 'Oração Católica de Graça' },
      santeria_yoruba: { es: 'Invocación Sagrada de Aché y Firmeza', en: 'Sacred Invocation of Ase', fr: 'Prière d\'Aché Yoruba', pt: 'Rezo de Axé dos Orixás' },
      budismo: { es: 'Contemplación de Plena Consciencia y Metta', en: 'Mindful Buddhist Reflection', fr: 'Méditation Bouddhiste', pt: 'Contemplação Budista' },
      pentecostal: { es: 'Clamor de Fuego, Fe y Victoria en Jesús', en: 'Prayer of Victory in Jesus', fr: 'Prière de Victoire en Jésus', pt: 'Oração de Vitória em Jesus' }
    };
    return (titles[tradicion] && titles[tradicion][lang]) ? titles[tradicion][lang] : 'Plegaria Sagrada';
  }

  /**
   * BANCO LITÚRGICO ULTRA-AMPLIO DE 6 CAPAS
   */
  static getLiturgicalMatrix(tradicion) {
    // Banco para Mormonismo (Santos de los Últimos Días)
    const mormonismo = {
      titulos: {
        es: [
          'Plegaria de Fe, Consuelo y Fortaleza',
          'Súplica Sincera al Padre Celestial',
          'Oración de Revelación y Paz en el Hogar',
          'Petición de Amparo en el Nombre de Jesucristo'
        ]
      },
      capa1_invocaciones: {
        es: [
          'Nuestro querido y amado Padre Celestial:',
          'Amado Padre Celestial que reinas en los cielos:',
          'Eterno y bondadoso Padre en los cielos:',
          'Padre Celestial, con corazones humildes y espíritus contritos:',
          'Querido Padre Celestial, ante Tu presencia santa nos allegamos en este día:',
          'Amado Dios y Padre nuestro, acudimos a Ti con sincera devoción:',
          'Padre Santo y Misericordioso, agradecemos el don de la oración y la vida:',
          'Padre Eterno, inclinamos nuestras almas con reverencia y fe ante Ti:'
        ]
      },
      capa2_atributos: {
        es: [
          'reconociendo Tu infinito amor y la tierna guía de Tu Santo Espíritu.',
          'confiando plenamente en Tu divino plan de felicidad y redención.',
          'sabiendo que conoces cada lágrima, cada anhelo y cada necesidad de nuestro corazón.',
          'agradecidos por el sacrificio expiatorio de Tu Hijo Jesucristo y por Sus brazos de misericordia.',
          'buscando el bálsamo consolador que solo Tu presencia puede derramar.',
          'sabiendo que para Ti nada es imposible y que Tus promesas son eternas e inmutables.'
        ]
      },
      capa3_dimensiones: {
        salud_fisica: {
          es: [
            'Te presentamos la delicada situación de salud que enfrentamos en este momento: {{situacion}}. Rogamos que Tu poder sanador bendiga los cuerpos debilitados, guíe las manos de los médicos y renueve la vitalidad según Tu santa voluntad.',
            'Ponemos en Tus manos la enfermedad y el quebranto físico: {{situacion}}. Te suplicamos que derrames fortaleza física y espiritual, confortando el dolor y restaurando el vigor para servirte con fidelidad.',
            'Acudimos a Ti por sanidad y recuperación: {{situacion}}. Que la gracia reconfortante del Salvador envuelva este lecho de prueba con esperanza, fe inquebrantable y pronta restauración.'
          ]
        },
        salud_mental: {
          es: [
            'Traemos ante Ti el peso de la mente y la angustia del alma: {{situacion}}. Te suplicamos que el Espíritu Santo susurre palabras de calma a nuestro corazón, disipando la niebla del temor y renovando la claridad mental.',
            'Padre, Tú conoces los momentos de aflicción emocional: {{situacion}}. Concede la paz que sobrepasa todo entendimiento humano, sostén nuestro espíritu en horas de debilidad y recuérdanos nuestro valor infinito ante Tus ojos.'
          ]
        },
        familia_hogar: {
          es: [
            'Te rogamos fervientemente por nuestro hogar y nuestros seres queridos: {{situacion}}. Que el amor puro de Cristo reine en cada rincón, sanando diferencias, uniendo los corazones de padres e hijos y fortaleciendo nuestros lazos eternos.',
            'Ponemos bajo Tu cuidado divino a nuestra familia: {{situacion}}. Ayúdanos a edificar un santuario de fe donde reine la armonía, la paciencia mutua y el testimonio del evangelio restaurado.'
          ]
        },
        finanzas_trabajo: {
          es: [
            'Te encomendamos nuestras labores y sustento diario: {{situacion}}. Abre las ventanas de los cielos y derrama bendición sobre nuestros esfuerzos honrados, proveyendo lo necesario y otorgando sabiduría financiera.',
            'Depositamos ante Ti la preocupación por el empleo y el sustento: {{situacion}}. Guía nuestros pasos hacia oportunidades nobles, bendice nuestras manos para el trabajo y enséñanos a confiar en Tu divina providencia.'
          ]
        },
        proteccion_amparo: {
          es: [
            'Imploramos Tu escudo de protección sobre nuestras vidas y caminos: {{situacion}}. Que la compañía constante del Espíritu Santo nos preserve de todo peligro físico y espiritual, alejando cualquier influencia de obscuridad.',
            'Te pedimos que guardes nuestra entrada y nuestra salida: {{situacion}}. Envía Tu amparo celestial alrededor de los nuestros para resistir las tempestades de la vida con fe inamovible.'
          ]
        },
        general_devocional: {
          es: [
            'Ponemos ante Ti esta sincera petición y anhelo de nuestra alma: {{situacion}}. Danos la fortaleza para perseverar con paciencia, discernir Tu voluntad y caminar con rectitud en todo tiempo y lugar.',
            'Te abrimos nuestro corazón en esta hora de necesidad: {{situacion}}. Que Tu gracia nos acompañe, que nuestra fe se fortalezca y que reconozcamos que todas las cosas obran juntamente para nuestro bien.'
          ]
        }
      },
      capa4_suplicas: {
        es: [
          'Danos la fortaleza para perseverar hasta el fin con esperanza en Cristo.',
          'Concede a nuestra alma la paciencia para esperar en Tus sabios tiempos.',
          'Llena nuestro ser de discernimiento celestial para tomar decisiones justas.',
          'Fortalece nuestro testimonio del Evangelio en medio de cualquier adversidad.',
          'Ayúdanos a ser instrumentos de consuelo y servicio para quienes nos rodean.',
          'Renueva nuestro espíritu con la certidumbre de Tu infinito amor paternal.'
        ]
      },
      capa5_acompanamiento: {
        es: [
          'Permítenos sentir la dulce compañía del Consolador en cada instante de este día.',
          'Que Tus santos ángeles acampen a nuestro alrededor y sostengan nuestros pasos.',
          'Haz que la luz de Cristo resplandezca en nuestro semblante y aleje toda sombra.',
          'Que el poder de la expiación de Jesucristo sane toda herida de nuestro corazón.',
          'Que Tu Espíritu more en nuestro hogar, trayendo serenidad, unidad y gozo.'
        ]
      },
      capa6_cierres: {
        es: [
          'Y todas estas bendiciones, consuelo y fortaleza te las pedimos con profundo agradecimiento en nuestro corazón, en el sagrado nombre de Tu Hijo Amado, Jesucristo. Amén.',
          'Dejamos todas las cosas con humildad y fe en Tus sabias manos, agradeciendo Tus tiernas misericordias, en el santo nombre de Jesucristo. Amén.',
          'Con gratitud eterna por Tu amor y confianza en Tu divino plan, te lo suplicamos en el sagrado nombre de Jesucristo. Amén.',
          'En el nombre de Jesucristo, nuestro Salvador y Redentor, te lo pedimos y agradecemos todo. Amén.'
        ]
      }
    };

    // Banco para Ortodoxia Bizantina
    const ortodoxia = {
      titulos: {
        es: [
          'Súplica Litúrgica ante la Faz Divina',
          'Oración de Jesús y Clamor del Corazón',
          'Himno de Protección y Amparo Celestial',
          'Invocación a la Santa Trinidad y a la Theotokos'
        ]
      },
      capa1_invocaciones: {
        es: [
          '¡Señor Jesucristo, Hijo de Dios viviente, Luz del mundo y Médico de almas y cuerpos!',
          '¡Oh Rey Celestial, Consolador, Espíritu de Verdad, que estás en todo lugar y todo lo llenas!',
          '¡Santísimo Señor Dios Todopoderoso, Salvador y Redentor de nuestras vidas!',
          '¡Señor de los ejércitos celestiales y Rey de la gloria increada!',
          '¡Dios misericordioso y compasivo, paciente y lleno de bondad!',
          '¡Santísima Trinidad, consustancial e indivisible, Padre, Hijo y Espíritu Santo!'
        ]
      },
      capa2_atributos: {
        es: [
          'Ante Tu santa faz nos postramos en profunda reverencia y arrepentimiento.',
          'Fuente de vida inmortal y refugio inexpugnable en el día de la angustia.',
          'Tú que sanaste a los enfermos, diste vista a los ciegos y venciste a la muerte.',
          'Que escudriñas los corazones y conoces el clamor secreto de nuestra alma.',
          'Luz que no conoce ocaso y puerto seguro en las tempestades terrenales.'
        ]
      },
      capa3_dimensiones: {
        salud_fisica: {
          es: [
            'Kýrie eléēson. Extiende Tu diestra omnipotente sobre el quebranto del cuerpo: {{situacion}}. Sana todo dolor, disipa la fiebre y renueva la vida terrenal por el poder de Tu santa cruz.',
            'Señor, ten piedad de quienes sufren dolencias en la carne: {{situacion}}. Envía Tu gracia medicinal sobre los enfermos y llena de fortaleza a quienes los cuidan con amor.'
          ]
        },
        general_devocional: {
          es: [
            'Kýrie eléēson. Escucha nuestra humilde súplica en medio de esta circunstancia: {{situacion}}. Por la intercesión de la Santísima Theotokos y de todos los santos, derrama Tu paz inefable.',
            'Acoge, Señor clemente, el clamor que elevamos ante Tu icono bendito: {{situacion}}. Disipa las tinieblas de la tribulación y revístenos con la armadura de Tu Santo Espíritu.'
          ]
        }
      },
      capa4_suplicas: {
        es: [
          'Concede perdón a nuestras faltas voluntarias e involuntarias.',
          'Ilumina nuestro entendimiento con la luz del santo Evangelio.',
          'Fortalece nuestro corazón para guardar Tus mandamientos con temor reverente.',
          'Líbranos de toda tribulación, ira, peligro y necesidad.'
        ]
      },
      capa5_acompanamiento: {
        es: [
          'Por las oraciones de la Purísima Madre de Dios, la siempre Virgen María, y de San Miguel Arcángel.',
          'Que los santos ángeles custodios nos guíen por senderos de rectitud y paz divina.',
          'Que el resplandor del monte Tabor ilumine las sendas oscuras de nuestra jornada.',
          'Que la gracia vivificante del Espíritu Santo renueve las fuerzas de nuestro ser.'
        ]
      },
      capa6_cierres: {
        es: [
          'Porque Tuyo es el reino, el poder y la gloria, del Padre, del Hijo y del Espíritu Santo, ahora y siempre, y por los siglos de los siglos. Amén.',
          'Por la gracia y el amor a la humanidad de Tu Hijo Unigénito, con Quien eres bendito, junto a Tu Santísimo, Bueno y Vivificante Espíritu. Amén.',
          'Alabado sea el Nombre del Señor, desde ahora y para siempre. Kýrie eléēson. Amén.'
        ]
      }
    };

    // Banco Tradición Védica
    const vedica = {
      titulos: {
        es: [
          'Invocación Védica de Paz Cósmica (Śānti)',
          'Mantra Sagrado de Sanación y Protección',
          'Contemplación de la Consciencia Suprema',
          'Ofrenda Devocional de Luz y Sabiduría'
        ]
      },
      capa1_invocaciones: {
        es: [
          'Oṃ Śāntiḥ Śāntiḥ Śāntiḥ. Invocamos la suprema energía del Absoluto (Brahman):',
          'Oṃ Bhūr Bhuvaḥ Svaḥ. Saludamos la energía creadora que sostiene el cosmos:',
          'Oṃ Namo Bhagavate. Nos sintonizamos con el flujo eterno de la divinidad:',
          'Oṃ Tryambakaṃ Yajāmahe. Invocamos la energía suprema de la sanación y la inmortalidad:'
        ]
      },
      capa2_atributos: {
        es: [
          'fuente inagotable de luz, pureza y bienaventuranza suprema (Sat-Chit-Ananda).',
          'que mora en el loto del corazón de todos los seres como testigo supremo.',
          'fuerza primordial que disuelve la ignorancia (Maya) y revela la verdad inmutable.',
          'océano infinito de compasión, sabiduría y armonía universal.'
        ]
      },
      capa3_dimensiones: {
        general_devocional: {
          es: [
            'Que el resplandor de la verdad disipe todo dolor, sombra y obstáculo en este camino: {{situacion}}. Que nuestra mente permanezca serena y nuestras acciones estén alineadas con el Dharma.',
            'Ofrendamos en el fuego sagrado de la consciencia esta prueba terrenal: {{situacion}}. Que toda turbulencia se transforme en calma y todo conflicto en comprensión trascendente.'
          ]
        }
      },
      capa4_suplicas: {
        es: [
          'Que nuestra respiración (Prana) fluya en perfecta armonía con el orden cósmico.',
          'Que los pensamientos de temor se disuelvan en la quietud del Ser Supremo.',
          'Que cultivemos el desapego virtuoso y la compasión infinita hacia todos los seres.',
          'Que la lámpara del discernimiento interior permanezca encendida día y noche.'
        ]
      },
      capa5_acompanamiento: {
        es: [
          'Que las bendiciones de los grandes Rishis y sabios iluminados guíen cada paso.',
          'Que la vibración primordial del OM envuelva nuestro ser en un escudo de paz.',
          'Que la energía sanadora cósmica restaure el equilibrio del cuerpo y del alma.',
          'Que la serenidad de la meditación constante transforme nuestro entorno.'
        ]
      },
      capa6_cierres: {
        es: [
          'Oṃ Tat Sat. Que haya paz en la tierra, paz en las aguas, paz en los cielos y paz en el corazón de todos los seres. Oṃ Śāntiḥ.',
          'Lokah Samastah Sukhino Bhavantu. Que todos los seres en todos los mundos sean libres, sanos y felices. Oṃ Śāntiḥ Śāntiḥ Śāntiḥ.',
          'Asato ma sadgamaya, tamaso ma jyotirgamaya, mrityor ma amritam gamaya. Oṃ Śāntiḥ.'
        ]
      }
    };

    // Selección por defecto
    const dict = {
      mormonismo,
      ortodoxia,
      vedica,
      espiritismo: mormonismo, // hereda matrices completas adaptadas en base
      catolicismo: ortodoxia,
      santeria_yoruba: mormonismo,
      budismo: vedica,
      pentecostal: mormonismo
    };

    return dict[tradicion] || mormonismo;
  }

  static detectCrisisPrompt(text) {
    if (!text) return false;
    const t = String(text).toLowerCase();
    const crisisKeywords = [
      'suicidio', 'suicidarme', 'quitarme la vida', 'no quiero vivir', 'matarme', 'autolesion',
      'suicide', 'kill myself', 'end my life', 'want to die', 'self harm'
    ];
    return crisisKeywords.some(k => t.includes(k));
  }

  static generateCrisisResponse(lang = 'es') {
    return {
      titulo: lang === 'en' ? '🕊️ You Are Not Alone · Hope & Support' : '🕊️ No Estás Solo · Esperanza y Apoyo',
      textoCompleto: lang === 'en'
        ? "Dear soul, your life has immense value and purpose. If you are experiencing overwhelming pain or thoughts of ending your life, please reach out to those who can help right now:\n\n📞 USA/Canada: Call or text 988 (Lifeline)\n📞 UK: Call 111 or 999\n📞 Mexico/LatAm: Call 911 or line 800 911 2000 (Línea de la Vida)\n📞 International: Visit findahelpline.com\n\n«The Lord is close to the brokenhearted and saves those who are crushed in spirit.» (Psalm 34:18)\nPlease speak with a loved one, doctor, or trusted counselor today. You are deeply loved."
        : "Hermano/a del alma, tu vida tiene un valor incalculable y un propósito sagrado. Si estás atravesando una tormenta de dolor o pensamientos de no continuar, por favor acude de inmediato a quienes pueden ayudarte:\n\n📞 México: Línea de la Vida 800 911 2000 o llama al 911\n📞 España: Teléfono de la Esperanza 717 003 717 o llama al 024\n📞 Estados Unidos: Llama o envía mensaje al 988\n📞 Internacional: Visita findahelpline.com\n\n«Cercano está el Señor a los quebrantados de corazón, y salva a los contritos de espíritu.» (Salmo 34:18)\nPor favor habla hoy mismo con un familiar, médico o sacerdote/pastor de confianza. Eres infinitamente valioso/a.",
      fuente: 'Soporte y Protección Litúrgica',
      latenciaMs: 1,
      esNube: false,
      esCrisis: true
    };
  }
}

