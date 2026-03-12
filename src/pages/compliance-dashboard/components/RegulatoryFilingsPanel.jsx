import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RegulatoryFilingsPanel = ({ filings, onRefresh }) => {
  const [filterJurisdiction, setFilterJurisdiction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'submitted':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'under_review':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getFilingTypeLabel = (type) => {
    const labels = {
      aml_report: 'AML Report',
      tax_withholding: 'Tax Withholding',
      transaction_report: 'Transaction Report',
      cross_border_payments: 'Cross-Border Payments',
      kyc_compliance: 'KYC Compliance',
      data_protection: 'Data Protection',
      consumer_protection: 'Consumer Protection'
    };
    return labels?.[type] || type;
  };

  const filteredFilings = filings?.filter(filing => {
    if (filterJurisdiction !== 'all' && filing?.jurisdiction !== filterJurisdiction) return false;
    if (filterStatus !== 'all' && filing?.status !== filterStatus) return false;
    if (filterType !== 'all' && filing?.filingType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Regulatory Filings
          </h2>
          <Button variant="default" size="sm" iconName="Plus">
            New Filing
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            value={filterJurisdiction}
            onChange={(e) => setFilterJurisdiction(e?.target?.value)}
          >
            <option value="all">All Jurisdictions</option>
            <option value="United States">United States</option>
            <option value="European Union">European Union</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </Select>

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="under_review">Under Review</option>
          </Select>

          <Select
            value={filterType}
            onChange={(e) => setFilterType(e?.target?.value)}
          >
            <option value="all">All Types</option>
            <option value="aml_report">AML Report</option>
            <option value="tax_withholding">Tax Withholding</option>
            <option value="transaction_report">Transaction Report</option>
            <option value="cross_border_payments">Cross-Border Payments</option>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredFilings?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No regulatory filings found</p>
            </div>
          ) : (
            filteredFilings?.map((filing) => (
              <div key={filing?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">
                        {getFilingTypeLabel(filing?.filingType)}
                      </p>
                      {filing?.filingReference && (
                        <span className="text-xs text-muted-foreground">({filing?.filingReference})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        {filing?.jurisdiction}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Building" size={12} />
                        {filing?.regulatoryAuthority}
                      </span>
                      {filing?.dueDate && (
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          Due: {new Date(filing?.dueDate)?.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(filing?.status)}`}>
                    {filing?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                  <Button variant="ghost" size="sm" iconName="Eye">
                    View
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

export default RegulatoryFilingsPanel;