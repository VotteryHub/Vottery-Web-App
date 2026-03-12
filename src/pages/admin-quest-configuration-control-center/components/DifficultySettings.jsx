import React, { useState } from 'react';
import { Target, TrendingUp, Users, Brain, Zap } from 'lucide-react';

const DifficultySettings = () => {
  const [adaptiveScaling, setAdaptiveScaling] = useState({
    enabled: true,
    minLevel: 1,
    maxLevel: 100,
    scalingFactor: 1.05
  });
  const [skillAssessment, setSkillAssessment] = useState({
    enabled: true,
    assessmentPeriod: 7,
    minQuestsForAssessment: 5,
    confidenceThreshold: 0.75
  });
  const [progressiveDifficulty, setProgressiveDifficulty] = useState({
    enabled: true,
    incrementRate: 0.1,
    decrementRate: 0.15,
    stabilizationPeriod: 3
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-600" />
          Difficulty Settings & Adaptive Scaling
        </h2>
        <p className="text-gray-600 mt-1">Configure adaptive challenge scaling, user skill assessment, and progressive difficulty adjustment</p>
      </div>
      {/* Adaptive Challenge Scaling */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Adaptive Challenge Scaling
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={adaptiveScaling?.enabled}
              onChange={(e) => setAdaptiveScaling({ ...adaptiveScaling, enabled: e?.target?.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {adaptiveScaling?.enabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Level</label>
                <input
                  type="number"
                  value={adaptiveScaling?.minLevel}
                  onChange={(e) => setAdaptiveScaling({ ...adaptiveScaling, minLevel: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Starting difficulty level for new users</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Maximum Level</label>
                <input
                  type="number"
                  value={adaptiveScaling?.maxLevel}
                  onChange={(e) => setAdaptiveScaling({ ...adaptiveScaling, maxLevel: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum difficulty cap</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Scaling Factor</label>
                <input
                  type="number"
                  step="0.01"
                  value={adaptiveScaling?.scalingFactor}
                  onChange={(e) => setAdaptiveScaling({ ...adaptiveScaling, scalingFactor: parseFloat(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Difficulty increase multiplier per level</p>
              </div>
            </div>

            {/* Scaling Visualization */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
              <div className="text-sm font-medium text-gray-700 mb-4">Difficulty Scaling Curve</div>
              <div className="h-40 flex items-end justify-between gap-1">
                {Array.from({ length: 20 }, (_, i) => {
                  const height = Math.min(100, 20 + (i * 4));
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-indigo-600 rounded-t transition-all hover:bg-indigo-700"
                      style={{ height: `${height}%` }}
                      title={`Level ${i + 1}`}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>Level 1</span>
                <span>Level 20</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* User Skill Assessment Algorithms */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            User Skill Assessment Algorithms
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={skillAssessment?.enabled}
              onChange={(e) => setSkillAssessment({ ...skillAssessment, enabled: e?.target?.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {skillAssessment?.enabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Assessment Period (days)</label>
                <input
                  type="number"
                  value={skillAssessment?.assessmentPeriod}
                  onChange={(e) => setSkillAssessment({ ...skillAssessment, assessmentPeriod: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Time window for skill evaluation</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Min Quests for Assessment</label>
                <input
                  type="number"
                  value={skillAssessment?.minQuestsForAssessment}
                  onChange={(e) => setSkillAssessment({ ...skillAssessment, minQuestsForAssessment: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Required quests before assessment</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Confidence Threshold</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={skillAssessment?.confidenceThreshold}
                  onChange={(e) => setSkillAssessment({ ...skillAssessment, confidenceThreshold: parseFloat(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum confidence for adjustments</p>
              </div>
            </div>

            {/* Skill Assessment Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-1">Completion Rate</div>
                <div className="text-2xl font-bold text-blue-900">Weight: 40%</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-green-700 mb-1">Speed Factor</div>
                <div className="text-2xl font-bold text-green-900">Weight: 25%</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm text-purple-700 mb-1">Accuracy</div>
                <div className="text-2xl font-bold text-purple-900">Weight: 20%</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-700 mb-1">Consistency</div>
                <div className="text-2xl font-bold text-yellow-900">Weight: 15%</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Progressive Difficulty Adjustment */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            Progressive Difficulty Adjustment
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={progressiveDifficulty?.enabled}
              onChange={(e) => setProgressiveDifficulty({ ...progressiveDifficulty, enabled: e?.target?.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {progressiveDifficulty?.enabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Increment Rate</label>
                <input
                  type="number"
                  step="0.01"
                  value={progressiveDifficulty?.incrementRate}
                  onChange={(e) => setProgressiveDifficulty({ ...progressiveDifficulty, incrementRate: parseFloat(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Difficulty increase on success</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Decrement Rate</label>
                <input
                  type="number"
                  step="0.01"
                  value={progressiveDifficulty?.decrementRate}
                  onChange={(e) => setProgressiveDifficulty({ ...progressiveDifficulty, decrementRate: parseFloat(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Difficulty decrease on failure</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Stabilization Period (quests)</label>
                <input
                  type="number"
                  value={progressiveDifficulty?.stabilizationPeriod}
                  onChange={(e) => setProgressiveDifficulty({ ...progressiveDifficulty, stabilizationPeriod: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Quests before next adjustment</p>
              </div>
            </div>

            {/* Adjustment Logic */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Adjustment Logic</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Success Streak (3+ completions)</p>
                    <p className="text-xs text-gray-600">Increase difficulty by {(progressiveDifficulty?.incrementRate * 100)?.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Failure Streak (2+ failures)</p>
                    <p className="text-xs text-gray-600">Decrease difficulty by {(progressiveDifficulty?.decrementRate * 100)?.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stabilization Period</p>
                    <p className="text-xs text-gray-600">Wait {progressiveDifficulty?.stabilizationPeriod} quests before next adjustment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Machine Learning Personalization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Machine Learning-Powered Personalization
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div>
              <div className="font-medium text-gray-900">Predictive Difficulty Modeling</div>
              <div className="text-sm text-gray-600">Use ML to predict optimal difficulty for each user</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div>
              <div className="font-medium text-gray-900">Engagement Optimization</div>
              <div className="text-sm text-gray-600">Adjust difficulty to maximize user engagement</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div>
              <div className="font-medium text-gray-900">Churn Prevention</div>
              <div className="text-sm text-gray-600">Detect frustration patterns and adjust difficulty</div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySettings;