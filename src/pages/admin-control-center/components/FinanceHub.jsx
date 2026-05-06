// src/pages/admin-control-center/components/FinanceHub.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ShieldCheck, Activity, CreditCard, RefreshCw, Lock } from 'lucide-react';

const FinanceHub = () => {
  const [revenue, setRevenue] = useState(124892.00);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + (Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0c]/80 border border-emerald-500/20 rounded-3xl p-8 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-[80px] group-hover:bg-emerald-600/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30">
            <DollarSign className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Finance Hub</h3>
            <p className="text-[10px] text-emerald-500/70 font-mono font-bold uppercase tracking-widest">Global Payout Orchestration</p>
          </div>
        </div>
        
        <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-sm text-white font-mono font-black">${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group/card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-emerald-500/50 font-black uppercase tracking-widest">Daily Revenue</p>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform" />
          </div>
          <p className="text-2xl text-white font-mono font-black">$45,892 <span className="text-xs text-emerald-400 font-bold ml-1">+12%</span></p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group/card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-indigo-500/50 font-black uppercase tracking-widest">Payout Volume</p>
            <Activity className="w-3.5 h-3.5 text-indigo-400 group-hover/card:scale-110 transition-transform" />
          </div>
          <p className="text-2xl text-white font-mono font-black">$12,400 <span className="text-xs text-indigo-400 font-bold ml-1">NOMINAL</span></p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group/card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-amber-500/50 font-black uppercase tracking-widest">Global VP Yield</p>
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl text-white font-mono font-black">2.45% <span className="text-xs text-amber-400 font-bold ml-1">STABLE</span></p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group/card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-purple-500/50 font-black uppercase tracking-widest">Staked Reserves</p>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-2xl text-white font-mono font-black">42.8M <span className="text-xs text-purple-400 font-bold ml-1">VP</span></p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
           <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Provider Orchestrator</p>
           <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">
              <RefreshCw className="w-3 h-3 text-zinc-500 animate-spin" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase">Auto-Failover On</span>
           </div>
        </div>
        
        <div className="space-y-2.5">
          {[
            { name: 'NUVEI', type: 'PRIMARY', status: 'ACTIVE', uptime: '99.98%', color: 'emerald' },
            { name: 'CHECKOUT.COM', type: 'BACKUP_A', status: 'STANDBY', uptime: '99.95%', color: 'indigo' },
            { name: 'STRIPE', type: 'BACKUP_B', status: 'STANDBY', uptime: '99.99%', color: 'zinc' },
          ].map((provider) => (
            <div key={provider.name} className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5 hover:bg-black/60 transition-colors group/row">
              <div className="flex items-center gap-4">
                <CreditCard className={`w-5 h-5 text-${provider.color}-500/40 group-hover/row:text-${provider.color}-400 transition-colors`} />
                <div>
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-black">{provider.name}</span>
                      <span className={`text-[8px] bg-${provider.color}-500/10 text-${provider.color}-500 px-1.5 py-0.5 rounded-sm font-black`}>{provider.type}</span>
                   </div>
                </div>
              </div>
              <div className="text-right">
                 <p className={`text-[9px] font-mono font-black text-${provider.color}-500`}>{provider.status}</p>
                 <p className="text-[8px] text-zinc-600 font-bold">{provider.uptime} UPTIME</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 mt-6 group/footer">
           <div className="relative">
              <Lock className="w-6 h-6 text-emerald-400" />
              <div className="absolute inset-0 bg-emerald-400 blur-md opacity-20 group-hover/footer:opacity-40 transition-opacity" />
           </div>
           <div>
              <p className="text-[11px] text-white font-black leading-tight uppercase tracking-wider">Secure Settlement Layer</p>
              <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-widest mt-1">Trolley API // SHA-512_AUTH_ACTIVE</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceHub;

