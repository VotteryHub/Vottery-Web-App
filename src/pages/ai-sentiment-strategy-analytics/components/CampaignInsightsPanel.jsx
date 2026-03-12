import React from 'react';
import Icon from '../../../components/AppIcon';

const CampaignInsightsPanel = ({ data }) => {
  const getSentimentColor = (sentiment) => {
    if (sentiment === 'positive') return 'text-success';
    if (sentiment === 'negative') return 'text-destructive';
    return 'text-warning';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return 'TrendingUp';
    if (sentiment === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="space-y-6">
      {/* Engagement Quality Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Campaign Reaction Analysis
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">High Quality</span>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Target" size={24} className="text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Engagement Quality</p>
              <p className="text-lg font-semibold text-foreground">
                {data?.engagementQuality || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Elements */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Award" size={20} className="text-primary" />
          Top Performing Elements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data?.topPerformingElements?.map((element, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Icon name="Star" size={20} className="text-white" />
              </div>
              <span className="text-foreground font-medium">{element}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Segments */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" />
          Audience Segment Performance
        </h3>
        <div className="space-y-3">
          {data?.audienceSegments?.map((segment, index) => (
            <div
              key={index}
              className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Age Group: {segment?.segment}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon 
                        name={getSentimentIcon(segment?.sentiment)} 
                        size={14} 
                        className={getSentimentColor(segment?.sentiment)} 
                      />
                      <span className={`text-xs font-medium capitalize ${getSentimentColor(segment?.sentiment)}`}>
                        {segment?.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {segment?.responseRate?.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Response Rate</p>
                </div>
              </div>
              <div className="w-full bg-background rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${segment?.responseRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          AI Recommendations
        </h3>
        <div className="space-y-2">
          {data?.recommendations?.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10"
            >
              <Icon name="ArrowRight" size={18} className="text-primary mt-0.5" />
              <p className="text-sm text-foreground">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignInsightsPanel;