import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const SAMPLE_VARIABLES = {
  winner_name: 'Sarah Johnson',
  prize_amount: '$500',
  claim_link: 'vottery.app/claim/abc123',
  user_name: 'Alex',
  election_title: 'Best Tech Product 2026',
  deadline: 'Feb 28',
  offer_details: '50% off Premium',
  expiry_date: 'Mar 1',
  cta_link: 'vottery.app/offer'
};

const OptimizationPreviewPanel = ({ optimizedMessage, tone, template, isLoading }) => {
  const [variableValues, setVariableValues] = useState(SAMPLE_VARIABLES);
  const [showVariableEditor, setShowVariableEditor] = useState(false);

  const interpolateMessage = (msg) => {
    if (!msg) return '';
    return msg?.replace(/\{\{(\w+)\}\}/g, (match, key) => variableValues?.[key] || match);
  };

  const previewMessage = interpolateMessage(optimizedMessage);

  const getToneStyle = () => {
    switch (tone) {
      case 'professional': return 'border-blue-500/30 bg-blue-500/5';
      case 'friendly': return 'border-green-500/30 bg-green-500/5';
      case 'urgent': return 'border-red-500/30 bg-red-500/5';
      default: return 'border-gray-700 bg-gray-800';
    }
  };

  const getToneLabel = () => {
    const labels = { professional: '💼 Professional', friendly: '😊 Friendly', urgent: '⚡ Urgent' };
    return labels?.[tone] || '📱 Default';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Real-time Preview</h3>
            <p className="text-gray-400 text-sm">Live optimization preview with variables</p>
          </div>
        </div>
        <button
          onClick={() => setShowVariableEditor(!showVariableEditor)}
          className="text-indigo-400 text-xs hover:text-indigo-300 flex items-center gap-1"
        >
          <Icon name="Settings" size={12} />
          Variables
        </button>
      </div>
      {/* Variable Editor */}
      {showVariableEditor && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Test Variable Values</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(variableValues)?.slice(0, 6)?.map(([key, val]) => (
              <div key={key}>
                <label className="text-gray-500 text-xs mb-1 block font-mono">{`{{${key}}}`}</label>
                <input
                  value={val}
                  onChange={(e) => setVariableValues(prev => ({ ...prev, [key]: e?.target?.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Phone Preview */}
      <div className="flex justify-center">
        <div className="w-64 bg-gray-800 rounded-3xl border-2 border-gray-600 p-4 shadow-xl">
          {/* Phone Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-1.5 bg-gray-600 rounded-full" />
            <div className="w-3 h-3 bg-gray-600 rounded-full" />
          </div>
          {/* SMS Bubble */}
          <div className="space-y-2">
            <div className="text-gray-500 text-xs text-center">Vottery Platform</div>
            {isLoading ? (
              <div className="bg-gray-700 rounded-2xl rounded-tl-sm p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <div className={`rounded-2xl rounded-tl-sm p-3 border ${getToneStyle()}`}>
                <p className="text-gray-200 text-xs leading-relaxed">
                  {previewMessage || 'Optimized message will appear here...'}
                </p>
              </div>
            )}
          </div>
          {/* Phone Footer */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-6 bg-gray-700 rounded-full" />
            <div className="w-6 h-6 bg-indigo-500/30 rounded-full flex items-center justify-center">
              <Icon name="Send" size={10} className="text-indigo-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Tone & Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-500 text-xs mb-1">Active Tone</div>
          <div className="text-white text-sm font-medium">{getToneLabel()}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-gray-500 text-xs mb-1">Preview Length</div>
          <div className={`text-sm font-medium ${previewMessage?.length > 160 ? 'text-red-400' : 'text-green-400'}`}>
            {previewMessage?.length}/160
          </div>
        </div>
      </div>
      {/* Template Info */}
      {template && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Icon name="FileText" size={12} />
          Template: <span className="text-gray-400">{template?.name}</span>
        </div>
      )}
    </div>
  );
};

export default OptimizationPreviewPanel;
