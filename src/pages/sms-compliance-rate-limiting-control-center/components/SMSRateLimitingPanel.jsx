import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { smsRateLimitingService } from '../../../services/smsRateLimitingService';

const SMSRateLimitingPanel = () => {
  const [queueStats, setQueueStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const { data } = await smsRateLimitingService?.getRateLimitingStats();
      setQueueStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessQueue = async () => {
    try {
      setProcessing(true);
      await smsRateLimitingService?.processQueue(10);
      await loadStats();
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Queue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="List" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Queue</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {queueStats?.queue?.total || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {queueStats?.queue?.pending || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rate Limited</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {queueStats?.queue?.rateLimited || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">
                {queueStats?.queue?.sent || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Management */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Queue Management</h4>
            <p className="text-sm text-muted-foreground">Process pending messages with intelligent priority</p>
          </div>
          <Button
            onClick={handleProcessQueue}
            disabled={processing || queueStats?.queue?.pending === 0}
            iconName="Play"
          >
            {processing ? 'Processing...' : 'Process Queue'}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Priority Levels</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="w-full h-2 bg-red-500 rounded mb-1" />
                <span className="text-xs text-muted-foreground">Critical</span>
              </div>
              <div className="text-center">
                <div className="w-full h-2 bg-orange-500 rounded mb-1" />
                <span className="text-xs text-muted-foreground">High</span>
              </div>
              <div className="text-center">
                <div className="w-full h-2 bg-yellow-500 rounded mb-1" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="text-center">
                <div className="w-full h-2 bg-blue-500 rounded mb-1" />
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="card">
        <h4 className="font-semibold text-foreground mb-4">Provider Rate Limits</h4>
        <div className="space-y-3">
          {queueStats?.providerLimits?.map((limit) => (
            <div key={limit?.id} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground capitalize">{limit?.provider}</span>
                <span className="text-sm text-muted-foreground">
                  {limit?.currentCount || 0} / {limit?.maxPerWindow || 0} per {limit?.windowMinutes || 60}min
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(((limit?.currentCount || 0) / (limit?.maxPerWindow || 1)) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Rate Limits */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-foreground mb-1">User Rate Limits</h4>
            <p className="text-sm text-muted-foreground">
              {queueStats?.userLimits?.active || 0} active limits configured
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="Plus">
            Add Limit
          </Button>
        </div>
      </div>

      {/* Rate Limiting Info */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Intelligent Rate Limiting</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Per-user rate limits prevent individual SMS flooding</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Per-provider throttling prevents API quota exhaustion</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Priority queue ensures critical messages are sent first</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Automatic queue processing with configurable batch sizes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSRateLimitingPanel;
