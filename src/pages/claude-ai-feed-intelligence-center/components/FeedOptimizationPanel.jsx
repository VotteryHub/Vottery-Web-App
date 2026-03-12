import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeedOptimizationPanel = () => {
  const [optimizationData] = useState({
    currentComposition: {
      elections: 45,
      socialPosts: 35,
      sponsored: 15,
      moments: 5
    },
    recommendedComposition: {
      elections: 50,
      socialPosts: 30,
      sponsored: 15,
      moments: 5
    },
    optimizationMetrics: {
      diversityScore: 87.3,
      relevanceScore: 92.1,
      engagementPrediction: 89.5,
      retentionImpact: '+18.7%'
    },
    abTestingResults: [
      {
        variant: 'Current Mix',
        engagementRate: 76.3,
        timeOnFeed: '12m 34s',
        conversionRate: 8.2
      },
      {
        variant: 'Recommended Mix',
        engagementRate: 84.7,
        timeOnFeed: '15m 12s',
        conversionRate: 9.8
      }
    ],
    continuousLearning: {
      feedbackLoops: 2847,
      modelIterations: 156,
      accuracyImprovement: '+12.4%',
      lastUpdated: '2 hours ago'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Feed Optimization Intelligence
        </h2>
        <Button>
          <Icon name="Play" size={16} />
          Apply Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Diversity Score</p>
          <p className="text-2xl font-bold text-foreground">{optimizationData?.optimizationMetrics?.diversityScore}%</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Relevance Score</p>
          <p className="text-2xl font-bold text-foreground">{optimizationData?.optimizationMetrics?.relevanceScore}%</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Engagement Prediction</p>
          <p className="text-2xl font-bold text-foreground">{optimizationData?.optimizationMetrics?.engagementPrediction}%</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Retention Impact</p>
          <p className="text-2xl font-bold text-success">{optimizationData?.optimizationMetrics?.retentionImpact}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Current Feed Composition</h3>
          <div className="space-y-3">
            {Object.entries(optimizationData?.currentComposition)?.map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">{key}</span>
                  <span className="text-sm font-bold text-foreground">{value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-muted-foreground h-2 rounded-full" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={18} className="text-primary" />
            Recommended Composition
          </h3>
          <div className="space-y-3">
            {Object.entries(optimizationData?.recommendedComposition)?.map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">{key}</span>
                  <span className="text-sm font-bold text-primary">{value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">A/B Testing Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Variant</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Engagement Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Time on Feed</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Conversion Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Winner</th>
              </tr>
            </thead>
            <tbody>
              {optimizationData?.abTestingResults?.map((result, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 text-sm text-foreground font-medium">{result?.variant}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{result?.engagementRate}%</td>
                  <td className="py-3 px-4 text-sm text-foreground">{result?.timeOnFeed}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{result?.conversionRate}%</td>
                  <td className="py-3 px-4">
                    {index === 1 && (
                      <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-md">
                        Winner
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="RefreshCw" size={18} className="text-primary" />
          Continuous Learning Optimization
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Feedback Loops</p>
            <p className="text-lg font-bold text-foreground">{optimizationData?.continuousLearning?.feedbackLoops?.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Model Iterations</p>
            <p className="text-lg font-bold text-foreground">{optimizationData?.continuousLearning?.modelIterations}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Accuracy Improvement</p>
            <p className="text-lg font-bold text-success">{optimizationData?.continuousLearning?.accuracyImprovement}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
            <p className="text-lg font-bold text-foreground">{optimizationData?.continuousLearning?.lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedOptimizationPanel;