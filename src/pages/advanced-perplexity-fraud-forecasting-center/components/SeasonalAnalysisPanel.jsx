import React from 'react';
import Icon from '../../../components/AppIcon';

const SeasonalAnalysisPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No seasonal data available</p>
      </div>
    );
  }

  const { seasonalCycles, holidayVulnerabilities, peakPeriods, alertTriggers } = data;

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} />
          Historical Fraud Pattern Cycles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {seasonalCycles?.map((cycle, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">{cycle?.season}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fraud Rate:</span>
                  <span className="font-medium text-foreground">{cycle?.fraudRate?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Historical Avg:</span>
                  <span className="font-medium text-foreground">{cycle?.historicalAverage?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Variance:</span>
                  <span className={`font-medium ${
                    cycle?.variance > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {cycle?.variance > 0 ? '+' : ''}{cycle?.variance?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Gift" size={20} />
          Holiday-Period Vulnerability Predictions
        </h3>
        <div className="space-y-3">
          {holidayVulnerabilities?.map((holiday, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{holiday?.holiday}</p>
                  <p className="text-xs text-muted-foreground">
                    Predicted Increase: +{holiday?.predictedIncrease?.toFixed(1)}%
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  holiday?.riskLevel === 'critical' ?'bg-red-100 text-red-600 dark:bg-red-900/20'
                    : holiday?.riskLevel === 'high' ?'bg-orange-100 text-orange-600 dark:bg-orange-900/20' :'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                }`}>
                  {holiday?.riskLevel?.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Prevention Strategies:</p>
                {holiday?.preventionStrategies?.map((strategy, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={12} className="text-green-600 mt-0.5" />
                    <p className="text-xs text-muted-foreground">{strategy}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} />
          Peak Fraud Periods
        </h3>
        <div className="space-y-3">
          {peakPeriods?.map((period, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(period?.startDate)?.toLocaleDateString()} - {new Date(period?.endDate)?.toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  period?.riskLevel === 'critical' ?'bg-red-100 text-red-600 dark:bg-red-900/20'
                    : period?.riskLevel === 'high' ?'bg-orange-100 text-orange-600 dark:bg-orange-900/20' :'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                }`}>
                  {period?.riskLevel?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Automated Alert Triggers
        </h3>
        <div className="space-y-3">
          {alertTriggers?.map((trigger, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">{trigger?.condition}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Threshold: {trigger?.threshold}
                  </p>
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={12} className="text-primary" />
                    <p className="text-xs text-primary font-medium">{trigger?.action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalAnalysisPanel;