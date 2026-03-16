import { Link } from 'react-router-dom';
import { Car, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Elite<span className="text-accent">Drive</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#booking" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Book a Ride
          </a>
          <a href="#fleet" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Our Fleet
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:+1234567890" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="h-4 w-4" />
            <span>+1 (234) 567-890</span>
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
