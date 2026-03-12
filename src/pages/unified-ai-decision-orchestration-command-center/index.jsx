import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { unifiedIncidentResponseService } from '../../services/unifiedIncidentResponseService';
import { aiOrchestrationService } from '../../services/aiOrchestrationService';
import MultiAIComparisonPanel from './components/MultiAIComparisonPanel';
import ConsensusPanel from './components/ConsensusPanel';
import OneClickExecutionPanel from './components/OneClickExecutionPanel';
import AutomatedResolutionPanel from './components/AutomatedResolutionPanel';
import PerformanceAnalyticsPanel from './components/PerformanceAnalyticsPanel';

const UnifiedAIDecisionOrchestrationCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('comparison');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalyses, setAiAnalyses] = useState({
    claude: null,
    perplexity: null,
    openai: null,
  });
  const [consensus, setConsensus] = useState(null);
  const [executionStatus, setExecutionStatus] = useState(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const { data, error } = await unifiedIncidentResponseService?.getActiveIncidents({
        status: 'detected',
      });
      if (error) throw error;
      setIncidents(data || []);
      if (data?.length > 0) {
        setSelectedIncident(data?.[0]);
      }
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAllAI = async () => {
    if (!selectedIncident) return;

    setLoading(true);
    setExecutionStatus('analyzing');
    try {
      const [claudeResult, perplexityResult, openaiResult] = await Promise.all([
        unifiedIncidentResponseService?.analyzeIncidentWithClaude(selectedIncident),
        unifiedIncidentResponseService?.analyzeIncidentWithPerplexity(selectedIncident),
        aiOrchestrationService?.analyzeWithOpenAI({
          type: selectedIncident?.incidentType,
          description: selectedIncident?.description,
          data: selectedIncident,
          context: { threatLevel: selectedIncident?.threatLevel },
        }),
      ]);

      setAiAnalyses({
        claude: claudeResult,
        perplexity: perplexityResult,
        openai: openaiResult,
      });

      const consensusResult = await aiOrchestrationService?.getMultiAIConsensus({
        claudeAnalysis: claudeResult?.analysis,
        perplexityAnalysis: perplexityResult?.analysis,
        openaiAnalysis: openaiResult?.analysis,
      });

      setConsensus(consensusResult?.data);
      setExecutionStatus('completed');
    } catch (error) {
      console.error('Error analyzing with AI:', error);
      setExecutionStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const executeOneClick = async () => {
    if (!consensus || !selectedIncident) return;

    setExecutionStatus('executing');
    try {
      await unifiedIncidentResponseService?.executeAutomatedResponse(
        selectedIncident?.id,
        consensus?.recommendation
      );
      setExecutionStatus('executed');
      await loadIncidents();
    } catch (error) {
      console.error('Error executing action:', error);
      setExecutionStatus('execution_failed');
    }
  };

  const tabs = [
    { id: 'comparison', label: 'Multi-AI Comparison', icon: 'GitCompare' },
    { id: 'consensus', label: 'AI Consensus', icon: 'CheckCircle2' },
    { id: 'execution', label: '1-Click Execution', icon: 'Zap' },
    { id: 'automated', label: 'Automated Resolution', icon: 'Bot' },
    { id: 'analytics', label: 'Performance Analytics', icon: 'BarChart3' },
  ];

  return (
    <>
      <Helmet>
        <title>Unified AI Decision Orchestration Command Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Unified AI Decision Orchestration Command Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Multi-AI Decision-Making with Claude, Perplexity & OpenAI
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    3 AI Systems Active
                  </span>
                </div>
                <button
                  onClick={analyzeWithAllAI}
                  disabled={!selectedIncident || loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  <Icon name="Play" size={16} />
                  Analyze All
                </button>
                {consensus && (
                  <button
                    onClick={executeOneClick}
                    disabled={executionStatus === 'executing'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                  >
                    <Icon name="Zap" size={16} />
                    Execute Now
                  </button>
                )}
              </div>
            </div>

            {/* Incident Selector */}
            {incidents?.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Select Incident for Analysis
                </label>
                <select
                  value={selectedIncident?.id || ''}
                  onChange={(e) => {
                    const incident = incidents?.find(i => i?.id === e?.target?.value);
                    setSelectedIncident(incident);
                    setAiAnalyses({ claude: null, perplexity: null, openai: null });
                    setConsensus(null);
                    setExecutionStatus(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {incidents?.map((incident) => (
                    <option key={incident?.id} value={incident?.id}>
                      {incident?.incidentType} - {incident?.threatLevel} - {incident?.description?.substring(0, 50)}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
          {loading && !aiAnalyses?.claude ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'comparison' && (
                <MultiAIComparisonPanel
                  aiAnalyses={aiAnalyses}
                  selectedIncident={selectedIncident}
                  onAnalyze={analyzeWithAllAI}
                />
              )}
              {activeTab === 'consensus' && (
                <ConsensusPanel consensus={consensus} aiAnalyses={aiAnalyses} />
              )}
              {activeTab === 'execution' && (
                <OneClickExecutionPanel
                  selectedIncident={selectedIncident}
                  consensus={consensus}
                  executionStatus={executionStatus}
                  onExecute={executeOneClick}
                />
              )}
              {activeTab === 'automated' && (
                <AutomatedResolutionPanel
                  selectedIncident={selectedIncident}
                  aiAnalyses={aiAnalyses}
                />
              )}
              {activeTab === 'analytics' && <PerformanceAnalyticsPanel />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UnifiedAIDecisionOrchestrationCommandCenter;