import React, { useState } from 'react';
import { Target, Users, Plus, Trash2 } from 'lucide-react';

const MultiVariantTestingEngine = ({ experiments = [], onRefresh }) => {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [variants, setVariants] = useState([
    { id: 'control', name: 'Control', traffic: 25, conversions: 120, conversionRate: 2.4 },
    { id: 'variant-a', name: 'Variant A', traffic: 25, conversions: 145, conversionRate: 2.9 },
    { id: 'variant-b', name: 'Variant B', traffic: 25, conversions: 132, conversionRate: 2.6 },
    { id: 'variant-c', name: 'Variant C', traffic: 25, conversions: 158, conversionRate: 3.2 }
  ]);

  const addVariant = () => {
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: `Variant ${String.fromCharCode(65 + variants?.length - 1)}`,
      traffic: 0,
      conversions: 0,
      conversionRate: 0
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (id) => {
    setVariants(variants?.filter(v => v?.id !== id));
  };

  const updateTraffic = (id, value) => {
    setVariants(variants?.map(v => v?.id === id ? { ...v, traffic: parseInt(value) || 0 } : v));
  };

  const totalTraffic = variants?.reduce((sum, v) => sum + v?.traffic, 0);

  return (
    <div className="space-y-6">
      {/* Traffic Allocation Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Traffic Allocation Matrix
            </h2>
            <button
              onClick={addVariant}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Traffic Summary */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Traffic Allocation</span>
              <span className={`text-2xl font-bold ${
                totalTraffic === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {totalTraffic}%
              </span>
            </div>
            {totalTraffic !== 100 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Traffic allocation must equal 100%
              </p>
            )}
          </div>

          {/* Variants Table */}
          <div className="space-y-4">
            {variants?.map((variant, index) => (
              <div
                key={variant?.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={variant?.name}
                        onChange={(e) => {
                          setVariants(variants?.map(v => v?.id === variant?.id ? { ...v, name: e?.target?.value } : v));
                        }}
                        className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 outline-none text-gray-900 dark:text-white"
                      />
                      {index === 0 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          Control
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Traffic Allocation (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={variant?.traffic}
                          onChange={(e) => updateTraffic(variant?.id, e?.target?.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversions</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{variant?.conversions}</div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{variant?.conversionRate}%</div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lift vs Control</div>
                        <div className={`text-xl font-bold ${
                          variant?.conversionRate > variants?.[0]?.conversionRate
                            ? 'text-green-600 dark:text-green-400' :'text-red-600 dark:text-red-400'
                        }`}>
                          {index === 0 ? '—' : `${((variant?.conversionRate - variants?.[0]?.conversionRate) / variants?.[0]?.conversionRate * 100)?.toFixed(1)}%`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      onClick={() => removeVariant(variant?.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Traffic Visualization */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${variant?.traffic}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3">
            <button
              disabled={totalTraffic !== 100}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Save Configuration
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
              Reset to Equal Split
            </button>
          </div>
        </div>
      </div>
      {/* Segment-Based Testing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Segment-Based Testing
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Geographic Segments</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">North America</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Europe</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Asia Pacific</span>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">User Type</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New Users</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Returning Users</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Premium Users</span>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Device Type</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Desktop</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mobile</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Tablet</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiVariantTestingEngine;