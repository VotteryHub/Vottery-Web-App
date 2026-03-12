import React from 'react';
import { TrendingUp } from 'lucide-react';

const SocialProofIntegration = ({ data }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Social Proof Integration</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data?.viralProbability?.toFixed(1)}%</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Viral Probability</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.communityEngagement?.toFixed(1)}%</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Community Engagement</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data?.trendAmplification?.toFixed(1)}%</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Trend Amplification</div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofIntegration;