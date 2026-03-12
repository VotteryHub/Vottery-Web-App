import { supabase } from '../lib/supabase';


const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const onboardingService = {
  // Role-based onboarding steps
  getOnboardingSteps(role) {
    const steps = {
      voter: [
        {
          id: 'welcome',
          title: 'Welcome to Vottery',
          description: 'Learn how to participate in elections and win prizes',
          icon: 'Sparkles',
          completed: false
        },
        {
          id: 'profile_setup',
          title: 'Complete Your Profile',
          description: 'Add your details to personalize your experience',
          icon: 'User',
          completed: false
        },
        {
          id: 'discover_elections',
          title: 'Discover Elections',
          description: 'Browse and find elections that interest you',
          icon: 'Search',
          completed: false
        },
        {
          id: 'cast_first_vote',
          title: 'Cast Your First Vote',
          description: 'Participate in an election and earn rewards',
          icon: 'Vote',
          completed: false
        },
        {
          id: 'explore_features',
          title: 'Explore Platform Features',
          description: 'Learn about social features, wallet, and more',
          icon: 'Compass',
          completed: false
        }
      ],
      creator: [
        {
          id: 'welcome',
          title: 'Welcome Creator',
          description: 'Start creating engaging elections and building your audience',
          icon: 'Sparkles',
          completed: false
        },
        {
          id: 'profile_setup',
          title: 'Build Your Creator Profile',
          description: 'Showcase your brand and connect with voters',
          icon: 'User',
          completed: false
        },
        {
          id: 'create_first_election',
          title: 'Create Your First Election',
          description: 'Launch your first election and engage voters',
          icon: 'PlusCircle',
          completed: false
        },
        {
          id: 'understand_analytics',
          title: 'Understand Analytics',
          description: 'Track performance and optimize your content',
          icon: 'BarChart',
          completed: false
        },
        {
          id: 'monetization_setup',
          title: 'Setup Monetization',
          description: 'Configure wallet and payout preferences',
          icon: 'DollarSign',
          completed: false
        }
      ],
      advertiser: [
        {
          id: 'welcome',
          title: 'Welcome Advertiser',
          description: 'Launch participatory ad campaigns and maximize ROI',
          icon: 'Sparkles',
          completed: false
        },
        {
          id: 'company_verification',
          title: 'Verify Your Company',
          description: 'Complete identity verification and compliance',
          icon: 'Shield',
          completed: false
        },
        {
          id: 'payment_setup',
          title: 'Setup Payment Method',
          description: 'Add payment method for campaign funding',
          icon: 'CreditCard',
          completed: false
        },
        {
          id: 'create_first_campaign',
          title: 'Launch Your First Campaign',
          description: 'Create a participatory ad campaign',
          icon: 'Megaphone',
          completed: false
        },
        {
          id: 'roi_tracking',
          title: 'Track Campaign ROI',
          description: 'Monitor performance and optimize spending',
          icon: 'TrendingUp',
          completed: false
        }
      ]
    };

    return steps?.[role] || steps?.voter;
  },

  // Get user onboarding progress
  async getOnboardingProgress(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_onboarding_progress')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update onboarding progress
  async updateOnboardingProgress(userId, progressData) {
    try {
      const { data, error } = await supabase
        ?.from('user_onboarding_progress')
        ?.upsert({
          user_id: userId,
          ...toSnakeCase(progressData),
          updated_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Complete onboarding step
  async completeStep(userId, stepId, role) {
    try {
      const { data: progress } = await this.getOnboardingProgress(userId);
      const completedSteps = progress?.completedSteps || [];

      if (!completedSteps?.includes(stepId)) {
        completedSteps?.push(stepId);

        const allSteps = this.getOnboardingSteps(role);
        const completionPercentage = Math.round((completedSteps?.length / allSteps?.length) * 100);

        const result = await this.updateOnboardingProgress(userId, {
          completedSteps,
          currentStep: stepId,
          completionPercentage,
          isCompleted: completionPercentage === 100
        });

        // Award XP for completing step
        if (completionPercentage === 100) {
          await this.awardWelcomeRewards(userId, role);
        }

        return result;
      }

      return { data: progress, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Award welcome rewards
  async awardWelcomeRewards(userId, role) {
    try {
      const rewards = {
        voter: { xp: 100, badge: 'first_voter' },
        creator: { xp: 200, badge: 'content_creator' },
        advertiser: { xp: 150, badge: 'brand_partner' }
      };

      const reward = rewards?.[role] || rewards?.voter;

      // Award XP through gamification service
      // Note: This would integrate with existing gamification system
      console.log(`Awarded ${reward?.xp} XP and ${reward?.badge} badge to user ${userId}`);

      return { success: true, reward };
    } catch (error) {
      console.error('Failed to award welcome rewards:', error);
      return { success: false, error: error?.message };
    }
  },

  // Calculate profile completion
  calculateProfileCompletion(userProfile) {
    const requiredFields = ['name', 'username', 'email', 'bio', 'avatar', 'location'];
    const completedFields = requiredFields?.filter(field => {
      const value = userProfile?.[field];
      return value && value !== '' && value !== null;
    });

    return Math.round((completedFields?.length / requiredFields?.length) * 100);
  },

  // Check if user should see onboarding
  async shouldShowOnboarding(userId) {
    try {
      const { data } = await this.getOnboardingProgress(userId);
      return !data || !data?.isCompleted;
    } catch (error) {
      return true; // Show onboarding if error
    }
  },

  // Skip onboarding
  async skipOnboarding(userId) {
    try {
      const result = await this.updateOnboardingProgress(userId, {
        isCompleted: true,
        skipped: true,
        completionPercentage: 0
      });

      return result;
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};