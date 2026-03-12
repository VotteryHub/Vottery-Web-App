import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useChat } from '../../hooks/useChat';
import TemplateConfigPanel from './components/TemplateConfigPanel';
import ABTestingPanel from './components/ABTestingPanel';
import CharacterOptimizationEngine from './components/CharacterOptimizationEngine';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import EngagementMetricsPanel from './components/EngagementMetricsPanel';
import OptimizationPreviewPanel from './components/OptimizationPreviewPanel';

const INITIAL_VARIANTS = [
  { id: 'A', content: 'Congratulations! You won $500 in the Vottery election. Click to claim your prize before it expires.', tone: 'professional', ctr: 4.2, responseRate: 2.4, significance: 87, sends: 850 },
  { id: 'B', content: 'Hey! Great news - you just won $500 🎉 Tap here to grab your prize from Vottery!', tone: 'friendly', ctr: 5.8, responseRate: 3.2, significance: 92, sends: 820 },
  { id: 'C', content: 'URGENT: Your $500 Vottery prize expires in 24hrs! Claim NOW before it\'s gone!', tone: 'urgent', ctr: 3.9, responseRate: 2.1, significance: 74, sends: 780 }
];

const OpenAISMSOptimizationStudio = () => {
  const [activeTab, setActiveTab] = useState('optimize');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [inputMessage, setInputMessage] = useState('Congratulations! You have won a prize in the Vottery election. Please click the link to claim your reward before the deadline.');
  const [optimizedMessage, setOptimizedMessage] = useState('');
  const [variants, setVariants] = useState(INITIAL_VARIANTS);
  const [engagementData, setEngagementData] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4.1', false);

  useEffect(() => {
    if (error) toast?.error(error?.message || 'Optimization failed');
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      // Extract the optimized message from AI response
      const lines = response?.split('\n')?.filter(l => l?.trim());
      const msgLine = lines?.find(l => l?.startsWith('OPTIMIZED:') || l?.startsWith('Message:'));
      const optimized = msgLine
        ? msgLine?.replace(/^(OPTIMIZED:|Message:)\s*/i, '')?.trim()
        : lines?.[0]?.trim() || response?.trim();

      setOptimizedMessage(optimized?.substring(0, 200));
      setIsOptimizing(false);

      // Simulate engagement improvement data
      setEngagementData({
        originalCTR: 3.2,
        optimizedCTR: 5.4,
        originalResponseRate: 1.8,
        optimizedResponseRate: 3.1,
        optimizationScore: 88
      });

      toast?.success('Message optimized successfully!');
    }
  }, [response, isLoading]);

  const handleOptimize = useCallback((message) => {
    if (!message?.trim()) return;
    setIsOptimizing(true);
    setOptimizedMessage('');

    const systemPrompt = `You are an expert SMS content optimizer. Your task is to optimize SMS messages for maximum engagement.
Rules:
1. Keep the message under 160 characters
2. Apply the specified tone: ${selectedTone}
3. Maintain the core message intent
4. Use clear, action-oriented language
5. Include a clear CTA when appropriate

Respond with ONLY the optimized message prefixed with "OPTIMIZED: "`;

    sendMessage([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Optimize this SMS message with ${selectedTone} tone:\n\n"${message}"` }
    ], { max_completion_tokens: 200 });
  }, [selectedTone, sendMessage]);

  const handleGenerateVariants = useCallback(() => {
    if (!inputMessage?.trim()) return;
    setIsOptimizing(true);

    const systemPrompt = `You are an SMS A/B testing expert. Generate 3 variants of the given SMS message with different tones.
Format your response as:
VARIANT_A (professional): [message]
VARIANT_B (friendly): [message]
VARIANT_C (urgent): [message]

Each message must be under 160 characters.`;

    sendMessage([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate 3 A/B test variants for:\n\n"${inputMessage}"` }
    ], { max_completion_tokens: 400 });
  }, [inputMessage, sendMessage]);

  const tabs = [
    { id: 'optimize', label: 'Optimize', icon: 'Sparkles' },
    { id: 'ab-testing', label: 'A/B Testing', icon: 'GitBranch' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart2' },
    { id: 'preview', label: 'Preview', icon: 'Eye' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>OpenAI SMS Optimization Studio | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 ml-64 mt-16 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="Sparkles" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">OpenAI SMS Optimization Studio</h1>
                  <p className="text-gray-400 text-sm mt-0.5">AI-powered SMS content optimization with A/B testing & engagement analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">GPT-4.1 Active</span>
                </div>
                <Button variant="outline" size="sm">
                  <Icon name="Download" size={14} className="mr-1.5" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Templates Active', value: '3', icon: 'FileText', color: 'blue' },
                { label: 'Variants Tested', value: '12', icon: 'GitBranch', color: 'purple' },
                { label: 'Avg CTR Improvement', value: '+38%', icon: 'TrendingUp', color: 'green' },
                { label: 'Messages Optimized', value: '1,247', icon: 'MessageSquare', color: 'orange' }
              ]?.map(stat => (
                <div key={stat?.label} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={stat?.icon} size={14} className={`text-${stat?.color}-400`} />
                    <span className="text-gray-400 text-xs">{stat?.label}</span>
                  </div>
                  <div className={`text-xl font-bold text-${stat?.color}-400`}>{stat?.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-700 rounded-xl p-1 w-fit">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab?.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon name={tab?.icon} size={14} />
                {tab?.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'optimize' && (
            <div className="grid grid-cols-12 gap-6">
              {/* Left: Config + Input */}
              <div className="col-span-4 space-y-6">
                <TemplateConfigPanel
                  onTemplateChange={setSelectedTemplate}
                  selectedTone={selectedTone}
                  onToneChange={setSelectedTone}
                />
                {/* Message Input */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 block">Input Message</label>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e?.target?.value)}
                    rows={4}
                    placeholder="Enter the SMS message to optimize..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => handleOptimize(inputMessage)}
                    disabled={isLoading || !inputMessage?.trim()}
                    className="w-full mt-3"
                  >
                    {isLoading ? (
                      <><Icon name="Loader" size={14} className="mr-2 animate-spin" />Optimizing...</>
                    ) : (
                      <><Icon name="Sparkles" size={14} className="mr-2" />Optimize with OpenAI</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Middle: Character Engine + Before/After */}
              <div className="col-span-4 space-y-6">
                <CharacterOptimizationEngine
                  originalMessage={inputMessage}
                  optimizedMessage={optimizedMessage}
                  isLoading={isLoading}
                  onOptimize={handleOptimize}
                />
                <BeforeAfterComparison
                  original={inputMessage}
                  optimized={optimizedMessage}
                  engagementData={engagementData}
                  onCopyOptimized={(msg) => {
                    navigator.clipboard?.writeText(msg);
                    toast?.success('Copied to clipboard!');
                  }}
                />
              </div>

              {/* Right: Preview */}
              <div className="col-span-4">
                <OptimizationPreviewPanel
                  optimizedMessage={optimizedMessage}
                  tone={selectedTone}
                  template={selectedTemplate}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {activeTab === 'ab-testing' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Generate Test Variants</h3>
                    <Button onClick={handleGenerateVariants} disabled={isLoading || !inputMessage?.trim()} size="sm">
                      <Icon name="Sparkles" size={14} className="mr-1.5" />
                      {isLoading ? 'Generating...' : 'Generate with AI'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {variants?.map(variant => (
                      <div key={variant?.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium text-sm">Variant {variant?.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            variant?.tone === 'professional' ? 'bg-blue-500/20 text-blue-400' :
                            variant?.tone === 'friendly' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>{variant?.tone}</span>
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed mb-3">{variant?.content}</p>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-gray-700 rounded p-2">
                            <div className="text-blue-400 font-bold text-sm">{variant?.ctr}%</div>
                            <div className="text-gray-500 text-xs">CTR</div>
                          </div>
                          <div className="bg-gray-700 rounded p-2">
                            <div className="text-green-400 font-bold text-sm">{variant?.responseRate}%</div>
                            <div className="text-gray-500 text-xs">Response</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">Significance</span>
                            <span className={variant?.significance >= 90 ? 'text-green-400' : 'text-yellow-400'}>{variant?.significance}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${variant?.significance}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <ABTestingPanel 
                  variants={variants} 
                  isOptimizing={isLoading}
                  onVariantUpdate={(updatedVariants) => setVariants(updatedVariants)}
                />
              </div>
              <div className="col-span-4">
                <EngagementMetricsPanel variants={variants} />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <EngagementMetricsPanel variants={variants} />
              </div>
              <div className="col-span-4 space-y-6">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Optimization Effectiveness</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Character Efficiency', value: 94, color: 'green' },
                      { label: 'Tone Consistency', value: 87, color: 'blue' },
                      { label: 'CTA Clarity', value: 91, color: 'purple' },
                      { label: 'Personalization', value: 78, color: 'orange' }
                    ]?.map(metric => (
                      <div key={metric?.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-gray-400 text-sm">{metric?.label}</span>
                          <span className={`text-${metric?.color}-400 text-sm font-medium`}>{metric?.value}/100</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`bg-${metric?.color}-500 h-2 rounded-full`}
                            style={{ width: `${metric?.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <BeforeAfterComparison
                  original={inputMessage}
                  optimized={optimizedMessage}
                  engagementData={engagementData}
                  onCopyOptimized={(msg) => {
                    navigator.clipboard?.writeText(msg);
                    toast?.success('Copied to clipboard!');
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <OptimizationPreviewPanel
                  optimizedMessage={optimizedMessage}
                  tone={selectedTone}
                  template={selectedTemplate}
                  isLoading={isLoading}
                />
              </div>
              <div className="col-span-8">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Multi-Tone Preview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['professional', 'friendly', 'urgent']?.map(tone => (
                      <div key={tone} className="space-y-3">
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            tone === 'professional' ? 'bg-blue-500/20 text-blue-400' :
                            tone === 'friendly' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>{tone}</span>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-gray-300 text-xs leading-relaxed">
                            {variants?.find(v => v?.tone === tone)?.content || 'No variant available'}
                          </p>
                          <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-2 text-center">
                            <div>
                              <div className="text-blue-400 text-sm font-bold">{variants?.find(v => v?.tone === tone)?.ctr || 0}%</div>
                              <div className="text-gray-500 text-xs">CTR</div>
                            </div>
                            <div>
                              <div className="text-green-400 text-sm font-bold">{variants?.find(v => v?.tone === tone)?.responseRate || 0}%</div>
                              <div className="text-gray-500 text-xs">Response</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OpenAISMSOptimizationStudio;
