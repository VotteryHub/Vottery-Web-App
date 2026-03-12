import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RevenueForecastingPanel from './components/RevenueForecastingPanel';
import ChurnPredictionPanel from './components/ChurnPredictionPanel';
import FraudRiskIntelligencePanel from './components/FraudRiskIntelligencePanel';
import ScenarioModelingPanel from './components/ScenarioModelingPanel';
import ConfidenceConfigurationPanel from './components/ConfidenceConfigurationPanel';
import AutomatedReportingPanel from './components/AutomatedReportingPanel';
import { claudeRevenueRiskService } from '../../services/claudeRevenueRiskService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AnthropicClaudeRevenueRiskIntelligenceCenter = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [forecasts, setForecasts] = useState([]);
  const [churnPredictions, setChurnPredictions] = useState([]);
  const [fraudRisks, setFraudRisks] = useState([]);

  useEffect(() => {
    loadIntelligenceData();
    analytics?.trackEvent('claude_revenue_risk_center_viewed', {
      timestamp: new Date()?.toISOString()
    });
  }, []);

  const loadIntelligenceData = async () => {
    try {
      setLoading(true);
      const [forecastsResult, churnResult, fraudResult] = await Promise.all([
        claudeRevenueRiskService?.getLatestForecasts('revenue_trends'),
        claudeRevenueRiskService?.getLatestForecasts('user_churn'),
        claudeRevenueRiskService?.getLatestForecasts('fraud_risk')
      ]);

      setForecasts(forecastsResult?.data || []);
      setChurnPredictions(churnResult?.data || []);
      setFraudRisks(fraudResult?.data || []);
    } catch (error) {
      console.error('Failed to load intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadIntelligenceData();
    setRefreshing(false);
  };

  const handleGenerateForecast = async (forecastPeriod) => {
    try {
      setRefreshing(true);
      await claudeRevenueRiskService?.forecastRevenueTrends(forecastPeriod);
      await loadIntelligenceData();
    } catch (error) {
      console.error('Failed to generate forecast:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateChurnPrediction = async () => {
    try {
      setRefreshing(true);
      await claudeRevenueRiskService?.predictUserChurn();
      await loadIntelligenceData();
    } catch (error) {
      console.error('Failed to generate churn prediction:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateFraudRiskAnalysis = async () => {
    try {
      setRefreshing(true);
      await claudeRevenueRiskService?.analyzeFraudRiskPatterns();
      await loadIntelligenceData();
    } catch (error) {
      console.error('Failed to generate fraud risk analysis:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'revenue', label: 'Revenue Forecasting', icon: 'TrendingUp' },
    { id: 'churn', label: 'Churn Prediction', icon: 'Users' },
    { id: 'fraud', label: 'Fraud Risk Intelligence', icon: 'Shield' },
    { id: 'scenario', label: 'Scenario Modeling', icon: 'GitBranch' },
    { id: 'confidence', label: 'Confidence Config', icon: 'Settings' },
    { id: 'reporting', label: 'Automated Reports', icon: 'FileText' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Anthropic Claude Revenue & Risk Intelligence Center | AI Forecasting</title>
      </Helmet>
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Anthropic Claude Revenue & Risk Intelligence Center
              </h1>
              <p className="text-muted-foreground">
                AI-powered 30-90 day forecasting for revenue trends, user churn probability, and fraud risk patterns across all 8 purchasing power zones
              </p>
            </div>
            <Button
              variant="primary"
              iconName="RefreshCw"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
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
            <p className="text-muted-foreground">Loading intelligence data...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'revenue' && (
              <RevenueForecastingPanel
                forecasts={forecasts}
                onGenerateForecast={handleGenerateForecast}
                refreshing={refreshing}
              />
            )}
            {activeTab === 'churn' && (
              <ChurnPredictionPanel
                predictions={churnPredictions}
                onGeneratePrediction={handleGenerateChurnPrediction}
                refreshing={refreshing}
              />
            )}
            {activeTab === 'fraud' && (
              <FraudRiskIntelligencePanel
                riskAnalyses={fraudRisks}
                onGenerateAnalysis={handleGenerateFraudRiskAnalysis}
                refreshing={refreshing}
              />
            )}
            {activeTab === 'scenario' && (
              <ScenarioModelingPanel forecasts={forecasts} />
            )}
            {activeTab === 'confidence' && (
              <ConfidenceConfigurationPanel />
            )}
            {activeTab === 'reporting' && (
              <AutomatedReportingPanel
                forecasts={forecasts}
                churnPredictions={churnPredictions}
                fraudRisks={fraudRisks}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AnthropicClaudeRevenueRiskIntelligenceCenter;