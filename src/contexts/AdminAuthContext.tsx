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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let initialCheckDone = false;

    const finish = (isAdmin: boolean) => {
      if (!mounted) return;
      setIsAuthenticated(isAdmin);
      setIsLoading(false);
    };

    const syncSession = async (nextSession: Session | null) => {
      try {
        if (!nextSession?.user) {
          finish(false);
          return;
        }

        const isAdmin = await checkAdminAccess(nextSession);
        finish(isAdmin);

        if (!isAdmin) {
          await supabase.auth.signOut();
        }
      } catch {
        finish(false);
      }
    };

    // Restore session first, THEN subscribe to changes
    supabase.auth
      .getSession()
      .then(({ data }) => {
        initialCheckDone = true;
        return syncSession(data.session);
      })
      .catch(() => {
        initialCheckDone = true;
        finish(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Skip the initial SIGNED_IN event that duplicates getSession
      if (!initialCheckDone) return;
      void syncSession(nextSession);
    });

    // Generous timeout for slow networks on hard refresh
    const timeoutId = window.setTimeout(() => {
      if (!initialCheckDone) {
        finish(false);
      }
    }, 8000);

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login: async (email: string, password: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return false;
        }

        const { data } = await supabase.auth.getSession();
        const isAdmin = await checkAdminAccess(data.session);
        setIsAuthenticated(isAdmin);
        setIsLoading(false);

        if (!isAdmin) {
          await supabase.auth.signOut();
        }

        return isAdmin;
      },
      logout: async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setIsLoading(false);
      },
    }),
    [isAuthenticated, isLoading],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
