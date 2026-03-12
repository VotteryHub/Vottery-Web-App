import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';

const ROLES = [
  {
    id: 'voter',
    label: 'Voter',
    icon: 'Vote',
    color: 'from-blue-500 to-blue-700',
    description: 'Participate in elections, win prizes, and make your voice count.',
    steps: [
      { title: 'Discover Elections', icon: 'Search', description: 'Browse thousands of active elections across categories — politics, sports, tech, and more. Use filters to find what matters to you.' },
      { title: 'Voting Mechanics', icon: 'CheckSquare', description: 'Cast your vote securely. Each vote is recorded on the blockchain for full transparency and verifiability. Your vote is anonymous yet auditable.' },
      { title: 'Verification Process', icon: 'ShieldCheck', description: 'After voting, receive a unique Vote ID and blockchain hash. Use the Vote Verification Portal to confirm your vote was counted correctly.' },
      { title: 'Gamification & Prizes', icon: 'Trophy', description: 'Every vote earns Vottery Points (VP). Participate in lottery draws, unlock achievements, and win real cash prizes. The more you vote, the more you earn!' },
    ]
  },
  {
    id: 'creator',
    label: 'Creator',
    icon: 'PlusCircle',
    color: 'from-purple-500 to-purple-700',
    description: 'Create elections, build your audience, and monetize your content.',
    steps: [
      { title: 'Election Creation', icon: 'Edit3', description: 'Use the Election Creation Studio to build engaging polls. Choose voting types (plurality, ranked choice, approval), set prize pools, and configure participation fees.' },
      { title: 'Audience Building', icon: 'Users', description: 'Grow your follower base by creating compelling elections. Share to social media, embed on your website, and leverage Vottery\'s discovery algorithms.' },
      { title: 'Monetization Options', icon: 'DollarSign', description: 'Earn from participation fees, sponsored elections, and creator subscriptions. Connect Stripe to receive payouts directly to your bank account.' },
      { title: 'Analytics & Insights', icon: 'BarChart2', description: 'Track election performance with real-time analytics. Monitor voter engagement, revenue, and audience growth. Use AI-powered insights to optimize future elections.' },
    ]
  },
  {
    id: 'advertiser',
    label: 'Advertiser',
    icon: 'Megaphone',
    color: 'from-green-500 to-green-700',
    description: 'Run targeted campaigns, reach engaged audiences, and track ROI.',
    steps: [
      { title: 'Campaign Creation', icon: 'Layout', description: 'Build participatory ad campaigns using our studio. Create sponsored elections that engage users while promoting your brand. Choose from multiple ad formats.' },
      { title: 'Targeting Options', icon: 'Target', description: 'Reach the right audience with demographic, geographic, and interest-based targeting. Use AI-powered audience matching for maximum campaign effectiveness.' },
      { title: 'Budget Management', icon: 'CreditCard', description: 'Set daily and total budgets with flexible bidding strategies. Cost-Per-Engagement (CPE) model ensures you only pay for real interactions.' },
      { title: 'ROI Tracking', icon: 'TrendingUp', description: 'Monitor campaign performance with real-time dashboards. Track impressions, clicks, conversions, and revenue attribution. Export detailed reports for stakeholders.' },
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'Shield',
    color: 'from-red-500 to-red-700',
    description: 'Manage the platform, oversee users, and ensure system integrity.',
    steps: [
      { title: 'Platform Management', icon: 'Settings', description: 'Access the Admin Control Center to manage platform-wide settings, feature flags, and system configuration. Monitor health metrics and performance.' },
      { title: 'User Oversight', icon: 'UserCheck', description: 'Review user accounts, manage roles and permissions, handle verification requests, and enforce community guidelines across the platform.' },
      { title: 'Content Moderation', icon: 'Eye', description: 'Use AI-assisted moderation tools to review flagged content, manage election approvals, and ensure compliance with platform policies and regulations.' },
      { title: 'System Monitoring', icon: 'Activity', description: 'Monitor real-time system health, security alerts, fraud detection, and performance metrics. Configure automated alerts and incident response workflows.' },
    ]
  }
];

const InteractiveOnboardingWizard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { completeOnboarding } = useOnboarding();
  const userRole = userProfile?.role || 'voter';
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [phase, setPhase] = useState('role-select'); // 'role-select' | 'steps' | 'complete'

  // Pre-select role based on user's profile for role-specific onboarding
  useEffect(() => {
    if (userRole && !selectedRole && phase === 'role-select') {
      const mapped = ['super_admin', 'manager', 'moderator'].includes(userRole) ? 'admin' : userRole;
      if (ROLES?.some((r) => r?.id === mapped)) {
        setSelectedRole(mapped);
        setPhase('steps');
      }
    }
  }, [userRole, selectedRole, phase]);

  const role = ROLES?.find((r) => r?.id === selectedRole);
  const steps = role?.steps || [];
  const totalSteps = steps?.length;

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setCurrentStep(0);
    setCompletedSteps([]);
    setPhase('steps');
  };

  const handleNext = () => {
    if (!completedSteps?.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setPhase('complete');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      setPhase('role-select');
      setSelectedRole(null);
    }
  };

  const handleSkip = () => {
    setPhase('complete');
  };

  const handleFinish = () => {
    completeOnboarding(selectedRole);
    if (selectedRole === 'voter') navigate('/home-feed-dashboard');
    else if (selectedRole === 'creator') navigate('/election-creation-studio');
    else if (selectedRole === 'advertiser') navigate('/participatory-ads-studio');
    else if (selectedRole === 'admin') navigate('/admin-control-center');
    else navigate('/home-feed-dashboard');
  };

  const handleRestartRole = () => {
    setPhase('role-select');
    setSelectedRole(null);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Icon name="Sparkles" size={16} />
              <span>Interactive Onboarding Wizard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Welcome to Vottery
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get started with a personalized onboarding experience tailored to your role.
            </p>
          </div>

          {/* Role Selection Phase */}
          {phase === 'role-select' && (
            <div>
              <h2 className="text-xl font-semibold text-foreground text-center mb-6">Choose your role to get started</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLES?.map(r => (
                  <button
                    key={r?.id}
                    onClick={() => handleRoleSelect(r?.id)}
                    className="group bg-card border border-border rounded-xl p-6 text-left hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${r?.color} mb-4`}>
                      <Icon name={r?.icon} size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{r?.label}</h3>
                    <p className="text-sm text-muted-foreground">{r?.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Start {r?.label} Onboarding</span>
                      <Icon name="ArrowRight" size={14} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-center mt-8">
                <button onClick={() => navigate('/home-feed-dashboard')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Skip onboarding and explore on my own
                </button>
              </div>
            </div>
          )}

          {/* Steps Phase */}
          {phase === 'steps' && role && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Progress Bar */}
              <div className="bg-muted/30 px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${role?.color}`}>
                      <Icon name={role?.icon} size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-foreground">{role?.label} Onboarding</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
                {/* Step indicators */}
                <div className="flex gap-2 mt-3">
                  {steps?.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-200 ${
                        i === currentStep ? 'bg-primary' :
                        completedSteps?.includes(i) ? 'bg-primary/50' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${role?.color} flex items-center justify-center`}>
                    <Icon name={steps?.[currentStep]?.icon} size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {completedSteps?.includes(currentStep) && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-500 font-medium">
                          <Icon name="CheckCircle" size={12} /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
                      {steps?.[currentStep]?.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {steps?.[currentStep]?.description}
                    </p>
                  </div>
                </div>

                {/* Achievement unlock indicator */}
                <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                  <Icon name="Star" size={20} className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Achievement Progress</p>
                    <p className="text-xs text-muted-foreground">Complete all steps to unlock the <strong>Onboarding Champion</strong> badge and earn 50 VP!</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="px-8 pb-8 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-all"
                >
                  <Icon name="ArrowLeft" size={16} />
                  {currentStep === 0 ? 'Change Role' : 'Back'}
                </button>
                <div className="flex items-center gap-3">
                  <button onClick={handleSkip} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Skip all
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    {currentStep < totalSteps - 1 ? 'Next Step' : 'Complete'}
                    <Icon name={currentStep < totalSteps - 1 ? 'ArrowRight' : 'CheckCircle'} size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Completion Phase */}
          {phase === 'complete' && (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Onboarding Complete!</h2>
              <p className="text-muted-foreground mb-2">
                You're all set as a <strong className="text-foreground capitalize">{selectedRole}</strong> on Vottery.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                You've earned <span className="text-yellow-500 font-semibold">50 VP</span> for completing onboarding!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleFinish}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Icon name="Rocket" size={18} />
                  Get Started
                </button>
                <button
                  onClick={handleRestartRole}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  <Icon name="RefreshCw" size={16} />
                  Try Another Role
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveOnboardingWizard;