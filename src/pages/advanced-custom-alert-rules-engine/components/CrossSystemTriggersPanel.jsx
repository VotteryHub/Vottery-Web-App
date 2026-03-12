import React from 'react';
import Icon from '../../../components/AppIcon';

const CrossSystemTriggersPanel = ({ rules }) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-heading font-bold text-foreground mb-4">
        Cross-System Triggers
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Monitor triggers combining fraud detection, financial thresholds, and compliance indicators
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Shield" size={20} className="text-red-600" />
            <p className="text-sm font-medium text-foreground">Fraud Triggers</p>
          </div>
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground mt-1">Active fraud-based triggers</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="DollarSign" size={20} className="text-green-600" />
            <p className="text-sm font-medium text-foreground">Financial Triggers</p>
          </div>
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-xs text-muted-foreground mt-1">Active financial thresholds</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="FileText" size={20} className="text-blue-600" />
            <p className="text-sm font-medium text-foreground">Compliance Triggers</p>
          </div>
          <p className="text-2xl font-bold text-foreground">5</p>
          <p className="text-xs text-muted-foreground mt-1">Active compliance checks</p>
        </div>
      </div>

      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <Icon name="Share2" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">Cross-System Trigger Monitoring</p>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring of cross-system triggers and correlations
        </p>
      </div>
    </div>
  );
};

export default CrossSystemTriggersPanel;