import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

/* ─────────────────────────────────────────────
   Mock data — UI only, no business logic
───────────────────────────────────────────── */
const MOCK_FRIENDS = [
  { id: 1, name: 'Alex Johnson', mutuals: 12, initial: 'A', color: 'from-blue-500 to-indigo-600' },
  { id: 2, name: 'Maria Santos', mutuals: 7, initial: 'M', color: 'from-pink-500 to-rose-500' },
  { id: 3, name: 'David Kim', mutuals: 23, initial: 'D', color: 'from-emerald-500 to-teal-600' },
  { id: 4, name: 'Priya Patel', mutuals: 5, initial: 'P', color: 'from-amber-500 to-orange-500' },
  { id: 5, name: 'James Wilson', mutuals: 15, initial: 'J', color: 'from-purple-500 to-violet-600' },
];

const MOCK_TRENDING_ELECTIONS = [
  { id: 1, title: 'Best AI Tool 2026', votes: '14.2K', category: 'Technology', live: true },
  { id: 2, title: 'Premier League Winner', votes: '98.1K', category: 'Sports', live: true },
  { id: 3, title: 'Most Innovative Startup', votes: '6.7K', category: 'Business', live: false },
  { id: 4, title: 'Climate Action Leader', votes: '21.3K', category: 'Environment', live: false },
];

const MOCK_BIRTHDAYS = [
  { name: 'Sophia Lee', today: true },
  { name: 'Marcus Brown', today: false },
];

const FOOTER_LINKS = [
  'Privacy', 'Terms', 'Advertising', 'Ad Choices', 'Cookies',
  'More', 'Vottery © 2026',
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const SectionHeader = ({ title, actionLabel, onAction }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-black text-[15px] text-gray-900 dark:text-white">{title}</h3>
    {actionLabel && (
      <button
        onClick={onAction}
        className="text-[13px] font-bold text-[#0F5FFF] hover:underline"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const FriendSuggestionCard = ({ friend }) => {
  const [added, setAdded] = useState(false);
  const [removed, setRemoved] = useState(false);
  if (removed) return null;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${friend.color} flex items-center justify-center text-white font-black text-[15px] flex-shrink-0`}>
        {friend.initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[13px] text-gray-900 dark:text-white truncate">{friend.name}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{friend.mutuals} mutual friends</p>
        {!added ? (
          <div className="flex gap-2 mt-1.5">
            <button
              onClick={() => setAdded(true)}
              className="flex-1 py-1 text-[12px] font-bold bg-[#0F5FFF]/10 hover:bg-[#0F5FFF]/20 text-[#0F5FFF] rounded-lg transition-colors"
            >
              Add Friend
            </button>
            <button
              onClick={() => setRemoved(true)}
              className="flex-1 py-1 text-[12px] font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-emerald-500 font-bold mt-1">Friend request sent ✓</p>
        )}
      </div>
    </div>
  );
};

const TrendingElectionCard = ({ election }) => (
  <Link
    to="/elections-dashboard"
    className="flex items-start gap-3 py-2.5 group"
  >
    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${election.live ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-bold text-gray-900 dark:text-white group-hover:text-[#0F5FFF] transition-colors truncate">{election.title}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[11px] text-gray-500">{election.category}</span>
        <span className="text-[11px] text-gray-400">·</span>
        <span className="text-[11px] text-gray-500">{election.votes} votes</span>
        {election.live && <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">LIVE</span>}
      </div>
    </div>
  </Link>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const RightColumnSidebar = () => {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[360px] flex-shrink-0">

      {/* ── Sponsored Ad Block ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <SectionHeader title="Sponsored" />
        <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#0F5FFF]/10 to-[#FFC629]/10 border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow">
          <div className="h-[140px] bg-gradient-to-br from-[#0F5FFF] to-indigo-700 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <div className="text-3xl mb-2">🗳️</div>
              <p className="font-black text-[14px]">Create Your Election</p>
              <p className="text-[11px] opacity-80 mt-1">Launch in under 5 minutes</p>
            </div>
          </div>
          <div className="p-3">
            <p className="font-bold text-[13px] text-gray-900 dark:text-white">Vottery Election Creator</p>
            <p className="text-[11px] text-gray-500 mt-0.5">vottery.com · Sponsored</p>
            <button className="mt-2 w-full py-1.5 text-[12px] font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors">
              Create Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Birthdays ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <SectionHeader title="Birthdays" />
        {MOCK_BIRTHDAYS.map((b, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <span className="text-xl">🎂</span>
            <p className="text-[13px] text-gray-700 dark:text-gray-300">
              {b.today ? (
                <><span className="font-bold text-gray-900 dark:text-white">{b.name}</span>'s birthday is <span className="font-bold text-[#0F5FFF]">today</span>. Send them a wish!</>
              ) : (
                <><span className="font-bold text-gray-900 dark:text-white">{b.name}</span>'s birthday is coming up.</>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* ── Trending Elections ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <SectionHeader title="Trending Elections" actionLabel="See all" onAction={() => {}} />
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {MOCK_TRENDING_ELECTIONS.map(e => (
            <TrendingElectionCard key={e.id} election={e} />
          ))}
        </div>
      </div>

      {/* ── Friend Suggestions ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <SectionHeader title="People You May Know" actionLabel="See all" onAction={() => {}} />
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {MOCK_FRIENDS.map(f => (
            <FriendSuggestionCard key={f.id} friend={f} />
          ))}
        </div>
      </div>

      {/* ── Second Sponsored Ad ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <SectionHeader title="Sponsored" />
        <div className="rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
          <div className="h-[120px] bg-gradient-to-br from-[#FFC629] to-amber-500 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-3xl mb-1">🏆</div>
              <p className="font-black text-[14px] text-gray-900">Win Big in Vottery</p>
            </div>
          </div>
          <div className="p-3">
            <p className="font-bold text-[13px] text-gray-900 dark:text-white">Monthly Draw — $50,000 Prize Pool</p>
            <p className="text-[11px] text-gray-500 mt-0.5">vottery.com · Sponsored</p>
            <button className="mt-2 w-full py-1.5 text-[12px] font-bold bg-[#FFC629]/20 hover:bg-[#FFC629]/30 text-amber-700 dark:text-amber-400 rounded-lg transition-colors">
              Enter Draw
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer Links ── */}
      <div className="px-2 pb-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {FOOTER_LINKS.map((link, i) => (
            <span key={i} className="text-[11px] text-gray-400 dark:text-gray-600 hover:underline cursor-pointer">
              {link}
            </span>
          ))}
        </div>
      </div>

    </aside>
  );
};

export default RightColumnSidebar;
