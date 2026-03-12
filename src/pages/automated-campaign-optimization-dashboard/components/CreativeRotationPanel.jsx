import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreativeRotationPanel = ({ data, onApply }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Creative Rotation
          </h2>
          <p className="text-sm text-muted-foreground">
            Performance-triggered creative optimization recommendations
          </p>
        </div>
        <Icon name="Image" size={24} className="text-primary" />
      </div>

      <div className="space-y-4">
        {data?.map((rec) => (
          <div key={rec?.id} className="p-5 rounded-lg border border-border hover:border-primary transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="Image" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-heading font-semibold text-foreground">{rec?.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      rec?.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec?.priority}
                    </span>
                    {rec?.urgency === 'immediate' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={16} className="text-success" />
                    <span className="text-sm font-semibold text-success">{rec?.projectedImpact}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{rec?.description}</p>
                
                {rec?.currentMix && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Current Mix</span>
                      <span className="text-xs text-muted-foreground">Recommended Mix</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded bg-muted/50">
                        <div className="flex items-center justify-between text-xs">
                          <span>Video: {rec?.currentMix?.video}%</span>
                          <span>Image: {rec?.currentMix?.image}%</span>
                          <span>Text: {rec?.currentMix?.text}%</span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-primary/10">
                        <div className="flex items-center justify-between text-xs font-semibold text-primary">
                          <span>Video: {rec?.recommendedMix?.video}%</span>
                          <span>Image: {rec?.recommendedMix?.image}%</span>
                          <span>Text: {rec?.recommendedMix?.text}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {rec?.recommendedHeadlines && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">Recommended Headlines:</p>
                    <div className="space-y-1">
                      {rec?.recommendedHeadlines?.map((headline, idx) => (
                        <div key={idx} className="p-2 rounded bg-muted/50 text-xs text-foreground">
                          {headline}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-24 bg-border rounded-full h-2">
                        <div
                          className="bg-success h-2 rounded-full"
                          style={{ width: `${rec?.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground font-data">{rec?.confidence}%</span>
                    </div>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    iconName="RefreshCw"
                    onClick={() => onApply?.(rec?.id)}
                  >
                    Apply Rotation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreativeRotationPanel;