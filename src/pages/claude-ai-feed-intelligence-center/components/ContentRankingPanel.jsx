import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';



const ContentRankingPanel = () => {
  const [loading, setLoading] = useState(false);
  const [rankingData, setRankingData] = useState(null);
  const [selectedContent, setSelectedContent] = useState('all');

  useEffect(() => {
    loadRankingData();
  }, [selectedContent]);

  const loadRankingData = async () => {
    setLoading(true);
    try {
      const mockData = {
        rankedItems: [
          {
            id: 1,
            title: 'Presidential Election 2024',
            type: 'election',
            relevanceScore: 94.5,
            contextualScore: 92.3,
            engagementPrediction: 88.7,
            confidenceInterval: '±2.3%',
            reasoning: 'High user interest in political content, matches voting history patterns'
          },
          {
            id: 2,
            title: 'Best Tech Innovation',
            type: 'election',
            relevanceScore: 89.2,
            contextualScore: 87.6,
            engagementPrediction: 85.4,
            confidenceInterval: '±3.1%',
            reasoning: 'Strong correlation with user\'s technology preferences'
          },
          {
            id: 3,
            title: 'Community Development Initiative',
            type: 'post',
            relevanceScore: 86.8,
            contextualScore: 84.2,
            engagementPrediction: 82.9,
            confidenceInterval: '±2.8%',
            reasoning: 'Aligns with user\'s social engagement patterns'
          },
          {
            id: 4,
            title: 'Sponsored: Premium Brand Campaign',
            type: 'sponsored',
            relevanceScore: 78.4,
            contextualScore: 76.1,
            engagementPrediction: 74.3,
            confidenceInterval: '±4.2%',
            reasoning: 'Targeted based on demographic and interest matching'
          }
        ],
        algorithmWeights: {
          userBehavior: 35,
          contextualRelevance: 30,
          engagementLikelihood: 20,
          freshness: 10,
          diversity: 5
        },
        performanceMetrics: {
          avgRankingAccuracy: 92.5,
          userSatisfaction: 89.7,
          clickThroughRate: 76.3,
          timeOnContent: '4m 32s'
        }
      };
      setRankingData(mockData);
    } catch (error) {
      console.error('Error loading ranking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const contentTypes = [
    { value: 'all', label: 'All Content' },
    { value: 'elections', label: 'Elections' },
    { value: 'posts', label: 'Social Posts' },
    { value: 'sponsored', label: 'Sponsored' }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'election': return 'bg-primary/10 text-primary';
      case 'post': return 'bg-success/10 text-success';
      case 'sponsored': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Content Ranking Intelligence
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={selectedContent}
            onChange={(e) => setSelectedContent(e?.target?.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {contentTypes?.map(type => (
              <option key={type?.value} value={type?.value}>{type?.label}</option>
            ))}
          </select>
          <Button onClick={loadRankingData}>
            <Icon name="RefreshCw" size={16} />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Ranking Accuracy</p>
              <p className="text-2xl font-bold text-foreground">{rankingData?.performanceMetrics?.avgRankingAccuracy}%</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">User Satisfaction</p>
              <p className="text-2xl font-bold text-foreground">{rankingData?.performanceMetrics?.userSatisfaction}%</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Click-Through Rate</p>
              <p className="text-2xl font-bold text-foreground">{rankingData?.performanceMetrics?.clickThroughRate}%</p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Avg Time on Content</p>
              <p className="text-2xl font-bold text-foreground">{rankingData?.performanceMetrics?.timeOnContent}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Algorithm Weighting</h3>
            <div className="space-y-3">
              {Object.entries(rankingData?.algorithmWeights || {})?.map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground capitalize">
                      {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                    </span>
                    <span className="text-sm font-bold text-primary">{value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Ranked Content Items</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time ranking with contextual relevance scoring and confidence intervals
              </p>
            </div>
            <div className="divide-y divide-border">
              {rankingData?.rankedItems?.map((item, index) => (
                <div key={item?.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item?.title}</h4>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md mt-1 ${getTypeColor(item?.type)}`}>
                          {item?.type?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{item?.relevanceScore}%</p>
                      <p className="text-xs text-muted-foreground">Relevance Score</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Contextual Score</p>
                      <p className="text-sm font-semibold text-foreground">{item?.contextualScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Engagement Prediction</p>
                      <p className="text-sm font-semibold text-foreground">{item?.engagementPrediction}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Confidence Interval</p>
                      <p className="text-sm font-semibold text-foreground">{item?.confidenceInterval}</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Claude Reasoning:</p>
                    <p className="text-sm text-foreground">{item?.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentRankingPanel;