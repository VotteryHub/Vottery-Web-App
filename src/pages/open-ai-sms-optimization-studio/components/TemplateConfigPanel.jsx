import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TONE_OPTIONS = [
  { id: 'professional', label: 'Professional', icon: 'Briefcase', color: 'blue', desc: 'Formal, business-appropriate tone' },
  { id: 'friendly', label: 'Friendly', icon: 'Smile', color: 'green', desc: 'Warm, conversational tone' },
  { id: 'urgent', label: 'Urgent', icon: 'Zap', color: 'red', desc: 'Action-driven, time-sensitive tone' }
];

const DEFAULT_TEMPLATES = [
  { id: 'winner', name: 'Winner Notification', prompt: 'Optimize this SMS for winner notification: {{message}}. Keep under 160 chars, tone: {{tone}}, include: {{variables}}', variables: ['winner_name', 'prize_amount', 'claim_link'] },
  { id: 'reminder', name: 'Voting Reminder', prompt: 'Optimize this SMS voting reminder: {{message}}. Keep under 160 chars, tone: {{tone}}, include: {{variables}}', variables: ['user_name', 'election_title', 'deadline'] },
  { id: 'promo', name: 'Promotional Alert', prompt: 'Optimize this promotional SMS: {{message}}. Keep under 160 chars, tone: {{tone}}, include: {{variables}}', variables: ['offer_details', 'expiry_date', 'cta_link'] }
];

const TemplateConfigPanel = ({ onTemplateChange, selectedTone, onToneChange }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATES?.[0]);
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_TEMPLATES?.[0]?.prompt);
  const [editMode, setEditMode] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState(DEFAULT_TEMPLATES);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomPrompt(template?.prompt);
    onTemplateChange?.(template);
  };

  const handleSaveTemplate = () => {
    const updated = savedTemplates?.map(t =>
      t?.id === selectedTemplate?.id ? { ...t, prompt: customPrompt } : t
    );
    setSavedTemplates(updated);
    setEditMode(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Template Configuration</h3>
            <p className="text-gray-400 text-sm">Configure OpenAI prompt templates</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
          <Icon name={editMode ? 'X' : 'Edit'} size={14} className="mr-1" />
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      {/* Template Selection */}
      <div>
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 block">Select Template</label>
        <div className="grid grid-cols-3 gap-2">
          {savedTemplates?.map(template => (
            <button
              key={template?.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedTemplate?.id === template?.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400' :'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="text-xs font-medium">{template?.name}</div>
              <div className="text-xs text-gray-500 mt-1">{template?.variables?.length} vars</div>
            </button>
          ))}
        </div>
      </div>
      {/* Tone Selection */}
      <div>
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 block">Tone Adjustment</label>
        <div className="grid grid-cols-3 gap-2">
          {TONE_OPTIONS?.map(tone => (
            <button
              key={tone?.id}
              onClick={() => onToneChange?.(tone?.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedTone === tone?.id
                  ? `border-${tone?.color}-500 bg-${tone?.color}-500/10`
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon name={tone?.icon} size={14} className={selectedTone === tone?.id ? `text-${tone?.color}-400` : 'text-gray-400'} />
                <span className={`text-xs font-medium ${selectedTone === tone?.id ? `text-${tone?.color}-400` : 'text-gray-300'}`}>{tone?.label}</span>
              </div>
              <div className="text-xs text-gray-500">{tone?.desc}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Prompt Editor */}
      <div>
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Prompt Template</label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e?.target?.value)}
          disabled={!editMode}
          rows={4}
          className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm text-gray-300 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            editMode ? 'border-blue-500/50' : 'border-gray-700'
          }`}
        />
        {editMode && (
          <div className="flex justify-end mt-2">
            <Button size="sm" onClick={handleSaveTemplate}>
              <Icon name="Save" size={14} className="mr-1" />
              Save Template
            </Button>
          </div>
        )}
      </div>
      {/* Variables */}
      {selectedTemplate?.variables && (
        <div>
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Dynamic Variables</label>
          <div className="flex flex-wrap gap-2">
            {selectedTemplate?.variables?.map(v => (
              <span key={v} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 text-xs font-mono">{`{{${v}}}`}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateConfigPanel;
