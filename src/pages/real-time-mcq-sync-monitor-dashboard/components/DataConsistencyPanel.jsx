import React, { useState } from 'react';
import { GitCompare, CheckCircle, AlertTriangle, RefreshCw, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

const DataConsistencyPanel = ({ consistencyData = null, loading = false, onReconcile }) => {
  const [reconciling, setReconciling] = useState(null);

  const handleReconcile = async (mismatch) => {
    setReconciling(mismatch?.id);
    try {
      await onReconcile?.(mismatch);
      toast?.success('Reconciliation initiated');
    } catch (e) {
      toast?.error('Reconciliation failed');
    } finally {
      setReconciling(null);
    }
  };

  const consistencyScore = consistencyData?.consistencyScore || 0;
  const mismatches = consistencyData?.mismatches || [];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <GitCompare className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Data Consistency Checker</h3>
          <p className="text-gray-400 text-sm">Web App vs Mobile App synchronization</p>
        </div>
        {loading && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin ml-auto" />}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-700/50 rounded-xl text-center">
          <p className="text-white text-2xl font-bold">{consistencyData?.webCount || 0}</p>
          <p className="text-gray-400 text-xs mt-1">Web Records</p>
        </div>
        <div className="p-3 bg-gray-700/50 rounded-xl text-center">
          <p className="text-white text-2xl font-bold">{consistencyData?.mobileCount || 0}</p>
          <p className="text-gray-400 text-xs mt-1">Mobile Records</p>
        </div>
        <div className={`p-3 rounded-xl text-center ${consistencyScore >= 95 ? 'bg-green-500/10' : consistencyScore >= 80 ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
          <p className={`text-2xl font-bold ${consistencyScore >= 95 ? 'text-green-400' : consistencyScore >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{Math.round(consistencyScore)}%</p>
          <p className="text-gray-400 text-xs mt-1">Consistency</p>
        </div>
      </div>

      {mismatches?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
          <p className="text-green-400 font-medium">All records synchronized</p>
          <p className="text-gray-500 text-sm mt-1">No mismatches detected</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-400 text-sm font-medium">{mismatches?.length} mismatches detected</p>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mismatches?.map((mismatch, i) => (
              <div key={i} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{mismatch?.description || `Mismatch ${i + 1}`}</p>
                    <p className="text-gray-400 text-xs mt-1">{mismatch?.suggestion || 'Review and reconcile records'}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-blue-400">Web: {mismatch?.webValue || 'N/A'}</span>
                      <span className="text-xs text-purple-400">Mobile: {mismatch?.mobileValue || 'N/A'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReconcile(mismatch)}
                    disabled={reconciling === mismatch?.id}
                    className="flex items-center gap-1 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white rounded-lg text-xs transition-colors flex-shrink-0"
                  >
                    <Wrench className={`w-3 h-3 ${reconciling === mismatch?.id ? 'animate-spin' : ''}`} />
                    Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataConsistencyPanel;
