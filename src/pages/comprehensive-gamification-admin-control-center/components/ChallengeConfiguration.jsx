import React, { useState } from 'react';
import { Target, Plus, Edit, Trash2, Calendar, Award } from 'lucide-react';

const ChallengeConfiguration = () => {
  const [challenges, setChallenges] = useState([
    { id: 1, name: 'Vote in 3 Elections', type: 'daily', reward: 50, active: true, completions: 1250 },
    { id: 2, name: 'Complete 5 Ad Votes', type: 'daily', reward: 75, active: true, completions: 890 },
    { id: 3, name: 'Maintain 7-Day Streak', type: 'weekly', reward: 200, active: true, completions: 340 },
    { id: 4, name: 'Predict 5 Elections Correctly', type: 'weekly', reward: 300, active: true, completions: 180 },
    { id: 5, name: 'Scroll 10 Feed Posts', type: 'daily', reward: 20, active: true, completions: 2100 }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    type: 'daily',
    reward: 50,
    description: ''
  });

  const handleCreateChallenge = () => {
    const challenge = {
      id: challenges?.length + 1,
      ...newChallenge,
      active: true,
      completions: 0
    };
    setChallenges([...challenges, challenge]);
    setShowCreateModal(false);
    setNewChallenge({ name: '', type: 'daily', reward: 50, description: '' });
  };

  const handleToggleChallenge = (id) => {
    setChallenges(challenges?.map(c => 
      c?.id === id ? { ...c, active: !c?.active } : c
    ));
  };

  const handleDeleteChallenge = (id) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      setChallenges(challenges?.filter(c => c?.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Challenge Configuration</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage daily/weekly challenges and quests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Challenge
        </button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Active Challenges</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {challenges?.filter(c => c?.active)?.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Daily Challenges</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {challenges?.filter(c => c?.type === 'daily')?.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Total Completions</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {challenges?.reduce((sum, c) => sum + c?.completions, 0)?.toLocaleString()}
          </div>
        </div>
      </div>
      {/* Challenge List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {challenges?.map(challenge => (
          <div key={challenge?.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{challenge?.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    challenge?.type === 'daily' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {challenge?.type}
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    {challenge?.reward} VP
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {challenge?.completions?.toLocaleString()} completions
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleChallenge(challenge?.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    challenge?.active 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {challenge?.active ? 'Active' : 'Inactive'}
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteChallenge(challenge?.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Challenge</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Name</label>
                <input
                  type="text"
                  value={newChallenge?.name}
                  onChange={(e) => setNewChallenge({ ...newChallenge, name: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Vote in 5 Elections"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newChallenge?.type}
                  onChange={(e) => setNewChallenge({ ...newChallenge, type: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VP Reward</label>
                <input
                  type="number"
                  value={newChallenge?.reward}
                  onChange={(e) => setNewChallenge({ ...newChallenge, reward: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newChallenge?.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe the challenge..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateChallenge}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Challenge
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeConfiguration;