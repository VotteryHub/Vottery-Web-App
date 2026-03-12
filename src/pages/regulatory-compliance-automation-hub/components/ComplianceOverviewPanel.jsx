import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceOverviewPanel = ({ statistics, submissionStats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)]?.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Filings',
      value: statistics?.totalFilings?.toLocaleString() || '0',
      icon: 'FileText',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Submitted',
      value: statistics?.submittedFilings?.toLocaleString() || '0',
      icon: 'Send',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Pending',
      value: statistics?.pendingFilings?.toLocaleString() || '0',
      icon: 'Clock',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Approved',
      value: statistics?.approvedFilings?.toLocaleString() || '0',
      icon: 'CheckCircle',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: 'Jurisdictions',
      value: '5',
      icon: 'Globe',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Delivery Rate',
      value: `${submissionStats?.deliveryRate || '0'}%`,
      icon: 'TrendingUp',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Automated Submissions',
      value: submissionStats?.totalSubmissions?.toLocaleString() || '0',
      icon: 'Zap',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Compliance Score',
      value: '96.2%',
      icon: 'Award',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
                <Icon name={metric?.icon} className={metric?.color} size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
            <div className="text-sm text-muted-foreground">{metric?.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Mail" size={20} />
            Resend Email Delivery
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Successful Deliveries</span>
              <span className="text-sm font-medium text-green-500">{submissionStats?.successfulDeliveries || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Submissions</span>
              <span className="text-sm font-medium text-yellow-500">{submissionStats?.pendingSubmissions || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Failed Submissions</span>
              <span className="text-sm font-medium text-red-500">{submissionStats?.failedSubmissions || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Calendar" size={20} />
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <Icon name="AlertCircle" className="text-red-500 mt-1" size={16} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">AML Report - United States</p>
                <p className="text-xs text-muted-foreground">Due in 7 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <Icon name="Clock" className="text-yellow-500 mt-1" size={16} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Transaction Report - EU</p>
                <p className="text-xs text-muted-foreground">Due in 14 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverviewPanel;