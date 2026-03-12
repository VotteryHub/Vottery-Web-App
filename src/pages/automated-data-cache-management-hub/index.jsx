import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Activity, Settings, RefreshCw, Trash2, TrendingUp, Smartphone, BarChart2 } from 'lucide-react';
import CachePerformancePanel from './components/CachePerformancePanel';
import SmartCacheEnginePanel from './components/SmartCacheEnginePanel';
import CacheInvalidationPanel from './components/CacheInvalidationPanel';
import BackgroundRefreshPanel from './components/BackgroundRefreshPanel';
import analyticsCacheService from '../../services/analyticsCacheService';

const AutomatedDataCacheManagementHub = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('performance');

  // Prune expired entries on mount
  useEffect(() => {
    analyticsCacheService?.pruneExpired();
  }, []);

  const navItems = [
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'engine', label: 'Cache Engine', icon: Settings },
    { id: 'invalidation', label: 'Invalidation', icon: Trash2 },
    { id: 'refresh', label: 'BG Refresh', icon: RefreshCw }
  ];

  const quickLinks = [
    { label: 'Creator Growth Analytics', path: '/creator-growth-analytics-dashboard', icon: TrendingUp },
    { label: 'Revenue Intelligence', path: '/unified-revenue-intelligence-dashboard', icon: BarChart2 },
    { label: 'Mobile Creator Analytics', path: '/creator-growth-analytics-mobile', icon: Smartphone },
    { label: 'Mobile Revenue View', path: '/unified-revenue-intelligence-mobile', icon: Smartphone }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm">← Back</button>
          <span className="text-gray-600">|</span>
          <span className="text-gray-300 text-sm">Automated Data Cache Management Hub</span>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">Automated Data Cache Management Hub</h1>
            </div>
            <p className="text-gray-400">Intelligent stale-while-revalidate cache with IndexedDB storage and smart refresh strategies</p>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Cache Active</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {quickLinks?.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link?.path)}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 text-left transition-colors group"
            >
              <link.icon className="w-5 h-5 text-blue-400 mb-2 group-hover:text-blue-300" />
              <p className="text-white text-sm font-medium">{link?.label}</p>
            </button>
          ))}
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {navItems?.map(item => (
            <button
              key={item?.id}
              onClick={() => setActiveSection(item?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === item?.id
                  ? 'bg-blue-600 text-white' :'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item?.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {activeSection === 'performance' && <CachePerformancePanel />}
          {activeSection === 'engine' && <SmartCacheEnginePanel />}
          {activeSection === 'invalidation' && <CacheInvalidationPanel />}
          {activeSection === 'refresh' && <BackgroundRefreshPanel />}
        </div>

        {/* Always-visible summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeSection !== 'performance' && <CachePerformancePanel />}
          {activeSection !== 'refresh' && <BackgroundRefreshPanel />}
        </div>
      </div>
    </div>
  );
};

export default AutomatedDataCacheManagementHub;
