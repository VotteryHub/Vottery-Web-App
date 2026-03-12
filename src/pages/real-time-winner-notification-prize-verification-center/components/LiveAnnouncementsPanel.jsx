import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';

const LiveAnnouncementsPanel = ({ winners, onRefresh }) => {
  const [liveAnnouncements, setLiveAnnouncements] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (winners) {
      const announcements = winners?.map(winner => ({
        id: winner?.id,
        userId: winner?.userId,
        userName: winner?.userName || 'Anonymous Winner',
        electionTitle: winner?.electionTitle,
        prizeAmount: winner?.prizeAmount,
        rank: winner?.rank,
        timestamp: winner?.createdAt || new Date()?.toISOString(),
        status: 'live'
      }));
      setLiveAnnouncements(announcements);
    }

    const subscription = supabase
      ?.channel('winner_announcements')
      ?.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'prize_distributions'
      }, (payload) => {
        if (autoRefresh) {
          onRefresh?.();
        }
      })
      ?.subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, [winners, autoRefresh]);

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Radio" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">Live Winner Announcements</h2>
              <p className="text-sm text-muted-foreground">Real-time winner notifications streaming live</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
              />
              <span className="text-sm text-foreground">Auto-refresh</span>
            </label>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-600">LIVE</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {liveAnnouncements?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Trophy" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No live announcements at the moment</p>
              <p className="text-sm text-muted-foreground mt-2">Winners will appear here in real-time</p>
            </div>
          ) : (
            liveAnnouncements?.map((announcement) => (
              <div
                key={announcement?.id}
                className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-all duration-250 animate-fade-in"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon name="Trophy" size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-heading font-bold text-foreground">
                          🎉 {announcement?.userName}
                        </h3>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          Rank #{announcement?.rank}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Won in <span className="font-medium text-foreground">{announcement?.electionTitle}</span>
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Icon name="DollarSign" size={16} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">{announcement?.prizeAmount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={16} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(announcement?.timestamp)?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ExternalLink"
                    onClick={() => window.open(`/enhanced-election-results-center?election=${announcement?.electionId}`, '_blank')}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Users" size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Winners Today</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{liveAnnouncements?.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="DollarSign" size={20} className="text-green-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Prizes Distributed</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${liveAnnouncements?.reduce((sum, a) => sum + parseFloat(a?.prizeAmount?.replace(/[^0-9.]/g, '') || 0), 0)?.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-blue-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Avg Prize Amount</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ${liveAnnouncements?.length > 0 ? (liveAnnouncements?.reduce((sum, a) => sum + parseFloat(a?.prizeAmount?.replace(/[^0-9.]/g, '') || 0), 0) / liveAnnouncements?.length)?.toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveAnnouncementsPanel;