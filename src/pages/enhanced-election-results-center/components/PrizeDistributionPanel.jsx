import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const PrizeDistributionPanel = ({ election }) => {
  const [distributions, setDistributions] = useState([]);

  useEffect(() => {
    if (election?.winnerNotifications) {
      const mockDistributions = election?.winnerNotifications?.map((winner, index) => ({
        id: `dist-${index}`,
        rank: winner?.rank,
        userName: winner?.userName,
        userAvatar: winner?.userAvatar,
        lotteryTicketId: winner?.lotteryTicketId,
        prizeAmount: election?.prizePool ? `$${(parseFloat(election?.prizePool?.replace(/[^0-9.]/g, '')) / election?.numberOfWinners)?.toFixed(2)}` : 'TBD',
        status: index < 2 ? 'delivered' : index < 4 ? 'claimed' : 'pending',
        claimDate: index < 4 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)?.toLocaleDateString() : null,
        deliveryDate: index < 2 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)?.toLocaleDateString() : null
      }));
      setDistributions(mockDistributions);
    }
  }, [election]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-success/10 text-success';
      case 'claimed':
        return 'bg-primary/10 text-primary';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'disputed':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return 'CheckCircle';
      case 'claimed':
        return 'Package';
      case 'pending':
        return 'Clock';
      case 'disputed':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  const totalPrizePool = election?.prizePool ? parseFloat(election?.prizePool?.replace(/[^0-9.]/g, '')) : 0;
  const deliveredCount = distributions?.filter(d => d?.status === 'delivered')?.length;
  const claimedCount = distributions?.filter(d => d?.status === 'claimed')?.length;
  const pendingCount = distributions?.filter(d => d?.status === 'pending')?.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Prize Pool</p>
              <p className="text-lg font-data font-bold text-foreground">${totalPrizePool?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivered</p>
              <p className="text-lg font-data font-bold text-foreground">{deliveredCount}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Claimed</p>
              <p className="text-lg font-data font-bold text-foreground">{claimedCount}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-data font-bold text-foreground">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
          <Icon name="Package" size={28} className="text-primary" />
          Prize Distribution Tracking
        </h2>

        <div className="space-y-3">
          {distributions?.map((dist) => (
            <div key={dist?.id} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-all duration-250">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">#{dist?.rank}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-base font-semibold text-foreground">{dist?.userName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dist?.status)}`}>
                      <Icon name={getStatusIcon(dist?.status)} size={12} className="inline mr-1" />
                      {dist?.status?.charAt(0)?.toUpperCase() + dist?.status?.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Ticket: {dist?.lotteryTicketId}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Prize Amount</p>
                      <p className="text-sm font-data font-semibold text-accent">{dist?.prizeAmount}</p>
                    </div>
                    {dist?.claimDate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Claim Date</p>
                        <p className="text-sm font-medium text-foreground">{dist?.claimDate}</p>
                      </div>
                    )}
                    {dist?.deliveryDate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery Date</p>
                        <p className="text-sm font-medium text-foreground">{dist?.deliveryDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {dist?.status === 'delivered' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                      <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-warning/10 border-warning/20">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={24} color="var(--color-warning)" />
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-2">
              Creator Responsibility
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Election creators are responsible for delivering prizes to winners. Failure to deliver prizes may result in reputation penalties, blacklisting, and platform bans.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Shield" size={14} />
              <span>All transactions are monitored for compliance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeDistributionPanel;