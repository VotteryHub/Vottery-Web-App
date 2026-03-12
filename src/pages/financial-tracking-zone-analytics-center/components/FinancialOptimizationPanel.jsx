import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FinancialOptimizationPanel = ({ recommendations, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const optimizationCategories = [
    {
      title: 'Prize Pool Adjustments',
      icon: 'Award',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      recommendations: recommendations?.filter(r => r?.forecastType === 'prize_pool')?.slice(0, 3)
    },
    {
      title: 'Fee Structure Modifications',
      icon: 'DollarSign',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      recommendations: recommendations?.filter(r => r?.forecastType === 'participation_fee')?.slice(0, 3)
    },
    {
      title: 'Advertiser Budget Allocation',
      icon: 'TrendingUp',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      recommendations: recommendations?.filter(r => r?.forecastType === 'advertiser_spending')?.slice(0, 3)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Financial Optimization
            </h2>
            <p className="text-sm text-muted-foreground">
              Automated recommendations based on zone-specific performance data
            </p>
          </div>
          <Icon name="Target" size={24} className="text-primary" />
        </div>

        <div className="space-y-6">
          {optimizationCategories?.map((category, catIndex) => (
            <div key={catIndex} className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${category?.bgColor} flex items-center justify-center`}>
                  <Icon name={category?.icon} size={20} className={category?.color} />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  {category?.title}
                </h3>
              </div>

              <div className="space-y-3">
                {category?.recommendations?.map((rec, recIndex) => (
                  <div key={recIndex} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={14} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {rec?.zone?.replace('_', ' ')?.toUpperCase()}
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-full ${
                        rec?.confidenceLevel === 'high' ? 'bg-green-500/10' : 
                        rec?.confidenceLevel === 'medium' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                      }`}>
                        <span className={`text-xs font-medium ${
                          rec?.confidenceLevel === 'high' ? 'text-green-500' : 
                          rec?.confidenceLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {rec?.confidenceLevel?.toUpperCase()} CONFIDENCE
                        </span>
                      </div>
                    </div>
                    {rec?.optimizationRecommendations?.map((opt, optIndex) => (
                      <div key={optIndex} className="mb-2">
                        <div className="flex items-start gap-2 mb-1">
                          <Icon name="CheckCircle" size={14} className="text-green-500 mt-0.5" />
                          <p className="text-sm text-foreground font-medium">{opt?.action}</p>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">{opt?.impact}</p>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm" iconName="Play">
                        Apply Recommendation
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Info">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-primary" />
          Optimization Impact Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-green-500 mb-1">+₹245K</div>
            <div className="text-sm text-muted-foreground">Projected Revenue Increase</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-blue-500 mb-1">+8.5%</div>
            <div className="text-sm text-muted-foreground">Average ROI Improvement</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-purple-500 mb-1">12</div>
            <div className="text-sm text-muted-foreground">Active Recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOptimizationPanel;