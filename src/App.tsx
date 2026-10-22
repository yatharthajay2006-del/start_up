import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Business Pages
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { StorageMarketplace } from './pages/business/StorageMarketplace';
import { SmartCalculatorPage } from './pages/business/SmartCalculatorPage';
import { InventoryPage } from './pages/business/InventoryPage';
import { LogisticsPage } from './pages/business/LogisticsPage';
import { PaymentsPage } from './pages/business/PaymentsPage';

// Owner Pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { OwnerPropertiesPage } from './pages/owner/OwnerPropertiesPage';
import { NewPropertyPage } from './pages/owner/NewPropertyPage';
import { OwnerBookingsPage } from './pages/owner/OwnerBookingsPage';
import { OwnerEarningsPage } from './pages/owner/OwnerEarningsPage';
import { OwnerAnalyticsPage } from './pages/owner/OwnerAnalyticsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminCommissionPage } from './pages/admin/AdminCommissionPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminLogisticsPage } from './pages/admin/AdminLogisticsPage';

import { ShieldAlert, ArrowRight, Warehouse, Home } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, role, isLoading, quickSwitch } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    // Handle anchor links for landing page sections
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
        setTimeout(() => {
          const id = path.slice(2);
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const id = path.slice(2);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Role authorization guard (#3: A user must never be able to access another role's private dashboard)
  const isDashboardRoute =
    currentPath.startsWith('/business/') ||
    currentPath.startsWith('/owner/') ||
    currentPath.startsWith('/admin/');

  let unauthorizedAttempt = false;
  let requiredRole: 'business' | 'owner' | 'admin' | null = null;

  if (currentPath.startsWith('/admin/')) {
    requiredRole = 'admin';
    if (role !== 'admin') unauthorizedAttempt = true;
  } else if (currentPath.startsWith('/owner/')) {
    requiredRole = 'owner';
    if (role !== 'owner') unauthorizedAttempt = true;
  } else if (
    currentPath.startsWith('/business/') &&
    !['/business/storage', '/business/storage-calculator'].includes(currentPath)
  ) {
    requiredRole = 'business';
    if (role !== 'business') unauthorizedAttempt = true;
  }

  // Render current view
  const renderView = () => {
    // Check role unauthorized barrier
    if (unauthorizedAttempt && requiredRole) {
      return (
        <div className="max-w-lg mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-lg text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-1">
              This area is restricted to <strong>{requiredRole.toUpperCase()}</strong> accounts.
              You are currently logged in as a <strong>{role?.toUpperCase()}</strong>.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            Rule #3: Role-based route protection enforces strict separation between Business, Space Owner, and Admin portals.
          </div>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={() => quickSwitch(requiredRole)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
            >
              Switch to {requiredRole.toUpperCase()} Demo Account
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    switch (currentPath) {
      // Public / Marketing
      case '/':
        return <LandingPage onNavigate={navigate} />;
      case '/roadmap':
        return <RoadmapPage onNavigate={navigate} />;
      case '/notifications':
        return <NotificationsPage onNavigate={navigate} />;

      // Auth
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;

      // Businessman Portal
      case '/business/dashboard':
      case '/business/my-storage':
        return <BusinessDashboard onNavigate={navigate} />;
      case '/business/storage':
        return <StorageMarketplace onNavigate={navigate} />;
      case '/business/storage-calculator':
        return <SmartCalculatorPage onNavigate={navigate} />;
      case '/business/inventory':
        return <InventoryPage />;
      case '/business/logistics':
        return <LogisticsPage />;
      case '/business/payments':
        return <PaymentsPage />;

      // Space Owner Portal
      case '/owner/dashboard':
        return <OwnerDashboard onNavigate={navigate} />;
      case '/owner/properties':
        return <OwnerPropertiesPage onNavigate={navigate} />;
      case '/owner/properties/new':
        return <NewPropertyPage onNavigate={navigate} />;
      case '/owner/bookings':
        return <OwnerBookingsPage />;
      case '/owner/earnings':
        return <OwnerEarningsPage />;
      case '/owner/analytics':
        return <OwnerAnalyticsPage />;

      // Admin Operations Portal
      case '/admin/dashboard':
        return <AdminDashboard onNavigate={navigate} />;
      case '/admin/properties':
      case '/admin/verifications':
        return <AdminPropertiesPage />;
      case '/admin/users':
      case '/admin/kyc':
        return <AdminUsersPage />;
      case '/admin/bookings':
        return <AdminBookingsPage />;
      case '/admin/disputes':
        return <AdminDisputesPage />;
      case '/admin/commission':
      case '/admin/settings':
      case '/admin/settings/commission':
        return <AdminCommissionPage />;
      case '/admin/analytics':
        return <AdminAnalyticsPage />;
      case '/admin/logistics':
        return <AdminLogisticsPage />;

      default:
        // Fallback to storage search if matched
        if (currentPath.startsWith('/business/storage')) {
          return <StorageMarketplace onNavigate={navigate} />;
        }
        return <LandingPage onNavigate={navigate} />;
    }
  };

  const showSidebar = isDashboardRoute && !unauthorizedAttempt;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      {/* Top Demo Banner (#54) */}
      <DemoBanner />

      {/* Main Sticky Navbar (#56) */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Content Layout: With persistent sidebar for dashboards (#55) or full width */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {showSidebar && (
          <Sidebar currentPath={currentPath} onNavigate={navigate} />
        )}

        <main className={`flex-1 ${showSidebar ? 'p-4 sm:p-6 lg:p-8 overflow-x-hidden' : ''}`}>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
