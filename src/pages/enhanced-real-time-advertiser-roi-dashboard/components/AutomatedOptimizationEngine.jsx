import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedOptimizationEngine = ({ data }) => {
  const recommendations = [
    {
      id: 1,
      type: 'budget',
      priority: 'high',
      title: 'Increase Zone 3 Budget by 15%',
      description: 'Zone 3 shows 23% higher conversion rate with 18% lower cost per participant. Reallocating $4,200 from Zone 6 could increase overall ROI by 8.5%.',
      impact: '+8.5% ROI',
      confidence: 92,
      action: 'Apply Recommendation'
    },
    {
      id: 2,
      type: 'targeting',
      priority: 'high',
      title: 'Optimize Audience Targeting in Zone 4',
      description: 'AI analysis suggests narrowing age range to 25-44 and focusing on evening engagement (6-10 PM) to improve conversion by 12%.',
      impact: '+12% Conversion',
      confidence: 88,
      action: 'Apply Recommendation'
    },
    {
      id: 3,
      type: 'creative',
      priority: 'medium',
      title: 'Update Creative Assets for Campaign #2',
      description: 'Video content shows 34% higher engagement than static images. Switching to video format could reduce cost per engagement by $0.40.',
      impact: '-$0.40 CPE',
      confidence: 85,
      action: 'Review Assets'
    },
    {
      id: 4,
      type: 'timing',
      priority: 'medium',
      title: 'Adjust Campaign Schedule',
      description: 'Peak engagement occurs 8-11 AM and 7-10 PM. Shifting 30% of budget to these windows could increase participation by 18%.',
      impact: '+18% Participation',
      confidence: 90,
      action: 'Adjust Schedule'
    },
    {
      id: 5,
      type: 'budget',
      priority: 'low',
      title: 'Reduce Zone 8 Spending',
      description: 'Zone 8 performance is 15% below average with diminishing returns. Consider reducing budget by 20% and reallocating to higher-performing zones.',
      impact: '+3.2% ROI',
      confidence: 78,
      action: 'Review Data'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'budget':
        return 'DollarSign';
      case 'targeting':
        return 'Target';
      case 'creative':
        return 'Image';
      case 'timing':
        return 'Clock';
      default:
        return 'Lightbulb';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Automated Optimization Engine
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-powered recommendations based on real-time performance data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Sparkles" size={24} className="text-accent" />
          <span className="text-sm font-medium text-accent">AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Potential ROI Increase</span>
          </div>
          <p className="text-2xl font-heading font-bold text-success font-data">+23.7%</p>
        </div>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Lightbulb" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Active Recommendations</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">5</p>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Avg Confidence Score</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">86.6%</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations?.map((rec) => (
          <div key={rec?.id} className="p-5 rounded-lg border border-border bg-card hover:border-primary transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name={getTypeIcon(rec?.type)} size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-heading font-semibold text-foreground">{rec?.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(rec?.priority)}`}>
                      {rec?.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={16} className="text-success" />
                    <span className="text-sm font-semibold text-success">{rec?.impact}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{rec?.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-24 bg-border rounded-full h-2">
                        <div
                          className="bg-success h-2 rounded-full"
                          style={{ width: `${rec?.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground font-data">{rec?.confidence}%</span>
                    </div>
                  </div>
                  <Button variant="default" size="sm" iconName="ArrowRight">
                    {rec?.action}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-accent/10">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">
              How Optimization Works
            </h4>
            <p className="text-sm text-muted-foreground">
              Our AI engine analyzes real-time campaign data, historical performance patterns, and market trends to generate actionable recommendations. Each suggestion includes confidence scores based on statistical significance and predicted impact on your ROI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedOptimizationEngine;