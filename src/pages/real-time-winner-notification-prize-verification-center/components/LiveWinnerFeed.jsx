import React from 'react';
import Icon from '../../../components/AppIcon';

export default function LiveWinnerFeed({ winners, campaign, loading }) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading live winner feed...</p>
      </div>
    );
  }

  if (!winners || winners?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="Trophy" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Winners Yet
        </h3>
        <p className="text-muted-foreground">
          Winners will appear here as they are selected in real-time
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Campaign Info */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{campaign?.campaign_name}</h2>
            <p className="text-purple-100">Prize Pool: ${campaign?.prize_pool_amount?.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{winners?.length}</div>
            <div className="text-sm text-purple-100">Total Winners</div>
          </div>
        </div>
      </div>

      {/* Winner Feed */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Radio" size={20} className="text-green-500 animate-pulse" />
            Live Winner Announcements
          </h3>
        </div>
        <div className="divide-y divide-border">
          {winners?.map((winner, index) => (
            <div
              key={winner?.id}
              className="p-4 hover:bg-muted/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Icon name="Trophy" size={24} className="text-white" />
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{winner?.user?.name || winner?.user?.username}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Verified
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Won {winner?.prizeTier} • ${parseFloat(winner?.prizeAmount)?.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(winner?.winnerSelectedAt)?.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    ${parseFloat(winner?.prizeAmount)?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                    <Icon name="CheckCircle" size={14} />
                    <span>Blockchain Verified</span>
                  </div>
                </div>
              </div>
              {winner?.blockchainProof && (
                <div className="mt-3 p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
                  Proof: {winner?.blockchainProof?.substring(0, 40)}...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}