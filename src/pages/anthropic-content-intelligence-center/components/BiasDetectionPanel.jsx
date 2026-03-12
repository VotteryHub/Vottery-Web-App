import React from 'react';
import Icon from '../../../components/AppIcon';

const BiasDetectionPanel = () => {
  const biasData = {
    detectedBiases: [
      {
        type: 'Gender Bias',
        instances: 23,
        severity: 'Medium',
        examples: ['Gendered language in job descriptions', 'Stereotypical role assignments']
      },
      {
        type: 'Confirmation Bias',
        instances: 45,
        severity: 'Low',
        examples: ['Echo chamber content', 'One-sided arguments']
      },
      {
        type: 'Cultural Bias',
        instances: 12,
        severity: 'High',
        examples: ['Western-centric perspectives', 'Cultural assumptions']
      }
    ],
    improvementMetrics: {
      biasReduction: '+34.2%',
      diversityScore: 82.3,
      inclusivityRating: 88.7
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'bg-destructive/10 text-destructive';
      case 'Medium': return 'bg-warning/10 text-warning';
      default: return 'bg-blue-500/10 text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          AI Bias Detection & Mitigation
        </h2>
        <p className="text-sm text-muted-foreground">
          Continuous monitoring and improvement based on appeal outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Bias Reduction</p>
          <p className="text-2xl font-bold text-success">{biasData?.improvementMetrics?.biasReduction}</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Diversity Score</p>
          <p className="text-2xl font-bold text-foreground">{biasData?.improvementMetrics?.diversityScore}%</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-1">Inclusivity Rating</p>
          <p className="text-2xl font-bold text-foreground">{biasData?.improvementMetrics?.inclusivityRating}%</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detected Bias Patterns</h3>
        <div className="space-y-4">
          {biasData?.detectedBiases?.map((bias, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{bias?.type}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-md ${getSeverityColor(bias?.severity)}`}>
                    {bias?.severity} Severity
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">
                    {bias?.instances} instances
                  </span>
                </div>
              </div>
              <div className="bg-background/50 rounded p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Examples:</p>
                <ul className="space-y-1">
                  {bias?.examples?.map((example, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <Icon name="ChevronRight" size={14} className="text-primary mt-1 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-primary mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Continuous Improvement</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Claude AI learns from human moderator decisions and appeal outcomes to continuously improve bias detection 
              and reduce false positives. The system adapts to cultural context and evolving community standards while 
              maintaining fairness and transparency in content moderation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiasDetectionPanel;