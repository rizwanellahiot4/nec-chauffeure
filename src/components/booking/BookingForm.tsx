import { useBooking } from '@/contexts/BookingContext';
import AddressInput from './AddressInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Users, Briefcase, Baby, ArrowRight } from 'lucide-react';
import { useCallback } from 'react';

const BookingForm = () => {
  const { formData, setFormData, setStep, routeInfo } = useBooking();

  const handlePickup = useCallback((address: string, lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, pickupAddress: address, pickupLat: lat, pickupLng: lng }));
  }, [setFormData]);

  const handleDropoff = useCallback((address: string, lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, dropoffAddress: address, dropoffLat: lat, dropoffLng: lng }));
  }, [setFormData]);

  const canProceed = formData.pickupAddress && formData.dropoffAddress && formData.date && formData.time && routeInfo;

  return (
    <div className="space-y-5">
      <AddressInput
        label="Pickup Location"
        value={formData.pickupAddress}
        onChange={handlePickup}
        placeholder="Enter pickup address"
      />
      <AddressInput
        label="Dropoff Location"
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
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Passengers</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select
              value={String(formData.passengers)}
              onValueChange={(v) => setFormData(prev => ({ ...prev, passengers: parseInt(v) }))}
            >
              <SelectTrigger className="pl-10 h-11 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Luggage</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select
              value={String(formData.luggage)}
              onValueChange={(v) => setFormData(prev => ({ ...prev, luggage: parseInt(v) }))}
            >
              <SelectTrigger className="pl-10 h-11 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0,1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Service Type</label>
        <Select
          value={formData.serviceType}
          onValueChange={(v) => setFormData(prev => ({ ...prev, serviceType: v as 'one-way' | 'hourly' | 'airport' }))}
        >
          <SelectTrigger className="h-11 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one-way">One Way Transfer</SelectItem>
            <SelectItem value="hourly">Hourly Chauffeur</SelectItem>
            <SelectItem value="airport">Airport Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="childSeat"
          checked={formData.childSeat}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, childSeat: !!checked }))}
        />
        <label htmlFor="childSeat" className="flex items-center gap-1.5 text-sm cursor-pointer">
          <Baby className="h-4 w-4 text-muted-foreground" />
          Add child seat (+$10)
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Special Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Flight number, special requests..."
          className="bg-card resize-none"
          rows={2}
        />
      </div>

      {routeInfo && (
        <div className="flex items-center gap-4 bg-secondary rounded-lg p-3 text-sm">
          <span className="font-medium">{routeInfo.distance.toFixed(1)} km</span>
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
