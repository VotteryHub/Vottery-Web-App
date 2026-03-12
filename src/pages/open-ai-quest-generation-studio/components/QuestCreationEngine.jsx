import React, { useState } from 'react';
import { Sparkles, Zap, Target, Calendar, RefreshCw, Plus } from 'lucide-react';

const QuestCreationEngine = ({ onGenerate, generatedQuests, onAssign, generating }) => {
  const [questType, setQuestType] = useState('daily');
  const [questCount, setQuestCount] = useState(3);

  const handleGenerate = () => {
    onGenerate(questType, questCount);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'voting': return '🗳️';
      case 'social': return '👥';
      case 'exploration': return '🔍';
      case 'achievement': return '🏆';
      default: return '⭐';
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI Quest Generation Engine
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Generate personalized quests using GPT-5 based on user voting history and behavior patterns
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quest Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quest Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setQuestType('daily')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  questType === 'daily' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <Calendar className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Daily</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">24h duration</div>
              </button>
              <button
                onClick={() => setQuestType('weekly')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  questType === 'weekly' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <Target className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Weekly</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">7d duration</div>
              </button>
            </div>
          </div>

          {/* Quest Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Quests: {questCount}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={questCount}
              onChange={(e) => setQuestCount(parseInt(e?.target?.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating with GPT-5...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Personalized Quests
            </>
          )}
        </button>
      </div>
      {/* Generated Quests */}
      {generatedQuests?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Generated Quests ({generatedQuests?.length})
          </h3>

          {generatedQuests?.map((quest, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(quest?.category)}</span>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {quest?.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {quest?.description}
                  </p>
                </div>
                <button
                  onClick={() => onAssign(quest)}
                  className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Assign
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest?.difficulty)}`}>
                  {quest?.difficulty?.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  {quest?.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {quest?.duration}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  {quest?.vpReward} VP
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements:
                </div>
                <ul className="space-y-1">
                  {quest?.requirements?.map((req, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      {generatedQuests?.length === 0 && !generating && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Click "Generate Personalized Quests" to create AI-powered challenges
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestCreationEngine;
