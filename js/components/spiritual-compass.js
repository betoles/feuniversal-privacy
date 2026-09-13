/**
 * BRÚJULA ESPIRITUAL UNIVERSAL (CERO PERMISOS)
 * FeUniversal - Faith & Prayers
 * 
 * Modos: Qibla (La Meca), Sol Naciente (Oriente) y Norte Armónico (Zen).
 * Estilos 3D Glassmorphism:
 * 1. Cristal Astrolabio (Oro & Cristal Puro)
 * 2. Kaaba Al-Mukarramah 3D (Rosa Islámica, Caligrafía Árabe & Cubo Sagrado)
 * 3. Mandala Surya 3D (Loto Védico de 16 Rayos & Sánscrito)
 * 4. Dharma Zen 3D (Rueda del Noble Sendero & Zafiro)
 */

import { SolarService } from "../services/solar-service.js";
import { StorageService } from "../services/storage-service.js";
import { renderIcon } from "./icons.js";
import { t } from "../data/i18n.js";
import { SacredDialog } from "./sacred-dialog.js";
import { MembershipComponent } from "./membership.js";

export class SpiritualCompassComponent {
  constructor() {
    this.container = null;
    this.currentMode = "qibla"; // "qibla" | "east" | "zen"
    this.currentHeading = 0;
    this.targetHeading = 0;
    this.currentSkin = "classic_celestial"; // "classic_celestial" | "islamic_qibla" | "vedic_surya" | "zen_dharma"
    this.orientationListener = null;
    this.hasSensor = false;
    this.isDesktopMode = false;
    this.isDragging = false;
    this.dragStartAngle = 0;
    this.dragStartHeading = 0;
    this.animFrameId = null;
    this.membership = new MembershipComponent();
  }

  ensureContainer() {
    let el = document.getElementById("modal-compass");
    if (!el) {
      el = document.createElement("div");
      el.id = "modal-compass";
      document.body.appendChild(el);
    }
    el.style.cssText = "display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); z-index: 6000; padding: 24px 12px 90px; align-items: flex-start; justify-content: center; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch;";
    this.container = el;
  }

  open() {
    this.ensureContainer();
    const prefs = StorageService.getPreferences();
    if (prefs.brujulaEstilo) {
      this.currentSkin = prefs.brujulaEstilo;
    }
    this.updateTargetHeading();
    this.render();
    this.container.style.display = "flex";
    if (this.container) this.container.scrollTop = 0;
    this.startListening();
    this.setupDesktopInteractions();
  }

