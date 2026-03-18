import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { defaultVehicles } from '@/data/vehicles';
import type { Booking, BrandSettings, MapSettings, PricingConfig, Vehicle } from '@/types/booking';

const defaultBrandSettings: BrandSettings = {
  businessName: 'EliteDrive',
  businessEmail: 'hello@elitedrive.com',
  businessPhone: '+1 (555) 123-4567',
  businessAddress: 'New York, NY',
  primaryColor: '222.2 47.4% 11.2%',
  secondaryColor: '39 48% 56%',
  backgroundColor: '210 40% 98%',
  foregroundColor: '222.2 47.4% 11.2%',
  cardColor: '0 0% 100%',
  mutedColor: '210 40% 96.1%',
  borderColor: '214.3 31.8% 91.4%',
  footerText: '© EliteDrive. All rights reserved.',
  businessLogoUrl: null,
};

const defaultPricingSettings: PricingConfig = {
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
  hourlyDistanceUnit: 'kmh',
};

const defaultMapSettings: MapSettings = {
  centerLat: 40.7128,
  centerLng: -74.006,
  zoom: 12,
  countryCode: 'us',
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

const mapBrandSettingsRow = (row?: Record<string, any> | null): BrandSettings => {
  if (!row) return defaultBrandSettings;

  return {
    businessName: row.business_name ?? defaultBrandSettings.businessName,
    businessEmail: row.business_email ?? defaultBrandSettings.businessEmail,
    businessPhone: row.business_phone ?? defaultBrandSettings.businessPhone,
    businessAddress: row.business_address ?? defaultBrandSettings.businessAddress,
    primaryColor: row.primary_brand_color ?? defaultBrandSettings.primaryColor,
    secondaryColor: row.secondary_brand_color ?? defaultBrandSettings.secondaryColor,
    footerText: row.footer_copyright_text ?? defaultBrandSettings.footerText,
    businessLogoUrl: row.business_logo_url ?? null,
  };
};

const mapPricingSettingsRow = (row?: Record<string, any> | null): PricingConfig => {
  if (!row) return defaultPricingSettings;

  return {
    baseFare: Number(row.base_fare ?? defaultPricingSettings.baseFare),
    pricePerKm: Number(row.price_per_km ?? defaultPricingSettings.pricePerKm),
    hourlyRate: Number(row.hourly_rate ?? defaultPricingSettings.hourlyRate),
    airportSurcharge: Number(row.airport_surcharge ?? defaultPricingSettings.airportSurcharge),
    childSeatPrice: Number(row.child_seat_price ?? defaultPricingSettings.childSeatPrice),
    distanceUnit: row.distance_unit === 'mi' ? 'mi' : 'km',
    fromAirportSurcharge: Number(row.from_airport_surcharge ?? defaultPricingSettings.fromAirportSurcharge),
    toAirportSurcharge: Number(row.to_airport_surcharge ?? defaultPricingSettings.toAirportSurcharge),
    privateTourBaseFare: Number(row.private_tour_base_fare ?? defaultPricingSettings.privateTourBaseFare),
    hourlyChauffeurBaseFare: Number(row.hourly_chauffeur_base_fare ?? defaultPricingSettings.hourlyChauffeurBaseFare),
    rearFacingSeatPrice: Number(row.rear_facing_seat_price ?? defaultPricingSettings.rearFacingSeatPrice),
    forwardFacingSeatPrice: Number(row.forward_facing_seat_price ?? defaultPricingSettings.forwardFacingSeatPrice),
    boosterSeatPrice: Number(row.booster_seat_price ?? defaultPricingSettings.boosterSeatPrice),
    hourlyDistanceUnit: row.hourly_distance_unit ?? defaultPricingSettings.hourlyDistanceUnit,
  };
};

const mapMapSettingsRow = (row?: Record<string, any> | null): MapSettings => {
  if (!row) return defaultMapSettings;

  return {
    centerLat: Number(row.center_lat ?? defaultMapSettings.centerLat),
    centerLng: Number(row.center_lng ?? defaultMapSettings.centerLng),
    zoom: Number(row.zoom ?? defaultMapSettings.zoom),
    countryCode: row.country_code ?? defaultMapSettings.countryCode,
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
      passengers: Number(row.passengers),
      luggage: Number(row.luggage),
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
      passengers: Number(row.passengers),
      luggage: Number(row.luggage),
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
    queryFn: async () => {
      const { data, error } = await supabase.from('brand_settings').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return mapBrandSettingsRow(data as Record<string, any> | null);
    },
    staleTime: 10_000,
  });

  useEffect(() => subscribeToTable(['brand-settings'], 'brand_settings', queryClient), [queryClient]);
  return query;
};

export const usePricingSettings = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['pricing-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pricing_settings').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return mapPricingSettingsRow(data as Record<string, any> | null);
    },
    staleTime: 10_000,
  });

  useEffect(() => subscribeToTable(['pricing-settings'], 'pricing_settings', queryClient), [queryClient]);
  return query;
};

export const useMapSettings = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['map-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('map_settings').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return mapMapSettingsRow(data as Record<string, any> | null);
    },
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

export const useAdminVehicles = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: async (): Promise<Vehicle[]> => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((vehicle) => ({
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

  useEffect(() => subscribeToTable(['admin-vehicles'], 'vehicles', queryClient), [queryClient]);
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
