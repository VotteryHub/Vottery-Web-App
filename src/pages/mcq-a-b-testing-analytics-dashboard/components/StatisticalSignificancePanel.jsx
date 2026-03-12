import React from 'react';
import { CheckCircle, AlertCircle, BarChart2, Trophy } from 'lucide-react';

const StatisticalSignificancePanel = ({ testData, onPromoteWinner, promoting }) => {
  if (!testData) return null;

  const { significance, winner, canDetermineWinner, totalResponses } = testData;
  const minSampleSize = 100;
  const sampleProgress = Math.min(100, (totalResponses / minSampleSize) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <BarChart2 size={20} className="text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Statistical Analysis</h3>
      </div>

      {/* Sample size progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Sample Size Progress</span>
          <span>{totalResponses || 0} / {minSampleSize} responses</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${sampleProgress}%` }}
          />
        </div>
      </div>

      {/* Chi-squared results */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">Chi-Squared (χ²)</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{significance?.chiSquared ?? '—'}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">P-Value</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{significance?.pValue ?? '—'}</p>
        </div>
      </div>

      {/* Significance status */}
      <div className={`p-4 rounded-xl border mb-4 ${
        canDetermineWinner
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      }`}>
        <div className="flex items-center gap-2">
          {canDetermineWinner ? (
            <CheckCircle size={16} className="text-green-600" />
          ) : (
            <AlertCircle size={16} className="text-yellow-600" />
          )}
          <p className={`text-sm font-semibold ${
            canDetermineWinner ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
          }`}>
            {canDetermineWinner ? 'Statistically Significant (p < 0.05)' : 'Not Yet Significant — Collecting More Data'}
          </p>
        </div>
        {canDetermineWinner && winner && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Winner: <strong>Variant {winner}</strong> performs significantly better
          </p>
        )}
      </div>

      {/* Promote winner button */}
      {canDetermineWinner && winner && (
        <button
          onClick={() => onPromoteWinner?.(winner)}
          disabled={promoting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
        >
          <Trophy size={16} />
          {promoting ? 'Promoting...' : `Promote Variant ${winner} to Production`}
        </button>
      )}
    </div>
  );
};

export default StatisticalSignificancePanel;
