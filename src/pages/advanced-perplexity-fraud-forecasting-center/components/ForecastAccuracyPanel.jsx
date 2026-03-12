import React from 'react';
import Icon from '../../../components/AppIcon';

const ForecastAccuracyPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Target" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No accuracy data available</p>
      </div>
    );
  }

  const { totalPredictions, accurateDetections, falsePositives, missedThreats, overallAccuracy } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Predictions</p>
              <p className="text-2xl font-bold text-foreground">{totalPredictions}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accurate Detections</p>
              <p className="text-2xl font-bold text-foreground">{accurateDetections}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">False Positives</p>
              <p className="text-2xl font-bold text-foreground">{falsePositives}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Icon name="XCircle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Missed Threats</p>
              <p className="text-2xl font-bold text-foreground">{missedThreats}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Overall Forecast Accuracy
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Accuracy Rate</span>
              <span className="text-2xl font-bold text-foreground">{overallAccuracy?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  overallAccuracy >= 90
                    ? 'bg-green-500'
                    : overallAccuracy >= 75
                    ? 'bg-yellow-500' :'bg-red-500'
                }`}
                style={{ width: `${overallAccuracy || 0}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              overallAccuracy >= 90
                ? 'bg-green-100 dark:bg-green-900/20'
                : overallAccuracy >= 75
                ? 'bg-yellow-100 dark:bg-yellow-900/20' :'bg-red-100 dark:bg-red-900/20'
            }`}>
              <span className={`text-3xl font-bold ${
                overallAccuracy >= 90
                  ? 'text-green-600'
                  : overallAccuracy >= 75
                  ? 'text-yellow-600' :'text-red-600'
              }`}>
                {overallAccuracy?.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} />
            Model Performance Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Precision</span>
              <span className="text-sm font-medium text-foreground">
                {totalPredictions > 0 ? ((accurateDetections / (accurateDetections + falsePositives)) * 100)?.toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Recall</span>
              <span className="text-sm font-medium text-foreground">
                {totalPredictions > 0 ? ((accurateDetections / (accurateDetections + missedThreats)) * 100)?.toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">F1 Score</span>
              <span className="text-sm font-medium text-foreground">
                {totalPredictions > 0 ? (
                  (2 * (accurateDetections / (accurateDetections + falsePositives)) * (accurateDetections / (accurateDetections + missedThreats)) / 
                  ((accurateDetections / (accurateDetections + falsePositives)) + (accurateDetections / (accurateDetections + missedThreats)))) * 100
                )?.toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="BarChart2" size={20} />
            Detection Breakdown
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Accurate Detections</span>
                <span className="text-sm font-medium text-green-600">
                  {totalPredictions > 0 ? ((accurateDetections / totalPredictions) * 100)?.toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${totalPredictions > 0 ? (accurateDetections / totalPredictions) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">False Positives</span>
                <span className="text-sm font-medium text-yellow-600">
                  {totalPredictions > 0 ? ((falsePositives / totalPredictions) * 100)?.toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-yellow-500"
                  style={{ width: `${totalPredictions > 0 ? (falsePositives / totalPredictions) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Missed Threats</span>
                <span className="text-sm font-medium text-red-600">
                  {totalPredictions > 0 ? ((missedThreats / totalPredictions) * 100)?.toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${totalPredictions > 0 ? (missedThreats / totalPredictions) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} />
          Model Retraining Recommendations
        </h3>
        <div className="space-y-2">
          {overallAccuracy < 75 && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
              <p className="text-sm text-foreground">Model accuracy below threshold. Immediate retraining recommended.</p>
            </div>
          )}
          {falsePositives > totalPredictions * 0.2 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <Icon name="AlertCircle" size={16} className="text-yellow-600 mt-0.5" />
              <p className="text-sm text-foreground">High false positive rate detected. Consider adjusting threshold parameters.</p>
            </div>
          )}
          {overallAccuracy >= 90 && (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5" />
              <p className="text-sm text-foreground">Model performing excellently. Continue monitoring for drift.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForecastAccuracyPanel;