import React from 'react';
import Icon from '../../../components/AppIcon';


const ComplianceOverviewPanel = ({ statistics, onRefresh }) => {
  const overviewCards = [
    {
      label: 'Compliance Score',
      value: `${statistics?.complianceScore || 0}%`,
      icon: 'Shield',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: '+2.3%'
    },
    {
      label: 'Total Filings',
      value: statistics?.totalFilings || 0,
      icon: 'FileText',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      subtitle: `${statistics?.pendingFilings || 0} pending`
    },
    {
      label: 'Active Violations',
      value: statistics?.activeViolations || 0,
      icon: 'AlertTriangle',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      subtitle: `${statistics?.totalViolations || 0} total`
    },
    {
      label: 'Jurisdictions',
      value: statistics?.compliantJurisdictions || 0,
      icon: 'Globe',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      subtitle: `of ${statistics?.totalJurisdictions || 0} compliant`
    },
    {
      label: 'Audit Trail Entries',
      value: statistics?.auditTrailEntries || 0,
      icon: 'History',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      subtitle: 'Last 30 days'
    },
    {
      label: 'Approved Filings',
      value: statistics?.approvedFilings || 0,
      icon: 'CheckCircle',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      subtitle: `${statistics?.rejectedFilings || 0} rejected`
    }
  ];

  const complianceStatus = [
    {
      category: 'Regulatory Compliance',
      status: 'compliant',
      score: statistics?.complianceScore || 0,
      items: [
        { label: 'AML/KYC Verification', status: 'passed' },
        { label: 'Tax Reporting', status: 'passed' },
        { label: 'Data Protection', status: 'passed' },
        { label: 'Consumer Protection', status: 'warning' }
      ]
    },
    {
      category: 'Policy Enforcement',
      status: statistics?.activeViolations > 5 ? 'warning' : 'compliant',
      score: statistics?.activeViolations > 0 ? 85 : 100,
      items: [
        { label: 'Advertising Policy', status: 'passed' },
        { label: 'Payment Policy', status: 'passed' },
        { label: 'Content Moderation', status: statistics?.activeViolations > 5 ? 'warning' : 'passed' },
        { label: 'Fraud Prevention', status: 'passed' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': case'compliant':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewCards?.map((card, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{card?.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-foreground">{card?.value}</p>
                  {card?.trend && (
                    <span className="text-xs text-green-600 font-medium">{card?.trend}</span>
                  )}
                </div>
                {card?.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{card?.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {complianceStatus?.map((section, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                {section?.category}
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(section?.status)}`}>
                {section?.score}% Compliant
              </div>
            </div>
            <div className="space-y-3">
              {section?.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-foreground">{item?.label}</span>
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}>
                    <Icon name={item?.status === 'passed' ? 'CheckCircle' : item?.status === 'warning' ? 'AlertTriangle' : 'XCircle'} size={14} />
                    {item?.status === 'passed' ? 'Passed' : item?.status === 'warning' ? 'Warning' : 'Failed'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-lg border border-primary/20 p-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={24} className="text-primary mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground mb-2">Compliance Standards</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>AML/KYC Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>GDPR Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Tax Reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Data Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Consumer Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Payment Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Fraud Prevention</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span>Audit Trails</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverviewPanel;