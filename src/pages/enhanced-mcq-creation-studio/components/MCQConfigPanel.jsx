import React from 'react';
import Icon from '../../../components/AppIcon';

const MCQConfigPanel = ({ config, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Quiz Configuration</h3>
        <p className="text-sm text-muted-foreground">Set global quiz parameters for voter experience</p>
      </div>
      {/* Passing Score */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-foreground flex items-center gap-2">
            <Icon name="Target" size={18} className="text-green-600" />
            Passing Score (mcq_passing_score_percentage)
          </label>
          <span className="text-2xl font-bold text-green-600">{config?.passingScore ?? 70}%</span>
        </div>
        <input
          type="range" min={0} max={100} step={5}
          value={config?.passingScore ?? 70}
          onChange={e => onChange('passingScore', Number(e?.target?.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0% (always pass)</span><span>50%</span><span>100%</span>
        </div>
      </div>
      {/* Max Attempts */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-foreground flex items-center gap-2">
            <Icon name="RefreshCw" size={18} className="text-orange-600" />
            Max Attempts (mcq_max_attempts)
          </label>
          <span className="text-2xl font-bold text-orange-600">{config?.maxAttempts ?? 3}</span>
        </div>
        <input
          type="range" min={1} max={5} step={1}
          value={config?.maxAttempts ?? 3}
          onChange={e => onChange('maxAttempts', Number(e?.target?.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          {[1,2,3,4,5]?.map(n => <span key={n}>{n}</span>)}
        </div>
      </div>
      {/* Enforce Before Voting */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Enforce Before Voting</p>
            <p className="text-sm text-muted-foreground">Voters must pass quiz before casting vote</p>
          </div>
          <button
            onClick={() => onChange('enforceBeforeVoting', !config?.enforceBeforeVoting)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config?.enforceBeforeVoting ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config?.enforceBeforeVoting ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCQConfigPanel;
