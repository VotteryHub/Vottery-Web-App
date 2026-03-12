import React, { useState } from 'react';
import { Book, Code, Copy, Check, Play, ExternalLink } from 'lucide-react';

// Lottery REST API: use Supabase Edge when VITE_API_URL not set (Try-it works with Edge)
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const API_BASE = import.meta.env?.VITE_API_URL || (SUPABASE_URL ? `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1` : '');
// Map doc path to Edge path for Try-it (e.g. /api/tickets/verify -> tickets-verify with query)
const PATH_TO_EDGE = {
  '/api/tickets/verify': 'tickets-verify',
  '/api/draws/initiate': 'draws-initiate',
  '/api/audit/logs': 'audit-logs',
};

const APIDocumentationPanel = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [tryItEndpoint, setTryItEndpoint] = useState(null);
  const [tryItBody, setTryItBody] = useState('{}');
  const [tryItResponse, setTryItResponse] = useState(null);
  const [tryItLoading, setTryItLoading] = useState(false);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/lottery/create',
      description: 'Create a new lottery election',
      requestBody: {
        title: 'string',
        prizePool: 'number',
        numberOfWinners: 'number',
        drawDate: 'string (ISO 8601)'
      },
      response: {
        success: 'boolean',
        data: { electionId: 'string', lotteryTicketId: 'string' },
        message: 'string'
      }
    },
    {
      method: 'POST',
      path: '/api/lottery/participate',
      description: 'Cast vote and generate lottery ticket',
      requestBody: {
        electionId: 'string',
        selectedOptionId: 'string'
      },
      response: {
        success: 'boolean',
        data: { ticketId: 'string', voteId: 'string', blockchainHash: 'string' },
        message: 'string'
      }
    },
    {
      method: 'GET',
      path: '/api/lottery/results/:electionId',
      description: 'Get lottery results and winners',
      parameters: { electionId: 'string (path parameter)' },
      response: {
        success: 'boolean',
        data: { election: 'object', winners: 'array', totalPrizePool: 'number' }
      }
    },
    {
      method: 'GET',
      path: '/api/lottery/verify/:ticketId',
      description: 'Verify lottery ticket authenticity',
      parameters: { ticketId: 'string (path parameter)' },
      response: {
        success: 'boolean',
        data: { ticketId: 'string', valid: 'boolean', isWinner: 'boolean', prizeAmount: 'number' }
      }
    },
    {
      method: 'GET',
      path: '/api/tickets/verify',
      description: 'RESTful API: Verify ticket (Voter ID becomes ticket in Lotterized elections). Query params: ticketId or voterId.',
      parameters: { ticketId: 'string (query)', voterId: 'string (query)' },
      response: {
        success: 'boolean',
        data: { ticketId: 'string', valid: 'boolean', electionId: 'string', voteRecorded: 'boolean' }
      }
    },
    {
      method: 'POST',
      path: '/api/draws/initiate',
      description: 'Initiate draw for a Lotterized election. Server uses RNG; seed/hash published for verification.',
      requestBody: { electionId: 'string' },
      response: {
        success: 'boolean',
        data: { drawId: 'string', winners: 'array', seedHash: 'string' }
      }
    },
    {
      method: 'GET',
      path: '/api/audit/logs',
      description: 'Auditors retrieve logs (JSON: action, timestamp, userId, hash). Validate hash chain; cross-check draw results with published seeds.',
      parameters: { electionId: 'string (query)', limit: 'number (query)' },
      response: {
        success: 'boolean',
        data: { logs: 'array', chainValid: 'boolean' }
      }
    }
  ];

  const webhookEvents = [
    { event: 'draw_completed', description: 'Notifies the host system with draw results and winner details.' },
    { event: 'vote_cast', description: 'Ticket Purchased / Vote Casted: Notifies the host system of new ticket purchases (new vote casted).' }
  ];

  const copyToClipboard = (text, endpoint) => {
    navigator?.clipboard?.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Book className="w-6 h-6 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Documentation</h2>
          <p className="text-gray-600">Complete reference for lottery API endpoints</p>
        </div>
      </div>

      <div className="space-y-6">
        {endpoints?.map((endpoint, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    endpoint?.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {endpoint?.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{endpoint?.path}</code>
                </div>
                <p className="text-gray-600">{endpoint?.description}</p>
              </div>
              <button
                onClick={() => copyToClipboard(endpoint?.path, endpoint?.path)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copiedEndpoint === endpoint?.path ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>

            {endpoint?.requestBody && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Request Body
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800">
                    {JSON.stringify(endpoint?.requestBody, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {endpoint?.parameters && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800">
                    {JSON.stringify(endpoint?.parameters, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Response
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-800">
                  {JSON.stringify(endpoint?.response, null, 2)}
                </pre>
              </div>
            </div>

            {/* Try it */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Play className="w-4 h-4 text-green-600" />
                Try it
              </h4>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="API Key (Bearer)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {(endpoint?.method === 'POST' && endpoint?.requestBody) && (
                  <textarea
                    placeholder="Request body (JSON)"
                    value={tryItBody}
                    onChange={(e) => setTryItBody(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (!API_BASE) {
                      setTryItResponse({ error: 'Set VITE_SUPABASE_URL or VITE_API_URL in .env for Try-it.' });
                      return;
                    }
                    setTryItLoading(true);
                    setTryItEndpoint(endpoint);
                    setTryItResponse(null);
                    try {
                      let path = endpoint?.path?.replace(/:electionId/, 'demo-election-id')?.replace(/:ticketId/, 'demo-ticket-id');
                      const edgePath = PATH_TO_EDGE[path?.split('?')[0]];
                      const base = API_BASE.replace(/\/$/, '');
                      let url;
                      if (edgePath && SUPABASE_URL && base?.includes('/functions/v1')) {
                        url = `${base}/${edgePath}`;
                        if (path?.includes('/api/tickets/verify')) {
                          url += '?vote_id=00000000-0000-0000-0000-000000000001';
                          if (path?.includes('election')) url += '&election_id=demo-election-id';
                        } else if (path?.includes('/api/audit/logs')) {
                          url += '?election_id=demo-election-id&limit=10';
                        }
                      } else {
                        url = `${API_BASE}${path}`;
                      }
                      const opts = {
                        method: endpoint?.method,
                        headers: {
                          'Content-Type': 'application/json',
                          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
                        },
                      };
                      if (endpoint?.method === 'POST' && endpoint?.requestBody) {
                        try {
                          opts.body = JSON.stringify(JSON.parse(tryItBody || '{}'));
                        } catch {
                          opts.body = '{}';
                        }
                      }
                      const res = await fetch(url, opts);
                      const data = await res.json().catch(() => ({}));
                      setTryItResponse({ status: res.status, data });
                    } catch (err) {
                      setTryItResponse({ error: err?.message || 'Request failed' });
                    } finally {
                      setTryItLoading(false);
                    }
                  }}
                  disabled={tryItLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                >
                  {tryItLoading ? 'Executing…' : 'Execute'}
                </button>
                {tryItEndpoint?.path === endpoint?.path && tryItResponse && (
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-xs text-green-400 overflow-auto">
                      {JSON.stringify(tryItResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook events (Rough Dev. Docs: draw_completed, vote_cast) */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Webhook Events</h3>
        <p className="text-gray-600 mb-4">Configure in Webhook Management. Server dispatches to registered URLs with retry/backoff.</p>
        <div className="space-y-3">
          {webhookEvents?.map((w, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 flex items-start gap-3">
              <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono shrink-0">{w.event}</code>
              <p className="text-gray-700 text-sm">{w.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3rd party integration */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          3rd Party Integration
        </h3>
        <div className="space-y-3 text-gray-700">
          <p><strong>API keys:</strong> Obtain from Settings → API Keys (or contact support for partner keys). Use as <code className="bg-gray-100 px-1 rounded">Authorization: Bearer YOUR_KEY</code>.</p>
          <p><strong>Rate limits:</strong> Default 100 req/min per key; higher tiers available for enterprises.</p>
          <p><strong>Embed elections:</strong> Use iframe <code className="bg-gray-100 px-1 rounded">https://your-domain.com/election/&#123;id&#125;</code> or deep link <code className="bg-gray-100 px-1 rounded">vottery://election/&#123;id&#125;</code> for mobile.</p>
        </div>
      </div>

      {/* Authentication Guide */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Authentication</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700 mb-3">All API requests require authentication using Bearer token:</p>
          <div className="bg-white rounded p-3">
            <code className="text-sm text-gray-900">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentationPanel;