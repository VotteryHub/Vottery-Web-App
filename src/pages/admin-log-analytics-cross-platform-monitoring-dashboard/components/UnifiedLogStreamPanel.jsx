import React from 'react';
import { Activity, AlertCircle, Info, AlertTriangle, XCircle, User, Clock } from 'lucide-react';

const UnifiedLogStreamPanel = ({ logs, loading }) => {
  const getLevelIcon = (level) => {
    switch (level) {
      case 'debug':
        return <Info className="w-4 h-4 text-slate-500" />;
      case 'info':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'debug':
        return 'bg-slate-100 text-slate-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      case 'warn':
        return 'bg-yellow-100 text-yellow-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'critical':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      security: 'bg-purple-100 text-purple-700',
      payment: 'bg-green-100 text-green-700',
      voting: 'bg-blue-100 text-blue-700',
      ai_analysis: 'bg-indigo-100 text-indigo-700',
      user_activity: 'bg-cyan-100 text-cyan-700',
      performance: 'bg-orange-100 text-orange-700',
      fraud_detection: 'bg-red-100 text-red-700',
      system: 'bg-slate-100 text-slate-700',
      api: 'bg-teal-100 text-teal-700',
      database: 'bg-amber-100 text-amber-700',
      authentication: 'bg-orange-100 text-orange-700'
    };
    return colors?.[category] || 'bg-slate-100 text-slate-700';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center justify-center py-12">
          <Activity className="w-6 h-6 text-purple-500 animate-spin" />
          <span className="ml-2 text-slate-600">Loading logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Unified Log Stream</h2>
          <span className="text-sm text-slate-600">{logs?.length || 0} logs</span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
        {logs?.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No logs found matching your filters
          </div>
        ) : (
          logs?.map((log, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getLevelIcon(log?.logLevel)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log?.logLevel)}`}>
                      {log?.logLevel?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(log?.logCategory)}`}>
                      {log?.logCategory?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      {log?.logSource?.toUpperCase()}
                    </span>
                    {log?.aiServiceName && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                        {log?.aiServiceName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{log?.eventType}</p>
                  <p className="text-sm text-slate-600 mb-2">{log?.message}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log?.createdAt)?.toLocaleString()}</span>
                    </div>
                    {log?.user && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{log?.user?.name || log?.user?.email}</span>
                      </div>
                    )}
                    {log?.durationMs && (
                      <span>{log?.durationMs}ms</span>
                    )}
                    {log?.statusCode && (
                      <span>Status: {log?.statusCode}</span>
                    )}
                  </div>
                  {log?.metadata && Object.keys(log?.metadata)?.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                        View metadata
                      </summary>
                      <pre className="mt-2 p-2 bg-slate-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log?.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnifiedLogStreamPanel;