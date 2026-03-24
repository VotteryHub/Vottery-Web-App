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
import {
  ADVANCED_CAROUSEL_FRAUD_DETECTION_PREVENTION_CENTER_ROUTE,
  ADVANCED_CAROUSEL_ROI_ANALYTICS_DASHBOARD_ROUTE,
  ADVANCED_ML_THREAT_DETECTION_CENTER_ROUTE,
  ADVANCED_PERPLEXITY_60_90_DAY_THREAT_FORECASTING_CENTER_ROUTE,
  ADVANCED_WEBHOOK_ORCHESTRATION_HUB_ROUTE,
  AI_POWERED_REVENUE_FORECASTING_INTELLIGENCE_CENTER_ROUTE,
  ANTHROPIC_ADVANCED_CONTENT_ANALYSIS_CENTER_ROUTE,
  ANTHROPIC_SECURITY_REASONING_INTEGRATION_HUB_ROUTE,
  AUTO_IMPROVING_FRAUD_DETECTION_INTELLIGENCE_CENTER_ROUTE,
  AUTOMATED_SECURITY_TESTING_FRAMEWORK_ROUTE,
  BLOCKCHAIN_AUDIT_PORTAL_ROUTE,
  CAROUSEL_AB_TESTING_DASHBOARD_ROUTE,
  CAROUSEL_FEED_ORCHESTRATION_ENGINE_ROUTE,
  CAROUSEL_HEALTH_SCALING_DASHBOARD_ROUTE,
  CAROUSEL_PERFORMANCE_ANALYTICS_HUB_ROUTE,
  CLAUDE_AI_CONTENT_CURATION_INTELLIGENCE_CENTER_ROUTE,
  CREATOR_CAROUSEL_OPTIMIZATION_STUDIO_ROUTE,
  CREATOR_REVENUE_FORECASTING_DASHBOARD_ROUTE,
  DIRECT_MESSAGING_CENTER_ROUTE,
  DIGITAL_WALLET_HUB_ROUTE,
  DUAL_ADVERTISING_SYSTEM_ANALYTICS_DASHBOARD_ROUTE,
  DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE,
  ELECTIONS_DASHBOARD_ROUTE,
  ELECTION_CREATION_STUDIO_ROUTE,
  ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE,
  ENHANCED_GROUPS_DISCOVERY_MANAGEMENT_HUB_ROUTE,
  FRIENDS_MANAGEMENT_HUB_ROUTE,
  GAMIFICATION_PROGRESSION_ACHIEVEMENT_HUB_ROUTE,
  GOOGLE_ANALYTICS_SECURITY_EVENTS_INTEGRATION_HUB_ROUTE,
  HOME_FEED_DASHBOARD_ROUTE,
  LIVE_STREAMING_REAL_TIME_BROADCAST_CENTER_ROUTE,
  NOTIFICATION_CENTER_HUB_ROUTE,
  OPEN_AI_CAROUSEL_CONTENT_INTELLIGENCE_CENTER_ROUTE,
  PERFORMANCE_OPTIMIZATION_ENGINE_DASHBOARD_ROUTE,
  PARTICIPATORY_ADS_STUDIO_ROUTE,
  PERPLEXITY_CAROUSEL_INTELLIGENCE_DASHBOARD_ROUTE,
  PERPLEXITY_STRATEGIC_PLANNING_CENTER_ROUTE,
  PREMIUM_2D_CAROUSEL_COMPONENT_LIBRARY_HUB_ROUTE,
  PREDICTIVE_ANOMALY_ALERTING_DEVIATION_MONITORING_HUB_ROUTE,
  REAL_TIME_CAROUSEL_MONITORING_HUB_ROUTE,
  REAL_TIME_WEB_SOCKET_MONITORING_COMMAND_CENTER_ROUTE,
  REVENUE_FRAUD_DETECTION_ANOMALY_PREVENTION_CENTER_ROUTE,
  REVENUE_SPLIT_ANALYTICS_IMPACT_DASHBOARD_ROUTE,
  REVENUE_SPLIT_TESTING_SANDBOX_ENVIRONMENT_ROUTE,
  SECURITY_COMPLIANCE_AUTOMATION_CENTER_ROUTE,
  SECURITY_MONITORING_DASHBOARD_ROUTE,
  THREE_D_FEED_PERFORMANCE_ANALYTICS_DASHBOARD_ROUTE,
  UNIFIED_AI_DECISION_ORCHESTRATION_COMMAND_CENTER_ROUTE,
  UNIFIED_BUSINESS_INTELLIGENCE_HUB_ROUTE,
  USER_PROFILE_HUB_ROUTE,
  VOTTERY_POINTS_VP_UNIVERSAL_CURRENCY_CENTER_ROUTE,
  VOTE_IN_ELECTIONS_HUB_ROUTE,
  VOTE_VERIFICATION_PORTAL_ROUTE,
  MOMENTS_CREATION_STUDIO_ROUTE,
  JOLTS_VIDEO_STUDIO_ROUTE,
} from '../../constants/navigationHubRoutes';

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
      path: ELECTION_CREATION_STUDIO_ROUTE,
      icon: 'Plus',
      requiresCreator: !canCreate,
    },
    { label: 'Vote in Elections', path: ELECTIONS_DASHBOARD_ROUTE, icon: 'Vote' },
    { label: 'Verify Elections', path: VOTE_VERIFICATION_PORTAL_ROUTE, icon: 'ShieldCheck' },
    { label: 'Audit Elections', path: BLOCKCHAIN_AUDIT_PORTAL_ROUTE, icon: 'FileSearch' },
    { label: 'Gamified Challenges', path: GAMIFICATION_PROGRESSION_ACHIEVEMENT_HUB_ROUTE, icon: 'Target' },
  ];

  const postsDropdownItemsRaw = [
    { label: 'Post', path: HOME_FEED_DASHBOARD_ROUTE, icon: 'FileText' },
    { label: 'Moment', path: HOME_FEED_DASHBOARD_ROUTE, icon: 'Image' },
    { label: 'Jolts', path: HOME_FEED_DASHBOARD_ROUTE, icon: 'Video' },
    { label: 'Live', path: LIVE_STREAMING_REAL_TIME_BROADCAST_CENTER_ROUTE, icon: 'Radio' },
  ];

  const quickLinks = [
    { name: 'Elections Dashboard', path: ELECTIONS_DASHBOARD_ROUTE, icon: 'Vote' },
    { name: 'Vote in Elections', path: VOTE_IN_ELECTIONS_HUB_ROUTE, icon: 'CheckSquare' },
    { name: 'Create Election', path: ELECTION_CREATION_STUDIO_ROUTE, icon: 'Plus' },
    { name: 'My Profile', path: USER_PROFILE_HUB_ROUTE, icon: 'User' },
    { name: 'Digital Wallet', path: DIGITAL_WALLET_HUB_ROUTE, icon: 'Wallet' },
    { name: 'Messages', path: DIRECT_MESSAGING_CENTER_ROUTE, icon: 'MessageSquare' },
    { name: 'Unified Business Intelligence Hub', path: UNIFIED_BUSINESS_INTELLIGENCE_HUB_ROUTE, icon: 'LayoutDashboard' },
    { name: 'Perplexity Strategic Planning', path: PERPLEXITY_STRATEGIC_PLANNING_CENTER_ROUTE, icon: 'Target' },
    { name: 'Security Compliance Automation', path: SECURITY_COMPLIANCE_AUTOMATION_CENTER_ROUTE, icon: 'ShieldCheck' },
    { name: 'Security Monitoring', path: SECURITY_MONITORING_DASHBOARD_ROUTE, icon: 'Shield' },
    { name: 'GA Security Events', path: GOOGLE_ANALYTICS_SECURITY_EVENTS_INTEGRATION_HUB_ROUTE, icon: 'BarChart3' },
    { name: 'ML Threat Detection', path: ADVANCED_ML_THREAT_DETECTION_CENTER_ROUTE, icon: 'Brain' },
    { name: 'Security Testing Framework', path: AUTOMATED_SECURITY_TESTING_FRAMEWORK_ROUTE, icon: 'Shield' },
    { name: 'Performance Optimization Engine', path: PERFORMANCE_OPTIMIZATION_ENGINE_DASHBOARD_ROUTE, icon: 'Activity' },
    { name: 'Anthropic Security Reasoning', path: ANTHROPIC_SECURITY_REASONING_INTEGRATION_HUB_ROUTE, icon: 'Brain' },
    { name: 'Dual Advertising Analytics', path: DUAL_ADVERTISING_SYSTEM_ANALYTICS_DASHBOARD_ROUTE, icon: 'BarChart3' },
    { name: 'AI Orchestration', path: UNIFIED_AI_DECISION_ORCHESTRATION_COMMAND_CENTER_ROUTE, icon: 'GitCompare' },
    { name: 'Webhook Hub', path: ADVANCED_WEBHOOK_ORCHESTRATION_HUB_ROUTE, icon: 'Webhook' },
    { name: 'WebSocket Monitor', path: REAL_TIME_WEB_SOCKET_MONITORING_COMMAND_CENTER_ROUTE, icon: 'Wifi' },
    { name: 'Content Analysis', path: ANTHROPIC_ADVANCED_CONTENT_ANALYSIS_CENTER_ROUTE, icon: 'Brain' },
    { name: 'Auto-Improving Fraud Detection', path: AUTO_IMPROVING_FRAUD_DETECTION_INTELLIGENCE_CENTER_ROUTE, icon: 'Target' },
    { name: '60-90 Day Threat Forecasting', path: ADVANCED_PERPLEXITY_60_90_DAY_THREAT_FORECASTING_CENTER_ROUTE, icon: 'Calendar' },
    { name: 'Dynamic Revenue Sharing', path: DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE, icon: 'DollarSign' },
    { name: 'Revenue Split Analytics', path: REVENUE_SPLIT_ANALYTICS_IMPACT_DASHBOARD_ROUTE, icon: 'TrendingUp' },
    { name: 'Revenue Testing Sandbox', path: REVENUE_SPLIT_TESTING_SANDBOX_ENVIRONMENT_ROUTE, icon: 'Flask' },
    { name: 'AI Revenue Forecasting', path: AI_POWERED_REVENUE_FORECASTING_INTELLIGENCE_CENTER_ROUTE, icon: 'Brain' },
    { name: 'Enhanced Revenue Config', path: ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE, icon: 'DollarSign', badge: 'AI' },
    { name: 'Revenue Fraud Detection', path: REVENUE_FRAUD_DETECTION_ANOMALY_PREVENTION_CENTER_ROUTE, icon: 'Shield' },
    { name: 'Predictive Anomaly Alerting', path: PREDICTIVE_ANOMALY_ALERTING_DEVIATION_MONITORING_HUB_ROUTE, icon: 'TrendingUp' },
    { name: '3D Feed Performance Analytics', path: THREE_D_FEED_PERFORMANCE_ANALYTICS_DASHBOARD_ROUTE, icon: 'Activity', badge: 'NEW' },
    { name: 'Claude AI Content Curation', path: CLAUDE_AI_CONTENT_CURATION_INTELLIGENCE_CENTER_ROUTE, icon: 'Brain', badge: 'AI' },
  ];

  const electionsDropdownItems = useMemo(
    () => filterNavItemsByFeature(electionsDropdownItemsRaw, isFeatureEnabled),
    [isFeatureEnabled]
  );
  const quickLinksFiltered = useMemo(
    () => filterNavItemsByFeature(quickLinks, isFeatureEnabled),
    [isFeatureEnabled]
  );
  const postsDropdownItems = useMemo(
    () => filterNavItemsByFeature(postsDropdownItemsRaw, isFeatureEnabled),
    [isFeatureEnabled]
  );
  const carouselMenuItemsRaw = [
    { name: 'Premium 2D Carousel Library', path: PREMIUM_2D_CAROUSEL_COMPONENT_LIBRARY_HUB_ROUTE, icon: 'Layers' },
    { name: 'Carousel Performance Analytics', path: CAROUSEL_PERFORMANCE_ANALYTICS_HUB_ROUTE, icon: 'BarChart3' },
    { name: 'Carousel A/B Testing', path: CAROUSEL_AB_TESTING_DASHBOARD_ROUTE, icon: 'GitBranch' },
    { name: 'Carousel ROI Analytics', path: ADVANCED_CAROUSEL_ROI_ANALYTICS_DASHBOARD_ROUTE, icon: 'DollarSign' },
    { name: 'Carousel Feed Orchestration', path: CAROUSEL_FEED_ORCHESTRATION_ENGINE_ROUTE, icon: 'Shuffle' },
    { name: 'Creator Carousel Optimization', path: CREATOR_CAROUSEL_OPTIMIZATION_STUDIO_ROUTE, icon: 'Target' },
    { name: 'OpenAI Carousel Intelligence', path: OPEN_AI_CAROUSEL_CONTENT_INTELLIGENCE_CENTER_ROUTE, icon: 'Brain' },
    { name: 'Carousel Fraud Detection', path: ADVANCED_CAROUSEL_FRAUD_DETECTION_PREVENTION_CENTER_ROUTE, icon: 'Shield' },
    { name: 'Real-Time Carousel Monitoring', path: REAL_TIME_CAROUSEL_MONITORING_HUB_ROUTE, icon: 'Activity' },
    { name: 'Creator Revenue Forecasting', path: CREATOR_REVENUE_FORECASTING_DASHBOARD_ROUTE, icon: 'TrendingUp', badge: 'NEW' },
    { name: 'Perplexity Carousel Intelligence', path: PERPLEXITY_CAROUSEL_INTELLIGENCE_DASHBOARD_ROUTE, icon: 'Globe', badge: 'NEW' },
    { name: 'Carousel Health & Scaling', path: CAROUSEL_HEALTH_SCALING_DASHBOARD_ROUTE, icon: 'Server', badge: 'NEW' }
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
          <Link to={HOME_FEED_DASHBOARD_ROUTE} className="flex items-center gap-2 group flex-shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer">
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
            active={isActive(HOME_FEED_DASHBOARD_ROUTE)}
            onClick={() => navigate(HOME_FEED_DASHBOARD_ROUTE)}
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
                      to={HOME_FEED_DASHBOARD_ROUTE}
                      onClick={() => setShowPostsDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-all"
                    >
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Post</span>
                    </Link>
                    <Link
                      to={MOMENTS_CREATION_STUDIO_ROUTE}
                      onClick={() => setShowPostsDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-all"
                    >
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Moment</span>
                    </Link>
                    <Link
                      to={JOLTS_VIDEO_STUDIO_ROUTE}
                      onClick={() => setShowPostsDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-all"
                    >
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span className="text-white">Jolts</span>
                    </Link>
                    <Link
                      to={LIVE_STREAMING_REAL_TIME_BROADCAST_CENTER_ROUTE}
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
              onClick={() => navigate(HOME_FEED_DASHBOARD_ROUTE)}
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
            active={isActive(ENHANCED_GROUPS_DISCOVERY_MANAGEMENT_HUB_ROUTE)}
            onClick={() => navigate(ENHANCED_GROUPS_DISCOVERY_MANAGEMENT_HUB_ROUTE)}
          />

          <IconButton
            icon="UserPlus"
            label="Friend Requests"
            active={isActive(FRIENDS_MANAGEMENT_HUB_ROUTE)}
            onClick={() => navigate(FRIENDS_MANAGEMENT_HUB_ROUTE)}
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
              active={isActive(DIRECT_MESSAGING_CENTER_ROUTE)}
              onClick={() => {
                setIsMessagesOpen(!isMessagesOpen);
                navigate(DIRECT_MESSAGING_CENTER_ROUTE);
              }}
              badge={unreadMessagesCount}
            />
            {isMessagesOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Messages</h3>
                  <span 
                    onClick={() => navigate(DIRECT_MESSAGING_CENTER_ROUTE)}
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
              active={isActive(NOTIFICATION_CENTER_HUB_ROUTE)}
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                navigate(NOTIFICATION_CENTER_HUB_ROUTE);
              }}
              badge={7}
            />
            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Notifications</h3>
                  <span
                    onClick={() => { navigate(NOTIFICATION_CENTER_HUB_ROUTE); setIsNotificationsOpen(false); }}
                    className="text-xs text-primary font-medium cursor-pointer hover:underline"
                  >
                    See all
                  </span>
                </div>
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon name="Bell" size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No new notifications</p>
                  <button
                    onClick={() => { navigate(NOTIFICATION_CENTER_HUB_ROUTE); setIsNotificationsOpen(false); }}
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
              to={VOTTERY_POINTS_VP_UNIVERSAL_CURRENCY_CENTER_ROUTE}
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
                onClick={() => navigate(HOME_FEED_DASHBOARD_ROUTE)}
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
              to={ENHANCED_GROUPS_DISCOVERY_MANAGEMENT_HUB_ROUTE}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(ENHANCED_GROUPS_DISCOVERY_MANAGEMENT_HUB_ROUTE)
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="Users" size={20} />
              <span className="font-medium">Groups</span>
            </Link>

            <Link
              to={FRIENDS_MANAGEMENT_HUB_ROUTE}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(FRIENDS_MANAGEMENT_HUB_ROUTE)
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="UserPlus" size={20} />
              <span className="font-medium">Friend Requests</span>
              <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </Link>

            <Link
              to={DIRECT_MESSAGING_CENTER_ROUTE}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 sm:hidden ${
                isActive(DIRECT_MESSAGING_CENTER_ROUTE)
                  ? 'bg-[#FFC629]/20 text-gray-900 dark:text-gray-100' :'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="MessageCircle" size={20} />
              <span className="font-medium">Messages</span>
              <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">5</span>
            </Link>

            <Link
              to={NOTIFICATION_CENTER_HUB_ROUTE}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 sm:hidden ${
                isActive(NOTIFICATION_CENTER_HUB_ROUTE)
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
        targetPath={upgradeModal.role === 'advertiser' ? PARTICIPATORY_ADS_STUDIO_ROUTE : ELECTION_CREATION_STUDIO_ROUTE}
      />
    </header>
  );
};

export default HeaderNavigation;