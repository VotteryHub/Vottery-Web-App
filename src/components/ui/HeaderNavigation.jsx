import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import MobileSideMenu from './MobileSideMenu';
import useFeatureStore from '../../store/useFeatureStore';
import NavIcon from './NavIcon';
import SlideDrawer from './SlideDrawer';
import CompactMessagingView from './CompactMessagingView';
import CompactNotificationView from './CompactNotificationView';
import UserProfileMenu from './UserProfileMenu';
import BackButton from './BackButton';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { 
  HOME_FEED_DASHBOARD_ROUTE, 
  JOLTS_VIDEO_STUDIO_ROUTE, 
  ELECTIONS_DASHBOARD_ROUTE, 
  ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE,
  ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE as ENHANCED_HUBS_ROUTE,
  USER_PROFILE_HUB_ROUTE,
  FRIENDS_MANAGEMENT_HUB_ROUTE,
  NOTIFICATION_CENTER_HUB_ROUTE,
  DIRECT_MESSAGING_CENTER_ROUTE
} from '../../constants/navigationHubRoutes';
import MobileBottomSheet from './MobileBottomSheet';

const HeaderNavigation = () => {
  const { isMobile, isDesktop } = useBreakpoints();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const isFeatureEnabled = useFeatureStore((state) => state.isFeatureEnabled);
  
  const [activeDrawer, setActiveDrawer] = useState(null); // 'messages', 'notifications', or 'menu'
  const [activeDropdown, setActiveDropdown] = useState(null); // 'messages', 'notifications', or 'profile'
  
  const dropdownRef = useRef(null);
  const messageDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    console.log('[HeaderNavigation] Component mounted on:', location.pathname);
  }, []);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          messageDropdownRef.current && !messageDropdownRef.current.contains(event.target) &&
          notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setActiveDrawer(null); // Close drawer on route change
  }, [location.pathname]);

  const navItems = {
    home: { label: 'Home', path: HOME_FEED_DASHBOARD_ROUTE, icon: 'Home' },
    jolts: { label: 'Jolts', path: '/jolts', icon: 'Jolts', feature: 'jolts_enabled' },
    elections: { label: 'Elections', path: ELECTIONS_DASHBOARD_ROUTE, icon: 'Elections', feature: 'elections_enabled', isMenu: true },
    hubs: { label: 'Hubs', path: ENHANCED_HUBS_ROUTE, icon: 'Hubs', feature: 'hubs_enabled', isMenu: true },
    profile: { label: 'Profile', path: USER_PROFILE_HUB_ROUTE, icon: 'Profile' },
  };

  const actionItems = {
    friends: { label: 'Friends', path: FRIENDS_MANAGEMENT_HUB_ROUTE, icon: 'Friends' },
    messages: { label: 'Messages', path: DIRECT_MESSAGING_CENTER_ROUTE, icon: 'Messages', drawer: 'messages' },
    notifications: { label: 'Notifications', path: NOTIFICATION_CENTER_HUB_ROUTE, icon: 'Notifications', drawer: 'notifications' },
    menu: { label: 'Menu', icon: 'Menu', drawer: 'menu' },
    search: { label: 'Search', path: ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE, icon: 'Search' },
  };

  const NavButton = ({ item, isAction = false, onClick, className = "" }) => {
    if (item.feature && !isFeatureEnabled(item.feature)) return null;
    
    const active = isActive(item.path);
    const content = (
      <div className={`relative group p-2 rounded-xl transition-all duration-300 hover:bg-vottery-blue/10 ${className}`}>
        <NavIcon name={item.icon} active={active} size={isMobile ? 24 : 28} className="transition-transform group-hover:scale-110" />
        {active && !isMobile && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-vottery-yellow rounded-full shadow-[0_0_10px_#FFC629] animate-pulse" />
        )}
        {!isMobile && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none z-50">
            {item.label}
          </div>
        )}
      </div>
    );

    return item.path && !isAction ? (
      <Link to={item.path} aria-label={item.label}>{content}</Link>
    ) : (
      <button onClick={onClick} aria-label={item.label} className="min-w-[44px] min-h-[44px] flex items-center justify-center">{content}</button>
    );
  };

  if (isMobile) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-2 z-[100] shadow-sm">
          <div className="flex items-center gap-1">
            <NavButton item={actionItems.menu} isAction onClick={() => setActiveDrawer('menu')} />
            <BackButton showLabel={false} className="ml-1" />
            <Link to={HOME_FEED_DASHBOARD_ROUTE} className="flex items-center ml-1">
              <img src="/assets/images/upscalemedia-transformed__2_-1770682988354.png" alt="Vottery" className="h-8 w-auto" />
            </Link>
          </div>
          
          <div className="flex items-center gap-0.5">
            <NavButton item={actionItems.search} isAction onClick={() => navigate(actionItems.search.path)} />
            <NavButton item={actionItems.messages} isAction onClick={() => setActiveDrawer('messages')} />
            <NavButton item={actionItems.notifications} isAction onClick={() => setActiveDrawer('notifications')} />
          </div>
        </header>

        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 z-[100] pb-safe">
          {Object.entries(navItems).map(([key, item]) => {
            const active = isActive(item.path);
            const content = (
              <div className="flex flex-col items-center gap-1 min-w-[64px] active:scale-90 transition-transform">
                <NavIcon name={item.icon} active={active} size={24} />
                <span className={`text-[10px] font-bold ${active ? 'text-vottery-blue' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            );

            return item.isMenu ? (
              <button key={key} onClick={() => setActiveDrawer(key)} className="flex flex-col items-center gap-1 min-w-[64px]">
                {content}
              </button>
            ) : (
              <Link key={key} to={item.path} className="flex flex-col items-center gap-1 min-w-[64px]">
                {content}
              </Link>
            );
          })}
        </nav>

        <SlideDrawer 
          isOpen={activeDrawer === 'menu'} 
          onClose={() => setActiveDrawer(null)} 
          title="Navigation"
          direction="left"
        >
          <MobileSideMenu onClose={() => setActiveDrawer(null)} />
        </SlideDrawer>

        <MobileBottomSheet 
          isOpen={activeDrawer === 'messages'} 
          onClose={() => setActiveDrawer(null)} 
          title="Messages"
        >
          <CompactMessagingView />
        </MobileBottomSheet>

        <MobileBottomSheet 
          isOpen={activeDrawer === 'notifications'} 
          onClose={() => setActiveDrawer(null)} 
          title="Notifications"
        >
          <CompactNotificationView />
        </MobileBottomSheet>

        <MobileBottomSheet 
          isOpen={activeDrawer === 'elections'} 
          onClose={() => setActiveDrawer(null)} 
          title="Elections Menu"
        >
          <div className="grid grid-cols-2 gap-4 py-4">
            <button onClick={() => { navigate(ELECTIONS_DASHBOARD_ROUTE); setActiveDrawer(null); }} className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl hover:bg-vottery-blue/10 transition-colors">
              <NavIcon name="Elections" active size={32} />
              <span className="font-bold text-sm">Dashboard</span>
            </button>
            <button onClick={() => { navigate('/election-creation-studio'); setActiveDrawer(null); }} className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl hover:bg-vottery-blue/10 transition-colors">
              <NavIcon name="Plus" active size={32} />
              <span className="font-bold text-sm">Create New</span>
            </button>
            <button onClick={() => { navigate('/vote-in-elections-hub'); setActiveDrawer(null); }} className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl hover:bg-vottery-blue/10 transition-colors">
              <NavIcon name="Home" active size={32} />
              <span className="font-bold text-sm">Live Hub</span>
            </button>
            <button onClick={() => { navigate('/enhanced-election-results-center'); setActiveDrawer(null); }} className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl hover:bg-vottery-blue/10 transition-colors">
              <NavIcon name="Elections" active size={32} />
              <span className="font-bold text-sm">Results</span>
            </button>
          </div>
        </MobileBottomSheet>

        <MobileBottomSheet 
          isOpen={activeDrawer === 'hubs'} 
          onClose={() => setActiveDrawer(null)} 
          title="Hubs & Communities"
        >
          <div className="flex flex-col gap-2 py-4">
            <button onClick={() => { navigate(ENHANCED_HUBS_ROUTE); setActiveDrawer(null); }} className="flex items-center gap-4 p-4 hover:bg-vottery-blue/10 rounded-2xl transition-colors">
              <NavIcon name="Hubs" active size={24} />
              <div className="text-left">
                <div className="font-bold">Discover Hubs</div>
                <div className="text-xs text-gray-500">Find communities that matter to you</div>
              </div>
            </button>
            <button onClick={() => { navigate('/community-elections-hub'); setActiveDrawer(null); }} className="flex items-center gap-4 p-4 hover:bg-vottery-blue/10 rounded-2xl transition-colors">
              <NavIcon name="Friends" active size={24} />
              <div className="text-left">
                <div className="font-bold">My Hubs</div>
                <div className="text-xs text-gray-500">Manage your active communities</div>
              </div>
            </button>
          </div>
        </MobileBottomSheet>
      </>
    );
  }

  return (
    <header className="premium-glass fixed top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-[100] shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-b border-white/10 backdrop-blur-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 pointer-events-none" />
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-6 flex-1">
        <BackButton className="mr-2" />
        <Link to={HOME_FEED_DASHBOARD_ROUTE} className="flex-shrink-0">
          <img src="/assets/images/upscalemedia-transformed__2_-1770682988354.png" alt="Vottery Logo" className="h-10 w-auto transition-transform hover:scale-105" />
        </Link>
        <div className="relative max-w-sm w-full hidden xl:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <NavIcon name="Search" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search Vottery..." 
            className="block w-full pl-12 pr-4 py-2.5 bg-slate-100/60 dark:bg-slate-800/60 border border-transparent focus:border-primary/40 rounded-full text-sm placeholder-slate-600 dark:placeholder-slate-400 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
          />
        </div>
      </div>

      {/* Center: Main Nav (5 Premium Icons) */}
      <nav className="flex items-center justify-center gap-4 flex-1">
        {Object.values(navItems).map((item) => (
          <NavButton key={item.path} item={item} />
        ))}
      </nav>

      {/* Right: Actions Split */}
      <div className="flex items-center justify-end gap-3 flex-1">
        <div className="flex items-center gap-1 pr-4 border-r border-gray-200 dark:border-gray-700">
          <NavButton item={actionItems.friends} />
          
          {/* Messages Dropdown */}
          <div className="relative" ref={messageDropdownRef}>
            <NavButton 
              item={actionItems.messages} 
              isAction 
              onClick={() => setActiveDropdown(activeDropdown === 'messages' ? null : 'messages')} 
            />
            {activeDropdown === 'messages' && (
              <div className="absolute top-full right-0 mt-3 w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="font-bold text-lg">Messages</h3>
                  <button onClick={() => navigate(DIRECT_MESSAGING_CENTER_ROUTE)} className="text-xs text-primary hover:underline font-bold">View Center</button>
                </div>
                <div className="h-[calc(100%-60px)]">
                  <CompactMessagingView onClose={() => setActiveDropdown(null)} />
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationDropdownRef}>
            <NavButton 
              item={actionItems.notifications} 
              isAction 
              onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')} 
            />
            {activeDropdown === 'notifications' && (
              <div className="absolute top-full right-0 mt-3 w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <button onClick={() => navigate(NOTIFICATION_CENTER_HUB_ROUTE)} className="text-xs text-primary hover:underline font-bold">View All</button>
                </div>
                <div className="h-[calc(100%-60px)]">
                  <CompactNotificationView onClose={() => setActiveDropdown(null)} />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick User Access */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button 
            onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
            className="group flex items-center gap-2 p-1 pl-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-vottery-blue/10 transition-all"
          >
            <span className="text-xs font-black hidden xl:block text-slate-700 dark:text-slate-200 group-hover:text-vottery-blue uppercase tracking-tight">
              {userProfile?.name?.split(' ')?.[0] || userProfile?.full_name?.split(' ')?.[0] || userProfile?.username || 'User'}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vottery-blue to-vottery-yellow p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center font-bold text-vottery-blue overflow-hidden">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (userProfile?.name || userProfile?.full_name || userProfile?.username || user?.email || 'V').charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </button>
          
          <UserProfileMenu 
            isOpen={activeDropdown === 'profile'} 
            onClose={() => setActiveDropdown(null)} 
            triggerRef={dropdownRef} 
          />
        </div>
      </div>

      <SlideDrawer isOpen={!!activeDrawer} onClose={() => setActiveDrawer(null)} title={activeDrawer?.toUpperCase()}>
        {activeDrawer === 'messages' ? <CompactMessagingView /> : <CompactNotificationView />}
      </SlideDrawer>
    </header>
  );
};

export default HeaderNavigation;