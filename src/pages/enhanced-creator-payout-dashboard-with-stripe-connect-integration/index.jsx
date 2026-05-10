import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout 
      title="Creator Payout Dashboard"
      showSidebar={true}
    >
      <div className="w-full py-0">
        {/* Header Action Bar */}
        <div className="bg-card backdrop-blur-xl rounded-3xl border border-border p-8 mb-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Icon name="DollarSign" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground uppercase tracking-tight mb-1">Financial Settlement Center</h1>
              <p className="text-muted-foreground font-medium text-sm">Stripe Connect · Tax Orchestration · Reconciliation</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 px-4 py-3 ${status?.bg?.replace('bg-', 'bg-opacity-10 bg-')} rounded-2xl border ${status?.bg?.replace('bg-', 'border-')}`}>
            <Icon name={status?.icon} size={16} className={status?.color} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${status?.color}`}>{status?.label}</span>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Settled', value: `$${earnings?.total?.toLocaleString()}`, icon: 'TrendingUp', color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/10' },
            { label: 'Pending Liquidity', value: `$${earnings?.pending?.toLocaleString()}`, icon: 'Clock', color: 'text-yellow-400', bg: 'bg-yellow-500/5 border-yellow-500/10' },
            { label: 'Disbursed Capital', value: `$${earnings?.paid?.toLocaleString()}`, icon: 'CheckCircle', color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10' }
          ]?.map((item, i) => (
            <div key={i} className={`${item?.bg} rounded-3xl p-6 border shadow-2xl backdrop-blur-xl hover:bg-white/5 transition-all group`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-lg ${item?.bg} flex items-center justify-center`}>
                  <Icon name={item?.icon} size={16} className={item?.color} />
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item?.label}</span>
              </div>
              <p className={`text-3xl font-black tracking-tight ${item?.color}`}>{item?.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-10 border-b border-border overflow-x-auto pb-px">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default EnhancedCreatorPayoutDashboard;
