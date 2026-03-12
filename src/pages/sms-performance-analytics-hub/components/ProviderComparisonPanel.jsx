import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProviderComparisonPanel = ({ timeRange }) => {
  const [activeMetric, setActiveMetric] = useState('deliveryRate');

  const providers = [
    {
      name: 'Telnyx',
      color: '#6366f1',
      deliveryRate: 97.1,
      avgLatency: 1180,
      costPerMessage: 0.0075,
      reliabilityScore: 98.2,
      uptime: 99.95,
      failoverCount: 8,
      monthlyMessages: 48200,
      successRate: 97.1
    },
    {
      name: 'Twilio',
      color: '#f97316',
      deliveryRate: 95.8,
      avgLatency: 1420,
      costPerMessage: 0.0085,
      reliabilityScore: 96.7,
      uptime: 99.88,
      failoverCount: 14,
      monthlyMessages: 31800,
      successRate: 95.8
    }
  ];

  const comparisonMetrics = [
    { key: 'deliveryRate', label: 'Delivery Rate', unit: '%', higherBetter: true },
    { key: 'avgLatency', label: 'Avg Latency', unit: 'ms', higherBetter: false },
    { key: 'costPerMessage', label: 'Cost/Message', unit: '$', higherBetter: false },
    { key: 'reliabilityScore', label: 'Reliability', unit: '%', higherBetter: true },
    { key: 'uptime', label: 'Uptime', unit: '%', higherBetter: true }
  ];

  const radarData = [
    { metric: 'Delivery', Telnyx: 97.1, Twilio: 95.8 },
    { metric: 'Speed', Telnyx: 88, Twilio: 76 },
    { metric: 'Reliability', Telnyx: 98.2, Twilio: 96.7 },
    { metric: 'Cost Eff.', Telnyx: 85, Twilio: 75 },
    { metric: 'Uptime', Telnyx: 99.95, Twilio: 99.88 }
  ];

  const latencyHistogram = [
    { range: '0-500ms', Telnyx: 12, Twilio: 8 },
    { range: '500-1000ms', Telnyx: 28, Twilio: 18 },
    { range: '1000-1500ms', Telnyx: 35, Twilio: 30 },
    { range: '1500-2000ms', Telnyx: 18, Twilio: 25 },
    { range: '2000ms+', Telnyx: 7, Twilio: 19 }
  ];

  const getWinner = (metric) => {
    const m = comparisonMetrics?.find(m => m?.key === metric);
    if (!m) return null;
    const telnyxVal = providers?.[0]?.[metric];
    const twilioVal = providers?.[1]?.[metric];
    if (m?.higherBetter) return telnyxVal >= twilioVal ? 'Telnyx' : 'Twilio';
    return telnyxVal <= twilioVal ? 'Telnyx' : 'Twilio';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {providers?.map(provider => (
          <div key={provider?.name} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${provider?.color}20` }}>
                <Icon name="Wifi" size={20} style={{ color: provider?.color }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{provider?.name}</h3>
                <p className="text-xs text-muted-foreground">SMS Provider</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Delivery Rate</p>
                <p className="text-xl font-bold" style={{ color: provider?.color }}>{provider?.deliveryRate}%</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                <p className="text-xl font-bold text-foreground">{provider?.avgLatency}ms</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Cost/Message</p>
                <p className="text-xl font-bold text-foreground">${provider?.costPerMessage}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                <p className="text-xl font-bold text-green-500">{provider?.uptime}%</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Messages</span>
                <span className="font-medium text-foreground">{provider?.monthlyMessages?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Failover Events</span>
                <span className="font-medium text-foreground">{provider?.failoverCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <Radar name="Telnyx" dataKey="Telnyx" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              <Radar name="Twilio" dataKey="Twilio" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Latency Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={latencyHistogram}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="range" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="Telnyx" fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Twilio" fill="#f97316" radius={[2, 2, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Head-to-Head Comparison</h3>
        <div className="space-y-4">
          {comparisonMetrics?.map(metric => {
            const winner = getWinner(metric?.key);
            const telnyxVal = providers?.[0]?.[metric?.key];
            const twilioVal = providers?.[1]?.[metric?.key];
            return (
              <div key={metric?.key} className="flex items-center gap-4">
                <div className="w-32 text-sm text-muted-foreground">{metric?.label}</div>
                <div className="flex-1 flex items-center gap-3">
                  <div className={`text-right w-24 text-sm font-bold ${winner === 'Telnyx' ? 'text-green-500' : 'text-foreground'}`}>
                    {metric?.unit === '$' ? `$${telnyxVal}` : `${telnyxVal}${metric?.unit}`}
                  </div>
                  <div className="flex-1 flex gap-1">
                    <div className="flex-1 bg-indigo-500/20 rounded-full h-2 flex justify-end">
                      <div className="bg-indigo-500 rounded-full h-2" style={{ width: `${Math.min(100, (telnyxVal / Math.max(telnyxVal, twilioVal)) * 100)}%` }} />
                    </div>
                    <div className="flex-1 bg-orange-500/20 rounded-full h-2">
                      <div className="bg-orange-500 rounded-full h-2" style={{ width: `${Math.min(100, (twilioVal / Math.max(telnyxVal, twilioVal)) * 100)}%` }} />
                    </div>
                  </div>
                  <div className={`w-24 text-sm font-bold ${winner === 'Twilio' ? 'text-green-500' : 'text-foreground'}`}>
                    {metric?.unit === '$' ? `$${twilioVal}` : `${twilioVal}${metric?.unit}`}
                  </div>
                </div>
                {winner && (
                  <div className="w-20 text-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 font-medium">{winner} ✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProviderComparisonPanel;