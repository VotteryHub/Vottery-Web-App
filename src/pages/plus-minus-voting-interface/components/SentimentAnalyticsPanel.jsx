import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';


const SentimentAnalyticsPanel = ({ electionId, analytics }) => {
  const [sentimentData, setSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (analytics) {
      processSentimentData();
    }
  }, [analytics]);

  const processSentimentData = () => {
    const processed = analytics?.map(option => {
      const total = option?.positiveVotes + option?.neutralVotes + option?.negativeVotes;
      const sentimentScore = total > 0 ? (option?.positiveVotes - option?.negativeVotes) / total : 0;
      
      return {
        ...option,
        sentimentScore,
        sentimentLabel: getSentimentLabel(sentimentScore),
        sentimentColor: getSentimentColor(sentimentScore),
        polarization: calculatePolarization(option)
      };
    });

    setSentimentData(processed?.sort((a, b) => b?.sentimentScore - a?.sentimentScore));
    setLoading(false);
  };

  const getSentimentLabel = (score) => {
    if (score > 0.5) return 'Very Positive';
    if (score > 0.2) return 'Positive';
    if (score > -0.2) return 'Neutral';
    if (score > -0.5) return 'Negative';
    return 'Very Negative';
  };

  const getSentimentColor = (score) => {
    if (score > 0.5) return 'text-green-600';
    if (score > 0.2) return 'text-success';
    if (score > -0.2) return 'text-muted-foreground';
    if (score > -0.5) return 'text-destructive';
    return 'text-red-700';
  };

  const calculatePolarization = (option) => {
    const total = option?.positiveVotes + option?.neutralVotes + option?.negativeVotes;
    if (total === 0) return 0;
    
    const extremeVotes = option?.positiveVotes + option?.negativeVotes;
    return (extremeVotes / total * 100)?.toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Analyze voter sentiment patterns, polarization levels, and emotional responses to each option. 
              Sentiment scores range from -1 (very negative) to +1 (very positive).
            </p>
          </div>
        </div>
      </div>
      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={24} className="text-success" />
            <h3 className="font-semibold text-foreground">Most Positive</h3>
          </div>
          <p className="text-lg font-bold text-foreground mb-1">{sentimentData?.[0]?.electionOptions?.title}</p>
          <p className="text-sm text-muted-foreground">Score: {sentimentData?.[0]?.sentimentScore?.toFixed(3)}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Activity" size={24} className="text-warning" />
            <h3 className="font-semibold text-foreground">Most Polarizing</h3>
          </div>
          <p className="text-lg font-bold text-foreground mb-1">
            {sentimentData?.sort((a, b) => b?.polarization - a?.polarization)?.[0]?.electionOptions?.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {sentimentData?.[0]?.polarization}% extreme votes
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingDown" size={24} className="text-destructive" />
            <h3 className="font-semibold text-foreground">Most Negative</h3>
          </div>
          <p className="text-lg font-bold text-foreground mb-1">
            {sentimentData?.[sentimentData?.length - 1]?.electionOptions?.title}
          </p>
          <p className="text-sm text-muted-foreground">
            Score: {sentimentData?.[sentimentData?.length - 1]?.sentimentScore?.toFixed(3)}
          </p>
        </div>
      </div>
      {/* Detailed Sentiment Breakdown */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/50 border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">Sentiment Breakdown by Option</h3>
        </div>

        <div className="divide-y divide-border">
          {sentimentData?.map((option, index) => (
            <div key={option?.optionId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-heading font-bold text-foreground text-lg mb-1">
                    {option?.electionOptions?.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${option?.sentimentColor}`}>
                      {option?.sentimentLabel}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • Score: {option?.sentimentScore?.toFixed(3)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Polarization</p>
                  <p className="text-2xl font-bold text-foreground">{option?.polarization}%</p>
                </div>
              </div>

              {/* Sentiment Meter */}
              <div className="mb-4">
                <div className="relative h-3 bg-gradient-to-r from-destructive via-muted to-success rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 h-full w-1 bg-foreground"
                    style={{ left: `${((option?.sentimentScore + 1) / 2 * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Negative (-1)</span>
                  <span>Neutral (0)</span>
                  <span>Very Positive (+1)</span>
                </div>
              </div>

              {/* Vote Distribution */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-success/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-success mb-1">{option?.positiveVotes}</p>
                  <p className="text-xs text-muted-foreground">Positive Votes</p>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {option?.totalVotes > 0 ? ((option?.positiveVotes / option?.totalVotes * 100)?.toFixed(1)) : 0}%
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-muted-foreground mb-1">{option?.neutralVotes}</p>
                  <p className="text-xs text-muted-foreground">Neutral Votes</p>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {option?.totalVotes > 0 ? ((option?.neutralVotes / option?.totalVotes * 100)?.toFixed(1)) : 0}%
                  </p>
                </div>
                <div className="bg-destructive/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-destructive mb-1">{option?.negativeVotes}</p>
                  <p className="text-xs text-muted-foreground">Negative Votes</p>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {option?.totalVotes > 0 ? ((option?.negativeVotes / option?.totalVotes * 100)?.toFixed(1)) : 0}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sentiment Trends */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Overall Sentiment Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Users" size={18} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Average Sentiment</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {(sentimentData?.reduce((sum, opt) => sum + opt?.sentimentScore, 0) / sentimentData?.length)?.toFixed(3)}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" size={18} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Average Polarization</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {(sentimentData?.reduce((sum, opt) => sum + parseFloat(opt?.polarization), 0) / sentimentData?.length)?.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyticsPanel;