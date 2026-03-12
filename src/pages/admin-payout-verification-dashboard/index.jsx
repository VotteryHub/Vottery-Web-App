import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, AlertTriangle, RefreshCw, FileText, Filter, DollarSign } from 'lucide-react';

const AdminPayoutVerificationDashboard = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [showAdjustForm, setShowAdjustForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAllPayouts();
  }, []);

  const loadAllPayouts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('creator_payouts')
        ?.select('*, user_profiles(name, username, avatar)')
        ?.order('created_at', { ascending: false })
        ?.limit(100);

      if (error) throw error;

      const payoutList = data || [
        { id: '1', creator_id: 'c1', period: 'Jan 2026', expected_amount: 1250, actual_amount: 1250, status: 'reconciled', user_profiles: { name: 'Creator A', username: 'creatA' } },
        { id: '2', creator_id: 'c2', period: 'Dec 2025', expected_amount: 980.5, actual_amount: 945.2, status: 'discrepancy', user_profiles: { name: 'Creator B', username: 'creatB' } },
        { id: '3', creator_id: 'c3', period: 'Nov 2025', expected_amount: 1100, actual_amount: 1100, status: 'reconciled', user_profiles: { name: 'Creator C', username: 'creatC' } },
      ];

      setPayouts(payoutList);

      const disc = payoutList?.filter(p => {
        const exp = p?.expected_amount ?? p?.expectedAmount ?? 0;
        const act = p?.actual_amount ?? p?.actualAmount ?? 0;
        return Math.abs(exp - act) > 0.01;
      });
      setDiscrepancies(disc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAdjustment = async (payoutId, creatorId) => {
    try {
      setSaving(true);
      await supabase?.from('payout_adjustments')?.insert({
        payout_id: payoutId,
        creator_id: creatorId,
        admin_id: user?.id,
        requested_amount: parseFloat(adjustmentAmount),
        note: adjustmentNote,
        status: 'applied',
        created_at: new Date()?.toISOString(),
      });
      setShowAdjustForm(null);
      setAdjustmentNote('');
      setAdjustmentAmount('');
      loadAllPayouts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredPayouts = filterStatus === 'all'
    ? payouts
    : filterStatus === 'discrepancy'
      ? discrepancies
      : payouts?.filter(p => (p?.status || (Math.abs((p?.expected_amount ?? p?.expectedAmount ?? 0) - (p?.actual_amount ?? p?.actualAmount ?? 0)) > 0.01 ? 'discrepancy' : 'reconciled')) === filterStatus);

  const getStatusConfig = (p) => {
    const exp = p?.expected_amount ?? p?.expectedAmount ?? 0;
    const act = p?.actual_amount ?? p?.actualAmount ?? 0;
    const isDisc = Math.abs(exp - act) > 0.01;
    if (isDisc) return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Discrepancy' };
    return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Reconciled' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Payout Verification Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Admin Payout Verification Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Reconciliation, discrepancy detection, and manual adjustments across all creators</p>
                </div>
              </div>
              <button
                onClick={loadAllPayouts}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={16} className="text-blue-600" />
                  <span className="text-xs text-muted-foreground">Total Payouts</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{payouts?.length}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-xs text-muted-foreground">Reconciled</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{payouts?.filter(p => Math.abs((p?.expected_amount ?? p?.expectedAmount ?? 0) - (p?.actual_amount ?? p?.actualAmount ?? 0)) <= 0.01)?.length}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span className="text-xs text-muted-foreground">Discrepancies</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{discrepancies?.length}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={16} className="text-amber-600" />
                  <span className="text-xs text-muted-foreground">Total Discrepancy $</span>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  ${discrepancies?.reduce((s, p) => s + Math.abs((p?.expected_amount ?? p?.expectedAmount ?? 0) - (p?.actual_amount ?? p?.actualAmount ?? 0)), 0)?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Filter size={18} className="text-muted-foreground mt-1" />
              {['all', 'reconciled', 'discrepancy']?.map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    filterStatus === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                Payout History & Reconciliation (Admin View)
              </h4>
            </div>
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw size={32} className="text-primary animate-spin mx-auto" />
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayouts?.map(payout => {
                  const config = getStatusConfig(payout);
                  const IconC = config?.icon;
                  const expected = payout?.expected_amount ?? payout?.expectedAmount ?? 0;
                  const actual = payout?.actual_amount ?? payout?.actualAmount ?? 0;
                  const diff = actual - expected;

                  return (
                    <div key={payout?.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${config?.bg} rounded-lg flex items-center justify-center`}>
                            <IconC size={20} className={config?.color} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{payout?.user_profiles?.name || 'Creator'}</p>
                            <p className="text-xs text-muted-foreground">@{payout?.user_profiles?.username || payout?.creator_id} · {payout?.period} · {new Date(payout?.created_at || payout?.paid_at)?.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Expected</p>
                              <p className="text-sm font-medium">${expected?.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Actual</p>
                              <p className={`text-sm font-bold ${diff < 0 ? 'text-red-600' : 'text-green-600'}`}>${actual?.toFixed(2)}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${config?.bg} ${config?.color}`}>{config?.label}</span>
                            {Math.abs(diff) > 0.01 && (
                              <button
                                onClick={() => setShowAdjustForm(showAdjustForm === payout?.id ? null : payout?.id)}
                                className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                              >
                                Apply Adjustment
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {showAdjustForm === payout?.id && (
                        <div className="mt-4 p-4 bg-muted rounded-xl">
                          <p className="text-sm font-medium mb-2">Manual Adjustment (Admin)</p>
                          <div className="flex gap-4 flex-wrap">
                            <input
                              type="number"
                              placeholder="Amount ($)"
                              value={adjustmentAmount}
                              onChange={e => setAdjustmentAmount(e?.target?.value)}
                              className="px-3 py-2 border rounded-lg text-sm w-32"
                            />
                            <input
                              type="text"
                              placeholder="Note..."
                              value={adjustmentNote}
                              onChange={e => setAdjustmentNote(e?.target?.value)}
                              className="px-3 py-2 border rounded-lg text-sm flex-1 min-w-[200px]"
                            />
                            <button onClick={() => handleAdminAdjustment(payout?.id, payout?.creator_id)} disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50">
                              {saving ? 'Saving...' : 'Apply'}
                            </button>
                            <button onClick={() => setShowAdjustForm(null)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPayoutVerificationDashboard;
