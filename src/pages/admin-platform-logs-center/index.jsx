import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { platformLogService } from '../../services/platformLogService';

const LOG_LEVELS = ['all', 'debug', 'info', 'warn', 'error', 'critical'];
const LOG_CATEGORIES = [
  'all',
  'security',
  'payment',
  'voting',
  'ai_analysis',
  'user_activity',
  'performance',
  'fraud_detection',
  'authentication',
  'system',
  'api',
  'integration',
];

const AdminPlatformLogsCenter = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    logLevel: 'all',
    logCategory: 'all',
    source: 'all',
    search: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        platformLogService.getPlatformLogs(filters),
        platformLogService.getPlatformLogStatistics(),
      ]);
      setLogs(logsRes?.data || []);
      setStats(statsRes?.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.logLevel, filters.logCategory, filters.source]);

  const filteredLogs = useMemo(() => {
    if (!filters.search?.trim()) return logs;
    const q = filters.search.trim().toLowerCase();
    return logs.filter(
      (l) =>
        (l.message && String(l.message).toLowerCase().includes(q)) ||
        (l.eventType && String(l.eventType).toLowerCase().includes(q))
    );
  }, [logs, filters.search]);

  return (
    <>
      <Helmet>
        <title>Admin Platform Logs Center - Vottery</title>
        <meta
          name="description"
          content="Platform-wide operational logs from Supabase platform_logs: integrations, API, auth, payments, and system events."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Admin Platform Logs Center
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Live feed from <code className="text-xs">platform_logs</code> (distinct from admin human
                activity in Unified Admin Activity Log).
              </p>
            </div>
            <Button variant="outline" size="sm" iconName="RefreshCw" onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">Sample total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 col-span-2 md:col-span-3">
                <p className="text-xs text-muted-foreground mb-2">By level (recent sample)</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.byLevel || {}).map(([k, v]) => (
                    <span key={k} className="text-xs px-2 py-1 rounded-md bg-muted">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <select
              className="border border-border rounded-lg px-3 py-2 bg-card text-sm"
              value={filters.logLevel}
              onChange={(e) => setFilters((f) => ({ ...f, logLevel: e.target.value }))}
            >
              {LOG_LEVELS.map((l) => (
                <option key={l} value={l}>
                  Level: {l}
                </option>
              ))}
            </select>
            <select
              className="border border-border rounded-lg px-3 py-2 bg-card text-sm"
              value={filters.logCategory}
              onChange={(e) => setFilters((f) => ({ ...f, logCategory: e.target.value }))}
            >
              {LOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
            <select
              className="border border-border rounded-lg px-3 py-2 bg-card text-sm"
              value={filters.source}
              onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
            >
              <option value="all">Source: all</option>
              <option value="client">client</option>
              <option value="server">server</option>
              <option value="edge">edge</option>
            </select>
            <input
              type="search"
              placeholder="Search message or event type…"
              className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-sm"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Icon name="Loader" className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium">Time</th>
                      <th className="text-left p-3 font-medium">Level</th>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-left p-3 font-medium">Event</th>
                      <th className="text-left p-3 font-medium">Message</th>
                      <th className="text-left p-3 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No platform logs returned. Ensure you are signed in as an admin and that
                          services write to <code>platform_logs</code>.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((row) => (
                        <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                            {row.createdAt
                              ? new Date(row.createdAt).toLocaleString()
                              : '—'}
                          </td>
                          <td className="p-3">
                            <span className="text-xs font-medium uppercase">{row.logLevel}</span>
                          </td>
                          <td className="p-3 text-xs">{row.logCategory}</td>
                          <td className="p-3 text-xs font-mono max-w-[140px] truncate">
                            {row.eventType}
                          </td>
                          <td className="p-3 text-xs max-w-md">{row.message}</td>
                          <td className="p-3 text-xs">{row.source}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminPlatformLogsCenter;
