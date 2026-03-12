import React from 'react';
import Icon from '../../../components/AppIcon';

const VotingSentimentPanel = ({ sentimentData, timeRange, onRefresh }) => {
  if (!sentimentData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No sentiment data available</p>
      </div>
    );
  }

  const { sentimentBreakdown, brandMentions, demographicSegmentation, emotionalResponses, perceptionShifts, geographicCorrelation, confidenceScore, reasoning } = sentimentData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Positive Sentiment</h3>
            <Icon name="TrendingUp" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {sentimentBreakdown?.positive || 0}%
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Neutral Sentiment</h3>
            <Icon name="Minus" size={20} className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {sentimentBreakdown?.neutral || 0}%
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Negative Sentiment</h3>
            <Icon name="TrendingDown" size={20} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500">
            {sentimentBreakdown?.negative || 0}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Tag" size={20} className="text-primary" />
            Brand Mentions
          </h3>
          <div className="space-y-3">
            {brandMentions?.map((brand, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{brand?.brand}</p>
                  <p className="text-sm text-muted-foreground">{brand?.mentions} mentions</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  brand?.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                  brand?.sentiment === 'negative'? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {brand?.sentiment}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Users" size={20} className="text-primary" />
            Demographic Segmentation
          </h3>
          <div className="space-y-4">
            {demographicSegmentation?.age && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Age Groups</p>
                <div className="space-y-2">
                  {Object.entries(demographicSegmentation?.age)?.map(([ageGroup, percentage]) => (
                    <div key={ageGroup} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{ageGroup}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium text-foreground w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Heart" size={20} className="text-primary" />
          Emotional Responses
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emotionalResponses?.map((emotion, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl mb-2">{emotion?.emoji || '😊'}</p>
              <p className="font-medium text-foreground">{emotion?.emotion}</p>
              <p className="text-sm text-muted-foreground">Intensity: {emotion?.intensity}/10</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          AI Reasoning & Analysis
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Icon name="CheckCircle" size={16} className="text-green-500" />
          <span className="text-sm text-muted-foreground">
            Confidence Score: <span className="font-semibold text-foreground">{(confidenceScore * 100)?.toFixed(1)}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default VotingSentimentPanel;