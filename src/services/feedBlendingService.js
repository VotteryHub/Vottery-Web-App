import { supabase } from '../lib/supabase';

import { AD_ORGANIC_RATIO } from '../constants/SHARED_CONSTANTS';

export const feedBlendingService = {
  /** 1 ad per N organic items (sync with SHARED_CONSTANTS.AD_ORGANIC_RATIO.ORGANIC_ITEMS_PER_AD) */
  AD_INTERVAL: AD_ORGANIC_RATIO?.ORGANIC_ITEMS_PER_AD ?? 7,

  async getSponsoredElections(limit = 5, userProfile = null) {
    try {
      let query = supabase
        ?.from('sponsored_elections')
        ?.select('*, elections(*)')
        ?.eq('status', 'active')
        ?.gt('budget_total', 0)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  blendAdsIntoFeed(organicItems, sponsoredItems) {
    if (!organicItems?.length) return organicItems || [];
    if (!sponsoredItems?.length) return organicItems;

    const blended = [];
    let adIndex = 0;

    for (let i = 0; i < organicItems.length; i++) {
      blended.push({ ...organicItems[i], _type: 'organic' });
      if ((i + 1) % this.AD_INTERVAL === 0 && adIndex < sponsoredItems.length) {
        blended.push({
          ...sponsoredItems[adIndex],
          _type: 'sponsored',
          _sponsoredTag: true,
        });
        adIndex++;
      }
    }
    return blended;
  },

  isSponsoredItem(item) {
    return item?._type === 'sponsored' || item?._sponsoredTag === true;
  },
};

export default feedBlendingService;
