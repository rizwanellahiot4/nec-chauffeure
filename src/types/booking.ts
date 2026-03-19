export interface Vehicle {
  id: string;
  name: string;
  image: string;
  passengers: number;
  luggage: number;
  priceMultiplier: number;
  description: string;
  pricePerMile: number;
  minimumFare: number;
  hourlyRate: number;
  privateTourPrice: number;
}

export type ServiceType =
  | 'chauffeur-hourly'
  | 'from-airport'
  | 'to-airport'
  | 'private-tour'
  | 'one-way-transfer';

export type ChildSeatType =
  | 'none'
  | 'rear-facing-seat'
  | 'forward-facing-seat'
  | 'booster-seat';

export interface BookingFormData {
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  childSeat: boolean;
  childSeatType: ChildSeatType;
  serviceType: ServiceType;
  durationHours: number;
  notes: string;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  geometry: [number, number][];
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  dbId?: string;
  customer: CustomerDetails;
  formData: BookingFormData;
  vehicle: Vehicle;
  route: RouteInfo;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface PricingConfig {
  baseFare: number;
  pricePerKm: number;
  hourlyRate: number;
  airportSurcharge: number;
  childSeatPrice: number;
  distanceUnit?: 'km' | 'mi';
  hourlyDistanceUnit?: 'kmh' | 'mph';
  fromAirportSurcharge?: number;
  toAirportSurcharge?: number;
  privateTourBaseFare?: number;
  hourlyChauffeurBaseFare?: number;
  rearFacingSeatPrice?: number;
  forwardFacingSeatPrice?: number;
  boosterSeatPrice?: number;
}

export interface BrandSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  foregroundColor: string;
  cardColor: string;
  mutedColor: string;
  borderColor: string;
  footerText: string;
  businessLogoUrl?: string | null;
}

export interface MapSettings {
  centerLat: number;
  centerLng: number;
  zoom: number;
  countryCode: string;
}
