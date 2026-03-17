import React, { createContext, useContext, useMemo, useState } from 'react';
import { BookingFormData, RouteInfo, Vehicle, CustomerDetails, PricingConfig } from '@/types/booking';
import { usePricingSettings } from '@/hooks/use-live-data';

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
  pickupAddress: '',
  dropoffAddress: '',
  pickupLat: 0,
  pickupLng: 0,
  dropoffLat: 0,
  dropoffLng: 0,
  date: '',
  time: '',
  passengers: 1,
  luggage: 0,
  childSeat: false,
  childSeatType: 'none',
  serviceType: 'one-way-transfer',
  durationHours: 2,
  notes: '',
};

const defaultPricing: PricingConfig = {
  baseFare: 15,
  pricePerKm: 2.5,
  hourlyRate: 65,
  airportSurcharge: 20,
  childSeatPrice: 10,
  distanceUnit: 'km',
  hourlyDistanceUnit: 'kmh',
  fromAirportSurcharge: 20,
  toAirportSurcharge: 20,
  privateTourBaseFare: 120,
  hourlyChauffeurBaseFare: 65,
  rearFacingSeatPrice: 15,
  forwardFacingSeatPrice: 12,
  boosterSeatPrice: 10,
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
  const { data: livePricing } = usePricingSettings();
  const pricing = livePricing ?? defaultPricing;

  const calculatePrice = useMemo(
    () => (vehicle: Vehicle, route: RouteInfo, fd: BookingFormData) => {
      const distanceCharge = route.distance * pricing.pricePerKm;
      let price = pricing.baseFare + distanceCharge;

      if (fd.serviceType === 'chauffeur-hourly') {
        price = (pricing.hourlyChauffeurBaseFare ?? pricing.hourlyRate) + fd.durationHours * pricing.hourlyRate;
      }

      if (fd.serviceType === 'private-tour') {
        price = (pricing.privateTourBaseFare ?? pricing.baseFare) + fd.durationHours * pricing.hourlyRate;
      }

      if (fd.serviceType === 'from-airport') {
        price += pricing.fromAirportSurcharge ?? pricing.airportSurcharge;
      }

      if (fd.serviceType === 'to-airport') {
        price += pricing.toAirportSurcharge ?? pricing.airportSurcharge;
      }

      if (fd.childSeatType === 'rear-facing-seat') {
        price += pricing.rearFacingSeatPrice ?? pricing.childSeatPrice;
      }

      if (fd.childSeatType === 'forward-facing-seat') {
        price += pricing.forwardFacingSeatPrice ?? pricing.childSeatPrice;
      }

      if (fd.childSeatType === 'booster-seat') {
        price += pricing.boosterSeatPrice ?? pricing.childSeatPrice;
      }

      price *= vehicle.priceMultiplier;
      return Math.round(price * 100) / 100;
    },
    [pricing],
  );

  return (
    <BookingContext.Provider
      value={{
        step,
        setStep,
        formData,
        setFormData,
        routeInfo,
        setRouteInfo,
        selectedVehicle,
        setSelectedVehicle,
        customerDetails,
        setCustomerDetails,
        pricing,
        calculatePrice,
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