  close() {
    this.stopListening();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.container) this.container.style.display = "none";
  }

  updateTargetHeading() {
    if (this.currentMode === "qibla") {
      this.targetHeading = SolarService.getQiblaBearing();
    } else if (this.currentMode === "east") {
      this.targetHeading = SolarService.getSunriseBearing();
    } else {
      this.targetHeading = SolarService.getZenNorthBearing();
    }
  }

  getTargetBeaconSVG() {
    let beaconContent = "";
    if (this.currentMode === "qibla") {
      beaconContent = `
        <!-- Marcador Sagrado Kaaba Al-Mukarramah -->
        <g filter="drop-shadow(0 0 8px rgba(251, 191, 36, 0.95))">
          <circle cx="120" cy="18" r="12" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
          <rect x="114" y="12" width="12" height="12" rx="1.5" fill="#1e293b" stroke="#f59e0b" stroke-width="0.8"/>
          <line x1="114" y1="15" x2="126" y2="15" stroke="#fef08a" stroke-width="1.2"/>
          <polygon points="120,4 124,10 116,10" fill="#fbbf24"/>
        </g>
      `;
    } else if (this.currentMode === "east") {
      beaconContent = `
        <!-- Marcador Sagrado Sol Naciente -->
        <g filter="drop-shadow(0 0 8px rgba(244, 63, 94, 0.95))">
          <circle cx="120" cy="18" r="12" fill="url(#roseGrad)" stroke="#fbbf24" stroke-width="2"/>
          <circle cx="120" cy="18" r="6" fill="#fef08a"/>
          <polygon points="120,4 124,10 116,10" fill="#f43f5e"/>
        </g>
      `;
    } else {
      beaconContent = `
        <!-- Marcador Sagrado Zen Norte Armónico -->
        <g filter="drop-shadow(0 0 8px rgba(56, 189, 248, 0.95))">
          <circle cx="120" cy="18" r="12" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="120" cy="18" r="5" fill="#ffffff"/>
          <polygon points="120,4 124,10 116,10" fill="#38bdf8"/>
        </g>
      `;
    }

    return `
      <!-- BEACON DE OBJETIVO SAGRADO ROTADO A TARGET HEADING -->
      <g id="compass-target-beacon" transform="rotate(${this.targetHeading} 120 120)">
        <line x1="120" y1="28" x2="120" y2="70" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.85"/>
        ${beaconContent}
      </g>
    `;
  }

  startListening() {
    let sensorReceived = false;

    this.orientationListener = (e) => {
      let heading = null;

      // 1. iOS Safari (webkitCompassHeading: 0-360 respecto al norte magnético)
      if (typeof e.webkitCompassHeading === "number" && !isNaN(e.webkitCompassHeading)) {
        heading = e.webkitCompassHeading;
      }
      // 2. Android Chrome / Standard Device Orientation Absolute
      else if (typeof e.alpha === "number" && !isNaN(e.alpha)) {
        heading = (360 - e.alpha + 360) % 360;
      }

      if (heading !== null) {
        this.currentHeading = Math.round(heading);
        this.hasSensor = true;
        sensorReceived = true;
        if (this.isDesktopMode) {
          this.isDesktopMode = false;
          this.updateSensorBadge();
        }
        this.updateCompassDisplay();
      }
    };

    // Intentar primero con evento absoluto (Android Chrome moderno)
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener("deviceorientationabsolute", this.orientationListener, true);
    }
    // Y registrar listener estándar para iOS y navegadores genéricos
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", this.orientationListener, true);
    }

    // Si después de 900ms no hay señal del giroscopio físico, activar modo interactivo para ratón/táctil/teclado
    setTimeout(() => {
      if (!sensorReceived) {
        this.isDesktopMode = true;
        this.updateSensorBadge();
      }
    }, 900);
  }

  stopListening() {
    if (this.orientationListener) {
      if ("ondeviceorientationabsolute" in window) {
        window.removeEventListener("deviceorientationabsolute", this.orientationListener, true);
      }
      window.removeEventListener("deviceorientation", this.orientationListener, true);
      this.orientationListener = null;
    }
  }

  setupDesktopInteractions() {
    const ring = document.getElementById("compass-glow-ring");
    if (!ring) return;

    const getAngleFromEvent = (e) => {
      const rect = ring.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rad = Math.atan2(clientY - centerY, clientX - centerX);
      return (rad * 180 / Math.PI + 360) % 360;
    };

    const startDrag = (e) => {
      this.isDragging = true;
      this.dragStartAngle = getAngleFromEvent(e);
      this.dragStartHeading = this.currentHeading;
      ring.style.cursor = "grabbing";
    };

    const onDrag = (e) => {
      if (!this.isDragging) return;
      if (e.cancelable) e.preventDefault();
      const currentAngle = getAngleFromEvent(e);
      const delta = currentAngle - this.dragStartAngle;
      this.currentHeading = Math.round((this.dragStartHeading + delta + 360) % 360);
      this.updateCompassDisplay();
    };

    const endDrag = () => {
      if (this.isDragging) {
        this.isDragging = false;
        ring.style.cursor = "grab";
      }
    };

    ring.style.cursor = "grab";
    ring.onmousedown = startDrag;
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);

    ring.ontouchstart = startDrag;
    ring.ontouchmove = onDrag;
    ring.ontouchend = endDrag;

    // Keyboard navigation (Arrow keys)
    window.onkeydown = (e) => {
      if (this.container && this.container.style.display !== "none") {
        if (e.key === "ArrowLeft") {
          this.currentHeading = (this.currentHeading - 5 + 360) % 360;
          this.updateCompassDisplay();
        } else if (e.key === "ArrowRight") {
          this.currentHeading = (this.currentHeading + 5) % 360;
          this.updateCompassDisplay();
        }
      }
    };
  }

  animateToHeading(target) {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const start = this.currentHeading;
    let diff = (target - start + 360) % 360;
    if (diff > 180) diff -= 360; // Shortest rotation path

    const startTime = performance.now();
    const duration = 900; // ms

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.currentHeading = Math.round((start + diff * ease + 360) % 360);
      this.updateCompassDisplay();

      if (progress < 1) {
        this.animFrameId = requestAnimationFrame(step);
      } else {
        this.animFrameId = null;
        if (navigator.vibrate) {
          try { navigator.vibrate([40, 30, 40]); } catch (e) {}
        }
      }
    };

    this.animFrameId = requestAnimationFrame(step);
  }

  updateSensorBadge() {
    const badge = document.getElementById("compass-sensor-badge");
    if (badge) {
      const prefs = StorageService.getPreferences();
      const lang = prefs.idioma || "es";
      if (this.isDesktopMode) {
        badge.innerHTML = `💻 <span style="color: var(--accent-gold); font-weight: 700;">${t("compass_desktop_mode", lang) || "Modo Escritorio Interactivo"}</span> · ${t("compass_desktop_hint", lang) || "Arrastra para rotar o pulsa Auto-Alinear"}`;
      } else {
        badge.innerHTML = `📱 <span style="color: var(--accent-cyan); font-weight: 700;">${t("compass_mobile_sensor", lang) || "Sensor Magnético Activo"}</span> · ${t("compass_mobile_hint", lang) || "Tiempo Real"}`;
      }
    }
  }

  updateCompassDisplay() {
    const dial = document.getElementById("compass-rose-dial");
    const headingText = document.getElementById("compass-heading-deg");
    const targetDiff = document.getElementById("compass-target-diff");
    const glowRing = document.getElementById("compass-glow-ring");

    if (dial) {
      dial.style.transform = `rotate(-${this.currentHeading}deg)`;
    }
    if (headingText) {
      headingText.innerText = `${this.currentHeading}°`;
    }

    let diff = (this.targetHeading - this.currentHeading + 360) % 360;
    if (diff > 180) diff -= 360; // -180 a +180

    const isAligned = Math.abs(diff) <= 4;

    if (targetDiff) {
      const prefs = StorageService.getPreferences();
      const lang = prefs.idioma || "es";

      if (isAligned) {
        targetDiff.innerHTML = `<span style="color: var(--accent-gold); font-weight: 800; text-shadow: 0 0 10px rgba(251,191,36,0.6);">✨ ¡Alineación Sagrada Perfecta! (${this.targetHeading}°)</span>`;
      } else if (diff > 0) {
        targetDiff.innerHTML = `👉 <strong style="color: var(--accent-gold);">Gira a la derecha ${Math.round(diff)}°</strong> · Objetivo: ${this.targetHeading}°`;
      } else {
        targetDiff.innerHTML = `👈 <strong style="color: var(--accent-cyan);">Gira a la izquierda ${Math.round(Math.abs(diff))}°</strong> · Objetivo: ${this.targetHeading}°`;
      }
    }

    if (glowRing) {
      glowRing.style.boxShadow = isAligned 
        ? "0 0 35px rgba(251, 191, 36, 0.85), inset 0 0 25px rgba(251, 191, 36, 0.55)" 
        : "var(--glass-shadow-crystal)";
    }
  }

  getSkinSVG(skinKey) {
    switch (skinKey) {
      case "islamic_qibla":
        return `
          <!-- ESTILO 2: ROSA SAGRADA ISLÁMICA KAABA 3D (CALIGRAFÍA & CUBO SAGRADO) -->
          <defs>
            <radialGradient id="qiblaRingGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(16, 185, 129, 0.15)"/>
              <stop offset="85%" stop-color="rgba(16, 185, 129, 0.05)"/>
              <stop offset="100%" stop-color="rgba(245, 158, 11, 0.3)"/>
            </radialGradient>
            <linearGradient id="kaabaGoldHizam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#d97706"/>
              <stop offset="100%" stop-color="#fef08a"/>
            </linearGradient>
          </defs>

          <!-- Aro Exterior con Graduación Esmeralda y Oro -->
          <circle cx="120" cy="120" r="112" fill="url(#qiblaRingGrad)" stroke="url(#goldGrad)" stroke-width="2.5"/>
          <circle cx="120" cy="120" r="102" fill="none" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
          <circle cx="120" cy="120" r="88" fill="none" stroke="rgba(16,185,129,0.4)" stroke-dasharray="2 3" stroke-width="1.2"/>

          <!-- 36 Ticks de Grados Litúrgicos -->
          <g stroke="rgba(251,191,36,0.5)" stroke-width="1">
            ${Array.from({length: 24}).map((_, i) => `<line x1="120" y1="10" x2="120" y2="${i % 2 === 0 ? "16" : "13"}" transform="rotate(${i * 15} 120 120)" />`).join("")}
          </g>

          <!-- Estrella de 8 Puntas Facetada Clásica (Nautical & Liturgical Star) -->
          <!-- Puntas Principales Norte / Sur / Este / Oeste -->
          <polygon points="120,20 125,120 120,120" fill="#fbbf24"/>
          <polygon points="120,20 115,120 120,120" fill="#b45309"/>
          
          <polygon points="120,220 125,120 120,120" fill="#94a3b8"/>
          <polygon points="120,220 115,120 120,120" fill="#475569"/>

          <polygon points="220,120 120,125 120,120" fill="#fbbf24"/>
          <polygon points="220,120 120,115 120,120" fill="#b45309"/>

          <polygon points="20,120 120,125 120,120" fill="#fbbf24"/>
          <polygon points="20,120 120,115 120,120" fill="#b45309"/>

          <!-- Puntas Intermedias (NE, NW, SE, SW) -->
          <polygon points="190,50 120,120 123,117" fill="#10b981" fill-opacity="0.8"/>
          <polygon points="50,50 120,120 117,117" fill="#047857" fill-opacity="0.8"/>
          <polygon points="190,190 120,120 123,123" fill="#10b981" fill-opacity="0.8"/>
          <polygon points="50,190 120,120 117,123" fill="#047857" fill-opacity="0.8"/>

          <!-- Caligrafía Sagrada Árabe Vocalizada (8 Rumbos) -->
          <text x="120" y="32" font-size="13" font-weight="900" fill="#fbbf24" text-anchor="middle" font-family="serif">شَمَال</text>
          <text x="120" y="44" font-size="9" font-weight="800" fill="#fef08a" text-anchor="middle">N</text>

          <text x="210" y="118" font-size="11" font-weight="800" fill="var(--text-primary)" text-anchor="middle" font-family="serif">شَرْق</text>
          <text x="210" y="128" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">E</text>

          <text x="120" y="210" font-size="11" font-weight="800" fill="var(--text-muted)" text-anchor="middle" font-family="serif">جَنُوب</text>
          <text x="120" y="219" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">S</text>

          <text x="30" y="118" font-size="11" font-weight="800" fill="var(--text-primary)" text-anchor="middle" font-family="serif">غَرْب</text>
          <text x="30" y="128" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">W</text>

          <!-- Caligrafía Intermedia -->
          <text x="175" y="65" font-size="8" fill="#10b981" font-weight="700" text-anchor="middle">ش.ش</text>
          <text x="65" y="65" font-size="8" fill="#10b981" font-weight="700" text-anchor="middle">ش.غ</text>
          <text x="175" y="180" font-size="8" fill="#10b981" font-weight="700" text-anchor="middle">ج.ش</text>
          <text x="65" y="180" font-size="8" fill="#10b981" font-weight="700" text-anchor="middle">ج.غ</text>

          <!-- CUBO SAGRADO 3D DE LA KAABA EN EL CENTRO -->
          <g transform="translate(103, 103)">
            <!-- Cara Superior (Techo) -->
            <polygon points="17,3 31,10 17,17 3,10" fill="#1e293b" stroke="#0f172a" stroke-width="0.8"/>
            <!-- Cara Izquierda -->
            <polygon points="3,10 17,17 17,31 3,24" fill="#0f172a"/>
            <!-- Cara Derecha -->
            <polygon points="17,17 31,10 31,24 17,31" fill="#020617"/>
            <!-- Hizam Dorado (Cinturón Kiswah) -->
            <polygon points="3,13 17,20 17,22 3,15" fill="url(#kaabaGoldHizam)"/>
            <polygon points="17,20 31,13 31,15 17,22" fill="url(#kaabaGoldHizam)"/>
            <!-- Puerta de Oro de la Kaaba (Bab at-Tawbah) -->
            <rect x="21" y="16" width="3.5" height="6.5" rx="0.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.4"/>
          </g>

          <!-- Marcador Dinámico de Rumbo Sagrado (Target Beacon) -->
          ${this.getTargetBeaconSVG()}

          <!-- Aguja Litúrgica Norte / Sur -->
          <polygon points="120,18 126,104 120,96 114,104" fill="url(#goldGrad)" filter="drop-shadow(0 0 8px rgba(251,191,36,0.9))"/>
          <polygon points="120,222 125,136 120,144 115,136" fill="rgba(16,185,129,0.5)"/>
        `;

      case "vedic_surya":
        return `
          <!-- ESTILO 3: ASTROLABIO VÉDICO SURYA 3D (LOTO SOLAR & SÁNSCRITO) -->
          <defs>
            <radialGradient id="suryaSunAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(244, 63, 94, 0.25)"/>
              <stop offset="60%" stop-color="rgba(251, 191, 36, 0.15)"/>
              <stop offset="100%" stop-color="rgba(217, 119, 6, 0.35)"/>
            </radialGradient>
          </defs>

          <!-- Aro Biselado en Oro y Rubí -->
          <circle cx="120" cy="120" r="112" fill="url(#suryaSunAura)" stroke="url(#roseGrad)" stroke-width="2.5"/>
          <circle cx="120" cy="120" r="102" fill="none" stroke="url(#goldGrad)" stroke-width="1.2"/>
          <circle cx="120" cy="120" r="86" fill="none" stroke="rgba(244,63,94,0.3)" stroke-dasharray="3 3"/>

          <!-- 16 Rayos Solares Védicos del Mandala -->
          <g stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.7">
            ${Array.from({length: 16}).map((_, i) => `<line x1="120" y1="20" x2="120" y2="34" transform="rotate(${i * 22.5} 120 120)" />`).join("")}
          </g>

          <!-- Flor de Loto Solar Central (12 Pétalos) -->
          <g transform="translate(120, 120)">
            ${Array.from({length: 8}).map((_, i) => `
              <path d="M0 0 C-8 -25, -15 -45, 0 -60 C15 -45, 8 -25, 0 0" fill="url(#roseGrad)" fill-opacity="0.35" stroke="rgba(251,191,36,0.6)" stroke-width="1" transform="rotate(${i * 45})" />
            `).join("")}
          </g>

          <!-- Rumbos Cardinales en Sánscrito Clásico -->
          <text x="120" y="32" font-size="13" font-weight="900" fill="#f43f5e" text-anchor="middle" font-family="serif">उत्तर</text>
          <text x="120" y="44" font-size="9" font-weight="800" fill="#fbbf24" text-anchor="middle">N</text>

          <text x="210" y="118" font-size="12" font-weight="800" fill="var(--text-primary)" text-anchor="middle" font-family="serif">पूर्व</text>
          <text x="210" y="128" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">E</text>

          <text x="120" y="210" font-size="12" font-weight="800" fill="var(--text-muted)" text-anchor="middle" font-family="serif">दक्षिण</text>
          <text x="120" y="219" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">S</text>

          <text x="30" y="118" font-size="12" font-weight="800" fill="var(--text-primary)" text-anchor="middle" font-family="serif">पश्चिम</text>
          <text x="30" y="128" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">W</text>

          <!-- Símbolo Sagrado OM Radiante en el Eje -->
          <circle cx="120" cy="120" r="18" fill="url(#goldGrad)" stroke="#ffffff" stroke-width="1.5" filter="drop-shadow(0 0 10px rgba(251,191,36,0.8))"/>
          <text x="120" y="126" font-size="14" font-weight="900" fill="#881337" text-anchor="middle">ॐ</text>

          <!-- Marcador Dinámico de Rumbo Sagrado (Target Beacon) -->
          ${this.getTargetBeaconSVG()}

          <!-- Aguja Solar Radiante Rubí / Fuego -->
          <polygon points="120,16 127,100 120,94 113,100" fill="url(#roseGrad)" filter="drop-shadow(0 0 8px rgba(244,63,94,0.9))"/>
          <polygon points="120,224 126,140 120,146 114,140" fill="rgba(251,191,36,0.4)"/>
        `;

      case "zen_dharma":
        return `
          <!-- ESTILO 4: RUEDA DEL DHARMA ZEN 3D (BRONCE, ZAFIRO & 8 RADIOS) -->
          <defs>
            <radialGradient id="zenAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(56, 189, 248, 0.2)"/>
              <stop offset="70%" stop-color="rgba(99, 102, 241, 0.1)"/>
              <stop offset="100%" stop-color="rgba(2, 132, 199, 0.35)"/>
            </radialGradient>
          </defs>

          <!-- Aro Biselado en Zafiro y Titanio -->
          <circle cx="120" cy="120" r="112" fill="url(#zenAura)" stroke="url(#cyanGrad)" stroke-width="2.5"/>
          <circle cx="120" cy="120" r="98" fill="none" stroke="rgba(56,189,248,0.5)" stroke-width="1.5"/>
          <circle cx="120" cy="120" r="82" fill="none" stroke="rgba(255,255,255,0.15)" stroke-dasharray="2 4"/>

          <!-- 8 Radios Sagrados del Dharmachakra (Noble Sendero Óctuple) -->
          <g stroke="url(#cyanGrad)" stroke-width="2.2" stroke-linecap="round">
            <line x1="120" y1="26" x2="120" y2="214"/>
            <line x1="26" y1="120" x2="214" y2="120"/>
            <line x1="54" y1="54" x2="186" y2="186"/>
            <line x1="54" y1="186" x2="186" y2="54"/>
          </g>

          <!-- Aros de Concentración Zen -->
          <circle cx="120" cy="120" r="50" fill="none" stroke="rgba(56,189,248,0.4)" stroke-width="1.2"/>
          <circle cx="120" cy="120" r="30" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>

          <!-- Rumbos en Kanji / Tipografía Zen -->
          <text x="120" y="32" font-size="14" font-weight="900" fill="#38bdf8" text-anchor="middle">北</text>
          <text x="120" y="43" font-size="9" font-weight="800" fill="#bae6fd" text-anchor="middle">N</text>

          <text x="210" y="118" font-size="13" font-weight="800" fill="var(--text-primary)" text-anchor="middle">東</text>
          <text x="210" y="128" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">E</text>

          <text x="120" y="210" font-size="13" font-weight="800" fill="var(--text-muted)" text-anchor="middle">南</text>
          <text x="120" y="219" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">S</text>

          <text x="30" y="118" font-size="13" font-weight="800" fill="var(--text-primary)" text-anchor="middle">西</text>
          <text x="30" y="128" font-size="8" font-weight="700" fill="var(--text-muted)" text-anchor="middle">W</text>

          <!-- Núcleo Central de Zafiro y Espiral Zen -->
          <circle cx="120" cy="120" r="14" fill="#0284c7" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 0 10px rgba(56,189,248,0.8))"/>
          <circle cx="120" cy="120" r="6" fill="#ffffff"/>

          <!-- Marcador Dinámico de Rumbo Sagrado (Target Beacon) -->
          ${this.getTargetBeaconSVG()}

          <!-- Aguja de Zafiro Celestial -->
          <polygon points="120,18 126,104 120,96 114,104" fill="url(#cyanGrad)" filter="drop-shadow(0 0 8px rgba(56,189,248,0.9))"/>
          <polygon points="120,222 125,136 120,144 115,136" fill="rgba(99,102,241,0.4)"/>
        `;

      default: // classic_celestial
        return `
          <!-- ESTILO 1: CRISTAL ASTROLABIO CELESTIAL (ORO & CRISTAL PURO) -->
          <defs>
            <radialGradient id="celestialGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(251, 191, 36, 0.12)"/>
              <stop offset="80%" stop-color="rgba(255, 255, 255, 0.05)"/>
              <stop offset="100%" stop-color="rgba(245, 158, 11, 0.25)"/>
            </radialGradient>
          </defs>

          <!-- Aro Biselado en Oro Clásico de Relojería Suiza -->
          <circle cx="120" cy="120" r="112" fill="url(#celestialGrad)" stroke="url(#goldGrad)" stroke-width="2.5"/>
          <circle cx="120" cy="120" r="102" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="1.2"/>
          <circle cx="120" cy="120" r="88" fill="none" stroke="rgba(255,255,255,0.2)" stroke-dasharray="2 4"/>

          <!-- Graduación Fina de 360 Grados (Ticks de Precisión) -->
          <g stroke="rgba(251,191,36,0.6)" stroke-width="1">
            ${Array.from({length: 36}).map((_, i) => `<line x1="120" y1="10" x2="120" y2="${i % 3 === 0 ? "17" : "13"}" transform="rotate(${i * 10} 120 120)" />`).join("")}
          </g>

          <!-- Rosa de los Vientos de 8 Puntas Facetadas en Oro Pulido -->
          <polygon points="120,22 126,120 120,120" fill="#f59e0b"/>
          <polygon points="120,22 114,120 120,120" fill="#b45309"/>
          
          <polygon points="120,218 126,120 120,120" fill="#94a3b8"/>
          <polygon points="120,218 114,120 120,120" fill="#475569"/>

          <polygon points="218,120 120,126 120,120" fill="#f59e0b"/>
          <polygon points="218,120 120,114 120,120" fill="#b45309"/>

          <polygon points="22,120 120,126 120,120" fill="#f59e0b"/>
          <polygon points="22,120 120,114 120,120" fill="#b45309"/>

          <!-- Rumbos Cardinales Vintage -->
          <text x="120" y="34" font-size="15" font-weight="900" fill="#ef4444" text-anchor="middle" font-family="serif">N</text>
          <text x="210" y="125" font-size="13" font-weight="800" fill="var(--text-primary)" text-anchor="middle" font-family="serif">E</text>
          <text x="120" y="214" font-size="13" font-weight="800" fill="var(--text-muted)" text-anchor="middle" font-family="serif">S</text>
          <text x="30" y="125" font-size="13" font-weight="800" fill="var(--text-primary)" text-anchor="middle" font-family="serif">W</text>

          <!-- Marcador Dinámico de Rumbo Sagrado (Target Beacon) -->
          ${this.getTargetBeaconSVG()}

          <!-- Aguja Facetada Clásica de Precisión -->
          <polygon points="120,20 126,110 120,102 114,110" fill="#ef4444" filter="drop-shadow(0 0 6px rgba(239,68,68,0.7))"/>
          <polygon points="120,220 126,130 120,138 114,130" fill="rgba(148,163,184,0.6)"/>
          <circle cx="120" cy="120" r="9" fill="#fbbf24" stroke="#ffffff" stroke-width="2" filter="drop-shadow(0 0 6px rgba(251,191,36,0.6))"/>
        `;
    }
  }

  render() {
    const prefs = StorageService.getPreferences();
    const lang = prefs.idioma || "es";
    const sunTimes = SolarService.getSunTimes();
    const isProUnlocked = StorageService.isFeatureUnlocked("custom_compass");

    this.container.innerHTML = `
      <div class="crystal-card" style="width: 100%; max-width: 440px; margin: auto 0; padding: 20px 16px; border-radius: var(--radius-lg); background: var(--glass-surface-2); border: 1.5px solid var(--glass-border); position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; box-sizing: border-box;">
        
        <!-- Botón Cerrar Ergonómico -->
        <button id="btn-close-compass" class="btn-modal-close" title="Cerrar">
          ${renderIcon("ui_close")}
        </button>

        <!-- Header con Espaciado Seguro (Cero Colisiones) -->
        <div style="text-align: center; margin-bottom: 14px; width: 100%; padding-right: 48px; padding-left: 6px; box-sizing: border-box;">
          <div style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.84rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
            <span style="width: 18px; height: 18px; display: inline-flex;">${renderIcon("ui_compass")}</span>
            <span>${t("compass_title", lang) || "Brújula Espiritual"}</span>
          </div>
          <div style="font-size: 0.74rem; font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; line-height: 1.4;">
            <span style="display: inline-flex; align-items: center; gap: 3px; color: var(--text-primary); font-weight: 700;">
              <span style="color: var(--accent-gold);">📍</span> ${sunTimes.cityName}
            </span>
            <span style="color: var(--text-muted); opacity: 0.6;">·</span>
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <span style="color: var(--accent-gold); font-weight: 800;">${t("compass_dawn", lang) || "Alba"}:</span>
              <strong style="color: var(--text-primary); font-weight: 800;">${sunTimes.sunrise}</strong>
            </span>
            <span style="color: var(--text-muted); opacity: 0.6;">·</span>
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <span style="color: var(--accent-rose); font-weight: 800;">${t("compass_dusk", lang) || "Ocaso"}:</span>
              <strong style="color: var(--text-primary); font-weight: 800;">${sunTimes.sunset}</strong>
            </span>
          </div>
        </div>

        <!-- Selector de Modos de Orientación -->
        <div class="crystal-segmented-control" style="width: 100%; margin-bottom: 14px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; box-sizing: border-box; padding: 4px;">
          <button type="button" class="segmented-item ${this.currentMode === "qibla" ? "active" : ""}" data-compass-mode="qibla" style="font-size: 0.72rem; padding: 6px 4px; min-height: 38px; min-width: 0; width: 100%; gap: 4px;">
            <span style="width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--accent-gold);">${renderIcon("trad_islam")}</span>
            <span style="display: inline-block; min-width: 0; max-width: calc(100% - 18px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700;">${t("compass_mode_qibla", lang) || "Qibla"}</span>
          </button>
          <button type="button" class="segmented-item ${this.currentMode === "east" ? "active" : ""}" data-compass-mode="east" style="font-size: 0.72rem; padding: 6px 4px; min-height: 38px; min-width: 0; width: 100%; gap: 4px;">
            <span style="width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--accent-rose);">${renderIcon("ui_sunrise_sunset")}</span>
            <span style="display: inline-block; min-width: 0; max-width: calc(100% - 18px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700;">${t("compass_mode_east", lang) || "Oriente"}</span>
          </button>
          <button type="button" class="segmented-item ${this.currentMode === "zen" ? "active" : ""}" data-compass-mode="zen" style="font-size: 0.72rem; padding: 6px 4px; min-height: 38px; min-width: 0; width: 100%; gap: 4px;">
            <span style="width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--accent-cyan);">${renderIcon("trad_budismo")}</span>
            <span style="display: inline-block; min-width: 0; max-width: calc(100% - 18px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700;">${t("compass_mode_zen", lang) || "Zen"}</span>
          </button>
        </div>

        <!-- Disco Principal 3D Glassmorphism -->
        <div id="compass-glow-ring" style="width: 240px; height: 240px; border-radius: 50%; background: var(--glass-surface-1); border: 2.5px solid var(--glass-border); position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; box-shadow: var(--glass-shadow-crystal); transition: box-shadow 0.3s ease;">
          
          <!-- Rosa de los Vientos Giratoria Dinámica -->
          <svg id="compass-rose-dial" viewBox="0 0 240 240" style="width: 224px; height: 224px; transition: transform 0.15s ease-out;">
            ${this.getSkinSVG(this.currentSkin)}
          </svg>

          <!-- Marcador de Objetivo Sagrado (Fijo Exterior) -->
          <div style="position: absolute; top: 4px; width: 14px; height: 14px; border-radius: 50%; background: #fbbf24; border: 2px solid #ffffff; box-shadow: 0 0 14px #fbbf24;"></div>
        </div>

        <!-- Grados Actuales y Desvío -->
        <div style="text-align: center; margin-bottom: 12px;">
          <div id="compass-heading-deg" style="font-size: 1.7rem; font-weight: 900; color: var(--text-primary); font-family: var(--font-title); line-height: 1;">
            ${this.currentHeading}°
          </div>
          <div id="compass-target-diff" style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); margin-top: 4px;">
            ${t("compass_target", lang) || "Objetivo"}: ${this.targetHeading}°
          </div>
        </div>

        <!-- Selector de Estilos Místicos 3D (Gratis y PRO) -->
        <div style="width: 100%; border-top: 1px solid var(--glass-border); padding-top: 12px; margin-bottom: 10px;">
          <div style="font-size: 0.70rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; text-align: center;">
            ${t("compass_skins_title", lang) || "3D COMPASS STYLE & MYSTIC RELIEF"}
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 100%;">
            
            <button class="btn-crystal btn-compass-skin ${this.currentSkin === "classic_celestial" ? "active-glow-gold" : ""}" data-skin-id="classic_celestial" style="padding: 10px 4px; min-height: 56px; font-size: 0.72rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: var(--radius-sm); cursor: pointer;">
              <span style="width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; color: var(--accent-cyan);">${renderIcon("skin_crystal")}</span>
              <span style="font-weight: 700;">${t("compass_skin_crystal", lang) || "Crystal"}</span>
            </button>

            <button class="btn-crystal btn-compass-skin ${this.currentSkin === "islamic_qibla" ? "active-glow-gold" : ""}" data-skin-id="islamic_qibla" style="padding: 10px 4px; min-height: 56px; font-size: 0.72rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: var(--radius-sm); position: relative; cursor: pointer;">
              <span style="position: absolute; top: -5px; right: -3px; font-size: 0.55rem; background: var(--accent-gold); color: #000; font-weight: 900; padding: 1px 4px; border-radius: 4px; box-shadow: 0 0 6px rgba(245,158,11,0.5);">PRO</span>
              <span style="width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; color: var(--accent-gold);">${renderIcon("skin_kaaba")}</span>
              <span style="font-weight: 700;">${t("compass_skin_kaaba", lang) || "Kaaba"}</span>
            </button>

            <button class="btn-crystal btn-compass-skin ${this.currentSkin === "vedic_surya" ? "active-glow-gold" : ""}" data-skin-id="vedic_surya" style="padding: 10px 4px; min-height: 56px; font-size: 0.72rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: var(--radius-sm); position: relative; cursor: pointer;">
              <span style="position: absolute; top: -5px; right: -3px; font-size: 0.55rem; background: var(--accent-gold); color: #000; font-weight: 900; padding: 1px 4px; border-radius: 4px; box-shadow: 0 0 6px rgba(245,158,11,0.5);">PRO</span>
              <span style="width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; color: var(--accent-rose);">${renderIcon("skin_surya")}</span>
              <span style="font-weight: 700;">${t("compass_skin_surya", lang) || "Surya"}</span>
            </button>

            <button class="btn-crystal btn-compass-skin ${this.currentSkin === "zen_dharma" ? "active-glow-gold" : ""}" data-skin-id="zen_dharma" style="padding: 10px 4px; min-height: 56px; font-size: 0.72rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: var(--radius-sm); position: relative; cursor: pointer;">
              <span style="position: absolute; top: -5px; right: -3px; font-size: 0.55rem; background: var(--accent-gold); color: #000; font-weight: 900; padding: 1px 4px; border-radius: 4px; box-shadow: 0 0 6px rgba(245,158,11,0.5);">PRO</span>
              <span style="width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; color: var(--accent-cyan);">${renderIcon("skin_dharma")}</span>
              <span style="font-weight: 700;">${t("compass_skin_dharma", lang) || "Dharma"}</span>
            </button>

          </div>
        </div>

        <!-- Barra de Estado de Sensores / Modo Escritorio -->
        <div id="compass-sensor-badge" style="margin-bottom: 12px; font-size: 0.72rem; color: var(--text-secondary); text-align: center; background: rgba(0,0,0,0.35); padding: 6px 12px; border-radius: var(--radius-full); border: 1px solid var(--glass-border); width: 100%; box-sizing: border-box;">
          ${this.isDesktopMode 
            ? `💻 <span style="color: var(--accent-gold); font-weight: 700;">${t("compass_desktop_mode", lang) || "Modo Escritorio Interactivo"}</span> · ${t("compass_desktop_hint", lang) || "Arrastra para rotar o pulsa Auto-Alinear"}`
            : `📱 <span style="color: var(--accent-cyan); font-weight: 700;">${t("compass_mobile_sensor", lang) || "Sensor Magnético Activo"}</span> · ${t("compass_mobile_hint", lang) || "Tiempo Real"}`}
        </div>

        <!-- Botones de Acción: Auto-Alineación y Calibración -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; box-sizing: border-box;">
          <button id="btn-auto-align-compass" class="btn-crystal btn-crystal-gold" style="font-size: 0.74rem; font-weight: 800; padding: 10px 8px; border-radius: var(--radius-sm); display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;">
            <span style="width: 15px; height: 15px; display: inline-flex; color: var(--accent-gold);">${renderIcon("ui_sparkles")}</span>
            <span>${t("compass_auto_align", lang) || "Auto-Alinear"} (${this.targetHeading}°)</span>
          </button>

          <button id="btn-calibrate-sensors" class="btn-crystal" style="font-size: 0.72rem; color: var(--text-secondary); text-align: center; padding: 10px 8px; background: var(--glass-surface-1); border-radius: var(--radius-sm); border: 1.5px solid var(--glass-border); display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all var(--transition-fast);">
            <span id="calibrate-icon-box" style="width: 15px; height: 15px; display: inline-flex; color: var(--accent-cyan); flex-shrink: 0;">${renderIcon("ui_device_calibrate")}</span>
            <span id="calibrate-text-label">${t("compass_calibrate_hint", lang) || "Calibrar"}</span>
          </button>
        </div>

      </div>
    `;

    // Eventos de Cierre
    const closeBtn = document.getElementById("btn-close-compass");
    if (closeBtn) closeBtn.onclick = () => this.close();

    // Eventos de Selector de Modos
    this.container.querySelectorAll("[data-compass-mode]").forEach((btn) => {
      btn.onclick = () => {
        this.currentMode = btn.getAttribute("data-compass-mode");
        this.updateTargetHeading();
        this.render();
      };
    });

    // Evento Auto-Alinear
    const autoAlignBtn = document.getElementById("btn-auto-align-compass");
    if (autoAlignBtn) {
      autoAlignBtn.onclick = () => {
        this.animateToHeading(this.targetHeading);
      };
    }

    // Eventos de Selector de Estilos 3D (Gratis y PRO)
    this.container.querySelectorAll(".btn-compass-skin").forEach((btn) => {
      btn.onclick = () => {
        const skinId = btn.getAttribute("data-skin-id");
        if (skinId !== "classic_celestial" && !StorageService.isFeatureUnlocked("custom_compass")) {
          // Bloqueo exclusivo PRO / Membresía
          this.membership.open();
          return;
        }

        this.currentSkin = skinId;
        const prefs = StorageService.getPreferences();
        prefs.brujulaEstilo = skinId;
        StorageService.savePreferences(prefs);
        this.render();
      };
    });

    // Evento de Calibración Interactiva y Permisos iOS
    const calibrateBtn = document.getElementById("btn-calibrate-sensors");
    if (calibrateBtn) {
      calibrateBtn.onclick = async () => {
        const label = document.getElementById("calibrate-text-label");
        const glowRing = document.getElementById("compass-glow-ring");

        // Solicitar permisos de sensor en iOS Safari
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
          try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") {
              this.startListening();
            }
          } catch (err) {
            console.warn("DeviceOrientation permission:", err);
          }
        }

        // Haptic feedback
        if (navigator.vibrate) {
          try { navigator.vibrate([30, 40, 30]); } catch (e) {}
        }

        // Animación visual de recalibración dorada
        if (glowRing) {
          glowRing.style.boxShadow = "0 0 40px rgba(251, 191, 36, 0.95), inset 0 0 25px rgba(251, 191, 36, 0.7)";
          glowRing.style.transform = "scale(1.03)";
          setTimeout(() => {
            glowRing.style.transform = "scale(1)";
            this.updateCompassDisplay();
          }, 600);
        }

        if (label) {
          const calMsg = t('compass_calibrated_msg', lang) || '✨ ¡Calibrado!';
          label.innerHTML = `<strong style="color: var(--accent-gold);">${calMsg}</strong>`;
        }

        setTimeout(() => {
          if (label) {
            label.innerHTML = t("compass_calibrate_hint", lang) || "Calibrar";
          }
        }, 2800);
      };
    }
  }
}

