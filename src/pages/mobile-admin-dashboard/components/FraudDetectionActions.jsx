import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { analytics } from '../../../hooks/useGoogleAnalytics';


const FraudDetectionActions = ({ onRefresh }) => {
  const [processing, setProcessing] = useState(null);

  const quickActions = [
    {
      id: 'suspend_user',
      label: 'Suspend User',
      icon: 'UserX',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: 'Immediately suspend suspicious account'
    },
    {
      id: 'block_ip',
      label: 'Block IP',
      icon: 'Shield',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Block IP address from accessing platform'
    },
    {
      id: 'flag_content',
      label: 'Flag Content',
      icon: 'Flag',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      description: 'Mark content for review'
    },
    {
      id: 'freeze_wallet',
      label: 'Freeze Wallet',
      icon: 'Lock',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Freeze user wallet transactions'
    }
  ];

  const handleAction = async (actionId) => {
    try {
      setProcessing(actionId);
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Executed action:', actionId);
      await onRefresh();
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      setProcessing(userId);
      // Block user logic here
      
      // Track fraud action
      analytics?.trackEvent('fraud_action_block_user', {
        user_id: userId,
        action_type: 'block',
        device_type: 'mobile'
      });
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to block user:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleInvestigate = async (alertId) => {
    try {
      setProcessing(alertId);
      // Investigation logic here
      
      // Track fraud investigation
      analytics?.trackEvent('fraud_investigation_started', {
        alert_id: alertId,
        device_type: 'mobile'
      });
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to start investigation:', err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Shield" size={20} className="text-primary" />
        <h3 className="text-base font-heading font-semibold text-foreground">
          Fraud Detection Actions
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleAction(action?.id)}
            disabled={processing === action?.id}
            className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all text-left disabled:opacity-50"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${action?.bgColor}`}>
              <Icon name={action?.icon} size={24} className={action?.color} />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {action?.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {action?.description}
            </p>
            {processing === action?.id && (
              <div className="mt-2">
                <Icon name="Loader" size={16} className="animate-spin text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FraudDetectionActions;