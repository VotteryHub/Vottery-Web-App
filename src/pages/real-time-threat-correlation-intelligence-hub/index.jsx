import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Zap, RefreshCw, Clock, Target, Brain } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '../../lib/supabase';
import { getChatCompletion } from '../../services/aiIntegrations/chatCompletion';
import MultiAIOrchestrationPanel from './components/MultiAIOrchestrationPanel';
import CascadingIncidentTimeline from './components/CascadingIncidentTimeline';
import AutomatedResponseCenter from './components/AutomatedResponseCenter';
import ThreatCorrelationEngine from './components/ThreatCorrelationEngine';

const REFRESH_INTERVAL = 10000;

const RealTimeThreatCorrelationIntelligenceHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [threatScore, setThreatScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [aiStatuses, setAiStatuses] = useState({
    claude: { status: 'idle', confidence: 0, lastAnalysis: null },
    openai: { status: 'idle', confidence: 0, lastAnalysis: null },
    perplexity: { status: 'idle', confidence: 0, lastAnalysis: null },
    gemini: { status: 'idle', confidence: 0, lastAnalysis: null },
  });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const subscriptionRef = useRef(null);

  const aggregateThreatScore = useCallback(async () => {
    try {
      const since = new Date(Date.now() - 60 * 60 * 1000)?.toISOString();
      const [fraudAlertsResponse, systemFailuresResponse, revenueAnomaliesResponse] = await Promise.all([
        supabase?.from('fraud_alerts')?.select('severity, created_at')?.gte('created_at', since)?.limit(100),
        supabase?.from('system_failures')?.select('severity, created_at')?.gte('created_at', since)?.limit(100),
        supabase?.from('revenue_anomalies')?.select('severity, created_at')?.gte('created_at', since)?.limit(100),
      ]);

      const fraudAlerts = fraudAlertsResponse?.data;
      const systemFailures = systemFailuresResponse?.data;
      const revenueAnomalies = revenueAnomaliesResponse?.data;

      const severityWeight = { critical: 10, high: 7, medium: 4, low: 1 };
      const calcScore = (items) => items?.reduce((sum, i) => sum + (severityWeight?.[i?.severity] || 2), 0) || 0;

      const fraudScore = calcScore(fraudAlerts);
      const failureScore = calcScore(systemFailures);
      const revenueScore = calcScore(revenueAnomalies);
      const rawScore = fraudScore * 0.5 + failureScore * 0.3 + revenueScore * 0.2;
      const normalized = Math.min(100, Math.round(rawScore));

      setThreatScore(normalized);
      setScoreHistory(prev => {
        const newPoint = { time: new Date()?.toLocaleTimeString(), score: normalized, fraud: Math.min(100, fraudScore), system: Math.min(100, failureScore), revenue: Math.min(100, revenueScore) };
        return [...prev?.slice(-19), newPoint];
      });

      // Combine incidents
      const allIncidents = [
        ...(fraudAlerts || [])?.map(i => ({ ...i, source: 'fraud_alerts', type: 'Fraud Alert' })),
        ...(systemFailures || [])?.map(i => ({ ...i, source: 'system_failures', type: 'System Failure' })),
        ...(revenueAnomalies || [])?.map(i => ({ ...i, source: 'revenue_anomalies', type: 'Revenue Anomaly' })),
      ]?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))?.slice(0, 50);
      setIncidents(allIncidents);
    } catch (e) {
      console.error('Error aggregating threat score:', e);
    }
  }, []);

  const runAIOrchestration = useCallback(async () => {
    const providers = [
      { key: 'claude', provider: 'ANTHROPIC', model: 'claude-sonnet-4-5-20250929' },
      { key: 'openai', provider: 'OPENAI', model: 'gpt-4o' },
      { key: 'perplexity', provider: 'PERPLEXITY', model: 'sonar-pro' },
      { key: 'gemini', provider: 'GEMINI', model: 'gemini-2.0-flash' },
    ];

    setAiStatuses(prev => Object.fromEntries(Object.keys(prev)?.map(k => [k, { ...prev?.[k], status: 'analyzing' }])));

    await Promise.allSettled(providers?.map(async ({ key, provider, model }) => {
      try {
        const messages = [
          { role: 'system', content: 'You are a security threat analyst. Assess the current threat level and provide a confidence score 0-100. Respond with JSON: {"threatLevel": "critical|high|medium|low", "confidence": 85, "summary": "..."}' },
          { role: 'user', content: `Current unified threat score: ${threatScore}/100. Assess security posture and provide threat analysis.` },
        ];
        const response = await getChatCompletion(provider, model, messages, { max_tokens: 300, temperature: 0.3 });
        const content = response?.choices?.[0]?.message?.content || response;
        const jsonMatch = String(content)?.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch?.[0]) : { threatLevel: 'medium', confidence: 70, summary: String(content)?.slice(0, 100) };
        setAiStatuses(prev => ({ ...prev, [key]: { status: 'complete', confidence: parsed?.confidence || 70, threatLevel: parsed?.threatLevel, summary: parsed?.summary, lastAnalysis: new Date()?.toLocaleTimeString() } }));
      } catch (e) {
        setAiStatuses(prev => ({ ...prev, [key]: { status: 'error', confidence: 0, lastAnalysis: new Date()?.toLocaleTimeString(), error: e?.message } }));
      }
    }));
  }, [threatScore]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await aggregateThreatScore();
    setLastRefresh(new Date()?.toLocaleTimeString());
    setLoading(false);
  }, [aggregateThreatScore]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL);

    // Supabase real-time subscriptions
    const sub = supabase?.channel('threat-correlation-hub')?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fraud_alerts' }, () => refresh())?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_failures' }, () => refresh())?.subscribe();
    subscriptionRef.current = sub;

    return () => {
      clearInterval(interval);
      supabase?.removeChannel(sub);
    };
  }, [refresh]);

  const getThreatColor = (score) => {
    if (score >= 80) return { text: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', border: 'border-red-400', label: 'CRITICAL' };
    if (score >= 60) return { text: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20', border: 'border-orange-400', label: 'HIGH' };
    if (score >= 40) return { text: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', border: 'border-yellow-400', label: 'MEDIUM' };
    return { text: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', border: 'border-green-400', label: 'LOW' };
  };

  const threatColors = getThreatColor(threatScore);

  const tabs = [
    { id: 'overview', label: 'Threat Overview', icon: Shield },
    { id: 'ai-orchestration', label: 'Multi-AI Orchestration', icon: Brain },
    { id: 'timeline', label: 'Incident Timeline', icon: Clock },
    { id: 'response', label: 'Response Center', icon: Zap },
    { id: 'correlation', label: 'Correlation Engine', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-600 to-purple-700 rounded-xl">
                <Shield size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Real-Time Threat Correlation Intelligence Hub</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Multi-AI orchestration across Claude, OpenAI, Perplexity & Gemini • 10s refresh</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastRefresh && <span className="text-xs text-gray-400">Last: {lastRefresh}</span>}
              <button
                onClick={() => { refresh(); runAIOrchestration(); }}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh All
              </button>
            </div>
          </div>
        </div>

        {/* Unified Threat Score */}
        <div className={`rounded-2xl p-6 mb-6 border-2 ${threatColors?.border} ${threatColors?.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Unified Threat Score</div>
              <div className={`text-6xl font-black ${threatColors?.text}`}>{threatScore}</div>
              <div className={`text-sm font-bold mt-1 ${threatColors?.text}`}>{threatColors?.label}</div>
            </div>
            <div className="flex-1 ml-8">
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={scoreHistory}>
                  <Area type="monotone" dataKey="score" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} dot={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip formatter={(v) => [`${v}`, 'Score']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-6 grid grid-cols-1 gap-2">
              {[{ label: 'Fraud', key: 'fraud', color: 'text-red-600' }, { label: 'System', key: 'system', color: 'text-orange-600' }, { label: 'Revenue', key: 'revenue', color: 'text-yellow-600' }]?.map(({ label, key, color }) => (
                <div key={key} className="text-right">
                  <span className="text-xs text-gray-500">{label}: </span>
                  <span className={`text-sm font-bold ${color}`}>{scoreHistory?.[scoreHistory?.length - 1]?.[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Service Status Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ key: 'claude', label: 'Claude', color: 'from-orange-500 to-red-500' },
            { key: 'openai', label: 'OpenAI', color: 'from-green-500 to-teal-500' },
            { key: 'perplexity', label: 'Perplexity', color: 'from-blue-500 to-cyan-500' },
            { key: 'gemini', label: 'Gemini', color: 'from-purple-500 to-indigo-500' },
          ]?.map(({ key, label, color }) => {
            const ai = aiStatuses?.[key];
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className={`px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${color}`}>{label}</div>
                  <span className={`text-xs font-medium ${
                    ai?.status === 'complete' ? 'text-green-600' : ai?.status === 'analyzing' ? 'text-blue-600' : ai?.status === 'error' ? 'text-red-600' : 'text-gray-400'
                  }`}>{ai?.status === 'analyzing' ? '⟳ Analyzing' : ai?.status === 'complete' ? '✓ Done' : ai?.status === 'error' ? '✗ Error' : '○ Idle'}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{ai?.confidence || 0}<span className="text-sm font-normal text-gray-500">/100</span></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{ai?.summary || ai?.threatLevel || 'No analysis yet'}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-5 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab?.id ? 'text-red-600 border-b-2 border-red-600 bg-red-50 dark:bg-red-900/10' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon size={16} />{tab?.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Incidents ({incidents?.length})</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {incidents?.slice(0, 20)?.map((inc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        inc?.severity === 'critical' ? 'bg-red-500' : inc?.severity === 'high' ? 'bg-orange-500' : inc?.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-32 flex-shrink-0">{inc?.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        inc?.severity === 'critical' ? 'bg-red-100 text-red-700' : inc?.severity === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{inc?.severity || 'medium'}</span>
                      <span className="text-xs text-gray-400 ml-auto">{new Date(inc.created_at)?.toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {incidents?.length === 0 && <div className="text-center py-8 text-gray-400">No incidents in the last hour</div>}
                </div>
              </div>
            )}
            {activeTab === 'ai-orchestration' && <MultiAIOrchestrationPanel aiStatuses={aiStatuses} onRunAnalysis={runAIOrchestration} threatScore={threatScore} />}
            {activeTab === 'timeline' && <CascadingIncidentTimeline incidents={incidents} scoreHistory={scoreHistory} />}
            {activeTab === 'response' && <AutomatedResponseCenter threatScore={threatScore} incidents={incidents} />}
            {activeTab === 'correlation' && <ThreatCorrelationEngine incidents={incidents} scoreHistory={scoreHistory} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeThreatCorrelationIntelligenceHub;
