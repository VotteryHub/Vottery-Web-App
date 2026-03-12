import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
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
      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Country Revenue Share Management | Vottery Admin</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-600" />
                Country Revenue Share Management
              </h1>
              <p className="mt-2 text-gray-600">
                Configure different revenue sharing percentages for creators in different countries
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Country
            </button>
          </div>

          {/* Last Updated */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4" />
            Last updated: {lastUpdated?.toLocaleTimeString()}
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Countries</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{summary?.totalCountries}</p>
                </div>
                <Globe className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Countries</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{summary?.activeCountries}</p>
                </div>
                <Check className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Creator %</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{summary?.averageCreatorPercentage}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Highest Split</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {summary?.highestCreatorSplit?.country}
                  </p>
                  <p className="text-sm text-gray-500">{summary?.highestCreatorSplit?.percentage}%</p>
                </div>
                <BarChart3 className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs?.map((tab) => {
                const Icon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab?.id
                        ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900">How Country-Specific Revenue Sharing Works</h3>
                      <p className="text-sm text-blue-800 mt-1">
                        Set different revenue split percentages for creators in different countries. For example:
                        USA 70/30, India 60/40, Nigeria 75/25. Changes take effect immediately and apply to all
                        new transactions for creators in those countries.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Country Splits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countrySplits?.slice(0, 9)?.map((split) => (
                      <div
                        key={split?.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{split?.countryCode}</span>
                            <span className="font-semibold text-gray-900">{split?.countryName}</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              split?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {split?.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Creator:</span>
                          <span className="font-bold text-blue-600">{split?.creatorPercentage}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Platform:</span>
                          <span className="font-bold text-gray-600">{split?.platformPercentage}%</span>
                        </div>
                        {split?.zone && (
                          <div className="mt-2 text-xs text-gray-500">
                            Zone: {split?.zone?.replace('zone_', '')}
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
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Country
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Creator %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Platform %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Zone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {countrySplits?.map((split) => (
                        <tr key={split?.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{split?.countryCode}</span>
                              <span className="font-medium text-gray-900">{split?.countryName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <span className="text-blue-600 font-semibold">{split?.creatorPercentage}%</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <span className="text-gray-600 font-semibold">{split?.platformPercentage}%</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {split?.zone?.replace('zone_', 'Zone ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingId === split?.id ? (
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={editForm?.isActive}
                                  onChange={(e) => setEditForm({ ...editForm, isActive: e?.target?.checked })}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm">Active</span>
                              </label>
                            ) : (
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  split?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {split?.isActive ? 'Active' : 'Inactive'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editingId === split?.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSaveEdit(split?.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(split)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(split?.id, split?.countryName)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-5 h-5" />
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
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Split Distribution</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Visual breakdown of creator vs platform percentages across all countries
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Highest Creator %</p>
                      <p className="text-2xl font-bold text-green-600">
                        {summary?.highestCreatorSplit?.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">{summary?.highestCreatorSplit?.country}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Lowest Creator %</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {summary?.lowestCreatorSplit?.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">{summary?.lowestCreatorSplit?.country}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Average Split</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {summary?.averageCreatorPercentage}%
                      </p>
                      <p className="text-xs text-gray-500">Creator Average</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Active Countries</p>
                      <p className="text-2xl font-bold text-purple-600">{summary?.activeCountries}</p>
                      <p className="text-xs text-gray-500">With Custom Splits</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Comparison by Country</h3>
                  <div className="space-y-3">
                    {countrySplits
                      ?.filter((s) => s?.isActive)
                      ?.sort((a, b) => b?.creatorPercentage - a?.creatorPercentage)
                      ?.map((split) => (
                        <div key={split?.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{split?.countryCode}</span>
                              <span className="font-semibold text-gray-900">{split?.countryName}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-blue-600">
                                {split?.creatorPercentage}%
                              </span>
                              <span className="text-gray-400 mx-1">/</span>
                              <span className="text-lg font-bold text-gray-600">
                                {split?.platformPercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                              style={{ width: `${split?.creatorPercentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>Creator: {split?.creatorPercentage}%</span>
                            <span>Platform: {split?.platformPercentage}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Changes</h3>
                <div className="space-y-3">
                  {history?.map((record) => (
                    <div key={record?.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{record?.countryName}</span>
                            <span className="text-sm text-gray-500">({record?.countryCode})</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {record?.previousCreatorPercentage ? (
                              <>
                                Changed from{' '}
                                <span className="font-medium">
                                  {record?.previousCreatorPercentage}%/{record?.previousPlatformPercentage}%
                                </span>{' '}
                                to{' '}
                                <span className="font-medium text-blue-600">
                                  {record?.newCreatorPercentage}%/{record?.newPlatformPercentage}%
                                </span>
                              </>
                            ) : (
                              <>
                                Initial configuration:{' '}
                                <span className="font-medium text-blue-600">
                                  {record?.newCreatorPercentage}%/{record?.newPlatformPercentage}%
                                </span>
                              </>
                            )}
                          </div>
                          {record?.changeReason && (
                            <p className="text-sm text-gray-500 mt-1">Reason: {record?.changeReason}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(record?.changedAt)?.toLocaleDateString()}
                          <br />
                          {new Date(record?.changedAt)?.toLocaleTimeString()}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Country Split</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country Code *
                  </label>
                  <input
                    type="text"
                    maxLength="2"
                    placeholder="US"
                    value={addForm?.countryCode}
                    onChange={(e) =>
                      setAddForm({ ...addForm, countryCode: e?.target?.value?.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country Name *
                  </label>
                  <input
                    type="text"
                    placeholder="United States"
                    value={addForm?.countryName}
                    onChange={(e) => setAddForm({ ...addForm, countryName: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Creator Percentage *
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Percentage *
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                <select
                  value={addForm?.zone}
                  onChange={(e) => setAddForm({ ...addForm, zone: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {zones?.map((zone) => (
                    <option key={zone?.value} value={zone?.value}>
                      {zone?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Optional description or notes"
                  value={addForm?.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={addForm?.isActive}
                  onChange={(e) => setAddForm({ ...addForm, isActive: e?.target?.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (apply immediately)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCountry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Add Country
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryRevenueShareManagementCenter;
