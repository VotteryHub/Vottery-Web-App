import React from 'react';
import { Activity, Zap, Target, TrendingUp } from 'lucide-react';

const RealTimeMetricsOverview = ({ performanceData }) => {
  const overallScore = ((performanceData?.kineticSpindle?.rotationCompletionRate +
  performanceData?.isometricDeck?.navigationEfficiency + performanceData?.liquidHorizon?.fluidAnimationPerformance) / 3)?.toFixed(1);

  const avgInteractionTime = performanceData?.kineticSpindle?.avgTimeToInteraction?.toFixed(2);
  const hapticSuccess = performanceData?.kineticSpindle?.hapticTriggerSuccess?.toFixed(1);
  const engagementRate = ((performanceData?.kineticSpindle?.engagementDepth +
  performanceData?.isometricDeck?.carouselEngagement + performanceData?.liquidHorizon?.retentionImpact) / 3)?.toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall 3D Performance Score */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+2.3%</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall 3D Performance</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{overallScore}%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">avg score</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Time to Interaction */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">-0.2s</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Time to Interaction</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{avgInteractionTime}s</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">response</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Target: &lt;2.0s • Status: <span className="text-green-600 dark:text-green-400 font-medium">Excellent</span>
          </div>
        </div>
      </div>

      {/* Haptic Trigger Success */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+1.8%</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Haptic Trigger Success</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{hapticSuccess}%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">accuracy</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${hapticSuccess}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Engagement Rate */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+3.1%</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">3D Engagement Rate</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{engagementRate}%</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">active</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${engagementRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetricsOverview;