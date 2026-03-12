import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIDetectionEnginePanel = ({ modelPerformance, onScreenContent, loading }) => {
  const [testContent, setTestContent] = useState('');
  const [contentType, setContentType] = useState('election_description');
  const [screening, setScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState(null);

  const handleScreenTest = async () => {
    if (!testContent?.trim()) return;

    setScreening(true);
    setScreeningResult(null);

    const result = await onScreenContent({
      contentType,
      contentText: testContent,
      metadata: { source: 'manual_test' }
    });

    setScreening(false);
    if (result?.success) {
      setScreeningResult(result?.data);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const detectionModels = [
    {
      name: 'Misinformation Detector',
      type: 'misinformation',
      version: 'v2.3.1',
      accuracy: 94.2,
      confidence: 0.89,
      status: 'active',
      color: 'text-blue-500'
    },
    {
      name: 'Hate Speech Detector',
      type: 'hate_speech',
      version: 'v2.1.0',
      accuracy: 96.5,
      confidence: 0.94,
      status: 'active',
      color: 'text-red-500'
    },
    {
      name: 'Spam Filter',
      type: 'spam',
      version: 'v3.0.2',
      accuracy: 98.1,
      confidence: 0.95,
      status: 'active',
      color: 'text-yellow-500'
    },
    {
      name: 'Election Interference Detector',
      type: 'election_interference',
      version: 'v1.8.5',
      accuracy: 92.3,
      confidence: 0.88,
      status: 'active',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} />
          ML Detection Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detectionModels?.map((model, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Cpu" className={model?.color} size={20} />
                  <span className="font-medium text-foreground">{model?.name}</span>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500 rounded">
                  {model?.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium text-foreground">{model?.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-medium text-foreground">{model?.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium text-foreground">{(model?.confidence * 100)?.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TestTube" size={20} />
          Test Content Screening
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e?.target?.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="election_description">Election Description</option>
              <option value="campaign_content">Campaign Content</option>
              <option value="user_comment">User Comment</option>
              <option value="election_question">Election Question</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content to Screen
            </label>
            <textarea
              value={testContent}
              onChange={(e) => setTestContent(e?.target?.value)}
              placeholder="Enter content to test AI screening..."
              rows={6}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <Button
            onClick={handleScreenTest}
            disabled={!testContent?.trim() || screening}
            className="w-full"
          >
            {screening ? (
              <>
                <Icon name="Loader2" className="animate-spin" size={16} />
                Screening Content...
              </>
            ) : (
              <>
                <Icon name="Shield" size={16} />
                Screen Content
              </>
            )}
          </Button>
        </div>

        {screeningResult && (
          <div className="mt-6 p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                name={screeningResult?.screeningStatus === 'approved' ? 'CheckCircle' : screeningResult?.screeningStatus === 'blocked' ? 'XCircle' : 'Flag'}
                className={screeningResult?.screeningStatus === 'approved' ? 'text-green-500' : screeningResult?.screeningStatus === 'blocked' ? 'text-red-500' : 'text-yellow-500'}
                size={20}
              />
              <span className="font-semibold text-foreground">
                Status: {screeningResult?.screeningStatus?.replace('_', ' ')?.toUpperCase()}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence Score</span>
                <span className="font-medium text-foreground">{screeningResult?.aiConfidenceScore}%</span>
              </div>
              {screeningResult?.detectedViolations?.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Detected Violations:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {screeningResult?.detectedViolations?.map((violation, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-red-500/10 text-red-500 rounded">
                        {violation}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">AI Reasoning:</span>
                <p className="mt-1 text-foreground">{screeningResult?.aiReasoning}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDetectionEnginePanel;