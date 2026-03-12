import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, CreditCard, Clock } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { notificationService } from '../../../services/notificationService';
import { useAuth } from '../../../contexts/AuthContext';

const PAYMENT_TYPES = {
  settlement_processing: { label: 'Settlement processing', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  payout_delayed: { label: 'Payout delayed', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  payment_method_failed: { label: 'Payment method failed', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  payout_completed: { label: 'Payout completed', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
};

export default function PaymentAlertsPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const { data } = await notificationService?.getPaymentNotifications(user?.id, 20);
      if (!cancelled) setNotifications(data || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon icon={Bell} className="w-8 h-8 text-gray-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Payment & settlement alerts</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Notifications for settlement processing, payout delays, and payment method failures. These also appear in the Notification Center.
      </p>
      {notifications?.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
          <Bell className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p>No payment alerts yet.</p>
          <p className="text-xs mt-1">You’ll see updates here when payouts are processing, delayed, or if a payment method fails.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white overflow-hidden">
          {notifications?.map((n) => {
            const config = PAYMENT_TYPES[n?.activityType] || { label: n?.activityType, icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50' };
            const IconComponent = config?.icon || Bell;
            return (
              <li key={n?.id} className="flex items-start gap-3 p-4 hover:bg-gray-50">
                <div className={`p-2 rounded-lg ${config?.bg}`}>
                  <IconComponent className={`w-5 h-5 ${config?.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{n?.title || config?.label}</p>
                  {n?.description && <p className="text-sm text-gray-600 mt-0.5">{n?.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {n?.createdAt ? new Date(n?.createdAt).toLocaleString() : ''}
                    {!n?.isRead && <span className="ml-2 text-amber-600">New</span>}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
