import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { smsAlertService } from '../../../services/smsAlertService';

export default function SMSCriticalAlertsPanel() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [message, setMessage] = useState({ type: null, text: '' });

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          ?.from('admin_alert_contacts')
          ?.select('id, phone_number, display_name, alert_type')
          ?.eq('is_active', true)
          ?.in('alert_type', ['fraud_compliance', 'all']);
        if (!error) setContacts(data || []);
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const sendToAdmins = async (template) => {
    const phones = contacts?.map((c) => c?.phone_number)?.filter(Boolean);
    if (!phones?.length) {
      setMessage({ type: 'error', text: 'No admin phone numbers configured for fraud/compliance. Add contacts in Telnyx SMS Provider Management with alert_type fraud_compliance or all.' });
      return;
    }
    setSending(template);
    setMessage({ type: null, text: '' });
    try {
      const sampleAlert = {
        id: `test_${Date.now()}`,
        title: template === 'fraud' ? 'Test fraud alert' : 'Test compliance alert',
        message: 'This is a test critical alert sent from Stakeholder Communication Hub.',
        severity: 'critical',
        category: template === 'fraud' ? 'fraud' : 'compliance',
        metadata: { fraudScore: 85 },
      };
      const method = template === 'fraud' ? smsAlertService?.sendCriticalFraudAlert : smsAlertService?.sendComplianceAlert;
      const { error } = await method?.(sampleAlert, phones);
      if (error) throw new Error(error?.message);
      setMessage({ type: 'success', text: `Test ${template} alert sent to ${phones?.length} admin(s).` });
    } catch (e) {
      setMessage({ type: 'error', text: e?.message || 'Failed to send.' });
    } finally {
      setSending(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon name="Smartphone" size={20} />
          Critical alerts to admin phones (SMS)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Send fraud and compliance alerts directly to admin phone numbers. Configure contacts with alert_type <code className="bg-muted px-1 rounded">fraud_compliance</code> or <code className="bg-muted px-1 rounded">all</code> in Telnyx SMS Provider Management.
        </p>
      </div>

      {contacts?.length > 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Display name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Alert type</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {contacts?.map((c) => (
                <tr key={c?.id}>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{c?.display_name || '—'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{c?.phone_number}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{c?.alert_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          No admin contacts for fraud/compliance SMS. Add phone numbers in <strong>Telnyx SMS Provider Management</strong> with alert_type <code>fraud_compliance</code> or <code>all</code>.
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => sendToAdmins('fraud')}
          disabled={sending || !contacts?.length}
          className="flex items-center gap-2"
        >
          {sending === 'fraud' ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="AlertTriangle" size={16} />}
          Send test fraud alert to admins
        </Button>
        <Button
          variant="outline"
          onClick={() => sendToAdmins('compliance')}
          disabled={sending || !contacts?.length}
          className="flex items-center gap-2"
        >
          {sending === 'compliance' ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="FileCheck" size={16} />}
          Send test compliance alert to admins
        </Button>
      </div>

      {message?.text && (
        <div className={`rounded-lg p-3 text-sm ${message?.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
          {message?.text}
        </div>
      )}
    </div>
  );
}
