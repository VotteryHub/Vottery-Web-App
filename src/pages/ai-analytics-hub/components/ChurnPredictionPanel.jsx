import React from 'react';
import Icon from '../../../components/AppIcon';

const ChurnPredictionPanel = ({ churnData }) => {
  const atRiskUsers = churnData?.atRiskUsers || 1247;
  const churnRate = churnData?.churnRate || '12.4%';
  const riskFactors = churnData?.riskFactors || [
    'Declining voting frequency (3+ weeks inactive)',
    'Low engagement with social features',
    'No participation in recent elections',
    'Reduced session duration (-40% avg)'
  ];
  const preventionStrategies = churnData?.preventionStrategies || [
    'Send personalized election recommendations',
    'Offer VP rewards for re-engagement',
    'Implement win-back campaigns',
    'Provide exclusive content access'
  ];

  const riskSegments = [
    { segment: 'High Risk', users: 487, percentage: 39, color: 'from-red-500 to-red-600' },
    { segment: 'Medium Risk', users: 523, percentage: 42, color: 'from-orange-500 to-orange-600' },
    { segment: 'Low Risk', users: 237, percentage: 19, color: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Churn Prediction Visualization</h2>
          <p className="text-sm text-muted-foreground">ML-powered user retention risk analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <Icon name="AlertTriangle" className="w-4 h-4 text-red-600" />
          <span className="text-xs font-medium text-red-700">Predictive Model</span>
        </div>
      </div>

      {/* Churn Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">At-Risk Users</p>
          </div>
          <p className="text-3xl font-bold text-red-900">{atRiskUsers?.toLocaleString()}</p>
          <p className="text-xs text-red-600 mt-1">Next 30 days</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingDown" className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-orange-700">Predicted Churn Rate</p>
          </div>
          <p className="text-3xl font-bold text-orange-900">{churnRate}</p>
          <p className="text-xs text-orange-600 mt-1">Industry avg: 15.2%</p>
        </div>
      </div>

      {/* Risk Segmentation */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Risk Segmentation</h3>
        <div className="space-y-3">
          {riskSegments?.map((segment, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{segment?.segment}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{segment?.users} users</span>
                  <span className="text-sm font-bold text-foreground">{segment?.percentage}%</span>
                </div>
              </div>
              <div className="relative w-full bg-muted rounded-full h-3">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${segment?.color} rounded-full transition-all duration-500`}
                  style={{ width: `${segment?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Key Churn Risk Factors</h3>
        <div className="space-y-2">
          {riskFactors?.map((factor, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
              <Icon name="AlertCircle" className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{factor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Strategies */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Retention Strategies</h3>
        <div className="space-y-2">
          {preventionStrategies?.map((strategy, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
              <Icon name="CheckCircle" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{strategy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Brain" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">ML Prediction Confidence</p>
            <p className="text-sm text-blue-700">
              Model accuracy: 89.3%. Implementing top 2 retention strategies could reduce churn by 35-40% within 60 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPredictionPanel;