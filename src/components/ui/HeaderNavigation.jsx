import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import MobileSideMenu from './MobileSideMenu';
import NavIcon from './NavIcon';
import SlideDrawer from './SlideDrawer';
import CompactMessagingView from './CompactMessagingView';
import CompactNotificationView from './CompactNotificationView';
import UserProfileMenu from './UserProfileMenu';
import VotteryWordmark from '../branding/VotteryWordmark';
import Icon from '../AppIcon';
import {
  HOME_FEED_DASHBOARD_ROUTE,
  ELECTIONS_DASHBOARD_ROUTE,
  ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE,
  ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE as ENHANCED_HUBS_ROUTE,
  USER_PROFILE_HUB_ROUTE,
  NOTIFICATION_CENTER_HUB_ROUTE,
  FEEDS_EXPLORER_HUB_ROUTE,
  FRIENDS_MANAGEMENT_HUB_ROUTE,
  DIRECT_MESSAGING_CENTER_ROUTE,
  JOLTS_VIDEO_STUDIO_ROUTE,
} from '../../constants/navigationHubRoutes';

/* ── Tooltip wrapper ── */
const NavTooltip = ({ label, children, position = 'bottom' }) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <div
      className={`
        absolute ${position === 'bottom' ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'}
        left-1/2 -translate-x-1/2
        px-2.5 py-1 bg-gray-800 dark:bg-gray-700 text-white text-[12px] font-semibold rounded-md
        opacity-0 group-hover:opacity-100 transition-opacity duration-150
        pointer-events-none whitespace-nowrap z-[9999] shadow-lg
        before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2
        ${position === 'bottom'
          ? 'before:-top-1 before:border-l-4 before:border-r-4 before:border-b-4 before:border-transparent before:border-b-gray-800'
          : 'before:-bottom-1 before:border-l-4 before:border-r-4 before:border-t-4 before:border-transparent before:border-t-gray-800'
        }
      `}
    >
      {label}
    </div>
  </div>
);

/* ── Navigation tab button ── */
const NavTab = ({ to, onClick, label, active, badge, children }) => {
  const base = `
    group relative flex-1 flex flex-col items-center justify-center h-full
    min-w-0 cursor-pointer transition-all duration-150
  `;
  const inner = `
    relative flex items-center justify-center w-full h-full
    hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors mx-1
  `;

  const content = (
    <div className={inner}>
      {children}
      {badge > 0 && (
        <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 leading-none px-1">
          {badge > 99 ? '99+' : badge}
        </div>
      )}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0F5FFF] rounded-t-full" />
      )}
      {/* Tooltip */}
      <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-800 dark:bg-gray-700 text-white text-[12px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-[9999] shadow-lg">
        {label}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={base} aria-label={label}>
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={base} aria-label={label}>
      {content}
    </button>
  );
};

/* ── Main Header ── */
const HeaderNavigation = () => {
  const { isMobile } = useBreakpoints();
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [activeDrawer, setActiveDrawer] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileTriggerRef = useRef(null);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  useEffect(() => {
    setActiveDrawer(null);
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {/* ════════════════════════════════════
          ROW 1 — Logo · Search Bar · Action Icons
      ════════════════════════════════════ */}
      <div className="h-[56px] flex items-center justify-between px-4 max-w-[1920px] mx-auto gap-3">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to={HOME_FEED_DASHBOARD_ROUTE} className="flex items-center" aria-label="Vottery Home">
            <VotteryWordmark className="h-9 w-auto" />
          </Link>
        </div>

        {/* CENTER: Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[240px] lg:max-w-[320px]">
          <div className="relative">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Vottery"
              aria-label="Search Vottery"
              className="
                w-full h-10 pl-9 pr-4 rounded-full
                bg-gray-100 dark:bg-gray-800
                text-[14px] text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                border-none outline-none
                focus:ring-2 focus:ring-[#0F5FFF]/40
                transition-all
              "
            />
          </div>
        </form>

        {/* RIGHT: Action Buttons (Create, Menu on mobile) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Create */}
          <NavTooltip label="Create">
            <button
              onClick={() => setActiveDrawer('create')}
              aria-label="Create"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon name="PlusSquare" size={22} strokeWidth={2} />
            </button>
          </NavTooltip>

          {/* Menu (mobile only) */}
          <button
            onClick={() => setActiveDrawer('menu')}
            aria-label="Menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon name="Menu" size={22} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════
          ROW 2 — Primary Navigation Tabs
          Spec order: Home | Jolts | Elections | Hubs | Friends | Messages | Notifications | Profile
      ════════════════════════════════════ */}
      <div className="h-[48px] border-t border-gray-100 dark:border-gray-800">
        <nav
          aria-label="Primary navigation"
          className="flex items-stretch h-full max-w-[720px] mx-auto lg:max-w-[900px] px-2"
        >
          {/* 1 — Home */}
          <NavTab
            to={HOME_FEED_DASHBOARD_ROUTE}
            label="Home"
            active={isActive(HOME_FEED_DASHBOARD_ROUTE) || location.pathname === '/'}
          >
            <NavIcon name="Home" active={isActive(HOME_FEED_DASHBOARD_ROUTE) || location.pathname === '/'} size={26} />
          </NavTab>

          {/* 2 — Jolts */}
          <NavTab
            to={JOLTS_VIDEO_STUDIO_ROUTE}
            label="Jolts"
            active={isActive(JOLTS_VIDEO_STUDIO_ROUTE)}
          >
            <NavIcon name="Jolts" active={isActive(JOLTS_VIDEO_STUDIO_ROUTE)} size={26} />
          </NavTab>

          {/* 3 — Elections & Voting */}
          <NavTab
            to={ELECTIONS_DASHBOARD_ROUTE}
            label="Elections & Voting"
            active={isActive(ELECTIONS_DASHBOARD_ROUTE)}
          >
            <NavIcon name="Elections" active={isActive(ELECTIONS_DASHBOARD_ROUTE)} size={26} />
          </NavTab>

          {/* 4 — Hubs */}
          <NavTab
            to={ENHANCED_HUBS_ROUTE}
            label="Hubs"
            active={isActive(ENHANCED_HUBS_ROUTE)}
          >
            <NavIcon name="Hubs" active={isActive(ENHANCED_HUBS_ROUTE)} size={26} />
          </NavTab>

          {/* 5 — Friend Requests */}
          <NavTab
            to={FRIENDS_MANAGEMENT_HUB_ROUTE}
            label="Friend Requests"
            active={isActive(FRIENDS_MANAGEMENT_HUB_ROUTE)}
            badge={3}
          >
            <NavIcon name="Friends" active={isActive(FRIENDS_MANAGEMENT_HUB_ROUTE)} size={26} />
          </NavTab>

          {/* 6 — Messages */}
          <NavTab
            onClick={() => setActiveDrawer(activeDrawer === 'messages' ? null : 'messages')}
            label="Messenger"
            active={activeDrawer === 'messages'}
            badge={6}
          >
            <NavIcon name="Messages" active={activeDrawer === 'messages'} size={26} />
          </NavTab>

          {/* 7 — Notifications */}
          <NavTab
            onClick={() => setActiveDrawer(activeDrawer === 'notifications' ? null : 'notifications')}
            label="Notifications"
            active={activeDrawer === 'notifications'}
            badge={12}
          >
            <NavIcon name="Notifications" active={activeDrawer === 'notifications'} size={26} />
          </NavTab>

          {/* 8 — Profile */}
          <NavTab
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            label="Account"
            active={showProfileMenu || isActive(USER_PROFILE_HUB_ROUTE)}
          >
            <div
              ref={profileTriggerRef}
              className={`
                w-8 h-8 rounded-full overflow-hidden border-2 transition-all
                ${showProfileMenu || isActive(USER_PROFILE_HUB_ROUTE)
                  ? 'border-[#0F5FFF] ring-2 ring-[#0F5FFF]/20'
                  : 'border-transparent'
                }
              `}
            >
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[13px]">
                  {(userProfile?.name || userProfile?.full_name || userProfile?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </NavTab>
        </nav>
      </div>

      {/* ════ Drawers & Overlays ════ */}
      <SlideDrawer isOpen={activeDrawer === 'menu'} onClose={() => setActiveDrawer(null)} title="Vottery" direction="left">
        <MobileSideMenu onClose={() => setActiveDrawer(null)} />
      </SlideDrawer>

      <SlideDrawer isOpen={activeDrawer === 'messages'} onClose={() => setActiveDrawer(null)} title="Messenger" direction="right">
        <CompactMessagingView onClose={() => setActiveDrawer(null)} />
      </SlideDrawer>

      <SlideDrawer isOpen={activeDrawer === 'notifications'} onClose={() => setActiveDrawer(null)} title="Notifications" direction="right">
        <CompactNotificationView onClose={() => setActiveDrawer(null)} />
      </SlideDrawer>

      {/* Create Modal */}
      {activeDrawer === 'create' && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveDrawer(null)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[28px] p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5" />
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5">Create</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'FileText', label: 'Post', desc: 'Share what\'s on your mind', color: 'from-blue-500 to-blue-600' },
                { icon: 'Video', label: 'Jolt', desc: 'Short-form video', color: 'from-pink-500 to-rose-500' },
                { icon: 'Vote', label: 'Election', desc: 'Start a new election', color: 'from-[#0F5FFF] to-indigo-600' },
                { icon: 'Users', label: 'Hub', desc: 'Create a community', color: 'from-emerald-500 to-teal-500' },
                { icon: 'Trophy', label: 'Monthly Draw', desc: 'Launch a prize draw', color: 'from-[#FFC629] to-amber-500' },
                { icon: 'BarChart2', label: 'Poll', desc: 'Quick opinion poll', color: 'from-purple-500 to-violet-500' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  onClick={() => setActiveDrawer(null)}
                >
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                    <Icon name={item.icon} size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-bold text-[13px] text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Menu */}
      {showProfileMenu && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0" onClick={() => setShowProfileMenu(false)} />
          <div className="absolute right-4 top-[108px] w-[360px] max-w-[90vw] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <UserProfileMenu isOpen={true} onClose={() => setShowProfileMenu(false)} triggerRef={profileTriggerRef} />
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNavigation;