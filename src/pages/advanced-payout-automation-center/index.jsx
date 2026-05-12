import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';

import { multiCurrencyPayoutService } from '../../services/multiCurrencyPayoutService';
import { Calendar, DollarSign, Settings, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdvancedPayoutAutomationCenter = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(true);
  const [payoutSettings, setPayoutSettings] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [bankingMethods, setBankingMethods] = useState([]);
  // New state for settlement schedule, threshold, tax withholding
  const [settlementSchedule, setSettlementSchedule] = useState('weekly');
  const [minimumThreshold, setMinimumThreshold] = useState(100);
  const [taxWithholdingPct, setTaxWithholdingPct] = useState(0);
  const [savingSchedule, setSavingSchedule] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsResult, methodsResult] = await Promise.all([
        multiCurrencyPayoutService?.getPayoutSettings(),
        multiCurrencyPayoutService?.getBankingMethods()
      ]);

      if (settingsResult?.data) {
        setPayoutSettings(settingsResult?.data);
        // Load optimization recommendations
        loadOptimizationRecommendations();
      } else {
        // Initialize default settings
        setPayoutSettings({
          autoPayoutEnabled: false,
          minimumPayoutThreshold: 100,
          preferredMethod: 'ACH',
          payoutSchedule: 'manual',
          bankDetails: {}
        });
      }

      if (methodsResult?.data) setBankingMethods(methodsResult?.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast?.error('Failed to load payout settings');
    } finally {
      setLoading(false);
    }
  };

  const loadOptimizationRecommendations = async () => {
    try {
      const result = await multiCurrencyPayoutService?.getExchangeRateOptimizationRecommendations(
        'USD',
        'USD',
        1000
      );
      if (result?.data) setOptimization(result?.data);
    } catch (error) {
      console.error('Error loading optimization:', error);
    }
  };

  const handleUpdateSettings = async (updates) => {
    try {
      const updatedSettings = { ...payoutSettings, ...updates };
      const result = await multiCurrencyPayoutService?.updatePayoutSettings(updatedSettings);
      
      if (result?.data) {
        setPayoutSettings(result?.data);
        toast?.success('Payout settings updated successfully');
      } else {
        toast?.error(result?.error?.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast?.error('Failed to update settings');
    }
  };

  const handleSaveScheduleConfig = async () => {
    setSavingSchedule(true);
    try {
      await handleUpdateSettings({
        payoutSchedule: settlementSchedule,
        minimumPayoutThreshold: minimumThreshold,
        taxWithholdingPercentage: taxWithholdingPct
      });
      toast?.success('Schedule configuration saved!');
    } finally {
      setSavingSchedule(false);
    }
  };

  const estimatedEarnings = 850;
  const withheldAmount = (estimatedEarnings * taxWithholdingPct) / 100;
  const netPayout = estimatedEarnings - withheldAmount;

  const tabs = [
    { id: 'settings', label: 'Payout Settings', icon: Settings },
    { id: 'schedule', label: 'Scheduling', icon: Calendar },
    { id: 'banking', label: 'Banking Methods', icon: DollarSign },
    { id: 'optimization', label: 'Rate Optimization', icon: TrendingUp }
  ];

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Automatic Payout Configuration</h3>
        
        <div className="space-y-6">
          {/* Auto Payout Toggle */}
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <p className="font-black text-white uppercase tracking-tight text-sm">Enable Automatic Payouts</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Process payouts automatically when threshold is reached</p>
            </div>
            <button
              onClick={() => handleUpdateSettings({ autoPayoutEnabled: !payoutSettings?.autoPayoutEnabled })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 shadow-lg ${
                payoutSettings?.autoPayoutEnabled ? 'bg-primary' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-500 shadow-xl ${
                  payoutSettings?.autoPayoutEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Minimum Threshold */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
              Minimum Payout Threshold
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black">$</div>
                <input
                  type="number"
                  value={payoutSettings?.minimumPayoutThreshold || 100}
                  onChange={(e) => handleUpdateSettings({ minimumPayoutThreshold: parseFloat(e?.target?.value) })}
                  className="w-full pl-10 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black font-mono transition-all"
                  min="10"
                  step="10"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-bold">
              Payouts will only process when your balance reaches this amount
            </p>
          </div>

          {/* Preferred Banking Method */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
              Preferred Banking Method
            </label>
            <select
              value={payoutSettings?.preferredMethod || 'ACH'}
              onChange={(e) => handleUpdateSettings({ preferredMethod: e?.target?.value })}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white font-black uppercase tracking-widest text-xs transition-all appearance-none cursor-pointer"
            >
              <option value="ACH" className="bg-slate-900">ACH Transfer (US)</option>
              <option value="UPI" className="bg-slate-900">UPI (India)</option>
              <option value="SWIFT" className="bg-slate-900">SWIFT (International)</option>
              <option value="SEPA" className="bg-slate-900">SEPA (Europe)</option>
              <option value="WIRE" className="bg-slate-900">Wire Transfer</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight">Settlement Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { id: 'daily', label: 'Daily', description: 'Process every day at midnight UTC', icon: 'Sun' },
            { id: 'weekly', label: 'Weekly', description: 'Process every Monday morning', icon: 'Calendar' },
            { id: 'monthly', label: 'Monthly', description: '1st of each month', icon: 'CalendarDays' }
          ]?.map(opt => (
            <button
              key={opt?.id}
              onClick={() => setSettlementSchedule(opt?.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                settlementSchedule === opt?.id
                  ? 'border-primary bg-primary/10 shadow-xl shadow-primary/20 scale-[1.02]' 
                  : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              <Icon name={opt?.icon} size={24} className={settlementSchedule === opt?.id ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} />
              <p className="font-black text-white mt-4 uppercase tracking-tight">{opt?.label}</p>
              <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold leading-relaxed">{opt?.description}</p>
            </button>
          ))}
        </div>

        {/* Minimum Threshold */}
        <div className="mb-10 p-8 bg-white/5 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Minimum Payout Threshold</label>
            <span className="text-2xl font-black text-primary font-mono">${minimumThreshold}</span>
          </div>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={minimumThreshold}
              onChange={e => setMinimumThreshold(parseInt(e?.target?.value))}
              className="flex-1 accent-primary h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-widest font-black">Payouts process only when balance reaches ${minimumThreshold}</p>
        </div>

        {/* Tax Withholding Calculator */}
        <div className="mb-10 p-8 bg-white/5 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tax Withholding</label>
            <span className="text-2xl font-black text-purple-400 font-mono">{taxWithholdingPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={taxWithholdingPct}
            onChange={e => setTaxWithholdingPct(parseInt(e?.target?.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer mb-8"
          />
          <div className="bg-black/20 rounded-2xl p-6 space-y-4 border border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Estimated Earnings</span>
              <span className="font-black text-white font-mono">${estimatedEarnings?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tax Withheld ({taxWithholdingPct}%)</span>
              <span className="font-black text-red-500 font-mono">-${withheldAmount?.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/5 my-2" />
            <div className="flex justify-between items-center">
              <span className="font-black text-white uppercase tracking-widest text-[10px]">Net Payout</span>
              <span className="font-black text-green-400 text-2xl font-mono tracking-tight">${netPayout?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveScheduleConfig}
          disabled={savingSchedule}
          className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {savingSchedule ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="Save" size={18} />}
          {savingSchedule ? 'Processing...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );

  const renderBankingMethods = () => (
    <div className="space-y-6">
      <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight">Available Banking Methods</h3>
        
        <div className="space-y-4">
          {bankingMethods?.map((method, index) => (
            <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <Icon name="DollarSign" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-white uppercase tracking-tight">{method?.methodType}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{method?.countryName} ({method?.countryCode})</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                  method?.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                }`}>
                  {method?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-6 p-4 bg-black/20 rounded-xl border border-white/5">
                <div>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Processing</p>
                  <p className="font-black text-white font-mono text-sm">{method?.processingTimeDays} days</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Min Amount</p>
                  <p className="font-black text-white font-mono text-sm">${method?.minimumAmount}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Max Amount</p>
                  <p className="font-black text-white font-mono text-sm">${method?.maximumAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight">Exchange Rate Optimization</h3>
        
        {optimization ? (
          <div className="space-y-6">
            {/* Recommendation Card */}
            <div className={`p-8 rounded-3xl border-2 transition-all duration-500 shadow-2xl ${
              optimization?.recommendation === 'process_now' ? 'bg-green-500/10 border-green-500/20' 
                : optimization?.recommendation === 'wait' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-primary/10 border-primary/20'
            }`}>
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  optimization?.recommendation === 'process_now' ? 'bg-green-500/20 text-green-400' :
                  optimization?.recommendation === 'wait' ? 'bg-orange-500/20 text-orange-400' : 'bg-primary/20 text-primary'
                }`}>
                  <Icon name={
                    optimization?.recommendation === 'process_now' ? 'CheckCircle' :
                    optimization?.recommendation === 'wait' ? 'Clock' : 'AlertCircle'
                  } size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-white uppercase tracking-tight text-lg mb-2">
                    {optimization?.recommendation === 'process_now' ? 'Recommended: Process Now' :
                     optimization?.recommendation === 'wait' ? 'Recommended: Wait' :
                     'Neutral Recommendation'}
                  </p>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed uppercase tracking-tight">{optimization?.message}</p>
                </div>
              </div>
            </div>

            {/* Rate Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Current Rate', value: optimization?.currentRate?.toFixed(4), color: 'text-white' },
                { label: '30-Day Avg', value: optimization?.avgRate?.toFixed(4), color: 'text-slate-400' },
                { label: '30-Day High', value: optimization?.maxRate?.toFixed(4), color: 'text-green-400' },
                { label: '30-Day Low', value: optimization?.minRate?.toFixed(4), color: 'text-red-400' }
              ].map(stat => (
                <div key={stat.label} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-xl font-black font-mono tracking-tighter ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Potential Savings */}
            <div className="p-8 bg-purple-500/10 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
              <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] mb-6">Potential Savings Analysis</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2">vs. Average Rate</p>
                  <p className={`text-2xl font-black font-mono tracking-tight ${
                    optimization?.vsAverage >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {optimization?.vsAverage >= 0 ? '+' : ''}${optimization?.vsAverage?.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2">vs. Best Rate (30d)</p>
                  <p className="text-2xl font-black text-white font-mono tracking-tight">
                    ${optimization?.potentialSavings?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <Icon name="TrendingUp" size={48} className="mx-auto mb-6 text-slate-700 animate-pulse" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Optimization Intelligence...</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <GeneralPageLayout title="Payout Automation" showSidebar={true}>
      <Helmet>
        <title>Advanced Payout Automation | Vottery</title>
        <meta name="description" content="Configure automatic payouts with intelligent scheduling and exchange rate optimization" />
      </Helmet>

      <div className="w-full py-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-xl">
              <Icon name="Settings" size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Payout Automation</h1>
              <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-tight">Intelligent scheduling & settlement engine</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/5 mb-10 overflow-hidden">
          <div className="border-b border-white/5 px-4 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-2 py-3" aria-label="Tabs">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`
                    flex items-center gap-3 py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                    ${
                      activeTab === tab?.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon name={tab?.id === 'settings' ? 'Settings' : tab?.id === 'schedule' ? 'Calendar' : tab?.id === 'banking' ? 'DollarSign' : 'TrendingUp'} size={16} />
                  {tab?.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Synchronizing Financial Logic...</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {activeTab === 'settings' && renderSettings()}
                {activeTab === 'schedule' && renderScheduling()}
                {activeTab === 'banking' && renderBankingMethods()}
                {activeTab === 'optimization' && renderOptimization()}
              </div>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default AdvancedPayoutAutomationCenter;