import React from 'react';
import Icon from '../../../components/AppIcon';

const DeploymentHistoryPanel = ({ deployments }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="History" className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Deployment History</h2>
          <p className="text-sm text-muted-foreground">Container deployment pipelines and rollback capabilities</p>
        </div>
      </div>

      <div className="space-y-3">
        {deployments?.map((deployment) => (
          <div
            key={deployment?.id}
            className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  deployment?.status === 'success' ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  <Icon
                    name={deployment?.status === 'success' ? 'CheckCircle' : 'XCircle'}
                    className={`w-4 h-4 ${deployment?.status === 'success' ? 'text-success' : 'text-destructive'}`}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Version {deployment?.version}</h4>
                  <p className="text-sm text-muted-foreground">
                    {deployment?.timestamp?.toLocaleDateString()} at {deployment?.timestamp?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                deployment?.status === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                {deployment?.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground font-semibold ml-2">{deployment?.duration}s</span>
              </div>
              <div>
                <span className="text-muted-foreground">Triggered By:</span>
                <span className="text-foreground font-semibold ml-2 capitalize">{deployment?.triggeredBy}</span>
              </div>
              <div className="text-right">
                {deployment?.status === 'success' && deployment?.id === deployments?.[0]?.id && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    Current
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentHistoryPanel;