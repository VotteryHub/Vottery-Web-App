import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon, { FileText, Clock, Zap, Radio } from '../AppIcon';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import UserProfileMenu from './UserProfileMenu';
import { CommandPalette } from '../CommandPalette';
import { gamificationService } from '../../services/gamificationService';
import { messagingService } from '../../services/messagingService';
import { hasAnyRole } from '../../constants/roles';
import UpgradeToRoleModal from '../UpgradeToRoleModal';
import { usePlatformFeatureToggles } from '../../hooks/usePlatformFeatureToggles';
import { filterNavItemsByFeature } from '../../utils/filterNavByFeatureToggle';

const HeaderNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, userProfile } = useAuth();
  const { isFeatureEnabled } = usePlatformFeatureToggles();
  const userRole = userProfile?.role || 'voter';
  const canCreate = hasAnyRole(userRole, ['creator', 'admin']);
  const canAdvertise = hasAnyRole(userRole, ['advertiser', 'admin']);
  const [upgradeModal, setUpgradeModal] = useState({ open: false, role: null });
  const [isElectionsOpen, setIsElectionsOpen] = useState(false);
  const [isPostsOpen, setIsPostsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showPostsDropdown, setShowPostsDropdown] = useState(false);
  const [vpBalance, setVpBalance] = useState(0);
  const electionsRef = useRef(null);
  const postsRef = useRef(null);
  const messagesRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);
  const adminDropdownRef = useRef(null);

  const isActive = (path) => location?.pathname === path;

  const electionsDropdownItemsRaw = [
    {
      label: canCreate ? 'Create Elections' : 'Upgrade to Create Elections',
      path: '/election-creation-studio',
      icon: 'Plus',
      requiresCreator: !canCreate,
    },
    { label: 'Vote in Elections', path: '/elections-dashboard', icon: 'Vote' },
    { label: 'Verify Elections', path: '/vote-verification-portal', icon: 'ShieldCheck' },
    { label: 'Audit Elections', path: '/blockchain-audit-portal', icon: 'FileSearch' },
    { label: 'Gamified Challenges', path: '/gamification-progression-achievement-hub', icon: 'Target' },
  ];

  const postsDropdownItems = [
    { label: 'Post', path: '/home-feed-dashboard', icon: 'FileText' },
    { label: 'Moment', path: '/home-feed-dashboard', icon: 'Image' },
    { label: 'Jolts', path: '/home-feed-dashboard', icon: 'Video' },
    { label: 'Live', path: '/live-streaming-real-time-broadcast-center', icon: 'Radio' },
  ];

  const quickLinks = [
    { name: 'Elections Dashboard', path: '/elections-dashboard', icon: 'Vote' },
    { name: 'Vote in Elections', path: '/vote-in-elections-hub', icon: 'CheckSquare' },
    { name: 'Create Election', path: '/election-creation-studio', icon: 'Plus' },
    { name: 'My Profile', path: '/user-profile-hub', icon: 'User' },
    { name: 'Digital Wallet', path: '/digital-wallet-hub', icon: 'Wallet' },
    { name: 'Messages', path: '/direct-messaging-center', icon: 'MessageSquare' },
    { name: 'Unified Business Intelligence Hub', path: '/unified-business-intelligence-hub', icon: 'LayoutDashboard' },
    { name: 'Perplexity Strategic Planning', path: '/perplexity-strategic-planning-center', icon: 'Target' },
    { name: 'Security Compliance Automation', path: '/security-compliance-automation-center', icon: 'ShieldCheck' },
    { name: 'Security Monitoring', path: '/security-monitoring-dashboard', icon: 'Shield' },
    { name: 'GA Security Events', path: '/google-analytics-security-events-integration-hub', icon: 'BarChart3' },
    { name: 'ML Threat Detection', path: '/advanced-ml-threat-detection-center', icon: 'Brain' },
    { name: 'Security Testing Framework', path: '/automated-security-testing-framework', icon: 'Shield' },
    { name: 'Performance Optimization Engine', path: '/performance-optimization-engine-dashboard', icon: 'Activity' },
    { name: 'Anthropic Security Reasoning', path: '/anthropic-security-reasoning-integration-hub', icon: 'Brain' },
    { name: 'Dual Advertising Analytics', path: '/dual-advertising-system-analytics-dashboard', icon: 'BarChart3' },
    { name: 'AI Orchestration', path: '/unified-ai-decision-orchestration-command-center', icon: 'GitCompare' },
    { name: 'Webhook Hub', path: '/advanced-webhook-orchestration-hub', icon: 'Webhook' },
    { name: 'WebSocket Monitor', path: '/real-time-web-socket-monitoring-command-center', icon: 'Wifi' },
    { name: 'Content Analysis', path: '/anthropic-advanced-content-analysis-center', icon: 'Brain' },
    { name: 'Auto-Improving Fraud Detection', path: '/auto-improving-fraud-detection-intelligence-center', icon: 'Target' },
    { name: '60-90 Day Threat Forecasting', path: '/advanced-perplexity-60-90-day-threat-forecasting-center', icon: 'Calendar' },
    { name: 'Dynamic Revenue Sharing', path: '/dynamic-revenue-sharing-configuration-center', icon: 'DollarSign' },
    { name: 'Revenue Split Analytics', path: '/revenue-split-analytics-impact-dashboard', icon: 'TrendingUp' },
    { name: 'Revenue Testing Sandbox', path: '/revenue-split-testing-sandbox-environment', icon: 'Flask' },
    { name: 'AI Revenue Forecasting', path: '/ai-powered-revenue-forecasting-intelligence-center', icon: 'Brain' },
    { name: 'Enhanced Revenue Config', path: '/enhanced-dynamic-revenue-sharing-configuration-center', icon: 'DollarSign', badge: 'AI' },
    { name: 'Revenue Fraud Detection', path: '/revenue-fraud-detection-anomaly-prevention-center', icon: 'Shield' },
    { name: 'Predictive Anomaly Alerting', path: '/predictive-anomaly-alerting-deviation-monitoring-hub', icon: 'TrendingUp' },
    { name: '3D Feed Performance Analytics', path: '/3d-feed-performance-analytics-dashboard', icon: 'Activity', badge: 'NEW' },
    { name: 'Claude AI Content Curation', path: '/claude-ai-content-curation-intelligence-center', icon: 'Brain', badge: 'AI' },
  ];

  const electionsDropdownItems = useMemo(
    () => filterNavItemsByFeature(electionsDropdownItemsRaw, isFeatureEnabled),
    [isFeatureEnabled]
  );
  const quickLinksFiltered = useMemo(
    () => filterNavItemsByFeature(quickLinks, isFeatureEnabled),
    [isFeatureEnabled]
  );
  const carouselMenuItemsRaw = [
    { name: 'Premium 2D Carousel Library', path: '/premium-2d-carousel-component-library-hub', icon: 'Layers' },
    { name: 'Carousel Performance Analytics', path: '/carousel-performance-analytics-hub', icon: 'BarChart3' },
    { name: 'Carousel A/B Testing', path: '/carousel-ab-testing-dashboard', icon: 'GitBranch' },
    { name: 'Carousel ROI Analytics', path: '/advanced-carousel-roi-analytics-dashboard', icon: 'DollarSign' },
    { name: 'Carousel Feed Orchestration', path: '/carousel-feed-orchestration-engine', icon: 'Shuffle' },
    { name: 'Creator Carousel Optimization', path: '/creator-carousel-optimization-studio', icon: 'Target' },
    { name: 'OpenAI Carousel Intelligence', path: '/open-ai-carousel-content-intelligence-center', icon: 'Brain' },
    { name: 'Carousel Fraud Detection', path: '/advanced-carousel-fraud-detection-prevention-center', icon: 'Shield' },
    { name: 'Real-Time Carousel Monitoring', path: '/real-time-carousel-monitoring-hub', icon: 'Activity' },
    { name: 'Creator Revenue Forecasting', path: '/creator-revenue-forecasting-dashboard', icon: 'TrendingUp', badge: 'NEW' },
    { name: 'Perplexity Carousel Intelligence', path: '/perplexity-carousel-intelligence-dashboard', icon: 'Globe', badge: 'NEW' },
    { name: 'Carousel Health & Scaling', path: '/carousel-health-scaling-dashboard', icon: 'Server', badge: 'NEW' }
  ];
  const carouselMenuItems = useMemo(
    () => filterNavItemsByFeature(carouselMenuItemsRaw, isFeatureEnabled),
    [isFeatureEnabled]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (electionsRef?.current && !electionsRef?.current?.contains(event?.target)) {
        setIsElectionsOpen(false);
      }
      if (postsRef?.current && !postsRef?.current?.contains(event?.target)) {
        setIsPostsOpen(false);
      }
      if (messagesRef?.current && !messagesRef?.current?.contains(event?.target)) {
        setIsMessagesOpen(false);
      }
      if (notificationsRef?.current && !notificationsRef?.current?.contains(event?.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.id) {
      gamificationService?.getVPBalance(user?.id)?.then(({ balance }) => {
        setVpBalance(balance || 0);
      })?.catch(() => {});
    }
  }, [user?.id]);

  const fetchUnreadMessageCount = () => {
    messagingService?.getUnreadCount?.()?.then(({ data }) => {
      if (typeof data === 'number') setUnreadMessagesCount(data);
    })?.catch(() => {});
  };

  useEffect(() => {
    fetchUnreadMessageCount();
    const interval = setInterval(fetchUnreadMessageCount, 60000);
    const onFocus = () => fetchUnreadMessageCount();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const IconButton = ({ icon, label, active, onClick, badge = 0, dropdownOpen = false }) => (
    <div className="relative group">
      <button
        onClick={onClick}
        aria-label={label}
        aria-expanded={dropdownOpen || undefined}
        aria-haspopup={dropdownOpen !== false ? 'true' : undefined}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out relative transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFC629] focus:ring-offset-2 ${
          active
            ? 'bg-[#0000FF]/20 ring-2 ring-[#FFC629] text-[#0000FF] shadow-sm'
            : 'hover:ring-2 hover:ring-[#FFC629] hover:bg-[#0000FF]/10 hover:text-[#0000FF] text-gray-600 dark:text-gray-400'
        }`}
      >
        <Icon name={icon} size={28} strokeWidth={2.5} className={active ? 'text-[#0000FF]' : 'group-hover:text-[#0000FF]'} />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-50 shadow-lg">
        {label}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95" role="banner">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#0000FF] focus:text-white focus:rounded-lg focus:shadow-lg">
        Skip to main content
      </a>
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Section: Logo + Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-[600px]">
          <Link to="/home-feed-dashboard" className="flex items-center gap-2 group flex-shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer">
            <img
              src="/assets/images/upscalemedia-transformed__2_-1770682988354.png"
              alt="Vottery Logo - Click to return to home page"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[280px]">
            <div className="relative w-full">
              <Icon
                name="Search"
                size={22}
                strokeWidth={2.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onFocus={() => setCommandPaletteOpen(true)}
                placeholder="Search Vottery (Cmd+K)"
                className="w-full h-10 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-750"
              />
            </div>
          </form>
        </div>

        {/* Center Section: Main Navigation Icons (Desktop) */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 max-w-[600px]">
          <IconButton
            icon="Home"
            label="Home"
            active={isActive('/home-feed-dashboard')}
            onClick={() => navigate('/home-feed-dashboard')}
          />

          {/* Posts/Feeds Dropdown */}
          <div ref={postsRef} className="relative">
            <IconButton
              icon="Plus"
              label="Create"
              active={isPostsOpen}
              onClick={() => setIsPostsOpen(!isPostsOpen)}
              dropdownOpen={isPostsOpen}
            />
            {isPostsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                {postsDropdownItems?.map((item, index) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-gray-100 ${
                      index !== 0 ? 'border-t border-gray-100 dark:border-gray-750' : ''
                    }`}
                    onClick={() => setIsPostsOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFC629]/20 flex items-center justify-center">
                      <Icon name={item?.icon} size={18} className="text-[#FFC629]" />
                    </div>
                    <span className="text-sm font-medium">{item?.label}</span>
                  </Link>
                ))}
                {showPostsDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
                    <Link
                      to="/home-feed-dashboard"
                      onClick={() => setShowPostsDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-all"
                    >
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Post</span>
                    </Link>
                    <Link
                      to="/moments-creation-studio"
                      onClick={() => setShowPostsDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-all"
                    >
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Moment</span>
                    </Link>
                    <Link
                      to="/jolts-video-studio"
                      onClick={() => setShowPostsDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-all"
                    >
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Jolts</span>
                    </Link>
                    <Link
                      to="/live-streaming-real-time-broadcast-center"
                      onClick={() => setShowPostsDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-all rounded-b-xl"
                    >
                      <Radio className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Live</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Jolts Icon - Desktop */}
          <div className="relative group">
            <button
              onClick={() => navigate('/home-feed-dashboard')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out relative transform hover:scale-105 ${
                isActive('/jolts')
                  ? 'bg-[#FFC629]/20 shadow-sm' :'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <img
                src="/assets/images/43c21fdd-727d-4cdf-b49c-adfca430ac0c-Photoroom-1770143328916.png"
                alt="Jolts"
                className="w-7 h-7 object-contain"
                style={{ filter: isActive('/jolts') ? 'brightness(0) saturate(100%) invert(77%) sepia(85%) saturate(433%) hue-rotate(359deg) brightness(103%) contrast(101%)' : 'brightness(0) saturate(100%)' }}
              />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-50 shadow-lg">
              Jolts
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
            </div>
          </div>

          <div ref={electionsRef} className="relative">
            <IconButton
              icon="Vote"
              label="Elections & Voting"
              active={location?.pathname?.includes('election') || location?.pathname?.includes('voting') || location?.pathname?.includes('verification') || location?.pathname?.includes('audit')}
              onClick={() => setIsElectionsOpen(!isElectionsOpen)}
              dropdownOpen={isElectionsOpen}
            />
            {isElectionsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                {electionsDropdownItems?.map((item, index) =>
                  item?.requiresCreator ? (
                    <button
                      key={item?.path}
                      type="button"
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-gray-100 text-left ${
                        index !== 0 ? 'border-t border-gray-100 dark:border-gray-750' : ''
                      }`}
                      onClick={() => {
                        setIsElectionsOpen(false);
                        setUpgradeModal({ open: true, role: 'creator' });
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FFC629]/20 flex items-center justify-center">
                        <Icon name={item?.icon} size={18} className="text-[#FFC629]" />
                      </div>
                      <span className="text-sm font-medium">{item?.label}</span>
                      <span className="text-xs text-primary ml-1">Upgrade</span>
                    </button>
                  ) : (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-gray-100 ${
                        index !== 0 ? 'border-t border-gray-100 dark:border-gray-750' : ''
                      }`}
                      onClick={() => setIsElectionsOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FFC629]/20 flex items-center justify-center">
                        <Icon name={item?.icon} size={18} className="text-[#FFC629]" />
                      </div>
                      <span className="text-sm font-medium">{item?.label}</span>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          <IconButton
            icon="Users"
            label="Groups"
            active={isActive('/enhanced-groups-discovery-management-hub')}
            onClick={() => navigate('/enhanced-groups-discovery-management-hub')}
          />

          <IconButton
            icon="UserPlus"
            label="Friend Requests"
            active={isActive('/friends-management-hub')}
            onClick={() => navigate('/friends-management-hub')}
            badge={3}
          />
        </nav>

        {/* Right Section: Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end max-w-[300px]" role="toolbar" aria-label="Quick actions">
          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <IconButton
              icon="Search"
              label="Search"
              active={false}
              onClick={() => {}}
            />
          </div>

          <div ref={messagesRef} className="relative hidden sm:block">
            <IconButton
              icon="MessageCircle"
              label="Messages"
              active={isActive('/direct-messaging-center')}
              onClick={() => {
                setIsMessagesOpen(!isMessagesOpen);
                navigate('/direct-messaging-center');
              }}
              badge={unreadMessagesCount}
            />
            {isMessagesOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Messages</h3>
                  <span 
                    onClick={() => navigate('/direct-messaging-center')}
                    className="text-xs text-primary font-medium cursor-pointer hover:underline"
                  >
                    See all
                  </span>
                </div>
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon name="MessageCircle" size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Click "See all" to view your messages</p>
                </div>
              </div>
            )}
          </div>

          <div ref={notificationsRef} className="relative hidden sm:block">
            <IconButton
              icon="Bell"
              label="Notifications"
              active={isActive('/notification-center-hub')}
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                navigate('/notification-center-hub');
              }}
              badge={7}
            />
            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Notifications</h3>
                  <span
                    onClick={() => { navigate('/notification-center-hub'); setIsNotificationsOpen(false); }}
                    className="text-xs text-primary font-medium cursor-pointer hover:underline"
                  >
                    See all
                  </span>
                </div>
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon name="Bell" size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No new notifications</p>
                  <button
                    onClick={() => { navigate('/notification-center-hub'); setIsNotificationsOpen(false); }}
                    className="mt-3 text-primary font-medium hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VP Balance Counter */}
          {user && (
            <Link
              to="/vottery-points-vp-universal-currency-center"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC629]/10 hover:bg-[#FFC629]/20 border border-[#FFC629]/30 rounded-full transition-all duration-200 cursor-pointer group"
              title="Vottery Points Balance"
            >
              <Icon name="Zap" size={14} className="text-[#FFC629]" />
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{vpBalance?.toLocaleString()} VP</span>
            </Link>
          )}

          <div ref={profileRef} className="relative">
            <button
              ref={profileButtonRef}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-semibold text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </button>
            <UserProfileMenu
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              triggerRef={profileButtonRef}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-300"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slideDown">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/jolts"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/jolts')
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* Jolts Icon - Mobile */}
              <button
                onClick={() => navigate('/home-feed-dashboard')}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src="/assets/images/43c21fdd-727d-4cdf-b49c-adfca430ac0c-Photoroom-1770143328916.png"
                  alt="Jolts"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Jolts
                </span>
              </button>
            </Link>

            <div className="pt-2 pb-1">
              <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Posts & Content
              </p>
              {postsDropdownItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 pb-1">
              <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Elections & Voting
              </p>
              {electionsDropdownItems?.map((item) =>
                item?.requiresCreator ? (
                  <button
                    key={item?.path}
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 text-left"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setUpgradeModal({ open: true, role: 'creator' });
                    }}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                    <span className="text-xs text-primary ml-1">Upgrade</span>
                  </button>
                ) : (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                  </Link>
                )
              )}
            </div>

            <Link
              to="/enhanced-groups-discovery-management-hub"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/enhanced-groups-discovery-management-hub')
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="Users" size={20} />
              <span className="font-medium">Groups</span>
            </Link>

            <Link
              to="/friends-management-hub"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/friends-management-hub')
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="UserPlus" size={20} />
              <span className="font-medium">Friend Requests</span>
              <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </Link>

            <Link
              to="/direct-messaging-center"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 sm:hidden ${
                isActive('/direct-messaging-center')
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="MessageCircle" size={20} />
              <span className="font-medium">Messages</span>
              <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">5</span>
            </Link>

            <Link
              to="/notification-center-hub"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 sm:hidden ${
                isActive('/notification-center-hub')
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="Bell" size={20} />
              <span className="font-medium">Notifications</span>
              <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">7</span>
            </Link>
          </div>
        </div>
      )}

      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <UpgradeToRoleModal
        isOpen={upgradeModal.open}
        onClose={() => setUpgradeModal({ open: false, role: null })}
        targetRole={upgradeModal.role || 'creator'}
        targetPath={upgradeModal.role === 'advertiser' ? '/participatory-ads-studio' : '/election-creation-studio'}
      />
    </header>
  );
};

export default HeaderNavigation;