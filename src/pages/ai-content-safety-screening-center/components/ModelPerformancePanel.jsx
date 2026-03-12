import React from 'react';
import Icon from '../../../components/AppIcon';

const ModelPerformancePanel = ({ modelPerformance, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)]?.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-5 bg-muted rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getModelIcon = (modelType) => {
    switch (modelType) {
      case 'misinformation':
        return 'AlertCircle';
      case 'hate_speech':
        return 'MessageSquareWarning';
      case 'spam':
        return 'Mail';
      case 'election_interference':
        return 'Vote';
      default:
        return 'Cpu';
    }
  };

  const getPerformanceColor = (value) => {
    if (value >= 95) return 'text-green-500';
    if (value >= 90) return 'text-blue-500';
    if (value >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modelPerformance?.map((model) => (
          <div key={model?.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon name={getModelIcon(model?.modelType)} className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{model?.modelType?.replace('_', ' ')?.toUpperCase()}</h3>
                <p className="text-xs text-muted-foreground">Version {model?.modelVersion}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                <span className={`text-sm font-semibold ${getPerformanceColor(model?.accuracyRate)}`}>
                  {model?.accuracyRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Precision Rate</span>
                <span className={`text-sm font-semibold ${getPerformanceColor(model?.precisionRate)}`}>
                  {model?.precisionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recall Rate</span>
                <span className={`text-sm font-semibold ${getPerformanceColor(model?.recallRate)}`}>
                  {model?.recallRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">F1 Score</span>
                <span className={`text-sm font-semibold ${getPerformanceColor(model?.f1Score)}`}>
                  {model?.f1Score}%
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">False Positive Rate</span>
                  <span className="text-sm font-medium text-foreground">{model?.falsePositiveRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">False Negative Rate</span>
                  <span className="text-sm font-medium text-foreground">{model?.falseNegativeRate}%</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Processed</span>
                  <span className="text-sm font-medium text-foreground">{model?.totalProcessed?.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">True Positives</span>
                    <span className="font-medium text-green-500">{model?.truePositives}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">False Positives</span>
                    <span className="font-medium text-red-500">{model?.falsePositives}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">True Negatives</span>
                    <span className="font-medium text-green-500">{model?.trueNegatives}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">False Negatives</span>
                    <span className="font-medium text-red-500">{model?.falseNegatives}</span>
                  </div>
                </div>
              </div>
              {model?.lastTrainedAt && (
                <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                  Last trained: {new Date(model?.lastTrainedAt)?.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Model Training & Improvement
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Feedback Loop Active</p>
              <p className="text-sm text-muted-foreground">Continuous learning from human reviews</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-500 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Bias Detection Monitoring</p>
              <p className="text-sm text-muted-foreground">Automated fairness checks across demographics</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-500 rounded-full">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Next Training Cycle</p>
              <p className="text-sm text-muted-foreground">Scheduled model retraining</p>
            </div>
            <span className="text-sm font-medium text-foreground">In 3 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformancePanel;