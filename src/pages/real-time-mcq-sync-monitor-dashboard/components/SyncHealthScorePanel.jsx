import React from 'react';
import { Shield, TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const SyncHealthScorePanel = ({ healthScore = 0, components = null, loading = false }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/10' };
    if (score >= 70) return { label: 'Good', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    if (score >= 50) return { label: 'Fair', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const scoreInfo = getScoreLabel(healthScore);
  const scoreColor = getScoreColor(healthScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const componentScores = [
    { label: 'Delivery Rate', value: components?.deliveryRate || 0, icon: Activity },
    { label: 'Consistency', value: components?.consistencyScore || 0, icon: Shield },
    { label: 'Latency Score', value: components?.latencyScore || 0, icon: TrendingUp },
    { label: 'Uptime', value: components?.uptimeScore || 0, icon: CheckCircle }
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500/20 rounded-lg">
          <Shield className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Sync Health Score</h3>
          <p className="text-gray-400 text-sm">Combined system reliability metric</p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-3xl font-bold">{Math.round(healthScore)}</span>
            <span className="text-gray-400 text-xs">/ 100</span>
          </div>
        </div>
      </div>

      <div className={`text-center mb-6 p-3 rounded-xl ${scoreInfo?.bg}`}>
        <p className={`text-lg font-bold ${scoreInfo?.color}`}>{scoreInfo?.label}</p>
        <p className="text-gray-400 text-sm mt-1">
          {healthScore >= 90 ? 'All systems operating optimally' :
           healthScore >= 70 ? 'Minor issues detected, monitoring' :
           healthScore >= 50 ? 'Performance degradation detected': 'Critical issues require immediate attention'}
        </p>
      </div>

      <div className="space-y-3">
        {componentScores?.map((comp, i) => {
          const Icon = comp?.icon;
          const compColor = getScoreColor(comp?.value);
          return (
            <div key={i} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">{comp?.label}</span>
                  <span className="text-white text-sm font-bold">{Math.round(comp?.value)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${comp?.value}%`, backgroundColor: compColor }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {healthScore < 70 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-xs">Predictive failure detected. Proactive maintenance recommended to prevent system degradation.</p>
        </div>
      )}
    </div>
  );
};

export default SyncHealthScorePanel;
