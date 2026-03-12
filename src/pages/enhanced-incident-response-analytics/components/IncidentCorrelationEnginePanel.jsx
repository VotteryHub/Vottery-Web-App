import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { advancedMonitoringService } from '../../../services/advancedMonitoringService';

const IncidentCorrelationEnginePanel = ({ timeRange, correlationData }) => {
  const [correlations, setCorrelations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCorrelations();
  }, [timeRange]);

  const loadCorrelations = async () => {
    setLoading(true);
    try {
      const result = await advancedMonitoringService?.getIncidentCorrelations({ timeRange });
      if (result?.data) {
        setCorrelations(result?.data);
      }
    } catch (error) {
      console.error('Error loading correlations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 70) return 'text-blue-500';
    if (confidence >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      critical: { label: 'Critical', color: 'bg-red-500' },
      high: { label: 'High', color: 'bg-orange-500' },
      medium: { label: 'Medium', color: 'bg-yellow-500' },
      low: { label: 'Low', color: 'bg-blue-500' }
    };
    return badges?.[severity] || badges?.low;
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
        <Icon name="GitMerge" className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Automated Incident Correlation Engine
        </h2>
      </div>
      {/* Correlation Matrix Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Correlations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {correlations?.length || 0}
              </p>
            </div>
            <Icon name="GitMerge" className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Confidence</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {correlations?.filter(c => c?.confidence >= 80)?.length || 0}
              </p>
            </div>
            <Icon name="Target" className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deployment Related</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {correlations?.filter(c => c?.type === 'deployment')?.length || 0}
              </p>
            </div>
            <Icon name="Package" className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
      {/* Correlation List */}
      <div className="space-y-4">
        {correlations?.map(correlation => {
          const severityBadge = getSeverityBadge(correlation?.severity);

          return (
            <div
              key={correlation?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {correlation?.monitoringAlert}
                    </h3>
                    <span className={`${severityBadge?.color} text-white text-xs px-2 py-1 rounded-full`}>
                      {severityBadge?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Correlated with: <span className="font-medium">{correlation?.featureImplementation}</span>
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <div className={`text-2xl font-bold ${getConfidenceColor(correlation?.confidence)}`}>
                    {correlation?.confidence}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                </div>
              </div>
              {/* Correlation Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Alert Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {correlation?.alertType}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Feature Deployed</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(correlation?.deploymentTime)?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time Difference</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {correlation?.timeDifference}
                  </p>
                </div>
              </div>
              {/* Evidence Correlation */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Evidence Correlation
                </h4>
                <div className="space-y-2">
                  {correlation?.evidence?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Icon name="CheckCircle" className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Impact Assessment */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Icon name="Users" className="w-4 h-4" />
                    {correlation?.affectedUsers || 0} users affected
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Activity" className="w-4 h-4" />
                    {correlation?.performanceImpact || 0}% performance impact
                  </span>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {correlations?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="GitMerge" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No incident correlations detected for the selected time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default IncidentCorrelationEnginePanel;