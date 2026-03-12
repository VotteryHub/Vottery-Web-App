import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { winnerNotificationService } from '../../../services/winnerNotificationService';

const PrizeConfirmationPanel = ({ distributions, onRefresh }) => {
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleUpdateStatus = async (distributionId, newStatus) => {
    try {
      setUpdating(distributionId);
      await winnerNotificationService?.updatePrizeStatus(distributionId, newStatus);
      await onRefresh?.();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'claimed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'delivered': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'confirmed': return 'CheckCircle';
      case 'claimed': return 'Gift';
      case 'delivered': return 'Package';
      default: return 'Circle';
    }
  };

  const filteredDistributions = filter === 'all'
    ? distributions
    : distributions?.filter(d => d?.status === filter);

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Gift" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">Prize Confirmations</h2>
              <p className="text-sm text-muted-foreground">Track and manage prize distribution status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="claimed">Claimed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredDistributions?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No prize distributions found</p>
            </div>
          ) : (
            filteredDistributions?.map((distribution) => (
              <div
                key={distribution?.id}
                className="bg-background border border-border rounded-lg p-4 hover:border-primary/40 transition-all duration-250"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-muted rounded-lg">
                      <Icon name={getStatusIcon(distribution?.status)} size={24} className="text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-heading font-bold text-foreground">
                          {distribution?.winner?.name || 'Winner'}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(distribution?.status)}`}>
                          {distribution?.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Prize Amount</p>
                          <p className="text-sm font-medium text-foreground">{distribution?.prizeAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Rank</p>
                          <p className="text-sm font-medium text-foreground">#{distribution?.rank}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Election</p>
                          <p className="text-sm font-medium text-foreground">{distribution?.electionTitle}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Lottery Ticket</p>
                          <p className="text-sm font-medium text-foreground">{distribution?.lotteryTicketId}</p>
                        </div>
                      </div>
                      {distribution?.claimDate && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Calendar" size={14} />
                          <span>Claimed: {new Date(distribution?.claimDate)?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {distribution?.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="CheckCircle"
                        onClick={() => handleUpdateStatus(distribution?.id, 'confirmed')}
                        disabled={updating === distribution?.id}
                      >
                        Confirm
                      </Button>
                    )}
                    {distribution?.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Gift"
                        onClick={() => handleUpdateStatus(distribution?.id, 'claimed')}
                        disabled={updating === distribution?.id}
                      >
                        Mark Claimed
                      </Button>
                    )}
                    {distribution?.status === 'claimed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Package"
                        onClick={() => handleUpdateStatus(distribution?.id, 'delivered')}
                        disabled={updating === distribution?.id}
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'confirmed', 'claimed', 'delivered']?.map((status) => (
          <div key={status} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon name={getStatusIcon(status)} size={20} className="text-primary" />
              <h3 className="text-sm font-medium text-muted-foreground capitalize">{status}</h3>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {distributions?.filter(d => d?.status === status)?.length || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrizeConfirmationPanel;