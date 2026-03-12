import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import SwipeableTopicCard from './components/SwipeableTopicCard';
import PreferenceProgress from './components/PreferenceProgress';
import PreferenceReview from './components/PreferenceReview';
import OnboardingGuidance from './components/OnboardingGuidance';
import Icon from '../../components/AppIcon';
import { topicPreferenceService } from '../../services/topicPreferenceService';
import { useAuth } from '../../contexts/AuthContext';

const InteractiveTopicPreferenceCollectionHub = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [preferences, setPreferences] = useState([]);
  const [completionStatus, setCompletionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTopics();
    loadPreferences();
    loadCompletionStatus();
  }, [user]);

  const loadTopics = async () => {
    try {
      const { data, error: topicsError } = await topicPreferenceService?.getAllTopicCategories();
      if (topicsError) throw new Error(topicsError?.message);
      setTopics(data || []);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    if (!user) return;
    try {
      const { data } = await topicPreferenceService?.getUserTopicPreferences(user?.id);
      setPreferences(data || []);
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  const loadCompletionStatus = async () => {
    if (!user) return;
    try {
      const { data } = await topicPreferenceService?.getPreferenceCompletionStatus(user?.id);
      setCompletionStatus(data);
    } catch (err) {
      console.error('Failed to load completion status:', err);
    }
  };

  const handleSwipe = async (direction, swipeMetrics) => {
    const currentTopic = topics?.[currentTopicIndex];
    if (!currentTopic) return;

    try {
      await topicPreferenceService?.recordSwipe({
        topicCategoryId: currentTopic?.id,
        swipeDirection: direction,
        swipeVelocity: swipeMetrics?.velocity || 0,
        dwellTimeMs: swipeMetrics?.dwellTime || 0,
        hesitationCount: swipeMetrics?.hesitationCount || 0,
        hoverDurationMs: swipeMetrics?.hoverDuration || 0,
        cardInteractionDepth: swipeMetrics?.interactionDepth || 0,
        deviceType: /Mobile|Android|iPhone/i?.test(navigator?.userAgent) ? 'mobile' : 'desktop',
        sessionId: sessionStorage?.getItem('sessionId') || 'unknown',
        metadata: swipeMetrics?.metadata || {}
      });

      // Move to next topic
      if (currentTopicIndex < topics?.length - 1) {
        setCurrentTopicIndex(currentTopicIndex + 1);
      } else {
        // All topics swiped, show review
        setShowReview(true);
      }

      // Reload preferences and completion status
      await loadPreferences();
      await loadCompletionStatus();
    } catch (err) {
      setError(err?.message || 'Failed to record swipe');
    }
  };

  const handleSkip = () => {
    if (currentTopicIndex < topics?.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleRestart = () => {
    setCurrentTopicIndex(0);
    setShowReview(false);
  };

  const handleCloseGuidance = () => {
    setShowGuidance(false);
    sessionStorage?.setItem('topicPreferenceGuidanceSeen', 'true');
  };

  useEffect(() => {
    const guidanceSeen = sessionStorage?.getItem('topicPreferenceGuidanceSeen');
    if (guidanceSeen) {
      setShowGuidance(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              Discover Your Interests
            </h1>
            <p className="text-muted-foreground">
              Swipe right on topics you love, left on ones you don't. This helps us personalize your feed.
            </p>
          </div>

          {/* Onboarding Guidance */}
          {showGuidance && (
            <OnboardingGuidance onClose={handleCloseGuidance} />
          )}

          {/* Progress Indicator */}
          <PreferenceProgress
            currentIndex={currentTopicIndex}
            totalTopics={topics?.length}
            completionStatus={completionStatus}
          />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={20} className="text-red-600 dark:text-red-400" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!showReview ? (
            <div className="relative">
              {/* Swipeable Card Stack */}
              <div className="relative h-[500px] md:h-[600px]">
                {topics?.slice(currentTopicIndex, currentTopicIndex + 3)?.map((topic, index) => (
                  <SwipeableTopicCard
                    key={topic?.id}
                    topic={topic}
                    onSwipe={index === 0 ? handleSwipe : null}
                    zIndex={3 - index}
                    isActive={index === 0}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => handleSwipe('left', { velocity: 0.5, dwellTime: 1000 })}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  aria-label="Dislike topic"
                >
                  <Icon name="X" size={28} />
                </button>

                <button
                  onClick={handleSkip}
                  className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Skip topic"
                >
                  <Icon name="SkipForward" size={20} />
                </button>

                <button
                  onClick={() => handleSwipe('right', { velocity: 0.5, dwellTime: 1000 })}
                  className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  aria-label="Like topic"
                >
                  <Icon name="Heart" size={28} />
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2 mr-4">
                    <Icon name="ArrowLeft" size={16} />
                    Swipe left to dislike
                  </span>
                  <span className="inline-flex items-center gap-2">
                    Swipe right to like
                    <Icon name="ArrowRight" size={16} />
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <PreferenceReview
              preferences={preferences}
              completionStatus={completionStatus}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default InteractiveTopicPreferenceCollectionHub;