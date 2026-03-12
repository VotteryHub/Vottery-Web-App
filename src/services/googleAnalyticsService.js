import { supabase } from '../lib/supabase';
import { trackEvent } from '../hooks/useGoogleAnalytics';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const googleAnalyticsService = {
  // User Flow Tracking
  trackUserFlow: (flowName, step, metadata = {}) => {
    trackEvent('user_flow', {
      flow_name: flowName,
      flow_step: step,
      ...metadata
    });
  },

  // Election Engagement Tracking
  trackElectionEngagement: (electionId, engagementType, metadata = {}) => {
    trackEvent('election_engagement', {
      election_id: electionId,
      engagement_type: engagementType,
      ...metadata
    });
  },

  // Advertiser ROI Attribution
  trackAdvertiserROI: (campaignId, conversionValue, metadata = {}) => {
    trackEvent('advertiser_roi', {
      campaign_id: campaignId,
      conversion_value: conversionValue,
      currency: 'INR',
      ...metadata
    });
  },

  // Conversion Funnel Tracking
  trackConversionFunnel: (funnelName, stage, metadata = {}) => {
    trackEvent('conversion_funnel', {
      funnel_name: funnelName,
      funnel_stage: stage,
      ...metadata
    });
  },

  // Zone-Specific Performance
  trackZonePerformance: (zone, metricType, value, metadata = {}) => {
    trackEvent('zone_performance', {
      zone: zone,
      metric_type: metricType,
      metric_value: value,
      ...metadata
    });
  },

  // Voting Behavior Tracking
  trackVotingBehavior: (electionId, votingMethod, timeSpent, metadata = {}) => {
    trackEvent('voting_behavior', {
      election_id: electionId,
      voting_method: votingMethod,
      time_spent_seconds: timeSpent,
      ...metadata
    });
  },

  // Gamification Tracking
  trackGamificationEvent: (eventType, achievementId, metadata = {}) => {
    trackEvent('gamification', {
      event_type: eventType,
      achievement_id: achievementId,
      ...metadata
    });
  },

  // Social Interaction Tracking
  trackSocialInteraction: (interactionType, targetId, metadata = {}) => {
    trackEvent('social_interaction', {
      interaction_type: interactionType,
      target_id: targetId,
      ...metadata
    });
  },

  // Payment/Transaction Tracking
  trackTransaction: (transactionType, amount, zone, metadata = {}) => {
    trackEvent('transaction', {
      transaction_type: transactionType,
      value: amount,
      currency: 'INR',
      zone: zone,
      ...metadata
    });
  },

  // Error Tracking for Component Failures
  trackComponentError: (errorMessage, componentStack, errorBoundary, metadata = {}) => {
    trackEvent('component_error', {
      error_message: errorMessage,
      component_stack: componentStack,
      error_boundary: errorBoundary,
      ...metadata
    });
  },

  // User Impact Metrics
  trackUserImpact: (impactType, severity, affectedFeature, metadata = {}) => {
    trackEvent('user_impact', {
      impact_type: impactType,
      severity: severity,
      affected_feature: affectedFeature,
      ...metadata
    });
  },

  // Performance Regression Tracking
  trackPerformanceRegression: (metricName, currentValue, baselineValue, metadata = {}) => {
    trackEvent('performance_regression', {
      metric_name: metricName,
      current_value: currentValue,
      baseline_value: baselineValue,
      regression_percentage: ((currentValue - baselineValue) / baselineValue * 100)?.toFixed(2),
      ...metadata
    });
  },

  // Error Recovery Tracking
  trackErrorRecovery: (errorType, recoveryMethod, recoveryTime, metadata = {}) => {
    trackEvent('error_recovery', {
      error_type: errorType,
      recovery_method: recoveryMethod,
      recovery_time_ms: recoveryTime,
      ...metadata
    });
  },

  // Content Discovery Tracking
  trackContentDiscovery: (contentType, contentId, discoveryMethod, metadata = {}) => {
    trackEvent('content_discovery', {
      content_type: contentType,
      content_id: contentId,
      discovery_method: discoveryMethod,
      ...metadata
    });
  },

  // Jolts Video Tracking - Comprehensive Analytics
  trackJoltsVideoView: (videoId, videoTitle, metadata = {}) => {
    trackEvent('jolts_video_view', {
      video_id: videoId,
      video_title: videoTitle,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoStart: (videoId, videoTitle, metadata = {}) => {
    trackEvent('jolts_video_start', {
      video_id: videoId,
      video_title: videoTitle,
      video_type: 'jolts',
      timestamp: new Date()?.toISOString(),
      ...metadata
    });
  },

  trackJoltsVideoProgress: (videoId, videoTitle, watchedSeconds, totalDuration, percentComplete, metadata = {}) => {
    trackEvent('jolts_video_progress', {
      video_id: videoId,
      video_title: videoTitle,
      watched_seconds: watchedSeconds,
      total_duration: totalDuration,
      percent_complete: percentComplete,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoComplete: (videoId, videoTitle, totalWatchTime, completionRate, metadata = {}) => {
    trackEvent('jolts_video_complete', {
      video_id: videoId,
      video_title: videoTitle,
      total_watch_time: totalWatchTime,
      completion_rate: completionRate,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoEngagement: (videoId, videoTitle, engagementType, metadata = {}) => {
    trackEvent('jolts_video_engagement', {
      video_id: videoId,
      video_title: videoTitle,
      engagement_type: engagementType, // like, share, comment, save
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoShare: (videoId, videoTitle, shareMethod, metadata = {}) => {
    trackEvent('jolts_video_share', {
      video_id: videoId,
      video_title: videoTitle,
      share_method: shareMethod, // facebook, twitter, whatsapp, copy_link
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoQualityChange: (videoId, videoTitle, fromQuality, toQuality, metadata = {}) => {
    trackEvent('jolts_video_quality_change', {
      video_id: videoId,
      video_title: videoTitle,
      from_quality: fromQuality,
      to_quality: toQuality,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoError: (videoId, videoTitle, errorType, errorMessage, metadata = {}) => {
    trackEvent('jolts_video_error', {
      video_id: videoId,
      video_title: videoTitle,
      error_type: errorType,
      error_message: errorMessage,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoSeek: (videoId, videoTitle, fromTime, toTime, metadata = {}) => {
    trackEvent('jolts_video_seek', {
      video_id: videoId,
      video_title: videoTitle,
      from_time: fromTime,
      to_time: toTime,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoPause: (videoId, videoTitle, pausedAt, watchedDuration, metadata = {}) => {
    trackEvent('jolts_video_pause', {
      video_id: videoId,
      video_title: videoTitle,
      paused_at: pausedAt,
      watched_duration: watchedDuration,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoResume: (videoId, videoTitle, resumedAt, metadata = {}) => {
    trackEvent('jolts_video_resume', {
      video_id: videoId,
      video_title: videoTitle,
      resumed_at: resumedAt,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoFullscreen: (videoId, videoTitle, isFullscreen, metadata = {}) => {
    trackEvent('jolts_video_fullscreen', {
      video_id: videoId,
      video_title: videoTitle,
      is_fullscreen: isFullscreen,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoMute: (videoId, videoTitle, isMuted, metadata = {}) => {
    trackEvent('jolts_video_mute', {
      video_id: videoId,
      video_title: videoTitle,
      is_muted: isMuted,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoVolumeChange: (videoId, videoTitle, fromVolume, toVolume, metadata = {}) => {
    trackEvent('jolts_video_volume_change', {
      video_id: videoId,
      video_title: videoTitle,
      from_volume: fromVolume,
      to_volume: toVolume,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoPlaybackSpeed: (videoId, videoTitle, playbackSpeed, metadata = {}) => {
    trackEvent('jolts_video_playback_speed', {
      video_id: videoId,
      video_title: videoTitle,
      playback_speed: playbackSpeed,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoReplay: (videoId, videoTitle, replayCount, metadata = {}) => {
    trackEvent('jolts_video_replay', {
      video_id: videoId,
      video_title: videoTitle,
      replay_count: replayCount,
      video_type: 'jolts',
      ...metadata
    });
  },

  trackJoltsVideoDropoff: (videoId, videoTitle, dropoffTime, percentWatched, metadata = {}) => {
    trackEvent('jolts_video_dropoff', {
      video_id: videoId,
      video_title: videoTitle,
      dropoff_time: dropoffTime,
      percent_watched: percentWatched,
      video_type: 'jolts',
      ...metadata
    });
  },

  // Jolts Viewer Demographics Tracking
  trackJoltsViewerDemographics: (videoId, videoTitle, demographics, metadata = {}) => {
    trackEvent('jolts_viewer_demographics', {
      video_id: videoId,
      video_title: videoTitle,
      age_group: demographics?.ageGroup,
      gender: demographics?.gender,
      location: demographics?.location,
      device_type: demographics?.deviceType,
      video_type: 'jolts',
      ...metadata
    });
  },

  // Jolts Engagement Patterns
  trackJoltsEngagementPattern: (videoId, videoTitle, patternType, patternData, metadata = {}) => {
    trackEvent('jolts_engagement_pattern', {
      video_id: videoId,
      video_title: videoTitle,
      pattern_type: patternType, // binge_watch, quick_scroll, repeat_viewer
      pattern_data: JSON.stringify(patternData),
      video_type: 'jolts',
      ...metadata
    });
  },

  // Jolts Session Analytics
  trackJoltsSessionMetrics: (sessionData, metadata = {}) => {
    trackEvent('jolts_session_metrics', {
      videos_watched: sessionData?.videosWatched,
      total_watch_time: sessionData?.totalWatchTime,
      avg_completion_rate: sessionData?.avgCompletionRate,
      session_duration: sessionData?.sessionDuration,
      engagement_score: sessionData?.engagementScore,
      video_type: 'jolts',
      ...metadata
    });
  },

  // Get Analytics Data from Supabase
  async getUserAnalytics(userId, timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(now?.getDate() - 90);
          break;
        case 'all':
          startDate = new Date(0);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      // Fetch voting history
      const { data: votes, error: votesError } = await supabase
        ?.from('votes')
        ?.select('*, elections(*)')
        ?.eq('user_id', userId)
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (votesError) throw votesError;

      // Fetch earnings across zones
      const { data: transactions, error: transactionsError } = await supabase
        ?.from('wallet_transactions')
        ?.select('*, elections(zone)')
        ?.eq('user_id', userId)
        ?.eq('transaction_type', 'winning')
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Calculate zone-based earnings
      const earningsByZone = {};
      transactions?.forEach(t => {
        const zone = t?.elections?.zone || 'unknown';
        if (!earningsByZone?.[zone]) {
          earningsByZone[zone] = { totalEarnings: 0, count: 0 };
        }
        earningsByZone[zone].totalEarnings += parseFloat(t?.amount || 0);
        earningsByZone[zone].count += 1;
      });

      // Calculate ROI per election
      const electionROI = [];
      const electionMap = {};
      
      votes?.forEach(vote => {
        const electionId = vote?.election_id;
        if (!electionMap?.[electionId]) {
          electionMap[electionId] = {
            electionId,
            electionTitle: vote?.elections?.title,
            zone: vote?.elections?.zone,
            entryFee: parseFloat(vote?.elections?.entry_fee || 0),
            winnings: 0,
            participated: true
          };
        }
      });

      transactions?.forEach(t => {
        const electionId = t?.election_id;
        if (electionMap?.[electionId]) {
          electionMap[electionId].winnings += parseFloat(t?.amount || 0);
        }
      });

      Object.values(electionMap)?.forEach(election => {
        const roi = election?.entryFee > 0 
          ? ((election?.winnings - election?.entryFee) / election?.entryFee) * 100
          : 0;
        electionROI?.push({
          ...election,
          roi: roi?.toFixed(2)
        });
      });

      // Calculate engagement insights
      const totalVotes = votes?.length || 0;
      const uniqueElections = new Set(votes?.map(v => v?.election_id))?.size;
      const totalEarnings = transactions?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0);
      const averageROI = electionROI?.length > 0
        ? electionROI?.reduce((sum, e) => sum + parseFloat(e?.roi), 0) / electionROI?.length
        : 0;

      // Calculate retention metrics (voting frequency)
      const votingDates = votes?.map(v => new Date(v?.created_at)?.toDateString());
      const uniqueDays = new Set(votingDates)?.size;
      const daysSinceStart = Math.ceil((now - new Date(votes?.[votes?.length - 1]?.created_at)) / (1000 * 60 * 60 * 24)) || 1;
      const retentionRate = (uniqueDays / daysSinceStart) * 100;

      return {
        data: {
          votingHistory: toCamelCase(votes),
          earningsByZone,
          electionROI,
          engagementInsights: {
            totalVotes,
            uniqueElections,
            totalEarnings,
            averageROI: averageROI?.toFixed(2),
            retentionRate: retentionRate?.toFixed(2),
            activeDays: uniqueDays,
            averageVotesPerDay: (totalVotes / uniqueDays)?.toFixed(2)
          }
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get retention forecasting data
  async getRetentionForecast(userId) {
    try {
      const { data: votes, error } = await supabase
        ?.from('votes')
        ?.select('created_at')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: true });

      if (error) throw error;

      if (!votes || votes?.length < 2) {
        return {
          data: {
            forecastedRetention: 0,
            churnRisk: 'low',
            recommendation: 'Insufficient data for forecasting'
          },
          error: null
        };
      }

      // Calculate voting intervals
      const intervals = [];
      for (let i = 1; i < votes?.length; i++) {
        const diff = new Date(votes?.[i]?.created_at) - new Date(votes?.[i - 1]?.created_at);
        intervals?.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
      }

      const avgInterval = intervals?.reduce((sum, val) => sum + val, 0) / intervals?.length;
      const lastVoteDate = new Date(votes?.[votes?.length - 1]?.created_at);
      const daysSinceLastVote = (new Date() - lastVoteDate) / (1000 * 60 * 60 * 24);

      // Simple retention forecasting
      let churnRisk = 'low';
      let forecastedRetention = 95;

      if (daysSinceLastVote > avgInterval * 2) {
        churnRisk = 'high';
        forecastedRetention = 45;
      } else if (daysSinceLastVote > avgInterval * 1.5) {
        churnRisk = 'medium';
        forecastedRetention = 70;
      }

      const recommendation = churnRisk === 'high' ?'User at risk of churning. Consider re-engagement campaign.'
        : churnRisk === 'medium' ?'User showing decreased activity. Send personalized notifications.' :'User is highly engaged. Continue current strategy.';

      return {
        data: {
          forecastedRetention,
          churnRisk,
          recommendation,
          avgDaysBetweenVotes: avgInterval?.toFixed(1),
          daysSinceLastVote: daysSinceLastVote?.toFixed(1)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get achievement progress
  async getAchievementProgress(userId) {
    try {
      const { data: profile, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', userId)
        ?.single();

      if (error) throw error;

      const { data: votes } = await supabase
        ?.from('votes')
        ?.select('vote_id')
        ?.eq('user_id', userId);

      const { data: transactions } = await supabase
        ?.from('wallet_transactions')
        ?.select('amount')
        ?.eq('user_id', userId)
        ?.eq('transaction_type', 'winning');

      const totalVotes = votes?.length || 0;
      const totalEarnings = transactions?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0) || 0;

      const achievements = [
        { id: 1, name: 'First Vote', target: 1, progress: Math.min(totalVotes, 1), icon: 'Vote', unlocked: totalVotes >= 1 },
        { id: 2, name: '10 Elections', target: 10, progress: Math.min(totalVotes, 10), icon: 'Trophy', unlocked: totalVotes >= 10 },
        { id: 3, name: '50 Elections', target: 50, progress: Math.min(totalVotes, 50), icon: 'Award', unlocked: totalVotes >= 50 },
        { id: 4, name: '100 Votes', target: 100, progress: Math.min(totalVotes, 100), icon: 'Target', unlocked: totalVotes >= 100 },
        { id: 5, name: '₹1,000 Earned', target: 1000, progress: Math.min(totalEarnings, 1000), icon: 'DollarSign', unlocked: totalEarnings >= 1000 },
        { id: 6, name: '₹10,000 Earned', target: 10000, progress: Math.min(totalEarnings, 10000), icon: 'TrendingUp', unlocked: totalEarnings >= 10000 },
        { id: 7, name: 'Social Butterfly', target: 50, progress: 0, icon: 'Users', unlocked: false },
        { id: 8, name: 'Streak Master', target: 30, progress: 0, icon: 'Flame', unlocked: false }
      ];

      const unlockedCount = achievements?.filter(a => a?.unlocked)?.length;
      const completionPercentage = (unlockedCount / achievements?.length) * 100;

      return {
        data: {
          achievements,
          totalBadges: achievements?.length,
          unlockedBadges: unlockedCount,
          completionPercentage: completionPercentage?.toFixed(0)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Track security-related events
   */
  trackSecurityEvent(eventName, params = {}) {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, {
        event_category: 'Security',
        timestamp: new Date()?.toISOString(),
        ...params
      });
    }
  },

  /**
   * Track suspicious authentication patterns
   */
  trackSuspiciousAuth(authType, details = {}) {
    this.trackSecurityEvent('suspicious_authentication', {
      auth_type: authType,
      ...details
    });
  },

  /**
   * Track failed payment attempts
   */
  trackFailedPayment(paymentMethod, amount, reason) {
    this.trackSecurityEvent('failed_payment_attempt', {
      payment_method: paymentMethod,
      amount,
      failure_reason: reason
    });
  },

  /**
   * Track vote manipulation indicators
   */
  trackVoteManipulation(electionId, indicatorType, details = {}) {
    this.trackSecurityEvent('vote_manipulation_indicator', {
      election_id: electionId,
      indicator_type: indicatorType,
      ...details
    });
  },

  /**
   * Track policy violation spikes
   */
  trackPolicyViolation(violationType, count, threshold) {
    this.trackSecurityEvent('policy_violation_spike', {
      violation_type: violationType,
      violation_count: count,
      threshold_exceeded: count > threshold
    });
  },

  /**
   * Track CORS violations
   */
  trackCORSViolation(origin, endpoint) {
    this.trackSecurityEvent('cors_violation', {
      origin,
      endpoint
    });
  },

  /**
   * Track rate limit breaches
   */
  trackRateLimitBreach(endpoint, ipAddress) {
    this.trackSecurityEvent('rate_limit_breach', {
      endpoint,
      ip_address: ipAddress
    });
  },

  /**
   * Track webhook replay attempts
   */
  trackWebhookReplay(webhookId) {
    this.trackSecurityEvent('webhook_replay_attempt', {
      webhook_id: webhookId
    });
  },

  /**
   * Track SQL injection attempts
   */
  trackSQLInjection(endpoint) {
    this.trackSecurityEvent('sql_injection_attempt', {
      endpoint
    });
  },

  /**
   * Track security alert triggers
   */
  trackSecurityAlert(alertType, severity) {
    this.trackSecurityEvent('security_alert_triggered', {
      alert_type: alertType,
      severity
    });
  },

  // Enhanced voting events
  trackVoteEvent(electionId, votingType, vpEarned, metadata = {}) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'vote_cast', {
      'election_id': electionId,
      'voting_type': votingType,
      'vp_earned': vpEarned,
      'event_category': 'voting',
      'event_label': `Election ${electionId}`,
      'value': vpEarned,
      ...metadata
    });
  },

  // Creator earnings events
  trackCreatorEarnings(creatorId, earningsType, amount, currency = 'USD') {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'creator_earnings', {
      'creator_id': creatorId,
      'earnings_type': earningsType,
      'amount': amount,
      'currency': currency,
      'event_category': 'creator_economy',
      'value': amount
    });
  },

  // VP transaction events
  trackVPTransaction(transactionType, amount, source, userId) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'vp_transaction', {
      'transaction_type': transactionType,
      'vp_amount': amount,
      'source': source,
      'user_id': userId,
      'event_category': 'gamification',
      'value': amount
    });
  },

  // Election creation events
  trackElectionCreation(electionId, electionType, hasParticipationFee, prizePool) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'election_created', {
      'election_id': electionId,
      'election_type': electionType,
      'has_participation_fee': hasParticipationFee,
      'prize_pool': prizePool,
      'event_category': 'content_creation',
      'value': prizePool || 0
    });
  },

  // Prediction accuracy events
  trackPredictionAccuracy(electionId, brierScore, accuracyRank, vpReward) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'prediction_accuracy', {
      'election_id': electionId,
      'brier_score': brierScore,
      'accuracy_rank': accuracyRank,
      'vp_reward': vpReward,
      'event_category': 'predictions',
      'value': vpReward
    });
  },

  // Quest completion events
  trackQuestCompletion(questId, questType, vpReward, difficulty) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'quest_completed', {
      'quest_id': questId,
      'quest_type': questType,
      'vp_reward': vpReward,
      'difficulty': difficulty,
      'event_category': 'gamification',
      'value': vpReward
    });
  },

  // Subscription events
  trackSubscription(subscriptionTier, amount, isUpgrade) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', isUpgrade ? 'subscription_upgrade' : 'subscription_start', {
      'subscription_tier': subscriptionTier,
      'amount': amount,
      'event_category': 'subscriptions',
      'value': amount
    });
  },

  // Ad engagement events
  trackAdEngagement(adId, adType, engagementType, vpEarned) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'ad_engagement', {
      'ad_id': adId,
      'ad_type': adType,
      'engagement_type': engagementType,
      'vp_earned': vpEarned,
      'event_category': 'advertising',
      'value': vpEarned
    });
  },

  // Social sharing events
  trackSocialShare(contentType, contentId, platform) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'share', {
      'content_type': contentType,
      'content_id': contentId,
      'method': platform,
      'event_category': 'social'
    });
  },

  // Feature flag exposure events
  trackFeatureFlagExposure(flagKey, variant, userId) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'feature_flag_exposure', {
      'flag_key': flagKey,
      'variant': variant,
      'user_id': userId,
      'event_category': 'experiments'
    });
  },

  // Onboarding tour events
  trackOnboardingTour(tourId, action, stepNumber) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', `onboarding_${action}`, {
      'tour_id': tourId,
      'step_number': stepNumber,
      'event_category': 'onboarding'
    });
  },

  // Search events
  trackSearch(query, resultsCount, searchTime) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'search', {
      'search_term': query,
      'results_count': resultsCount,
      'search_time_ms': searchTime,
      'event_category': 'search'
    });
  },

  // 3D carousel performance events
  track3DCarouselPerformance(carouselType, fps, renderTime, quality) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', '3d_carousel_performance', {
      'carousel_type': carouselType,
      'fps': fps,
      'render_time_ms': renderTime,
      'quality_level': quality,
      'event_category': 'performance'
    });
  },

  // AI interaction events
  trackAIInteraction(aiProvider, interactionType, responseTime, success) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'ai_interaction', {
      'ai_provider': aiProvider,
      'interaction_type': interactionType,
      'response_time_ms': responseTime,
      'success': success,
      'event_category': 'ai'
    });
  },

  // Conversion funnel events
  trackConversionFunnel(funnelName, step, stepName, value) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'funnel_step', {
      'funnel_name': funnelName,
      'step_number': step,
      'step_name': stepName,
      'event_category': 'conversion',
      'value': value || 0
    });
  },

  // User engagement score
  trackEngagementScore(score, category, timeSpent) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') return;

    window.gtag('event', 'engagement_score', {
      'score': score,
      'category': category,
      'time_spent_seconds': timeSpent,
      'event_category': 'engagement',
      'value': score
    });
  }
};

export default googleAnalyticsService;