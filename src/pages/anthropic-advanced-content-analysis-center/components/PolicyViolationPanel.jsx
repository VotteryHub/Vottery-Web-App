import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PolicyViolationPanel = ({ onAnalyze, analyzing, result }) => {
  const [content, setContent] = useState('');
  const [policyType, setPolicyType] = useState('prohibited_content');
  const [edgeCaseScenario, setEdgeCaseScenario] = useState('');

  const handleAnalyze = async () => {
    if (!content?.trim()) return;
    
    await onAnalyze?.({
      content: content?.trim(),
      policyType,
      edgeCaseScenario: edgeCaseScenario?.trim()
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Policy Violation Assessment
          </h2>
          <p className="text-sm text-muted-foreground">
            Nuanced rule interpretation with edge case analysis and contextual decision-making
          </p>
        </div>
        <Icon name="FileText" size={24} className="text-primary" />
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content to Analyze
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            placeholder="Enter content to analyze for policy violations..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Policy Type
            </label>
            <select
              value={policyType}
              onChange={(e) => setPolicyType(e?.target?.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="prohibited_content">Prohibited Content</option>
              <option value="restricted_keywords">Restricted Keywords</option>
              <option value="hate_speech">Hate Speech</option>
              <option value="misinformation">Misinformation</option>
              <option value="spam">Spam</option>
              <option value="violence">Violence</option>
              <option value="adult_content">Adult Content</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Edge Case Scenario (Optional)
            </label>
            <Input
              value={edgeCaseScenario}
              onChange={(e) => setEdgeCaseScenario(e?.target?.value)}
              placeholder="Describe edge case context"
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
              Assess Policy Violation
            </>
          )}
        </Button>
      </div>

      {result && result?.isPolicyViolation !== undefined && (
        <div className={`p-4 rounded-lg border ${
          result?.isPolicyViolation ? 'bg-destructive/10 border-destructive' : 'bg-success/10 border-success'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                name={result?.isPolicyViolation ? 'XCircle' : 'CheckCircle'}
                size={20}
                className={result?.isPolicyViolation ? 'text-destructive' : 'text-success'}
              />
              <h3 className="font-semibold text-foreground">
                {result?.isPolicyViolation ? 'Policy Violation Detected' : 'No Policy Violation'}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-lg font-semibold text-foreground">
                {result?.confidenceScore}%
              </p>
            </div>
          </div>

          {result?.edgeCaseComplexity !== undefined && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Edge Case Complexity:</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      result?.edgeCaseComplexity >= 70 ? 'bg-destructive' :
                      result?.edgeCaseComplexity >= 40 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${result?.edgeCaseComplexity}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {result?.edgeCaseComplexity}%
                </span>
              </div>
            </div>
          )}

          {result?.humanReviewRequired && (
            <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={18} className="text-warning" />
                <p className="text-sm font-medium text-warning">
                  Human Review Required - Complex edge case detected
                </p>
              </div>
            </div>
          )}

          {result?.violationType?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Violation Types:</p>
              <div className="flex flex-wrap gap-2">
                {result?.violationType?.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs font-medium bg-destructive/20 text-destructive"
                  >
                    {type?.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result?.contextualFactors?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Contextual Factors:</p>
              <ul className="space-y-1">
                {result?.contextualFactors?.map((factor, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Icon name="ChevronRight" size={14} className="mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
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
            <h4 className="font-medium text-foreground mb-1">Assessment Capabilities</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Nuanced rule interpretation</li>
              <li>• Edge case analysis</li>
              <li>• Contextual decision-making</li>
              <li>• Intent vs. impact analysis</li>
              <li>• Precedent-based decisions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyViolationPanel;