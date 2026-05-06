import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EventTelemetryChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventLogs();
    
    // Subscribe to new events for real-time updates
    const channel = supabase
      .channel('realtime_event_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_logs' }, () => {
        fetchEventLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEventLogs = async () => {
    try {
      const { data: logs, error } = await supabase
        .from('event_logs')
        .select('event_name, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Process data for chart: Count events per type
      const counts = logs.reduce((acc, log) => {
        const name = log.event_name.split(':')[1] || log.event_name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(counts).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
        count
      })).sort((a, b) => b.count - a.count);

      setData(chartData);
    } catch (err) {
      console.error('[EventTelemetryChart] Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center text-muted-foreground">Loading telemetry...</div>;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Real-time Platform Telemetry</h3>
          <p className="text-sm text-muted-foreground">Live activity captured via K7 Event Bus</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          Live
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="var(--color-muted-foreground)" />
            <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.slice(0, 4).map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{item.name}</p>
            <p className="text-lg font-bold text-foreground">{item.count.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTelemetryChart;
