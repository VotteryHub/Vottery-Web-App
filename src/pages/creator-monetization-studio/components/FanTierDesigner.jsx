import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Crown, Edit2, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const FanTierDesigner = () => {
  const { user } = useAuth();
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTier, setEditingTier] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) fetchTiers();
  }, [user]);

  const fetchTiers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('creator_fan_tiers')
      .select('*')
      .eq('creator_id', user.id)
      .order('price_usd', { ascending: true });

    if (!error) setTiers(data || []);
    setLoading(false);
  };

  const handleSaveTier = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const tierData = {
      creator_id: user.id,
      name: editingTier.name,
      price_usd: parseFloat(editingTier.price_usd),
      benefits: editingTier.benefits.split('\n').filter(b => b.trim() !== ''),
      is_active: true
    };

    let error;
    if (editingTier.id) {
      const { error: err } = await supabase
        .from('creator_fan_tiers')
        .update(tierData)
        .eq('id', editingTier.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('creator_fan_tiers')
        .insert([tierData]);
      error = err;
    }

    if (!error) {
      setEditingTier(null);
      fetchTiers();
    }
    setIsSaving(false);
  };

  const deleteTier = async (id) => {
    if (window.confirm('Are you sure you want to delete this tier?')) {
      const { error } = await supabase
        .from('creator_fan_tiers')
        .delete()
        .eq('id', id);
      if (!error) fetchTiers();
    }
  };

  if (loading) return <div className="text-gray-400">Loading tiers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Fan Subscription Tiers</h2>
          <p className="text-sm text-gray-400">Define tiers your fans can subscribe to for exclusive benefits.</p>
        </div>
        <button 
          onClick={() => setEditingTier({ name: '', price_usd: '', benefits: '' })}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiers.map(tier => (
          <div key={tier.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingTier({ ...tier, benefits: tier.benefits.join('\n') })} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => deleteTier(tier.id)} className="p-1.5 bg-red-900/20 hover:bg-red-900/40 rounded-md text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">{tier.name}</h3>
                <p className="text-amber-500 text-lg font-black">${tier.price_usd}<span className="text-xs text-gray-500 font-normal">/mo</span></p>
              </div>
            </div>

            <div className="space-y-2">
              {tier.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingTier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">{editingTier.id ? 'Edit Tier' : 'New Fan Tier'}</h3>
            <form onSubmit={handleSaveTier} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tier Name</label>
                <input 
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="e.g. Super Fan"
                  value={editingTier.name}
                  onChange={e => setEditingTier({ ...editingTier, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Price (USD / month)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  min="0.99"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="9.99"
                  value={editingTier.price_usd}
                  onChange={e => setEditingTier({ ...editingTier, price_usd: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Benefits (one per line)</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  placeholder="Exclusive badge&#10;Early access&#10;Voter multiplier"
                  value={editingTier.benefits}
                  onChange={e => setEditingTier({ ...editingTier, benefits: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingTier(null)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Tier</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FanTierDesigner;
