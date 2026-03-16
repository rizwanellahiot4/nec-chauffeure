import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { defaultVehicles } from '@/data/vehicles';
import { Vehicle } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(defaultVehicles);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', passengers: 3, luggage: 2, priceMultiplier: 1.0 });

  const openNew = () => {
    setEditVehicle(null);
    setForm({ name: '', description: '', passengers: 3, luggage: 2, priceMultiplier: 1.0 });
    setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditVehicle(v);
    setForm({ name: v.name, description: v.description, passengers: v.passengers, luggage: v.luggage, priceMultiplier: v.priceMultiplier });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editVehicle) {
      setVehicles(prev => prev.map(v => v.id === editVehicle.id ? { ...v, ...form } : v));
    } else {
      setVehicles(prev => [...prev, { id: Date.now().toString(), image: '', ...form }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Fleet Management</h3>
          <Button variant="gold" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1" /> Add Vehicle
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle, i) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border shadow-luxury overflow-hidden"
            >
              <div className="h-40 bg-secondary flex items-center justify-center">
                {vehicle.image ? (
                  <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-contain p-4" />
                ) : (
                  <div className="text-4xl">🚗</div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-display font-semibold">{vehicle.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{vehicle.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {vehicle.passengers} pax</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {vehicle.luggage} bags</span>
                  <span className="text-accent font-medium">×{vehicle.priceMultiplier}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(vehicle)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(vehicle.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Vehicle Name</label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Executive Sedan" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Mercedes-Benz E-Class" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Passengers</label>
                  <Input type="number" value={form.passengers} onChange={(e) => setForm(f => ({ ...f, passengers: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Luggage</label>
                  <Input type="number" value={form.luggage} onChange={(e) => setForm(f => ({ ...f, luggage: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price ×</label>
                  <Input type="number" step="0.1" value={form.priceMultiplier} onChange={(e) => setForm(f => ({ ...f, priceMultiplier: parseFloat(e.target.value) || 1 }))} />
                </div>
              </div>
              <Button variant="gold" className="w-full" onClick={handleSave}>
                {editVehicle ? 'Save Changes' : 'Add Vehicle'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminVehicles;
