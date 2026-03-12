import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Activity, RefreshCw } from 'lucide-react';
import OutcomeCapturePanel from './components/OutcomeCapturePanel';
import AppealAnalysisPanel from './components/AppealAnalysisPanel';
import FraudModelPerformancePanel from './components/FraudModelPerformancePanel';
import AutomatedLearningLoopPanel from './components/AutomatedLearningLoopPanel';
import ModelVersionControlPanel from './components/ModelVersionControlPanel';
import LearningEffectivenessPanel from './components/LearningEffectivenessPanel';

const ContinuousMLFeedbackOutcomeLearningCenter = () => {
  const [modelMetrics, setModelMetrics] = useState({
    accuracyImprovement: 0,
    learningCycles: 0,
    outcomesCaptured: 0,
    modelVersion: '1.0.0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelMetrics();
  }, []);

  const fetchModelMetrics = async () => {
    try {
      setLoading(true);
      // Simulated metrics - integrate with actual ML service
      setTimeout(() => {
        setModelMetrics({
          accuracyImprovement: 12.5,
          learningCycles: 847,
          outcomesCaptured: 15234,
          modelVersion: '2.3.1'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching model metrics:', error);
      setLoading(false);
    }
  };

  const handleRefreshMetrics = () => {
    fetchModelMetrics();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Continuous ML Feedback & Outcome Learning Center
              </h1>
              <p className="text-gray-600 mt-1">
                Automated machine learning refinement through real-world performance feedback
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshMetrics}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Accuracy Improvement</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">
                +{modelMetrics?.accuracyImprovement}%
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Learning Cycles</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">
                {modelMetrics?.learningCycles?.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Total completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Outcomes Captured</span>
              <CheckCircle className="w-5 h-5 text-purple-500" />
            </div>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">
                {modelMetrics?.outcomesCaptured?.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Real-world results</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Model Version</span>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">
                v{modelMetrics?.modelVersion}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Current active</p>
          </div>
        </div>
      </div>
      {/* Main Content Panels */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Outcome Capture & Appeal Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OutcomeCapturePanel />
          <AppealAnalysisPanel />
        </div>

        {/* Fraud Model Performance */}
        <FraudModelPerformancePanel />

        {/* Automated Learning Loop */}
        <AutomatedLearningLoopPanel />

        {/* Model Version Control & Learning Effectiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModelVersionControlPanel />
          <LearningEffectivenessPanel />
        </div>
      </div>
    </div>
  );
};

export default ContinuousMLFeedbackOutcomeLearningCenter;