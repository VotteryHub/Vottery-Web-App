import React from 'react';
import Icon from '../../../components/AppIcon';

const EngagementPredictionsPanel = ({ data }) => {
  const maxPredicted = Math.max(...(data?.predictions?.map(p => p?.confidenceHigh) || [0]));

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            7-Day Engagement Predictions
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <Icon name="Activity" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {((data?.confidence || 0) * 100)?.toFixed(0)}% Confidence
            </span>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <Icon name="TrendingUp" size={24} className="text-success mt-1" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Trend</p>
              <p className="text-lg font-semibold text-foreground">
                {data?.overallTrend || 'Loading predictions...'}
              </p>
            </div>
          </div>
        </div>

        {/* Predictions Chart */}
        <div className="space-y-3">
          {data?.predictions?.map((prediction, index) => {
            const isToday = index === 0;
            const barWidth = (prediction?.predicted / maxPredicted) * 100;
            const confidenceRange = prediction?.confidenceHigh - prediction?.confidenceLow;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg transition-all ${
                  isToday ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {new Date(prediction?.date)?.getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(prediction?.date)?.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      {isToday && (
                        <span className="text-xs text-primary font-medium">Today</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">
                      {prediction?.predicted?.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ±{confidenceRange?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Prediction Bar with Confidence Interval */}
                <div className="relative w-full bg-background rounded-full h-3 overflow-hidden">
                  {/* Confidence Range (lighter) */}
                  <div
                    className="absolute bg-primary/20 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(prediction?.confidenceHigh / maxPredicted) * 100}%`,
                      left: `${(prediction?.confidenceLow / maxPredicted) * 100}%`
                    }}
                  />
                  {/* Predicted Value (darker) */}
                  <div
                    className="absolute bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {/* Confidence Interval Labels */}
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>Low: {prediction?.confidenceLow?.toLocaleString()}</span>
                  <span>High: {prediction?.confidenceHigh?.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prediction Methodology */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-primary" />
          Prediction Methodology
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="Brain" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">AI Model</p>
              <p className="text-sm text-muted-foreground">
                Predictions generated using OpenAI GPT-5 with historical engagement data, 
                seasonal patterns, and trend analysis.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="BarChart3" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Confidence Intervals</p>
              <p className="text-sm text-muted-foreground">
                Shaded areas represent the range of likely outcomes. Narrower ranges indicate 
                higher prediction confidence.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="RefreshCw" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Real-time Updates</p>
              <p className="text-sm text-muted-foreground">
                Predictions are recalculated every hour based on the latest engagement data 
                and voting patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementPredictionsPanel;