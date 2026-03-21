import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ExtendedForecastingPanel from './components/ExtendedForecastingPanel';
import EmergingVectorDetectionPanel from './components/EmergingVectorDetectionPanel';
import SeasonalAnomalyModelingPanel from './components/SeasonalAnomalyModelingPanel';
import ScenarioModelingPanel from './components/ScenarioModelingPanel';
import ThreatImpactCalculationPanel from './components/ThreatImpactCalculationPanel';
import { advancedPerplexityFraudService } from '../../services/advancedPerplexityFraudService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdvancedPerplexity6090DayThreatForecastingCenter = () => {
  const [activeTab, setActiveTab] = useState('forecast');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [forecastData, setForecastData] = useState({
    extendedForecast: null,
    emergingVectors: null,
    seasonalAnomalies: null,
    scenarioModeling: null,
    threatImpact: null
  });

  useEffect(() => {
    loadForecastData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshData();
      }, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    analytics?.trackEvent('perplexity_60_90_day_forecasting_viewed', {
      active_tab: activeTab,
      auto_refresh: autoRefresh,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, autoRefresh]);

  const loadForecastData = async () => {
    try {
      setLoading(true);

      const historicalData = {
        last90Days: [
          { date: '2025-11-01', fraudCount: 45, totalTransactions: 12000, threatLevel: 'medium' },
          { date: '2025-12-01', fraudCount: 52, totalTransactions: 13500, threatLevel: 'medium' },
          { date: '2026-01-01', fraudCount: 67, totalTransactions: 15200, threatLevel: 'high' }
        ],
        patterns: ['velocity_anomaly', 'geographic_mismatch', 'behavioral_deviation', 'coordinated_attack'],
        seasonalFactors: ['holiday_period', 'tax_season', 'election_cycle']
      };

      const threatSignals = {
        activePatterns: historicalData.patterns,
        regionalSpread: historicalData.last90Days.map((item) => ({
          date: item.date,
          threatLevel: item.threatLevel,
          fraudCount: item.fraudCount
        })),
        currentWindow: '30/60/90'
      };

      const [forecastResult, vectorsResult, seasonalResult, scenarioResult, impactResult] = await Promise.all([
        advancedPerplexityFraudService?.predictiveFraudForecasting(historicalData),
        advancedPerplexityFraudService?.automatedThreatHunting({
          horizon: '90_days',
          focus: ['emerging_vectors', 'cross_platform_coordination', 'identity_fraud']
        }),
        advancedPerplexityFraudService?.getPerplexityAdvancedReasoning(
          {
            historicalData,
            requestedModel: 'seasonal_anomaly_forecasting',
            horizons: ['30_days', '60_days', '90_days']
          },
          'threat_analysis'
        ),
        advancedPerplexityFraudService?.crossPlatformThreatCorrelation(threatSignals),
        advancedPerplexityFraudService?.getPerplexityAdvancedReasoning(
          {
            historicalData,
            objective: 'threat_impact_calculation',
            dimensions: ['financial', 'operational', 'reputational']
          },
          'optimization_recommendations'
        )
      ]);

      const emergingVectors = vectorsResult?.data || {
        threatsDiscovered: [],
        aptIndicators: [],
        sophisticatedSchemes: [],
        vulnerabilities: [],
        confidence: 0
      };

      const seasonalAnomalies = seasonalResult?.data || {
        predictions: [],
        patterns: [],
        confidence: 0,
        recommendations: []
      };

      const scenarioModeling = scenarioResult?.data || {
        scenarios: [],
        correlationMatrix: [],
        overallThreatLevel: 'medium'
      };

      const threatImpact = impactResult?.data || {
        analysis: {},
        risks: [],
        predictions: {},
        recommendations: []
      };

      setForecastData({
        extendedForecast: forecastResult?.data,
        emergingVectors,
        seasonalAnomalies,
        scenarioModeling,
        threatImpact
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadForecastData();
    setRefreshing(false);
  };

  const tabs = [
    { id: 'forecast', label: '60-90 Day Forecast', icon: 'Calendar' },
    { id: 'vectors', label: 'Emerging Vectors', icon: 'AlertTriangle' },
    { id: 'seasonal', label: 'Seasonal Anomalies', icon: 'TrendingUp' },
    { id: 'scenarios', label: 'Scenario Modeling', icon: 'GitBranch' },
    { id: 'impact', label: 'Threat Impact', icon: 'Target' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Advanced Perplexity 60-90 Day Threat Forecasting Center | Predictive Intelligence</title>
      </Helmet>
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Advanced Perplexity 60-90 Day Threat Forecasting Center
              </h1>
              <p className="text-muted-foreground">
                Extended AI reasoning for comprehensive long-term threat prediction with emerging fraud vector identification and seasonal anomaly modeling
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Clock" className="w-4 h-4" />
                <span>Updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <Icon name={refreshing ? 'Loader' : 'RefreshCw'} className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
              >
                <Icon name="Zap" className="w-4 h-4 mr-2" />
                Auto-Refresh {autoRefresh ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon name={tab?.icon} className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader" className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'forecast' && (
              <ExtendedForecastingPanel data={forecastData?.extendedForecast} />
            )}
            {activeTab === 'vectors' && (
              <EmergingVectorDetectionPanel data={forecastData?.emergingVectors} />
            )}
            {activeTab === 'seasonal' && (
              <SeasonalAnomalyModelingPanel data={forecastData?.seasonalAnomalies} />
            )}
            {activeTab === 'scenarios' && (
              <ScenarioModelingPanel data={forecastData?.scenarioModeling} />
            )}
            {activeTab === 'impact' && (
              <ThreatImpactCalculationPanel data={forecastData?.threatImpact} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdvancedPerplexity6090DayThreatForecastingCenter;