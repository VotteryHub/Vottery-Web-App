import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditTrailPanel = ({ auditTrail, onRefresh }) => {
  const getActionIcon = (action) => {
    const icons = {
      'Budget Adjustment': 'DollarSign',
      'Targeting Update': 'Target',
      'Creative Upload': 'Image',
      'Campaign Launch': 'Play',
      'Campaign Pause': 'Pause',
      'Settings Change': 'Settings'
    };
    return icons?.[action] || 'FileText';
  };

  const getActionColor = (action) => {
    const colors = {
      'Budget Adjustment': 'text-green-600 bg-green-50 dark:bg-green-900/20',
      'Targeting Update': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      'Creative Upload': 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      'Campaign Launch': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
      'Campaign Pause': 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      'Settings Change': 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20'
    };
    return colors?.[action] || 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Audit Trail</h2>
            <p className="text-sm text-muted-foreground">Comprehensive log of all team actions and changes for accountability</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-muted/50 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
              <Icon name="Filter" size={16} className="inline mr-2" />
              Filter
            </button>
            <button className="px-3 py-2 bg-muted/50 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
              <Icon name="Download" size={16} className="inline mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="FileText" size={18} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Actions</span>
            </div>
            <div className="text-2xl font-heading font-bold text-foreground font-data">{auditTrail?.length || 0}</div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Users" size={18} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Team Members</span>
            </div>
            <div className="text-2xl font-heading font-bold text-foreground font-data">
              {new Set(auditTrail?.map(a => a?.performedBy))?.size || 0}
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={18} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Last 24 Hours</span>
            </div>
            <div className="text-2xl font-heading font-bold text-foreground font-data">
              {auditTrail?.filter(a => new Date(a?.timestamp) > new Date(Date.now() - 86400000))?.length || 0}
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={18} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Activity Rate</span>
            </div>
            <div className="text-2xl font-heading font-bold text-foreground font-data">High</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {auditTrail?.map((entry, index) => (
            <div key={entry?.id} className="relative">
              {index < auditTrail?.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-muted" />
              )}
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${getActionColor(entry?.action)}`}>
                  <Icon name={getActionIcon(entry?.action)} size={20} />
                </div>
                <div className="flex-1 pb-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground mb-1">{entry?.action}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{entry?.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="User" size={12} />
                            <span>{entry?.performedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            <span>{new Date(entry?.timestamp)?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {entry?.changes && (
                      <div className="mt-3 p-3 bg-background rounded border border-muted">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Changes:</div>
                        <div className="space-y-1 text-xs">
                          {entry?.changes?.before && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Before:</span>
                              <code className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded">
                                {JSON.stringify(entry?.changes?.before)}
                              </code>
                            </div>
                          )}
                          {entry?.changes?.after && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">After:</span>
                              <code className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                                {JSON.stringify(entry?.changes?.after)}
                              </code>
                            </div>
                          )}
                          {entry?.changes?.added && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Added:</span>
                              <code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                                {entry?.changes?.added}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Audit Trail Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Shield" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Accountability</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Track who made what changes and when for complete transparency
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="History" size={20} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">Change History</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Review historical changes to understand campaign evolution
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">Error Detection</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Quickly identify and rollback problematic changes
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="FileText" size={20} className="text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">Compliance</h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Meet regulatory requirements with comprehensive audit logs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrailPanel;