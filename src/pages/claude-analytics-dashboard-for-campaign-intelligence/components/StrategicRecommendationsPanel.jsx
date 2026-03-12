import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StrategicRecommendationsPanel = ({ recommendations }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'allocation': return 'Target';
      case 'engagement': return 'Users';
      case 'pricing': return 'DollarSign';
      case 'frequency': return 'Calendar';
      default: return 'Lightbulb';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (!recommendations || recommendations?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Icon name="Lightbulb" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No strategic recommendations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Lightbulb" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Strategic Recommendations</h2>
            <p className="text-sm text-muted-foreground">AI-generated insights for campaign optimization</p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations?.map((rec, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-all duration-250"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name={getCategoryIcon(rec?.category)} size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-heading font-bold text-foreground">{rec?.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(rec?.impact)}`}>
                        {rec?.impact?.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec?.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" iconName="Check">
                  Implement
                </Button>
                <Button variant="outline" size="sm" iconName="Eye">
                  View Details
                </Button>
                <Button variant="ghost" size="sm" iconName="Share">
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Lightbulb" size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Recommendations</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{recommendations?.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-green-600" />
            <h3 className="text-sm font-medium text-muted-foreground">High Impact</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {recommendations?.filter(r => r?.impact === 'high')?.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Target" size={20} className="text-yellow-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Medium Impact</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {recommendations?.filter(r => r?.impact === 'medium')?.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CheckCircle" size={20} className="text-blue-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Implemented</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">0</p>
        </div>
      </div>
    </div>
  );
};

export default StrategicRecommendationsPanel;