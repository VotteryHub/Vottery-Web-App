import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PayoutScheduleConfig = ({ userId }) => {
  const [schedule, setSchedule] = useState('weekly');
  const [threshold, setThreshold] = useState(100);
  const [taxWithholding, setTaxWithholding] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const estimatedEarnings = 850;
  const withheldAmount = (estimatedEarnings * taxWithholding) / 100;
  const netPayout = estimatedEarnings - withheldAmount;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Schedule Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Calendar" size={20} className="text-blue-500" />
          Settlement Schedule
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'daily', label: 'Daily', description: 'Every day at midnight UTC', icon: 'Sun' },
            { id: 'weekly', label: 'Weekly', description: 'Every Monday morning', icon: 'Calendar' },
            { id: 'monthly', label: 'Monthly', description: '1st of each month', icon: 'CalendarDays' }
          ]?.map(opt => (
            <button
              key={opt?.id}
              onClick={() => setSchedule(opt?.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                schedule === opt?.id
                  ? 'border-primary bg-primary/5' :'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <Icon name={opt?.icon} size={20} className={schedule === opt?.id ? 'text-primary' : 'text-muted-foreground'} />
              <p className="font-semibold text-foreground mt-2">{opt?.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{opt?.description}</p>
            </button>
          ))}
        </div>
      </div>
      {/* Minimum Threshold */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} className="text-green-500" />
          Minimum Payout Threshold
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-foreground">$</span>
          <input
            type="number"
            value={threshold}
            onChange={e => setThreshold(Math.max(10, parseInt(e?.target?.value) || 10))}
            min="10"
            step="10"
            className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-xl font-bold focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <div className="flex-1">
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={threshold}
              onChange={e => setThreshold(parseInt(e?.target?.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$10</span><span>$500</span><span>$1,000</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Payouts will only process when your balance reaches ${threshold}</p>
      </div>
      {/* Tax Withholding Calculator */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Calculator" size={20} className="text-purple-500" />
          Tax Withholding Calculator
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">Withholding Percentage: {taxWithholding}%</label>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={taxWithholding}
            onChange={e => setTaxWithholding(parseInt(e?.target?.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0% (No withholding)</span><span>20%</span><span>40%</span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Earnings</span>
            <span className="font-semibold text-foreground">${estimatedEarnings?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax Withheld ({taxWithholding}%)</span>
            <span className="font-semibold text-red-600">-${withheldAmount?.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
            <span className="font-semibold text-foreground">Net Payout</span>
            <span className="font-bold text-green-600 text-lg">${netPayout?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {saving ? <Icon name="Loader" size={18} className="animate-spin" /> : saved ? <Icon name="CheckCircle" size={18} /> : <Icon name="Save" size={18} />}
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Payout Configuration'}
      </button>
    </div>
  );
};

export default PayoutScheduleConfig;
