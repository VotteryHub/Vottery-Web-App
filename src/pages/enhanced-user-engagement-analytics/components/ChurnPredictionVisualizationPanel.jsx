import React from 'react';
import Icon from '../../../components/AppIcon';

const ChurnPredictionVisualizationPanel = ({ data, predictiveMetrics, timeframe }) => {
  const getRiskColor = (riskLevel) => {
    if (riskLevel === 'high') return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
    if (riskLevel === 'medium') return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' };
    return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
  };

  const churnRate = parseFloat(data?.churnRate) || 0;
  const riskLevel = churnRate > 15 ? 'high' : churnRate > 8 ? 'medium' : 'low';
  const riskColors = getRiskColor(riskLevel);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <Icon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Churn Prediction Visualization</h2>
          <p className="text-sm text-muted-foreground">
            ML-powered risk scoring with early warning indicators • {timeframe}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className={`${riskColors?.bg} border ${riskColors?.border} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">At-Risk Users</p>
            <Icon name="Users" size={20} className={riskColors?.text} />
          </div>
          <p className={`text-4xl font-bold ${riskColors?.text}`}>{data?.atRiskUsers?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Predicted to churn</p>
        </div>

        <div className={`${riskColors?.bg} border ${riskColors?.border} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Churn Rate</p>
            <Icon name="TrendingDown" size={20} className={riskColors?.text} />
          </div>
          <p className={`text-4xl font-bold ${riskColors?.text}`}>{data?.churnRate}</p>
          <p className="text-xs text-muted-foreground mt-1">Next 30 days forecast</p>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Risk Level</p>
            <Icon name="Shield" size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 capitalize">{riskLevel}</p>
          <p className="text-xs text-muted-foreground mt-1">Overall platform risk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-foreground mb-3">Key Churn Risk Factors</h3>
          <div className="space-y-2">
            {data?.riskFactors?.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <Icon name="AlertCircle" size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                <p className="text-sm text-foreground">{factor}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Prevention Strategies</h3>
          <div className="space-y-2">
            {data?.preventionStrategies?.map((strategy, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                <p className="text-sm text-foreground">{strategy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {predictiveMetrics?.engagementForecast && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="TrendingUp" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Engagement Forecast</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Current Rate</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {predictiveMetrics?.engagementForecast?.currentRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Predicted Rate</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {predictiveMetrics?.engagementForecast?.predictedRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Trend</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 capitalize">
                    {predictiveMetrics?.engagementForecast?.trend}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurnPredictionVisualizationPanel;