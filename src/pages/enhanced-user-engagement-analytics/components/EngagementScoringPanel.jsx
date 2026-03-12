import React from 'react';
import Icon from '../../../components/AppIcon';

const EngagementScoringPanel = ({ data, timeframe }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
    if (score >= 50) return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' };
    return { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
  };

  const scoreColors = getScoreColor(data?.overallScore);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <Icon name="Zap" size={24} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Engagement Scoring</h2>
          <p className="text-sm text-muted-foreground">
            Algorithmic user classification • {timeframe}
          </p>
        </div>
      </div>

      <div className={`${scoreColors?.bg} border ${scoreColors?.border} rounded-lg p-6 mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Platform Engagement Score</p>
            <p className={`text-5xl font-bold ${scoreColors?.text}`}>{data?.overallScore}</p>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
          </div>
          <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
            <Icon name="TrendingUp" size={40} className={scoreColors?.text} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-foreground mb-3">Score Distribution</h3>
        <div className="space-y-3">
          {data?.scoreDistribution?.map((dist, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{dist?.range}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{dist?.count?.toLocaleString()} users</span>
                  <span className="text-sm font-bold text-primary">{dist?.percentage}%</span>
                </div>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${dist?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Scoring Factors</h3>
        <div className="space-y-2">
          {data?.scoringFactors?.map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="Target" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{factor?.factor}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{factor?.weight}% weight</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  factor?.impact === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                  factor?.impact === 'Medium'? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {factor?.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementScoringPanel;