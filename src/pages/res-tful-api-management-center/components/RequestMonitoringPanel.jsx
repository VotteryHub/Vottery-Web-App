import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { lotteryAPIService } from '../../../services/lotteryAPIService';

const RequestMonitoringPanel = () => {
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecentRequests = async () => {
    try {
      const result = await lotteryAPIService?.getAuditLogs({ limit: 20 });
      if (result?.success) {
        setRecentRequests(result?.data || []);
      }
    } catch (error) {
      console.error('Failed to load recent requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentRequests();
    const interval = setInterval(loadRecentRequests, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600 bg-green-100';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600 bg-yellow-100';
    if (statusCode >= 500) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    return colors?.[method] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Monitoring</h2>
          <p className="text-gray-600">Real-time API traffic with request/response logging</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading request logs...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentRequests?.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent API requests</p>
            </div>
          ) : (
            recentRequests?.map((request) => (
              <div key={request?.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(request?.method)}`}>
                        {request?.method}
                      </span>
                      <code className="text-sm font-mono text-gray-900">{request?.endpoint}</code>
                      {request?.statusCode && (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(request?.statusCode)}`}>
                          {request?.statusCode}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(request?.timestamp)?.toLocaleString()}</span>
                      </div>
                      {request?.responseTime && (
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4" />
                          <span>{request?.responseTime}ms</span>
                        </div>
                      )}
                      {request?.errorMessage && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{request?.errorMessage}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {request?.statusCode >= 200 && request?.statusCode < 300 ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RequestMonitoringPanel;