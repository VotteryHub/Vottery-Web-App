import React from 'react';
import Icon from '../../../components/AppIcon';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

const PredictiveModeling = ({ data }) => {
  const forecastData = [
    { month: 'Jan', actual: 165, predicted: 165, confidence: { low: 160, high: 170 } },
    { month: 'Feb', actual: 172, predicted: 172, confidence: { low: 168, high: 176 } },
    { month: 'Mar', actual: 178, predicted: 178, confidence: { low: 174, high: 182 } },
    { month: 'Apr', actual: null, predicted: 185, confidence: { low: 180, high: 190 } },
    { month: 'May', actual: null, predicted: 192, confidence: { low: 186, high: 198 } },
    { month: 'Jun', actual: null, predicted: 198, confidence: { low: 191, high: 205 } }
  ];

  const seasonalTrends = [
    { period: 'Q1', trend: 'Moderate Growth', impact: '+8%', recommendation: 'Maintain current strategy' },
    { period: 'Q2', trend: 'Strong Growth', impact: '+15%', recommendation: 'Increase budget allocation' },
    { period: 'Q3', trend: 'Peak Season', impact: '+22%', recommendation: 'Maximize campaign spend' },
    { period: 'Q4', trend: 'Holiday Surge', impact: '+28%', recommendation: 'Launch special campaigns' }
  ];

  const spendingOptimization = [
    { scenario: 'Conservative', budget: 120000, projectedROI: 165, risk: 'Low' },
    { scenario: 'Current', budget: 145670, projectedROI: 185, risk: 'Medium' },
    { scenario: 'Aggressive', budget: 180000, projectedROI: 205, risk: 'High' },
    { scenario: 'Optimal', budget: 156800, projectedROI: 198, risk: 'Medium-Low' }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': case'Medium-Low':
        return 'text-success';
      case 'Medium':
        return 'text-yellow-600';
      case 'High':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Predictive Modeling & Forecasting
            </h2>
            <p className="text-sm text-muted-foreground">
              Machine learning-powered ROI predictions and trend analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="TrendingUp" size={24} className="text-success" />
            <span className="text-sm font-medium text-success">ML Powered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-success/10">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={18} className="text-success" />
              <span className="text-sm text-muted-foreground">Projected ROI (6mo)</span>
            </div>
            <p className="text-2xl font-heading font-bold text-success font-data">
              {data?.predictions?.projectedROI || 0}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={18} className="text-primary" />
              <span className="text-sm text-muted-foreground">Seasonal Trend</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground capitalize">
              {data?.predictions?.seasonalTrend || 'Stable'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="DollarSign" size={18} className="text-accent" />
              <span className="text-sm text-muted-foreground">Optimal Spending</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground font-data">
              ${(data?.predictions?.optimalSpending || 0)?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            6-Month ROI Forecast
          </h3>
          <div className="w-full h-80" aria-label="ROI Forecast Chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="confidence.high"
                  stroke="none"
                  fill="#2563EB"
                  fillOpacity={0.1}
                  name="Confidence Range"
                />
                <Area
                  type="monotone"
                  dataKey="confidence.low"
                  stroke="none"
                  fill="#ffffff"
                  fillOpacity={1}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#059669"
                  strokeWidth={3}
                  name="Actual ROI"
                  dot={{ fill: '#059669', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted ROI"
                  dot={{ fill: '#2563EB', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Seasonal Trends
            </h2>
            <Icon name="Calendar" size={24} className="text-primary" />
          </div>
          <div className="space-y-3">
            {seasonalTrends?.map((trend, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{trend?.period}</span>
                  <span className="text-sm font-bold text-success font-data">{trend?.impact}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{trend?.trend}</p>
                <p className="text-xs text-primary font-medium">
                  <Icon name="Lightbulb" size={12} className="inline mr-1" />
                  {trend?.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Optimal Spending Scenarios
            </h2>
            <Icon name="BarChart3" size={24} className="text-accent" />
          </div>
          <div className="space-y-3">
            {spendingOptimization?.map((scenario, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  scenario?.scenario === 'Optimal' ?'border-success bg-success/10' :'border-border bg-card'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{scenario?.scenario}</span>
                    {scenario?.scenario === 'Optimal' && (
                      <Icon name="Star" size={14} className="text-success" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${getRiskColor(scenario?.risk)}`}>
                    {scenario?.risk} Risk
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="text-sm font-semibold text-foreground font-data">
                      ${scenario?.budget?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Projected ROI</p>
                    <p className="text-sm font-semibold text-success font-data">
                      {scenario?.projectedROI}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Competitive Benchmarking
          </h2>
          <Icon name="Award" size={24} className="text-accent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-success/10">
            <p className="text-sm text-muted-foreground mb-2">Your ROI</p>
            <p className="text-3xl font-heading font-bold text-success mb-1 font-data">185%</p>
            <p className="text-xs text-muted-foreground">Top 15% in industry</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Industry Average</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-1 font-data">142%</p>
            <p className="text-xs text-success font-medium">+43% above average</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Top Performer</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-1 font-data">215%</p>
            <p className="text-xs text-muted-foreground">Gap: 30 percentage points</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Your Rank</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-1 font-data">#12</p>
            <p className="text-xs text-muted-foreground">Out of 85 advertisers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveModeling;