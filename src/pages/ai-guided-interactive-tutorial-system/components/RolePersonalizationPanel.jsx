import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RolePersonalizationPanel = ({ currentRole, onRoleChange, tutorialProgress }) => {
  const roles = [
    {
      id: 'voter',
      name: 'Voter',
      icon: 'Vote',
      color: 'blue',
      description: 'Participate in elections, earn rewards, and win prizes',
      features: [
        'Discover personalized elections',
        'Vote using 4 different methods',
        'Earn XP, badges, and streaks',
        'Win prizes through gamification',
        'Verify votes on blockchain',
        'Social engagement features'
      ],
      learningPath: '8 modules',
      estimatedTime: '52 minutes'
    },
    {
      id: 'creator',
      name: 'Creator',
      icon: 'Lightbulb',
      color: 'purple',
      description: 'Create elections, engage audiences, and monetize your content',
      features: [
        'Create unlimited elections',
        'Advanced gamification setup',
        'Audience targeting tools',
        'Real-time analytics dashboard',
        'Monetization strategies',
        'Community building features'
      ],
      learningPath: '12 modules',
      estimatedTime: '129 minutes'
    },
    {
      id: 'advertiser',
      name: 'Advertiser',
      icon: 'Megaphone',
      color: 'green',
      description: 'Run participatory ad campaigns and optimize ROI',
      features: [
        'Market research elections',
        'Hype prediction campaigns',
        'CSR election initiatives',
        'Advanced audience targeting',
        'Real-time ROI tracking',
        'Campaign optimization tools'
      ],
      learningPath: '10 modules',
      estimatedTime: '104 minutes'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500 border-blue-500',
      purple: 'bg-purple-500/10 text-purple-500 border-purple-500',
      green: 'bg-green-500/10 text-green-500 border-green-500'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="Users" size={24} className="text-primary" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Role-Based Personalization
          </h2>
        </div>
        <p className="text-muted-foreground">
          Choose your role to customize your learning experience and unlock role-specific features
        </p>
      </div>

      {/* Current Role */}
      <div className="card p-6 border-2 border-primary">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="CheckCircle" size={20} className="text-primary" />
          <span className="text-sm font-semibold text-primary">Current Role</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground capitalize mb-1">{currentRole}</h3>
        <p className="text-sm text-muted-foreground">
          {tutorialProgress?.completedModules?.length || 0} modules completed
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles?.map((role) => {
          const isActive = currentRole === role?.id;
          const colorClasses = getColorClasses(role?.color);

          return (
            <div
              key={role?.id}
              className={`card p-6 transition-all ${
                isActive
                  ? 'border-2 border-primary shadow-lg'
                  : 'hover:shadow-lg cursor-pointer'
              }`}
              onClick={() => !isActive && onRoleChange(role?.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses?.split(' ')?.[0]}`}>
                  <Icon name={role?.icon} size={28} className={colorClasses?.split(' ')?.[1]} />
                </div>
                {isActive && (
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    Active
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{role?.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{role?.description}</p>

              <div className="space-y-2 mb-4">
                {role?.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Learning Path:</span>
                  <span className="font-semibold text-foreground">{role?.learningPath}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <span className="font-semibold text-foreground">{role?.estimatedTime}</span>
                </div>
              </div>

              {!isActive && (
                <Button
                  onClick={() => onRoleChange(role?.id)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Switch to {role?.name}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Role Switching Warning */}
      <div className="card p-4 bg-yellow-500/5 border border-yellow-500/20">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">Note on Role Switching</h4>
            <p className="text-sm text-muted-foreground">
              Switching roles will reset your tutorial progress. Your completed modules will be saved,
              but you'll start a new learning path for the selected role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePersonalizationPanel;