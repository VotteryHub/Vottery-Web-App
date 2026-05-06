// src/pages/admin-control-center/components/LogicHub.jsx
import React, { useState } from 'react';
import { Brain, ShieldCheck, Zap, Cpu, Network, RefreshCw } from 'lucide-react';

const LogicHub = () => {
  const [viqThreshold, setViqThreshold] = useState(0.5);
  const [meritWeight, setMeritWeight] = useState(0.8);

  return (
    <div className="bg-[#0a0a0c]/80 border border-indigo-500/20 rounded-3xl p-8 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl relative overflow-hidden group">
      {/* Background Pulse Animation */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/30 relative">
            <Brain className="w-7 h-7 text-indigo-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Logic Hub</h3>
            <p className="text-[10px] text-indigo-500/70 font-mono font-bold uppercase tracking-widest">Neural vIQ Distribution Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
           <Cpu className="w-3.5 h-3.5 text-indigo-400" />
           <span className="text-[10px] text-indigo-300 font-mono font-black">AI_CORE_01</span>
        </div>
      </div>

      <div className="space-y-10 relative z-10">
        {/* vIQ Threshold Control */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
               <div>
                 <p className="text-xs font-black text-white uppercase tracking-wider">Reach Threshold</p>
                 <p className="text-[10px] text-zinc-500 font-bold">MIN_SCORE FOR ALGO_PUSH</p>
               </div>
            </div>
            <div className="bg-slate-900 border border-white/5 px-4 py-1.5 rounded-xl">
               <span className="text-xl font-mono font-black text-indigo-400">{viqThreshold.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="relative pt-2">
             <input 
               type="range" 
               min="0" 
               max="1" 
               step="0.01" 
               value={viqThreshold} 
               onChange={(e) => setViqThreshold(parseFloat(e.target.value))}
               className="w-full h-2 bg-slate-900 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
             />
             <div className="absolute top-0 h-2 bg-indigo-500/20 rounded-full pointer-events-none" style={{ width: `${viqThreshold * 100}%` }} />
          </div>
        </div>

        {/* Merit Weighting */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
               <div>
                 <p className="text-xs font-black text-white uppercase tracking-wider">Merit Weighting</p>
                 <p className="text-[10px] text-zinc-500 font-bold">FAVOR ACCURACY OVER VIRALITY</p>
               </div>
            </div>
            <div className="bg-slate-900 border border-white/5 px-4 py-1.5 rounded-xl">
               <span className="text-xl font-mono font-black text-emerald-400">{meritWeight.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="relative pt-2">
             <input 
               type="range" 
               min="0" 
               max="1" 
               step="0.01" 
               value={meritWeight} 
               onChange={(e) => setMeritWeight(parseFloat(e.target.value))}
               className="w-full h-2 bg-slate-900 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
             />
             <div className="absolute top-0 h-2 bg-emerald-500/20 rounded-full pointer-events-none" style={{ width: `${meritWeight * 100}%` }} />
          </div>
        </div>

        {/* AI Stats Row */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group/card hover:border-indigo-500/30 transition-all">
              <Network className="w-5 h-5 text-indigo-400 group-hover/card:animate-pulse" />
              <div>
                 <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Active Model</p>
                 <p className="text-xs text-white font-mono font-bold">GEMINI_1.5_PRO</p>
              </div>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group/card hover:border-amber-500/30 transition-all">
              <RefreshCw className="w-5 h-5 text-amber-400 group-hover/card:animate-spin" />
              <div>
                 <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Global Sync</p>
                 <p className="text-xs text-amber-400 font-mono font-bold">142 QUEUED</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group/card hover:border-emerald-500/30 transition-all">
              <Zap className="w-5 h-5 text-emerald-400 group-hover/card:animate-bounce" />
              <div>
                 <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Failover</p>
                 <p className="text-xs text-emerald-400 font-mono font-bold">NOMINAL</p>
              </div>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group/card hover:border-purple-500/30 transition-all">
              <Cpu className="w-5 h-5 text-purple-400" />
              <div>
                 <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Sync Health</p>
                 <p className="text-xs text-purple-400 font-mono font-bold">OPTIMIZED</p>
              </div>
           </div>
        </div>

        {/* Legal/Compliance Guard */}
        <div className="flex items-center gap-4 bg-[#10b981]/5 p-5 rounded-2xl border border-[#10b981]/20">
           <ShieldCheck className="w-6 h-6 text-[#10b981]" />
           <div>
              <p className="text-[11px] text-white font-bold leading-tight">Neutrality Guard Active</p>
              <p className="text-[10px] text-[#10b981]/70 font-medium">Constitutional logic preventing algorithmic bias.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LogicHub;

