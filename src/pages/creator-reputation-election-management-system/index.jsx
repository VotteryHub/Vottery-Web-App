import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

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
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getReputationBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/20' };
    if (score >= 70) return { label: 'Good', color: 'bg-primary/20 text-primary border-primary/20' };
    if (score >= 50) return { label: 'Fair', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' };
    return { label: 'Poor', color: 'bg-red-500/20 text-red-400 border-red-500/20' };
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
    <GeneralPageLayout title="Creator Reputation" showSidebar={true}>
      <div className="w-full py-0">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
            Creator Reputation
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium">
            Track creator performance, reputation scores, and prize distribution reliability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="w-full px-4 py-3 text-sm font-bold border border-white/10 rounded-2xl bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-md"
            >
              {sortOptions?.map(opt => (
                <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="w-full px-4 py-3 text-sm font-bold border border-white/10 rounded-2xl bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-md"
            >
              {filterOptions?.map(opt => (
                <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Creators...</p>
          </div>
        ) : creators?.length === 0 ? (
          <div className="bg-slate-900/20 rounded-3xl border border-white/5 p-16 text-center shadow-inner">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Users" size={32} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
              No Creators Found
            </h3>
            <p className="text-slate-500 font-medium">
              No creators match your current filters
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-700">
            {creators?.map((creator) => {
              const badge = getReputationBadge(creator?.reputationScore || 0);
              const completionRate = creator?.totalElectionsCreated > 0
                ? ((creator?.completedElections / creator?.totalElectionsCreated) * 100)?.toFixed(1)
                : 0;

              return (
                <div key={creator?.id} className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:shadow-2xl hover:border-white/20 transition-all">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/30 shadow-lg shadow-primary/10">
                      <Image
                        src={creator?.userProfiles?.avatar || '/assets/images/no_image.png'}
                        alt={`${creator?.userProfiles?.name}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">
                              {creator?.userProfiles?.name}
                            </h3>
                            {creator?.verifiedCreator && (
                              <Icon name="BadgeCheck" size={20} className="text-primary" />
                            )}
                            {creator?.isBlacklisted && (
                              <span className="px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20">
                                Blacklisted
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 font-medium">
                            @{creator?.userProfiles?.username}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className={`text-3xl font-black ${getReputationColor(creator?.reputationScore || 0)} mb-2`}>
                            {(creator?.reputationScore || 0)?.toFixed(0)}
                          </div>
                          <span className={`px-3 py-1 ${badge?.color} text-[10px] font-black uppercase tracking-widest rounded-full border`}>
                            {badge?.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="Vote" size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Elections</span>
                          </div>
                          <p className="text-lg font-black text-white">
                            {creator?.totalElectionsCreated || 0}
                          </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="CheckCircle" size={14} className="text-green-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Completed</span>
                          </div>
                          <p className="text-lg font-black text-green-400">
                            {completionRate}%
                          </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="Gift" size={14} className="text-purple-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prizes Paid</span>
                          </div>
                          <p className="text-lg font-black text-white">
                            {creator?.prizesDistributed || 0}
                          </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="AlertTriangle" size={14} className="text-yellow-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Red Flags</span>
                          </div>
                          <p className="text-lg font-black text-yellow-400">
                            {creator?.redFlagCount || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCreator(creator)}
                          className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                          View Details
                          <Icon name="ArrowRight" size={14} className="ml-2" />
                        </Button>
                        {creator?.prizesDistributed > 0 && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                            <Icon name="CheckCircle" size={14} />
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
    </GeneralPageLayout>
  );
};

export default CreatorReputationElectionManagementSystem;