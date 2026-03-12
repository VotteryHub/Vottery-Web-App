import React from 'react';
import Icon from '../../../components/AppIcon';

const CrossPlatformAnalysisPanel = ({ crossPlatformData, onRefresh }) => {
  if (!crossPlatformData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No cross-platform analysis data available</p>
      </div>
    );
  }

  const { platformBreakdown, sentimentCorrelation, influencerImpact, brandPerception, viralityFactors, audienceOverlap, confidenceScore, reasoning } = crossPlatformData;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Network" size={20} className="text-primary" />
          Platform Sentiment Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformBreakdown?.map((platform, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold text-foreground mb-3">{platform?.platform}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Positive</span>
                  <span className="font-medium">{platform?.sentiment?.positive}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-600">Neutral</span>
                  <span className="font-medium">{platform?.sentiment?.neutral}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Negative</span>
                  <span className="font-medium">{platform?.sentiment?.negative}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Link" size={20} className="text-primary" />
            Sentiment Correlation Patterns
          </h3>
          <div className="space-y-3">
            {sentimentCorrelation?.patterns?.map((pattern, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{pattern?.pattern}</p>
                  <span className="text-xs font-medium text-primary">{(pattern?.correlation * 100)?.toFixed(0)}% correlation</span>
                </div>
                <p className="text-sm text-muted-foreground">{pattern?.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Users" size={20} className="text-primary" />
            Influencer Impact Analysis
          </h3>
          <div className="space-y-3">
            {influencerImpact?.map((influencer, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{influencer?.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    influencer?.sentimentImpact === 'positive' ? 'bg-green-100 text-green-700' :
                    influencer?.sentimentImpact === 'negative'? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {influencer?.sentimentImpact}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Reach: {influencer?.reach}</span>
                  <span>Engagement: {influencer?.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Award" size={20} className="text-primary" />
          Brand Perception Across Platforms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold text-muted-foreground mb-2">Overall Brand Health</p>
            <p className="text-3xl font-bold text-foreground mb-2">{brandPerception?.overallHealth}/10</p>
            <p className="text-sm text-muted-foreground">{brandPerception?.healthDescription}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold text-muted-foreground mb-3">Key Perception Metrics</p>
            <div className="space-y-2">
              {brandPerception?.metrics?.map((metric, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{metric?.name}</span>
                  <span className="font-medium text-primary">{metric?.score}/10</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-primary" />
            Virality Factors
          </h3>
          <ul className="space-y-2">
            {viralityFactors?.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <Icon name="TrendingUp" size={16} className="text-primary mt-0.5" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Users" size={20} className="text-primary" />
            Audience Overlap Analysis
          </h3>
          <div className="space-y-3">
            {audienceOverlap?.map((overlap, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{overlap?.platforms}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${overlap?.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">{overlap?.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          Cross-Platform Correlation Analysis
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Icon name="CheckCircle" size={16} className="text-green-500" />
          <span className="text-sm text-muted-foreground">
            Analysis Confidence: <span className="font-semibold text-foreground">{(confidenceScore * 100)?.toFixed(1)}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CrossPlatformAnalysisPanel;