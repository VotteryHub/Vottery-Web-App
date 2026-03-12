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

export const socialSharingService = {
  share(platform, url, message, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedMessage = encodeURIComponent(message);
    const encodedTitle = encodeURIComponent(title || '');

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
        break;
      default:
        // Use Web Share API as fallback
        if (navigator?.share) {
          navigator?.share({
            title: title,
            text: message,
            url: url
          })?.catch(err => console.error('Share failed:', err));
          return true;
        }
        return false;
    }

    // Open share URL in new window
    window?.open(shareUrl, '_blank', 'width=600,height=400');
    return true;
  },

  async trackShare(shareData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { error: { message: 'Not authenticated' } };

      const dbData = toSnakeCase({
        ...shareData,
        userId: user?.id,
        sharedAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('social_shares')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getShareStats(contentType, contentId) {
    try {
      const { data, error } = await supabase
        ?.from('social_shares')
        ?.select('platform')
        ?.eq('content_type', contentType)
        ?.eq('content_id', contentId);

      if (error) throw error;

      const stats = {
        whatsapp: 0,
        facebook: 0,
        twitter: 0,
        linkedin: 0,
        telegram: 0,
        total: data?.length || 0
      };

      data?.forEach(share => {
        if (stats?.[share?.platform] !== undefined) {
          stats[share?.platform]++;
        }
      });

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async incrementShareCount(contentType, contentId) {
    try {
      let table = '';
      if (contentType === 'post') table = 'posts';
      else if (contentType === 'election') table = 'elections';
      else return { error: { message: 'Invalid content type' } };

      const { data, error } = await supabase?.rpc('increment_share_count', {
        table_name: table,
        row_id: contentId
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default socialSharingService;