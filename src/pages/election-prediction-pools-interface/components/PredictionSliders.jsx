import React from 'react';

const PredictionSliders = ({
  election, options, predictions, onSliderChange,
  onSubmit, submitting, submitted, isValid, totalPrediction, userPrediction
}) => {
  const getOptionLabel = (opt, idx) => opt?.text || opt?.title || opt?.name || `Option ${idx + 1}`;
  const getOptionKey = (opt, idx) => opt?.id || opt?.text || `option_${idx}`;

  const getConfidenceLabel = (val) => {
    if (val >= 70) return { label: 'High Confidence', color: 'text-green-600' };
    if (val >= 40) return { label: 'Moderate', color: 'text-yellow-600' };
    return { label: 'Low Confidence', color: 'text-red-500' };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {election?.title || election?.name || 'Election Prediction'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Allocate probability across outcomes. Total must equal 100%.
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
          isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {totalPrediction}% / 100%
        </div>
      </div>
      {submitted && userPrediction && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            ✅ Prediction locked in! You can update it before the election starts.
          </p>
        </div>
      )}
      <div className="space-y-6">
        {options?.map((opt, idx) => {
          const key = getOptionKey(opt, idx);
          const val = predictions?.[key] || 0;
          const confidence = getConfidenceLabel(val);
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 50%)` }}></div>
                  <span className="font-medium text-gray-900 dark:text-white">{getOptionLabel(opt, idx)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${confidence?.color}`}>{confidence?.label}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white w-12 text-right">{val}%</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={e => onSliderChange(key, e?.target?.value)}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(${(idx * 60) % 360}, 70%, 50%) ${val}%, #e5e7eb ${val}%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0% (Impossible)</span>
                <span>50% (Even odds)</span>
                <span>100% (Certain)</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Visual distribution bar */}
      {options?.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Probability Distribution</p>
          <div className="flex h-4 rounded-full overflow-hidden">
            {options?.map((opt, idx) => {
              const key = getOptionKey(opt, idx);
              const val = predictions?.[key] || 0;
              return (
                <div
                  key={key}
                  style={{ width: `${val}%`, backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 50%)` }}
                  className="transition-all duration-300"
                  title={`${getOptionLabel(opt, idx)}: ${val}%`}
                />
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={onSubmit}
          disabled={!isValid || submitting}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all ${
            isValid && !submitting
              ? 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </span>
          ) : submitted ? '🔄 Update Prediction' : '🎯 Lock In Prediction (+20 VP)'}
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Scored using Brier Score: avg((pred - actual)²) • Lower score = better accuracy • VP reward = (1 - score) × 100
      </p>
    </div>
  );
};

export default PredictionSliders;
