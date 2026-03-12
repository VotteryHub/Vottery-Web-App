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
      
      const mockHistoricalData = {
        last90Days: [
          { date: '2025-11-01', fraudCount: 45, totalTransactions: 12000, threatLevel: 'medium' },
          { date: '2025-12-01', fraudCount: 52, totalTransactions: 13500, threatLevel: 'medium' },
          { date: '2026-01-01', fraudCount: 67, totalTransactions: 15200, threatLevel: 'high' }
        ],
        patterns: ['velocity_anomaly', 'geographic_mismatch', 'behavioral_deviation', 'coordinated_attack'],
        seasonalFactors: ['holiday_period', 'tax_season', 'election_cycle']
      };

      const forecastResult = await advancedPerplexityFraudService?.predictiveFraudForecasting(mockHistoricalData);

      const mockEmergingVectors = {
        newMethodologies: [
          { name: 'AI-Generated Identity Fraud', severity: 'critical', confidence: 0.89, firstDetected: '2026-01-15' },
          { name: 'Cross-Platform Coordination', severity: 'high', confidence: 0.82, firstDetected: '2026-01-20' },
          { name: 'Behavioral Mimicry Attack', severity: 'high', confidence: 0.76, firstDetected: '2026-01-22' }
        ],
        attackEvolution: [
          { pattern: 'Velocity-based attacks', trend: 'increasing', changeRate: 23.4 },
          { pattern: 'Geographic spoofing', trend: 'stable', changeRate: 2.1 },
          { pattern: 'Social engineering', trend: 'decreasing', changeRate: -8.7 }
        ],
        threatLandscape: {
          overallRisk: 'high',
          emergingThreats: 12,
          evolvedThreats: 8,
          mitigatedThreats: 15
        }
      };

      const mockSeasonalData = {
        historicalPatterns: [
          { period: 'Holiday Season (Nov-Dec)', avgIncrease: 34.2, confidence: 0.92 },
          { period: 'Tax Season (Mar-Apr)', avgIncrease: 28.7, confidence: 0.88 },
          { period: 'Back to School (Aug-Sep)', avgIncrease: 18.3, confidence: 0.85 }
        ],
        holidayVulnerabilities: [
          { holiday: 'Black Friday', riskLevel: 'critical', predictedIncrease: 45.6 },
          { holiday: 'Cyber Monday', riskLevel: 'critical', predictedIncrease: 42.3 },
          { holiday: 'Christmas', riskLevel: 'high', predictedIncrease: 38.9 }
        ],
        culturalContext: [
          { region: 'North America', factors: ['Shopping season', 'Tax deadlines'], riskMultiplier: 1.4 },
          { region: 'Europe', factors: ['Summer holidays', 'Year-end'], riskMultiplier: 1.2 },
          { region: 'Asia-Pacific', factors: ['Lunar New Year', 'Golden Week'], riskMultiplier: 1.3 }
        ]
      };

      const mockScenarioData = {
        scenarios: [
          { name: 'Coordinated Multi-Zone Attack', probability: 0.67, impact: 'critical', timeframe: '60-90 days' },
          { name: 'AI-Powered Fraud Surge', probability: 0.54, impact: 'high', timeframe: '30-60 days' },
          { name: 'Holiday Season Exploitation', probability: 0.82, impact: 'high', timeframe: '60 days' }
        ],
        mitigationStrategies: 15,
        preparednessScore: 0.78
      };

      const mockImpactData = {
        financialImpact: {
          projected60Day: 245000,
          projected90Day: 387000,
          confidenceInterval: [320000, 450000]
        },
        operationalImpact: {
          affectedTransactions: 12400,
          systemLoad: 'high',
          responseTime: 'degraded'
        },
        reputationalImpact: {
          userTrustScore: 0.72,
          brandRiskLevel: 'medium'
        }
      };

      setForecastData({
        extendedForecast: forecastResult?.data,
        emergingVectors: mockEmergingVectors,
        seasonalAnomalies: mockSeasonalData,
        scenarioModeling: mockScenarioData,
        threatImpact: mockImpactData
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