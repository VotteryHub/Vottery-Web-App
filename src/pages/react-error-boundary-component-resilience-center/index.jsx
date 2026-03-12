import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, AlertTriangle, Activity, TrendingUp, CheckCircle, RefreshCw, BarChart3 } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';

import ErrorBoundaryConfigPanel from './components/ErrorBoundaryConfigPanel';
import ComponentHealthPanel from './components/ComponentHealthPanel';
import GoogleAnalyticsIntegrationPanel from './components/GoogleAnalyticsIntegrationPanel';
import FallbackUIManagementPanel from './components/FallbackUIManagementPanel';

import { googleAnalyticsService } from '../../services/googleAnalyticsService';

const ReactErrorBoundaryComponentResilienceCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [errorBoundaries, setErrorBoundaries] = useState([]);
  const [componentHealth, setComponentHealth] = useState(null);
  const [errorMetrics, setErrorMetrics] = useState(null);

  useEffect(() => {
    loadErrorBoundaryData();
  }, []);

  const loadErrorBoundaryData = async () => {
    setLoading(true);
    try {
      // Mock data for error boundaries
      setErrorBoundaries([
        { id: 1, name: 'AdminControlCenter', status: 'active', errors: 0, recoveries: 12 },
        { id: 2, name: 'CreatorEarningsCenter', status: 'active', errors: 2, recoveries: 8 },
        { id: 3, name: 'ContentModerationCenter', status: 'active', errors: 1, recoveries: 15 },
        { id: 4, name: 'ElectionsDashboard', status: 'active', errors: 0, recoveries: 20 }
      ]);

      setComponentHealth({
        totalComponents: 145,
        healthyComponents: 142,
        warningComponents: 2,
        criticalComponents: 1,
        failureRate: 2.1,
        recoveryRate: 97.9
      });

      setErrorMetrics({
        totalErrors: 23,
        resolvedErrors: 21,
        activeErrors: 2,
        userImpact: 'Low',
        avgRecoveryTime: '1.2s'
      });

      googleAnalyticsService?.trackUserFlow('error_boundary_center', 'data_loaded');
    } catch (error) {
      console.error('Error loading error boundary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'configuration', label: 'Configuration', icon: Shield },
    { id: 'health', label: 'Component Health', icon: TrendingUp },
    { id: 'analytics', label: 'GA Integration', icon: BarChart3 },
    { id: 'fallback', label: 'Fallback UI', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Helmet>
        <title>React Error Boundary & Component Resilience Center | Vottery</title>
      </Helmet>

      <HeaderNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                React Error Boundary & Component Resilience Center
              </h1>
              <p className="text-neutral-600 mt-2">
                Comprehensive error handling management with automated error boundary deployment and Google Analytics tracking
              </p>
            </div>
            <Button
              onClick={loadErrorBoundaryData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">Active Boundaries</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{errorBoundaries?.length}</p>
            <p className="text-xs text-neutral-500 mt-1">Across all screens</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">Component Health</span>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{componentHealth?.recoveryRate}%</p>
            <p className="text-xs text-neutral-500 mt-1">Recovery rate</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">Active Errors</span>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{errorMetrics?.activeErrors}</p>
            <p className="text-xs text-neutral-500 mt-1">Requiring attention</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">User Impact</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{errorMetrics?.userImpact}</p>
            <p className="text-xs text-neutral-500 mt-1">Current status</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
          <div className="border-b border-neutral-200">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'text-blue-600 border-b-2 border-blue-600' :'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab?.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Error Boundary Status</h3>
                  <div className="space-y-3">
                    {errorBoundaries?.map((boundary) => (
                      <div key={boundary?.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            boundary?.errors === 0 ? 'bg-green-500' : 'bg-orange-500'
                          }`} />
                          <div>
                            <p className="font-medium text-neutral-800">{boundary?.name}</p>
                            <p className="text-sm text-neutral-600">
                              {boundary?.errors} errors · {boundary?.recoveries} recoveries
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          boundary?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {boundary?.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'configuration' && <ErrorBoundaryConfigPanel />}
            {activeTab === 'health' && <ComponentHealthPanel componentHealth={componentHealth} />}
            {activeTab === 'analytics' && <GoogleAnalyticsIntegrationPanel errorMetrics={errorMetrics} />}
            {activeTab === 'fallback' && <FallbackUIManagementPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactErrorBoundaryComponentResilienceCenter;