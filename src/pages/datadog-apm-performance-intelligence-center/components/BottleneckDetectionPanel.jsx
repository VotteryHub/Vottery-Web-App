import React from 'react';
import Icon from '../../../components/AppIcon';

const BottleneckDetectionPanel = ({ bottlenecks }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={24} className="text-red-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {bottlenecks?.filter(b => b?.severity === 'critical')?.length || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Critical Bottlenecks</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={24} className="text-orange-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {bottlenecks?.filter(b => b?.severity === 'high')?.length || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Info" size={24} className="text-blue-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {bottlenecks?.length || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Detected</p>
        </div>
      </div>

      {/* Bottleneck List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Icon name="Search" size={20} />
          Automatic Bottleneck Detection
        </h3>

        {!bottlenecks || bottlenecks?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No performance bottlenecks detected</p>
          </div>
        ) : (
          bottlenecks?.map((bottleneck, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${getSeverityColor(bottleneck?.severity)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(bottleneck?.severity)}`}>
                      {bottleneck?.severity?.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {bottleneck?.totalRequests} requests analyzed
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {bottleneck?.endpoint}
                  </h4>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{bottleneck?.avgResponseTime}ms</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Max Response Time</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{bottleneck?.maxResponseTime}ms</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Error Rate</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{bottleneck?.errorRate}%</div>
                </div>
              </div>

              {/* Issues */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Detected Issues:</h5>
                <div className="space-y-2">
                  {bottleneck?.issues?.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Icon name="AlertCircle" size={14} className="text-red-500" />
                      {issue}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <Icon name="Lightbulb" size={16} />
                  Optimization Recommendations
                </h5>
                <div className="space-y-2">
                  {bottleneck?.recommendations?.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">
                          {rec?.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rec?.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                          rec?.priority === 'high'? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        }`}>
                          {rec?.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{rec?.description}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        <Icon name="TrendingUp" size={12} className="inline mr-1" />
                        {rec?.estimatedImprovement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Machine Learning Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} />
          Machine Learning-Powered Analysis
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Pattern recognition across endpoints</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Anomaly detection with confidence scoring</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Automated root cause identification</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottleneckDetectionPanel;