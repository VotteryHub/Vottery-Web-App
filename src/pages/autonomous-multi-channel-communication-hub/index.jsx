import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { multiChannelCommunicationService } from '../../services/multiChannelCommunicationService';
import { stakeholderCommunicationService } from '../../services/stakeholderCommunicationService';
import CommunicationDashboard from './components/CommunicationDashboard';
import MultiChannelComposer from './components/MultiChannelComposer';
import StakeholderRoutingPanel from './components/StakeholderRoutingPanel';
import MLDecisionEngine from './components/MLDecisionEngine';
import AutomatedResponsePanel from './components/AutomatedResponsePanel';
import DeliveryTrackingPanel from './components/DeliveryTrackingPanel';

const AutonomousMultiChannelCommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [stakeholderGroups, setStakeholderGroups] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsResult, groupsResult] = await Promise.all([
        multiChannelCommunicationService?.getCommunicationAnalytics('7d'),
        stakeholderCommunicationService?.getStakeholderGroups(),
      ]);

      if (analyticsResult?.data) setAnalytics(analyticsResult?.data);
      if (groupsResult?.data) setStakeholderGroups(groupsResult?.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Communication Dashboard', icon: 'LayoutDashboard' },
    { id: 'composer', label: 'Multi-Channel Composer', icon: 'Mail' },
    { id: 'routing', label: 'Stakeholder Routing', icon: 'Route' },
    { id: 'ml-engine', label: 'ML Decision Engine', icon: 'Brain' },
    { id: 'automated', label: 'Automated Responses', icon: 'Zap' },
    { id: 'tracking', label: 'Delivery Tracking', icon: 'Activity' },
  ];

  return (
    <>
      <Helmet>
        <title>Autonomous Multi-Channel Communication Hub | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Autonomous Multi-Channel Communication Hub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Intelligent Stakeholder Routing with Resend Email & Twilio SMS
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="Mail" size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Resend Active
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Icon name="MessageSquare" size={16} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Twilio Active
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <CommunicationDashboard analytics={analytics} />}
              {activeTab === 'composer' && (
                <MultiChannelComposer
                  stakeholderGroups={stakeholderGroups}
                  onSend={loadData}
                />
              )}
              {activeTab === 'routing' && (
                <StakeholderRoutingPanel stakeholderGroups={stakeholderGroups} />
              )}
              {activeTab === 'ml-engine' && <MLDecisionEngine />}
              {activeTab === 'automated' && <AutomatedResponsePanel />}
              {activeTab === 'tracking' && <DeliveryTrackingPanel />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AutonomousMultiChannelCommunicationHub;