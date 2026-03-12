import React from 'react';
import Icon from '../../../components/AppIcon';

const ScenarioModelingPanel = ({ forecasts }) => {
  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-1">
          Scenario Modeling
        </h2>
        <p className="text-sm text-muted-foreground">
          Interactive scenario analysis with what-if modeling and sensitivity testing
        </p>
      </div>

      <div className="text-center py-12">
        <Icon name="GitBranch" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">Scenario Modeling Coming Soon</p>
        <p className="text-sm text-muted-foreground">
          Advanced scenario modeling with Claude AI reasoning
        </p>
      </div>
    </div>
  );
};

export default ScenarioModelingPanel;