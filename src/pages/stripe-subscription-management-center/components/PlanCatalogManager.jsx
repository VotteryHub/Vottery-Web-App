import React, { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { subscriptionService } from '../../../services/subscriptionService';

const defaultDraft = {
  planName: '',
  planType: 'premium',
  duration: 'monthly',
  price: 0,
  discountPercent: 0,
  discountLabel: '',
  isActive: true,
  features: [],
};

export default function PlanCatalogManager({ plans, onRefresh }) {
  const [savingId, setSavingId] = useState(null);
  const [editedPlans, setEditedPlans] = useState({});
  const [draft, setDraft] = useState(defaultDraft);
  const [featureInput, setFeatureInput] = useState('');
  const [error, setError] = useState('');

  const groupedDiscounts = useMemo(() => {
    const byType = {};
    (plans || []).forEach((p) => {
      const type = p?.planType || 'unknown';
      byType[type] = byType[type] || {};
      byType[type][p?.duration] = Number(p?.price || 0);
    });
    return byType;
  }, [plans]);

  const getDiscountLabel = (plan) => {
    if (Number(plan?.discountPercent || 0) > 0) {
      return plan?.discountLabel || `Save ${Number(plan.discountPercent)}%`;
    }
    const prices = groupedDiscounts?.[plan?.planType];
    if (!prices?.monthly || !prices?.annual || plan?.duration !== 'annual') return null;
    const monthlyAnnual = prices.monthly * 12;
    if (!monthlyAnnual) return null;
    const pct = Math.max(0, Math.round(((monthlyAnnual - prices.annual) / monthlyAnnual) * 100));
    return pct > 0 ? `Save ${pct}%` : null;
  };

  const updateEditedPlan = (planId, partial) => {
    setEditedPlans((prev) => ({
      ...prev,
      [planId]: { ...(prev?.[planId] || {}), ...partial },
    }));
  };

  const getEffectivePlan = (plan) => ({ ...plan, ...(editedPlans?.[plan?.id] || {}) });

  const savePlan = async (plan) => {
    const effective = getEffectivePlan(plan);
    setSavingId(plan?.id);
    setError('');
    const result = await subscriptionService.updateSubscriptionPlan(effective?.id, {
      planName: effective?.planName,
      planType: effective?.planType,
      duration: effective?.duration,
      price: Number(effective?.price || 0),
      discountPercent: Number(effective?.discountPercent || 0),
      discountLabel: effective?.discountLabel || null,
      isActive: !!effective?.isActive,
      features: Array.isArray(effective?.features) ? effective?.features : [],
    });
    setSavingId(null);
    if (result?.error) {
      setError(result.error.message || 'Failed to update plan');
      return;
    }
    onRefresh?.();
  };

  const createPlan = async () => {
    setSavingId('new');
    setError('');
    const result = await subscriptionService.createSubscriptionPlan({
      ...draft,
      price: Number(draft.price || 0),
      discountPercent: Number(draft.discountPercent || 0),
      discountLabel: draft.discountLabel || null,
      features: draft.features,
    });
    setSavingId(null);
    if (result?.error) {
      setError(result.error.message || 'Failed to create plan');
      return;
    }
    setDraft(defaultDraft);
    setFeatureInput('');
    onRefresh?.();
  };

  const addDraftFeature = () => {
    const value = featureInput.trim();
    if (!value) return;
    setDraft((prev) => ({ ...prev, features: [...prev.features, value] }));
    setFeatureInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="SlidersHorizontal" className="w-5 h-5 text-primary" />
          Subscription Tier Catalog (Editable)
        </h2>
        {error ? <p className="text-sm text-destructive mb-4">{error}</p> : null}
        <div className="space-y-4">
          {(plans || []).map((plan) => {
            const effective = getEffectivePlan(plan);
            return (
            <div key={plan?.id} className="grid grid-cols-1 md:grid-cols-9 gap-2 items-center border border-border rounded-lg p-3">
              <Input value={effective?.planName || ''} onChange={(e) => updateEditedPlan(plan?.id, { planName: e?.target?.value })} />
              <Input value={effective?.planType || ''} onChange={(e) => updateEditedPlan(plan?.id, { planType: e?.target?.value })} />
              <Input value={effective?.duration || ''} onChange={(e) => updateEditedPlan(plan?.id, { duration: e?.target?.value })} />
              <Input type="number" value={effective?.price ?? 0} onChange={(e) => updateEditedPlan(plan?.id, { price: e?.target?.value })} />
              <Input type="number" value={effective?.discountPercent ?? 0} onChange={(e) => updateEditedPlan(plan?.id, { discountPercent: e?.target?.value })} />
              <Input value={effective?.discountLabel || ''} onChange={(e) => updateEditedPlan(plan?.id, { discountLabel: e?.target?.value })} placeholder="Discount badge label" />
              <label className="text-sm text-foreground flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!effective?.isActive}
                  onChange={(e) => updateEditedPlan(plan?.id, { isActive: e?.target?.checked })}
                />
                Enabled
              </label>
              <div className="text-xs text-muted-foreground">{getDiscountLabel(effective) || 'No discount badge'}</div>
              <Button onClick={() => savePlan(plan)} disabled={savingId === plan?.id}>
                {savingId === plan?.id ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )})}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-md font-semibold text-foreground mb-4">Create New Tier Row</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-3">
          <Input placeholder="Plan name" value={draft.planName} onChange={(e) => setDraft((p) => ({ ...p, planName: e?.target?.value }))} />
          <Input placeholder="Plan type" value={draft.planType} onChange={(e) => setDraft((p) => ({ ...p, planType: e?.target?.value }))} />
          <Input placeholder="Duration" value={draft.duration} onChange={(e) => setDraft((p) => ({ ...p, duration: e?.target?.value }))} />
          <Input type="number" placeholder="Price" value={draft.price} onChange={(e) => setDraft((p) => ({ ...p, price: e?.target?.value }))} />
          <Input type="number" placeholder="Discount %" value={draft.discountPercent} onChange={(e) => setDraft((p) => ({ ...p, discountPercent: e?.target?.value }))} />
          <Input placeholder="Discount label" value={draft.discountLabel} onChange={(e) => setDraft((p) => ({ ...p, discountLabel: e?.target?.value }))} />
          <label className="text-sm text-foreground flex items-center gap-2">
            <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft((p) => ({ ...p, isActive: e?.target?.checked }))} />
            Enabled
          </label>
        </div>
        <div className="flex gap-2 mb-3">
          <Input placeholder="Add feature text" value={featureInput} onChange={(e) => setFeatureInput(e?.target?.value)} />
          <Button variant="outline" onClick={addDraftFeature}>Add Feature</Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {draft.features.map((f, i) => (
            <span key={`${f}-${i}`} className="px-2 py-1 rounded bg-muted text-xs text-foreground">
              {f}
            </span>
          ))}
        </div>
        <Button onClick={createPlan} disabled={savingId === 'new'}>
          {savingId === 'new' ? 'Creating...' : 'Create Plan'}
        </Button>
      </div>
    </div>
  );
}
