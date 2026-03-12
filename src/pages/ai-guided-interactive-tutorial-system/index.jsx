import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TutorialDashboard from './components/TutorialDashboard';
import InteractiveTutorialEngine from './components/InteractiveTutorialEngine';
import RolePersonalizationPanel from './components/RolePersonalizationPanel';
import AchievementMilestones from './components/AchievementMilestones';
import ContextualHelpPanel from './components/ContextualHelpPanel';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamificationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AIGuidedInteractiveTutorialSystem = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('voter');
  const [tutorialProgress, setTutorialProgress] = useState(null);
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [completedModules, setCompletedModules] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutorialData();
    checkFirstVisit();
  }, [user]);

  useEffect(() => {
    analytics?.trackEvent('tutorial_system_viewed', {
      user_role: userRole,
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, userRole]);

  const checkFirstVisit = () => {
    const hasVisited = localStorage?.getItem('tutorial_visited');
    if (!hasVisited) {
      setShowWelcomeModal(true);
      localStorage?.setItem('tutorial_visited', 'true');
    }
  };

  const loadTutorialData = async () => {
    try {
      setLoading(true);
      
      // Detect user role from profile or default to voter
      const detectedRole = userProfile?.role || 'voter';
      setUserRole(detectedRole);

      // Load tutorial progress from localStorage
      const savedProgress = localStorage?.getItem(`tutorial_progress_${user?.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setTutorialProgress(progress);
        setCompletedModules(progress?.completedModules || []);
      } else {
        setTutorialProgress({
          role: detectedRole,
          completedModules: [],
          currentModule: null,
          totalProgress: 0
        });
      }

      // Load achievements from gamification service
      if (user?.id) {
        const badges = await gamificationService?.getUserBadges(user?.id);
        setAchievements(badges || []);
      }
    } catch (error) {
      console.error('Error loading tutorial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    setTutorialProgress({
      role: newRole,
      completedModules: [],
      currentModule: null,
      totalProgress: 0
    });
    setCompletedModules([]);
    localStorage?.setItem(`tutorial_progress_${user?.id}`, JSON.stringify({
      role: newRole,
      completedModules: [],
      currentModule: null,
      totalProgress: 0
    }));

    analytics?.trackEvent('tutorial_role_changed', {
      previous_role: tutorialProgress?.role,
      new_role: newRole,
      user_id: user?.id
    });
  };

  const handleStartTutorial = (tutorialId) => {
    setActiveTutorial(tutorialId);
    setActiveTab('interactive');

    analytics?.trackEvent('tutorial_started', {
      tutorial_id: tutorialId,
      user_role: userRole,
      user_id: user?.id
    });
  };

  const handleCompleteTutorial = (tutorialId) => {
    const updatedCompleted = [...completedModules, tutorialId];
    setCompletedModules(updatedCompleted);

    const totalModules = getTotalModulesForRole(userRole);
    const progress = (updatedCompleted?.length / totalModules) * 100;

    const updatedProgress = {
      ...tutorialProgress,
      completedModules: updatedCompleted,
      totalProgress: progress
    };

    setTutorialProgress(updatedProgress);
    localStorage?.setItem(`tutorial_progress_${user?.id}`, JSON.stringify(updatedProgress));
    setActiveTutorial(null);
    setActiveTab('dashboard');

    analytics?.trackEvent('tutorial_completed', {
      tutorial_id: tutorialId,
      user_role: userRole,
      total_progress: progress,
      user_id: user?.id
    });
  };

  const getTotalModulesForRole = (role) => {
    const moduleCounts = {
      voter: 8,
      creator: 12,
      advertiser: 10
    };
    return moduleCounts?.[role] || 8;
  };

  const tabs = [
    { id: 'dashboard', label: 'Tutorial Dashboard', icon: 'LayoutDashboard' },
    { id: 'interactive', label: 'Interactive Tutorials', icon: 'PlayCircle' },
    { id: 'role', label: 'Role Personalization', icon: 'Users' },
    { id: 'achievements', label: 'Achievements', icon: 'Trophy' },
    { id: 'help', label: 'Contextual Help', icon: 'HelpCircle' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading tutorial system...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI-Guided Interactive Tutorial System | Vottery</title>
        <meta name="description" content="Personalized onboarding experiences with role-based tutorials, contextual help, and achievement milestones" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <HeaderNavigation />
        <LeftSidebar />

        <main className="lg:ml-64 xl:ml-72 pt-14 min-h-screen">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground flex items-center gap-3">
                  <Icon name="GraduationCap" size={32} className="text-primary" />
                  AI-Guided Tutorial System
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold capitalize">
                    {userRole}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Personalized learning paths with interactive tutorials, contextual help, and achievement milestones
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm font-bold text-primary">
                  {Math.round(tutorialProgress?.totalProgress || 0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${tutorialProgress?.totalProgress || 0}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{completedModules?.length} modules completed</span>
                <span>{getTotalModulesForRole(userRole) - completedModules?.length} remaining</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex gap-2 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary font-semibold' :'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'dashboard' && (
                <TutorialDashboard
                  userRole={userRole}
                  completedModules={completedModules}
                  onStartTutorial={handleStartTutorial}
                  tutorialProgress={tutorialProgress}
                />
              )}

              {activeTab === 'interactive' && (
                <InteractiveTutorialEngine
                  userRole={userRole}
                  activeTutorial={activeTutorial}
                  completedModules={completedModules}
                  onComplete={handleCompleteTutorial}
                  onBack={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'role' && (
                <RolePersonalizationPanel
                  currentRole={userRole}
                  onRoleChange={handleRoleChange}
                  tutorialProgress={tutorialProgress}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementMilestones
                  achievements={achievements}
                  completedModules={completedModules}
                  userRole={userRole}
                />
              )}

              {activeTab === 'help' && (
                <ContextualHelpPanel userRole={userRole} />
              )}
            </div>
          </div>
        </main>

        {/* Welcome Modal */}
        {showWelcomeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Sparkles" size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Welcome to Vottery!
                </h2>
                <p className="text-muted-foreground">
                  Let's personalize your learning experience based on your role
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {['voter', 'creator', 'advertiser']?.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      handleRoleChange(role);
                      setShowWelcomeModal(false);
                    }}
                    className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <Icon
                      name={role === 'voter' ? 'Vote' : role === 'creator' ? 'Lightbulb' : 'Megaphone'}
                      size={32}
                      className="text-primary mx-auto mb-2"
                    />
                    <h3 className="font-semibold text-foreground capitalize mb-1">{role}</h3>
                    <p className="text-xs text-muted-foreground">
                      {role === 'voter' && 'Participate in elections and win prizes'}
                      {role === 'creator' && 'Create elections and engage audiences'}
                      {role === 'advertiser' && 'Run campaigns and optimize ROI'}
                    </p>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AIGuidedInteractiveTutorialSystem;