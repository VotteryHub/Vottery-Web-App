import React from 'react';
import Icon from '../../../components/AppIcon';

const JurisdictionManagementPanel = ({ jurisdictions, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)]?.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-5 bg-muted rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/10 text-green-500';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'non_compliant': case'critical':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jurisdictions?.map((jurisdiction) => (
          <div key={jurisdiction?.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Globe" className="text-primary" size={20} />
                  <h3 className="font-semibold text-foreground">{jurisdiction?.jurisdiction}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{jurisdiction?.region}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getComplianceColor(jurisdiction?.complianceStatus)}`}>
                {jurisdiction?.complianceStatus?.replace('_', ' ')?.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance Score</span>
                <span className="text-sm font-medium text-foreground">{jurisdiction?.complianceScore}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    jurisdiction?.complianceScore >= 95 ? 'bg-green-500' :
                    jurisdiction?.complianceScore >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${jurisdiction?.complianceScore}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Issues Identified</label>
                <p className="text-lg font-semibold text-foreground mt-1">{jurisdiction?.issuesIdentified}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Issues Resolved</label>
                <p className="text-lg font-semibold text-green-500 mt-1">{jurisdiction?.issuesResolved}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Audit</span>
                <span className="text-foreground">{jurisdiction?.lastAuditDate ? new Date(jurisdiction?.lastAuditDate)?.toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Next Audit</span>
                <span className="text-foreground">{jurisdiction?.nextAuditDate ? new Date(jurisdiction?.nextAuditDate)?.toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JurisdictionManagementPanel;