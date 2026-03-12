import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SlotMachineConfiguration from './components/SlotMachineConfiguration';
import PremiumDisplayComponents from './components/PremiumDisplayComponents';
import AnimationControlEngine from './components/AnimationControlEngine';
import RealTimeRendering from './components/RealTimeRendering';
import ThemeCustomization from './components/ThemeCustomization';
import PerformanceOptimization from './components/PerformanceOptimization';
import Icon from '../../components/AppIcon';

export default function Premium3DSlotMachineIntegrationHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [slotMachineEnabled, setSlotMachineEnabled] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'slot-config', label: 'Slot Machine Config', icon: 'Settings' },
    { id: 'premium-display', label: 'Premium Display', icon: 'Sparkles' },
    { id: 'animation-control', label: 'Animation Control', icon: 'Film' },
    { id: 'rendering', label: 'Real-Time Rendering', icon: 'Cpu' },
    { id: 'themes', label: 'Theme Customization', icon: 'Palette' },
    { id: 'performance', label: 'Performance', icon: 'Zap' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="Sparkles" className="w-8 h-8 text-purple-600" />
                Premium 3D Slot Machine Integration Hub
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Immersive slot machine-style prize reveals with premium display components
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">3D Rendering:</span>
                <button
                  onClick={() => setSlotMachineEnabled(!slotMachineEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    slotMachineEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      slotMachineEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${
                  slotMachineEnabled ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {slotMachineEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon name={tab?.icon} className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!slotMachineEnabled && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                3D Slot Machine rendering is currently disabled. Enable it to activate premium animations.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow p-6 text-white">
                <Icon name="Box" className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Realistic 3D Rendering</h3>
                <p className="text-purple-100 text-sm">
                  Physics-based spinning mechanics with metallic textures and ambient lighting effects
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg shadow p-6 text-white">
                <Icon name="Sparkles" className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Animations</h3>
                <p className="text-green-100 text-sm">
                  Particle effects, golden animations, and celebratory sequences with haptic feedback
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg shadow p-6 text-white">
                <Icon name="Zap" className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Performance Optimized</h3>
                <p className="text-yellow-100 text-sm">
                  Automatic quality scaling with device compatibility and smooth 60 FPS rendering
                </p>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                3D Rendering System Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">WebGL Support</span>
                  <span className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                    Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Hardware Acceleration</span>
                  <span className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Frame Rate</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">60 FPS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Render Quality</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">High</span>
                </div>
              </div>
            </div>

            {/* Integration Points */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Integration Points
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="Home" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Home Feed Dashboard</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Premium display spot with 3D slot machine for platform-wide gamification
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Icon name="Vote" className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Election Prize Reveals</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Individual election winner announcements with celebratory animations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Icon name="Smartphone" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Mobile Optimized</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Touch-optimized interfaces with adaptive quality for all devices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slot-config' && <SlotMachineConfiguration />}
        {activeTab === 'premium-display' && <PremiumDisplayComponents />}
        {activeTab === 'animation-control' && <AnimationControlEngine />}
        {activeTab === 'rendering' && <RealTimeRendering />}
        {activeTab === 'themes' && <ThemeCustomization />}
        {activeTab === 'performance' && <PerformanceOptimization />}
      </div>
    </div>
  );
}