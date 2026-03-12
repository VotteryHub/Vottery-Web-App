import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreatorRevenueOptimizationPanel = ({ data, timeframe }) => {
  const [selectedOptimization, setSelectedOptimization] = useState(null);

  const optimizationRecommendations = [
    {
      id: 1,
      title: 'Increase Prize Pool by 15%',
      impact: 'high',
      expectedRevenue: '+$2,450/month',
      confidence: 92,
      description: 'Analysis shows 15% prize pool increase correlates with 28% higher participation rates in your category',
      actions: ['Adjust pricing strategy', 'Optimize zone allocation', 'Test A/B variants']
    },
    {
      id: 2,
      title: 'Optimize Posting Schedule',
      impact: 'high',
      expectedRevenue: '+$1,850/month',
      confidence: 88,
      description: 'Peak engagement detected at 7-9 PM EST. Shifting election launches to this window increases visibility by 34%',
      actions: ['Schedule elections for 7 PM EST', 'Enable auto-promotion', 'Leverage trending topics']
    },
    {
      id: 3,
      title: 'Switch to Ranked Choice Voting',
      impact: 'medium',
      expectedRevenue: '+$1,200/month',
      confidence: 85,
      description: 'Ranked choice voting shows 23% higher completion rates and 18% better user satisfaction in similar elections',
      actions: ['Convert existing templates', 'Update election settings', 'Educate audience']
    },
    {
      id: 4,
      title: 'Expand to Zone 6-8',
      impact: 'high',
      expectedRevenue: '+$3,200/month',
      confidence: 79,
      description: 'Higher purchasing power zones (6-8) show 45% better ROI with your content style and audience demographics',
      actions: ['Create premium tier', 'Adjust pricing model', 'Target high-value segments']
    },
    {
      id: 5,
      title: 'Implement Content Series',
      impact: 'medium',
      expectedRevenue: '+$980/month',
      confidence: 82,
      description: 'Series-based elections increase follower retention by 31% and generate 2.3x more repeat participation',
      actions: ['Plan content calendar', 'Create series branding', 'Build anticipation']
    }
  ];

  const audienceGrowthPredictions = [
    { metric: 'Current Followers', value: '12,450', change: null },
    { metric: 'Predicted Followers (30d)', value: '15,680', change: '+25.9%' },
    { metric: 'Predicted Followers (60d)', value: '18,920', change: '+51.9%' },
    { metric: 'Predicted Followers (90d)', value: '22,340', change: '+79.4%' }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="DollarSign" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Automated Earning Enhancement Suggestions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-muted-foreground">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${data?.totalEarnings?.toLocaleString() || '45,680'}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+18.5% vs last month</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-muted-foreground">Optimization Potential</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              +$9,680/mo
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">With recommended changes</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-muted-foreground">Quick Wins</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              3 Actions
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Implement within 7 days</div>
          </div>
        </div>

        <div className="space-y-4">
          {optimizationRecommendations?.map((rec) => (
            <div 
              key={rec?.id}
              className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                selectedOptimization === rec?.id 
                  ? 'border-primary bg-blue-50 dark:bg-blue-900/20' :'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedOptimization(rec?.id === selectedOptimization ? null : rec?.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{rec?.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec?.impact)}`}>
                      {rec?.impact?.toUpperCase()} IMPACT
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rec?.description}</p>
                  
                  {selectedOptimization === rec?.id && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-foreground">Recommended Actions:</span>
                      </div>
                      <ul className="space-y-2 ml-6">
                        {rec?.actions?.map((action, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-3">
                        <Icon name="Play" size={16} className="mr-2" />
                        Implement Optimization
                      </Button>
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {rec?.expectedRevenue}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {rec?.confidence}% confidence
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Users" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Audience Growth Predictions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {audienceGrowthPredictions?.map((pred, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">{pred?.metric}</div>
              <div className="text-2xl font-bold text-foreground">{pred?.value}</div>
              {pred?.change && (
                <div className="flex items-center gap-1 mt-2">
                  <Icon name="TrendingUp" size={14} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {pred?.change}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Personalized Optimization Pathway</h3>
            <p className="text-blue-100 mb-4">
              Follow this AI-generated roadmap to maximize your creator earnings over the next 90 days
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm">Week 1-2: Optimize posting schedule and increase prize pools</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm">Week 3-4: Switch to ranked choice voting and test new formats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-sm">Week 5-8: Expand to higher purchasing power zones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">4</div>
                <span className="text-sm">Week 9-12: Launch content series and build loyal audience</span>
              </div>
            </div>
          </div>
          <Icon name="Rocket" size={48} className="text-white/30" />
        </div>
      </div>
    </div>
  );
};

export default CreatorRevenueOptimizationPanel;