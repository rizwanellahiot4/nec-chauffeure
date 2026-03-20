import { useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Calendar, Eye, MapPin, User, CreditCard, DollarSign, Car } from 'lucide-react';
import type { Booking } from '@/types/booking';
import { useAdminBookings } from '@/hooks/use-live-data';
import { formatServiceType } from '@/lib/booking-options';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const statusOptions: Booking['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];
const paymentStatusOptions: Booking['paymentStatus'][] = ['pending', 'paid', 'refunded'];

const AdminBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [savingPaymentId, setSavingPaymentId] = useState<string | null>(null);
  const { data: bookings = [] } = useAdminBookings();

  const filtered = useMemo(
    () => bookings.filter((booking) => {
      const q = search.toLowerCase();
      const matchesSearch =
        booking.customer.fullName.toLowerCase().includes(q) ||
        booking.id.toLowerCase().includes(q) ||
        booking.customer.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesDate = !dateFilter || booking.formData.date === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    }),
    [bookings, search, statusFilter, dateFilter],
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
    if (selectedBooking?.dbId === booking.dbId) {
      setSelectedBooking({ ...selectedBooking, status: nextStatus });
    }
    toast.success('Booking status updated');
  };

  const handleUpdatePaymentStatus = async (booking: Booking, nextPaymentStatus: Booking['paymentStatus']) => {
    if (!booking.dbId) return;
    setSavingPaymentId(booking.dbId);
    const { error } = await supabase.from('bookings').update({ payment_status: nextPaymentStatus }).eq('id', booking.dbId);
    setSavingPaymentId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (selectedBooking?.dbId === booking.dbId) {
      setSelectedBooking({ ...selectedBooking, paymentStatus: nextPaymentStatus });
    }
    toast.success('Payment status updated');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or reference..." className="pl-10 bg-card" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 w-full sm:w-44 bg-card"
            />
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
          {dateFilter && (
            <Button variant="outline" size="sm" className="h-10" onClick={() => setDateFilter('')}>
              Clear Date
            </Button>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm bg-card rounded-xl border border-border shadow-luxury">No live bookings found</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((booking: Booking) => (
            <div
              key={booking.dbId ?? booking.id}
              className="bg-card rounded-xl border border-border shadow-luxury hover:shadow-luxury-lg transition-shadow flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="font-mono text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">{booking.id}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                  booking.status === 'confirmed'
                    ? 'bg-accent/20 text-accent'
                    : booking.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-600'
                      : booking.status === 'pending'
                        ? 'bg-secondary text-muted-foreground'
                        : 'bg-destructive/15 text-destructive'
                }`}>
                  {booking.status}
                </span>
              </div>

              {/* Customer & Service */}
              <div className="px-4 pb-3 space-y-2.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{booking.customer.fullName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{booking.customer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{booking.formData.date} · {booking.formData.time}</span>
                </div>

                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{booking.formData.pickupAddress.split(',')[0]} → {booking.formData.dropoffAddress.split(',')[0]}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Car className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{formatServiceType(booking.formData.serviceType)}</span>
                </div>
              </div>

              {/* Price & Payment */}
              <div className="border-t border-border px-4 py-3 bg-secondary/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <span className="font-display font-bold text-lg">${booking.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className={`text-[11px] font-medium ${
                      booking.paymentStatus === 'paid' ? 'text-emerald-600' : booking.paymentStatus === 'refunded' ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Controls row */}
                <div className="flex gap-2">
                  <Select
                    value={booking.status}
                    onValueChange={(value) => handleUpdateStatus(booking, value as Booking['status'])}
                    disabled={savingStatusId === booking.dbId}
                  >
                    <SelectTrigger className="h-8 bg-card text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={booking.paymentStatus}
                    onValueChange={(value) => handleUpdatePaymentStatus(booking, value as Booking['paymentStatus'])}
                    disabled={savingPaymentId === booking.dbId}
                  >
                    <SelectTrigger className="h-8 bg-card text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" className="h-8 px-2.5" onClick={() => setSelectedBooking(booking)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
                <div><p className="text-xs text-muted-foreground">Booking Status</p><p>{selectedBooking.status}</p></div>
                <div><p className="text-xs text-muted-foreground">Payment Status</p><p>{selectedBooking.paymentStatus}</p></div>
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
                <p className="text-xs text-muted-foreground">Service & Notes</p><p>{formatServiceType(selectedBooking.formData.serviceType)}</p>
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
