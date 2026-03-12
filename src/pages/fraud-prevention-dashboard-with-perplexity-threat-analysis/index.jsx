import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AnomalyDetectionPanel from './components/AnomalyDetectionPanel';
import SuspiciousWinnerPatternsPanel from './components/SuspiciousWinnerPatternsPanel';
import CollusionDetectionPanel from './components/CollusionDetectionPanel';
import GeographicClusteringPanel from './components/GeographicClusteringPanel';
import EscalationWorkflowPanel from './components/EscalationWorkflowPanel';
import ThreatIntelligencePanel from './components/ThreatIntelligencePanel';
import { advancedPerplexityFraudService } from '../../services/advancedPerplexityFraudService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const FraudPreventionDashboardWithPerplexityThreatAnalysis = () => {
  const [activeTab, setActiveTab] = useState('anomaly');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [fraudData, setFraudData] = useState({
    anomalies: null,
    suspiciousPatterns: null,
    collusion: null,
    geoClustering: null,
    escalations: [],
    threatIntel: null
  });

  useEffect(() => {
    loadFraudData();
    
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
    analytics?.trackEvent('fraud_prevention_viewed', {
      active_tab: activeTab,
      auto_refresh: autoRefresh,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, autoRefresh]);

  const loadFraudData = async () => {
    try {
      setLoading(true);
      
      const mockHistoricalData = {
        pastIncidents: 234,
        fraudRate: 3.2,
        averageLoss: 680,
        trendDirection: 'increasing',
        suspiciousWinners: 42,
        collusionAttempts: 18,
        geographicAnomalies: 27
      };

      const mockThreatData = {
        recentThreats: 56,
        activeInvestigations: 23,
        resolvedCases: 134,
        highRiskZones: ['zone7', 'zone8']
      };

      const [forecastResult, correlationResult] = await Promise.all([
        advancedPerplexityFraudService?.predictiveFraudForecasting(mockHistoricalData),
        advancedPerplexityFraudService?.crossPlatformThreatCorrelation(mockThreatData)
      ]);

      setFraudData({
        anomalies: forecastResult?.data,
        suspiciousPatterns: {
          patterns: [
            { id: 1, pattern: 'Rapid sequential wins', severity: 'high', occurrences: 12, lastDetected: '2 hours ago' },
            { id: 2, pattern: 'Unusual voting velocity', severity: 'medium', occurrences: 8, lastDetected: '4 hours ago' },
            { id: 3, pattern: 'Duplicate IP clusters', severity: 'high', occurrences: 15, lastDetected: '1 hour ago' }
          ]
        },
        collusion: {
          networks: [
            { id: 1, size: 23, confidence: 0.87, status: 'investigating', detectedAt: '2024-01-27 14:30' },
            { id: 2, size: 15, confidence: 0.72, status: 'confirmed', detectedAt: '2024-01-27 12:15' }
          ]
        },
        geoClustering: {
          clusters: [
            { region: 'Zone 7 - Southeast Asia', suspiciousActivity: 34, riskLevel: 'high', coordinates: [103.8198, 1.3521] },
            { region: 'Zone 8 - Sub-Saharan Africa', suspiciousActivity: 28, riskLevel: 'high', coordinates: [36.8219, -1.2921] },
            { region: 'Zone 6 - Eastern Europe', suspiciousActivity: 19, riskLevel: 'medium', coordinates: [30.5234, 50.4501] }
          ]
        },
        escalations: [
          { id: 1, type: 'High-risk winner pattern', priority: 'critical', status: 'escalated', assignedTo: 'Security Team', createdAt: '10 min ago' },
          { id: 2, type: 'Collusion network detected', priority: 'high', status: 'investigating', assignedTo: 'Fraud Team', createdAt: '25 min ago' }
        ],
        threatIntel: correlationResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load fraud data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadFraudData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'anomaly', label: 'Anomaly Detection', icon: 'AlertTriangle' },
    { id: 'patterns', label: 'Suspicious Patterns', icon: 'Eye' },
    { id: 'collusion', label: 'Collusion Detection', icon: 'Users' },
    { id: 'geographic', label: 'Geographic Clustering', icon: 'Map' },
    { id: 'escalation', label: 'Escalation Workflows', icon: 'ArrowUp' },
    { id: 'threat', label: 'Threat Intelligence', icon: 'Shield' }
  ];

  return (
    <>
      <Helmet>
        <title>Fraud Prevention Dashboard with Perplexity Threat Analysis - Vottery</title>
        <meta name="description" content="Automated anomaly detection with Perplexity AI threat analysis for suspicious winner patterns, collusion attempts, and geographic vote clustering." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Fraud Prevention Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Automated anomaly detection with Perplexity AI threat analysis and instant escalation workflows
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-2 focus:ring-primary"
                  />
                  <span>Auto-refresh</span>
                </label>
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
              <p className="text-muted-foreground">Loading fraud prevention intelligence...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'anomaly' && (
                <AnomalyDetectionPanel 
                  anomalyData={fraudData?.anomalies}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'patterns' && (
                <SuspiciousWinnerPatternsPanel 
                  patternsData={fraudData?.suspiciousPatterns}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'collusion' && (
                <CollusionDetectionPanel 
                  collusionData={fraudData?.collusion}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'geographic' && (
                <GeographicClusteringPanel 
                  geoData={fraudData?.geoClustering}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'escalation' && (
                <EscalationWorkflowPanel 
                  escalations={fraudData?.escalations}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'threat' && (
                <ThreatIntelligencePanel 
                  threatData={fraudData?.threatIntel}
                  onRefresh={refreshData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default FraudPreventionDashboardWithPerplexityThreatAnalysis;