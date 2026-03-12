import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Target, Zap, CheckCircle, Users } from 'lucide-react';
import ExperimentDashboard from './components/ExperimentDashboard';
import MultiVariantTestingEngine from './components/MultiVariantTestingEngine';
import StatisticalSignificancePanel from './components/StatisticalSignificancePanel';
import ExperimentConfiguration from './components/ExperimentConfiguration';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import AutomatedOptimization from './components/AutomatedOptimization';
import Icon from '../../components/AppIcon';


const AdvancedABTestingCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeExperiments: 0,
    completedExperiments: 0,
    avgConversionLift: 0,
    significantResults: 0
  });

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      setLoading(true);
      // Mock data for experiments
      const mockExperiments = [
        {
          id: 1,
          name: 'Homepage Hero CTA Test',
          status: 'active',
          variants: 3,
          traffic: 75,
          conversions: 245,
          significance: 95.2,
          winner: null,
          startDate: '2026-01-15',
          sampleSize: 5420
        },
        {
          id: 2,
          name: 'Election Card Layout Optimization',
          status: 'active',
          variants: 4,
          traffic: 100,
          conversions: 892,
          significance: 98.7,
          winner: 'Variant B',
          startDate: '2026-01-10',
          sampleSize: 12340
        },
        {
          id: 3,
          name: 'Gamification Badge Display',
          status: 'completed',
          variants: 2,
          traffic: 100,
          conversions: 1523,
          significance: 99.1,
          winner: 'Variant A',
          startDate: '2025-12-20',
          sampleSize: 8900
        }
      ];

      setExperiments(mockExperiments);
      setStats({
        activeExperiments: mockExperiments?.filter(e => e?.status === 'active')?.length,
        completedExperiments: mockExperiments?.filter(e => e?.status === 'completed')?.length,
        avgConversionLift: 12.4,
        significantResults: mockExperiments?.filter(e => e?.significance > 95)?.length
      });
    } catch (error) {
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'multivariant', label: 'Multi-Variant Testing', icon: Target },
    { id: 'significance', label: 'Statistical Analysis', icon: TrendingUp },
    { id: 'configuration', label: 'Experiment Setup', icon: Zap },
    { id: 'analytics', label: 'Performance Analytics', icon: Users },
    { id: 'optimization', label: 'Auto-Optimization', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                Advanced A/B Testing Command Center
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Multi-variant experiment management with statistical significance testing and automated optimization
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats?.activeExperiments}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Active Tests</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats?.significantResults}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Significant</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Active Experiments</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats?.activeExperiments}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{stats?.completedExperiments}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Avg Conversion Lift</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">+{stats?.avgConversionLift}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Significant Results</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">{stats?.significantResults}</p>
                </div>
                <Target className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' :'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <ExperimentDashboard experiments={experiments} onRefresh={loadExperiments} />}
            {activeTab === 'multivariant' && <MultiVariantTestingEngine experiments={experiments} onRefresh={loadExperiments} />}
            {activeTab === 'significance' && <StatisticalSignificancePanel experiments={experiments} />}
            {activeTab === 'configuration' && <ExperimentConfiguration onRefresh={loadExperiments} />}
            {activeTab === 'analytics' && <PerformanceAnalytics experiments={experiments} />}
            {activeTab === 'optimization' && <AutomatedOptimization experiments={experiments} onRefresh={loadExperiments} />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedABTestingCommandCenter;