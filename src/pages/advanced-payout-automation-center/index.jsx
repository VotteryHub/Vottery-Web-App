import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automatic Payout Configuration</h3>
        
        <div className="space-y-4">
          {/* Auto Payout Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Enable Automatic Payouts</p>
              <p className="text-sm text-gray-600">Process payouts automatically when threshold is reached</p>
            </div>
            <button
              onClick={() => handleUpdateSettings({ autoPayoutEnabled: !payoutSettings?.autoPayoutEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                payoutSettings?.autoPayoutEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  payoutSettings?.autoPayoutEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Minimum Threshold */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Minimum Payout Threshold
            </label>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                value={payoutSettings?.minimumPayoutThreshold || 100}
                onChange={(e) => handleUpdateSettings({ minimumPayoutThreshold: parseFloat(e?.target?.value) })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                step="10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Payouts will only process when your balance reaches this amount
            </p>
          </div>

          {/* Preferred Banking Method */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Preferred Banking Method
            </label>
            <select
              value={payoutSettings?.preferredMethod || 'ACH'}
              onChange={(e) => handleUpdateSettings({ preferredMethod: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ACH">ACH Transfer (US)</option>
              <option value="UPI">UPI (India)</option>
              <option value="SWIFT">SWIFT (International)</option>
              <option value="SEPA">SEPA (Europe)</option>
              <option value="WIRE">Wire Transfer</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settlement Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { id: 'daily', label: 'Daily', description: 'Process every day at midnight UTC', icon: 'Sun' },
            { id: 'weekly', label: 'Weekly', description: 'Process every Monday morning', icon: 'Calendar' },
            { id: 'monthly', label: 'Monthly', description: '1st of each month', icon: 'CalendarDays' }
          ]?.map(opt => (
            <button
              key={opt?.id}
              onClick={() => setSettlementSchedule(opt?.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                settlementSchedule === opt?.id
                  ? 'border-blue-600 bg-blue-50' :'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Icon name={opt?.icon} size={20} className={settlementSchedule === opt?.id ? 'text-blue-600' : 'text-gray-500'} />
              <p className="font-semibold text-gray-900 mt-2">{opt?.label}</p>
              <p className="text-sm text-gray-600 mt-1">{opt?.description}</p>
            </button>
          ))}
        </div>

        {/* Minimum Threshold */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Minimum Payout Threshold: ${minimumThreshold}</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={minimumThreshold}
              onChange={e => setMinimumThreshold(parseInt(e?.target?.value))}
              className="flex-1 accent-blue-600"
            />
            <input
              type="number"
              value={minimumThreshold}
              onChange={e => setMinimumThreshold(Math.max(10, parseInt(e?.target?.value) || 10))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
              min="10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Payouts process only when balance reaches ${minimumThreshold}</p>
        </div>

        {/* Tax Withholding Calculator */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Tax Withholding: {taxWithholdingPct}%</label>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={taxWithholdingPct}
            onChange={e => setTaxWithholdingPct(parseInt(e?.target?.value))}
            className="w-full accent-purple-600 mb-3"
          />
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated Earnings</span>
              <span className="font-semibold">${estimatedEarnings?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax Withheld ({taxWithholdingPct}%)</span>
              <span className="font-semibold text-red-600">-${withheldAmount?.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Net Payout</span>
              <span className="font-bold text-green-600 text-lg">${netPayout?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveScheduleConfig}
          disabled={savingSchedule}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {savingSchedule ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="Save" size={18} />}
          {savingSchedule ? 'Saving...' : 'Save Schedule Configuration'}
        </button>
      </div>
    </div>
  );

  const renderBankingMethods = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Banking Methods by Country</h3>
        
        <div className="space-y-3">
          {bankingMethods?.map((method, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon icon={DollarSign} className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{method?.methodType}</p>
                    <p className="text-sm text-gray-600">{method?.countryName} ({method?.countryCode})</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  method?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {method?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                <div>
                  <p className="text-gray-600">Processing Time</p>
                  <p className="font-medium text-gray-900">{method?.processingTimeDays} days</p>
                </div>
                <div>
                  <p className="text-gray-600">Min Amount</p>
                  <p className="font-medium text-gray-900">${method?.minimumAmount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Max Amount</p>
                  <p className="font-medium text-gray-900">${method?.maximumAmount?.toLocaleString()}</p>
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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Rate Optimization</h3>
        
        {optimization ? (
          <div className="space-y-4">
            {/* Recommendation Card */}
            <div className={`p-6 rounded-lg border-2 ${
              optimization?.recommendation === 'process_now' ?'bg-green-50 border-green-200' 
                : optimization?.recommendation === 'wait' ?'bg-orange-50 border-orange-200' :'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <Icon icon={
                  optimization?.recommendation === 'process_now' ? CheckCircle :
                  optimization?.recommendation === 'wait' ? Clock : AlertCircle
                } className={`w-6 h-6 mt-0.5 ${
                  optimization?.recommendation === 'process_now' ? 'text-green-600' :
                  optimization?.recommendation === 'wait' ? 'text-orange-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">
                    {optimization?.recommendation === 'process_now' ? 'Recommended: Process Now' :
                     optimization?.recommendation === 'wait' ? 'Recommended: Wait for Better Rates' :
                     'Neutral: No Strong Recommendation'}
                  </p>
                  <p className="text-sm text-gray-700">{optimization?.message}</p>
                </div>
              </div>
            </div>

            {/* Rate Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Rate</p>
                <p className="text-xl font-bold text-gray-900">{optimization?.currentRate?.toFixed(4)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">30-Day Average</p>
                <p className="text-xl font-bold text-gray-900">{optimization?.avgRate?.toFixed(4)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">30-Day High</p>
                <p className="text-xl font-bold text-green-600">{optimization?.maxRate?.toFixed(4)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">30-Day Low</p>
                <p className="text-xl font-bold text-red-600">{optimization?.minRate?.toFixed(4)}</p>
              </div>
            </div>

            {/* Potential Savings */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700 mb-2">Potential Savings Analysis</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-purple-600">vs. Average Rate</p>
                  <p className={`text-lg font-bold ${
                    optimization?.vsAverage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {optimization?.vsAverage >= 0 ? '+' : ''}${optimization?.vsAverage?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-purple-600">vs. Best Rate (30d)</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${optimization?.potentialSavings?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon icon={TrendingUp} className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Loading optimization recommendations...</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Advanced Payout Automation | Creator Platform</title>
        <meta name="description" content="Configure automatic payouts with intelligent scheduling and exchange rate optimization" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Icon icon={Settings} className="w-8 h-8 text-blue-600" />
              Advanced Payout Automation
            </h1>
            <p className="mt-2 text-gray-600">
              Configure automatic payout scheduling, banking methods, thresholds, and exchange rate optimization
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab?.id
                          ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon icon={tab?.icon} className="w-5 h-5" />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon icon={Clock} className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <>
                  {activeTab === 'settings' && renderSettings()}
                  {activeTab === 'schedule' && renderScheduling()}
                  {activeTab === 'banking' && renderBankingMethods()}
                  {activeTab === 'optimization' && renderOptimization()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedPayoutAutomationCenter;