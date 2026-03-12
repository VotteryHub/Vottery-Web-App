import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PWAInstallationPanel from './components/PWAInstallationPanel';
import PushNotificationEnginePanel from './components/PushNotificationEnginePanel';
import OfflineFunctionalityPanel from './components/OfflineFunctionalityPanel';
import MobileOptimizationPanel from './components/MobileOptimizationPanel';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';
import AdvancedPWAFeaturesPanel from './components/AdvancedPWAFeaturesPanel';

const ProgressiveWebAppMobileOptimizationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pwaMetrics, setPwaMetrics] = useState({
    installations: 0,
    pushDeliveryRate: 0,
    offlineUsage: 0,
    mobilePerformanceScore: 0
  });
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    checkServiceWorkerStatus();
    loadPWAMetrics();
    const interval = setInterval(() => {
      loadPWAMetrics();
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkServiceWorkerStatus = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator?.serviceWorker?.getRegistration();
        if (registration) {
          setServiceWorkerStatus('active');
        } else {
          setServiceWorkerStatus('not-registered');
        }
      } catch (error) {
        console.error('Error checking service worker:', error);
        setServiceWorkerStatus('error');
      }
    } else {
      setServiceWorkerStatus('not-supported');
    }
  };

  const loadPWAMetrics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual service calls
      setPwaMetrics({
        installations: Math.floor(Math.random() * 5000) + 1000,
        pushDeliveryRate: (Math.random() * 10 + 88)?.toFixed(1),
        offlineUsage: (Math.random() * 15 + 10)?.toFixed(1),
        mobilePerformanceScore: Math.floor(Math.random() * 10 + 85)
      });
    } catch (error) {
      console.error('Error loading PWA metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator?.serviceWorker?.register('/service-worker.js');
        console.log('Service Worker registered:', registration);
        setServiceWorkerStatus('active');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        setServiceWorkerStatus('error');
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'installation', label: 'PWA Installation', icon: 'Download' },
    { id: 'push-notifications', label: 'Push Notifications', icon: 'Bell' },
    { id: 'offline', label: 'Offline Functionality', icon: 'Wifi' },
    { id: 'mobile-optimization', label: 'Mobile Optimization', icon: 'Smartphone' },
    { id: 'performance', label: 'Performance Metrics', icon: 'TrendingUp' },
    { id: 'advanced', label: 'Advanced Features', icon: 'Settings' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'not-registered': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-2">
                  Progressive Web App & Mobile Optimization Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Comprehensive PWA implementation with push notifications, offline functionality, and mobile-first responsive design
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Update</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {formatTimestamp(lastUpdate)}
                  </p>
                </div>
                <Button
                  onClick={loadPWAMetrics}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Service Worker Status Banner */}
            <div className={`mb-6 p-4 rounded-xl border ${getStatusColor(serviceWorkerStatus)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon 
                    name={serviceWorkerStatus === 'active' ? 'CheckCircle' : 'AlertCircle'} 
                    size={24} 
                  />
                  <div>
                    <p className="font-semibold">
                      Service Worker Status: {serviceWorkerStatus?.toUpperCase()?.replace('-', ' ')}
                    </p>
                    <p className="text-sm opacity-80">
                      {serviceWorkerStatus === 'active' && 'PWA features are fully operational'}
                      {serviceWorkerStatus === 'not-registered' && 'Service worker not registered. Click to enable PWA features.'}
                      {serviceWorkerStatus === 'not-supported' && 'Service workers are not supported in this browser'}
                      {serviceWorkerStatus === 'error' && 'Error initializing service worker'}
                    </p>
                  </div>
                </div>
                {serviceWorkerStatus === 'not-registered' && (
                  <Button onClick={registerServiceWorker} size="sm">
                    Register Service Worker
                  </Button>
                )}
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Download" size={32} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {pwaMetrics?.installations?.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">PWA Installations</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Bell" size={32} className="text-purple-600" />
                  <span className="text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    Excellent
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {pwaMetrics?.pushDeliveryRate}%
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Push Delivery Rate</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Wifi" size={32} className="text-green-600" />
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                    Growing
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {pwaMetrics?.offlineUsage}%
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Offline Usage</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Smartphone" size={32} className="text-orange-600" />
                  <span className="text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    Optimized
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {pwaMetrics?.mobilePerformanceScore}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Performance Score</p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={20} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  PWA & Mobile Optimization Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comprehensive Progressive Web App implementation with push notification orchestration,
                  offline functionality, and mobile-first responsive design controls for seamless user experience
                  across all devices.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Icon name="Download" size={32} className="text-blue-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      PWA Installation
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track installation metrics, manage app manifest, and monitor PWA adoption rates
                      with real-time analytics.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Icon name="Bell" size={32} className="text-purple-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Push Notification Engine
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automated alerts for elections, voting reminders, prizes, and social interactions
                      with delivery tracking.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Icon name="Wifi" size={32} className="text-green-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Offline Functionality
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Service worker status, cached content management, and sync queue monitoring with
                      automatic background sync.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <Icon name="Smartphone" size={32} className="text-orange-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Mobile Optimization
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Responsive design testing, touch interaction optimization, and performance metrics
                      across devices.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'installation' && <PWAInstallationPanel />}
            {activeTab === 'push-notifications' && <PushNotificationEnginePanel />}
            {activeTab === 'offline' && <OfflineFunctionalityPanel />}
            {activeTab === 'mobile-optimization' && <MobileOptimizationPanel />}
            {activeTab === 'performance' && <PerformanceMetricsPanel />}
            {activeTab === 'advanced' && <AdvancedPWAFeaturesPanel />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProgressiveWebAppMobileOptimizationHub;