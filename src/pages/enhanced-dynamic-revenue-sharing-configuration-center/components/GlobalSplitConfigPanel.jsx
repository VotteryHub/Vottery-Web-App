import React, { useState } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { revenueShareService } from '../../../services/revenueShareService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const GlobalSplitConfigPanel = ({ globalConfig, onUpdate, sandboxMode }) => {
  const [editing, setEditing] = useState(false);
  const [creatorPercentage, setCreatorPercentage] = useState(globalConfig?.creatorPercentage || 70);
  const [platformPercentage, setPlatformPercentage] = useState(globalConfig?.platformPercentage || 30);
  const [changeReason, setChangeReason] = useState('strategic_adjustment');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await revenueShareService?.updateGlobalSplit({
        creatorPercentage,
        platformPercentage,
        changeReason
      });

      if (result?.error) throw new Error(result?.error?.message);

      analytics?.trackEvent('global_split_updated', {
        creator_percentage: creatorPercentage,
        platform_percentage: platformPercentage,
        change_reason: changeReason
      });

      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating global split:', error);
    } finally {
      setSaving(false);
    }
  };

  const changeReasons = [
    { value: 'morale_booster', label: 'Morale Booster Campaign' },
    { value: 'strategic_adjustment', label: 'Strategic Adjustment' },
    { value: 'performance_incentive', label: 'Performance Incentive' },
    { value: 'market_conditions', label: 'Market Conditions' },
    { value: 'manual_override', label: 'Manual Override' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Global Revenue Split Configuration
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Default split applied to all creators
            </p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            disabled={sandboxMode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Edit Split
          </button>
        )}
      </div>

      {sandboxMode && !editing && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Global configuration editing is disabled in Sandbox Mode
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Creator Percentage</div>
          {editing ? (
            <input
              type="number"
              min="0"
              max="100"
              value={creatorPercentage}
              onChange={(e) => {
                const value = parseInt(e?.target?.value);
                setCreatorPercentage(value);
                setPlatformPercentage(100 - value);
              }}
              className="w-full text-4xl font-bold text-green-600 dark:text-green-400 bg-transparent border-b-2 border-green-600 dark:border-green-400 focus:outline-none"
            />
          ) : (
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {globalConfig?.creatorPercentage}%
            </div>
          )}
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Revenue share to creators
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Platform Percentage</div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {editing ? platformPercentage : globalConfig?.platformPercentage}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Revenue retained by platform
          </div>
        </div>
      </div>

      {editing && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Change Reason
            </label>
            <select
              value={changeReason}
              onChange={(e) => setChangeReason(e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {changeReasons?.map((reason) => (
                <option key={reason?.value} value={reason?.value}>
                  {reason?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || creatorPercentage + platformPercentage !== 100}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setCreatorPercentage(globalConfig?.creatorPercentage || 70);
                setPlatformPercentage(globalConfig?.platformPercentage || 30);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>

          {creatorPercentage + platformPercentage !== 100 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-800 dark:text-red-200">
                Percentages must total 100%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSplitConfigPanel;