import sedanImg from '@/assets/vehicle-sedan.png';
import suvImg from '@/assets/vehicle-suv.png';
import vanImg from '@/assets/vehicle-van.png';
import { Vehicle } from '@/types/booking';

export const defaultVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Executive Sedan',
    image: sedanImg,
    passengers: 3,
    luggage: 2,
    priceMultiplier: 1.0,
    description: 'Mercedes-Benz E-Class or similar',
    pricePerMile: 3.5,
    minimumFare: 65,
    hourlyRate: 65,
    privateTourPrice: 120,
  },
  {
    id: '2',
    name: 'Premium SUV',
    image: suvImg,
    passengers: 5,
    luggage: 4,
    priceMultiplier: 1.5,
    description: 'Range Rover or similar',
    pricePerMile: 4.5,
    minimumFare: 85,
    hourlyRate: 85,
    privateTourPrice: 180,
  },
  {
    id: '3',
    name: 'Luxury Van',
    image: vanImg,
    passengers: 7,
    luggage: 6,
    priceMultiplier: 1.8,
    description: 'Mercedes-Benz V-Class or similar',
    pricePerMile: 5.0,
    minimumFare: 95,
    hourlyRate: 95,
    privateTourPrice: 200,
  },
];
