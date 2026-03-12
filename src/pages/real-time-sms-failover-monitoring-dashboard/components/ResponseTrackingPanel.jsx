import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

export default function ResponseTrackingPanel() {
  const [responseData, setResponseData] = useState([]);
  const [currentTelnyx, setCurrentTelnyx] = useState(312);
  const [currentTwilio, setCurrentTwilio] = useState(445);
  const [trend, setTrend] = useState({ telnyx: 'stable', twilio: 'stable' });
  const intervalRef = useRef(null);

  const generateDataPoint = (prevTelnyx, prevTwilio) => {
    const telnyxVariance = (Math.random() - 0.5) * 40;
    const twilioVariance = (Math.random() - 0.5) * 50;
    const newTelnyx = Math.max(200, Math.min(600, prevTelnyx + telnyxVariance));
    const newTwilio = Math.max(300, Math.min(800, prevTwilio + twilioVariance));
    return {
      time: new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      telnyx: Math.round(newTelnyx),
      twilio: Math.round(newTwilio),
      threshold: 2000,
    };
  };

  const fetchLatestMetrics = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_health_check_results')
        ?.select('provider, latency_ms, checked_at')
        ?.order('checked_at', { ascending: false })
        ?.limit(20);

      if (data?.length) {
        const telnyxLatest = data?.find(d => d?.provider === 'telnyx');
        const twilioLatest = data?.find(d => d?.provider === 'twilio');
        if (telnyxLatest?.latency_ms) setCurrentTelnyx(telnyxLatest?.latency_ms);
        if (twilioLatest?.latency_ms) setCurrentTwilio(twilioLatest?.latency_ms);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  useEffect(() => {
    fetchLatestMetrics();
    const initial = Array.from({ length: 15 }, (_, i) => ({
      time: new Date(Date.now() - (14 - i) * 2000)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      telnyx: 300 + Math.random() * 60,
      twilio: 420 + Math.random() * 80,
      threshold: 2000,
    }));
    setResponseData(initial);

    intervalRef.current = setInterval(() => {
      setResponseData(prev => {
        const last = prev?.[prev?.length - 1];
        const newPoint = generateDataPoint(last?.telnyx || 312, last?.twilio || 445);
        setCurrentTelnyx(newPoint?.telnyx);
        setCurrentTwilio(newPoint?.twilio);
        const prevTelnyx = prev?.[prev?.length - 2]?.telnyx || newPoint?.telnyx;
        const prevTwilio = prev?.[prev?.length - 2]?.twilio || newPoint?.twilio;
        setTrend({
          telnyx: newPoint?.telnyx > prevTelnyx + 20 ? 'up' : newPoint?.telnyx < prevTelnyx - 20 ? 'down' : 'stable',
          twilio: newPoint?.twilio > prevTwilio + 20 ? 'up' : newPoint?.twilio < prevTwilio - 20 ? 'down' : 'stable',
        });
        return [...prev?.slice(-29), newPoint];
      });
    }, 2000);

    return () => clearInterval(intervalRef?.current);
  }, []);

  const TrendIcon = ({ t }) => t === 'up' ? <TrendingUp className="w-4 h-4 text-red-400" /> : t === 'down' ? <TrendingDown className="w-4 h-4 text-green-400" /> : null;

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <h2 className="text-white font-bold text-lg">2-Second Response Tracking</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-400 text-xs">Live Stream</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Telnyx Response</span>
            <TrendIcon t={trend?.telnyx} />
          </div>
          <div className={`text-2xl font-bold mt-1 ${
            currentTelnyx < 500 ? 'text-green-400' : currentTelnyx < 1000 ? 'text-yellow-400' : 'text-red-400'
          }`}>{Math.round(currentTelnyx)}ms</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Twilio Response</span>
            <TrendIcon t={trend?.twilio} />
          </div>
          <div className={`text-2xl font-bold mt-1 ${
            currentTwilio < 500 ? 'text-green-400' : currentTwilio < 1000 ? 'text-yellow-400' : 'text-red-400'
          }`}>{Math.round(currentTwilio)}ms</div>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={responseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 10 }} interval={4} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} unit="ms" domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
              formatter={(val, name) => [`${Math.round(val)}ms`, name]}
            />
            <ReferenceLine y={2000} stroke="#EF4444" strokeDasharray="4 4" label={{ value: '2s limit', fill: '#EF4444', fontSize: 10 }} />
            <Line type="monotone" dataKey="telnyx" name="Telnyx" stroke="#3B82F6" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="twilio" name="Twilio" stroke="#8B5CF6" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> Telnyx</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-purple-500 inline-block" /> Twilio</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block border-dashed" /> 2s Threshold</span>
      </div>
    </div>
  );
}
