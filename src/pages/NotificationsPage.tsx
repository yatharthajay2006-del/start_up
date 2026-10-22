import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AppNotification } from '../types';
import {
  Bell,
  Check,
  Warehouse,
  CreditCard,
  Boxes,
  ShieldCheck,
  Truck,
  ShieldAlert,
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    loadNotifications();
  }, [user?.id]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await api.getNotifications(user?.id);
      setNotifications(res.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, link?: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (link) {
      onNavigate(link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Warehouse className="w-4 h-4 text-indigo-600" />;
      case 'payment':
      case 'payout':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'inventory':
        return <Boxes className="w-4 h-4 text-purple-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'logistics':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'dispute':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time activity alerts on bookings, gateway payments, stock inward, and verification status.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {notifications.filter(n => !n.isRead).length} Unread
        </span>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">You have no notifications yet.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id, n.link)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 text-xs ${
                n.isRead
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-indigo-50/50 border-indigo-200 shadow-xs hover:border-indigo-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 shrink-0">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs ${n.isRead ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                {n.link && (
                  <span className="inline-block text-[10px] font-bold text-indigo-600 hover:underline pt-1">
                    View Details ➔
                  </span>
                )}
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
