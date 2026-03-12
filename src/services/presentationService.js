import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_(\w)/g, (_, letter) => letter?.toUpperCase());
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

export const presentationService = {
  async createSlide(electionId, slideData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        electionId,
        createdBy: user?.id,
        title: slideData?.title,
        content: slideData?.content,
        slideOrder: slideData?.slideOrder || 0,
        mediaUrl: slideData?.mediaUrl,
        mediaType: slideData?.mediaType,
        animations: slideData?.animations || {},
        interactiveElements: slideData?.interactiveElements || []
      });

      const { data, error } = await supabase
        ?.from('presentation_slides')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async getSlides(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('presentation_slides')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('slide_order', { ascending: true });

      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async updateSlide(slideId, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('presentation_slides')
        ?.update(dbData)
        ?.eq('id', slideId)
        ?.eq('created_by', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async deleteSlide(slideId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('presentation_slides')
        ?.delete()
        ?.eq('id', slideId)
        ?.eq('created_by', user?.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async reorderSlides(electionId, slideOrders) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = slideOrders?.map(({ id, order }) => 
        supabase
          ?.from('presentation_slides')
          ?.update({ slide_order: order })
          ?.eq('id', id)
          ?.eq('created_by', user?.id)
      );

      await Promise.all(updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async submitQuestion(electionId, questionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        electionId,
        submittedBy: user?.id,
        questionText: questionData?.questionText,
        isAnonymous: questionData?.isAnonymous || false,
        moderationStatus: 'pending'
      });

      const { data, error } = await supabase
        ?.from('audience_questions')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async getQuestions(electionId, filters = {}) {
    try {
      let query = supabase
        ?.from('audience_questions')
        ?.select(`
          *,
          user_profiles!audience_questions_submitted_by_fkey(name, username, avatar)
        `)
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false });

      if (filters?.moderationStatus) {
        query = query?.eq('moderation_status', filters?.moderationStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async moderateQuestion(questionId, action, moderatorNotes = '') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged';

      const { data, error } = await supabase
        ?.from('audience_questions')
        ?.update({
          moderation_status: status,
          moderated_by: user?.id,
          moderated_at: new Date()?.toISOString(),
          moderator_notes: moderatorNotes
        })
        ?.eq('id', questionId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async voteOnQuestion(questionId, voteType) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: question } = await supabase
        ?.from('audience_questions')
        ?.select('upvotes, downvotes')
        ?.eq('id', questionId)
        ?.single();

      const updates = voteType === 'up' 
        ? { upvotes: (question?.upvotes || 0) + 1 }
        : { downvotes: (question?.downvotes || 0) + 1 };

      const { data, error } = await supabase
        ?.from('audience_questions')
        ?.update(updates)
        ?.eq('id', questionId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  async toggleQuestionSubmission(electionId, enabled) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('elections')
        ?.update({ allow_audience_questions: enabled })
        ?.eq('id', electionId)
        ?.eq('created_by', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { success: true, data: toCamelCase(data) };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
};