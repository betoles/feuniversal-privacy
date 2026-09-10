/**
 * ICONOS VECTORIALES PROFESIONALES (SVG + CSS)
 * FeUniversal - Faith & Prayers
 * 
 * Reemplazo de alta fidelidad para todos los emojis, con degradados,
 * trazos nítidos y estética litúrgico-espiritual y tecnológica.
 */

export const SVG_ICONS = {
  // --- IDENTIDAD Y NAVEGACIÓN ---
  brand_logo: `<img src="ico.png?v=5.0" alt="FeUniversal" class="icon-brand-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />`,

  nav_explore: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fill-opacity="0.2"/>
  </svg>`,

  nav_scriptures: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="url(#goldGrad)" fill-opacity="0.22"/>
    <line x1="8" y1="7" x2="16" y2="7"/>
    <line x1="8" y1="11" x2="16" y2="11"/>
    <line x1="8" y1="15" x2="13" y2="15"/>
  </svg>`,

  nav_altar: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2c-.5 1.5-2 3-2 4.5 0 1.1.9 2 2 2s2-.9 2-2C14 5 12.5 3.5 12 2z" fill="url(#goldGrad)" stroke="none"/>
    <rect x="8" y="9" width="8" height="11" rx="2" stroke="currentColor"/>
    <line x1="12" y1="9" x2="12" y2="7"/>
    <path d="M5 21h14"/>
  </svg>`,

  nav_beads: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="6" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="17" cy="8.5" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="19" cy="13.5" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="16" cy="18" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="12" cy="20" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="8" cy="18" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="5" cy="13.5" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="7" cy="8.5" r="2.5" fill="currentColor" fill-opacity="0.3"/>
    <path d="M12 2v2"/>
  </svg>`,

  nav_vault: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
  </svg>`,

  // --- TRADICIONES SAGRADAS ---
  trad_mormonismo: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 21V9l8-6 8 6v12"/>
    <path d="M9 21v-7a3 3 0 0 1 6 0v7"/>
    <path d="M12 3v3"/>
    <circle cx="12" cy="2" r="1" fill="currentColor"/>
  </svg>`,

  trad_catolicismo: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="6" y1="7" x2="18" y2="7"/>
    <circle cx="12" cy="7" r="3" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>
  </svg>`,

  trad_ortodoxia: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="8" y1="5" x2="16" y2="5"/>
    <line x1="5" y1="9" x2="19" y2="9"/>
    <line x1="9" y1="17" x2="15" y2="15"/>
  </svg>`,

  trad_santeria: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2L9 7C6 8 4 11 4 14a8 8 0 0 0 16 0c0-3-2-6-5-7L12 2z" fill="currentColor" fill-opacity="0.15"/>
    <path d="M12 7v13"/>
    <path d="M8 12c2-1 4-1 4 0"/>
    <path d="M12 15c2-1 4-1 4 0"/>
  </svg>`,

  trad_budismo: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="3" x2="12" y2="9"/>
    <line x1="12" y1="15" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="9" y2="12"/>
    <line x1="15" y1="12" x2="21" y2="12"/>
    <line x1="5.6" y1="5.6" x2="9.9" y2="9.9"/>
    <line x1="14.1" y1="14.1" x2="18.4" y2="18.4"/>
    <line x1="18.4" y1="5.6" x2="14.1" y2="9.9"/>
    <line x1="9.9" y1="14.1" x2="5.6" y2="18.4"/>
  </svg>`,

  trad_vedica: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 19c-3 0-5-2-5-5 0-2.5 2-4.5 4.5-4.5.5 0 1 .1 1.5.3C9 7.5 11 6 13.5 6c3 0 5.5 2.5 5.5 5.5 0 1-.3 2-.8 2.8"/>
    <path d="M14 14c2 0 4 1.5 4 3.5 0 2.5-2 4.5-4.5 4.5-2 0-3.5-1-4-2.5"/>
    <path d="M19 6c1 0 2-.5 2-1.5S20 3 19 3"/>
    <circle cx="19" cy="2" r="1" fill="currentColor"/>
  </svg>`,

  trad_pentecostal: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2c0 3.5-2.5 5.5-4 8-1.5 2.5-1.5 5 0 7.5 1.5 2.5 4 3.5 4 3.5s2.5-1 4-3.5c1.5-2.5 1.5-5 0-7.5-1.5-2.5-4-4.5-4-8z" fill="currentColor" fill-opacity="0.25"/>
    <path d="M12 12c-1 1.5-1.5 2.5-1 4 .5 1.5 1.5 2 1.5 2s1-.5 1.5-2c.5-1.5 0-2.5-1-4z" fill="currentColor"/>
    <circle cx="12" cy="7" r="1" fill="currentColor"/>
  </svg>`,

  trad_hebreo: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 19 14 5 14 12 2" stroke="currentColor"/>
    <polygon points="12 22 5 10 19 10 12 22" stroke="currentColor"/>
  </svg>`,

  trad_espiritismo: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3v7"/>
    <path d="M8 8l4-5 4 5"/>
    <path d="M5 13a7 7 0 0 0 14 0c0-3-2.5-5.5-6-6"/>
    <path d="M12 14v4"/>
    <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
  </svg>`,

  trad_adventista: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <line x1="4" y1="10" x2="20" y2="10"/>
    <path d="M10 14h4"/>
    <path d="M12 7l1 1-1 1-1-1 1-1z" fill="currentColor"/>
  </svg>`,

  trad_testigos: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="14" y2="10"/>
  </svg>`,

  trad_islam: `<svg class="icon-svg icon-trad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor" fill-opacity="0.2"/>
    <polygon points="17 4 17.9 6.2 20.3 6.3 18.4 7.8 19.1 10.1 17 8.8 14.9 10.1 15.6 7.8 13.7 6.3 16.1 6.2 17 4" fill="currentColor"/>
  </svg>`,

  // --- INTENCIONES UNIVERSALES ---
  intent_proteccion: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#roseGrad)" fill-opacity="0.2"/>
    <path d="M12 8v5"/>
    <circle cx="12" cy="15.5" r="1" fill="currentColor"/>
  </svg>`,

  intent_salud: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9s-9-4.03-9-9a9 9 0 0 1 9-9z"/>
    <path d="M12 7v10M7 12h10" stroke-width="2.2"/>
  </svg>`,

  intent_paz: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="url(#cyanGrad)" fill-opacity="0.2"/>
    <circle cx="12" cy="13" r="3" stroke="currentColor"/>
  </svg>`,

  intent_prosperidad: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#goldGrad)" fill-opacity="0.3"/>
  </svg>`,

  intent_gratitud: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <path d="M12 12l2.5 5 4-1-2.5-6"/>
    <path d="M12 12l-2.5 5-4-1 2.5-6"/>
    <circle cx="12" cy="4" r="2" fill="currentColor"/>
  </svg>`,

  intent_duelo: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2c-.8 1.6-2.5 3.5-2.5 5.5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5C14.5 5.5 12.8 3.6 12 2z" fill="currentColor"/>
    <rect x="8.5" y="11" width="7" height="11" rx="1.5"/>
    <line x1="12" y1="11" x2="12" y2="9"/>
  </svg>`,

  intent_sabiduria: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M12 2a7 7 0 0 0-7 7c0 2.6 1.4 4.8 3.5 6h7c2.1-1.2 3.5-3.4 3.5-6a7 7 0 0 0-7-7z" fill="url(#goldGrad)" fill-opacity="0.2"/>
  </svg>`,

  intent_perdon: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#cyanGrad)" fill-opacity="0.25"/>
    <path d="M9 10l2 2 4-4"/>
  </svg>`,

  intent_fortaleza: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2L4 7v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V7l-8-5z" fill="url(#goldGrad)" fill-opacity="0.25"/>
    <path d="M12 6v12"/>
    <path d="M8 10h8"/>
  </svg>`,

  intent_familia: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <path d="M9 22V12h6v10"/>
  </svg>`,

  // --- ACCIONES Y HUD UI ---
  ui_clock: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" fill="url(#goldGrad)" fill-opacity="0.15"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>`,

  ui_bell: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>`,

  time_dawn: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 18a5 5 0 0 0-10 0" fill="url(#goldGrad)" fill-opacity="0.25"/>
    <line x1="12" y1="2" x2="12" y2="9"/>
    <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
    <line x1="1" y1="18" x2="3" y2="18"/>
    <line x1="21" y1="18" x2="23" y2="18"/>
    <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
    <line x1="23" y1="22" x2="1" y2="22"/>
  </svg>`,

  ui_vibrate: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
    <path d="M2 8l-1 4 1 4"/>
    <path d="M22 8l1 4-1 4"/>
  </svg>`,

  ui_settings: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>`,

  ui_sun: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5" fill="url(#goldGrad)"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>`,

  ui_moon: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="url(#indigoGrad)"/>
  </svg>`,

  ui_globe: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>`,

  ui_audio: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>`,

  ui_volume_mute: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>`,

  ui_voice: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
  </svg>`,

  ui_pause: `<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="6" y="4" width="4" height="16" rx="1.5"/>
    <rect x="14" y="4" width="4" height="16" rx="1.5"/>
  </svg>`,

  ui_play: `<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="6 4 20 12 6 20 6 4"/>
  </svg>`,

  ui_speed: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>`,

  ui_search: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>`,

  ui_close: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,

  ui_camera: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>`,

  ui_download: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`,

  ui_share_nodes: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>`,

  ui_copy: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`,

  ui_mail: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="currentColor" fill-opacity="0.15"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>`,

  ui_paperclip: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>`,

  ui_dove: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C8 2 4 6 4 10c0 4 3 7 7 8l-1 4 4-2c5-1 8-5 8-10 0-4-4-8-10-8z" fill="url(#cyanGrad)" fill-opacity="0.2"/>
    <circle cx="9" cy="8" r="1.5" fill="currentColor"/>
    <path d="M15 10c2 1 4 0 5-1"/>
  </svg>`,

  brand_whatsapp: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="#25d366" fill-opacity="0.25" stroke="#25d366"/>
    <path d="M9.5 9a1.5 1.5 0 0 0-1.5 1.5c0 3 2.5 5.5 5.5 5.5a1.5 1.5 0 0 0 1.5-1.5v-1l-2-1-.5 1c-1-.5-2-1.5-2.5-2.5l1-.5-1-2h-1z" fill="#25d366"/>
  </svg>`,

  brand_telegram: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" fill="#0088cc" fill-opacity="0.2" stroke="#0088cc"/>
    <path d="M18 6l-13 6 4 1.5 1.5 4.5 2.5-2.5 4 3 2.5-12.5z" fill="#0088cc"/>
  </svg>`,

  brand_wechat: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.5 13a6.5 6.5 0 1 1 5.7-9.6A6.5 6.5 0 0 0 3 9.5c0 1.6.6 3.1 1.7 4.2L4 16l2.5-.7c.9.4 1.9.7 3 .7z" fill="#07c160" fill-opacity="0.2" stroke="#07c160"/>
    <circle cx="7" cy="7.5" r="0.8" fill="#07c160"/>
    <circle cx="11" cy="7.5" r="0.8" fill="#07c160"/>
    <path d="M15 13.5c0-.4 0-.8-.1-1.2A5 5 0 1 1 19 18l1.8.5-.5-1.6c.5-.8.7-1.6.7-2.4 0-2.8-2.7-5-6-5z" fill="#07c160" fill-opacity="0.3" stroke="#07c160"/>
    <circle cx="13.5" cy="14" r="0.7" fill="#07c160"/>
    <circle cx="16.5" cy="14" r="0.7" fill="#07c160"/>
  </svg>`,

  brand_line: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.8 1.6 5.3 4.1 6.8-.2.7-.8 2.5-.9 2.9 0 0-.2.6.3.3.5-.3 3.3-2 4.6-2.8.6.1 1.2.1 1.9.1 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" fill="#00b900" fill-opacity="0.2" stroke="#00b900"/>
    <path d="M7 10v4M10 10v4h2M14 10v4M16 10v4" stroke="#00b900" stroke-width="1.5"/>
  </svg>`,

  brand_sharechat: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a9 9 0 0 0-9 9c0 2.6 1.1 5 2.9 6.7L5 21l3.5-.9c1.1.6 2.3.9 3.5.9a9 9 0 0 0 9-9 9 9 0 0 0-9-9z" fill="#eb5757" fill-opacity="0.2" stroke="#eb5757"/>
    <path d="M10 10l4 2-4 2V10z" fill="#eb5757"/>
  </svg>`,

  brand_zalo: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" fill="#0068ff" fill-opacity="0.2" stroke="#0068ff"/>
    <path d="M8 8h8l-8 8h8" stroke="#0068ff" stroke-width="2"/>
  </svg>`,

  brand_facebook: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" fill="#1877f2" fill-opacity="0.2" stroke="#1877f2"/>
    <path d="M13.5 8.5H15V6h-2c-2.2 0-3 1.3-3 3v2H8v2.5h2V20h3v-6.5h2l.5-2.5h-2.5V9.5c0-.7.3-1 1-1z" fill="#1877f2"/>
  </svg>`,

  ui_intentions: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
  </svg>`,

  ui_catalog: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="8" y1="7" x2="16" y2="7"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>`,

  ai_auto: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="url(#goldGrad)" fill-opacity="0.25" stroke="#f59e0b"/>
  </svg>`,

  ai_local: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="url(#goldGrad)" fill-opacity="0.15" stroke="#f59e0b"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#f59e0b"/>
  </svg>`,

  ai_gemini: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#10b981" fill-opacity="0.25" stroke="#10b981"/>
  </svg>`,

  ai_ollama: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke="#38bdf8"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="#38bdf8"/>
  </svg>`,

  ui_faithgpt: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
    <circle cx="12" cy="12" r="2.5" fill="currentColor" fill-opacity="0.3"/>
  </svg>`,

  ui_sparkles: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3l1.91 5.82a2 2 0 0 0 1.27 1.27L21 12l-5.82 1.91a2 2 0 0 0-1.27 1.27L12 21l-1.91-5.82a2 2 0 0 0-1.27-1.27L3 12l5.82-1.91a2 2 0 0 0 1.27-1.27L12 3z"/>
  </svg>`,

  ui_check: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`,

  ui_refresh: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>`,

  ui_compass: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9" fill="url(#goldGrad)" fill-opacity="0.16"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fill-opacity="0.35"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>`,

  ui_sunrise_sunset: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2v4M4.93 10.93l2.83-2.83M19.07 10.93l-2.83-2.83M2 18h20" stroke="currentColor"/>
    <path d="M7 18a5 5 0 0 1 10 0" fill="url(#roseGrad)" fill-opacity="0.4" stroke="currentColor"/>
  </svg>`,

  ui_shield: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#cyanGrad)" fill-opacity="0.18"/>
  </svg>`,

  skin_crystal: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" fill="url(#cyanGrad)" fill-opacity="0.25"/>
    <polyline points="2 9 12 13 22 9"/>
    <polyline points="6 3 12 13 18 3"/>
    <line x1="12" y1="13" x2="12" y2="22"/>
  </svg>`,

  skin_kaaba: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 21 6.5 12 11 3 6.5 12 2" fill="url(#goldGrad)" fill-opacity="0.5"/>
    <polygon points="3 6.5 12 11 12 21 3 16.5 3 6.5" fill="currentColor" fill-opacity="0.2"/>
    <polygon points="21 6.5 12 11 12 21 21 16.5 21 6.5" fill="currentColor" fill-opacity="0.35"/>
    <line x1="3" y1="9" x2="12" y2="13.5"/>
    <line x1="12" y1="13.5" x2="21" y2="9"/>
  </svg>`,

  skin_surya: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5" fill="url(#goldGrad)" fill-opacity="0.35"/>
    <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-15.1-7.1l2.1 2.1m10 10l2.1 2.1m-14.2 0l2.1-2.1m10-10l2.1-2.1" stroke="url(#roseGrad)"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>`,

  skin_dharma: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9" stroke="url(#cyanGrad)"/>
    <circle cx="12" cy="12" r="3" fill="url(#cyanGrad)" fill-opacity="0.35"/>
    <line x1="12" y1="3" x2="12" y2="9"/>
    <line x1="12" y1="15" x2="12" y2="21"/>
    <line x1="3" y1="12" x2="9" y2="12"/>
    <line x1="15" y1="12" x2="21" y2="12"/>
    <line x1="5.6" y1="5.6" x2="9.9" y2="9.9"/>
    <line x1="14.1" y1="14.1" x2="18.4" y2="18.4"/>
    <line x1="18.4" y1="5.6" x2="14.1" y2="9.9"/>
    <line x1="9.9" y1="14.1" x2="5.6" y2="18.4"/>
  </svg>`,

  ui_device_calibrate: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor"/>
    <line x1="11" y1="17.5" x2="13" y2="17.5"/>
    <path d="M4 8l-2 2 2 2" stroke="var(--accent-gold)"/>
    <path d="M20 8l2 2-2 2" stroke="var(--accent-gold)"/>
    <path d="M2 10a10 10 0 0 1 20 0" stroke="var(--accent-gold)" stroke-dasharray="2 2"/>
  </svg>`,

  ui_lock: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="10" width="16" height="11" rx="2" ry="2" fill="currentColor" fill-opacity="0.15"/>
    <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
    <circle cx="12" cy="15.5" r="1.5" fill="currentColor"/>
  </svg>`,

  ui_ban: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.15"/>
    <line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/>
  </svg>`,

  ui_credit_card: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="currentColor" fill-opacity="0.15"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
    <line x1="6" y1="15" x2="10" y2="15"/>
  </svg>`,

  ui_laptop: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="2"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>`,

  ui_server: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/>
    <line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>`
};



const ICON_ALIASES = {
  // Alias de Tradiciones (ID y claves en inglés/español)
  tradition_catholic: 'trad_catolicismo',
  tradition_vedic: 'trad_vedica',
  tradition_islamic: 'trad_islam',
  tradition_buddhist: 'trad_budismo',
  tradition_pentecostal: 'trad_pentecostal',
  tradition_jewish: 'trad_hebreo',
  tradition_orthodox: 'trad_ortodoxia',
  tradition_santeria: 'trad_santeria',
  tradition_spiritist: 'trad_espiritismo',
  tradition_lds: 'trad_mormonismo',
  trad_mormon: 'trad_mormonismo',
  tradition_adventist: 'trad_adventista',
  tradition_anglican: 'trad_testigos',
  catolicismo: 'trad_catolicismo',
  vedica: 'trad_vedica',
  islam: 'trad_islam',
  budismo: 'trad_budismo',
  pentecostal: 'trad_pentecostal',
  hebreo_salmos: 'trad_hebreo',
  ortodoxia: 'trad_ortodoxia',
  santeria_yoruba: 'trad_santeria',
  espiritismo: 'trad_espiritismo',
  mormonismo: 'trad_mormonismo',
  adventista: 'trad_adventista',
  testigos_jehova: 'trad_testigos'
};

/**
 * Función helper para renderizar iconos de forma segura
 */
export function renderIcon(iconKey) {
  if (!iconKey) return SVG_ICONS.ui_sparkles;
  if (SVG_ICONS[iconKey]) return SVG_ICONS[iconKey];
  const mapped = ICON_ALIASES[iconKey];
  if (mapped && SVG_ICONS[mapped]) return SVG_ICONS[mapped];
  return SVG_ICONS.ui_sparkles;
}

/**
 * Banderas vectoriales SVG de alta definición (Compatibilidad universal 100% Windows/Edge/iOS/Android)
 */
export function renderLangBadge(code) {
  const c = (code || 'es').toLowerCase();
  
  const SVG_FLAGS = {
    // México (Verde / Blanco / Rojo con escudo nacional estilizado)
    es: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="10.66" height="24" fill="#006847"/>
      <rect x="10.66" width="10.68" height="24" fill="#ffffff"/>
      <rect x="21.34" width="10.66" height="24" fill="#ce1126"/>
      <ellipse cx="16" cy="13.5" rx="2.5" ry="1.2" fill="#006847" opacity="0.85"/>
      <path d="M14.6,12.6 Q16,9.4 17.4,12.6 Q16,11.2 14.6,12.6 Z" fill="#78350f"/>
      <circle cx="16" cy="10.8" r="0.9" fill="#b45309"/>
      <path d="M14,14.2 Q16,15.6 18,14.2" stroke="#006847" stroke-width="0.7" fill="none"/>
    </svg>`,

    // Estados Unidos / Reino Unido / Global (Barras rojas y azules con cantón de estrellas)
    en: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#b22234"/>
      <path d="M0,3.7h32M0,7.4h32M0,11.1h32M0,14.8h32M0,18.5h32M0,22.2h32" stroke="#ffffff" stroke-width="1.8"/>
      <rect width="14" height="13" fill="#3c3b6e"/>
      <circle cx="4" cy="4" r="1" fill="#ffffff"/>
      <circle cx="10" cy="4" r="1" fill="#ffffff"/>
      <circle cx="7" cy="7" r="1" fill="#ffffff"/>
      <circle cx="4" cy="10" r="1" fill="#ffffff"/>
      <circle cx="10" cy="10" r="1" fill="#ffffff"/>
    </svg>`,

    // Francia (Azul / Blanco / Rojo)
    fr: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="10.6" height="24" fill="#002395"/>
      <rect x="10.6" width="10.8" height="24" fill="#ffffff"/>
      <rect x="21.4" width="10.6" height="24" fill="#ed2939"/>
    </svg>`,

    // Brasil (Verde con rombo amarillo y círculo azul)
    pt: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#009c3b"/>
      <polygon points="16,2 30,12 16,22 2,12" fill="#ffdf00"/>
      <circle cx="16" cy="12" r="5" fill="#002776"/>
      <path d="M12,13 Q16,10 20,13" stroke="#ffffff" stroke-width="1" fill="none"/>
    </svg>`,

    // Italia (Verde / Blanco / Rojo)
    it: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="10.6" height="24" fill="#009246"/>
      <rect x="10.6" width="10.8" height="24" fill="#ffffff"/>
      <rect x="21.4" width="10.6" height="24" fill="#ce2b37"/>
    </svg>`,

    // Alemania (Negro / Rojo / Dorado)
    de: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="8" fill="#000000"/>
      <rect y="8" width="32" height="8" fill="#dd0000"/>
      <rect y="16" width="32" height="8" fill="#ffce00"/>
    </svg>`,

    // Rusia (Blanco / Azul / Rojo)
    ru: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="8" fill="#ffffff"/>
      <rect y="8" width="32" height="8" fill="#0039a6"/>
      <rect y="16" width="32" height="8" fill="#d52b1e"/>
    </svg>`,

    // Arabia Saudita / Árabe (Verde con espada/inscripción blanca)
    ar: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#006c35"/>
      <line x1="8" y1="16" x2="24" y2="16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M10,8 Q16,5 22,8" stroke="#ffffff" stroke-width="1.2" fill="none"/>
    </svg>`,

    // Israel / Hebreo (Franjas azules y Estrella de David)
    he: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#ffffff"/>
      <rect y="3" width="32" height="3" fill="#0038b8"/>
      <rect y="18" width="32" height="3" fill="#0038b8"/>
      <polygon points="16,8 19.5,14 12.5,14" fill="none" stroke="#0038b8" stroke-width="1"/>
      <polygon points="16,15 19.5,9 12.5,9" fill="none" stroke="#0038b8" stroke-width="1"/>
    </svg>`,

    // India / Hindi (Naranja / Blanco / Verde con rueda Ashoka Chakra)
    hi: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="8" fill="#ff9933"/>
      <rect y="8" width="32" height="8" fill="#ffffff"/>
      <rect y="16" width="32" height="8" fill="#138808"/>
      <circle cx="16" cy="12" r="3" fill="none" stroke="#000080" stroke-width="1"/>
      <circle cx="16" cy="12" r="0.8" fill="#000080"/>
    </svg>`,

    // China (Rojo con 5 estrellas doradas)
    zh: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#de2910"/>
      <polygon points="6,3 7.5,7 4,4.5 8,4.5 4.5,7" fill="#ffde00"/>
      <circle cx="11" cy="3" r="0.8" fill="#ffde00"/>
      <circle cx="13" cy="5" r="0.8" fill="#ffde00"/>
      <circle cx="13" cy="8" r="0.8" fill="#ffde00"/>
      <circle cx="11" cy="10" r="0.8" fill="#ffde00"/>
    </svg>`,

    // Vaticano / Latín (Amarillo / Blanco con llaves cruzadas)
    la: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="16" height="24" fill="#ffe000"/>
      <rect x="16" width="16" height="24" fill="#ffffff"/>
      <line x1="21" y1="9" x2="27" y2="15" stroke="#d4af37" stroke-width="1.8"/>
      <line x1="27" y1="9" x2="21" y2="15" stroke="#c0c0c0" stroke-width="1.8"/>
    </svg>`,

    // Japón (Blanco con disco solar carmesí)
    ja: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#ffffff"/>
      <circle cx="16" cy="12" r="6" fill="#bc002d"/>
    </svg>`,

        // Unión Africana / Kiswahili (Verde con silueta dorada de África y constelación de estrellas)
    sw: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#007a3d"/>
      <circle cx="16" cy="12" r="8" fill="#ffffff" opacity="0.2"/>
      <circle cx="16" cy="12" r="7.2" fill="none" stroke="#fcd116" stroke-width="0.5" stroke-dasharray="1 1"/>
      <path d="M14,7 Q16,6 18,7 Q19,8 19.5,9.5 Q20.5,10 20,11.5 Q19,13 18,14.5 Q17,16 16.5,18 Q15.5,17 15,15.5 Q14,14 13,13 Q12,12 12,10.5 Q12,9 13.5,8.5 Z" fill="#fcd116"/>
      <circle cx="16" cy="5" r="0.5" fill="#fcd116"/>
      <circle cx="19" cy="5.5" r="0.5" fill="#fcd116"/>
      <circle cx="22" cy="7.5" r="0.5" fill="#fcd116"/>
      <circle cx="23" cy="10.5" r="0.5" fill="#fcd116"/>
      <circle cx="23" cy="13.5" r="0.5" fill="#fcd116"/>
      <circle cx="22" cy="16.5" r="0.5" fill="#fcd116"/>
      <circle cx="19" cy="18.5" r="0.5" fill="#fcd116"/>
      <circle cx="16" cy="19" r="0.5" fill="#fcd116"/>
      <circle cx="13" cy="18.5" r="0.5" fill="#fcd116"/>
      <circle cx="10" cy="16.5" r="0.5" fill="#fcd116"/>
      <circle cx="9" cy="13.5" r="0.5" fill="#fcd116"/>
      <circle cx="9" cy="10.5" r="0.5" fill="#fcd116"/>
      <circle cx="10" cy="7.5" r="0.5" fill="#fcd116"/>
      <circle cx="13" cy="5.5" r="0.5" fill="#fcd116"/>
    </svg>`,

    // Pakistán / Urdu (Verde con franja blanca y creciente con estrella)
    ur: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#01411c"/>
      <rect width="8" height="24" fill="#ffffff"/>
      <circle cx="20" cy="12" r="5" fill="#ffffff"/>
      <circle cx="21.5" cy="11" r="4.5" fill="#01411c"/>
      <polygon points="21.5,9 22,10.5 23.5,10.5 22.2,11.5 22.7,13 21.5,12 20.3,13 20.8,11.5 19.5,10.5 21,10.5" fill="#ffffff"/>
    </svg>`,

    // Indonesia (Rojo y Blanco)
    id: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="12" fill="#e70011"/>
      <rect y="12" width="32" height="12" fill="#ffffff"/>
    </svg>`,

    // Bangladés / Bengalí (Verde oscuro con disco rojo)
    bn: `<svg viewBox="0 0 32 24" width="28" height="21" style="border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      <rect width="32" height="24" fill="#006a4e"/>
      <circle cx="14" cy="12" r="6" fill="#f42a41"/>
    </svg>`
  };

  return SVG_FLAGS[c] || `
    <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 21px; border-radius: 4px; background: linear-gradient(135deg, #6366f1, #38bdf8); color: #fff; font-size: 0.65rem; font-weight: 800; box-shadow: 0 1px 4px rgba(0,0,0,0.4); flex-shrink: 0;">
      ${c.toUpperCase()}
    </span>
  `;
}
