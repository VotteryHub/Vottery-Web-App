import React from 'react';
import Icon from '../../../components/AppIcon';

const VoteEventStreamPanel = ({ voteEvents }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Icon name="Activity" className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Vote Event Stream</h2>
            <p className="text-sm text-muted-foreground">Live vote data flow with 2.0x weight multiplier</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Streaming</span>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-background border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Total Events</div>
          <div className="text-xl font-bold text-foreground">{voteEvents?.length}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Sponsored</div>
          <div className="text-xl font-bold text-warning">
            {voteEvents?.filter(e => e?.isSponsored)?.length}
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">2.0x Weight</div>
          <div className="text-xl font-bold text-primary">
            {voteEvents?.filter(e => e?.weightMultiplier === 2.0)?.length}
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {voteEvents?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Activity" className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No vote events in the last 60 seconds</p>
          </div>
        ) : (
          voteEvents?.map((event) => (
            <div
              key={event?.id}
              className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="Vote" className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground font-mono">
                    {event?.id?.substring(0, 20)}...
                  </span>
                  {event?.isSponsored && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                      Sponsored
                    </span>
                  )}
                  {event?.weightMultiplier === 2.0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      2.0x Weight
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {event?.timestamp?.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Election: {event?.electionId?.substring(0, 15)}...</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  event?.syncStatus === 'synced' ? 'bg-success/10 text-success' :
                  event?.syncStatus === 'pending'? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                }`}>
                  {event?.syncStatus}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoteEventStreamPanel;