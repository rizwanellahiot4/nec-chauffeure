import { useEffect } from 'react';
import { useBrandSettings } from '@/hooks/use-live-data';

/**
 * Applies brand colors from the database as CSS custom properties on :root,
 * so the entire theme updates in real-time when admin changes colors.
 */
const BrandThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: brand } = useBrandSettings();

  useEffect(() => {
    if (!brand) return;

    const root = document.documentElement;

    // Primary = main brand color (navy by default)
    root.style.setProperty('--primary', brand.primaryColor);
    root.style.setProperty('--navy', brand.primaryColor);
    root.style.setProperty('--sidebar-background', brand.primaryColor);

    // Accent / Secondary = gold by default
    root.style.setProperty('--accent', brand.secondaryColor);
    root.style.setProperty('--gold', brand.secondaryColor);
    root.style.setProperty('--ring', brand.secondaryColor);
    root.style.setProperty('--sidebar-primary', brand.secondaryColor);
    root.style.setProperty('--sidebar-ring', brand.secondaryColor);

    // Background
    root.style.setProperty('--background', brand.backgroundColor);
    root.style.setProperty('--primary-foreground', brand.backgroundColor);

    // Foreground
    root.style.setProperty('--foreground', brand.foregroundColor);
    root.style.setProperty('--card-foreground', brand.foregroundColor);
    root.style.setProperty('--popover-foreground', brand.foregroundColor);
    root.style.setProperty('--secondary-foreground', brand.foregroundColor);

    // Card / Surface
    root.style.setProperty('--card', brand.cardColor);
    root.style.setProperty('--popover', brand.cardColor);

    // Muted
    root.style.setProperty('--muted', brand.mutedColor);
    root.style.setProperty('--secondary', brand.mutedColor);

    // Border
    root.style.setProperty('--border', brand.borderColor);
    root.style.setProperty('--input', brand.borderColor);
  }, [brand]);

  return <>{children}</>;
};

export default BrandThemeProvider;
