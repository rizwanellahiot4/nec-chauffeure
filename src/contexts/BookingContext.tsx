import React, { createContext, useContext, useState } from 'react';
import { BookingFormData, RouteInfo, Vehicle, CustomerDetails, PricingConfig } from '@/types/booking';

interface BookingContextType {
  step: number;
  setStep: (s: number) => void;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  routeInfo: RouteInfo | null;
  setRouteInfo: (r: RouteInfo | null) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  customerDetails: CustomerDetails;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerDetails>>;
  pricing: PricingConfig;
  calculatePrice: (vehicle: Vehicle, route: RouteInfo, formData: BookingFormData) => number;
  totalPrice: number;
  setTotalPrice: (p: number) => void;
}

const defaultFormData: BookingFormData = {
  pickupAddress: '', dropoffAddress: '',
  pickupLat: 0, pickupLng: 0, dropoffLat: 0, dropoffLng: 0,
  date: '', time: '', passengers: 1, luggage: 0,
  childSeat: false, serviceType: 'one-way', notes: '',
};

const defaultPricing: PricingConfig = {
  baseFare: 15, pricePerKm: 2.5, hourlyRate: 65,
  airportSurcharge: 20, childSeatPrice: 10,
};

const BookingContext = createContext<BookingContextType | null>(null);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(defaultFormData);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ fullName: '', email: '', phone: '' });
  const [totalPrice, setTotalPrice] = useState(0);
  const pricing = defaultPricing;

  const calculatePrice = (vehicle: Vehicle, route: RouteInfo, fd: BookingFormData) => {
    let price = pricing.baseFare + route.distance * pricing.pricePerKm;
    price *= vehicle.priceMultiplier;
    if (fd.serviceType === 'airport') price += pricing.airportSurcharge;
    if (fd.childSeat) price += pricing.childSeatPrice;
    return Math.round(price * 100) / 100;
  };

  return (
    <BookingContext.Provider value={{
      step, setStep, formData, setFormData, routeInfo, setRouteInfo,
      selectedVehicle, setSelectedVehicle, customerDetails, setCustomerDetails,
      pricing, calculatePrice, totalPrice, setTotalPrice,
    }}>
      {children}
    </BookingContext.Provider>
  );
};
