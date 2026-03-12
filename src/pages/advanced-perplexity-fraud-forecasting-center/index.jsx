import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LongTermForecastPanel from './components/LongTermForecastPanel';
import ExtendedReasoningPanel from './components/ExtendedReasoningPanel';
import SeasonalAnalysisPanel from './components/SeasonalAnalysisPanel';
import ZoneVulnerabilityPanel from './components/ZoneVulnerabilityPanel';
import EmergingThreatsPanel from './components/EmergingThreatsPanel';
import ForecastAccuracyPanel from './components/ForecastAccuracyPanel';
import { fraudForecastingService } from '../../services/fraudForecastingService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdvancedPerplexityFraudForecastingCenter = () => {
  const [activeTab, setActiveTab] = useState('forecast');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [forecastData, setForecastData] = useState({
    longTermForecast: null,
    seasonalAnalysis: null,
    zoneVulnerabilities: null,
    emergingThreats: null,
    accuracy: null
  });

  useEffect(() => {
    loadForecastData();
    analytics?.trackEvent('fraud_forecasting_viewed', {
      timestamp: new Date()?.toISOString()
    });
  }, []);

  const loadForecastData = async () => {
    try {
      setLoading(true);

      const mockHistoricalData = {
        last60Days: [
          { date: '2026-01-01', fraudCount: 45, totalTransactions: 12000 },
          { date: '2026-01-15', fraudCount: 52, totalTransactions: 13500 }
        ],
        patterns: ['velocity_anomaly', 'geographic_mismatch', 'behavioral_deviation']
      };

      const [forecastResult, seasonalResult, zoneResult, threatsResult, accuracyResult] = await Promise.all([
        fraudForecastingService?.generateLongTermForecast(mockHistoricalData, '30-60'),
        fraudForecastingService?.analyzeSeasonalPatterns(mockHistoricalData),
        fraudForecastingService?.assessZoneVulnerabilities(mockHistoricalData),
        fraudForecastingService?.identifyEmergingThreats(mockHistoricalData),
        fraudForecastingService?.trackForecastAccuracy()
      ]);

      setForecastData({
        longTermForecast: forecastResult?.data,
        seasonalAnalysis: seasonalResult?.data,
        zoneVulnerabilities: zoneResult?.data,
        emergingThreats: threatsResult?.data,
        accuracy: accuracyResult?.data
      });
    } catch (error) {
      console.error('Failed to load forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadForecastData();
    setRefreshing(false);
  };

  const tabs = [
    { id: 'forecast', label: 'Long-Term Forecast', icon: 'TrendingUp' },
    { id: 'reasoning', label: 'Extended Reasoning', icon: 'Brain' },
    { id: 'seasonal', label: 'Seasonal Analysis', icon: 'Calendar' },
    { id: 'zones', label: 'Zone Vulnerabilities', icon: 'MapPin' },
    { id: 'threats', label: 'Emerging Threats', icon: 'AlertTriangle' },
    { id: 'accuracy', label: 'Forecast Accuracy', icon: 'Target' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Advanced Perplexity Fraud Forecasting Center | Fraud Intelligence</title>
      </Helmet>
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Advanced Perplexity Fraud Forecasting Center
              </h1>
              <p className="text-muted-foreground">
                30-60 day fraud pattern prediction with extended AI reasoning, seasonal anomaly detection, and zone-specific vulnerability analysis
              </p>
            </div>
            <Button
              variant="primary"
              iconName="RefreshCw"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh Forecast'}
            </Button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white' :'bg-card text-muted-foreground hover:bg-card-hover'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <Icon name="Loader" size={48} className="mx-auto text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading forecast data...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'forecast' && (
              <LongTermForecastPanel data={forecastData?.longTermForecast} />
            )}
            {activeTab === 'reasoning' && (
              <ExtendedReasoningPanel data={forecastData?.longTermForecast} />
            )}
            {activeTab === 'seasonal' && (
              <SeasonalAnalysisPanel data={forecastData?.seasonalAnalysis} />
            )}
            {activeTab === 'zones' && (
              <ZoneVulnerabilityPanel data={forecastData?.zoneVulnerabilities} />
            )}
            {activeTab === 'threats' && (
              <EmergingThreatsPanel data={forecastData?.emergingThreats} />
            )}
            {activeTab === 'accuracy' && (
              <ForecastAccuracyPanel data={forecastData?.accuracy} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdvancedPerplexityFraudForecastingCenter;