import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const MisinformationDetectionPanel = () => {
  const [loading, setLoading] = useState(false);
  const [detectionData, setDetectionData] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    loadDetectionData();
  }, []);

  const loadDetectionData = async () => {
    setLoading(true);
    try {
      const mockData = {
        recentDetections: [
          {
            id: 1,
            content: 'Election results show 150% voter turnout in District 5',
            contentType: 'post',
            isMisinformation: true,
            confidenceScore: 97.8,
            misinformationType: ['false_claim', 'misleading_statistics'],
            sourceCredibility: 12.3,
            severity: 'critical',
            recommendedAction: 'block',
            factCheckResults: [
              { claim: '150% voter turnout', status: 'False', evidence: 'Official records show 67.3% turnout' },
              { claim: 'District 5 results', status: 'Misleading', evidence: 'Data misrepresented from preliminary counts' }
            ],
            reasoningChain: [
              'Mathematical impossibility detected (>100% turnout)',
              'Cross-referenced with official election commission data',
              'Source has history of spreading misinformation',
              'No credible sources support this claim'
            ]
          },
          {
            id: 2,
            content: 'New study suggests climate change may affect voting patterns',
            contentType: 'article',
            isMisinformation: false,
            confidenceScore: 89.2,
            misinformationType: [],
            sourceCredibility: 87.6,
            severity: 'none',
            recommendedAction: 'allow',
            factCheckResults: [
              { claim: 'Climate change affects voting', status: 'Supported', evidence: 'Multiple peer-reviewed studies confirm correlation' }
            ],
            reasoningChain: [
              'Claim supported by peer-reviewed research',
              'Source is credible academic institution',
              'Appropriate hedging language used ("may affect")',
              'No misleading framing detected'
            ]
          }
        ],
        detectionMetrics: {
          totalScanned: 45892,
          misinformationDetected: 1234,
          avgProcessingTime: '1.2s',
          accuracyRate: 94.7
        },
        narrativeAnalysis: {
          coordinatedCampaigns: 12,
          deepfakeIndicators: 3,
          manipulatedMedia: 45,
          conspiracyTheories: 23
        }
      };
      setDetectionData(mockData);
    } catch (error) {
      console.error('Error loading detection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-destructive/10 text-destructive';
      case 'high': return 'bg-warning/10 text-warning';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'low': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-success/10 text-success';
    }
  };

  const getActionColor = (action) => {
    switch(action) {
      case 'block': return 'bg-destructive text-white';
      case 'fact_check_label': return 'bg-warning text-white';
      case 'review': return 'bg-blue-500 text-white';
      default: return 'bg-success text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Advanced Misinformation Detection Engine
        </h2>
        <Button onClick={loadDetectionData}>
          <Icon name="RefreshCw" size={16} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Scanned</p>
              <p className="text-2xl font-bold text-foreground">{detectionData?.detectionMetrics?.totalScanned?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Misinformation Detected</p>
              <p className="text-2xl font-bold text-destructive">{detectionData?.detectionMetrics?.misinformationDetected?.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Avg Processing Time</p>
              <p className="text-2xl font-bold text-foreground">{detectionData?.detectionMetrics?.avgProcessingTime}</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Accuracy Rate</p>
              <p className="text-2xl font-bold text-success">{detectionData?.detectionMetrics?.accuracyRate}%</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Narrative Manipulation Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-destructive/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Coordinated Campaigns</p>
                <p className="text-xl font-bold text-destructive">{detectionData?.narrativeAnalysis?.coordinatedCampaigns}</p>
              </div>
              <div className="p-3 bg-warning/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Deepfake Indicators</p>
                <p className="text-xl font-bold text-warning">{detectionData?.narrativeAnalysis?.deepfakeIndicators}</p>
              </div>
              <div className="p-3 bg-yellow-500/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Manipulated Media</p>
                <p className="text-xl font-bold text-yellow-600">{detectionData?.narrativeAnalysis?.manipulatedMedia}</p>
              </div>
              <div className="p-3 bg-blue-500/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Conspiracy Theories</p>
                <p className="text-xl font-bold text-blue-600">{detectionData?.narrativeAnalysis?.conspiracyTheories}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Detections</h3>
            {detectionData?.recentDetections?.map((detection) => (
              <div key={detection?.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-md ${getSeverityColor(detection?.severity)}`}>
                          {detection?.severity?.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 bg-muted text-foreground rounded-md">
                          {detection?.contentType?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-medium mb-2">{detection?.content}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary">{detection?.confidenceScore}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Source Credibility</p>
                      <p className="text-lg font-bold text-foreground">{detection?.sourceCredibility}%</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Misinformation Type</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {detection?.misinformationType?.length > 0 ? (
                          detection?.misinformationType?.map((type, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-md">
                              {type?.replace('_', ' ')}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-success">None detected</span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-md ${getActionColor(detection?.recommendedAction)}`}>
                        {detection?.recommendedAction?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {detection?.factCheckResults?.length > 0 && (
                    <div className="bg-primary/5 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Icon name="CheckCircle" size={16} className="text-primary" />
                        Fact-Check Results
                      </p>
                      <div className="space-y-2">
                        {detection?.factCheckResults?.map((result, i) => (
                          <div key={i} className="flex items-start gap-3 p-2 bg-background/50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{result?.claim}</p>
                              <p className="text-xs text-muted-foreground mt-1">{result?.evidence}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                              result?.status === 'False' ? 'bg-destructive/10 text-destructive' :
                              result?.status === 'Misleading'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                            }`}>
                              {result?.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="Brain" size={16} className="text-primary" />
                      Claude Reasoning Chain
                    </p>
                    <ul className="space-y-2">
                      {detection?.reasoningChain?.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MisinformationDetectionPanel;