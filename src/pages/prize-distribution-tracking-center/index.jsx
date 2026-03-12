import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';

const PrizeDistributionTrackingCenter = () => {
  const { user } = useAuth();
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [trackingNotes, setTrackingNotes] = useState('');

  useEffect(() => {
    loadDistributions();
  }, [filterStatus]);

  const loadDistributions = async () => {
    try {
      const { data, error } = await electionsService?.getPrizeDistributions(filterStatus);
      if (error) throw error;
      setDistributions(data || []);
    } catch (err) {
      console.error('Error loading distributions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (distributionId, newStatus) => {
    try {
      const { error } = await electionsService?.updatePrizeDistribution(distributionId, {
        distributionStatus: newStatus,
        trackingNotes,
        completedAt: newStatus === 'completed' ? new Date()?.toISOString() : null
      });

      if (error) throw error;
      loadDistributions();
      setSelectedDistribution(null);
      setTrackingNotes('');
    } catch (err) {
      console.error('Error updating distribution:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'disputed': return 'bg-orange-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'pending': return 'AlertCircle';
      case 'failed': return 'XCircle';
      case 'disputed': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Distributions' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'disputed', label: 'Disputed' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'disputed', label: 'Disputed' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <ElectionsSidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                Prize Distribution Tracking
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Monitor and manage prize fulfillment for lottery winners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Clock" size={20} className="text-warning" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <p className="text-2xl font-data font-bold text-foreground">
                  {distributions?.filter(d => d?.distributionStatus === 'pending')?.length || 0}
                </p>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="TrendingUp" size={20} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Processing</span>
                </div>
                <p className="text-2xl font-data font-bold text-foreground">
                  {distributions?.filter(d => d?.distributionStatus === 'processing')?.length || 0}
                </p>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <p className="text-2xl font-data font-bold text-foreground">
                  {distributions?.filter(d => d?.distributionStatus === 'completed')?.length || 0}
                </p>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="AlertTriangle" size={20} className="text-destructive" />
                  <span className="text-sm text-muted-foreground">Issues</span>
                </div>
                <p className="text-2xl font-data font-bold text-foreground">
                  {distributions?.filter(d => ['failed', 'disputed']?.includes(d?.distributionStatus))?.length || 0}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <Select
                label="Filter by Status"
                options={filterOptions}
                value={filterStatus}
                onChange={setFilterStatus}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : distributions?.length === 0 ? (
              <div className="card p-8 text-center">
                <Icon name="Gift" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  No Prize Distributions
                </h3>
                <p className="text-muted-foreground">
                  No prize distributions match your current filter
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {distributions?.map((distribution) => (
                  <div key={distribution?.id} className="card p-6">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary">
                        <Image
                          src={distribution?.userProfiles?.avatar || '/assets/images/no_image.png'}
                          alt={`${distribution?.userProfiles?.name}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-heading font-bold text-foreground mb-1">
                              {distribution?.userProfiles?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Election: {distribution?.elections?.title}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(distribution?.distributionStatus)}`}>
                                <Icon name={getStatusIcon(distribution?.distributionStatus)} size={14} className="inline mr-1" />
                                {distribution?.distributionStatus?.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-data font-bold text-success mb-1">
                              ${distribution?.prizeAmount?.toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Prize Amount
                            </p>
                          </div>
                        </div>

                        {distribution?.trackingNotes && (
                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-foreground">
                              <Icon name="FileText" size={14} className="inline mr-1" />
                              {distribution?.trackingNotes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedDistribution(distribution)}
                          >
                            Update Status
                            <Icon name="Edit" size={16} />
                          </Button>
                          {distribution?.transactionId && (
                            <div className="text-sm text-muted-foreground">
                              Transaction: {distribution?.transactionId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedDistribution && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="card p-6 max-w-md w-full">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                    Update Distribution Status
                  </h3>

                  <div className="space-y-4 mb-6">
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={selectedDistribution?.distributionStatus}
                      onChange={(value) => setSelectedDistribution({ ...selectedDistribution, distributionStatus: value })}
                    />

                    <Input
                      label="Tracking Notes"
                      placeholder="Add notes about this distribution..."
                      value={trackingNotes}
                      onChange={(e) => setTrackingNotes(e?.target?.value)}
                      multiline
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleUpdateStatus(selectedDistribution?.id, selectedDistribution?.distributionStatus)}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDistribution(null);
                        setTrackingNotes('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrizeDistributionTrackingCenter;