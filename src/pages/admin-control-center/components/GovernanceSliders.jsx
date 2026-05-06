// src/pages/admin-control-center/components/GovernanceSliders.jsx
import React, { useState } from 'react';
import { Settings2, Map, Users, Percent, ShieldCheck, Globe2, TrendingUp } from 'lucide-react';

const GovernanceSliders = () => {
  const [steering, setSteering] = useState({
    global: 0.5,
    westAfrica: 0.8,
    europe: 0.3,
    northAmerica: 0.4
  });

  const regions = [
    { key: 'global', name: 'Global Baseline', icon: Globe2 },
    { key: 'westAfrica', name: 'West Africa (Priority)', icon: TrendingUp },
    { key: 'europe', name: 'Europe', icon: Map },
    { key: 'northAmerica', name: 'North America', icon: Users }
  ];

  return (
    <div className="bg-[#0a0a0c]/80 border border-amber-500/20 rounded-3xl p-8 shadow-2xl shadow-amber-500/5 backdrop-blur-xl relative overflow-hidden group">
      {/* Decorative Amber Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-600/10 rounded-full blur-[80px] group-hover:bg-amber-600/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30">
            <Settings2 className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Governance</h3>
            <p className="text-[10px] text-amber-500/70 font-mono font-bold uppercase tracking-widest">Global Steering & Percentization</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
           <Percent className="w-3.5 h-3.5 text-amber-400" />
           <span className="text-[10px] text-amber-300 font-mono font-black">ACTIVE_POLICIES</span>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        {regions.map((region) => (
          <div key={region.key} className="space-y-4 group/slider">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <region.icon className="w-4 h-4 text-amber-500/50 group-hover/slider:text-amber-400 transition-colors" />
                 <span className="text-xs font-black text-white uppercase tracking-wider">{region.name}</span>
              </div>
              <div className="bg-slate-900 px-3 py-1 rounded-lg border border-white/5">
                 <span className="text-sm font-mono font-black text-amber-400">{(steering[region.key] * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="relative pt-1">
               <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.01" 
                 value={steering[region.key]} 
                 onChange={(e) => setSteering({...steering, [region.key]: parseFloat(e.target.value)})}
                 className="w-full h-1.5 bg-slate-900 rounded-full appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
               />
               <div className="absolute top-1 h-1.5 bg-amber-500/20 rounded-full pointer-events-none" style={{ width: `${steering[region.key] * 100}%` }} />
               
               {/* Visual Indicator of Drift */}
               <div className="flex justify-between mt-2">
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <div className="h-1 w-1 rounded-full bg-white/10" />
               </div>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all cursor-default group/card">
            <div className="flex items-center gap-3 mb-2">
              <Percent className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Global Tax</p>
            </div>
            <p className="text-2xl text-white font-mono font-black">2.50% <span className="text-[9px] text-zinc-500 ml-1 font-bold">REVENUE_SHARE</span></p>
          </div>
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-default group/card">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">UBI Logic</p>
            </div>
            <p className="text-2xl text-white font-mono font-black">ACTIVE <span className="text-[9px] text-indigo-400/50 ml-1 font-bold">STEERED</span></p>
          </div>
        </div>

        {/* Master Policy Lock */}
        <div className="flex items-center gap-4 bg-amber-500/5 p-5 rounded-2xl border border-amber-500/20 mt-4 group/footer">
           <div className="relative">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <div className="absolute inset-0 bg-amber-400 blur-md opacity-20 group-hover/footer:opacity-40 transition-opacity" />
           </div>
           <div>
              <p className="text-[11px] text-white font-black leading-tight uppercase tracking-wider">Policy Integrity Guard</p>
              <p className="text-[10px] text-amber-400/60 font-bold uppercase tracking-widest mt-1">Sovereign Ruleset v4.2 Enforced</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceSliders;

