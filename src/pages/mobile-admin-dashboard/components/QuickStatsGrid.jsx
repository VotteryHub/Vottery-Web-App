import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsGrid = ({ stats }) => {
  const statCards = [
    {
      label: 'Active Alerts',
      value: stats?.activeAlerts || 0,
      icon: 'Bell',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      label: 'Critical Issues',
      value: stats?.criticalIssues || 0,
      icon: 'AlertTriangle',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Active Campaigns',
      value: stats?.activeCampaigns || 0,
      icon: 'TrendingUp',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'System Health',
      value: stats?.systemHealth === 'healthy' ? '100%' : 
             stats?.systemHealth === 'warning' ? '75%' : '45%',
      icon: 'Activity',
      color: stats?.systemHealth === 'healthy' ? 'text-green-600' :
             stats?.systemHealth === 'warning' ? 'text-yellow-600' : 'text-red-600',
      bgColor: stats?.systemHealth === 'healthy' ? 'bg-green-50 dark:bg-green-900/20' :
               stats?.systemHealth === 'warning'? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statCards?.map((stat, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground mb-1">
            {stat?.value}
          </p>
          <p className="text-xs text-muted-foreground">{stat?.label}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsGrid;