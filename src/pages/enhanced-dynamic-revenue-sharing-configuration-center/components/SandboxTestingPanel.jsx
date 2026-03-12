import React, { useState, useEffect } from 'react';
import { TestTube, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { revenueSplitSandboxService } from '../../../services/revenueSplitSandboxService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const SandboxTestingPanel = ({ sandboxConfigs, onRefresh, sandboxMode }) => {
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newConfig, setNewConfig] = useState({
    sandboxName: '',
    description: '',
    creatorPercentage: 90,
    platformPercentage: 10,
    testScenarioType: 'morale_booster',
    testDurationDays: 7
  });

  const handleCreateSandbox = async () => {
    try {
      setLoading(true);
      const result = await revenueSplitSandboxService?.createSandboxConfig(newConfig);
      if (result?.error) throw new Error(result?.error?.message);

      analytics?.trackEvent('sandbox_config_created', {
        scenario_type: newConfig?.testScenarioType,
        creator_percentage: newConfig?.creatorPercentage
      });

      setShowCreateModal(false);
      setNewConfig({
        sandboxName: '',
        description: '',
        creatorPercentage: 90,
        platformPercentage: 10,
        testScenarioType: 'morale_booster',
        testDurationDays: 7
      });
      onRefresh();
    } catch (error) {
      console.error('Error creating sandbox:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTest = async (configId) => {
    try {
      setLoading(true);
      const [payoutsResult, validationResult] = await Promise.all([
        revenueSplitSandboxService?.calculateSandboxPayouts(configId, 100000),
        revenueSplitSandboxService?.validateSandboxConfig(configId)
      ]);

      setTestResults({
        payouts: payoutsResult?.data,
        validation: validationResult?.data
      });

      analytics?.trackEvent('sandbox_test_executed', {
        config_id: configId
      });
    } catch (error) {
      console.error('Error running test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateToProduction = async (configId, migrationType) => {
    try {
      setLoading(true);
      const result = await revenueSplitSandboxService?.migrateSandboxToProduction(
        configId,
        migrationType
      );

      if (result?.error) throw new Error(result?.error?.message);

      analytics?.trackEvent('sandbox_migrated_to_production', {
        config_id: configId,
        migration_type: migrationType
      });

      onRefresh();
    } catch (error) {
      console.error('Error migrating to production:', error);
    } finally {
      setLoading(false);
    }
  };

  const scenarioTypes = [
    { value: 'morale_booster', label: 'Morale Booster Campaign', description: '90/10 or similar high creator splits' },
    { value: 'strategic_test', label: 'Strategic Test', description: 'Test new split strategies' },
    { value: 'campaign_preview', label: 'Campaign Preview', description: 'Preview campaign impact' },
    { value: 'performance_incentive', label: 'Performance Incentive', description: 'Performance-based splits' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TestTube className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Sandbox Testing Environment
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test revenue split scenarios without affecting production data
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Create Test Scenario
          </button>
        </div>

        {!sandboxMode && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Enable Sandbox Mode to create and run test scenarios
            </span>
          </div>
        )}
      </div>

      {/* Sandbox Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sandboxConfigs?.map((config) => (
          <div
            key={config?.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {config?.sandboxName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {config?.description}
                </p>
              </div>
              {config?.isActive && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                  Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Creator Split</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {config?.creatorPercentage}%
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Platform Split</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {config?.platformPercentage}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Test Duration: {config?.testDurationDays} days
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {config?.testScenarioType?.replace('_', ' ')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleRunTest(config?.id)}
                disabled={!sandboxMode || loading}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Run Test
              </button>
              <button
                onClick={() => handleMigrateToProduction(config?.id, 'to_campaign')}
                disabled={!sandboxMode || loading}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Deploy to Production
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Test Results
          </h3>

          {/* Validation Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {testResults?.validation?.valid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                Validation {testResults?.validation?.valid ? 'Passed' : 'Failed'}
              </span>
            </div>

            {testResults?.validation?.warnings?.length > 0 && (
              <div className="space-y-2">
                {testResults?.validation?.warnings?.map((warning, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payout Projections */}
          {testResults?.payouts?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Simulated Payout Calculations (Sample)
              </h4>
              <div className="space-y-2">
                {testResults?.payouts?.slice(0, 5)?.map((payout, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {payout?.creatorName}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Split: {payout?.splitPercentage}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        ${payout?.creatorEarnings?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        from ${payout?.simulatedRevenue?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Create Sandbox Test Scenario
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scenario Name
                  </label>
                  <input
                    type="text"
                    value={newConfig?.sandboxName}
                    onChange={(e) => setNewConfig({ ...newConfig, sandboxName: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 90/10 Morale Booster Test"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newConfig?.description}
                    onChange={(e) => setNewConfig({ ...newConfig, description: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Describe the test scenario..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Creator Percentage
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newConfig?.creatorPercentage}
                      onChange={(e) =>
                        setNewConfig({
                          ...newConfig,
                          creatorPercentage: parseInt(e?.target?.value),
                          platformPercentage: 100 - parseInt(e?.target?.value)
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform Percentage
                    </label>
                    <input
                      type="number"
                      value={newConfig?.platformPercentage}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scenario Type
                  </label>
                  <select
                    value={newConfig?.testScenarioType}
                    onChange={(e) => setNewConfig({ ...newConfig, testScenarioType: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {scenarioTypes?.map((type) => (
                      <option key={type?.value} value={type?.value}>
                        {type?.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={newConfig?.testDurationDays}
                    onChange={(e) => setNewConfig({ ...newConfig, testDurationDays: parseInt(e?.target?.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateSandbox}
                  disabled={loading || !newConfig?.sandboxName}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Sandbox
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SandboxTestingPanel;