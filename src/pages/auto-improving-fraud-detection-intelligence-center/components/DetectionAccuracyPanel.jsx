import React from 'react';
import Icon from '../../../components/AppIcon';

const DetectionAccuracyPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No accuracy data available</p>
      </div>
    );
  }

  const accuracyTrend = data?.currentAccuracy > data?.previousAccuracy ? 'up' : 'down';
  const trendColor = accuracyTrend === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Accuracy</span>
            <Icon name="Target" className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{data?.currentAccuracy}%</span>
            <span className={`text-sm font-medium mb-1 ${trendColor}`}>
              {accuracyTrend === 'up' ? '+' : ''}{data?.improvementRate}%
            </span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Previous: {data?.previousAccuracy}%
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">False Positive Rate</span>
            <Icon name="AlertTriangle" className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.falsePositiveRate}%</div>
          <div className="mt-2 text-xs text-green-500">
            ↓ Decreasing trend
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">False Negative Rate</span>
            <Icon name="XCircle" className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.falseNegativeRate}%</div>
          <div className="mt-2 text-xs text-green-500">
            ↓ Improving
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Confidence Score</span>
            <Icon name="Shield" className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{(data?.confidenceScore * 100)?.toFixed(1)}%</div>
          <div className="mt-2 text-xs text-muted-foreground">
            High confidence
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" className="w-5 h-5 text-primary" />
          Prediction Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Predictions</span>
              <span className="text-2xl font-bold text-foreground">{data?.totalPredictions?.toLocaleString()}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Correct Predictions</span>
              <span className="text-2xl font-bold text-green-500">{data?.correctPredictions?.toLocaleString()}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(data?.correctPredictions / data?.totalPredictions * 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" className="w-5 h-5 text-primary" />
          Confidence Scoring Evolution
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Detection Confidence</span>
            <span className="text-sm font-medium text-foreground">{(data?.confidenceScore * 100)?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all" style={{ width: `${data?.confidenceScore * 100}%` }}></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Low</div>
              <div className="text-sm font-medium text-red-500">0-60%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Medium</div>
              <div className="text-sm font-medium text-orange-500">60-85%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">High</div>
              <div className="text-sm font-medium text-green-500">85-100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionAccuracyPanel;