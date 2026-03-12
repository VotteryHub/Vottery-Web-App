import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { realtimeWinnerNotificationService } from '../../../services/realtimeWinnerNotificationService';

export default function PrizeTrackingPanel({ campaign }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campaign) {
      loadTracking();
    }
  }, [campaign]);

  const loadTracking = async () => {
    try {
      setLoading(true);
      const result = await realtimeWinnerNotificationService?.getLivePrizeTracking(campaign?.id);
      if (result?.data) {
        setTracking(result?.data);
      }
    } catch (error) {
      console.error('Failed to load tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading prize tracking...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tracking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Trophy" size={20} className="text-yellow-600" />
            <span className="text-sm text-muted-foreground">Total Winners</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{tracking?.totalWinners || 0}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="DollarSign" size={20} className="text-green-600" />
            <span className="text-sm text-muted-foreground">Total Prize Amount</span>
          </div>
          <div className="text-2xl font-bold text-foreground">${tracking?.totalPrizeAmount?.toLocaleString()}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Clock" size={20} className="text-blue-600" />
            <span className="text-sm text-muted-foreground">Processing</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{tracking?.processingPayouts || 0}</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-600" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{tracking?.completedPayouts || 0}</div>
        </div>
      </div>

      {/* Payout Queue */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Prize Distribution Queue</h3>
        </div>
        <div className="divide-y divide-border">
          {tracking?.winners?.map(winner => {
            const statusColor = getStatusColor(winner?.payoutStatus);
            return (
              <div key={winner?.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full bg-${statusColor}-500`} />
                    <div>
                      <p className="font-medium text-foreground">{winner?.user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${parseFloat(winner?.prizeAmount)?.toLocaleString()} • {winner?.prizeTier}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 dark:bg-${statusColor}-900/30 text-${statusColor}-700 dark:text-${statusColor}-300`}>
                      {winner?.payoutStatus?.toUpperCase()}
                    </span>
                    {winner?.payoutMethod && (
                      <p className="text-xs text-muted-foreground mt-1">
                        via {winner?.payoutMethod}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}