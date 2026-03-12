import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LiveAnnouncementsPanel from './components/LiveAnnouncementsPanel';
import PrizeConfirmationPanel from './components/PrizeConfirmationPanel';
import BlockchainVerificationPanel from './components/BlockchainVerificationPanel';
import WinnerCelebrationPanel from './components/WinnerCelebrationPanel';
import NotificationHistoryPanel from './components/NotificationHistoryPanel';
import { winnerNotificationService } from '../../services/winnerNotificationService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const RealTimeWinnerNotificationPrizeVerificationCenter = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveWinners, setLiveWinners] = useState([]);
  const [prizeDistributions, setPrizeDistributions] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadWinnerData = useCallback(async () => {
    try {
      setLoading(true);
      const [winnersResult, distributionsResult] = await Promise.all([
        winnerNotificationService?.getRecentWinners(),
        winnerNotificationService?.getAllPrizeDistributions()
      ]);

      setLiveWinners(winnersResult?.data || []);
      setPrizeDistributions(distributionsResult?.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load winner data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useRealtimeMonitoring({
    tables: ['prize_distributions', 'notifications'],
    onRefresh: () => {
      loadWinnerData();
    },
    enabled: true,
  });

  useEffect(() => {
    loadWinnerData();
    analytics?.trackEvent('winner_notification_center_viewed', {
      active_tab: activeTab
    });
  }, [loadWinnerData, activeTab]);

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadWinnerData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendCelebration = async (winnerId) => {
    try {
      await winnerNotificationService?.sendCelebrationNotification(winnerId);
      await loadWinnerData();
      return { success: true };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  };

  const tabs = [
    { id: 'live', label: 'Live Announcements', icon: 'Radio' },
    { id: 'prizes', label: 'Prize Confirmations', icon: 'Gift' },
    { id: 'blockchain', label: 'Blockchain Verification', icon: 'Shield' },
    { id: 'celebration', label: 'Winner Celebrations', icon: 'PartyPopper' },
    { id: 'history', label: 'Notification History', icon: 'History' }
  ];

  return (
    <>
      <Helmet>
        <title>Real-time Winner Notification & Prize Verification Center - Vottery</title>
        <meta name="description" content="Live winner announcements, prize confirmations, and blockchain verification links for transparent, celebratory user engagement across all platforms." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Real-time Winner Notification & Prize Verification Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Live announcements, prize confirmations, and blockchain verification for transparent user engagement
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? "Loader" : "RefreshCw"}
                  onClick={refreshData}
                  disabled={refreshing}
                  className={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {loading && activeTab === 'live' ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading winner data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'live' && <LiveAnnouncementsPanel winners={liveWinners} onRefresh={loadWinnerData} />}
              {activeTab === 'prizes' && <PrizeConfirmationPanel distributions={prizeDistributions} onRefresh={loadWinnerData} />}
              {activeTab === 'blockchain' && <BlockchainVerificationPanel winners={liveWinners} />}
              {activeTab === 'celebration' && <WinnerCelebrationPanel winners={liveWinners} onSendCelebration={handleSendCelebration} />}
              {activeTab === 'history' && <NotificationHistoryPanel />}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default RealTimeWinnerNotificationPrizeVerificationCenter;