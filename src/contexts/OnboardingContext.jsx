import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'vottery_onboarding_completed';
const STORAGE_KEY_ROLE = 'vottery_onboarding_role';

const OnboardingContext = createContext({});

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) return { shouldShowOnboarding: false, completeOnboarding: () => {} };
  return ctx;
};

export const OnboardingProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [checked, setChecked] = useState(false);

  const getCompletedRoles = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const completeOnboarding = (role) => {
    const completed = getCompletedRoles();
    if (role && !completed.includes(role)) {
      completed.push(role);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    }
  };

  const shouldShowOnboarding = () => {
    if (!user) return false;
    // If we have a user but no profile yet, wait for profile loading
    if (!userProfile) return false;
    
    // Bypass for super admins if needed, but per plan we keep them in 'admin'
    const role = userProfile?.role || 'voter';
    const mapped = ['super_admin', 'manager', 'moderator'].includes(role) ? 'admin' : role;
    const completed = getCompletedRoles();
    
    // Ensure we return a strict boolean
    return !completed.includes(mapped);
  };

  useEffect(() => {
    if (!user || !userProfile) return;
    setChecked(true);
  }, [user, userProfile]);

  const value = {
    shouldShowOnboarding: shouldShowOnboarding(),
    completeOnboarding,
    getCompletedRoles,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
