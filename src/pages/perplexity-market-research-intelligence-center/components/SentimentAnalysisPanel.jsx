import React from 'react';
import Icon from '../../../components/AppIcon';

const SentimentAnalysisPanel = ({ sentimentData, onRefresh }) => {
  const sentimentBreakdown = sentimentData?.sentimentBreakdown || {
    positive: 62.5,
    neutral: 28.3,
    negative: 9.2
  };

  const brandMentions = sentimentData?.brandMentions || [
    { brand: 'Brand A', mentions: 1240, sentiment: 'positive' },
    { brand: 'Brand B', mentions: 890, sentiment: 'neutral' },
    { brand: 'Brand C', mentions: 560, sentiment: 'positive' }
  ];

  const demographicSegmentation = sentimentData?.demographicSegmentation || {
    age: { '18-24': 32, '25-34': 28, '35-44': 22, '45+': 18 },
    gender: { male: 52, female: 45, other: 3 },
    location: { urban: 58, suburban: 32, rural: 10 }
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      neutral: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      negative: 'text-red-600 bg-red-50 dark:bg-red-900/20'
    };
    return colors?.[sentiment] || colors?.neutral;
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">Voting Sentiment Analysis</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <span className="text-sm font-bold text-primary font-data">
              {((sentimentData?.confidenceScore || 0.87) * 100)?.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900 dark:text-green-100">Positive</span>
              <Icon name="TrendingUp" size={18} className="text-green-600" />
            </div>
            <div className="text-3xl font-heading font-bold text-green-600 font-data">
              {sentimentBreakdown?.positive}%
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Neutral</span>
              <Icon name="Minus" size={18} className="text-blue-600" />
            </div>
            <div className="text-3xl font-heading font-bold text-blue-600 font-data">
              {sentimentBreakdown?.neutral}%
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-900 dark:text-red-100">Negative</span>
              <Icon name="TrendingDown" size={18} className="text-red-600" />
            </div>
            <div className="text-3xl font-heading font-bold text-red-600 font-data">
              {sentimentBreakdown?.negative}%
            </div>
          </div>
        </div>

        {sentimentData?.reasoning && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="Brain" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Extended Reasoning</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">{sentimentData?.reasoning}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Brand Mentions & Sentiment</h3>
          <div className="space-y-3">
            {brandMentions?.map((brand, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="TrendingUp" size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{brand?.brand}</div>
                    <div className="text-sm text-muted-foreground">{brand?.mentions} mentions</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(brand?.sentiment)}`}>
                  {brand?.sentiment}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Demographic Segmentation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Age Distribution</span>
              </div>
              <div className="space-y-2">
                {Object.entries(demographicSegmentation?.age || {})?.map(([age, percentage]) => (
                  <div key={age} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-16">{age}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground w-10 text-right font-data">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Location Distribution</span>
              </div>
              <div className="space-y-2">
                {Object.entries(demographicSegmentation?.location || {})?.map(([location, percentage]) => (
                  <div key={location} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-16 capitalize">{location}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground w-10 text-right font-data">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisPanel;