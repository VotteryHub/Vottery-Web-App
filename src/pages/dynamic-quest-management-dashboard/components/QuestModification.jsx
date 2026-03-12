import React from 'react';
import { Settings, Edit, Trash2, RefreshCw } from 'lucide-react';

const QuestModification = ({ activeQuests, onUpdate }) => {
  if (activeQuests?.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No active quests to manage</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-orange-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6 text-orange-600" />
          Quest Modification Controls
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Manual override controls and quest adjustment capabilities
        </p>
      </div>

      <div className="space-y-4">
        {activeQuests?.map((quest) => (
          <div
            key={quest?.id}
            className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {quest?.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {quest?.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Progress</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {quest?.current_progress} / {quest?.target_value}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">VP Reward</div>
                <div className="text-xl font-bold text-yellow-600">
                  {quest?.vp_reward} VP
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Difficulty</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {quest?.difficulty}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onUpdate()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Progress
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Edit className="w-4 h-4" />
                Modify
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white mb-1">
              Quest Modification Notice
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manual quest modifications are logged for audit purposes. Automated reward distribution continues based on completion status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestModification;
