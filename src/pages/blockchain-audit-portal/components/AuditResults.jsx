import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuditResults = ({ results, onDownloadReport, onExportData }) => {
  if (!results) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'text-success bg-success/10';
      case 'failed':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'Info';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              results?.overallStatus === 'passed' ? 'bg-success/10' : 'bg-error/10'
            }`}>
              <Icon 
                name={getStatusIcon(results?.overallStatus)} 
                size={24} 
                color={results?.overallStatus === 'passed' ? 'var(--color-success)' : 'var(--color-error)'} 
              />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-foreground">
                Audit Results
              </h3>
              <p className={`text-sm md:text-base font-medium ${
                results?.overallStatus === 'passed' ? 'text-success' : 'text-error'
              }`}>
                {results?.overallStatus === 'passed' ? 'All Checks Passed' : 'Issues Detected'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              iconName="Download" 
              iconPosition="left"
              onClick={onDownloadReport}
            >
              Download Report
            </Button>
            <Button 
              variant="secondary" 
              iconName="FileSpreadsheet" 
              iconPosition="left"
              onClick={onExportData}
            >
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Vote" size={16} className="text-muted-foreground" />
              <span className="text-xs md:text-sm text-muted-foreground">Total Votes</span>
            </div>
            <p className="text-xl md:text-2xl font-data font-bold text-foreground">
              {results?.totalVotes?.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-xs md:text-sm text-muted-foreground">Verified</span>
            </div>
            <p className="text-xl md:text-2xl font-data font-bold text-success">
              {results?.verifiedVotes?.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Link" size={16} className="text-muted-foreground" />
              <span className="text-xs md:text-sm text-muted-foreground">Hash Chain</span>
            </div>
            <p className={`text-xl md:text-2xl font-data font-bold ${
              results?.hashChainIntegrity ? 'text-success' : 'text-error'
            }`}>
              {results?.hashChainIntegrity ? 'Intact' : 'Broken'}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileCode" size={16} className="text-muted-foreground" />
              <span className="text-xs md:text-sm text-muted-foreground">Smart Contract</span>
            </div>
            <p className={`text-xl md:text-2xl font-data font-bold ${
              results?.smartContractValid ? 'text-success' : 'text-error'
            }`}>
              {results?.smartContractValid ? 'Valid' : 'Invalid'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
            Verification Checks
          </h4>
          {results?.checks?.map((check, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-all duration-250"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                getStatusColor(check?.status)
              }`}>
                <Icon name={getStatusIcon(check?.status)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                  <h5 className="text-sm md:text-base font-medium text-foreground">
                    {check?.name}
                  </h5>
                  <span className={`text-xs font-data font-medium ${
                    check?.status === 'passed' ? 'text-success' : 
                    check?.status === 'failed' ? 'text-error' : 'text-warning'
                  }`}>
                    {check?.status?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-2">
                  {check?.description}
                </p>
                {check?.details && (
                  <div className="p-2 bg-muted/50 rounded text-xs font-data text-muted-foreground">
                    {check?.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Blockchain Transaction Log
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              Recent verification transactions
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
          {results?.transactions?.map((tx, index) => (
            <div 
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-250"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon name="Box" size={16} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-data text-foreground truncate">
                    {tx?.hash}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Block {tx?.blockNumber?.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-data text-muted-foreground whitespace-nowrap">
                  {tx?.timestamp}
                </span>
                <Button variant="ghost" size="xs" iconName="ExternalLink">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditResults;