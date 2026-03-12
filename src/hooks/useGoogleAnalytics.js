import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const measurementId = import.meta.env?.VITE_GA_MEASUREMENT_ID;

    if (!measurementId || measurementId === 'your-google-analytics-measurement-id-here') {
      console.warn('Google Analytics Measurement ID not configured');
      return;
    }

    if (!window.dataLayer) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head?.appendChild(script);

      window.dataLayer = [];
      window.gtag = function gtag(...args) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false // We'll manually track page views
      });
    }

    // Track page view on route change
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_path: location?.pathname + location?.search,
        page_title: document.title
      });
    }
  }, [location]);
}

// Helper function for custom event tracking
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      ...eventParams,
      page: window.location?.pathname
    });
  }
}

// Predefined tracking functions for common events
export const analytics = {
  // Generic event tracking method
  trackEvent: (eventName, eventParams = {}) => {
    trackEvent(eventName, eventParams);
  },

  trackButtonClick: (buttonId, buttonLabel) => {
    trackEvent('button_click', {
      button_id: buttonId,
      button_label: buttonLabel
    });
  },

  trackFormSubmit: (formId, formName) => {
    trackEvent('form_submit', {
      form_id: formId,
      form_name: formName
    });
  },

  trackVoteCast: (electionId, votingMethod) => {
    trackEvent('vote_cast', {
      election_id: electionId,
      voting_method: votingMethod
    });
  },

  trackElectionCreated: (electionId, electionType) => {
    trackEvent('election_created', {
      election_id: electionId,
      election_type: electionType
    });
  },

  trackAlertAcknowledged: (alertId, alertSeverity) => {
    trackEvent('alert_acknowledged', {
      alert_id: alertId,
      alert_severity: alertSeverity
    });
  },

  trackFraudDetected: (fraudScore, riskLevel) => {
    trackEvent('fraud_detected', {
      fraud_score: fraudScore,
      risk_level: riskLevel
    });
  },

  trackPaymentProcessed: (amount, paymentMethod) => {
    trackEvent('payment_processed', {
      value: amount,
      payment_method: paymentMethod,
      currency: 'INR'
    });
  },

  trackUserEngagement: (engagementType, engagementValue) => {
    trackEvent('user_engagement', {
      engagement_type: engagementType,
      engagement_value: engagementValue
    });
  },

  trackSearch: (searchTerm, searchCategory) => {
    trackEvent('search', {
      search_term: searchTerm,
      search_category: searchCategory
    });
  },

  trackShare: (contentType, contentId, shareMethod) => {
    trackEvent('share', {
      content_type: contentType,
      content_id: contentId,
      method: shareMethod
    });
  },

  // Platform-specific tracking methods
  trackElectionEngagement: (electionId, engagementType, zone) => {
    trackEvent('election_engagement', {
      election_id: electionId,
      engagement_type: engagementType,
      zone: zone
    });
  },

  trackAdvertiserConversion: (campaignId, conversionValue, zone) => {
    trackEvent('advertiser_conversion', {
      campaign_id: campaignId,
      value: conversionValue,
      currency: 'INR',
      zone: zone
    });
  },

  trackZoneActivity: (zone, activityType, value) => {
    trackEvent('zone_activity', {
      zone: zone,
      activity_type: activityType,
      activity_value: value
    });
  },

  trackConversionFunnel: (funnelName, stage, metadata = {}) => {
    trackEvent('conversion_funnel', {
      funnel_name: funnelName,
      funnel_stage: stage,
      ...metadata
    });
  },

  trackUserFlow: (flowName, step, metadata = {}) => {
    trackEvent('user_flow', {
      flow_name: flowName,
      flow_step: step,
      ...metadata
    });
  },

  // Accessibility tracking for font size and theme preferences
  trackAccessibilityFontChange: (action, newSize, userId) => {
    trackEvent('accessibility_font_change', {
      action: action,
      new_size: newSize,
      user_id: userId,
    });
  },

  trackAccessibilityThemeChange: (newTheme, previousTheme) => {
    trackEvent('accessibility_theme_change', {
      new_theme: newTheme,
      previous_theme: previousTheme,
    });
  },

  trackAccessibilityEngagement: (featureType, engagementValue) => {
    trackEvent('accessibility_engagement', {
      feature_type: featureType,
      engagement_value: engagementValue,
    });
  },
};