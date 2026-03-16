import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { LayoutDashboard, CalendarDays, Car, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useBrandSettings } from '@/hooks/use-live-data';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
  { label: 'Vehicles', path: '/admin/vehicles', icon: Car },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAdminAuth();
  const { data: brand } = useBrandSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gold-gradient flex items-center justify-center">
            <Car className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-sidebar-foreground">
            {brand?.businessName ?? 'EliteDrive'}
          </span>
        </Link>
        <p className="text-xs text-sidebar-foreground/50 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col bg-sidebar">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-md hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-display font-semibold text-sm">
            {navItems.find((i) => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
