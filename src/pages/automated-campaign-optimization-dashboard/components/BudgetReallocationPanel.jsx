import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetReallocationPanel = ({ data, onApply }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Budget Reallocation
          </h2>
          <p className="text-sm text-muted-foreground">
            ML-powered budget optimization recommendations
          </p>
        </div>
        <Icon name="DollarSign" size={24} className="text-primary" />
      </div>

      <div className="space-y-4">
        {data?.map((rec) => (
          <div key={rec?.id} className="p-4 rounded-lg border border-border hover:border-primary transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-heading font-semibold text-foreground">{rec?.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    rec?.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {rec?.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{rec?.description}</p>
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Allocation</p>
                    <p className="text-sm font-semibold text-foreground font-data">
                      ${Object.values(rec?.currentAllocation || {})?.reduce((a, b) => a + b, 0)?.toLocaleString()}
                    </p>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Recommended</p>
                    <p className="text-sm font-semibold text-primary font-data">
                      ${Object.values(rec?.recommendedAllocation || {})?.reduce((a, b) => a + b, 0)?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={16} className="text-success" />
                    <span className="text-sm font-semibold text-success">{rec?.projectedImpact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <span className="text-xs font-semibold text-foreground font-data">{rec?.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              iconName="CheckCircle" 
              fullWidth
              onClick={() => onApply?.(rec?.id)}
            >
              Apply Reallocation
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetReallocationPanel;