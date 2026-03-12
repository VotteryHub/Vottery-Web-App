import React from 'react';
import Icon from '../../../components/AppIcon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PredictiveAnalyticsPanel = ({ data, timeframe }) => {
  const mockForecastData = [
    { day: 'Day 1', engagement: 65, predicted: 68, confidence: 95 },
    { day: 'Day 7', engagement: 72, predicted: 75, confidence: 92 },
    { day: 'Day 14', engagement: 78, predicted: 82, confidence: 89 },
    { day: 'Day 21', engagement: 85, predicted: 88, confidence: 85 },
    { day: 'Day 30', engagement: 90, predicted: 92, confidence: 82 },
    { day: 'Day 60', engagement: null, predicted: 95, confidence: 75 },
    { day: 'Day 90', engagement: null, predicted: 98, confidence: 68 }
  ];

  const mockRevenueProjections = [
    { zone: 'Zone 1 ($0.01-$0.10)', current: 12500, projected: 15200, growth: '+21.6%' },
    { zone: 'Zone 2 ($0.11-$0.50)', current: 28400, projected: 34800, growth: '+22.5%' },
    { zone: 'Zone 3 ($0.51-$1.00)', current: 45600, projected: 52300, growth: '+14.7%' },
    { zone: 'Zone 4 ($1.01-$5.00)', current: 78900, projected: 89500, growth: '+13.4%' },
    { zone: 'Zone 5 ($5.01-$10.00)', current: 125000, projected: 142000, growth: '+13.6%' },
    { zone: 'Zone 6 ($10.01-$50.00)', current: 234000, projected: 268000, growth: '+14.5%' },
    { zone: 'Zone 7 ($50.01-$100.00)', current: 456000, projected: 512000, growth: '+12.3%' },
    { zone: 'Zone 8 ($100.01+)', current: 892000, projected: 1024000, growth: '+14.8%' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Icon name="TrendingUp" size={24} className="text-primary" />
              {timeframe} Engagement Forecast
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              ML-powered predictions with confidence intervals and trend analysis
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 px-3 py-2 rounded-lg">
            <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {data?.engagementForecast?.confidenceInterval || '85-95%'} Confidence
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockForecastData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="day" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              name="Actual Engagement"
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.2}
              name="Predicted Engagement"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-muted-foreground">Current Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {data?.engagementForecast?.currentRate || 78}%
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-muted-foreground">Predicted Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {data?.engagementForecast?.predictedRate || 92}%
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="ArrowUp" size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-muted-foreground">Trend</span>
            </div>
            <div className="text-2xl font-bold text-foreground capitalize">
              {data?.engagementForecast?.trend || 'Increasing'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="DollarSign" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Revenue Projections Across 8 Purchasing Power Zones
          </h2>
        </div>

        <div className="space-y-3">
          {mockRevenueProjections?.map((zone, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{zone?.zone}</span>
                <span className={`text-sm font-bold ${
                  parseFloat(zone?.growth) > 15 
                    ? 'text-green-600 dark:text-green-400' :'text-blue-600 dark:text-blue-400'
                }`}>
                  {zone?.growth}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Current: ${zone?.current?.toLocaleString()}</span>
                    <span>Projected: ${zone?.projected?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(zone?.current / zone?.projected) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Lightbulb" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Key Predictive Insights
          </h2>
        </div>

        <div className="space-y-3">
          {(data?.keyInsights || [
            'User engagement expected to increase by 18% over next 30 days based on historical patterns',
            'Revenue growth projected at 14.2% across all purchasing power zones',
            'Peak engagement hours shifting to 7-9 PM EST, optimize content scheduling accordingly',
            'Ranked choice voting showing 23% higher completion rates than plurality voting',
            'Creator retention rate predicted to improve by 12% with current optimization strategies'
          ])?.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Icon name="CheckCircle" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsPanel;