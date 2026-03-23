import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, User, Phone, Mail, Car, DollarSign, CreditCard, Clock, FileText } from 'lucide-react';
import { formatServiceType } from '@/lib/booking-options';
import type { Booking } from '@/types/booking';

interface BookingDetailModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDetailModal = ({ booking, open, onOpenChange }: BookingDetailModalProps) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            Booking Details
            <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded ml-2">
              {booking.id}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
              booking.status === 'confirmed'
                ? 'bg-accent/20 text-accent'
                : booking.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-600'
                  : booking.status === 'pending'
                    ? 'bg-secondary text-muted-foreground'
                    : 'bg-destructive/15 text-destructive'
            }`}>
              {booking.status}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              booking.paymentStatus === 'paid'
                ? 'bg-emerald-500/15 text-emerald-600'
                : booking.paymentStatus === 'refunded'
                  ? 'bg-destructive/15 text-destructive'
                  : 'bg-secondary text-muted-foreground'
            }`}>
              <CreditCard className="h-3 w-3 mr-1" />
              {booking.paymentStatus}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="font-medium">{booking.customer.fullName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{booking.customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{booking.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Route</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p>{booking.formData.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dropoff</p>
                  <p>{booking.formData.dropoffAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trip Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>{booking.formData.date} at {booking.formData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-accent" />
                  <span>{booking.vehicle.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{formatServiceType(booking.formData.serviceType)}</span>
                </div>
                {booking.formData.serviceType === 'chauffeur-hourly' && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>{booking.formData.durationHours} hour(s)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Passengers & Luggage</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Passengers</span>
                  <span className="font-medium">{booking.formData.passengers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Luggage</span>
                  <span className="font-medium">{booking.formData.luggage}</span>
                </div>
                {booking.formData.childSeat && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Child Seat</span>
                    <span className="font-medium capitalize">{booking.formData.childSeatType.replace(/-/g, ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.formData.notes && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <FileText className="h-3 w-3" /> Notes
              </h4>
              <p className="text-sm text-muted-foreground">{booking.formData.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="bg-accent/10 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              <span className="font-semibold">Total Price</span>
            </div>
            <span className="font-display text-2xl font-bold text-accent">${booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
