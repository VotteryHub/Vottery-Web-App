import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import { votesService } from '../../../services/votesService';

const COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-destructive)',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#10B981'
];

const LiveResultsChart = ({ electionId, options, votingType, voteVisibility, hasUserVoted }) => {
  const [voteData, setVoteData] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVoteData();
    
    const subscription = votesService?.subscribeToVotes(electionId, () => {
      loadVoteData();
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [electionId]);

  const loadVoteData = async () => {
    try {
      const { data, error } = await votesService?.getElectionVotes(electionId);
      if (error) throw error;

      const voteCounts = {};
      let total = 0;

      if (votingType === 'Plurality') {
        data?.forEach(vote => {
          if (vote?.selectedOptionId) {
            voteCounts[vote?.selectedOptionId] = (voteCounts?.[vote?.selectedOptionId] || 0) + 1;
            total++;
          }
        });
      } else if (votingType === 'Approval') {
        data?.forEach(vote => {
          vote?.selectedOptions?.forEach(optionId => {
            voteCounts[optionId] = (voteCounts?.[optionId] || 0) + 1;
            total++;
          });
        });
      } else if (votingType === 'Ranked Choice') {
        data?.forEach(vote => {
          if (vote?.rankedChoices?.[0]) {
            voteCounts[vote?.rankedChoices[0]] = (voteCounts?.[vote?.rankedChoices?.[0]] || 0) + 1;
            total++;
          }
        });
      }

      const chartData = options?.map(option => ({
        id: option?.id,
        name: option?.title,
        value: voteCounts?.[option?.id] || 0,
        percentage: total > 0 ? ((voteCounts?.[option?.id] || 0) / total * 100)?.toFixed(1) : 0
      }));

      setVoteData(chartData);
      setTotalVotes(total);
    } catch (err) {
      console.error('Error loading vote data:', err);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowResults = () => {
    if (voteVisibility === 'hidden') return false;
    if (voteVisibility === 'visible') return true;
    if (voteVisibility === 'visible_after_vote') return hasUserVoted;
    return true;
  };

  if (!shouldShowResults()) {
    return (
      <div className="card p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Icon name="EyeOff" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-2">
              Results Hidden
            </h3>
            <p className="text-sm text-muted-foreground">
              {voteVisibility === 'visible_after_vote' ?'Vote to see live results' :'Results will be revealed after voting closes'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (totalVotes === 0) {
    return (
      <div className="card p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Icon name="BarChart3" size={32} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-2">
              No Votes Yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Be the first to cast your vote!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-democratic-lg">
          <p className="font-heading font-semibold text-foreground mb-1">
            {payload?.[0]?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {payload?.[0]?.value} votes ({payload?.[0]?.payload?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
          <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
          Live Results
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={voteData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {voteData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-sm font-medium text-muted-foreground">Total Votes</span>
          <span className="text-lg font-data font-bold text-foreground">{totalVotes}</span>
        </div>

        {voteData?.map((item, index) => (
          <div key={item?.id} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground truncate">
                  {item?.name}
                </span>
                <span className="text-sm font-data font-semibold text-foreground ml-2">
                  {item?.percentage}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${item?.percentage}%`,
                    backgroundColor: COLORS?.[index % COLORS?.length]
                  }}
                />
              </div>
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {item?.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveResultsChart;