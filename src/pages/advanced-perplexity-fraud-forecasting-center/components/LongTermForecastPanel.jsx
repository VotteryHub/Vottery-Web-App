import React from 'react';
import Icon from '../../../components/AppIcon';

const LongTermForecastPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="card p-8 text-center">
        <Icon name="TrendingUp" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No forecast data available</p>
      </div>
    );
  }

  const { longTermTrends, forecastAccuracy, modelConfidence, timeframe } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Forecast Timeframe</p>
              <p className="text-2xl font-bold text-foreground">{timeframe} Days</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="Target" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
              <p className="text-2xl font-bold text-foreground">
                {((forecastAccuracy || 0) * 100)?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Icon name="Brain" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model Confidence</p>
              <p className="text-2xl font-bold text-foreground">
                {((modelConfidence || 0) * 100)?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Long-Term Fraud Trend Predictions
        </h3>
        <div className="space-y-3">
          {longTermTrends?.slice(0, 10)?.map((trend, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{trend?.date}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  trend?.fraudProbability > 0.7
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/20'
                    : trend?.fraudProbability > 0.4
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' :'bg-green-100 text-green-600 dark:bg-green-900/20'
                }`}>
                  {(trend?.fraudProbability * 100)?.toFixed(1)}% Risk
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      trend?.fraudProbability > 0.7
                        ? 'bg-red-500'
                        : trend?.fraudProbability > 0.4
                        ? 'bg-yellow-500' :'bg-green-500'
                    }`}
                    style={{ width: `${(trend?.fraudProbability || 0) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  CI: ±{((trend?.confidenceInterval || 0) * 100)?.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongTermForecastPanel;