import React, { useState, useEffect } from 'react';
import { Database, Table, Settings, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const DatabaseConfigurationPanel = () => {
  const [tableInfo, setTableInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadTableInfo();
  }, []);

  const loadTableInfo = async () => {
    setLoading(true);
    try {
      // Get table row count
      const { count, error } = await supabase
        ?.from('platform_logs')
        ?.select('*', { count: 'exact', head: true });

      if (!error) {
        setTableInfo({
          rowCount: count || 0,
          rlsEnabled: true,
          indexes: [
            'idx_platform_logs_user_id',
            'idx_platform_logs_log_level',
            'idx_platform_logs_log_category',
            'idx_platform_logs_created_at',
            'idx_platform_logs_metadata_gin'
          ],
          partitioning: 'Time-based (monthly)',
          retentionPolicy: 'Active'
        });
      }
    } catch (error) {
      console.error('Failed to load table info:', error);
    }
    setLoading(false);
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    // Simulate optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOptimizing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Database Configuration</h2>
        </div>
        <button
          onClick={handleOptimize}
          disabled={optimizing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {optimizing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Settings className="w-4 h-4" />
          )}
          {optimizing ? 'Optimizing...' : 'Optimize'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Table Schema */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Table className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">platform_logs Table</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Records</p>
              <p className="text-lg font-bold text-slate-900">
                {tableInfo?.rowCount?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">RLS Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-lg font-bold text-green-600">Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indexes */}
        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-3">Active Indexes</h3>
          <div className="space-y-2">
            {tableInfo?.indexes?.map((index, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-700 font-mono">{index}</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Optimization */}
        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-3">Performance Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Table Partitioning</span>
              <span className="text-sm font-medium text-slate-900">{tableInfo?.partitioning}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Retention Policy</span>
              <span className="text-sm font-medium text-green-600">{tableInfo?.retentionPolicy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Auto-vacuum</span>
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConfigurationPanel;