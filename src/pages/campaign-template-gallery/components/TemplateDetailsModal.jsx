import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateDetailsModal = ({ template, onClose, onApply }) => {
  const getIndustryColor = (industry) => {
    switch (industry) {
      case 'retail':
        return 'text-purple-500';
      case 'technology':
        return 'text-blue-500';
      case 'nonprofits':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={template?.image}
            alt={template?.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            onClick={onClose}
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
          />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-background/90 ${getIndustryColor(template?.industry)} backdrop-blur-sm`}>
                {template?.industry?.charAt(0)?.toUpperCase() + template?.industry?.slice(1)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/90 text-white backdrop-blur-sm">
                {template?.successRate}% Success Rate
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {template?.name}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground">{template?.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Clock" size={20} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Setup Time</span>
              </div>
              <p className="text-xl font-bold text-foreground">{template?.setupTime}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Users" size={20} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Avg. Engagement</span>
              </div>
              <p className="text-xl font-bold text-foreground">{template?.avgEngagement?.toLocaleString()}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Target" size={20} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Success Rate</span>
              </div>
              <p className="text-xl font-bold text-foreground">{template?.successRate}%</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="DollarSign" size={20} className="text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Budget Range</span>
              </div>
              <p className="text-xl font-bold text-foreground capitalize">{template?.budgetRange}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="FileQuestion" size={20} className="text-primary" />
              Pre-Written Election Questions
            </h3>
            <div className="space-y-2">
              {template?.preWrittenQuestions?.map((question, index) => (
                <div key={index} className="card p-4 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-foreground">{question}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Target" size={20} className="text-primary" />
              Recommended Targeting Parameters
            </h3>
            <div className="card p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Target Zones</p>
                <div className="flex flex-wrap gap-2">
                  {template?.targetingParams?.zones?.map((zone) => (
                    <span key={zone} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Zone {zone}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Demographics</p>
                <p className="text-foreground">{template?.targetingParams?.demographics}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Interests</p>
                <p className="text-foreground">{template?.targetingParams?.interests}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="PieChart" size={20} className="text-primary" />
              Optimized Budget Allocation
            </h3>
            <div className="card p-4">
              <div className="space-y-3">
                {Object.entries(template?.budgetAllocation)?.map(([zone, percentage]) => (
                  <div key={zone}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {zone?.replace(/([0-9]+)/, ' $1')}
                      </span>
                      <span className="text-sm font-bold text-primary">{percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Image" size={20} className="text-primary" />
              Suggested Media Assets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {template?.mediaAssets?.map((asset, index) => (
                <div key={index} className="card p-4 flex items-center gap-3">
                  <Icon name="FileImage" size={20} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{asset}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="TrendingUp" size={16} />
            <span>Based on {template?.avgEngagement?.toLocaleString()} similar campaigns</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button iconName="Zap" onClick={() => onApply(template)}>
              Apply Template to Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsModal;