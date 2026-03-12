import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../../lib/supabase';

const DeliveryAnalyticsOverview = () => {
  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: logs } = await supabase
        ?.from('sms_logs')
        ?.select('provider, status, created_at')
        ?.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString())
        ?.limit(500);

      if (logs && logs?.length > 0) {
        const total = logs?.length;
        const delivered = logs?.filter(l => l?.status === 'delivered')?.length;
        const failed = logs?.filter(l => l?.status === 'failed')?.length;
        const pending = logs?.filter(l => l?.status === 'pending' || l?.status === 'sent')?.length;

        setMetrics({
          total,
          delivered,
          failed,
          pending,
          deliveryRate: total > 0 ? ((delivered / total) * 100)?.toFixed(1) : 0,
          failureRate: total > 0 ? ((failed / total) * 100)?.toFixed(1) : 0
        });

        // Build hourly trend
        const hourlyMap = {};
        logs?.forEach(log => {
          const h = new Date(log?.created_at)?.getHours();
          if (!hourlyMap?.[h]) hourlyMap[h] = { sent: 0, delivered: 0 };
          hourlyMap[h].sent++;
          if (log?.status === 'delivered') hourlyMap[h].delivered++;
        });
        const trend = Array.from({ length: 24 }, (_, h) => ({
          time: `${h}:00`,
          sent: hourlyMap?.[h]?.sent || 0,
          delivered: hourlyMap?.[h]?.delivered || 0
        }));
        setTrendData(trend);
      } else {
        setMetrics({ total: 0, delivered: 0, failed: 0, pending: 0, deliveryRate: 0, failureRate: 0 });
        setTrendData(Array.from({ length: 24 }, (_, h) => ({ time: `${h}:00`, sent: 0, delivered: 0 })));
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Sent (24h)', value: metrics?.total ?? 0, icon: MessageSquare, color: 'blue', bg: 'bg-blue-50' },
    { label: 'Delivered', value: metrics?.delivered ?? 0, icon: CheckCircle, color: 'green', bg: 'bg-green-50' },
    { label: 'Failed', value: metrics?.failed ?? 0, icon: XCircle, color: 'red', bg: 'bg-red-50' },
    { label: 'Delivery Rate', value: `${metrics?.deliveryRate ?? 0}%`, icon: TrendingUp, color: 'purple', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {statCards?.map((card, i) => (
          <div key={i} className={`${card?.bg} rounded-xl p-4 border border-opacity-20`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">{card?.label}</span>
              <card.icon className={`w-5 h-5 text-${card?.color}-500`} />
            </div>
            <div className={`text-3xl font-bold text-${card?.color}-700`}>{card?.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-medium text-gray-700 mb-4">24-Hour Delivery Trend</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} interval={3} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="sent" stroke="#3b82f6" fill="url(#sentGrad)" name="Sent" />
            <Area type="monotone" dataKey="delivered" stroke="#10b981" fill="url(#deliveredGrad)" name="Delivered" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeliveryAnalyticsOverview;
