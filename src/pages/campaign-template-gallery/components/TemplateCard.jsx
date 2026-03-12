import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateCard = ({ template, onSelect, onApply }) => {
  const getIndustryColor = (industry) => {
    switch (industry) {
      case 'retail':
        return 'bg-purple-500/10 text-purple-500';
      case 'technology':
        return 'bg-blue-500/10 text-blue-500';
      case 'nonprofits':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getIndustryIcon = (industry) => {
    switch (industry) {
      case 'retail':
        return 'ShoppingBag';
      case 'technology':
        return 'Cpu';
      case 'nonprofits':
        return 'Heart';
      default:
        return 'Layers';
    }
  };

  return (
    <div
      className="card overflow-hidden hover:border-primary transition-all duration-250 cursor-pointer group"
      onClick={() => onSelect(template)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={template?.image}
          alt={template?.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getIndustryColor(template?.industry)} bg-background/90 backdrop-blur-sm flex items-center gap-1`}>
            <Icon name={getIndustryIcon(template?.industry)} size={12} />
            {template?.industry?.charAt(0)?.toUpperCase() + template?.industry?.slice(1)}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-success/90 text-white backdrop-blur-sm flex items-center gap-1">
            <Icon name="TrendingUp" size={12} />
            {template?.successRate}% Success
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2 line-clamp-1">
            {template?.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {template?.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>{template?.setupTime} setup</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span>{(template?.avgEngagement / 1000)?.toFixed(1)}K avg. engagement</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="FileQuestion" size={14} />
            <span>{template?.preWrittenQuestions?.length} questions</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="DollarSign" size={14} />
            <span className="capitalize">{template?.budgetRange} budget</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            onClick={(e) => {
              e?.stopPropagation();
              onSelect(template);
            }}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            size="sm"
            iconName="Zap"
            onClick={(e) => {
              e?.stopPropagation();
              onApply(template);
            }}
            className="flex-1"
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;