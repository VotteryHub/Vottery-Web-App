import React from 'react';
import { Shield, Eye, TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const ComplianceOversightHub = () => {
  const disclosureMetrics = [
    { label: 'Anonymous Ballots', value: '84.2%', trend: '+2.1%', status: 'good' },
    { label: 'Selective ID Reveal', value: '15.8%', trend: '-1.4%', status: 'neutral' },
    { label: 'KYC Verification', value: '98.9%', trend: '+0.5%', status: 'good' },
  ];

  const growthSignals = [
    { label: 'Viral Coeff (K)', value: '1.24', trend: '+0.08', status: 'good' },
    { label: 'Referral Conversion', value: '28%', trend: '+4%', status: 'good' },
    { label: 'Churn Risk (AI)', value: '2.4%', trend: '-0.2%', status: 'good' },
  ];

  return (
    <div className="bg-[#0a0a0c]/80 border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-xl relative overflow-hidden group col-span-1 md:col-span-2 lg:col-span-1">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] group-hover:bg-purple-600/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/30">
            <Shield className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Compliance</h3>
            <p className="text-[10px] text-purple-500/70 font-mono font-bold uppercase tracking-widest">Sovereign Identity Audits</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Disclosure Audits */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Identity Disclosure Audits</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {disclosureMetrics.map((m) => (
              <div key={m.label} className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">{m.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-mono font-black text-white">{m.value}</p>
                  <p className={`text-[8px] font-bold ${m.trend.startsWith('+') ? 'text-emerald-400' : 'text-zinc-500'}`}>{m.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Intelligence */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Growth Intelligence</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {growthSignals.map((s) => (
              <div key={s.label} className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[8px] text-zinc-500 font-bold uppercase mb-1">{s.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-mono font-black text-white">{s.value}</p>
                  <p className="text-[8px] font-bold text-emerald-400">{s.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Incident Feed */}
        <div className="bg-black/40 rounded-2xl border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Live Compliance Stream</span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            {[
              { msg: 'Age Verification Passed', time: '2s ago', user: 'ID_482' },
              { msg: 'Geo-Fence Alert: Resolved', time: '14s ago', user: 'SYS' },
            ].map((log, i) => (
              <div key={i} className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-400 font-medium">{log.msg}</span>
                <span className="text-zinc-600 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceOversightHub;
