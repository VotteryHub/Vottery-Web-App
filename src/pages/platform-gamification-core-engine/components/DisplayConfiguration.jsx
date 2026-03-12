import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function DisplayConfiguration() {
  const [displayConfig, setDisplayConfig] = useState({
    enabled: true,
    position: 'home-top',
    showPrizePool: true,
    showWinnerCount: true,
    showSponsor: true,
    animationEnabled: true,
    customMessage: 'Vottery January 2026 Gamified Users\' Prizes',
    sponsorName: '',
    sponsorLogo: null
  });

  const positions = [
    { id: 'home-top', label: 'Home Feed - Top', description: 'Most visible position' },
    { id: 'home-sidebar', label: 'Home Feed - Sidebar', description: 'Persistent visibility' },
    { id: 'profile-top', label: 'User Profile - Top', description: 'Personal engagement' },
    { id: 'dashboard', label: 'Dashboard Widget', description: 'Admin/creator view' }
  ];

  return (
    <div className="space-y-6">
      {/* Display Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Display Preview
        </h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="max-w-2xl mx-auto">
            {/* Prize Display */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-purple-600">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {displayConfig?.customMessage}
                </h2>
                {displayConfig?.showPrizePool && (
                  <p className="text-4xl font-bold text-purple-600 mb-4">
                    $23,000,000
                  </p>
                )}
                {displayConfig?.showWinnerCount && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">$1M Winners</p>
                      <p className="text-2xl font-bold text-yellow-600">3</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">$100K Winners</p>
                      <p className="text-2xl font-bold text-blue-600">200</p>
                    </div>
                  </div>
                )}
                {displayConfig?.showSponsor && displayConfig?.sponsorName && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      In Association with
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {displayConfig?.sponsorName}
                    </p>
                  </div>
                )}
                {displayConfig?.animationEnabled && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <Icon name="Sparkles" className="w-5 h-5 animate-pulse" />
                      <span className="font-medium">3D Slot Machine Active</span>
                      <Icon name="Sparkles" className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Display Settings
        </h3>
        <div className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Display Enabled</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show gamification display on platform</p>
            </div>
            <button
              onClick={() => setDisplayConfig(prev => ({ ...prev, enabled: !prev?.enabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                displayConfig?.enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  displayConfig?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Position
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {positions?.map(pos => (
                <button
                  key={pos?.id}
                  onClick={() => setDisplayConfig(prev => ({ ...prev, position: pos?.id }))}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    displayConfig?.position === pos?.id
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{pos?.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{pos?.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Display Message
            </label>
            <input
              type="text"
              value={displayConfig?.customMessage}
              onChange={(e) => setDisplayConfig(prev => ({ ...prev, customMessage: e?.target?.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Sponsor Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sponsor Name (Optional)
            </label>
            <input
              type="text"
              value={displayConfig?.sponsorName}
              onChange={(e) => setDisplayConfig(prev => ({ ...prev, sponsorName: e?.target?.value }))}
              placeholder="e.g., Pepsi, Coca-Cola"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Display Options */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Prize Pool Amount</span>
              <button
                onClick={() => setDisplayConfig(prev => ({ ...prev, showPrizePool: !prev?.showPrizePool }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  displayConfig?.showPrizePool ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    displayConfig?.showPrizePool ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Winner Count</span>
              <button
                onClick={() => setDisplayConfig(prev => ({ ...prev, showWinnerCount: !prev?.showWinnerCount }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  displayConfig?.showWinnerCount ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    displayConfig?.showWinnerCount ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Show Sponsor Information</span>
              <button
                onClick={() => setDisplayConfig(prev => ({ ...prev, showSponsor: !prev?.showSponsor }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  displayConfig?.showSponsor ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    displayConfig?.showSponsor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable 3D Slot Machine Animation</span>
              <button
                onClick={() => setDisplayConfig(prev => ({ ...prev, animationEnabled: !prev?.animationEnabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  displayConfig?.animationEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    displayConfig?.animationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Save Display Configuration
        </button>
      </div>
    </div>
  );
}