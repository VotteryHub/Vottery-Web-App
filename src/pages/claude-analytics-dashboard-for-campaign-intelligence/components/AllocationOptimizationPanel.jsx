import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AllocationOptimizationPanel = ({ analysis, onRefresh }) => {
  const [selectedSegment, setSelectedSegment] = useState(null);

  const allocationSuggestions = [
    { segment: 'Premium Users', current: 15, recommended: 25, impact: 'high', reasoning: 'Higher engagement and retention rates' },
    { segment: 'MAU (Monthly Active)', current: 30, recommended: 35, impact: 'high', reasoning: 'Core user base with consistent activity' },
    { segment: 'DAU (Daily Active)', current: 65, recommended: 60, impact: 'medium', reasoning: 'Already well-allocated, slight optimization' },
    { segment: 'Content Creators', current: 30, recommended: 40, impact: 'high', reasoning: 'Drive platform growth and engagement' },
    { segment: 'Advertisers', current: 15, recommended: 20, impact: 'medium', reasoning: 'Increase advertiser loyalty and spend' },
    { segment: 'By Country (US)', current: 19, recommended: 22, impact: 'medium', reasoning: 'High-value market with growth potential' },
    { segment: 'By Gender (Female)', current: 50, recommended: 55, impact: 'medium', reasoning: 'Underrepresented in current campaigns' },
    { segment: 'Subscribers', current: 15, recommended: 18, impact: 'high', reasoning: 'Reward subscription loyalty' }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Target" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">Allocation Optimization</h2>
              <p className="text-sm text-muted-foreground">Claude AI-powered allocation recommendations</p>
            </div>
          </div>
          <Button variant="outline" iconName="Download" size="sm">
            Export Report
          </Button>
        </div>

        <div className="space-y-3">
          {allocationSuggestions?.map((suggestion, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg p-4 hover:border-primary/40 transition-all duration-250 cursor-pointer"
              onClick={() => setSelectedSegment(selectedSegment === index ? null : index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-muted rounded-lg">
                    <Icon name="Users" size={24} className="text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-heading font-bold text-foreground">{suggestion?.segment}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(suggestion?.impact)}`}>
                        {suggestion?.impact?.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Current Allocation</p>
                        <p className="text-2xl font-bold text-foreground">{suggestion?.current}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Recommended Allocation</p>
                        <p className="text-2xl font-bold text-primary">{suggestion?.recommended}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={16} className="text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        +{suggestion?.recommended - suggestion?.current}% increase recommended
                      </span>
                    </div>
                  </div>
                </div>
                <Icon name={selectedSegment === index ? "ChevronUp" : "ChevronDown"} size={20} className="text-muted-foreground" />
              </div>

              {selectedSegment === index && (
                <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Lightbulb" size={20} className="text-primary mt-1" />
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Claude AI Reasoning</h4>
                        <p className="text-sm text-muted-foreground">{suggestion?.reasoning}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="default" size="sm" iconName="Check">
                      Apply Recommendation
                    </Button>
                    <Button variant="outline" size="sm" iconName="Edit">
                      Customize
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-green-600" />
            <h3 className="text-sm font-medium text-muted-foreground">High Impact Changes</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {allocationSuggestions?.filter(s => s?.impact === 'high')?.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Target" size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Avg Improvement</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            +{(allocationSuggestions?.reduce((sum, s) => sum + (s?.recommended - s?.current), 0) / allocationSuggestions?.length)?.toFixed(1)}%
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Users" size={20} className="text-blue-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Segments Analyzed</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{allocationSuggestions?.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AllocationOptimizationPanel;