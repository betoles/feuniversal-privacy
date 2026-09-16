/**
 * SOLAR & SACRED ORIENTATION SERVICE - CERO PERMISOS
 * FeUniversal - Faith & Prayers
 * 
 * Determina huso horario mediante Intl.DateTimeFormat (0 permisos requeridos en Google Play/iOS)
 * y calcula matematicamente las horas solares (Alba/Ocaso) y rumbos sagrados (Qibla, Oriente, Zen).
 */

export const WORLD_CITIES_COORDINATES = {
  // América Latina & Caribe
  "America/Mexico_City": { name: "Ciudad de México", lat: 19.4326, lon: -99.1332 },
  "America/Monterrey": { name: "Monterrey", lat: 25.6866, lon: -100.3161 },
  "America/Guadalajara": { name: "Guadalajara", lat: 20.6597, lon: -103.3496 },
  "America/Tijuana": { name: "Tijuana", lat: 32.5149, lon: -117.0382 },
  "America/Bogota": { name: "Bogotá", lat: 4.7110, lon: -74.0721 },
  "America/Santiago": { name: "Santiago de Chile", lat: -33.4489, lon: -70.6693 },
  "America/Sao_Paulo": { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
  "America/New_York": { name: "New York", lat: 40.7128, lon: -74.0060 },
  "America/Los_Angeles": { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  "America/Chicago": { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  "Europe/Madrid": { name: "Madrid", lat: 40.4168, lon: -3.7038 },
  "Europe/Paris": { name: "Paris", lat: 48.8566, lon: 2.3522 },
  "Europe/Rome": { name: "Roma", lat: 41.9028, lon: 12.4964 },
  "Europe/Berlin": { name: "Berlin", lat: 52.5200, lon: 13.4050 },
  "Europe/London": { name: "London", lat: 51.5074, lon: -0.1278 },
  "Europe/Moscow": { name: "Moscú", lat: 55.7558, lon: 37.6173 },
  "Asia/Riyadh": { name: "Riyadh", lat: 24.7136, lon: 46.6753 },
  "Asia/Jerusalem": { name: "Jerusalem", lat: 31.7683, lon: 35.2137 },
  "Asia/Dubai": { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  "Asia/Tokyo": { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  "Asia/Kolkata": { name: "New Delhi", lat: 28.6139, lon: 77.2090 },
  "Asia/Shanghai": { name: "Beijing / Shanghai", lat: 31.2304, lon: 121.4737 },
  "Asia/Dhaka": { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
  "Asia/Jakarta": { name: "Jakarta", lat: -6.2088, lon: 106.8456 },
  "Asia/Manila": { name: "Manila", lat: 14.5995, lon: 120.9842 },
  "Africa/Cairo": { name: "El Cairo", lat: 30.0444, lon: 31.2357 }
};

const SACRED_DESTINATIONS = {
  MECCA_KAABA: { lat: 21.4225, lon: 39.8262 },
  JERUSALEM: { lat: 31.7767, lon: 35.2345 },
  VATICAN: { lat: 41.9029, lon: 12.4534 },
  VARANASI_GANGES: { lat: 25.3176, lon: 82.9739 },
  MOUNT_FUJI: { lat: 35.3606, lon: 138.7274 }
};

export class SolarService {
  static getUserTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Mexico_City";
    } catch (e) {
      return "America/Mexico_City";
    }
  }

  static getUserCoordinates() {
    const tz = this.getUserTimezone();
    if (WORLD_CITIES_COORDINATES[tz]) {
      return WORLD_CITIES_COORDINATES[tz];
    }
    const cleanName = tz.split("/")[1] ? tz.split("/")[1].replace(/_/g, " ") : "Ciudad Devocional";
    return { name: cleanName, lat: 19.4326, lon: -99.1332 };
  }

  static getSunTimes(date = new Date()) {
    const coords = this.getUserCoordinates();
    const lat = coords.lat;
    const lon = coords.lon;

    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
    const latRad = lat * (Math.PI / 180);
    const decRad = declination * (Math.PI / 180);

    const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad);
    let hourAngle = Math.acos(Math.max(-1, Math.min(1, cosHourAngle))) * (180 / Math.PI);

    const solarNoonUTC = 12 - (lon / 15);
    const sunriseUTC = (solarNoonUTC - (hourAngle / 15) + 24) % 24;
    const sunsetUTC = (solarNoonUTC + (hourAngle / 15) + 24) % 24;

    const tzOffsetHours = -(date.getTimezoneOffset() / 60);
    const localSunriseHours = (sunriseUTC + tzOffsetHours + 24) % 24;
    const localSunsetHours = (sunsetUTC + tzOffsetHours + 24) % 24;

    const formatHour = (h) => {
      const hours = Math.floor(h);
      const minutes = Math.floor((h - hours) * 60);
      return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
    };

    return {
      cityName: coords.name,
      sunrise: formatHour(localSunriseHours),
      sunset: formatHour(localSunsetHours),
      sunriseDec: localSunriseHours,
      sunsetDec: localSunsetHours
    };
  }

  static calculateGreatCircleBearing(lat1, lon1, lat2, lon2) {
    const toRad = deg => (deg * Math.PI) / 180;
    const toDeg = rad => (rad * 180) / Math.PI;

    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaLambda = toRad(lon2 - lon1);

    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

    const theta = Math.atan2(y, x);
    return Math.round((toDeg(theta) + 360) % 360);
  }

  static getQiblaBearing() {
    const userCoords = this.getUserCoordinates();
    const mecca = SACRED_DESTINATIONS.MECCA_KAABA;
    return this.calculateGreatCircleBearing(userCoords.lat, userCoords.lon, mecca.lat, mecca.lon);
  }

  static getSunriseBearing() {
    return 90;
  }

  static getZenNorthBearing() {
    return 0;
  }

  static getCurrentSunAzimuth(date = new Date()) {
    const coords = this.getUserCoordinates();
    const lat = coords.lat;
    const lon = coords.lon;

    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
    const latRad = (lat * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;

    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const solarTime = (utcHours + (lon / 15) + 24) % 24;
    const hourAngle = (solarTime - 12) * 15;
    const hourAngleRad = (hourAngle * Math.PI) / 180;

    const sinAltitude = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad);
    const altitudeRad = Math.asin(Math.max(-1, Math.min(1, sinAltitude)));

    const cosAzimuth = (Math.sin(decRad) - Math.sin(latRad) * Math.sin(altitudeRad)) / (Math.max(0.0001, Math.cos(latRad) * Math.cos(altitudeRad)));
    let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * (180 / Math.PI);

    if (Math.sin(hourAngleRad) > 0) {
      azimuth = (360 - azimuth + 360) % 360;
    }

    return Math.round(azimuth);
  }
}