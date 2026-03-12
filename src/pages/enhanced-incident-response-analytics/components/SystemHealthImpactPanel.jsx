import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { advancedMonitoringService } from '../../../services/advancedMonitoringService';

const SystemHealthImpactPanel = ({ timeRange, correlationData }) => {
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthMetrics();
  }, [timeRange]);

  const loadHealthMetrics = async () => {
    setLoading(true);
    try {
      const result = await advancedMonitoringService?.getSystemHealthImpact({ timeRange });
      if (result?.data) {
        setHealthMetrics(result?.data);
      }
    } catch (error) {
      console.error('Error loading health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBg = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <Icon name="Loader" className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Activity" className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Health Impact Scoring
        </h2>
      </div>

      {/* Overall Health Score */}
      {healthMetrics && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-8 mb-8">
          <div className="text-center">
            <div className={`text-6xl font-bold ${getHealthColor(healthMetrics?.overallScore)} mb-2`}>
              {healthMetrics?.overallScore}%
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Overall System Health
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {healthMetrics?.overallScore >= 90 ? 'Excellent' :
               healthMetrics?.overallScore >= 70 ? 'Good' :
               healthMetrics?.overallScore >= 50 ? 'Fair' : 'Critical'}
            </p>
          </div>
        </div>
      )}

      {/* Health Degradation Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Real-Time Health Degradation Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthMetrics?.degradationMetrics?.map((metric, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {metric?.systemName}
                </h4>
                <span className={`text-lg font-bold ${getHealthColor(metric?.healthScore)}`}>
                  {metric?.healthScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`${getHealthBg(metric?.healthScore)} h-2 rounded-full transition-all`}
                  style={{ width: `${metric?.healthScore}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Response Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {metric?.responseTime}ms
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Error Rate</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {metric?.errorRate}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Uptime</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {metric?.uptime}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Correlation Analysis */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Correlation Analysis
        </h3>
        <div className="space-y-4">
          {healthMetrics?.performanceCorrelations?.map((correlation, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {correlation?.metric}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {correlation?.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs text-white ${
                  correlation?.impact === 'high' ? 'bg-red-500' :
                  correlation?.impact === 'medium'? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  {correlation?.impact?.toUpperCase()} IMPACT
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Icon name="TrendingDown" className="w-4 h-4 text-red-500" />
                  {correlation?.degradation}% degradation
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" className="w-4 h-4 text-blue-500" />
                  Detected {correlation?.detectedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Severity Classification */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Automated Severity Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="AlertTriangle" className="w-6 h-6 text-red-500" />
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {healthMetrics?.severityCounts?.critical || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-red-900 dark:text-red-100">Critical</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="AlertCircle" className="w-6 h-6 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {healthMetrics?.severityCounts?.high || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">High</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Info" className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {healthMetrics?.severityCounts?.medium || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Medium</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="CheckCircle" className="w-6 h-6 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {healthMetrics?.severityCounts?.low || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Low</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthImpactPanel;