import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

const checkAdminAccess = async (session: Session | null) => {
  if (!session?.user) return false;

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSession = async (nextSession: Session | null) => {
      if (!mounted) return;
      setSession(nextSession);
      const isAdmin = await checkAdminAccess(nextSession);
      if (!mounted) return;
      setIsAuthenticated(isAdmin);
      setIsLoading(false);
      if (nextSession && !isAdmin) {
        await supabase.auth.signOut();
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      void syncSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    login: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return false;
      const { data } = await supabase.auth.getSession();
      const isAdmin = await checkAdminAccess(data.session);
      setIsAuthenticated(isAdmin);
      setSession(data.session);
      if (!isAdmin) {
        await supabase.auth.signOut();
      }
      return isAdmin;
    },
    logout: async () => {
      await supabase.auth.signOut();
      setSession(null);
      setIsAuthenticated(false);
    },
  }), [isAuthenticated]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
