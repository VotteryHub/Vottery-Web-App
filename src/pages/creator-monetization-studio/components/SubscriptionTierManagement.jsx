import React, { useState, useEffect } from 'react';
import { Star, Crown, Zap, Shield, Award, ChevronRight } from 'lucide-react';
import { carouselCreatorTiersService } from '../../../services/carouselCreatorTiersService';
import Icon from '../../../components/AppIcon';


const TIER_ICONS = { bronze: Award, silver: Star, gold: Zap, platinum: Shield, elite: Crown };
const TIER_COLORS = {
  bronze: { text: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30', badge: 'bg-amber-600' },
  silver: { text: 'text-gray-300', bg: 'bg-gray-300/10', border: 'border-gray-300/30', badge: 'bg-gray-400' },
  gold: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', badge: 'bg-yellow-500' },
  platinum: { text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30', badge: 'bg-cyan-500' },
  elite: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', badge: 'bg-purple-600' },
};

const STATIC_TIERS = [
  { tierName: 'bronze', tierDisplayName: 'Bronze', priceMonthly: 9, features: ['5 elections/month', 'Basic analytics', 'Standard support', 'Community access'], maxCarousels: 3, sponsorshipPriority: 'low' },
  { tierName: 'silver', tierDisplayName: 'Silver', priceMonthly: 29, features: ['20 elections/month', 'Advanced analytics', 'Priority support', 'Carousel templates', 'Sponsorship access'], maxCarousels: 10, sponsorshipPriority: 'medium' },
  { tierName: 'gold', tierDisplayName: 'Gold', priceMonthly: 79, features: ['Unlimited elections', 'Full analytics suite', 'Dedicated support', 'Premium templates', 'High-priority sponsorships', 'Revenue sharing'], maxCarousels: 50, sponsorshipPriority: 'high' },
  { tierName: 'platinum', tierDisplayName: 'Platinum', priceMonthly: 199, features: ['Everything in Gold', 'White-label options', 'API access', 'Custom integrations', 'VIP sponsorships', 'Co-marketing'], maxCarousels: 200, sponsorshipPriority: 'vip' },
  { tierName: 'elite', tierDisplayName: 'Elite', priceMonthly: 499, features: ['Everything in Platinum', 'Dedicated account manager', 'Custom revenue splits', 'Early feature access', 'Enterprise SLA', 'Unlimited everything'], maxCarousels: -1, sponsorshipPriority: 'exclusive' },
];

const SubscriptionTierManagement = () => {
  const [tiers, setTiers] = useState(STATIC_TIERS);
  const [currentTier, setCurrentTier] = useState('silver');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const { data } = await carouselCreatorTiersService?.getAllTiers();
        if (data?.length > 0) setTiers(data);
      } catch (err) {
        console.error('Error fetching tiers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Crown className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Subscription Tier Management</h2>
          <p className="text-gray-400 text-sm">Bronze · Silver · Gold · Platinum · Elite</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tiers?.map(tier => {
          const name = tier?.tierName || tier?.tier_name || 'bronze';
          const displayName = tier?.tierDisplayName || tier?.tier_display_name || name;
          const price = tier?.priceMonthly || tier?.price_monthly || 0;
          const features = tier?.features || [];
          const colors = TIER_COLORS?.[name] || TIER_COLORS?.bronze;
          const Icon = TIER_ICONS?.[name] || Award;
          const isCurrent = currentTier === name;

          return (
            <div
              key={name}
              className={`rounded-xl border p-4 transition-all ${
                isCurrent ? `${colors?.border} ${colors?.bg}` : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors?.bg}`}>
                    <Icon className={`w-5 h-5 ${colors?.text}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{displayName}</span>
                      {isCurrent && (
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${colors?.badge}`}>Current</span>
                      )}
                    </div>
                    <p className={`text-sm font-bold ${colors?.text}`}>${price}/mo</p>
                  </div>
                </div>
                {!isCurrent && (
                  <button
                    onClick={() => setCurrentTier(name)}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Upgrade <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isCurrent && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(features) ? features : Object.keys(features))?.slice(0, 4)?.map((f, i) => (
                      <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                        {typeof f === 'string' ? f : f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionTierManagement;
