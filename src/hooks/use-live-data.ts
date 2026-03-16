import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { defaultVehicles } from '@/data/vehicles';
import type { Booking, BrandSettings, MapSettings, PricingConfig, Vehicle } from '@/types/booking';

const singletonQuery = async <T,>(table: 'brand_settings' | 'pricing_settings' | 'map_settings', fallback: T): Promise<T> => {
  const { data, error } = await supabase.from(table).select('*').limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return fallback;
  return data as T;
};

const subscribeToTable = (
  queryKey: string[],
  table: string,
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  const channel = supabase
    .channel(`realtime-${table}-${queryKey.join('-')}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
      queryClient.invalidateQueries({ queryKey });
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const mapBookingRowToBooking = (row: Record<string, any>): Booking => {
  const pickupAt = new Date(row.pickup_at);
  return {
    id: row.booking_reference ?? row.id,
    dbId: row.id,
    customer: {
      fullName: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
    },
    formData: {
      pickupAddress: row.pickup_address,
      dropoffAddress: row.dropoff_address,
      pickupLat: Number(row.pickup_lat),
      pickupLng: Number(row.pickup_lng),
      dropoffLat: Number(row.dropoff_lat),
      dropoffLng: Number(row.dropoff_lng),
      date: pickupAt.toISOString().split('T')[0],
      time: pickupAt.toISOString().slice(11, 16),
      passengers: row.passengers,
      luggage: row.luggage,
      childSeat: Boolean(row.child_seat),
      childSeatType: row.child_seat_type ?? 'none',
      serviceType: row.service_type,
      durationHours: Number(row.duration_hours ?? 0),
      notes: row.notes ?? '',
    },
    vehicle: {
      id: row.vehicle_id ?? 'unknown',
      name: row.vehicle_name_snapshot,
      image: '',
      passengers: row.passengers,
      luggage: row.luggage,
      priceMultiplier: 1,
      description: row.vehicle_name_snapshot,
    },
    route: {
      distance: Number(row.route_distance_km),
      duration: Number(row.route_duration_minutes),
      geometry: Array.isArray(row.route_geometry) ? row.route_geometry : [],
    },
    totalPrice: Number(row.total_price),
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  };
};

export const useBrandSettings = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['brand-settings'],
    queryFn: () => singletonQuery<BrandSettings>('brand_settings', {
      businessName: 'EliteDrive',
      businessEmail: 'hello@elitedrive.com',
      businessPhone: '+1 (555) 123-4567',
      businessAddress: 'New York, NY',
      primaryColor: '222.2 47.4% 11.2%',
      secondaryColor: '39 48% 56%',
      footerText: '© EliteDrive. All rights reserved.',
      businessLogoUrl: null,
    }),
    staleTime: 10_000,
  });

  useEffect(() => subscribeToTable(['brand-settings'], 'brand_settings', queryClient), [queryClient]);
  return query;
};

export const usePricingSettings = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['pricing-settings'],
    queryFn: () => singletonQuery<PricingConfig>('pricing_settings', {
      baseFare: 15,
      pricePerKm: 2.5,
      hourlyRate: 65,
      airportSurcharge: 20,
      childSeatPrice: 10,
      distanceUnit: 'km',
      fromAirportSurcharge: 20,
      toAirportSurcharge: 20,
      privateTourBaseFare: 120,
      hourlyChauffeurBaseFare: 65,
      rearFacingSeatPrice: 15,
      forwardFacingSeatPrice: 12,
      boosterSeatPrice: 10,
    }),
    staleTime: 10_000,
  });

  useEffect(() => subscribeToTable(['pricing-settings'], 'pricing_settings', queryClient), [queryClient]);
  return query;
};

export const useMapSettings = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['map-settings'],
    queryFn: () => singletonQuery<MapSettings>('map_settings', {
      centerLat: 40.7128,
      centerLng: -74.006,
      zoom: 12,
      countryCode: 'us',
    }),
    staleTime: 10_000,
  });

  useEffect(() => subscribeToTable(['map-settings'], 'map_settings', queryClient), [queryClient]);
  return query;
};

export const useVehicles = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['vehicles'],
    queryFn: async (): Promise<Vehicle[]> => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!data?.length) return defaultVehicles;

      return data
        .filter((vehicle) => vehicle.is_active)
        .map((vehicle) => ({
          id: vehicle.id,
          name: vehicle.name,
          image: vehicle.image,
          passengers: vehicle.passengers,
          luggage: vehicle.luggage,
          priceMultiplier: Number(vehicle.price_multiplier),
          description: vehicle.description,
        }));
    },
  });

  useEffect(() => subscribeToTable(['vehicles'], 'vehicles', queryClient), [queryClient]);
  return query;
};

export const useAdminBookings = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map((row) => mapBookingRowToBooking(row as any));
    },
  });

  useEffect(() => subscribeToTable(['admin-bookings'], 'bookings', queryClient), [queryClient]);
  return query;
};
