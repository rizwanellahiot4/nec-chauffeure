import AdminLayout from '@/components/admin/AdminLayout';
import { CalendarDays, DollarSign, Car, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAdminBookings } from '@/hooks/use-live-data';
import { useMemo } from 'react';

const Dashboard = () => {
  const { data: bookings = [] } = useAdminBookings();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const paidBookings = bookings.filter((booking) => booking.paymentStatus === 'paid');

    return [
      { label: 'Total Bookings', value: bookings.length, icon: CalendarDays },
      { label: "Today's Bookings", value: bookings.filter((booking) => booking.formData.date === today).length, icon: Car },
      { label: 'Total Revenue', value: `$${paidBookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toFixed(2)}`, icon: DollarSign },
      { label: 'Upcoming Rides', value: bookings.filter((booking) => booking.status === 'confirmed').length, icon: TrendingUp },
    ];
  }, [bookings]);

  const chartData = useMemo(() => {
    const groups = new Map<string, { name: string; bookings: number; revenue: number }>();

    bookings.forEach((booking) => {
      const key = booking.formData.date;
      const current = groups.get(key) ?? { name: key.slice(5), bookings: 0, revenue: 0 };
      current.bookings += 1;
      current.revenue += booking.paymentStatus === 'paid' ? booking.totalPrice : 0;
      groups.set(key, current);
    });

    return Array.from(groups.values()).slice(-7);
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
