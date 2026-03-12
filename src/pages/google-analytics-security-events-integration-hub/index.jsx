import React, { useState, useEffect } from 'react';
import { BarChart3, Shield, TrendingUp, AlertCircle, Activity, Lock } from 'lucide-react';
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics';
import AuthenticationSecurityPanel from './components/AuthenticationSecurityPanel';
import PaymentFraudDetectionPanel from './components/PaymentFraudDetectionPanel';
import VoteManipulationPanel from './components/VoteManipulationPanel';
import PolicyViolationPanel from './components/PolicyViolationPanel';
import SecurityEventConfigPanel from './components/SecurityEventConfigPanel';
import RealTimeAlertsPanel from './components/RealTimeAlertsPanel';
import Icon from '../../components/AppIcon';


const GoogleAnalyticsSecurityEventsIntegrationHub = () => {
  useGoogleAnalytics();

  const [metrics, setMetrics] = useState({
    authAnomalies: 0,
    paymentFraud: 0,
    voteManipulation: 0,
    policyViolations: 0,
    totalEvents: 0,
    alertsTriggered: 0
  });

  useEffect(() => {
    // Track page view
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_title: 'Google Analytics Security Events Integration Hub',
        page_location: window.location?.href,
        page_path: window.location?.pathname
      });
    }

    // Simulate fetching metrics
    fetchSecurityMetrics();
  }, []);

  const fetchSecurityMetrics = () => {
    // In production, fetch from Google Analytics API
    setMetrics({
      authAnomalies: 12,
      paymentFraud: 5,
      voteManipulation: 3,
      policyViolations: 8,
      totalEvents: 28,
      alertsTriggered: 4
    });
  };

  const trackSecurityEvent = (eventName, eventParams) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, {
        ...eventParams,
        event_category: 'security',
        timestamp: new Date()?.toISOString()
      });
    }
  };

  const metricCards = [
    { label: 'Authentication Anomalies', value: metrics?.authAnomalies, icon: Shield, color: 'red' },
    { label: 'Payment Fraud Attempts', value: metrics?.paymentFraud, icon: AlertCircle, color: 'orange' },
    { label: 'Vote Manipulation', value: metrics?.voteManipulation, icon: Activity, color: 'yellow' },
    { label: 'Policy Violations', value: metrics?.policyViolations, icon: Lock, color: 'purple' },
    { label: 'Total Security Events', value: metrics?.totalEvents, icon: BarChart3, color: 'blue' },
    { label: 'Alerts Triggered', value: metrics?.alertsTriggered, icon: TrendingUp, color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Google Analytics Security Events Integration Hub
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive security analytics tracking with automated monitoring and real-time alerting
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-600">GA4 Connected</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricCards?.map((metric, index) => {
            const Icon = metric?.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric?.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric?.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${metric?.color}-100`}>
                    <Icon className={`w-6 h-6 text-${metric?.color}-600`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Analytics Panels */}
        <div className="space-y-6">
          <RealTimeAlertsPanel trackEvent={trackSecurityEvent} />
          <AuthenticationSecurityPanel trackEvent={trackSecurityEvent} />
          <PaymentFraudDetectionPanel trackEvent={trackSecurityEvent} />
          <VoteManipulationPanel trackEvent={trackSecurityEvent} />
          <PolicyViolationPanel trackEvent={trackSecurityEvent} />
          <SecurityEventConfigPanel trackEvent={trackSecurityEvent} />
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsSecurityEventsIntegrationHub;