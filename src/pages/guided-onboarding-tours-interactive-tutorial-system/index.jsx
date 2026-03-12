import React, { useState, useEffect } from 'react';
import { BookOpen, SkipForward, Award } from 'lucide-react';
import TutorialDashboard from './components/TutorialDashboard';

import ProfileMenuTutorial from './components/ProfileMenuTutorial';
import VotingMechanicsTutorial from './components/VotingMechanicsTutorial';
import CreatorToolsTutorial from './components/CreatorToolsTutorial';
import AIFeaturesTutorial from './components/AIFeaturesTutorial';

const GuidedOnboardingToursInteractiveTutorialSystem = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [tutorialProgress, setTutorialProgress] = useState({
    profileMenu: { completed: false, progress: 0, steps: 5 },
    votingMechanics: { completed: false, progress: 0, steps: 7 },
    creatorTools: { completed: false, progress: 0, steps: 6 },
    aiFeatures: { completed: false, progress: 0, steps: 8 }
  });

  const calculateOverallProgress = () => {
    const totalSteps = Object.values(tutorialProgress)?.reduce((sum, tutorial) => sum + tutorial?.steps, 0);
    const completedSteps = Object.values(tutorialProgress)?.reduce((sum, tutorial) => sum + tutorial?.progress, 0);
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <TutorialDashboard 
            tutorialProgress={tutorialProgress}
            onStartTutorial={setActiveView}
            overallProgress={calculateOverallProgress()}
          />
        );
      case 'profileMenu':
        return (
          <ProfileMenuTutorial 
            onComplete={() => {
              setTutorialProgress(prev => ({
                ...prev,
                profileMenu: { ...prev?.profileMenu, completed: true, progress: prev?.profileMenu?.steps }
              }));
              setActiveView('dashboard');
            }}
            onExit={() => setActiveView('dashboard')}
          />
        );
      case 'votingMechanics':
        return (
          <VotingMechanicsTutorial 
            onComplete={() => {
              setTutorialProgress(prev => ({
                ...prev,
                votingMechanics: { ...prev?.votingMechanics, completed: true, progress: prev?.votingMechanics?.steps }
              }));
              setActiveView('dashboard');
            }}
            onExit={() => setActiveView('dashboard')}
          />
        );
      case 'creatorTools':
        return (
          <CreatorToolsTutorial 
            onComplete={() => {
              setTutorialProgress(prev => ({
                ...prev,
                creatorTools: { ...prev?.creatorTools, completed: true, progress: prev?.creatorTools?.steps }
              }));
              setActiveView('dashboard');
            }}
            onExit={() => setActiveView('dashboard')}
          />
        );
      case 'aiFeatures':
        return (
          <AIFeaturesTutorial 
            onComplete={() => {
              setTutorialProgress(prev => ({
                ...prev,
                aiFeatures: { ...prev?.aiFeatures, completed: true, progress: prev?.aiFeatures?.steps }
              }));
              setActiveView('dashboard');
            }}
            onExit={() => setActiveView('dashboard')}
          />
        );
      default:
        return (
          <TutorialDashboard 
            tutorialProgress={tutorialProgress}
            onStartTutorial={setActiveView}
            overallProgress={calculateOverallProgress()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-yellow-400" />
              Guided Onboarding Tours & Interactive Tutorial System
            </h1>
            <p className="text-slate-300">
              Comprehensive step-by-step guidance through profile setup, voting mechanics, creator tools, and AI features
            </p>
          </div>
          {activeView !== 'dashboard' && (
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Overall Progress Bar */}
      {activeView === 'dashboard' && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Overall Progress</span>
            </div>
            <span className="text-2xl font-bold text-white">{calculateOverallProgress()}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateOverallProgress()}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-slate-400">
            {Object.values(tutorialProgress)?.filter(t => t?.completed)?.length} of {Object.keys(tutorialProgress)?.length} tutorials completed
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default GuidedOnboardingToursInteractiveTutorialSystem;