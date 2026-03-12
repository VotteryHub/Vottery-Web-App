import { supabase } from '../lib/supabase';


const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
const baseURL = 'https://api.anthropic.com/v1/messages';

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

export const carouselCoachingService = {
  // Get or create conversation
  async getOrCreateConversation(creatorId) {
    try {
      // Try to get active conversation
      let { data, error } = await supabase
        ?.from('carousel_coaching_conversations')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.eq('status', 'active')
        ?.order('last_message_at', { ascending: false })
        ?.limit(1)
        ?.single();

      // Create new conversation if none exists
      if (error?.code === 'PGRST116') {
        const { data: newConv, error: createError } = await supabase
          ?.from('carousel_coaching_conversations')
          ?.insert(toSnakeCase({
            creatorId,
            conversationTitle: 'Carousel Optimization Coaching',
            messages: [],
            status: 'active'
          }))
          ?.select()
          ?.single();

        if (createError) throw createError;
        data = newConv;
      } else if (error) {
        throw error;
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Send message with streaming support
  async sendMessage(conversationId, message, onStream) {
    try {
      if (!apiKey) throw new Error('Anthropic API key is missing');

      // Get conversation history
      const { data: conversation } = await supabase
        ?.from('carousel_coaching_conversations')
        ?.select('*')
        ?.eq('id', conversationId)
        ?.single();

      if (!conversation) throw new Error('Conversation not found');

      const messages = conversation?.messages || [];
      messages?.push({ role: 'user', content: message });

      // Stream Claude response
      const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          messages,
          system: 'You are a carousel optimization coach. Provide actionable advice for improving carousel performance, engagement, and monetization. Be specific and data-driven.',
          max_tokens: 2048,
          temperature: 0.7,
          stream: true
        })
      });

      if (!response?.ok) {
        throw new Error('Failed to get Claude response');
      }

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader?.read();
        if (done) break;

        const chunk = decoder?.decode(value);
        const lines = chunk?.split('\n')?.filter(line => line?.trim()?.startsWith('data:'));

        for (const line of lines) {
          let data = line?.replace('data: ', '');
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed?.type === 'content_block_delta') {
              const text = parsed?.delta?.text || '';
              assistantMessage += text;
              if (onStream) onStream(text);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      // Save complete conversation
      messages?.push({ role: 'assistant', content: assistantMessage });
      await supabase
        ?.from('carousel_coaching_conversations')
        ?.update({
          messages: messages,
          last_message_at: new Date()?.toISOString()
        })
        ?.eq('id', conversationId);

      // Extract and create action items
      await this.extractActionItems(conversationId, assistantMessage);

      return { data: { message: assistantMessage }, error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Extract action items from Claude response
  async extractActionItems(conversationId, message) {
    try {
      const { data: conversation } = await supabase
        ?.from('carousel_coaching_conversations')
        ?.select('creator_id')
        ?.eq('id', conversationId)
        ?.single();

      // Simple action item extraction (look for numbered lists or bullet points)
      const actionRegex = /(?:^|\n)(?:\d+\.|[-*])\s+(.+?)(?=\n|$)/g;
      const matches = [...message?.matchAll(actionRegex)];

      for (const match of matches) {
        const actionText = match?.[1]?.trim();
        if (actionText?.length > 10) {
          await supabase
            ?.from('carousel_coaching_action_items')
            ?.insert(toSnakeCase({
              conversationId,
              creatorId: conversation?.creator_id,
              actionTitle: actionText?.substring(0, 100),
              actionDescription: actionText,
              priority: 'medium',
              status: 'pending'
            }));
        }
      }

      return { data: { extracted: matches?.length }, error: null };
    } catch (error) {
      console.error('Error extracting action items:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get conversation history
  async getConversationHistory(conversationId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_coaching_conversations')
        ?.select('*')
        ?.eq('id', conversationId)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get action items
  async getActionItems(creatorId, status = null) {
    try {
      let query = supabase
        ?.from('carousel_coaching_action_items')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.order('created_at', { ascending: false });

      if (status) {
        query = query?.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching action items:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update action item status
  async updateActionItem(actionItemId, updates) {
    try {
      const dbData = toSnakeCase(updates);
      if (updates?.status === 'completed') {
        dbData.completed_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase
        ?.from('carousel_coaching_action_items')
        ?.update(dbData)
        ?.eq('id', actionItemId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating action item:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Archive conversation
  async archiveConversation(conversationId) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_coaching_conversations')
        ?.update({ status: 'archived' })
        ?.eq('id', conversationId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error archiving conversation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get coaching analytics
  async getCoachingAnalytics(creatorId) {
    try {
      const { data: conversations } = await supabase
        ?.from('carousel_coaching_conversations')
        ?.select('*')
        ?.eq('creator_id', creatorId);

      const { data: actionItems } = await this.getActionItems(creatorId);

      const totalConversations = conversations?.length || 0;
      const totalMessages = conversations?.reduce((sum, c) => sum + (c?.messages?.length || 0), 0);
      const completedActions = actionItems?.filter(a => a?.status === 'completed')?.length || 0;
      const pendingActions = actionItems?.filter(a => a?.status === 'pending')?.length || 0;

      return {
        data: {
          totalConversations,
          totalMessages,
          completedActions,
          pendingActions,
          completionRate: actionItems?.length > 0 ? ((completedActions / actionItems?.length) * 100)?.toFixed(1) : 0
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching coaching analytics:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};