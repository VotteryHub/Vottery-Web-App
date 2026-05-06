import { supabase } from '../lib/supabase';
import { geminiChatService } from './geminiChatService';

export const constitutionalService = {
  /**
   * Transparency: Explain why a user is seeing a specific content item.
   */
  async getLogicAuditExplanation(userId, contentItem) {
    try {
      // Fetch user context (preferences, history)
      const { data: preferences } = await supabase
        ?.from('user_topic_preferences')
        ?.select('topic_categories(display_name)')
        ?.eq('user_id', userId)
        ?.limit(5);

      const auditData = {
        title: contentItem.title || contentItem.content,
        vIQ: contentItem.viq_metadata?.vIQ || 0.5,
        personalization: contentItem.viq_metadata?.personalizationScore || 0.2,
        discovery: contentItem.viq_metadata?.discoveryScore || 0.1,
        userInterests: preferences?.map(p => p.topic_categories?.display_name) || []
      };

      // Use Gemini to generate plain-language explanation
      const prompt = [
        {
          role: 'system',
          content: 'You are the Vottery Constitution Auditor. Explain in plain language why this user is seeing this content. Be transparent and honest. Avoid jargon.'
        },
        {
          role: 'user',
          content: `Data: ${JSON.stringify(auditData)}`
        }
      ];

      const response = await geminiChatService.generateContent(prompt, { temperature: 0.5 });
      return { success: true, explanation: response.choices[0].message.content };
    } catch (error) {
      console.error('Logic audit failed:', error);
      return { success: false, explanation: "Standard algorithmic relevance based on your recent activity." };
    }
  },

  /**
   * Integrity: Check for Democratic Freeze triggers.
   */
  async checkIntegrityTriggers(contentId, recentVotes) {
    // V1 Minimal: Freeze if > 100 votes in < 1 minute (potential bot spike)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count } = await supabase
      ?.from('votes')
      ?.select('id', { count: 'exact', head: true })
      ?.eq('election_id', contentId)
      ?.gt('created_at', oneMinuteAgo);

    if (count > 100) {
      await this.triggerDemocraticFreeze(contentId, 'Suspicious voting spike detected.');
      return { freeze: true, reason: 'High velocity detected' };
    }
    return { freeze: false };
  },

  async triggerDemocraticFreeze(contentId, reason) {
    await supabase
      ?.from('elections')
      ?.update({ status: 'frozen', audit_notes: reason })
      ?.eq('id', contentId);
  },

  /**
   * Redemption: Calculate penalty decay over time.
   */
  async applyRedemptionDecay(userId) {
    // Fetch active reach penalties
    const { data: penalties } = await supabase
      ?.from('user_penalties')
      ?.select('*')
      ?.eq('user_id', userId)
      ?.eq('status', 'active');

    for (const penalty of (penalties || [])) {
      const hoursSince = (Date.now() - new Date(penalty.created_at).getTime()) / (1000 * 60 * 60);
      // Decay penalty by 10% every 24 hours
      const newCp = Math.min(1, penalty.penalty_coefficient + (hoursSince / 24) * 0.1);
      
      if (newCp >= 1) {
        await supabase?.from('user_penalties')?.update({ status: 'expired', penalty_coefficient: 1.0 })?.eq('id', penalty.id);
      } else {
        await supabase?.from('user_penalties')?.update({ penalty_coefficient: newCp })?.eq('id', penalty.id);
      }
    }
  }
};

export default constitutionalService;
