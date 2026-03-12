import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, Target, BarChart3 } from 'lucide-react';
import ClaudeContextualAnalysis from './components/ClaudeContextualAnalysis';
import PersonalizedContentWeighting from './components/PersonalizedContentWeighting';
import SocialProofIntegration from './components/SocialProofIntegration';
import RecommendationConfidence from './components/RecommendationConfidence';
import CarouselIntegration from './components/CarouselIntegration';
import CurationTransparency from './components/CurationTransparency';

const ClaudeAIContentCurationIntelligenceCenter = () => {
  const [curationData, setCurationData] = useState({
    contextualAnalysis: {
      relevanceScore: 0,
      userInterestAlignment: 0,
      confidenceLevel: 0,
      reasoningExplanation: ''
    },
    contentWeighting: {
      momentsWeight: 33,
      joltsWeight: 33,
      electionsWeight: 34,
      adaptiveBalance: true
    },
    socialProof: {
      viralProbability: 0,
      communityEngagement: 0,
      trendAmplification: 0
    },
    recommendations: [],
    carouselPlacements: {
      kineticSpindle: [],
      isometricDeck: [],
      liquidHorizon: []
    }
  });

  const [refreshInterval, setRefreshInterval] = useState(5000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurationData(prev => ({
        contextualAnalysis: {
          relevanceScore: Math.min(100, prev?.contextualAnalysis?.relevanceScore + Math.random() * 4 - 2),
          userInterestAlignment: Math.min(100, prev?.contextualAnalysis?.userInterestAlignment + Math.random() * 3 - 1.5),
          confidenceLevel: Math.min(100, prev?.contextualAnalysis?.confidenceLevel + Math.random() * 2 - 1),
          reasoningExplanation: 'Claude analyzed user behavior patterns, engagement history, and content preferences to optimize feed composition'
        },
        contentWeighting: {
          momentsWeight: Math.max(20, Math.min(50, prev?.contentWeighting?.momentsWeight + Math.random() * 4 - 2)),
          joltsWeight: Math.max(20, Math.min(50, prev?.contentWeighting?.joltsWeight + Math.random() * 4 - 2)),
          electionsWeight: Math.max(20, Math.min(50, prev?.contentWeighting?.electionsWeight + Math.random() * 4 - 2)),
          adaptiveBalance: true
        },
        socialProof: {
          viralProbability: Math.min(100, prev?.socialProof?.viralProbability + Math.random() * 5 - 2),
          communityEngagement: Math.min(100, prev?.socialProof?.communityEngagement + Math.random() * 4 - 2),
          trendAmplification: Math.min(100, prev?.socialProof?.trendAmplification + Math.random() * 3 - 1.5)
        },
        recommendations: [
          { id: 1, type: 'moment', confidence: 92, reason: 'High engagement with similar content' },
          { id: 2, type: 'jolt', confidence: 88, reason: 'Trending in user network' },
          { id: 3, type: 'election', confidence: 85, reason: 'Matches user interests' }
        ],
        carouselPlacements: prev?.carouselPlacements
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  useEffect(() => {
    setCurationData({
      contextualAnalysis: {
        relevanceScore: 89.3,
        userInterestAlignment: 92.7,
        confidenceLevel: 87.5,
        reasoningExplanation: 'Claude analyzed user behavior patterns, engagement history, and content preferences to optimize feed composition'
      },
      contentWeighting: {
        momentsWeight: 35,
        joltsWeight: 40,
        electionsWeight: 25,
        adaptiveBalance: true
      },
      socialProof: {
        viralProbability: 78.4,
        communityEngagement: 84.2,
        trendAmplification: 81.9
      },
      recommendations: [
        { id: 1, type: 'moment', confidence: 92, reason: 'High engagement with similar content' },
        { id: 2, type: 'jolt', confidence: 88, reason: 'Trending in user network' },
        { id: 3, type: 'election', confidence: 85, reason: 'Matches user interests' }
      ],
      carouselPlacements: {
        kineticSpindle: ['election-1', 'election-2', 'election-3'],
        isometricDeck: ['connection-1', 'connection-2', 'connection-3'],
        liquidHorizon: ['winner-1', 'winner-2', 'winner-3']
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Claude AI Content Curation Intelligence Center
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Intelligent feed orchestration with contextual reasoning and personalized content weighting
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Claude Active • Real-time
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+3.2%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Content Relevance</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{curationData?.contextualAnalysis?.relevanceScore?.toFixed(1)}%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">accuracy</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${curationData?.contextualAnalysis?.relevanceScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+2.8%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">User Interest Alignment</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{curationData?.contextualAnalysis?.userInterestAlignment?.toFixed(1)}%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">match</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${curationData?.contextualAnalysis?.userInterestAlignment}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+4.1%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Viral Probability</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{curationData?.socialProof?.viralProbability?.toFixed(1)}%</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">score</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${curationData?.socialProof?.viralProbability}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <ClaudeContextualAnalysis data={curationData?.contextualAnalysis} />
        <PersonalizedContentWeighting data={curationData?.contentWeighting} />
        <SocialProofIntegration data={curationData?.socialProof} />
        <RecommendationConfidence recommendations={curationData?.recommendations} />
        <CarouselIntegration placements={curationData?.carouselPlacements} />
        <CurationTransparency curationData={curationData} />
      </div>
    </div>
  );
};

export default ClaudeAIContentCurationIntelligenceCenter;