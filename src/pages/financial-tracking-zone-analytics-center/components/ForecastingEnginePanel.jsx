import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ForecastingEnginePanel = ({ forecasts, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const forecastChartData = forecasts?.slice(0, 8)?.map((forecast, index) => ({
    zone: forecast?.zone?.replace('_', ' ')?.toUpperCase(),
    current: parseFloat(forecast?.currentValue || 0) / 1000,
    predicted: parseFloat(forecast?.predictedValue || 0) / 1000,
    confidence: forecast?.confidenceLevel
  }));

  const getConfidenceBadge = (level) => {
    const badges = {
      high: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'High Confidence' },
      medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Medium Confidence' },
      low: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Low Confidence' }
    };
    return badges?.[level] || badges?.medium;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Forecasting Engine
            </h2>
            <p className="text-sm text-muted-foreground">
              Predictive analytics with ML algorithms, confidence intervals, and scenario modeling
            </p>
          </div>
          <Icon name="TrendingUp" size={24} className="text-primary" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Revenue Projections by Zone
          </h3>
          <div className="w-full h-80" aria-label="Forecast Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="zone" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" label={{ value: 'Amount (K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="current" stroke="#2563EB" strokeWidth={2} name="Current Value (K)" />
                <Line type="monotone" dataKey="predicted" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" name="Predicted Value (K)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecasts?.slice(0, 6)?.map((forecast, index) => {
            const badge = getConfidenceBadge(forecast?.confidenceLevel);
            const growth = ((parseFloat(forecast?.predictedValue) - parseFloat(forecast?.currentValue)) / parseFloat(forecast?.currentValue) * 100)?.toFixed(1);
            
            return (
              <div key={index} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={16} className="text-primary" />
                    <span className="font-heading font-semibold text-foreground text-sm">
                      {forecast?.zone?.replace('_', ' ')?.toUpperCase()} - {forecast?.forecastType?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full ${badge?.bg}`}>
                    <span className={`text-xs font-medium ${badge?.color}`}>{badge?.label}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                    <p className="text-lg font-heading font-bold text-foreground font-data">
                      ₹{forecast?.currentValue?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Predicted Value</p>
                    <p className="text-lg font-heading font-bold text-green-500 font-data">
                      ₹{forecast?.predictedValue?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="TrendingUp" size={14} className="text-green-500" />
                  <span className="text-sm font-medium text-green-500">+{growth}% projected growth</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Forecast Period: {forecast?.forecastPeriod}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-yellow-500" />
          ML Model Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">94.2%</div>
            <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">v2.5.1</div>
            <div className="text-sm text-muted-foreground">Model Version</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">15 min</div>
            <div className="text-sm text-muted-foreground">Update Frequency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastingEnginePanel;