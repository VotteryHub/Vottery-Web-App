import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import {
  AUTHENTICATION_PORTAL_ROUTE,
  USER_PROFILE_HUB_ROUTE,
} from '../../constants/navigationHubRoutes';

const UserDropdown = ({ user = { name: 'John Doe', email: 'john.doe@vottery.com', avatar: 'JD' } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const isDark = document.documentElement?.classList?.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement?.classList?.toggle('dark', newTheme);
  };

  const handleLogout = () => {
    setIsOpen(false);
    navigate(AUTHENTICATION_PORTAL_ROUTE);
  };

  const menuItems = [
    {
      label: 'My Profile',
      icon: 'User',
      path: USER_PROFILE_HUB_ROUTE,
    },
    {
      label: 'Voting History',
      icon: 'History',
      path: `${USER_PROFILE_HUB_ROUTE}?tab=history`,
    },
    {
      label: 'Settings',
      icon: 'Settings',
      path: `${USER_PROFILE_HUB_ROUTE}?tab=settings`,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-semibold transition-all duration-250 hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-3"
      >
        {user?.avatar}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-xl shadow-democratic-lg overflow-hidden z-dropdown">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-semibold text-lg">
                {user?.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 transition-all duration-250 hover:bg-muted text-foreground"
              >
                <Icon name={item?.icon} size={18} />
                <span className="font-medium">{item?.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-border py-2">
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between px-4 py-2.5 transition-all duration-250 hover:bg-muted text-foreground"
            >
              <span className="flex items-center gap-3">
                <Icon name={isDarkMode ? 'Moon' : 'Sun'} size={18} />
                <span className="font-medium">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </span>
              <div
                className={`w-10 h-6 rounded-full transition-all duration-250 ${
                  isDarkMode ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-250 transform ${
                    isDarkMode ? 'translate-x-4' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </button>
          </div>

          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-250 hover:bg-destructive/10 text-destructive"
            >
              <Icon name="LogOut" size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;