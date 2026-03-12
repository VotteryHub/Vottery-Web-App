import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const ParticipationAnalyticsPanel = ({ timeRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = {
        voteFunnel: [
          { stage: 'Election Viewed', users: 45892, dropOff: 0, percentage: 100 },
          { stage: 'Started Voting', users: 38456, dropOff: 7436, percentage: 83.8 },
          { stage: 'Completed Questions', users: 34567, dropOff: 3889, percentage: 75.3 },
          { stage: 'Submitted Vote', users: 32456, dropOff: 2111, percentage: 70.7 },
          { stage: 'Verified Vote', users: 31234, dropOff: 1222, percentage: 68.1 }
        ],
        participationByCategory: [
          { category: 'Politics', participation: 85.3, votes: 12456 },
          { category: 'Technology', participation: 78.9, votes: 9876 },
          { category: 'Sports', participation: 92.1, votes: 15678 },
          { category: 'Entertainment', participation: 76.5, votes: 8765 },
          { category: 'Business', participation: 68.2, votes: 6543 }
        ],
        participationTrends: [
          { date: 'Week 1', rate: 72.5 },
          { date: 'Week 2', rate: 75.8 },
          { date: 'Week 3', rate: 78.3 },
          { date: 'Week 4', rate: 82.7 }
        ],
        dropOffPoints: [
          { point: 'MCQ Quiz', dropOff: 16.2, reason: 'Difficulty' },
          { point: 'Candidate Selection', dropOff: 8.5, reason: 'Too many options' },
          { point: 'Verification', dropOff: 3.8, reason: 'Technical issues' }
        ]
      };

      setData(mockData);
    } catch (error) {
      console.error('Error loading participation analytics:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Vote Funnel */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Vote Funnel Analysis
        </h3>
        <div className="space-y-4">
          {data?.voteFunnel?.map((stage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{stage?.stage}</span>
                  {stage?.dropOff > 0 && (
                    <span className="text-xs text-destructive">
                      -{stage?.dropOff?.toLocaleString()} users
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {stage?.users?.toLocaleString()} users
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {stage?.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${stage?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participation by Category */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Participation by Category
        </h3>
        <div className="space-y-4">
          {data?.participationByCategory?.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{category?.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {category?.votes?.toLocaleString()} votes
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${category?.participation}%` }}
                  />
                </div>
              </div>
              <span className="ml-4 text-sm font-medium text-primary">
                {category?.participation}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop-off Points */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Critical Drop-off Points
        </h3>
        <div className="space-y-3">
          {data?.dropOffPoints?.map((point, index) => (
            <div key={index} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{point?.point}</span>
                <span className="text-sm font-medium text-destructive">{point?.dropOff}% drop-off</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Primary reason: {point?.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipationAnalyticsPanel;