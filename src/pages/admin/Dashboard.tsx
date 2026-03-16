import AdminLayout from '@/components/admin/AdminLayout';
import { mockBookings } from '@/data/mockBookings';
import { CalendarDays, DollarSign, Car, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const chartData = [
  { name: 'Mon', bookings: 4, revenue: 380 },
  { name: 'Tue', bookings: 6, revenue: 520 },
  { name: 'Wed', bookings: 3, revenue: 280 },
  { name: 'Thu', bookings: 8, revenue: 720 },
  { name: 'Fri', bookings: 12, revenue: 1100 },
  { name: 'Sat', bookings: 9, revenue: 850 },
  { name: 'Sun', bookings: 5, revenue: 450 },
];

const stats = [
  { label: 'Total Bookings', value: mockBookings.length, icon: CalendarDays, color: 'text-accent' },
  { label: 'Today\'s Bookings', value: 2, icon: Car, color: 'text-accent' },
  { label: 'Total Revenue', value: `$${mockBookings.reduce((s, b) => s + b.totalPrice, 0).toFixed(0)}`, icon: DollarSign, color: 'text-accent' },
  { label: 'Upcoming Rides', value: mockBookings.filter(b => b.status === 'confirmed').length, icon: TrendingUp, color: 'text-accent' },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 shadow-luxury"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-luxury">
          <h3 className="font-display font-semibold mb-4">Weekly Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0 0% 100%)',
                    border: '1px solid hsl(214.3 31.8% 91.4%)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="bookings" fill="hsl(39 48% 56%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-card rounded-xl border border-border shadow-luxury overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-display font-semibold">Recent Bookings</h3>
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
                {mockBookings.map(booking => (
                  <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-mono text-xs">{booking.id}</td>
                    <td className="p-3 font-medium">{booking.customer.fullName}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">
                      {booking.formData.pickupAddress.split(',')[0]} → {booking.formData.dropoffAddress.split(',')[0]}
                    </td>
                    <td className="p-3 font-medium">${booking.totalPrice.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-accent/20 text-accent' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-destructive/20 text-destructive'
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
