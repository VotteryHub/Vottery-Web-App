import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import ExtendedReasoningEnginePanel from './components/ExtendedReasoningEnginePanel';
import CrossDomainCorrelationPanel from './components/CrossDomainCorrelationPanel';
import RegulatoryComplianceForecastingPanel from './components/RegulatoryComplianceForecastingPanel';
import DeepDiveAnalysisPanel from './components/DeepDiveAnalysisPanel';
import ThreatScenarioSimulationPanel from './components/ThreatScenarioSimulationPanel';
import ModelPerformanceTrackingPanel from './components/ModelPerformanceTrackingPanel';
import perplexityThreatIntelligenceService from '../../services/perplexityThreatIntelligenceService';

function EnhancedPredictiveThreatIntelligenceCenter() {
  const [activeTab, setActiveTab] = useState('reasoning');
  const [threatScenarios, setThreatScenarios] = useState([]);
  const [complianceForecasts, setComplianceForecasts] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeThreatScenarios: 0,
    avgForecastHorizon: '0 days',
    avgConfidence: 0,
    criticalAlerts: 0,
    complianceRisks: 0,
    correlationsDetected: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scenariosData, forecastsData, correlationsData] = await Promise.all([
        perplexityThreatIntelligenceService?.getThreatScenarios(),
        perplexityThreatIntelligenceService?.getComplianceForecasts(),
        perplexityThreatIntelligenceService?.getCrossDomainCorrelations(),
      ]);

      setThreatScenarios(scenariosData);
      setComplianceForecasts(forecastsData);
      setCorrelations(correlationsData);

      // Calculate stats
      const avgConfidence = scenariosData?.reduce((sum, s) => sum + s?.confidence, 0) / scenariosData?.length || 0;
      const criticalAlerts = scenariosData?.filter(s => s?.severity === 'critical')?.length;
      const complianceRisks = forecastsData?.filter(f => f?.riskLevel === 'high')?.length;

      setStats({
        activeThreatScenarios: scenariosData?.length,
        avgForecastHorizon: '75 days',
        avgConfidence: Math.round(avgConfidence),
        criticalAlerts,
        complianceRisks,
        correlationsDetected: correlationsData?.length,
      });
    } catch (error) {
      console.error('Failed to load threat intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'reasoning', label: 'Extended Reasoning Engine', icon: 'Brain' },
    { id: 'correlation', label: 'Cross-Domain Correlation', icon: 'Network' },
    { id: 'compliance', label: 'Regulatory Forecasting', icon: 'Shield' },
    { id: 'deepdive', label: 'Deep-Dive Analysis', icon: 'Search' },
    { id: 'simulation', label: 'Threat Simulation', icon: 'Activity' },
    { id: 'performance', label: 'Model Performance', icon: 'TrendingUp' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Icon name="Shield" size={32} className="text-indigo-600" />
                Enhanced Predictive Threat Intelligence Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Perplexity-powered extended reasoning for deep-dive threat analysis and compliance forecasting
              </p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Icon name="RefreshCw" size={18} />
              Refresh Intelligence
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.activeThreatScenarios}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Active Scenarios</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.avgForecastHorizon}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Forecast Horizon</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.avgConfidence}%</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Avg Confidence</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.criticalAlerts}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Critical Alerts</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.complianceRisks}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Compliance Risks</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.correlationsDetected}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Correlations</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-indigo-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Loader" size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading threat intelligence...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'reasoning' && (
              <ExtendedReasoningEnginePanel threatScenarios={threatScenarios} />
            )}
            {activeTab === 'correlation' && (
              <CrossDomainCorrelationPanel correlations={correlations} />
            )}
            {activeTab === 'compliance' && (
              <RegulatoryComplianceForecastingPanel forecasts={complianceForecasts} />
            )}
            {activeTab === 'deepdive' && (
              <DeepDiveAnalysisPanel />
            )}
            {activeTab === 'simulation' && (
              <ThreatScenarioSimulationPanel scenarios={threatScenarios} />
            )}
            {activeTab === 'performance' && (
              <ModelPerformanceTrackingPanel />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EnhancedPredictiveThreatIntelligenceCenter;