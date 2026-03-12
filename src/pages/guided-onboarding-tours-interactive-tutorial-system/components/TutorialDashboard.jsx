import React from 'react';
import { Play, CheckCircle, Clock, Award } from 'lucide-react';

const TutorialDashboard = ({ tutorialProgress, onStartTutorial, overallProgress }) => {
  const tutorials = [
    {
      id: 'profileMenu',
      title: 'Profile Menu Tutorial',
      description: 'Learn about account setup, privacy settings, and personalization options',
      icon: '👤',
      color: 'from-blue-500 to-cyan-500',
      estimatedTime: '5 min'
    },
    {
      id: 'votingMechanics',
      title: 'Voting Mechanics Guide',
      description: 'Master election participation, verification processes, and reward systems',
      icon: '🗳️',
      color: 'from-green-500 to-emerald-500',
      estimatedTime: '8 min'
    },
    {
      id: 'creatorTools',
      title: 'Creator Tools Training',
      description: 'Explore election creation workflows, analytics, and monetization strategies',
      icon: '🎨',
      color: 'from-purple-500 to-pink-500',
      estimatedTime: '10 min'
    },
    {
      id: 'aiFeatures',
      title: 'AI Features Introduction',
      description: 'Discover Claude recommendations, Perplexity insights, and automated optimization',
      icon: '🤖',
      color: 'from-orange-500 to-red-500',
      estimatedTime: '12 min'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Available Learning Paths</h2>
        <p className="text-slate-400">
          Choose a tutorial to begin your journey. Complete all modules to unlock advanced features.
        </p>
      </div>

      {/* Tutorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutorials?.map((tutorial) => {
          const progress = tutorialProgress?.[tutorial?.id];
          const progressPercentage = progress ? Math.round((progress?.progress / progress?.steps) * 100) : 0;

          return (
            <div
              key={tutorial?.id}
              className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${tutorial?.color} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{tutorial?.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{tutorial?.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-white/80" />
                        <span className="text-sm text-white/80">{tutorial?.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  {progress?.completed && (
                    <CheckCircle className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-300 mb-4">{tutorial?.description}</p>

                {/* Progress Bar */}
                {progress && progress?.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Progress</span>
                      <span className="text-sm font-semibold text-white">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${tutorial?.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {progress?.progress} of {progress?.steps} steps completed
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => onStartTutorial(tutorial?.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    progress?.completed
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : `bg-gradient-to-r ${tutorial?.color} text-white hover:opacity-90`
                  }`}
                >
                  {progress?.completed ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Review Tutorial
                    </>
                  ) : progress?.progress > 0 ? (
                    <>
                      <Play className="w-5 h-5" />
                      Continue Tutorial
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start Tutorial
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Section */}
      {overallProgress === 100 && (
        <div className="mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12 text-white" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Congratulations!</h3>
              <p className="text-white/90">
                You've completed all tutorials and unlocked expert status. You're now ready to use all platform features!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialDashboard;