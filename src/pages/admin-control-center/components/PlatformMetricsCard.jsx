import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformMetricsCard = ({ metric }) => {
  const getTrendColor = (trend) => {
    if (trend?.startsWith('+')) return 'text-success';
    if (trend?.startsWith('-')) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend) => {
    if (trend?.startsWith('+')) return 'TrendingUp';
    if (trend?.startsWith('-')) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="card hover:shadow-democratic-md transition-all duration-250">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric?.bgColor}`}>
          <Icon name={metric?.icon} size={24} color={metric?.iconColor} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          metric?.trend?.startsWith('+') ? 'bg-success/10 text-success' :
          metric?.trend?.startsWith('-') ? 'bg-destructive/10 text-destructive' :
          'bg-muted text-muted-foreground'
        }`}>
          <Icon name={getTrendIcon(metric?.trend)} size={12} />
          <span>{metric?.trend}</span>
        </div>
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{metric?.label}</h3>
      <p className="text-2xl md:text-3xl font-heading font-bold text-foreground font-data">
        {metric?.value}
      </p>
      {metric?.subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{metric?.subtitle}</p>
      )}
    </div>
  );
};

export default PlatformMetricsCard;