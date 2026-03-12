import React, { useState, useEffect } from 'react';
import { Sparkles, Target, TrendingUp, Award, Brain, CheckCircle, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { openAIQuestService } from '../../services/openAIQuestService';

import QuestCreationEngine from './components/QuestCreationEngine';
import UserBehaviorAnalysis from './components/UserBehaviorAnalysis';
import QuestTemplates from './components/QuestTemplates';
import ActiveQuestPreview from './components/ActiveQuestPreview';
import QuestRecommendations from './components/QuestRecommendations';
import QuestAnalytics from './components/QuestAnalytics';

const OpenAIQuestGenerationStudio = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('creation');
  const [userBehavior, setUserBehavior] = useState(null);
  const [generatedQuests, setGeneratedQuests] = useState([]);
  const [activeQuests, setActiveQuests] = useState([]);
  const [questStats, setQuestStats] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadQuestData();
    }
  }, [user]);

  const loadQuestData = async () => {
    try {
      setLoading(true);
      const [activeQuestsResult, statsResult] = await Promise.all([
        openAIQuestService?.getActiveQuests(user?.id),
        openAIQuestService?.getQuestStatistics(user?.id)
      ]);

      setActiveQuests(activeQuestsResult?.data || []);
      setQuestStats(statsResult?.data || {});
    } catch (error) {
      console.error('Error loading quest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuests = async (questType, count) => {
    try {
      setGenerating(true);
      const result = await openAIQuestService?.generatePersonalizedQuests(user?.id, questType, count);
      
      if (result?.success) {
        setGeneratedQuests(result?.data);
        setUserBehavior(result?.userProfile);
      }
    } catch (error) {
      console.error('Error generating quests:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleAssignQuest = async (questData) => {
    try {
      const result = await openAIQuestService?.assignQuestToUser(user?.id, questData);
      if (result?.success) {
        await loadQuestData();
        setGeneratedQuests(prev => prev?.filter(q => q?.title !== questData?.title));
      }
    } catch (error) {
      console.error('Error assigning quest:', error);
    }
  };

  const tabs = [
    { id: 'creation', label: 'Quest Creation', icon: Sparkles },
    { id: 'behavior', label: 'User Behavior', icon: TrendingUp },
    { id: 'templates', label: 'Templates', icon: Target },
    { id: 'recommendations', label: 'AI Recommendations', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: Award }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Quest Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Sparkles className="w-10 h-10 text-purple-600" />
                OpenAI Quest Generation Studio
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered personalized quest creation using advanced language models
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-4 rounded-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Active Quests</span>
                <Target className="w-5 h-5 text-purple-200" />
              </div>
              <div className="text-3xl font-bold">{activeQuests?.length || 0}</div>
              <div className="text-purple-100 text-sm">In progress</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {questStats?.completedQuests || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {questStats?.completionRate || 0}% rate
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">VP Earned</span>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {questStats?.totalVPEarned || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">from quests</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">AI Generated</span>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {generatedQuests?.length || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">ready to assign</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-gray-700' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'creation' && (
              <QuestCreationEngine
                onGenerate={handleGenerateQuests}
                generatedQuests={generatedQuests}
                onAssign={handleAssignQuest}
                generating={generating}
              />
            )}
            {activeTab === 'behavior' && (
              <UserBehaviorAnalysis userBehavior={userBehavior} userId={user?.id} />
            )}
            {activeTab === 'templates' && (
              <QuestTemplates onSelectTemplate={handleAssignQuest} />
            )}
            {activeTab === 'recommendations' && (
              <QuestRecommendations
                userBehavior={userBehavior}
                userId={user?.id}
                onGenerate={handleGenerateQuests}
              />
            )}
            {activeTab === 'analytics' && (
              <QuestAnalytics questStats={questStats} userId={user?.id} />
            )}
          </div>
        </div>

        {/* Active Quests Preview */}
        {activeQuests?.length > 0 && (
          <ActiveQuestPreview quests={activeQuests} onRefresh={loadQuestData} />
        )}
      </div>
    </div>
  );
};

export default OpenAIQuestGenerationStudio;
