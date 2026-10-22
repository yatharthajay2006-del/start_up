import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Warehouse,
  Boxes,
  Truck,
  CreditCard,
  Bell,
  User as UserIcon,
  Building2,
  CalendarCheck,
  TrendingUp,
  BarChart3,
  Users,
  ShieldAlert,
  Percent,
  Sliders,
  LogOut,
  QrCode,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { user, role, logout } = useAuth();

  const businessNav = [
    { label: 'Dashboard', path: '/business/dashboard', icon: LayoutDashboard },
    { label: 'Find Storage', path: '/business/storage', icon: Search },
    { label: 'My Storage', path: '/business/my-storage', icon: Warehouse },
    { label: 'Inventory', path: '/business/inventory', icon: Boxes },
    { label: 'Logistics', path: '/business/logistics', icon: Truck },
    { label: 'Payments & Invoices', path: '/business/payments', icon: CreditCard },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const ownerNav = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Properties', path: '/owner/properties', icon: Building2 },
    { label: 'Bookings', path: '/owner/bookings', icon: CalendarCheck },
    { label: 'Earnings & Payouts', path: '/owner/earnings', icon: TrendingUp },
    { label: 'Analytics', path: '/owner/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Properties & Verification', path: '/admin/properties', icon: Building2 },
    { label: 'Users & KYC', path: '/admin/users', icon: Users },
    { label: 'All Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Logistics Dispatch', path: '/admin/logistics', icon: Truck },
    { label: 'Disputes & Support', path: '/admin/disputes', icon: ShieldAlert },
    { label: 'Demand Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Commission Settings', path: '/admin/settings/commission', icon: Percent },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'owner' ? ownerNav : businessNav;

  const roleTheme = role === 'admin'
    ? { border: 'border-purple-600', bg: 'bg-purple-50', text: 'text-purple-700', active: 'bg-purple-600 text-white' }
    : role === 'owner'
    ? { border: 'border-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', active: 'bg-emerald-600 text-white' }
    : { border: 'border-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', active: 'bg-indigo-600 text-white' };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col justify-between h-[calc(100vh-4rem-2rem)] sticky top-[6rem]">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Role identification badge */}
        <div className={`p-3 rounded-xl border ${roleTheme.border}/30 ${roleTheme.bg} flex items-center justify-between`}>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Active Workspace</p>
            <p className={`text-sm font-bold capitalize ${roleTheme.text}`}>
              {role === 'admin' ? 'Operations Admin' : role === 'owner' ? 'Warehouse Host' : 'Enterprise Buyer'}
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? `${roleTheme.active} shadow-xs font-semibold`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User footer card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-300"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.companyName || user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              onNavigate('/login');
            }}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
