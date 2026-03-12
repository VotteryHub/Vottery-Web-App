import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const PredictiveModelingPanel = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();

    const handleRefresh = () => loadPredictions();
    window.addEventListener('ml-threat-refresh', handleRefresh);
    return () => window.removeEventListener('ml-threat-refresh', handleRefresh);
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await mlThreatDetectionService?.predictThreats();
      setPredictions(data);
    } catch (error) {
      console.error('Failed to load predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Running predictive models...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Threat Forecasts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          30-Day Threat Forecast
        </h3>
        <div className="space-y-3">
          {predictions?.forecasts?.map((forecast, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{forecast?.threatType}</h4>
                  <p className="text-sm text-muted-foreground">{forecast?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600 mb-1">{forecast?.probability}%</div>
                  <div className="text-xs text-muted-foreground">Probability</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Expected Impact:</span>
                  <span className="ml-2 font-medium text-foreground">{forecast?.impact}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="ml-2 font-medium text-foreground">{forecast?.timeframe}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2 font-medium text-foreground">{forecast?.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Vector Predictions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Predicted Attack Vectors
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {predictions?.attackVectors?.map((vector, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{vector?.name}</h4>
                <Icon name="AlertTriangle" size={16} className="text-red-600" />
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Likelihood</span>
                  <span className="font-medium text-foreground">{vector?.likelihood}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-red-600 h-2 rounded-full"
                    style={{ width: `${vector?.likelihood}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{vector?.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Timeline */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} />
          Risk Timeline (Next 30 Days)
        </h3>
        <div className="space-y-2">
          {predictions?.timeline?.map((event, index) => (
            <div key={index} className="flex items-center gap-4 p-3 border border-border rounded-lg">
              <div className="text-center min-w-[60px]">
                <div className="text-sm font-bold text-foreground">{event?.day}</div>
                <div className="text-xs text-muted-foreground">{event?.date}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground text-sm mb-1">{event?.event}</div>
                <div className="text-xs text-muted-foreground">{event?.details}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-600">{event?.riskScore}/10</div>
                <div className="text-xs text-muted-foreground">Risk</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveModelingPanel;