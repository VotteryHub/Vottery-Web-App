import React from 'react';
import { TrendingUp, Activity, Clock, Zap } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const LogIngestionMetricsPanel = ({ statistics }) => {
  const metrics = [
    {
      label: 'Logs Ingested (24h)',
      value: statistics?.totalLogs?.toLocaleString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Processing Queue',
      value: '0',
      change: 'Real-time',
      trend: 'neutral',
      icon: Clock,
      color: 'green'
    },
    {
      label: 'Avg Processing Time',
      value: `${statistics?.avgDurationMs || 0}ms`,
      change: '-8.2%',
      trend: 'down',
      icon: Zap,
      color: 'purple'
    },
    {
      label: 'Throughput',
      value: '5.2K/min',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">Log Ingestion Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics?.map((metric, idx) => {
          const Icon = metric?.icon;
          return (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${getColorClasses(metric?.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${
                  metric?.trend === 'up' ? 'text-green-600' :
                  metric?.trend === 'down'? 'text-red-600' : 'text-slate-600'
                }`}>
                  {metric?.change}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">{metric?.label}</p>
              <p className="text-2xl font-bold text-slate-900">{metric?.value}</p>
            </div>
          );
        })}
      </div>

      {/* Real-time Processing Queue */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Real-time Processing Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Client Logs Queue</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }} />
              </div>
              <span className="text-sm font-medium text-slate-900">15%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Server Logs Queue</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '8%' }} />
              </div>
              <span className="text-sm font-medium text-slate-900">8%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">AI Service Logs Queue</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '22%' }} />
              </div>
              <span className="text-sm font-medium text-slate-900">22%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIngestionMetricsPanel;