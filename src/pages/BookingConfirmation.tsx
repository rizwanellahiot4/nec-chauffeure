import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const BookingConfirmation = () => {
  const [params] = useSearchParams();
  const bookingId = params.get('id') || 'BK-DEMO';
  const status = params.get('status') || 'confirmed';
  const isPending = status === 'pending';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl shadow-luxury-lg border border-border p-8 text-center"
          >
            <div className="h-16 w-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
              {isPending ? <Clock3 className="h-8 w-8 text-accent-foreground" /> : <CheckCircle2 className="h-8 w-8 text-accent-foreground" />}
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">{isPending ? 'Booking Pending Payment' : 'Reservation Confirmed'}</h1>
            <p className="text-muted-foreground mb-6">
              {isPending
                ? 'Your reservation was created successfully and is waiting for payment confirmation.'
                : 'Your payment was accepted and your chauffeur reservation is confirmed.'}
            </p>

            <div className="bg-secondary rounded-lg p-4 mb-6 space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="font-display text-xl font-bold text-accent">{bookingId}</p>
              </div>
              <div className="text-xs text-muted-foreground">Keep this reference for booking updates or support.</div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {isPending
                ? 'Once live payment keys are connected, successful checkout will update this automatically.'
                : 'You can now return home or make another reservation.'}
            </p>

            <Button variant="gold" asChild className="w-full">
              <Link to="/">Book Another Ride</Link>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
