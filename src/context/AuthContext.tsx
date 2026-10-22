import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; role: string; password?: string; companyName?: string }) => Promise<void>;
  quickSwitch: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'storeflex_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize session from localStorage or auto-load demo business user
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Default to business user on first load
    api.quickSwitchUser('business')
      .then(res => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
        }
      })
      .catch(err => {
        console.warn('Initial auth load fallback:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    role: string;
    password?: string;
    companyName?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickSwitch = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.quickSwitchUser(targetRole);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        login,
        register,
        quickSwitch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
