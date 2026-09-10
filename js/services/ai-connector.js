/**
 * AI CONNECTOR & MULTI-TIER REDUNDANCY SERVICE
 * FeUniversal - Faith & Prayers
 * 
 * Gestiona la conexión a múltiples motores de Inteligencia Artificial:
 * 1. Google Gemini API (1.5 Flash / 2.0 Flash)
 * 2. Ollama Local (Desktop/Mac en localhost:11434)
 * 3. WebLLM (WebGPU In-Browser)
 * 4. OpenAI / Groq Cloud API
 * 5. Motor Litúrgico Master Offline (+3M Permutas)
 */

export class AIConnector {
  /**
   * Generación con despacho directo al proveedor seleccionado o en cascada
   */
  static async generatePrayerWithProvider({ proveedor = 'auto', tradicion, situacion, idioma = 'es', onProgress, onToken }) {
    const startTime = performance.now();
    const config = this.getAIConfig();
    const systemPrompt = this.buildLiturgicalSystemPrompt(tradicion, idioma);
    const userPrompt = `Situación o intención del creyente: "${situacion}". Redacta una plegaria solemne, profunda y reverente.`;

    // 1. Despacho Específico por Proveedor
    if (proveedor === 'gemini' || (proveedor === 'auto' && config.geminiKey)) {
      try {
        if (onProgress) onProgress('Conectando con Google Gemini Flash...');
        const res = await this.callGemini({
          apiKey: config.geminiKey,
          model: config.geminiModel || 'gemini-1.5-flash',
          systemPrompt,
          userPrompt,
          timeoutMs: 4500,
          onToken
        });
        if (res && res.text) {
          return {
            success: true,
            provider: `Google Gemini (${config.geminiModel || '1.5 Flash'})`,
            text: res.text,
            latencyMs: Math.round(performance.now() - startTime),
            isFallback: false
          };
        }
      } catch (err) {
        console.warn('[AIConnector] Error en Gemini:', err.message);
        if (proveedor === 'gemini') {
          return { success: false, reason: `GEMINI_ERROR: ${err.message}` };
        }
      }
    }

    if (proveedor === 'ollama' || (proveedor === 'auto' && config.ollamaEnabled)) {
      try {
        if (onProgress) onProgress('Conectando con Ollama Local (localhost:11434)...');
        const res = await this.callOllama({
          host: config.ollamaHost || 'http://127.0.0.1:11434',
          model: config.ollamaModel || 'llama3',
          systemPrompt,
          userPrompt,
          timeoutMs: 6000,
          onToken
        });
        if (res && res.text) {
          return {
            success: true,
            provider: `Ollama Local (${config.ollamaModel || 'llama3'})`,
            text: res.text,
            latencyMs: Math.round(performance.now() - startTime),
            isFallback: false
          };
        }
      } catch (err) {
        console.warn('[AIConnector] Error en Ollama:', err.message);
        if (proveedor === 'ollama') {
          return { success: false, reason: `OLLAMA_ERROR: ${err.message}` };
        }
      }
    }

    if (proveedor === 'openai' || (proveedor === 'auto' && config.openaiKey)) {
      try {
        if (onProgress) onProgress('Conectando con OpenAI / Groq Cloud...');
        const res = await this.callOpenAI({
          apiKey: config.openaiKey,
          endpoint: config.openaiEndpoint || 'https://api.openai.com/v1/chat/completions',
          model: config.openaiModel || 'gpt-4o-mini',
          systemPrompt,
          userPrompt,
          timeoutMs: 4500,
          onToken
        });
        if (res && res.text) {
          return {
            success: true,
            provider: `OpenAI (${config.openaiModel || 'gpt-4o-mini'})`,
            text: res.text,
            latencyMs: Math.round(performance.now() - startTime),
            isFallback: false
          };
        }
      } catch (err) {
        console.warn('[AIConnector] Error en OpenAI:', err.message);
        if (proveedor === 'openai') {
          return { success: false, reason: `OPENAI_ERROR: ${err.message}` };
        }
      }
    }

    if (proveedor === 'webllm') {
      try {
        if (onProgress) onProgress('Iniciando inferencia WebLLM en WebGPU local...');
        const res = await this.callWebLLM({
          systemPrompt,
          userPrompt,
          model: config.webllmModel || 'Llama-3.2-1B-Instruct-q4f32_1-MLC',
          onProgress,
          onToken
        });
        if (res && res.text) {
          return {
            success: true,
            provider: 'WebLLM (WebGPU Local In-Browser)',
            text: res.text,
            latencyMs: Math.round(performance.now() - startTime),
            isFallback: false
          };
        }
      } catch (err) {
        console.warn('[AIConnector] Error en WebLLM:', err.message);
        return { success: false, reason: `WEBLLM_ERROR: ${err.message}` };
      }
    }

    // Fallback general al motor local si estamos en auto o fallaron todos
    return { success: false, reason: 'FALLBACK_TO_LOCAL' };
  }

