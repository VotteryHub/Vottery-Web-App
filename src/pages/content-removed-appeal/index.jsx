import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { moderationService } from '../../services/moderationService';

const ContentRemovedAppealPage = () => {
  const [removed, setRemoved] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [reason, setReason] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [removedRes, appealsRes] = await Promise.all([
        moderationService.getRemovedContentForUser(),
        moderationService.getMyAppeals(),
      ]);
      setRemoved(removedRes?.data || []);
      setAppeals(appealsRes?.data || []);
      setError(removedRes?.error?.message || appealsRes?.error?.message || null);
    } catch (e) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmitAppeal = async () => {
    if (!selectedContent || !reason.trim()) return;
    setSubmitting(selectedContent.contentId);
    setError(null);
    try {
      const { data, error: err } = await moderationService.submitAppealByContent({
        contentId: selectedContent.contentId,
        contentType: selectedContent.contentType,
        reason: reason.trim(),
      });
      if (err) throw new Error(err.message);
      setReason('');
      setSelectedContent(null);
      await load();
    } catch (e) {
      setError(e?.message || 'Failed to submit appeal');
    } finally {
      setSubmitting(null);
    }
  };

  const statusColor = (status) => {
    if (status === 'pending') return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    if (status === 'overturned') return 'bg-green-500/10 text-green-700 border-green-500/20';
    if (status === 'upheld' || status === 'dismissed') return 'bg-red-500/10 text-red-700 border-red-500/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <>
      <Helmet>
        <title>Content Removed &amp; Appeals - Vottery</title>
        <meta name="description" content="View removed content and submit or track appeals." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="max-w-[900px] mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
            Content Removed &amp; Appeals
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            If your content was removed, you can appeal. We review appeals within a few business days. See our{' '}
            <a href="/community-guidelines" className="text-primary underline">community guidelines</a> for policy details.
          </p>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Icon name="Loader" size={32} className="text-primary animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Removed content</h2>
                {removed.length === 0 ? (
                  <p className="text-muted-foreground text-sm">You have no removed content.</p>
                ) : (
                  <ul className="space-y-3">
                    {removed.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground capitalize">{item.contentType} • {item.violationType}</p>
                          <p className="text-sm text-foreground mt-1 line-clamp-2">{item.contentSnippet || 'Content removed'}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.appeal ? (
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${statusColor(item.appeal.status)}`}>
                              Appeal: {item.appeal.status}
                              {item.appeal.outcome && ` (${item.appeal.outcome})`}
                            </span>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedContent({ contentId: item.contentId, contentType: item.contentType })}
                            >
                              Appeal
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {selectedContent && (
                <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <h3 className="text-base font-semibold text-foreground mb-2">Submit appeal</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Explain why you believe this content should be restored (optional but helpful).
                  </p>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    placeholder="Your reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleSubmitAppeal}
                      disabled={submitting === selectedContent.contentId || !reason.trim()}
                    >
                      {submitting === selectedContent.contentId ? 'Submitting...' : 'Submit appeal'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedContent(null); setReason(''); }}>
                      Cancel
                    </Button>
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">My appeals</h2>
                {appeals.length === 0 ? (
                  <p className="text-muted-foreground text-sm">You have not submitted any appeals.</p>
                ) : (
                  <ul className="space-y-3">
                    {appeals.map((a) => (
                      <li key={a.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">{a.contentType} • {a.contentRef?.slice(0, 8)}...</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(a.status)}`}>
                            {a.status}
                            {a.outcome && ` (${a.outcome})`}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-2">{a.reason}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
                          {a.reviewedAt && ` • Reviewed ${new Date(a.reviewedAt).toLocaleString()}`}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ContentRemovedAppealPage;
