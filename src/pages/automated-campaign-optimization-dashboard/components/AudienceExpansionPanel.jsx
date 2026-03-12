import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AudienceExpansionPanel = ({ data, onApply }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Audience Expansion
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-powered audience targeting recommendations
          </p>
        </div>
        <Icon name="Users" size={24} className="text-primary" />
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
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Projected Reach</p>
                    <p className="text-sm font-semibold text-foreground font-data">{rec?.projectedReach}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Additional Cost</p>
                    <p className="text-sm font-semibold text-foreground font-data">{rec?.projectedCost}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">ROI Impact</p>
                    <p className="text-sm font-semibold text-success font-data">{rec?.projectedRoi}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Target" size={16} className="text-primary" />
                    <span className="text-xs text-muted-foreground">Confidence: {rec?.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              iconName="UserPlus" 
              fullWidth
              onClick={() => onApply?.(rec?.id)}
            >
              Apply Expansion
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudienceExpansionPanel;