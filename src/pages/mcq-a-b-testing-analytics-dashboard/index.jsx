import React, { useState, useEffect, useCallback } from 'react';
import { BarChart2, TrendingUp, Award, RefreshCw, Plus, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import mcqABTestingService from '../../services/mcqABTestingService';

const MCQABTestingAnalyticsDashboard = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [significance, setSignificance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [autoPromoting, setAutoPromoting] = useState(false);
  const [autoPromoteResult, setAutoPromoteResult] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVariant, setNewVariant] = useState({ variantName: 'Variant B', variantType: 'question_text', questionText: '', difficulty: 'medium' });
  const [questionId, setQuestionId] = useState('');

  const loadTests = useCallback(async () => {
    setLoading(true);
    const { data } = await mcqABTestingService?.getAllTests();
    setTests(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadTests(); }, [loadTests]);

  // Automated winner promotion: run check on all active tests when dashboard loads and every 5 min
  useEffect(() => {
    const runAutoPromotionCheck = async () => {
      const { data: allTests } = await mcqABTestingService?.getAllTests?.();
      const activeTests = (allTests || [])?.filter(t => t?.status === 'active' && t?.question_id);
      for (const test of activeTests) {
        await mcqABTestingService?.checkAndAutoPromoteWinner?.(test?.question_id, 100);
      }
    };
    runAutoPromotionCheck();
    const interval = setInterval(runAutoPromotionCheck, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = useCallback(async (test) => {
    setSelectedTest(test);
    const [controlResult, variantResult] = await Promise.all([
      mcqABTestingService?.getVariantMetrics(`control_${test?.question_id}`),
      mcqABTestingService?.getVariantMetrics(test?.id),
    ]);
    const controlMetrics = controlResult?.data || { total: 0, correct: 0, accuracy: 0, avgResponseTime: 0 };
    const variantMetrics = variantResult?.data || { total: 0, correct: 0, accuracy: 0, avgResponseTime: 0 };
    setMetrics({ control: controlMetrics, variant: variantMetrics });
    const sig = mcqABTestingService?.calculateChiSquared(controlMetrics, variantMetrics);
    setSignificance(sig);
  }, []);

  const handlePromote = async () => {
    if (!selectedTest) return;
    setPromoting(true);
    await mcqABTestingService?.promoteWinner(selectedTest?.id, selectedTest?.question_id);
    setPromoting(false);
    loadTests();
  };

  const handleAutoPromote = async () => {
    if (!selectedTest?.question_id) return;
    setAutoPromoting(true);
    setAutoPromoteResult(null);
    const { data, error } = await mcqABTestingService?.checkAndAutoPromoteWinner(selectedTest?.question_id, 100);
    setAutoPromoteResult({ data, error });
    setAutoPromoting(false);
    loadTests();
    loadMetrics(selectedTest);
  };

  const handleCreateVariant = async () => {
    if (!questionId) return;
    await mcqABTestingService?.createTest(questionId, newVariant);
    setShowCreateForm(false);
    setQuestionId('');
    setNewVariant({ variantName: 'Variant B', variantType: 'question_text', questionText: '', difficulty: 'medium' });
    loadTests();
  };

  const chartData = selectedTest ? [
    { name: 'Accuracy %', Control: Number((metrics?.control?.accuracy || 0)?.toFixed(1)), Variant: Number((metrics?.variant?.accuracy || 0)?.toFixed(1)) },
    { name: 'Responses', Control: metrics?.control?.total || 0, Variant: metrics?.variant?.total || 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <BarChart2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MCQ A/B Testing Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Statistical significance testing for question variants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={loadTests} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Plus size={14} />New Variant
              </button>
            </div>
          </div>
        </div>

        {/* Create Variant Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-blue-200 dark:border-blue-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Variant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question ID</label>
                <input value={questionId} onChange={e => setQuestionId(e?.target?.value)} placeholder="Enter question UUID" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variant Name</label>
                <input value={newVariant?.variantName} onChange={e => setNewVariant(p => ({ ...p, variantName: e?.target?.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variant Type</label>
                <select value={newVariant?.variantType} onChange={e => setNewVariant(p => ({ ...p, variantType: e?.target?.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:outline-none">
                  <option value="question_text">Question Text</option>
                  <option value="options">Answer Options</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="image">Image vs Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select value={newVariant?.difficulty} onChange={e => setNewVariant(p => ({ ...p, difficulty: e?.target?.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:outline-none">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Variant Question Text</label>
                <textarea value={newVariant?.questionText} onChange={e => setNewVariant(p => ({ ...p, questionText: e?.target?.value }))} rows={3} placeholder="Enter the variant question text..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleCreateVariant} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create Variant</button>
              <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tests List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Tests ({tests?.length})</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8"><RefreshCw size={20} className="animate-spin text-gray-400" /></div>
            ) : tests?.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No tests yet. Create a variant to start.</div>
            ) : (
              <div className="space-y-2">
                {tests?.map(test => (
                  <button
                    key={test?.id}
                    onClick={() => loadMetrics(test)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      selectedTest?.id === test?.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{test?.variant_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{test?.variant_type} • {test?.status}</div>
                    {test?.status === 'winner' && <span className="inline-flex items-center gap-1 text-xs text-yellow-600 font-semibold mt-1"><Award size={10} />Winner</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metrics Panel */}
          <div className="lg:col-span-2 space-y-4">
            {selectedTest ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: 'Control Accuracy', value: `${(metrics?.control?.accuracy || 0)?.toFixed(1)}%`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Variant Accuracy', value: `${(metrics?.variant?.accuracy || 0)?.toFixed(1)}%`, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    { label: 'Control Responses', value: metrics?.control?.total || 0, color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-50 dark:bg-gray-700' },
                    { label: 'Variant Responses', value: metrics?.variant?.total || 0, color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-50 dark:bg-gray-700' },
                  ]?.map((stat, i) => (
                    <div key={i} className={`${stat?.bg} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat?.label}</div>
                      <div className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Performance Comparison</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Control" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Variant" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Auto-Promote & Manual Promote */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAutoPromote}
                    disabled={autoPromoting || !selectedTest}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {autoPromoting ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                    Auto-Promote (if significant)
                  </button>
                  <button
                    onClick={handlePromote}
                    disabled={promoting || !selectedTest}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {promoting ? <RefreshCw size={14} className="animate-spin" /> : <Award size={14} />}
                    Promote Manually
                  </button>
                </div>
                {autoPromoteResult && (
                  <div className={`rounded-lg p-3 text-sm ${autoPromoteResult?.error ? 'bg-red-50 dark:bg-red-900/20 text-red-700' : 'bg-green-50 dark:bg-green-900/20 text-green-700'}`}>
                    {autoPromoteResult?.error ? autoPromoteResult?.error?.message : (
                      autoPromoteResult?.data?.autoPromoted
                        ? `Winner auto-promoted (p=${autoPromoteResult?.data?.pValue?.toFixed(4)})`
                        : `Not promoted: ${autoPromoteResult?.data?.reason || 'unknown'}`
                    )}
                  </div>
                )}

                {/* Statistical Significance */}
                {significance && (
                  <div className={`rounded-xl p-4 border ${
                    significance?.significant
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {significance?.significant ? <CheckCircle size={16} className="text-green-600" /> : <AlertTriangle size={16} className="text-yellow-600" />}
                        <span className={`font-semibold text-sm ${
                          significance?.significant ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {significance?.significant ? 'Statistically Significant (p < 0.05)' : 'Not Yet Significant'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        χ² = {significance?.chiSquared} | p = {significance?.pValue}
                      </div>
                    </div>
                    {significance?.significant && metrics?.variant?.accuracy > metrics?.control?.accuracy && (
                      <button
                        onClick={handlePromote}
                        disabled={promoting || selectedTest?.status === 'winner'}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        <Zap size={14} />{promoting ? 'Promoting...' : selectedTest?.status === 'winner' ? 'Already Promoted' : 'Promote Variant as Winner'}
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
                <TrendingUp size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 dark:text-gray-400">Select a test from the list to view metrics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQABTestingAnalyticsDashboard;
