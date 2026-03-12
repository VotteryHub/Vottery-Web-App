import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DetectionAccuracyPanel from './components/DetectionAccuracyPanel';
import FeedbackLoopEnginePanel from './components/FeedbackLoopEnginePanel';
import FalsePositiveAnalysisPanel from './components/FalsePositiveAnalysisPanel';
import RealTimeLearningPanel from './components/RealTimeLearningPanel';
import AlgorithmPerformancePanel from './components/AlgorithmPerformancePanel';
import { mlModelTrainingService } from '../../services/mlModelTrainingService';

import { analytics } from '../../hooks/useGoogleAnalytics';

const AutoImprovingFraudDetectionIntelligenceCenter = () => {
  const [activeTab, setActiveTab] = useState('accuracy');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [intelligenceData, setIntelligenceData] = useState({
    accuracy: null,
    feedbackLoop: null,
    falsePositives: null,
    realTimeLearning: null,
    performance: null
  });

  useEffect(() => {
    loadIntelligenceData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshData();
      }, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    analytics?.trackEvent('auto_improving_fraud_detection_viewed', {
      active_tab: activeTab,
      auto_refresh: autoRefresh,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, autoRefresh]);

  const loadIntelligenceData = async () => {
    try {
      setLoading(true);
      
      const performanceResult = await mlModelTrainingService?.getModelPerformance();

      const mockAccuracyData = {
        currentAccuracy: 94.7,
        previousAccuracy: 92.3,
        improvementRate: 2.4,
        falsePositiveRate: 2.1,
        falseNegativeRate: 1.8,
        confidenceScore: 0.96,
        totalPredictions: 45823,
        correctPredictions: 43398
      };

      const mockFeedbackData = {
        totalIncidents: 1247,
        resolvedIncidents: 1189,
        feedbackProcessed: 1156,
        algorithmUpdates: 34,
        learningRate: 0.87,
        lastUpdate: new Date()?.toISOString()
      };

      const mockFalsePositiveData = {
        totalFalsePositives: 962,
        correctedCases: 894,
        rootCauses: [
          { cause: 'Velocity threshold too strict', count: 342, percentage: 35.5 },
          { cause: 'Geographic pattern mismatch', count: 287, percentage: 29.8 },
          { cause: 'Behavioral anomaly false trigger', count: 198, percentage: 20.6 },
          { cause: 'Temporal pattern misclassification', count: 135, percentage: 14.1 }
        ],
        correctionProtocols: 23,
        biasDetected: 4
      };

      const mockLearningData = {
        liveUpdates: 127,
        patternImprovements: 89,
        thresholdOptimizations: 56,
        performanceBenchmarks: [
          { metric: 'Detection Speed', current: 142, baseline: 180, improvement: 21.1 },
          { metric: 'Accuracy', current: 94.7, baseline: 92.3, improvement: 2.6 },
          { metric: 'False Positive Rate', current: 2.1, baseline: 4.8, improvement: 56.3 }
        ]
      };

      setIntelligenceData({
        accuracy: mockAccuracyData,
        feedbackLoop: mockFeedbackData,
        falsePositives: mockFalsePositiveData,
        realTimeLearning: mockLearningData,
        performance: performanceResult?.data || []
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadIntelligenceData();
    setRefreshing(false);
  };

  const tabs = [
    { id: 'accuracy', label: 'Detection Accuracy', icon: 'Target' },
    { id: 'feedback', label: 'Feedback Loop Engine', icon: 'RefreshCw' },
    { id: 'false-positives', label: 'False Positive Analysis', icon: 'AlertCircle' },
    { id: 'learning', label: 'Real-Time Learning', icon: 'TrendingUp' },
    { id: 'performance', label: 'Algorithm Performance', icon: 'Activity' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Auto-Improving Fraud Detection Intelligence Center | Adaptive Security</title>
      </Helmet>
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Auto-Improving Fraud Detection Intelligence Center
              </h1>
              <p className="text-muted-foreground">
                Machine learning algorithms with real-time feedback loops from incident resolution outcomes and false positive tracking for continuous detection enhancement
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Clock" className="w-4 h-4" />
                <span>Updated: {lastUpdated?.toLocaleTimeString()}</span>
              </div>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <Icon name={refreshing ? 'Loader' : 'RefreshCw'} className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
              >
                <Icon name="Zap" className="w-4 h-4 mr-2" />
                Auto-Refresh {autoRefresh ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon name={tab?.icon} className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader" className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'accuracy' && (
              <DetectionAccuracyPanel data={intelligenceData?.accuracy} />
            )}
            {activeTab === 'feedback' && (
              <FeedbackLoopEnginePanel data={intelligenceData?.feedbackLoop} />
            )}
            {activeTab === 'false-positives' && (
              <FalsePositiveAnalysisPanel data={intelligenceData?.falsePositives} />
            )}
            {activeTab === 'learning' && (
              <RealTimeLearningPanel data={intelligenceData?.realTimeLearning} />
            )}
            {activeTab === 'performance' && (
              <AlgorithmPerformancePanel data={intelligenceData?.performance} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AutoImprovingFraudDetectionIntelligenceCenter;