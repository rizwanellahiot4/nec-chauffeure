ALTER TABLE public.vehicles
  ADD COLUMN rear_facing_seat_price numeric NOT NULL DEFAULT 15,
  ADD COLUMN forward_facing_seat_price numeric NOT NULL DEFAULT 12,
  ADD COLUMN booster_seat_price numeric NOT NULL DEFAULT 10;