import React from 'react';
import Icon from '../../../components/AppIcon';

const UserRetentionFunnelPanel = ({ data, timeframe }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Icon name="Filter" size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">User Retention Funnel</h2>
          <p className="text-sm text-muted-foreground">
            Journey mapping with conversion bottlenecks • {timeframe}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {data?.stages?.map((stage, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  idx === 0 ? 'bg-green-100 dark:bg-green-900/20' :
                  stage?.dropoff > 20 ? 'bg-red-100 dark:bg-red-900/20': 'bg-blue-100 dark:bg-blue-900/20'
                }`}>
                  <span className="text-sm font-bold ${
                    idx === 0 ? 'text-green-600 dark:text-green-400' :
                    stage?.dropoff > 20 ? 'text-red-600 dark:text-red-400': 'text-blue-600 dark:text-blue-400'
                  }">{idx + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{stage?.stage}</p>
                  {stage?.dropoff > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      -{stage?.dropoff}% drop-off
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{stage?.users?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stage?.percentage}%</p>
              </div>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  idx === 0 ? 'bg-green-500' :
                  stage?.dropoff > 20 ? 'bg-red-500': 'bg-blue-500'
                }`}
                style={{ width: `${stage?.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-green-600 dark:text-green-400" />
            <p className="text-xs font-medium text-green-900 dark:text-green-100">Conversion Rate</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data?.conversionRate}%</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={18} className="text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">Avg. Time to Convert</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.averageTimeToConversion}</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="AlertTriangle" size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">Optimization Opportunity</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Largest drop-off at "{data?.stages?.reduce((max, stage) => stage?.dropoff > max?.dropoff ? stage : max, data?.stages?.[0])?.stage}" stage. Focus retention efforts here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRetentionFunnelPanel;