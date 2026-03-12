import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveAnalyticsPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground text-center">No predictive analytics data available</p>
      </div>
    );
  }

  const severityColors = {
    low: { color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
    medium: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/20' },
    high: { color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
    critical: { color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Predictive Fraud Analytics
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-powered fraud pattern forecasting and proactive recommendations
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Icon name="Brain" size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-purple-500">
              ML-Powered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Total Fraud Alerts</p>
                <p className="text-2xl font-bold text-foreground">{data?.totalFraudAlerts || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="TrendingUp" size={20} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Peak Hours Identified</p>
                <p className="text-2xl font-bold text-foreground">{data?.peakHours?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Severity Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(data?.severityDistribution || {})?.map(([severity, count]) => {
            const colors = severityColors?.[severity] || severityColors?.low;
            return (
              <div key={severity} className={`bg-background rounded-lg border ${colors?.borderColor} p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground capitalize">{severity}</span>
                  <span className={`text-lg font-bold ${colors?.color}`}>{count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${colors?.bgColor?.replace('/10', '')}`}
                    style={{ width: `${(count / (data?.totalFraudAlerts || 1)) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Peak Fraud Activity Hours
        </h3>
        <div className="space-y-3">
          {data?.peakHours?.map((peak, index) => (
            <div key={index} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {peak?.hour}:00 - {peak?.hour + 1}:00
                    </p>
                    <p className="text-xs text-muted-foreground">{peak?.count} fraud alerts detected</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Rank</p>
                  <p className="text-lg font-bold text-foreground">#{index + 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          AI-Powered Predictions
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Icon name="Brain" size={20} className="text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-500 mb-1">Fraud Pattern Forecast</p>
              <p className="text-xs text-muted-foreground mb-2">{data?.prediction}</p>
              <div className="flex items-center gap-2 text-xs text-purple-500">
                <Icon name="TrendingUp" size={12} />
                <span>Confidence: High</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon name="Lightbulb" size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500 mb-1">Recommended Action</p>
              <p className="text-xs text-muted-foreground">{data?.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Hourly Fraud Activity Distribution
        </h3>
        <div className="space-y-2">
          {Object.entries(data?.hourlyDistribution || {})?.map(([hour, count]) => {
            const maxCount = Math.max(...Object.values(data?.hourlyDistribution || {}));
            const percentage = (count / maxCount) * 100;
            return (
              <div key={hour} className="flex items-center gap-3">
                <span className="text-xs font-medium text-foreground w-12">{hour}:00</span>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      {count > 0 && (
                        <span className="text-xs font-medium text-white">{count}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Proactive Monitoring Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <Icon name="Shield" size={20} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-500 mb-1">Enhanced Monitoring</p>
              <p className="text-xs text-muted-foreground">
                Deploy additional fraud detection resources during identified peak hours to improve response time.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <Icon name="Bell" size={20} className="text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-500 mb-1">Alert Threshold Adjustment</p>
              <p className="text-xs text-muted-foreground">
                Consider lowering alert thresholds during high-risk periods to catch potential fraud earlier.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon name="Users" size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500 mb-1">Team Coordination</p>
              <p className="text-xs text-muted-foreground">
                Ensure adequate support team coverage during peak fraud activity hours for rapid response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsPanel;