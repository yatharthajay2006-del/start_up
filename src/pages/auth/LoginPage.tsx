import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Boxes,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building,
  User as UserIcon,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, quickSwitch, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      onNavigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = async (role: 'business' | 'owner' | 'admin') => {
    setError(null);
    try {
      await quickSwitch(role);
      onNavigate(role === 'admin' ? '/admin/dashboard' : role === 'owner' ? '/owner/dashboard' : '/business/dashboard');
    } catch (err: any) {
      setError('Failed to switch demo account.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 text-left">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Boxes className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Store<span className="text-indigo-600">Flex</span>
          </h1>
          <p className="text-xs text-slate-500">
            Access your B2B storage units, warehouse properties, or operations console.
          </p>
        </div>

        {/* Demo Fast Login Selector (#38) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              1-Click Demo Accounts
            </span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Ready to Test
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('business')}
              className="w-full p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-600">
                  Rajesh Sharma (Businessman)
                </span>
                <span className="text-[10px] text-slate-500">business@storeflex.demo • Sharma Retail</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-1 rounded shadow-2xs">
                Log In ➔
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('owner')}
              className="w-full p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-600">
                  Vikram Malhotra (Space Owner)
                </span>
                <span className="text-[10px] text-slate-500">owner@storeflex.demo • Malhotra Logistics</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-1 rounded shadow-2xs">
                Log In ➔
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full p-2.5 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-600">
                  StoreFlex Admin Operations
                </span>
                <span className="text-[10px] text-slate-500">admin@storeflex.demo • Platform Operations</span>
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-white px-2 py-1 rounded shadow-2xs">
                Log In ➔
              </span>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Business Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@company.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-[11px] text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In with Email'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          New to StoreFlex?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="font-bold text-indigo-600 hover:underline"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};
