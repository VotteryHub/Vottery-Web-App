import React, { useState } from 'react';
import { Sparkles, Target, TrendingUp, Award } from 'lucide-react';

const PredictionPoolsManagement = () => {
  const [pools, setPools] = useState([
    { id: 1, election: 'Presidential Election 2024', participants: 15400, status: 'active', avgAccuracy: 72.5 },
    { id: 2, election: 'Movie Box Office Prediction', participants: 8900, status: 'active', avgAccuracy: 68.3 },
    { id: 3, election: 'Sports Championship Winner', participants: 12300, status: 'resolved', avgAccuracy: 81.2 },
    { id: 4, election: 'Tech Product Launch Hype', participants: 6700, status: 'active', avgAccuracy: 65.8 }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Prediction Pools Management</h2>
        <p className="text-sm text-gray-600 mt-1">Manage election prediction pools with Brier scoring</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Active Pools</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {pools?.filter(p => p?.status === 'active')?.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Participants</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(pools?.reduce((sum, p) => sum + p?.participants, 0) / 1000)?.toFixed(1)}K
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Avg Accuracy</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(pools?.reduce((sum, p) => sum + p?.avgAccuracy, 0) / pools?.length)?.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Resolved Pools</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {pools?.filter(p => p?.status === 'resolved')?.length}
          </div>
        </div>
      </div>
      {/* Pool List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {pools?.map(pool => (
          <div key={pool?.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{pool?.election}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    pool?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {pool?.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{pool?.participants?.toLocaleString()} participants</span>
                  <span>•</span>
                  <span>{pool?.avgAccuracy}% avg accuracy</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Brier Scoring Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Brier Score Formula</h4>
        <p className="text-sm text-blue-700">
          Accuracy = 1 - avg((prediction_i - actual_i)²)
          <br />
          Perfect prediction = 0, Worst prediction = 1
          <br />
          VP Reward = Accuracy × 100 (max 100 VP for perfect predictions)
        </p>
      </div>
    </div>
  );
};

export default PredictionPoolsManagement;