import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EscrowSystem = ({ service, onEscrowCreate }) => {
  const [escrowAmount, setEscrowAmount] = useState(service?.price || 0);
  const [escrowStatus, setEscrowStatus] = useState('none'); // none, holding, released, disputed
  const [loading, setLoading] = useState(false);

  const handleCreateEscrow = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setEscrowStatus('holding');
      onEscrowCreate?.({ amount: escrowAmount, status: 'holding', createdAt: new Date()?.toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setEscrowStatus('released');
    setLoading(false);
  };

  const statusConfig = {
    none: { label: 'No Escrow', color: 'text-gray-500', bg: 'bg-gray-100', icon: 'Lock' },
    holding: { label: 'Funds Held in Escrow', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: 'Lock' },
    released: { label: 'Funds Released', color: 'text-green-600', bg: 'bg-green-100', icon: 'Unlock' },
    disputed: { label: 'Dispute Raised', color: 'text-red-600', bg: 'bg-red-100', icon: 'AlertTriangle' }
  };
  const sc = statusConfig?.[escrowStatus];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Shield" size={18} className="text-purple-500" />
        Escrow Protection
      </h4>
      <div className={`flex items-center gap-2 p-3 ${sc?.bg} rounded-lg mb-4`}>
        <Icon name={sc?.icon} size={16} className={sc?.color} />
        <span className={`text-sm font-medium ${sc?.color}`}>{sc?.label}</span>
        {escrowStatus === 'holding' && (
          <span className="ml-auto font-bold text-yellow-700">${escrowAmount}</span>
        )}
      </div>
      {escrowStatus === 'none' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Escrow Amount ($)</label>
            <input
              type="number"
              value={escrowAmount}
              onChange={e => setEscrowAmount(parseFloat(e?.target?.value) || 0)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground"
            />
          </div>
          <button
            onClick={handleCreateEscrow}
            disabled={loading || escrowAmount <= 0}
            className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="Lock" size={16} />}
            Hold Funds in Escrow
          </button>
        </div>
      )}
      {escrowStatus === 'holding' && (
        <div className="flex gap-2">
          <button
            onClick={handleRelease}
            disabled={loading}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Release to Creator
          </button>
          <button
            onClick={() => setEscrowStatus('disputed')}
            className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
          >
            Raise Dispute
          </button>
        </div>
      )}
      {escrowStatus === 'released' && (
        <p className="text-sm text-green-600 text-center">✓ Payment successfully released to creator</p>
      )}
    </div>
  );
};

export default EscrowSystem;
