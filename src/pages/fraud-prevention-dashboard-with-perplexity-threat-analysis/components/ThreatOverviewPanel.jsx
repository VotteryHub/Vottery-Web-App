import React from 'react';
import Icon from '../../../components/AppIcon';

const ThreatOverviewPanel = ({ overviewData, onRefresh }) => {
  const stats = [
    { label: 'Active Threats', value: overviewData?.suspiciousActivities || 12, icon: 'AlertTriangle', color: 'text-red-600' },
    { label: 'Processed Today', value: overviewData?.detectionStats?.processed || 15420, icon: 'Activity', color: 'text-blue-600' },
    { label: 'Flagged', value: overviewData?.detectionStats?.flagged || 156, icon: 'Flag', color: 'text-yellow-600' },
    { label: 'Confirmed Fraud', value: overviewData?.detectionStats?.confirmed || 23, icon: 'ShieldAlert', color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat?.label}</span>
              <Icon name={stat?.icon} size={18} className={stat?.color} />
            </div>
            <div className="text-3xl font-heading font-bold text-foreground font-data">
              {stat?.value?.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Threat Level Status</h3>
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-center">
          <Icon name="Shield" size={48} className="mx-auto text-yellow-600 mb-3" />
          <div className="text-2xl font-heading font-bold text-yellow-900 dark:text-yellow-100 mb-2">
            {overviewData?.activeThreatLevel?.toUpperCase() || 'MEDIUM'}
          </div>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            System monitoring active. Automated detection running.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreatOverviewPanel;