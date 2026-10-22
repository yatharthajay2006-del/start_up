import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  ShieldCheck,
  Check,
  X,
  Building,
  Mail,
  Phone,
  Search,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<UserRole | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminUsers();
      setUsers(res.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKycToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    try {
      await api.updateUserKyc(userId, nextStatus);
      loadUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter(u => {
    if (activeTab !== 'all' && u.role !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.companyName && u.companyName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            User Operations
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            User Directory & KYC Compliance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit merchant accounts, verify space host profiles, and toggle commercial KYC clearance.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          {(['all', 'business', 'owner', 'admin'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                activeTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'all' ? 'All Roles' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by user name, email, or company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-hidden"
        />
      </div>

      {/* Users Table (#26) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">User & Avatar</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Company Entity</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">KYC Status</th>
                <th className="py-3 px-4 text-center">KYC Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">Loading users...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">No users found in this category.</td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="block flex items-center gap-1 font-medium">
                        <Mail className="w-3 h-3 text-slate-400" /> {u.email}
                      </span>
                      <span className="block text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {u.phone}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {u.companyName || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'owner'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={u.kycStatus} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleKycToggle(u.id, u.kycStatus)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          u.kycStatus === 'verified'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {u.kycStatus === 'verified' ? 'Revoke KYC' : 'Verify KYC'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
