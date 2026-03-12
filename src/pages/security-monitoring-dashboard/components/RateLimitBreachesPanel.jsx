import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const RateLimitBreachesPanel = () => {
  const [breaches, setBreaches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBreaches = async () => {
    try {
      const { data, error } = await supabase?.from('rate_limit_violations')?.select('*')?.order('created_at', { ascending: false })?.limit(10);

      if (error) throw error;
      setBreaches(data || []);
    } catch (error) {
      console.error('Error fetching rate limit breaches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaches();
    const interval = setInterval(fetchBreaches, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Rate Limit Breach Attempts</h2>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          {breaches?.length || 0} Recent
        </span>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading breaches...</div>
      ) : breaches?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p>No rate limit breaches detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {breaches?.map((breach) => (
            <div
              key={breach?.id}
              className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200"
            >
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Identifier: {breach?.identifier}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(breach?.created_at)?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">Endpoint: {breach?.endpoint}</p>
                <p className="text-sm text-gray-600">IP: {breach?.ip_address}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-600">
                    Limit Exceeded: {breach?.limit_exceeded}
                  </span>
                  <span className="text-xs text-gray-600">
                    Window: {breach?.window_seconds}s
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RateLimitBreachesPanel;