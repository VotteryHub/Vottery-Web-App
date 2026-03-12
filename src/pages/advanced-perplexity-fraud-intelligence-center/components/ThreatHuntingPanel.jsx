import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { advancedPerplexityFraudService } from '../../../services/advancedPerplexityFraudService';
import { perplexityLogAnalysisService } from '../../../services/perplexityLogAnalysisService';
import { supabase } from '../../../lib/supabase';

const ThreatHuntingPanel = ({ onRefresh }) => {
  const [huntingResults, setHuntingResults] = useState(null);
  const [logAnalysis, setLogAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logAnalysisLoading, setLogAnalysisLoading] = useState(false);
  const [huntingParams, setHuntingParams] = useState({
    timeRange: '7d',
    threatTypes: ['apt', 'fraud', 'insider'],
    severity: 'all'
  });

  const handleStartHunt = async () => {
    setLoading(true);
    const result = await advancedPerplexityFraudService?.automatedThreatHunting(huntingParams);
    setHuntingResults(result?.data);
    setLoading(false);
  };

  const handleLogAnalysis = async () => {
    setLogAnalysisLoading(true);
    try {
      const [logsRes, threatsRes] = await Promise.all([
        supabase?.from('fraud_logs')?.select('*')?.order('created_at', { ascending: false })?.limit(50),
        supabase?.from('ml_threat_detections')?.select('*')?.order('detected_at', { ascending: false })?.limit(30)
      ]);
      const fraudLogs = logsRes?.data || [];
      const threatDetections = threatsRes?.data || [];
      const { data } = await perplexityLogAnalysisService?.analyzeFraudPatterns?.(fraudLogs, threatDetections);
      setLogAnalysis(data);
    } catch (_) {
      setLogAnalysis(null);
    } finally {
      setLogAnalysisLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    };
    return colors?.[severity] || colors?.medium;
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Automated Threat Hunting</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Proactively search for hidden threats, APTs, and sophisticated fraud schemes using advanced AI reasoning
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Time Range</label>
            <select
              value={huntingParams?.timeRange}
              onChange={(e) => setHuntingParams({ ...huntingParams, timeRange: e?.target?.value })}
              className="w-full px-3 py-2 bg-card border border-muted rounded-lg text-sm text-foreground"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Threat Types</label>
            <select
              multiple
              value={huntingParams?.threatTypes}
              onChange={(e) => setHuntingParams({ 
                ...huntingParams, 
                threatTypes: Array.from(e?.target?.selectedOptions, option => option?.value)
              })}
              className="w-full px-3 py-2 bg-card border border-muted rounded-lg text-sm text-foreground"
            >
              <option value="apt">Advanced Persistent Threats</option>
              <option value="fraud">Fraud Schemes</option>
              <option value="insider">Insider Threats</option>
              <option value="vulnerability">Vulnerabilities</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Minimum Severity</label>
            <select
              value={huntingParams?.severity}
              onChange={(e) => setHuntingParams({ ...huntingParams, severity: e?.target?.value })}
              className="w-full px-3 py-2 bg-card border border-muted rounded-lg text-sm text-foreground"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High & Above</option>
              <option value="medium">Medium & Above</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleStartHunt}
          disabled={loading}
          iconName={loading ? 'Loader' : 'Search'}
          className="w-full md:w-auto"
        >
          {loading ? 'Hunting Threats...' : 'Start Threat Hunt'}
        </Button>
      </div>
      {loading && (
        <div className="card p-12 text-center">
          <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
          <p className="text-muted-foreground">Scanning for hidden threats across platform ecosystems...</p>
        </div>
      )}
      {!loading && huntingResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="AlertTriangle" size={24} className="text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Threats Discovered</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {huntingResults?.threatsDiscovered?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Target" size={24} className="text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Hunting Score</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {huntingResults?.huntingScore || 0}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Shield" size={24} className="text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {((huntingResults?.confidence || 0) * 100)?.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {huntingResults?.threatsDiscovered && huntingResults?.threatsDiscovered?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Discovered Threats</h3>
              <div className="space-y-3">
                {huntingResults?.threatsDiscovered?.map((threat, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground mb-1">{threat?.name || `Threat ${index + 1}`}</h4>
                        <p className="text-xs text-muted-foreground">{threat?.description || 'Sophisticated threat pattern detected'}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getSeverityColor(threat?.severity || 'high')}`}>
                        {threat?.severity || 'high'}
                      </span>
                    </div>
                    {threat?.indicators && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {threat?.indicators?.map((indicator, iIndex) => (
                          <span key={iIndex} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {huntingResults?.aptIndicators && huntingResults?.aptIndicators?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">APT Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {huntingResults?.aptIndicators?.map((indicator, index) => (
                  <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Icon name="AlertCircle" size={16} className="text-orange-600 mt-0.5" />
                      <span className="text-sm text-foreground">{indicator}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {huntingResults?.actionableIntelligence && huntingResults?.actionableIntelligence?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Actionable Intelligence</h3>
              <div className="space-y-2">
                {huntingResults?.actionableIntelligence?.map((intel, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-foreground">{intel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {huntingResults?.reasoning && (
            <div className="card">
              <div className="flex items-start gap-3">
                <Icon name="Brain" size={20} className="text-primary mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">AI Reasoning Analysis</h3>
                  <p className="text-sm text-muted-foreground">{huntingResults?.reasoning}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!loading && !huntingResults && (
        <div className="card p-12 text-center">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Configure parameters and start threat hunting</p>
        </div>
      )}

      {/* Perplexity Log Analysis - Extended reasoning on fraud patterns */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Perplexity Log Analysis</h3>
        <p className="text-sm text-muted-foreground mb-4">Extended reasoning on fraud logs and threat detections</p>
        <Button onClick={handleLogAnalysis} disabled={logAnalysisLoading} iconName={logAnalysisLoading ? 'Loader' : 'Brain'} size="sm">
          {logAnalysisLoading ? 'Analyzing...' : 'Run Log Analysis'}
        </Button>
        {logAnalysis && (
          <div className="mt-4 space-y-4">
            {logAnalysis?.reasoning && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-foreground">{logAnalysis?.reasoning}</p>
              </div>
            )}
            {logAnalysis?.patterns?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Detected Patterns</h4>
                <div className="space-y-2">
                  {logAnalysis?.patterns?.slice(0, 5)?.map((p, i) => (
                    <div key={i} className="p-2 bg-muted/30 rounded text-sm">
                      <span className="font-medium">{p?.name}</span> · {p?.frequency} · {p?.severity}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {logAnalysis?.recommendedPreventionRules?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Recommended Rules</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {logAnalysis?.recommendedPreventionRules?.slice(0, 3)?.map((r, i) => (
                    <li key={i}>• {r?.condition} → {r?.action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatHuntingPanel;