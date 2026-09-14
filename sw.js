/**
 * SERVICE WORKER - MULTI-DOMAIN CACHING & INTELLIGENT ON-DEMAND ENGINE
 * FeUniversal - Faith & Prayers (v9.1.0 Golden Edition)
 * 
 * Arquitectura de Almacenamiento y Rendimiento v9.1.0:
 * 1. CORE CACHE: Interfaz, lógica interactiva, estilos y dataset maestro base (Español).
 *    Instalación ultra-rápida en conexiones móviles (< 2.5 MB iniciales sin saturar red).
 * 2. PRAYERS CACHE (Lazy On-Demand): Los 16 datasets adicionales de oraciones (~5 MB c/u)
 *    se descargan y almacenan en caché local únicamente cuando el usuario los consulta.
 * 3. SCRIPTURES CACHE (Lazy On-Demand): Los 204 libros sagrados se descargan por demanda
 *    libro por libro e idioma por idioma, ahorrando más de 100 MB de almacenamiento inicial.
 * 4. FONTS CACHE: Almacenamiento persistente de tipografías externas y glifos sagrados.
 * 5. 100% Funcional sin conexión (Modo Avión perpetuo) con fallbacks estructurados.
 */

const CACHE_VERSION = 'v9.5.0';
const CORE_CACHE = `feuniversal-core-${CACHE_VERSION}`;
const PRAYERS_CACHE = `feuniversal-prayers-${CACHE_VERSION}`;
const SCRIPTURES_CACHE = `feuniversal-scriptures-${CACHE_VERSION}`;
const FONTS_CACHE = `feuniversal-fonts-${CACHE_VERSION}`;

const ACTIVE_CACHES = [CORE_CACHE, PRAYERS_CACHE, SCRIPTURES_CACHE, FONTS_CACHE];

// Núcleo esencial ultra-liviano (53 recursos clave para arranque instantáneo)
const PRECACHE_ASSETS = [
  "./app-icon.png",
  "./app-icon-1024.png",
  "./feature-graphic.png",
  "./css/app.css",
  "./css/design-tokens.css",
  "./css/glassmorphism.css",
  "./ico.png",
  "./logo.png",
  "./index.html",
  "./js/app.js",
  "./js/components/altar.js",
  "./js/components/bead-counter.js",
  "./js/components/icons.js",
  "./js/components/language-modal.js",
  "./js/components/membership.js",
  "./js/components/mirror-reader.js",
  "./js/components/notification-modal.js",
  "./js/components/novena-modal.js",
  "./js/components/onboarding.js",
  "./js/components/privacy-modal.js",
  "./js/components/sacred-dialog.js",
  "./js/components/sacred-duration-picker.js",
  "./js/components/sacred-habit.js",
  "./js/components/sacred-scripture-picker.js",
  "./js/components/sacred-sound-picker.js",
  "./js/components/sacred-time-picker.js",
  "./js/components/sacred-tradition-picker.js",
  "./js/components/scriptures-view.js",
  "./js/components/social-share.js",
  "./js/components/spiritual-compass.js",
  "./js/components/translation-report-modal.js",
  "./js/components/vault.js",
  "./js/data/i18n.js",
  "./js/data/legal-translations.js",
  "./js/data/intentions.js",
  "./js/data/novenas-db.js",
  "./js/data/prayers-db.js",
  "./js/data/scriptures-catalog.js",
  "./js/data/traditions.js",
  "./js/services/ai-connector.js",
  "./js/services/billing-service.js",
  "./js/services/error-handler.js",
  "./js/services/faith-gpt.js",
  "./js/services/notification-service.js",
  "./js/services/prayer-corpus-service.js",
  "./js/services/scripture-corpus-service.js",
  "./js/services/scripture-search-engine.js",
  "./js/services/solar-service.js",
  "./js/services/sound-service.js",
  "./js/services/storage-service.js",
  "./js/utils/stream-decompressor.js",
  "./json_idiomas/oraciones_maestro_es.json",
  "./json_idiomas/oraciones_maestro_es.json.gz",
  "./manifest.json",
  "./privacy-policy.html"
];

// 1. INSTALACIÓN: Precarga no bloqueante del núcleo en CORE_CACHE
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[SW v9.1] Precarga no crítica fallida para ${asset}:`, err);
          })
        )
      );
    })
  );
});

// 2. ACTIVACIÓN: Purgado selectivo de versiones obsoletas y control de clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!ACTIVE_CACHES.includes(cacheName)) {
            console.log('[SW v9.1] Purgando caché obsoleta:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. INTERCEPTOR DE PETICIONES (FETCH MULTI-ESTRATEGIA)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar esquemas que no sean http o https
  if (!req.url.startsWith('http')) return;

  // A. FUENTES TIPOGRÁFICAS (Google Fonts / GStatic): Cache-First en FONTS_CACHE
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(FONTS_CACHE).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        }).catch(() => {
          return new Response('', { status: 200, headers: { 'Content-Type': 'text/css' } });
        });
      })
    );
    return;
  }

  // B. ESCRITURAS SAGRADAS (/json_escrituras/): Cache-First con Lazy On-Demand en SCRIPTURES_CACHE
  if (url.pathname.includes('/json_escrituras/')) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(SCRIPTURES_CACHE).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        }).catch(async () => {
          // Fallback offline resiliente: intentar servir el mismo libro en español
          const pathSegments = url.pathname.split('/');
          const bookFile = pathSegments[pathSegments.length - 1];
          const fallbackPath = `./json_escrituras/es/${bookFile}`;
          const fallbackCached = await caches.match(fallbackPath);
          if (fallbackCached) return fallbackCached;
          
          return new Response(JSON.stringify({
            metadata: { offline: true, fallback: true },
            capitulos: []
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        });
      })
    );
    return;
  }

  // C. ORACIONES MAESTRAS (/json_idiomas/): Cache-First con Lazy On-Demand en PRAYERS_CACHE
  if (url.pathname.includes('/json_idiomas/')) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(PRAYERS_CACHE).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        }).catch(() => {
          // Fallback offline al compendio maestro en español
          return caches.match('./json_idiomas/oraciones_maestro_es.json');
        });
      })
    );
    return;
  }

  // D. RECURSOS LOCALES Y SHELL PWA: Network-First con Fallback a CORE_CACHE
  event.respondWith(
    fetch(req).then((networkRes) => {
      if (networkRes && networkRes.status === 200 && req.method === 'GET') {
        const copy = networkRes.clone();
        caches.open(CORE_CACHE).then((cache) => cache.put(req, copy));
      }
      return networkRes;
    }).catch(() => {
      return caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
