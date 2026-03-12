import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { performanceMonitoringService } from '../services/performanceMonitoringService';

export function usePerformanceTracking(screenName) {
  const location = useLocation();
  const [loadStartTime] = useState(Date.now());

  useEffect(() => {
    // Track screen load time
    const loadTime = Date.now() - loadStartTime;
    
    performanceMonitoringService?.trackScreenLoad(
      screenName || location?.pathname,
      loadTime,
      {
        referrer: document?.referrer,
        userAgent: navigator?.userAgent
      }
    );

    // Track when user leaves the screen
    return () => {
      const timeOnScreen = Date.now() - loadStartTime;
      performanceMonitoringService?.trackInteraction(
        'screen_exit',
        screenName || location?.pathname,
        {
          time_on_screen: timeOnScreen
        }
      );
    };
  }, [screenName, location?.pathname, loadStartTime]);

  // Return tracking functions for component use
  return {
    trackInteraction: (interactionType, targetElement, metadata = {}) => {
      performanceMonitoringService?.trackInteraction(interactionType, targetElement, metadata);
    },
    trackFeatureAdoption: (featureName, adoptionStatus, metadata = {}) => {
      performanceMonitoringService?.trackFeatureAdoption(featureName, adoptionStatus, metadata);
    },
    trackConversionFunnel: (funnelName, step, completed = false, metadata = {}) => {
      performanceMonitoringService?.trackConversionFunnel(funnelName, step, completed, metadata);
    }
  };
}