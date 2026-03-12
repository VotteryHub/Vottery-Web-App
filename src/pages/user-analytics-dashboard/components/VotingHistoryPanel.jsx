import React from 'react';
import Icon from '../../../components/AppIcon';
import { format } from 'date-fns';

const VotingHistoryPanel = ({ votingHistory, timeRange }) => {
  const recentVotes = votingHistory?.slice(0, 10) || [];

  // Calculate category distribution
  const categoryMap = {};
  votingHistory?.forEach(vote => {
    const category = vote?.elections?.category || 'Other';
    categoryMap[category] = (categoryMap?.[category] || 0) + 1;
  });

  const categories = Object.entries(categoryMap)
    ?.map(([category, count]) => ({ category, count }))
    ?.sort((a, b) => b?.count - a?.count)
    ?.slice(0, 5);

  const maxCount = Math.max(...categories?.map(c => c?.count), 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Voting History</h2>
        <Icon name="History" size={20} className="text-primary" />
      </div>

      <div className="space-y-6">
        {/* Category Distribution */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {categories?.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{category?.category}</span>
                  <span className="text-sm text-muted-foreground">{category?.count} votes</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(category?.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Votes */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Recent Votes</h3>
          {recentVotes?.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentVotes?.map((vote) => (
                <div
                  key={vote?.voteId}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Vote" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {vote?.elections?.title || 'Election'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {vote?.elections?.votingType || 'Plurality'}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        Zone {vote?.elections?.zone || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {vote?.createdAt ? format(new Date(vote?.createdAt), 'MMM dd, yyyy HH:mm') : 'Recent'}
                    </p>
                  </div>
                  {vote?.blockchainHash && (
                    <Icon name="CheckCircle" size={18} className="text-success flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Inbox" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No voting history in this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingHistoryPanel;