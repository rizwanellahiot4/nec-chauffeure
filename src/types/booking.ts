export interface Vehicle {
  id: string;
  name: string;
  image: string;
  passengers: number;
  luggage: number;
  priceMultiplier: number;
  description: string;
}

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
  serviceType: 'one-way' | 'hourly' | 'airport';
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
}

export interface BrandSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
}

export interface MapSettings {
  centerLat: number;
  centerLng: number;
  zoom: number;
  countryCode: string;
}
