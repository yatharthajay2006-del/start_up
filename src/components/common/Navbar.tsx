import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Boxes,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Warehouse,
  Menu,
  X,
  Search,
  Calculator,
  Shield,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, role, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      api.getNotifications(user.id)
        .then(res => {
          const unread = res.notifications.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [user?.id, currentPath]);

  const dashboardRoute = role === 'admin'
    ? '/admin/dashboard'
    : role === 'owner'
    ? '/owner/dashboard'
    : '/business/dashboard';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    Store<span className="text-indigo-600">Flex</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200/60">
                    B2B
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-none">
                  Jitni jagah chahiye, utni hi rent karo.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('/business/storage')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentPath.startsWith('/business/storage') && !currentPath.includes('calculator')
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Storage
            </button>

            <button
              onClick={() => onNavigate('/business/storage-calculator')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentPath.includes('storage-calculator')
                  ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              Storage Calculator
            </button>

            <button
              onClick={() => onNavigate('/#how-it-works')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              How It Works
            </button>

            <button
              onClick={() => onNavigate('/#for-businesses')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              For Businesses
            </button>

            <button
              onClick={() => onNavigate('/#for-owners')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              For Space Owners
            </button>

            <button
              onClick={() => onNavigate('/roadmap')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Roadmap
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate(dashboardRoute)}
                  className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                    role === 'admin'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : role === 'owner'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Warehouse className="w-3.5 h-3.5" />
                  {role === 'admin' ? 'Admin Portal' : role === 'owner' ? 'Owner Portal' : 'My Storage Portal'}
                </button>

                <button
                  onClick={() => onNavigate('/notifications')}
                  title="Notifications"
                  className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="hidden lg:block text-left text-xs">
                      <p className="font-semibold text-slate-800 leading-tight truncate max-w-[110px]">{user.name}</p>
                      <p className="text-slate-500 text-[10px] capitalize leading-none">{user.role}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Role: {user.role}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate(dashboardRoute);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Warehouse className="w-3.5 h-3.5 text-slate-500" />
                        Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('/notifications');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Bell className="w-3.5 h-3.5 text-slate-500" />
                        Notifications
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          onNavigate('/login');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/business/storage'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-indigo-600" /> Find Storage
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/business/storage-calculator'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-emerald-600" /> Storage Calculator
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/#how-it-works'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            How It Works
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/#for-businesses'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            For Businesses
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/#for-owners'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            For Space Owners
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('/roadmap'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-slate-400" /> Roadmap
          </button>

          {user && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate(dashboardRoute); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-700 flex items-center gap-2"
              >
                <Warehouse className="w-4 h-4" /> Go to {role?.toUpperCase()} Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
