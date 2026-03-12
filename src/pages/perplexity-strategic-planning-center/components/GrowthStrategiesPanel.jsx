import React from 'react';
import Icon from '../../../components/AppIcon';

const GrowthStrategiesPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {data?.strategies?.map((strategy, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                  {strategy?.category}
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                  {Math.round((strategy?.confidence || 0) * 100)}% Confidence
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{strategy?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{strategy?.description}</p>
            </div>
          </div>

          {/* Strategy Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Expected ROI</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {strategy?.expectedROI}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Timeline</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {strategy?.timeline}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Impact</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {typeof strategy?.forecast?.day90 === 'number' ? `+${strategy?.forecast?.day90}%` : 'High'}
              </p>
            </div>
          </div>

          {/* Tactics */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Icon name="Target" size={16} className="text-blue-500" />
              Implementation Tactics
            </h4>
            <div className="space-y-2">
              {strategy?.tactics?.map((tactic, tIdx) => (
                <div key={tIdx} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <Icon name="CheckCircle" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{tactic}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 60-90 Day Forecast */}
          {strategy?.forecast && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Icon name="LineChart" size={16} className="text-purple-500" />
                60-90 Day Forecast
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">60-Day Projection</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {typeof strategy?.forecast?.day60 === 'number' ? `+${strategy?.forecast?.day60}%` : strategy?.forecast?.day60}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">90-Day Projection</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {typeof strategy?.forecast?.day90 === 'number' ? `+${strategy?.forecast?.day90}%` : strategy?.forecast?.day90}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GrowthStrategiesPanel;