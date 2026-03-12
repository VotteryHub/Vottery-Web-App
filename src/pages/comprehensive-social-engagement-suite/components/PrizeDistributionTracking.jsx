import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { winnerNotificationService } from '../../../services/winnerNotificationService';
import { profileService } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';

const PrizeDistributionTracking = ({ election }) => {
  const { user } = useAuth();
  const [distributions, setDistributions] = useState([]);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isCreator = user?.id === election?.createdBy;

  useEffect(() => {
    loadDistributions();
    loadCreatorProfile();
  }, [election?.id]);

  const loadDistributions = async () => {
    try {
      const { data, error } = await winnerNotificationService?.getPrizeDistributions(election?.id);
      if (error) throw error;
      setDistributions(data || []);
    } catch (err) {
      console.error('Failed to load distributions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCreatorProfile = async () => {
    try {
      const { data } = await profileService?.getProfile(election?.createdBy);
      setCreatorProfile(data);
    } catch (err) {
      console.error('Failed to load creator profile:', err);
    }
  };

  const handleStatusUpdate = async (distributionId, newStatus) => {
    try {
      const { error } = await winnerNotificationService?.updatePrizeStatus(distributionId, newStatus);
      if (error) throw error;
      loadDistributions();
      loadCreatorProfile();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'claimed': return 'bg-primary/10 text-primary';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'disputed': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getReputationColor = (score) => {
    if (score >= 100) return 'text-success';
    if (score >= 50) return 'text-primary';
    if (score >= 0) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Gift" size={28} className="text-primary" />
          Prize Distribution Tracking
        </h2>

        {creatorProfile?.isBlacklisted && (
          <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={24} className="text-destructive mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-destructive mb-2">
                  🚩 Creator Blacklisted
                </h4>
                <p className="text-sm text-destructive mb-2">
                  This creator has been blacklisted due to: {creatorProfile?.blacklistReason}
                </p>
                <p className="text-xs text-muted-foreground">
                  Blacklisted on: {new Date(creatorProfile?.blacklistedAt)?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Award" size={20} color="var(--color-accent)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Creator Reputation</p>
                <p className={`text-xl font-data font-bold ${getReputationColor(creatorProfile?.reputationScore || 0)}`}>
                  {creatorProfile?.reputationScore || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={20} color="var(--color-success)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prizes Delivered</p>
                <p className="text-xl font-data font-bold text-success">
                  {creatorProfile?.prizesDelivered || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Icon name="XCircle" size={20} color="var(--color-destructive)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Failed Deliveries</p>
                <p className="text-xl font-data font-bold text-destructive">
                  {creatorProfile?.prizesFailed || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Package" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Winners</p>
                <p className="text-xl font-data font-bold text-foreground">
                  {distributions?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" size={32} className="animate-spin text-primary" />
          </div>
        ) : distributions?.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <Icon name="Package" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No prize distributions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {distributions?.map((dist) => (
              <div key={dist?.id} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-accent">#{dist?.rank}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-semibold text-foreground">{dist?.winner?.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dist?.status)}`}>
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
                          <p className="text-sm font-medium text-foreground">
                            {new Date(dist?.claimDate)?.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {dist?.deliveryDate && (
                        <div>
                          <p className="text-xs text-muted-foreground">Delivery Date</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(dist?.deliveryDate)?.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {isCreator && dist?.status === 'pending' && (
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleStatusUpdate(dist?.id, 'claimed')}
                          className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90"
                        >
                          Mark as Claimed
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(dist?.id, 'delivered')}
                          className="px-3 py-1 bg-success text-white rounded-lg text-xs font-medium hover:bg-success/90"
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6 bg-destructive/10 border-destructive/20">
        <div className="flex items-start gap-3">
          <Icon name="ShieldAlert" size={20} className="text-destructive mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">
              Red-Flag & Blacklist System
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Creators who fail to deliver prizes are automatically tracked. After 3 failed deliveries, 
              creators are automatically blacklisted and banned from creating new elections.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• +10 reputation points for each successful delivery</li>
              <li>• -50 reputation points for each disputed/failed delivery</li>
              <li>• Automatic blacklist after 3 failed deliveries</li>
              <li>• Blacklisted creators cannot create new elections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeDistributionTracking;