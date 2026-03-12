import React, { useEffect, useState } from 'react';
import { Trophy, X, Sparkles, Zap } from 'lucide-react';

const FeedAchievementPopup = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    generateConfetti();
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const generateConfetti = () => {
    const pieces = [];
    for (let i = 0; i < 50; i++) {
      pieces?.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']?.[Math.floor(Math.random() * 5)]
      });
    }
    setConfetti(pieces);
  };

  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti */}
      {confetti?.map((piece) => (
        <div
          key={piece?.id}
          className="absolute top-0 w-2 h-2 rounded-full animate-fall"
          style={{
            left: `${piece?.left}%`,
            backgroundColor: piece?.color,
            animationDelay: `${piece?.delay}s`,
            animationDuration: `${piece?.duration}s`
          }}
        />
      ))}
      {/* Achievement Card */}
      <div
        className={`pointer-events-auto transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-1 rounded-2xl shadow-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 relative">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 animate-bounce">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievement Unlocked!</h2>
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              </div>

              <div className="text-6xl mb-4 animate-bounce-in">{achievement?.icon || '🏆'}</div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{achievement?.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{achievement?.description}</p>

              {achievement?.vpReward && (
                <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">+{achievement?.vpReward} VP</span>
                </div>
              )}

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                >
                  Awesome!
                </button>
                <button
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedAchievementPopup;