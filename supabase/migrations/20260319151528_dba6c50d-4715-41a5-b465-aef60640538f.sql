
ALTER TABLE public.vehicles
  ADD COLUMN price_per_mile numeric NOT NULL DEFAULT 3.5,
  ADD COLUMN minimum_fare numeric NOT NULL DEFAULT 65,
  ADD COLUMN hourly_rate numeric NOT NULL DEFAULT 65,
  ADD COLUMN private_tour_price numeric NOT NULL DEFAULT 120;
