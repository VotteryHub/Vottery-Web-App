import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityHealthMonitoringPanel = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Heart" size={24} className="text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          Community Health Monitoring
        </h2>
      </div>
      <div className="text-center py-12">
        <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Automated community health monitoring and engagement optimization coming soon</p>
      </div>
    </div>
  );
};

export default CommunityHealthMonitoringPanel;