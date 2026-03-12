import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementMilestones = ({ achievements, completedModules, userRole }) => {
  const tutorialAchievements = [
    {
      id: 'first-tutorial',
      name: 'Tutorial Beginner',
      description: 'Complete your first tutorial module',
      icon: 'BookOpen',
      requirement: 1,
      unlocked: completedModules?.length >= 1,
      reward: '+50 XP'
    },
    {
      id: 'halfway-hero',
      name: 'Halfway Hero',
      description: 'Complete 50% of your learning path',
      icon: 'Target',
      requirement: userRole === 'voter' ? 4 : userRole === 'creator' ? 6 : 5,
      unlocked: completedModules?.length >= (userRole === 'voter' ? 4 : userRole === 'creator' ? 6 : 5),
      reward: '+100 XP'
    },
    {
      id: 'tutorial-master',
      name: 'Tutorial Master',
      description: 'Complete all tutorial modules',
      icon: 'GraduationCap',
      requirement: userRole === 'voter' ? 8 : userRole === 'creator' ? 12 : 10,
      unlocked: completedModules?.length >= (userRole === 'voter' ? 8 : userRole === 'creator' ? 12 : 10),
      reward: '+250 XP + Exclusive Badge'
    },
    {
      id: 'quick-learner',
      name: 'Quick Learner',
      description: 'Complete 3 tutorials in one session',
      icon: 'Zap',
      requirement: 3,
      unlocked: false,
      reward: '+75 XP'
    },
    {
      id: 'feature-explorer',
      name: 'Feature Explorer',
      description: 'Unlock all advanced features',
      icon: 'Compass',
      requirement: 1,
      unlocked: completedModules?.length >= (userRole === 'voter' ? 8 : userRole === 'creator' ? 12 : 10),
      reward: 'Premium Features Access'
    },
    {
      id: 'role-switcher',
      name: 'Role Switcher',
      description: 'Complete tutorials for all 3 roles',
      icon: 'Users',
      requirement: 3,
      unlocked: false,
      reward: '+500 XP + Master Badge'
    }
  ];

  const unlockedFeatures = [
    {
      name: 'Advanced Analytics',
      description: 'Access detailed performance metrics',
      icon: 'BarChart',
      unlocked: completedModules?.length >= 3
    },
    {
      name: 'Priority Support',
      description: 'Get faster response from support team',
      icon: 'Headphones',
      unlocked: completedModules?.length >= 5
    },
    {
      name: 'Custom Branding',
      description: 'Add your logo and colors',
      icon: 'Palette',
      unlocked: completedModules?.length >= 8
    },
    {
      name: 'API Access',
      description: 'Integrate with external platforms',
      icon: 'Code',
      unlocked: completedModules?.length >= 10
    }
  ];

  return (
    <div className="space-y-6">
      {/* Achievement Progress */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Trophy" size={24} className="text-primary" />
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Achievement Milestones
            </h2>
            <p className="text-sm text-muted-foreground">
              Unlock badges and rewards as you progress through tutorials
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {tutorialAchievements?.filter(a => a?.unlocked)?.length}
            </div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {tutorialAchievements?.length}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {completedModules?.length * 50}
            </div>
            <div className="text-sm text-muted-foreground">XP Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {unlockedFeatures?.filter(f => f?.unlocked)?.length}
            </div>
            <div className="text-sm text-muted-foreground">Features</div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Tutorial Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorialAchievements?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`card p-5 transition-all ${
                achievement?.unlocked
                  ? 'border-2 border-primary bg-primary/5' :'opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    achievement?.unlocked
                      ? 'bg-primary/20' :'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Icon
                    name={achievement?.unlocked ? achievement?.icon : 'Lock'}
                    size={32}
                    className={achievement?.unlocked ? 'text-primary' : 'text-gray-400'}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{achievement?.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{achievement?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {completedModules?.length}/{achievement?.requirement} completed
                    </span>
                    {achievement?.unlocked && (
                      <span className="text-xs font-semibold text-green-500">
                        {achievement?.reward}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unlockable Features */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Unlockable Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unlockedFeatures?.map((feature) => (
            <div
              key={feature?.name}
              className={`card p-5 transition-all ${
                feature?.unlocked
                  ? 'border-2 border-green-500 bg-green-500/5' :'opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    feature?.unlocked
                      ? 'bg-green-500/20' :'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Icon
                    name={feature?.unlocked ? feature?.icon : 'Lock'}
                    size={20}
                    className={feature?.unlocked ? 'text-green-500' : 'text-gray-400'}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{feature?.name}</h4>
                  <p className="text-sm text-muted-foreground">{feature?.description}</p>
                </div>
                {feature?.unlocked && (
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Card */}
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="Sparkles" size={32} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">Keep Learning!</h3>
            <p className="text-sm text-muted-foreground">
              Complete {(userRole === 'voter' ? 8 : userRole === 'creator' ? 12 : 10) - completedModules?.length} more modules to unlock all features and earn the Tutorial Master badge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementMilestones;