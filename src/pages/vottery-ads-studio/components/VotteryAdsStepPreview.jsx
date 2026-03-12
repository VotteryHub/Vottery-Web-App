import React from 'react';
import Icon from '../../../components/AppIcon';
import { AD_TYPES, PRICING_MODELS } from '../../../constants/votteryAdsConstants';

const OBJ_LABELS = { reach: 'Reach', traffic: 'Traffic', app_installs: 'App installs', conversions: 'Conversions' };
const AD_TYPE_LABELS = {
  [AD_TYPES.DISPLAY]: 'Display',
  [AD_TYPES.VIDEO]: 'Video',
  [AD_TYPES.PARTICIPATORY]: 'Participatory / gamified',
  [AD_TYPES.SPARK]: 'Spark (boost post)',
};

const VotteryAdsStepPreview = ({ formData, ZONES, PLACEMENT_SLOT_LABELS }) => {
  const zoneLabels = (formData?.targetZones || [])
    .map((z) => ZONES.find((x) => x.value === z)?.label || `Zone ${z}`)
    .join(', ');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Eye" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Preview & launch</h3>
          <p className="text-sm text-muted-foreground">Review your campaign before going live</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Campaign</p>
          <p className="font-medium">{formData?.campaignName}</p>
          <p className="text-sm">{OBJ_LABELS[formData?.campaignObjective] || formData?.campaignObjective}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Ad group</p>
          <p className="font-medium">{formData?.adGroupName}</p>
          <p className="text-sm">Zones: {zoneLabels || 'All'}</p>
          <p className="text-sm">
            Daily budget: ${((formData?.dailyBudgetCents || 0) / 100).toFixed(2)}
            {formData?.lifetimeBudgetCents ? ` | Lifetime: $${(formData.lifetimeBudgetCents / 100).toFixed(2)}` : ''}
          </p>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Ad</p>
        <p className="font-medium">{formData?.adName}</p>
        <p className="text-sm">{AD_TYPE_LABELS[formData?.adType] || formData?.adType}</p>
        {formData?.headline && <p className="text-sm">{formData.headline}</p>}
        <p className="text-sm">
          Bid: ${((formData?.bidAmountCents || 0) / 100).toFixed(2)} | {formData?.pricingModel?.toUpperCase()}
        </p>
        {formData?.adType === AD_TYPES.PARTICIPATORY && formData?.enableGamification && (
          <p className="text-sm">Gamification + prize pool: ${((formData?.prizePoolCents || 0) / 100).toFixed(2)}</p>
        )}
        {formData?.adType === AD_TYPES.SPARK && formData?.sourcePostId && (
          <p className="text-sm">Spark: post {formData.sourcePostId.slice(0, 8)}…</p>
        )}
      </div>

      {formData?.placementSlots?.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Placements: {formData.placementSlots.map((k) => PLACEMENT_SLOT_LABELS[k] || k).join(', ')}
        </p>
      )}
    </div>
  );
};

export default VotteryAdsStepPreview;
