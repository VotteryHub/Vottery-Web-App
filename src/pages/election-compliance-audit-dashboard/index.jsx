import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { votesService } from '../../services/votesService';
import { abstentionService } from '../../services/abstentionService';
import Icon from '../../components/AppIcon';

const ElectionComplianceAuditDashboard = () => {
  const [auditMarkers, setAuditMarkers] = useState([]);
  const [abstentionSummary, setAbstentionSummary] = useState({ total: 0, list: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [markersRes, abstentionRes] = await Promise.all([
        votesService?.getVoteAuditMarkers({ pageSize: 100 }),
        abstentionService?.getReportForAdmin({ pageSize: 50 })
      ]);
      if (markersRes?.data) setAuditMarkers(markersRes.data);
      if (abstentionRes?.data) setAbstentionSummary({ total: abstentionRes.total ?? 0, list: abstentionRes.data ?? [] });
      if (markersRes?.error || abstentionRes?.error) setError(markersRes?.error?.message || abstentionRes?.error?.message);
    } catch (e) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Election Compliance Audit
        </h1>
        <p className="text-muted-foreground mb-8">
          Vote change violations (audit markers) and abstention overview. Admin only.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

        <section className="card p-6 mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={22} />
            Vote change attempts (disallowed) — {auditMarkers.length}
          </h2>
          {auditMarkers.length === 0 ? (
            <p className="text-muted-foreground">No audit markers.</p>
          ) : (
            <ul className="space-y-3">
              {auditMarkers.slice(0, 50).map((m) => (
                <li key={m.id} className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-sm font-medium text-foreground">{m.elections?.title ?? m.electionId}</span>
                  <span className="text-xs text-muted-foreground">{m.userProfiles?.email ?? m.userId}</span>
                  <span className="text-xs text-warning">{m.reason}</span>
                  <span className="text-xs text-muted-foreground">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Users" size={22} />
            Abstentions (recent) — total {abstentionSummary.total}
          </h2>
          {abstentionSummary.list.length === 0 ? (
            <p className="text-muted-foreground">No abstentions in report.</p>
          ) : (
            <ul className="space-y-2">
              {abstentionSummary.list.slice(0, 30).map((a) => (
                <li key={a.id} className="flex flex-wrap gap-2 text-sm p-2 rounded bg-muted/30">
                  <span className="font-medium">{a.elections?.title ?? a.electionId}</span>
                  <span className="text-muted-foreground">{a.userProfiles?.email ?? a.userId}</span>
                  <span className="text-muted-foreground">{a.source}</span>
                  <span className="text-muted-foreground">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default ElectionComplianceAuditDashboard;
