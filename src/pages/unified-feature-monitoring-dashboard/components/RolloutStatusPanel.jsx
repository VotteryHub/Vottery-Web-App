import React, { useState, useEffect } from 'react';
import { Rocket, Users, Globe, Sliders, FlaskConical, Plus, X } from 'lucide-react';
import { featureFlagService } from '../../../services/featureFlagService';

const RolloutStatusPanel = () => {
  const [rollouts, setRollouts] = useState([
    { flag_key: 'enhanced_gamification', feature: 'Enhanced Gamification', stage: 'Beta', progress: 65, users: '2,500 / 5,000', zones: ['US-East', 'EU-West'], status: 'on-track', eta: '3 days', rollout_percentage: 65 },
    { flag_key: 'predictive_threat', feature: 'Predictive Threat Dashboard', stage: 'Alpha', progress: 40, users: '500 / 1,000', zones: ['US-East'], status: 'on-track', eta: '7 days', rollout_percentage: 40 },
    { flag_key: 'openai_quest', feature: 'OpenAI Quest Generation', stage: 'Development', progress: 25, users: '100 / 500', zones: ['Internal'], status: 'delayed', eta: '14 days', rollout_percentage: 25 },
    { flag_key: 'claude_admin', feature: 'Claude Admin Insights', stage: 'Planning', progress: 15, users: '50 / 200', zones: ['Internal'], status: 'on-track', eta: '21 days', rollout_percentage: 15 }
  ]);
  const [savingKey, setSavingKey] = useState(null);
  const [showABModal, setShowABModal] = useState(false);
  const [abConfig, setABConfig] = useState({ name: '', flagKey: '', variants: [{ id: 'control', name: 'Control', weight: 50 }, { id: 'variant_a', name: 'Variant A', weight: 50 }] });
  const [creatingAB, setCreatingAB] = useState(false);

  const handleRolloutChange = (flagKey, newPct) => {
    setRollouts(prev => prev?.map(r => r?.flag_key === flagKey ? { ...r, rollout_percentage: newPct, progress: newPct } : r));
  };

  const handleSaveRollout = async (flagKey, percentage) => {
    setSavingKey(flagKey);
    try {
      await featureFlagService?.updateRolloutPercentage(flagKey, percentage);
    } catch (err) {
      console.error('Failed to update rollout:', err);
    } finally {
      setSavingKey(null);
    }
  };

  const handleCreateABTest = async () => {
    setCreatingAB(true);
    try {
      await featureFlagService?.createABTest(abConfig);
      setShowABModal(false);
      setABConfig({ name: '', flagKey: '', variants: [{ id: 'control', name: 'Control', weight: 50 }, { id: 'variant_a', name: 'Variant A', weight: 50 }] });
    } catch (err) {
      console.error('Failed to create A/B test:', err);
    } finally {
      setCreatingAB(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-700';
      case 'delayed': return 'bg-orange-100 text-orange-700';
      case 'at-risk': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-600';
    if (progress >= 40) return 'bg-blue-600';
    return 'bg-orange-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Rocket className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Rollout Status & A/B Testing</h2>
            <p className="text-sm text-gray-600">Percentage rollout controls and experiment configuration</p>
          </div>
        </div>
        <button
          onClick={() => setShowABModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium"
        >
          <FlaskConical className="w-4 h-4" />
          New A/B Test
        </button>
      </div>
      <div className="space-y-5">
        {rollouts?.map((rollout, idx) => (
          <div key={rollout?.flag_key} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">{rollout?.feature}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(rollout?.status)}`}>{rollout?.status}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{rollout?.stage}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">{rollout?.rollout_percentage}%</span>
                <button
                  onClick={() => handleSaveRollout(rollout?.flag_key, rollout?.rollout_percentage)}
                  disabled={savingKey === rollout?.flag_key}
                  className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {savingKey === rollout?.flag_key ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {/* Percentage Rollout Slider */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600">Rollout Percentage (0-100%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={rollout?.rollout_percentage}
                onChange={(e) => handleRolloutChange(rollout?.flag_key, parseInt(e?.target?.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(rollout?.rollout_percentage)}`} style={{ width: `${rollout?.rollout_percentage}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1"><Users className="w-3 h-3" /><span>{rollout?.users}</span></div>
              <div className="flex items-center gap-1"><Globe className="w-3 h-3" /><span>{rollout?.zones?.join(', ')}</span></div>
              <span>ETA: {rollout?.eta}</span>
            </div>
          </div>
        ))}
      </div>
      {/* A/B Test Modal */}
      {showABModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><FlaskConical className="w-5 h-5 text-indigo-600" />Create A/B Test</h3>
              <button onClick={() => setShowABModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <input type="text" value={abConfig?.name} onChange={(e) => setABConfig(prev => ({ ...prev, name: e?.target?.value }))} placeholder="e.g. Homepage CTA Button Test" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feature Flag Key</label>
                <input type="text" value={abConfig?.flagKey} onChange={(e) => setABConfig(prev => ({ ...prev, flagKey: e?.target?.value?.toLowerCase()?.replace(/\s/g, '_') }))} placeholder="e.g. homepage_cta_test" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Variants</label>
                {abConfig?.variants?.map((variant, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input type="text" value={variant?.name} onChange={(e) => setABConfig(prev => ({ ...prev, variants: prev?.variants?.map((v, i) => i === idx ? { ...v, name: e?.target?.value } : v) }))} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                    <input type="number" value={variant?.weight} min="0" max="100" onChange={(e) => setABConfig(prev => ({ ...prev, variants: prev?.variants?.map((v, i) => i === idx ? { ...v, weight: parseInt(e?.target?.value) || 0 } : v) }))} className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                ))}
                <button onClick={() => setABConfig(prev => ({ ...prev, variants: [...prev?.variants, { id: `variant_${prev?.variants?.length}`, name: `Variant ${String.fromCharCode(65 + prev?.variants?.length - 1)}`, weight: 0 }] }))} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" />Add Variant
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowABModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateABTest} disabled={creatingAB || !abConfig?.name || !abConfig?.flagKey} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {creatingAB ? 'Creating...' : 'Create Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolloutStatusPanel;