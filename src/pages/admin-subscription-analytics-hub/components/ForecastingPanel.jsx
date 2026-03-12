import React from 'react';
import { TrendingUp, Calendar, DollarSign, AlertCircle } from 'lucide-react';

const ForecastingPanel = ({ analytics, lifecycleMetrics }) => {
  // Calculate 30/60/90 day forecasts
  const currentMRR = parseFloat(analytics?.mrr || 0);
  const churnRate = parseFloat(analytics?.churnRate || 0) / 100;
  const growthRate = 0.05; // Assume 5% monthly growth

  const forecasts = [
    {
      period: '30 Days',
      mrr: (currentMRR * (1 + growthRate - churnRate))?.toFixed(2),
      customers: Math.round((analytics?.activeSubscriptions || 0) * (1 + growthRate - churnRate)),
      revenue: (currentMRR * (1 + growthRate - churnRate))?.toFixed(2)
    },
    {
      period: '60 Days',
      mrr: (currentMRR * Math.pow(1 + growthRate - churnRate, 2))?.toFixed(2),
      customers: Math.round((analytics?.activeSubscriptions || 0) * Math.pow(1 + growthRate - churnRate, 2)),
      revenue: (currentMRR * Math.pow(1 + growthRate - churnRate, 2) * 2)?.toFixed(2)
    },
    {
      period: '90 Days',
      mrr: (currentMRR * Math.pow(1 + growthRate - churnRate, 3))?.toFixed(2),
      customers: Math.round((analytics?.activeSubscriptions || 0) * Math.pow(1 + growthRate - churnRate, 3)),
      revenue: (currentMRR * Math.pow(1 + growthRate - churnRate, 3) * 3)?.toFixed(2)
    }
  ];

  // Strategic insights
  const insights = [
    {
      type: churnRate > 0.1 ? 'warning' : 'success',
      message: churnRate > 0.1 
        ? 'High churn rate detected. Focus on retention strategies.' :'Healthy churn rate. Continue current retention efforts.'
    },
    {
      type: parseFloat(lifecycleMetrics?.customerLifetimeValue || 0) > 100 ? 'success' : 'warning',
      message: parseFloat(lifecycleMetrics?.customerLifetimeValue || 0) > 100
        ? 'Strong customer lifetime value. Optimize acquisition costs.'
        : 'LTV needs improvement. Consider upselling strategies.'
    },
    {
      type: currentMRR > 1000 ? 'success' : 'info',
      message: currentMRR > 1000
        ? 'MRR growth on track. Scale marketing efforts.'
        : 'Focus on customer acquisition to boost MRR.'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        Forecasting & Strategic Insights
      </h2>
      {/* Revenue Forecasts */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Revenue Forecasts
        </h3>
        <div className="space-y-3">
          {forecasts?.map((forecast, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{forecast?.period}</span>
                <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Projected
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">MRR</div>
                  <div className="text-lg font-bold text-gray-900">${forecast?.mrr}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Customers</div>
                  <div className="text-lg font-bold text-gray-900">{forecast?.customers}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Revenue</div>
                  <div className="text-lg font-bold text-gray-900">${forecast?.revenue}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Strategic Insights */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Strategic Recommendations
        </h3>
        <div className="space-y-2">
          {insights?.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                insight?.type === 'success' ?'bg-green-50 border-green-200'
                  : insight?.type === 'warning' ?'bg-yellow-50 border-yellow-200' :'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`p-1 rounded-full ${
                    insight?.type === 'success' ?'bg-green-100'
                      : insight?.type === 'warning' ?'bg-yellow-100' :'bg-blue-100'
                  }`}
                >
                  {insight?.type === 'success' ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : insight?.type === 'warning' ? (
                    <AlertCircle className="w-3 h-3 text-yellow-600" />
                  ) : (
                    <DollarSign className="w-3 h-3 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-gray-700 flex-1">{insight?.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Growth Metrics */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Growth Trajectory</span>
          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
            {growthRate > churnRate ? 'Positive' : 'Needs Attention'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-600">Monthly Growth Rate</span>
            <div className="text-lg font-bold text-green-600">{(growthRate * 100)?.toFixed(1)}%</div>
          </div>
          <div>
            <span className="text-gray-600">Net Growth</span>
            <div className="text-lg font-bold text-blue-600">
              {((growthRate - churnRate) * 100)?.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastingPanel;