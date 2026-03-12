import React from 'react';
import { Sliders } from 'lucide-react';

const PersonalizedContentWeighting = ({ data }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Personalized Content Weighting
        </h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Moments</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.momentsWeight?.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${data?.momentsWeight}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Jolts</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.joltsWeight?.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500" style={{ width: `${data?.joltsWeight}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Elections</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.electionsWeight?.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500" style={{ width: `${data?.electionsWeight}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedContentWeighting;