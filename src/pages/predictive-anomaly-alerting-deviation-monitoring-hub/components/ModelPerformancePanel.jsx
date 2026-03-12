import React from 'react';
import { Settings, TrendingUp, Target, Activity } from 'lucide-react';

const ModelPerformancePanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-blue-600" />
          Model Performance Analytics
        </h2>
        <p className="text-gray-600 mb-6">Custom deviation thresholds, predictive model comparison, and automated model retraining triggers based on deviation patterns</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Overall Accuracy</h3>
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">91.8%</p>
            <p className="text-sm text-gray-700">Across all predictions</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Precision Score</h3>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">89.3%</p>
            <p className="text-sm text-gray-700">True positive rate</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recall Score</h3>
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-4xl font-bold text-purple-600 mb-2">93.7%</p>
            <p className="text-sm text-gray-700">Sensitivity measure</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">F1 Score</h3>
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-4xl font-bold text-orange-600 mb-2">91.5%</p>
            <p className="text-sm text-gray-700">Harmonic mean</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Model Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Precision</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Recall</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">F1 Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-900">OpenAI GPT-5</td>
                <td className="py-3 px-4 text-green-600 font-semibold">91.8%</td>
                <td className="py-3 px-4 text-green-600 font-semibold">89.3%</td>
                <td className="py-3 px-4 text-green-600 font-semibold">93.7%</td>
                <td className="py-3 px-4 text-green-600 font-semibold">91.5%</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-900">Claude 3.5 Sonnet</td>
                <td className="py-3 px-4 text-blue-600 font-semibold">89.5%</td>
                <td className="py-3 px-4 text-blue-600 font-semibold">87.1%</td>
                <td className="py-3 px-4 text-blue-600 font-semibold">91.2%</td>
                <td className="py-3 px-4 text-blue-600 font-semibold">89.1%</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Backup</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-900">Perplexity AI</td>
                <td className="py-3 px-4 text-purple-600 font-semibold">88.2%</td>
                <td className="py-3 px-4 text-purple-600 font-semibold">85.7%</td>
                <td className="py-3 px-4 text-purple-600 font-semibold">90.3%</td>
                <td className="py-3 px-4 text-purple-600 font-semibold">87.9%</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Testing</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Model Retraining</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Retraining trigger threshold</span>
              <span className="text-blue-600 font-semibold">20% deviation</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Last retraining</span>
              <span className="text-blue-600 font-semibold">2 days ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Next scheduled retraining</span>
              <span className="text-blue-600 font-semibold">5 days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Automated retraining</span>
              <span className="text-green-600 font-semibold">Enabled</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Deviation Thresholds</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Revenue Forecasts</span>
                <span className="text-sm font-semibold text-gray-900">12%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">User Engagement</span>
                <span className="text-sm font-semibold text-gray-900">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Fraud Patterns</span>
                <span className="text-sm font-semibold text-gray-900">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Campaign Performance</span>
                <span className="text-sm font-semibold text-gray-900">18%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformancePanel;