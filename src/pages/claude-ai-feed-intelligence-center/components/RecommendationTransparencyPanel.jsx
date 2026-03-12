import React from 'react';
import Icon from '../../../components/AppIcon';

const RecommendationTransparencyPanel = () => {
  const transparencyData = {
    rankingFactors: [
      { factor: 'User Voting History', weight: 35, explanation: 'Your past voting patterns and preferences' },
      { factor: 'Contextual Relevance', weight: 30, explanation: 'How well content matches your interests' },
      { factor: 'Engagement Likelihood', weight: 20, explanation: 'Predicted probability of interaction' },
      { factor: 'Content Freshness', weight: 10, explanation: 'Recency of content publication' },
      { factor: 'Diversity Factor', weight: 5, explanation: 'Ensuring varied content exposure' }
    ],
    userControls: [
      { control: 'Topic Preferences', status: 'Active', impact: 'High' },
      { control: 'Content Type Mix', status: 'Active', impact: 'Medium' },
      { control: 'Sponsored Content', status: 'Limited', impact: 'Low' },
      { control: 'Recommendation Frequency', status: 'Active', impact: 'Medium' }
    ],
    dataUsage: {
      votingHistory: 'Used for preference learning',
      engagementMetrics: 'Used for relevance scoring',
      demographicData: 'Used for content matching',
      socialConnections: 'Not used in recommendations'
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Recommendation Transparency
        </h2>
        <p className="text-sm text-muted-foreground">
          Understand how Claude AI ranks and recommends content for you
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Scale" size={18} className="text-primary" />
          Ranking Factors & Weights
        </h3>
        <div className="space-y-4">
          {transparencyData?.rankingFactors?.map((item, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{item?.factor}</h4>
                <span className="text-lg font-bold text-primary">{item?.weight}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{item?.explanation}</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${item?.weight}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Settings" size={18} className="text-primary" />
          Your Control Settings
        </h3>
        <div className="space-y-3">
          {transparencyData?.userControls?.map((control, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{control?.control}</p>
                <p className="text-xs text-muted-foreground mt-1">Impact: {control?.impact}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-md ${
                control?.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                {control?.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Shield" size={18} className="text-primary" />
          Data Usage Transparency
        </h3>
        <div className="space-y-3">
          {Object.entries(transparencyData?.dataUsage)?.map(([key, value], index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground capitalize">{key?.replace(/([A-Z])/g, ' $1')?.trim()}</p>
                <p className="text-sm text-muted-foreground mt-1">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <div className="flex items-start gap-3">
          <Icon name="Eye" size={20} className="text-primary mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Why This Matters</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Claude AI uses advanced contextual reasoning to understand your preferences and provide personalized recommendations. 
              All ranking decisions are explainable, and you maintain control over your data and preferences. 
              We believe in transparent AI that empowers democratic engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationTransparencyPanel;