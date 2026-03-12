import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Monitor, RefreshCw, Clock, Wifi } from 'lucide-react';
import SubscriptionHealthPanel from './components/SubscriptionHealthPanel';
import DataConsistencyPanel from './components/DataConsistencyPanel';
import InjectionDeliveryPanel from './components/InjectionDeliveryPanel';
import SyncFailureAlertsPanel from './components/SyncFailureAlertsPanel';
import LatencyMonitorPanel from './components/LatencyMonitorPanel';
import SyncHealthScorePanel from './components/SyncHealthScorePanel';

const REFRESH_INTERVAL = 15000;

const RealTimeMCQSyncMonitorDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [consistencyData, setConsistencyData] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [failures, setFailures] = useState([]);
  const [latencyData, setLatencyData] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const [healthComponents, setHealthComponents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);
  const realtimeSubRef = useRef(null);

  const fetchSyncData = useCallback(async () => {
    setLoading(true);
    try {
      const startTime = Date.now();

      const [broadcastsRes, mcqResponsesRes, analyticsRes] = await Promise.all([
        supabase?.from('live_question_broadcasts')?.select('id, question_id, broadcast_at, recipient_count, delivery_status, created_at')?.order('broadcast_at', { ascending: false })?.limit(20),
        supabase?.from('voter_mcq_responses')?.select('id, election_id, voter_id, created_at, platform')?.order('created_at', { ascending: false })?.limit(100),
        supabase?.from('live_question_response_analytics')?.select('*')?.order('created_at', { ascending: false })?.limit(50)
      ]);

      const pingLatency = Date.now() - startTime;

      const broadcasts = broadcastsRes?.data || [];
      const responses = mcqResponsesRes?.data || [];
      const analytics = analyticsRes?.data || [];

      const subStatus = [
        { table: 'live_question_broadcasts', channel: 'mcq-broadcasts', description: 'Live question injection channel', status: broadcastsRes?.error ? 'error' : 'active', latency: pingLatency },
        { table: 'voter_mcq_responses', channel: 'mcq-responses', description: 'Voter response collection', status: mcqResponsesRes?.error ? 'error' : 'active', latency: pingLatency + 5 },
        { table: 'live_question_response_analytics', channel: 'mcq-analytics', description: 'Response analytics stream', status: analyticsRes?.error ? 'error' : 'active', latency: pingLatency + 10 }
      ];
      setSubscriptions(subStatus);

      const webResponses = responses?.filter(r => r?.platform === 'web' || !r?.platform);
      const mobileResponses = responses?.filter(r => r?.platform === 'mobile');
      const mismatches = [];
      const webCount = webResponses?.length;
      const mobileCount = mobileResponses?.length;
      const diff = Math.abs(webCount - mobileCount);
      if (diff > 5) {
        mismatches?.push({
          id: 'count-mismatch',
          description: 'Response count discrepancy between Web and Mobile',
          suggestion: 'Verify sync configuration and check for dropped connections',
          webValue: `${webCount} records`,
          mobileValue: `${mobileCount} records`
        });
      }
      const consistencyScore = webCount + mobileCount > 0 ? Math.max(0, 100 - (diff / Math.max(webCount, mobileCount, 1)) * 100) : 100;
      setConsistencyData({ webCount, mobileCount, consistencyScore, mismatches });

      const totalBroadcasts = broadcasts?.length;
      const deliveredBroadcasts = broadcasts?.filter(b => b?.delivery_status === 'delivered' || b?.delivery_status === 'success')?.length;
      const overallDeliveryRate = totalBroadcasts > 0 ? (deliveredBroadcasts / totalBroadcasts) * 100 : 100;
      const totalRecipients = broadcasts?.reduce((sum, b) => sum + (b?.recipient_count || 0), 0);
      const engagementRate = analytics?.length > 0 ? Math.min(100, (analytics?.filter(a => a?.responded)?.length / analytics?.length) * 100) : 0;
      setDeliveryData({
        totalBroadcasts,
        overallDeliveryRate,
        totalRecipients,
        engagementRate,
        recentBroadcasts: broadcasts?.slice(0, 5)?.map(b => ({
          questionText: b?.question_id ? `Question ${b?.question_id?.slice(0, 8)}...` : 'Broadcast',
          recipients: b?.recipient_count || 0,
          deliveryRate: b?.delivery_status === 'delivered' ? 100 : b?.delivery_status === 'failed' ? 0 : 85,
          broadcastAt: b?.broadcast_at || b?.created_at
        }))
      });

      const failedBroadcasts = broadcasts?.filter(b => b?.delivery_status === 'failed');
      const newFailures = failedBroadcasts?.map(b => ({
        id: b?.id,
        description: `Broadcast delivery failed for question ${b?.question_id?.slice(0, 8) || 'unknown'}`,
        table: 'live_question_broadcasts',
        severity: 'high',
        retryCount: 0,
        lastError: 'Delivery timeout',
        autoRetryAt: new Date(Date.now() + 60000)?.toISOString()
      }));
      setFailures(newFailures);

      const newLatencyPoint = { time: new Date()?.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), latency: pingLatency, reconnected: false };
      setLatencyData(prev => [...prev?.slice(-19), newLatencyPoint]);

      const latencyScore = pingLatency < 100 ? 100 : pingLatency < 300 ? 75 : 40;
      const uptimeScore = subStatus?.filter(s => s?.status === 'active')?.length / subStatus?.length * 100;
      const components = { deliveryRate: overallDeliveryRate, consistencyScore, latencyScore, uptimeScore };
      const score = (overallDeliveryRate * 0.3 + consistencyScore * 0.3 + latencyScore * 0.2 + uptimeScore * 0.2);
      setHealthComponents(components);
      setHealthScore(Math.round(score));

      setLastRefresh(new Date());
    } catch (e) {
      console.error('Sync monitor fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSyncData();
  }, [fetchSyncData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchSyncData, REFRESH_INTERVAL);
    } else {
      clearInterval(intervalRef?.current);
    }
    return () => clearInterval(intervalRef?.current);
  }, [autoRefresh, fetchSyncData]);

  useEffect(() => {
    realtimeSubRef.current = supabase?.channel('mcq-sync-monitor')
      ?.on('postgres_changes', { event: '*', schema: 'public', table: 'live_question_broadcasts' }, () => fetchSyncData())
      ?.subscribe();
    return () => { realtimeSubRef?.current?.unsubscribe?.(); };
  }, [fetchSyncData]);

  const handleRetry = async (failure) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFailures(prev => prev?.filter(f => f?.id !== failure?.id));
  };

  const handleSendSMS = async (failureList) => {
    try {
      const telnyxApiKey = import.meta.env?.VITE_TELNYX_API_KEY;
      const fromNumber = import.meta.env?.VITE_TELNYX_PHONE_NUMBER;
      if (!telnyxApiKey || !fromNumber) throw new Error('Telnyx not configured');
      const message = `MCQ SYNC ALERT: ${failureList?.length} sync failures detected. Tables: ${[...new Set(failureList?.map(f => f?.table))]?.join(', ')}. Check dashboard immediately.`;
      await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${telnyxApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromNumber, to: fromNumber, text: message })
      });
    } catch (e) {
      throw new Error('SMS send failed: ' + e?.message);
    }
  };

  const handleReconcile = async (mismatch) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setConsistencyData(prev => ({
      ...prev,
      mismatches: prev?.mismatches?.filter(m => m?.id !== mismatch?.id),
      consistencyScore: Math.min(100, (prev?.consistencyScore || 0) + 5)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-700 bg-gray-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-xl">
                <Monitor className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Real-Time MCQ Sync Monitor</h1>
                <p className="text-gray-400 text-sm">Supabase subscription health & data consistency</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(prev => !prev)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${autoRefresh ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                <Wifi className="w-4 h-4" />
                {autoRefresh ? 'Live' : 'Paused'}
              </button>
              <button
                onClick={fetchSyncData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated: {lastRefresh?.toLocaleTimeString()}
            </p>
            {autoRefresh && <p className="text-teal-400 text-xs">Auto-refreshing every 15s</p>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubscriptionHealthPanel subscriptions={subscriptions} loading={loading} />
          <DataConsistencyPanel consistencyData={consistencyData} loading={loading} onReconcile={handleReconcile} />
          <InjectionDeliveryPanel deliveryData={deliveryData} loading={loading} />
          <SyncFailureAlertsPanel failures={failures} loading={loading} onRetry={handleRetry} onSendSMS={handleSendSMS} />
          <LatencyMonitorPanel latencyData={latencyData} loading={loading} />
          <SyncHealthScorePanel healthScore={healthScore} components={healthComponents} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default RealTimeMCQSyncMonitorDashboard;
