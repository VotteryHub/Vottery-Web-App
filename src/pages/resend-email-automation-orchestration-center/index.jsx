import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react';
import EmailDashboardPanel from './components/EmailDashboardPanel';
import ComplianceReportingPanel from './components/ComplianceReportingPanel';
import DisputeNotificationPanel from './components/DisputeNotificationPanel';
import MLFeedbackAlertsPanel from './components/MLFeedbackAlertsPanel';
import AutonomousAgentIntegrationPanel from './components/AutonomousAgentIntegrationPanel';
import DeliveryAnalyticsPanel from './components/DeliveryAnalyticsPanel';

const ResendEmailAutomationOrchestrationCenter = () => {
  const [dashboardStats, setDashboardStats] = useState({
    activeCampaigns: 24,
    deliveryRate: 98.7,
    totalSent: 12847,
    pendingQueue: 156,
    avgDeliveryTime: '2.3s',
    engagementRate: 76.4
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate real-time updates
      setDashboardStats(prev => ({
        ...prev,
        totalSent: prev?.totalSent + Math.floor(Math.random() * 5),
        pendingQueue: Math.max(0, prev?.pendingQueue - Math.floor(Math.random() * 3))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Resend Email Automation Orchestration Center
            </h1>
            <p className="text-gray-600">
              Automated Stakeholder Communications Across Autonomous Agent Workflows
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <Send className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">
              Active • Updated {lastUpdate?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.activeCampaigns}</div>
          <div className="text-sm text-gray-600">Active Campaigns</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">SUCCESS</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.deliveryRate}%</div>
          <div className="text-sm text-gray-600">Delivery Rate</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Send className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">TOTAL</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.totalSent?.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Sent</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">QUEUE</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.pendingQueue}</div>
          <div className="text-sm text-gray-600">Pending Queue</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">AVG</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.avgDeliveryTime}</div>
          <div className="text-sm text-gray-600">Avg Delivery Time</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-teal-600" />
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">RATE</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.engagementRate}%</div>
          <div className="text-sm text-gray-600">Engagement Rate</div>
        </div>
      </div>

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EmailDashboardPanel />
        <ComplianceReportingPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DisputeNotificationPanel />
        <MLFeedbackAlertsPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutonomousAgentIntegrationPanel />
        <DeliveryAnalyticsPanel />
      </div>
    </div>
  );
};

export default ResendEmailAutomationOrchestrationCenter;