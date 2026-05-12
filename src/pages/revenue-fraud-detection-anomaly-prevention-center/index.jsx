import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Shield, AlertTriangle, TrendingUp, Users, DollarSign, Activity, ArrowUpRight, Search, Filter, ShieldAlert } from 'lucide-react';

import PayoutManipulationPanel from './components/PayoutManipulationPanel';
import CreatorOverridePanel from './components/CreatorOverridePanel';
import CampaignSplitAbusePanel from './components/CampaignSplitAbusePanel';
import RealtimeAlertEnginePanel from './components/RealtimeAlertEnginePanel';
import MachineLearningPanel from './components/MachineLearningPanel';
import AuditTrailPanel from './components/AuditTrailPanel';

const RevenueFraudDetectionAnomalyPreventionCenter = () => {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [fraudStats, setFraudStats] = useState({
    totalAlerts: 0,
    criticalThreats: 0,
    blockedTransactions: 0,
    detectionAccuracy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFraudStatistics();
  }, []);

  const loadFraudStatistics = async () => {
    try {
      setLoading(true);
      // Simulate fraud detection statistics
      setFraudStats({
        totalAlerts: 47,
        criticalThreats: 8,
        blockedTransactions: 23,
        detectionAccuracy: 94.7
      });
    } catch (error) {
      console.error('Error loading fraud statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const panels = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'payout', label: 'Payout Manipulation', icon: DollarSign },
    { id: 'override', label: 'Creator Override', icon: Users },
    { id: 'campaign', label: 'Campaign Split Abuse', icon: TrendingUp },
    { id: 'alerts', label: 'Alert Engine', icon: AlertTriangle },
    { id: 'ml', label: 'ML Detection', icon: Shield },
    { id: 'audit', label: 'Audit Trail', icon: Search }
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'payout':
        return <PayoutManipulationPanel />;
      case 'override':
        return <CreatorOverridePanel />;
      case 'campaign':
        return <CampaignSplitAbusePanel />;
      case 'alerts':
        return <RealtimeAlertEnginePanel />;
      case 'ml':
        return <MachineLearningPanel />;
      case 'audit':
        return <AuditTrailPanel />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: fraudStats?.totalAlerts, icon: AlertTriangle, trend: '+12%', color: 'warning' },
          { label: 'Critical Threats', value: fraudStats?.criticalThreats, icon: ShieldAlert, trend: '-2%', color: 'destructive' },
          { label: 'Blocked Tx', value: fraudStats?.blockedTransactions, icon: DollarSign, trend: '+5%', color: 'success' },
          { label: 'Detection Accuracy', value: `${fraudStats?.detectionAccuracy}%`, icon: TrendingUp, trend: '+0.4%', color: 'primary' }
        ].map((metric, i) => (
          <div key={i} className="premium-glass bg-card/40 p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${metric.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon size={24} className={`text-${metric.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground font-data">{metric.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <span className={`text-xs font-bold ${metric.trend.startsWith('+') ? 'text-success' : 'text-destructive'} flex items-center gap-1`}>
                {metric.trend}
              </span>
              <span className="text-xs text-muted-foreground">than last week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-glass bg-card/40 rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/30 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Revenue Anomaly Stream</h3>
            <p className="text-sm text-muted-foreground">Real-time detection of suspicious financial activities</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Filter size={14} className="mr-2" />
            Filter Stream
          </Button>
        </div>
        
        <div className="p-0">
          {[
            { title: 'Payout Manipulation Detected', desc: 'Suspicious distribution patterns in creator earnings for Region: EU', status: 'Critical', color: 'destructive', icon: AlertTriangle, time: '2 mins ago' },
            { title: 'Creator Override Exploitation', desc: 'Excessive override usage detected for 3 creators in Batch #44', status: 'High', color: 'warning', icon: Users, time: '14 mins ago' },
            { title: 'Campaign Split Abuse', desc: 'Coordinated manipulation attempts in campaign splits detected in Node: ASIA', status: 'Medium', color: 'primary', icon: TrendingUp, time: '1 hour ago' },
            { title: 'Multiple Failed Auth Attempts', desc: 'Repeated authorization failures on payout gateway #2', status: 'Low', color: 'muted', icon: Shield, time: '3 hours ago' }
          ].map((alert, i) => (
            <div key={i} className="flex items-center justify-between p-6 border-b border-border/10 hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-${alert.color}/10 flex items-center justify-center`}>
                  <alert.icon size={20} className={`text-${alert.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    {alert.title}
                    <span className="text-[10px] text-muted-foreground font-normal tracking-tight">{alert.time}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">{alert.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${alert.color}/10 text-${alert.color} border border-${alert.color}/20`}>
                  {alert.status}
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-muted-foreground transition-colors">
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <GeneralPageLayout title="Fraud Detection Center" showSidebar={true}>
      <Helmet>
        <title>Revenue Fraud Detection & Anomaly Prevention Center | Vottery Admin</title>
        <meta name="description" content="Comprehensive monitoring for revenue-split manipulation, creator override exploitation, and campaign split abuse" />
      </Helmet>

      <div className="w-full py-0">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Fraud Detection & Anomaly Prevention
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Comprehensive monitoring for revenue-split manipulation and creator override exploitation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-bold uppercase text-success">Live Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Navigation */}
        <div className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl w-fit border border-border/50">
            {panels?.map((panel) => {
              const IconComp = panel?.icon;
              const isActive = activePanel === panel?.id;
              return (
                <button
                  key={panel?.id}
                  onClick={() => setActivePanel(panel?.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-card text-foreground shadow-sm border border-border/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <IconComp size={16} />
                  <span className="text-sm font-medium">{panel?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl">
            <Icon name="Loader2" size={40} className="animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Scanning financial protocols...</p>
          </div>
        ) : (
          renderPanel()
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default RevenueFraudDetectionAnomalyPreventionCenter;