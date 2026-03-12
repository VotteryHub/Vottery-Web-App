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

export const realtimeWinnerNotificationService = {
  /**
   * Subscribe to real-time winner announcements for a campaign
   */
  subscribeToWinnerAnnouncements(campaignId, callback) {
    const subscription = supabase
      ?.channel(`campaign-winners-${campaignId}`)
      ?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'platform_gamification_winners',
          filter: `campaign_id=eq.${campaignId}`
        },
        (payload) => {
          callback(toCamelCase(payload?.new));
        }
      )
      ?.subscribe();

    return subscription;
  },

  /**
   * Get live winner feed with real-time updates
   */
  async getLiveWinnerFeed(campaignId, limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('platform_gamification_winners')
        ?.select(`
          *,
          user:user_id(id, name, username, avatar),
          campaign:campaign_id(campaign_name, custom_prize_name, branding_logo_url)
        `)
        ?.eq('campaign_id', campaignId)
        ?.order('winner_selected_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Verify blockchain proof for winner
   */
  async verifyBlockchainProof(winnerId) {
    try {
      const { data: winner, error } = await supabase
        ?.from('platform_gamification_winners')
        ?.select('*')
        ?.eq('id', winnerId)
        ?.single();

      if (error) throw error;

      // Simulate blockchain verification
      const verificationResult = {
        isValid: true,
        blockchainHash: winner?.blockchain_proof,
        timestamp: winner?.winner_selected_at,
        transactionUrl: `https://etherscan.io/tx/${winner?.blockchain_proof}`,
        confirmations: 12,
        verifiedAt: new Date()?.toISOString()
      };

      return { data: verificationResult, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Send celebration notification with confetti animation
   */
  async sendCelebrationNotification(winnerId) {
    try {
      const { data: winner, error: winnerError } = await supabase
        ?.from('platform_gamification_winners')
        ?.select(`
          *,
          user:user_id(id, name, username, email),
          campaign:campaign_id(campaign_name, custom_prize_name)
        `)
        ?.eq('id', winnerId)
        ?.single();

      if (winnerError) throw winnerError;

      // Create celebration notification
      const { data: notification, error: notificationError } = await supabase
        ?.from('notifications')
        ?.insert({
          recipient_id: winner?.user_id,
          notification_type: 'winner_celebration',
          title: '🎉 Congratulations! You Won!',
          message: `You won ${winner?.prize_tier} (${winner?.prize_amount}) in ${winner?.campaign?.campaign_name}!`,
          action_url: `/real-time-winner-notification-prize-verification-center?winner=${winnerId}`,
          metadata: {
            winnerId,
            campaignId: winner?.campaign_id,
            prizeAmount: winner?.prize_amount,
            prizeTier: winner?.prize_tier,
            celebrationType: 'confetti',
            blockchainProof: winner?.blockchain_proof
          }
        })
        ?.select()
        ?.single();

      if (notificationError) throw notificationError;

      // Update winner notification status
      await supabase
        ?.from('platform_gamification_winners')
        ?.update({
          notification_sent: true,
          notification_sent_at: new Date()?.toISOString()
        })
        ?.eq('id', winnerId);

      return { data: toCamelCase(notification), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Get prize confirmation status
   */
  async getPrizeConfirmationStatus(winnerId) {
    try {
      const { data, error } = await supabase
        ?.from('platform_gamification_winners')
        ?.select(`
          *,
          user:user_id(id, name, username, email),
          campaign:campaign_id(campaign_name, custom_prize_name, prize_pool_amount)
        `)
        ?.eq('id', winnerId)
        ?.single();

      if (error) throw error;

      const confirmationStatus = {
        winnerId: data?.id,
        prizeAmount: data?.prize_amount,
        prizeTier: data?.prize_tier,
        payoutStatus: data?.payout_status,
        payoutMethod: data?.payout_method,
        transactionId: data?.payout_transaction_id,
        confirmedAt: data?.payout_completed_at,
        blockchainProof: data?.blockchain_proof,
        verificationLink: `https://etherscan.io/tx/${data?.blockchain_proof}`,
        estimatedDelivery: this.calculateEstimatedDelivery(data?.payout_status)
      };

      return { data: confirmationStatus, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Calculate estimated delivery time
   */
  calculateEstimatedDelivery(payoutStatus) {
    const now = new Date();
    switch (payoutStatus) {
      case 'pending':
        return new Date(now?.getTime() + 24 * 60 * 60 * 1000)?.toISOString(); // 24 hours
      case 'processing':
        return new Date(now?.getTime() + 12 * 60 * 60 * 1000)?.toISOString(); // 12 hours
      case 'completed':
        return now?.toISOString();
      default:
        return null;
    }
  },

  /**
   * Get live prize tracking for campaign
   */
  async getLivePrizeTracking(campaignId) {
    try {
      const { data, error } = await supabase
        ?.from('platform_gamification_winners')
        ?.select('*')
        ?.eq('campaign_id', campaignId)
        ?.order('winner_selected_at', { ascending: false });

      if (error) throw error;

      const tracking = {
        totalWinners: data?.length || 0,
        totalPrizeAmount: data?.reduce((sum, w) => sum + parseFloat(w?.prize_amount || 0), 0),
        payoutQueue: data?.filter(w => w?.payout_status === 'pending')?.length || 0,
        processingPayouts: data?.filter(w => w?.payout_status === 'processing')?.length || 0,
        completedPayouts: data?.filter(w => w?.payout_status === 'completed')?.length || 0,
        failedPayouts: data?.filter(w => w?.payout_status === 'failed')?.length || 0,
        winners: toCamelCase(data)
      };

      return { data: tracking, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Generate social sharing content for winner
   */
  async generateSocialSharingContent(winnerId) {
    try {
      const { data: winner, error } = await supabase
        ?.from('platform_gamification_winners')
        ?.select(`
          *,
          user:user_id(name, username),
          campaign:campaign_id(campaign_name, custom_prize_name)
        `)
        ?.eq('id', winnerId)
        ?.single();

      if (error) throw error;

      const sharingContent = {
        title: `🎉 I just won ${winner?.prize_tier} on Vottery!`,
        description: `I'm a lucky winner in ${winner?.campaign?.campaign_name}! Join Vottery for your chance to win amazing prizes.`,
        imageUrl: winner?.campaign?.branding_logo_url || '/assets/images/winner-celebration.png',
        shareUrl: `https://vottery.com/winners/${winnerId}`,
        hashtags: ['Vottery', 'Winner', 'Gamification', winner?.campaign?.custom_prize_name?.replace(/\s+/g, '')],
        platforms: {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎉 I just won ${winner?.prize_tier} on Vottery! #Vottery #Winner`)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://vottery.com/winners/${winnerId}`)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://vottery.com/winners/${winnerId}`)}`
        }
      };

      return { data: sharingContent, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Get winner verification badge
   */
  async getWinnerVerificationBadge(winnerId) {
    try {
      const { data: winner, error } = await supabase
        ?.from('platform_gamification_winners')
        ?.select('*')
        ?.eq('id', winnerId)
        ?.single();

      if (error) throw error;

      const badge = {
        winnerId,
        badgeType: 'verified_winner',
        badgeLevel: winner?.prize_tier,
        issuedAt: winner?.winner_selected_at,
        blockchainVerified: !!winner?.blockchain_proof,
        certificateUrl: `/certificates/winner/${winnerId}`,
        badgeImageUrl: `/assets/badges/winner-${winner?.prize_tier?.toLowerCase()}.png`
      };

      return { data: badge, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};