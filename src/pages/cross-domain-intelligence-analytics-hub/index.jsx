import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { crossDomainIntelligenceService } from '../../services/crossDomainIntelligenceService';
import IntelligenceOverviewPanel from './components/IntelligenceOverviewPanel';
import MultiAICorrelationPanel from './components/MultiAICorrelationPanel';
import PredictiveIntelligencePanel from './components/PredictiveIntelligencePanel';
import StrategicInsightsPanel from './components/StrategicInsightsPanel';
import CustomQueryPanel from './components/CustomQueryPanel';
import ExportReportsPanel from './components/ExportReportsPanel';

const CrossDomainIntelligenceAnalyticsHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState(['financial', 'user_behavior', 'compliance', 'incidents']);

  useEffect(() => {
    loadIntelligence();
  }, [selectedDomains]);

  const loadIntelligence = async () => {
    setLoading(true);
    try {
      const data = await crossDomainIntelligenceService?.consolidateIntelligence(selectedDomains);
      setIntelligence(data);
    } catch (error) {
      console.error('Error loading intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Intelligence Overview', icon: 'BarChart3' },
    { id: 'correlation', label: 'Multi-AI Correlation', icon: 'GitMerge' },
    { id: 'predictive', label: 'Predictive Intelligence', icon: 'TrendingUp' },
    { id: 'strategic', label: 'Strategic Insights', icon: 'Target' },
    { id: 'custom', label: 'Custom Queries', icon: 'Search' },
    { id: 'export', label: 'Export Reports', icon: 'Download' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Cross-Domain Intelligence Analytics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Unified Intelligence from Perplexity, Claude, OpenAI & Platform Analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Icon name="Brain" size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  4 AI Services Active
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <IntelligenceOverviewPanel
                intelligence={intelligence}
                selectedDomains={selectedDomains}
                setSelectedDomains={setSelectedDomains}
                onRefresh={loadIntelligence}
              />
            )}
            {activeTab === 'correlation' && <MultiAICorrelationPanel intelligence={intelligence} />}
            {activeTab === 'predictive' && <PredictiveIntelligencePanel intelligence={intelligence} />}
            {activeTab === 'strategic' && <StrategicInsightsPanel intelligence={intelligence} />}
            {activeTab === 'custom' && <CustomQueryPanel />}
            {activeTab === 'export' && <ExportReportsPanel intelligence={intelligence} />}
          </>
        )}
      </div>
    </div>
  );
};

export default CrossDomainIntelligenceAnalyticsHub;