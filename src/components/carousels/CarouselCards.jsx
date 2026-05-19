/**
 * Vottery Carousel Cards — all 13 spec-defined card types
 * UI only — mock data provided inline.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

/* ──────────────────────────────────────────────────────────
   Shared primitives
────────────────────────────────────────────────────────── */
const CardShell = ({ children, className = '', width = 'w-[220px]' }) => (
  <div className={`${width} flex-shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

const LiveBadge = () => (
  <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-black">
    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
    LIVE
  </div>
);

const TrendingBadge = () => (
  <div className="px-2 py-0.5 bg-[#FFC629] text-gray-900 rounded-full text-[10px] font-black">
    🔥 TRENDING
  </div>
);

const VerifiedBadge = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" className="text-[#0F5FFF]" fill="currentColor">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ActionBtn = ({ label, primary, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 py-1.5 rounded-xl text-[12px] font-bold transition-colors
      ${primary
        ? 'bg-[#0F5FFF] text-white hover:bg-blue-700'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }
      ${className}
    `}
  >
    {label}
  </button>
);

/* Countdown hook */
const useCountdown = (targetSeconds) => {
  const [secs, setSecs] = useState(targetSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}h ${m}m ${s}s`;
};

/* ══════════════════════════════════════════════════════════
   CAROUSEL 1 CARDS
══════════════════════════════════════════════════════════ */

/** C1-A: Live Election */
export const LiveElectionCard = ({ election = {} }) => {
  const {
    title = 'Best AI Platform 2026',
    category = 'Technology',
    coverColor = 'from-blue-600 to-indigo-700',
    voterCount = '14,203',
    participationRate = '68',
    jackpot = '$12,500',
    isGamified = true,
  } = election;

  return (
    <CardShell width="w-[150px]" className="h-[260px] relative border-0 shadow-none !bg-transparent group cursor-pointer">
      {/* Full Cover Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${coverColor}`} />
      
      {/* Dark overlay for text readability at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      {/* Top Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        <LiveBadge />
      </div>

      {/* Content overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end z-10 h-full">
        <div className="mt-auto space-y-2">
          <div>
            <p className="text-[9px] text-white/80 font-bold uppercase tracking-wider mb-0.5">{category}</p>
            <p className="text-[13px] text-white font-black leading-tight line-clamp-2">{title}</p>
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-white/90">
            <span className="flex items-center gap-1"><Icon name="Users" size={10} /> {voterCount}</span>
          </div>

          {isGamified && (
            <div className="flex items-center gap-1.5 text-white/90">
              <span className="text-[#FFC629] text-[10px]">🏆</span>
              <span className="text-[10px] font-bold text-amber-300">{jackpot}</span>
            </div>
          )}

          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#0F5FFF] rounded-full" style={{ width: `${participationRate}%` }} />
          </div>

          <button className="w-full py-1.5 mt-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-[11px] font-bold text-white transition-colors border border-white/10">
            Vote Now
          </button>
        </div>
      </div>
    </CardShell>
  );
};

/** C1-B: Jolt */
export const JoltCard = ({ jolt = {} }) => {
  const {
    creatorName = 'VotteryCast',
    verified = true,
    hashtags = ['#Elections2026', '#Politics'],
    views = '2.4M',
    likes = '184K',
    trending = true,
    coverColor = 'from-pink-600 to-rose-700',
  } = jolt;

  const [playing, setPlaying] = useState(false);

  return (
    <CardShell width="w-[150px]" className="h-[260px] relative border-0 shadow-none !bg-transparent group cursor-pointer" onClick={() => setPlaying(!playing)}>
      {/* Video thumbnail full cover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${coverColor}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Play overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all">
            <Icon name="Play" size={16} className="text-white ml-0.5" />
          </div>
        </div>
      )}

      {trending && <div className="absolute top-2 left-2 z-10"><TrendingBadge /></div>}

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 flex flex-col justify-end h-full pointer-events-none">
        <div className="mt-auto space-y-2">
          {/* Creator info */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[8px] font-black border border-white/20">
              {creatorName.charAt(0)}
            </div>
            <p className="text-[11px] font-bold text-white truncate flex-1 drop-shadow-md">{creatorName}</p>
            {verified && <Icon name="BadgeCheck" size={12} className="text-blue-400" />}
          </div>

          <div className="space-y-0.5">
            {hashtags.slice(0, 2).map(h => (
              <p key={h} className="text-[10px] text-white/90 font-medium truncate drop-shadow-md">{h}</p>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10px] text-white/80 font-medium">
            <span className="flex items-center gap-1"><Icon name="Eye" size={10} /> {views}</span>
            <span className="flex items-center gap-1"><Icon name="Heart" size={10} /> {likes}</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};

/** C1-C: Monthly Draw */
export const MonthlyDrawCard = ({ draw = {} }) => {
  const {
    campaignName = 'Vottery Monthly Prize Draw',
    prizePool = '$50,000',
    winnersCount = 10,
    targetSeconds = 3600 * 47 + 1800,
  } = draw;
  const countdown = useCountdown(targetSeconds);

  return (
    <CardShell width="w-[150px]" className="h-[260px] relative border-0 shadow-none !bg-transparent group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC629] to-amber-600" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Top Sponsors */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
        {['🔷','🟡','🟢'].map((s, i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-[8px] border border-white/10">{s}</div>
        ))}
      </div>

      {/* Center Icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pb-16 pointer-events-none">
        <div className="text-4xl filter drop-shadow-lg mb-2">🏆</div>
        <p className="text-[10px] font-black text-white uppercase tracking-widest text-center px-2 drop-shadow-md">Monthly Draw</p>
      </div>

      {/* Content Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end z-10 h-full">
        <div className="mt-auto space-y-2 text-center">
          <p className="text-[12px] font-bold text-white leading-tight drop-shadow-md line-clamp-2">{campaignName}</p>
          
          <div className="py-1">
            <p className="text-[18px] font-black text-[#FFC629] drop-shadow-md">{prizePool}</p>
            <p className="text-[9px] text-white/70 uppercase tracking-wider">{winnersCount} Winners</p>
          </div>

          <div className="py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
            <p className="text-[8px] text-white/70 uppercase tracking-wider">Ends in</p>
            <p className="text-[11px] font-black text-white">{countdown}</p>
          </div>

          <button className="w-full py-1.5 bg-white text-amber-700 hover:bg-gray-100 rounded-xl text-[11px] font-bold transition-colors">
            Enter 🎰
          </button>
        </div>
      </div>
    </CardShell>
  );
};

/* ══════════════════════════════════════════════════════════
   CAROUSEL 2 CARDS
══════════════════════════════════════════════════════════ */

/** C2-A: Suggested Election */
export const SuggestedElectionCard = ({ election = {} }) => {
  const {
    title = 'Most Innovative Climate Solution',
    category = 'Environment',
    matchPct = 94,
    prizePool = '$3,000',
    participants = '8,412',
    timeRemaining = '2d 14h',
    coverColor = 'from-emerald-500 to-teal-600',
  } = election;

  return (
    <CardShell>
      <div className={`h-[90px] bg-gradient-to-br ${coverColor} flex items-end p-3`}>
        <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{category}</span>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{title}</p>
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 bg-[#0F5FFF]/10 rounded-full text-[10px] font-bold text-[#0F5FFF]">
            {matchPct}% match
          </div>
          {prizePool && (
            <div className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 rounded-full text-[10px] font-bold text-amber-600">
              {prizePool}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>{participants} participants</span>
          <span>⏱ {timeRemaining}</span>
        </div>
        <div className="flex gap-2">
          <ActionBtn label="Skip" />
          <ActionBtn label="Vote" primary />
        </div>
      </div>
    </CardShell>
  );
};

/** C2-B: Mutual Connection */
export const MutualConnectionCard = ({ person = {} }) => {
  const {
    name = 'Amara Okonkwo',
    mutualCount = 14,
    colorClass = 'from-purple-500 to-violet-600',
  } = person;
  const [connected, setConnected] = useState(false);
  const [passed, setPassed] = useState(false);
  if (passed) return null;

  return (
    <CardShell width="w-[180px]">
      <div className={`h-[80px] bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xl shadow-lg">
          {name.charAt(0)}
        </div>
      </div>
      <div className="p-3 text-center space-y-2">
        <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{name}</p>
        <p className="text-[11px] text-gray-500">{mutualCount} mutual friends</p>
        {!connected ? (
          <div className="flex gap-1.5">
            <ActionBtn label="Pass" onClick={() => setPassed(true)} />
            <ActionBtn label="Connect" primary onClick={() => setConnected(true)} />
          </div>
        ) : (
          <p className="text-[11px] text-emerald-500 font-bold py-1">Request sent ✓</p>
        )}
      </div>
    </CardShell>
  );
};

/** C2-C: Community Hub */
export const CommunityHubCard = ({ hub = {} }) => {
  const {
    name = 'Global Election Watchers',
    members = '23,481',
    activeElections = 7,
    mutualMembers = 12,
    coverColor = 'from-slate-600 to-slate-800',
  } = hub;
  const [joined, setJoined] = useState(false);

  return (
    <CardShell>
      <div className={`h-[80px] bg-gradient-to-br ${coverColor} flex items-center justify-center`}>
        <Icon name="Globe" size={36} className="text-white/70" />
      </div>
      <div className="p-3 space-y-2">
        <p className="text-[13px] font-bold text-gray-900 dark:text-white line-clamp-2">{name}</p>
        <div className="space-y-0.5 text-[10px] text-gray-500">
          <p>{members} members</p>
          <p>{activeElections} active elections</p>
          <p>{mutualMembers} mutual members</p>
        </div>
        <div className="flex gap-2">
          <ActionBtn label="Skip" />
          {!joined ? (
            <ActionBtn label="Join" primary onClick={() => setJoined(true)} />
          ) : (
            <ActionBtn label="Joined ✓" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100" />
          )}
        </div>
      </div>
    </CardShell>
  );
};

/* ══════════════════════════════════════════════════════════
   CAROUSEL 3 CARDS
══════════════════════════════════════════════════════════ */

const RANK_COLORS = ['from-amber-400 to-yellow-500', 'from-slate-400 to-slate-500', 'from-amber-700 to-amber-800'];
const RANK_EMOJI = ['🥇', '🥈', '🥉'];

/** C3-A: Top Earner */
export const TopEarnerCard = ({ earner = {}, rank = 1 }) => {
  const {
    name = 'TrendSetter_99',
    earnings = '$18,240',
    growth = '+34%',
    colorClass = 'from-amber-500 to-orange-500',
  } = earner;
  const [followed, setFollowed] = useState(false);

  return (
    <CardShell width="w-[180px]">
      <div className={`h-[70px] bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
        <div className="absolute top-2 left-2 text-lg">{RANK_EMOJI[Math.min(rank - 1, 2)] || `#${rank}`}</div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-lg">
          {name.charAt(0)}
        </div>
      </div>
      <div className="p-3 text-center space-y-1.5">
        <p className="text-[12px] font-black text-gray-900 dark:text-white truncate">{name}</p>
        <p className="text-[16px] font-black text-[#0F5FFF]">{earnings}</p>
        <p className="text-[11px] font-bold text-emerald-500">{growth} this month</p>
        <ActionBtn
          label={followed ? 'Following ✓' : 'Follow'}
          primary={!followed}
          onClick={() => setFollowed(!followed)}
        />
      </div>
    </CardShell>
  );
};

/** C3-B: Recent Winner */
export const RecentWinnerCard = ({ winner = {} }) => {
  const {
    name = 'PriyaV_Wins',
    prize = '$4,200',
    electionTitle = 'Tech Leader of the Year',
    colorClass = 'from-green-500 to-emerald-600',
  } = winner;

  return (
    <CardShell width="w-[180px]">
      <div className={`h-[70px] bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
        <div className="absolute top-1 right-2 text-lg">🏆</div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-lg">
          {name.charAt(0)}
        </div>
      </div>
      <div className="p-3 text-center space-y-1">
        <p className="text-[12px] font-black text-gray-900 dark:text-white truncate">{name}</p>
        <p className="text-[20px] font-black text-[#FFC629]">{prize}</p>
        <p className="text-[10px] text-gray-500 line-clamp-2">{electionTitle}</p>
        <Link to="/elections-dashboard" className="block text-[11px] text-[#0F5FFF] hover:underline font-bold mt-1">
          See Election →
        </Link>
      </div>
    </CardShell>
  );
};

/** C3-C: Accuracy Champion */
export const AccuracyChampionCard = ({ champion = {} }) => {
  const {
    name = 'DataWizard_X',
    accuracy = '97.3%',
    streak = 42,
    specialization = 'Politics',
    colorClass = 'from-violet-500 to-purple-600',
  } = champion;

  return (
    <CardShell width="w-[180px]">
      <div className={`h-[70px] bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
        <div className="absolute top-1 right-2 text-lg">🎯</div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-lg">
          {name.charAt(0)}
        </div>
      </div>
      <div className="p-3 text-center space-y-1">
        <p className="text-[12px] font-black text-gray-900 dark:text-white truncate">{name}</p>
        <p className="text-[20px] font-black text-violet-500">{accuracy}</p>
        <p className="text-[10px] text-gray-500">🔥 {streak} day streak</p>
        <div className="px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 rounded-full text-[10px] font-bold text-violet-600 inline-block">
          {specialization}
        </div>
      </div>
    </CardShell>
  );
};

/* ══════════════════════════════════════════════════════════
   CAROUSEL 4 CARDS
══════════════════════════════════════════════════════════ */

/** C4-A: Creator Spotlight */
export const CreatorSpotlightCard = ({ creator = {} }) => {
  const {
    name = 'ElectionGuru_Pro',
    earningsRank = '#4',
    engagementPct = '8.7%',
    colorClass = 'from-blue-600 to-cyan-500',
  } = creator;
  const [followed, setFollowed] = useState(false);

  return (
    <CardShell width="w-[200px]">
      <div className={`h-[90px] bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#FFC629] text-gray-900 rounded-full text-[9px] font-black">
          ⭐ SPOTLIGHT
        </div>
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xl shadow-lg">
          {name.charAt(0)}
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-[13px] font-black text-gray-900 dark:text-white truncate">{name}</p>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span>Rank {earningsRank}</span>
          <span>{engagementPct} engagement</span>
        </div>
        <ActionBtn
          label={followed ? 'Following ✓' : 'Follow Creator'}
          primary={!followed}
          onClick={() => setFollowed(!followed)}
        />
      </div>
    </CardShell>
  );
};

/** C4-B: Creator Service */
export const CreatorServiceCard = ({ service = {} }) => {
  const {
    title = 'Custom Election Design Package',
    price = '$299',
    rating = 4.9,
    reviews = 134,
    colorClass = 'from-gray-600 to-gray-800',
  } = service;
  const [viewed, setViewed] = useState(false);

  return (
    <CardShell>
      <div className={`h-[100px] bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <Icon name="Briefcase" size={36} className="text-white/60" />
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-[12px] font-bold text-gray-900 dark:text-white line-clamp-2">{title}</p>
        <div className="flex items-center gap-1">
          {'★★★★★'.slice(0, Math.round(rating)).split('').map((s, i) => (
            <span key={i} className="text-[#FFC629] text-[11px]">★</span>
          ))}
          <span className="text-[10px] text-gray-500">({reviews})</span>
        </div>
        <p className="text-[15px] font-black text-[#0F5FFF]">{price}</p>
        <div className="flex gap-2">
          <ActionBtn label="Skip" />
          <ActionBtn label={viewed ? 'Viewing...' : 'View'} primary onClick={() => setViewed(true)} />
        </div>
      </div>
    </CardShell>
  );
};

/** C4-C: Trending Topic */
export const TrendingTopicCard = ({ topic = {} }) => {
  const {
    hashtag = '#ElectionDay2026',
    postCount = '48.2K',
    growthRate = '+320%',
    category = 'Politics',
    colorClass = 'from-rose-500 to-pink-600',
  } = topic;

  return (
    <CardShell width="w-[180px]">
      <div className={`h-[80px] bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <p className="text-white font-black text-[14px] text-center px-2 line-clamp-2">{hashtag}</p>
      </div>
      <div className="p-3 space-y-2">
        <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-400 inline-block">
          {category}
        </div>
        <div className="text-[11px] text-gray-500 space-y-0.5">
          <p>{postCount} posts</p>
          <p className="text-emerald-500 font-bold">{growthRate} this week</p>
        </div>
        <Link to="/advanced-search-discovery-intelligence-hub" className="block">
          <ActionBtn label="Explore →" primary />
        </Link>
      </div>
    </CardShell>
  );
};
