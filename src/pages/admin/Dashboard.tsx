import AdminLayout from '@/components/admin/AdminLayout';
import { CalendarDays, DollarSign, Car, TrendingUp, Clock, MapPin, User, Phone, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAdminBookings } from '@/hooks/use-live-data';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatServiceType } from '@/lib/booking-options';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import type { Booking } from '@/types/booking';

const Dashboard = () => {
  const { data: bookings = [] } = useAdminBookings();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const revenueBookings = bookings.filter(
      (b) => b.paymentStatus === 'paid' && b.status === 'completed'
    );

    return [
      { label: 'Total Bookings', value: bookings.length, icon: CalendarDays, href: '/admin/bookings' },
      { label: "Today's Bookings", value: bookings.filter((b) => b.formData.date === today).length, icon: Car, href: '/admin/bookings' },
      { label: 'Total Revenue', value: `$${revenueBookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}`, icon: DollarSign, href: '/admin/bookings' },
      { label: 'Upcoming Rides', value: bookings.filter((b) => b.status === 'confirmed').length, icon: TrendingUp, href: '/admin/bookings' },
    ];
  }, [bookings]);

  const chartData = useMemo(() => {
    const groups = new Map<string, { name: string; bookings: number; revenue: number }>();

    bookings.forEach((booking) => {
      const key = booking.formData.date;
      const current = groups.get(key) ?? { name: key.slice(5), bookings: 0, revenue: 0 };
      current.bookings += 1;
      current.revenue += (booking.paymentStatus === 'paid' && booking.status === 'completed') ? booking.totalPrice : 0;
      groups.set(key, current);
    });

    return Array.from(groups.values()).slice(-7);
  }, [bookings]);

  const upcomingRides = useMemo(() => {
    const now = new Date();
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    return bookings
      .filter((b) => {
        if (b.status !== 'confirmed') return false;
        const pickupDate = new Date(`${b.formData.date}T${b.formData.time}`);
        return pickupDate >= now && pickupDate <= twoDaysLater;
      })
      .sort((a, b) => {
        const da = new Date(`${a.formData.date}T${a.formData.time}`).getTime();
        const db = new Date(`${b.formData.date}T${b.formData.time}`).getTime();
        return da - db;
      });
  }, [bookings]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stat Cards – clickable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(stat.href)}
              className="bg-card rounded-xl border border-border p-5 shadow-luxury cursor-pointer hover:border-accent/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Rides – Card View */}
        {upcomingRides.length > 0 && (
          <div>
            <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-accent" /> Upcoming Rides (Next 48 Hours)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcomingRides.map((booking, i) => (
                <motion.div
                  key={booking.dbId ?? booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-card rounded-xl border border-border p-5 shadow-luxury cursor-pointer hover:border-accent/50 hover:shadow-md transition-all"
                >
                  {/* Header: customer + price */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{booking.customer.fullName}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{booking.customer.phone}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-display font-bold text-lg text-accent">${booking.totalPrice.toFixed(2)}</span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-sm mb-3 bg-secondary/50 rounded-lg px-3 py-2">
                    <CalendarDays className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="font-medium">{booking.formData.date}</span>
                    <span className="text-muted-foreground">at</span>
                    <span className="font-medium">{booking.formData.time}</span>
                  </div>

                  {/* Route */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      </div>
                      <span className="truncate">{booking.formData.pickupAddress}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      </div>
                      <span className="truncate">{booking.formData.dropoffAddress}</span>
                    </div>
                  </div>

                  {/* Footer: service type */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatServiceType(booking.formData.serviceType)}</span>
                    <span className="text-xs font-medium text-accent flex items-center gap-1">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Chart – clickable */}
        <div
          onClick={() => navigate('/admin/bookings')}
          className="bg-card rounded-xl border border-border p-5 shadow-luxury cursor-pointer hover:border-accent/50 transition-all"
        >
          <h3 className="font-display font-semibold mb-4">Live Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings Table – clickable rows */}
        <div className="bg-card rounded-xl border border-border shadow-luxury overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-display font-semibold">Recent Live Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Route</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 8).map((booking) => (
                  <tr
                    key={booking.dbId ?? booking.id}
                    onClick={() => navigate('/admin/bookings')}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3 font-mono text-xs">{booking.id}</td>
                    <td className="p-3 font-medium">{booking.customer.fullName}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">
                      {booking.formData.pickupAddress.split(',')[0]} → {booking.formData.dropoffAddress.split(',')[0]}
                    </td>
                    <td className="p-3 font-medium">${booking.totalPrice.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-accent/20 text-accent'
                          : booking.status === 'completed'
                            ? 'bg-secondary text-foreground'
                            : booking.status === 'pending'
                              ? 'bg-secondary text-muted-foreground'
                              : 'bg-destructive/20 text-destructive'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
