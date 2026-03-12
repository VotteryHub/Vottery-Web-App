import React from 'react';
import Icon from '../../../components/AppIcon';

const PolicyEnforcementPanel = ({ policies, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)]?.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-5 bg-muted rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500';
      case 'high':
        return 'bg-orange-500/10 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'block_content':
        return 'XCircle';
      case 'flag_for_review':
        return 'Flag';
      case 'auto_remove':
        return 'Trash2';
      default:
        return 'Shield';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Active Policy Rules
        </h3>
        <div className="space-y-4">
          {policies?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="FileText" size={48} className="mx-auto mb-4" />
              <p>No active policies found</p>
            </div>
          ) : (
            policies?.map((policy) => (
              <div key={policy?.id} className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{policy?.policyName}</h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getSeverityColor(policy?.severityLevel)}`}>
                        {policy?.severityLevel?.toUpperCase()}
                      </span>
                      {policy?.isActive && (
                        <span className="px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{policy?.policyCategory}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">ML Threshold</label>
                    <p className="text-sm font-medium text-foreground mt-1">{(policy?.mlThreshold * 100)?.toFixed(0)}%</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Automated Action</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon name={getActionIcon(policy?.automatedAction)} size={14} className="text-foreground" />
                      <p className="text-sm font-medium text-foreground">{policy?.automatedAction?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Escalation</label>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {policy?.escalationRequired ? 'Required' : 'Not Required'}
                    </p>
                  </div>
                </div>

                {policy?.detectionKeywords?.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Detection Keywords</label>
                    <div className="flex flex-wrap gap-2">
                      {policy?.detectionKeywords?.slice(0, 5)?.map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-muted text-foreground rounded">
                          {keyword}
                        </span>
                      ))}
                      {policy?.detectionKeywords?.length > 5 && (
                        <span className="px-2 py-1 text-xs text-muted-foreground">
                          +{policy?.detectionKeywords?.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Enforcement Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">23</div>
            <div className="text-sm text-muted-foreground">Auto-Blocked Today</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">156</div>
            <div className="text-sm text-muted-foreground">Flagged for Review</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">89</div>
            <div className="text-sm text-muted-foreground">Policy Violations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyEnforcementPanel;