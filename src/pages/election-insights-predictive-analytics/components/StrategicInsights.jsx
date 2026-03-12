import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StrategicInsights = ({ recommendations }) => {
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Timing Optimization':
        return 'Clock';
      case 'Audience Targeting':
        return 'Target';
      case 'Content Strategy':
        return 'FileText';
      case 'Geographic Expansion':
        return 'MapPin';
      default:
        return 'Lightbulb';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Strategic Planning Insights</h3>
          <p className="text-sm text-muted-foreground mt-1">AI-powered recommendations for campaign optimization</p>
        </div>
        <Button variant="outline" size="sm" iconName="Download">
          Export Strategy
        </Button>
      </div>

      <div className="space-y-4">
        {recommendations?.map((rec) => (
          <div key={rec?.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  rec?.impact === 'high' ? 'bg-success/10' :
                  rec?.impact === 'medium' ? 'bg-warning/10' : 'bg-muted'
                }`}>
                  <Icon
                    name={getCategoryIcon(rec?.category)}
                    size={24}
                    className={rec?.impact === 'high' ? 'text-success' :
                              rec?.impact === 'medium' ? 'text-warning' : 'text-muted-foreground'}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">{rec?.category}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getImpactColor(rec?.impact)}`}>
                        {rec?.impact?.toUpperCase()} IMPACT
                      </span>
                      <div className="flex items-center gap-1">
                        <Icon name="Target" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {(rec?.confidence * 100)?.toFixed(0)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground mt-3">{rec?.recommendation}</p>

                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="xs" iconName="ExternalLink">
                    View Details
                  </Button>
                  <Button variant="ghost" size="xs" iconName="Bookmark">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" size={24} className="text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-2">Predictive Insights Summary</p>
            <p className="text-xs text-muted-foreground mb-3">
              Based on analysis of 1,247 elections, our ML models identify key optimization opportunities.
              Implementing high-impact recommendations can increase voter participation by up to 23.5%.
            </p>
            <Button variant="default" size="sm" iconName="ArrowRight">
              Generate Full Strategy Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicInsights;