import { useBooking } from '@/contexts/BookingContext';
import { useVehicles } from '@/hooks/use-live-data';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Vehicle } from '@/types/booking';

const VehicleSelection = () => {
  const { routeInfo, formData, selectedVehicle, setSelectedVehicle, calculatePrice, setTotalPrice, setStep } = useBooking();
  const { data: vehicles = [] } = useVehicles();
  const { data: pricing } = usePricingSettings();

  const handleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    if (routeInfo) setTotalPrice(calculatePrice(vehicle, routeInfo, formData));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h3 className="font-display text-lg font-semibold">Select Your Vehicle</h3>
        <div className="w-16" />
      </div>

      {routeInfo && (
        <div className="flex items-center gap-4 bg-secondary rounded-lg p-3 text-sm">
          <span className="font-medium">{routeInfo.distance.toFixed(1)} mi</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">~{Math.round(routeInfo.duration)} min</span>
        </div>
      )}

      <div className="grid gap-4">
        {vehicles.map((vehicle, i) => {
          const price = routeInfo ? calculatePrice(vehicle, routeInfo, formData) : 0;
          const isSelected = selectedVehicle?.id === vehicle.id;
          return (
            <motion.div key={vehicle.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative bg-card rounded-lg border-2 p-4 cursor-pointer transition-all ${isSelected ? 'border-accent shadow-gold-glow' : 'border-border hover:border-accent/50'}`} onClick={() => handleSelect(vehicle)}>
              {isSelected && <div className="absolute top-3 right-3 h-6 w-6 rounded-full gold-gradient flex items-center justify-center"><Check className="h-3.5 w-3.5 text-accent-foreground" /></div>}
              <div className="flex items-center gap-4">
                <div className="w-28 h-20 flex-shrink-0 rounded-md bg-secondary flex items-center justify-center overflow-hidden">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-foreground">{vehicle.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{vehicle.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {vehicle.passengers}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {vehicle.luggage}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-2xl font-display font-bold text-foreground">${price.toFixed(0)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Button variant="gold" size="lg" className="w-full" disabled={!selectedVehicle} onClick={() => selectedVehicle && setStep(3)}>
        Continue to Details
      </Button>
    </div>
  );
};

export default VehicleSelection;