  /**
   * Llamada REST oficial a Google Gemini API (1.5 Flash / 2.0 Flash)
   */
  static async callGemini({ apiKey, model = 'gemini-1.5-flash', systemPrompt, userPrompt, timeoutMs = 4500, onToken }) {
    if (!apiKey) throw new Error('No se ha proporcionado la clave de Google Gemini');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 700
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Google Gemini HTTP ${response.status}: ${errorBody.slice(0, 150)}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Respuesta vacía de Google Gemini');

      const trimmed = text.trim();
      if (onToken) onToken(trimmed);
      return { text: trimmed };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Llamada REST a Ollama Local (localhost:11434)
   */
  static async callOllama({ host = 'http://127.0.0.1:11434', model = 'llama3', systemPrompt, userPrompt, timeoutMs = 6000, onToken }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Normalizar endpoint de Ollama
    const cleanHost = host.replace(/\/+$/, '');
    const url = `${cleanHost}/api/generate`;

    const payload = {
      model,
      system: systemPrompt,
      prompt: userPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 500
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP ${response.status} en ${url}`);
      }

      const data = await response.json();
      const text = data.response;
      if (!text) throw new Error('Respuesta vacía de Ollama');

      const trimmed = text.trim();
      if (onToken) onToken(trimmed);
      return { text: trimmed };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Llamada REST a OpenAI / Groq
   */
  static async callOpenAI({ apiKey, endpoint, model, systemPrompt, userPrompt, timeoutMs = 4500, onToken }) {
    if (!apiKey) throw new Error('No se ha proporcionado la API Key de OpenAI/Groq');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const payload = {
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 600
    };

    try {
      const response = await fetch(endpoint || 'https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI HTTP ${response.status}: ${errorText.slice(0, 150)}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Respuesta vacía de OpenAI');

      const trimmed = text.trim();
      if (onToken) onToken(trimmed);
      return { text: trimmed };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Conector WebLLM (In-Browser WebGPU)
   */
  static async callWebLLM({ systemPrompt, userPrompt, model, onProgress, onToken }) {
    if (!('gpu' in navigator)) {
      throw new Error('Tu navegador no soporta WebGPU. Usa Chrome/Edge/Safari o el motor local.');
    }

    try {
      if (onProgress) onProgress('Cargando motor WebLLM WebGPU...');
      const webllm = await import('https://esm.run/@mlc-ai/web-llm');
      
      const selectedModel = model || 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
      const engine = await webllm.CreateMLCEngine(selectedModel, {
        initProgressCallback: (report) => {
          if (onProgress) onProgress(`WebLLM: ${report.text || 'Inicializando...'}`);
        }
      });

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const reply = await engine.chat.completions.create({
        messages,
        temperature: 0.7,
        max_tokens: 500
      });

      const text = reply.choices[0]?.message?.content || '';
      if (onToken) onToken(text.trim());
      return { text: text.trim() };
    } catch (err) {
      throw new Error(`Error en WebLLM: ${err.message}`);
    }
  }

  /**
   * Pruebas de Diagnóstico y Latencia en Vivo para Ajustes
   */
  static async testProvider(providerName, customConfig = null) {
    const config = customConfig || this.getAIConfig();
    const startTime = performance.now();

    try {
      if (providerName === 'gemini') {
        if (!config.geminiKey) return { success: false, status: 'missing_key', message: 'Clave de API no configurada (opcional)' };
        await this.callGemini({
          apiKey: config.geminiKey,
          model: config.geminiModel || 'gemini-1.5-flash',
          systemPrompt: 'Responde estrictamente con la palabra OK.',
          userPrompt: 'Test de conectividad.',
          timeoutMs: 4000
        });
        const latency = Math.round(performance.now() - startTime);
        return { success: true, status: 'connected', latencyMs: latency, message: `Conectado con éxito (${latency} ms)` };
      }

      if (providerName === 'ollama') {
        const host = config.ollamaHost || 'http://127.0.0.1:11434';
        await this.callOllama({
          host,
          model: config.ollamaModel || 'llama3',
          systemPrompt: 'Responde con la palabra OK.',
          userPrompt: 'Test.',
          timeoutMs: 4000
        });
        const latency = Math.round(performance.now() - startTime);
        return { success: true, status: 'connected', latencyMs: latency, message: `Ollama Activo en ${host} (${latency} ms)` };
      }

      if (providerName === 'openai') {
        if (!config.openaiKey) return { success: false, status: 'missing_key', message: 'Falta la API Key de OpenAI/Groq' };
        await this.callOpenAI({
          apiKey: config.openaiKey,
          endpoint: config.openaiEndpoint || 'https://api.openai.com/v1/chat/completions',
          model: config.openaiModel || 'gpt-4o-mini',
          systemPrompt: 'Responde con la palabra OK.',
          userPrompt: 'Test.',
          timeoutMs: 4000
        });
        const latency = Math.round(performance.now() - startTime);
        return { success: true, status: 'connected', latencyMs: latency, message: `OpenAI/Groq Conectado (${latency} ms)` };
      }

      if (providerName === 'webgpu') {
        if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
          return { success: true, status: 'connected', latencyMs: 1, message: 'WebGPU disponible en este navegador' };
        }
        return { success: false, status: 'unavailable', message: 'WebGPU no está activo en este navegador' };
      }

      if (providerName === 'local') {
        return { success: true, status: 'connected', latencyMs: 0, message: 'Motor Litúrgico Offline 100% Disponible (0 ms)' };
      }

      return { success: false, status: 'unknown', message: 'Proveedor desconocido' };
    } catch (err) {
      let cleanMsg = err.message || 'Error de conexión';
      if (/abort|failed to fetch|networkerror/i.test(cleanMsg)) {
        cleanMsg = 'Servidor local no detectado en este puerto';
      }
      return { success: false, status: 'error', message: cleanMsg };
    }
  }

  /**
   * Genera el prompt litúrgico del sistema de acuerdo con la tradición
   */
  static buildLiturgicalSystemPrompt(tradicion, idioma) {
    const guiasTradicion = {
      catolicismo: 'Tradición Católica Apostólica Romana. Inicia en el Nombre del Padre, del Hijo y del Espíritu Santo. Tono solemne y concluye por Jesucristo Nuestro Señor. Amén.',
      vedica: 'Tradición Védica (Sanatana Dharma). Invocación de paz y orden cósmico (Dharma). Invoca mantras y concluye con Oṃ Śāntiḥ Śāntiḥ Śāntiḥ o Lokah Samastah Sukhino Bhavantu.',
      islam: 'Tradición Islámica. Inicia con Bismillah ar-Rahman ar-Rahim (En el Nombre de Allah, el Clemente, el Misericordioso). Tono de humildad, súplica (Dua) y paz.',
      budismo: 'Budismo y Consciencia Plena. Refugio en las Tres Joyas (Buda, Dharma, Sangha), meditación sobre la transitoriedad y compasión universal (Metta) hacia todos los seres sintientes.',
      judaismo: 'Tradición Judía y Salmos de David. Invocación reverente al Creador del Universo (Ribonó shel Olám), invocando misericordia, bendición de paz (Shalom) y justicia.',
      taoismo: 'Tradición Taoísta. Armonía con el Tao eterno, fluir natural (Wu Wei), equilibrio de Yin y Yang y pureza del espíritu.',
      ortodoxia: 'Cristianismo Ortodoxo Bizantino. Invoca a Jesucristo Luz Increada y a la Theotokos. Tono de reverencia profunda y doxología trinitaria tradicional.',
      protestantismo: 'Tradición Evangélica / Cristiana Protestante. Oración de fe activa, gracia salvadora, promesas bíblicas e intercesión en el Nombre de Jesús.',
      santeria_yoruba: 'Tradición Yoruba Lucumí. Invocación de reverencia a Olodumare, Olofin, Olorun y a los Orishas de luz para salud, desenvolvimiento y caminos abiertos. Concluye con Aché to, iban Eshu.',
      masoneria: 'Tradición Masónica y Filosófica. Invocación a la Gloria del Gran Arquitecto del Universo (G.A.D.U.), buscando luz, virtud moral, fraternidad universal y verdad.',
      sintoismo: 'Tradición Sintoísta. Reverencia a los Kami, purificación sagrada (Harae), gratitud por la naturaleza y armonía cósmica.',
      ancestral_indigena: 'Espiritualidad Ancestral de la Madre Tierra. Agradecimiento al Gran Espíritu, a las cuatro direcciones sagradas, a los ancestros y a la Madre Tierra (Pachamama).'
    };

    const langNames = {
      es: 'Español',
      en: 'English',
      fr: 'Français',
      pt: 'Português',
      it: 'Italiano',
      de: 'Deutsch',
      ru: 'Русский',
      ar: 'العربية (Arabic)',
      he: 'עברית (Hebrew)',
      hi: 'हिन्दी (Hindi)',
      zh: '中文 (Chinese)',
      la: 'Latina (Latin)',
      ja: '日本語 (Japanese)',
      bn: 'বাংলা (Bengali)',
      id: 'Bahasa Indonesia',
      ur: 'اردو (Urdu)',
      sw: 'Kiswahili'
    };

    const targetLangName = langNames[idioma] || idioma.toUpperCase();
    const guia = guiasTradicion[tradicion] || guiasTradicion.catolicismo;

    return `Eres FaithGPT, el asistente litúrgico e interreligioso del ecosistema FeUniversal.
Tu sagrada labor es redactar una plegaria en idioma ${targetLangName} (${idioma}), profunda, reverente, consoladora y poética, respetando estrictamente las normas y fórmulas canónicas de la tradición: ${guia}.
Instrucciones estrictas:
1. No incluyas saludos conversacionales, introducciones como "Aquí tienes tu oración" ni despedidas secundarias.
2. Escribe íntegramente en ${targetLangName}.
3. Devuelve ÚNICAMENTE el texto litúrgico de la plegaria listo para ser rezado o meditado.`;
  }

  /**
   * Obtiene la configuración de IA almacenada en el dispositivo
   */
  static getAIConfig() {
    try {
      const saved = localStorage.getItem('feuniversal_ai_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      activeProvider: 'auto', // 'auto' | 'gemini' | 'ollama' | 'webllm' | 'openai' | 'local'
      enabledCloud: false,
      geminiKey: '',
      geminiModel: 'gemini-1.5-flash',
      ollamaEnabled: false,
      ollamaHost: 'http://127.0.0.1:11434',
      ollamaModel: 'llama3',
      openaiKey: '',
      openaiEndpoint: 'https://api.openai.com/v1/chat/completions',
      openaiModel: 'gpt-4o-mini',
      webllmModel: 'Llama-3.2-1B-Instruct-q4f32_1-MLC'
    };
  }

  /**
   * Guarda la configuración de IA
   */
  static saveAIConfig(config) {
    localStorage.setItem('feuniversal_ai_config', JSON.stringify(config));
  }
}

