import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { advancedMonitoringService } from '../../../services/advancedMonitoringService';

const RootCauseAnalysisPanel = ({ timeRange, activeIncidents }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    loadAnalyses();
  }, [timeRange, activeIncidents]);

  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const result = await advancedMonitoringService?.getRootCauseAnalyses({ timeRange });
      if (result?.data) {
        setAnalyses(result?.data);
      }
    } catch (error) {
      console.error('Error loading analyses:', error);
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
        <Icon name="Search" className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Root Cause Analysis
        </h2>
      </div>

      <div className="space-y-6">
        {analyses?.map(analysis => (
          <div
            key={analysis?.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {analysis?.incidentTitle}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analysis?.description}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs text-white ${
                analysis?.status === 'resolved' ? 'bg-green-500' :
                analysis?.status === 'investigating'? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {analysis?.status?.toUpperCase()}
              </span>
            </div>

            {/* Timeline Reconstruction */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Timeline Reconstruction
              </h4>
              <div className="space-y-2">
                {analysis?.timeline?.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {event?.action}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event?.timestamp)?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {event?.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Dependency Mapping */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                System Dependency Mapping
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {analysis?.dependencies?.map((dep, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      dep?.affected
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20' :'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        name={dep?.affected ? 'AlertCircle' : 'CheckCircle'}
                        className={`w-4 h-4 ${
                          dep?.affected ? 'text-red-500' : 'text-green-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {dep?.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {dep?.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Root Cause Hypothesis */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Root Cause Hypothesis
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                {analysis?.rootCauseHypothesis}
              </p>
              <div className="flex items-center gap-2">
                <Icon name="Target" className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Confidence: {analysis?.confidence}%
                </span>
              </div>
            </div>

            {/* Impact Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Affected Systems</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {analysis?.affectedSystems || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Affected Users</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {analysis?.affectedUsers || 0}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Downtime</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {analysis?.downtime || '0m'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {analyses?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No root cause analyses available for the selected time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default RootCauseAnalysisPanel;