import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PolicyViolationsPanel = ({ violations, onRefresh }) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'under_review':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'open':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'escalated':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'dismissed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getViolationTypeLabel = (type) => {
    const labels = {
      advertising_policy: 'Advertising Policy',
      payment_policy: 'Payment Policy',
      data_privacy: 'Data Privacy',
      content_policy: 'Content Policy',
      fraud_attempt: 'Fraud Attempt',
      terms_violation: 'Terms Violation',
      regulatory_breach: 'Regulatory Breach'
    };
    return labels?.[type] || type;
  };

  const filteredViolations = violations?.filter(violation => {
    if (filterSeverity !== 'all' && violation?.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && violation?.status !== filterStatus) return false;
    if (filterType !== 'all' && violation?.violationType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Policy Violations
          </h2>
          <Button variant="outline" size="sm" iconName="Download">
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e?.target?.value)}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
            <option value="dismissed">Dismissed</option>
          </Select>

          <Select
            value={filterType}
            onChange={(e) => setFilterType(e?.target?.value)}
          >
            <option value="all">All Types</option>
            <option value="advertising_policy">Advertising Policy</option>
            <option value="payment_policy">Payment Policy</option>
            <option value="fraud_attempt">Fraud Attempt</option>
            <option value="data_privacy">Data Privacy</option>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredViolations?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No policy violations found</p>
            </div>
          ) : (
            filteredViolations?.map((violation) => (
              <div key={violation?.id} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSeverityColor(violation?.severity)}`}>
                    <Icon name="AlertTriangle" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-foreground">
                        {getViolationTypeLabel(violation?.violationType)}
                      </p>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(violation?.severity)}`}>
                        {violation?.severity?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {violation?.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="User" size={12} />
                        {violation?.violatorProfile?.name || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={12} />
                        {new Date(violation?.detectedAt)?.toLocaleDateString()}
                      </span>
                      {violation?.detectionMethod && (
                        <span className="flex items-center gap-1">
                          <Icon name="Zap" size={12} />
                          {violation?.detectionMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(violation?.status)}`}>
                    {violation?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                  <Button variant="ghost" size="sm" iconName="Eye">
                    Review
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyViolationsPanel;