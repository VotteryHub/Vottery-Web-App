import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Payout Verification" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-xl">
              <Icon name="Shield" size={28} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Payout Audit</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Reconciliation & manual financial adjustments</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 shadow-2xl">
            <button
              onClick={loadAllPayouts}
              disabled={loading}
              className="flex items-center gap-2.5 px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all shadow-xl disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Re-Sync Ledger
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <FileText size={16} className="text-blue-500" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Audited</span>
            </div>
            <p className="text-3xl font-black text-white relative z-10 font-mono tracking-tight">{payouts?.length}</p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Reconciled</span>
            </div>
            <p className="text-3xl font-black text-green-500 relative z-10 font-mono tracking-tight">{payouts?.filter(p => Math.abs((p?.expected_amount ?? p?.expectedAmount ?? 0) - (p?.actual_amount ?? p?.actualAmount ?? 0)) <= 0.01)?.length}</p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Discrepancies</span>
            </div>
            <p className="text-3xl font-black text-red-500 relative z-10 font-mono tracking-tight">{discrepancies?.length}</p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <DollarSign size={16} className="text-amber-500" />
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Unresolved Variance</span>
            </div>
            <p className="text-3xl font-black text-amber-500 relative z-10 font-mono tracking-tight">
              ${discrepancies?.reduce((s, p) => s + Math.abs((p?.expected_amount ?? p?.expectedAmount ?? 0) - (p?.actual_amount ?? p?.actualAmount ?? 0)), 0)?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-10 flex-wrap p-1 bg-black/20 rounded-2xl border border-white/5 w-fit">
          {['all', 'reconciled', 'discrepancy']?.map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filterStatus === f ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-black/20">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
              <FileText size={16} className="text-blue-500" />
              Payout Ledger & Reconciliation
            </h4>
          </div>
          
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="py-24 text-center">
                <RefreshCw size={40} className="text-indigo-500 animate-spin mx-auto opacity-50" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6">Decrypting Financial Records...</p>
              </div>
            ) : filteredPayouts?.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest opacity-50">No payouts found for this filter</p>
              </div>
            ) : (
              filteredPayouts?.map(payout => {
                const config = getStatusConfig(payout);
                const IconC = config?.icon;
                const expected = payout?.expected_amount ?? payout?.expectedAmount ?? 0;
                const actual = payout?.actual_amount ?? payout?.actualAmount ?? 0;
                const diff = actual - expected;

                return (
                  <div key={payout?.id} className="p-8 hover:bg-white/5 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 ${config?.bg} rounded-2xl flex items-center justify-center border border-white/5 shadow-xl`}>
                          <IconC size={24} className={config?.color} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{payout?.user_profiles?.name || 'Creator'}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-[10px] text-indigo-400 font-mono tracking-tight">@{payout?.user_profiles?.username || payout?.creator_id}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{payout?.period}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(payout?.created_at || payout?.paid_at)?.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 flex-wrap">
                        <div className="text-right">
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Expected</p>
                          <p className="text-sm font-black text-slate-400 font-mono">${expected?.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Actual</p>
                          <p className={`text-lg font-black font-mono ${diff < 0 ? 'text-red-500' : 'text-green-500'}`}>${actual?.toFixed(2)}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${config?.bg} ${config?.color}`}>
                          {config?.label}
                        </div>
                        {Math.abs(diff) > 0.01 && (
                          <button
                            onClick={() => setShowAdjustForm(showAdjustForm === payout?.id ? null : payout?.id)}
                            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black rounded-xl shadow-lg transition-all uppercase tracking-widest"
                          >
                            Manual Adjust
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {showAdjustForm === payout?.id && (
                      <div className="mt-8 p-8 bg-black/40 rounded-3xl border border-amber-500/20 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                           <Icon name="Edit3" size={16} className="text-amber-500" />
                           <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Financial Override Request</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <label className="block text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2 ml-1">Adjustment Amount ($)</label>
                            <input
                              type="number"
                              placeholder="0.00"
                              value={adjustmentAmount}
                              onChange={e => setAdjustmentAmount(e?.target?.value)}
                              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                          </div>
                          <div className="flex-[2]">
                            <label className="block text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2 ml-1">Internal Audit Note</label>
                            <input
                              type="text"
                              placeholder="Reason for manual adjustment..."
                              value={adjustmentNote}
                              onChange={e => setAdjustmentNote(e?.target?.value)}
                              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                          </div>
                          <div className="flex items-end gap-3">
                            <button 
                              onClick={() => handleAdminAdjustment(payout?.id, payout?.creator_id)} 
                              disabled={saving} 
                              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black rounded-xl shadow-lg transition-all uppercase tracking-widest disabled:opacity-50 h-[46px]"
                            >
                              {saving ? 'Processing...' : 'Apply Correction'}
                            </button>
                            <button 
                              onClick={() => setShowAdjustForm(null)} 
                              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white text-[10px] font-black rounded-xl border border-white/5 transition-all uppercase tracking-widest h-[46px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default AdminPayoutVerificationDashboard;
