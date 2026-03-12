import React from 'react';
import Icon from '../../../components/AppIcon';

const ResolutionEffectivenessPanel = ({ incidents }) => {
  const resolvedIncidents = incidents?.filter(i => i?.status === 'resolved') || [];
  const totalIncidents = incidents?.length || 1;
  const resolutionRate = ((resolvedIncidents?.length / totalIncidents) * 100)?.toFixed(1);

  const avgResolutionTime = resolvedIncidents?.length > 0
    ? (resolvedIncidents?.reduce((sum, i) => {
        const detected = new Date(i?.detectedAt);
        const resolved = new Date(i?.resolvedAt);
        return sum + (resolved - detected);
      }, 0) / resolvedIncidents?.length / 60000)?.toFixed(0)
    : 0;

  const effectivenessMetrics = [
    { label: 'Auto-Resolution Success', value: '87%', trend: '+5%', icon: 'Zap', color: 'green' },
    { label: 'Manual Intervention Rate', value: '13%', trend: '-3%', icon: 'User', color: 'blue' },
    { label: 'False Positive Rate', value: '2.1%', trend: '-0.5%', icon: 'AlertCircle', color: 'yellow' },
    { label: 'Stakeholder Satisfaction', value: '94%', trend: '+2%', icon: 'ThumbsUp', color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle" size={24} className="text-green-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{resolutionRate}%</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={24} className="text-blue-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{avgResolutionTime}m</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution Time</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-purple-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{resolvedIncidents?.length}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Incidents</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Activity" size={24} className="text-orange-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalIncidents}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Incidents</p>
        </div>
      </div>

      {/* Effectiveness Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Resolution Effectiveness Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {effectivenessMetrics?.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name={metric?.icon} size={20} className={`text-${metric?.color}-500`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric?.label}</span>
                </div>
                <span className={`text-xs font-semibold ${
                  metric?.trend?.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric?.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric?.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="PieChart" size={20} />
          Resolution Method Breakdown
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Automated Resolution</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">87%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 rounded-full h-2" style={{ width: '87%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Manual Intervention</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">13%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 rounded-full h-2" style={{ width: '13%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Incident Lifecycle Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Comprehensive Incident Lifecycle Management
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Detection → Analysis → Resolution</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Automated evidence collection</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Post-incident review & learning</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionEffectivenessPanel;