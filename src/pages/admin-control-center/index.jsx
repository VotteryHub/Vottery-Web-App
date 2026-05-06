import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import * as Web from '../../constants/navigationHubRoutes';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';


import PlatformMetricsCard from './components/PlatformMetricsCard';
import ElectionApprovalCard from './components/ElectionApprovalCard';
import UserManagementTable from './components/UserManagementTable';
import BlockchainMonitor from './components/BlockchainMonitor';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SystemActivityLog from './components/SystemActivityLog';
import ParticipationFeeControls from './components/ParticipationFeeControls';
import PlatformControlsPanel from './components/PlatformControlsPanel';
import EventTelemetryChart from './components/EventTelemetryChart';

import { electionsService } from '../../services/electionsService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { unifiedBusinessIntelligenceService } from '../../services/unifiedBusinessIntelligenceService';
import { analyticsService } from '../../services/analyticsService';
import { adminLogService } from '../../services/adminLogService';
import { eventBus, EVENTS } from '../../lib/eventBus';


import LogicHub from './components/LogicHub';
import FinanceHub from './components/FinanceHub';
import TerminalHub from './components/TerminalHub';
import GovernanceSliders from './components/GovernanceSliders';
import ComplianceOversightHub from './components/ComplianceOversightHub';
import StressTestSimulationHub from './components/StressTestSimulationHub';
import SentimentMap from './components/SentimentMap';
import VotingFunnelDiagnostic from './components/VotingFunnelDiagnostic';

const AdminControlCenter = () => {
  const navigate = useNavigate();
  const [masterSwitch, setMasterSwitch] = useState(true);

  const [telemetry, setTelemetry] = useState({
    activeUsers: 12450,
    tps: 1180,
    sentiment: 78,
    payoutHealth: 99.9,
    eventCount: 0
  });

  // Real-time telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        tps: 1100 + Math.floor(Math.random() * 200),
        eventCount: prev.eventCount + 1
      }));
    }, 3000);

    // Subscribe to Event Bus for system-wide notifications
    const unsubscribe = eventBus.on('system:alert', (payload) => {
      console.log('[CommandCenter] Alert Received:', payload);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <GeneralPageLayout 
      title="Sovereign Command"
      showSidebar={true}
      maxWidth="max-w-[1700px]"
    >
      <div className="w-full py-0">
        
        {/* Master Control Bar */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 mb-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
              <div className="bg-slate-900 border border-indigo-500/30 p-4 rounded-2xl relative shadow-2xl">
                <Icon name="Shield" size={32} className="text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1.5 font-mono">Kernel_Runlevel_5 // Encrypted</h2>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Sovereign Control</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-10">
            {/* Live Telemetry Bar */}
            <div className="flex items-center gap-10 border-r border-white/10 pr-10">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Global Reach</p>
                <p className="text-xl font-black text-white tracking-tight">{telemetry.activeUsers.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Throughput</p>
                <p className="text-xl font-black text-indigo-400 tracking-tight font-mono">{telemetry.tps} TPS</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse block mb-1">Emergency Kill Switch</span>
                <p className="text-[9px] text-slate-500 font-medium italic">Authorized Admin Only</p>
              </div>
              <button
                onClick={() => setMasterSwitch(!masterSwitch)}
                className={`w-16 h-8 rounded-full transition-all duration-700 p-1.5 ${masterSwitch ? 'bg-slate-800 border border-white/10' : 'bg-red-600 shadow-[0_0_40px_rgba(220,38,38,0.5)] border border-red-400'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-2xl transform transition-transform duration-500 ${masterSwitch ? 'translate-x-8' : 'translate-x-0'
                  }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Main 5-Quadrant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Q1: Logic Hub */}
          <LogicHub />

          {/* Q2: Finance Hub */}
          <FinanceHub />

          {/* Q3: Terminal Hub */}
          <TerminalHub />

          {/* Q4: Governance Sliders */}
          <GovernanceSliders />

          {/* Q5: Compliance Oversight */}
          <ComplianceOversightHub />

          {/* Q6: Stress Test Simulation */}
          <StressTestSimulationHub />

          {/* Q7: Sentiment Map (Spans 2 columns) */}
          <SentimentMap />

          {/* Q8: Voting Funnel Diagnostic */}
          <div className="lg:col-span-3">
            <VotingFunnelDiagnostic />
          </div>
        </div>

        {/* Infrastructure Toolbar */}
        <div className="mt-16 border-t border-white/5 pt-12">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 text-center">Infrastructure Management Modules</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Users', icon: 'Users', route: Web.USER_ANALYTICS_DASHBOARD_ROUTE },
              { name: 'Elections', icon: 'Vote', route: Web.ADMIN_ELECTION_MODERATION_HUB_ROUTE },
              { name: 'AI Models', icon: 'Cpu', route: Web.ADMIN_AI_CONTENT_MODERATION_ROUTE },
              { name: 'Finance', icon: 'DollarSign', route: Web.ADMIN_REVENUE_INTELLIGENCE_ROUTE },
              { name: 'Ads/Media', icon: 'Megaphone', route: Web.VOTTERY_ADS_STUDIO_ROUTE },
              { name: 'Compliance', icon: 'ShieldCheck', route: Web.COMPLIANCE_DASHBOARD_ROUTE },
              { name: 'Security', icon: 'Lock', route: Web.ADMIN_FRAUD_DETECTION_CENTER_ROUTE }
            ].map((tool) => (
              <button 
                key={tool.name} 
                onClick={() => navigate(tool.route)}
                className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[24px] hover:border-indigo-500/50 hover:bg-white/5 transition-all group flex flex-col items-center gap-4 shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                  <Icon name={tool.icon} size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-[10px] text-slate-400 group-hover:text-white transition-colors uppercase font-black tracking-widest">{tool.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};


export default AdminControlCenter;