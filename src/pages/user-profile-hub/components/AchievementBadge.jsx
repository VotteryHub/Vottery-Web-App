import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadge = ({ achievement, size = 'default' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 md:w-14 md:h-14',
    default: 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24',
    lg: 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28',
  };

  const iconSizes = {
    sm: 20,
    default: 28,
    lg: 36,
  };

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-amber-600',
  };

  return (
    <div className="group relative">
      <div
        className={`${sizeClasses?.[size]} rounded-full bg-gradient-to-br ${
          rarityColors?.[achievement?.rarity]
        } p-1 shadow-democratic-md transition-all duration-250 group-hover:scale-110 group-hover:shadow-democratic-lg ${
          achievement?.unlocked ? '' : 'opacity-40 grayscale'
        }`}
      >
        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
          <Icon
            name={achievement?.icon}
            size={iconSizes?.[size]}
            className={achievement?.unlocked ? 'text-primary' : 'text-muted-foreground'}
          />
        </div>
      </div>
      {achievement?.unlocked && (
        <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-success rounded-full flex items-center justify-center shadow-democratic-sm">
          <Icon name="Check" size={12} color="white" />
        </div>
      )}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none z-dropdown">
        <div className="bg-popover border border-border rounded-lg shadow-democratic-lg p-3 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-heading font-semibold text-foreground text-sm">
              {achievement?.name}
            </h4>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                achievement?.rarity === 'legendary' ?'bg-amber-500/20 text-amber-500'
                  : achievement?.rarity === 'epic' ?'bg-purple-500/20 text-purple-500'
                  : achievement?.rarity === 'rare' ?'bg-blue-500/20 text-blue-500' :'bg-gray-500/20 text-gray-500'
              }`}
            >
              {achievement?.rarity}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{achievement?.description}</p>
          {achievement?.unlocked ? (
            <p className="text-xs text-success flex items-center gap-1">
              <Icon name="Calendar" size={12} />
              Unlocked {achievement?.unlockedDate}
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Progress:</p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-250"
                  style={{ width: `${achievement?.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {achievement?.progress}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;