import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const CONTENT_TYPE_REVENUE = [
  { type: 'Jolts Video', revenue: 48200, sponsorship: 12400, growth: 18.4, color: '#3B82F6' },
  { type: 'Horizontal Snap', revenue: 32100, sponsorship: 8900, growth: 12.1, color: '#10B981' },
  { type: 'Vertical Stack', revenue: 28700, sponsorship: 7200, growth: 9.8, color: '#F59E0B' },
  { type: 'Gradient Flow', revenue: 21500, sponsorship: 5800, growth: 15.3, color: '#8B5CF6' }
];

const ZONE_REVENUE = [
  { zone: 'USA', revenue: 42800, share: 32.1, color: '#3B82F6' },
  { zone: 'W. Europe', revenue: 28400, share: 21.3, color: '#10B981' },
  { zone: 'Australasia', revenue: 18200, share: 13.6, color: '#F59E0B' },
  { zone: 'Middle East/Asia', revenue: 14600, share: 10.9, color: '#8B5CF6' },
  { zone: 'Latin America', revenue: 11200, share: 8.4, color: '#EF4444' },
  { zone: 'E. Europe', revenue: 8900, share: 6.7, color: '#06B6D4' },
  { zone: 'India', revenue: 6400, share: 4.8, color: '#F97316' },
  { zone: 'Africa', revenue: 2800, share: 2.1, color: '#84CC16' }
];

const FORECAST_DATA = [
  { month: 'Mar', actual: null, forecast30: 148000, forecast60: null, forecast90: null },
  { month: 'Apr', actual: null, forecast30: null, forecast60: 162000, forecast90: null },
  { month: 'May', actual: null, forecast30: null, forecast60: null, forecast90: 178000 },
];

const HISTORICAL_DATA = [
  { month: 'Sep', revenue: 98200 }, { month: 'Oct', revenue: 108400 },
  { month: 'Nov', revenue: 118900 }, { month: 'Dec', revenue: 132100 },
  { month: 'Jan', revenue: 121800 }, { month: 'Feb', revenue: 133200 }
];

const EnhancedCarouselROIAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [timeRange, setTimeRange] = useState('30d');
  const [aiRecommendations, setAiRecommendations] = useState([
    { type: 'warning', title: 'Gradient Flow Underperforming', desc: 'Gradient Flow carousels show 23% lower CTR vs benchmark. Consider A/B testing new content formats.', impact: '+$8,400/mo' },
    { type: 'success', title: 'Jolts Video Momentum', desc: 'Jolts video monetization growing 18.4% MoM. Increase allocation in USA and W. Europe zones.', impact: '+$12,200/mo' },
    { type: 'info', title: 'India Zone Opportunity', desc: 'India zone shows high engagement but low monetization. Localized sponsorship packages recommended.', impact: '+$4,800/mo' }
  ]);

  const totalRevenue = CONTENT_TYPE_REVENUE?.reduce((sum, c) => sum + c?.revenue, 0);
  const totalSponsor = CONTENT_TYPE_REVENUE?.reduce((sum, c) => sum + c?.sponsorship, 0);

  const tabs = [
    { id: 'financial', label: 'Financial Analysis', icon: 'DollarSign' },
    { id: 'zones', label: 'Zone Revenue', icon: 'Globe' },
    { id: 'forecast', label: 'Predictive Forecast', icon: 'TrendingUp' },
    { id: 'recommendations', label: 'AI Recommendations', icon: 'Sparkles' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet><title>Enhanced Carousel ROI Analytics | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 ml-64 mt-16 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Enhanced Carousel ROI Analytics</h1>
                  <p className="text-gray-400 text-sm">Financial analysis per content type with predictive modeling & AI optimization</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select value={timeRange} onChange={(e) => setTimeRange(e?.target?.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none">
                  <option value="30d">Last 30 days</option>
                  <option value="60d">Last 60 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
                <Button variant="outline" size="sm">
                  <Icon name="Download" size={14} className="mr-1.5" />Export
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Total Revenue', value: `$${(totalRevenue / 1000)?.toFixed(1)}K`, icon: 'DollarSign', color: 'green', change: '+14.2%' },
                { label: 'Sponsorship Revenue', value: `$${(totalSponsor / 1000)?.toFixed(1)}K`, icon: 'Handshake', color: 'blue', change: '+11.8%' },
                { label: 'Top Zone (USA)', value: '$42.8K', icon: 'Globe', color: 'purple', change: '+9.4%' },
                { label: 'Jolts Monetization', value: '$48.2K', icon: 'Video', color: 'orange', change: '+18.4%' }
              ]?.map(kpi => (
                <div key={kpi?.label} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={kpi?.icon} size={14} className={`text-${kpi?.color}-400`} />
                    <span className="text-gray-400 text-xs">{kpi?.label}</span>
                  </div>
                  <div className={`text-xl font-bold text-${kpi?.color}-400`}>{kpi?.value}</div>
                  <div className="text-green-400 text-xs mt-1">{kpi?.change} vs prev period</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-700 rounded-xl p-1 w-fit">
            {tabs?.map(tab => (
              <button key={tab?.id} onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab?.id ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                }`}>
                <Icon name={tab?.icon} size={14} />{tab?.label}
              </button>
            ))}
          </div>

          {activeTab === 'financial' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Revenue by Content Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CONTENT_TYPE_REVENUE} margin={{ left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="type" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `$${(v / 1000)?.toFixed(0)}K`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        formatter={(v) => [`$${v?.toLocaleString()}`, '']} />
                      <Bar dataKey="revenue" name="Revenue" radius={[4,4,0,0]}>
                        {CONTENT_TYPE_REVENUE?.map((e, i) => <Cell key={i} fill={e?.color} />)}
                      </Bar>
                      <Bar dataKey="sponsorship" name="Sponsorship" fill="#6B7280" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-span-4 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Content Type Breakdown</h3>
                <div className="space-y-4">
                  {CONTENT_TYPE_REVENUE?.map(ct => (
                    <div key={ct?.type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-300 text-sm">{ct?.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-xs">+{ct?.growth}%</span>
                          <span className="text-white text-sm font-medium">${(ct?.revenue / 1000)?.toFixed(1)}K</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{width:`${(ct?.revenue/totalRevenue)*100}%`, backgroundColor: ct?.color}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-5 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Zone Revenue Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ZONE_REVENUE} dataKey="revenue" nameKey="zone" cx="50%" cy="50%" outerRadius={100}>
                        {ZONE_REVENUE?.map((e, i) => <Cell key={i} fill={e?.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        formatter={(v) => [`$${v?.toLocaleString()}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-span-7 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Zone Revenue Breakdown (8 Purchasing Power Zones)</h3>
                <div className="space-y-3">
                  {ZONE_REVENUE?.map(zone => (
                    <div key={zone?.zone} className="flex items-center gap-4">
                      <div className="w-24 text-gray-300 text-sm">{zone?.zone}</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-3">
                        <div className="h-3 rounded-full" style={{width:`${zone?.share}%`, backgroundColor: zone?.color}} />
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-white text-sm font-medium">${(zone?.revenue / 1000)?.toFixed(1)}K</span>
                      </div>
                      <div className="w-12 text-right">
                        <span className="text-gray-400 text-xs">{zone?.share}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">30-60-90 Day Revenue Forecast</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[...HISTORICAL_DATA, ...FORECAST_DATA?.map(f => ({month: f?.month, revenue: f?.forecast30 || f?.forecast60 || f?.forecast90, forecast: true}))]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={v => `$${(v / 1000)?.toFixed(0)}K`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        formatter={(v) => [`$${v?.toLocaleString()}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} name="Revenue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[{label:'30-Day Forecast',value:'$148K',change:'+11.1%',color:'green'},{label:'60-Day Forecast',value:'$162K',change:'+21.6%',color:'blue'},{label:'90-Day Forecast',value:'$178K',change:'+33.6%',color:'purple'}]?.map(f=>(
                    <div key={f?.label} className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className={`text-lg font-bold text-${f?.color}-400`}>{f?.value}</div>
                      <div className="text-gray-500 text-xs mt-1">{f?.label}</div>
                      <div className="text-green-400 text-xs">{f?.change}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-4 bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">ML Model Confidence</h3>
                <div className="space-y-4">
                  {[{label:'30-Day Accuracy',value:94,color:'green'},{label:'60-Day Accuracy',value:87,color:'blue'},{label:'90-Day Accuracy',value:79,color:'purple'}]?.map(m=>(
                    <div key={m?.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-gray-400 text-sm">{m?.label}</span>
                        <span className={`text-${m?.color}-400 text-sm font-medium`}>{m?.value}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className={`bg-${m?.color}-500 h-2 rounded-full`} style={{width:`${m?.value}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <div className="text-gray-400 text-xs mb-2">Model: Gradient Boosting + LSTM</div>
                  <div className="text-gray-400 text-xs">Training data: 18 months historical</div>
                  <div className="text-gray-400 text-xs mt-1">Last retrained: Feb 24, 2026</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Sparkles" size={16} className="text-purple-400" />
                <span className="text-gray-400 text-sm">AI-generated optimization recommendations based on performance analysis</span>
              </div>
              {aiRecommendations?.map((rec, i) => (
                <div key={i} className={`bg-gray-900 border rounded-xl p-6 ${
                  rec?.type === 'warning' ? 'border-yellow-500/30' :
                  rec?.type === 'success' ? 'border-green-500/30' : 'border-blue-500/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        rec?.type === 'warning' ? 'bg-yellow-500/20' :
                        rec?.type === 'success' ? 'bg-green-500/20' : 'bg-blue-500/20'
                      }`}>
                        <Icon name={rec?.type === 'warning' ? 'AlertTriangle' : rec?.type === 'success' ? 'TrendingUp' : 'Info'}
                          size={16} className={rec?.type === 'warning' ? 'text-yellow-400' : rec?.type === 'success' ? 'text-green-400' : 'text-blue-400'} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{rec?.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{rec?.desc}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-green-400 font-bold">{rec?.impact}</div>
                      <div className="text-gray-500 text-xs">Est. impact</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EnhancedCarouselROIAnalyticsDashboard;