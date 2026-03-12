import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ selectedFilter, onSelectFilter }) => {
  const filters = [
    { id: 'all', label: 'All Elections', icon: 'Grid' },
    { id: 'active', label: 'Active Now', icon: 'Activity' },
    { id: 'lotterized', label: 'Lotterized', icon: 'Trophy' },
    { id: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { id: 'free', label: 'Free Entry', icon: 'DollarSign' },
    { id: 'high-prize', label: 'High Prize Pool', icon: 'Award' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'verified-creators', label: 'Verified Creators', icon: 'BadgeCheck' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filters?.map((filter) => {
        const isSelected = selectedFilter === filter?.id;
        return (
          <button
            key={filter?.id}
            onClick={() => onSelectFilter(filter?.id)}
            className={`px-4 py-2 rounded-lg border transition-all duration-250 whitespace-nowrap flex items-center gap-2 ${
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
            }`}
          >
            <Icon name={filter?.icon} size={16} />
            <span className="text-sm font-medium">{filter?.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterPanel;