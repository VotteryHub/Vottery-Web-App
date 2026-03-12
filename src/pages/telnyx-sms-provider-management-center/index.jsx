import React, { useState, useEffect } from 'react';
import { telnyxSMSService } from '../../services/telnyxSMSService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import { Activity, CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap, Shield, Filter, Phone, Plus, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

function TelnyxSMSProviderManagementCenter() {
  const [providerHealth, setProviderHealth] = useState(null);
  const [failoverHistory, setFailoverHistory] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminPhones, setAdminPhones] = useState([]);
  const [mcqAdminPhones, setMcqAdminPhones] = useState([]);
  const [newPhone, setNewPhone] = useState('');
  const [newPhoneName, setNewPhoneName] = useState('');
  const [newMcqPhone, setNewMcqPhone] = useState('');
  const [newMcqPhoneName, setNewMcqPhoneName] = useState('');

  const loadAdminPhones = async () => {
    try {
      const { data } = await supabase?.from('admin_alert_contacts')?.select('*')?.eq('is_active', true)?.eq('alert_type', 'ai_failover');
      setAdminPhones(data || []);
    } catch (e) {
      console.warn('admin_alert_contacts may not exist:', e);
    }
  };

  const loadMcqAdminPhones = async () => {
    try {
      const { data } = await supabase?.from('admin_alert_contacts')?.select('*')?.eq('is_active', true)?.in('alert_type', ['mcq_alerts', 'all']);
      setMcqAdminPhones(data || []);
    } catch (e) {
      console.warn('admin_alert_contacts mcq may not exist:', e);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [healthResult, historyResult, analyticsResult] = await Promise.all([
        telnyxSMSService?.getProviderHealth(),
        telnyxSMSService?.getFailoverHistory(20),
        telnyxSMSService?.getDeliveryAnalytics('24h')
      ]);

      if (healthResult?.data) setProviderHealth(healthResult?.data);
      if (historyResult?.data) setFailoverHistory(historyResult?.data);
      if (analyticsResult?.data) setAnalytics(analyticsResult?.data);
      await Promise.all([loadAdminPhones(), loadMcqAdminPhones()]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAdminPhone = async () => {
    if (!newPhone?.trim()) return;
    try {
      await supabase?.from('admin_alert_contacts')?.insert({
        phone_number: newPhone?.trim(),
        alert_type: 'ai_failover',
        display_name: newPhoneName?.trim() || null,
        is_active: true,
      });
      toast?.success('Admin phone added');
      setNewPhone('');
      setNewPhoneName('');
      await loadAdminPhones();
    } catch (e) {
      toast?.error(e?.message || 'Failed to add');
    }
  };

  const removeAdminPhone = async (id) => {
    try {
      await supabase?.from('admin_alert_contacts')?.update({ is_active: false, updated_at: new Date()?.toISOString() })?.eq('id', id);
      toast?.success('Phone removed');
      await loadAdminPhones();
    } catch (e) {
      toast?.error(e?.message || 'Failed to remove');
    }
  };

  const addMcqAdminPhone = async () => {
    if (!newMcqPhone?.trim()) return;
    try {
      await supabase?.from('admin_alert_contacts')?.insert({
        phone_number: newMcqPhone?.trim(),
        alert_type: 'mcq_alerts',
        display_name: newMcqPhoneName?.trim() || null,
        is_active: true,
      });
      toast?.success('MCQ alert phone added');
      setNewMcqPhone('');
      setNewMcqPhoneName('');
      await loadMcqAdminPhones();
    } catch (e) {
      toast?.error(e?.message || 'Failed to add');
    }
  };

  const removeMcqAdminPhone = async (id) => {
    try {
      await supabase?.from('admin_alert_contacts')?.update({ is_active: false, updated_at: new Date()?.toISOString() })?.eq('id', id);
      toast?.success('MCQ alert phone removed');
      await loadMcqAdminPhones();
    } catch (e) {
      toast?.error(e?.message || 'Failed to remove');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-restore: Periodic health check every 3 min to detect when Telnyx is restored
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const result = await telnyxSMSService?.monitorProviderHealth();
        if (result?.data) await loadDashboardData();
      } catch (_) { /* ignore */ }
    }, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadDashboardData,
    enabled: true,
  });

  const handleManualHealthCheck = async () => {
    setIsMonitoring(true);
    try {
      const result = await telnyxSMSService?.monitorProviderHealth();
      if (result?.data) {
        toast?.success('Health check completed');
        await loadDashboardData();
      }
    } catch (error) {
      toast?.error('Health check failed');
    } finally {
      setIsMonitoring(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'degraded': return 'text-yellow-600 bg-yellow-50';
      case 'offline': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5" />;
      case 'offline': return <XCircle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading SMS Provider Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Telnyx SMS Provider Management Center</h1>
        <p className="text-gray-600 mt-2">Comprehensive primary SMS provider management with automatic Twilio failover and AI-powered health monitoring</p>
      </div>

      {/* Provider Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Telnyx Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Telnyx (Primary)</h2>
                <p className="text-sm text-gray-500">API Key: KEY019C...AC76</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${getStatusColor(providerHealth?.telnyxStatus)}`}>
              {getStatusIcon(providerHealth?.telnyxStatus)}
              <span className="font-semibold capitalize">{providerHealth?.telnyxStatus || 'Unknown'}</span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Messaging Profile:</span>
              <span className="font-mono text-gray-900">40019c8c-069d-446f-a40e-aac86f7f15d8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-mono text-gray-900">+12345661030</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Health Check:</span>
              <span className="text-gray-900">{providerHealth?.telnyxLastCheck ? new Date(providerHealth?.telnyxLastCheck)?.toLocaleString() : 'Never'}</span>
            </div>
            {providerHealth?.telnyxError && (
              <div className="mt-2 p-2 bg-red-50 rounded text-red-700">
                <span className="font-semibold">Error:</span> {providerHealth?.telnyxError}
              </div>
            )}
          </div>

          {analytics?.telnyx && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">24h Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Total Sent</p>
                  <p className="text-lg font-bold text-gray-900">{analytics?.telnyx?.total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery Rate</p>
                  <p className="text-lg font-bold text-green-600">{analytics?.telnyx?.deliveryRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivered</p>
                  <p className="text-sm font-semibold text-gray-900">{analytics?.telnyx?.delivered}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Failed</p>
                  <p className="text-sm font-semibold text-red-600">{analytics?.telnyx?.failed}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Twilio Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Twilio (Fallback)</h2>
                <p className="text-sm text-gray-500">Automatic Failover</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${getStatusColor(providerHealth?.twilioStatus)}`}>
              {getStatusIcon(providerHealth?.twilioStatus)}
              <span className="font-semibold capitalize">{providerHealth?.twilioStatus || 'Unknown'}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Provider:</span>
              <span className="font-bold text-gray-900 capitalize">{providerHealth?.activeProvider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Health Check:</span>
              <span className="text-gray-900">{providerHealth?.twilioLastCheck ? new Date(providerHealth?.twilioLastCheck)?.toLocaleString() : 'Never'}</span>
            </div>
            {providerHealth?.twilioError && (
              <div className="mt-2 p-2 bg-red-50 rounded text-red-700">
                <span className="font-semibold">Error:</span> {providerHealth?.twilioError}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Filter className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Message Filtering Active</h4>
                <p className="text-xs text-yellow-700 mt-1">Gamification/Lottery/Prizes SMS blocked during Twilio failover. Only security, compliance, and operational messages allowed.</p>
              </div>
            </div>
          </div>

          {analytics?.twilio && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">24h Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Total Sent</p>
                  <p className="text-lg font-bold text-gray-900">{analytics?.twilio?.total}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery Rate</p>
                  <p className="text-lg font-bold text-green-600">{analytics?.twilio?.deliveryRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivered</p>
                  <p className="text-sm font-semibold text-gray-900">{analytics?.twilio?.delivered}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Failed</p>
                  <p className="text-sm font-semibold text-red-600">{analytics?.twilio?.failed}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Phone Routing for AI Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Admin Phone Routing (AI Failover Alerts)</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">Phone numbers that receive Telnyx SMS when OpenAI/Anthropic/Perplexity fail or degrade. Fallback: VITE_TELNYX_PHONE_NUMBER env.</p>
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="tel"
            placeholder="+1234567890"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Display name (optional)"
            value={newPhoneName}
            onChange={(e) => setNewPhoneName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button onClick={addAdminPhone} className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {adminPhones?.length === 0 ? (
            <p className="text-gray-500 text-sm">No admin phones configured. Add one above or set VITE_TELNYX_PHONE_NUMBER.</p>
          ) : (
            adminPhones?.map((c) => (
              <div key={c?.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-sm">{c?.phone_number}</span>
                {c?.display_name && <span className="text-gray-500 text-sm">{c?.display_name}</span>}
                <button onClick={() => removeAdminPhone(c?.id)} className="text-red-600 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MCQ Alert Phone Routing */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold text-gray-900">Admin Phone Routing (MCQ Alerts)</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">Phone numbers that receive Telnyx SMS when MCQ sync failures exceed 5%, accuracy drops &gt;15%, or sentiment negativity spikes. Resend email escalation also sent.</p>
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="tel"
            placeholder="+1234567890"
            value={newMcqPhone}
            onChange={(e) => setNewMcqPhone(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Display name (optional)"
            value={newMcqPhoneName}
            onChange={(e) => setNewMcqPhoneName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button onClick={addMcqAdminPhone} className="flex items-center gap-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
            <Plus className="w-4 h-4" /> Add MCQ Contact
          </button>
        </div>
        <div className="space-y-2">
          {mcqAdminPhones?.length === 0 ? (
            <p className="text-gray-500 text-sm">No MCQ alert phones configured. Add one above or set VITE_TELNYX_PHONE_NUMBER for fallback.</p>
          ) : (
            mcqAdminPhones?.map((c) => (
              <div key={c?.id} className="flex items-center justify-between py-2 px-3 bg-amber-50 rounded-lg">
                <span className="font-mono text-sm">{c?.phone_number}</span>
                {c?.display_name && <span className="text-gray-500 text-sm">{c?.display_name}</span>}
                <button onClick={() => removeMcqAdminPhone(c?.id)} className="text-red-600 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI-Powered Failover Engine */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Failover Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Health Detection</h3>
            <p className="text-sm text-blue-700">Identifies Telnyx failures within 2 seconds using intelligent health algorithms</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Automatic Switching</h3>
            <p className="text-sm text-green-700">Zero service interruption with instant Twilio failover activation</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">Recovery System</h3>
            <p className="text-sm text-purple-700">Monitors Telnyx restoration and seamlessly switches back automatically</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleManualHealthCheck}
            disabled={isMonitoring}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isMonitoring ? 'animate-spin' : ''}`} />
            <span>{isMonitoring ? 'Checking...' : 'Run Manual Health Check'}</span>
          </button>
        </div>
      </div>

      {/* Failover History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Failover History & Analytics</h2>
        
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Messages (24h)</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.total}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600">Failover Events</p>
              <p className="text-2xl font-bold text-orange-900">{analytics?.failoverCount}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Blocked Messages</p>
              <p className="text-2xl font-bold text-red-900">{analytics?.blockedCount}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Overall Success Rate</p>
              <p className="text-2xl font-bold text-green-900">
                {analytics?.total > 0 ? (((analytics?.telnyx?.delivered + analytics?.twilio?.delivered) / analytics?.total) * 100)?.toFixed(1) : 0}%
              </p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">From Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">To Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {failoverHistory?.length > 0 ? (
                failoverHistory?.map((event) => (
                  <tr key={event?.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(event?.triggeredAt)?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded capitalize">
                        {event?.fromProvider}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded capitalize">
                        {event?.toProvider}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event?.reason || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No failover events recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TelnyxSMSProviderManagementCenter;