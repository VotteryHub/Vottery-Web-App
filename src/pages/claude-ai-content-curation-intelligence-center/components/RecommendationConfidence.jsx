import React from 'react';
import { Target } from 'lucide-react';

const RecommendationConfidence = ({ recommendations }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Real-Time Recommendation Confidence</h2>
      </div>
      <div className="space-y-3">
        {recommendations?.map((rec) => (
          <div key={rec?.id} className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-700/50 dark:to-indigo-900/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{rec?.type}</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{rec?.confidence}%</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{rec?.reason}</p>
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" style={{ width: `${rec?.confidence}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationConfidence;