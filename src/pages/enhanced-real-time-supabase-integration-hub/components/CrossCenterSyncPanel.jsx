import React from 'react';
import Icon from '../../../components/AppIcon';

const CrossCenterSyncPanel = ({ subscriptions, healthStatus }) => {
  const centers = [
    {
      id: 'team_collaboration',
      name: 'Team Collaboration Center',
      icon: 'Users',
      color: 'blue',
      subscriptions: subscriptions?.filter(s => s?.targetChannels?.includes('team_collaboration_center')),
      metrics: { syncRate: 99.8, latency: 145, updates: 1247 }
    },
    {
      id: 'financial_tracking',
      name: 'Financial Tracking Center',
      icon: 'DollarSign',
      color: 'green',
      subscriptions: subscriptions?.filter(s => s?.targetChannels?.includes('financial_tracking_center')),
      metrics: { syncRate: 99.5, latency: 180, updates: 892 }
    },
    {
      id: 'fraud_detection',
      name: 'Fraud Detection Center',
      icon: 'Shield',
      color: 'red',
      subscriptions: subscriptions?.filter(s => s?.targetChannels?.includes('fraud_detection_center')),
      metrics: { syncRate: 99.9, latency: 120, updates: 456 }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon name="RefreshCw" className="w-6 h-6 text-blue-500" />
          Cross-Center Data Synchronization
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {centers?.map((center) => (
            <div key={center?.id} className={`p-6 rounded-lg border-2 ${getColorClasses(center?.color)}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  center?.color === 'blue' ? 'bg-blue-500' :
                  center?.color === 'green'? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                  <Icon name={center?.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {center?.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {center?.subscriptions?.length || 0} active subscriptions
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Sync Rate</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {center?.metrics?.syncRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      center?.color === 'blue' ? 'bg-blue-500' :
                      center?.color === 'green'? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${center?.metrics?.syncRate}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Avg Latency</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {center?.metrics?.latency}ms
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Updates (24h)</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {center?.metrics?.updates?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Live sync active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="GitBranch" className="w-5 h-5 text-purple-500" />
          Data Flow Visualization
        </h3>

        <div className="relative">
          <div className="flex items-center justify-between">
            {centers?.map((center, index) => (
              <React.Fragment key={center?.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    center?.color === 'blue' ? 'bg-blue-500' :
                    center?.color === 'green'? 'bg-green-500' : 'bg-red-500'
                  } text-white shadow-lg`}>
                    <Icon name={center?.icon} className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center max-w-[100px]">
                    {center?.name}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {center?.metrics?.syncRate}%
                    </span>
                  </div>
                </div>
                {index < centers?.length - 1 && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-green-500 animate-pulse"></div>
                      <Icon name="ArrowRight" className="w-4 h-4 text-gray-400" />
                      <div className="h-0.5 w-20 bg-gradient-to-r from-green-500 to-red-500 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle2" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Conflict Resolution</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Automatic conflict detection and resolution with last-write-wins strategy
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Database" className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Data Consistency</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Real-time validation and consistency checks across all centers
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Performance Optimization</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Intelligent batching and caching for optimal sync performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossCenterSyncPanel;
