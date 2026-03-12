import React from 'react';
import Icon from '../../../components/AppIcon';

const SentimentTrendsPanel = ({ data }) => {
  const sentimentData = [
    { label: 'Positive', value: data?.positive || 0, color: 'bg-success', icon: 'ThumbsUp' },
    { label: 'Neutral', value: data?.neutral || 0, color: 'bg-warning', icon: 'Minus' },
    { label: 'Negative', value: data?.negative || 0, color: 'bg-destructive', icon: 'ThumbsDown' }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return { icon: 'TrendingUp', color: 'text-success' };
    if (trend === 'declining') return { icon: 'TrendingDown', color: 'text-destructive' };
    return { icon: 'Minus', color: 'text-warning' };
  };

  const trendInfo = getTrendIcon(data?.trendDirection);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Voter Sentiment Analysis
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <Icon name="Sparkles" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered</span>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {sentimentData?.map((sentiment, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name={sentiment?.icon} size={20} className="text-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {sentiment?.label}
                  </span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {sentiment?.value?.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className={`${sentiment?.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${sentiment?.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trend Direction */}
        <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
          <Icon name={trendInfo?.icon} size={24} className={trendInfo?.color} />
          <div>
            <p className="text-sm text-muted-foreground">Overall Trend</p>
            <p className="text-lg font-semibold text-foreground capitalize">
              {data?.trendDirection || 'Stable'}
            </p>
          </div>
          <div className="ml-auto">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-lg font-semibold text-foreground">
              {((data?.confidence || 0) * 100)?.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Key Themes */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Tag" size={20} className="text-primary" />
          Key Themes Identified
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data?.keyThemes?.map((theme, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{index + 1}</span>
              </div>
              <span className="text-foreground font-medium">{theme}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Note */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <Icon name="Info" size={20} className="text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            AI-Generated Insights
          </p>
          <p className="text-sm text-muted-foreground">
            This sentiment analysis is powered by OpenAI GPT-5 and analyzes voting patterns, 
            engagement metrics, and user feedback to provide real-time sentiment trends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrendsPanel;