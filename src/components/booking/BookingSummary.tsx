import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Briefcase, Car, CreditCard, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingSummary = () => {
  const { formData, selectedVehicle, customerDetails, routeInfo, totalPrice, setStep } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;
    navigate(`/booking/confirmation?id=${bookingId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h3 className="font-display text-lg font-semibold">Review & Pay</h3>
        <div className="w-16" />
      </div>

      <div className="space-y-4">
        <div className="bg-secondary rounded-lg p-4 space-y-3">
          <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">Trip Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="font-medium">{formData.pickupAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Dropoff</p>
                <p className="font-medium">{formData.dropoffAddress}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {formData.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> {formData.time}</span>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-muted-foreground" /> {formData.passengers} pax</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {formData.luggage} bags</span>
          </div>
          {routeInfo && (
            <div className="text-sm text-muted-foreground">
              {routeInfo.distance.toFixed(1)} km • ~{Math.round(routeInfo.duration)} min
            </div>
          )}
        </div>

        {selectedVehicle && (
          <div className="bg-secondary rounded-lg p-4 flex items-center gap-3">
            <Car className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <p className="font-display font-semibold">{selectedVehicle.name}</p>
              <p className="text-xs text-muted-foreground">{selectedVehicle.description}</p>
            </div>
          </div>
        )}

        <div className="bg-secondary rounded-lg p-4">
          <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Passenger</h4>
          <p className="font-medium text-sm">{customerDetails.fullName}</p>
          <p className="text-sm text-muted-foreground">{customerDetails.email} • {customerDetails.phone}</p>
        </div>

        <div className="bg-card border border-accent/30 rounded-lg p-4 flex items-center justify-between">
          <span className="font-display font-semibold">Total</span>
          <span className="font-display text-2xl font-bold text-accent">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Button variant="gold" size="lg" className="w-full" onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Pay ${totalPrice.toFixed(2)}
          </span>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Stripe payment integration required for production. This is a demo flow.
      </p>
    </div>
  );
};

export default BookingSummary;
