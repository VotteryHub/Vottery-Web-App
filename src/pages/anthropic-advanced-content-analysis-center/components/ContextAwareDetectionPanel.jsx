import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContextAwareDetectionPanel = ({ onAnalyze, analyzing, result, expanded = false }) => {
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');
  const [culturalContext, setCulturalContext] = useState('');

  const handleAnalyze = async () => {
    if (!content?.trim()) return;
    
    await onAnalyze?.({
      content: content?.trim(),
      context: context?.trim(),
      culturalContext: culturalContext?.trim()
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Context-Aware Hate Speech Detection
          </h2>
          <p className="text-sm text-muted-foreground">
            Claude's advanced reasoning for cultural context, sarcasm, and implicit bias
          </p>
        </div>
        <Icon name="ShieldAlert" size={24} className="text-destructive" />
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content to Analyze
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            placeholder="Enter content to analyze for hate speech..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Context (Optional)
            </label>
            <Input
              value={context}
              onChange={(e) => setContext(e?.target?.value)}
              placeholder="e.g., Political debate, comedy show"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cultural Context (Optional)
            </label>
            <Input
              value={culturalContext}
              onChange={(e) => setCulturalContext(e?.target?.value)}
              placeholder="e.g., US, UK, India"
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={analyzing || !content?.trim()}
          className="w-full"
        >
          {analyzing ? (
            <>
              <Icon name="Loader" size={18} className="mr-2 animate-spin" />
              Analyzing with Claude...
            </>
          ) : (
            <>
              <Icon name="Brain" size={18} className="mr-2" />
              Analyze Content
            </>
          )}
        </Button>
      </div>

      {result && result?.isHateSpeech !== undefined && (
        <div className={`p-4 rounded-lg border ${
          result?.isHateSpeech ? 'bg-destructive/10 border-destructive' : 'bg-success/10 border-success'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                name={result?.isHateSpeech ? 'AlertTriangle' : 'CheckCircle'}
                size={20}
                className={result?.isHateSpeech ? 'text-destructive' : 'text-success'}
              />
              <h3 className="font-semibold text-foreground">
                {result?.isHateSpeech ? 'Hate Speech Detected' : 'No Hate Speech Detected'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-lg font-semibold text-foreground">
                {result?.confidenceScore}%
              </p>
            </div>
          </div>

          {result?.hateSpeechType?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Detection Types:</p>
              <div className="flex flex-wrap gap-2">
                {result?.hateSpeechType?.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs font-medium bg-destructive/20 text-destructive"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result?.targetedGroups?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Targeted Groups:</p>
              <div className="flex flex-wrap gap-2">
                {result?.targetedGroups?.map((group, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs font-medium bg-muted text-foreground"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result?.culturalConsiderations && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Cultural Considerations:</p>
              <p className="text-sm text-muted-foreground">{result?.culturalConsiderations}</p>
            </div>
          )}

          {result?.reasoningChain?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Reasoning Chain:</p>
              <div className="space-y-2">
                {result?.reasoningChain?.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-primary mt-0.5">{index + 1}.</span>
                    <p className="text-sm text-muted-foreground flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Severity</p>
              <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                result?.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                result?.severity === 'high' ? 'bg-warning/20 text-warning' :
                result?.severity === 'medium'? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {result?.severity}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-muted text-foreground">
                {result?.recommendedAction}
              </span>
            </div>
          </div>

          {result?.explanation && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">Detailed Explanation:</p>
              <p className="text-sm text-muted-foreground">{result?.explanation}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-primary/10">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Detection Capabilities</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Explicit hate speech and slurs</li>
              <li>• Implicit bias and coded language</li>
              <li>• Sarcasm and irony detection</li>
              <li>• Cultural context interpretation</li>
              <li>• Dog whistles and euphemisms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextAwareDetectionPanel;