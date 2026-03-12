import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CommunicationDashboardPanel from './components/CommunicationDashboardPanel';
import MultiChannelNotificationPanel from './components/MultiChannelNotificationPanel';
import StakeholderManagementPanel from './components/StakeholderManagementPanel';
import MessageComposerPanel from './components/MessageComposerPanel';
import DeliveryAnalyticsPanel from './components/DeliveryAnalyticsPanel';
import ResponseTrackingPanel from './components/ResponseTrackingPanel';
import SMSCriticalAlertsPanel from './components/SMSCriticalAlertsPanel';
import { stakeholderCommunicationService } from '../../services/stakeholderCommunicationService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const StakeholderIncidentCommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [communicationData, setCommunicationData] = useState({
    statistics: null,
    stakeholderGroups: [],
    recentCommunications: []
  });

  useEffect(() => {
    loadCommunicationData();

    const channel = stakeholderCommunicationService?.subscribeToIncidentCommunications((payload) => {
      if (payload?.eventType === 'INSERT') {
        setCommunicationData(prev => ({
          ...prev,
          recentCommunications: [payload?.data, ...prev?.recentCommunications]
        }));
      } else if (payload?.eventType === 'UPDATE') {
        setCommunicationData(prev => ({
          ...prev,
          recentCommunications: prev?.recentCommunications?.map(comm =>
            comm?.id === payload?.data?.id ? payload?.data : comm
          )
        }));
      }
    });

    return () => {
      stakeholderCommunicationService?.unsubscribeFromIncidentCommunications(channel);
    };
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadCommunicationData,
    enabled: true,
  });

  useEffect(() => {
    analytics?.trackEvent('stakeholder_communication_hub_viewed', {
      active_tab: activeTab,
      total_communications: communicationData?.statistics?.totalCommunications || 0
    });
  }, [activeTab]);

  const loadCommunicationData = async () => {
    try {
      setLoading(true);
      const [statsResult, stakeholdersResult] = await Promise.all([
        stakeholderCommunicationService?.getCommunicationStatistics('30d'),
        stakeholderCommunicationService?.getStakeholderGroups()
      ]);

      setCommunicationData({
        statistics: statsResult?.data,
        stakeholderGroups: stakeholdersResult?.data || [],
        recentCommunications: []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadCommunicationData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Communication Dashboard', icon: 'LayoutDashboard' },
    { id: 'multichannel', label: 'Multi-Channel Notifications', icon: 'Send' },
    { id: 'stakeholders', label: 'Stakeholder Management', icon: 'Users' },
    { id: 'composer', label: 'Message Composer', icon: 'MessageSquare' },
    { id: 'analytics', label: 'Delivery Analytics', icon: 'BarChart3' },
    { id: 'tracking', label: 'Response Tracking', icon: 'Activity' },
    { id: 'sms-critical', label: 'Critical Alerts (SMS to Admins)', icon: 'Smartphone' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CommunicationDashboardPanel statistics={communicationData?.statistics} recentCommunications={communicationData?.recentCommunications} onRefresh={refreshData} />;
      case 'multichannel':
        return <MultiChannelNotificationPanel stakeholderGroups={communicationData?.stakeholderGroups} onRefresh={refreshData} />;
      case 'stakeholders':
        return <StakeholderManagementPanel stakeholderGroups={communicationData?.stakeholderGroups} onRefresh={refreshData} />;
      case 'composer':
        return <MessageComposerPanel stakeholderGroups={communicationData?.stakeholderGroups} onRefresh={refreshData} />;
      case 'analytics':
        return <DeliveryAnalyticsPanel statistics={communicationData?.statistics} />;
      case 'tracking':
        return <ResponseTrackingPanel communications={communicationData?.recentCommunications} onRefresh={refreshData} />;
      case 'sms-critical':
        return <SMSCriticalAlertsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Stakeholder Incident Communication Hub - Vottery</title>
      </Helmet>
      <HeaderNavigation />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="Send" size={28} className="text-primary" />
                Stakeholder Incident Communication Hub
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Multi-channel incident notifications via Resend email and Twilio SMS with automated stakeholder routing and real-time communication tracking
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Last Updated</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lastUpdated?.toLocaleTimeString()}
                </div>
              </div>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <Icon name={refreshing ? 'Loader2' : 'RefreshCw'} size={16} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
          </div>

          {communicationData?.statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Send" size={16} className="text-blue-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Total Communications</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {communicationData?.statistics?.totalCommunications}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="CheckCircle2" size={16} className="text-green-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Delivery Rate</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {communicationData?.statistics?.deliveryRate}%
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Clock" size={16} className="text-purple-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {communicationData?.statistics?.averageResponseTime}s
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="XCircle" size={16} className="text-red-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Failed Communications</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {communicationData?.statistics?.failedCommunications}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="animate-spin text-primary" />
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderIncidentCommunicationHub;
