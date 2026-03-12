import React, { useState } from 'react';
import { TrendingUp, Globe, Users, Shield } from 'lucide-react';

const LeaderboardAdministration = () => {
  const [leaderboards, setLeaderboards] = useState([
    { id: 1, name: 'Global VP Rankings', type: 'global', participants: 45230, enabled: true },
    { id: 2, name: 'Regional VP Rankings', type: 'regional', participants: 12500, enabled: true },
    { id: 3, name: 'Friends VP Rankings', type: 'friends', participants: 8900, enabled: true },
    { id: 4, name: 'Prediction Accuracy', type: 'global', participants: 6700, enabled: true },
    { id: 5, name: 'Weekly Wins', type: 'weekly', participants: 15400, enabled: true }
  ]);

  const handleToggle = (id) => {
    setLeaderboards(leaderboards?.map(lb => 
      lb?.id === id ? { ...lb, enabled: !lb?.enabled } : lb
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Leaderboard Administration</h2>
        <p className="text-sm text-gray-600 mt-1">Manage ranking algorithms and competition parameters</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Active Leaderboards</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {leaderboards?.filter(lb => lb?.enabled)?.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Total Participants</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(leaderboards?.reduce((sum, lb) => sum + lb?.participants, 0) / 1000)?.toFixed(1)}K
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Global Rankings</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {leaderboards?.filter(lb => lb?.type === 'global')?.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Privacy Enabled</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">100%</div>
        </div>
      </div>
      {/* Leaderboard List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {leaderboards?.map(leaderboard => (
          <div key={leaderboard?.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{leaderboard?.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                    {leaderboard?.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {leaderboard?.participants?.toLocaleString()} participants
                </div>
              </div>
              <button
                onClick={() => handleToggle(leaderboard?.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  leaderboard?.enabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    leaderboard?.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardAdministration;