import React, { useState } from 'react';
import { Settings, Target, Users, Calendar, Zap } from 'lucide-react';

const ExperimentConfiguration = ({ onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    hypothesis: '',
    successMetric: 'conversion_rate',
    startDate: '',
    endDate: '',
    trafficAllocation: 100,
    targetAudience: []
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Creating experiment:', formData);
    onRefresh?.();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Create New Experiment
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4" />
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experiment Name *
              </label>
              <input
                type="text"
                required
                value={formData?.name}
                onChange={(e) => setFormData({ ...formData, name: e?.target?.value })}
                placeholder="e.g., Homepage CTA Button Color Test"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hypothesis *
              </label>
              <textarea
                required
                value={formData?.hypothesis}
                onChange={(e) => setFormData({ ...formData, hypothesis: e?.target?.value })}
                placeholder="e.g., Changing the CTA button from blue to green will increase click-through rate by 10%"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Success Metrics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Success Metrics
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Metric *
              </label>
              <select
                value={formData?.successMetric}
                onChange={(e) => setFormData({ ...formData, successMetric: e?.target?.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="conversion_rate">Conversion Rate</option>
                <option value="click_through_rate">Click-Through Rate</option>
                <option value="engagement_time">Engagement Time</option>
                <option value="revenue_per_user">Revenue Per User</option>
                <option value="signup_rate">Signup Rate</option>
                <option value="retention_rate">Retention Rate</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Detectable Effect (%)
                </label>
                <input
                  type="number"
                  defaultValue="10"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statistical Confidence (%)
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="90">90%</option>
                  <option value="95" selected>95%</option>
                  <option value="99">99%</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audience Targeting */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Audience Targeting
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">User Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">All Users</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">New Users Only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Returning Users</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Premium Members</span>
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Device</h4>
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
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Tablet</span>
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Geography</h4>
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
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Other Regions</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData?.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e?.target?.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData?.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e?.target?.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Traffic Allocation: {formData?.trafficAllocation}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={formData?.trafficAllocation}
                onChange={(e) => setFormData({ ...formData, trafficAllocation: parseInt(e?.target?.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Experiment
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperimentConfiguration;