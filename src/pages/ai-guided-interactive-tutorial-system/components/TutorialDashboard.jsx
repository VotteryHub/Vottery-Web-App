import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TutorialDashboard = ({ userRole, completedModules, onStartTutorial, tutorialProgress }) => {
  const tutorialModules = {
    voter: [
      { id: 'voter-1', title: 'Getting Started with Voting', description: 'Learn how to discover and participate in elections', icon: 'Vote', duration: '5 min' },
      { id: 'voter-2', title: 'Understanding Voting Methods', description: 'Plurality, Ranked Choice, Approval, and Plus-Minus voting', icon: 'CheckSquare', duration: '8 min' },
      { id: 'voter-3', title: 'Vote Verification', description: 'How to verify your vote on the blockchain', icon: 'ShieldCheck', duration: '6 min' },
      { id: 'voter-4', title: 'Earning Rewards', description: 'XP, badges, streaks, and prize opportunities', icon: 'Trophy', duration: '7 min' },
      { id: 'voter-5', title: 'Social Features', description: 'Comments, reactions, and sharing elections', icon: 'MessageSquare', duration: '5 min' },
      { id: 'voter-6', title: 'Profile & Wallet', description: 'Managing your profile and digital wallet', icon: 'Wallet', duration: '6 min' },
      { id: 'voter-7', title: 'Finding Elections', description: 'Browse categories and personalized recommendations', icon: 'Search', duration: '5 min' },
      { id: 'voter-8', title: 'Advanced Features', description: 'Biometric verification, age verification, and more', icon: 'Settings', duration: '10 min' }
    ],
    creator: [
      { id: 'creator-1', title: 'Creating Your First Election', description: 'Step-by-step election creation guide', icon: 'Plus', duration: '10 min' },
      { id: 'creator-2', title: 'Election Configuration', description: 'Voting methods, dates, and participation settings', icon: 'Settings', duration: '12 min' },
      { id: 'creator-3', title: 'Media & Content', description: 'Adding videos, images, and presentations', icon: 'Image', duration: '8 min' },
      { id: 'creator-4', title: 'Gamification Setup', description: 'Prizes, lottery tickets, and rewards', icon: 'Gift', duration: '10 min' },
      { id: 'creator-5', title: 'Audience Targeting', description: 'Geographic, demographic, and custom targeting', icon: 'Target', duration: '9 min' },
      { id: 'creator-6', title: 'Analytics Dashboard', description: 'Understanding your election performance', icon: 'BarChart', duration: '11 min' },
      { id: 'creator-7', title: 'Monetization Strategies', description: 'Participation fees and sponsorships', icon: 'DollarSign', duration: '13 min' },
      { id: 'creator-8', title: 'Community Building', description: 'Engaging voters and building followers', icon: 'Users', duration: '10 min' },
      { id: 'creator-9', title: 'Advanced Settings', description: 'MCQ questions, age verification, biometrics', icon: 'Lock', duration: '12 min' },
      { id: 'creator-10', title: 'Results & Winners', description: 'Managing results and prize distribution', icon: 'Award', duration: '9 min' },
      { id: 'creator-11', title: 'Compliance & Security', description: 'Blockchain audit and regulatory compliance', icon: 'ShieldCheck', duration: '11 min' },
      { id: 'creator-12', title: 'Scaling Your Elections', description: 'Templates, cloning, and automation', icon: 'TrendingUp', duration: '14 min' }
    ],
    advertiser: [
      { id: 'advertiser-1', title: 'Participatory Advertising Intro', description: 'Understanding the Vottery advertising model', icon: 'Megaphone', duration: '8 min' },
      { id: 'advertiser-2', title: 'Campaign Types', description: 'Market Research, Hype Prediction, and CSR elections', icon: 'Layers', duration: '10 min' },
      { id: 'advertiser-3', title: 'Creating Your First Campaign', description: 'Step-by-step campaign creation', icon: 'Plus', duration: '12 min' },
      { id: 'advertiser-4', title: 'Audience Targeting', description: 'Demographics, zones, and behavioral targeting', icon: 'Target', duration: '11 min' },
      { id: 'advertiser-5', title: 'Budget & Bidding', description: 'CPE pricing, auction strategies, and optimization', icon: 'DollarSign', duration: '13 min' },
      { id: 'advertiser-6', title: 'ROI Dashboard', description: 'Tracking engagement, conversions, and attribution', icon: 'BarChart', duration: '10 min' },
      { id: 'advertiser-7', title: 'Creative Optimization', description: 'A/B testing and content rotation', icon: 'Palette', duration: '9 min' },
      { id: 'advertiser-8', title: 'Brand Safety', description: 'Content moderation and compliance', icon: 'ShieldCheck', duration: '8 min' },
      { id: 'advertiser-9', title: 'Advanced Analytics', description: 'Audience DNA, sentiment analysis, and forecasting', icon: 'TrendingUp', duration: '12 min' },
      { id: 'advertiser-10', title: 'Scaling Campaigns', description: 'Multi-zone campaigns and automation', icon: 'Zap', duration: '11 min' }
    ]
  };

  const modules = tutorialModules?.[userRole] || [];
  const completedCount = completedModules?.length;
  const totalCount = modules?.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total Modules</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalCount - completedCount}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Modules */}
      <div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-4 capitalize">
          {userRole} Learning Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules?.map((module, index) => {
            const isCompleted = completedModules?.includes(module?.id);
            const isLocked = index > 0 && !completedModules?.includes(modules?.[index - 1]?.id);

            return (
              <div
                key={module?.id}
                className={`card p-5 transition-all ${
                  isCompleted
                    ? 'border-2 border-green-500/30 bg-green-500/5'
                    : isLocked
                    ? 'opacity-50 cursor-not-allowed' :'hover:shadow-lg cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-green-500/10' : 'bg-primary/10'
                  }`}>
                    <Icon
                      name={isCompleted ? 'CheckCircle' : isLocked ? 'Lock' : module?.icon}
                      size={24}
                      className={isCompleted ? 'text-green-500' : isLocked ? 'text-gray-400' : 'text-primary'}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {module?.duration}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-2">{module?.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{module?.description}</p>

                {isCompleted ? (
                  <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                    <Icon name="CheckCircle" size={16} />
                    Completed
                  </div>
                ) : isLocked ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Icon name="Lock" size={16} />
                    Complete previous module
                  </div>
                ) : (
                  <Button
                    onClick={() => onStartTutorial(module?.id)}
                    size="sm"
                    className="w-full"
                  >
                    Start Tutorial
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TutorialDashboard;