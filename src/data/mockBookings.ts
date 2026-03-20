import { Booking } from '@/types/booking';

export const mockBookings: Booking[] = [
  {
    id: 'BK-2401',
    customer: { fullName: 'James Wilson', email: 'james.w@email.com', phone: '+1 555 0123' },
    formData: {
      pickupAddress: 'The Ritz-Carlton, Central Park',
      dropoffAddress: 'JFK International Airport, Terminal 4',
      pickupLat: 40.7648,
      pickupLng: -73.9808,
      dropoffLat: 40.6413,
      dropoffLng: -73.7781,
      date: '2026-03-17',
      time: '08:30',
      passengers: 2,
      luggage: 3,
      childSeat: false,
      childSeatType: 'none',
      serviceType: 'from-airport',
      durationHours: 0,
      notes: 'Flight AA 205',
    },
    vehicle: { id: '1', name: 'Executive Sedan', image: '', passengers: 3, luggage: 2, priceMultiplier: 1.0, description: 'Mercedes-Benz E-Class', pricePerMile: 3.5, minimumFare: 65, hourlyRate: 65, privateTourPrice: 120, rearFacingSeatPrice: 15, forwardFacingSeatPrice: 12, boosterSeatPrice: 10 },
    route: { distance: 31.2, duration: 48, geometry: [] },
    totalPrice: 125.0,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2026-03-15T10:30:00Z',
  },
];
