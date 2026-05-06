// src/pages/admin-control-center/components/SentimentMap.jsx
import React, { useState, useEffect } from 'react';
import { Globe, ShieldAlert, BarChart, Zap, Activity, Target } from 'lucide-react';

const SentimentMap = () => {
  const [scanLinePos, setScanLinePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLinePos(prev => (prev > 100 ? 0 : prev + 0.5));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0c]/80 border border-cyan-500/20 rounded-3xl p-8 shadow-2xl shadow-cyan-500/5 col-span-1 lg:col-span-2 backdrop-blur-xl relative overflow-hidden group">
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/30">
            <Globe className="w-7 h-7 text-cyan-400 animate-[spin_10s_linear_infinite]" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-[-0.02em]">Intelligence Grid</h3>
            <p className="text-[10px] text-cyan-500/70 font-mono font-bold uppercase tracking-widest">Global Sentiment Analysis // V_INTEL_STREAM</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden sm:flex flex-col items-end">
              <p className="text-[9px] text-cyan-500/50 font-black uppercase">Scanning Status</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-white font-mono font-bold">100% COVERAGE</span>
              </div>
           </div>
           <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-mono font-bold text-white">4.2ms LATENCY</span>
           </div>
        </div>
      </div>

      <div className="relative h-80 bg-black/60 rounded-3xl overflow-hidden border border-cyan-500/20 shadow-inner group">
        {/* Holographic Pulse Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <div className="w-full h-full" style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.15) 1px, transparent 0)', 
              backgroundSize: '24px 24px' 
           }} />
        </div>

        {/* Scan Line Effect */}
        <div 
          className="absolute left-0 right-0 h-[2px] bg-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20 pointer-events-none"
          style={{ top: `${scanLinePos}%` }}
        />

        {/* Dynamic Nodes (Hotspots) */}
        <div className="absolute top-[20%] left-[15%] group/node">
           <div className="w-4 h-4 bg-red-500/30 rounded-full animate-ping" />
           <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
           <div className="absolute top-6 left-0 bg-black/80 border border-red-500/50 px-2 py-1 rounded text-[8px] font-mono text-red-400 whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity">
              LAGOS_DISPUTE_ID: 924
           </div>
        </div>

        <div className="absolute bottom-[30%] right-[25%]">
           <div className="w-3 h-3 bg-cyan-400/30 rounded-full animate-ping" />
           <div className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </div>

        <div className="absolute top-[50%] right-[40%]">
           <div className="w-2 h-2 bg-green-400/30 rounded-full animate-ping" />
           <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
        </div>

        {/* Center UI Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <div className="relative">
              <Activity className="w-24 h-24 text-cyan-500/10 animate-pulse" />
              <Target className="absolute inset-0 w-24 h-24 text-cyan-400/5 rotate-45 scale-110" />
           </div>
           <div className="mt-4 flex flex-col items-center">
              <p className="text-[10px] text-cyan-400 font-mono tracking-[0.4em] uppercase mb-1">Deep Scan Active</p>
              <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full bg-cyan-500 animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }} />
                 ))}
              </div>
           </div>
        </div>

        {/* Data Stream Sidebar */}
        <div className="absolute top-4 right-4 w-32 space-y-2 pointer-events-none">
           {[1, 2, 3].map(i => (
              <div key={i} className="h-1 bg-cyan-500/10 rounded-full overflow-hidden">
                 <div className="h-full bg-cyan-400/40 animate-[shimmer_2s_infinite]" style={{ width: `${Math.random() * 100}%` }} />
              </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all cursor-default">
          <div className="flex items-center gap-3 mb-2">
            <BarChart className="w-4 h-4 text-cyan-400" />
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">Global Mood</p>
          </div>
          <p className="text-xl text-white font-mono font-black">POSITIVE <span className="text-cyan-400">(78.4%)</span></p>
        </div>

        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all cursor-default">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Active Disputes</p>
          </div>
          <p className="text-xl text-white font-mono font-black">08 <span className="text-red-500/50 text-sm">CRITICAL_0</span></p>
        </div>

        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-default">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Election Flux</p>
          </div>
          <p className="text-xl text-white font-mono font-black">42 <span className="text-indigo-400/50 text-sm">LIVE_BALLOTS</span></p>
        </div>
      </div>
    </div>
  );
};

export default SentimentMap;

