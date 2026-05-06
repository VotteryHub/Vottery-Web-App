import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import NavIcon from './NavIcon';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HOME_FEED_DASHBOARD_ROUTE, 
  ELECTIONS_DASHBOARD_ROUTE,
  ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE,
  USER_PROFILE_HUB_ROUTE,
  NOTIFICATION_CENTER_HUB_ROUTE,
  DIRECT_MESSAGING_CENTER_ROUTE,
  FRIENDS_MANAGEMENT_HUB_ROUTE,
  SETTINGS_ACCOUNT_DASHBOARD_ROUTE,
  CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE,
  AUTHENTICATION_PORTAL_ROUTE,
  JOLTS_VIDEO_STUDIO_ROUTE,
  ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE
} from '../../constants/navigationHubRoutes';

const MobileSideMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate(AUTHENTICATION_PORTAL_ROUTE);
  };

  const navSections = [
    {
      title: 'Main',
      items: [
        { label: 'Home', path: HOME_FEED_DASHBOARD_ROUTE, icon: 'Home' },
        { label: 'Elections', path: ELECTIONS_DASHBOARD_ROUTE, icon: 'Elections' },
        { label: 'Jolts', path: JOLTS_VIDEO_STUDIO_ROUTE, icon: 'Jolts' },
        { label: 'Discovery Hubs', path: ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE, icon: 'Hubs' },
        { label: 'Search', path: ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE, icon: 'Search' },
      ]
    },
    {
      title: 'Social',
      items: [
        { label: 'Notifications', path: NOTIFICATION_CENTER_HUB_ROUTE, icon: 'Notifications' },
        { label: 'Messages', path: DIRECT_MESSAGING_CENTER_ROUTE, icon: 'Messages' },
        { label: 'Friends', path: FRIENDS_MANAGEMENT_HUB_ROUTE, icon: 'Friends' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { label: 'Profile', path: USER_PROFILE_HUB_ROUTE, icon: 'Profile' },
        { label: 'Settings', path: SETTINGS_ACCOUNT_DASHBOARD_ROUTE, icon: 'Settings' },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-vottery-blue/5 to-vottery-yellow/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vottery-blue to-vottery-yellow p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center font-bold text-vottery-blue text-xl overflow-hidden">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                userProfile?.full_name?.[0] || 'V'
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">
              {userProfile?.full_name || 'Vottery User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              @{userProfile?.username || user?.email?.split('@')[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path) 
                      ? 'bg-vottery-blue/10 text-vottery-blue' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <NavIcon name={item.icon} active={isActive(item.path)} size={22} className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[15px]">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-vottery-yellow shadow-[0_0_8px_#FFC629]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => handleNavigation(CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <Icon name="HelpCircle" size={22} />
            <span className="font-bold text-[15px]">Help & Support</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-2"
          >
            <Icon name="LogOut" size={22} />
            <span className="font-bold text-[15px]">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/images/vottery_icon_unique.png" alt="" className="h-5 w-auto" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vottery v2.4</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon name="Twitter" size={16} className="text-gray-400" />
          <Icon name="Github" size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default MobileSideMenu;
