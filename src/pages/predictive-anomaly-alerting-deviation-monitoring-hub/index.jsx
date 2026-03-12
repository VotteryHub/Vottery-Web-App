import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Activity, BarChart3, Bell, Settings } from 'lucide-react';
import ActualVsPredictedPanel from './components/ActualVsPredictedPanel';
import DeviationDetectionPanel from './components/DeviationDetectionPanel';
import ConfidenceIntervalPanel from './components/ConfidenceIntervalPanel';
import AlertConfigurationPanel from './components/AlertConfigurationPanel';
import ModelPerformancePanel from './components/ModelPerformancePanel';
import DeviationInvestigationPanel from './components/DeviationInvestigationPanel';
import Icon from '../../components/AppIcon';


const PredictiveAnomalyAlertingDeviationMonitoringHub = () => {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [deviationStats, setDeviationStats] = useState({
    activeAlerts: 0,
    criticalDeviations: 0,
    avgAccuracy: 0,
    totalPredictions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeviationStatistics();
  }, []);

  const loadDeviationStatistics = async () => {
    try {
      setLoading(true);
      // Simulate deviation statistics
      setDeviationStats({
        activeAlerts: 12,
        criticalDeviations: 5,
        avgAccuracy: 91.8,
        totalPredictions: 1247
      });
    } catch (error) {
      console.error('Error loading deviation statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const panels = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'comparison', label: 'Actual vs Predicted', icon: BarChart3 },
    { id: 'deviation', label: 'Deviation Detection', icon: TrendingUp },
    { id: 'confidence', label: 'Confidence Intervals', icon: Activity },
    { id: 'alerts', label: 'Alert System', icon: Bell },
    { id: 'performance', label: 'Model Performance', icon: Settings },
    { id: 'investigation', label: 'Investigation Tools', icon: AlertTriangle }
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'comparison':
        return <ActualVsPredictedPanel />;
      case 'deviation':
        return <DeviationDetectionPanel />;
      case 'confidence':
        return <ConfidenceIntervalPanel />;
      case 'alerts':
        return <AlertConfigurationPanel />;
      case 'performance':
        return <ModelPerformancePanel />;
      case 'investigation':
        return <DeviationInvestigationPanel />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-orange-600">{deviationStats?.activeAlerts}</p>
            </div>
            <Bell className="w-12 h-12 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Deviations</p>
              <p className="text-3xl font-bold text-red-600">{deviationStats?.criticalDeviations}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Accuracy</p>
              <p className="text-3xl font-bold text-green-600">{deviationStats?.avgAccuracy}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Predictions</p>
              <p className="text-3xl font-bold text-blue-600">{deviationStats?.totalPredictions}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deviation Alerts (&gt;15% Threshold)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-600">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-gray-900">Revenue Forecast Deviation</p>
                <p className="text-sm text-gray-600">Actual: $45,230 | Predicted: $38,500 | Deviation: 17.5%</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">Critical</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">User Engagement Prediction</p>
                <p className="text-sm text-gray-600">Actual: 8,920 users | Predicted: 10,450 users | Deviation: -14.6%</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-semibold">High</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Campaign Performance Estimate</p>
                <p className="text-sm text-gray-600">Actual: 12.3% CTR | Predicted: 10.5% CTR | Deviation: 17.1%</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm font-semibold">Medium</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Revenue Forecasts</span>
              <span className="text-blue-600 font-semibold">342 predictions</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">User Engagement</span>
              <span className="text-green-600 font-semibold">478 predictions</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-900">Fraud Patterns</span>
              <span className="text-purple-600 font-semibold">215 predictions</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-900">Campaign Performance</span>
              <span className="text-orange-600 font-semibold">212 predictions</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">15% Deviation Threshold</span>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Real-time Monitoring</span>
              <span className="text-green-600 font-semibold">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Automated Escalation</span>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Stakeholder Notifications</span>
              <span className="text-green-600 font-semibold">Configured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Predictive Anomaly Alerting & Deviation Monitoring Hub</h1>
          <p className="text-gray-600">Real-time comparison between AI forecasting predictions and actual platform metrics with automated alerts for &gt;15% deviations</p>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {panels?.map((panel) => {
            const Icon = panel?.icon;
            return (
              <button
                key={panel?.id}
                onClick={() => setActivePanel(panel?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activePanel === panel?.id
                    ? 'bg-blue-600 text-white' :'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{panel?.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderPanel()
        )}
      </div>
    </div>
  );
};

export default PredictiveAnomalyAlertingDeviationMonitoringHub;