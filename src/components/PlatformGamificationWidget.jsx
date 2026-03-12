import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import { platformGamificationService } from '../services/platformGamificationService';

const SlotMiniAnimation = () => {
  const symbols = ['🎰', '⭐', '🏆', '💎', '🎯', '🎪'];
  const [current, setCurrent] = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpinning(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % symbols?.length);
        setSpinning(false);
      }, 150);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg overflow-hidden">
      <span
        className={`text-xl transition-all duration-150 ${spinning ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
        style={{ display: 'block' }}
      >
        {symbols?.[current]}
      </span>
    </div>
  );
};

const useCountdown = (drawDate) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!drawDate) return;
    const update = () => {
      const now = new Date();
      const target = new Date(drawDate);
      const diff = target - now;
      if (diff <= 0) {
        setCountdown('Draw complete');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      if (days > 0) setCountdown(`${days}d ${hours}h ${mins}m`);
      else setCountdown(`${hours}h ${mins}m ${secs}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [drawDate]);

  return countdown;
};

const PlatformGamificationWidget = ({ compact = false }) => {
  const [campaign, setCampaign] = useState(null);
  const [winnersCount, setWinnersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown(campaign?.draw_date || campaign?.end_date);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await platformGamificationService?.getCampaigns({ isEnabled: true });
        if (result?.success && result?.data?.length > 0) {
          // Get current month's active campaign
          const now = new Date();
          const active = result?.data?.find(c =>
            c?.is_enabled === true &&
            (c?.status === 'active' || c?.status === 'running')
          ) || result?.data?.find(c => c?.is_enabled === true) || null;
          setCampaign(active);

          if (active?.id) {
            const { data: winners } = await (supabaseWinnersQuery(active?.id));
            setWinnersCount(winners?.length || 0);
          }
        }
      } catch (err) {
        console.error('PlatformGamificationWidget error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Helper to query winners
  const supabaseWinnersQuery = async (campaignId) => {
    try {
      const { supabase } = await import('../lib/supabase');
      return supabase?.from('platform_gamification_winners')?.select('id', { count: 'exact' })?.eq('campaign_id', campaignId);
    } catch { return { data: [] }; }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-2" />
        <div className="h-3 bg-muted rounded w-3/4" />
      </div>
    );
  }

  if (!campaign) return null;

  if (compact) {
    return (
      <Link to="/platform-gamification-core-engine" className="block">
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3 hover:border-yellow-500/40 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <SlotMiniAnimation />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{campaign?.name || 'Monthly Draw'}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                {countdown === 'Draw complete' ? '🎉 Draw complete!' : `⏱ ${countdown}`}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-yellow-500">${(campaign?.total_prize_pool || campaign?.prize_pool || 0)?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Prize Pool</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/10 border border-yellow-500/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlotMiniAnimation />
          <div>
            <h3 className="font-semibold text-foreground text-sm">Platform Gamification</h3>
            <p className="text-xs text-muted-foreground">Monthly Prize Draw</p>
          </div>
        </div>
        <Link
          to="/platform-gamification-core-engine"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          View All <Icon name="ArrowRight" size={12} />
        </Link>
      </div>

      <div className="bg-card/60 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-foreground mb-1 truncate">{campaign?.name || 'Monthly Draw Campaign'}</p>
        <p className="text-xs text-muted-foreground">{campaign?.description || 'Vote to enter the monthly prize draw'}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-card/60 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-yellow-500">${(campaign?.total_prize_pool || campaign?.prize_pool || 0)?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Prize Pool</p>
        </div>
        <div className="bg-card/60 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-foreground">{winnersCount}</p>
          <p className="text-xs text-muted-foreground">Winners</p>
        </div>
        <div className="bg-card/60 rounded-lg p-3 text-center">
          <p className="text-xs font-bold text-foreground leading-tight">
            {countdown === 'Draw complete' ? '🎉 Done' : countdown}
          </p>
          <p className="text-xs text-muted-foreground">Next Draw</p>
        </div>
      </div>

      <Link
        to="/platform-gamification-core-engine"
        className="block w-full text-center py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        🎰 Enter Draw
      </Link>
    </div>
  );
};

export default PlatformGamificationWidget;
