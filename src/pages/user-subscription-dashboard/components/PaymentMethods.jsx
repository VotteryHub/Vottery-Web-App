import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { stripeService } from '../../../services/stripeService';

const PaymentMethods = ({ userId, onUpdate }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, [userId]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const result = await stripeService?.getPaymentMethods(userId);
      if (result?.data) {
        setPaymentMethods(result?.data);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    alert('Add payment method functionality - integrate with Stripe Elements');
  };

  const handleRemovePaymentMethod = (methodId) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      alert(`Removing payment method ${methodId}`);
      onUpdate();
    }
  };

  const handleSetDefault = (methodId) => {
    alert(`Setting payment method ${methodId} as default`);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="CreditCard" className="w-5 h-5 text-primary" />
            Payment Methods
          </h2>
          <Button
            onClick={handleAddPaymentMethod}
            className="flex items-center gap-2"
          >
            <Icon name="Plus" className="w-4 h-4" />
            Add Payment Method
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods?.length > 0 ? (
              paymentMethods?.map((method) => (
                <div key={method?.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name="CreditCard" className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground capitalize">
                            {method?.cardBrand || 'Card'} •••• {method?.last4 || '****'}
                          </p>
                          {method?.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expires {method?.expiryMonth || 'XX'}/{method?.expiryYear || 'XXXX'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method?.isDefault && (
                        <Button
                          onClick={() => handleSetDefault(method?.id)}
                          variant="outline"
                          size="sm"
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        onClick={() => handleRemovePaymentMethod(method?.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Icon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Icon name="CreditCard" className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">No payment methods added yet</p>
                <Button onClick={handleAddPaymentMethod}>
                  Add Your First Payment Method
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="Shield" className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Secure Payment Processing</p>
              <p className="text-sm text-blue-800">
                All payment information is securely processed by Stripe. We never store your full card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;