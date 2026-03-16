import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandSettings, PricingConfig, MapSettings } from '@/types/booking';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [brand, setBrand] = useState<BrandSettings>({
    businessName: 'EliteDrive',
    businessEmail: 'info@elitedrive.com',
    businessPhone: '+1 (234) 567-890',
    businessAddress: 'New York, NY',
    primaryColor: '#0F172A',
    secondaryColor: '#C5A059',
    footerText: '© 2026 EliteDrive. All rights reserved.',
  });

  const [pricing, setPricing] = useState<PricingConfig>({
    baseFare: 15,
    pricePerKm: 2.5,
    hourlyRate: 65,
    airportSurcharge: 20,
    childSeatPrice: 10,
  });

  const [mapSettings, setMapSettings] = useState<MapSettings>({
    centerLat: 40.7128,
    centerLng: -74.006,
    zoom: 12,
    countryCode: 'us',
  });

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="brand">Branding</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Brand Settings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                  <Input value={brand.businessName} onChange={(e) => setBrand(b => ({ ...b, businessName: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input value={brand.businessEmail} onChange={(e) => setBrand(b => ({ ...b, businessEmail: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone</label>
                  <Input value={brand.businessPhone} onChange={(e) => setBrand(b => ({ ...b, businessPhone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address</label>
                  <Input value={brand.businessAddress} onChange={(e) => setBrand(b => ({ ...b, businessAddress: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Primary Color</label>
                  <div className="flex gap-2">
                    <Input type="color" value={brand.primaryColor} onChange={(e) => setBrand(b => ({ ...b, primaryColor: e.target.value }))} className="w-12 h-10 p-1" />
                    <Input value={brand.primaryColor} onChange={(e) => setBrand(b => ({ ...b, primaryColor: e.target.value }))} className="flex-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Secondary Color</label>
                  <div className="flex gap-2">
                    <Input type="color" value={brand.secondaryColor} onChange={(e) => setBrand(b => ({ ...b, secondaryColor: e.target.value }))} className="w-12 h-10 p-1" />
                    <Input value={brand.secondaryColor} onChange={(e) => setBrand(b => ({ ...b, secondaryColor: e.target.value }))} className="flex-1" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Footer Text</label>
                <Input value={brand.footerText} onChange={(e) => setBrand(b => ({ ...b, footerText: e.target.value }))} />
              </div>
              <Button variant="gold" onClick={() => handleSave('Brand')}>Save Brand Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Pricing Configuration</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Base Fare ($)</label>
                  <Input type="number" value={pricing.baseFare} onChange={(e) => setPricing(p => ({ ...p, baseFare: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price per KM ($)</label>
                  <Input type="number" step="0.1" value={pricing.pricePerKm} onChange={(e) => setPricing(p => ({ ...p, pricePerKm: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Hourly Rate ($)</label>
                  <Input type="number" value={pricing.hourlyRate} onChange={(e) => setPricing(p => ({ ...p, hourlyRate: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Airport Surcharge ($)</label>
                  <Input type="number" value={pricing.airportSurcharge} onChange={(e) => setPricing(p => ({ ...p, airportSurcharge: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Child Seat Price ($)</label>
                  <Input type="number" value={pricing.childSeatPrice} onChange={(e) => setPricing(p => ({ ...p, childSeatPrice: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <Button variant="gold" onClick={() => handleSave('Pricing')}>Save Pricing</Button>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Map Configuration</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Center Latitude</label>
                  <Input type="number" step="0.0001" value={mapSettings.centerLat} onChange={(e) => setMapSettings(m => ({ ...m, centerLat: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Center Longitude</label>
                  <Input type="number" step="0.0001" value={mapSettings.centerLng} onChange={(e) => setMapSettings(m => ({ ...m, centerLng: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Default Zoom</label>
                  <Input type="number" min="1" max="18" value={mapSettings.zoom} onChange={(e) => setMapSettings(m => ({ ...m, zoom: parseInt(e.target.value) || 12 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Country Code</label>
                  <Input value={mapSettings.countryCode} onChange={(e) => setMapSettings(m => ({ ...m, countryCode: e.target.value }))} placeholder="us, uk, de..." />
                </div>
              </div>
              <Button variant="gold" onClick={() => handleSave('Map')}>Save Map Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Stripe Payment Settings</h3>
              <p className="text-sm text-muted-foreground">
                Use demo test values for now. Later you can replace them with your real Stripe keys from the admin panel and connect secure backend checkout.
              </p>
              <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                Demo mode only: these fields are visual placeholders and are not saved to any live payment provider yet.
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Publishable Key</label>
                  <Input defaultValue="pk_test_demo_placeholder" placeholder="pk_test_..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Secret Key</label>
                  <Input type="password" defaultValue="sk_test_demo_placeholder" placeholder="sk_test_..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Webhook Secret</label>
                  <Input type="password" defaultValue="whsec_demo_placeholder" placeholder="whsec_..." />
                </div>
              </div>
              <Button variant="gold" onClick={() => handleSave('Payment')}>Save Payment Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
