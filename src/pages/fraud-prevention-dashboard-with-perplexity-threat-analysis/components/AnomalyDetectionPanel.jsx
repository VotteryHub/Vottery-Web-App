import React from 'react';
import Icon from '../../../components/AppIcon';

const AnomalyDetectionPanel = ({ anomalyData, onRefresh }) => {
  if (!anomalyData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No anomaly detection data available</p>
      </div>
    );
  }

  const { predictions, emergingThreats, behavioralAnomalies, zoneVulnerabilities, mlConfidence, threatScore, reasoning } = anomalyData;

  const getThreatColor = (score) => {
    if (score >= 75) return 'text-red-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Threat Score</h3>
            <Icon name="Shield" size={20} className={getThreatColor(threatScore)} />
          </div>
          <div className={`text-3xl font-bold ${getThreatColor(threatScore)}`}>
            {threatScore}/100
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {threatScore >= 75 ? 'Critical Risk' : threatScore >= 50 ? 'Elevated Risk' : 'Normal'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">ML Confidence</h3>
            <Icon name="Brain" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">
            {(mlConfidence * 100)?.toFixed(0)}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">Detection accuracy</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Active Threats</h3>
            <Icon name="AlertTriangle" size={20} className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500">
            {emergingThreats?.length || 0}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Requires attention</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          Fraud Predictions (30/60/90 Days)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions?.map((prediction, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground mb-2">{prediction?.timeframe} Days</p>
              <p className="text-2xl font-bold text-foreground mb-2">{(prediction?.fraudProbability * 100)?.toFixed(1)}%</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Low:</span>
                  <span className="font-medium">{(prediction?.confidenceInterval?.low * 100)?.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>High:</span>
                  <span className="font-medium">{(prediction?.confidenceInterval?.high * 100)?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-red-500" />
          Emerging Threats
        </h3>
        <div className="space-y-3">
          {emergingThreats?.map((threat, index) => (
            <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-red-700">{threat?.threatType}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  threat?.impactScore >= 8 ? 'bg-red-100 text-red-700' :
                  threat?.impactScore >= 5 ? 'bg-yellow-100 text-yellow-700': 'bg-green-100 text-green-700'
                }`}>
                  Impact: {threat?.impactScore}/10
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-red-600">Probability</p>
                  <p className="font-medium text-red-700">{(threat?.probability * 100)?.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-red-600">Detected</p>
                  <p className="font-medium text-red-700">{threat?.detectionDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Activity" size={20} className="text-primary" />
            Behavioral Anomalies
          </h3>
          <div className="space-y-3">
            {behavioralAnomalies?.map((anomaly, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{anomaly?.behavior}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    anomaly?.severity === 'high' ? 'bg-red-100 text-red-700' :
                    anomaly?.severity === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {anomaly?.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{anomaly?.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Map" size={20} className="text-primary" />
            Zone Vulnerabilities
          </h3>
          <div className="space-y-2">
            {Object.entries(zoneVulnerabilities || {})?.map(([zone, risk], index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{zone}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        risk >= 75 ? 'bg-red-500' :
                        risk >= 50 ? 'bg-yellow-500': 'bg-green-500'
                      }`}
                      style={{ width: `${risk}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">{risk}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          AI Reasoning & Chain-of-Thought Analysis
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={16} className="text-green-500" />
            <span className="text-sm text-muted-foreground">
              Detection Confidence: <span className="font-semibold text-foreground">{(mlConfidence * 100)?.toFixed(1)}%</span>
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            <Icon name="RefreshCw" size={14} />
            <span>Refresh Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetectionPanel;