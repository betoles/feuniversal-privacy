/**
 * SOUND SERVICE - PAISAJES SONOROS SINTÉTICOS Y LECTOR LITÚRGICO
 * FeUniversal - Faith & Prayers
 * 
 * Genera ambientes de audio procedimentales (sin necesidad de descargar archivos externos)
 * con la Web Audio API y síntesis de voz (TTS).
 */

export class SoundService {
  constructor() {
    this.audioCtx = null;
    this.currentAmbient = null;
    this.ambientGain = null;
    this.ambientTimer = null;
    this.activeTimers = [];
    this.isPlaying = false;
    this.currentSoundType = 'silencio_profundo';
    this.isTTSPlaying = false;
    this.isTTSPaused = false;
    this.currentUtterance = null;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
          this.ambientGain = this.audioCtx.createGain();
          this.ambientGain.gain.setValueAtTime(0.80, this.audioCtx.currentTime);
          this.ambientGain.connect(this.audioCtx.destination);
        }
      } catch (e) {
        console.warn('AudioContext no soportado o bloqueado:', e);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  registerTimer(timer) {
    if (timer) this.activeTimers.push(timer);
    return timer;
  }

  clearAllTimers() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
    if (this.activeTimers && this.activeTimers.length > 0) {
      this.activeTimers.forEach(t => {
        try { clearInterval(t); clearTimeout(t); } catch (e) {}
      });
      this.activeTimers = [];
    }
  }

  // Reproducir Paisaje Sonoro Musical en 3 Capas
  playAmbient(type = 'solfeggio_528') {
    this.stopAmbient();
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    this.currentSoundType = type;
    this.isPlaying = true;

    if (type === 'silencio_profundo') {
      return;
    }

    switch (type) {
      // --- A. ONDAS CEREBRALES BINAURALES CON ARMONÍA MUSICAL ---
      case 'ondas_theta':
        // Santuario Cósmico (216 Hz + 6 Hz Theta + Acorde 9na)
        this.startBinauralMusicalLandscape({
          carrierFreq: 216,
          beatFreq: 6,
          chordPitches: [108, 216, 324, 486],
          filterCutoff: 520,
          lfoRate: 0.12, // 8.3s respiración
          textureGain: 0.22
        });
        break;

      case 'ondas_alfa':
        // Paz Serena & Cuerdas de Cristal (240 Hz + 10 Hz Alfa + Acorde Lidio)
        this.startBinauralMusicalLandscape({
          carrierFreq: 240,
          beatFreq: 10,
          chordPitches: [120, 240, 360, 480],
          filterCutoff: 650,
          lfoRate: 0.15, // 6.6s respiración
          textureGain: 0.20
        });
        break;

      case 'ondas_gamma':
        // Despertar de Consciencia & Resonancia Solar (288 Hz + 40 Hz Gamma)
        this.startBinauralMusicalLandscape({
          carrierFreq: 288,
          beatFreq: 40,
          chordPitches: [144, 288, 432, 576],
          filterCutoff: 780,
          lfoRate: 0.20,
          textureGain: 0.18
        });
        break;

      case 'ondas_delta':
        // Manto de Noche & Sanación Celular (144 Hz + 2.5 Hz Delta)
        this.startBinauralMusicalLandscape({
          carrierFreq: 144,
          beatFreq: 2.5,
          chordPitches: [72, 144, 216, 288],
          filterCutoff: 380,
          lfoRate: 0.10, // 10s respiración profunda
          textureGain: 0.24
        });
        break;

      // --- B. FRECUENCIAS SAGRADAS SOLFEGGIO CINEMÁTICAS (ACORDES EVOLUTIVOS & ARPA CELESTIAL) ---
      case 'solfeggio_528':
      case 'frecuencia_528':
      case 'cuenco_tibetano':
      case 'cuencos_tibetanos':
        this.startCinematicSolfeggioLandscape({
          fundamentalFreq: 528,
          progressions: [
            [264, 528, 660, 792],
            [352, 528, 704, 880],
            [220, 440, 528, 660]
          ],
          harpScale: [528, 660, 792, 1056, 1320],
          vocalFormantFreq: 720,
          lfoSpeed: 0.10
        });
        break;

      case 'solfeggio_432':
      case 'frecuencia_432':
        this.startCinematicSolfeggioLandscape({
          fundamentalFreq: 432,
          progressions: [
            [216, 432, 540, 648],
            [288, 432, 576, 720],
            [324, 486, 648, 864]
          ],
          harpScale: [432, 540, 648, 864, 1080],
          vocalFormantFreq: 640,
          lfoSpeed: 0.11
        });
        break;

      case 'solfeggio_963':
      case 'frecuencia_963':
        this.startCinematicSolfeggioLandscape({
          fundamentalFreq: 963,
          progressions: [
            [321, 642, 963, 1284],
            [481.5, 722, 963, 1444],
            [361, 722, 963, 1083]
          ],
          harpScale: [963, 1284, 1444.5, 1926],
          vocalFormantFreq: 880,
          lfoSpeed: 0.09
        });
        break;

      // --- C. CÁNTICOS SAGRADOS & MANTRAS DE RESONANCIA ---
      case 'mantra_om':
        this.startMantraOM(); // 108Hz AUM Védico con filtro formante
        break;

      case 'canto_ram':
        this.startCantoRAM(); // 144Hz Semilla Solar RAM
        break;

      // --- D. AMBIENTES TRADICIONALES & INSTRUMENTOS SAGRADOS ---
      case 'canto_gregoriano':
        this.startCantoGregoriano();
        break;

      case 'flauta_shakuhachi_zen':
      case 'shakuhachi_zen':
        this.startFlautaShakuhachi();
        break;

      case 'shofar_mistico':
        this.startShofarMistico();
        break;

      case 'fuego_copal':
        this.startFuegoCopal();
        break;

      case 'campanas_monasterio':
      case 'campanas_catedral':
        this.startMonasteryBells();
        break;

      case 'lluvia_zen':
      case 'viento_monte':
        this.startZenRain();
        break;

      case 'tambores_bata_yoruba':
      case 'tambores_rituales':
        this.startTamboresBataYoruba();
        break;

      default:
        this.startSolfeggioLandscape(528, [264, 528, 792, 1056], 0.12);
        break;
    }
  }

  stopAmbient() {
    this.isPlaying = false;
    this.clearAllTimers();
    if (this.currentAmbient) {
      try {
        if (typeof this.currentAmbient.stop === 'function') this.currentAmbient.stop();
        if (typeof this.currentAmbient.disconnect === 'function') this.currentAmbient.disconnect();
      } catch (e) {
        console.warn('Error stopping ambient node:', e);
      }
      this.currentAmbient = null;
    }
  }

  // 1. Generador Musical de Ondas Binaurales en 3 Capas (Pad Armónico + Pulsos Estéreo + LFO Respiración)
  startBinauralMusicalLandscape({ carrierFreq, beatFreq, chordPitches, filterCutoff = 550, lfoRate = 0.125, textureGain = 0.70 }) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const nodesToStop = [];
    const nodesToDisconnect = [];

    // Nodo Maestro con Fade-In Suave
    const masterTrackGain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;
    masterTrackGain.gain.setValueAtTime(0.05, now);
    masterTrackGain.gain.linearRampToValueAtTime(textureGain, now + 0.8);
    masterTrackGain.connect(this.ambientGain);
    nodesToDisconnect.push(masterTrackGain);

    // --- CAPA 1: ARMONÍA MUSICAL & PAD CELESTIAL POLIFÓNICO ---
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.max(filterCutoff, 500), now);
    filter.Q.setValueAtTime(1.8, now);
    filter.connect(masterTrackGain);
    nodesToDisconnect.push(filter);

    // LFO de Respiración Consciente
    const lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(lfoRate, now);
    lfoGain.gain.setValueAtTime(filterCutoff * 0.35, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
    nodesToStop.push(lfo);
    nodesToDisconnect.push(lfo, lfoGain);

    // Acordes Celestiales Multicapa
    chordPitches.forEach((pitch, idx) => {
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const chordGain = this.audioCtx.createGain();

      osc1.type = idx === 0 ? 'triangle' : 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(pitch, now);
      osc2.frequency.setValueAtTime(pitch + (idx % 2 === 0 ? 0.35 : -0.35), now);

      const individualVol = 0.80 / chordPitches.length;
      chordGain.gain.setValueAtTime(individualVol, now);

      osc1.connect(chordGain);
      osc2.connect(chordGain);
      chordGain.connect(filter);

      osc1.start(now);
      osc2.start(now);

      nodesToStop.push(osc1, osc2);
      nodesToDisconnect.push(osc1, osc2, chordGain);
    });

    // --- CAPA 2: ONDAS BINAURALES ESTÉREO (L / R) ---
    const merger = this.audioCtx.createChannelMerger(2);
    const oscLeft = this.audioCtx.createOscillator();
    const oscRight = this.audioCtx.createOscillator();
    const binauralGain = this.audioCtx.createGain();

    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(carrierFreq, now);

    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(carrierFreq + beatFreq, now);

    binauralGain.gain.setValueAtTime(0.40, now);

    oscLeft.connect(merger, 0, 0);  // Canal Izquierdo
    oscRight.connect(merger, 0, 1); // Canal Derecho

    merger.connect(binauralGain);
    binauralGain.connect(masterTrackGain);

    oscLeft.start(now);
    oscRight.start(now);

    nodesToStop.push(oscLeft, oscRight);
    nodesToDisconnect.push(oscLeft, oscRight, merger, binauralGain);

    this.currentAmbient = {
      stop: () => {
        try {
          masterTrackGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
          setTimeout(() => {
            nodesToStop.forEach(node => {
              try { node.stop(); } catch (e) {}
            });
          }, 500);
        } catch (e) {}
      },
      disconnect: () => {
        setTimeout(() => {
          nodesToDisconnect.forEach(node => {
            try { node.disconnect(); } catch (e) {}
          });
        }, 550);
      }
    };
  }

  // 2. Generador Cinemático de Frecuencias Solfeggio (Acordes Evolutivos, Coro Celestial & Arpa)
  startCinematicSolfeggioLandscape({ fundamentalFreq, progressions, harpScale, vocalFormantFreq = 720, lfoSpeed = 0.10 }) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const nodesToStop = [];
    const nodesToDisconnect = [];

    const masterTrackGain = this.audioCtx.createGain();
    const now = this.audioCtx.currentTime;
    masterTrackGain.gain.setValueAtTime(0.05, now);
    masterTrackGain.gain.linearRampToValueAtTime(0.75, now + 0.8);
    masterTrackGain.connect(this.ambientGain);
    nodesToDisconnect.push(masterTrackGain);

    // --- CAPA A: CORO VOCAL FORMANT ---
    const choirFilter = this.audioCtx.createBiquadFilter();
    choirFilter.type = 'bandpass';
    choirFilter.frequency.setValueAtTime(vocalFormantFreq, now);
    choirFilter.Q.setValueAtTime(3.2, now);

    const choirGain = this.audioCtx.createGain();
    choirGain.gain.setValueAtTime(0.35, now);

    const choirOsc1 = this.audioCtx.createOscillator();
    const choirOsc2 = this.audioCtx.createOscillator();
    choirOsc1.type = 'sawtooth';
    choirOsc2.type = 'triangle';
    choirOsc1.frequency.setValueAtTime(fundamentalFreq / 2, now);
    choirOsc2.frequency.setValueAtTime((fundamentalFreq / 2) + 0.4, now);

    const choirLfo = this.audioCtx.createOscillator();
    const choirLfoGain = this.audioCtx.createGain();
    choirLfo.type = 'sine';
    choirLfo.frequency.setValueAtTime(4.2, now);
    choirLfoGain.gain.setValueAtTime(1.8, now);
    choirLfo.connect(choirLfoGain);
    choirLfoGain.connect(choirOsc1.frequency);
    choirLfoGain.connect(choirOsc2.frequency);
    choirLfo.start(now);

    choirOsc1.connect(choirFilter);
    choirOsc2.connect(choirFilter);
    choirFilter.connect(choirGain);
    choirGain.connect(masterTrackGain);

    choirOsc1.start(now);
    choirOsc2.start(now);

    nodesToStop.push(choirOsc1, choirOsc2, choirLfo);
    nodesToDisconnect.push(choirOsc1, choirOsc2, choirLfo, choirLfoGain, choirFilter, choirGain);

    // --- CAPA B: PADS POLIFÓNICOS ---
    const padFilter = this.audioCtx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(Math.max(fundamentalFreq * 1.6, 600), now);
    padFilter.Q.setValueAtTime(1.6, now);
    padFilter.connect(masterTrackGain);
    nodesToDisconnect.push(padFilter);

    const lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(lfoSpeed, now);
    lfoGain.gain.setValueAtTime(fundamentalFreq * 0.35, now);
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);
    lfo.start(now);
    nodesToStop.push(lfo);
    nodesToDisconnect.push(lfo, lfoGain);

    const padOscs = [];
    const currentChord = progressions[0];

    currentChord.forEach((pitch, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(pitch, now);

      gain.gain.setValueAtTime(0.70 / currentChord.length, now);

      osc.connect(gain);
      gain.connect(padFilter);
      osc.start(now);

      padOscs.push(osc);
      nodesToStop.push(osc);
      nodesToDisconnect.push(osc, gain);
    });

    let chordIdx = 0;
    const chordTimer = this.registerTimer(setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;
      chordIdx = (chordIdx + 1) % progressions.length;
      const nextChord = progressions[chordIdx];
      const curTime = this.audioCtx.currentTime;

      padOscs.forEach((osc, i) => {
        if (nextChord[i]) {
          osc.frequency.cancelScheduledValues(curTime);
          osc.frequency.setValueAtTime(osc.frequency.value, curTime);
          osc.frequency.exponentialRampToValueAtTime(nextChord[i], curTime + 3.5);
        }
      });
    }, 9500));

    // --- CAPA C: GOTAS DE ARPA DE CRISTAL ---
    const merger = this.audioCtx.createChannelMerger(2);
    merger.connect(masterTrackGain);
    nodesToDisconnect.push(merger);

    const playHarpDrop = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const curTime = this.audioCtx.currentTime;

      const randomPitch = harpScale[Math.floor(Math.random() * harpScale.length)];
      const isLeft = Math.random() > 0.5;

      const dropOsc = this.audioCtx.createOscillator();
      const dropHarmonic = this.audioCtx.createOscillator();
      const dropGain = this.audioCtx.createGain();

      dropOsc.type = 'sine';
      dropHarmonic.type = 'sine';

      dropOsc.frequency.setValueAtTime(randomPitch, curTime);
      dropHarmonic.frequency.setValueAtTime(randomPitch * 2.01, curTime);

      dropGain.gain.setValueAtTime(0.001, curTime);
      dropGain.gain.linearRampToValueAtTime(0.35, curTime + 0.015);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, curTime + 2.8);

      dropOsc.connect(dropGain);
      dropHarmonic.connect(dropGain);
      dropGain.connect(merger, 0, isLeft ? 0 : 1);

      dropOsc.start(curTime);
      dropHarmonic.start(curTime);
      dropOsc.stop(curTime + 2.9);
      dropHarmonic.stop(curTime + 2.9);
    };

    const harpTimer = this.registerTimer(setInterval(playHarpDrop, 3200));

    this.currentAmbient = {
      stop: () => {
        try {
          clearInterval(chordTimer);
          clearInterval(harpTimer);
          masterTrackGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
          setTimeout(() => {
            nodesToStop.forEach(n => { try { n.stop(); } catch (e) {} });
          }, 500);
        } catch (e) {}
      },
      disconnect: () => {
        setTimeout(() => {
          nodesToDisconnect.forEach(n => { try { n.disconnect(); } catch (e) {} });
        }, 550);
      }
    };
  }

  // 2. Canto Primordial AUM / OHMMM (108 Hz + Resonancia Védica)
  startMantraOM() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const oscBase = this.audioCtx.createOscillator();
    const oscHarmonic1 = this.audioCtx.createOscillator();
    const oscHarmonic2 = this.audioCtx.createOscillator();
    const lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    oscBase.type = 'sawtooth';
    oscBase.frequency.setValueAtTime(108, this.audioCtx.currentTime);

    oscHarmonic1.type = 'sine';
    oscHarmonic1.frequency.setValueAtTime(216, this.audioCtx.currentTime);

    oscHarmonic2.type = 'sine';
    oscHarmonic2.frequency.setValueAtTime(432.2, this.audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(460, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(3.5, this.audioCtx.currentTime);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(180, this.audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    gain.gain.setValueAtTime(0.65, this.audioCtx.currentTime);

    oscBase.connect(filter);
    oscHarmonic1.connect(filter);
    oscHarmonic2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    oscBase.start();
    oscHarmonic1.start();
    oscHarmonic2.start();
    lfo.start();

    this.currentAmbient = {
      stop: () => {
        try {
          oscBase.stop();
          oscHarmonic1.stop();
          oscHarmonic2.stop();
          lfo.stop();
        } catch (e) {}
      },
      disconnect: () => {
        try {
          oscBase.disconnect();
          oscHarmonic1.disconnect();
          oscHarmonic2.disconnect();
          lfo.disconnect();
          filter.disconnect();
        } catch (e) {}
      }
    };
  }

  // 3. Vibración Semilla RHA / RAM (Fuego Espiritual Solar 144 Hz)
  startCantoRAM() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});

    const osc = this.audioCtx.createOscillator();
    const bellOsc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(144, this.audioCtx.currentTime);

    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(576.5, this.audioCtx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(2.8, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.65, this.audioCtx.currentTime);

    osc.connect(filter);
    bellOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    osc.start();
    bellOsc.start();

    this.currentAmbient = {
      stop: () => {
        try {
          osc.stop();
          bellOsc.stop();
        } catch (e) {}
      },
      disconnect: () => {
        try {
          osc.disconnect();
          bellOsc.disconnect();
          filter.disconnect();
        } catch (e) {}
      }
    };
  }

  // 4. Campanas de Monasterio Procedimentales
  startMonasteryBells() {
    if (!this.audioCtx) return;
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(1.0, this.audioCtx.currentTime);
    masterGain.connect(this.ambientGain);
    const activeNodes = [];

    const playBell = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      const freqs = [220, 261.63, 329.63, 392.00, 440];
      const selectedFreq = freqs[Math.floor(Math.random() * freqs.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(selectedFreq, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 4.6);
      activeNodes.push(osc, gain);
      setTimeout(() => {
        const idx1 = activeNodes.indexOf(osc);
        if (idx1 !== -1) activeNodes.splice(idx1, 1);
        const idx2 = activeNodes.indexOf(gain);
        if (idx2 !== -1) activeNodes.splice(idx2, 1);
      }, 4700);
    };

    playBell();
    this.ambientTimer = this.registerTimer(setInterval(playBell, 5500));

    this.currentAmbient = {
      stop: () => {
        try {
          masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
          activeNodes.forEach(node => {
            try { if (typeof node.stop === 'function') node.stop(); } catch (e) {}
          });
        } catch (e) {}
      },
      disconnect: () => {
        setTimeout(() => {
          try {
            masterGain.disconnect();
            activeNodes.forEach(node => {
              try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (e) {}
            });
          } catch (e) {}
        }, 350);
      }
    };
  }

  // 5. Lluvia Zen / Ruido Rosa Filtrado
  startZenRain() {
    if (!this.audioCtx) return;
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.18;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, this.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);

    whiteNoise.start();

    this.currentAmbient = {
      stop: () => {
        try { whiteNoise.stop(); } catch (e) {}
      },
      disconnect: () => {
        try {
          whiteNoise.disconnect();
          filter.disconnect();
        } catch (e) {}
      }
    };
  }

  // 6. Cuenco Tibetano / Frecuencias Solfeggio (432Hz, 528Hz, 963Hz)
  startTibetanBowlDrone(baseFreq = 528) {
    if (!this.audioCtx) return;
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 1.5 + 0.8, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ambientGain);

    osc1.start();
    osc2.start();

    this.currentAmbient = {
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
        } catch (e) {}
      },
      disconnect: () => {
        try {
          osc1.disconnect();
          osc2.disconnect();
        } catch (e) {}
      }
    };
  }

  // 7. Tambores Batá Sagrados (Añá) & Campana Agogô (Santería Yoruba)
  startTamboresBataYoruba() {
    if (!this.audioCtx) return;

    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(1.0, this.audioCtx.currentTime);
    masterGain.connect(this.ambientGain);
    const activeNodes = [];

    let step = 0;
    const playBataPattern = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 1. Tambor Iyá (Bajo Grave de Membrana) en tiempos fuertes (step 0 y 4)
      if (step === 0 || step === 4) {
        const iyaOsc = this.audioCtx.createOscillator();
        const iyaGain = this.audioCtx.createGain();
        iyaOsc.type = 'triangle';
        iyaOsc.frequency.setValueAtTime(step === 0 ? 100 : 85, now);
        iyaOsc.frequency.exponentialRampToValueAtTime(42, now + 0.28);

        iyaGain.gain.setValueAtTime(0.48, now);
        iyaGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        iyaOsc.connect(iyaGain);
        iyaGain.connect(masterGain);
        iyaOsc.start(now);
        iyaOsc.stop(now + 0.36);
        activeNodes.push(iyaOsc, iyaGain);
      }

      // 2. Tambor Okónkolo / Itótele (Golpes Medios y Agudos Cha-chá)
      if (step === 1 || step === 3 || step === 5) {
        const okonOsc = this.audioCtx.createOscillator();
        const okonGain = this.audioCtx.createGain();
        okonOsc.type = 'sine';
        okonOsc.frequency.setValueAtTime(step === 3 ? 240 : 185, now);
        okonOsc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        okonGain.gain.setValueAtTime(0.32, now);
        okonGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        okonOsc.connect(okonGain);
        okonGain.connect(masterGain);
        okonOsc.start(now);
        okonOsc.stop(now + 0.15);
        activeNodes.push(okonOsc, okonGain);
      }

      // 3. Campana Sagrada de Osha / Agogô Metálica (Campana 6/8 de llamada)
      if (step === 0 || step === 2 || step === 3) {
        const bellOsc1 = this.audioCtx.createOscillator();
        const bellOsc2 = this.audioCtx.createOscillator();
        const bellGain = this.audioCtx.createGain();

        bellOsc1.type = 'sine';
        bellOsc1.frequency.setValueAtTime(step === 2 ? 880 : 740, now);

        bellOsc2.type = 'sine';
        bellOsc2.frequency.setValueAtTime((step === 2 ? 880 : 740) * 1.52, now);

        bellGain.gain.setValueAtTime(0.18, now);
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        bellOsc1.connect(bellGain);
        bellOsc2.connect(bellGain);
        bellGain.connect(masterGain);

        bellOsc1.start(now);
        bellOsc2.start(now);
        bellOsc1.stop(now + 0.33);
        bellOsc2.stop(now + 0.33);
        activeNodes.push(bellOsc1, bellOsc2, bellGain);
      }

      // Limpiar nodos expirados
      if (activeNodes.length > 30) {
        activeNodes.splice(0, 15);
      }

      step = (step + 1) % 6;
    };

    playBataPattern();
    this.ambientTimer = this.registerTimer(setInterval(playBataPattern, 340));

    this.currentAmbient = {
      stop: () => {
        try {
          masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.2);
          activeNodes.forEach(node => {
            try { if (typeof node.stop === 'function') node.stop(); } catch (e) {}
          });
        } catch (e) {}
      },
      disconnect: () => {
        setTimeout(() => {
          try {
            masterGain.disconnect();
            activeNodes.forEach(node => {
              try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (e) {}
            });
          } catch (e) {}
        }, 250);
      }
    };
  }

  // 8. Canto Gregoriano Monástico (Organum Medieval & Resonancia de Abadía)
  startCantoGregoriano() {
    if (!this.audioCtx) return;

    const voices = [
      { freq: 146.83, gain: 0.18, type: 'sawtooth' }, // D3 Fundamental
      { freq: 220.00, gain: 0.16, type: 'sawtooth' }, // A3 Quinta Justa
      { freq: 293.66, gain: 0.12, type: 'triangle' }, // D4 Octava
      { freq: 329.63, gain: 0.08, type: 'sine' }      // E4 Quinta Armónica
    ];

    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.28, this.audioCtx.currentTime + 2.0);
    masterGain.connect(this.ambientGain);

    // Formante vocal tipo 'O/A'
    const formantFilter = this.audioCtx.createBiquadFilter();
    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(520, this.audioCtx.currentTime);
    formantFilter.Q.setValueAtTime(3.5, this.audioCtx.currentTime);
    formantFilter.connect(masterGain);

    // LFO Respiración lenta de abadía (periodo ~8 segundos)
    const swellLfo = this.audioCtx.createOscillator();
    const swellGain = this.audioCtx.createGain();
    swellLfo.type = 'sine';
    swellLfo.frequency.setValueAtTime(0.125, this.audioCtx.currentTime);
    swellGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    swellLfo.connect(swellGain);
    swellGain.connect(masterGain.gain);
    swellLfo.start();

    const oscNodes = [];
    voices.forEach((v) => {
      const osc = this.audioCtx.createOscillator();
      const vGain = this.audioCtx.createGain();
      osc.type = v.type;
      osc.frequency.setValueAtTime(v.freq, this.audioCtx.currentTime);

      // Micro-vibrato sacro
      const vib = this.audioCtx.createOscillator();
      const vibGain = this.audioCtx.createGain();
      vib.type = 'sine';
      vib.frequency.setValueAtTime(5.1, this.audioCtx.currentTime);
      vibGain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);
      vib.connect(vibGain);
      vibGain.connect(osc.frequency);
      vib.start();

      vGain.gain.setValueAtTime(v.gain, this.audioCtx.currentTime);
      osc.connect(vGain);
      vGain.connect(formantFilter);
      osc.start();
      oscNodes.push(osc, vib);
    });

    this.currentAmbient = {
      stop: () => {
        swellLfo.stop();
        oscNodes.forEach(n => {
          try { n.stop(); } catch (e) {}
        });
      },
      disconnect: () => {
        masterGain.disconnect();
        formantFilter.disconnect();
      }
    };
  }

  // 9. Flauta Shakuhachi Zen (Bambú Japonés & Escala In-Sen Meditativa)
  startFlautaShakuhachi() {
    if (!this.audioCtx) return;

    const scale = [293.66, 311.13, 392.00, 440.00, 523.25, 587.33]; // Escala In-sen (D, Eb, G, A, C, D)
    let noteIdx = 0;
    const activeNodes = [];

    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.24, this.audioCtx.currentTime);
    masterGain.connect(this.ambientGain);

    const playShakuhachiNote = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const freq = scale[noteIdx % scale.length];
      noteIdx = (noteIdx + 1 + Math.floor(Math.random() * 2)) % scale.length;

      // 1. Tono Melódico de Bambú
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Curva envolvente de ataque suave y caída meditativa
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.26, now + 0.6);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      // 2. Soplido de Aire (Chiff de Ruido de Bambú)
      const bufferSize = this.audioCtx.sampleRate * 0.4;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(freq * 1.8, now);
      noiseFilter.Q.setValueAtTime(6.0, now);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      noiseSource.start(now);
      osc.start(now);
      osc.stop(now + 3.9);
      activeNodes.push(osc, noteGain, noiseSource, noiseFilter, noiseGain);

      setTimeout(() => {
        const toClean = [osc, noteGain, noiseSource, noiseFilter, noiseGain];
        toClean.forEach(n => {
          const idx = activeNodes.indexOf(n);
          if (idx !== -1) activeNodes.splice(idx, 1);
        });
      }, 4000);
    };

    playShakuhachiNote();
    this.ambientTimer = this.registerTimer(setInterval(playShakuhachiNote, 4200));

    this.currentAmbient = {
      stop: () => {
        try {
          masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
          activeNodes.forEach(node => {
            try { if (typeof node.stop === 'function') node.stop(); } catch (e) {}
          });
        } catch (e) {}
      },
      disconnect: () => {
        setTimeout(() => {
          try {
            masterGain.disconnect();
            activeNodes.forEach(node => {
              try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (e) {}
            });
          } catch (e) {}
        }, 350);
      }
    };
  }

  // 10. Shofar Místico (Llamada Sagrada Ancestral en el Desierto)
  startShofarMistico() {
    if (!this.audioCtx) return;

    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
    masterGain.connect(this.ambientGain);
    const activeNodes = [];

    const playShofarCall = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // Llamada solemne Tekiah (Quinta natural ascendente: 110Hz -> 165Hz)
      const osc = this.audioCtx.createOscillator();
      const hornGain = this.audioCtx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(164.8, now + 0.5);

      const hornFilter = this.audioCtx.createBiquadFilter();
      hornFilter.type = 'bandpass';
      hornFilter.frequency.setValueAtTime(680, now);
      hornFilter.Q.setValueAtTime(2.8, now);

      hornGain.gain.setValueAtTime(0.001, now);
      hornGain.gain.linearRampToValueAtTime(0.32, now + 0.35);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

      osc.connect(hornFilter);
      hornFilter.connect(hornGain);
      hornGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 3.6);
      activeNodes.push(osc, hornGain, hornFilter);

      setTimeout(() => {
        const toClean = [osc, hornGain, hornFilter];
        toClean.forEach(n => {
          const idx = activeNodes.indexOf(n);
          if (idx !== -1) activeNodes.splice(idx, 1);
        });
      }, 3700);
    };

    playShofarCall();
    this.ambientTimer = this.registerTimer(setInterval(playShofarCall, 5500));

    this.currentAmbient = {
      stop: () => {
        try {
          masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
          activeNodes.forEach(node => {
            try { if (typeof node.stop === 'function') node.stop(); } catch (e) {}
          });
        } catch (e) {}
      },
      disconnect: () => {
        setTimeout(() => {
          try {
            masterGain.disconnect();
            activeNodes.forEach(node => {
              try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (e) {}
            });
          } catch (e) {}
        }, 350);
      }
    };
  }

  // 11. Fuego y Copal Sagrado (Leña Crepitante & Resina Aromática)
  startFuegoCopal() {
    if (!this.audioCtx) return;

    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.28, this.audioCtx.currentTime);
    masterGain.connect(this.ambientGain);

    // Capa 1: Rumor cálido de brasas continuas
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02; // Brownian noise
      lastOut = data[i];
    }

    const brownSource = this.audioCtx.createBufferSource();
    brownSource.buffer = noiseBuffer;
    brownSource.loop = true;

    const lowFilter = this.audioCtx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.setValueAtTime(320, this.audioCtx.currentTime);

    const fireGain = this.audioCtx.createGain();
    fireGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

    brownSource.connect(lowFilter);
    lowFilter.connect(fireGain);
    fireGain.connect(masterGain);
    brownSource.start();

    // Capa 2: Crepitar aleatorio de chispas y resina
    const playCrackle = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const popOsc = this.audioCtx.createOscillator();
      const popGain = this.audioCtx.createGain();
      const popFilter = this.audioCtx.createBiquadFilter();

      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(800 + Math.random() * 1600, now);
      popFilter.type = 'highpass';
      popFilter.frequency.setValueAtTime(1200, now);

      popGain.gain.setValueAtTime(0.18 * Math.random(), now);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03 + Math.random() * 0.05);

      popOsc.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(masterGain);

      popOsc.start(now);
      popOsc.stop(now + 0.09);
    };

    this.ambientTimer = this.registerTimer(setInterval(playCrackle, 160));

    this.currentAmbient = {
      stop: () => {
        try { brownSource.stop(); } catch (e) {}
      },
      disconnect: () => {
        masterGain.disconnect();
      }
    };
  }

  // Cuentas Hápticas / Sonido de Perla
  playBeadClick() {
    this.initAudioContext();
    if (this.audioCtx) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.06);
    }

    // Vibración háptica en móviles si está soportada
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch (e) {}
    }
  }

  // Campana Sagrada / Cuenco Tibetano Armónico
  playTibetanBowl() {
    try {
      this.initAudioContext();
      if (this.audioCtx) {
        const fundamental = 432;
        const harmonics = [1, 2.76, 5.4, 8.93];
        const gains = [0.45, 0.25, 0.15, 0.08];

        harmonics.forEach((h, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * h, this.audioCtx.currentTime);

          gain.gain.setValueAtTime(gains[idx], this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.2);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 2.2);
        });
      }

      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Tibetan bowl audio error:', e);
    }
  }

  // Lector de Texto a Voz (Speech Synthesis) con Velocidad y Control Play/Pause
  setTTSRate(rate = 0.85) {
    this.ttsRate = parseFloat(rate) || 0.85;
  }

  speakPrayer(text, lang = 'es', onStateChange = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      console.warn('SpeechSynthesis no disponible en este entorno.');
      if (onStateChange) onStateChange('idle');
      return;
    }

    // Caso 1: Si está en pausa de una locución en curso, reanudar
    if (this.isTTSPaused && this.currentUtterance && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
      this.isTTSPlaying = true;
      this.isTTSPaused = false;
      if (onStateChange) onStateChange('playing');
      return;
    }

    // Caso 2: Si está hablando activamente, pausar
    if (this.isTTSPlaying && !this.isTTSPaused && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.pause();
      } catch (e) {}
      this.isTTSPlaying = false;
      this.isTTSPaused = true;
      if (onStateChange) onStateChange('paused');
      return;
    }

    // Caso 3: Iniciar nueva lectura desde cero cancelando instancias previas
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    // Descongelar motor de síntesis de voz en navegadores WebKit/Chromium
    if (window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
    }

    const cleanText = (text || '').replace(/[#*_~`\[\]()<>]/g, ' ').trim();
    if (!cleanText) {
      if (onStateChange) onStateChange('idle');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance; // Previene recolección de basura prematura
    utterance.rate = this.ttsRate || 0.85;
    utterance.pitch = 0.95;

    const langCodes = {
      es: 'es-ES',
      en: 'en-US',
      fr: 'fr-FR',
      pt: 'pt-BR',
      it: 'it-IT',
      de: 'de-DE',
      ru: 'ru-RU',
      ar: 'ar-SA',
      he: 'he-IL',
      hi: 'hi-IN',
      zh: 'zh-CN',
      la: 'la',
      ja: 'ja-JP',
      bn: 'bn-BD',
      id: 'id-ID',
      ur: 'ur-PK',
      sw: 'sw-KE'
    };
    utterance.lang = langCodes[lang] || 'es-ES';

    // Asignar voz natural si está precargada
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const targetLang = utterance.lang;
      const targetPrefix = targetLang.split('-')[0].toLowerCase();
      const matchingVoice = voices.find(v => v.lang === targetLang || (v.lang && v.lang.toLowerCase().startsWith(targetPrefix)));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    this.isTTSPlaying = true;
    this.isTTSPaused = false;
    if (onStateChange) onStateChange('playing');

    utterance.onstart = () => {
      this.isTTSPlaying = true;
      this.isTTSPaused = false;
      if (onStateChange) onStateChange('playing');
    };

    utterance.onend = () => {
      this.isTTSPlaying = false;
      this.isTTSPaused = false;
      this.currentUtterance = null;
      if (onStateChange) onStateChange('idle');
    };
    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      this.isTTSPlaying = false;
      this.isTTSPaused = false;
      this.currentUtterance = null;
      if (onStateChange) onStateChange('idle');
    };

    try {
      window.speechSynthesis.speak(utterance);
      // Reanudar inmediatamente por si Chrome/Safari entra en estado paused al encolar
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {
      console.warn('Error al iniciar speak:', e);
      this.isTTSPlaying = false;
      this.currentUtterance = null;
      if (onStateChange) onStateChange('idle');
    }
  }

  pauseTTS(onStateChange = null) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      try { window.speechSynthesis.pause(); } catch (e) {}
      this.isTTSPlaying = false;
      this.isTTSPaused = true;
      if (onStateChange) onStateChange('paused');
    }
  }

  resumeTTS(onStateChange = null) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      try { window.speechSynthesis.resume(); } catch (e) {}
      this.isTTSPlaying = true;
      this.isTTSPaused = false;
      if (onStateChange) onStateChange('playing');
    }
  }

  stopTTS(onStateChange = null) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    this.isTTSPlaying = false;
    this.isTTSPaused = false;
    this.currentUtterance = null;
    if (onStateChange) onStateChange('idle');
  }
}

export const soundManager = new SoundService();
