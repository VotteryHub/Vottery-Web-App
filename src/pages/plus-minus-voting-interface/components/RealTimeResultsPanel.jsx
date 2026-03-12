import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import { plusMinusVotingService } from '../../../services/plusMinusVotingService';

const RealTimeResultsPanel = ({ electionId, analytics }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRankings = async () => {
    try {
      const { data, error } = await plusMinusVotingService?.calculateRankings(electionId);
      if (error) throw new Error(error?.message);
      setRankings(data);
    } catch (err) {
      console.error('Load rankings error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRankings();
    const interval = setInterval(loadRankings, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [electionId]);

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-orange-600 text-white';
    return 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Real-Time Rankings</h3>
            <p className="text-sm text-muted-foreground">
              Live rankings based on weighted average scores. Updates automatically every 5 seconds. 
              Rankings consider net score (positive - negative) and approval rating.
            </p>
          </div>
        </div>
      </div>
      {/* Rankings List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/50 border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Current Rankings</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="RefreshCw" size={16} className="animate-spin" />
              <span>Live Updates</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {rankings?.map((option) => (
            <div key={option?.optionId} className="p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${getRankBadgeColor(option?.rank)}`}>
                  #{option?.rank}
                </div>

                {/* Option Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-bold text-foreground text-lg mb-2">
                    {option?.electionOptions?.title}
                  </h4>
                  
                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground mb-1">Weighted Score</p>
                      <p className="text-lg font-bold text-foreground">{option?.weightedScore?.toFixed(2)}</p>
                    </div>
                    <div className="bg-success/10 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground mb-1">Positive (+1)</p>
                      <p className="text-lg font-bold text-success">{option?.positiveVotes}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground mb-1">Neutral (0)</p>
                      <p className="text-lg font-bold text-muted-foreground">{option?.neutralVotes}</p>
                    </div>
                    <div className="bg-destructive/10 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground mb-1">Negative (-1)</p>
                      <p className="text-lg font-bold text-destructive">{option?.negativeVotes}</p>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={16} className="text-primary" />
                      <span className="text-muted-foreground">Net Score:</span>
                      <span className={`font-bold ${
                        option?.netScore > 0 ? 'text-success' : 
                        option?.netScore < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {option?.netScore > 0 ? '+' : ''}{option?.netScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Percent" size={16} className="text-primary" />
                      <span className="text-muted-foreground">Approval:</span>
                      <span className="font-bold text-foreground">{option?.approvalRating}%</span>
                    </div>
                  </div>
                </div>

                {/* Rank Change Indicator */}
                {option?.rank <= 3 && (
                  <div className="flex-shrink-0">
                    <Icon 
                      name={option?.rank === 1 ? 'Trophy' : 'Award'} 
                      size={32} 
                      className={option?.rank === 1 ? 'text-yellow-500' : 'text-gray-400'}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Score Distribution Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Score Distribution</h3>
        <div className="space-y-4">
          {rankings?.slice(0, 5)?.map((option) => {
            const totalVotes = option?.positiveVotes + option?.neutralVotes + option?.negativeVotes;
            const positivePercent = totalVotes > 0 ? (option?.positiveVotes / totalVotes * 100) : 0;
            const neutralPercent = totalVotes > 0 ? (option?.neutralVotes / totalVotes * 100) : 0;
            const negativePercent = totalVotes > 0 ? (option?.negativeVotes / totalVotes * 100) : 0;

            return (
              <div key={option?.optionId}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{option?.electionOptions?.title}</span>
                  <span className="text-xs text-muted-foreground">{totalVotes} votes</span>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div 
                    className="bg-success flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${positivePercent}%` }}
                  >
                    {positivePercent > 10 && `${positivePercent?.toFixed(0)}%`}
                  </div>
                  <div 
                    className="bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
                    style={{ width: `${neutralPercent}%` }}
                  >
                    {neutralPercent > 10 && `${neutralPercent?.toFixed(0)}%`}
                  </div>
                  <div 
                    className="bg-destructive flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${negativePercent}%` }}
                  >
                    {negativePercent > 10 && `${negativePercent?.toFixed(0)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealTimeResultsPanel;