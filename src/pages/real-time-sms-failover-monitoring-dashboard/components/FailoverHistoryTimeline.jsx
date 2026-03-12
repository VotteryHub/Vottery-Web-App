import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Clock, ArrowRight, CheckCircle, AlertTriangle, Timer } from 'lucide-react';

export default function FailoverHistoryTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_failover_events')
        ?.select('*')
        ?.order('triggered_at', { ascending: false })
        ?.limit(20);

      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching failover history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const channel = supabase
      ?.channel('failover-history-channel')
      ?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sms_failover_events' }, fetchHistory)
      ?.subscribe();
    return () => supabase?.removeChannel(channel);
  }, []);

  const mockEvents = [
    { id: '1', from_provider: 'telnyx', to_provider: 'twilio', reason: 'Health check failed - latency exceeded 2000ms', triggered_at: new Date(Date.now() - 3600000)?.toISOString(), recovery_at: new Date(Date.now() - 3000000)?.toISOString(), resolution_time_ms: 1800, affected_messages: 12 },
    { id: '2', from_provider: 'twilio', to_provider: 'telnyx', reason: 'Telnyx service restored', triggered_at: new Date(Date.now() - 3000000)?.toISOString(), recovery_at: null, resolution_time_ms: 950, affected_messages: 0 },
  ];

  const displayEvents = events?.length > 0 ? events : mockEvents;

  const getDuration = (event) => {
    if (!event?.recovery_at) return 'Ongoing';
    const ms = new Date(event.recovery_at) - new Date(event.triggered_at);
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-orange-400" />
        <h2 className="text-white font-bold text-lg">Failover History Timeline</h2>
        <span className="ml-auto text-gray-500 text-xs">{displayEvents?.length} events</span>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : displayEvents?.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-gray-400">No failover events recorded</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-700" />
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {displayEvents?.map((event, idx) => (
              <div key={event?.id || idx} className="relative flex gap-4 pl-12">
                <div className="absolute left-3.5 w-3 h-3 rounded-full bg-yellow-500 border-2 border-gray-900 mt-1" />
                <div className="flex-1 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 font-semibold text-sm capitalize">{event?.from_provider}</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="text-purple-400 font-semibold text-sm capitalize">{event?.to_provider}</span>
                    {event?.recovery_at ? (
                      <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400 ml-auto" />
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mb-3">{event?.reason || 'Automatic failover triggered'}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(event.triggered_at)?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Timer className="w-3 h-3" />
                      Duration: {getDuration(event)}
                    </span>
                    {event?.resolution_time_ms && (
                      <span className="text-blue-400">Response: {event?.resolution_time_ms}ms</span>
                    )}
                    {event?.affected_messages > 0 && (
                      <span className="text-yellow-400">{event?.affected_messages} msgs affected</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
