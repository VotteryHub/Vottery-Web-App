import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const WatchTimeAnalyticsPanel = ({ timeRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = {
        totalWatchTime: 234567,
        avgWatchTime: 765,
        videoCompletionRate: 67.8,
        engagementDuration: 503,
        contentPerformance: [
          { type: 'Campaign Videos', watchTime: 89234, completionRate: 72.5, avgDuration: 845 },
          { type: 'Election Highlights', watchTime: 67890, completionRate: 68.3, avgDuration: 623 },
          { type: 'Candidate Profiles', watchTime: 45678, completionRate: 65.7, avgDuration: 512 },
          { type: 'Results Coverage', watchTime: 31765, completionRate: 78.9, avgDuration: 934 }
        ],
        engagementByDuration: [
          { duration: '0-30s', views: 12456, dropOff: 25.3 },
          { duration: '30s-1m', views: 9876, dropOff: 18.7 },
          { duration: '1-3m', views: 7654, dropOff: 12.4 },
          { duration: '3-5m', views: 5432, dropOff: 8.9 },
          { duration: '5m+', views: 3210, dropOff: 5.2 }
        ],
        peakEngagementTimes: [
          { time: '9:00 AM', engagement: 78 },
          { time: '12:00 PM', engagement: 92 },
          { time: '3:00 PM', engagement: 85 },
          { time: '6:00 PM', engagement: 95 },
          { time: '9:00 PM', engagement: 88 }
        ]
      };

      setData(mockData);
    } catch (error) {
      console.error('Error loading watch time analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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
      {/* Watch Time Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Clock" size={24} className="text-primary mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {formatDuration(data?.totalWatchTime)}
          </p>
          <p className="text-sm font-medium text-foreground">Total Watch Time</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Timer" size={24} className="text-secondary mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {Math.floor(data?.avgWatchTime / 60)}m {data?.avgWatchTime % 60}s
          </p>
          <p className="text-sm font-medium text-foreground">Avg Watch Time</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="CheckCircle" size={24} className="text-success mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {data?.videoCompletionRate}%
          </p>
          <p className="text-sm font-medium text-foreground">Completion Rate</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Activity" size={24} className="text-warning mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {Math.floor(data?.engagementDuration / 60)}m {data?.engagementDuration % 60}s
          </p>
          <p className="text-sm font-medium text-foreground">Engagement Duration</p>
        </div>
      </div>

      {/* Content Performance */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Content Performance by Type
        </h3>
        <div className="space-y-4">
          {data?.contentPerformance?.map((content, index) => (
            <div key={index} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">{content?.type}</span>
                <span className="text-sm font-medium text-success">
                  {content?.completionRate}% completion
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Watch Time</p>
                  <p className="font-medium text-foreground">
                    {formatDuration(content?.watchTime)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Avg Duration</p>
                  <p className="font-medium text-foreground">
                    {Math.floor(content?.avgDuration / 60)}m {content?.avgDuration % 60}s
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Completion</p>
                  <p className="font-medium text-foreground">{content?.completionRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement by Duration */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Engagement by Video Duration
        </h3>
        <div className="space-y-4">
          {data?.engagementByDuration?.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{item?.duration}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {item?.views?.toLocaleString()} views
                  </span>
                  <span className="text-sm text-destructive">{item?.dropOff}% drop-off</span>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${100 - item?.dropOff}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Engagement Times */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Peak Engagement Times
        </h3>
        <div className="flex items-end justify-between gap-4 h-48">
          {data?.peakEngagementTimes?.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-secondary/20 rounded-t-lg relative" style={{ height: `${item?.engagement}%` }}>
                <div className="absolute inset-0 bg-secondary rounded-t-lg" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground">
                  {item?.engagement}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{item?.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchTimeAnalyticsPanel;