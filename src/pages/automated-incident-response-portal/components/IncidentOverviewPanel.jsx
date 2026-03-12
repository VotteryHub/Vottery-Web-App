import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncidentOverviewPanel = ({ statistics, onRefresh }) => {
  const stats = [
    {
      label: 'Total Incidents',
      value: statistics?.totalIncidents || 0,
      icon: 'AlertTriangle',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Active Incidents',
      value: statistics?.activeIncidents || 0,
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      label: 'Resolved',
      value: statistics?.resolvedIncidents || 0,
      icon: 'CheckCircle2',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Critical',
      value: statistics?.criticalIncidents || 0,
      icon: 'AlertOctagon',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      label: 'Avg Response Time',
      value: `${statistics?.averageResponseTime || 0} min`,
      icon: 'Clock',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      label: 'Resolution Rate',
      value: `${statistics?.resolutionRate || 0}%`,
      icon: 'TrendingUp',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100 dark:bg-teal-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">Incidents by Type</h2>
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
          </Button>
        </div>
        <div className="space-y-3">
          {Object.entries(statistics?.incidentsByType || {})?.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-primary" />
                </div>
                <span className="font-medium text-foreground capitalize">{type?.replace(/_/g, ' ')}</span>
              </div>
              <span className="text-lg font-bold text-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentOverviewPanel;