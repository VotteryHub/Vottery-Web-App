import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/AppIcon';

const AdminHealthCheck = () => {
  const [status, setStatus] = useState({
    loading: true,
    supabase: 'pending',
    auth: 'pending',
    edgeFunctions: 'pending',
    missingKeys: [],
    optionalModules: {}
  });

  useEffect(() => {
    const checkHealth = async () => {
      const newStatus = { ...status, loading: false };
      
      // Check core keys
      const coreKeys = [];
      if (!import.meta.env.VITE_SUPABASE_URL) coreKeys.push('VITE_SUPABASE_URL');
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY) coreKeys.push('VITE_SUPABASE_ANON_KEY');
      newStatus.missingKeys = coreKeys;

      // Check Optional Modules (Degraded Mode)
      const optional = {
        ai: !!(import.meta.env.VITE_ANTHROPIC_API_KEY || import.meta.env.VITE_OPENAI_API_KEY),
        sentry: !!import.meta.env.VITE_SENTRY_DSN,
        ads: !!import.meta.env.VITE_ADSENSE_CLIENT,
        payments: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      };
      newStatus.optionalModules = optional;

      // Check Supabase Connectivity
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error && error.code !== '42P01') throw error;
        newStatus.supabase = 'healthy';
      } catch (e) {
        newStatus.supabase = 'error';
      }

      // Check Edge Functions (Simulation Mode)
      try {
        const { error } = await supabase.functions.invoke('verify-identity', {
          body: { simulation: true }
        });
        if (error && !error.message.includes('Function not found')) throw error;
        newStatus.edgeFunctions = error ? 'degraded (not found)' : 'healthy';
      } catch (e) {
        newStatus.edgeFunctions = 'error';
      }

      setStatus(newStatus);
    };

    checkHealth();
  }, []);

  return (
    <GeneralPageLayout title="Kernel Health Check" showSidebar={true}>
      <div className="max-w-4xl mx-auto py-0">
        <div className="mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
              <Icon name="Activity" size={24} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Kernel Status</h1>
              <p className="text-slate-500 font-medium text-sm">Real-time infrastructure & module verification</p>
            </div>
          </div>
        </div>

        {status.loading ? (
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-slate-900/40 rounded-3xl border border-white/5" />
              <div className="h-32 bg-slate-900/40 rounded-3xl border border-white/5" />
            </div>
            <div className="h-64 bg-slate-900/40 rounded-3xl border border-white/5" />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Core Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-8 rounded-[32px] border backdrop-blur-xl transition-all duration-500 ${status.supabase === 'healthy' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-500">Database Core</h3>
                  <div className={`w-2.5 h-2.5 rounded-full ${status.supabase === 'healthy' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-red-500 animate-pulse'}`} />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{status.supabase.toUpperCase()}</p>
                <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase">Supabase_Connection_Established</p>
              </div>

              <div className={`p-8 rounded-[32px] border backdrop-blur-xl transition-all duration-500 ${status.edgeFunctions === 'healthy' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]' : 'bg-amber-500/5 border-amber-500/20'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-500">Edge Runtime</h3>
                  <div className={`w-2.5 h-2.5 rounded-full ${status.edgeFunctions === 'healthy' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
                </div>
                <p className="text-2xl font-black text-white tracking-tight">{status.edgeFunctions.toUpperCase()}</p>
                <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase">Vercel_Edge_Handshake</p>
              </div>
            </div>

            {/* Optional Modules */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Icon name="Box" size={18} className="text-slate-400" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Module Inventory</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
                {Object.entries(status.optionalModules).map(([name, active]) => (
                  <div key={name} className="group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 group-hover:text-white transition-colors">{name}</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${active ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-white/10'}`} />
                      <span className={`text-[10px] font-black tracking-widest ${active ? 'text-white' : 'text-slate-700'}`}>{active ? 'ACTIVE' : 'DEGRADED'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment Validation */}
            <div className="p-10 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Icon name="Key" size={120} />
              </div>
              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <Icon name="ShieldCheck" size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Environment Secrets</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">VITE_ENV Security Audit</p>
                </div>
              </div>
              
              {status.missingKeys.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <Icon name="AlertCircle" size={14} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Critical Keys Missing</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {status.missingKeys.map(k => (
                      <span key={k} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-mono text-red-400 font-bold">{k}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 py-4 px-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl w-fit">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">All kernel secrets synchronized</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default AdminHealthCheck;
