import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { analyticsService } from '../../../services/analyticsService';
import Button from '../../../components/ui/Button';

const VotingFunnelDiagnostic = () => {
  const [funnelData, setFunnelData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [errorStats, setErrorStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRange, setViewRange] = useState('24h'); // 24h | 7d | 30d
  const [isRunningMaintenance, setIsRunningMaintenance] = useState(false);

  useEffect(() => {
    if (viewRange === '24h') {
      fetchFunnelStats();
      
      const channel = supabase
        .channel('funnel_telemetry')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_engagement_signals' }, () => {
          fetchFunnelStats();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      fetchHistoricalTrends();
    }
  }, [viewRange]);

  const fetchFunnelStats = async () => {
    setLoading(true);
    try {
      // Fetch signals from the last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: signals, error } = await supabase
        .from('user_engagement_signals')
        .select('signal_type, metadata, created_at')
        .gte('created_at', yesterday);

      if (error) throw error;

      // Aggregate Funnel Data
      const stats = {
        requirements: signals.filter(s => s.signal_type === 'funnel_step_viewed' && s.metadata?.stepName === 'requirements').length,
        auto_advances: signals.filter(s => s.signal_type === 'funnel_auto_advance').length,
        ballot: signals.filter(s => s.signal_type === 'funnel_step_viewed' && s.metadata?.stepName === 'ballot').length,
        votes: signals.filter(s => s.signal_type === 'cast_vote').length,
      };

      const chartData = [
        { name: 'Step 1: Requirements', value: stats.requirements, color: 'var(--color-primary)' },
        { name: 'Auto-Advances', value: stats.auto_advances, color: 'var(--color-secondary)' },
        { name: 'Step 2: Ballot View', value: stats.ballot, color: 'var(--color-accent)' },
        { name: 'Step 3: Vote Cast', value: stats.votes, color: 'var(--color-success)' },
      ];

      // Aggregate Error Data
      const errors = signals
        .filter(s => s.signal_type === 'funnel_flow_error')
        .reduce((acc, s) => {
          const cat = s.metadata?.errorCategory || 'unknown';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

      const errorData = Object.entries(errors).map(([name, count]) => ({ name, count }));

      setFunnelData(chartData);
      setErrorStats(errorData);
    } catch (err) {
      console.error('[VotingFunnelDiagnostic] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalTrends = async () => {
    setLoading(true);
    try {
      const days = viewRange === '7d' ? 7 : 30;
      const { data, error } = await analyticsService.getFunnelTrends(null, days);
      if (error) throw error;
      setTrendData(data);
    } catch (err) {
      console.error('[VotingFunnelDiagnostic] Trend Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunMaintenance = async () => {
    if (!window.confirm('This will aggregate raw data and purge signals older than 30 days. Proceed?')) return;
    setIsRunningMaintenance(true);
    try {
      const { error } = await analyticsService.runTelemetryMaintenance();
      if (error) throw error;
      alert('Maintenance completed successfully.');
      if (viewRange !== '24h') fetchHistoricalTrends();
    } catch (err) {
      alert('Maintenance failed: ' + err.message);
    } finally {
      setIsRunningMaintenance(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading funnel diagnostics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Voting Funnel Diagnostics</h2>
          <p className="text-sm text-muted-foreground">Monitor conversion health and system performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-lg bg-muted border border-border">
            {['24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setViewRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewRange === range ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRunMaintenance}
            disabled={isRunningMaintenance}
            className="text-xs h-8"
          >
            {isRunningMaintenance ? 'Cleaning...' : 'Run Cleanup'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Chart / Trends */}
        <div className="lg:col-span-2 card p-6 bg-card border-border border-2 rounded-xl min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground">
                {viewRange === '24h' ? 'Real-time Funnel' : `Historical Trends (${viewRange})`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {viewRange === '24h' ? 'Live session aggregation' : 'Aggregated daily performance'}
              </p>
            </div>
            <Icon name={viewRange === '24h' ? 'Activity' : 'TrendingUp'} className="text-primary" size={24} />
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">Loading data...</div>
            ) : viewRange === '24h' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="requirements" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ballot" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="votes" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Error Breakdown */}
        <div className="card p-6 bg-card border-border border-2 rounded-xl">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4">Flow Errors</h3>
          {errorStats.length > 0 ? (
            <div className="space-y-4">
              {errorStats.map((err, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <Icon name="AlertCircle" className="text-destructive" size={18} />
                    <span className="text-sm font-medium text-foreground uppercase">{err.name}</span>
                  </div>
                  <span className="text-lg font-bold text-destructive">{err.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground italic">
              <Icon name="CheckCircle" className="text-success mb-2" size={32} />
              <p className="text-sm">No flow errors reported</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards (Only show for 24h) */}
      {viewRange === '24h' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {funnelData.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-card border-2 border-border shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{item.name}</p>
              <p className="text-2xl font-data font-bold text-foreground">{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VotingFunnelDiagnostic;
