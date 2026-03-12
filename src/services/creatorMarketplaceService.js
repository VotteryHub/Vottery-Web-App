import { supabase } from '../lib/supabase';

const FALLBACK_SERVICES = [
  { id: 1, title: 'Sponsored Content Package', type: 'sponsored_content', price: 500, rating: 4.8, reviews: 24, creator: 'Alex Johnson', avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_17141f68f-1768208600512.png', delivery_days: 7, description: 'Full sponsored content creation including script, production, and distribution.' },
  { id: 2, title: 'Collaboration Bundle', type: 'collaboration_bundle', price: 1200, rating: 4.9, reviews: 18, creator: 'Sarah Chen', avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b31ef3f0-1766850379208.png', delivery_days: 14, description: 'Complete collaboration package with co-creation, cross-promotion, and analytics.' },
  { id: 3, title: 'Exclusive Access Tier', type: 'exclusive_access', price: 299, rating: 4.7, reviews: 42, creator: 'Mike Davis', avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1db797d19-1764730060970.png', delivery_days: 3, description: 'Monthly exclusive content, behind-the-scenes access, and direct creator interaction.' }
];

const FALLBACK_ESCROW = [
  { id: 'ESC-001', service: 'Sponsored Content Package', amount: 500, status: 'in_escrow', release_date: '2026-03-05', buyer: 'BrandCo Inc' },
  { id: 'ESC-002', service: 'Collaboration Bundle', amount: 1200, status: 'pending_release', release_date: '2026-02-28', buyer: 'TechStartup' }
];

export const creatorMarketplaceService = {
  async getServices() {
    try {
      const { data, error } = await supabase
        ?.from('creator_marketplace_services')
        ?.select('*, user_profiles!creator_id(full_name, avatar_url)')
        ?.eq('is_active', true)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      if (data?.length > 0) {
        return data?.map(s => ({
          id: s?.id,
          title: s?.title,
          type: s?.service_type,
          price: s?.price,
          rating: s?.rating ?? 4.5,
          reviews: s?.review_count ?? 0,
          creator: s?.user_profiles?.full_name || 'Creator',
          avatar: s?.user_profiles?.avatar_url || s?.creator_avatar,
          deliveryDays: s?.delivery_days ?? 7,
          description: s?.description
        }));
      }
    } catch (_) {}
    return FALLBACK_SERVICES?.map(s => ({ ...s, deliveryDays: s?.delivery_days ?? s?.deliveryDays ?? 7 }));
  },

  async getEscrowHoldings(creatorId) {
    try {
      const { data, error } = await supabase
        ?.from('creator_marketplace_escrow')
        ?.select('*')
        ?.eq('creator_id', creatorId)
        ?.in('status', ['in_escrow', 'pending_release', 'confirmed']);

      if (error) throw error;
      if (data?.length > 0) {
        return data?.map(e => ({
          id: e?.id,
          service: e?.service_title || e?.service,
          amount: e?.amount,
          status: e?.status === 'pending_release' ? 'pending_release' : 'in_escrow',
          releaseDate: e?.release_date || e?.releaseDate,
          buyer: e?.buyer_name || e?.buyer
        }));
      }
    } catch (_) {}
    return FALLBACK_ESCROW;
  },

  async createBooking(serviceId, buyerId, amount, selectedDates) {
    try {
      const { data, error } = await supabase
        ?.from('creator_marketplace_bookings')
        ?.insert({
          service_id: serviceId,
          buyer_id: buyerId,
          amount,
          status: 'in_escrow',
          selected_dates: selectedDates,
          created_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: err?.message } };
    }
  }
};
