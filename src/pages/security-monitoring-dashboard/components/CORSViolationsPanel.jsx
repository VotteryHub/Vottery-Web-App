import React, { useState, useEffect } from 'react';
import { Globe, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const CORSViolationsPanel = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchViolations = async () => {
    try {
      const { data, error } = await supabase?.from('cors_violations')?.select('*')?.order('created_at', { ascending: false })?.limit(10);

      if (error) throw error;
      setViolations(data || []);
    } catch (error) {
      console.error('Error fetching CORS violations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
    const interval = setInterval(fetchViolations, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">CORS Policy Violations</h2>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          {violations?.length || 0} Recent
        </span>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading violations...</div>
      ) : violations?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p>No CORS violations detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {violations?.map((violation) => (
            <div
              key={violation?.id}
              className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200"
            >
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Origin: {violation?.origin}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(violation?.created_at)?.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">Endpoint: {violation?.endpoint}</p>
                <p className="text-sm text-gray-600">IP: {violation?.ip_address}</p>
                {violation?.user_agent && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {violation?.user_agent}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CORSViolationsPanel;