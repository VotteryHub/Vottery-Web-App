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

export const commentsService = {
  async getComments(contentType, contentId, parentId = null) {
    try {
      let query = supabase
        ?.from('comments')
        ?.select(`
          *,
          user_profiles!comments_user_id_fkey(name, username, avatar, verified)
        `)
        ?.eq('content_type', contentType)
        ?.eq('content_id', contentId);
      
      if (parentId) {
        query = query?.eq('parent_id', parentId);
      } else {
        // Fetch all top-level comments or all if we handle nesting in FE
        // For simplicity in baseline, we fetch all and build tree in FE or fetch by parent
      }

      const { data, error} = await query?.order('created_at', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createComment(commentData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...commentData,
        userId: user?.id,
        parentId: commentData?.parentId || null
      });

      const { data, error } = await supabase
        ?.from('comments')
        ?.insert(dbData)
        ?.select(`
          *,
          user_profiles!comments_user_id_fkey(name, username, avatar, verified)
        `)
        ?.single();

      if (error) throw error;

      // Increment comment count
      await this.incrementCommentCount(commentData?.contentType, commentData?.contentId);

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateComment(commentId, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('comments')
        ?.update(dbData)
        ?.eq('id', commentId)
        ?.eq('user_id', user?.id)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async deleteComment(commentId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get comment details before deletion
      const { data: comment } = await supabase
        ?.from('comments')
        ?.select('content_type, content_id, user_id')
        ?.eq('id', commentId)
        ?.single();

      if (!comment) throw new Error('Comment not found');

      // Allow deletion if user is comment author or content creator
      const { error } = await supabase
        ?.from('comments')
        ?.delete()
        ?.eq('id', commentId)
        ?.or(`user_id.eq.${user?.id},content_creator_id.eq.${user?.id}`);

      if (error) throw error;

      // Decrement comment count
      await this.decrementCommentCount(comment?.content_type, comment?.content_id);

      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getCommentsSettings(contentType, contentId) {
    try {
      let table = '';
      if (contentType === 'post') table = 'posts';
      else if (contentType === 'election') table = 'elections';
      else return { data: { commentsEnabled: true }, error: null };

      const { data, error } = await supabase
        ?.from(table)
        ?.select('comments_enabled')
        ?.eq('id', contentId)
        ?.single();

      if (error) throw error;
      return { data: { commentsEnabled: data?.comments_enabled ?? true }, error: null };
    } catch (error) {
      return { data: { commentsEnabled: true }, error: { message: error?.message } };
    }
  },

  async toggleComments(contentType, contentId, enabled) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      let table = '';
      if (contentType === 'post') table = 'posts';
      else if (contentType === 'election') table = 'elections';
      else return { error: { message: 'Invalid content type' } };

      const { error } = await supabase
        ?.from(table)
        ?.update({ comments_enabled: enabled })
        ?.eq('id', contentId)
        ?.eq('created_by', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async incrementCommentCount(contentType, contentId) {
    try {
      let table = '';
      if (contentType === 'post') table = 'posts';
      else if (contentType === 'election') table = 'elections';
      else return;

      await supabase?.rpc('increment_comment_count', {
        table_name: table,
        row_id: contentId
      });
    } catch (error) {
      console.error('Failed to increment comment count:', error);
    }
  },

  async decrementCommentCount(contentType, contentId) {
    try {
      let table = '';
      if (contentType === 'post') table = 'posts';
      else if (contentType === 'election') table = 'elections';
      else return;

      await supabase?.rpc('decrement_comment_count', {
        table_name: table,
        row_id: contentId
      });
    } catch (error) {
      console.error('Failed to decrement comment count:', error);
    }
  },

  subscribeToComments(contentType, contentId, callback) {
    const channel = supabase
      ?.channel(`comments-${contentType}-${contentId}`)
      ?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `content_type=eq.${contentType},content_id=eq.${contentId}`
        },
        (payload) => {
          callback(toCamelCase(payload));
        }
      )
      ?.subscribe();

    return () => supabase?.removeChannel(channel);
  }
};

export default commentsService;