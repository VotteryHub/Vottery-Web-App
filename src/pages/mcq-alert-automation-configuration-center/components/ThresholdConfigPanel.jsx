import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Bell, AlertTriangle, TrendingDown, MessageSquare } from 'lucide-react';
import mcqAlertAutomationService from '../../../services/mcqAlertAutomationService';
import Icon from '../../../components/AppIcon';


const ThresholdConfigPanel = ({ thresholds, onThresholdsUpdate }) => {
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = mcqAlertAutomationService?.updateThresholds(localThresholds);
    if (result?.data) {
      onThresholdsUpdate?.(result?.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleReset = () => {
    const result = mcqAlertAutomationService?.resetThresholds();
    setLocalThresholds(result?.data);
    onThresholdsUpdate?.(result?.data);
  };

  const configs = [
    {
      key: 'syncFailurePercent',
      label: 'Sync Failure Threshold',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      description: 'Alert when sync failure rate exceeds this percentage',
      unit: '%',
      min: 1,
      max: 50,
    },
    {
      key: 'accuracyDropPercent',
      label: 'Accuracy Drop Threshold',
      icon: TrendingDown,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      description: 'Alert when accuracy drops by more than this percentage',
      unit: '%',
      min: 5,
      max: 50,
    },
    {
      key: 'sentimentNegativityPercent',
      label: 'Sentiment Negativity Limit',
      icon: MessageSquare,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      description: 'Alert when negative sentiment exceeds this percentage',
      unit: '%',
      min: 10,
      max: 100,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Settings size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Threshold Configuration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize alert sensitivity levels</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {configs?.map((config) => {
          const Icon = config?.icon;
          return (
            <div key={config?.key} className={`${config?.bg} ${config?.border} border rounded-xl p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon size={18} className={config?.color} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{config?.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{config?.description}</p>
                </div>
                <span className="ml-auto text-2xl font-bold text-gray-900 dark:text-white">
                  {localThresholds?.[config?.key]}{config?.unit}
                </span>
              </div>
              <input
                type="range"
                min={config?.min}
                max={config?.max}
                value={localThresholds?.[config?.key] || 0}
                onChange={(e) => setLocalThresholds((prev) => ({ ...prev, [config?.key]: Number(e?.target?.value) }))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{config?.min}{config?.unit}</span>
                <span>{config?.max}{config?.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-start gap-3">
          <Bell size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Notification Channels</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Alerts are sent via <strong>Telnyx SMS</strong> and <strong>Resend Email</strong> when thresholds are exceeded. Polling runs every 5 minutes automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThresholdConfigPanel;
