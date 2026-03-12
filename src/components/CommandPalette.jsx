import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import Icon from '../components/AppIcon';
import { navigationService } from '../services/navigationService';
import { useAuth } from '../contexts/AuthContext';
import { usePlatformFeatureToggles } from '../hooks/usePlatformFeatureToggles';
import { filterNavItemsByFeature } from '../utils/filterNavByFeatureToggle';

export const CommandPalette = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { isFeatureEnabled } = usePlatformFeatureToggles();
  const [search, setSearch] = useState('');
  const [filteredScreens, setFilteredScreens] = useState([]);

  const userRole = userProfile?.role || 'voter';

  useEffect(() => {
    let list = [];
    if (search) {
      const results = navigationService?.searchScreens(search);
      list = results?.filter(screen => screen?.roles?.includes(userRole))?.slice(0, 10) ?? [];
    } else {
      list = navigationService?.getScreensByRole(userRole)?.slice(0, 8) ?? [];
    }
    const byFeature = filterNavItemsByFeature(list, isFeatureEnabled);
    setFilteredScreens(byFeature);
  }, [search, userRole, isFeatureEnabled]);

  const handleSelect = useCallback((path) => {
    navigate(path);
    onOpenChange(false);
    setSearch('');
  }, [navigate, onOpenChange]);

  useEffect(() => {
    const down = (e) => {
      if (e?.key === 'k' && (e?.metaKey || e?.ctrlKey)) {
        e?.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
        <Command
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          onClick={(e) => e?.stopPropagation()}
        >
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <Icon name="Search" size={20} className="text-gray-400" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search screens, features, or actions... (Cmd+K)"
              className="flex-1 px-4 py-4 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </Command.Empty>

            {!search && (
              <Command.Group heading="Quick Access" className="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {filteredScreens?.map((screen) => (
                  <Command.Item
                    key={screen?.id}
                    value={screen?.name}
                    onSelect={() => handleSelect(screen?.path)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={screen?.icon} size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{screen?.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{screen?.category}</div>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-gray-400" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {search && filteredScreens?.length > 0 && (
              <Command.Group heading="Search Results" className="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                {filteredScreens?.map((screen) => (
                  <Command.Item
                    key={screen?.id}
                    value={screen?.name}
                    onSelect={() => handleSelect(screen?.path)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={screen?.icon} size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{screen?.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {screen?.category} • {screen?.keywords?.slice(0, 3)?.join(', ')}
                      </div>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-gray-400" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">↵</kbd>
                  Select
                </span>
              </div>
              <span>Role: {userRole}</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
};
