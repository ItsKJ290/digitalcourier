/**
 * Mock geocoder for demo purposes.
 * Converts a human-readable location string into basic lat/lng coordinates.
 *
 * Later we can replace this with a real geocoding service or ML microservice.
 */
const CITY_MAP = {
  delhi: { lat: 28.6139, lng: 77.209 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  pune: { lat: 18.5204, lng: 73.8567 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
};

function deterministicFallback(text) {
  const s = String(text || '').toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;

  // Map hash into lat [-60, 60], lng [-180, 180]
  const lat = ((hash % 1200000) / 1200000) * 120 - 60;
  const lng = (((hash / 1200000) % 3600000) / 3600000) * 360 - 180;

  return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) };
}

function geocodeLocation(locationText) {
  const text = String(locationText || '').toLowerCase();
  if (!text) return { lat: 0, lng: 0, source: 'empty' };

  // If location contains a known city name, use it.
  for (const key of Object.keys(CITY_MAP)) {
    if (text.includes(key)) {
      return { ...CITY_MAP[key], source: 'mock_city_map' };
    }
  }

  // Strip after comma to match patterns like "Mumbai, MH"
  const firstPart = text.split(',')[0].trim();
  if (firstPart && CITY_MAP[firstPart]) {
    return { ...CITY_MAP[firstPart], source: 'mock_city_map_first_part' };
  }

  // Fallback: deterministic (so coordinates are stable across refreshes)
  const { lat, lng } = deterministicFallback(text);
  return { lat, lng, source: 'deterministic_fallback' };
}

module.exports = { geocodeLocation };

