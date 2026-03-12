import React, { useState } from 'react';
import { DollarSign, Clock, TrendingUp, Activity } from 'lucide-react';

const EfficiencyMetricsEngine = () => {
  const [services] = useState([
    {
      id: 'openai',
      name: 'OpenAI',
      costPerTask: 0.045,
      processingTime: 2.3,
      accuracyRate: 94.2,
      resourceUtilization: 87,
      monthlySpend: 45200
    },
    {
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      costPerTask: 0.038,
      processingTime: 2.8,
      accuracyRate: 95.1,
      resourceUtilization: 82,
      monthlySpend: 38900
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      costPerTask: 0.052,
      processingTime: 1.9,
      accuracyRate: 92.8,
      resourceUtilization: 91,
      monthlySpend: 52400
    },
    {
      id: 'gemini',
      name: 'Gemini',
      costPerTask: 0.028,
      processingTime: 1.6,
      accuracyRate: 93.5,
      resourceUtilization: 75,
      monthlySpend: 12800
    }
  ]);

  const [efficiencyTrends] = useState({
    totalSpend: 149300,
    avgCostPerTask: 0.041,
    potentialSavings: 42500,
    efficiencyScore: 78
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Efficiency Metrics Engine</h2>
        <p className="text-slate-600">Detailed analysis of cost-per-task ratios, processing efficiency, and resource utilization patterns</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium mb-1">Total Monthly Spend</div>
          <div className="text-2xl font-bold text-blue-900">${efficiencyTrends?.totalSpend?.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-600 font-medium mb-1">Avg Cost/Task</div>
          <div className="text-2xl font-bold text-purple-900">${efficiencyTrends?.avgCostPerTask?.toFixed(3)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium mb-1">Potential Savings</div>
          <div className="text-2xl font-bold text-green-900">${efficiencyTrends?.potentialSavings?.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="text-sm text-indigo-600 font-medium mb-1">Efficiency Score</div>
          <div className="text-2xl font-bold text-indigo-900">{efficiencyTrends?.efficiencyScore}%</div>
        </div>
      </div>

      {/* Service Comparison */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Cost-Per-Task Analysis Across Services</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Cost/Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Processing Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Accuracy Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Resource Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Monthly Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {services?.map((service) => (
                <tr key={service?.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{service?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">${service?.costPerTask?.toFixed(3)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">{service?.processingTime}s</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-semibold ${
                      service?.accuracyRate >= 95 ? 'text-green-600' :
                      service?.accuracyRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {service?.accuracyRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            service?.resourceUtilization >= 85 ? 'bg-red-500' :
                            service?.resourceUtilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${service?.resourceUtilization}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-900">{service?.resourceUtilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900">${service?.monthlySpend?.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Efficiency Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Cost Optimization Opportunities
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Gemini Migration Potential</div>
                <div className="text-sm text-slate-600">38% cost reduction by migrating 60% of tasks to Gemini</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Resource Optimization</div>
                <div className="text-sm text-slate-600">Reduce high-utilization services by 15%</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Task Routing Efficiency</div>
                <div className="text-sm text-slate-600">Intelligent routing based on task complexity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Predictive Modeling
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">ROI Calculations</div>
                <div className="text-sm text-slate-600">Projected 6-month ROI: $127,450</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Cost Trend Analysis</div>
                <div className="text-sm text-slate-600">Monthly spend trending down 12% with optimizations</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Efficiency Forecasting</div>
                <div className="text-sm text-slate-600">Predicted efficiency score: 92% (up from 78%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyMetricsEngine;