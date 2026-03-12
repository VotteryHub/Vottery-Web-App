import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const OutcomeCapturePanel = () => {
  const [outcomeData, setOutcomeData] = useState({
    recentCaptures: [],
    captureRate: 0,
    categories: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutcomeData();
  }, []);

  const fetchOutcomeData = async () => {
    try {
      setLoading(true);
      // Simulated data - integrate with actual outcome capture service
      setTimeout(() => {
        setOutcomeData({
          recentCaptures: [
            { id: 1, type: 'Dispute Resolution', outcome: 'Approved', confidence: 0.94, timestamp: '2 min ago' },
            { id: 2, type: 'Fraud Detection', outcome: 'False Positive', confidence: 0.67, timestamp: '5 min ago' },
            { id: 3, type: 'Appeal Decision', outcome: 'Overturned', confidence: 0.89, timestamp: '8 min ago' },
            { id: 4, type: 'Moderator Override', outcome: 'Confirmed', confidence: 0.98, timestamp: '12 min ago' },
            { id: 5, type: 'Dispute Resolution', outcome: 'Rejected', confidence: 0.91, timestamp: '15 min ago' }
          ],
          captureRate: 98.7,
          categories: [
            { name: 'Dispute Resolutions', count: 3421, accuracy: 94.2 },
            { name: 'Appeal Decisions', count: 1876, accuracy: 91.8 },
            { name: 'Fraud Detections', count: 5234, accuracy: 88.5 },
            { name: 'Moderator Overrides', count: 892, accuracy: 96.7 }
          ]
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching outcome data:', error);
      setLoading(false);
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'Approved': case'Confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Overturned': case'False Positive':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Outcome Capture Engine</h2>
            <p className="text-sm text-gray-600">Automated resolution result collection</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">{outcomeData?.captureRate}%</span>
        </div>
      </div>
      {/* Recent Captures */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Captures</h3>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 })?.map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            outcomeData?.recentCaptures?.map((capture) => (
              <div
                key={capture?.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getOutcomeIcon(capture?.outcome)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{capture?.type}</p>
                    <p className="text-xs text-gray-500">{capture?.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{capture?.outcome}</p>
                  <p className="text-xs text-gray-500">Confidence: {(capture?.confidence * 100)?.toFixed(1)}%</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Capture Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Capture Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            Array.from({ length: 4 })?.map((_, idx) => (
              <div key={idx} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            outcomeData?.categories?.map((category, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="text-xs font-medium text-gray-600 mb-1">{category?.name}</p>
                <p className="text-lg font-bold text-gray-900">{category?.count?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Accuracy: {category?.accuracy}%</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OutcomeCapturePanel;