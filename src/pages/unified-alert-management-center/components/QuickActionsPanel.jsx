import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { enhancedAlertService } from '../../../services/enhancedAlertService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const QuickActionsPanel = ({ alerts, onRefresh }) => {
  const [actionTemplates, setActionTemplates] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    loadQuickActions();
  }, []);

  const loadQuickActions = async () => {
    try {
      setLoading(true);
      const [templatesResult, historyResult] = await Promise.all([
        enhancedAlertService?.getQuickActionTemplates(),
        enhancedAlertService?.getQuickActionHistory({ limit: 20 })
      ]);
      
      setActionTemplates(templatesResult?.data || []);
      setActionHistory(historyResult?.data || []);
    } catch (error) {
      console.error('Failed to load quick actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async () => {
    if (!selectedAction || !selectedAlert) return;
    
    if (selectedAction?.requiresReason && !actionReason) {
      alert('Please provide a reason for this action');
      return;
    }
    
    if (selectedAction?.requiresConfirmation) {
      const confirmed = window.confirm(`Are you sure you want to execute "${selectedAction?.actionName}"?`);
      if (!confirmed) return;
    }
    
    try {
      setExecuting(selectedAction?.id);
      const { error } = await enhancedAlertService?.executeQuickAction(
        selectedAction?.id,
        selectedAlert?.id,
        'alert',
        actionReason
      );
      
      if (error) throw error;
      
      analytics?.trackEvent('quick_action_executed', {
        action_name: selectedAction?.actionName,
        action_type: selectedAction?.actionType
      });
      
      setSelectedAlert(null);
      setSelectedAction(null);
      setActionReason('');
      await loadQuickActions();
      onRefresh?.();
    } catch (error) {
      console.error('Failed to execute action:', error);
      alert('Failed to execute action: ' + error?.message);
    } finally {
      setExecuting(null);
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'dispute_resolution': return 'Scale';
      case 'user_management': return 'UserX';
      case 'election_control': return 'Vote';
      case 'compliance_action': return 'FileCheck';
      default: return 'Zap';
    }
  };

  const getActionColor = (color) => {
    const colors = {
      red: 'bg-red-50 text-red-600 dark:bg-red-900/20',
      orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20',
      yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20',
      green: 'bg-green-50 text-green-600 dark:bg-green-900/20',
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
      purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
      indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              1-Click Quick Actions
            </h3>
            <p className="text-sm text-muted-foreground">
              Rapid response actions for dispute resolution and user management
            </p>
          </div>
        </div>

        {/* Action Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionTemplates?.map((template) => (
            <div
              key={template?.id}
              className={`p-4 rounded-lg cursor-pointer hover:shadow-lg transition-all ${
                selectedAction?.id === template?.id ? 'ring-2 ring-primary' : ''
              } ${getActionColor(template?.color)}`}
              onClick={() => setSelectedAction(template)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon name={template?.icon || getActionIcon(template?.actionType)} size={20} />
                <h4 className="font-semibold text-sm">{template?.actionName}</h4>
              </div>
              <p className="text-xs opacity-80 mb-2">{template?.actionType?.replace('_', ' ')}</p>
              <div className="flex flex-wrap gap-1">
                {template?.requiresConfirmation && (
                  <span className="px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded text-xs">
                    Confirm
                  </span>
                )}
                {template?.requiresReason && (
                  <span className="px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded text-xs">
                    Reason
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Selection */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Select Alert for Action
        </h3>
        
        {alerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No active alerts available</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {alerts?.slice(0, 10)?.map((alert) => (
              <div
                key={alert?.id}
                className={`p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedAlert?.id === alert?.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        alert?.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        alert?.severity === 'high'? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {alert?.severity}
                      </span>
                      <h4 className="font-semibold text-sm text-foreground">{alert?.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert?.description}</p>
                  </div>
                  {selectedAlert?.id === alert?.id && (
                    <Icon name="CheckCircle" size={20} className="text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Execution */}
      {selectedAction && selectedAlert && (
        <div className="card bg-primary/5 border-2 border-primary">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Execute Action
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Action:</p>
                <p className="text-sm text-muted-foreground">{selectedAction?.actionName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Target Alert:</p>
                <p className="text-sm text-muted-foreground">{selectedAlert?.title}</p>
              </div>
            </div>
            
            {selectedAction?.requiresReason && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason for Action *
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e?.target?.value)}
                  placeholder="Provide a reason for this action..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  rows={3}
                />
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="default"
                iconName={executing ? 'Loader2' : 'Zap'}
                onClick={executeAction}
                disabled={executing || (selectedAction?.requiresReason && !actionReason)}
              >
                {executing ? 'Executing...' : 'Execute Action'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAlert(null);
                  setSelectedAction(null);
                  setActionReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action History */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Recent Actions ({actionHistory?.length})
        </h3>
        
        {actionHistory?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No action history yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {actionHistory?.map((execution) => (
              <div key={execution?.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={execution?.actionTemplate?.icon || 'Zap'} size={16} />
                      <h4 className="font-semibold text-sm text-foreground">
                        {execution?.actionTemplate?.actionName}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        execution?.executionStatus === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        execution?.executionStatus === 'failed'? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {execution?.executionStatus}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {execution?.executionReason || 'No reason provided'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        <Icon name="User" size={12} className="inline mr-1" />
                        {execution?.executedByProfile?.name || 'Unknown'}
                      </span>
                      <span>
                        <Icon name="Clock" size={12} className="inline mr-1" />
                        {new Date(execution?.executedAt)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActionsPanel;