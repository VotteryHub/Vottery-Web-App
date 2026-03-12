import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { claudeModelComparisonService } from '../../services/claudeModelComparisonService';
import PerformanceComparisonPanel from './components/PerformanceComparisonPanel';
import AccuracyMetricsPanel from './components/AccuracyMetricsPanel';
import CostEfficiencyPanel from './components/CostEfficiencyPanel';
import TaskCategoryPanel from './components/TaskCategoryPanel';
import ABTestingPanel from './components/ABTestingPanel';
import ModelRecommendationsPanel from './components/ModelRecommendationsPanel';

const ClaudeModelComparisonCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState('fraud_detection');

  useEffect(() => {
    loadComparisonData();
  }, [selectedTaskType]);

  const loadComparisonData = async () => {
    setLoading(true);
    try {
      const [historyResult, metricsResult] = await Promise.all([
        claudeModelComparisonService?.getComparisonHistory(selectedTaskType, 50),
        claudeModelComparisonService?.getPerformanceMetrics(selectedTaskType)
      ]);

      if (historyResult?.data) setComparisonHistory(historyResult?.data);
      if (metricsResult?.data) setPerformanceMetrics(metricsResult?.data);
    } catch (error) {
      console.error('Load comparison data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTest = async (taskData) => {
    setLoading(true);
    try {
      const { data, error } = await claudeModelComparisonService?.runABTest(taskData, selectedTaskType);
      if (error) throw error;
      loadComparisonData();
    } catch (error) {
      console.error('Run test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Performance Overview', icon: 'BarChart3' },
    { id: 'accuracy', label: 'Accuracy Metrics', icon: 'Target' },
    { id: 'cost', label: 'Cost Efficiency', icon: 'DollarSign' },
    { id: 'tasks', label: 'Task Categories', icon: 'Layers' },
    { id: 'testing', label: 'A/B Testing', icon: 'FlaskConical' },
    { id: 'recommendations', label: 'Model Selection', icon: 'Lightbulb' }
  ];

  const taskTypes = [
    { value: 'fraud_detection', label: 'Fraud Detection', icon: 'ShieldAlert' },
    { value: 'content_moderation', label: 'Content Moderation', icon: 'Shield' },
    { value: 'dispute_resolution', label: 'Dispute Resolution', icon: 'Scale' },
    { value: 'strategic_planning', label: 'Strategic Planning', icon: 'Target' }
  ];

  return (
    <>
      <Helmet>
        <title>Claude Model Comparison Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Icon name="GitCompare" size={28} className="text-blue-600" />
                  Claude Model Comparison Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  A/B Testing: Claude 3.5 Sonnet vs Claude 3 Opus
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedTaskType}
                  onChange={(e) => setSelectedTaskType(e?.target?.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100"
                >
                  {taskTypes?.map(type => (
                    <option key={type?.value} value={type?.value}>
                      {type?.label}
                    </option>
                  ))}
                </select>
                <Button onClick={loadComparisonData} disabled={loading}>
                  <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Model Comparison Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sonnet Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Claude 3.5 Sonnet</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fast & Efficient</p>
                  </div>
                </div>
                {performanceMetrics?.sonnet && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {performanceMetrics?.sonnet?.avgResponseTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Cost</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${performanceMetrics?.sonnet?.avgCost}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Tokens</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {performanceMetrics?.sonnet?.avgTokens}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Opus Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-purple-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Icon name="Brain" size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Claude 3 Opus</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Deep Reasoning</p>
                  </div>
                </div>
                {performanceMetrics?.opus && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {performanceMetrics?.opus?.avgResponseTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Cost</div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        ${performanceMetrics?.opus?.avgCost}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Tokens</div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {performanceMetrics?.opus?.avgTokens}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading && activeTab !== 'testing' ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <PerformanceComparisonPanel
                  metrics={performanceMetrics}
                  history={comparisonHistory}
                />
              )}
              {activeTab === 'accuracy' && (
                <AccuracyMetricsPanel
                  history={comparisonHistory}
                  taskType={selectedTaskType}
                />
              )}
              {activeTab === 'cost' && (
                <CostEfficiencyPanel
                  metrics={performanceMetrics}
                  history={comparisonHistory}
                />
              )}
              {activeTab === 'tasks' && (
                <TaskCategoryPanel
                  history={comparisonHistory}
                  onTaskTypeChange={setSelectedTaskType}
                />
              )}
              {activeTab === 'testing' && (
                <ABTestingPanel
                  taskType={selectedTaskType}
                  onRunTest={handleRunTest}
                  loading={loading}
                />
              )}
              {activeTab === 'recommendations' && (
                <ModelRecommendationsPanel
                  metrics={performanceMetrics}
                  taskType={selectedTaskType}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClaudeModelComparisonCenter;