import React from 'react';
import { RotateCw, Gauge, Hand, Target, TrendingUp } from 'lucide-react';

const KineticSpindleAnalytics = ({ data }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
          <RotateCw className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Kinetic Spindle Analytics
        </h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Rotation Completion</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.rotationCompletionRate?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.rotationCompletionRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Users completing full 3D rotation cycle</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time to Interaction</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.avgTimeToInteraction?.toFixed(2)}s</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (2 - data?.avgTimeToInteraction) * 50)}%` }}
              />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Target: &lt;2s</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hand className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Haptic Trigger Success</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.hapticTriggerSuccess?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.hapticTriggerSuccess}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Engagement Depth</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.engagementDepth?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.engagementDepth}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">User interaction depth during 3D rotation</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Gesture Accuracy</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{data?.gestureAccuracy?.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KineticSpindleAnalytics;