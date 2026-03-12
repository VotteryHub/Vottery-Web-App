import React from 'react';
import { AlertTriangle, TrendingDown, Shield, Clock } from 'lucide-react';

const RISK_COLORS = {
  low: { bg: 'bg-emerald-900/20', border: 'border-emerald-700', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  medium: { bg: 'bg-yellow-900/20', border: 'border-yellow-700', text: 'text-yellow-400', bar: 'bg-yellow-500' },
  high: { bg: 'bg-orange-900/20', border: 'border-orange-700', text: 'text-orange-400', bar: 'bg-orange-500' },
  critical: { bg: 'bg-red-900/20', border: 'border-red-700', text: 'text-red-400', bar: 'bg-red-500' }
};

export default function ChurnRiskScorePanel({ prediction, engagementData, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          <div className="h-40 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  const riskScore = prediction?.churnRiskScore || 0;
  const riskLevel = prediction?.riskLevel || 'low';
  const colors = RISK_COLORS?.[riskLevel] || RISK_COLORS?.low;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Churn Risk Assessment
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors?.bg} ${colors?.border} ${colors?.text}`}>
          {riskLevel?.toUpperCase()}
        </span>
      </div>
      {/* Risk Score Gauge */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold mb-2 ${colors?.text}`}>{riskScore}%</div>
        <div className="text-sm text-slate-400">Churn Risk Score</div>
        <div className="w-full bg-slate-700 rounded-full h-4 mt-3">
          <div
            className={`h-4 rounded-full transition-all duration-1000 ${colors?.bar}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0% (Safe)</span>
          <span>70% (Alert)</span>
          <span>100% (Critical)</span>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-slate-400">Activity Decline</span>
          </div>
          <div className="text-lg font-bold text-white">{engagementData?.activityDeclineRate || 0}%</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Retention Prob.</span>
          </div>
          <div className="text-lg font-bold text-white">{prediction?.retentionProbability || 0}%</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Prediction Window</span>
          </div>
          <div className="text-sm font-bold text-white">{prediction?.predictionWindow || '7-14 days'}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400">Confidence</span>
          </div>
          <div className="text-lg font-bold text-white">{prediction?.confidenceInterval || 0}%</div>
        </div>
      </div>
      {/* Risk Factors */}
      {prediction?.primaryRiskFactors?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-2">Primary Risk Factors</h3>
          <div className="space-y-1">
            {prediction?.primaryRiskFactors?.map((factor, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                <div className={`w-2 h-2 rounded-full ${colors?.bar}`} />
                {factor}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
