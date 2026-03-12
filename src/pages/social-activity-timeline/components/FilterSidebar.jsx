import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const activityTypeOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'vote', label: 'Votes' },
    { value: 'election_created', label: 'New Elections' },
    { value: 'election_completed', label: 'Completed Elections' },
    { value: 'achievement_unlocked', label: 'Achievements' },
    { value: 'friend_request_accepted', label: 'Friend Requests' },
    { value: 'post_liked', label: 'Post Likes' },
    { value: 'post_commented', label: 'Post Comments' },
    { value: 'post_shared', label: 'Post Shares' },
    { value: 'new_follower', label: 'New Followers' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const readStatusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' }
  ];

  const handleActivityTypeChange = (value) => {
    onFilterChange({ ...filters, activityType: value });
  };

  const handleTimeRangeChange = (value) => {
    onFilterChange({ ...filters, timeRange: value });
  };

  const handleReadStatusChange = (value) => {
    const isRead = value === 'all' ? undefined : value === 'read';
    onFilterChange({ ...filters, isRead });
  };

  const handleClearFilters = () => {
    onFilterChange({
      activityType: 'all',
      timeRange: 'all',
      isRead: undefined
    });
  };

  const hasActiveFilters =
    filters?.activityType !== 'all' ||
    filters?.timeRange !== 'all' ||
    filters?.isRead !== undefined;

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="card p-6 sticky top-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Icon name="Filter" size={20} />
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Activity Type Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Activity Type
            </label>
            <Select
              options={activityTypeOptions}
              value={filters?.activityType || 'all'}
              onChange={handleActivityTypeChange}
              className="w-full"
            />
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Time Range
            </label>
            <Select
              options={timeRangeOptions}
              value={filters?.timeRange || 'all'}
              onChange={handleTimeRangeChange}
              className="w-full"
            />
          </div>

          {/* Read Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Read Status
            </label>
            <Select
              options={readStatusOptions}
              value={
                filters?.isRead === undefined
                  ? 'all'
                  : filters?.isRead
                  ? 'read' :'unread'
              }
              onChange={handleReadStatusChange}
              className="w-full"
            />
          </div>

          {/* Activity Type Legend */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Activity Types</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Votes & Comments</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>New Elections</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Completed & Shares</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Achievements</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Post Likes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span>New Followers</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => onFilterChange({ ...filters, isRead: false })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon name="Bell" size={16} className="text-primary" />
                <span>Show Unread</span>
              </button>
              <button
                onClick={() => onFilterChange({ ...filters, timeRange: 'today' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon name="Calendar" size={16} className="text-primary" />
                <span>Today's Activity</span>
              </button>
              <button
                onClick={() => onFilterChange({ ...filters, activityType: 'achievement_unlocked' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Icon name="Trophy" size={16} className="text-primary" />
                <span>Achievements</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;