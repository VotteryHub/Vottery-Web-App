import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FeedCompositionPanel from './components/FeedCompositionPanel';
import RhythmPatternEnginePanel from './components/RhythmPatternEnginePanel';
import ContentFreshnessPanel from './components/ContentFreshnessPanel';
import DynamicCarouselSelectionPanel from './components/DynamicCarouselSelectionPanel';
import OrchestrationAnalyticsPanel from './components/OrchestrationAnalyticsPanel';
import { carouselFeedOrchestrationService } from '../../services/carouselFeedOrchestrationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const CarouselFeedOrchestrationEngine = () => {
  const [activeTab, setActiveTab] = useState('composition');
  const [loading, setLoading] = useState(true);
  const [orchestrationData, setOrchestrationData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10000);

  useEffect(() => {
    loadOrchestrationData();

    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadOrchestrationData();
      }, refreshInterval);
    }

    analytics?.trackEvent('carousel_orchestration_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, activeTab]);

  const loadOrchestrationData = async () => {
    try {
      setLoading(true);

      const [analyticsResult] = await Promise.all([
        carouselFeedOrchestrationService?.getOrchestrationAnalytics('24h')
      ]);

      setOrchestrationData({
        analytics: analyticsResult?.data || []
      });
    } catch (error) {
      console.error('Error loading orchestration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'composition', label: 'Feed Composition', icon: 'LayoutGrid' },
    { id: 'rhythm', label: 'Rhythm of 3 Pattern', icon: 'Repeat' },
    { id: 'freshness', label: 'Content Freshness', icon: 'Clock' },
    { id: 'selection', label: 'Dynamic Selection', icon: 'Sparkles' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  return (
    <>
      <Helmet>
        <title>Carousel Feed Orchestration Engine | Vottery</title>
        <meta name="description" content="Intelligent content distribution management with sophisticated routing algorithms" />
      </Helmet>
      <div className="flex h-screen bg-background">
        <LeftSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderNavigation />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Carousel Feed Orchestration Engine</h1>
                    <p className="text-muted-foreground">Intelligent content distribution with real-time weighting and carousel sequencing</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg">
                      <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} size={18} className={autoRefresh ? 'text-green-500 animate-spin' : 'text-muted-foreground'} />
                      <span className="text-sm text-muted-foreground">{autoRefresh ? 'Auto-refresh' : 'Paused'}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                      >
                        {autoRefresh ? 'Pause' : 'Resume'}
                      </Button>
                    </div>
                    <Button onClick={loadOrchestrationData} disabled={loading}>
                      <Icon name="RefreshCw" size={18} className={loading ? 'animate-spin' : ''} />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="LayoutGrid" size={24} className="text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-500/20 px-2 py-1 rounded">Live</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">3:1</p>
                    <p className="text-sm text-muted-foreground">Posts to Carousel Ratio</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Zap" size={24} className="text-pink-500" />
                      <span className="text-xs font-medium text-pink-600 bg-pink-500/20 px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">85%</p>
                    <p className="text-sm text-muted-foreground">Content Freshness Score</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="TrendingUp" size={24} className="text-blue-500" />
                      <span className="text-xs font-medium text-blue-600 bg-blue-500/20 px-2 py-1 rounded">Optimized</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">92%</p>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Activity" size={24} className="text-green-500" />
                      <span className="text-xs font-medium text-green-600 bg-green-500/20 px-2 py-1 rounded">Real-time</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">1.2K</p>
                    <p className="text-sm text-muted-foreground">Carousels Served/Hour</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-card text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                  </button>
                ))}
              </div>

              {/* Content Panels */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Icon name="Loader2" size={48} className="animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {activeTab === 'composition' && <FeedCompositionPanel data={orchestrationData} />}
                  {activeTab === 'rhythm' && <RhythmPatternEnginePanel data={orchestrationData} />}
                  {activeTab === 'freshness' && <ContentFreshnessPanel data={orchestrationData} />}
                  {activeTab === 'selection' && <DynamicCarouselSelectionPanel data={orchestrationData} />}
                  {activeTab === 'analytics' && <OrchestrationAnalyticsPanel data={orchestrationData} />}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CarouselFeedOrchestrationEngine;