-- Expand pricing settings for richer booking options and admin-controlled unit system
ALTER TABLE public.pricing_settings
ADD COLUMN IF NOT EXISTS distance_unit text NOT NULL DEFAULT 'km',
ADD COLUMN IF NOT EXISTS hourly_distance_unit text NOT NULL DEFAULT 'mph',
ADD COLUMN IF NOT EXISTS from_airport_surcharge numeric NOT NULL DEFAULT 20,
ADD COLUMN IF NOT EXISTS to_airport_surcharge numeric NOT NULL DEFAULT 20,
ADD COLUMN IF NOT EXISTS private_tour_base_fare numeric NOT NULL DEFAULT 120,
ADD COLUMN IF NOT EXISTS hourly_chauffeur_base_fare numeric NOT NULL DEFAULT 65,
ADD COLUMN IF NOT EXISTS rear_facing_seat_price numeric NOT NULL DEFAULT 15,
ADD COLUMN IF NOT EXISTS forward_facing_seat_price numeric NOT NULL DEFAULT 12,
ADD COLUMN IF NOT EXISTS booster_seat_price numeric NOT NULL DEFAULT 10;

-- Expand bookings table to support richer service and child seat options
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS duration_hours numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS child_seat_type text NOT NULL DEFAULT 'none';

-- Normalize any legacy data
UPDATE public.bookings
SET child_seat_type = CASE
  WHEN child_seat = true AND child_seat_type = 'none' THEN 'booster-seat'
  ELSE child_seat_type
END;

UPDATE public.bookings
SET service_type = CASE
  WHEN service_type = 'airport' THEN 'from-airport'
  WHEN service_type = 'one-way' THEN 'one-way-transfer'
  ELSE service_type
END;

-- Ensure allowed booking values
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_service_type_check;

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_service_type_check
CHECK (service_type IN ('chauffeur-hourly', 'from-airport', 'to-airport', 'private-tour', 'one-way-transfer'));

ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_child_seat_type_check;

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_child_seat_type_check
CHECK (child_seat_type IN ('none', 'rear-facing-seat', 'forward-facing-seat', 'booster-seat'));

-- Ensure updated_at stays accurate
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_settings_updated_at ON public.pricing_settings;
CREATE TRIGGER update_pricing_settings_updated_at
BEFORE UPDATE ON public.pricing_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_brand_settings_updated_at ON public.brand_settings;
CREATE TRIGGER update_brand_settings_updated_at
BEFORE UPDATE ON public.brand_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_map_settings_updated_at ON public.map_settings;
CREATE TRIGGER update_map_settings_updated_at
BEFORE UPDATE ON public.map_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();