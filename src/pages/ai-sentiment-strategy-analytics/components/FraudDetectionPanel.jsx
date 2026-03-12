import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const FraudDetectionPanel = ({ data }) => {
  const [loading, setLoading] = React.useState(false);
  
  const getRiskColor = (riskLevel) => {
    switch(riskLevel?.toLowerCase()) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (riskLevel) => {
    switch(riskLevel?.toLowerCase()) {
      case 'critical': return 'bg-destructive/10 border-destructive/30';
      case 'high': return 'bg-warning/10 border-warning/30';
      case 'medium': return 'bg-warning/10 border-warning/30';
      case 'low': return 'bg-success/10 border-success/30';
      default: return 'bg-muted/50 border-border';
    }
  };

  const getActionIcon = (action) => {
    switch(action?.toLowerCase()) {
      case 'block': return 'XCircle';
      case 'investigate': return 'Search';
      case 'flag': return 'Flag';
      case 'monitor': return 'Eye';
      default: return 'AlertTriangle';
    }
  };

  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      // Analysis logic here
      
      // Track fraud detection analysis
      analytics?.trackEvent('ai_fraud_analysis_run', {
        analysis_type: 'fraud_detection',
        timestamp: new Date()?.toISOString()
      });
      
    } catch (err) {
      console.error('Failed to run analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Fraud Score Overview */}
      <div className={`card p-6 border ${getRiskBgColor(data?.riskLevel)}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            AI Fraud Risk Analysis
          </h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getRiskBgColor(data?.riskLevel)}`}>
            <Icon name="Shield" size={16} className={getRiskColor(data?.riskLevel)} />
            <span className={`text-sm font-medium uppercase ${getRiskColor(data?.riskLevel)}`}>
              {data?.riskLevel || 'Unknown'} Risk
            </span>
          </div>
        </div>

        {/* Fraud Score Gauge */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(data?.fraudScore || 0) * 5.03} 503`}
                className={getRiskColor(data?.riskLevel)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">
                {data?.fraudScore || 0}
              </span>
              <span className="text-sm text-muted-foreground">Fraud Score</span>
            </div>
          </div>
        </div>

        {/* Confidence & Action */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-card rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">Confidence</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {((data?.confidence || 0) * 100)?.toFixed(0)}%
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Icon name={getActionIcon(data?.recommendedAction)} size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">Action</span>
            </div>
            <p className="text-lg font-bold text-foreground capitalize">
              {data?.recommendedAction || 'Monitor'}
            </p>
          </div>
        </div>
      </div>

      {/* Suspicious Indicators */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          Suspicious Indicators Detected
        </h3>
        <div className="space-y-2">
          {data?.suspiciousIndicators?.map((indicator, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-warning/5 rounded-lg border border-warning/20"
            >
              <Icon name="AlertCircle" size={18} className="text-warning mt-0.5" />
              <p className="text-sm text-foreground">{indicator}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Types */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-primary" />
          Anomaly Types
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data?.anomalyTypes?.map((type, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
            >
              <Icon name="Zap" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          AI Analysis Reasoning
        </h3>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">
            {data?.reasoning || 'No reasoning available'}
          </p>
        </div>
      </div>

      {/* Detection Info */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <Icon name="Info" size={20} className="text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            Automated Fraud Detection
          </p>
          <p className="text-sm text-muted-foreground">
            This analysis is powered by OpenAI GPT-5 with advanced reasoning capabilities. 
            High-risk patterns automatically trigger alerts and can initiate preventive actions 
            before platform manipulation occurs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionPanel;