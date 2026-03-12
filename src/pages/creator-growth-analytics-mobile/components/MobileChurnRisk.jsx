import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const MobileChurnRisk = ({ score = 23, factors = [] }) => {
  const getRiskLevel = (s) => {
    if (s < 30) return { label: 'Low Risk', color: 'text-green-400', bg: 'bg-green-900/20 border-green-700', icon: <CheckCircle size={20} className="text-green-400" />, bar: 'bg-green-500' };
    if (s < 60) return { label: 'Medium Risk', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700', icon: <AlertCircle size={20} className="text-yellow-400" />, bar: 'bg-yellow-500' };
    return { label: 'High Risk', color: 'text-red-400', bg: 'bg-red-900/20 border-red-700', icon: <AlertTriangle size={20} className="text-red-400" />, bar: 'bg-red-500' };
  };

  const risk = getRiskLevel(score);
  const defaultFactors = [
    { label: 'Posting frequency', status: score < 40 ? 'good' : 'warn' },
    { label: 'Engagement rate', status: score < 50 ? 'good' : 'bad' },
    { label: 'Revenue trend', status: score < 35 ? 'good' : 'warn' }
  ];
  const displayFactors = factors?.length > 0 ? factors : defaultFactors;

  return (
    <div className={`rounded-2xl border p-5 ${risk?.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Churn Risk Score</p>
          <div className="flex items-center gap-2 mt-1">
            {risk?.icon}
            <span className={`text-xl font-bold ${risk?.color}`}>{risk?.label}</span>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-bold ${risk?.color}`}>{score}</p>
          <p className="text-gray-500 text-xs">/ 100</p>
        </div>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${risk?.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="space-y-2">
        {displayFactors?.map((f, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">{f?.label}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              f?.status === 'good' ? 'bg-green-900/40 text-green-400' :
              f?.status === 'warn'? 'bg-yellow-900/40 text-yellow-400' : 'bg-red-900/40 text-red-400'
            }`}>
              {f?.status === 'good' ? '✓ Good' : f?.status === 'warn' ? '⚠ Watch' : '✗ Poor'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileChurnRisk;
