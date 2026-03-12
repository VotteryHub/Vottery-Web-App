import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MisinformationAnalysisPanel = ({ onAnalyze, analyzing, result, expanded = false }) => {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('election_content');
  const [electionContext, setElectionContext] = useState('');

  const handleAnalyze = async () => {
    if (!content?.trim()) return;
    
    await onAnalyze?.({
      content: content?.trim(),
      contentType,
      electionContext: electionContext?.trim()
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Misinformation Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Fact-checking with source credibility and narrative manipulation detection
          </p>
        </div>
        <Icon name="AlertTriangle" size={24} className="text-warning" />
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content to Analyze
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            placeholder="Enter content to analyze for misinformation..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e?.target?.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="election_content">Election Content</option>
              <option value="news_article">News Article</option>
              <option value="social_post">Social Post</option>
              <option value="campaign_material">Campaign Material</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Election Context (Optional)
            </label>
            <Input
              value={electionContext}
              onChange={(e) => setElectionContext(e?.target?.value)}
              placeholder="e.g., 2024 Presidential Election"
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
              Analyze for Misinformation
            </>
          )}
        </Button>
      </div>

      {result && result?.isMisinformation !== undefined && (
        <div className={`p-4 rounded-lg border ${
          result?.isMisinformation ? 'bg-warning/10 border-warning' : 'bg-success/10 border-success'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                name={result?.isMisinformation ? 'AlertTriangle' : 'CheckCircle'}
                size={20}
                className={result?.isMisinformation ? 'text-warning' : 'text-success'}
              />
              <h3 className="font-semibold text-foreground">
                {result?.isMisinformation ? 'Misinformation Detected' : 'No Misinformation Detected'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-lg font-semibold text-foreground">
                {result?.confidenceScore}%
              </p>
            </div>
          </div>

          {result?.misinformationType?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Misinformation Types:</p>
              <div className="flex flex-wrap gap-2">
                {result?.misinformationType?.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs font-medium bg-warning/20 text-warning"
                  >
                    {type?.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result?.sourceCredibility !== undefined && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Source Credibility:</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      result?.sourceCredibility >= 70 ? 'bg-success' :
                      result?.sourceCredibility >= 40 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${result?.sourceCredibility}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {result?.sourceCredibility}%
                </span>
              </div>
            </div>
          )}

          {result?.factCheckResults?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Fact Check Results:</p>
              <div className="space-y-2">
                {result?.factCheckResults?.map((check, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-start gap-2">
                      <Icon
                        name={check?.verified ? 'CheckCircle' : 'XCircle'}
                        size={16}
                        className={check?.verified ? 'text-success mt-0.5' : 'text-destructive mt-0.5'}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium">{check?.claim}</p>
                        <p className="text-xs text-muted-foreground mt-1">{check?.verification}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result?.narrativeManipulation && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Narrative Manipulation:</p>
              <p className="text-sm text-muted-foreground">{result?.narrativeManipulation}</p>
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
                result?.severity === 'high'? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
              }`}>
                {result?.severity}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-muted text-foreground">
                {result?.recommendedAction?.replace('_', ' ')}
              </span>
            </div>
          </div>

          {result?.suggestedCorrection && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">Suggested Correction:</p>
              <p className="text-sm text-muted-foreground">{result?.suggestedCorrection}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-primary/10">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Analysis Capabilities</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Factual accuracy verification</li>
              <li>• Source credibility assessment</li>
              <li>• Narrative manipulation detection</li>
              <li>• Deepfake and synthetic media indicators</li>
              <li>• Election interference patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisinformationAnalysisPanel;