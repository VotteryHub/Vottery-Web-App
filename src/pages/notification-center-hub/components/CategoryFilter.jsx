import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categoryCounts, activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'All', icon: 'Bell', count: categoryCounts?.total || 0 },
    { id: 'votes', label: 'Votes', icon: 'Vote', count: categoryCounts?.votes || 0 },
    { id: 'messages', label: 'Messages', icon: 'MessageCircle', count: categoryCounts?.messages || 0 },
    { id: 'achievements', label: 'Achievements', icon: 'Award', count: categoryCounts?.achievements || 0 },
    { id: 'elections', label: 'Elections', icon: 'CheckCircle', count: categoryCounts?.elections || 0 },
    { id: 'campaigns', label: 'Campaigns', icon: 'Megaphone', count: categoryCounts?.campaigns || 0 },
    { id: 'payments', label: 'Payments', icon: 'CreditCard', count: categoryCounts?.payments || 0 }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategoryChange(category?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              activeCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={category?.icon} size={18} />
            <span>{category?.label}</span>
            {category?.count > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeCategory === category?.id
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-red-500 text-white'
                }`}
              >
                {category?.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
