import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { creatorChurnPredictionService } from '../services/creatorChurnPredictionService';
import { securityLoginGeoService } from '../services/securityLoginGeoService';
import { permissionService } from '../services/permissionService';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Isolated async operations - never called from auth callbacks
  const profileOperations = {
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      
      // Fail-safe timeout to prevent infinite spinner if Supabase hangs
      const timeout = setTimeout(() => {
        console.warn('[AuthContext] Profile load timed out - forcing clear.');
        setProfileLoading(false);
      }, 5000);

      try {
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
        if (!error) setUserProfile(data)
      } catch (error) {
        console.error('Profile load error:', error)
      } finally {
        clearTimeout(timeout);
        setProfileLoading(false)
      }
    },

    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  // Auth state handlers - PROTECTED from async modification
  const authStateHandlers = {
    // This handler MUST remain synchronous - Supabase requirement
    onChange: (event, session) => {
      const isSignedOut = event === 'SIGNED_OUT';
      const currentUser = session?.user ?? null;
      
      setUser(currentUser);
      
      if (currentUser && !isSignedOut) {
        profileOperations?.load(currentUser?.id); // Fire-and-forget
      } else {
        profileOperations?.clear();
      }
      
      // Ensure loading is false once we've processed the initial check or any subsequent change
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initial session check — with 3s timeout for local dev (no Supabase connection)
    const sessionTimeout = new Promise((resolve) => setTimeout(() => resolve({ data: { session: null } }), 3000));
    Promise.race([
      supabase?.auth?.getSession() ?? sessionTimeout,
      sessionTimeout
    ])?.then(({ data: { session } }) => {
      if (mounted) {
        authStateHandlers?.onChange('INITIAL_SESSION', session);
      }
    })?.catch(() => {
      if (mounted) setLoading(false);
    });

    // CRITICAL: authStateHandlers.onChange must remain synchronous
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log(`[AuthContext] State change: ${event}`);
        authStateHandlers?.onChange(event, session);

        if (
          session?.user &&
          (event === 'INITIAL_SESSION' || event === 'SIGNED_IN')
        ) {
          creatorChurnPredictionService?.invokeUserChurnRefreshIfDue?.();
          securityLoginGeoService?.invokeRecordLoginGeoIfDue?.();
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Auth methods
  const signIn = async (email, password, options = {}) => {
    const { data, error } = await authService?.signInPasskeyFirst(
      email,
      password,
      options
    );
    return { data, error };
  }

  const signUp = async (email, password, userData) => {
    const { data, error } = await authService?.signUp(email, password, userData);
    return { data, error };
  }

  const signOut = async () => {
    const { error } = await authService?.signOut();
    if (!error) {
      setUser(null);
      profileOperations?.clear();
    }
    return { error };
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }
    
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      if (!error) setUserProfile(data)
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const can = (permission, context = null) => {
    return permissionService.can(userProfile, permission, context);
  };

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    can,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };