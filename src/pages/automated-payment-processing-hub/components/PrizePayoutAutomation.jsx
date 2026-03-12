import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { stripeService } from '../../../services/stripeService';

const PrizePayoutAutomation = ({ data, onRefresh }) => {
  const [processing, setProcessing] = useState(false);

  const zones = [
    { id: 1, name: 'Zone 1', currency: 'USD', pendingPayouts: 12, totalAmount: 15600, avgPayout: 1300 },
    { id: 2, name: 'Zone 2', currency: 'EUR', pendingPayouts: 8, totalAmount: 9200, avgPayout: 1150 },
    { id: 3, name: 'Zone 3', currency: 'GBP', pendingPayouts: 15, totalAmount: 18900, avgPayout: 1260 },
    { id: 4, name: 'Zone 4', currency: 'INR', pendingPayouts: 24, totalAmount: 124800, avgPayout: 5200 },
    { id: 5, name: 'Zone 5', currency: 'BRL', pendingPayouts: 18, totalAmount: 45600, avgPayout: 2533 },
    { id: 6, name: 'Zone 6', currency: 'MXN', pendingPayouts: 10, totalAmount: 98000, avgPayout: 9800 },
    { id: 7, name: 'Zone 7', currency: 'JPY', pendingPayouts: 6, totalAmount: 780000, avgPayout: 130000 },
    { id: 8, name: 'Zone 8', currency: 'AUD', pendingPayouts: 9, totalAmount: 13500, avgPayout: 1500 }
  ];

  const handleProcessPayouts = async (zoneId) => {
    setProcessing(true);
    try {
      // Simulate payout processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onRefresh?.();
    } catch (error) {
      console.error('Failed to process payouts:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Prize Payout Automation
            </h2>
            <p className="text-sm text-muted-foreground">
              Automated winner distributions across 8 purchasing power zones
            </p>
          </div>
          <Button variant="default" iconName="Play" onClick={() => handleProcessPayouts('all')} disabled={processing}>
            Process All Zones
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones?.map((zone) => (
            <div key={zone?.id} className="p-4 rounded-lg border border-border bg-card hover:border-primary transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-foreground">{zone?.name}</h3>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {zone?.currency}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-foreground font-data">{zone?.pendingPayouts}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold text-foreground font-data">
                    {stripeService?.formatCurrency(zone?.totalAmount, zone?.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Payout</span>
                  <span className="font-semibold text-foreground font-data">
                    {stripeService?.formatCurrency(zone?.avgPayout, zone?.currency)}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                onClick={() => handleProcessPayouts(zone?.id)}
                disabled={processing}
                className="w-full"
              >
                Process Zone
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Automated Verification
            </h2>
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
              <Icon name="Shield" size={20} className="text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Identity Verification</p>
                <p className="text-xs text-muted-foreground">KYC checks completed automatically</p>
              </div>
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
              <Icon name="FileCheck" size={20} className="text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Tax Compliance</p>
                <p className="text-xs text-muted-foreground">W-9/W-8 forms validated</p>
              </div>
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10">
              <Icon name="Globe" size={20} className="text-success" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Multi-Currency Support</p>
                <p className="text-xs text-muted-foreground">8 currencies with live exchange rates</p>
              </div>
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Payment Methods
            </h2>
            <Icon name="CreditCard" size={24} className="text-primary" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Icon name="Banknote" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Bank Transfer</span>
              </div>
              <span className="text-sm text-muted-foreground">68% of payouts</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Icon name="Gift" size={20} className="text-secondary" />
                <span className="text-sm font-medium text-foreground">Gift Cards</span>
              </div>
              <span className="text-sm text-muted-foreground">18% of payouts</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Icon name="Bitcoin" size={20} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Cryptocurrency</span>
              </div>
              <span className="text-sm text-muted-foreground">14% of payouts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizePayoutAutomation;