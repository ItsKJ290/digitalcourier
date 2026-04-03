import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix missing default marker icon URLs in many bundlers.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LocationMap({ map }) {
  const lat = map?.lat;
  const lng = map?.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  if (lat === 0 && lng === 0 && !map?.locationText) return null;

  const position = [lat, lng];
  const locationText = map?.locationText || 'Current Location';

  return (
    <div className="mapWrap">
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: 320, width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>
            <div style={{ fontWeight: 700 }}>{locationText}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

