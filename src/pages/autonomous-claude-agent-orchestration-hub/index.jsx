import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Bot, Workflow, FileSearch, Users, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';

import MultiStepWorkflowPanel from './components/MultiStepWorkflowPanel';
import EvidenceAnalysisPanel from './components/EvidenceAnalysisPanel';
import StakeholderCoordinationPanel from './components/StakeholderCoordinationPanel';
import DecisionTrackingPanel from './components/DecisionTrackingPanel';

import { googleAnalyticsService } from '../../services/googleAnalyticsService';

const AutonomousClaudeAgentOrchestrationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState([]);
  const [workflowStats, setWorkflowStats] = useState(null);
  const [recentExecutions, setRecentExecutions] = useState([]);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    setLoading(true);
    try {
      // Mock data for autonomous agents
      setActiveAgents([
        { id: 1, name: 'Dispute Resolution Agent', status: 'active', executions: 45, successRate: 94 },
        { id: 2, name: 'Fraud Investigation Agent', status: 'active', executions: 32, successRate: 91 },
        { id: 3, name: 'Evidence Analysis Agent', status: 'idle', executions: 28, successRate: 96 },
        { id: 4, name: 'Stakeholder Coordination Agent', status: 'active', executions: 19, successRate: 89 }
      ]);

      setWorkflowStats({
        totalExecutions: 124,
        successfulExecutions: 115,
        averageConfidence: 87,
        averageExecutionTime: '3.2min',
        activeWorkflows: 3
      });

      setRecentExecutions([
        { id: 1, type: 'Dispute Resolution', status: 'completed', confidence: 92, time: '2.8min' },
        { id: 2, type: 'Fraud Investigation', status: 'in_progress', confidence: 85, time: '1.5min' },
        { id: 3, type: 'Evidence Analysis', status: 'completed', confidence: 94, time: '3.1min' }
      ]);

      googleAnalyticsService?.trackUserFlow('claude_agent_hub', 'data_loaded');
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Bot },
    { id: 'workflows', label: 'Multi-Step Workflows', icon: Workflow },
    { id: 'evidence', label: 'Evidence Analysis', icon: FileSearch },
    { id: 'stakeholders', label: 'Stakeholder Coordination', icon: Users },
    { id: 'decisions', label: 'Decision Tracking', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Helmet>
        <title>Autonomous Claude Agent Orchestration Hub | Vottery</title>
      </Helmet>

      <HeaderNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 flex items-center gap-3">
                <Bot className="w-8 h-8 text-purple-600" />
                Autonomous Claude Agent Orchestration Hub
              </h1>
              <p className="text-neutral-600 mt-2">
                Intelligent multi-step dispute resolution and fraud investigation with automated evidence analysis
              </p>
            </div>
            <Button
              onClick={loadAgentData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">Active Agents</span>
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{activeAgents?.filter(a => a?.status === 'active')?.length}</p>
            <p className="text-xs text-neutral-500 mt-1">Currently executing workflows</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">Total Executions</span>
              <Workflow className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{workflowStats?.totalExecutions}</p>
            <p className="text-xs text-neutral-500 mt-1">Workflows completed</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">Avg Confidence</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{workflowStats?.averageConfidence}%</p>
            <p className="text-xs text-neutral-500 mt-1">Decision confidence score</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600 text-sm font-medium">Avg Execution Time</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-800">{workflowStats?.averageExecutionTime}</p>
            <p className="text-xs text-neutral-500 mt-1">Per workflow</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
          <div className="border-b border-neutral-200">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'text-purple-600 border-b-2 border-purple-600' :'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab?.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Active Autonomous Agents</h3>
                  <div className="space-y-3">
                    {activeAgents?.map((agent) => (
                      <div key={agent?.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            agent?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'
                          }`} />
                          <div>
                            <p className="font-medium text-neutral-800">{agent?.name}</p>
                            <p className="text-sm text-neutral-600">
                              {agent?.executions} executions · {agent?.successRate}% success rate
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          agent?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {agent?.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Recent Workflow Executions</h3>
                  <div className="space-y-3">
                    {recentExecutions?.map((execution) => (
                      <div key={execution?.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-200">
                        <div className="flex items-center gap-3">
                          {execution?.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : execution?.status === 'in_progress' ? (
                            <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                          )}
                          <div>
                            <p className="font-medium text-neutral-800">{execution?.type}</p>
                            <p className="text-sm text-neutral-600">
                              Confidence: {execution?.confidence}% · Time: {execution?.time}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          execution?.status === 'completed' ? 'bg-green-100 text-green-700' :
                          execution?.status === 'in_progress'? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {execution?.status?.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workflows' && <MultiStepWorkflowPanel />}
            {activeTab === 'evidence' && <EvidenceAnalysisPanel />}
            {activeTab === 'stakeholders' && <StakeholderCoordinationPanel />}
            {activeTab === 'decisions' && <DecisionTrackingPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousClaudeAgentOrchestrationHub;