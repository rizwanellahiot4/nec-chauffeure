import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBooking } from '@/contexts/BookingContext';

const createIcon = (cssVariable: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:9999px;background:hsl(var(${cssVariable}));border:3px solid hsl(var(--card));box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const pickupIcon = createIcon('--accent');
const dropoffIcon = createIcon('--primary');

const MapView = () => {
  const { formData, routeInfo, setRouteInfo } = useBooking();
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const prevRouteKeyRef = useRef('');

  const hasPickup = formData.pickupLat !== 0;
  const hasDropoff = formData.dropoffLat !== 0;

  const center = useMemo<[number, number]>(() => {
    if (hasPickup) return [formData.pickupLat, formData.pickupLng];
    return [40.7128, -74.006];
  }, [formData.pickupLat, formData.pickupLng, hasPickup]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(center, 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      routeLayerRef.current = null;
    };
  }, [center]);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const map = mapRef.current;
    markersLayerRef.current.clearLayers();

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    const points: L.LatLngExpression[] = [];

    if (hasPickup) {
      const pickupPoint: L.LatLngExpression = [formData.pickupLat, formData.pickupLng];
      L.marker(pickupPoint, { icon: pickupIcon }).addTo(markersLayerRef.current);
      points.push(pickupPoint);
    }

    if (hasDropoff) {
      const dropoffPoint: L.LatLngExpression = [formData.dropoffLat, formData.dropoffLng];
      L.marker(dropoffPoint, { icon: dropoffIcon }).addTo(markersLayerRef.current);
      points.push(dropoffPoint);
    }

    if (routeInfo && routeInfo.geometry.length > 0) {
      routeLayerRef.current = L.polyline(routeInfo.geometry, {
        color: 'hsl(var(--accent))',
        weight: 4,
        opacity: 0.8,
      }).addTo(map);
    }

    if (points.length === 2) {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
    } else if (points.length === 1) {
      map.setView(points[0] as L.LatLngExpression, 12);
    } else {
      map.setView(center, 12);
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [center, formData.dropoffLat, formData.dropoffLng, formData.pickupLat, formData.pickupLng, hasDropoff, hasPickup, routeInfo]);

  useEffect(() => {
    if (!hasPickup || !hasDropoff) {
      prevRouteKeyRef.current = '';
      if (routeInfo) setRouteInfo(null);
      return;
    }

    const routeKey = `${formData.pickupLat},${formData.pickupLng}-${formData.dropoffLat},${formData.dropoffLng}`;
    if (routeKey === prevRouteKeyRef.current) return;
    prevRouteKeyRef.current = routeKey;

    const controller = new AbortController();

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${formData.pickupLng},${formData.pickupLat};${formData.dropoffLng},${formData.dropoffLat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: controller.signal });
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
        if ((err as Error).name !== 'AbortError') {
          console.error('Route fetch error:', err);
        }
      }
    };

    fetchRoute();

    return () => controller.abort();
  }, [formData.dropoffLat, formData.dropoffLng, formData.pickupLat, formData.pickupLng, hasDropoff, hasPickup, routeInfo, setRouteInfo]);

  return <div ref={mapElementRef} className="h-full w-full min-h-[300px] rounded-lg overflow-hidden shadow-luxury" />;
};

export default MapView;
