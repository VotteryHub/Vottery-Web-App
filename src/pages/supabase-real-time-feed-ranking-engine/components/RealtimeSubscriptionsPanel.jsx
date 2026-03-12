import React from 'react';
import Icon from '../../../components/AppIcon';

const RealtimeSubscriptionsPanel = ({ subscriptionStatus, feedRankings }) => {
  const recentUpdates = feedRankings?.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 dark:text-green-400';
      case 'connecting':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'connecting':
        return 'Loader';
      default:
        return 'XCircle';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
          <Icon name="Radio" size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground">Real-Time Subscriptions</h2>
          <p className="text-sm text-muted-foreground">Live database monitoring with 15s refresh</p>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon
              name={getStatusIcon(subscriptionStatus)}
              size={24}
              className={`${getStatusColor(subscriptionStatus)} ${
                subscriptionStatus === 'connecting' ? 'animate-spin' : ''
              }`}
            />
            <div>
              <div className="font-semibold text-foreground capitalize">{subscriptionStatus}</div>
              <div className="text-xs text-muted-foreground">
                {subscriptionStatus === 'connected' ?'Receiving live updates'
                  : subscriptionStatus === 'connecting' ?'Establishing connection...' :'Connection lost'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{feedRankings?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Active Rankings</div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="Activity" size={16} />
          Recent Updates
        </h3>

        <div className="space-y-2">
          {recentUpdates?.map((ranking, index) => (
            <div
              key={ranking?.id || index}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    name={
                      ranking?.contentItemType === 'election' ?'Vote'
                        : ranking?.contentItemType === 'post' ?'FileText' :'Megaphone'
                    }
                    size={16}
                    className="text-primary"
                  />
                  <span className="text-sm font-medium text-foreground capitalize">
                    {ranking?.contentItemType}
                  </span>
                  <span className="text-xs text-muted-foreground">#{ranking?.rankingPosition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-foreground">
                    {ranking?.rankingScore?.toFixed(3)}
                  </div>
                  <Icon name="TrendingUp" size={14} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentUpdates?.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Icon name="Clock" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for ranking updates...</p>
          </div>
        )}
      </div>

      {/* Subscription Info */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} />
          <span>
            Subscriptions automatically update when rankings change in the database
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeSubscriptionsPanel;