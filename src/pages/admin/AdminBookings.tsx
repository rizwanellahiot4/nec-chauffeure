import { useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Calendar, Eye } from 'lucide-react';
import type { Booking } from '@/types/booking';
import { useAdminBookings } from '@/hooks/use-live-data';
import { formatServiceType } from '@/lib/booking-options';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const statusOptions: Booking['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];

const AdminBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const { data: bookings = [] } = useAdminBookings();

  const filtered = useMemo(
    () => bookings.filter((booking) => {
      const q = search.toLowerCase();
      const matchesSearch =
        booking.customer.fullName.toLowerCase().includes(q) ||
        booking.id.toLowerCase().includes(q) ||
        booking.customer.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    [bookings, search, statusFilter],
  );

  const handleUpdateStatus = async (booking: Booking, nextStatus: Booking['status']) => {
    if (!booking.dbId) return;
    setSavingStatusId(booking.dbId);
    const { error } = await supabase.from('bookings').update({ status: nextStatus }).eq('id', booking.dbId);
    setSavingStatusId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Booking status updated');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or reference..." className="pl-10 bg-card" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-luxury overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Ref</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Route</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Service</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Payment</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking: Booking) => (
                  <tr key={booking.dbId ?? booking.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-mono text-xs">{booking.id}</td>
                    <td className="p-3">
                      <p className="font-medium">{booking.customer.fullName}</p>
                      <p className="text-xs text-muted-foreground">{booking.customer.email}</p>
                    </td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell truncate max-w-[240px]">
                      {booking.formData.pickupAddress} → {booking.formData.dropoffAddress}
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs">{booking.formData.date} {booking.formData.time}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs">{formatServiceType(booking.formData.serviceType)}</td>
                    <td className="p-3 font-medium">${booking.totalPrice.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${booking.paymentStatus === 'paid' ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 min-w-[160px]">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleUpdateStatus(booking, value as Booking['status'])}
                        disabled={savingStatusId === booking.dbId}
                      >
                        <SelectTrigger className="h-8 bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No live bookings found</div>}
        </div>
      </div>

      <Dialog open={Boolean(selectedBooking)} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking ? (
            <div className="space-y-4 text-sm">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Reference</p>
                <p className="font-mono">{selectedBooking.id}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{selectedBooking.customer.fullName}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p>{selectedBooking.customer.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p>{selectedBooking.customer.phone}</p></div>
                <div><p className="text-xs text-muted-foreground">Vehicle</p><p>{selectedBooking.vehicle.name}</p></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pickup Address</p>
                <p>{selectedBooking.formData.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dropoff Address</p>
                <p>{selectedBooking.formData.dropoffAddress}</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><p className="text-xs text-muted-foreground">Date</p><p>{selectedBooking.formData.date}</p></div>
                <div><p className="text-xs text-muted-foreground">Time</p><p>{selectedBooking.formData.time}</p></div>
                <div><p className="text-xs text-muted-foreground">Total</p><p className="font-medium">${selectedBooking.totalPrice.toFixed(2)}</p></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Service & Notes</p>
                <p>{formatServiceType(selectedBooking.formData.serviceType)}</p>
                {selectedBooking.formData.notes ? <p className="text-muted-foreground mt-1">{selectedBooking.formData.notes}</p> : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBookings;
