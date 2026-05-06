import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { voterRollsService } from '../../services/voterRollsService';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';
import { hasAnyRole } from '../../constants/roles';

const VoterRollsManagement = () => {
  const { user, userProfile } = useAuth();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [rolls, setRolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importText, setImportText] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const canManage = hasAnyRole(userProfile?.role, ['creator', 'admin']);

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElection?.id) {
      loadRolls(selectedElection.id);
    } else {
      setRolls([]);
    }
  }, [selectedElection?.id]);

  const loadElections = async () => {
    try {
      setLoading(true);
      const { data } = await electionsService?.getAll({});
      const mine = (data || [])?.filter(
        (e) => e?.createdBy === user?.id || hasAnyRole(userProfile?.role, ['admin'])
      );
      setElections(mine || []);
      if (mine?.length > 0 && !selectedElection) {
        setSelectedElection(mine[0]);
      }
    } catch (err) {
      console.error('Failed to load elections:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRolls = async (electionId) => {
    try {
      const { data, error } = await voterRollsService?.getByElection(electionId);
      if (error) throw new Error(error?.message);
      setRolls(data || []);
    } catch (err) {
      console.error('Failed to load voter rolls:', err);
      setRolls([]);
    }
  };

  const handleBulkImport = async () => {
    if (!selectedElection?.id || !importText?.trim()) return;
    const lines = importText?.split(/[\n,;]/)?.map((l) => l?.trim())?.filter(Boolean) || [];
    const entries = lines?.map((line) => {
      if (line?.includes('@')) return { email: line };
      return { email: line };
    });
    try {
      const { error } = await voterRollsService?.bulkImport(selectedElection.id, entries);
      if (error) throw new Error(error?.message);
      setImportText('');
      await loadRolls(selectedElection.id);
    } catch (err) {
      console.error('Bulk import failed:', err);
    }
  };

  const handleAddEmail = async () => {
    if (!selectedElection?.id || !addEmail?.trim()) return;
    try {
      const { error } = await voterRollsService?.addEntry(selectedElection.id, { email: addEmail?.trim() });
      if (error) throw new Error(error?.message);
      setAddEmail('');
      await loadRolls(selectedElection.id);
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleVerify = async (rollId, status) => {
    try {
      await voterRollsService?.verifyEntry(rollId, status);
      await loadRolls(selectedElection?.id);
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  const handleRemove = async (rollId) => {
    try {
      await voterRollsService?.removeEntry(rollId);
      await loadRolls(selectedElection?.id);
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };

  if (!canManage) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Icon name="ShieldOff" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need creator or admin role to manage voter rolls.</p>
        </main>
      </div>
    );
  }

  return (
    <GeneralPageLayout title="Voter Rolls" showSidebar={true}>
      <div className="w-full py-0">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              Access Control
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl">
              Manage authorized voter lists for private elections. Import verified identities and audit entry permissions.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</span>
              <span className="text-xs font-black text-primary uppercase tracking-widest">Creator Mode Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="premium-glass p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Active Sequence</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select Target Election</label>
                  <div className="relative group">
                    <select
                      value={selectedElection?.id || ''}
                      onChange={(e) => {
                        const el = elections?.find((x) => x?.id === e?.target?.value);
                        setSelectedElection(el || null);
                      }}
                      className="w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">-- Select election --</option>
                      {elections?.map((e) => (
                        <option key={e?.id} value={e?.id} className="bg-slate-900">
                          {e?.title} ({e?.status})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-primary transition-colors">
                      <Icon name="ChevronDown" size={18} />
                    </div>
                  </div>
                </div>

                {selectedElection && (
                  <div className="pt-6 border-t border-white/5 space-y-8 animate-in fade-in duration-500">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Add Verified Voter</label>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          placeholder="voter@example.com"
                          value={addEmail}
                          onChange={(e) => setAddEmail(e?.target?.value)}
                          className="flex-1 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
                        />
                        <button 
                          onClick={handleAddEmail} 
                          className="px-8 py-4 bg-primary text-black font-black rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                        >
                          Execute
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Bulk Matrix Import</label>
                      <textarea
                        placeholder="voter1@email.com&#10;voter2@email.com"
                        value={importText}
                        onChange={(e) => setImportText(e?.target?.value)}
                        rows={4}
                        className="w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
                      />
                      <button 
                        onClick={handleBulkImport}
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                      >
                        Start Batch Process
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedElection && (
              <div className="premium-glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    Authorized Manifest ({rolls?.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync</span>
                  </div>
                </div>
                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto scrollbar-hide">
                  {rolls?.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/5">
                        <Icon name="Users" size={24} className="text-slate-600" />
                      </div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Empty Manifest</p>
                    </div>
                  ) : (
                    rolls?.map((r) => (
                      <div
                        key={r?.id}
                        className="flex items-center justify-between p-6 hover:bg-white/5 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                            r?.status === 'verified' ? 'bg-success/20 border-success/30 text-success' :
                            r?.status === 'rejected' ? 'bg-red-500/20 border-red-500/30 text-red-500' :
                            'bg-yellow-500/20 border-yellow-500/30 text-yellow-500'
                          }`}>
                            <Icon name={r?.status === 'verified' ? 'Check' : r?.status === 'rejected' ? 'X' : 'Clock'} size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{r?.email || r?.userId || 'Unknown'}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{r?.status}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {r?.status !== 'verified' && (
                            <button 
                              onClick={() => handleVerify(r?.id, 'verified')}
                              className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center hover:bg-success/20 transition-all"
                            >
                              <Icon name="Check" size={16} />
                            </button>
                          )}
                          {r?.status !== 'rejected' && (
                            <button 
                              onClick={() => handleVerify(r?.id, 'rejected')}
                              className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"
                            >
                              <Icon name="X" size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleRemove(r?.id)}
                            className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
                          >
                            <Icon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="premium-glass p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6">
                <Icon name="ShieldCheck" size={24} className="text-primary" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3">Integrity Shield</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                All voter rolls are cryptographically hashed before election commencement. Once an election starts, the manifest becomes immutable on the blockchain audit portal.
              </p>
            </div>

            <div className="premium-glass p-8 rounded-3xl border border-indigo-500/20 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Permission Matrix</h4>
              <div className="space-y-4">
                {[
                  { label: 'Bulk Import', desc: 'Accelerate manifest creation' },
                  { label: 'Manual Verification', desc: 'High-security audit process' },
                  { label: 'ID Masking', desc: 'Preserve voter anonymity' },
                ]?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{item?.label}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-black">{item?.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default VoterRollsManagement;
