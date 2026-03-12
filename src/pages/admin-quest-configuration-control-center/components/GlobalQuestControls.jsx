import React, { useState } from 'react';
import { Settings, Power, AlertTriangle, RotateCcw, Download, Shield } from 'lucide-react';

const GlobalQuestControls = () => {
  const [systemControls, setSystemControls] = useState({
    questGenerationEnabled: true,
    dailyQuestsEnabled: true,
    weeklyQuestsEnabled: true,
    openaiIntegrationEnabled: true,
    rewardDistributionEnabled: true
  });
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [bulkOperations, setBulkOperations] = useState({
    selectedOperation: 'approve',
    targetStatus: 'active',
    affectedCount: 0
  });

  const handleEmergencyDisable = () => {
    setEmergencyMode(true);
    setSystemControls({
      questGenerationEnabled: false,
      dailyQuestsEnabled: false,
      weeklyQuestsEnabled: false,
      openaiIntegrationEnabled: false,
      rewardDistributionEnabled: false
    });
  };

  const handleEmergencyRestore = () => {
    setEmergencyMode(false);
    setSystemControls({
      questGenerationEnabled: true,
      dailyQuestsEnabled: true,
      weeklyQuestsEnabled: true,
      openaiIntegrationEnabled: true,
      rewardDistributionEnabled: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          Global Quest Controls
        </h2>
        <p className="text-gray-600 mt-1">System-wide quest activation toggles, emergency controls, and bulk operations</p>
      </div>
      {/* Emergency Controls */}
      {emergencyMode && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-red-900">Emergency Mode Active</h3>
              <p className="text-sm text-red-700">All quest systems have been disabled</p>
            </div>
          </div>
          <button
            onClick={handleEmergencyRestore}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restore All Systems
          </button>
        </div>
      )}
      {/* System-Wide Activation Toggles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Power className="w-5 h-5 text-indigo-600" />
          System-Wide Activation Toggles
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Quest Generation System</div>
              <div className="text-sm text-gray-600">Enable/disable all quest generation via OpenAI</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemControls?.questGenerationEnabled}
                onChange={(e) => setSystemControls({ ...systemControls, questGenerationEnabled: e?.target?.checked })}
                disabled={emergencyMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Daily Quests</div>
              <div className="text-sm text-gray-600">Enable/disable daily quest assignments</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemControls?.dailyQuestsEnabled}
                onChange={(e) => setSystemControls({ ...systemControls, dailyQuestsEnabled: e?.target?.checked })}
                disabled={emergencyMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Weekly Quests</div>
              <div className="text-sm text-gray-600">Enable/disable weekly quest assignments</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemControls?.weeklyQuestsEnabled}
                onChange={(e) => setSystemControls({ ...systemControls, weeklyQuestsEnabled: e?.target?.checked })}
                disabled={emergencyMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">OpenAI Integration</div>
              <div className="text-sm text-gray-600">Enable/disable OpenAI API calls</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemControls?.openaiIntegrationEnabled}
                onChange={(e) => setSystemControls({ ...systemControls, openaiIntegrationEnabled: e?.target?.checked })}
                disabled={emergencyMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Reward Distribution</div>
              <div className="text-sm text-gray-600">Enable/disable VP and XP reward distribution</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemControls?.rewardDistributionEnabled}
                onChange={(e) => setSystemControls({ ...systemControls, rewardDistributionEnabled: e?.target?.checked })}
                disabled={emergencyMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>
      {/* Emergency Disable Mechanism */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Emergency Disable Mechanism
        </h3>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-4">
            Use this emergency control to immediately disable all quest systems in case of critical issues.
            This will stop quest generation, disable rewards, and pause all active quests.
          </p>
          <button
            onClick={handleEmergencyDisable}
            disabled={emergencyMode}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield className="w-4 h-4" />
            {emergencyMode ? 'Emergency Mode Active' : 'Activate Emergency Disable'}
          </button>
        </div>
      </div>
      {/* Bulk Quest Modification */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Bulk Quest Modification Capabilities</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Bulk Operation</label>
              <select
                value={bulkOperations?.selectedOperation}
                onChange={(e) => setBulkOperations({ ...bulkOperations, selectedOperation: e?.target?.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="approve">Approve Pending Quests</option>
                <option value="pause">Pause Active Quests</option>
                <option value="resume">Resume Paused Quests</option>
                <option value="expire">Expire Old Quests</option>
                <option value="delete">Delete Failed Quests</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Target Status</label>
              <select
                value={bulkOperations?.targetStatus}
                onChange={(e) => setBulkOperations({ ...bulkOperations, targetStatus: e?.target?.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active Quests</option>
                <option value="pending">Pending Quests</option>
                <option value="paused">Paused Quests</option>
                <option value="expired">Expired Quests</option>
                <option value="failed">Failed Quests</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Affected Quests</div>
              <div className="text-sm text-gray-600">Estimated count: 247 quests</div>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Execute Bulk Operation
            </button>
          </div>
        </div>
      </div>
      {/* Comprehensive Audit Trails */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Comprehensive Audit Trails</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">System Configuration Changes</div>
              <div className="text-sm text-gray-600">Last 30 days: 42 changes</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Bulk Operations Log</div>
              <div className="text-sm text-gray-600">Last 30 days: 18 operations</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Emergency Actions Log</div>
              <div className="text-sm text-gray-600">Last 30 days: 2 emergency disables</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      {/* Rollback Functionality */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-indigo-600" />
          Rollback Functionality
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Configuration Snapshot: 2026-02-01 18:30</div>
              <div className="text-sm text-gray-600">Before bulk difficulty adjustment</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <RotateCcw className="w-4 h-4" />
              Restore
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Configuration Snapshot: 2026-01-28 14:15</div>
              <div className="text-sm text-gray-600">Before reward multiplier changes</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <RotateCcw className="w-4 h-4" />
              Restore
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Configuration Snapshot: 2026-01-25 09:45</div>
              <div className="text-sm text-gray-600">Before OpenAI model change</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <RotateCcw className="w-4 h-4" />
              Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalQuestControls;