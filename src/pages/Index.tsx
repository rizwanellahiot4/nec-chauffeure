import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/booking/BookingForm';
import VehicleSelection from '@/components/booking/VehicleSelection';
import CustomerForm from '@/components/booking/CustomerForm';
import BookingSummary from '@/components/booking/BookingSummary';
import MapView from '@/components/booking/MapView';
import { BookingProvider, useBooking } from '@/contexts/BookingContext';
import { motion } from 'framer-motion';
import { Shield, Clock, Star, Car } from 'lucide-react';

const StepIndicator = () => {
  const { step } = useBooking();
  const steps = ['Trip Details', 'Vehicle', 'Your Info', 'Payment'];
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
            i + 1 <= step ? 'gold-gradient text-accent-foreground' : 'bg-secondary text-muted-foreground'
          }`}>
            {i + 1}
          </div>
          <span className={`hidden sm:inline text-xs font-medium ${i + 1 <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
            {label}
          </span>
          {i < steps.length - 1 && <div className={`h-px w-4 sm:w-8 mx-1 ${i + 1 < step ? 'bg-accent' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  );
};

const BookingContent = () => {
  const { step } = useBooking();
  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
      <div>
        <div className="bg-card rounded-xl shadow-luxury-lg border border-border p-6 sm:p-8">
          <StepIndicator />
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            {step === 1 && <BookingForm />}
            {step === 2 && <VehicleSelection />}
            {step === 3 && <CustomerForm />}
            {step === 4 && <BookingSummary />}
          </motion.div>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 h-[400px] lg:h-[calc(100vh-8rem)]">
        <MapView />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* Hero */}
        <section className="hero-gradient py-16 sm:py-24">
          <div className="container text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl sm:text-5xl font-bold text-primary-foreground mb-4"
            >
              Premium Chauffeur <span className="text-gold-gradient">Service</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-primary-foreground/70 text-lg max-w-2xl mx-auto"
            >
              Experience luxury travel with professional chauffeurs and premium vehicles
            </motion.p>
          </div>
        </section>

        {/* Trust badges */}
        <div className="bg-card border-b border-border">
          <div className="container py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-accent" /> Insured & Licensed</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> 24/7 Available</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-accent" /> 4.9★ Rated</span>
              <span className="flex items-center gap-1.5"><Car className="h-4 w-4 text-accent" /> Premium Fleet</span>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <section id="booking" className="py-10 sm:py-16 flex-1">
          <div className="container">
            <BookingContent />
          </div>
        </section>

        <Footer />
      </div>
    </BookingProvider>
  );
};

export default Index;
