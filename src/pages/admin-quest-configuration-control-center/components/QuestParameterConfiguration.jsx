import React, { useState, useEffect } from 'react';
import { Sliders, Save, RotateCcw, TrendingUp, Target, Clock, Award } from 'lucide-react';

const QuestParameterConfiguration = () => {
  const [parameters, setParameters] = useState({
    difficultyScaling: {
      easy: { multiplier: 1.0, vpReward: 50, xpReward: 25 },
      medium: { multiplier: 1.5, vpReward: 150, xpReward: 75 },
      hard: { multiplier: 2.5, vpReward: 350, xpReward: 175 }
    },
    rewardMultipliers: {
      streakBonus: 1.2,
      weekendBonus: 1.15,
      categoryExploration: 1.3,
      speedCompletion: 1.25
    },
    questFrequency: {
      dailyQuestsPerUser: 3,
      weeklyQuestsPerUser: 2,
      refreshTime: '00:00',
      maxActiveQuests: 5
    },
    categoryParameters: {
      politics: { weight: 1.2, minVotes: 3 },
      entertainment: { weight: 1.0, minVotes: 2 },
      sports: { weight: 1.1, minVotes: 2 },
      technology: { weight: 1.3, minVotes: 3 },
      general: { weight: 1.0, minVotes: 2 }
    }
  });
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setSaving(false);
  };

  const handleReset = () => {
    // Reset to default values
    setParameters({
      difficultyScaling: {
        easy: { multiplier: 1.0, vpReward: 50, xpReward: 25 },
        medium: { multiplier: 1.5, vpReward: 150, xpReward: 75 },
        hard: { multiplier: 2.5, vpReward: 350, xpReward: 175 }
      },
      rewardMultipliers: {
        streakBonus: 1.2,
        weekendBonus: 1.15,
        categoryExploration: 1.3,
        speedCompletion: 1.25
      },
      questFrequency: {
        dailyQuestsPerUser: 3,
        weeklyQuestsPerUser: 2,
        refreshTime: '00:00',
        maxActiveQuests: 5
      },
      categoryParameters: {
        politics: { weight: 1.2, minVotes: 3 },
        entertainment: { weight: 1.0, minVotes: 2 },
        sports: { weight: 1.1, minVotes: 2 },
        technology: { weight: 1.3, minVotes: 3 },
        general: { weight: 1.0, minVotes: 2 }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-600" />
            Quest Parameter Configuration
          </h2>
          <p className="text-gray-600 mt-1">Manage difficulty scaling, reward multipliers, and category-specific parameters</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      {lastSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            Last saved: {lastSaved?.toLocaleString()}
          </p>
        </div>
      )}
      {/* Difficulty Scaling */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Difficulty Scaling Algorithms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(parameters?.difficultyScaling)?.map(([difficulty, values]) => (
            <div key={difficulty} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-3 capitalize">{difficulty}</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Multiplier</label>
                  <input
                    type="number"
                    step="0.1"
                    value={values?.multiplier}
                    onChange={(e) => setParameters({
                      ...parameters,
                      difficultyScaling: {
                        ...parameters?.difficultyScaling,
                        [difficulty]: { ...values, multiplier: parseFloat(e?.target?.value) }
                      }
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">VP Reward</label>
                  <input
                    type="number"
                    value={values?.vpReward}
                    onChange={(e) => setParameters({
                      ...parameters,
                      difficultyScaling: {
                        ...parameters?.difficultyScaling,
                        [difficulty]: { ...values, vpReward: parseInt(e?.target?.value) }
                      }
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">XP Reward</label>
                  <input
                    type="number"
                    value={values?.xpReward}
                    onChange={(e) => setParameters({
                      ...parameters,
                      difficultyScaling: {
                        ...parameters?.difficultyScaling,
                        [difficulty]: { ...values, xpReward: parseInt(e?.target?.value) }
                      }
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Reward Multipliers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Reward Multiplier Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(parameters?.rewardMultipliers)?.map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.trim()}
              </label>
              <input
                type="number"
                step="0.05"
                value={value}
                onChange={(e) => setParameters({
                  ...parameters,
                  rewardMultipliers: {
                    ...parameters?.rewardMultipliers,
                    [key]: parseFloat(e?.target?.value)
                  }
                })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Quest Frequency Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Quest Frequency Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Daily Quests Per User</label>
            <input
              type="number"
              value={parameters?.questFrequency?.dailyQuestsPerUser}
              onChange={(e) => setParameters({
                ...parameters,
                questFrequency: {
                  ...parameters?.questFrequency,
                  dailyQuestsPerUser: parseInt(e?.target?.value)
                }
              })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Weekly Quests Per User</label>
            <input
              type="number"
              value={parameters?.questFrequency?.weeklyQuestsPerUser}
              onChange={(e) => setParameters({
                ...parameters,
                questFrequency: {
                  ...parameters?.questFrequency,
                  weeklyQuestsPerUser: parseInt(e?.target?.value)
                }
              })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Refresh Time (UTC)</label>
            <input
              type="time"
              value={parameters?.questFrequency?.refreshTime}
              onChange={(e) => setParameters({
                ...parameters,
                questFrequency: {
                  ...parameters?.questFrequency,
                  refreshTime: e?.target?.value
                }
              })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Max Active Quests</label>
            <input
              type="number"
              value={parameters?.questFrequency?.maxActiveQuests}
              onChange={(e) => setParameters({
                ...parameters,
                questFrequency: {
                  ...parameters?.questFrequency,
                  maxActiveQuests: parseInt(e?.target?.value)
                }
              })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      {/* Category-Specific Parameters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Category-Specific Challenge Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(parameters?.categoryParameters)?.map(([category, values]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-3 capitalize">{category}</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    value={values?.weight}
                    onChange={(e) => setParameters({
                      ...parameters,
                      categoryParameters: {
                        ...parameters?.categoryParameters,
                        [category]: { ...values, weight: parseFloat(e?.target?.value) }
                      }
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Min Votes Required</label>
                  <input
                    type="number"
                    value={values?.minVotes}
                    onChange={(e) => setParameters({
                      ...parameters,
                      categoryParameters: {
                        ...parameters?.categoryParameters,
                        [category]: { ...values, minVotes: parseInt(e?.target?.value) }
                      }
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Automated Optimization Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Optimization Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Increase medium difficulty VP rewards by 10%</p>
              <p className="text-xs text-gray-600">Based on 15% lower completion rate compared to easy quests</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Adjust politics category weight to 1.3</p>
              <p className="text-xs text-gray-600">Higher engagement detected in this category (+23% vs baseline)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Enable weekend bonus multiplier increase to 1.25</p>
              <p className="text-xs text-gray-600">Weekend activity 40% higher than weekdays</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestParameterConfiguration;