import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

import Icon from '../../../components/AppIcon';

const BudgetConfiguration = ({ formData, onChange, errors }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [estimatedParticipants, setEstimatedParticipants] = useState(0);

  const participationModels = [
    { value: 'free', label: 'Free Participation', description: 'No cost to voters, brand covers all expenses' },
    { value: 'paid_general', label: 'Paid General', description: 'Single global participation fee' },
    { value: 'paid_regional', label: 'Paid Regional', description: 'Zone-based pricing for 8 purchasing power regions' }
  ];

  const campaignDurations = [
    { value: '3', label: '3 Days' },
    { value: '7', label: '7 Days' },
    { value: '14', label: '14 Days' },
    { value: '30', label: '30 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' }
  ];

  const prizeDistributionModels = [
    { value: 'single_winner', label: 'Single Grand Prize', description: 'One winner receives entire prize pool' },
    { value: 'multiple_winners', label: 'Multiple Winners', description: 'Prize pool split among top winners' },
    { value: 'tiered', label: 'Tiered Prizes', description: '1st, 2nd, 3rd place with decreasing amounts' },
    { value: 'random_draw', label: 'Random Draw', description: 'Equal chance for all participants' }
  ];

  const regionalPricing = [
    { zone: 'Zone 1 - US', basePrice: 5.00, currency: 'USD' },
    { zone: 'Zone 2 - Europe', basePrice: 4.50, currency: 'EUR' },
    { zone: 'Zone 3 - Canada', basePrice: 6.50, currency: 'CAD' },
    { zone: 'Zone 4 - Australia/NZ', basePrice: 7.00, currency: 'AUD' },
    { zone: 'Zone 5 - Developed Asia', basePrice: 3.50, currency: 'USD' },
    { zone: 'Zone 6 - Latin America', basePrice: 2.50, currency: 'USD' },
    { zone: 'Zone 7 - Emerging Asia', basePrice: 1.50, currency: 'USD' },
    { zone: 'Zone 8 - Africa', basePrice: 1.00, currency: 'USD' }
  ];

  useEffect(() => {
    const campaignBudget = parseFloat(formData?.campaignBudget) || 0;
    const prizePool = parseFloat(formData?.prizePool) || 0;
    const platformFee = (campaignBudget + prizePool) * 0.15;
    setTotalBudget(campaignBudget + prizePool + platformFee);

    const avgParticipationCost = formData?.participationModel === 'free' ? 0 : 3.5;
    const estimated = avgParticipationCost > 0 ? Math.floor(campaignBudget / avgParticipationCost) : 50000;
    setEstimatedParticipants(estimated);
  }, [formData?.campaignBudget, formData?.prizePool, formData?.participationModel]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="DollarSign" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Budget & Pricing</h3>
          <p className="text-sm text-muted-foreground">Configure campaign costs and prize distribution</p>
        </div>
      </div>
      <Select
        label="Participation Model"
        description="Choose how participants will access your sponsored election"
        required
        options={participationModels}
        value={formData?.participationModel}
        onChange={(value) => onChange('participationModel', value)}
        error={errors?.participationModel}
      />
      {formData?.participationModel === 'paid_regional' && (
        <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="Globe" size={18} className="text-primary" />
            <h4 className="text-base font-heading font-semibold text-foreground">Regional Pricing Structure</h4>
          </div>
          <p className="text-sm text-muted-foreground">Adjust pricing for each purchasing power zone</p>
          
          <div className="space-y-3">
            {regionalPricing?.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{region?.zone}</p>
                  <p className="text-xs text-muted-foreground">Base: {region?.currency} {region?.basePrice?.toFixed(2)}</p>
                </div>
                <Input
                  type="number"
                  placeholder={region?.basePrice?.toFixed(2)}
                  className="w-24"
                  value={formData?.regionalPrices?.[index] || ''}
                  onChange={(e) => {
                    const prices = [...(formData?.regionalPrices || Array(8)?.fill(''))];
                    prices[index] = e?.target?.value;
                    onChange('regionalPrices', prices);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Campaign Budget"
          type="number"
          placeholder="10000"
          description="Total advertising spend (USD)"
          required
          value={formData?.campaignBudget}
          onChange={(e) => onChange('campaignBudget', e?.target?.value)}
          error={errors?.campaignBudget}
        />

        <Select
          label="Campaign Duration"
          description="How long will the election run?"
          required
          options={campaignDurations}
          value={formData?.duration}
          onChange={(value) => onChange('duration', value)}
          error={errors?.duration}
        />
      </div>
      <div className="space-y-4">
        <Checkbox
          label="Enable Gamification (Lotterized Election)"
          description="Convert votes into lottery tickets for prize draws"
          checked={formData?.enableGamification}
          onChange={(e) => onChange('enableGamification', e?.target?.checked)}
        />

        {formData?.enableGamification && (
          <div className="ml-6 space-y-4 pl-4 border-l-2 border-primary/20">
            <Input
              label="Prize Pool Amount"
              type="number"
              placeholder="5000"
              description="Total prize money to be distributed (USD)"
              required
              value={formData?.prizePool}
              onChange={(e) => onChange('prizePool', e?.target?.value)}
              error={errors?.prizePool}
            />

            <Select
              label="Prize Distribution Model"
              description="How prizes will be awarded to winners"
              required
              options={prizeDistributionModels}
              value={formData?.prizeDistribution}
              onChange={(value) => onChange('prizeDistribution', value)}
              error={errors?.prizeDistribution}
            />

            {formData?.prizeDistribution === 'multiple_winners' && (
              <Input
                label="Number of Winners"
                type="number"
                placeholder="10"
                description="How many participants will receive prizes"
                required
                value={formData?.numberOfWinners}
                onChange={(e) => onChange('numberOfWinners', e?.target?.value)}
              />
            )}

            {formData?.prizeDistribution === 'tiered' && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Prize Tier Allocation</label>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="1st Place %"
                    type="number"
                    placeholder="50"
                    value={formData?.tier1Percent}
                    onChange={(e) => onChange('tier1Percent', e?.target?.value)}
                  />
                  <Input
                    label="2nd Place %"
                    type="number"
                    placeholder="30"
                    value={formData?.tier2Percent}
                    onChange={(e) => onChange('tier2Percent', e?.target?.value)}
                  />
                  <Input
                    label="3rd Place %"
                    type="number"
                    placeholder="20"
                    value={formData?.tier3Percent}
                    onChange={(e) => onChange('tier3Percent', e?.target?.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <Icon name="Calculator" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-base font-heading font-semibold text-foreground">Budget Breakdown</h4>
            <p className="text-sm text-muted-foreground">Estimated costs and projections</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Campaign Budget</span>
            <span className="font-data font-medium text-foreground">
              ${parseFloat(formData?.campaignBudget || 0)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {formData?.enableGamification && (
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Prize Pool</span>
              <span className="font-data font-medium text-foreground">
                ${parseFloat(formData?.prizePool || 0)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Platform Fee (15%)</span>
            <span className="font-data font-medium text-foreground">
              ${(totalBudget * 0.15 / 1.15)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 bg-primary/5 rounded-lg px-3">
            <span className="text-base font-heading font-semibold text-foreground">Total Investment</span>
            <span className="text-xl font-heading font-bold text-primary">
              ${totalBudget?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-heading font-bold text-success">
                {estimatedParticipants?.toLocaleString('en-US')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Est. Participants</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-heading font-bold text-warning">
                ${(totalBudget / Math.max(estimatedParticipants, 1))?.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Cost Per Participant</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-success/5 border border-success/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="TrendingUp" size={18} className="text-success mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Budget Optimization Insights</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">•</span>
                <span>Gamified campaigns see 3-5x higher engagement rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">•</span>
                <span>Regional pricing increases participation in emerging markets by 40%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-1">•</span>
                <span>Longer campaigns (30+ days) provide better ROI for brand awareness goals</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetConfiguration;