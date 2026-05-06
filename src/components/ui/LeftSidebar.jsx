import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { navigationService } from '../../services/navigationService';
import { 
  USER_PROFILE_HUB_ROUTE, 
  ELECTIONS_DASHBOARD_ROUTE 
} from '../../constants/navigationHubRoutes';
import useFeatureStore from '../../store/useFeatureStore';

const LeftSidebar = () => {
  const location = useLocation();
  const { userProfile, can } = useAuth();
  const isFeatureEnabled = useFeatureStore((state) => state.isFeatureEnabled);
  const [isElectionsExpanded, setIsElectionsExpanded] = useState(false);

  const isActive = (path) => location?.pathname === path;
  const userRole = userProfile?.role || 'voter';
  const roleBasedScreens = useMemo(
    () => navigationService?.getScreensByRole(userRole, isFeatureEnabled, can) ?? [],
    [userRole, isFeatureEnabled, can]
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
    <aside className="hidden lg:block lg:w-64 xl:w-80 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-card/40 backdrop-blur-xl border-r border-border z-40 transition-all duration-500 scrollbar-none">
      <div className="space-y-4 p-3 lg:p-6">
        <Link
          to={USER_PROFILE_HUB_ROUTE}
          className="flex items-center gap-4 px-2 lg:px-4 py-4 rounded-[24px] bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 group shadow-sm dark:shadow-xl"
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all uppercase">
              {(userProfile?.name || userProfile?.full_name || userProfile?.username || 'U').charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-500 border-2 lg:border-4 border-card rounded-full shadow-lg" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-black text-sm text-foreground group-hover:text-primary transition-colors tracking-tight">
              {userProfile?.name || userProfile?.full_name || userProfile?.username || 'User Profile'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">Voter Level 1</span>
          </div>
        </Link>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />

        <div
          onMouseEnter={() => setIsElectionsExpanded(true)}
          onMouseLeave={() => setIsElectionsExpanded(false)}
          className="relative"
        >
          <button
            onClick={() => setIsElectionsExpanded(!isElectionsExpanded)}
            className={`w-full flex items-center justify-center lg:justify-start gap-4 px-2 lg:px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              isActive(ELECTIONS_DASHBOARD_ROUTE)
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]'
                : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${isActive(ELECTIONS_DASHBOARD_ROUTE) ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-800'}`}>
              <Icon name="Vote" size={20} strokeWidth={isActive(ELECTIONS_DASHBOARD_ROUTE) ? 3 : 2.5} />
            </div>
            <span className="hidden lg:block flex-1 text-left font-black text-[13px] uppercase tracking-wider">
              Elections
            </span>
            <Icon
              name="ChevronDown"
              size={18}
              strokeWidth={3}
              className={`hidden lg:block transition-transform duration-300 ${
                isElectionsExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground'
              }`}
            />
          </button>
          
          {isElectionsExpanded && (
            <div className="hidden lg:block ml-6 mt-3 space-y-2 border-l-2 border-white/5 pl-4 animate-in fade-in slide-in-from-left-2 duration-300">
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group/item ${
                      isActive(s?.path)
                        ? 'text-primary font-black'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-1'
                    }`}
                  >
                    <Icon
                      name={s?.icon || 'Vote'}
                      size={18}
                      strokeWidth={isActive(s?.path) ? 3 : 2.5}
                      className={isActive(s?.path) ? 'text-primary' : 'text-slate-400 dark:text-slate-600 group-hover/item:text-slate-600 dark:group-hover/item:text-slate-400'}
                    />
                    <span className="text-[12px] font-bold tracking-tight">{s?.name}</span>
                  </Link>
                ))}
            </div>
          )}
        </div>

        <div className="space-y-6 pt-4">
          {orderedCategories.map((category) => {
            const screens = screensByCategory[category];
            if (!screens?.length) return null;
            return (
              <div key={category} className="space-y-3">
                <div className="hidden lg:block px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  {category}
                </div>
                <div className="space-y-1">
                  {screens.map((screen) => (
                    <Link
                      key={screen?.id || screen?.path}
                      to={screen?.path}
                      className={`flex items-center justify-center lg:justify-start gap-4 px-2 lg:px-4 py-3 rounded-2xl transition-all duration-300 border border-transparent ${
                        isActive(screen?.path)
                          ? 'bg-primary text-white shadow-xl shadow-primary/40 scale-[1.02] border-white/10'
                          : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-200 dark:hover:border-white/10'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${isActive(screen?.path) ? 'bg-white/20' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                        <Icon
                          name={screen?.icon || 'Circle'}
                          size={18}
                          strokeWidth={isActive(screen?.path) ? 3 : 2.5}
                        />
                      </div>
                      <span className="hidden lg:block flex-1 font-black text-[12px] uppercase tracking-wide">
                        {screen?.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
