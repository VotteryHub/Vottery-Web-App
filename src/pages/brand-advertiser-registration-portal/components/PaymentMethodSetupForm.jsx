import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PaymentMethodSetupForm = ({ formData, onChange, errors }) => {
  const paymentProcessors = [
    { value: '', label: 'Select Payment Processor' },
    { value: 'bank', label: 'Bank Account (ACH/Wire Transfer)' },
    { value: 'credit_card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe Connect' },
    { value: 'crypto', label: 'Cryptocurrency Wallet' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Payment Method Setup
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure your payment method for advertising billing and transactions
        </p>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Secure Payment Processing</p>
            <p className="text-xs text-muted-foreground">
              All payment information is encrypted and processed securely. We are PCI DSS compliant.
            </p>
          </div>
        </div>
      </div>

      <Select
        label="Payment Processor"
        value={formData?.paymentProcessor}
        onChange={(e) => onChange('paymentProcessor', e?.target?.value)}
        options={paymentProcessors}
        error={errors?.paymentProcessor}
        required
      />

      {formData?.paymentProcessor === 'bank' && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="text-base font-heading font-semibold text-foreground">Bank Account Details</h4>
          
          <Input
            label="Bank Name"
            type="text"
            placeholder="Enter bank name"
            value={formData?.bankName}
            onChange={(e) => onChange('bankName', e?.target?.value)}
            error={errors?.bankName}
          />

          <Input
            label="Account Number"
            type="text"
            placeholder="Enter account number"
            value={formData?.bankAccountNumber}
            onChange={(e) => onChange('bankAccountNumber', e?.target?.value)}
            error={errors?.bankAccountNumber}
          />

          <Input
            label="Routing Number"
            type="text"
            placeholder="Enter routing number"
            value={formData?.bankRoutingNumber}
            onChange={(e) => onChange('bankRoutingNumber', e?.target?.value)}
            error={errors?.bankRoutingNumber}
          />
        </div>
      )}

      {formData?.paymentProcessor === 'credit_card' && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="text-base font-heading font-semibold text-foreground">Credit Card Information</h4>
          
          <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <p className="text-xs text-warning">
                Card details will be securely processed through our payment gateway. We do not store full card numbers.
              </p>
            </div>
          </div>

          <Input
            label="Cardholder Name"
            type="text"
            placeholder="Name on card"
            value={formData?.cardholderName}
            onChange={(e) => onChange('cardholderName', e?.target?.value)}
            error={errors?.cardholderName}
          />

          <Input
            label="Card Number"
            type="text"
            placeholder="**** **** **** ****"
            value={formData?.creditCardLast4}
            onChange={(e) => onChange('creditCardLast4', e?.target?.value)}
            error={errors?.creditCardLast4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="text"
              placeholder="MM/YY"
              value={formData?.cardExpiry}
              onChange={(e) => onChange('cardExpiry', e?.target?.value)}
              error={errors?.cardExpiry}
            />

            <Input
              label="CVV"
              type="text"
              placeholder="***"
              value={formData?.cardCvv}
              onChange={(e) => onChange('cardCvv', e?.target?.value)}
              error={errors?.cardCvv}
            />
          </div>
        </div>
      )}

      {formData?.paymentProcessor === 'paypal' && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="text-base font-heading font-semibold text-foreground">PayPal Account</h4>
          
          <Input
            label="PayPal Email"
            type="email"
            placeholder="your-email@example.com"
            value={formData?.paypalEmail}
            onChange={(e) => onChange('paypalEmail', e?.target?.value)}
            error={errors?.paypalEmail}
          />

          <div className="flex items-center gap-2 p-3 bg-card rounded-lg border border-border">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="text-sm text-muted-foreground">PayPal account will be verified during setup</span>
          </div>
        </div>
      )}

      {formData?.paymentProcessor === 'stripe' && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="text-base font-heading font-semibold text-foreground">Stripe Connect</h4>
          
          <div className="flex items-center gap-2 p-3 bg-card rounded-lg border border-border">
            <Icon name="Link" size={20} className="text-primary" />
            <span className="text-sm text-muted-foreground">Connect your Stripe account for seamless payments</span>
          </div>

          <Input
            label="Stripe Account ID"
            type="text"
            placeholder="acct_xxxxxxxxxxxxx"
            value={formData?.stripeAccountId}
            onChange={(e) => onChange('stripeAccountId', e?.target?.value)}
            error={errors?.stripeAccountId}
          />
        </div>
      )}

      {formData?.paymentProcessor === 'crypto' && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="text-base font-heading font-semibold text-foreground">Cryptocurrency Wallet</h4>
          
          <Input
            label="Wallet Address"
            type="text"
            placeholder="0x..."
            value={formData?.digitalWalletId}
            onChange={(e) => onChange('digitalWalletId', e?.target?.value)}
            error={errors?.digitalWalletId}
          />

          <Select
            label="Cryptocurrency"
            value={formData?.cryptoCurrency}
            onChange={(e) => onChange('cryptoCurrency', e?.target?.value)}
            options={[
              { value: '', label: 'Select Cryptocurrency' },
              { value: 'btc', label: 'Bitcoin (BTC)' },
              { value: 'eth', label: 'Ethereum (ETH)' },
              { value: 'usdt', label: 'Tether (USDT)' },
              { value: 'usdc', label: 'USD Coin (USDC)' }
            ]}
            error={errors?.cryptoCurrency}
          />
        </div>
      )}

      <div className="pt-6 border-t border-border">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">PCI Compliance</h4>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
            <Checkbox
              checked={formData?.pciCompliant}
              onCheckedChange={(checked) => onChange('pciCompliant', checked)}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                I confirm PCI DSS compliance
              </p>
              <p className="text-xs text-muted-foreground">
                I acknowledge that my payment processing meets Payment Card Industry Data Security Standards (PCI DSS) requirements.
              </p>
            </div>
          </label>
          {errors?.pciCompliant && (
            <p className="text-sm text-destructive">{errors?.pciCompliant}</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
            <Icon name="Shield" size={18} className="text-success" />
            <span className="text-xs font-medium text-success">256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
            <Icon name="Lock" size={18} className="text-success" />
            <span className="text-xs font-medium text-success">Secure Processing</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
            <Icon name="CheckCircle" size={18} className="text-success" />
            <span className="text-xs font-medium text-success">PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSetupForm;