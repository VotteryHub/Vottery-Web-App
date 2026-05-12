import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { Globe, TrendingUp, Settings, History, BarChart3, AlertCircle, Save, RefreshCw, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { countryRevenueShareService } from '../../services/countryRevenueShareService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import toast from 'react-hot-toast';
import Icon from '../../components/AppIcon';


const CountryRevenueShareManagementCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [countrySplits, setCountrySplits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    countryCode: '',
    countryName: '',
    creatorPercentage: 70,
    platformPercentage: 30,
    zone: 'zone_1',
    description: '',
    isActive: true
  });
  const [previewData, setPreviewData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadData();
    analytics?.trackEvent('country_revenue_share_center_viewed', {
      active_tab: activeTab
    });

    // Real-time subscription
    const channel = supabase
      ?.channel('country_revenue_splits_realtime')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'country_revenue_splits' },
        () => loadData()
      )
      ?.subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [splitsResult, summaryResult, historyResult] = await Promise.all([
        countryRevenueShareService?.getAllCountrySplits(),
        countryRevenueShareService?.getCountrySplitSummary(),
        countryRevenueShareService?.getCountrySplitHistory(null, 20)
      ]);

      if (splitsResult?.data) setCountrySplits(splitsResult?.data);
      if (summaryResult?.data) setSummary(summaryResult?.data);
      if (historyResult?.data) setHistory(historyResult?.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading country revenue data:', error);
      toast?.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (split) => {
    setEditingId(split?.id);
    setEditForm({
      creatorPercentage: split?.creatorPercentage,
      platformPercentage: split?.platformPercentage,
      description: split?.description,
      isActive: split?.isActive
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (splitId) => {
    try {
      const validation = countryRevenueShareService?.validateSplit(
        editForm?.creatorPercentage,
        editForm?.platformPercentage
      );

      if (!validation?.valid) {
        toast?.error(validation?.error);
        return;
      }

      const result = await countryRevenueShareService?.updateCountrySplit(splitId, editForm);

      if (result?.error) throw new Error(result?.error?.message);

      toast?.success('Country split updated successfully');
      setEditingId(null);
      setEditForm({});
      await loadData();

      analytics?.trackEvent('country_split_updated', {
        country_code: result?.data?.countryCode,
        creator_percentage: editForm?.creatorPercentage
      });
    } catch (error) {
      toast?.error(error?.message);
    }
  };

  const handleDelete = async (splitId, countryName) => {
    if (!confirm(`Are you sure you want to delete the revenue split for ${countryName}?`)) return;

    try {
      const result = await countryRevenueShareService?.deleteCountrySplit(splitId);

      if (result?.error) throw new Error(result?.error?.message);

      toast?.success('Country split deleted successfully');
      await loadData();

      analytics?.trackEvent('country_split_deleted', {
        country_name: countryName
      });
    } catch (error) {
      toast?.error(error?.message);
    }
  };

  const handleAddCountry = async () => {
    try {
      const validation = countryRevenueShareService?.validateSplit(
        addForm?.creatorPercentage,
        addForm?.platformPercentage
      );

      if (!validation?.valid) {
        toast?.error(validation?.error);
        return;
      }

      if (!addForm?.countryCode || !addForm?.countryName) {
        toast?.error('Country code and name are required');
        return;
      }

      const result = await countryRevenueShareService?.createCountrySplit(addForm);

      if (result?.error) throw new Error(result?.error?.message);

      toast?.success('Country split added successfully');
      setShowAddModal(false);
      setAddForm({
        countryCode: '',
        countryName: '',
        creatorPercentage: 70,
        platformPercentage: 30,
        zone: 'zone_1',
        description: '',
        isActive: true
      });
      await loadData();

      analytics?.trackEvent('country_split_created', {
        country_code: addForm?.countryCode,
        creator_percentage: addForm?.creatorPercentage
      });
    } catch (error) {
      toast?.error(error?.message);
    }
  };

  const handlePreviewImpact = async (countryCode, creatorPct, platformPct) => {
    try {
      const result = await countryRevenueShareService?.previewRevenueImpact(
        countryCode,
        creatorPct,
        platformPct
      );

      if (result?.data) {
        setPreviewData({ countryCode, ...result?.data });
      }
    } catch (error) {
      console.error('Error previewing impact:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'manage', label: 'Manage Splits', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'Change History', icon: History }
  ];

  const zones = [
    { value: 'zone_1', label: 'Zone 1 - US/Canada/Western Europe' },
    { value: 'zone_2', label: 'Zone 2 - India/South Asia' },
    { value: 'zone_3', label: 'Zone 3 - Eastern Europe' },
    { value: 'zone_4', label: 'Zone 4 - Africa' },
    { value: 'zone_5', label: 'Zone 5 - Latin America' },
    { value: 'zone_6', label: 'Zone 6 - Middle East/Asia' },
    { value: 'zone_7', label: 'Zone 7 - Australasia' },
    { value: 'zone_8', label: 'Zone 8 - China/HK/Macau' }
  ];

  if (loading) {
    return (
      <GeneralPageLayout title="Revenue Share" showSidebar={true}>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Synchronizing Territory Data...</p>
        </div>
      </GeneralPageLayout>
    );
  }

  return (
    <GeneralPageLayout title="Revenue Share" showSidebar={true}>
      <Helmet>
        <title>Country Revenue Share Management | Vottery Admin</title>
      </Helmet>

      <div className="w-full py-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Revenue Share</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Global Payout Configuration Engine</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Country
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Countries', value: summary?.totalCountries, icon: Globe, color: 'text-blue-400' },
              { label: 'Active Regions', value: summary?.activeCountries, icon: Check, color: 'text-green-400' },
              { label: 'Avg Creator %', value: `${summary?.averageCreatorPercentage}%`, icon: TrendingUp, color: 'text-purple-400' },
              { label: 'Top Split', value: summary?.highestCreatorSplit?.country, sub: `${summary?.highestCreatorSplit?.percentage}%`, icon: BarChart3, color: 'text-blue-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                  {stat.sub && <p className="text-xs text-slate-400 font-black mt-1 uppercase tracking-widest">{stat.sub}</p>}
                </div>
                <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] group-hover:scale-110 transition-transform duration-700`} />
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[32px] border border-white/5 mb-10 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 px-6 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-4 py-4" aria-label="Tabs">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-3 py-3 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                      ${activeTab === tab?.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-8 lg:p-10 shadow-inner">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">Global Split Logic</h3>
                      <p className="text-slate-400 font-medium leading-relaxed max-w-3xl">
                        This system governs the dynamic revenue distribution engine. Configure bespoke splits for specific territories to account for local tax laws, creator incentives, or market expansion strategies.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Current Distribution Matrix</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {countrySplits?.slice(0, 9)?.map((split) => (
                      <div
                        key={split?.id}
                        className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 group shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl group-hover:scale-125 transition-transform">{split?.countryCode}</span>
                            <span className="font-black text-white uppercase tracking-tight">{split?.countryName}</span>
                          </div>
                          <span
                            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              split?.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                            }`}
                          >
                            {split?.isActive ? 'Active' : 'Offline'}
                          </span>
                        </div>
                        <div className="space-y-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator</span>
                            <span className="font-black text-primary font-mono text-lg">{split?.creatorPercentage}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform</span>
                            <span className="font-black text-slate-300 font-mono text-lg">{split?.platformPercentage}%</span>
                          </div>
                        </div>
                        {split?.zone && (
                          <div className="mt-4 flex items-center justify-center">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 py-1 bg-white/5 rounded-full border border-white/5">
                              Zone {split?.zone?.replace('zone_', '')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Manage Splits Tab */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/20">
                  <table className="min-w-full divide-y divide-white/5">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Country</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Creator %</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform %</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Zone</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {countrySplits?.map((split) => (
                        <tr key={split?.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{split?.countryCode}</span>
                              <span className="font-black text-white uppercase tracking-tight">{split?.countryName}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {editingId === split?.id ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={editForm?.creatorPercentage}
                                onChange={(e) => {
                                  const creator = parseFloat(e?.target?.value);
                                  setEditForm({
                                    ...editForm,
                                    creatorPercentage: creator,
                                    platformPercentage: (100 - creator)?.toFixed(2)
                                  });
                                }}
                                className="w-24 px-4 py-2 bg-slate-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary text-white font-black font-mono"
                              />
                            ) : (
                              <span className="text-primary font-black font-mono text-lg">{split?.creatorPercentage}%</span>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {editingId === split?.id ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={editForm?.platformPercentage}
                                onChange={(e) => {
                                  const platform = parseFloat(e?.target?.value);
                                  setEditForm({
                                    ...editForm,
                                    platformPercentage: platform,
                                    creatorPercentage: (100 - platform)?.toFixed(2)
                                  });
                                }}
                                className="w-24 px-4 py-2 bg-slate-800 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary text-white font-black font-mono"
                              />
                            ) : (
                              <span className="text-slate-500 font-black font-mono text-lg">{split?.platformPercentage}%</span>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {split?.zone?.replace('zone_', 'Zone ')}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {editingId === split?.id ? (
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editForm?.isActive}
                                  onChange={(e) => setEditForm({ ...editForm, isActive: e?.target?.checked })}
                                  className="w-5 h-5 rounded border-white/10 bg-slate-800 text-primary focus:ring-primary"
                                />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Active</span>
                              </label>
                            ) : (
                              <span
                                className={`px-4 py-1.5 inline-flex text-[9px] leading-5 font-black uppercase tracking-widest rounded-full border ${
                                  split?.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}
                              >
                                {split?.isActive ? 'Active' : 'Offline'}
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-right">
                            {editingId === split?.id ? (
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => handleSaveEdit(split?.id)}
                                  className="w-10 h-10 flex items-center justify-center bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/20"
                                >
                                  <Check size={18} strokeWidth={3} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="w-10 h-10 flex items-center justify-center bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/20"
                                >
                                  <X size={18} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEdit(split)}
                                  className="w-10 h-10 flex items-center justify-center bg-primary/20 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/20"
                                >
                                  <Edit2 size={16} strokeWidth={3} />
                                </button>
                                <button
                                  onClick={() => handleDelete(split?.id, split?.countryName)}
                                  className="w-10 h-10 flex items-center justify-center bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/20"
                                >
                                  <Trash2 size={16} strokeWidth={3} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-12">
                <div className="bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent rounded-[32px] p-10 border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Revenue Distribution Matrix</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                        { label: 'Max Creator %', value: summary?.highestCreatorSplit?.percentage, sub: summary?.highestCreatorSplit?.country, color: 'text-green-400' },
                        { label: 'Min Creator %', value: summary?.lowestCreatorSplit?.percentage, sub: summary?.lowestCreatorSplit?.country, color: 'text-orange-400' },
                        { label: 'System Average', value: summary?.averageCreatorPercentage, sub: 'Weighted Average', color: 'text-primary' },
                        { label: 'Active Territory', value: summary?.activeCountries, sub: 'Region Count', color: 'text-purple-400' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{item.label}</p>
                          <p className={`text-4xl font-black ${item.color} tracking-tighter mb-1 font-mono`}>{item.value}{idx < 3 ? '%' : ''}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <BarChart3 className="absolute -right-20 -bottom-20 w-80 h-80 text-primary opacity-[0.02]" />
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 px-4">Global Territory Benchmarking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {countrySplits
                      ?.filter((s) => s?.isActive)
                      ?.sort((a, b) => b?.creatorPercentage - a?.creatorPercentage)
                      ?.map((split) => (
                        <div key={split?.id} className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 shadow-xl group">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-5">
                              <span className="text-4xl group-hover:scale-110 transition-transform">{split?.countryCode}</span>
                              <div>
                                <span className="font-black text-white uppercase tracking-tight block text-lg">{split?.countryName}</span>
                                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Zone {split?.zone?.replace('zone_', '')}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-primary font-mono tracking-tighter">
                                {split?.creatorPercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 group-hover:brightness-125"
                              style={{ width: `${split?.creatorPercentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Creator Share</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Platform Take</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 px-4">Immutable Change Audit Trail</h3>
                <div className="space-y-4">
                  {history?.map((record) => (
                    <div key={record?.id} className="bg-white/5 border border-white/5 rounded-[24px] p-8 hover:bg-white/10 transition-all group shadow-xl">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs border border-primary/20">{record?.countryCode}</span>
                            <span className="font-black text-white uppercase tracking-tight text-lg">{record?.countryName}</span>
                          </div>
                          <div className="text-sm font-medium">
                            {record?.previousCreatorPercentage ? (
                              <div className="flex items-center gap-3">
                                <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Evolution:</span>
                                <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-400 font-mono line-through opacity-50">
                                  {record?.previousCreatorPercentage}%/{record?.previousPlatformPercentage}%
                                </span>
                                <span className="text-primary">→</span>
                                <span className="px-3 py-1 bg-primary/20 rounded-lg text-primary font-black font-mono shadow-lg shadow-primary/10">
                                  {record?.newCreatorPercentage}%/{record?.newPlatformPercentage}%
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Initialization:</span>
                                <span className="px-3 py-1 bg-primary/20 rounded-lg text-primary font-black font-mono shadow-lg shadow-primary/10">
                                  {record?.newCreatorPercentage}%/{record?.newPlatformPercentage}%
                                </span>
                              </div>
                            )}
                          </div>
                          {record?.changeReason && (
                            <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5 italic text-slate-500 text-xs font-medium">
                              "{record?.changeReason}"
                            </div>
                          )}
                        </div>
                        <div className="lg:text-right shrink-0">
                          <div className="flex items-center lg:justify-end gap-2 text-primary mb-1">
                            <History size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Logged Update</span>
                          </div>
                          <span className="text-slate-400 font-mono text-sm block">{new Date(record?.changedAt)?.toLocaleDateString()}</span>
                          <span className="text-slate-600 font-mono text-xs block mt-1 uppercase">{new Date(record?.changedAt)?.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Country Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-[40px] shadow-[0_0_100px_-20px_rgba(var(--primary-rgb),0.3)] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="p-10 border-b border-white/5 relative">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Add Territory Split</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Initialize new global revenue node</p>
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Country Code</label>
                  <input
                    type="text"
                    maxLength="2"
                    placeholder="e.g. US"
                    value={addForm?.countryCode}
                    onChange={(e) =>
                      setAddForm({ ...addForm, countryCode: e?.target?.value?.toUpperCase() })
                    }
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black uppercase tracking-widest transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Country Name</label>
                  <input
                    type="text"
                    placeholder="e.g. United States"
                    value={addForm?.countryName}
                    onChange={(e) => setAddForm({ ...addForm, countryName: e?.target?.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black uppercase tracking-tight transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Creator %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={addForm?.creatorPercentage}
                    onChange={(e) => {
                      const creator = parseFloat(e?.target?.value);
                      setAddForm({
                        ...addForm,
                        creatorPercentage: creator,
                        platformPercentage: (100 - creator)?.toFixed(2)
                      });
                    }}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black font-mono transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Platform %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={addForm?.platformPercentage}
                    onChange={(e) => {
                      const platform = parseFloat(e?.target?.value);
                      setAddForm({
                        ...addForm,
                        platformPercentage: platform,
                        creatorPercentage: (100 - platform)?.toFixed(2)
                      });
                    }}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black font-mono transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Economic Zone</label>
                <select
                  value={addForm?.zone}
                  onChange={(e) => setAddForm({ ...addForm, zone: e?.target?.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black uppercase tracking-widest text-xs appearance-none cursor-pointer"
                >
                  {zones?.map((zone) => (
                    <option key={zone?.value} value={zone?.value} className="bg-slate-900 text-white">
                      {zone?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Implementation Notes</label>
                <textarea
                  rows="3"
                  placeholder="Rationale for this territory configuration..."
                  value={addForm?.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e?.target?.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-medium transition-all"
                />
              </div>

              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={addForm?.isActive}
                  onChange={(e) => setAddForm({ ...addForm, isActive: e?.target?.checked })}
                  className="w-6 h-6 rounded-lg border-white/10 bg-slate-800 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-black text-white uppercase tracking-widest cursor-pointer">
                  Activate Node Immediately
                </label>
              </div>
            </div>

            <div className="p-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-end gap-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full md:w-auto px-8 py-4 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
              >
                Discard Changes
              </button>
              <button
                onClick={handleAddCountry}
                className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
              >
                Deploy Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </GeneralPageLayout>
  );
};

export default CountryRevenueShareManagementCenter;
