import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const SyncFailureAlertsPanel = ({ failures = [], onRetry, onSendSMS, loading = false }) => {
  const [retrying, setRetrying] = useState(null);
  const [sendingSMS, setSendingSMS] = useState(false);

  const handleRetry = async (failure) => {
    setRetrying(failure?.id);
    try {
      await onRetry?.(failure);
      toast?.success('Retry initiated successfully');
    } catch (e) {
      toast?.error('Retry failed');
    } finally {
      setRetrying(null);
    }
  };

  const handleSendSMSAlert = async () => {
    if (!failures?.length) return;
    setSendingSMS(true);
    try {
      await onSendSMS?.(failures);
      toast?.success('SMS alert sent via Telnyx');
    } catch (e) {
      toast?.error('Failed to send SMS alert');
    } finally {
      setSendingSMS(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return 'border-red-500/50 bg-red-500/10';
    if (severity === 'high') return 'border-orange-500/50 bg-orange-500/10';
    return 'border-yellow-500/50 bg-yellow-500/10';
  };

  const getSeverityTextColor = (severity) => {
    if (severity === 'critical') return 'text-red-400';
    if (severity === 'high') return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Sync Failure Alerts</h3>
            <p className="text-gray-400 text-sm">Failed subscriptions with auto-retry</p>
          </div>
        </div>
        {failures?.length > 0 && (
          <button
            onClick={handleSendSMSAlert}
            disabled={sendingSMS}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
          >
            <MessageSquare className={`w-3.5 h-3.5 ${sendingSMS ? 'animate-pulse' : ''}`} />
            {sendingSMS ? 'Sending...' : 'SMS Alert'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 p-3 bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${failures?.length === 0 ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></div>
          <span className="text-gray-300 text-sm">{failures?.length === 0 ? 'All systems operational' : `${failures?.length} active failures`}</span>
        </div>
        {loading && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin ml-auto" />}
      </div>

      {failures?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
          <p className="text-green-400 font-medium">No sync failures detected</p>
          <p className="text-gray-500 text-sm mt-1">All subscriptions are healthy</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {failures?.map((failure, i) => (
            <div key={i} className={`p-4 rounded-xl border ${getSeverityColor(failure?.severity)}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className={`w-4 h-4 ${getSeverityTextColor(failure?.severity)}`} />
                    <span className={`text-sm font-medium ${getSeverityTextColor(failure?.severity)} capitalize`}>{failure?.severity || 'warning'}</span>
                  </div>
                  <p className="text-white text-sm">{failure?.description || `Sync failure ${i + 1}`}</p>
                  <p className="text-gray-400 text-xs mt-1">{failure?.table || 'Unknown table'} • {failure?.retryCount || 0} retries</p>
                  {failure?.lastError && (
                    <p className="text-gray-500 text-xs mt-1 font-mono truncate">{failure?.lastError}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRetry(failure)}
                  disabled={retrying === failure?.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white rounded-lg text-xs transition-colors flex-shrink-0"
                >
                  <RefreshCw className={`w-3 h-3 ${retrying === failure?.id ? 'animate-spin' : ''}`} />
                  Retry
                </button>
              </div>
              {failure?.autoRetryAt && (
                <p className="text-gray-500 text-xs mt-2">
                  Auto-retry at: {new Date(failure?.autoRetryAt)?.toLocaleTimeString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SyncFailureAlertsPanel;
