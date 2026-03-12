import React from 'react';
import Icon from '../../../components/AppIcon';

const RankingOverviewPanel = ({ rankingConfig, feedRankings, userPreferences }) => {
  const totalRankings = feedRankings?.length || 0;
  const avgScore = feedRankings?.length > 0
    ? (feedRankings?.reduce((sum, r) => sum + (r?.rankingScore || 0), 0) / feedRankings?.length)?.toFixed(3)
    : '0.000';

  const contentBreakdown = feedRankings?.reduce(
    (acc, r) => {
      acc[r?.contentItemType] = (acc?.[r?.contentItemType] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="BarChart3" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground">Ranking Overview</h2>
          <p className="text-sm text-muted-foreground">Current feed composition and scores</p>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-1">{totalRankings}</div>
          <div className="text-sm text-muted-foreground">Total Items Ranked</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-1">{avgScore}</div>
          <div className="text-sm text-muted-foreground">Avg Ranking Score</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-1">{userPreferences?.length || 0}</div>
          <div className="text-sm text-muted-foreground">User Preferences</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-foreground mb-1">
            {rankingConfig?.algorithmType || 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">Algorithm Type</div>
        </div>
      </div>
      {/* Content Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Content Distribution</h3>
        <div className="space-y-2">
          {Object.entries(contentBreakdown || {})?.map(([type, count]) => {
            const percentage = totalRankings > 0 ? ((count / totalRankings) * 100)?.toFixed(1) : 0;
            const iconMap = { election: 'Vote', post: 'FileText', ad: 'Megaphone' };
            const colorMap = {
              election: 'bg-blue-500',
              post: 'bg-green-500',
              ad: 'bg-orange-500'
            };

            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon name={iconMap?.[type] || 'Circle'} size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground capitalize">{type}s</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full ${colorMap?.[type]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {totalRankings === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No rankings generated yet. Use the controls below to generate feed rankings.</p>
        </div>
      )}
    </div>
  );
};

export default RankingOverviewPanel;