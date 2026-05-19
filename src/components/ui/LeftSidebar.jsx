import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import {
  HOME_FEED_DASHBOARD_ROUTE,
  FEEDS_EXPLORER_HUB_ROUTE,
  ELECTIONS_DASHBOARD_ROUTE,
  ELECTION_CREATION_STUDIO_ROUTE,
  VOTE_IN_ELECTIONS_HUB_ROUTE,
  VOTE_VERIFICATION_PORTAL_ROUTE,
  BLOCKCHAIN_AUDIT_PORTAL_ROUTE,
  USER_PROFILE_HUB_ROUTE,
  DIGITAL_WALLET_HUB_ROUTE,
  FRIENDS_MANAGEMENT_HUB_ROUTE,
  DIRECT_MESSAGING_CENTER_ROUTE,
  ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE as HUBS_ROUTE,
  NOTIFICATION_CENTER_HUB_ROUTE,
  SOCIAL_ACTIVITY_TIMELINE_ROUTE,
  SETTINGS_ACCOUNT_DASHBOARD_ROUTE,
  JOLTS_VIDEO_STUDIO_ROUTE,
  PERSONAL_ANALYTICS_DASHBOARD_ROUTE,
  ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE,
  CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE,
  USER_SECURITY_CENTER_ROUTE,
} from '../../constants/navigationHubRoutes';
import { navigationService } from '../../services/navigationService';

/* ──────────────────────────────────────────
   Helpers
────────────────────────────────────────── */
const SidebarLink = ({ to, icon, label, active, badge, indent = false }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
      ${indent ? 'ml-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800' : ''}
      ${active
        ? 'bg-[#0F5FFF]/10 text-[#0F5FFF] font-black'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold'
      }
    `}
  >
    <div className={`
      w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
      ${active
        ? 'bg-[#0F5FFF] text-white'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
      }
    `}>
      <Icon name={icon} size={18} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className="text-[14px] flex-1 truncate">{label}</span>
    {badge > 0 && (
      <span className="text-[11px] font-black bg-red-500 text-white min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
        {badge}
      </span>
    )}
  </Link>
);

const SectionDivider = ({ label }) => (
  <div className="pt-3 pb-1 px-3">
    {label && <p className="text-[11px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.15em]">{label}</p>}
    {!label && <div className="h-px bg-gray-100 dark:bg-gray-800" />}
  </div>
);

const ExpandableSection = ({ icon, label, active, children }) => {
  const [open, setOpen] = useState(active);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
          ${active ? 'text-[#0F5FFF] font-black' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold'}
        `}
      >
        <div className={`
          w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
          ${active ? 'bg-[#0F5FFF] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}
        `}>
          <Icon name={icon} size={18} strokeWidth={active ? 2.5 : 2} />
        </div>
        <span className="text-[14px] flex-1 text-left truncate">{label}</span>
        <Icon
          name="ChevronDown"
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-[18px] mt-0.5 space-y-0.5 border-l-2 border-gray-100 dark:border-gray-800 pl-3 pb-1">
          {children}
        </div>
      )}
    </div>
  );
};

const SubLink = ({ to, label, active }) => (
  <Link
    to={to}
    className={`
      block py-2 px-2 rounded-lg text-[13px] transition-colors
      ${active ? 'text-[#0F5FFF] font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium'}
    `}
  >
    {label}
  </Link>
);

const FooterLink = ({ label, to }) => (
  <Link to={to || '#'} className="text-[11px] text-gray-400 dark:text-gray-600 hover:underline">
    {label}
  </Link>
);

/* ──────────────────────────────────────────
   Main Component
────────────────────────────────────────── */
const LeftSidebar = () => {
  const location = useLocation();
  const { userProfile } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const userName = userProfile?.name || userProfile?.full_name || userProfile?.username || 'Your Profile';
  const userInitial = userName.charAt(0).toUpperCase();
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'superadmin';

  const [expandedCategories, setExpandedCategories] = useState({});
  const toggleCategory = (cat) => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));

  const categories = navigationService.getCategories();

  return (
    <aside className="
      hidden lg:flex flex-col
      fixed left-0 top-[104px] bottom-0 w-[280px]
      bg-white dark:bg-gray-900
      border-r border-gray-200 dark:border-gray-800
      overflow-y-auto scrollbar-none
      z-40
    ">
      <nav className="flex flex-col gap-0.5 p-2 pb-4 flex-1">

        {/* ── Personal Home Page (Profile shortcut) ── */}
        <Link
          to={USER_PROFILE_HUB_ROUTE}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group font-semibold
            ${isActive(USER_PROFILE_HUB_ROUTE)
              ? 'bg-[#0F5FFF]/10 text-[#0F5FFF] font-black'
              : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[14px] flex-shrink-0 shadow-sm">
            {userInitial}
          </div>
          <span className="text-[14px] truncate">{userName}</span>
        </Link>

        {/* ── Home ── */}
        <SidebarLink to={HOME_FEED_DASHBOARD_ROUTE} icon="Home" label="Home" active={isActive(HOME_FEED_DASHBOARD_ROUTE)} />

        {/* ── Jolts ── */}
        <SidebarLink to={JOLTS_VIDEO_STUDIO_ROUTE} icon="Play" label="Jolts" active={isActive(JOLTS_VIDEO_STUDIO_ROUTE)} />

        {/* ── Elections & Voting (dropdown) ── */}
        <ExpandableSection
          icon="Lock"
          label="Elections & Voting"
          active={isActive(ELECTIONS_DASHBOARD_ROUTE) || isActive(ELECTION_CREATION_STUDIO_ROUTE)}
        >
          <SubLink to={ELECTION_CREATION_STUDIO_ROUTE} label="Create Election" active={isActive(ELECTION_CREATION_STUDIO_ROUTE)} />
          <SubLink to={VOTE_IN_ELECTIONS_HUB_ROUTE} label="Vote in Elections" active={isActive(VOTE_IN_ELECTIONS_HUB_ROUTE)} />
          <SubLink to={VOTE_VERIFICATION_PORTAL_ROUTE} label="Verify Elections" active={isActive(VOTE_VERIFICATION_PORTAL_ROUTE)} />
          <SubLink to={BLOCKCHAIN_AUDIT_PORTAL_ROUTE} label="Audit Elections" active={isActive(BLOCKCHAIN_AUDIT_PORTAL_ROUTE)} />
          <SubLink to="/creator-monetization-studio" label="Create Vottery Page" active={isActive('/creator-monetization-studio')} />
        </ExpandableSection>

        {/* ── Vottery AI ── */}
        <SidebarLink to="/ai-analytics-hub" icon="Cpu" label="Vottery AI" active={isActive('/ai-analytics-hub')} />

        {/* ── Messaging ── */}
        <SidebarLink to={DIRECT_MESSAGING_CENTER_ROUTE} icon="MessageCircle" label="Message" active={isActive(DIRECT_MESSAGING_CENTER_ROUTE)} badge={6} />

        {/* ── Friends ── */}
        <SidebarLink to={FRIENDS_MANAGEMENT_HUB_ROUTE} icon="Users" label="Friends" active={isActive(FRIENDS_MANAGEMENT_HUB_ROUTE)} badge={3} />

        {/* ── Groups / Hubs ── */}
        <SidebarLink to={HUBS_ROUTE} icon="Globe" label="Groups" active={isActive(HUBS_ROUTE)} />

        {/* ── Feeds ── */}
        <SidebarLink to={FEEDS_EXPLORER_HUB_ROUTE} icon="Rss" label="Feeds" active={isActive(FEEDS_EXPLORER_HUB_ROUTE)} />

        {/* ── Professional Dashboard ── */}
        <SidebarLink to={PERSONAL_ANALYTICS_DASHBOARD_ROUTE} icon="Briefcase" label="Professional Dashboard" active={isActive(PERSONAL_ANALYTICS_DASHBOARD_ROUTE)} />

        <SectionDivider />

        {/* ── Secondary Links ── */}
        <SidebarLink to="/moments-creation-studio" icon="Bookmark" label="Saved" active={isActive('/moments-creation-studio')} />
        <SidebarLink to="/social-activity-timeline" icon="Calendar" label="Events" active={isActive(SOCIAL_ACTIVITY_TIMELINE_ROUTE)} />
        <SidebarLink to="/notification-center-hub" icon="Gift" label="Birthdays" active={false} />
        <SidebarLink to={SOCIAL_ACTIVITY_TIMELINE_ROUTE} icon="Clock" label="Memories" active={isActive(SOCIAL_ACTIVITY_TIMELINE_ROUTE)} />
        <SidebarLink to="/creator-marketplace-screen" icon="Layout" label="Pages" active={isActive('/creator-marketplace-screen')} />
        <SidebarLink to={PERSONAL_ANALYTICS_DASHBOARD_ROUTE} icon="Star" label="Professional Access" active={false} />

        <SectionDivider label="Help & Support" />

        <SidebarLink to={CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE} icon="HelpCircle" label="Help and Support" active={isActive(CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE)} />
        <SidebarLink to={CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE} icon="LifeBuoy" label="Support" active={false} />
        <SidebarLink to="/ai-analytics-hub" icon="Bot" label="AI Support Assistant" active={false} />

        <SectionDivider label="Legal" />

        <div className="px-3 py-2 flex flex-wrap gap-x-3 gap-y-1">
          <FooterLink label="Imprint / Terms" to="/settings-account-dashboard" />
          <FooterLink label="Data Policy" to="/settings-account-dashboard" />
          <FooterLink label="Community Standards" to="/settings-account-dashboard" />
          <FooterLink label="Report a Problem" to={CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE} />
        </div>

        <SectionDivider label="Settings & Privacy" />

        <SidebarLink to={SETTINGS_ACCOUNT_DASHBOARD_ROUTE} icon="Settings" label="Settings" active={isActive(SETTINGS_ACCOUNT_DASHBOARD_ROUTE)} />
        <SidebarLink to={SETTINGS_ACCOUNT_DASHBOARD_ROUTE} icon="Clock" label="Time Management" active={false} />
        <SidebarLink to="/global-localization-control-center" icon="Globe2" label="Language" active={isActive('/global-localization-control-center')} />
        <SidebarLink to={SETTINGS_ACCOUNT_DASHBOARD_ROUTE} icon="Wifi" label="Cellular Data Usage" active={false} />

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold w-full"
        >
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <Icon name="Moon" size={18} strokeWidth={2} />
          </div>
          <span className="text-[14px] flex-1 text-left">Dark / Light Mode</span>
        </button>

        <SectionDivider label="Account" />

        <SidebarLink to={SOCIAL_ACTIVITY_TIMELINE_ROUTE} icon="Activity" label="Recent Activities" active={false} />
        <SidebarLink to={DIGITAL_WALLET_HUB_ROUTE} icon="ShoppingBag" label="Orders & Payments" active={isActive(DIGITAL_WALLET_HUB_ROUTE)} />
        <SidebarLink to={USER_SECURITY_CENTER_ROUTE} icon="Link" label="Link History" active={false} />
        <SidebarLink to="/ad-slot-manager-inventory-control-center" icon="TrendingUp" label="Recent Ad Activities" active={false} />
        <SidebarLink to={USER_SECURITY_CENTER_ROUTE} icon="Shield" label="Privacy Center" active={isActive(USER_SECURITY_CENTER_ROUTE)} />
        
        {isAdmin && (
          <>
            <SectionDivider label="Platform Explorer" />
            <div className="space-y-0.5">
              {categories.map((cat) => {
                const iconName = navigationService.getCategoryIcon(cat);
                const screens = navigationService.getScreensByCategory(cat);
                const isExpanded = expandedCategories[cat];
                const hasActiveChild = screens.some(s => isActive(s.path));

                return (
                  <ExpandableSection
                    key={cat}
                    icon={iconName}
                    label={cat}
                    active={isExpanded || hasActiveChild}
                  >
                    {screens.map((screen) => (
                      <SubLink 
                        key={screen.id} 
                        to={screen.path} 
                        label={screen.name} 
                        active={isActive(screen.path)} 
                      />
                    ))}
                  </ExpandableSection>
                );
              })}
            </div>
          </>
        )}

        <SectionDivider />

        {/* Copyright */}
        <div className="px-3 pt-1 pb-2">
          <p className="text-[11px] text-gray-400 dark:text-gray-600">Vottery © 2026</p>
        </div>

      </nav>
    </aside>
  );
};

export default LeftSidebar;
