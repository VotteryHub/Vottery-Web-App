import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

import { profileService } from '../../services/profileService';

const CreatorReputationElectionManagementSystem = () => {
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('reputation');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadCreators();
  }, [sortBy, filterStatus]);

  const loadCreators = async () => {
    try {
      const { data, error } = await profileService?.getCreatorReputations();
      if (error) throw error;

      let filtered = data || [];

      if (filterStatus === 'verified') {
        filtered = filtered?.filter(c => c?.verifiedCreator);
      } else if (filterStatus === 'flagged') {
        filtered = filtered?.filter(c => c?.redFlagCount > 0);
      } else if (filterStatus === 'blacklisted') {
        filtered = filtered?.filter(c => c?.isBlacklisted);
      }

      if (sortBy === 'reputation') {
        filtered?.sort((a, b) => (b?.reputationScore || 0) - (a?.reputationScore || 0));
      } else if (sortBy === 'elections') {
        filtered?.sort((a, b) => (b?.totalElectionsCreated || 0) - (a?.totalElectionsCreated || 0));
      } else if (sortBy === 'completion') {
        filtered?.sort((a, b) => {
          const aRate = a?.totalElectionsCreated > 0 ? (a?.completedElections / a?.totalElectionsCreated) * 100 : 0;
          const bRate = b?.totalElectionsCreated > 0 ? (b?.completedElections / b?.totalElectionsCreated) * 100 : 0;
          return bRate - aRate;
        });
      }

      setCreators(filtered);
    } catch (err) {
      console.error('Error loading creators:', err);
    } finally {
      setLoading(false);
    }
  };

  const getReputationColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getReputationBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-success' };
    if (score >= 70) return { label: 'Good', color: 'bg-primary' };
    if (score >= 50) return { label: 'Fair', color: 'bg-warning' };
    return { label: 'Poor', color: 'bg-destructive' };
  };

  const sortOptions = [
    { value: 'reputation', label: 'Reputation Score' },
    { value: 'elections', label: 'Total Elections' },
    { value: 'completion', label: 'Completion Rate' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Creators' },
    { value: 'verified', label: 'Verified Only' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'blacklisted', label: 'Blacklisted' }
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
                Creator Reputation & Election Management
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Track creator performance, reputation scores, and prize distribution reliability
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Select
                label="Sort By"
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
              <Select
                label="Filter"
                options={filterOptions}
                value={filterStatus}
                onChange={setFilterStatus}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : creators?.length === 0 ? (
              <div className="card p-8 text-center">
                <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  No Creators Found
                </h3>
                <p className="text-muted-foreground">
                  No creators match your current filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {creators?.map((creator) => {
                  const badge = getReputationBadge(creator?.reputationScore || 0);
                  const completionRate = creator?.totalElectionsCreated > 0
                    ? ((creator?.completedElections / creator?.totalElectionsCreated) * 100)?.toFixed(1)
                    : 0;

                  return (
                    <div key={creator?.id} className="card p-6 hover:shadow-democratic-lg transition-shadow">
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary">
                          <Image
                            src={creator?.userProfiles?.avatar || '/assets/images/no_image.png'}
                            alt={`${creator?.userProfiles?.name}'s avatar`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-heading font-bold text-foreground">
                                  {creator?.userProfiles?.name}
                                </h3>
                                {creator?.verifiedCreator && (
                                  <Icon name="BadgeCheck" size={20} color="var(--color-primary)" />
                                )}
                                {creator?.isBlacklisted && (
                                  <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-medium rounded">
                                    Blacklisted
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                @{creator?.userProfiles?.username}
                              </p>
                            </div>

                            <div className="text-right">
                              <div className={`text-3xl font-data font-bold ${getReputationColor(creator?.reputationScore || 0)} mb-1`}>
                                {(creator?.reputationScore || 0)?.toFixed(0)}
                              </div>
                              <span className={`px-3 py-1 ${badge?.color} text-white text-xs font-medium rounded-full`}>
                                {badge?.label}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon name="Vote" size={16} className="text-primary" />
                                <span className="text-xs text-muted-foreground">Elections</span>
                              </div>
                              <p className="text-lg font-data font-bold text-foreground">
                                {creator?.totalElectionsCreated || 0}
                              </p>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon name="CheckCircle" size={16} className="text-success" />
                                <span className="text-xs text-muted-foreground">Completed</span>
                              </div>
                              <p className="text-lg font-data font-bold text-success">
                                {completionRate}%
                              </p>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon name="Gift" size={16} className="text-accent" />
                                <span className="text-xs text-muted-foreground">Prizes Paid</span>
                              </div>
                              <p className="text-lg font-data font-bold text-foreground">
                                {creator?.prizesDistributed || 0}
                              </p>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon name="AlertTriangle" size={16} className="text-warning" />
                                <span className="text-xs text-muted-foreground">Red Flags</span>
                              </div>
                              <p className="text-lg font-data font-bold text-warning">
                                {creator?.redFlagCount || 0}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedCreator(creator)}
                            >
                              View Details
                              <Icon name="ArrowRight" size={16} />
                            </Button>
                            {creator?.prizesDistributed > 0 && (
                              <div className="flex items-center gap-1.5 text-sm text-success">
                                <Icon name="CheckCircle" size={16} />
                                <span>Reliable Prize Distribution</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorReputationElectionManagementSystem;