import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { claudeRecommendationsService } from '../../services/claudeRecommendationsService';
import { useAuth } from '../../contexts/AuthContext';
import RecommendationCard from './components/RecommendationCard';
import ContextAnalysisPanel from './components/ContextAnalysisPanel';
import ApprovalHistoryPanel from './components/ApprovalHistoryPanel';
import SuccessMetricsPanel from './components/SuccessMetricsPanel';

const ContextAwareClaudeRecommendationsOverlay = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendations, setRecommendations] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayPosition, setOverlayPosition] = useState({ bottom: 16, right: 16 });
  const [selectedScreen, setSelectedScreen] = useState('admin-control-center');

  useEffect(() => {
    loadRecommendations();
    loadApprovalHistory();
  }, [selectedScreen]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const screenContext = {
        screenName: selectedScreen,
        userRole: userProfile?.role || 'admin',
        currentData: {
          activeUsers: 12847,
          liveElections: 34,
          pendingApprovals: 18,
          revenueToday: 45892
        },
        recentActivity: {
          lastAction: 'Approved election',
          timestamp: new Date()?.toISOString()
        }
      };

      const { data, error } = await claudeRecommendationsService?.generateContextualRecommendations(screenContext);
      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Load recommendations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApprovalHistory = async () => {
    try {
      const { data, error } = await claudeRecommendationsService?.getApprovalHistory(userProfile?.id);
      if (error) throw error;
      setApprovalHistory(data || []);
    } catch (error) {
      console.error('Load approval history error:', error);
    }
  };

  const handleApproval = async (recommendation) => {
    try {
      const { data, error } = await claudeRecommendationsService?.executeOneClickApproval(
        recommendation,
        userProfile?.id
      );
      if (error) throw error;
      loadApprovalHistory();
    } catch (error) {
      console.error('Approval error:', error);
    }
  };

  const tabs = [
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' },
    { id: 'context', label: 'Context Analysis', icon: 'Brain' },
    { id: 'history', label: 'Approval History', icon: 'History' },
    { id: 'metrics', label: 'Success Metrics', icon: 'TrendingUp' }
  ];

  const screenOptions = [
    { value: 'admin-control-center', label: 'Admin Control Center' },
    { value: 'campaign-management', label: 'Campaign Management' },
    { value: 'content-moderation', label: 'Content Moderation' },
    { value: 'fraud-detection', label: 'Fraud Detection' },
    { value: 'creator-earnings', label: 'Creator Earnings' }
  ];

  return (
    <>
      <Helmet>
        <title>Context-Aware Claude Recommendations | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Icon name="Sparkles" size={28} className="text-purple-600" />
                  Context-Aware Claude Recommendations
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  AI-Powered Optimization with 1-Click Approval
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedScreen}
                  onChange={(e) => setSelectedScreen(e?.target?.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100"
                >
                  {screenOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
                <Button onClick={loadRecommendations} disabled={loading}>
                  <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab?.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
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
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
                </div>
              ) : recommendations?.length > 0 ? (
                recommendations?.map((rec, index) => (
                  <RecommendationCard
                    key={index}
                    recommendation={rec}
                    onApprove={handleApproval}
                  />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                  <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No recommendations available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'context' && <ContextAnalysisPanel screenName={selectedScreen} />}
          {activeTab === 'history' && <ApprovalHistoryPanel history={approvalHistory} />}
          {activeTab === 'metrics' && <SuccessMetricsPanel history={approvalHistory} />}
        </div>

        {/* Floating Overlay Demo */}
        {overlayVisible && (
          <div
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-purple-500 p-4 w-80"
            style={{ bottom: `${overlayPosition?.bottom}px`, right: `${overlayPosition?.right}px` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Icon name="Sparkles" size={16} className="text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Claude Suggests</span>
              </div>
              <button
                onClick={() => setOverlayVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                <strong>Optimize Campaign Budget</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Reallocate 15% from low-performing zones to high-engagement areas
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 dark:text-green-400 font-semibold">+23% ROI</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">92% Confidence</span>
              </div>
            </div>
            <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <Icon name="Zap" size={14} />
              Approve & Execute
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ContextAwareClaudeRecommendationsOverlay;