import React, { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';
import { AD_TYPES, PRICING_MODELS } from '../../../constants/votteryAdsConstants';

const AD_TYPE_OPTIONS = [
  { value: AD_TYPES.DISPLAY, label: 'Display (banner)', description: 'Normal ad, no gamification' },
  { value: AD_TYPES.VIDEO, label: 'Video', description: 'Normal video ad' },
  { value: AD_TYPES.PARTICIPATORY, label: 'Participatory / gamified', description: 'Sponsored election; optional prize pool' },
  { value: AD_TYPES.SPARK, label: 'Spark (boost post)', description: 'Boost a Moment or Jolt; keeps organic engagement' },
];

const PRICING_OPTIONS = [
  { value: PRICING_MODELS.CPM, label: 'CPM (cost per 1,000 impressions)' },
  { value: PRICING_MODELS.CPC, label: 'CPC (cost per click)' },
  { value: PRICING_MODELS.OCPM, label: 'oCPM (optimized CPM)' },
  { value: PRICING_MODELS.CPV, label: 'CPV (cost per view)' },
];

const VotteryAdsStepCreative = ({ formData, onChange, errors }) => {
  const [elections, setElections] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: el } = await supabase.from('elections').select('id, title').eq('is_sponsored', false).limit(100);
      setElections(el || []);
      const { data: po } = await supabase.from('posts').select('id, content').limit(100);
      setPosts(po || []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Image" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Ad creative</h3>
          <p className="text-sm text-muted-foreground">Ad type, creative and bid</p>
        </div>
      </div>

      <Input
        label="Ad name"
        type="text"
        placeholder="e.g. Hero banner summer"
        required
        value={formData?.adName}
        onChange={(e) => onChange('adName', e?.target?.value)}
        error={errors?.adName}
      />

      <Select
        label="Ad type"
        description="Normal (display/video) or participatory/gamified or Spark"
        required
        options={AD_TYPE_OPTIONS}
        value={formData?.adType}
        onChange={(v) => onChange('adType', v)}
        error={errors?.adType}
      />

      {(formData?.adType === 'display' || formData?.adType === 'video' || formData?.adType === 'participatory') && (
        <>
          <Input label="Headline" value={formData?.headline} onChange={(e) => onChange('headline', e?.target?.value)} />
          <Input label="Body text" value={formData?.body} onChange={(e) => onChange('body', e?.target?.value)} />
          <Input label="Image URL" value={formData?.imageUrl} onChange={(e) => onChange('imageUrl', e?.target?.value)} />
          {(formData?.adType === 'video' || formData?.adType === 'participatory') && (
            <Input label="Video URL" value={formData?.videoUrl} onChange={(e) => onChange('videoUrl', e?.target?.value)} />
          )}
        </>
      )}

      {formData?.adType === 'participatory' && (
        <>
          <Select
            label="Election to sponsor"
            required
            options={elections.map((e) => ({ value: e.id, label: e.title || e.id }))}
            value={formData?.electionId}
            onChange={(v) => onChange('electionId', v)}
            error={errors?.electionId}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData?.enableGamification}
              onChange={(e) => onChange('enableGamification', e.target.checked)}
            />
            <span className="text-sm">Enable gamification (prize pool, XP)</span>
          </label>
          {formData?.enableGamification && (
            <Input
              label="Prize pool (cents)"
              type="number"
              value={formData?.prizePoolCents ?? ''}
              onChange={(e) => onChange('prizePoolCents', e.target.value ? parseInt(e.target.value, 10) : null)}
            />
          )}
        </>
      )}

      {formData?.adType === 'spark' && (
        <>
          <Select
            label="Post to boost (Moment/Jolt)"
            required
            options={posts.map((p) => ({ value: p.id, label: (p.content || p.id).slice(0, 50) + '…' }))}
            value={formData?.sourcePostId}
            onChange={(v) => onChange('sourcePostId', v)}
            error={errors?.sourcePostId}
          />
          <Select
            label="Source type"
            options={[
              { value: 'moment', label: 'Moment' },
              { value: 'jolt', label: 'Jolt' },
            ]}
            value={formData?.sparkSourceType}
            onChange={(v) => onChange('sparkSourceType', v)}
          />
          <Input label="CTA URL" value={formData?.ctaUrl} onChange={(e) => onChange('ctaUrl', e?.target?.value)} />
        </>
      )}

      <Input
        label="CTA label"
        value={formData?.cta}
        onChange={(e) => onChange('cta', e?.target?.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Bid (cents)"
          type="number"
          min={0}
          required
          value={formData?.bidAmountCents ?? ''}
          onChange={(e) => onChange('bidAmountCents', e.target.value ? parseInt(e.target.value, 10) : 0)}
          error={errors?.bidAmountCents}
        />
        <Select
          label="Pricing model"
          options={PRICING_OPTIONS}
          value={formData?.pricingModel}
          onChange={(v) => onChange('pricingModel', v)}
        />
      </div>
    </div>
  );
};

export default VotteryAdsStepCreative;
