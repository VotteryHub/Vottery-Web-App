import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { accessibilityAnalyticsService } from '../services/accessibilityAnalyticsService';

const FontSizeContext = createContext();

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within FontSizeProvider');
  }
  return context;
};

export const FontSizeProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [fontSize, setFontSizeState] = useState(15);
  const [loading, setLoading] = useState(true);
  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 18;

  useEffect(() => {
    loadFontSize();
  }, [user, userProfile]);

  useEffect(() => {
    document.documentElement?.style?.setProperty('--user-font-size', `${fontSize}px`);
  }, [fontSize]);

  const loadFontSize = async () => {
    try {
      if (user && userProfile) {
        const { data, error } = await supabase
          ?.from('user_profiles')
          ?.select('preferences')
          ?.eq('id', user?.id)
          ?.single();

        if (!error && data?.preferences?.fontSize) {
          setFontSizeState(data?.preferences?.fontSize);
        } else {
          const localFontSize = localStorage.getItem('vottery-font-size');
          if (localFontSize) {
            setFontSizeState(parseInt(localFontSize));
          }
        }
      } else {
        const localFontSize = localStorage.getItem('vottery-font-size');
        if (localFontSize) {
          setFontSizeState(parseInt(localFontSize));
        }
      }
    } catch (error) {
      console.error('Error loading font size:', error);
    } finally {
      setLoading(false);
    }
  };

  const setFontSize = async (newSize) => {
    const previousSize = fontSize;
    const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, newSize));
    setFontSizeState(clampedSize);
    localStorage.setItem('vottery-font-size', clampedSize?.toString());

    if (user) {
      try {
        const { data: currentProfile } = await supabase
          ?.from('user_profiles')
          ?.select('preferences')
          ?.eq('id', user?.id)
          ?.single();

        const updatedPreferences = {
          ...(currentProfile?.preferences || {}),
          fontSize: clampedSize
        };

        await supabase
          ?.from('user_profiles')
          ?.update({ preferences: updatedPreferences })
          ?.eq('id', user?.id);

        const action = clampedSize > previousSize ? 'increase' : clampedSize < previousSize ? 'decrease' : 'set';
        await accessibilityAnalyticsService?.trackFontSizeChange(user?.id, action, clampedSize, previousSize);
      } catch (error) {
        console.error('Error saving font size to Supabase:', error);
      }
    }
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 1, MAX_FONT_SIZE);
    setFontSize(newSize);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 1, MIN_FONT_SIZE);
    setFontSize(newSize);
  };

  const resetFontSize = () => {
    setFontSize(15);
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        MIN_FONT_SIZE,
        MAX_FONT_SIZE,
        loading
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

export default FontSizeContext;