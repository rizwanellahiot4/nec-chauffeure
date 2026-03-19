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
  serviceType: 'general',
  durationHours: 2,
  notes: '',
};

const defaultPricing: PricingConfig = {
  baseFare: 0,
  pricePerKm: 0,
  hourlyRate: 65,
  airportSurcharge: 0,
  childSeatPrice: 10,
  distanceUnit: 'mi',
  hourlyDistanceUnit: 'mph',
  fromAirportSurcharge: 0,
  toAirportSurcharge: 0,
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
      let price = 0;

      // Chauffeur by the Hour: only vehicle hourly rate × hours
      if (fd.serviceType === 'chauffeur-hourly') {
        price = vehicle.hourlyRate * fd.durationHours;
        return Math.round(price * 100) / 100;
      }

      // Private Tour: vehicle's private tour price
      if (fd.serviceType === 'private-tour') {
        price = vehicle.privateTourPrice;
        return Math.round(price * 100) / 100;
      }

      // All other service types (general, from-airport, to-airport, one-way-transfer):
      // If distance < 10 miles → minimum fare, else price per mile
      const distanceMiles = route.distance;
      if (distanceMiles < 10) {
        price = vehicle.minimumFare;
      } else {
        price = distanceMiles * vehicle.pricePerMile;
      }

      // Child seat add-ons (from global pricing)
      if (fd.childSeatType === 'rear-facing-seat') {
        price += pricing.rearFacingSeatPrice ?? pricing.childSeatPrice;
      }
      if (fd.childSeatType === 'forward-facing-seat') {
        price += pricing.forwardFacingSeatPrice ?? pricing.childSeatPrice;
      }
      if (fd.childSeatType === 'booster-seat') {
        price += pricing.boosterSeatPrice ?? pricing.childSeatPrice;
      }

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
