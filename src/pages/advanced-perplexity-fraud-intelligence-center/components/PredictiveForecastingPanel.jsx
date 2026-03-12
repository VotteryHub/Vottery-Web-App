import React from 'react';
import Icon from '../../../components/AppIcon';


const PredictiveForecastingPanel = ({ forecastingData, zones, onRefresh }) => {
  const predictions = forecastingData?.predictions || [
    { timeframe: '30 days', fraudProbability: 12.5, confidenceInterval: [10.2, 14.8], trend: 'increasing' },
    { timeframe: '60 days', fraudProbability: 18.3, confidenceInterval: [15.1, 21.5], trend: 'increasing' },
    { timeframe: '90 days', fraudProbability: 23.7, confidenceInterval: [19.8, 27.6], trend: 'stable' }
  ];

  const emergingThreats = forecastingData?.emergingThreats || [
    { name: 'Coordinated Account Takeover', severity: 'high', probability: 0.78, affectedZones: ['Zone 1', 'Zone 2', 'Zone 3'] },
    { name: 'Synthetic Identity Fraud', severity: 'critical', probability: 0.85, affectedZones: ['Zone 4', 'Zone 5'] },
    { name: 'Payment Card Testing', severity: 'medium', probability: 0.62, affectedZones: ['Zone 6', 'Zone 7', 'Zone 8'] }
  ];

  const behavioralAnomalies = forecastingData?.behavioralAnomalies || [
    { pattern: 'Unusual voting velocity spikes', frequency: 'Daily', riskScore: 82 },
    { pattern: 'Geographic clustering anomalies', frequency: 'Weekly', riskScore: 75 },
    { pattern: 'Temporal pattern deviations', frequency: 'Hourly', riskScore: 68 }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    };
    return colors?.[severity] || colors?.medium;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return 'TrendingUp';
    if (trend === 'decreasing') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">Predictive Fraud Forecasting</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">ML Confidence:</span>
            <span className="text-sm font-bold text-primary font-data">{((forecastingData?.mlConfidence || 0.89) * 100)?.toFixed(1)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {predictions?.map((pred, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{pred?.timeframe}</span>
                <Icon name={getTrendIcon(pred?.trend)} size={18} className="text-primary" />
              </div>
              <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
                {pred?.fraudProbability}%
              </div>
              <div className="text-xs text-muted-foreground">
                CI: {pred?.confidenceInterval?.[0]}% - {pred?.confidenceInterval?.[1]}%
              </div>
            </div>
          ))}
        </div>

        {forecastingData?.reasoning && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Icon name="Brain" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">AI Reasoning Analysis</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">{forecastingData?.reasoning}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Emerging Threat Vectors</h3>
          <div className="space-y-3">
            {emergingThreats?.map((threat, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{threat?.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getSeverityColor(threat?.severity)}`}>
                        {threat?.severity}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Probability: <span className="font-bold font-data">{(threat?.probability * 100)?.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {threat?.affectedZones?.map((zone, zIndex) => (
                    <span key={zIndex} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Behavioral Anomaly Patterns</h3>
          <div className="space-y-3">
            {behavioralAnomalies?.map((anomaly, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{anomaly?.pattern}</span>
                  <span className="text-sm font-bold text-primary font-data">{anomaly?.riskScore}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Frequency: {anomaly?.frequency}</span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
                    style={{ width: `${anomaly?.riskScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {forecastingData?.searchResults && forecastingData?.searchResults?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Threat Intelligence Sources</h3>
          <div className="space-y-2">
            {forecastingData?.searchResults?.slice(0, 5)?.map((result, index) => (
              <a
                key={index}
                href={result?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Icon name="ExternalLink" size={16} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-1">{result?.title}</h4>
                    {result?.snippet && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{result?.snippet}</p>
                    )}
                    {result?.date && (
                      <p className="text-xs text-muted-foreground mt-1">Published: {result?.date}</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveForecastingPanel;