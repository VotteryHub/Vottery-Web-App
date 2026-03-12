import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryOptimizationPanel = ({ analytics, userId }) => {
  const stats = [
    { label: 'Total Delivered', value: analytics?.total || 0, icon: 'Send', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Read', value: analytics?.read || 0, icon: 'CheckCheck', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Unread', value: analytics?.unread || 0, icon: 'Bell', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Engagement Rate', value: `${analytics?.engagementRate || 0}%`, icon: 'TrendingUp', color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const abTests = [
    { name: 'Morning vs Evening', variantA: 'Morning (9AM)', variantB: 'Evening (7PM)', winnerA: 62, winnerB: 38, status: 'Running' },
    { name: 'Immediate vs Scheduled', variantA: 'Immediate', variantB: 'Optimal Time', winnerA: 31, winnerB: 69, status: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Delivery Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats?.map((stat, i) => (
          <div key={i} className={`${stat?.bg} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
            <Icon name={stat?.icon} size={20} className={`${stat?.color} mb-2`} />
            <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat?.label}</p>
          </div>
        ))}
      </div>
      {/* Retry Mechanism */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="RefreshCw" size={20} className="text-blue-500" />
          Automatic Retry Mechanism
        </h3>
        <div className="space-y-3">
          {[
            { attempt: 'Initial Delivery', delay: 'Immediate', status: 'success', rate: '94%' },
            { attempt: 'Retry 1', delay: '5 seconds', status: 'success', rate: '4%' },
            { attempt: 'Retry 2', delay: '10 seconds', status: 'warning', rate: '1.5%' },
            { attempt: 'Retry 3 (Final)', delay: '20 seconds', status: 'error', rate: '0.5%' }
          ]?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                item?.status === 'success' ? 'bg-green-500' : item?.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item?.attempt}</p>
                <p className="text-xs text-muted-foreground">Delay: {item?.delay}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">{item?.rate}</span>
            </div>
          ))}
        </div>
      </div>
      {/* A/B Testing Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="FlaskConical" size={20} className="text-purple-500" />
          A/B Testing Results
        </h3>
        <div className="space-y-4">
          {abTests?.map((test, i) => (
            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-foreground">{test?.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  test?.status === 'Running' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>{test?.status}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-32">{test?.variantA}</span>
                  <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${test?.winnerA}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-10">{test?.winnerA}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-32">{test?.variantB}</span>
                  <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${test?.winnerB}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-10">{test?.winnerB}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptimizationPanel;
