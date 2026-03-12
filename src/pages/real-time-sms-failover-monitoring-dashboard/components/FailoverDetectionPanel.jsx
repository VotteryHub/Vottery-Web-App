import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { ArrowRightLeft, Clock, AlertCircle, CheckCircle, Zap } from 'lucide-react';

const FailoverAnimation = ({ isAnimating, fromProvider, toProvider }) => (
  <div className="flex items-center justify-center gap-4 py-6">
    <div className={`flex flex-col items-center gap-2 transition-all duration-700 ${
      isAnimating && fromProvider === 'telnyx' ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-700 ${
        fromProvider === 'telnyx' && isAnimating ? 'border-red-500 bg-red-500/10' : 'border-blue-500 bg-blue-500/10'
      }`}>
        <Zap className="w-8 h-8 text-blue-400" />
      </div>
      <span className="text-white font-semibold text-sm">Telnyx</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className={`transition-all duration-500 ${
        isAnimating ? 'text-yellow-400 scale-125' : 'text-gray-600'
      }`}>
        <ArrowRightLeft className="w-8 h-8" />
      </div>
      {isAnimating && (
        <span className="text-yellow-400 text-xs font-bold animate-pulse">SWITCHING</span>
      )}
    </div>
    <div className={`flex flex-col items-center gap-2 transition-all duration-700 ${
      isAnimating && toProvider === 'twilio' ? 'opacity-100 scale-105' : 'opacity-60 scale-100'
    }`}>
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-700 ${
        toProvider === 'twilio' && isAnimating ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-gray-800'
      }`}>
        <Zap className="w-8 h-8 text-purple-400" />
      </div>
      <span className="text-white font-semibold text-sm">Twilio</span>
    </div>
  </div>
);

export default function FailoverDetectionPanel() {
  const [failoverEvents, setFailoverEvents] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animFrom, setAnimFrom] = useState('telnyx');
  const [animTo, setAnimTo] = useState('twilio');
  const [lastEvent, setLastEvent] = useState(null);
  const [metrics, setMetrics] = useState({ totalSwitches: 0, avgResponseTime: 0, successRate: 100 });

  const fetchFailoverEvents = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_failover_events')
        ?.select('*')
        ?.order('triggered_at', { ascending: false })
        ?.limit(10);

      if (data?.length) {
        setFailoverEvents(data);
        setLastEvent(data?.[0]);
        setMetrics({
          totalSwitches: data?.length,
          avgResponseTime: Math.round(data?.reduce((s, e) => s + (e?.resolution_time_ms || 1800), 0) / data?.length),
          successRate: 100,
        });
      }
    } catch (err) {
      console.error('Error fetching failover events:', err);
    }
  };

  useEffect(() => {
    fetchFailoverEvents();
  }, []);

  useEffect(() => {
    const channel = supabase
      ?.channel('failover-events-realtime')
      ?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sms_failover_events' }, (payload) => {
        const event = payload?.new;
        setAnimFrom(event?.from_provider || 'telnyx');
        setAnimTo(event?.to_provider || 'twilio');
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 3000);
        fetchFailoverEvents();
      })
      ?.subscribe();
    return () => supabase?.removeChannel(channel);
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-5 h-5 text-yellow-400" />
        <h2 className="text-white font-bold text-lg">Failover Detection Engine</h2>
        {isAnimating && (
          <span className="ml-auto bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full animate-pulse font-bold">
            FAILOVER IN PROGRESS
          </span>
        )}
      </div>
      <FailoverAnimation isAnimating={isAnimating} fromProvider={animFrom} toProvider={animTo} />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{metrics?.totalSwitches}</div>
          <div className="text-gray-400 text-xs mt-1">Total Switches</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{metrics?.avgResponseTime}ms</div>
          <div className="text-gray-400 text-xs mt-1">Avg Response</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{metrics?.successRate}%</div>
          <div className="text-gray-400 text-xs mt-1">Success Rate</div>
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-semibold mb-3">Recent Failover Events</h3>
        {failoverEvents?.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">No failover events — all providers stable</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {failoverEvents?.map((event) => (
              <div key={event?.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">
                    {event?.from_provider} → {event?.to_provider}
                  </div>
                  <div className="text-gray-400 text-xs truncate">{event?.reason || 'Automatic failover'}</div>
                </div>
                <div className="text-gray-500 text-xs flex-shrink-0">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {new Date(event.triggered_at)?.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
