import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AdvancedOptions = ({ formData, onChange, errors }) => {
  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Visible to all platform users' },
    { value: 'targeted', label: 'Targeted Only', description: 'Only shown to specified audience segments' },
    { value: 'private', label: 'Private', description: 'Accessible only via direct link' }
  ];

  const abTestVariants = [
    { value: 'none', label: 'No A/B Testing' },
    { value: 'title', label: 'Test Campaign Titles' },
    { value: 'media', label: 'Test Cover Images' },
    { value: 'questions', label: 'Test Question Wording' },
    { value: 'full', label: 'Full Campaign Variants' }
  ];

  const analyticsFrequency = [
    { value: 'realtime', label: 'Real-time Updates' },
    { value: 'hourly', label: 'Hourly Reports' },
    { value: 'daily', label: 'Daily Summaries' },
    { value: 'weekly', label: 'Weekly Digests' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Advanced Options</h3>
          <p className="text-sm text-muted-foreground">Fine-tune campaign behavior and tracking</p>
        </div>
      </div>
      <Select
        label="Campaign Visibility"
        description="Control who can discover your sponsored election"
        required
        options={visibilityOptions}
        value={formData?.visibility}
        onChange={(value) => onChange('visibility', value)}
        error={errors?.visibility}
      />
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-heading font-semibold text-foreground mb-3">A/B Testing Configuration</h4>
          <p className="text-sm text-muted-foreground mb-4">Test different campaign variations to optimize performance</p>
        </div>

        <Select
          label="Test Type"
          description="Choose what elements to test"
          options={abTestVariants}
          value={formData?.abTestType}
          onChange={(value) => onChange('abTestType', value)}
        />

        {formData?.abTestType !== 'none' && (
          <div className="ml-6 space-y-4 pl-4 border-l-2 border-secondary/20">
            <Input
              label="Traffic Split Percentage"
              type="number"
              placeholder="50"
              description="Percentage of audience for variant A (remainder goes to variant B)"
              value={formData?.trafficSplit}
              onChange={(e) => onChange('trafficSplit', e?.target?.value)}
            />

            <Input
              label="Minimum Sample Size"
              type="number"
              placeholder="1000"
              description="Minimum participants before declaring a winner"
              value={formData?.minSampleSize}
              onChange={(e) => onChange('minSampleSize', e?.target?.value)}
            />

            <Checkbox
              label="Auto-optimize after statistical significance"
              description="Automatically allocate more traffic to winning variant"
              checked={formData?.autoOptimize}
              onChange={(e) => onChange('autoOptimize', e?.target?.checked)}
            />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-heading font-semibold text-foreground mb-3">Performance Tracking</h4>
          <p className="text-sm text-muted-foreground mb-4">Configure analytics and reporting preferences</p>
        </div>

        <Select
          label="Analytics Update Frequency"
          description="How often you'll receive performance updates"
          options={analyticsFrequency}
          value={formData?.analyticsFrequency}
          onChange={(value) => onChange('analyticsFrequency', value)}
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Tracking Metrics</label>
          <div className="space-y-2">
            <Checkbox
              label="Impression tracking"
              description="Track how many users see your sponsored election"
              checked={formData?.trackImpressions}
              onChange={(e) => onChange('trackImpressions', e?.target?.checked)}
            />
            <Checkbox
              label="Click-through rate (CTR)"
              description="Monitor engagement with campaign elements"
              checked={formData?.trackCTR}
              onChange={(e) => onChange('trackCTR', e?.target?.checked)}
            />
            <Checkbox
              label="Completion rate"
              description="Track percentage of users who complete voting"
              checked={formData?.trackCompletion}
              onChange={(e) => onChange('trackCompletion', e?.target?.checked)}
            />
            <Checkbox
              label="Share & viral metrics"
              description="Monitor social sharing and viral spread"
              checked={formData?.trackViral}
              onChange={(e) => onChange('trackViral', e?.target?.checked)}
            />
            <Checkbox
              label="Demographic breakdown"
              description="Analyze participation by age, gender, location"
              checked={formData?.trackDemographics}
              onChange={(e) => onChange('trackDemographics', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-heading font-semibold text-foreground mb-3">Campaign Behavior</h4>
          <p className="text-sm text-muted-foreground mb-4">Control how users interact with your election</p>
        </div>

        <div className="space-y-3">
          <Checkbox
            label="Allow vote changes"
            description="Participants can modify their votes before campaign ends"
            checked={formData?.allowVoteChanges}
            onChange={(e) => onChange('allowVoteChanges', e?.target?.checked)}
          />

          <Checkbox
            label="Show real-time results"
            description="Display live vote counts to participants"
            checked={formData?.showRealTimeResults}
            onChange={(e) => onChange('showRealTimeResults', e?.target?.checked)}
          />

          <Checkbox
            label="Enable social sharing"
            description="Allow participants to share on social media"
            checked={formData?.enableSharing}
            onChange={(e) => onChange('enableSharing', e?.target?.checked)}
          />

          <Checkbox
            label="Require email verification"
            description="Verify participant email addresses before voting"
            checked={formData?.requireEmailVerification}
            onChange={(e) => onChange('requireEmailVerification', e?.target?.checked)}
          />

          <Checkbox
            label="Limit to one vote per user"
            description="Prevent multiple votes from same account"
            checked={formData?.oneVotePerUser}
            onChange={(e) => onChange('oneVotePerUser', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-heading font-semibold text-foreground mb-3">Blockchain & Security</h4>
          <p className="text-sm text-muted-foreground mb-4">Configure cryptographic verification settings</p>
        </div>

        <div className="space-y-3">
          <Checkbox
            label="Enable blockchain audit trail"
            description="Store vote hashes on blockchain for transparency"
            checked={formData?.enableBlockchain}
            onChange={(e) => onChange('enableBlockchain', e?.target?.checked)}
          />

          <Checkbox
            label="Public verification portal"
            description="Allow anyone to verify vote integrity"
            checked={formData?.publicVerification}
            onChange={(e) => onChange('publicVerification', e?.target?.checked)}
          />

          <Checkbox
            label="Zero-knowledge proofs"
            description="Enable privacy-preserving vote verification"
            checked={formData?.enableZKP}
            onChange={(e) => onChange('enableZKP', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5" />
          <div className="space-y-3">
            <div>
              <h4 className="text-base font-heading font-semibold text-foreground">Security & Compliance</h4>
              <p className="text-sm text-muted-foreground">Your campaign will automatically include:</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span>End-to-end encryption for all vote data</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span>GDPR and CCPA compliance for data handling</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span>DDoS protection and rate limiting</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span>Automated fraud detection and prevention</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span>SHA-256 cryptographic hashing for vote integrity</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={18} className="text-warning mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Advanced Options Impact</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                <span>A/B testing requires 2x minimum budget for statistical validity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                <span>Real-time results may influence voting behavior and outcomes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                <span>Blockchain verification adds 0.5-1 second to vote processing time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptions;