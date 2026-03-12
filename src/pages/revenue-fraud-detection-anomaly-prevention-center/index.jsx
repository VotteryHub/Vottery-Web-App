import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';


import PayoutManipulationPanel from './components/PayoutManipulationPanel';
import CreatorOverridePanel from './components/CreatorOverridePanel';
import CampaignSplitAbusePanel from './components/CampaignSplitAbusePanel';
import RealtimeAlertEnginePanel from './components/RealtimeAlertEnginePanel';
import MachineLearningPanel from './components/MachineLearningPanel';
import AuditTrailPanel from './components/AuditTrailPanel';
import Icon from '../../components/AppIcon';


const RevenueFraudDetectionAnomalyPreventionCenter = () => {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [fraudStats, setFraudStats] = useState({
    totalAlerts: 0,
    criticalThreats: 0,
    blockedTransactions: 0,
    detectionAccuracy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFraudStatistics();
  }, []);

  const loadFraudStatistics = async () => {
    try {
      setLoading(true);
      // Simulate fraud detection statistics
      setFraudStats({
        totalAlerts: 47,
        criticalThreats: 8,
        blockedTransactions: 23,
        detectionAccuracy: 94.7
      });
    } catch (error) {
      console.error('Error loading fraud statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const panels = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'payout', label: 'Payout Manipulation', icon: DollarSign },
    { id: 'override', label: 'Creator Override', icon: Users },
    { id: 'campaign', label: 'Campaign Split Abuse', icon: TrendingUp },
    { id: 'alerts', label: 'Alert Engine', icon: AlertTriangle },
    { id: 'ml', label: 'ML Detection', icon: Shield },
    { id: 'audit', label: 'Audit Trail', icon: Activity }
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'payout':
        return <PayoutManipulationPanel />;
      case 'override':
        return <CreatorOverridePanel />;
      case 'campaign':
        return <CampaignSplitAbusePanel />;
      case 'alerts':
        return <RealtimeAlertEnginePanel />;
      case 'ml':
        return <MachineLearningPanel />;
      case 'audit':
        return <AuditTrailPanel />;
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
              <p className="text-sm text-gray-600">Total Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{fraudStats?.totalAlerts}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Threats</p>
              <p className="text-3xl font-bold text-red-600">{fraudStats?.criticalThreats}</p>
            </div>
            <Shield className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blocked Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{fraudStats?.blockedTransactions}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Detection Accuracy</p>
              <p className="text-3xl font-bold text-blue-600">{fraudStats?.detectionAccuracy}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Anomaly Detection Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-gray-900">Payout Manipulation Detected</p>
                <p className="text-sm text-gray-600">Suspicious distribution patterns in creator earnings</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">Critical</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-gray-900">Creator Override Exploitation</p>
                <p className="text-sm text-gray-600">Excessive override usage detected for 3 creators</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm font-semibold">High</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Campaign Split Abuse</p>
                <p className="text-sm text-gray-600">Coordinated manipulation attempts in campaign splits</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-semibold">Medium</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Fraud Detection & Anomaly Prevention Center</h1>
          <p className="text-gray-600">Comprehensive monitoring for revenue-split manipulation, creator override exploitation, and campaign split abuse</p>
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

export default RevenueFraudDetectionAnomalyPreventionCenter;