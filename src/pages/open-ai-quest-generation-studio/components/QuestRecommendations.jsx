import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { openAIQuestService } from '../../../services/openAIQuestService';

const QuestRecommendations = ({ userBehavior, userId, onGenerate }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    if (!userBehavior || !userId) return;

    try {
      setLoading(true);
      const result = await openAIQuestService?.generateQuestRecommendations(userId, userBehavior);
      if (result?.success) {
        setRecommendations(result?.data);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userBehavior) {
      loadRecommendations();
    }
  }, [userBehavior]);

  if (!userBehavior) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Generate quests first to receive AI-powered recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          AI Quest Recommendations
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized quest suggestions powered by GPT-5 based on user behavior analysis
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Generating recommendations...</p>
        </div>
      ) : recommendations ? (
        <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {recommendations}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => onGenerate('daily', 3)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Generate Quests Based on Recommendations
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Click below to generate AI recommendations
          </p>
          <button
            onClick={loadRecommendations}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Recommendations
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onGenerate('daily', 3)}
          className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow text-left"
        >
          <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Daily Quests</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate 3 personalized daily challenges
          </p>
        </button>

        <button
          onClick={() => onGenerate('weekly', 2)}
          className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow text-left"
        >
          <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Weekly Quests</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate 2 challenging weekly goals
          </p>
        </button>

        <button
          onClick={loadRecommendations}
          className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow text-left"
        >
          <Brain className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-bold text-gray-900 dark:text-white mb-2">Refresh AI</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get new AI-powered suggestions
          </p>
        </button>
      </div>
    </div>
  );
};

export default QuestRecommendations;
