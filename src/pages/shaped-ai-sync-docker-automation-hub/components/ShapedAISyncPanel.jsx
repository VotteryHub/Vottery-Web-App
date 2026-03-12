import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShapedAISyncPanel = ({ shapedSync }) => {
  const nextSync = shapedSync?.nextSyncTime ? new Date(shapedSync.nextSyncTime) : new Date(Date.now() + 60000);
  const secondsUntilNextSync = Math.max(0, Math.floor((nextSync - new Date()) / 1000));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Zap" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Gemini Recommendation Integration</h2>
            <p className="text-sm text-muted-foreground">Recommendation sync and creator discovery (replaces Shaped AI)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${shapedSync?.apiStatus === 'healthy' ? 'bg-success' : 'bg-destructive'}`} />
          <span className="text-xs text-muted-foreground">{shapedSync?.apiStatus ?? 'gemini'}</span>
        </div>
      </div>

      {/* Sync Status */}
      <div className="bg-background border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Next Sync In</span>
          <span className="text-2xl font-bold text-primary">{secondsUntilNextSync}s</span>
        </div>
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all"
            style={{ width: `${((60 - secondsUntilNextSync) / 60) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Last sync: {shapedSync?.lastSyncTime?.toLocaleTimeString()}</span>
          <span>Interval: {shapedSync?.syncInterval}s</span>
        </div>
      </div>

      {/* Sync Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-background border border-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Database" className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Events Synced</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {shapedSync?.totalEventsSynced?.toLocaleString()}
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-success">
            {shapedSync?.successRate}%
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Model Performance</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Provider</span>
            <span className="text-sm font-mono text-foreground">{shapedSync?.modelVersion ?? 'Gemini Embedding + Pro'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Recommendation Accuracy</span>
            <span className="text-sm font-semibold text-primary">{shapedSync?.recommendationAccuracy}%</span>
          </div>
          <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all"
              style={{ width: `${shapedSync?.recommendationAccuracy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="outline" className="flex-1">
          <Icon name="Settings" className="w-3 h-3 mr-1" />
          Configure
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Icon name="BarChart" className="w-3 h-3 mr-1" />
          Analytics
        </Button>
      </div>
    </div>
  );
};

export default ShapedAISyncPanel;