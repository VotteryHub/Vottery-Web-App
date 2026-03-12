import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PolicyViolationPanel = () => {
  const [violations] = useState([
    {
      id: 1,
      content: 'Hate speech targeting specific community',
      policyType: 'Hate Speech',
      isPolicyViolation: true,
      confidenceScore: 96.3,
      violationType: ['explicit_hate', 'targeted_harassment'],
      edgeCaseComplexity: 15,
      humanReviewRequired: false,
      severity: 'critical',
      recommendedAction: 'block',
      contextualFactors: ['Clear intent to harm', 'Repeated pattern', 'Multiple reports'],
      reasoningChain: [
        'Content contains explicit slurs targeting protected group',
        'Intent analysis shows deliberate harassment',
        'User history shows pattern of similar violations',
        'Community standards clearly prohibit this content'
      ],
      precedentCases: [
        'Similar case #4521 - Blocked',
        'Similar case #3892 - Permanent ban'
      ]
    },
    {
      id: 2,
      content: 'Political satire using strong language',
      policyType: 'Offensive Content',
      isPolicyViolation: false,
      confidenceScore: 78.4,
      violationType: [],
      edgeCaseComplexity: 72,
      humanReviewRequired: true,
      severity: 'low',
      recommendedAction: 'review',
      contextualFactors: ['Satirical intent', 'Political commentary', 'Cultural context'],
      reasoningChain: [
        'Content uses strong language but in satirical context',
        'Political commentary protected under free speech',
        'No direct targeting of individuals',
        'Cultural context suggests acceptable discourse',
        'Edge case requires human judgment on satire boundaries'
      ],
      precedentCases: [
        'Similar case #5621 - Allowed with warning',
        'Similar case #4892 - Human review upheld'
      ]
    }
  ]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-destructive/10 text-destructive';
      case 'high': return 'bg-warning/10 text-warning';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'low': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-success/10 text-success';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Policy Violation Assessment
        </h2>
        <Button>
          <Icon name="Settings" size={16} />
          Configure Policies
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Assessment Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <Icon name="Shield" size={24} className="text-primary mb-2" />
            <p className="font-semibold text-foreground mb-1">Nuanced Interpretation</p>
            <p className="text-xs text-muted-foreground">Context-aware policy enforcement considering cultural and situational factors</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <Icon name="Eye" size={24} className="text-primary mb-2" />
            <p className="font-semibold text-foreground mb-1">Implicit Bias Detection</p>
            <p className="text-xs text-muted-foreground">Identifies subtle discrimination and coded language beyond explicit violations</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg">
            <Icon name="GitBranch" size={24} className="text-primary mb-2" />
            <p className="font-semibold text-foreground mb-1">Edge Case Analysis</p>
            <p className="text-xs text-muted-foreground">Sophisticated handling of ambiguous cases requiring human judgment</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Assessments</h3>
        {violations?.map((violation) => (
          <div key={violation?.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-md ${getSeverityColor(violation?.severity)}`}>
                      {violation?.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-1 bg-muted text-foreground rounded-md">
                      {violation?.policyType}
                    </span>
                    {violation?.humanReviewRequired && (
                      <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-md flex items-center gap-1">
                        <Icon name="Users" size={12} />
                        Human Review Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground font-medium mb-2">{violation?.content}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-primary">{violation?.confidenceScore}%</p>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Violation Status</p>
                  <p className={`text-sm font-bold ${
                    violation?.isPolicyViolation ? 'text-destructive' : 'text-success'
                  }`}>
                    {violation?.isPolicyViolation ? 'Violation' : 'No Violation'}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Edge Case Complexity</p>
                  <p className="text-sm font-bold text-foreground">{violation?.edgeCaseComplexity}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Violation Types</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {violation?.violationType?.length > 0 ? (
                      violation?.violationType?.slice(0, 2)?.map((type, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-md">
                          {type?.replace('_', ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-success">None</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-md ${
                    violation?.recommendedAction === 'block' ? 'bg-destructive text-white' :
                    violation?.recommendedAction === 'warn' ? 'bg-warning text-white' :
                    violation?.recommendedAction === 'review'? 'bg-blue-500 text-white' : 'bg-success text-white'
                  }`}>
                    {violation?.recommendedAction?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="Info" size={16} className="text-primary" />
                  Contextual Factors
                </p>
                <div className="flex flex-wrap gap-2">
                  {violation?.contextualFactors?.map((factor, i) => (
                    <span key={i} className="px-3 py-1 text-xs bg-background rounded-md text-foreground">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Icon name="Brain" size={16} className="text-primary" />
                  Claude Reasoning Chain
                </p>
                <ul className="space-y-2">
                  {violation?.reasoningChain?.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-500/5 rounded-lg p-4">
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={16} className="text-blue-600" />
                  Precedent Cases
                </p>
                <div className="space-y-1">
                  {violation?.precedentCases?.map((precedent, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{precedent}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyViolationPanel;