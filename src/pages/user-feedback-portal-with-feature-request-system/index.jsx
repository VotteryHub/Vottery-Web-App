import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';

import TrendingIdeasPanel from './components/TrendingIdeasPanel';
import SubmitRequestPanel from './components/SubmitRequestPanel';
import CommunityVotingPanel from './components/CommunityVotingPanel';
import ImplementationTrackingPanel from './components/ImplementationTrackingPanel';

const UserFeedbackPortalWithFeatureRequestSystem = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase?.auth?.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'trending', label: 'Trending Ideas', icon: 'TrendingUp' },
    { id: 'submit', label: 'Submit Request', icon: 'Plus' },
    { id: 'voting', label: 'Community Voting', icon: 'ThumbsUp' },
    { id: 'tracking', label: 'Implementation Tracking', icon: 'GitBranch' }
  ];

  return (
    <>
      <Helmet>
        <title>User Feedback Portal with Feature Request System | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  User Feedback Portal with Feature Request System
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive feature request submission and community-driven prioritization with voting mechanisms
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'trending' && <TrendingIdeasPanel />}
              {activeTab === 'submit' && <SubmitRequestPanel onSubmitSuccess={() => setActiveTab('trending')} />}
              {activeTab === 'voting' && <CommunityVotingPanel />}
              {activeTab === 'tracking' && <ImplementationTrackingPanel />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserFeedbackPortalWithFeatureRequestSystem;