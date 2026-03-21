import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { GitCompare, Play, Loader2 } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import { claudeModelComparisonService } from '../../services/claudeModelComparisonService';

export default function ClaudeModelComparisonCenter() {
  const [prompt, setPrompt] = useState(
    'Summarize the key risks of running AI failover without circuit breakers, in 3 bullet points.'
  );
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      const out = await claudeModelComparisonService.compareModels(prompt);
      setResult(out);
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Claude Model Comparison Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-background p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <GitCompare className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Claude Model Comparison</h1>
            <p className="text-muted-foreground text-sm">
              Run the same task on Haiku, Sonnet, and Opus; compare latency and token usage.
            </p>
          </div>
        </div>

        <label className="block text-sm font-medium mb-2">Task</label>
        <textarea
          className="w-full min-h-[120px] rounded-lg border border-border bg-card p-3 text-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={run} disabled={running || !prompt.trim()}>
            {running ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running…
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Run comparison
              </>
            )}
          </Button>
        </div>

        {result?.error && (
          <p className="mt-4 text-destructive text-sm">{result.error}</p>
        )}

        {result?.recommendation && (
          <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-sm font-semibold">Suggested for latency-first tasks</p>
            <p className="text-sm text-muted-foreground">
              {result.recommendation.label} ({result.recommendation.modelId})
            </p>
            <p className="text-xs text-muted-foreground mt-1">{result.recommendation.reason}</p>
          </div>
        )}

        {result?.results && (
          <div className="mt-8 space-y-4">
            {result.results.map((r) => (
              <div
                key={r.modelId}
                className="rounded-xl border border-border p-4 bg-card"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold">{r.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">{r.modelId}</p>
                  </div>
                  <div className="text-right text-sm">
                    {r.error ? (
                      <span className="text-destructive">{r.error}</span>
                    ) : (
                      <>
                        <p>{r.latencyMs} ms</p>
                        <p className="text-muted-foreground text-xs">
                          in {r.inputTokens ?? '—'} / out {r.outputTokens ?? '—'} tok
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {r.text && (
                  <pre className="mt-3 text-sm whitespace-pre-wrap text-muted-foreground max-h-48 overflow-auto">
                    {r.text}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
