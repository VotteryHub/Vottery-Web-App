import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { ZONES, PLACEMENT_SLOTS_TIKTOK, PLACEMENT_SLOTS_FACEBOOK, PLACEMENT_SLOT_LABELS } from '../../../constants/votteryAdsConstants';
import { votteryAdsService } from '../../../services/votteryAdsService';

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'JP', label: 'Japan' },
  { value: 'MX', label: 'Mexico' },
];

const VotteryAdsStepTargeting = ({ formData, onChange, errors, placementSlots, adminConfig }) => {
  const [regionRows, setRegionRows] = useState(formData?.targetRegions || []);
  const minDaily = votteryAdsService.getMinDailyBudgetCents(adminConfig);

  const zoneOptions = ZONES.map((z) => ({ value: z.value, label: z.label }));
  const allSlotKeys = [...new Set([...PLACEMENT_SLOTS_TIKTOK, ...PLACEMENT_SLOTS_FACEBOOK])];
  const slotOptions = (placementSlots?.length ? placementSlots : allSlotKeys.map((k) => ({ slot_key: k }))).map(
    (s) => ({ value: s.slot_key || s, label: PLACEMENT_SLOT_LABELS[s.slot_key || s] || s.slot_key || s })
  );

  const addRegion = () => {
    const newRows = [...regionRows, { country_iso: 'US', region_code: '', region_name: '' }];
    setRegionRows(newRows);
    onChange('targetRegions', newRows);
  };

  const updateRegion = (index, field, value) => {
    const next = [...regionRows];
    next[index] = { ...next[index], [field]: value };
    setRegionRows(next);
    onChange('targetRegions', next);
  };

  const removeRegion = (index) => {
    const next = regionRows.filter((_, i) => i !== index);
    setRegionRows(next);
    onChange('targetRegions', next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Target" size={20} color="var(--color-warning)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Targeting & placement</h3>
          <p className="text-sm text-muted-foreground">Zones, countries, regions and ad slots</p>
        </div>
      </div>

      <Input
        label="Ad group name"
        type="text"
        placeholder="e.g. US + Europe feed ads"
        required
        value={formData?.adGroupName}
        onChange={(e) => onChange('adGroupName', e?.target?.value)}
        error={errors?.adGroupName}
      />

      <Select
        label="Purchasing-power zones (1–8)"
        description="At least one required"
        multiple
        options={zoneOptions}
        value={formData?.targetZones}
        onChange={(v) => onChange('targetZones', v)}
        error={errors?.targetZones}
      />

      <Select
        label="Countries (optional)"
        description="Leave empty to use zones only; or select specific countries"
        multiple
        options={COUNTRY_OPTIONS}
        value={formData?.targetCountries}
        onChange={(v) => onChange('targetCountries', v)}
      />

      <div>
        <label className="text-sm font-medium text-foreground">Sub-national regions (optional)</label>
        <p className="text-xs text-muted-foreground mb-2">
          States, provinces, territories, districts, etc. within a country
        </p>
        {regionRows.map((row, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-center mb-2">
            <select
              className="border border-border rounded-md px-3 py-2 text-sm bg-background"
              value={row.country_iso}
              onChange={(e) => updateRegion(i, 'country_iso', e.target.value)}
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <input
              className="border border-border rounded-md px-3 py-2 text-sm w-28 bg-background"
              placeholder="Region code"
              value={row.region_code || ''}
              onChange={(e) => updateRegion(i, 'region_code', e.target.value)}
            />
            <input
              className="border border-border rounded-md px-3 py-2 text-sm flex-1 min-w-[120px] bg-background"
              placeholder="Region name (e.g. California)"
              value={row.region_name || ''}
              onChange={(e) => updateRegion(i, 'region_name', e.target.value)}
            />
            <button type="button" onClick={() => removeRegion(i)} className="text-destructive text-sm">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addRegion} className="text-sm text-primary hover:underline">
          + Add region
        </button>
      </div>

      <Select
        label="Placement mode"
        options={[
          { value: 'automatic', label: 'Automatic (Advantage+)' },
          { value: 'manual', label: 'Manual placements' },
        ]}
        value={formData?.placementMode}
        onChange={(v) => onChange('placementMode', v)}
      />

      {formData?.placementMode === 'manual' && (
        <Select
          label="Placement slots"
          description="Select where ads can appear"
          multiple
          options={slotOptions}
          value={formData?.placementSlots}
          onChange={(v) => onChange('placementSlots', v)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Daily budget (cents)"
          type="number"
          min={minDaily}
          placeholder={String(minDaily)}
          description={`Min $${(minDaily / 100).toFixed(2)}`}
          value={formData?.dailyBudgetCents ?? ''}
          onChange={(e) => onChange('dailyBudgetCents', e.target.value ? parseInt(e.target.value, 10) : null)}
          error={errors?.dailyBudgetCents}
        />
        <Input
          label="Lifetime budget (cents, optional)"
          type="number"
          placeholder="Optional"
          value={formData?.lifetimeBudgetCents ?? ''}
          onChange={(e) => onChange('lifetimeBudgetCents', e.target.value ? parseInt(e.target.value, 10) : null)}
        />
      </div>
    </div>
  );
};

export default VotteryAdsStepTargeting;
