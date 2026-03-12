import React from 'react';
import Icon from '../../../components/AppIcon';

const ExtendedForecastingPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No extended forecasting data available</p>
      </div>
    );
  }

  const mockPredictions = data?.predictions || [
    { timeframe: '30 days', fraudProbability: 0.34, confidenceInterval: [0.28, 0.41], threatScore: 67 },
    { timeframe: '60 days', fraudProbability: 0.42, confidenceInterval: [0.35, 0.49], threatScore: 74 },
    { timeframe: '90 days', fraudProbability: 0.51, confidenceInterval: [0.43, 0.59], threatScore: 82 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" className="w-5 h-5 text-primary" />
          60-90 Day Threat Probability Matrices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockPredictions?.map((prediction, index) => {
            const probabilityPercent = (prediction?.fraudProbability * 100)?.toFixed(1);
            const threatColor = prediction?.threatScore >= 80 ? 'red' : prediction?.threatScore >= 70 ? 'orange' : 'yellow';
            
            return (
              <div key={index} className="p-6 bg-muted rounded-lg border-2 border-border hover:border-primary transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">{prediction?.timeframe}</span>
                  <Icon name="Calendar" className="w-5 h-5 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">{probabilityPercent}%</div>
                <div className="text-xs text-muted-foreground mb-3">
                  Fraud Probability
                </div>
                <div className="w-full bg-background rounded-full h-3 mb-3">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${
                      threatColor === 'red' ? 'from-red-500 to-red-600' :
                      threatColor === 'orange'? 'from-orange-500 to-orange-600' : 'from-yellow-500 to-yellow-600'
                    }`}
                    style={{ width: `${probabilityPercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence Interval</span>
                  <span className="font-medium text-foreground">
                    {(prediction?.confidenceInterval?.[0] * 100)?.toFixed(0)}% - {(prediction?.confidenceInterval?.[1] * 100)?.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Threat Score</span>
                    <span className={`text-sm font-bold ${
                      threatColor === 'red' ? 'text-red-500' :
                      threatColor === 'orange'? 'text-orange-500' : 'text-yellow-500'
                    }`}>
                      {prediction?.threatScore}/100
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" className="w-5 h-5 text-primary" />
          Deep Contextual Analysis
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Icon name="Users" className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="font-medium text-foreground">Behavioral Pattern Evolution</div>
                <div className="text-sm text-muted-foreground">Analyzing user behavior trends over 90-day horizon</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center p-2 bg-background rounded">
                <div className="text-xs text-muted-foreground mb-1">Normal Behavior</div>
                <div className="text-lg font-bold text-green-500">78%</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-xs text-muted-foreground mb-1">Anomalous</div>
                <div className="text-lg font-bold text-orange-500">18%</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="text-xs text-muted-foreground mb-1">Suspicious</div>
                <div className="text-lg font-bold text-red-500">4%</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Icon name="Activity" className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-foreground">Transaction Anomaly Prediction</div>
                <div className="text-sm text-muted-foreground">Forecasting unusual transaction patterns</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-muted-foreground">Predicted Anomaly Rate</span>
              <span className="text-lg font-bold text-foreground">6.7%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mt-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon name="GitBranch" className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="font-medium text-foreground">Cross-Platform Threat Correlation</div>
                <div className="text-sm text-muted-foreground">Identifying coordinated threats across zones</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-2 bg-background rounded">
                <div className="text-xs text-muted-foreground mb-1">Correlation Strength</div>
                <div className="text-lg font-bold text-foreground">0.84</div>
              </div>
              <div className="p-2 bg-background rounded">
                <div className="text-xs text-muted-foreground mb-1">Affected Zones</div>
                <div className="text-lg font-bold text-foreground">5/8</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" className="w-5 h-5 text-primary" />
          Long-Term Prediction Horizons
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium text-foreground">Statistical Modeling Confidence</div>
              <div className="text-sm text-muted-foreground">Overall prediction reliability</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">{(data?.mlConfidence * 100 || 87)?.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">High confidence</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Prediction Accuracy (Historical)</div>
              <div className="text-3xl font-bold text-foreground mb-2">91.3%</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <Icon name="TrendingUp" className="w-3 h-3" />
                +3.2% from last quarter
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Risk Assessment Score</div>
              <div className="text-3xl font-bold text-orange-500 mb-2">{data?.threatScore || 74}/100</div>
              <div className="text-xs text-orange-500">Elevated threat level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendedForecastingPanel;