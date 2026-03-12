import React, { useState, useEffect } from 'react';
import { Database, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const SQLInjectionPanel = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttempts = async () => {
    try {
      const { data, error } = await supabase?.from('sql_injection_attempts')?.select('*')?.order('created_at', { ascending: false })?.limit(10);

      if (error) throw error;
      setAttempts(data || []);
    } catch (error) {
      console.error('Error fetching SQL injection attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
    const interval = setInterval(fetchAttempts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">SQL Injection Pattern Detection</h2>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          {attempts?.length || 0} Blocked
        </span>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading attempts...</div>
      ) : attempts?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p>No SQL injection attempts detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts?.map((attempt) => (
            <div
              key={attempt?.id}
              className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Endpoint: {attempt?.endpoint}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(attempt?.created_at)?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Pattern: <code className="bg-red-100 px-2 py-1 rounded">{attempt?.suspicious_pattern}</code>
                </p>
                <p className="text-sm text-gray-600">IP: {attempt?.ip_address}</p>
                {attempt?.blocked && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-200 text-red-800 text-xs rounded">
                    ✓ Blocked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SQLInjectionPanel;