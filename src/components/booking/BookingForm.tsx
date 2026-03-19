import { useBooking } from '@/contexts/BookingContext';
import AddressInput from './AddressInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
import NumberStepper from '@/components/ui/number-stepper';
import { CHILD_SEAT_TYPES, SERVICE_TYPES } from '@/lib/booking-options';
import { usePricingSettings } from '@/hooks/use-live-data';
import type { ChildSeatType, ServiceType } from '@/types/booking';

const BookingForm = () => {
  const { formData, setFormData, setStep, routeInfo } = useBooking();
  const { data: pricing } = usePricingSettings();

  const handlePickup = useCallback((address: string, lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, pickupAddress: address, pickupLat: lat, pickupLng: lng }));
  }, [setFormData]);

  const handleDropoff = useCallback((address: string, lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, dropoffAddress: address, dropoffLat: lat, dropoffLng: lng }));
  }, [setFormData]);

  const isHourlyService = formData.serviceType === 'chauffeur-hourly' || formData.serviceType === 'private-tour';
  const canProceed = formData.pickupAddress && formData.dropoffAddress && formData.date && formData.time && routeInfo;

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Service Type</label>
        <Select
          value={formData.serviceType}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceType: value as ServiceType }))}
        >
          <SelectTrigger className="h-11 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((service) => (
              <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AddressInput
        label={formData.serviceType === 'from-airport' ? 'Airport Pickup' : 'Pickup Location'}
        value={formData.pickupAddress}
        onChange={handlePickup}
        placeholder="Enter pickup address"
      />
      <AddressInput
        label={formData.serviceType === 'to-airport' ? 'Airport Dropoff' : 'Dropoff Location'}
        value={formData.dropoffAddress}
        onChange={handleDropoff}
        placeholder="Enter destination address"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Pickup Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="pl-10 h-11 bg-card"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Pickup Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberStepper
          label="Passengers"
          value={formData.passengers}
          min={1}
          max={7}
          onChange={(value) => setFormData((prev) => ({ ...prev, passengers: value }))}
        />
        <NumberStepper
          label="Luggage"
          value={formData.luggage}
          min={0}
          max={10}
          onChange={(value) => setFormData((prev) => ({ ...prev, luggage: value }))}
        />
      </div>

      {isHourlyService && (
        <NumberStepper
          label="Number of Hours"
          value={formData.durationHours}
          min={1}
          max={24}
          onChange={(value) => setFormData((prev) => ({ ...prev, durationHours: value }))}
          helperText={`Charged using ${pricing?.distanceUnit === 'mi' ? 'mile' : 'kilometer'} pricing and hourly rate.`}
        />
      )}

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Child Seat</label>
        <Select
          value={formData.childSeatType}
          onValueChange={(value) => setFormData((prev) => ({
            ...prev,
            childSeatType: value as ChildSeatType,
            childSeat: value !== 'none',
          }))}
        >
          <SelectTrigger className="h-11 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHILD_SEAT_TYPES.map((seat) => (
              <SelectItem key={seat.value} value={seat.value}>{seat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Special Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Flight number, tour requests, preferred chauffeur notes..."
          className="bg-card resize-none"
          rows={2}
        />
      </div>

      {routeInfo && (
        <div className="flex items-center gap-4 bg-secondary rounded-lg p-3 text-sm">
          <span className="font-medium">{routeInfo.distance.toFixed(1)} mi</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">~{Math.round(routeInfo.duration)} min</span>
        </div>
      )}

      <Button
        variant="gold"
        size="lg"
        className="w-full"
        disabled={!canProceed}
        onClick={() => setStep(2)}
      >
        Select Vehicle <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default BookingForm;
