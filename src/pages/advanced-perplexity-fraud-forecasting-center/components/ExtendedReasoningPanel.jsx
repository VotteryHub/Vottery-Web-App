import React from 'react';
import Icon from '../../../components/AppIcon';

const ExtendedReasoningPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Brain" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No reasoning data available</p>
      </div>
    );
  }

  const { reasoning, behavioralEvolution, transactionAnomalies, crossPlatformThreats } = data;

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} />
          Extended Reasoning Analysis
        </h3>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-foreground whitespace-pre-wrap">{reasoning}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Behavioral Pattern Evolution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {behavioralEvolution && Object.entries(behavioralEvolution)?.map(([key, value]) => (
            <div key={key} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-1">
                {key?.replace(/_/g, ' ')?.toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertCircle" size={20} />
          Transaction Anomaly Predictions
        </h3>
        <div className="space-y-3">
          {transactionAnomalies?.map((anomaly, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {anomaly?.type || anomaly?.anomalyType || 'Unknown Anomaly'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {anomaly?.description || 'No description available'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  (anomaly?.severity || anomaly?.riskLevel) === 'critical' ?'bg-red-100 text-red-600 dark:bg-red-900/20'
                    : (anomaly?.severity || anomaly?.riskLevel) === 'high' ?'bg-orange-100 text-orange-600 dark:bg-orange-900/20' :'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                }`}>
                  {(anomaly?.severity || anomaly?.riskLevel || 'medium')?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Share2" size={20} />
          Cross-Platform Threat Correlation
        </h3>
        <div className="space-y-3">
          {crossPlatformThreats?.map((threat, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">
                  {threat?.platform || threat?.source || 'Unknown Platform'}
                </p>
                <span className="text-xs text-muted-foreground">
                  Correlation: {((threat?.correlation || 0) * 100)?.toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {threat?.description || threat?.pattern || 'No details available'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtendedReasoningPanel;