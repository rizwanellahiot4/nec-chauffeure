import { useBooking } from '@/contexts/BookingContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, ArrowLeft, ArrowRight } from 'lucide-react';

const CustomerForm = () => {
  const { customerDetails, setCustomerDetails, setStep, selectedVehicle, totalPrice } = useBooking();

  const canProceed = customerDetails.fullName.trim() && customerDetails.email.trim() && customerDetails.phone.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h3 className="font-display text-lg font-semibold">Your Details</h3>
        <div className="w-16" />
      </div>

      {selectedVehicle && (
        <div className="flex items-center justify-between bg-secondary rounded-lg p-3 text-sm">
          <span className="font-medium">{selectedVehicle.name}</span>
          <span className="font-display font-bold text-lg">${totalPrice.toFixed(2)}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={customerDetails.fullName}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="John Doe"
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              value={customerDetails.email}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john@example.com"
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              value={customerDetails.phone}
              onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (234) 567-890"
              className="pl-10 h-11 bg-card"
            />
          </div>
        </div>
      </div>

      <Button variant="gold" size="lg" className="w-full" disabled={!canProceed} onClick={() => setStep(4)}>
        Review Booking <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default CustomerForm;
