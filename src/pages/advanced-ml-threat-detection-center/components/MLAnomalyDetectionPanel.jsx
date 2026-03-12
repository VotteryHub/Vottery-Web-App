import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const MLAnomalyDetectionPanel = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modelMetrics, setModelMetrics] = useState(null);

  useEffect(() => {
    loadAnomalies();

    const handleRefresh = () => loadAnomalies();
    window.addEventListener('ml-threat-refresh', handleRefresh);
    return () => window.removeEventListener('ml-threat-refresh', handleRefresh);
  }, []);

  const loadAnomalies = async () => {
    try {
      setLoading(true);
      const data = await mlThreatDetectionService?.detectAnomalies();
      setAnomalies(data?.anomalies || []);
      setModelMetrics(data?.modelMetrics || null);
    } catch (error) {
      console.error('Failed to load anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-blue-600 bg-blue-100'
    };
    return colors?.[severity] || colors?.low;
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Running ML anomaly detection models...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Performance Metrics */}
      {modelMetrics && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Activity" size={20} />
            ML Model Performance
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{modelMetrics?.accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{modelMetrics?.precision}%</div>
              <div className="text-xs text-muted-foreground">Precision</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{modelMetrics?.recall}%</div>
              <div className="text-xs text-muted-foreground">Recall</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{modelMetrics?.f1Score}%</div>
              <div className="text-xs text-muted-foreground">F1 Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Detected Anomalies */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} />
            Detected Anomalies ({anomalies?.length || 0})
          </h3>
          <button
            onClick={loadAnomalies}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            <Icon name="RefreshCw" size={14} />
            Refresh
          </button>
        </div>

        {anomalies?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-green-600 mx-auto mb-3" />
            <p className="text-muted-foreground">No anomalies detected. System operating normally.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies?.map((anomaly, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(anomaly?.severity)}`}>
                        {anomaly?.severity?.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{anomaly?.timestamp}</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{anomaly?.type}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{anomaly?.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600 mb-1">{anomaly?.anomalyScore}%</div>
                    <div className="text-xs text-muted-foreground">Anomaly Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="ml-2 font-medium text-foreground">{anomaly?.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Model:</span>
                    <span className="ml-2 font-medium text-foreground">{anomaly?.model}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Affected:</span>
                    <span className="ml-2 font-medium text-foreground">{anomaly?.affectedEntities}</span>
                  </div>
                </div>

                {anomaly?.indicators && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2">Key Indicators:</div>
                    <div className="flex flex-wrap gap-2">
                      {anomaly?.indicators?.map((indicator, idx) => (
                        <span key={idx} className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MLAnomalyDetectionPanel;