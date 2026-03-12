import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedRetrainingPanel = ({ retrainingSchedule, onRefresh }) => {
  if (!retrainingSchedule) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Zap" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No automated retraining schedule configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Automated Retraining</h2>
            <p className="text-sm text-muted-foreground">Schedule and monitor automated model retraining</p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-medium text-sm ${
            retrainingSchedule?.enabled 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
          }`}>
            {retrainingSchedule?.enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Calendar" size={24} className="mx-auto text-primary mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 capitalize">
              {retrainingSchedule?.frequency}
            </div>
            <div className="text-xs text-muted-foreground">Frequency</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Clock" size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="text-sm font-medium text-foreground mb-1">
              {new Date(retrainingSchedule?.lastRun)?.toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">Last Run</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="CalendarCheck" size={24} className="mx-auto text-green-600 mb-2" />
            <div className="text-sm font-medium text-foreground mb-1">
              {new Date(retrainingSchedule?.nextRun)?.toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">Next Run</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="TrendingUp" size={24} className="mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {retrainingSchedule?.successRate * 100}%
            </div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Average Improvement: +{retrainingSchedule?.averageImprovement}%
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Automated retraining has consistently improved model accuracy by an average of {retrainingSchedule?.averageImprovement}% per cycle
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button iconName="Play">
            Run Manual Retraining
          </Button>
          <Button variant="outline" iconName="Settings">
            Configure Schedule
          </Button>
          <Button variant="outline" iconName={retrainingSchedule?.enabled ? 'Pause' : 'Play'}>
            {retrainingSchedule?.enabled ? 'Disable' : 'Enable'} Automation
          </Button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Retraining Triggers</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Automatic retraining is triggered when specific conditions are met
        </p>
        <div className="space-y-3">
          {[
            { name: 'Performance Degradation', threshold: '> 5% accuracy drop', enabled: true },
            { name: 'False Positive Spike', threshold: '> 10% increase', enabled: true },
            { name: 'New Data Availability', threshold: '> 10,000 new samples', enabled: true },
            { name: 'Scheduled Interval', threshold: 'Weekly on Sundays', enabled: true },
            { name: 'Manual Trigger', threshold: 'Admin initiated', enabled: true }
          ]?.map((trigger, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <input type="checkbox" checked={trigger?.enabled} readOnly className="w-4 h-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{trigger?.name}</h4>
                  <span className="text-xs text-muted-foreground">{trigger?.threshold}</span>
                </div>
              </div>
              <Icon name={trigger?.enabled ? 'CheckCircle' : 'Circle'} size={18} className={trigger?.enabled ? 'text-green-600' : 'text-muted-foreground'} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Model Versioning & Rollback</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage model versions and rollback capabilities for production deployments
        </p>
        <div className="space-y-3">
          {[
            { version: 'v2.3.1', status: 'production', accuracy: 0.923, deployedAt: new Date() },
            { version: 'v2.3.0', status: 'archived', accuracy: 0.918, deployedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { version: 'v2.2.9', status: 'archived', accuracy: 0.915, deployedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
          ]?.map((version, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{version?.version}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    version?.status === 'production' ?'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                  }`}>
                    {version?.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Accuracy: {(version?.accuracy * 100)?.toFixed(1)}%</span>
                  <span>Deployed: {version?.deployedAt?.toLocaleDateString()}</span>
                </div>
              </div>
              {version?.status !== 'production' && (
                <Button size="sm" variant="outline" iconName="RotateCcw">
                  Rollback
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Integration with External Threat Intelligence</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enhance model training with external threat intelligence feeds
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <Icon name="Shield" size={24} className="text-blue-600 mb-2" />
            <h4 className="text-sm font-semibold text-foreground mb-1">CISA Feeds</h4>
            <p className="text-xs text-muted-foreground mb-3">Cybersecurity threat intelligence</p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Icon name="CheckCircle" size={12} />
              Connected
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <Icon name="Globe" size={24} className="text-purple-600 mb-2" />
            <h4 className="text-sm font-semibold text-foreground mb-1">OWASP Data</h4>
            <p className="text-xs text-muted-foreground mb-3">Web application security patterns</p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Icon name="CheckCircle" size={12} />
              Connected
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <Icon name="Database" size={24} className="text-orange-600 mb-2" />
            <h4 className="text-sm font-semibold text-foreground mb-1">Security Research</h4>
            <p className="text-xs text-muted-foreground mb-3">Latest fraud detection research</p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <Icon name="CheckCircle" size={12} />
              Connected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedRetrainingPanel;