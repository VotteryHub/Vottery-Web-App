import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



import MachineLearningDetectionPanel from './components/MachineLearningDetectionPanel';
import BehavioralAnalysisPanel from './components/BehavioralAnalysisPanel';
import RealTimeThreatAssessmentPanel from './components/RealTimeThreatAssessmentPanel';
import AutomatedPreventionPanel from './components/AutomatedPreventionPanel';
import ThreatIntelligencePanel from './components/ThreatIntelligencePanel';
import AdvancedFeaturesPanel from './components/AdvancedFeaturesPanel';
import FraudPreventionRulesPanel from './components/FraudPreventionRulesPanel';

const AdvancedAIFraudPreventionCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fraudMetrics, setFraudMetrics] = useState({
    totalDetections: 0,
    criticalThreats: 0,
    preventedAttacks: 0,
    aiConfidenceScore: 0
  });
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadFraudMetrics();
    const interval = setInterval(() => {
      loadFraudMetrics();
      setLastUpdate(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadFraudMetrics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual service calls
      setFraudMetrics({
        totalDetections: Math.floor(Math.random() * 500) + 100,
        criticalThreats: Math.floor(Math.random() * 20) + 5,
        preventedAttacks: Math.floor(Math.random() * 150) + 50,
        aiConfidenceScore: (Math.random() * 20 + 80)?.toFixed(1)
      });
      
      setRealtimeAlerts([
        {
          id: 1,
          type: 'critical',
          title: 'Vote Manipulation Detected',
          description: 'Coordinated voting pattern from 15 accounts',
          timestamp: new Date(Date.now() - 120000),
          confidence: 94.5,
          status: 'active'
        },
        {
          id: 2,
          type: 'high',
          title: 'Account Farming Pattern',
          description: 'Multiple accounts created from same IP',
          timestamp: new Date(Date.now() - 300000),
          confidence: 87.2,
          status: 'investigating'
        },
        {
          id: 3,
          type: 'medium',
          title: 'Behavioral Anomaly',
          description: 'Unusual voting velocity detected',
          timestamp: new Date(Date.now() - 600000),
          confidence: 76.8,
          status: 'monitoring'
        }
      ]);
    } catch (error) {
      console.error('Error loading fraud metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Shield' },
    { id: 'ml-detection', label: 'ML Detection', icon: 'Brain' },
    { id: 'behavioral', label: 'Behavioral Analysis', icon: 'Activity' },
    { id: 'threat-assessment', label: 'Threat Assessment', icon: 'AlertTriangle' },
    { id: 'prevention', label: 'Prevention Actions', icon: 'Lock' },
    { id: 'rules-engine', label: 'Rules Engine', icon: 'Settings' },
    { id: 'threat-intel', label: 'Threat Intelligence', icon: 'Globe' },
    { id: 'advanced', label: 'Advanced Features', icon: 'Zap' },
  ];

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-700 bg-clip-text text-transparent mb-2">
                  Advanced AI Fraud Prevention Command Center
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Multi-layered fraud detection with machine learning, behavioral analysis, and real-time threat assessment
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
                  onClick={loadFraudMetrics}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Shield" size={32} className="text-red-600" />
                  <span className="text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {fraudMetrics?.totalDetections}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Detections (24h)</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="AlertTriangle" size={32} className="text-orange-600" />
                  <span className="text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                    Critical
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {fraudMetrics?.criticalThreats}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critical Threats</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Lock" size={32} className="text-green-600" />
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    Automated
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {fraudMetrics?.preventedAttacks}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prevented Attacks</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Brain" size={32} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                    AI Powered
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {fraudMetrics?.aiConfidenceScore}%
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI Confidence Score</p>
              </div>
            </div>

            {/* Real-time Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Icon name="Bell" size={24} className="mr-2 text-red-600" />
                  Real-time Threat Alerts
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Updates every 10 seconds
                </span>
              </div>
              <div className="space-y-3">
                {realtimeAlerts?.map((alert) => (
                  <div
                    key={alert?.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-2 h-2 rounded-full ${getAlertColor(alert?.type)} mt-2 animate-pulse`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{alert?.title}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(alert?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert?.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Confidence: {alert?.confidence}%
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          alert?.status === 'active' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          alert?.status === 'investigating'? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {alert?.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                  </div>
                ))}
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
                      ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
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
                  Fraud Prevention Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comprehensive multi-layered fraud detection system combining OpenAI pattern recognition,
                  Claude behavioral analysis, and Perplexity threat intelligence for real-time protection
                  across all platform operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <Icon name="Brain" size={32} className="text-red-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Machine Learning Detection
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Advanced pattern recognition for vote manipulation, account farming, and coordinated
                      inauthentic behavior with confidence scoring.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Icon name="Users" size={32} className="text-purple-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Behavioral Analysis
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      User interaction patterns, device fingerprinting, IP correlation, and velocity checks
                      with risk scoring algorithms.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Icon name="Shield" size={32} className="text-blue-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Real-time Threat Assessment
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Emerging fraud vectors, attack pattern evolution, and predictive modeling with
                      automated alert distribution.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Icon name="Lock" size={32} className="text-green-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Automated Prevention
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automated response triggers, manual override controls, and comprehensive analytics
                      for continuous optimization.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'ml-detection' && <MachineLearningDetectionPanel />}
            {activeTab === 'behavioral' && <BehavioralAnalysisPanel />}
            {activeTab === 'threats' && <RealTimeThreatAssessmentPanel />}
            {activeTab === 'prevention' && <AutomatedPreventionPanel />}
            {activeTab === 'rules-engine' && <FraudPreventionRulesPanel />}
            {activeTab === 'threat-intel' && <ThreatIntelligencePanel />}
            {activeTab === 'advanced' && <AdvancedFeaturesPanel />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdvancedAIFraudPreventionCommandCenter;