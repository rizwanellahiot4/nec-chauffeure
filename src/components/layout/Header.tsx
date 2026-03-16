import { Link } from 'react-router-dom';
import { Car, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBrandSettings } from '@/hooks/use-live-data';

const Header = () => {
  const { data: brand } = useBrandSettings();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            {brand?.businessName ?? 'EliteDrive'}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#booking" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Book a Ride</a>
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${brand?.businessPhone ?? '+15551234567'}`} className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="h-4 w-4" />
            <span>{brand?.businessPhone ?? '+1 (555) 123-4567'}</span>
          </a>
          <Button variant="gold" size="sm" asChild>
            <a href="#booking">Book Now</a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
