import React from 'react';
import Icon from '../../../components/AppIcon';

const BottleneckIdentification = ({ bottlenecks, endpoints }) => {
  if (!bottlenecks || bottlenecks?.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="CheckCircle" size={48} className="mx-auto mb-3 opacity-30 text-green-500" />
        <p>No bottlenecks detected</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Bottleneck Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">
              {bottlenecks?.filter(b => b?.severity === 'high' || b?.severity === 'critical')?.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Critical Bottlenecks</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={24} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {bottlenecks?.filter(b => b?.severity === 'medium')?.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Medium Priority</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-green-600 dark:text-green-400" />
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">87%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Optimization Score</h3>
        </div>
      </div>

      {/* Bottleneck Details */}
      <div className="space-y-4">
        {bottlenecks?.map((bottleneck, index) => (
          <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl p-6 border ${getSeverityColor(bottleneck?.severity)?.split(' ')?.[2]}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon name="AlertTriangle" size={20} className={getSeverityColor(bottleneck?.severity)?.split(' ')?.[1]} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{bottleneck?.endpoint}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{bottleneck?.issue}</p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${getSeverityColor(bottleneck?.severity)}`}>
                {bottleneck?.severity}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Impact Level</div>
                <div className={`text-xl font-bold capitalize ${getImpactColor(bottleneck?.impact)}`}>
                  {bottleneck?.impact}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Affected Endpoint</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {bottleneck?.endpoint}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
              <div className="flex items-start gap-3">
                <Icon name="Lightbulb" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Recommendation</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{bottleneck?.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Constraint Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Cpu" size={20} className="text-primary" />
          Resource Constraint Detection
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database Connection Pool</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">85% utilized</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div className="h-3 rounded-full bg-yellow-500" style={{ width: '85%' }} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Approaching capacity limit. Consider increasing pool size or optimizing query patterns.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">72% utilized</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div className="h-3 rounded-full bg-green-500" style={{ width: '72%' }} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Memory usage within acceptable range. No immediate action required.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Bandwidth</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">45% utilized</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div className="h-3 rounded-full bg-green-500" style={{ width: '45%' }} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Network bandwidth is optimal. Sufficient capacity for traffic growth.
            </p>
          </div>
        </div>
      </div>

      {/* Infrastructure Scaling Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          Infrastructure Scaling Recommendations
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Current Capacity Sufficient</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  System can handle current load with 6.8% utilization. No immediate scaling required.
                </p>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Estimated capacity for 5000 concurrent users before scaling needed
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
            <div className="flex items-start gap-3">
              <Icon name="Zap" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Proactive Scaling Suggestion</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Based on traffic growth patterns, consider scaling up by 2 instances in next 30 days
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Projected traffic increase: 40% over next quarter
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottleneckIdentification;