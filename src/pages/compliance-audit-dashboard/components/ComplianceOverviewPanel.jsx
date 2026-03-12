import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceOverviewPanel = ({ statistics, onRefresh }) => {
  const stats = [
    {
      label: 'Total Filings',
      value: statistics?.totalFilings || 0,
      icon: 'FileText',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Pending Submissions',
      value: statistics?.pendingSubmissions || 0,
      icon: 'Clock',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Compliance Score',
      value: `${statistics?.complianceScore || 0}%`,
      icon: 'Shield',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Active Violations',
      value: statistics?.activeViolations || 0,
      icon: 'AlertTriangle',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{stat?.value}</p>
            <p className="text-sm text-muted-foreground">{stat?.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Jurisdictions Monitored</span>
            <span className="text-sm font-semibold text-foreground">{statistics?.jurisdictionsMonitored || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Automated Reports Generated</span>
            <span className="text-sm font-semibold text-foreground">{statistics?.automatedReports || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Audit Trail Entries</span>
            <span className="text-sm font-semibold text-foreground">{statistics?.auditTrailEntries || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverviewPanel;