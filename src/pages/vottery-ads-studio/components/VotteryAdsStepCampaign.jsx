import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { CAMPAIGN_OBJECTIVES } from '../../../constants/votteryAdsConstants';

const OBJECTIVE_OPTIONS = [
  { value: CAMPAIGN_OBJECTIVES.REACH, label: 'Reach', description: 'Maximize brand awareness' },
  { value: CAMPAIGN_OBJECTIVES.TRAFFIC, label: 'Traffic', description: 'Drive visits to your site or app' },
  { value: CAMPAIGN_OBJECTIVES.APP_INSTALLS, label: 'App installs', description: 'Get app downloads' },
  { value: CAMPAIGN_OBJECTIVES.CONVERSIONS, label: 'Conversions', description: 'Optimize for actions (votes, sign-ups, purchases)' },
];

const VotteryAdsStepCampaign = ({ formData, onChange, errors }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 pb-4 border-b border-border">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon name="FileText" size={20} color="var(--color-primary)" />
      </div>
      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground">Campaign</h3>
        <p className="text-sm text-muted-foreground">Name and objective for this campaign</p>
      </div>
    </div>
    <Input
      label="Campaign name"
      type="text"
      placeholder="e.g. Summer 2026 brand campaign"
      required
      value={formData?.campaignName}
      onChange={(e) => onChange('campaignName', e?.target?.value)}
      error={errors?.campaignName}
    />
    <Select
      label="Objective"
      description="What you want to achieve"
      required
      options={OBJECTIVE_OPTIONS}
      value={formData?.campaignObjective}
      onChange={(v) => onChange('campaignObjective', v)}
      error={errors?.campaignObjective}
    />
  </div>
);

export default VotteryAdsStepCampaign;
