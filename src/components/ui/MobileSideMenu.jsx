import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { navigationService } from '../../services/navigationService';
import useFeatureStore from '../../store/useFeatureStore';
import { 
  USER_PROFILE_HUB_ROUTE,
  HOME_FEED_DASHBOARD_ROUTE,
  ELECTIONS_DASHBOARD_ROUTE,
  ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE
} from '../../constants/navigationHubRoutes';

const MobileSideMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut, can } = useAuth();
  const isFeatureEnabled = useFeatureStore((state) => state.isFeatureEnabled);
  
  const [expandedSections, setExpandedSections] = useState({
    elections: false,
    help: false,
    settings: false,
    more: false
  });

  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
      onClose();
    }
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  // Logic for dynamic screens
  let rawRole = userProfile?.role || 'voter';
  if (rawRole === 'user') rawRole = 'voter';
  if (rawRole === 'brand') rawRole = 'advertiser';
  const userRole = rawRole;

  const roleBasedScreens = useMemo(
    () => navigationService?.getScreensByRole(userRole, isFeatureEnabled, can) ?? [],
    [userRole, isFeatureEnabled, can]
  );

  const screensByCategory = {};
  roleBasedScreens.forEach((screen) => {
    const cat = screen?.category || 'Other';
    if (!screensByCategory[cat]) screensByCategory[cat] = [];
    screensByCategory[cat].push(screen);
  });

  const orderedCategories = Object.keys(screensByCategory);

  // Menu Item Component
  const MenuItem = ({ icon, label, onClick, badge, subItems, isExpanded, onToggle, isPrimary = false, active = false }) => (
    <div className="w-full">
      <button 
        onClick={subItems ? onToggle : onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left ${active ? 'bg-vottery-blue/10' : ''} ${isPrimary ? 'bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 mb-2' : ''}`}
      >
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-vottery-blue text-white' : isPrimary ? 'bg-vottery-blue/10 text-vottery-blue' : 'text-gray-500 dark:text-gray-400'}`}>
          <Icon name={icon} size={22} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <span className={`text-[15px] font-black tracking-tight ${active ? 'text-vottery-blue' : isPrimary ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>{label}</span>
        </div>
        {badge && (
          <span className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-bold rounded-full">{badge}</span>
        )}
        {subItems && (
          <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} size={20} className="text-gray-400" />
        )}
      </button>
      
      {subItems && isExpanded && (
        <div className="ml-12 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 pl-2">
          {subItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left ${isActive(item.path) ? 'bg-vottery-blue/5 text-vottery-blue font-bold' : ''}`}
            >
              <span className="text-[14px]">{item.label || item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const ShortcutItem = ({ icon, label, path, color = "bg-white dark:bg-gray-800" }) => (
    <button 
      onClick={() => handleNavigation(path)}
      className={`flex flex-col p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 ${color} hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-left group ${isActive(path) ? 'ring-2 ring-vottery-blue' : ''}`}
    >
      <Icon name={icon} size={28} className="text-vottery-blue mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-950">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        
        {/* User Profile Section */}
        <div className="px-4 pt-4 mb-4">
          <button 
            onClick={() => handleNavigation(USER_PROFILE_HUB_ROUTE)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-vottery-blue flex items-center justify-center text-white text-xl font-black overflow-hidden shadow-sm">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (userProfile?.full_name?.[0] || userProfile?.name?.[0] || 'V').toUpperCase()
              )}
            </div>
            <span className="text-lg font-black text-gray-900 dark:text-white truncate">
              {userProfile?.full_name || userProfile?.name || 'User Profile'}
            </span>
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="px-4 mb-6">
          <h3 className="text-[13px] font-black text-gray-900 dark:text-slate-300 mb-3 ml-1 uppercase tracking-widest">Your shortcuts</h3>
          <div className="grid grid-cols-2 gap-2">
            <ShortcutItem icon="User" label="Personal Home Page" path={USER_PROFILE_HUB_ROUTE} />
            <ShortcutItem icon="PlaySquare" label="Jolts" path="/jolts" />
            <ShortcutItem icon="Users" label="Friends" path="/friends" />
            <ShortcutItem icon="Group" label="Hubs (Groups)" path={ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE} />
            <ShortcutItem icon="Layout" label="Feeds" path={HOME_FEED_DASHBOARD_ROUTE} />
            <ShortcutItem icon="Bookmark" label="Saved" path="/saved" />
          </div>
        </div>

        {/* Main List Items */}
        <div className="px-4 space-y-1">
          <MenuItem 
            icon="Lock" 
            label="Elections and Voting" 
            isExpanded={expandedSections.elections}
            onToggle={() => toggleSection('elections')}
            subItems={[
              { label: 'Create Elections', path: '/election-creation-studio' },
              { label: 'Vote in Elections', path: ELECTIONS_DASHBOARD_ROUTE },
              { label: 'Verify Elections', path: '/election-monitoring-integrity-hub' },
              { label: 'Audit Elections', path: '/election-audit-transparency-hub' }
            ]}
          />
          <MenuItem icon="PlusCircle" label="Create Vottery Page" onClick={() => {}} />
          <MenuItem icon="Zap" label="Vottery AI (Gemini)" onClick={() => {}} />
          <MenuItem icon="MessageCircle" label="Message" onClick={() => handleNavigation('/messages')} badge="6" />
          <MenuItem icon="Users" label="Friends" onClick={() => handleNavigation('/friends')} />
          <MenuItem icon="Group" label="Groups (Hubs)" onClick={() => handleNavigation(ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE)} />
          <MenuItem icon="Layout" label="Feeds" onClick={() => handleNavigation(HOME_FEED_DASHBOARD_ROUTE)} />
          <MenuItem icon="TrendingUp" label="Professional Dashboard" onClick={() => {}} />
          <MenuItem icon="Bookmark" label="Saved" onClick={() => {}} />
          <MenuItem icon="Calendar" label="Events" onClick={() => {}} />
          <MenuItem icon="Gift" label="Birthdays" onClick={() => {}} />
          <MenuItem icon="Clock" label="Memories" onClick={() => {}} />
          <MenuItem icon="Flag" label="Pages" onClick={() => {}} />
          <MenuItem icon="ShieldCheck" label="Professional Access" onClick={() => {}} />
          
          {/* Dynamic Categories Section */}
          <div className="py-2" />
          <h3 className="text-[13px] font-black text-gray-900 dark:text-slate-300 mb-2 ml-1 px-3 uppercase tracking-widest">More from Vottery</h3>
          
          {orderedCategories.map((category) => (
            <MenuItem 
              key={category}
              icon="Compass" 
              label={category} 
              isExpanded={expandedCategories[category]}
              onToggle={() => toggleCategory(category)}
              subItems={screensByCategory[category].map(s => ({ label: s.name, path: s.path }))}
            />
          ))}

          <div className="py-2" />

          {/* Help and Support Dropdown */}
          <MenuItem 
            icon="HelpCircle" 
            label="Help and Support" 
            isExpanded={expandedSections.help}
            onToggle={() => toggleSection('help')}
            subItems={[
              { label: 'Support', path: '/support' },
              { label: 'AI Support Assistant', path: '/ai-support' },
              { label: 'Imprint/Terms', path: '/terms' },
              { label: 'Data Policy', path: '/policy' },
              { label: 'Community Standards', path: '/standards' },
              { label: 'Report a Problem', path: '/report' }
            ]}
          />

          {/* Settings and Privacy Dropdown */}
          <MenuItem 
            icon="Settings" 
            label="Settings and Privacy" 
            isExpanded={expandedSections.settings}
            onToggle={() => toggleSection('settings')}
            subItems={[
              { label: 'Settings', path: '/settings' },
              { label: 'Time Management', path: '/time' },
              { label: 'Language', path: '/language' },
              { label: 'Cellular Data Usage', path: '/data' },
              { label: 'Dark and Light Mode', path: '/appearance' },
              { label: 'Recent Activities', path: '/activities' },
              { label: 'Orders and Payments', path: '/payments' },
              { label: 'Link History', path: '/history' },
              { label: 'Recent Ad Activities', path: '/ad-activities' },
              { label: 'Privacy Center', path: '/privacy' }
            ]}
          />
        </div>

        {/* Logout Section */}
        <div className="px-4 mt-6">
           <button 
             onClick={handleLogout}
             className="w-full py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-all"
           >
             Log Out
           </button>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
         <span className="text-[12px] font-medium text-gray-500">Vottery Hub v3.0</span>
         <div className="flex gap-4">
           <span className="text-[12px] font-medium text-gray-500 cursor-pointer">Privacy</span>
           <span className="text-[12px] font-medium text-gray-500 cursor-pointer">Terms</span>
           <span className="text-[12px] font-medium text-gray-500 cursor-pointer">Cookies</span>
         </div>
      </div>
    </div>
  );
};

export default MobileSideMenu;
