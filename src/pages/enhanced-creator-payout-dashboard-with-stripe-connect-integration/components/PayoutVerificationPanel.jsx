import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';


const PayoutVerificationPanel = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [showAdjustForm, setShowAdjustForm] = useState(null);
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');

  useEffect(() => {
    loadPayoutHistory();
  }, [user?.id]);

  const loadPayoutHistory = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        ?.from('creator_payouts')
        ?.select('*')
        ?.eq('creator_id', user?.id || 'demo')
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      const mockPayouts = [
        { id: '1', period: 'Jan 2026', expectedAmount: 1250.00, actualAmount: 1250.00, status: 'reconciled', paidAt: new Date(Date.now() - 30 * 86400000)?.toISOString(), source: 'elections' },
        { id: '2', period: 'Dec 2025', expectedAmount: 980.50, actualAmount: 945.20, status: 'discrepancy', paidAt: new Date(Date.now() - 60 * 86400000)?.toISOString(), source: 'elections' },
        { id: '3', period: 'Nov 2025', expectedAmount: 1100.00, actualAmount: 1100.00, status: 'reconciled', paidAt: new Date(Date.now() - 90 * 86400000)?.toISOString(), source: 'marketplace' },
        { id: '4', period: 'Oct 2025', expectedAmount: 750.00, actualAmount: 750.00, status: 'reconciled', paidAt: new Date(Date.now() - 120 * 86400000)?.toISOString(), source: 'elections' },
        { id: '5', period: 'Sep 2025', expectedAmount: 620.00, actualAmount: 580.00, status: 'discrepancy', paidAt: new Date(Date.now() - 150 * 86400000)?.toISOString(), source: 'elections' },
      ];

      const payoutData = data || mockPayouts;
      setPayouts(payoutData);

      // Detect discrepancies
      const disc = payoutData?.filter(p => {
        const expected = p?.expectedAmount || p?.expected_amount || 0;
        const actual = p?.actualAmount || p?.actual_amount || 0;
        return Math.abs(expected - actual) > 0.01;
      });
      setDiscrepancies(disc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdjustment = async (payoutId) => {
    try {
      await supabase?.from('payout_adjustment_requests')?.insert({
        payout_id: payoutId,
        creator_id: user?.id,
        requested_amount: parseFloat(adjustmentAmount),
        note: adjustmentNote,
        status: 'pending',
        created_at: new Date()?.toISOString()
      });
      setShowAdjustForm(null);
      setAdjustmentNote('');
      setAdjustmentAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusConfig = (status) => {
    if (status === 'reconciled') return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Reconciled' };
    if (status === 'discrepancy') return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Discrepancy' };
    return { icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Pending' };
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <p className="text-xs text-gray-500">Reconciled</p>
          <p className="text-2xl font-bold text-green-600">{payouts?.filter(p => p?.status === 'reconciled')?.length}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
          <p className="text-xs text-gray-500">Discrepancies</p>
          <p className="text-2xl font-bold text-red-600">{discrepancies?.length}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Discrepancy</p>
          <p className="text-2xl font-bold text-blue-600">
            ${discrepancies?.reduce((s, p) => s + Math.abs((p?.expectedAmount || p?.expected_amount || 0) - (p?.actualAmount || p?.actual_amount || 0)), 0)?.toFixed(2)}
          </p>
        </div>
      </div>
      {/* Discrepancy Alerts */}
      {discrepancies?.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-800 dark:text-red-300">{discrepancies?.length} Payout Discrepancies Detected</h4>
          </div>
          <div className="space-y-2">
            {discrepancies?.map(d => (
              <div key={d?.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{d?.period}</span>
                  <span className="text-xs text-red-600 ml-2">
                    Expected: ${(d?.expectedAmount || d?.expected_amount || 0)?.toFixed(2)} vs Actual: ${(d?.actualAmount || d?.actual_amount || 0)?.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setShowAdjustForm(d?.id)}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Request Adjustment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Payout History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Payout History & Reconciliation
          </h4>
        </div>
        {loading ? (
          <div className="p-6 text-center">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {payouts?.map(payout => {
              const config = getStatusConfig(payout?.status);
              const Icon = config?.icon;
              const expected = payout?.expectedAmount || payout?.expected_amount || 0;
              const actual = payout?.actualAmount || payout?.actual_amount || 0;
              const diff = actual - expected;

              return (
                <div key={payout?.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${config?.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${config?.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{payout?.period}</p>
                        <p className="text-xs text-gray-500">{payout?.source} · {new Date(payout.paidAt || payout.paid_at || payout.created_at)?.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Expected</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">${expected?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Actual</p>
                          <p className={`text-sm font-bold ${diff < 0 ? 'text-red-600' : 'text-green-600'}`}>${actual?.toFixed(2)}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config?.bg} ${config?.color}`}>
                          {config?.label}
                        </span>
                      </div>
                      {diff !== 0 && (
                        <p className={`text-xs mt-1 ${diff < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {diff < 0 ? '-' : '+'}${Math.abs(diff)?.toFixed(2)} difference
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Adjustment Form */}
                  {showAdjustForm === payout?.id && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Manual Adjustment</p>
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Requested amount ($)"
                          value={adjustmentAmount}
                          onChange={e => setAdjustmentAmount(e?.target?.value)}
                          className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
                        />
                        <textarea
                          placeholder="Reason for adjustment..."
                          value={adjustmentNote}
                          onChange={e => setAdjustmentNote(e?.target?.value)}
                          rows={2}
                          className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 resize-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleSubmitAdjustment(payout?.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">Submit Request</button>
                          <button onClick={() => setShowAdjustForm(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutVerificationPanel;
