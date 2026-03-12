import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart2 } from 'lucide-react';

export default function PerformanceComparisonPanel() {
  const [perfData, setPerfData] = useState([]);
  const [latencyData, setLatencyData] = useState([]);
  const [activeTab, setActiveTab] = useState('delivery');

  const fetchPerformanceData = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_provider_performance')
        ?.select('*')
        ?.order('hour_bucket', { ascending: false })
        ?.limit(24);

      if (data?.length) {
        const grouped = {};
        data?.forEach(row => {
          const hour = new Date(row.hour_bucket)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          if (!grouped?.[hour]) grouped[hour] = { hour };
          grouped[hour][row.provider + '_delivery'] = row?.delivery_rate || 0;
          grouped[hour][row.provider + '_latency'] = row?.avg_latency_ms || 0;
          grouped[hour][row.provider + '_cost'] = (row?.cost_per_message || 0) * 1000;
        });
        const chartData = Object.values(grouped)?.slice(0, 8)?.reverse();
        setPerfData(chartData);
        setLatencyData(chartData);
      } else {
        const mockData = Array.from({ length: 8 }, (_, i) => ({
          hour: `${(new Date()?.getHours() - 7 + i + 24) % 24}:00`,
          telnyx_delivery: 96 + Math.random() * 3,
          twilio_delivery: 94 + Math.random() * 3,
          telnyx_latency: 300 + Math.random() * 50,
          twilio_latency: 420 + Math.random() * 60,
          telnyx_cost: 4.5,
          twilio_cost: 7.5,
        }));
        setPerfData(mockData);
        setLatencyData(mockData);
      }
    } catch (err) {
      console.error('Error fetching performance data:', err);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 10000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'delivery', label: 'Delivery Rate' },
    { id: 'latency', label: 'Latency' },
    { id: 'cost', label: 'Cost/1K msgs' },
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-purple-400" />
        <h2 className="text-white font-bold text-lg">Performance Comparison</h2>
      </div>
      <div className="flex gap-2 mb-4">
        {tabs?.map(tab => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab?.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'latency' ? (
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} unit="ms" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="telnyx_latency" name="Telnyx" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="twilio_latency" name="Twilio" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} unit={activeTab === 'delivery' ? '%' : '$'} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey={`telnyx_${activeTab}`} name="Telnyx" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey={`twilio_${activeTab}`} name="Twilio" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-white text-sm font-semibold">Telnyx</span>
          </div>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between"><span>Delivery Rate</span><span className="text-green-400">97.2%</span></div>
            <div className="flex justify-between"><span>Avg Latency</span><span className="text-white">312ms</span></div>
            <div className="flex justify-between"><span>Cost/1K</span><span className="text-white">$4.50</span></div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-white text-sm font-semibold">Twilio</span>
          </div>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between"><span>Delivery Rate</span><span className="text-green-400">96.5%</span></div>
            <div className="flex justify-between"><span>Avg Latency</span><span className="text-white">445ms</span></div>
            <div className="flex justify-between"><span>Cost/1K</span><span className="text-white">$7.50</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
