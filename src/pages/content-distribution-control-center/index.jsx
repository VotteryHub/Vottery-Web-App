import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DistributionControlPanel from './components/DistributionControlPanel';
import GlobalTogglePanel from './components/GlobalTogglePanel';
import LiveMonitoringPanel from './components/LiveMonitoringPanel';
import AlgorithmIntegrationPanel from './components/AlgorithmIntegrationPanel';
import AdvancedControlsPanel from './components/AdvancedControlsPanel';
import DistributionHistoryPanel from './components/DistributionHistoryPanel';
import { contentDistributionService } from '../../services/contentDistributionService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const ContentDistributionControlCenter = () => {
  const [activeTab, setActiveTab] = useState('control');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [distributionData, setDistributionData] = useState({
    settings: null,
    metrics: [],
    history: [],
    algorithmPerformance: [],
    effectiveness: null
  });

  useEffect(() => {
    loadDistributionData();
    analytics?.trackEvent('content_distribution_center_viewed', {
      active_tab: activeTab
    });

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const loadDistributionData = async () => {
    setLoading(true);
    try {
      const [settingsResult, metricsResult, historyResult, algorithmResult, effectivenessResult] = await Promise.all([
        contentDistributionService?.getDistributionSettings(),
        contentDistributionService?.getDistributionMetrics('24h'),
        contentDistributionService?.getDistributionHistory(50),
        contentDistributionService?.getAlgorithmPerformance(),
        contentDistributionService?.getDistributionEffectiveness()
      ]);

      setDistributionData({
        settings: settingsResult?.data,
        metrics: metricsResult?.data || [],
        history: historyResult?.data || [],
        algorithmPerformance: algorithmResult?.data || [],
        effectiveness: effectivenessResult?.data
      });
    } catch (error) {
      console.error('Failed to load distribution data:', error);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDistributionData();
    setRefreshing(false);
  };

  const handlePercentageUpdate = async (electionPercentage, socialMediaPercentage) => {
    try {
      const result = await contentDistributionService?.updateDistributionPercentages(
        electionPercentage,
        socialMediaPercentage,
        'current-user-id' // Replace with actual user ID from auth context
      );

      if (result?.data) {
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to update percentages:', error);
    }
  };

  const handleToggleSystem = async (isEnabled) => {
    try {
      const result = await contentDistributionService?.toggleDistributionSystem(
        isEnabled,
        'current-user-id' // Replace with actual user ID from auth context
      );

      if (result?.data) {
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to toggle system:', error);
    }
  };

  const handleEmergencyFreeze = async (isActive) => {
    try {
      const result = await contentDistributionService?.toggleEmergencyFreeze(
        isActive,
        'current-user-id' // Replace with actual user ID from auth context
      );

      if (result?.data) {
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to toggle emergency freeze:', error);
    }
  };

  const handleAlgorithmModeChange = async (mode) => {
    try {
      const result = await contentDistributionService?.updateAlgorithmMode(
        mode,
        'current-user-id' // Replace with actual user ID from auth context
      );

      if (result?.data) {
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to update algorithm mode:', error);
    }
  };

  const tabs = [
    { id: 'control', label: 'Distribution Control', icon: 'Sliders' },
    { id: 'monitoring', label: 'Live Monitoring', icon: 'Activity' },
    { id: 'algorithm', label: 'Algorithm Integration', icon: 'Brain' },
    { id: 'advanced', label: 'Advanced Controls', icon: 'Settings' },
    { id: 'history', label: 'Audit Trail', icon: 'History' }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading distribution data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'control':
        return (
          <div className="space-y-6">
            <DistributionControlPanel
              settings={distributionData?.settings}
              onUpdate={handlePercentageUpdate}
            />
            <GlobalTogglePanel
              settings={distributionData?.settings}
              onToggleSystem={handleToggleSystem}
              onEmergencyFreeze={handleEmergencyFreeze}
            />
          </div>
        );
      case 'monitoring':
        return (
          <LiveMonitoringPanel
            metrics={distributionData?.metrics}
            effectiveness={distributionData?.effectiveness}
            settings={distributionData?.settings}
          />
        );
      case 'algorithm':
        return (
          <AlgorithmIntegrationPanel
            algorithmPerformance={distributionData?.algorithmPerformance}
            settings={distributionData?.settings}
            onModeChange={handleAlgorithmModeChange}
          />
        );
      case 'advanced':
        return (
          <AdvancedControlsPanel
            settings={distributionData?.settings}
            onRefresh={refreshData}
          />
        );
      case 'history':
        return (
          <DistributionHistoryPanel
            history={distributionData?.history}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Content Distribution Control Center - Vottery</title>
        <meta name="description" content="Comprehensive algorithmic content management with real-time percentage sliders controlling election/voting content versus social media content distribution across user feeds." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Content Distribution Control Center
                </h1>
                <p className="text-muted-foreground">
                  Manage election vs social media content distribution with real-time algorithmic controls
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium text-foreground font-data">
                    {lastUpdated?.toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? 'Loader' : 'RefreshCw'}
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  distributionData?.settings?.isEnabled ? 'bg-success animate-pulse' : 'bg-muted'
                }`} />
                <span className="text-sm text-muted-foreground">
                  System: <span className="font-medium text-foreground">
                    {distributionData?.settings?.isEnabled ? 'Active' : 'Paused'}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={16} className="text-warning" />
                <span className="text-sm text-muted-foreground">
                  Emergency Freeze: <span className="font-medium text-foreground">
                    {distributionData?.settings?.emergencyFreeze ? 'ON' : 'OFF'}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Brain" size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Algorithm: <span className="font-medium text-foreground capitalize">
                    {distributionData?.settings?.algorithmMode || 'balanced'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-6">
            <div className="flex gap-1 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </main>
      </div>
    </>
  );
};

export default ContentDistributionControlCenter;