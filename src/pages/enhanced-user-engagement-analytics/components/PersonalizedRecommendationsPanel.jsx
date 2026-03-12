import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PersonalizedRecommendationsPanel = ({ recommendations, onRefresh }) => {
  const [expandedRec, setExpandedRec] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
      case 'Medium': return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
      case 'Low': return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Engagement': return 'Zap';
      case 'Social': return 'Users';
      case 'Retention': return 'TrendingUp';
      default: return 'Target';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Lightbulb" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Personalized Recommendations</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered optimization strategies with expected impact scoring
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {recommendations?.map((rec) => {
          const priorityColors = getPriorityColor(rec?.priority);
          const isExpanded = expandedRec === rec?.id;

          return (
            <div key={rec?.id} className="border border-border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted hover:bg-muted/80 transition-colors cursor-pointer" onClick={() => setExpandedRec(isExpanded ? null : rec?.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name={getCategoryIcon(rec?.category)} size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{rec?.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors?.bg} ${priorityColors?.text}`}>
                          {rec?.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec?.category}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Icon name="TrendingUp" size={14} className="text-success" />
                          <span className="text-sm font-medium text-success">{rec?.expectedImpact}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Target" size={14} className="text-primary" />
                          <span className="text-sm text-muted-foreground">{Math.round(rec?.confidence * 100)}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} className="text-muted-foreground" />
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 bg-card border-t border-border">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">AI Reasoning</h4>
                    <p className="text-sm text-muted-foreground">{rec?.reasoning}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" iconName="Check">
                      Implement
                    </Button>
                    <Button size="sm" variant="outline" iconName="Eye">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" iconName="X">
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">About Recommendations</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              These AI-powered recommendations are generated based on comprehensive analysis of user behavior patterns, engagement metrics, and predictive modeling. Confidence scores indicate the reliability of expected impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendationsPanel;