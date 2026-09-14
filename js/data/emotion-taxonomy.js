/**
 * EMOTIONAL TAXONOMY ALIASING ENGINE
 * FeUniversal - Faith & Prayers
 * 
 * Mapea los más de 180 subtags emocionales del compendio histórico
 * a las 12 intenciones emocionales canónicas de la interfaz de usuario.
 */

export const CANONICAL_EMOTION_KEYS = [
  'miedo_angustia',
  'tristeza_duelo',
  'enfermedad_dolor',
  'cansancio_agotamiento',
  'desesperacion',
  'necesidad_escasez',
  'confusion_duda',
  'conflicto_familiar',
  'culpa_arrepentimiento',
  'rabia_resentimiento',
  'soledad_vacio',
  'gratitud_gozo'
];

export const EMOTION_SYNONYM_MAP = {
  // 1. Miedo & Angustia
  'miedo': 'miedo_angustia',
  'angustia': 'miedo_angustia',
  'angustia_miedo': 'miedo_angustia',
  'miedo_angustia': 'miedo_angustia',
  'temeroso': 'miedo_angustia',
  'atemorizado': 'miedo_angustia',
  'temeroso_de_caer': 'miedo_angustia',
  'temeroso_de_brujeria': 'miedo_angustia',
  'peligro_enemigos': 'miedo_angustia',
  'en_peligro_grave': 'miedo_angustia',
  'acechado_por_energias_oscuras': 'miedo_angustia',
  'temeroso_por_la_familia': 'miedo_angustia',
  'embrujado': 'miedo_angustia',
  'asfixiado_por_problemas': 'miedo_angustia',
  'vulnerable_al_alba': 'miedo_angustia',
  'tentado': 'miedo_angustia',
  'acosado_por_demonios': 'miedo_angustia',
  'bajo_proteccion': 'miedo_angustia',
  'cargado_de_negatividad': 'miedo_angustia',
  'atacado': 'miedo_angustia',
  'atacado_por_fuerzas_oscuras': 'miedo_angustia',

  // 2. Tristeza & Duelo
  'tristeza': 'tristeza_duelo',
  'duelo': 'tristeza_duelo',
  'tristeza_duelo': 'tristeza_duelo',
  'duelo_tristeza': 'tristeza_duelo',
  'en_duelo': 'tristeza_duelo',
  'desolado': 'tristeza_duelo',
  'herido_por_el_pasado': 'tristeza_duelo',
  'nostalgico': 'tristeza_duelo',
  'carente_de_amor': 'tristeza_duelo',
  'desesperanzado': 'tristeza_duelo',
  'quebrantado_en_amor': 'tristeza_duelo',
  'afligido_por_el_mundo': 'tristeza_duelo',
  'deprimido': 'tristeza_duelo',
  'cargado_de_penas': 'tristeza_duelo',
  'dolido': 'tristeza_duelo',
  'consuelo_a_deudos_espirita': 'tristeza_duelo',
  'lloroso_de_gozo': 'tristeza_duelo',

  // 3. Enfermedad & Dolor
  'enfermedad': 'enfermedad_dolor',
  'dolor': 'enfermedad_dolor',
  'enfermedad_dolor': 'enfermedad_dolor',
  'dolor_enfermedad': 'enfermedad_dolor',
  'dolorido': 'enfermedad_dolor',
  'enfermo_grave': 'enfermedad_dolor',
  'operacion_medica': 'enfermedad_dolor',
  'sanacion_joanna': 'enfermedad_dolor',
  'socorro_a_cirujanos': 'enfermedad_dolor',
  'salud_psiquica': 'enfermedad_dolor',
  'beber_agua_fluidificada': 'enfermedad_dolor',
  'lisiado': 'enfermedad_dolor',
  'impedido_fisicamente': 'enfermedad_dolor',
  'parturienta': 'enfermedad_dolor',
  'embarazada': 'enfermedad_dolor',
  'en_trabajo_de_parto': 'enfermedad_dolor',
  'expuesto_a_venenos': 'enfermedad_dolor',
  'marchito': 'enfermedad_dolor',
  'sin_energia': 'enfermedad_dolor',
  'buscando_cura': 'enfermedad_dolor',
  'buscando_sanacion': 'enfermedad_dolor',

  // 4. Cansancio & Agotamiento
  'cansancio': 'cansancio_agotamiento',
  'agotamiento': 'cansancio_agotamiento',
  'cansancio_agotamiento': 'cansancio_agotamiento',
  'fatigado': 'cansancio_agotamiento',
  'sin_fuerzas_propias': 'cansancio_agotamiento',
  'desanimado': 'cansancio_agotamiento',
  'cargado': 'cansancio_agotamiento',
  'cansado_en_el_camino': 'cansancio_agotamiento',
  'somnoliento_espiritualmente': 'cansancio_agotamiento',
  'frio_espiritualmente': 'cansancio_agotamiento',

  // 5. Desesperación
  'desesperacion': 'desesperacion',
  'desesperado': 'desesperacion',
  'sin_salida': 'desesperacion',
  'atrapado': 'desesperacion',
  'al_borde_del_abismo': 'desesperacion',
  'en_peligro_inminente': 'desesperacion',
  'naufrago': 'desesperacion',
  'marinero_en_tormenta': 'desesperacion',
  'en_medio_de_la_tormenta': 'desesperacion',
  'en_fuego_de_prueba': 'desesperacion',
  'rodeado_de_mareas_adversas': 'desesperacion',
  'apurado': 'desesperacion',

  // 6. Necesidad & Escasez
  'necesidad': 'necesidad_escasez',
  'escasez': 'necesidad_escasez',
  'necesidad_escasez': 'necesidad_escasez',
  'angustiado_por_deudas': 'necesidad_escasez',
  'abrumado_por_deudas': 'necesidad_escasez',
  'falta_de_sustento': 'necesidad_escasez',
  'preocupado_por_el_sustento': 'necesidad_escasez',
  'pobre': 'necesidad_escasez',
  'pidiendo_prosperidad': 'necesidad_escasez',
  'en_mala_racha': 'necesidad_escasez',
  'endeudado_karmicamente': 'necesidad_escasez',
  'necesitado': 'necesidad_escasez',
  'necesitado_de_sustento': 'necesidad_escasez',
  'angustiado_por_recursos': 'necesidad_escasez',

  // 7. Confusión & Duda
  'confusion': 'confusion_duda',
  'duda': 'confusion_duda',
  'confusion_duda': 'confusion_duda',
  'indeciso': 'confusion_duda',
  'en_una_encrucijada': 'confusion_duda',
  'perdido': 'confusion_duda',
  'desconectado': 'confusion_duda',
  'buscando_rumbo': 'confusion_duda',
  'necesitado_de_guia': 'confusion_duda',
  'buscando_guia': 'confusion_duda',
  'buscando_sabiduria': 'confusion_duda',
  'en_tinieblas': 'confusion_duda',
  'desarmonizado': 'confusion_duda',
  'inquieto': 'confusion_duda',
  'ansioso': 'confusion_duda',

  // 8. Conflicto Familiar & Relacional
  'conflicto_familiar': 'conflicto_familiar',
  'reconciliacion_familiar_espirita': 'conflicto_familiar',
  'lazos_de_sangre': 'conflicto_familiar',
  'paciencia_con_ninos': 'conflicto_familiar',
  'disipar_malentendidos': 'conflicto_familiar',
  'inquieto_en_el_hogar': 'conflicto_familiar',
  'paz_en_hogares_humildes': 'conflicto_familiar',
  'padre_o_madre': 'conflicto_familiar',
  'madre_angustiada': 'conflicto_familiar',
  'en_familia': 'conflicto_familiar',

  // 9. Culpa & Arrepentimiento
  'culpa': 'culpa_arrepentimiento',
  'arrepentimiento': 'culpa_arrepentimiento',
  'culpa_arrepentimiento': 'culpa_arrepentimiento',
  'contrito': 'culpa_arrepentimiento',
  'soltar_la_culpa': 'culpa_arrepentimiento',
  'cargado_de_culpas': 'culpa_arrepentimiento',
  'rencoroso': 'culpa_arrepentimiento',
  'autocritico': 'culpa_arrepentimiento',
  'esperando_el_perdon': 'culpa_arrepentimiento',
  'absuelto': 'culpa_arrepentimiento',

  // 10. Rabia & Resentimiento (Injusticia)
  'rabia': 'rabia_resentimiento',
  'resentimiento': 'rabia_resentimiento',
  'rabia_resentimiento': 'rabia_resentimiento',
  'disolver_el_rencor': 'rabia_resentimiento',
  'traicionado': 'rabia_resentimiento',
  'enfrentando_injusticias': 'rabia_resentimiento',
  'perseguido_por_justicia': 'rabia_resentimiento',
  'defensa_del_debil': 'rabia_resentimiento',
  'necesitado_de_justicia': 'rabia_resentimiento',

  // 11. Soledad & Vacío
  'soledad': 'soledad_vacio',
  'vacio': 'soledad_vacio',
  'soledad_vacio': 'soledad_vacio',
  'solo': 'soledad_vacio',
  'solitario': 'soledad_vacio',
  'aislado': 'soledad_vacio',
  'exiliado': 'soledad_vacio',
  'lejos_de_la_patria': 'soledad_vacio',
  'sediento_de_paz': 'soledad_vacio',
  'desierto_espiritual': 'soledad_vacio',

  // 12. Gratitud & Gozo
  'gratitud': 'gratitud_gozo',
  'gozo': 'gratitud_gozo',
  'gratitud_gozo': 'gratitud_gozo',
  'alegria': 'gratitud_gozo',
  'bendecido': 'gratitud_gozo',
  'alabador': 'gratitud_gozo',
  'adorador': 'gratitud_gozo',
  'triunfal': 'gratitud_gozo',
  'lleno_de_paz': 'gratitud_gozo',
  'lleno_de_amor': 'gratitud_gozo',
  'renovado_en_gozo': 'gratitud_gozo',
  'alegre_en_Dios': 'gratitud_gozo',
  'milagro_de_respirar': 'gratitud_gozo',
  'gratitud_matutina': 'gratitud_gozo',
  'gratitud_familiar': 'gratitud_gozo',
  'en_paz_espiritual': 'gratitud_gozo',
  'en_armonia_cosmica': 'gratitud_gozo'
};

export function mapEmotionToCanonical(emoTag) {
  if (!emoTag) return 'miedo_angustia';
  const clean = String(emoTag).toLowerCase().trim();
  return EMOTION_SYNONYM_MAP[clean] || (CANONICAL_EMOTION_KEYS.includes(clean) ? clean : null);
}

export function prayerMatchesEmotionCanonical(prayer, canonicalEmotion) {
  if (!prayer || !canonicalEmotion) return false;
  if (!Array.isArray(prayer.estadosEmocionales)) return false;

  for (const tag of prayer.estadosEmocionales) {
    const mapped = mapEmotionToCanonical(tag);
    if (mapped === canonicalEmotion) return true;
  }
  return false;
}
