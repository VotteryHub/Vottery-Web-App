import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import DisputeQueuePanel from './components/DisputeQueuePanel';
import ClaudeIntegrationPanel from './components/ClaudeIntegrationPanel';
import AppealAnalysisPanel from './components/AppealAnalysisPanel';
import ResolutionTemplatesPanel from './components/ResolutionTemplatesPanel';
import DecisionAuditTrailPanel from './components/DecisionAuditTrailPanel';
import BiasDetectionPanel from './components/BiasDetectionPanel';
import claudeDisputeService from '../../services/claudeDisputeService';

function ClaudeAIDisputeModerationCenter() {
  const [activeTab, setActiveTab] = useState('queue');
  const [disputes, setDisputes] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [stats, setStats] = useState({
    totalDisputes: 0,
    pendingAnalysis: 0,
    autoResolved: 0,
    escalated: 0,
    avgConfidence: 0,
    avgResolutionTime: '0h',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [disputesData, appealsData, templatesData] = await Promise.all([
        claudeDisputeService?.getActiveDisputes(),
        claudeDisputeService?.getAppealCases(),
        claudeDisputeService?.getResolutionTemplates(),
      ]);

      setDisputes(disputesData);
      setAppeals(appealsData);
      setTemplates(templatesData);

      // Calculate stats
      const totalDisputes = disputesData?.length;
      const pendingAnalysis = disputesData?.filter(d => d?.status === 'pending_analysis')?.length;
      const autoResolved = disputesData?.filter(d => d?.aiConfidence >= 90)?.length;
      const escalated = disputesData?.filter(d => d?.status === 'escalated')?.length;
      const avgConfidence = disputesData?.reduce((sum, d) => sum + (d?.aiConfidence || 0), 0) / totalDisputes || 0;

      setStats({
        totalDisputes,
        pendingAnalysis,
        autoResolved,
        escalated,
        avgConfidence: Math.round(avgConfidence),
        avgResolutionTime: '4.2h',
      });
    } catch (error) {
      console.error('Failed to load dispute data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeDispute = async (dispute) => {
    try {
      setSelectedDispute(dispute);
      const analysis = await claudeDisputeService?.analyzeDispute({
        type: dispute?.type,
        description: dispute?.description,
        evidence: { provided: true, quality: 'high' },
        parties: dispute?.parties,
        amount: dispute?.amount,
      });

      // Update dispute with analysis
      setDisputes(prev => prev?.map(d => 
        d?.id === dispute?.id 
          ? { ...d, aiAnalysis: analysis?.analysis, status: 'analyzed' }
          : d
      ));
    } catch (error) {
      console.error('Failed to analyze dispute:', error);
    }
  };

  const tabs = [
    { id: 'queue', label: 'Dispute Queue', icon: 'List' },
    { id: 'claude', label: 'Claude Integration', icon: 'Brain' },
    { id: 'appeals', label: 'Appeal Analysis', icon: 'Scale' },
    { id: 'templates', label: 'Resolution Templates', icon: 'FileText' },
    { id: 'audit', label: 'Decision Audit Trail', icon: 'History' },
    { id: 'bias', label: 'Bias Detection', icon: 'Shield' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Icon name="Scale" size={32} className="text-purple-600" />
                Claude AI Dispute Moderation Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Intelligent automated dispute resolution with advanced AI reasoning
              </p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Icon name="RefreshCw" size={18} />
              Refresh Data
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalDisputes}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Disputes</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.pendingAnalysis}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Pending Analysis</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.autoResolved}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Auto-Resolved</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.escalated}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Escalated</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.avgConfidence}%</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Avg Confidence</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats?.avgResolutionTime}</div>
              <div className="text-sm text-indigo-700 dark:text-indigo-300">Avg Resolution</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-purple-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
            <div className="text-center">
              <Icon name="Loader" size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading dispute data...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'queue' && (
              <DisputeQueuePanel 
                disputes={disputes} 
                onAnalyze={handleAnalyzeDispute}
                selectedDispute={selectedDispute}
              />
            )}
            {activeTab === 'claude' && (
              <ClaudeIntegrationPanel 
                disputes={disputes}
                onAnalyze={handleAnalyzeDispute}
              />
            )}
            {activeTab === 'appeals' && (
              <AppealAnalysisPanel appeals={appeals} />
            )}
            {activeTab === 'templates' && (
              <ResolutionTemplatesPanel templates={templates} />
            )}
            {activeTab === 'audit' && (
              <DecisionAuditTrailPanel disputes={disputes} />
            )}
            {activeTab === 'bias' && (
              <BiasDetectionPanel disputes={disputes} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClaudeAIDisputeModerationCenter;