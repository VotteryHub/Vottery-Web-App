import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';

import SocialSharingHub from './components/SocialSharingHub';
import SuggestedContentSidebar from './components/SuggestedContentSidebar';
import CommentsSection from './components/CommentsSection';
import EmojiReactionPanel from './components/EmojiReactionPanel';
import VoteVisibilityControls from './components/VoteVisibilityControls';
import PrizeDistributionTracking from './components/PrizeDistributionTracking';
import SlotMachine3D from './components/SlotMachine3D';
import { useAuth } from '../../contexts/AuthContext';
import { electionsService } from '../../services/electionsService';

const ComprehensiveSocialEngagementSuite = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('sharing');
  const [selectedElection, setSelectedElection] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const { data, error } = await electionsService?.getAll({ status: 'active' });
      if (error) throw error;
      setElections(data || []);
      if (data?.length > 0) {
        setSelectedElection(data?.[0]);
      }
    } catch (err) {
      console.error('Failed to load elections:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'sharing', label: 'Social Sharing Hub', icon: 'Share2' },
    { id: 'suggested', label: 'Suggested Content', icon: 'Sparkles' },
    { id: 'comments', label: 'Comment System', icon: 'MessageSquare' },
    { id: 'reactions', label: 'Emoji Reactions', icon: 'Heart' },
    { id: 'visibility', label: 'Vote Visibility', icon: 'Eye' },
    { id: 'prizes', label: 'Prize Distribution', icon: 'Gift' },
    { id: 'slotmachine', label: '3D Slot Machine', icon: 'Sparkles' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 min-w-0 lg:ml-64 xl:ml-72 pt-14">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
                Comprehensive Social Engagement Suite
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Advanced social features including sharing, suggestions, comments, reactions, and prize tracking
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs?.map((tab) => {
                  const isActive = activeTab === tab?.id;
                  return (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-250 whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="text-sm font-medium">{tab?.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {activeTab === 'sharing' && (
                  <SocialSharingHub election={selectedElection} />
                )}

                {activeTab === 'suggested' && (
                  <div className="card p-6">
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Suggested Content Preview</h2>
                    <p className="text-muted-foreground mb-4">This sidebar appears on the right side of the home feed dashboard</p>
                    <SuggestedContentSidebar />
                  </div>
                )}

                {activeTab === 'comments' && (
                  <CommentsSection 
                    contentType="election" 
                    contentId={selectedElection?.id}
                    creatorId={selectedElection?.createdBy}
                  />
                )}

                {activeTab === 'reactions' && (
                  <EmojiReactionPanel 
                    contentType="election" 
                    contentId={selectedElection?.id}
                  />
                )}

                {activeTab === 'visibility' && (
                  <VoteVisibilityControls 
                    election={selectedElection}
                    onUpdate={loadElections}
                  />
                )}

                {activeTab === 'prizes' && (
                  <PrizeDistributionTracking election={selectedElection} />
                )}

                {activeTab === 'slotmachine' && selectedElection?.isLotterized && (
                  <SlotMachine3D election={selectedElection} />
                )}
              </div>

              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Select Election</h3>
                  <div className="space-y-2">
                    {elections?.slice(0, 5)?.map((election) => (
                      <button
                        key={election?.id}
                        onClick={() => setSelectedElection(election)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedElection?.id === election?.id
                            ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-medium text-foreground text-sm">{election?.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {election?.votingType} • {election?.totalVoters || 0} voters
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card p-6 bg-primary/10 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={20} className="text-primary mt-0.5" />
                    <div>
                      <h4 className="font-heading font-semibold text-foreground mb-2">Feature Overview</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Social sharing to WhatsApp, Facebook, Twitter</li>
                        <li>• Suggested elections, friends, pages, groups, events</li>
                        <li>• Complete comment system with creator controls</li>
                        <li>• Facebook-style emoji reactions</li>
                        <li>• Vote visibility management</li>
                        <li>• Prize distribution tracking with red-flag system</li>
                        <li>• 3D slot machine for gamified elections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ComprehensiveSocialEngagementSuite;