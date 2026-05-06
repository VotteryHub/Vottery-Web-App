import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { enhancedAlertService } from '../../../services/enhancedAlertService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const IncidentCorrelationPanel = ({ onRefresh }) => {
  const [correlationGroups, setCorrelationGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [correlating, setCorrelating] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    loadCorrelationGroups();
  }, []);

  const loadCorrelationGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await enhancedAlertService?.getCorrelationGroups({ status: 'all' });
      if (error) throw error;
      setCorrelationGroups(data || []);
    } catch (error) {
      console.error('Failed to load correlation groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const runCorrelation = async () => {
    try {
      setCorrelating(true);
      const { data, error } = await enhancedAlertService?.correlateAlerts(15);
      if (error) throw error;
      
      analytics?.trackEvent('alert_correlation_executed', {
        hubs_created: data?.length || 0
      });
      
      await loadCorrelationGroups();
      onRefresh?.();
    } catch (error) {
      console.error('Failed to run correlation:', error);
    } finally {
      setCorrelating(false);
    }
  };

  const resolveGroup = async (groupId) => {
    try {
      if (!resolutionNotes) {
        alert('Please provide resolution notes');
        return;
      }
      
      const { error } = await enhancedAlertService?.resolveCorrelationGroup(groupId, resolutionNotes);
      if (error) throw error;
      
      analytics?.trackEvent('correlation_group_resolved', {
        group_id: groupId
      });
      
      setSelectedGroup(null);
      setResolutionNotes('');
      await loadCorrelationGroups();
      onRefresh?.();
    } catch (error) {
      console.error('Failed to resolve group:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Incident Correlation Engine
            </h3>
            <p className="text-sm text-muted-foreground">
              Auto-grouping of related alerts with pattern matching (15-minute time window)
            </p>
          </div>
          <Button
            variant="default"
            iconName={correlating ? 'Loader2' : 'GitBranch'}
            onClick={runCorrelation}
            disabled={correlating}
          >
            {correlating ? 'Correlating...' : 'Run Correlation'}
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="GitBranch" size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Groups</span>
            </div>
            <p className="text-2xl font-heading font-bold text-blue-600 font-data">
              {correlationGroups?.length || 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" size={18} className="text-green-600" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">Active Groups</span>
            </div>
            <p className="text-2xl font-heading font-bold text-green-600 font-data">
              {correlationGroups?.filter(g => g?.status === 'active')?.length || 0}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Link" size={18} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Correlated Alerts</span>
            </div>
            <p className="text-2xl font-heading font-bold text-purple-600 font-data">
              {correlationGroups?.reduce((sum, g) => sum + (g?.alertCount || 0), 0)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-orange-600" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">Resolved Groups</span>
            </div>
            <p className="text-2xl font-heading font-bold text-orange-600 font-data">
              {correlationGroups?.filter(g => g?.status === 'resolved')?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Correlation Groups */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Correlation Groups ({correlationGroups?.filter(g => g?.status === 'active')?.length} active)
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading correlation groups...</p>
          </div>
        ) : correlationGroups?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="GitBranch" size={48} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No correlation groups found</p>
            <p className="text-sm text-muted-foreground mt-1">Run correlation to group related alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {correlationGroups?.map((group) => (
              <div key={group?.id} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{group?.groupName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(group?.severity)}`}>
                        {group?.severity?.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        group?.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        group?.status === 'resolved'? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {group?.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                      <div>
                        <Icon name="Bell" size={14} className="inline mr-1" />
                        <span className="font-medium">{group?.alertCount}</span> alerts
                      </div>
                      <div>
                        <Icon name="Target" size={14} className="inline mr-1" />
                        {group?.affectedEntityType || 'Unknown'}
                      </div>
                      <div>
                        <Icon name="Clock" size={14} className="inline mr-1" />
                        {group?.timeWindowMinutes}min window
                      </div>
                      <div>
                        <Icon name="Calendar" size={14} className="inline mr-1" />
                        {new Date(group?.firstAlertAt)?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {group?.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => setSelectedGroup(group)}
                    >
                      Review
                    </Button>
                  )}
                </div>
                
                {/* Alert List */}
                {group?.alerts && group?.alerts?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Grouped Alerts:</p>
                    <div className="space-y-1">
                      {group?.alerts?.slice(0, 3)?.map((alert) => (
                        <div key={alert?.id} className="text-xs text-muted-foreground flex items-center gap-2">
                          <Icon name="AlertCircle" size={12} />
                          <span>{alert?.title}</span>
                          <span className="text-xs opacity-60">
                            {new Date(alert?.createdAt)?.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                      {group?.alerts?.length > 3 && (
                        <p className="text-xs text-muted-foreground italic">
                          +{group?.alerts?.length - 3} more alerts
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Resolve Correlation Group
              </h3>
              <button
                onClick={() => {
                  setSelectedGroup(null);
                  setResolutionNotes('');
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Group:</strong> {selectedGroup?.groupName}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Alerts:</strong> {selectedGroup?.alertCount}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Pattern:</strong> {selectedGroup?.correlationPattern}
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Resolution Notes
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e?.target?.value)}
                placeholder="Describe how this incident was resolved..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                rows={4}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="default"
                iconName="CheckCircle"
                onClick={() => resolveGroup(selectedGroup?.id)}
                disabled={!resolutionNotes}
              >
                Resolve Group
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGroup(null);
                  setResolutionNotes('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentCorrelationPanel;