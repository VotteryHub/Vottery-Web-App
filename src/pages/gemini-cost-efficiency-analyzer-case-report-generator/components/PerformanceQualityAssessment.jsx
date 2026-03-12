import React, { useState } from 'react';
import { TrendingUp, Award, BarChart3, CheckCircle } from 'lucide-react';

const PerformanceQualityAssessment = () => {
  const [qualityMetrics] = useState([
    {
      service: 'OpenAI',
      accuracyScore: 94.2,
      responseQuality: 92.5,
      taskCompletion: 96.8,
      confidenceInterval: '±2.1%',
      statisticalSignificance: 'High'
    },
    {
      service: 'Anthropic',
      accuracyScore: 95.1,
      responseQuality: 94.3,
      taskCompletion: 97.2,
      confidenceInterval: '±1.8%',
      statisticalSignificance: 'High'
    },
    {
      service: 'Perplexity',
      accuracyScore: 92.8,
      responseQuality: 91.2,
      taskCompletion: 95.4,
      confidenceInterval: '±2.4%',
      statisticalSignificance: 'Medium'
    },
    {
      service: 'Gemini',
      accuracyScore: 93.5,
      responseQuality: 92.8,
      taskCompletion: 96.1,
      confidenceInterval: '±1.9%',
      statisticalSignificance: 'High'
    }
  ]);

  const [comparativeAnalysis] = useState({
    bestAccuracy: 'Anthropic',
    bestValue: 'Gemini',
    bestSpeed: 'Gemini',
    recommendedMigration: 60
  });

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Performance Quality Assessment</h2>
        <p className="text-slate-600">Service accuracy comparisons, response quality scoring, and task completion effectiveness</p>
      </div>

      {/* Quality Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Service Quality Metrics Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Accuracy Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Response Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Task Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Confidence Interval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {qualityMetrics?.map((metric, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{metric?.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${getScoreColor(metric?.accuracyScore)}`}>
                        {metric?.accuracyScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-semibold ${getScoreColor(metric?.responseQuality)}`}>
                      {metric?.responseQuality}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-semibold ${getScoreColor(metric?.taskCompletion)}`}>
                      {metric?.taskCompletion}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-900">{metric?.confidenceInterval}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      metric?.statisticalSignificance === 'High' ? 'bg-green-100 text-green-700' :
                      metric?.statisticalSignificance === 'Medium'? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {metric?.statisticalSignificance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Performance Leaders
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm text-slate-600">Best Accuracy</div>
                <div className="font-semibold text-slate-900">{comparativeAnalysis?.bestAccuracy}</div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-slate-600">Best Value</div>
                <div className="font-semibold text-slate-900">{comparativeAnalysis?.bestValue}</div>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="text-sm text-slate-600">Best Speed</div>
                <div className="font-semibold text-slate-900">{comparativeAnalysis?.bestSpeed}</div>
              </div>
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Statistical Significance Testing
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Confidence Intervals</div>
                <div className="text-sm text-slate-600">95% confidence level across all metrics</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Sample Size</div>
                <div className="text-sm text-slate-600">10,000+ tasks analyzed per service</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">P-Value Analysis</div>
                <div className="text-sm text-slate-600">All comparisons statistically significant (p &lt; 0.05)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Quality-Based Recommendation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-slate-600 mb-2">Recommended Migration to Gemini</div>
            <div className="text-4xl font-bold text-green-600 mb-2">{comparativeAnalysis?.recommendedMigration}%</div>
            <div className="text-sm text-slate-600">
              Based on quality metrics, Gemini can handle 60% of current workload with minimal quality impact while significantly reducing costs.
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-slate-600">Quality Retention</span>
              <span className="font-semibold text-slate-900">98.5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-slate-600">Cost Reduction</span>
              <span className="font-semibold text-green-600">38%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-sm text-slate-600">Speed Improvement</span>
              <span className="font-semibold text-blue-600">22%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceQualityAssessment;