import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { advancedMonitoringService } from '../../../services/advancedMonitoringService';

const FeatureDeploymentCorrelationPanel = ({ timeRange }) => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeployments();
  }, [timeRange]);

  const loadDeployments = async () => {
    setLoading(true);
    try {
      const result = await advancedMonitoringService?.getFeatureDeploymentCorrelations({ timeRange });
      if (result?.data) {
        setDeployments(result?.data);
      }
    } catch (error) {
      console.error('Error loading deployments:', error);
    } finally {
      setLoading(false);
    }
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
        <Icon name="Package" className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Feature Deployment Correlation
        </h2>
      </div>

      <div className="space-y-6">
        {deployments?.map(deployment => (
          <div
            key={deployment?.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {deployment?.featureName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deployed: {new Date(deployment?.deployedAt)?.toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs text-white ${
                deployment?.hasIncidents ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {deployment?.hasIncidents ? 'INCIDENTS DETECTED' : 'STABLE'}
              </span>
            </div>

            {deployment?.hasIncidents && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Related Incidents
                </h4>
                <div className="space-y-2">
                  {deployment?.incidents?.map((incident, index) => (
                    <div
                      key={index}
                      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-red-900 dark:text-red-100">
                          {incident?.title}
                        </span>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          {incident?.timeSinceDeployment}
                        </span>
                      </div>
                      <p className="text-xs text-red-700 dark:text-red-300">
                        {incident?.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rollback Recommendations */}
            {deployment?.rollbackRecommended && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      Rollback Recommended
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                      {deployment?.rollbackReason}
                    </p>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm">
                      Initiate Rollback
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Deployment Impact Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Error Rate Change</p>
                <p className={`text-lg font-bold ${
                  deployment?.errorRateChange > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {deployment?.errorRateChange > 0 ? '+' : ''}{deployment?.errorRateChange}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Response Time</p>
                <p className={`text-lg font-bold ${
                  deployment?.responseTimeChange > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {deployment?.responseTimeChange > 0 ? '+' : ''}{deployment?.responseTimeChange}ms
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">User Impact</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {deployment?.affectedUsers || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confidence</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {deployment?.correlationConfidence}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deployments?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No feature deployments found for the selected time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureDeploymentCorrelationPanel;