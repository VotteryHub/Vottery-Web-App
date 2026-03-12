import React, { useState } from 'react';
import { Zap, TrendingUp, Flag, Settings, Play } from 'lucide-react';

const AutomatedOptimization = ({ experiments = [], onRefresh }) => {
  const [autoOptimizationEnabled, setAutoOptimizationEnabled] = useState(true);

  return (
    <div className="space-y-6">
      {/* Automated Traffic Optimization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Automated Traffic Optimization
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoOptimizationEnabled}
                onChange={(e) => setAutoOptimizationEnabled(e?.target?.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Multi-Armed Bandit Algorithm</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Automatically allocates more traffic to better-performing variants while continuing to explore alternatives.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-900 dark:text-blue-100">Control</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '20%' }} />
                    </div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100 w-12">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-900 dark:text-blue-100">Variant A</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600" style={{ width: '50%' }} />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 w-12">50%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-900 dark:text-blue-100">Variant B</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '30%' }} />
                    </div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100 w-12">30%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Exploration Rate</h4>
                <input
                  type="range"
                  min="5"
                  max="30"
                  defaultValue="15"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5%</span>
                  <span className="font-medium">15%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Update Frequency</h4>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option>Every 100 visitors</option>
                  <option>Every 500 visitors</option>
                  <option>Every 1000 visitors</option>
                  <option>Hourly</option>
                  <option>Daily</option>
                </select>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Min Traffic per Variant</h4>
                <input
                  type="number"
                  defaultValue="10"
                  min="5"
                  max="25"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Percentage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sequential Testing Protocols */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Sequential Testing Protocols
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Always Valid Inference</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Allows peeking at results at any time without inflating false positive rates
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Early Stopping Rules</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Stop experiments early when clear winner emerges or futility detected
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Superiority Threshold</label>
                  <input
                    type="number"
                    defaultValue="99"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Futility Threshold</label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Feature Flagging Integration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-green-600" />
            Feature Flagging Integration
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {experiments?.slice(0, 2)?.map((experiment) => (
              <div key={experiment?.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{experiment?.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Feature Flag: <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">experiment_{experiment?.id}</code>
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    <Play className="w-4 h-4" />
                    Deploy Winner
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Rollout</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{experiment?.traffic}%</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Target Rollout</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">100%</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Rollout Speed</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">10%/day</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Gradual Rollout Strategy</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Winning variants can be gradually rolled out to 100% of users with automated monitoring for regressions.
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                Configure Rollout
              </button>
              <button className="px-4 py-2 border border-yellow-600 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-sm font-medium">
                View Rollout Plan
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Experiment Cloning */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            Experiment Cloning & Templates
          </h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Quickly create new experiments based on successful past tests or predefined templates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiments?.slice(0, 2)?.map((experiment) => (
              <div key={experiment?.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{experiment?.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span>{experiment?.variants} variants</span>
                  <span>•</span>
                  <span>{experiment?.significance}% confidence</span>
                </div>
                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium">
                  Clone Experiment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedOptimization;