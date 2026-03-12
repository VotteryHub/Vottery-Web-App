import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ContentQualityPanel = () => {
  const [qualityData] = useState({
    qualityScores: [
      {
        id: 1,
        title: 'Community Development Proposal',
        qualityScore: 92.3,
        engagementPrediction: 87.6,
        discourseQuality: 94.1,
        optimizations: [
          'Add more specific data points to strengthen arguments',
          'Include diverse perspectives for balanced discussion',
          'Clarify call-to-action for community participation'
        ]
      },
      {
        id: 2,
        title: 'Tech Innovation Discussion',
        qualityScore: 78.4,
        engagementPrediction: 72.3,
        discourseQuality: 81.2,
        optimizations: [
          'Reduce technical jargon for broader accessibility',
          'Add real-world examples to illustrate concepts',
          'Encourage constructive debate with open-ended questions'
        ]
      }
    ],
    qualityMetrics: {
      avgQualityScore: 85.4,
      highQualityContent: 67.8,
      needsImprovement: 23.4,
      lowQuality: 8.8
    }
  });

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Content Quality Intelligence
        </h2>
        <p className="text-sm text-muted-foreground">
          Automated content scoring and optimization recommendations for democratic discourse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Avg Quality Score</p>
          <p className="text-2xl font-bold text-foreground">{qualityData?.qualityMetrics?.avgQualityScore}%</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">High Quality</p>
          <p className="text-2xl font-bold text-success">{qualityData?.qualityMetrics?.highQualityContent}%</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Needs Improvement</p>
          <p className="text-2xl font-bold text-warning">{qualityData?.qualityMetrics?.needsImprovement}%</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Low Quality</p>
          <p className="text-2xl font-bold text-destructive">{qualityData?.qualityMetrics?.lowQuality}%</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Content Analysis & Recommendations</h3>
        {qualityData?.qualityScores?.map((content) => (
          <div key={content?.id} className="bg-card rounded-xl border border-border p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">{content?.title}</h4>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Quality Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(content?.qualityScore)}`}>
                  {content?.qualityScore}%
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Engagement Prediction</p>
                <p className={`text-2xl font-bold ${getScoreColor(content?.engagementPrediction)}`}>
                  {content?.engagementPrediction}%
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Discourse Quality</p>
                <p className={`text-2xl font-bold ${getScoreColor(content?.discourseQuality)}`}>
                  {content?.discourseQuality}%
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Lightbulb" size={16} className="text-primary" />
                Optimization Recommendations
              </p>
              <ul className="space-y-2">
                {content?.optimizations?.map((opt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentQualityPanel;