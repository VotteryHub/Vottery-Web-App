import React from 'react';
import { Layers, Navigation, Box, Activity } from 'lucide-react';

const IsometricDeckPerformance = ({ data }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl transition-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Isometric Deck Performance
        </h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Navigation Efficiency</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.navigationEfficiency?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.navigationEfficiency}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Smooth navigation through layered deck</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Depth Perception</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.depthPerceptionUtilization?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.depthPerceptionUtilization}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Z-axis interaction effectiveness</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Spatial Interaction</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.spatialInteractionSuccess?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.spatialInteractionSuccess}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Carousel Engagement</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{data?.carouselEngagement?.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data?.carouselEngagement}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">User engagement with 3D deck patterns</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Overall Deck Score</span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {((data?.navigationEfficiency + data?.depthPerceptionUtilization + data?.spatialInteractionSuccess + data?.carouselEngagement) / 4)?.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsometricDeckPerformance;