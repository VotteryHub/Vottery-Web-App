import React from 'react';
import Icon from '../../../components/AppIcon';

const ConfidenceConfigurationPanel = () => {
  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-1">
          Confidence Configuration
        </h2>
        <p className="text-sm text-muted-foreground">
          Adjust confidence thresholds and scoring parameters for forecasting models
        </p>
      </div>

      <div className="text-center py-12">
        <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">Confidence Configuration Coming Soon</p>
        <p className="text-sm text-muted-foreground">
          Configure confidence scoring and threshold parameters
        </p>
      </div>
    </div>
  );
};

export default ConfidenceConfigurationPanel;