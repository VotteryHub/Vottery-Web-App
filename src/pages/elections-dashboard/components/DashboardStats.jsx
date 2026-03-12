import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="card p-4 md:p-6 hover:shadow-democratic-md transition-all duration-250"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} color={stat?.iconColor} />
            </div>
            {stat?.trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                stat?.trendDirection === 'up' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                <Icon name={stat?.trendDirection === 'up' ? 'TrendingUp' : 'TrendingDown'} size={12} />
                <span>{stat?.trend}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1 font-data">
              {stat?.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat?.label}</p>
            {stat?.description && (
              <p className="text-xs text-muted-foreground mt-2">{stat?.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;