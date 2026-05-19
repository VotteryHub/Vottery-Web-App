import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { navigationService } from '../../services/navigationService';
import { ChevronRight, ChevronDown, Search, Compass, ExternalLink } from 'lucide-react';

const PlatformExplorerSidebar = () => {
  const location = useLocation();
  const categories = navigationService.getCategories();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => location.pathname === path;

  const filteredCategories = categories.map(cat => ({
    name: cat,
    icon: navigationService.getCategoryIcon(cat),
    screens: navigationService.getScreensByCategory(cat).filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(c => c.screens.length > 0);

  return (
    <aside className="
      hidden lg:flex flex-col
      fixed left-0 top-[92px] bottom-0 w-[320px]
      bg-white dark:bg-[#0b0e14]
      border-r border-gray-200 dark:border-white/5
      overflow-y-auto scrollbar-none
      z-40
    ">
      <div className="p-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Compass size={18} strokeWidth={2.5} />
          </div>
          <h2 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Platform Explorer</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search screens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500/50 rounded-xl text-xs font-bold text-gray-900 dark:text-white transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {filteredCategories.map((cat) => {
          const isExpanded = expandedCategory === cat.name;
          const hasActiveChild = cat.screens.some(s => isActive(s.path));

          return (
            <div key={cat.name} className="space-y-1">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group
                  ${isExpanded || hasActiveChild ? 'bg-indigo-500/5 text-indigo-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center transition-all
                    ${isExpanded || hasActiveChild ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-500 group-hover:text-white'}
                  `}>
                    <Icon name={cat.icon} size={18} strokeWidth={2.5} />
                  </div>
                  <span className={`text-[13px] font-black uppercase tracking-tight ${isExpanded || hasActiveChild ? 'text-indigo-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {cat.name}
                  </span>
                </div>
                <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-indigo-500' : 'text-gray-400'}`} />
              </button>

              {isExpanded && (
                <div className="ml-7 pl-5 border-l-2 border-gray-100 dark:border-white/5 space-y-1 py-1">
                  {cat.screens.map((screen) => (
                    <Link
                      key={screen.id}
                      to={screen.path}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-bold transition-all
                        ${isActive(screen.path) 
                          ? 'bg-indigo-500 text-white shadow-md' 
                          : 'text-gray-500 dark:text-gray-500 hover:text-indigo-500 hover:bg-indigo-500/5'}
                      `}
                    >
                      <span className="truncate">{screen.name}</span>
                      {isActive(screen.path) && <ExternalLink size={10} />}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Screens</span>
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">143</span>
        </div>
      </div>
    </aside>
  );
};

export default PlatformExplorerSidebar;
