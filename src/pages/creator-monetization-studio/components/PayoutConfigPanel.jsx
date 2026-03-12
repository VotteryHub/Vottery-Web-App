import React, { useState } from 'react';
import { CreditCard, Building, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';

const PayoutConfigPanel = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState('weekly');
  const [minPayout, setMinPayout] = useState('50');

  const handleConnectStripe = async () => {
    setLoading(true);
    // Simulate Stripe Connect OAuth flow
    setTimeout(() => {
      setConnected(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <CreditCard className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Payout Configuration</h2>
          <p className="text-gray-400 text-sm">Manage your bank account and payout schedule</p>
        </div>
      </div>
      {/* Stripe Connect Status */}
      <div className={`rounded-xl border p-5 mb-6 ${
        connected ? 'border-green-500/30 bg-green-500/5' : 'border-gray-700 bg-gray-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              connected ? 'bg-green-500/20' : 'bg-gray-700'
            }`}>
              <Building className={`w-5 h-5 ${connected ? 'text-green-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-white font-medium">Stripe Connect</p>
              <p className="text-gray-400 text-sm">
                {connected ? 'Bank account linked — Chase ****4521' : 'Link your bank account for payouts'}
              </p>
            </div>
          </div>
          {connected ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <button
              onClick={handleConnectStripe}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connecting...</>
              ) : (
                <><ExternalLink className="w-4 h-4" />Connect Bank</>  
              )}
            </button>
          )}
        </div>
      </div>
      {/* Payout Schedule */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Payout Schedule</label>
          <div className="grid grid-cols-3 gap-3">
            {['daily', 'weekly', 'monthly']?.map(s => (
              <button
                key={s}
                onClick={() => setSchedule(s)}
                className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                  schedule === s
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400' :'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Payout Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={minPayout}
              onChange={e => setMinPayout(e?.target?.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-300 text-sm">Payouts are processed within 2-3 business days. Stripe fees (2.9% + $0.30) apply per transaction.</p>
        </div>

        <button
          disabled={!connected}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          Save Payout Settings
        </button>
      </div>
    </div>
  );
};

export default PayoutConfigPanel;
