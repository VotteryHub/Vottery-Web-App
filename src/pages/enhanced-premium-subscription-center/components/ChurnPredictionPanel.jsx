import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const RISK_FACTORS = [
  { factor: 'Usage Decline', impact: 'high', score: 72, description: '23% drop in weekly active usage over last 30 days', trend: 'worsening' },
  { factor: 'Feature Adoption', impact: 'medium', score: 45, description: 'Only 3 of 8 premium features actively used', trend: 'stable' },
  { factor: 'Payment History', impact: 'low', score: 12, description: 'All payments on time, no failed charges', trend: 'improving' },
  { factor: 'Support Tickets', impact: 'medium', score: 38, description: '2 unresolved support tickets in last 60 days', trend: 'stable' },
  { factor: 'Engagement Score', impact: 'high', score: 65, description: 'Below-average engagement vs similar family plans', trend: 'worsening' },
];

const EARLY_WARNINGS = [
  { warning: 'Login frequency dropped 40% this week', severity: 'high', detectedAt: '2 days ago' },
  { warning: 'Child account (Casey) has not logged in for 14 days', severity: 'medium', detectedAt: '5 days ago' },
  { warning: 'No new elections created in 3 weeks', severity: 'medium', detectedAt: '1 week ago' },
];

const ChurnPredictionPanel = ({ subscriptionData }) => {
  const [showDetails, setShowDetails] = useState(false);
  const churnRisk = subscriptionData?.churnRisk || 0.18;
  const riskPercent = Math.round(churnRisk * 100);
  const isHighRisk = churnRisk > 0.7;
  const isMediumRisk = churnRisk > 0.3;

  const riskColor = isHighRisk ? 'red' : isMediumRisk ? 'yellow' : 'green';
  const riskLabel = isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="space-y-6">
      {/* Main Risk Score */}
      <div className={`bg-card border rounded-2xl p-6 ${
        riskColor === 'red' ? 'border-red-500/30' :
        riskColor === 'yellow' ? 'border-yellow-500/30' : 'border-green-500/30'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Churn Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">ML-powered prediction with 87% confidence interval</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
            riskColor === 'red' ? 'bg-red-500/10 text-red-500' :
            riskColor === 'yellow'? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
          }`}>{riskLabel}</span>
        </div>

        <div className="flex items-center gap-8">
          {/* Circular Risk Gauge */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={riskColor === 'red' ? '#ef4444' : riskColor === 'yellow' ? '#eab308' : '#22c55e'}
                strokeWidth="10"
                strokeDasharray={`${riskPercent * 3.14} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${
                riskColor === 'red' ? 'text-red-500' : riskColor === 'yellow' ? 'text-yellow-500' : 'text-green-500'
              }`}>{riskPercent}%</span>
              <span className="text-xs text-muted-foreground">risk</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence Interval</span>
                <span className="font-medium text-foreground">{Math.max(0, riskPercent - 8)}% – {Math.min(100, riskPercent + 8)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Predicted Cancellation</span>
                <span className="font-medium text-foreground">Next 30 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model Accuracy</span>
                <span className="font-medium text-green-500">87.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-foreground">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {isHighRisk && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">⚠ High churn risk detected! Automated retention intervention triggered. Check AI Retention Offers tab.</p>
          </div>
        )}
      </div>
      {/* Risk Factors */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Risk Factor Analysis</h3>
        <div className="space-y-4">
          {RISK_FACTORS?.map((factor) => (
            <div key={factor?.factor}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{factor?.factor}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    factor?.impact === 'high' ? 'bg-red-500/10 text-red-500' :
                    factor?.impact === 'medium'? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                  }`}>{factor?.impact}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{factor?.score}/100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full ${
                    factor?.score >= 70 ? 'bg-red-500' : factor?.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${factor?.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{factor?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Early Warning Indicators */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Early Warning Indicators</h3>
        <div className="space-y-3">
          {EARLY_WARNINGS?.map((warning, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
              warning?.severity === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'
            }`}>
              <AlertTriangle size={16} className={`flex-shrink-0 mt-0.5 ${
                warning?.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{warning?.warning}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Detected {warning?.detectedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChurnPredictionPanel;
