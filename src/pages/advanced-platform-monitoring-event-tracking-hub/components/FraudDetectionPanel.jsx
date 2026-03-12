import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

import { platformMonitoringService } from '../../../services/platformMonitoringService';

const FraudDetectionPanel = ({ data, timeRange }) => {
  const [perplexityAnalysis, setPerplexityAnalysis] = React.useState(null);
  const [loadingPerplexity, setLoadingPerplexity] = React.useState(false);

  React.useEffect(() => {
    if (data?.details && data?.details?.length > 0) {
      loadPerplexityAnalysis();
    }
  }, [data]);

  const loadPerplexityAnalysis = async () => {
    setLoadingPerplexity(true);
    try {
      const anomalyData = {
        alerts: data?.details?.slice(0, 10),
        timeRange,
        metrics: {
          totalAlerts: data?.totalAlerts,
          truePositives: data?.truePositives,
          falsePositives: data?.falsePositives,
          precision: data?.precision,
          recall: data?.recall
        }
      };

      const result = await platformMonitoringService?.getPerplexityAnomalyAnalysis(anomalyData);
      if (result?.data) {
        setPerplexityAnalysis(result?.data);
      }
    } catch (error) {
      console.error('Failed to load Perplexity analysis:', error);
    } finally {
      setLoadingPerplexity(false);
    }
  };

  if (!data) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground text-center">No fraud detection data available</p>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Alerts',
      value: data?.totalAlerts || 0,
      icon: 'AlertTriangle',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'True Positives',
      value: data?.truePositives || 0,
      icon: 'CheckCircle',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'False Positives',
      value: data?.falsePositives || 0,
      icon: 'XCircle',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Precision Rate',
      value: `${data?.precision || 0}%`,
      icon: 'Target',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Recall Rate',
      value: `${data?.recall || 0}%`,
      icon: 'Activity',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Avg Response Time',
      value: `${data?.avgResponseTime || 0} min`,
      icon: 'Clock',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Fraud Detection Effectiveness
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of fraud detection accuracy and response metrics
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <Icon name="Shield" size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-500">
              {data?.avgEffectiveness || 0}% Effective
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics?.map((metric, index) => (
            <div key={index} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${metric?.bgColor} flex items-center justify-center`}>
                  <Icon name={metric?.icon} size={20} className={metric?.color} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{metric?.label}</p>
                  <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Detection Performance Analysis
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Precision (Accuracy of Alerts)</span>
              <span className="text-sm font-bold text-foreground">{data?.precision || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data?.precision || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Recall (Detection Coverage)</span>
              <span className="text-sm font-bold text-foreground">{data?.recall || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data?.recall || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall Effectiveness</span>
              <span className="text-sm font-bold text-foreground">{data?.avgEffectiveness || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data?.avgEffectiveness || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Key Insights & Recommendations
        </h3>
        <div className="space-y-3">
          {parseFloat(data?.precision) > 90 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-500 mb-1">Excellent Precision</p>
                <p className="text-xs text-muted-foreground">
                  Your fraud detection system maintains high accuracy with minimal false positives.
                </p>
              </div>
            </div>
          )}
          {parseFloat(data?.falsePositives) > 10 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Icon name="AlertTriangle" size={20} className="text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-500 mb-1">High False Positive Rate</p>
                <p className="text-xs text-muted-foreground">
                  Consider adjusting detection thresholds to reduce false alerts and improve efficiency.
                </p>
              </div>
            </div>
          )}
          {parseFloat(data?.avgResponseTime) > 60 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Icon name="Clock" size={20} className="text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">Response Time Optimization Needed</p>
                <p className="text-xs text-muted-foreground">
                  Average response time exceeds target. Consider automated response workflows.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {perplexityAnalysis && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Perplexity AI Threat Intelligence
                </h3>
                <p className="text-xs text-muted-foreground">Real-time anomaly correlation and pattern analysis</p>
              </div>
            </div>
            {loadingPerplexity && (
              <Icon name="Loader" size={20} className="animate-spin text-primary" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Target" size={16} className="text-purple-500" />
                <p className="text-xs text-muted-foreground">Correlation Score</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{perplexityAnalysis?.correlationScore || 0}%</p>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Layers" size={16} className="text-orange-500" />
                <p className="text-xs text-muted-foreground">Platforms Affected</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{perplexityAnalysis?.platformsAffected?.length || 0}</p>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Shield" size={16} className="text-cyan-500" />
                <p className="text-xs text-muted-foreground">Confidence Level</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{((perplexityAnalysis?.confidence || 0) * 100)?.toFixed(1)}%</p>
            </div>
          </div>

          {perplexityAnalysis?.correlatedAnomalies && perplexityAnalysis?.correlatedAnomalies?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground mb-2">Correlated Anomalies</p>
              <div className="space-y-2">
                {perplexityAnalysis?.correlatedAnomalies?.slice(0, 3)?.map((anomaly, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs">
                    <Icon name="AlertCircle" size={14} className="text-orange-500" />
                    <span className="text-foreground">{anomaly}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perplexityAnalysis?.attackCoordination && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="AlertTriangle" size={16} className="text-red-500" />
                <p className="text-sm font-semibold text-red-500">Coordinated Attack Detected</p>
              </div>
              <p className="text-xs text-muted-foreground">Multiple platforms showing synchronized anomaly patterns</p>
            </div>
          )}

          {perplexityAnalysis?.recommendations && perplexityAnalysis?.recommendations?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground mb-2">AI Recommendations</p>
              <div className="space-y-2">
                {perplexityAnalysis?.recommendations?.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-primary/5 rounded text-xs">
                    <Icon name="Lightbulb" size={14} className="text-primary mt-0.5" />
                    <span className="text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FraudDetectionPanel;