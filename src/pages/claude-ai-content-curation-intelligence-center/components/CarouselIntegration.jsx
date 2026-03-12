import React from 'react';
import { Layers } from 'lucide-react';

const CarouselIntegration = ({ placements }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Layers className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">3D Carousel Integration</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Kinetic Spindle</h3>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{placements?.kineticSpindle?.length || 0}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Optimized placements</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Isometric Deck</h3>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{placements?.isometricDeck?.length || 0}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Optimized placements</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Liquid Horizon</h3>
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{placements?.liquidHorizon?.length || 0}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Optimized placements</div>
        </div>
      </div>
    </div>
  );
};

export default CarouselIntegration;