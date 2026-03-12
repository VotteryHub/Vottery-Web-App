import React, { useState } from 'react';
import { Zap, Shield, Lock, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const RESPONSE_ACTIONS = [
  { id: 'lockdown', label: 'Emergency Lockdown', description: 'Suspend all voting and freeze suspicious accounts', icon: Lock, color: 'bg-red-600 hover:bg-red-700', severity: 'critical' },
  { id: 'rate_limit', label: 'Activate Rate Limiting', description: 'Apply strict rate limits to all API endpoints', icon: Shield, color: 'bg-orange-600 hover:bg-orange-700', severity: 'high' },
  { id: 'ip_block', label: 'Block Suspicious IPs', description: 'Auto-block IPs with anomalous behavior patterns', icon: AlertTriangle, color: 'bg-yellow-600 hover:bg-yellow-700', severity: 'medium' },
  { id: 'notify_team', label: 'Notify Security Team', description: 'Send immediate SMS and email to all stakeholders', icon: Zap, color: 'bg-blue-600 hover:bg-blue-700', severity: 'any' },
];

const AutomatedResponsePanel = ({ threatScore }) => {
  const [executedActions, setExecutedActions] = useState({});
  const [executing, setExecuting] = useState({});

  const handleExecute = async (actionId) => {
    setExecuting((prev) => ({ ...prev, [actionId]: true }));
    // Simulate execution
    await new Promise((r) => setTimeout(r, 1500));
    setExecutedActions((prev) => ({ ...prev, [actionId]: new Date()?.toISOString() }));
    setExecuting((prev) => ({ ...prev, [actionId]: false }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <Zap size={20} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">One-Click Response Triggers</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Execute predefined mitigation workflows instantly</p>
        </div>
      </div>

      <div className="space-y-3">
        {RESPONSE_ACTIONS?.map((action) => {
          const Icon = action?.icon;
          const executed = executedActions?.[action?.id];
          const isExecuting = executing?.[action?.id];

          return (
            <div key={action?.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{action?.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{action?.description}</p>
                  {executed && (
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle size={10} /> Executed at {new Date(executed)?.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleExecute(action?.id)}
                disabled={isExecuting || !!executed}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                  executed ? 'bg-green-600' : action?.color
                }`}
              >
                {isExecuting ? (
                  <><Clock size={12} className="animate-spin" /> Executing...</>
                ) : executed ? (
                  <><CheckCircle size={12} /> Done</>
                ) : (
                  <><Zap size={12} /> Execute</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutomatedResponsePanel;
