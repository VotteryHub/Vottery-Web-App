import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import { platformGamificationService } from '../services/platformGamificationService';
import { eventBus, EVENTS } from '../lib/eventBus';

const SlotMiniAnimation = ({ isSpinningOverride = false }) => {
  const symbols = ['🎰', '⭐', '🏆', '💎', '🎯', '🎪'];
  const [current, setCurrent] = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (isSpinningOverride) {
      const spinInterval = setInterval(() => {
        setCurrent(prev => (prev + 1) % symbols?.length);
      }, 100);
      return () => clearInterval(spinInterval);
    }

    const interval = setInterval(() => {
      setSpinning(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % symbols?.length);
        setSpinning(false);
      }, 150);
    }, 2000);
    return () => clearInterval(interval);
  }, [isSpinningOverride]);

  return (
    <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg overflow-hidden ${isSpinningOverride ? 'animate-bounce' : ''}`}>
      <span
        className={`text-xl transition-all duration-150 ${(spinning || isSpinningOverride) ? 'opacity-50 scale-90 blur-[1px]' : 'opacity-100 scale-100'}`}
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

const PlatformGamificationWidget = ({ compact = false, floating = false }) => {
  const [campaign, setCampaign] = useState(null);
  const [winnersCount, setWinnersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [votesSinceLastSpin, setVotesSinceLastSpin] = useState(() => {
    return parseInt(localStorage.getItem('vottery_votes_since_spin') || '0', 10);
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const countdown = useCountdown(campaign?.draw_date || campaign?.end_date);

  useEffect(() => {
    const handleVoteCast = () => {
      setVotesSinceLastSpin(prev => {
        const next = prev + 1;
        if (next >= 2) {
          setIsSpinning(true);
          setTimeout(() => setIsSpinning(false), 3000); // Spin for 3s
          localStorage.setItem('vottery_votes_since_spin', '0');
          return 0;
        }
        localStorage.setItem('vottery_votes_since_spin', next.toString());
        return next;
      });
    };

    eventBus.on(EVENTS.VOTE_CAST, handleVoteCast);
    return () => eventBus.off(EVENTS.VOTE_CAST, handleVoteCast);
  }, []);

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

  if (floating) {
    return (
      <div className="fixed top-20 right-6 z-[60] animate-in fade-in slide-in-from-right-10 duration-500">
        <Link to="/platform-gamification-core-engine" className="block">
          <div className="relative group">
            {/* Pulsing Aura */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl flex items-center gap-3 w-[260px]">
              <SlotMiniAnimation isSpinningOverride={isSpinning} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-0.5">Lucky Draw</p>
                <p className="text-xs font-bold text-white truncate">{campaign?.name || 'Monthly Draw'}</p>
                <p className="text-[9px] text-slate-400 font-medium">
                  {isSpinning ? '🎰 SELECTING WINNER...' : `${2 - votesSinceLastSpin} votes until spin`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-yellow-500">${(campaign?.total_prize_pool || campaign?.prize_pool || 0)?.toLocaleString()}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Live</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  if (compact) {
    return (
      <Link to="/platform-gamification-core-engine" className="block">
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3 hover:border-yellow-500/40 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <SlotMiniAnimation isSpinningOverride={isSpinning} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{campaign?.name || 'Monthly Draw'}</p>
              <p className="text-[10px] text-yellow-600 dark:text-yellow-400">
                {isSpinning ? '🎰 SPINNING!' : `${2 - votesSinceLastSpin} votes until next spin`}
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
    <div className="premium-glass premium-card p-6 mb-6 shadow-2xl relative overflow-hidden group/gamify">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] -mr-16 -mt-16 group-hover/gamify:bg-yellow-500/20 transition-all duration-700"></div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlotMiniAnimation isSpinningOverride={isSpinning} />
          <div>
            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider">
              {isSpinning ? '🎰 LUCKY SPIN ACTIVE' : 'Platform Gamification'}
            </h3>
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.15em]">
              {2 - votesSinceLastSpin} VOTES TO NEXT SPIN
            </p>
          </div>
        </div>
        <Link
          to="/platform-gamification-core-engine"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          View All <Icon name="ArrowRight" size={12} />
        </Link>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-4 mb-4 border border-slate-200 dark:border-white/10">
        <p className="text-[15px] font-black text-slate-900 dark:text-white mb-1 truncate premium-gradient-text uppercase tracking-tight">{campaign?.name || 'Monthly Draw Campaign'}</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{campaign?.description || 'Vote to enter the monthly prize draw'}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-3 text-center border border-slate-200 dark:border-white/10 shadow-inner">
          <p className="text-xl font-black text-yellow-500">${(campaign?.total_prize_pool || campaign?.prize_pool || 0)?.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Pool</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-3 text-center border border-slate-200 dark:border-white/10 shadow-inner">
          <p className="text-xl font-black text-slate-900 dark:text-white">{winnersCount}</p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Winners</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-3 text-center border border-slate-200 dark:border-white/10 shadow-inner">
          <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight uppercase">
            {countdown === 'Draw complete' ? '🎉 Done' : countdown}
          </p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Next</p>
        </div>
      </div>

      <Link
        to="/platform-gamification-core-engine"
        className="premium-button block w-full text-center py-3.5 font-black uppercase tracking-widest text-white !bg-gradient-to-r !from-yellow-600 !to-orange-600 shadow-yellow-500/20"
      >
        🎰 Enter Draw
      </Link>
    </div>
  );
};

export default PlatformGamificationWidget;
