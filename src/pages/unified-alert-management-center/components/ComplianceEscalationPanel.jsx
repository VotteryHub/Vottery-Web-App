import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { enhancedAlertService } from '../../../services/enhancedAlertService';


const ComplianceEscalationPanel = ({ onRefresh }) => {
  const [workflows, setWorkflows] = useState([]);
  const [activeEscalations, setActiveEscalations] = useState([]);
  const [slaStatistics, setSlaStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  useEffect(() => {
    loadComplianceData();
    
    // Check SLA status every minute
    const interval = setInterval(() => {
      checkSLAStatus();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      const [workflowsResult, escalationsResult, slaResult] = await Promise.all([
        enhancedAlertService?.getComplianceEscalationWorkflows(),
        enhancedAlertService?.getActiveEscalations(),
        enhancedAlertService?.getSLAStatistics()
      ]);
      
      setWorkflows(workflowsResult?.data || []);
      setActiveEscalations(escalationsResult?.data || []);
      setSlaStatistics(slaResult?.data);
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSLAStatus = async () => {
    try {
      await enhancedAlertService?.checkSLAStatus();
      await loadComplianceData();
    } catch (error) {
      console.error('Failed to check SLA status:', error);
    }
  };

  const getSLAStatusColor = (status) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'at_risk': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'breached': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTriggerTypeIcon = (type) => {
    switch (type) {
      case 'financial_threshold': return 'DollarSign';
      case 'deadline_based': return 'Calendar';
      case 'event_based': return 'Zap';
      case 'periodic': return 'Clock';
      default: return 'AlertTriangle';
    }
  };

  const calculateTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Compliance Escalation Workflows
            </h3>
            <p className="text-sm text-muted-foreground">
              Automated stakeholder notifications with SLA tracking and enforcement
            </p>
          </div>
          <Button
            variant="outline"
            iconName="RefreshCw"
            onClick={loadComplianceData}
          >
            Refresh
          </Button>
        </div>

        {/* SLA Statistics */}
        {slaStatistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Target" size={18} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total SLAs</span>
              </div>
              <p className="text-2xl font-heading font-bold text-blue-600 font-data">
                {slaStatistics?.total || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle" size={18} className="text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">On Track</span>
              </div>
              <p className="text-2xl font-heading font-bold text-green-600 font-data">
                {slaStatistics?.onTrack || 0}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="AlertTriangle" size={18} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">At Risk</span>
              </div>
              <p className="text-2xl font-heading font-bold text-yellow-600 font-data">
                {slaStatistics?.atRisk || 0}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="XCircle" size={18} className="text-red-600" />
                <span className="text-sm font-medium text-red-900 dark:text-red-100">Breached</span>
              </div>
              <p className="text-2xl font-heading font-bold text-red-600 font-data">
                {slaStatistics?.breached || 0}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Clock" size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Avg Resolution</span>
              </div>
              <p className="text-2xl font-heading font-bold text-purple-600 font-data">
                {slaStatistics?.averageResolutionTime || 0}m
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Active Escalations */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Active Escalations ({activeEscalations?.length})
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading escalations...</p>
          </div>
        ) : activeEscalations?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">No active escalations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeEscalations?.map((escalation) => (
              <div key={escalation?.id} className="p-4 bg-muted/30 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">
                        {escalation?.workflow?.workflowName}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSLAStatusColor(escalation?.slaStatus)}`}>
                        {escalation?.slaStatus?.replace('_', ' ')?.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                        Level {escalation?.currentEscalationLevel}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground mb-3">
                      <div>
                        <Icon name="Clock" size={14} className="inline mr-1" />
                        <span className="font-medium">{calculateTimeRemaining(escalation?.slaDeadline)}</span> remaining
                      </div>
                      <div>
                        <Icon name="Users" size={14} className="inline mr-1" />
                        {escalation?.notificationHistory?.length || 0} notifications sent
                      </div>
                      <div>
                        <Icon name="Calendar" size={14} className="inline mr-1" />
                        {new Date(escalation?.createdAt)?.toLocaleDateString()}
                      </div>
                      <div>
                        <Icon name={getTriggerTypeIcon(escalation?.workflow?.triggerType)} size={14} className="inline mr-1" />
                        {escalation?.workflow?.triggerType?.replace('_', ' ')}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {escalation?.triggerReason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Escalation Workflows */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Configured Workflows ({workflows?.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows?.map((workflow) => (
            <div key={workflow?.id} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name={getTriggerTypeIcon(workflow?.triggerType)} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{workflow?.workflowName}</h4>
                  <p className="text-xs text-muted-foreground">
                    {workflow?.triggerType?.replace('_', ' ')}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  workflow?.isEnabled ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={14} />
                  <span>SLA: {workflow?.slaHours} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={14} />
                  <span>{workflow?.stakeholderGroups?.length || 0} stakeholder groups</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Send" size={14} />
                  <span>{workflow?.notificationChannels?.join(', ')}</span>
                </div>
                {workflow?.autoEscalate && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Icon name="TrendingUp" size={14} />
                    <span>Auto-escalation enabled</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceEscalationPanel;