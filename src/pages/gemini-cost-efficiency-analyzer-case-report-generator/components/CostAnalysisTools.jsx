import React, { useState } from 'react';
import { DollarSign, BarChart3, PieChart } from 'lucide-react';

const CostAnalysisTools = () => {
  const [customThresholds, setCustomThresholds] = useState({
    costPerTaskMax: 0.05,
    efficiencyMin: 80,
    savingsMin: 10000
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Detailed Cost Analysis Tools</h2>
        <p className="text-slate-600">Advanced cost analysis, report customization, and financial tracking integration</p>
      </div>
      {/* Custom Thresholds */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Custom Efficiency Thresholds</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Maximum Cost Per Task</label>
              <span className="text-sm font-semibold text-slate-900">${customThresholds?.costPerTaskMax?.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.10"
              step="0.005"
              value={customThresholds?.costPerTaskMax}
              onChange={(e) => setCustomThresholds(prev => ({ ...prev, costPerTaskMax: parseFloat(e?.target?.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Minimum Efficiency Score</label>
              <span className="text-sm font-semibold text-slate-900">{customThresholds?.efficiencyMin}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={customThresholds?.efficiencyMin}
              onChange={(e) => setCustomThresholds(prev => ({ ...prev, efficiencyMin: parseInt(e?.target?.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Minimum Savings Threshold</label>
              <span className="text-sm font-semibold text-slate-900">${customThresholds?.savingsMin?.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={customThresholds?.savingsMin}
              onChange={(e) => setCustomThresholds(prev => ({ ...prev, savingsMin: parseInt(e?.target?.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      {/* Report Customization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Report Customization
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Include cost-per-task breakdown</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Performance quality metrics</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">ROI projections (6 & 12 months)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Risk assessment analysis</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Historical trend comparison</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">Competitive benchmarking</span>
            </label>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Automated Report Scheduling
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Report Frequency</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Delivery Method</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Email</option>
                <option>Dashboard Only</option>
                <option>Email + Dashboard</option>
                <option>Slack Integration</option>
              </select>
            </div>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
              Save Schedule
            </button>
          </div>
        </div>
      </div>
      {/* Financial Tracking Integration */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Financial Tracking Integration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="font-medium text-slate-900 mb-2">Budget Tracking</div>
            <div className="text-sm text-slate-600">Real-time monitoring against allocated AI service budgets</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="font-medium text-slate-900 mb-2">Expense Forecasting</div>
            <div className="text-sm text-slate-600">Predictive analysis of future AI service costs</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="font-medium text-slate-900 mb-2">Savings Tracking</div>
            <div className="text-sm text-slate-600">Measure actual savings vs. projected savings</div>
          </div>
        </div>
      </div>
      {/* Cost Breakdown Visualization */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Monthly Cost Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700">OpenAI</span>
              <span className="font-semibold text-slate-900">$45,200 (30.3%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-blue-500" style={{ width: '30.3%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700">Perplexity</span>
              <span className="font-semibold text-slate-900">$52,400 (35.1%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-green-500" style={{ width: '35.1%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700">Anthropic</span>
              <span className="font-semibold text-slate-900">$38,900 (26.1%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-purple-500" style={{ width: '26.1%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700">Gemini</span>
              <span className="font-semibold text-slate-900">$12,800 (8.6%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-orange-500" style={{ width: '8.6%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysisTools;