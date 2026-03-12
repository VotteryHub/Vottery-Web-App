import React, { useState, useEffect } from 'react';
import { Webhook, Plus, Trash2, ToggleLeft, ToggleRight, List, X } from 'lucide-react';
import { webhookService } from '../../../services/webhookService';

const WebhookManagementPanel = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [logsForId, setLogsForId] = useState(null);
  const [form, setForm] = useState({
    url: '',
    description: '',
    eventTypes: [],
    secret: ''
  });

  const eventTypes = webhookService?.getAvailableEventTypes?.() || [];

  const loadWebhooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await webhookService?.listWebhooks();
      if (err) throw new Error(err?.message);
      setWebhooks(data || []);
    } catch (e) {
      setError(e?.message || 'Failed to load webhooks');
      setWebhooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  const handleConfigure = async (e) => {
    e?.preventDefault();
    if (!form?.url?.trim()) return;
    try {
      const { error: err } = await webhookService?.configureWebhook({
        url: form.url.trim(),
        description: form.description?.trim() || undefined,
        eventTypes: form.eventTypes?.length ? form.eventTypes : eventTypes?.map(et => et?.id),
        secret: form.secret?.trim() || undefined
      });
      if (err) throw new Error(err?.message);
      setShowForm(false);
      setForm({ url: '', description: '', eventTypes: [], secret: '' });
      loadWebhooks();
    } catch (e) {
      setError(e?.message || 'Failed to configure webhook');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this webhook? This cannot be undone.')) return;
    try {
      const { error: err } = await webhookService?.deleteWebhook(id);
      if (err) throw new Error(err?.message);
      loadWebhooks();
      if (logsForId === id) setLogsForId(null);
    } catch (e) {
      setError(e?.message || 'Failed to delete webhook');
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      const { error: err } = await webhookService?.toggleWebhook(id, !isActive);
      if (err) throw new Error(err?.message);
      loadWebhooks();
    } catch (e) {
      setError(e?.message || 'Failed to toggle webhook');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Webhook className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Webhook Management</h2>
            <p className="text-gray-600">Create and manage partner webhooks for vote, draw, and payment events</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(true); setError(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" /> Add Webhook
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleConfigure} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
          <h3 className="font-semibold text-gray-900">New webhook</h3>
          <input
            type="url"
            placeholder="Endpoint URL (https://...)"
            value={form.url}
            onChange={(e) => setForm(f => ({ ...f, url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Secret for signing (optional)"
            value={form.secret}
            onChange={(e) => setForm(f => ({ ...f, secret: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading webhooks…</p>
      ) : webhooks?.length === 0 ? (
        <p className="text-gray-500">No webhooks configured. Add one to receive vote, draw, and payment events.</p>
      ) : (
        <ul className="space-y-3">
          {webhooks?.map((wh) => (
            <li key={wh?.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{wh?.url}</p>
                {wh?.description && <p className="text-sm text-gray-500 truncate">{wh?.description}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Events: {Array.isArray(wh?.eventTypes) ? wh.eventTypes.join(', ') : (wh?.eventTypes || 'all')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLogsForId(logsForId === wh?.id ? null : wh?.id)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                  title="View logs"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle(wh?.id, wh?.isActive)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                  title={wh?.isActive ? 'Disable' : 'Enable'}
                >
                  {wh?.isActive ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(wh?.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {logsForId === wh?.id && (
                <WebhookLogs webhookId={wh?.id} onClose={() => setLogsForId(null)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function WebhookLogs({ webhookId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await webhookService?.getWebhookLogs?.(webhookId, 20);
      if (mounted) {
        setLogs(data || []);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [webhookId]);

  return (
    <div className="w-full mt-3 p-3 bg-gray-50 rounded border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Recent deliveries</span>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : logs?.length === 0 ? (
        <p className="text-sm text-gray-500">No deliveries yet.</p>
      ) : (
        <ul className="text-xs space-y-1 max-h-40 overflow-auto">
          {logs?.map((log, i) => (
            <li key={log?.id || i} className="flex justify-between">
              <span>{log?.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}</span>
              <span className={log?.status === 'delivered' ? 'text-green-600' : log?.status === 'failed' ? 'text-red-600' : 'text-gray-500'}>{log?.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WebhookManagementPanel;
