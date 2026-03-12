import React from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeLearningPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No real-time learning data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Live Updates</span>
            <Icon name="Zap" className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.liveUpdates}</div>
          <div className="mt-2 text-xs text-yellow-500">
            ⚡ Real-time processing
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pattern Improvements</span>
            <Icon name="TrendingUp" className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.patternImprovements}</div>
          <div className="mt-2 text-xs text-green-500">
            ↑ Continuous enhancement
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Threshold Optimizations</span>
            <Icon name="Sliders" className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.thresholdOptimizations}</div>
          <div className="mt-2 text-xs text-blue-500">
            🎯 Precision tuning
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-primary" />
          Live Algorithm Updates
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Pattern Recognition Update</div>
              <div className="text-xs text-muted-foreground">Velocity anomaly detection threshold adjusted</div>
            </div>
            <div className="text-xs text-muted-foreground">2 min ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Behavioral Model Refinement</div>
              <div className="text-xs text-muted-foreground">User behavior baseline updated with new patterns</div>
            </div>
            <div className="text-xs text-muted-foreground">5 min ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Geographic Clustering Enhancement</div>
              <div className="text-xs text-muted-foreground">Location-based fraud detection improved</div>
            </div>
            <div className="text-xs text-muted-foreground">8 min ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Confidence Scoring Optimization</div>
              <div className="text-xs text-muted-foreground">Detection confidence thresholds recalibrated</div>
            </div>
            <div className="text-xs text-muted-foreground">12 min ago</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" className="w-5 h-5 text-primary" />
          Performance Benchmarking
        </h3>
        <div className="space-y-6">
          {data?.performanceBenchmarks?.map((benchmark, index) => {
            const improvementColor = benchmark?.improvement > 0 ? 'text-green-500' : 'text-red-500';
            const improvementIcon = benchmark?.improvement > 0 ? 'TrendingUp' : 'TrendingDown';
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{benchmark?.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Baseline: {benchmark?.baseline}</span>
                    <Icon name="ArrowRight" className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Current: {benchmark?.current}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((benchmark?.current / benchmark?.baseline) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className={`flex items-center gap-1 ${improvementColor}`}>
                    <Icon name={improvementIcon} className="w-4 h-4" />
                    <span className="text-sm font-medium">{benchmark?.improvement > 0 ? '+' : ''}{benchmark?.improvement?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" className="w-5 h-5 text-primary" />
          Detection Threshold Optimization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Velocity Threshold</span>
              <span className="text-sm font-medium text-green-500">Optimized</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">142ms</div>
            <div className="text-xs text-muted-foreground">Previous: 180ms (-21.1%)</div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Confidence Threshold</span>
              <span className="text-sm font-medium text-green-500">Improved</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">0.87</div>
            <div className="text-xs text-muted-foreground">Previous: 0.82 (+6.1%)</div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Anomaly Sensitivity</span>
              <span className="text-sm font-medium text-green-500">Enhanced</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">94.7%</div>
            <div className="text-xs text-muted-foreground">Previous: 92.3% (+2.6%)</div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">False Positive Rate</span>
              <span className="text-sm font-medium text-green-500">Reduced</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">2.1%</div>
            <div className="text-xs text-muted-foreground">Previous: 4.8% (-56.3%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeLearningPanel;