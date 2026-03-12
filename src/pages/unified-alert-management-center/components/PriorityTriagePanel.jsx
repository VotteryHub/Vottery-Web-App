import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { enhancedAlertService } from '../../../services/enhancedAlertService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const PriorityTriagePanel = ({ onRefresh }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadPrioritizedAlerts();
  }, [priorityFilter]);

  const loadPrioritizedAlerts = async () => {
    try {
      setLoading(true);
      const filters = {
        status: 'active',
        minPriority: priorityFilter === 'high' ? 70 : priorityFilter === 'medium' ? 40 : 0,
        limit: 50
      };
      
      const { data, error } = await enhancedAlertService?.getAlertsByPriority(filters);
      if (error) throw error;
      
      setAlerts(data || []);
    } catch (error) {
      console.error('Failed to load prioritized alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const recalculatePriority = async (alert) => {
    try {
      setProcessing(alert?.id);
      const newScore = enhancedAlertService?.calculatePriorityScore(alert);
      await enhancedAlertService?.updateAlertPriority(alert?.id, newScore);
      
      analytics?.trackEvent('alert_priority_recalculated', {
        alert_id: alert?.id,
        old_score: alert?.priorityScore,
        new_score: newScore
      });
      
      await loadPrioritizedAlerts();
      onRefresh?.();
    } catch (error) {
      console.error('Failed to recalculate priority:', error);
    } finally {
      setProcessing(null);
    }
  };

  const getPriorityColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    if (score >= 60) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
  };

  const getPriorityLabel = (score) => {
    if (score >= 80) return 'Critical Priority';
    if (score >= 60) return 'High Priority';
    if (score >= 40) return 'Medium Priority';
    return 'Low Priority';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Intelligent Priority Triage
            </h3>
            <p className="text-sm text-muted-foreground">
              AI-powered severity scoring with auto-prioritization
            </p>
          </div>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e?.target?.value)}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'high', label: 'High Priority (70+)' },
              { value: 'medium', label: 'Medium Priority (40+)' }
            ]}
          />
        </div>

        {/* Priority Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertTriangle" size={18} className="text-red-600" />
              <span className="text-sm font-medium text-red-900 dark:text-red-100">Critical (80+)</span>
            </div>
            <p className="text-2xl font-heading font-bold text-red-600 font-data">
              {alerts?.filter(a => a?.priorityScore >= 80)?.length || 0}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertCircle" size={18} className="text-orange-600" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">High (60-79)</span>
            </div>
            <p className="text-2xl font-heading font-bold text-orange-600 font-data">
              {alerts?.filter(a => a?.priorityScore >= 60 && a?.priorityScore < 80)?.length || 0}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={18} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Medium (40-59)</span>
            </div>
            <p className="text-2xl font-heading font-bold text-yellow-600 font-data">
              {alerts?.filter(a => a?.priorityScore >= 40 && a?.priorityScore < 60)?.length || 0}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Low (&lt;40)</span>
            </div>
            <p className="text-2xl font-heading font-bold text-blue-600 font-data">
              {alerts?.filter(a => a?.priorityScore < 40)?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Prioritized Alert Queue */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Priority Queue ({alerts?.length} alerts)
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading prioritized alerts...</p>
          </div>
        ) : alerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">No active alerts in queue</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {alerts?.map((alert) => (
              <div key={alert?.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(alert?.priorityScore || 0)}`}>
                        <Icon name="Target" size={12} className="inline mr-1" />
                        Score: {alert?.priorityScore || 0}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        alert?.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        alert?.severity === 'high'? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {alert?.severity?.toUpperCase()}
                      </span>
                      {alert?.correlationGroup && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-medium">
                          <Icon name="Link" size={12} className="inline mr-1" />
                          Grouped
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{alert?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{alert?.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>
                        <Icon name="Clock" size={12} className="inline mr-1" />
                        {new Date(alert?.createdAt)?.toLocaleString()}
                      </span>
                      {alert?.confidenceScore && (
                        <span>
                          <Icon name="TrendingUp" size={12} className="inline mr-1" />
                          Confidence: {alert?.confidenceScore}%
                        </span>
                      )}
                      {alert?.alertRule?.category && (
                        <span>
                          <Icon name="Tag" size={12} className="inline mr-1" />
                          {alert?.alertRule?.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName={processing === alert?.id ? 'Loader2' : 'RefreshCw'}
                      onClick={() => recalculatePriority(alert)}
                      disabled={processing === alert?.id}
                    >
                      Recalculate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Priority Scoring Factors */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Priority Scoring Factors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Severity Weight (0-40 points)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Critical: 40 points</li>
              <li>• High: 30 points</li>
              <li>• Medium: 20 points</li>
              <li>• Low: 10 points</li>
            </ul>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Confidence Score (0-30 points)</h4>
            <p className="text-sm text-muted-foreground">
              ML model confidence percentage scaled to 30 points
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Category Priority (0-20 points)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Fraud Detection: 20 points</li>
              <li>• Security Event: 18 points</li>
              <li>• Policy Violation: 15 points</li>
            </ul>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Time Sensitivity (0-10 points)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• &lt;5 minutes: 10 points</li>
              <li>• &lt;15 minutes: 7 points</li>
              <li>• &lt;60 minutes: 4 points</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityTriagePanel;