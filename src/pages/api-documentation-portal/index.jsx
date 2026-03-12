import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const DEFAULT_BASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

const ApiDocumentationPortal = () => {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/rest/v1/elections');
  const [headers, setHeaders] = useState(
    `Content-Type: application/json\napikey: YOUR_SERVICE_ROLE_KEY_OR_ANON_KEY`
  );
  const [body, setBody] = useState('{\n  "example": "payload"\n}');
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseBody, setResponseBody] = useState('');

  const parsedHeaders = () => {
    try {
      const lines = headers
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      const result = {};
      for (const line of lines) {
        const [key, ...rest] = line.split(':');
        if (!key || !rest.length) continue;
        result[key.trim()] = rest.join(':').trim();
      }
      return result;
    } catch {
      return {};
    }
  };

  const handleSendRequest = async () => {
    if (!baseUrl || !path) return;
    setLoading(true);
    setResponseStatus(null);
    setResponseBody('');

    try {
      const url =
        path.startsWith('http://') || path.startsWith('https://')
          ? path
          : `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

      const options = {
        method,
        headers: parsedHeaders(),
      };

      if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
        try {
          options.body = JSON.stringify(JSON.parse(body));
        } catch {
          options.body = body;
        }
      }

      const res = await fetch(url, options);
      setResponseStatus(`${res.status} ${res.statusText}`);
      const text = await res.text();
      setResponseBody(text);
    } catch (err) {
      setResponseStatus('Request failed');
      setResponseBody(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>API Documentation Portal - Vottery</title>
        <meta
          name="description"
          content="Developer documentation and REST API explorer for Vottery. Explore elections, embeds, and webhooks for advertiser and enterprise integrations."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Developer API Documentation
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Explore Vottery&apos;s REST APIs for elections, embeds, and webhooks.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <Icon name="ShieldCheck" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Never paste real production keys here.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[380px,minmax(0,1fr)] gap-6">
            <section className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-4 md:p-5">
                <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  Quick Start
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  All APIs are served from your Supabase project. Use the REST endpoints
                  below with your project URL and API key.
                </p>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-foreground mb-1">Base URL</div>
                    <code className="block rounded bg-muted px-3 py-2 text-xs break-all">
                      {baseUrl || 'https://YOUR-PROJECT.supabase.co'}
                    </code>
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">
                      Authorization Header (example)
                    </div>
                    <code className="block rounded bg-muted px-3 py-2 text-xs break-all">
                      apikey: YOUR_ANON_OR_SERVICE_ROLE_KEY
                    </code>
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Key Resources</div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                      <li>
                        <span className="font-semibold text-foreground">Elections:</span>{' '}
                        <code>/rest/v1/elections</code>
                      </li>
                      <li>
                        <span className="font-semibold text-foreground">Votes:</span>{' '}
                        <code>/rest/v1/votes</code>
                      </li>
                      <li>
                        <span className="font-semibold text-foreground">Campaigns:</span>{' '}
                        <code>/rest/v1/brand_partnerships</code>
                      </li>
                      <li>
                        <span className="font-semibold text-foreground">Webhooks:</span>{' '}
                        <code>/rest/v1/webhooks</code>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 md:p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base md:text-lg font-semibold text-foreground">
                    Election Embed Guide
                  </h2>
                  <Icon name="Code2" size={18} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Embed live Vottery elections into your website or app. Use a public
                  election token and the embeddable widget URL.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="font-medium text-foreground">Embed URL (example)</div>
                  <code className="block rounded bg-muted px-3 py-2 break-all">
                    https://your-vottery-domain.com/embed/elections/&lt;election_id&gt;
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Pass viewer context (locale, theme, tracking parameters) via query
                    string for analytics attribution.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 md:p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base md:text-lg font-semibold text-foreground">
                    Webhook Management (Brand Partners &amp; Enterprises)
                  </h2>
                  <Icon name="Webhook" size={18} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure webhooks to receive real-time notifications for election
                  events, votes, payouts, fraud alerts, and advertiser campaigns.
                </p>
                <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                  <li>
                    <span className="font-semibold text-foreground">List endpoints:</span>{' '}
                    <code>GET /rest/v1/webhook_config</code> (with RLS; brand partners see their own rows).
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Add endpoint:</span>{' '}
                    <code>POST /rest/v1/webhook_config</code> with <code>url</code>, <code>events</code>, <code>enabled</code>.
                  </li>
                  <li>Store secrets (signing keys, shared tokens) in Supabase config, not in client code.</li>
                  <li>Verify webhook signatures before processing events.</li>
                </ul>
              </div>
            </section>

            <section className="bg-card border border-border rounded-xl p-4 md:p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base md:text-lg font-semibold text-foreground">
                  REST API Explorer
                </h2>
                <span className="text-xs text-muted-foreground">
                  For testing and prototyping only
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="px-2.5 py-2 rounded-md border border-border bg-background text-xs font-semibold"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <input
                      type="text"
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-xs"
                      placeholder="/rest/v1/elections"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    iconName={loading ? 'Loader' : 'Play'}
                    onClick={handleSendRequest}
                    disabled={loading}
                    className={loading ? 'animate-spin md:w-auto' : 'md:w-auto'}
                  >
                    Send
                  </Button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Base URL
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-xs"
                    placeholder="https://YOUR-PROJECT.supabase.co"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Headers (one per line, key: value)
                  </label>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-xs font-mono"
                  />
                </div>

                {method !== 'GET' && method !== 'HEAD' && (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Request Body
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">Response</span>
                    {responseStatus && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">
                        {responseStatus}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Trash2"
                    onClick={() => {
                      setResponseStatus(null);
                      setResponseBody('');
                    }}
                  />
                </div>
                <pre className="min-h-[180px] max-h-[420px] overflow-auto rounded-md bg-muted px-3 py-2 text-[11px] text-muted-foreground font-mono whitespace-pre-wrap">
{responseBody || '// Response will appear here'}
                </pre>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default ApiDocumentationPortal;

