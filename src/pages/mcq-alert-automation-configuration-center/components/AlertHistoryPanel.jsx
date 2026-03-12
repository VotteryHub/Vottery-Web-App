import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import mcqAlertAutomationService from '../../../services/mcqAlertAutomationService';

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  high: { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertTriangle },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: AlertTriangle },
  low: { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle },
};

const AlertHistoryPanel = ({ alerts, onRefresh }) => {
  const [resolving, setResolving] = useState({});

  const handleResolve = async (alertId) => {
    setResolving((prev) => ({ ...prev, [alertId]: true }));
    await mcqAlertAutomationService?.resolveAlert(alertId);
    onRefresh?.();
    setResolving((prev) => ({ ...prev, [alertId]: false }));
  };

  const formatTime = (ts) => {
    if (!ts) return 'Unknown';
    const d = new Date(ts);
    return d?.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alert History</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{alerts?.length || 0} alerts recorded</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {!alerts?.length ? (
        <div className="text-center py-12">
          <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
          <p className="text-gray-500 dark:text-gray-400">No alerts triggered yet</p>
          <p className="text-xs text-gray-400 mt-1">System is monitoring thresholds every 5 minutes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts?.map((alert) => {
            const cfg = SEVERITY_CONFIG?.[alert?.severity] || SEVERITY_CONFIG?.low;
            const SeverityIcon = cfg?.icon;
            return (
              <div
                key={alert?.id}
                className={`${cfg?.bg} border border-gray-200 dark:border-gray-700 rounded-xl p-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <SeverityIcon size={18} className={`${cfg?.color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold uppercase ${cfg?.color}`}>{alert?.severity}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{alert?.alertType?.replace(/_/g, ' ')}</span>
                        {alert?.resolved && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Resolved</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{alert?.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {formatTime(alert?.triggeredAt)}
                        </span>
                        {alert?.thresholdValue !== undefined && (
                          <span>Threshold: {alert?.thresholdValue}%</span>
                        )}
                        {alert?.actualValue !== undefined && (
                          <span>Actual: {parseFloat(alert?.actualValue)?.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!alert?.resolved && (
                    <button
                      onClick={() => handleResolve(alert?.id)}
                      disabled={resolving?.[alert?.id]}
                      className="flex-shrink-0 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {resolving?.[alert?.id] ? 'Resolving...' : 'Resolve'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertHistoryPanel;
