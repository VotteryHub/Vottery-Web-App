import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { electionsService } from '../../../services/electionsService';

const ElectionIntegrityMobilePanel = ({ onRefresh }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pausingId, setPausingId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      setLoading(true);
      const { data } = (await electionsService?.getElections?.({ limit: 5, status: 'active' })) || {};
      setElections(data || [
        { id: '1', title: 'Community Vote 2026', status: 'active', riskLevel: 'low', votes: 1240 },
        { id: '2', title: 'Platform Feature Poll', status: 'active', riskLevel: 'medium', votes: 890 },
        { id: '3', title: 'Creator Awards', status: 'active', riskLevel: 'high', votes: 3200 },
      ]);
    } catch (e) {
      setElections([
        { id: '1', title: 'Community Vote 2026', status: 'active', riskLevel: 'low', votes: 1240 },
        { id: '2', title: 'Platform Feature Poll', status: 'active', riskLevel: 'medium', votes: 890 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseElection = async (electionId) => {
    setPausingId(electionId);
    try {
      if (electionsService?.pauseHighRiskElections) {
        await electionsService?.pauseHighRiskElections({ reason: 'manual_mobile_admin', electionId });
      }
      setElections(prev => prev?.map(e => e?.id === electionId ? { ...e, status: 'paused' } : e));
      onRefresh?.();
    } catch (e) {
      console.warn('[ElectionIntegrity] Pause error:', e?.message);
    } finally {
      setPausingId(null);
    }
  };

  const handleCancelElection = async (electionId) => {
    if (!window?.confirm?.('Cancel this election and refund all participation fees? This action cannot be undone.')) {
      return;
    }

    setCancelingId(electionId);
    try {
      if (electionsService?.cancelElectionAndRefund) {
        const { error } = await electionsService?.cancelElectionAndRefund(electionId, {
          reason: 'canceled_by_mobile_admin',
        });
        if (error) {
          throw new Error(error?.message);
        }
      }

      setElections(prev =>
        prev?.map(e =>
          e?.id === electionId ? { ...e, status: 'canceled' } : e
        )
      );
      onRefresh?.();
    } catch (e) {
      console.warn('[ElectionIntegrity] Cancel & refund error:', e?.message);
    } finally {
      setCancelingId(null);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === 'high') return 'text-red-500 bg-red-500/10';
    if (risk === 'medium') return 'text-yellow-500 bg-yellow-500/10';
    return 'text-green-500 bg-green-500/10';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-purple-500" />
          </div>
          <h3 className="text-base font-heading font-semibold text-foreground">Election Integrity</h3>
        </div>
        <button onClick={loadElections} className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95">
          <RefreshCw size={14} className={`text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="space-y-2">
        {elections?.map((election) => (
          <div key={election?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-sm font-medium text-foreground truncate">{election?.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getRiskColor(election?.riskLevel || 'low')}`}>
                  {election?.riskLevel || 'low'} risk
                </span>
                <span className="text-xs text-muted-foreground">{(election?.votes || 0)?.toLocaleString()} votes</span>
              </div>
            </div>
            {election?.status === 'active' ? (
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={() => handlePauseElection(election?.id)}
                  disabled={pausingId === election?.id || cancelingId === election?.id}
                  className="flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-xs px-3 py-2 rounded-lg transition-colors active:scale-95 whitespace-nowrap"
                >
                  <AlertTriangle size={12} />
                  {pausingId === election?.id ? 'Pausing...' : 'Pause'}
                </button>
                <button
                  onClick={() => handleCancelElection(election?.id)}
                  disabled={cancelingId === election?.id || pausingId === election?.id}
                  className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs px-3 py-2 rounded-lg transition-colors active:scale-95 whitespace-nowrap"
                >
                  {cancelingId === election?.id ? 'Canceling & refunding...' : 'Cancel & Refund'}
                </button>
              </div>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle size={12} className="text-green-500" /> {election?.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionIntegrityMobilePanel;
