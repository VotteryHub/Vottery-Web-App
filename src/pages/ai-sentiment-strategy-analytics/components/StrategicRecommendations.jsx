import React from 'react';
import Icon from '../../../components/AppIcon';

const StrategicRecommendations = ({ data }) => {
  const sections = [
    {
      title: 'Content Optimization',
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      items: data?.contentOptimization || []
    },
    {
      title: 'Targeting Strategy',
      icon: 'Target',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      items: data?.targetingStrategy || []
    },
    {
      title: 'Timing Recommendations',
      icon: 'Clock',
      color: 'text-success',
      bgColor: 'bg-success/10',
      items: data?.timingRecommendations || []
    },
    {
      title: 'Budget Allocation',
      icon: 'DollarSign',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      items: data?.budgetAllocation || []
    },
    {
      title: 'Risk Factors',
      icon: 'AlertTriangle',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      items: data?.riskFactors || []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Strategic Insights & Recommendations
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">AI-Generated</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Comprehensive strategic guidance powered by OpenAI GPT-5, analyzing voter sentiment, 
          campaign performance, and engagement predictions to optimize your advertising strategy.
        </p>
      </div>

      {/* Recommendation Sections */}
      {sections?.map((section, sectionIndex) => (
        <div key={sectionIndex} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${section?.bgColor} flex items-center justify-center`}>
              <Icon name={section?.icon} size={20} className={section?.color} />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              {section?.title}
            </h3>
          </div>

          <div className="space-y-3">
            {section?.items?.length > 0 ? (
              section?.items?.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full ${section?.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className={`text-xs font-bold ${section?.color}`}>
                      {itemIndex + 1}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{item}</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">No recommendations available</p>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Implementation Guide */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="CheckCircle" size={20} className="text-success" />
          Implementation Priority
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-success/5 rounded-lg border border-success/20">
            <Icon name="ArrowUp" size={18} className="text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">High Priority</p>
              <p className="text-sm text-muted-foreground">
                Focus on content optimization and targeting strategy first for immediate impact on engagement.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-warning/5 rounded-lg border border-warning/20">
            <Icon name="Minus" size={18} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Medium Priority</p>
              <p className="text-sm text-muted-foreground">
                Implement timing recommendations and budget adjustments over the next 2-4 weeks.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Icon name="Eye" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Ongoing Monitoring</p>
              <p className="text-sm text-muted-foreground">
                Continuously monitor risk factors and adjust strategy based on real-time sentiment changes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Methodology */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <Icon name="Info" size={20} className="text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            AI-Powered Strategic Analysis
          </p>
          <p className="text-sm text-muted-foreground">
            These recommendations are generated using OpenAI GPT-5 with high reasoning effort, 
            analyzing comprehensive data including voter sentiment, campaign reactions, engagement 
            predictions, and fraud detection patterns to provide actionable strategic guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategicRecommendations;