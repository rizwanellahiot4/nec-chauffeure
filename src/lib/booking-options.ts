export const SERVICE_TYPES = [
  { value: 'general', label: 'General Transfer' },
  { value: 'chauffeur-hourly', label: 'Chauffeur by the Hour' },
  { value: 'from-airport', label: 'From Airport' },
  { value: 'to-airport', label: 'To Airport' },
  { value: 'private-tour', label: 'Private Tours' },
  { value: 'one-way-transfer', label: 'One Way Transfers' },
] as const;

export const CHILD_SEAT_TYPES = [
  { value: 'none', label: 'No child seat' },
  { value: 'rear-facing-seat', label: 'Rear Facing Seat (Infant)' },
  { value: 'forward-facing-seat', label: 'Forward Facing Seat (Toddler)' },
  { value: 'booster-seat', label: 'Booster Seat' },
] as const;

export const DISTANCE_UNITS = [
  { value: 'km', label: 'Kilometers (km)' },
  { value: 'mi', label: 'Miles (mi)' },
] as const;

export const formatServiceType = (serviceType: string) =>
  SERVICE_TYPES.find((service) => service.value === serviceType)?.label ?? serviceType;

export const formatChildSeatType = (seatType: string) =>
  CHILD_SEAT_TYPES.find((seat) => seat.value === seatType)?.label ?? seatType;
