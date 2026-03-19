import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Briefcase, Car, CreditCard, LockKeyhole } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formatChildSeatType, formatServiceType } from '@/lib/booking-options';
import { toast } from 'sonner';
import { usePricingSettings } from '@/hooks/use-live-data';

const createBookingReference = () => `BK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

const BookingSummary = () => {
  const { formData, selectedVehicle, customerDetails, routeInfo, totalPrice, setStep } = useBooking();
  const { data: pricing } = usePricingSettings();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/34');
  const [cvc, setCvc] = useState('123');
  const navigate = useNavigate();

  const canPay = useMemo(() => {
    return cardName.trim().length > 2 && cardNumber.replace(/\s/g, '').length >= 16 && expiry.trim().length >= 4 && cvc.trim().length >= 3;
  }, [cardName, cardNumber, expiry, cvc]);

  const handlePayment = async () => {
    if (!selectedVehicle || !routeInfo || !canPay) return;
    setIsProcessing(true);

    const bookingReference = createBookingReference();
    const pickupAt = new Date(`${formData.date}T${formData.time}`);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('bookings')
      .insert({
        booking_reference: bookingReference,
        customer_name: customerDetails.fullName,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        pickup_address: formData.pickupAddress,
        dropoff_address: formData.dropoffAddress,
        pickup_lat: formData.pickupLat,
        pickup_lng: formData.pickupLng,
        dropoff_lat: formData.dropoffLat,
        dropoff_lng: formData.dropoffLng,
        pickup_at: pickupAt.toISOString(),
        passengers: formData.passengers,
        luggage: formData.luggage,
        child_seat: formData.childSeat,
        child_seat_type: formData.childSeatType,
        route_distance_km: routeInfo.distance,
        route_duration_minutes: routeInfo.duration,
        route_geometry: routeInfo.geometry,
        vehicle_id: selectedVehicle.id.length === 36 ? selectedVehicle.id : null,
        vehicle_name_snapshot: selectedVehicle.name,
        service_type: formData.serviceType,
        duration_hours: formData.durationHours,
        total_price: totalPrice,
        notes: formData.notes,
        created_by: auth.user?.id ?? null,
        status: 'confirmed',
        payment_status: 'paid',
      });

    setIsProcessing(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    // Send branded confirmation email via Resend
    try {
      await supabase.functions.invoke('send-booking-email', {
        body: {
          bookingReference,
          customerName: customerDetails.fullName,
          customerEmail: customerDetails.email,
          pickupAddress: formData.pickupAddress,
          dropoffAddress: formData.dropoffAddress,
          pickupAt: pickupAt.toISOString(),
          vehicleName: selectedVehicle.name,
          totalPrice,
          passengers: formData.passengers,
          luggage: formData.luggage,
          serviceType: formData.serviceType,
          durationHours: formData.durationHours,
          distanceKm: routeInfo.distance,
          durationMinutes: routeInfo.duration,
        },
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
    }

    navigate(`/booking/confirmation?id=${bookingReference}&status=confirmed`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h3 className="font-display text-lg font-semibold">Checkout</h3>
        <div className="w-16" />
      </div>

      <div className="space-y-4">
        <div className="bg-secondary rounded-lg p-4 space-y-3">
          <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">Trip Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" /><div><p className="text-xs text-muted-foreground">Pickup</p><p className="font-medium">{formData.pickupAddress}</p></div></div>
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /><div><p className="text-xs text-muted-foreground">Dropoff</p><p className="font-medium">{formData.dropoffAddress}</p></div></div>
          </div>
          <div className="flex gap-4 text-sm"><span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {formData.date}</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> {formData.time}</span></div>
          <div className="flex flex-wrap gap-4 text-sm"><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-muted-foreground" /> {formData.passengers} pax</span><span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {formData.luggage} bags</span>{formData.durationHours > 0 ? <span>{formData.durationHours} hrs</span> : null}</div>
          <div className="text-sm text-muted-foreground">{formatServiceType(formData.serviceType)}{formData.childSeatType !== 'none' ? ` • ${formatChildSeatType(formData.childSeatType)}` : ''}</div>
          {routeInfo && <div className="text-sm text-muted-foreground">{routeInfo.distance.toFixed(1)} mi • ~{Math.round(routeInfo.duration)} min</div>}
        </div>

        {selectedVehicle && (
          <div className="bg-secondary rounded-lg p-4 flex items-center gap-3">
            <Car className="h-5 w-5 text-accent" />
            <div className="flex-1"><p className="font-display font-semibold">{selectedVehicle.name}</p><p className="text-xs text-muted-foreground">{selectedVehicle.description}</p></div>
          </div>
        )}

        <div className="bg-secondary rounded-lg p-4">
          <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Passenger</h4>
          <p className="font-medium text-sm">{customerDetails.fullName}</p>
          <p className="text-sm text-muted-foreground">{customerDetails.email} • {customerDetails.phone}</p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-luxury p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <LockKeyhole className="h-4 w-4 text-accent" />
            Demo card checkout
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Cardholder name</label>
              <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" className="bg-card" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Card number</label>
              <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="bg-card" inputMode="numeric" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Expiry</label>
              <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="bg-card" inputMode="numeric" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">CVC</label>
              <Input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" className="bg-card" inputMode="numeric" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Demo mode collects checkout details in the UI only and marks the booking as paid + confirmed so you can test the full reservation flow before adding real payment keys.</p>
        </div>

        <div className="bg-card border border-accent/30 rounded-lg p-4 flex items-center justify-between">
          <span className="font-display font-semibold">Total</span>
          <span className="font-display text-2xl font-bold text-accent">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Button variant="gold" size="lg" className="w-full" onClick={handlePayment} disabled={isProcessing || !canPay}>
        {isProcessing ? 'Processing payment...' : <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Pay & Confirm Reservation</span>}
      </Button>
    </div>
  );
};

export default BookingSummary;
