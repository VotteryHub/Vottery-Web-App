import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { smsProviderService } from '../../../services/smsProviderService';

const SMSOptimizationPanel = () => {
  const [originalContent, setOriginalContent] = useState('');
  const [optimizedContent, setOptimizedContent] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [maxLength, setMaxLength] = useState('160');
  const [tone, setTone] = useState('professional');

  const handleOptimize = async () => {
    if (!originalContent?.trim()) return;

    try {
      setOptimizing(true);
      const { data } = await smsProviderService?.optimizeSMSContent(originalContent, {
        maxLength: parseInt(maxLength),
        tone,
        includePersonalization: true
      });
      setOptimizedContent(data);
    } catch (error) {
      console.error('Error optimizing content:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'formal', label: 'Formal' }
  ];

  const lengthOptions = [
    { value: '160', label: '160 characters (1 SMS)' },
    { value: '140', label: '140 characters' },
    { value: '120', label: '120 characters' }
  ];

  return (
    <div className="space-y-6">
      {/* OpenAI Integration Info */}
      <div className="card bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" size={20} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">AI-Powered SMS Optimization</h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              OpenAI GPT-4 automatically optimizes SMS content length, adds personalization variables, and improves engagement tone while respecting character limits and maintaining professional guidelines for security/compliance messages.
            </p>
          </div>
        </div>
      </div>

      {/* Optimization Form */}
      <div className="card">
        <h4 className="font-semibold text-foreground mb-4">Content Optimization</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Original Message
            </label>
            <textarea
              value={originalContent}
              onChange={(e) => setOriginalContent(e?.target?.value)}
              placeholder="Enter your SMS message to optimize..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {originalContent?.length} characters
              </span>
              {originalContent?.length > 160 && (
                <span className="text-xs text-orange-600">
                  Exceeds 160 character limit
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Length
              </label>
              <Select
                value={maxLength}
                onChange={(e) => setMaxLength(e?.target?.value)}
                options={lengthOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tone
              </label>
              <Select
                value={tone}
                onChange={(e) => setTone(e?.target?.value)}
                options={toneOptions}
              />
            </div>
          </div>

          <Button
            onClick={handleOptimize}
            disabled={!originalContent?.trim() || optimizing}
            iconName="Sparkles"
            className="w-full"
          >
            {optimizing ? 'Optimizing with AI...' : 'Optimize with OpenAI'}
          </Button>
        </div>
      </div>

      {/* Optimized Result */}
      {optimizedContent && (
        <div className="card">
          <h4 className="font-semibold text-foreground mb-4">Optimized Message</h4>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-foreground whitespace-pre-wrap">{optimizedContent?.optimized}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                <span className="text-sm text-green-700 dark:text-green-400">
                  {optimizedContent?.optimizedLength} characters
                </span>
                <span className="text-sm text-green-700 dark:text-green-400">
                  Saved {optimizedContent?.saved} characters
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Original Length</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">
                  {optimizedContent?.originalLength}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Optimized Length</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">
                  {optimizedContent?.optimizedLength}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                iconName="Copy"
                onClick={() => navigator?.clipboard?.writeText(optimizedContent?.optimized)}
              >
                Copy Optimized
              </Button>
              <Button
                variant="outline"
                iconName="RotateCcw"
                onClick={() => setOptimizedContent(null)}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Guidelines */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Optimization Features</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Automatic content length optimization under 160 characters</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Personalization variable insertion ({'{{'} name{'}}'}, {'{{'} date{'}}'}, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Engagement tone improvement while maintaining professionalism</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Respects character limits and tone guidelines for security/compliance messages</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSOptimizationPanel;
