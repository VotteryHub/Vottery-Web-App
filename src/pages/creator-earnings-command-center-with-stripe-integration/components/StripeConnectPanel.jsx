import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';


const StripeConnectPanel = () => {
  const { user } = useAuth();
  const [onboardingUrl, setOnboardingUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState('not_connected');

  const handleStartOnboarding = async () => {
    setLoading(true);
    try {
      // Simulate Stripe Connect Express account creation
      await new Promise(r => setTimeout(r, 1000));
      setOnboardingUrl('/stripe-connect-account-linking-interface');
      setAccountStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Icon name="CreditCard" size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Stripe Connect Express</h3>
          <p className="text-sm text-gray-500">Set up your creator payment account</p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            accountStatus === 'active' ? 'bg-green-100 text-green-700' :
            accountStatus === 'pending'? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {accountStatus === 'active' ? 'Active' : accountStatus === 'pending' ? 'Pending Review' : 'Not Connected'}
          </span>
        </div>
      </div>

      {accountStatus === 'not_connected' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-sm text-indigo-700 mb-2">Connect your Stripe account to receive payouts directly to your bank account.</p>
            <ul className="text-xs text-indigo-600 space-y-1">
              <li>• Receive payouts in 135+ currencies</li>
              <li>• Automatic weekly/monthly settlements</li>
              <li>• Tax document management (W-9/W-8BEN)</li>
              <li>• Real-time payout tracking</li>
            </ul>
          </div>
          <Button onClick={handleStartOnboarding} disabled={loading} className="w-full flex items-center justify-center gap-2">
            {loading ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="ExternalLink" size={16} />}
            {loading ? 'Setting up...' : 'Start Stripe Connect Onboarding'}
          </Button>
        </div>
      )}

      {accountStatus === 'pending' && onboardingUrl && (
        <div className="space-y-3">
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-700">Your Stripe Connect application is under review. Complete the remaining steps to activate your account.</p>
          </div>
          <a href={onboardingUrl} className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Icon name="ArrowRight" size={16} />
            Continue Account Setup
          </a>
        </div>
      )}
    </div>
  );
};

const SettlementReconciliation = () => {
  const [payouts] = useState([
    { id: 'PAY-001', amount: 850.00, status: 'matched', date: '2026-02-20', transactions: 12, discrepancy: 0 },
    { id: 'PAY-002', amount: 1240.50, status: 'matched', date: '2026-02-13', transactions: 18, discrepancy: 0 },
    { id: 'PAY-003', amount: 320.75, status: 'unmatched', date: '2026-02-06', transactions: 5, discrepancy: 15.25 },
    { id: 'PAY-004', amount: 2100.00, status: 'pending', date: '2026-01-30', transactions: 28, discrepancy: 0 }
  ]);

  const matched = payouts?.filter(p => p?.status === 'matched');
  const unmatched = payouts?.filter(p => p?.status === 'unmatched');
  const totalDiscrepancy = unmatched?.reduce((sum, p) => sum + p?.discrepancy, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Settlement Reconciliation</h3>
            <p className="text-sm text-gray-500">Matched vs unmatched payouts</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{matched?.length}</p>
          <p className="text-xs text-green-600">Matched</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{unmatched?.length}</p>
          <p className="text-xs text-red-600">Unmatched</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-orange-700">${totalDiscrepancy?.toFixed(2)}</p>
          <p className="text-xs text-orange-600">Discrepancy</p>
        </div>
      </div>

      {/* Payout List */}
      <div className="space-y-2">
        {payouts?.map(payout => (
          <div key={payout?.id} className={`flex items-center justify-between p-3 rounded-lg border ${
            payout?.status === 'matched' ? 'bg-green-50 border-green-200' :
            payout?.status === 'unmatched'? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
          }`}>
            <div>
              <p className="text-sm font-medium text-gray-900">{payout?.id}</p>
              <p className="text-xs text-gray-500">{payout?.date} • {payout?.transactions} transactions</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">${payout?.amount?.toFixed(2)}</p>
              {payout?.discrepancy > 0 && (
                <p className="text-xs text-red-600">-${payout?.discrepancy?.toFixed(2)} discrepancy</p>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                payout?.status === 'matched' ? 'bg-green-100 text-green-700' :
                payout?.status === 'unmatched'? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {payout?.status === 'matched' ? 'Matched' : payout?.status === 'unmatched' ? 'Discrepancy' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { StripeConnectPanel, SettlementReconciliation };
export default StripeConnectPanel;
