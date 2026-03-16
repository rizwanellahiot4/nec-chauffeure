-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper to check admin role without recursive RLS issues
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Timestamp helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  passengers INTEGER NOT NULL CHECK (passengers > 0),
  luggage INTEGER NOT NULL CHECK (luggage >= 0),
  price_multiplier NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK (price_multiplier > 0),
  description TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Brand settings singleton
CREATE TABLE public.brand_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  business_logo_url TEXT,
  business_email TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_address TEXT NOT NULL,
  primary_brand_color TEXT NOT NULL,
  secondary_brand_color TEXT NOT NULL,
  footer_copyright_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT brand_settings_singleton CHECK (id = '11111111-1111-1111-1111-111111111111')
);

ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_brand_settings_updated_at
BEFORE UPDATE ON public.brand_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Pricing settings singleton
CREATE TABLE public.pricing_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_fare NUMERIC(10,2) NOT NULL DEFAULT 15 CHECK (base_fare >= 0),
  price_per_km NUMERIC(10,2) NOT NULL DEFAULT 2.5 CHECK (price_per_km >= 0),
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 65 CHECK (hourly_rate >= 0),
  airport_surcharge NUMERIC(10,2) NOT NULL DEFAULT 20 CHECK (airport_surcharge >= 0),
  child_seat_price NUMERIC(10,2) NOT NULL DEFAULT 10 CHECK (child_seat_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pricing_settings_singleton CHECK (id = '22222222-2222-2222-2222-222222222222')
);

ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_pricing_settings_updated_at
BEFORE UPDATE ON public.pricing_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Map settings singleton
CREATE TABLE public.map_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_lat NUMERIC(9,6) NOT NULL DEFAULT 40.712800,
  center_lng NUMERIC(9,6) NOT NULL DEFAULT -74.006000,
  zoom INTEGER NOT NULL DEFAULT 12 CHECK (zoom BETWEEN 1 AND 20),
  country_code TEXT NOT NULL DEFAULT 'us',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT map_settings_singleton CHECK (id = '33333333-3333-3333-3333-333333333333')
);

ALTER TABLE public.map_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_map_settings_updated_at
BEFORE UPDATE ON public.map_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT NOT NULL UNIQUE DEFAULT upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 10)),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  pickup_lat NUMERIC(9,6) NOT NULL,
  pickup_lng NUMERIC(9,6) NOT NULL,
  dropoff_lat NUMERIC(9,6) NOT NULL,
  dropoff_lng NUMERIC(9,6) NOT NULL,
  pickup_at TIMESTAMPTZ NOT NULL,
  passengers INTEGER NOT NULL CHECK (passengers > 0),
  luggage INTEGER NOT NULL CHECK (luggage >= 0),
  child_seat BOOLEAN NOT NULL DEFAULT false,
  service_type TEXT NOT NULL CHECK (service_type IN ('one-way', 'hourly', 'airport')),
  notes TEXT NOT NULL DEFAULT '',
  route_distance_km NUMERIC(10,2) NOT NULL CHECK (route_distance_km >= 0),
  route_duration_minutes NUMERIC(10,2) NOT NULL CHECK (route_duration_minutes >= 0),
  route_geometry JSONB NOT NULL DEFAULT '[]'::jsonb,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_name_snapshot TEXT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_bookings_pickup_at ON public.bookings(pickup_at);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX idx_bookings_created_by ON public.bookings(created_by);

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: user_roles
CREATE POLICY "Admins can view user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policies: vehicles
CREATE POLICY "Vehicles are viewable by everyone"
ON public.vehicles
FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert vehicles"
ON public.vehicles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vehicles"
ON public.vehicles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vehicles"
ON public.vehicles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policies: singleton settings
CREATE POLICY "Brand settings are viewable by everyone"
ON public.brand_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can update brand settings"
ON public.brand_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Pricing settings are viewable by everyone"
ON public.pricing_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can update pricing settings"
ON public.pricing_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Map settings are viewable by everyone"
ON public.map_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can update map settings"
ON public.map_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policies: bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (created_by IS NULL OR created_by = auth.uid());

CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Seed singleton settings rows
INSERT INTO public.brand_settings (
  id,
  business_name,
  business_email,
  business_phone,
  business_address,
  primary_brand_color,
  secondary_brand_color,
  footer_copyright_text
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'EliteDrive',
  'hello@elitedrive.com',
  '+1 (555) 123-4567',
  'New York, NY',
  '222.2 47.4% 11.2%',
  '39 48% 56%',
  '© EliteDrive. All rights reserved.'
);

INSERT INTO public.pricing_settings (
  id,
  base_fare,
  price_per_km,
  hourly_rate,
  airport_surcharge,
  child_seat_price
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  15,
  2.5,
  65,
  20,
  10
);

INSERT INTO public.map_settings (
  id,
  center_lat,
  center_lng,
  zoom,
  country_code
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  40.712800,
  -74.006000,
  12,
  'us'
);