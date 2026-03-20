import AdminLayout from '@/components/admin/AdminLayout';
import { CalendarDays, DollarSign, Car, TrendingUp, Clock, MapPin, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAdminBookings } from '@/hooks/use-live-data';
import { useMemo } from 'react';
import { formatServiceType } from '@/lib/booking-options';

const Dashboard = () => {
  const { data: bookings = [] } = useAdminBookings();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    // Only paid AND completed bookings count toward revenue
    const revenueBookings = bookings.filter(
      (b) => b.paymentStatus === 'paid' && b.status === 'completed'
    );

    return [
      { label: 'Total Bookings', value: bookings.length, icon: CalendarDays },
      { label: "Today's Bookings", value: bookings.filter((b) => b.formData.date === today).length, icon: Car },
      { label: 'Total Revenue', value: `$${revenueBookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}`, icon: DollarSign },
      { label: 'Upcoming Rides', value: bookings.filter((b) => b.status === 'confirmed').length, icon: TrendingUp },
    ];
  }, [bookings]);

  const chartData = useMemo(() => {
    const groups = new Map<string, { name: string; bookings: number; revenue: number }>();

    bookings.forEach((booking) => {
      const key = booking.formData.date;
      const current = groups.get(key) ?? { name: key.slice(5), bookings: 0, revenue: 0 };
      current.bookings += 1;
      // Only paid + completed count as revenue
      current.revenue += (booking.paymentStatus === 'paid' && booking.status === 'completed') ? booking.totalPrice : 0;
      groups.set(key, current);
    });

    return Array.from(groups.values()).slice(-7);
  }, [bookings]);

  // Upcoming rides within 2 days
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border p-5 shadow-luxury">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Rides (within 2 days) */}
        {upcomingRides.length > 0 && (
          <div className="bg-card rounded-xl border border-border shadow-luxury overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" /> Upcoming Rides (Next 48 Hours)
              </h3>
            </div>
            <div className="divide-y divide-border">
              {upcomingRides.map((booking) => (
                <div key={booking.dbId ?? booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{booking.customer.fullName}</p>
                      <p className="text-xs text-muted-foreground">{booking.customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{booking.formData.date} at {booking.formData.time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground flex-1 min-w-0">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{booking.formData.pickupAddress.split(',')[0]} → {booking.formData.dropoffAddress.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{formatServiceType(booking.formData.serviceType)}</span>
                    <span className="font-display font-bold text-sm">${booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border p-5 shadow-luxury">
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
                  <tr key={booking.dbId ?? booking.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
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
