import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, AlertCircle, RefreshCw, Download, Filter } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import SubscriptionOverviewPanel from './components/SubscriptionOverviewPanel';
import RevenueAnalyticsPanel from './components/RevenueAnalyticsPanel';
import CustomerLifecyclePanel from './components/CustomerLifecyclePanel';
import SubscriptionPerformancePanel from './components/SubscriptionPerformancePanel';
import PaymentAnalyticsPanel from './components/PaymentAnalyticsPanel';
import ForecastingPanel from './components/ForecastingPanel';

const AdminSubscriptionAnalyticsHub = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [analytics, setAnalytics] = useState(null);
  const [lifecycleMetrics, setLifecycleMetrics] = useState(null);
  const [paymentAnalytics, setPaymentAnalytics] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = new Date()?.toISOString();
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000)?.toISOString();

      const [analyticsRes, lifecycleRes, paymentRes] = await Promise.all([
        subscriptionService?.getSubscriptionAnalytics(startDate, endDate),
        subscriptionService?.getCustomerLifecycleMetrics(),
        subscriptionService?.getPaymentAnalytics(startDate, endDate)
      ]);

      if (analyticsRes?.data) setAnalytics(analyticsRes?.data);
      if (lifecycleRes?.data) setLifecycleMetrics(lifecycleRes?.data);
      if (paymentRes?.data) setPaymentAnalytics(paymentRes?.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const handleExport = () => {
    const exportData = {
      analytics,
      lifecycleMetrics,
      paymentAnalytics,
      exportDate: new Date()?.toISOString(),
      dateRange: `${dateRange} days`
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscription-analytics-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading subscription analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription Analytics Hub</h1>
            <p className="text-gray-600">Comprehensive subscription business intelligence and revenue tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          <div className="flex gap-2">
            {['7', '30', '90', '180', '365']?.map((days) => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === days
                    ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {days === '365' ? '1 Year' : `${days} Days`}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">MRR</span>
          </div>
          <div className="text-3xl font-bold mb-1">${analytics?.mrr || '0.00'}</div>
          <p className="text-sm opacity-80">Monthly Recurring Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Active</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analytics?.activeSubscriptions || 0}</div>
          <p className="text-sm opacity-80">Active Subscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">ARPU</span>
          </div>
          <div className="text-3xl font-bold mb-1">${analytics?.arpu || '0.00'}</div>
          <p className="text-sm opacity-80">Average Revenue Per User</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Churn</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analytics?.churnRate || '0.00'}%</div>
          <p className="text-sm opacity-80">Churn Rate</p>
        </div>
      </div>
      {/* Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SubscriptionOverviewPanel analytics={analytics} />
        <RevenueAnalyticsPanel analytics={analytics} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CustomerLifecyclePanel metrics={lifecycleMetrics} />
        <SubscriptionPerformancePanel analytics={analytics} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PaymentAnalyticsPanel paymentAnalytics={paymentAnalytics} />
        <ForecastingPanel analytics={analytics} lifecycleMetrics={lifecycleMetrics} />
      </div>
    </div>
  );
};

export default AdminSubscriptionAnalyticsHub;