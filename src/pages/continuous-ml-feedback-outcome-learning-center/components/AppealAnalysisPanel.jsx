import React, { useState, useEffect } from 'react';
import { Scale, AlertCircle, TrendingDown, BarChart3 } from 'lucide-react';

const AppealAnalysisPanel = () => {
  const [appealData, setAppealData] = useState({
    reversalRate: 0,
    biasScore: 0,
    recentAppeals: [],
    adjustments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppealData();
  }, []);

  const fetchAppealData = async () => {
    try {
      setLoading(true);
      // Simulated data - integrate with actual appeal analysis service
      setTimeout(() => {
        setAppealData({
          reversalRate: 8.3,
          biasScore: 2.1,
          recentAppeals: [
            { id: 1, caseId: 'APP-2847', decision: 'Overturned', impact: 'High', category: 'Fraud Detection' },
            { id: 2, caseId: 'APP-2846', decision: 'Upheld', impact: 'Low', category: 'Content Moderation' },
            { id: 3, caseId: 'APP-2845', decision: 'Overturned', impact: 'Medium', category: 'Dispute Resolution' },
            { id: 4, caseId: 'APP-2844', decision: 'Upheld', impact: 'Low', category: 'Fraud Detection' }
          ],
          adjustments: [
            { parameter: 'Fraud Threshold', oldValue: 0.75, newValue: 0.68, reason: 'High false positive rate' },
            { parameter: 'Appeal Weight', oldValue: 1.2, newValue: 1.5, reason: 'Reversal pattern detected' },
            { parameter: 'Bias Correction', oldValue: 0.05, newValue: 0.08, reason: 'Demographic disparity' }
          ]
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching appeal data:', error);
      setLoading(false);
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-orange-600 bg-orange-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Scale className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Appeal Decision Analysis</h2>
            <p className="text-sm text-gray-600">Reversal patterns & bias detection</p>
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-600">Reversal Rate</span>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{appealData?.reversalRate}%</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-600">Bias Score</span>
          </div>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{appealData?.biasScore}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Lower is better</p>
        </div>
      </div>
      {/* Recent Appeals */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Appeal Decisions</h3>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 })?.map((_, idx) => (
              <div key={idx} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            appealData?.recentAppeals?.map((appeal) => (
              <div
                key={appeal?.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{appeal?.caseId}</p>
                  <p className="text-xs text-gray-500">{appeal?.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(appeal?.impact)}`}>
                    {appeal?.impact}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appeal?.decision === 'Overturned' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {appeal?.decision}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Model Adjustments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Automated Model Adjustments
        </h3>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 3 })?.map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            appealData?.adjustments?.map((adjustment, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{adjustment?.parameter}</p>
                  <span className="text-xs text-gray-500">{adjustment?.oldValue} → {adjustment?.newValue}</span>
                </div>
                <p className="text-xs text-gray-600">{adjustment?.reason}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppealAnalysisPanel;