import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { navigationService } from '../../services/navigationService';
import {
  ELECTIONS_DASHBOARD_ROUTE,
  USER_PROFILE_HUB_ROUTE,
} from '../../constants/navigationHubRoutes';

const LeftSidebar = () => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const [isElectionsExpanded, setIsElectionsExpanded] = useState(false);

  const isActive = (path) => location?.pathname === path;
  const userRole = userProfile?.role || 'voter';
  const roleBasedScreens = useMemo(
    () => navigationService?.getScreensByRole(userRole) ?? [],
    [userRole]
  );
  const categories = navigationService?.getCategories() ?? [];

  const screensByCategory = {};
  roleBasedScreens.forEach((screen) => {
    const cat = screen?.category || 'Other';
    if (!screensByCategory[cat]) screensByCategory[cat] = [];
    screensByCategory[cat].push(screen);
  });

  const categoryOrder = [
    'Core',
    'Voting',
    'Creator Tools',
    'Advertising',
    'Gamification',
    'Account',
    'Social',
    'Finance',
    'Analytics',
    'AI Intelligence',
    'Administration',
    'System',
    'Security',
    'Compliance',
    'Communication',
    'Community',
    'Personalization',
    'Collaboration',
    'Support',
    'Onboarding',
  ];

  const orderedCategories = [
    ...categoryOrder.filter((c) => screensByCategory[c]?.length),
    ...categories.filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <aside className="hidden lg:block w-64 xl:w-72 fixed left-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 z-40">
      <div className="space-y-1">
        <Link
          to={USER_PROFILE_HUB_ROUTE}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {userProfile?.full_name || 'User Profile'}
          </span>
        </Link>

        <div
          onMouseEnter={() => setIsElectionsExpanded(true)}
          onMouseLeave={() => setIsElectionsExpanded(false)}
        >
          <button
            onClick={() => setIsElectionsExpanded(!isElectionsExpanded)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive(ELECTIONS_DASHBOARD_ROUTE)
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Icon name="Vote" size={24} strokeWidth={2.5} />
            <span className="flex-1 text-left font-medium text-sm">
              Elections & Voting
            </span>
            <Icon
              name="ChevronDown"
              size={20}
              strokeWidth={2.5}
              className={`transition-transform duration-200 ${
                isElectionsExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isElectionsExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {roleBasedScreens
                .filter(
                  (s) =>
                    s?.path?.includes('election') ||
                    s?.path?.includes('vote') ||
                    s?.category === 'Voting' ||
                    s?.path?.includes('blockchain-audit') ||
                    s?.id === 'blockchain-audit'
                )
                .slice(0, 10)
                .map((s) => (
                  <Link
                    key={s?.id || s?.path}
                    to={s?.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(s?.path)
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Icon
                      name={s?.icon || 'Vote'}
                      size={22}
                      strokeWidth={2.5}
                    />
                    <span className="text-sm font-medium">{s?.name}</span>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {orderedCategories.map((category) => {
          const screens = screensByCategory[category];
          if (!screens?.length) return null;
          const icon = navigationService?.getCategoryIcon?.(category) || 'Folder';
          return (
            <div key={category} className="pt-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {category}
              </div>
              {screens.map((screen) => (
                <Link
                  key={screen?.id || screen?.path}
                  to={screen?.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive(screen?.path)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon
                    name={screen?.icon || 'Circle'}
                    size={22}
                    strokeWidth={2.5}
                  />
                  <span className="flex-1 font-medium text-sm">
                    {screen?.name}
                  </span>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default LeftSidebar;
