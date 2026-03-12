import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import MLAnomalyDetectionPanel from './components/MLAnomalyDetectionPanel';
import BehavioralAnalysisPanel from './components/BehavioralAnalysisPanel';
import ZeroDayDetectionPanel from './components/ZeroDayDetectionPanel';
import ThreatIntelligencePanel from './components/ThreatIntelligencePanel';
import PredictiveModelingPanel from './components/PredictiveModelingPanel';
import AttackPatternRecognitionPanel from './components/AttackPatternRecognitionPanel';
import OpenAIContextualAnalysisPanel from './components/OpenAIContextualAnalysisPanel';
import ThreatCorrelationReasoningPanel from './components/ThreatCorrelationReasoningPanel';
import PredictiveThreatEscalationPanel from './components/PredictiveThreatEscalationPanel';

const AdvancedMLThreatDetectionCenter = () => {
  const [activeTab, setActiveTab] = useState('anomaly');
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Trigger refresh for all panels
      window.dispatchEvent(new CustomEvent('ml-threat-refresh'));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const tabs = [
    { id: 'anomaly', label: 'ML Anomaly Detection', icon: 'Brain' },
    { id: 'behavioral', label: 'Behavioral Analysis', icon: 'Users' },
    { id: 'zeroday', label: 'Zero-Day Detection', icon: 'AlertTriangle' },
    { id: 'intelligence', label: 'Threat Intelligence', icon: 'Shield' },
    { id: 'predictive', label: 'Predictive Modeling', icon: 'TrendingUp' },
    { id: 'patterns', label: 'Attack Patterns', icon: 'Target' },
    { id: 'openai-analysis', label: 'OpenAI Contextual Analysis', icon: 'Sparkles' },
    { id: 'correlation', label: 'Threat Correlation', icon: 'Network' },
    { id: 'escalation', label: 'Escalation Prediction', icon: 'AlertOctagon' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'anomaly':
        return <MLAnomalyDetectionPanel />;
      case 'behavioral':
        return <BehavioralAnalysisPanel />;
      case 'zeroday':
        return <ZeroDayDetectionPanel />;
      case 'intelligence':
        return <ThreatIntelligencePanel />;
      case 'predictive':
        return <PredictiveModelingPanel />;
      case 'patterns':
        return <AttackPatternRecognitionPanel />;
      case 'openai-analysis':
        return <OpenAIContextualAnalysisPanel loading={loading} />;
      case 'correlation':
        return <ThreatCorrelationReasoningPanel loading={loading} />;
      case 'escalation':
        return <PredictiveThreatEscalationPanel loading={loading} />;
      default:
        return <MLAnomalyDetectionPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
              <Icon name="Brain" size={32} className="text-purple-600" />
              Advanced ML Threat Detection Center
            </h1>
            <p className="text-muted-foreground">
              Predictive anomaly detection using machine learning to identify sophisticated attacks, behavioral anomalies, and zero-day exploitation patterns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card p-3 rounded-lg border border-border">
              <Icon name="RefreshCw" size={16} className={autoRefresh ? 'text-green-600 animate-spin' : 'text-muted-foreground'} />
              <span className="text-sm text-foreground">Auto-Refresh</span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  autoRefresh ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e?.target?.value))}
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
            >
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
          </div>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Brain" size={20} className="text-purple-600" />
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">ACTIVE</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">12</div>
            <div className="text-xs text-muted-foreground">ML Models Running</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="AlertTriangle" size={20} className="text-red-600" />
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">HIGH</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">3</div>
            <div className="text-xs text-muted-foreground">Critical Threats Detected</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Activity" size={20} className="text-orange-600" />
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">MONITORING</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">847</div>
            <div className="text-xs text-muted-foreground">Anomalies Analyzed (24h)</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Shield" size={20} className="text-green-600" />
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">98.7%</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">Excellent</div>
            <div className="text-xs text-muted-foreground">Detection Accuracy</div>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-lg p-2 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content Panels */}
      <div className="space-y-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdvancedMLThreatDetectionCenter;