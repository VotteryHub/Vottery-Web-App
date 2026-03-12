import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import AchievementBadge from './AchievementBadge';
import Select from '../../../components/ui/Select';

const AchievementsGrid = ({ achievements }) => {
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const rarityOptions = [
    { value: 'all', label: 'All Rarities' },
    { value: 'common', label: 'Common' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Achievements' },
    { value: 'unlocked', label: 'Unlocked' },
    { value: 'locked', label: 'Locked' },
  ];

  const filteredAchievements = achievements?.filter((achievement) => {
    const rarityMatch = filterRarity === 'all' || achievement?.rarity === filterRarity;
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'unlocked' && achievement?.unlocked) ||
      (filterStatus === 'locked' && !achievement?.unlocked);
    return rarityMatch && statusMatch;
  });

  const stats = {
    total: achievements?.length,
    unlocked: achievements?.filter((a) => a?.unlocked)?.length,
    legendary: achievements?.filter((a) => a?.rarity === 'legendary' && a?.unlocked)?.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
            Achievements
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Trophy" size={16} />
              {stats?.unlocked}/{stats?.total} Unlocked
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Star" size={16} />
              {stats?.legendary} Legendary
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            options={rarityOptions}
            value={filterRarity}
            onChange={setFilterRarity}
            className="w-full sm:w-40"
          />
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-full sm:w-40"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
        {filteredAchievements?.map((achievement) => (
          <div key={achievement?.id} className="flex flex-col items-center gap-2">
            <AchievementBadge achievement={achievement} size="default" />
            <p className="text-xs text-center text-foreground font-medium line-clamp-2">
              {achievement?.name}
            </p>
          </div>
        ))}
      </div>
      {filteredAchievements?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Trophy" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No achievements match your filters</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsGrid;