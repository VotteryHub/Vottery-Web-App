import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import { advancedMonitoringService } from '../../services/advancedMonitoringService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import IncidentCorrelationEnginePanel from './components/IncidentCorrelationEnginePanel';
import RootCauseAnalysisPanel from './components/RootCauseAnalysisPanel';
import SystemHealthImpactPanel from './components/SystemHealthImpactPanel';
import FeatureDeploymentCorrelationPanel from './components/FeatureDeploymentCorrelationPanel';
import PredictiveIncidentModelingPanel from './components/PredictiveIncidentModelingPanel';
import AutomatedCorrelationIntelligencePanel from './components/AutomatedCorrelationIntelligencePanel';

const EnhancedIncidentResponseAnalytics = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('correlation');
  const [timeRange, setTimeRange] = useState('24h');
  const [correlationData, setCorrelationData] = useState(null);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    analytics?.trackEvent('incident_response_analytics_viewed', {
      user_role: userProfile?.role,
      time_range: timeRange
    });
  }, [timeRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAnalyticsData();
      }, 15000); // Refresh every 15 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [correlation, incidents] = await Promise.all([
        advancedMonitoringService?.getIncidentCorrelationData({ timeRange }),
        advancedMonitoringService?.getActiveIncidents()
      ]);

      if (correlation?.data) {
        setCorrelationData(correlation?.data);
      }

      if (incidents?.data) {
        setActiveIncidents(incidents?.data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'correlation', label: 'Incident Correlation', icon: 'GitMerge' },
    { id: 'root_cause', label: 'Root Cause Analysis', icon: 'Search' },
    { id: 'health_impact', label: 'System Health Impact', icon: 'Activity' },
    { id: 'deployment', label: 'Feature Deployment', icon: 'Package' },
    { id: 'predictive', label: 'Predictive Modeling', icon: 'TrendingUp' },
    { id: 'intelligence', label: 'Correlation Intelligence', icon: 'Brain' }
  ];

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Enhanced Incident Response Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Automated incident correlation engine with root cause analysis and system health impact scoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/feature-implementation-tracking-engagement-analytics-center')}
              className="px-4 py-2 rounded-lg flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Icon name="Package" className="w-4 h-4" />
              Feature Implementation Tracking
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh
                  ? 'bg-green-500 text-white' :'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} className="w-4 h-4" />
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {timeRangeOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Incidents Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Incidents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeIncidents?.length || 0}
                </p>
              </div>
              <Icon name="AlertTriangle" className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Correlation Confidence</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {correlationData?.averageConfidence || 0}%
                </p>
              </div>
              <Icon name="Target" className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deployment Issues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {correlationData?.deploymentRelatedIncidents || 0}
                </p>
              </div>
              <Icon name="Package" className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {correlationData?.systemHealthScore || 0}%
                </p>
              </div>
              <Icon name="Activity" className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Critical Incidents Alert */}
        {activeIncidents?.filter(i => i?.severity === 'critical')?.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Icon name="AlertTriangle" className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Critical Incidents Detected
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {activeIncidents?.filter(i => i?.severity === 'critical')?.length} critical incidents require immediate attention
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Tab Navigation */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
        <div className="flex flex-wrap gap-2">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab?.id
                  ? 'bg-blue-500 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon name={tab?.icon} className="w-4 h-4" />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader" className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {activeTab === 'correlation' && (
              <IncidentCorrelationEnginePanel
                timeRange={timeRange}
                correlationData={correlationData}
              />
            )}
            {activeTab === 'root_cause' && (
              <RootCauseAnalysisPanel
                timeRange={timeRange}
                activeIncidents={activeIncidents}
              />
            )}
            {activeTab === 'health_impact' && (
              <SystemHealthImpactPanel
                timeRange={timeRange}
                correlationData={correlationData}
              />
            )}
            {activeTab === 'deployment' && (
              <FeatureDeploymentCorrelationPanel
                timeRange={timeRange}
              />
            )}
            {activeTab === 'predictive' && (
              <PredictiveIncidentModelingPanel
                timeRange={timeRange}
              />
            )}
            {activeTab === 'intelligence' && (
              <AutomatedCorrelationIntelligencePanel
                timeRange={timeRange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedIncidentResponseAnalytics;