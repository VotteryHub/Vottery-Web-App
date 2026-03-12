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

export const winnerNotificationService = {
  async notifyWinners(electionId, winners) {
    try {
      const { data: election, error: electionError } = await supabase
        ?.from('elections')
        ?.select('title, created_by')
        ?.eq('id', electionId)
        ?.single();

      if (electionError) throw electionError;

      const notifications = winners?.map(winner => ({
        recipient_id: winner?.userId,
        sender_id: election?.created_by,
        notification_type: 'gamified_win',
        title: 'Congratulations! You Won!',
        message: `You are winner #${winner?.rank} in "${election?.title}"! Check your wallet for prize details.`,
        action_url: `/digital-wallet-hub`,
        metadata: {
          electionId,
          rank: winner?.rank,
          gamifiedTicketId: winner?.gamifiedTicketId
        }
      }));

      const { data, error } = await supabase
        ?.from('notifications')
        ?.insert(notifications)
        ?.select();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendWinnerMessages(electionId, winners) {
    try {
      const { data: election, error: electionError } = await supabase
        ?.from('elections')
        ?.select('title, created_by, prize_pool')
        ?.eq('id', electionId)
        ?.single();

      if (electionError) throw electionError;

      for (const winner of winners) {
        const { data: thread, error: threadError } = await supabase
          ?.from('message_threads')
          ?.select('*')
          ?.or(`and(participant_one_id.eq.${election?.created_by},participant_two_id.eq.${winner?.userId}),and(participant_one_id.eq.${winner?.userId},participant_two_id.eq.${election?.created_by})`)
          ?.single();

        let threadId = thread?.id;

        if (!thread) {
          const { data: newThread, error: createError } = await supabase
            ?.from('message_threads')
            ?.insert({
              participant_one_id: election?.created_by,
              participant_two_id: winner?.userId
            })
            ?.select()
            ?.single();

          if (createError) throw createError;
          threadId = newThread?.id;
        }

        const message = `🎉 Congratulations! You are winner #${winner?.rank} in "${election?.title}"!

Your gamified ticket ${winner?.gamifiedTicketId} has been selected as a winner.

Prize Details:
- Rank: #${winner?.rank}
- Prize Pool: ${election?.prize_pool}
- Election: ${election?.title}

The election creator will contact you shortly to arrange prize delivery. Please check your wallet for updates.

Thank you for participating!`;

        await supabase
          ?.from('direct_messages')
          ?.insert({
            thread_id: threadId,
            sender_id: election?.created_by,
            content: message,
            message_type: 'text'
          });
      }

      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async createPrizeDistributions(electionId, winners, prizePool) {
    try {
      const prizePerWinner = prizePool ? parseFloat(prizePool?.replace(/[^0-9.]/g, '')) / winners?.length : 0;

      const distributions = winners?.map(winner => ({
        election_id: electionId,
        winner_user_id: winner?.userId,
        rank: winner?.rank,
        prize_amount: `$${prizePerWinner?.toFixed(2)}`,
        gamified_ticket_id: winner?.gamifiedTicketId,
        status: 'pending'
      }));

      const { data, error } = await supabase
        ?.from('prize_distributions')
        ?.insert(distributions)
        ?.select();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updatePrizeStatus(distributionId, status, trackingInfo = {}) {
    try {
      const updates = {
        status,
        tracking_info: trackingInfo
      };

      if (status === 'claimed') {
        updates.claim_date = new Date()?.toISOString();
      } else if (status === 'delivered') {
        updates.delivery_date = new Date()?.toISOString();
      }

      const { data, error } = await supabase
        ?.from('prize_distributions')
        ?.update(updates)
        ?.eq('id', distributionId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPrizeDistributions(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('prize_distributions')
        ?.select(`
          *,
          winner:winner_user_id(name, username, avatar)
        `)
        ?.eq('election_id', electionId)
        ?.order('rank', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendAutomatedWinnerNotifications(electionId) {
    try {
      const { data: election, error: electionError } = await supabase
        ?.from('elections')
        ?.select('*, winners:winner_notifications')
        ?.eq('id', electionId)
        ?.single();

      if (electionError) throw electionError;
      if (!election?.winner_notifications || election?.winner_notifications?.length === 0) {
        throw new Error('No winners found for this election');
      }

      const winners = election?.winner_notifications;

      // Send notifications via multiple channels
      for (const winner of winners) {
        // 1. In-app notification
        await this.notifyWinners(electionId, [winner]);

        // 2. Direct message
        await this.sendWinnerMessages(electionId, [winner]);

        // 3. Email notification (if Resend is configured)
        try {
          await this.sendWinnerEmail(winner, election);
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }

        // 4. Create prize distribution record
        await this.createPrizeDistributions(electionId, [winner], election?.prize_pool);
      }

      // Update election status
      await supabase
        ?.from('elections')
        ?.update({ 
          winners_announced: true,
          notification_sent_at: new Date()?.toISOString()
        })
        ?.eq('id', electionId);

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  async sendWinnerEmail(winner, election) {
    // This would integrate with Resend API
    // For now, we'll log the email content
    const emailContent = {
      to: winner?.userEmail,
      subject: `🎉 Congratulations! You Won in "${election?.title}"`,
      html: `
        <h1>Congratulations!</h1>
        <p>You are winner #${winner?.rank} in "${election?.title}"!</p>
        <p>Your gamified ticket ${winner?.gamifiedTicketId} has been selected.</p>
        <p>Prize Pool: ${election?.prize_pool}</p>
        <p>The election creator will contact you shortly to arrange prize delivery.</p>
      `
    };

    console.log('Email would be sent:', emailContent);
    return { success: true };
  },

  async checkPrizeDeliveryStatus(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('prize_distributions')
        ?.select('*, winner:winner_user_id(name, username)')
        ?.eq('election_id', electionId);

      if (error) throw error;

      const pendingCount = data?.filter(d => d?.status === 'pending')?.length || 0;
      const deliveredCount = data?.filter(d => d?.status === 'delivered')?.length || 0;
      const disputedCount = data?.filter(d => d?.status === 'disputed')?.length || 0;

      return {
        data: {
          total: data?.length || 0,
          pending: pendingCount,
          delivered: deliveredCount,
          disputed: disputedCount,
          distributions: toCamelCase(data)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async flagCreatorForNonDelivery(electionId, creatorId, reason) {
    try {
      // Update creator reputation
      await supabase
        ?.from('user_profiles')
        ?.update({
          prizes_failed: supabase?.raw('prizes_failed + 1'),
          reputation_score: supabase?.raw('reputation_score - 10')
        })
        ?.eq('id', creatorId);

      // Check if should be blacklisted (3+ failed deliveries)
      const { data: profile } = await supabase
        ?.from('user_profiles')
        ?.select('prizes_failed')
        ?.eq('id', creatorId)
        ?.single();

      if (profile?.prizes_failed >= 3) {
        await supabase
          ?.from('user_profiles')
          ?.update({
            is_blacklisted: true,
            blacklist_reason: reason || 'Multiple failed prize deliveries',
            blacklisted_at: new Date()?.toISOString()
          })
          ?.eq('id', creatorId);
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  async getRecentWinners(limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('prize_distributions')
        ?.select(`
          *,
          winner:winner_user_id(id, name, username, avatar),
          election:election_id(id, title, category)
        `)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAllPrizeDistributions() {
    try {
      const { data, error } = await supabase
        ?.from('prize_distributions')
        ?.select(`
          *,
          winner:winner_user_id(id, name, username, avatar, email),
          election:election_id(id, title, category)
        `)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendCelebrationNotification(winnerId) {
    try {
      const { data: winner, error: winnerError } = await supabase
        ?.from('prize_distributions')
        ?.select(`
          *,
          winner:winner_user_id(id, name, username, email),
          election:election_id(id, title, prize_pool)
        `)
        ?.eq('id', winnerId)
        ?.single();

      if (winnerError) throw winnerError;

      const { error: notificationError } = await supabase
        ?.from('notifications')
        ?.insert({
          recipient_id: winner?.winner_user_id,
          notification_type: 'celebration',
          title: '🎉 Congratulations! You\'re a Winner!',
          message: `You won ${winner?.prize_amount} in "${winner?.election?.title}"! Your prize is being processed.`,
          action_url: '/digital-wallet-hub',
          metadata: {
            winnerId: winner?.id,
            prizeAmount: winner?.prize_amount,
            electionId: winner?.election_id
          }
        });

      if (notificationError) throw notificationError;

      await supabase
        ?.from('prize_distributions')
        ?.update({ celebration_sent: true, celebration_sent_at: new Date()?.toISOString() })
        ?.eq('id', winnerId);

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  async getNotificationHistory(dateRange = '7d') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(dateRange) {
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(now?.getDate() - 90);
          break;
        default:
          startDate?.setDate(now?.getDate() - 7);
      }

      const { data, error } = await supabase
        ?.from('notifications')
        ?.select(`
          *,
          recipient:recipient_id(id, name, username)
        `)
        ?.in('notification_type', ['gamified_win', 'celebration', 'prize_confirmation'])
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(notification => ({
        id: notification?.id,
        recipientName: notification?.recipient?.name || 'Unknown',
        message: notification?.message,
        channel: 'in_app',
        status: notification?.is_read ? 'delivered' : 'sent',
        sentAt: notification?.created_at,
        deliveredAt: notification?.is_read ? notification?.read_at : null
      }));

      return { data: formattedData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default winnerNotificationService;