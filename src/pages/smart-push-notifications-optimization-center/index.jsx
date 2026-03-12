import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { pushNotificationService } from '../../services/pushNotificationService';
import { useAuth } from '../../contexts/AuthContext';
import PeakEngagementPanel from './components/PeakEngagementPanel';
import SmartTimingEngine from './components/SmartTimingEngine';
import DeliveryOptimizationPanel from './components/DeliveryOptimizationPanel';
import NotificationQueuePanel from './components/NotificationQueuePanel';

const SmartPushNotificationsOptimizationCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('engagement');
  const [timingData, setTimingData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [timingResult, analyticsResult] = await Promise.all([
        pushNotificationService?.getOptimalTiming(user?.id, 'general'),
        pushNotificationService?.getDeliveryAnalytics(user?.id, 30)
      ]);
      setTimingData(timingResult);
      setAnalytics(analyticsResult?.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'engagement', label: 'Peak Engagement', icon: 'TrendingUp' },
    { id: 'timing', label: 'Smart Timing Engine', icon: 'Clock' },
    { id: 'delivery', label: 'Delivery Optimization', icon: 'Send' },
    { id: 'queue', label: 'Notification Queue', icon: 'List' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Smart Push Notifications Optimization Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Icon name="Bell" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Push Notifications Optimization Center</h1>
                <p className="text-sm text-muted-foreground">AI-powered notification timing for maximum engagement</p>
              </div>
            </div>

            {/* Overview Stats */}
            {!loading && analytics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {[
                  { label: 'Total Sent (30d)', value: analytics?.total || 0, icon: 'Send', color: 'text-blue-600' },
                  { label: 'Engagement Rate', value: `${analytics?.engagementRate || 0}%`, icon: 'TrendingUp', color: 'text-green-600' },
                  { label: 'Optimal Hour', value: timingData?.optimalHour != null ? `${timingData?.optimalHour}:00` : 'N/A', icon: 'Clock', color: 'text-purple-600' },
                  { label: 'Confidence', value: `${timingData?.confidenceScore || 0}%`, icon: 'CheckCircle', color: 'text-orange-600' }
                ]?.map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={stat?.icon} size={16} className={stat?.color} />
                      <span className="text-xs text-muted-foreground">{stat?.label}</span>
                    </div>
                    <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader" size={40} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'engagement' && <PeakEngagementPanel timingData={timingData} userId={user?.id} />}
              {activeTab === 'timing' && <SmartTimingEngine timingData={timingData} onRefresh={loadData} />}
              {activeTab === 'delivery' && <DeliveryOptimizationPanel analytics={analytics} userId={user?.id} />}
              {activeTab === 'queue' && <NotificationQueuePanel userId={user?.id} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SmartPushNotificationsOptimizationCenter;
