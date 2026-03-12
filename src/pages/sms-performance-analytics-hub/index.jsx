import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const CARRIER_DATA = [
  { carrier: 'AT&T', deliveryRate: 98.2, latency: 1.2, cost: 0.0075, color: '#3B82F6' },
  { carrier: 'Verizon', deliveryRate: 97.8, latency: 1.4, cost: 0.0082, color: '#10B981' },
  { carrier: 'T-Mobile', deliveryRate: 96.5, latency: 1.8, cost: 0.0068, color: '#F59E0B' },
  { carrier: 'Sprint', deliveryRate: 94.1, latency: 2.3, cost: 0.0071, color: '#8B5CF6' }
];

const TREND_DATA = [
  { date: 'Feb 19', telnyx: 97.2, twilio: 96.8, predicted: 97.5 },
  { date: 'Feb 20', telnyx: 98.1, twilio: 97.2, predicted: 97.8 },
  { date: 'Feb 21', telnyx: 97.8, twilio: 96.5, predicted: 97.6 },
  { date: 'Feb 22', telnyx: 98.4, twilio: 97.8, predicted: 98.1 },
  { date: 'Feb 23', telnyx: 97.9, twilio: 97.1, predicted: 97.9 },
  { date: 'Feb 24', telnyx: 98.6, twilio: 97.5, predicted: 98.3 },
  { date: 'Feb 25', telnyx: 98.2, twilio: 97.3, predicted: 98.5 }
];

const LATENCY_DATA = [
  { range: '0-0.5s', count: 120 }, { range: '0.5-1s', count: 340 },
  { range: '1-1.5s', count: 280 }, { range: '1.5-2s', count: 180 },
  { range: '2-3s', count: 95 }, { range: '3s+', count: 42 }
];

const SMSPerformanceAnalyticsHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [healthCheckData, setHealthCheckData] = useState([]);
  const [failoverEvents, setFailoverEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [healthRes, failoverRes] = await Promise.all([
        supabase?.from('sms_health_check_results')?.select('*')?.order('created_at', { ascending: false })?.limit(50),
        supabase?.from('sms_failover_history')?.select('*')?.order('created_at', { ascending: false })?.limit(20)
      ]);
      if (healthRes?.data) setHealthCheckData(healthRes?.data);
      if (failoverRes?.data) setFailoverEvents(failoverRes?.data);
    } catch (err) {
      console.error('Error loading SMS analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const passRate = healthCheckData?.length
    ? ((healthCheckData?.filter(h => h?.status === 'pass')?.length / healthCheckData?.length) * 100)?.toFixed(1)
    : '98.2';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Activity' },
    { id: 'carriers', label: 'Carrier Analysis', icon: 'Radio' },
    { id: 'providers', label: 'Provider Comparison', icon: 'GitCompare' },
    { id: 'failover', label: 'Failover Events', icon: 'AlertTriangle' }
  ];

  const handleExportCSV = () => {
    const rows = [['Date', 'Provider', 'Status', 'Latency', 'Carrier']];
    healthCheckData?.forEach(h => rows?.push([h?.created_at, h?.provider, h?.status, h?.latency_ms, h?.carrier]));
    const csv = rows?.map(r => r?.join(','))?.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sms_analytics.csv'; a?.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet><title>SMS Performance Analytics Hub | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 ml-64 mt-16 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name="Activity" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">SMS Performance & Analytics Hub</h1>
                  <p className="text-gray-400 text-sm">Comprehensive SMS metrics, health checks, failover events & AI-predicted trends</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none"
                >
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Icon name="Download" size={14} className="mr-1.5" />Export CSV
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Health Check Pass Rate', value: `${passRate}%`, icon: 'CheckCircle', color: 'green', change: '+0.3%' },
                { label: 'Failover Events (7d)', value: failoverEvents?.length || '3', icon: 'AlertTriangle', color: 'yellow', change: '-2' },
                { label: 'Avg Delivery Rate', value: '97.2%', icon: 'Send', color: 'blue', change: '+1.1%' },
                { label: 'Avg Latency', value: '1.4s', icon: 'Clock', color: 'purple', change: '-0.2s' }
              ]?.map(kpi => (
                <div key={kpi?.label} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={kpi?.icon} size={14} className={`text-${kpi?.color}-400`} />
                    <span className="text-gray-400 text-xs">{kpi?.label}</span>
                  </div>
                  <div className={`text-xl font-bold text-${kpi?.color}-400`}>{kpi?.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{kpi?.change} vs prev period</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-700 rounded-xl p-1 w-fit">
            {tabs?.map(tab => (
              <button key={tab?.id} onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab?.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                }`}>
                <Icon name={tab?.icon} size={14} />{tab?.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Provider Delivery Rate Trends + AI Predictions</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis domain={[94, 100]} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="telnyx" stroke="#3B82F6" strokeWidth={2} name="Telnyx" dot={false} />
                      <Line type="monotone" dataKey="twilio" stroke="#10B981" strokeWidth={2} name="Twilio" dot={false} />
                      <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" name="AI Predicted" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-3">
                  {[{c:'#3B82F6',l:'Telnyx'},{c:'#10B981',l:'Twilio'},{c:'#8B5CF6',l:'AI Predicted',dash:true}]?.map(i=>(
                    <div key={i?.l} className="flex items-center gap-1.5">
                      <div className={`w-4 h-0.5 ${i?.dash ? 'border-t-2 border-dashed' : ''}`} style={{backgroundColor: i?.dash ? 'transparent' : i?.c, borderColor: i?.c}} />
                      <span className="text-gray-500 text-xs">{i?.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Latency Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={LATENCY_DATA} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="range" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#6366F1" radius={[4,4,0,0]} name="Messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'carriers' && (
            <div className="grid grid-cols-2 gap-6">
              {CARRIER_DATA?.map(carrier => (
                <div key={carrier?.carrier} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">{carrier?.carrier}</h3>
                    <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs">{carrier?.deliveryRate}% delivery</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold" style={{color: carrier?.color}}>{carrier?.deliveryRate}%</div>
                      <div className="text-gray-500 text-xs mt-1">Delivery Rate</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-yellow-400">{carrier?.latency}s</div>
                      <div className="text-gray-500 text-xs mt-1">Avg Latency</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-400">${carrier?.cost}</div>
                      <div className="text-gray-500 text-xs mt-1">Cost/SMS</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Delivery Rate</span>
                      <span className="text-gray-400">{carrier?.deliveryRate}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{width:`${carrier?.deliveryRate}%`, backgroundColor: carrier?.color}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'providers' && (
            <div className="grid grid-cols-2 gap-6">
              {[{name:'Telnyx', color:'blue', delivery:98.2, latency:1.2, cost:0.0075, uptime:99.9},{name:'Twilio', color:'green', delivery:97.3, latency:1.6, cost:0.0085, uptime:99.7}]?.map(p=>(
                <div key={p?.name} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-${p?.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <Icon name="Wifi" size={20} className={`text-${p?.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{p?.name}</h3>
                      <span className="text-green-400 text-xs">● Active</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[{l:'Delivery Rate',v:`${p?.delivery}%`,c:p?.color},{l:'Avg Latency',v:`${p?.latency}s`,c:'yellow'},{l:'Cost per SMS',v:`$${p?.cost}`,c:'green'},{l:'Uptime',v:`${p?.uptime}%`,c:'purple'}]?.map(m=>(
                      <div key={m?.l} className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{m?.l}</span>
                        <span className={`text-${m?.c}-400 font-medium`}>{m?.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'failover' && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Failover Event Timeline</h3>
              {failoverEvents?.length > 0 ? (
                <div className="space-y-3">
                  {failoverEvents?.map((event, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{event?.from_provider} → {event?.to_provider}</span>
                          <span className="text-gray-500 text-xs">{new Date(event.created_at)?.toLocaleString()}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{event?.reason || 'Provider health check failed'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[{from:'Telnyx',to:'Twilio',reason:'Latency exceeded 3s threshold',time:'Feb 24, 09:15 AM',duration:'4m 32s'},{from:'Twilio',to:'Telnyx',reason:'Delivery rate dropped below 95%',time:'Feb 22, 03:42 PM',duration:'2m 18s'},{from:'Telnyx',to:'Twilio',reason:'API timeout errors',time:'Feb 20, 11:28 AM',duration:'6m 05s'}]?.map((e,i)=>(
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{e?.from} → {e?.to}</span>
                          <span className="text-gray-500 text-xs">{e?.time}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{e?.reason}</p>
                        <span className="text-yellow-400 text-xs">Duration: {e?.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SMSPerformanceAnalyticsHub;