import React from 'react';
import { Droplets, Eye, Sparkles, Users } from 'lucide-react';

const LiquidHorizonMetrics = ({ data }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Liquid Horizon Metrics
        </h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fluid Animation</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.fluidAnimationPerformance?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.fluidAnimationPerformance}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Smooth morphing and flow rendering</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visual Appeal</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.visualAppealCorrelation?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.visualAppealCorrelation}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">User engagement correlation with aesthetics</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Immersive Experience</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.immersiveExperienceScore?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.immersiveExperienceScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Retention Impact</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.retentionImpact?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.retentionImpact}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">User retention correlation with liquid effects</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Overall Liquid Score</span>
            <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
              {((data?.fluidAnimationPerformance + data?.visualAppealCorrelation + data?.immersiveExperienceScore + data?.retentionImpact) / 4)?.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidHorizonMetrics;