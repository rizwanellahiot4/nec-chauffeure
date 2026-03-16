import { Car, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg gold-gradient flex items-center justify-center">
                <Car className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-lg font-bold">EliteDrive</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Premium chauffeur services for discerning travelers. Experience luxury on every journey.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Airport Transfers</li>
              <li>Corporate Travel</li>
              <li>Hourly Chauffeur</li>
              <li>Special Events</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +1 (234) 567-890</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> info@elitedrive.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> New York, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} EliteDrive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
