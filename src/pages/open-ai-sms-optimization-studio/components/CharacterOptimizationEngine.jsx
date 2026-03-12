import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CharacterOptimizationEngine = ({ originalMessage, optimizedMessage, isLoading, onOptimize }) => {
  const [inputMessage, setInputMessage] = useState(originalMessage || '');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (originalMessage) setInputMessage(originalMessage);
  }, [originalMessage]);

  useEffect(() => {
    generateLocalSuggestions(inputMessage);
  }, [inputMessage]);

  const generateLocalSuggestions = (text) => {
    if (!text || text?.length <= 160) {
      setSuggestions([]);
      return;
    }
    const excess = text?.length - 160;
    setSuggestions([
      { type: 'truncate', label: 'Smart Truncate', desc: `Remove ${excess} chars from end`, saving: excess },
      { type: 'abbreviate', label: 'Abbreviate Words', desc: 'Use common abbreviations', saving: Math.floor(excess * 0.7) },
      { type: 'restructure', label: 'AI Restructure', desc: 'Rewrite for conciseness', saving: excess }
    ]);
  };

  const charCount = inputMessage?.length;
  const isOverLimit = charCount > 160;
  const percentage = Math.min((charCount / 160) * 100, 100);

  const getBarColor = () => {
    if (charCount > 160) return 'bg-red-500';
    if (charCount > 140) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCountColor = () => {
    if (charCount > 160) return 'text-red-400';
    if (charCount > 140) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <Icon name="Hash" size={20} className="text-green-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Character Optimization Engine</h3>
          <p className="text-gray-400 text-sm">Keep messages under 160 characters</p>
        </div>
      </div>
      {/* Input */}
      <div>
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Original Message</label>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e?.target?.value)}
          rows={3}
          placeholder="Enter your SMS message..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
        />
        {/* Character Counter */}
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Character count</span>
            <span className={`text-sm font-bold ${getCountColor()}`}>
              {charCount}<span className="text-gray-500 font-normal">/160</span>
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getBarColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {isOverLimit && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs">
              <Icon name="AlertTriangle" size={12} />
              {charCount - 160} characters over limit — will be split into {Math.ceil(charCount / 160)} messages
            </div>
          )}
        </div>
      </div>
      {/* Optimize Button */}
      <Button
        onClick={() => onOptimize?.(inputMessage)}
        disabled={isLoading || !inputMessage?.trim()}
        className="w-full"
      >
        {isLoading ? (
          <><Icon name="Loader" size={14} className="mr-2 animate-spin" />Optimizing with AI...</>
        ) : (
          <><Icon name="Sparkles" size={14} className="mr-2" />Optimize with OpenAI</>
        )}
      </Button>
      {/* Suggestions for over-limit */}
      {suggestions?.length > 0 && (
        <div>
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">Optimization Suggestions</label>
          <div className="space-y-2">
            {suggestions?.map(s => (
              <div key={s?.type} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                <div>
                  <div className="text-gray-200 text-sm font-medium">{s?.label}</div>
                  <div className="text-gray-500 text-xs">{s?.desc}</div>
                </div>
                <span className="text-green-400 text-xs font-medium">-{s?.saving} chars</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Optimized Result */}
      {optimizedMessage && (
        <div>
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">AI Optimized Version</label>
          <div className="bg-green-500/5 border border-green-500/30 rounded-lg p-4">
            <p className="text-gray-200 text-sm leading-relaxed">{optimizedMessage}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-500/20">
              <span className="text-green-400 text-xs">{optimizedMessage?.length}/160 chars</span>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <Icon name="CheckCircle" size={12} />
                {charCount - optimizedMessage?.length} chars saved
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterOptimizationEngine;
