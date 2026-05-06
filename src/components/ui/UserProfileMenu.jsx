import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useFontSize } from '../../contexts/FontSizeContext';
import RoleSwitchMenu from '../RoleSwitchMenu';
import { usePlatformFeatureToggles } from '../../hooks/usePlatformFeatureToggles';
import { filterNavItemsByFeature } from '../../utils/filterNavByFeatureToggle';
import {
  AUTHENTICATION_PORTAL_ROUTE,
  CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE,
  CONTENT_REMOVED_APPEAL_ROUTE,
  SETTINGS_ACCOUNT_DASHBOARD_ROUTE,
  USER_PROFILE_HUB_ROUTE,
} from '../../constants/navigationHubRoutes';


const UserProfileMenu = ({ isOpen, onClose, triggerRef }) => {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, MIN_FONT_SIZE, MAX_FONT_SIZE, loading, setFontSize } = useFontSize();
  const menuRef = useRef(null);
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef?.current &&
        !menuRef?.current?.contains(event?.target) &&
        triggerRef?.current &&
        !triggerRef?.current?.contains(event?.target)
      ) {
        onClose();
        setShowDisplayMenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    // Apply font size to document root
    document.documentElement?.style?.setProperty('--user-font-size', `${fontSize}px`);
  }, [fontSize]);

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate(AUTHENTICATION_PORTAL_ROUTE);
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
    setShowDisplayMenu(false);
  };

  const handleDisplayAccessibility = () => {
    setShowDisplayMenu(true);
  };

  const handleBackToMain = () => {
    setShowDisplayMenu(false);
  };

  const { isFeatureEnabled } = usePlatformFeatureToggles();
  const menuItemsRaw = [
    { icon: 'User', label: 'Edit Profile (Name, Bio, Pic)', path: `${SETTINGS_ACCOUNT_DASHBOARD_ROUTE}?tab=profile`, showArrow: true },
    { icon: 'Shield', label: 'Password & Security', path: `${SETTINGS_ACCOUNT_DASHBOARD_ROUTE}?tab=security`, showArrow: true },
    { icon: 'Settings', label: 'All Settings & privacy', path: SETTINGS_ACCOUNT_DASHBOARD_ROUTE, showArrow: true },
    { icon: 'HelpCircle', label: 'Help & support', path: CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE, showArrow: true },
    { icon: 'Moon', label: 'Display & accessibility', action: handleDisplayAccessibility, showArrow: true },
  ];
  const menuItems = useMemo(
    () => filterNavItemsByFeature(menuItemsRaw, isFeatureEnabled),
    [isFeatureEnabled]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-3 w-[360px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fadeIn z-50"
    >
      {!showDisplayMenu ? (
        // Main Menu
        (<>
          {/* Profile Header */}
          <div className="p-2">
            <Link
              to={USER_PROFILE_HUB_ROUTE}
              onClick={() => onClose()}
              className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-semibold flex-shrink-0" style={{ fontSize: '14px' }}>
                {(userProfile?.name || userProfile?.full_name || userProfile?.username || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate" style={{ fontSize: '15px' }}>
                  {userProfile?.name || userProfile?.full_name || userProfile?.username || 'Vottery User'}
                </p>
              </div>
            </Link>
          </div>
          {/* See all profiles button */}
          <div className="px-2 pb-2">
            <button
              onClick={() => handleNavigation(USER_PROFILE_HUB_ROUTE)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 text-gray-900 dark:text-gray-100 font-medium"
              style={{ fontSize: '15px' }}
            >
              <Icon name="Users" size={16} />
              <span>See all profiles</span>
            </button>
          </div>
          {/* Role switch / upgrade */}
          <RoleSwitchMenu onClose={onClose} />
          {/* Quick theme toggle */}
          <div className="px-3 py-2">
            <button
              onClick={() => { toggleTheme(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-gray-900 dark:text-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={18} className="text-gray-700 dark:text-gray-300" />
                </div>
                <span className="font-medium" style={{ fontSize: '15px' }}>
                  {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                </span>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          {/* Divider */}
          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item, index) => (
              <button
                key={index}
                onClick={item?.action || (() => handleNavigation(item?.path))}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Icon name={item?.icon} size={18} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="font-medium" style={{ fontSize: '15px' }}>{item?.label}</span>
                </div>
                {item?.showArrow && (
                  <Icon name="ChevronRight" size={18} className="text-gray-500 dark:text-gray-400" />
                )}
              </button>
            ))}
          </div>
          {/* Give Feedback */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation(CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-gray-100"
            >
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Icon name="MessageSquare" size={18} className="text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium" style={{ fontSize: '15px' }}>Give feedback</p>
                <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: '13px' }}>CTRL B</p>
              </div>
            </button>
          </div>
          {/* Divider */}
          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
          {/* Logout */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-gray-100"
            >
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Icon name="LogOut" size={18} className="text-gray-700 dark:text-gray-300" />
              </div>
              <span className="font-medium" style={{ fontSize: '15px' }}>Log out</span>
            </button>
          </div>
          {/* Footer Links */}
          <div className="px-3 py-3 text-gray-500 dark:text-gray-400" style={{ fontSize: '12px' }}>
            <div className="flex flex-wrap gap-1">
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <span>·</span>
              <Link to="/terms" className="hover:underline">Ranking Transparency</Link>
              <span>·</span>
              <Link to="/terms" className="hover:underline">Imprint/Terms</Link>
              <span>·</span>
              <Link to="/advertising" className="hover:underline">Advertising</Link>
              <span>·</span>
              <Link to="/ad-choices" className="hover:underline">Ad Choices</Link>
              <span>·</span>
              <Link to="/cookies" className="hover:underline">Cookies</Link>
              <span>·</span>
              <button className="hover:underline">More</button>
            </div>
          </div>
        </>)
      ) : (
        // Display & Accessibility Submenu
        (<>
          {/* Header with Back Button */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToMain}
                className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200"
              >
                <Icon name="ArrowLeft" size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: '17px' }}>Display & accessibility</h3>
            </div>
          </div>
          {/* Font Size Controls */}
          <div className="p-4">
            {/* Theme Toggle Section */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2" style={{ fontSize: '15px' }}>Theme</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4" style={{ fontSize: '13px' }}>
                Choose your preferred color scheme for the platform.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === 'light' ?'bg-[#FFC629]/20 border-2 border-[#FFC629] text-gray-900 dark:text-gray-100' :'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <Icon name="Sun" size={18} />
                  <span className="font-medium" style={{ fontSize: '14px' }}>Light</span>
                </button>
                
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    theme === 'dark' ?'bg-[#FFC629]/20 border-2 border-[#FFC629] text-gray-900 dark:text-gray-100' :'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <Icon name="Moon" size={18} />
                  <span className="font-medium" style={{ fontSize: '14px' }}>Dark</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2" style={{ fontSize: '15px' }}>Font size</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4" style={{ fontSize: '13px' }}>
                Adjust the font size for better readability across the platform.
              </p>
            </div>

            {/* Font Size Preview */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
              <p className="text-gray-900 dark:text-gray-100 mb-2" style={{ fontSize: `${fontSize}px` }}>
                Sample text preview
              </p>
              <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: `${Math.max(fontSize - 2, 12)}px` }}>
                This is how your text will appear
              </p>
            </div>

            {/* Font Size Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: '13px' }}>Small</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: '13px' }}>{fontSize}px</span>
                <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: '13px' }}>Large</span>
              </div>
              <input
                type="range"
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e?.target?.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= MIN_FONT_SIZE}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 text-gray-900 dark:text-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '15px' }}
              >
                <Icon name="Minus" size={16} />
                <span>Decrease</span>
              </button>
              <button
                onClick={increaseFontSize}
                disabled={fontSize >= MAX_FONT_SIZE}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 text-gray-900 dark:text-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '15px' }}
              >
                <Icon name="Plus" size={16} />
                <span>Increase</span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFontSize}
              className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-200 font-medium"
              style={{ fontSize: '15px' }}
            >
              Reset to default (15px)
            </button>
          </div>
          {/* Dark Mode Toggle */}
          <div className="px-4 pb-4">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={18} className="text-gray-700 dark:text-gray-300" />
                <span className="font-medium text-gray-900 dark:text-gray-100" style={{ fontSize: '15px' }}>
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </span>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'} relative`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </>)
      )}
    </div>
  );
};

export default UserProfileMenu;