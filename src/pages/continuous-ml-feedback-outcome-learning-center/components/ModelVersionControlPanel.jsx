import React, { useState, useEffect } from 'react';
import { GitBranch, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const ModelVersionControlPanel = () => {
  const [versionData, setVersionData] = useState({
    currentVersion: '',
    versions: [],
    abTests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersionData();
  }, []);

  const fetchVersionData = async () => {
    try {
      setLoading(true);
      // Simulated data - integrate with actual version control service
      setTimeout(() => {
        setVersionData({
          currentVersion: '2.3.1',
          versions: [
            { version: '2.3.1', status: 'Production', accuracy: 94.7, deployed: '2 days ago', performance: 98 },
            { version: '2.3.0', status: 'Deprecated', accuracy: 92.1, deployed: '14 days ago', performance: 95 },
            { version: '2.2.5', status: 'Archived', accuracy: 89.8, deployed: '28 days ago', performance: 92 },
            { version: '2.4.0-beta', status: 'Testing', accuracy: 95.2, deployed: '1 day ago', performance: 99 }
          ],
          abTests: [
            { id: 1, name: 'Fraud Detection v2.3.1 vs v2.4.0-beta', traffic: 80, winner: 'TBD', status: 'Running' },
            { id: 2, name: 'Appeal Model v1.8 vs v1.9', traffic: 50, winner: 'v1.9', status: 'Completed' }
          ]
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching version data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Production':
        return 'bg-green-100 text-green-700';
      case 'Testing':
        return 'bg-blue-100 text-blue-700';
      case 'Deprecated':
        return 'bg-orange-100 text-orange-700';
      case 'Archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <GitBranch className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Model Version Control</h2>
            <p className="text-sm text-gray-600">Version management & A/B testing</p>
          </div>
        </div>
      </div>
      {/* Model Versions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Model Versions</h3>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 })?.map((_, idx) => (
              <div key={idx} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            versionData?.versions?.map((version, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  version?.status === 'Production' ?'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :'bg-gray-50 border-gray-200'
                } hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">v{version?.version}</span>
                    {version?.status === 'Production' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(version?.status)}`}>
                    {version?.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500 mb-1">Accuracy</p>
                    <p className="font-semibold text-gray-900">{version?.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Performance</p>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${version?.performance}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">{version?.performance}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Deployed</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-gray-900">{version?.deployed}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* A/B Tests */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Active A/B Tests</h3>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 2 })?.map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))
          ) : (
            versionData?.abTests?.map((test) => (
              <div
                key={test?.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{test?.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    test?.status === 'Running' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {test?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600">Traffic Split: {test?.traffic}%</span>
                  </div>
                  <span className="text-gray-600">
                    Winner: <span className="font-semibold text-gray-900">{test?.winner}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelVersionControlPanel;