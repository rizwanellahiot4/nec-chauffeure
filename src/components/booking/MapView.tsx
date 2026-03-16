import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useBooking } from '@/contexts/BookingContext';

// Fix default marker icons
const createIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const pickupIcon = createIcon('hsl(39, 48%, 56%)');
const dropoffIcon = createIcon('hsl(222.2, 47.4%, 11.2%)');

function MapUpdater() {
  const map = useMap();
  const { formData, routeInfo, setRouteInfo } = useBooking();
  const prevLocRef = useRef('');

  useEffect(() => {
    const key = `${formData.pickupLat},${formData.pickupLng}-${formData.dropoffLat},${formData.dropoffLng}`;
    if (key === prevLocRef.current) return;
    if (!formData.pickupLat || !formData.dropoffLat) return;
    prevLocRef.current = key;

    const bounds = L.latLngBounds(
      [formData.pickupLat, formData.pickupLng],
      [formData.dropoffLat, formData.dropoffLng]
    );
    map.fitBounds(bounds, { padding: [50, 50] });

    // Fetch route from OSRM
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${formData.pickupLng},${formData.pickupLat};${formData.dropoffLng},${formData.dropoffLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.[0]) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
          setRouteInfo({
            distance: route.distance / 1000,
            duration: route.duration / 60,
            geometry: coords,
          });
        }
      } catch (err) {
        console.error('Route fetch error:', err);
      }
    };
    fetchRoute();
  }, [formData.pickupLat, formData.pickupLng, formData.dropoffLat, formData.dropoffLng, map, setRouteInfo]);

  return null;
}

const MapView = () => {
  const { formData, routeInfo } = useBooking();
  const hasPickup = formData.pickupLat !== 0;
  const hasDropoff = formData.dropoffLat !== 0;

  const center = useMemo<[number, number]>(() => {
    if (hasPickup) return [formData.pickupLat, formData.pickupLng];
    return [40.7128, -74.006]; // NYC default
  }, [formData.pickupLat, formData.pickupLng, hasPickup]);

  return (
    <div className="h-full w-full min-h-[300px] rounded-lg overflow-hidden shadow-luxury">
      <MapContainer center={center} zoom={12} className="h-full w-full" zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater />
        {hasPickup && (
          <Marker position={[formData.pickupLat, formData.pickupLng]} icon={pickupIcon} />
        )}
        {hasDropoff && (
          <Marker position={[formData.dropoffLat, formData.dropoffLng]} icon={dropoffIcon} />
        )}
        {routeInfo && routeInfo.geometry.length > 0 && (
          <Polyline
            positions={routeInfo.geometry}
            pathOptions={{ color: 'hsl(39, 48%, 56%)', weight: 4, opacity: 0.8 }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
