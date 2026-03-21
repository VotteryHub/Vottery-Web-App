import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PredictiveForecastingPanel from './components/PredictiveForecastingPanel';
import CrossPlatformCorrelationPanel from './components/CrossPlatformCorrelationPanel';
import ZoneAnalyticsPanel from './components/ZoneAnalyticsPanel';
import ThreatHuntingPanel from './components/ThreatHuntingPanel';
import AdvancedReasoningPanel from './components/AdvancedReasoningPanel';
import ThreatTimelinePanel from './components/ThreatTimelinePanel';
import { advancedPerplexityFraudService } from '../../services/advancedPerplexityFraudService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdvancedPerplexityFraudIntelligenceCenter = () => {
  const [activeTab, setActiveTab] = useState('forecasting');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [intelligenceData, setIntelligenceData] = useState({
    forecasting: null,
    correlation: null,
    zoneAnalytics: [],
    threatHunting: null,
    zones: []
  });
  const [liveAiError, setLiveAiError] = useState(null);

  useEffect(() => {
    loadIntelligenceData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    analytics?.trackEvent('fraud_intelligence_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadIntelligenceData = async () => {
    try {
      setLoading(true);
      
      const zones = advancedPerplexityFraudService?.getPurchasingPowerZones();
      
      const signals = await advancedPerplexityFraudService?.getFraudIntelligenceSignalsFromSupabase({ days: 30 });
      const historicalData = signals?.historicalData || {
        pastIncidents: 0,
        fraudRate: 0,
        averageLoss: 0,
        trendDirection: 'stable',
        source: 'supabase_signals'
      };
      const threatData = signals?.threatData || {
        recentThreats: 0,
        activeInvestigations: 0,
        resolvedCases: 0
      };

      const [forecastResult, correlationResult] = await Promise.all([
        advancedPerplexityFraudService?.predictiveFraudForecasting(historicalData),
        advancedPerplexityFraudService?.crossPlatformThreatCorrelation(threatData)
      ]);

      const fcErr = forecastResult?.error?.message;
      const crErr = correlationResult?.error?.message;
      let errMsg = null;
      if (fcErr || crErr) {
        errMsg = [fcErr, crErr].filter(Boolean).join(' · ') || null;
      } else if (!forecastResult?.data && !correlationResult?.data) {
        errMsg = 'Secure AI proxy returned no forecast or correlation payload.';
      }
      setLiveAiError(errMsg);

      setIntelligenceData({
        forecasting: forecastResult?.data,
        correlation: correlationResult?.data,
        zoneAnalytics: zones,
        threatHunting: null,
        zones: zones
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load intelligence data:', error);
      setLiveAiError(error?.message || 'Failed to load fraud intelligence.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadIntelligenceData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'forecasting', label: 'Predictive Forecasting', icon: 'TrendingUp' },
    { id: 'correlation', label: 'Cross-Platform Correlation', icon: 'Network' },
    { id: 'zones', label: 'Zone Analytics', icon: 'Map' },
    { id: 'hunting', label: 'Threat Hunting', icon: 'Search' },
    { id: 'reasoning', label: 'AI Reasoning', icon: 'Brain' },
    { id: 'timeline', label: 'Threat Timeline', icon: 'Clock' }
  ];

  return (
    <>
      <Helmet>
        <title>Advanced Perplexity Fraud Intelligence Center - Vottery</title>
        <meta name="description" content="Advanced AI-powered fraud intelligence with predictive forecasting and cross-platform threat correlation across 8 purchasing power zones." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Advanced Perplexity Fraud Intelligence Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  AI-powered predictive fraud forecasting and cross-platform threat correlation across all 8 zones
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Updated {lastUpdated?.toLocaleTimeString()}
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
          </div>

          {liveAiError && (
            <div
              className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 text-sm text-amber-950 dark:text-amber-100"
              role="status"
            >
              <strong className="font-semibold">Live AI / Perplexity:</strong> {liveAiError} Forecasting inputs use live{' '}
              <span className="font-mono text-xs">fraud_alerts</span>, <span className="font-mono text-xs">content_flags</span>,{' '}
              <span className="font-mono text-xs">votes</span>, and <span className="font-mono text-xs">revenue_anomalies</span>{' '}
              (30d). Panels may still show empty or partial model output until the secure AI proxy returns data.
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading fraud intelligence data...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'forecasting' && (
                <PredictiveForecastingPanel 
                  forecastingData={intelligenceData?.forecasting}
                  zones={intelligenceData?.zones}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'correlation' && (
                <CrossPlatformCorrelationPanel 
                  correlationData={intelligenceData?.correlation}
                  zones={intelligenceData?.zones}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'zones' && (
                <ZoneAnalyticsPanel 
                  zones={intelligenceData?.zones}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'hunting' && (
                <ThreatHuntingPanel 
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'reasoning' && (
                <AdvancedReasoningPanel 
                  forecastingData={intelligenceData?.forecasting}
                  correlationData={intelligenceData?.correlation}
                />
              )}
              {activeTab === 'timeline' && (
                <ThreatTimelinePanel 
                  zones={intelligenceData?.zones}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdvancedPerplexityFraudIntelligenceCenter;