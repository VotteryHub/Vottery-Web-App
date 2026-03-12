import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import StripeConnectOnboarding from './components/StripeConnectOnboarding';
import TaxDocumentManagement from './components/TaxDocumentManagement';
import SettlementReconciliation from './components/SettlementReconciliation';
import PayoutScheduleConfig from './components/PayoutScheduleConfig';
import PayoutVerificationPanel from './components/PayoutVerificationPanel';

const EnhancedCreatorPayoutDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('onboarding');
  const [stripeStatus, setStripeStatus] = useState('not_connected');
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, paid: 0 });

  useEffect(() => {
    // Simulate loading stripe status
    const savedStatus = localStorage.getItem('stripe_connect_status');
    if (savedStatus) setStripeStatus(savedStatus);
  }, []);

  const tabs = [
    { id: 'onboarding', label: 'Stripe Connect', icon: 'CreditCard' },
    { id: 'tax', label: 'Tax Documents', icon: 'FileText' },
    { id: 'reconciliation', label: 'Settlement Reconciliation', icon: 'BarChart2' },
    { id: 'verification', label: 'Payout Verification', icon: 'CheckCircle' },
    { id: 'schedule', label: 'Payout Schedule', icon: 'Calendar' }
  ];

  const statusConfig = {
    not_connected: { label: 'Not Connected', color: 'text-red-600', bg: 'bg-red-50', icon: 'AlertCircle' },
    pending: { label: 'Verification Pending', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'Clock' },
    active: { label: 'Active & Verified', color: 'text-green-600', bg: 'bg-green-50', icon: 'CheckCircle' }
  };
  const status = statusConfig?.[stripeStatus] || statusConfig?.not_connected;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Enhanced Creator Payout Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Enhanced Creator Payout Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Stripe Connect · Tax Documents · Settlement Reconciliation</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 ${status?.bg} rounded-lg`}>
                <Icon name={status?.icon} size={16} className={status?.color} />
                <span className={`text-sm font-medium ${status?.color}`}>{status?.label}</span>
              </div>
            </div>

            {/* Earnings Overview */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Earnings', value: `$${earnings?.total?.toLocaleString()}`, icon: 'TrendingUp', color: 'text-green-600' },
                { label: 'Pending Payout', value: `$${earnings?.pending?.toLocaleString()}`, icon: 'Clock', color: 'text-yellow-600' },
                { label: 'Paid Out', value: `$${earnings?.paid?.toLocaleString()}`, icon: 'CheckCircle', color: 'text-blue-600' }
              ]?.map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={item?.icon} size={16} className={item?.color} />
                    <span className="text-xs text-muted-foreground">{item?.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${item?.color}`}>{item?.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'onboarding' && (
            <StripeConnectOnboarding
              stripeStatus={stripeStatus}
              onStatusChange={setStripeStatus}
              userId={user?.id}
            />
          )}
          {activeTab === 'tax' && <TaxDocumentManagement userId={user?.id} />}
          {activeTab === 'reconciliation' && <SettlementReconciliation userId={user?.id} />}
          {activeTab === 'verification' && <PayoutVerificationPanel />}
          {activeTab === 'schedule' && <PayoutScheduleConfig userId={user?.id} />}
        </main>
      </div>
    </div>
  );
};

export default EnhancedCreatorPayoutDashboard;
