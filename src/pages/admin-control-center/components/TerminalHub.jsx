// src/pages/admin-control-center/components/TerminalHub.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, Cpu, ShieldCheck, Database } from 'lucide-react';
import { eventBus } from '../../../lib/eventBus';

const TerminalHub = () => {
  const [logs, setLogs] = useState([
    { id: 'boot-1', type: 'SYS', msg: 'INITIALIZING V_KERNEL_LOADER...', timestamp: '00:00:00' },
    { id: 'boot-2', type: 'SYS', msg: 'MOUNTING BLOCKCHAIN_ADAPTER: SUCCESS', timestamp: '00:00:01' },
    { id: 'boot-3', type: 'SYS', msg: 'ESTABLISHING SECURE_GATEWAY: 0.0.0.0:2028', timestamp: '00:00:02' },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Listen for real system events from the Event Bus
    const unsubscribe = eventBus.on('*', (eventName, payload) => {
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'EVENT',
        msg: `${eventName.toUpperCase()} >> ${JSON.stringify(payload).substring(0, 50)}...`,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      };
      setLogs(prev => [...prev.slice(-40), newLog]);
    });

    // Mock incoming system telemetry
    const interval = setInterval(() => {
      const mockEvents = [
        { type: 'SUCCESS', msg: 'VOTE_VALIDATED: 0x82f...91a' },
        { type: 'INFO', msg: 'RE-CALCULATING vIQ_SCORE: USER_882' },
        { type: 'WARN', msg: 'REGION_LATENCY_SPIKE: LAGOS_NODE_4' },
        { type: 'NET', msg: 'SUPABASE_REALTIME_SYNC: OK' },
        { type: 'SEC', msg: 'BLOCKING_ANOMALOUS_IP: 192.168.1.1' },
      ];
      const event = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      const newLog = {
        id: Date.now(),
        ...event,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      };
      setLogs(prev => [...prev.slice(-40), newLog]);
    }, 4000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'ERROR': return 'text-red-500';
      case 'WARN': return 'text-amber-500';
      case 'SUCCESS': return 'text-emerald-500';
      case 'EVENT': return 'text-indigo-400';
      case 'SEC': return 'text-rose-400';
      case 'NET': return 'text-cyan-400';
      case 'SYS': return 'text-white/50';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="bg-[#050507] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group h-full flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
            <Terminal className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">K4 Terminal</h3>
            <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest">Live Kernel Event Stream</p>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
           <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-600 font-black uppercase">Buffer Status</span>
              <div className="w-16 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[65%]" />
              </div>
           </div>
           <Activity className="w-5 h-5 text-emerald-500/40 animate-pulse" />
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 relative bg-black/40 rounded-2xl border border-white/5 overflow-hidden group/view">
        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
        
        <div 
          ref={scrollRef}
          className="absolute inset-0 p-5 overflow-y-auto font-mono text-[11px] space-y-1.5 scroll-smooth"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 items-start animate-[fadeIn_0.2s_ease-out]">
              <span className="text-zinc-700 whitespace-nowrap">[{log.timestamp}]</span>
              <span className={`font-black uppercase min-w-[60px] ${getTypeColor(log.type)}`}>
                {log.type}
              </span>
              <span className="text-zinc-400 leading-relaxed break-all">
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-zinc-600" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase">DB: ACTIVE</span>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase">SSL: ENCRYPTED</span>
           </div>
        </div>
        
        <button className="text-[10px] text-indigo-400 font-black uppercase tracking-widest hover:text-white transition-colors">
          Download_Dump.BIN
        </button>
      </div>
    </div>
  );
};

export default TerminalHub;

