import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandSettings, PricingConfig, MapSettings } from '@/types/booking';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useBrandSettings, useMapSettings, usePricingSettings } from '@/hooks/use-live-data';
import { DISTANCE_UNITS } from '@/lib/booking-options';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminSettings = () => {
  const { data: liveBrand } = useBrandSettings();
  const { data: livePricing } = usePricingSettings();
  const { data: liveMap } = useMapSettings();

  const [brand, setBrand] = useState<BrandSettings>(liveBrand ?? {
    businessName: 'EliteDrive',
    businessEmail: 'info@elitedrive.com',
    businessPhone: '+1 (234) 567-890',
    businessAddress: 'New York, NY',
    primaryColor: '222.2 47.4% 11.2%',
    secondaryColor: '39 48% 56%',
    footerText: '© 2026 EliteDrive. All rights reserved.',
  });

  const [pricing, setPricing] = useState<PricingConfig>(livePricing ?? {
    baseFare: 15,
    pricePerKm: 2.5,
    hourlyRate: 65,
    airportSurcharge: 20,
    childSeatPrice: 10,
    distanceUnit: 'km',
    fromAirportSurcharge: 20,
    toAirportSurcharge: 20,
    privateTourBaseFare: 120,
    hourlyChauffeurBaseFare: 65,
    rearFacingSeatPrice: 15,
    forwardFacingSeatPrice: 12,
    boosterSeatPrice: 10,
  });

  const [mapSettings, setMapSettings] = useState<MapSettings>(liveMap ?? {
    centerLat: 40.7128,
    centerLng: -74.006,
    zoom: 12,
    countryCode: 'us',
  });

  const syncBrand = liveBrand && liveBrand.businessName !== brand.businessName ? liveBrand : null;
  const syncPricing = livePricing && livePricing.baseFare !== pricing.baseFare ? livePricing : null;
  const syncMap = liveMap && liveMap.zoom !== mapSettings.zoom ? liveMap : null;
  if (syncBrand) setBrand(syncBrand);
  if (syncPricing) setPricing(syncPricing);
  if (syncMap) setMapSettings(syncMap);

  const handleSaveBrand = async () => {
    const { error } = await supabase.from('brand_settings').update({
      business_name: brand.businessName,
      business_email: brand.businessEmail,
      business_phone: brand.businessPhone,
      business_address: brand.businessAddress,
      primary_brand_color: brand.primaryColor,
      secondary_brand_color: brand.secondaryColor,
      footer_copyright_text: brand.footerText,
    }).eq('id', '11111111-1111-1111-1111-111111111111');

    if (error) return toast.error(error.message);
    toast.success('Brand settings saved');
  };

  const handleSavePricing = async () => {
    const { error } = await supabase.from('pricing_settings').update({
      base_fare: pricing.baseFare,
      price_per_km: pricing.pricePerKm,
      hourly_rate: pricing.hourlyRate,
      airport_surcharge: pricing.airportSurcharge,
      child_seat_price: pricing.childSeatPrice,
      distance_unit: pricing.distanceUnit ?? 'km',
      hourly_distance_unit: pricing.distanceUnit === 'mi' ? 'mph' : 'kmh',
      from_airport_surcharge: pricing.fromAirportSurcharge ?? 20,
      to_airport_surcharge: pricing.toAirportSurcharge ?? 20,
      private_tour_base_fare: pricing.privateTourBaseFare ?? 120,
      hourly_chauffeur_base_fare: pricing.hourlyChauffeurBaseFare ?? 65,
      rear_facing_seat_price: pricing.rearFacingSeatPrice ?? 15,
      forward_facing_seat_price: pricing.forwardFacingSeatPrice ?? 12,
      booster_seat_price: pricing.boosterSeatPrice ?? 10,
    }).eq('id', '22222222-2222-2222-2222-222222222222');

    if (error) return toast.error(error.message);
    toast.success('Pricing settings saved');
  };

  const handleSaveMap = async () => {
    const { error } = await supabase.from('map_settings').update({
      center_lat: mapSettings.centerLat,
      center_lng: mapSettings.centerLng,
      zoom: mapSettings.zoom,
      country_code: mapSettings.countryCode,
    }).eq('id', '33333333-3333-3333-3333-333333333333');

    if (error) return toast.error(error.message);
    toast.success('Map settings saved');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Tabs defaultValue="brand" className="space-y-6">
          <TabsList className="bg-secondary flex flex-wrap h-auto">
            <TabsTrigger value="brand">Branding</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Brand Settings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1.5 block">Business Name</label><Input value={brand.businessName} onChange={(e) => setBrand((b) => ({ ...b, businessName: e.target.value }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Email</label><Input value={brand.businessEmail} onChange={(e) => setBrand((b) => ({ ...b, businessEmail: e.target.value }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Phone</label><Input value={brand.businessPhone} onChange={(e) => setBrand((b) => ({ ...b, businessPhone: e.target.value }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Address</label><Input value={brand.businessAddress} onChange={(e) => setBrand((b) => ({ ...b, businessAddress: e.target.value }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Primary Color</label><Input value={brand.primaryColor} onChange={(e) => setBrand((b) => ({ ...b, primaryColor: e.target.value }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Secondary Color</label><Input value={brand.secondaryColor} onChange={(e) => setBrand((b) => ({ ...b, secondaryColor: e.target.value }))} /></div>
              </div>
              <div><label className="text-sm font-medium mb-1.5 block">Footer Text</label><Input value={brand.footerText} onChange={(e) => setBrand((b) => ({ ...b, footerText: e.target.value }))} /></div>
              <Button variant="gold" onClick={handleSaveBrand}>Save Brand Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Pricing Configuration</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1.5 block">Base Fare</label><Input type="number" value={pricing.baseFare} onChange={(e) => setPricing((p) => ({ ...p, baseFare: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Price per Distance</label><Input type="number" step="0.1" value={pricing.pricePerKm} onChange={(e) => setPricing((p) => ({ ...p, pricePerKm: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Hourly Rate</label><Input type="number" value={pricing.hourlyRate} onChange={(e) => setPricing((p) => ({ ...p, hourlyRate: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Distance Unit</label><Select value={pricing.distanceUnit ?? 'km'} onValueChange={(value) => setPricing((p) => ({ ...p, distanceUnit: value as 'km' | 'mi' }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DISTANCE_UNITS.map((unit) => <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>)}</SelectContent></Select></div>
                <div><label className="text-sm font-medium mb-1.5 block">From Airport Surcharge</label><Input type="number" value={pricing.fromAirportSurcharge ?? 20} onChange={(e) => setPricing((p) => ({ ...p, fromAirportSurcharge: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">To Airport Surcharge</label><Input type="number" value={pricing.toAirportSurcharge ?? 20} onChange={(e) => setPricing((p) => ({ ...p, toAirportSurcharge: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Private Tour Base Fare</label><Input type="number" value={pricing.privateTourBaseFare ?? 120} onChange={(e) => setPricing((p) => ({ ...p, privateTourBaseFare: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Chauffeur by the Hour Base Fare</label><Input type="number" value={pricing.hourlyChauffeurBaseFare ?? 65} onChange={(e) => setPricing((p) => ({ ...p, hourlyChauffeurBaseFare: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Rear Facing Seat</label><Input type="number" value={pricing.rearFacingSeatPrice ?? 15} onChange={(e) => setPricing((p) => ({ ...p, rearFacingSeatPrice: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Forward Facing Seat</label><Input type="number" value={pricing.forwardFacingSeatPrice ?? 12} onChange={(e) => setPricing((p) => ({ ...p, forwardFacingSeatPrice: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Booster Seat</label><Input type="number" value={pricing.boosterSeatPrice ?? 10} onChange={(e) => setPricing((p) => ({ ...p, boosterSeatPrice: parseFloat(e.target.value) || 0 }))} /></div>
              </div>
              <Button variant="gold" onClick={handleSavePricing}>Save Pricing</Button>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Map Configuration</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1.5 block">Center Latitude</label><Input type="number" step="0.0001" value={mapSettings.centerLat} onChange={(e) => setMapSettings((m) => ({ ...m, centerLat: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Center Longitude</label><Input type="number" step="0.0001" value={mapSettings.centerLng} onChange={(e) => setMapSettings((m) => ({ ...m, centerLng: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Default Zoom</label><Input type="number" min="1" max="18" value={mapSettings.zoom} onChange={(e) => setMapSettings((m) => ({ ...m, zoom: parseInt(e.target.value) || 12 }))} /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Country Code</label><Input value={mapSettings.countryCode} onChange={(e) => setMapSettings((m) => ({ ...m, countryCode: e.target.value }))} placeholder="us, uk, de..." /></div>
              </div>
              <Button variant="gold" onClick={handleSaveMap}>Save Map Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="bg-card rounded-xl border border-border shadow-luxury p-6 space-y-4">
              <h3 className="font-display font-semibold">Stripe Payment Settings</h3>
              <p className="text-sm text-muted-foreground">UI is ready for real Stripe keys from admin, but secure live payment processing still needs backend checkout + webhook wiring.</p>
              <div className="space-y-4">
                <div><label className="text-sm font-medium mb-1.5 block">Publishable Key</label><Input defaultValue="pk_test_demo_placeholder" placeholder="pk_test_..." /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Secret Key</label><Input type="password" defaultValue="sk_test_demo_placeholder" placeholder="sk_test_..." /></div>
                <div><label className="text-sm font-medium mb-1.5 block">Webhook Secret</label><Input type="password" defaultValue="whsec_demo_placeholder" placeholder="whsec_..." /></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
