import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';

const STATUS_COLORS = {
  running: 'text-blue-500 bg-blue-500/10',
  completed: 'text-green-500 bg-green-500/10',
  paused: 'text-yellow-500 bg-yellow-500/10',
  draft: 'text-gray-500 bg-gray-500/10',
};

const MOCK_TESTS = [
  {
    id: 'ab-001',
    name: 'Home Feed Layout Test',
    screen: '/home-feed-dashboard',
    status: 'running',
    startDate: '2026-02-01',
    variants: [
      { name: 'Control (A)', users: 4210, conversions: 842, conversionRate: 20.0 },
      { name: 'Variant B', users: 4180, conversions: 963, conversionRate: 23.0 },
    ],
    significance: 94.2,
    winner: null,
    metric: 'Click-through rate',
  },
  {
    id: 'ab-002',
    name: 'Onboarding Flow Optimization',
    screen: '/interactive-onboarding-wizard',
    status: 'completed',
    startDate: '2026-01-15',
    endDate: '2026-01-30',
    variants: [
      { name: 'Control (A)', users: 2100, conversions: 1134, conversionRate: 54.0 },
      { name: 'Variant B', users: 2090, conversions: 1380, conversionRate: 66.0 },
    ],
    significance: 99.1,
    winner: 'Variant B',
    metric: 'Onboarding completion',
  },
  {
    id: 'ab-003',
    name: 'Election Card CTA Button',
    screen: '/elections-dashboard',
    status: 'running',
    startDate: '2026-02-10',
    variants: [
      { name: 'Control (A)', users: 3450, conversions: 690, conversionRate: 20.0 },
      { name: 'Variant B', users: 3420, conversions: 753, conversionRate: 22.0 },
      { name: 'Variant C', users: 3400, conversions: 816, conversionRate: 24.0 },
    ],
    significance: 87.3,
    winner: null,
    metric: 'Vote button clicks',
  },
];

const ABTestingPanel = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTest, setNewTest] = useState({ name: '', screen: '', metric: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const { data } = await supabase?.from('ab_tests')?.select('*, ab_assignments(count)')?.limit(20);
        if (data?.length > 0) {
          setTests(data);
        } else {
          setTests(MOCK_TESTS);
        }
      } catch {
        setTests(MOCK_TESTS);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const createTest = async () => {
    if (!newTest?.name || !newTest?.screen) return;
    setCreating(true);
    try {
      const { data, error } = await supabase?.from('ab_tests')?.insert([{
        name: newTest?.name,
        screen_path: newTest?.screen,
        metric: newTest?.metric,
        status: 'draft',
        created_at: new Date()?.toISOString(),
      }])?.select()?.single();

      if (!error && data) {
        setTests((prev) => [{ ...data, variants: [], significance: 0, winner: null }, ...prev]);
      } else {
        // Add locally if table doesn't exist
        setTests((prev) => [{
          id: `ab-${Date.now()}`,
          ...newTest,
          status: 'draft',
          startDate: new Date()?.toISOString()?.split('T')?.[0],
          variants: [],
          significance: 0,
          winner: null,
        }, ...prev]);
      }
      setNewTest({ name: '', screen: '', metric: '' });
      setShowCreateForm(false);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3]?.map((i) => <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Active Experiments</h3>
          <p className="text-sm text-muted-foreground">{tests?.filter((t) => t?.status === 'running')?.length} running · {tests?.filter((t) => t?.status === 'completed')?.length} completed</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon name="Plus" size={14} />
          New Test
        </button>
      </div>
      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Create New A/B Test</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Test name"
              value={newTest?.name}
              onChange={(e) => setNewTest((p) => ({ ...p, name: e?.target?.value }))}
              className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Screen path (e.g. /home-feed-dashboard)"
              value={newTest?.screen}
              onChange={(e) => setNewTest((p) => ({ ...p, screen: e?.target?.value }))}
              className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Primary metric"
              value={newTest?.metric}
              onChange={(e) => setNewTest((p) => ({ ...p, metric: e?.target?.value }))}
              className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={createTest}
              disabled={creating || !newTest?.name}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Test'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Tests List */}
      <div className="space-y-4">
        {tests?.map((test) => (
          <div key={test?.id} className="border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{test?.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS?.[test?.status] || STATUS_COLORS?.draft}`}>
                    {test?.status}
                  </span>
                  {test?.winner && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium text-green-500 bg-green-500/10">
                      Winner: {test?.winner}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {test?.screen || test?.screen_path} · {test?.metric} · Started {test?.startDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Statistical Significance</p>
                <p className={`text-lg font-bold ${
                  (test?.significance || 0) >= 95 ? 'text-green-500' :
                  (test?.significance || 0) >= 80 ? 'text-yellow-500' : 'text-red-500'
                }`}>{test?.significance || 0}%</p>
              </div>
            </div>

            {test?.variants?.length > 0 && (
              <div className="grid gap-2">
                {test?.variants?.map((variant, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{variant?.name}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`rounded-full h-2 transition-all ${
                          i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${variant?.conversionRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-12 text-right">{variant?.conversionRate}%</span>
                    <span className="text-xs text-muted-foreground w-20 text-right">{variant?.users?.toLocaleString()} users</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ABTestingPanel;
