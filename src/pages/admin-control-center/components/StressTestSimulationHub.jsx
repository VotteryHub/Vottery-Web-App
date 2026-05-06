import React, { useState, useEffect } from 'react';
import { Activity, Zap, Play, Square, AlertOctagon, BarChart3, Radio } from 'lucide-react';
import { eventBus } from '../../../lib/eventBus';

const StressTestSimulationHub = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [loadLevel, setLoadLevel] = useState(0); // 0 to 100
  const [metrics, setMetrics] = useState({
    simulatedUsers: 0,
    votesPerSec: 0,
    latency: 24,
    errors: 0
  });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        // Update metrics based on load level
        setMetrics(prev => ({
          simulatedUsers: Math.floor(loadLevel * 250),
          votesPerSec: Math.floor(loadLevel * 12.5),
          latency: 20 + Math.floor(loadLevel * 1.5) + (Math.random() * 5),
          errors: loadLevel > 80 ? prev.errors + Math.floor(Math.random() * 2) : prev.errors
        }));

        // Emit events to TerminalHub via eventBus
        eventBus.emit('system:stress_test', {
          load: loadLevel,
          users: Math.floor(loadLevel * 250),
          status: loadLevel > 90 ? 'CRITICAL' : 'HEAVY_LOAD'
        });
      }, 1000);
    } else {
      setMetrics({ simulatedUsers: 0, votesPerSec: 0, latency: 24, errors: 0 });
    }
    return () => clearInterval(interval);
  }, [isRunning, loadLevel]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) setLoadLevel(20);
  };

  return (
    <div className="bg-[#0a0a0c]/80 border border-red-500/20 rounded-3xl p-8 shadow-2xl shadow-red-500/5 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-[80px] group-hover:bg-red-600/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/30">
            <Activity className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Stress Test</h3>
            <p className="text-[10px] text-red-500/70 font-mono font-bold uppercase tracking-widest">Network Saturation Simulator</p>
          </div>
        </div>
        
        <button 
          onClick={toggleSimulation}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
            isRunning 
            ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]' 
            : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5'
          }`}
        >
          {isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {isRunning ? 'Stop Simulation' : 'Start Stress Test'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Simulated Users</p>
          <p className="text-2xl text-white font-mono font-black">{metrics.simulatedUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Injected Latency</p>
          <p className="text-2xl text-red-400 font-mono font-black">{metrics.latency.toFixed(0)}ms</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Load Intensity</span>
            <span className="text-xs font-mono font-black text-red-400">{loadLevel}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={loadLevel}
            onChange={(e) => setLoadLevel(parseInt(e.target.value))}
            disabled={!isRunning}
            className="w-full h-1.5 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-red-500"
          />
        </div>

        <div className="bg-black/40 rounded-2xl border border-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className={`w-4 h-4 ${isRunning ? 'text-yellow-400 animate-pulse' : 'text-zinc-600'}`} />
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Election Throughput</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">{metrics.votesPerSec} V/s</span>
          </div>
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <AlertOctagon className={`w-4 h-4 ${metrics.errors > 0 ? 'text-red-500 animate-bounce' : 'text-zinc-600'}`} />
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Simulated Errors</span>
             </div>
             <span className="text-xs font-mono font-bold text-red-500">{metrics.errors}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
           <Radio className={`w-5 h-5 ${isRunning ? 'text-red-400 animate-ping' : 'text-zinc-600'}`} />
           <p className="text-[10px] text-zinc-400 leading-tight">
             <span className="font-black text-white">WAR_ROOM_MODE:</span> Testing kernel resilience against mass concurrent ballot injection.
           </p>
        </div>
      </div>
    </div>
  );
};

export default StressTestSimulationHub;
