import React, { useState } from 'react';
import { contentQualityScoringService } from '../../services/contentQualityScoringService';

const ContentQualityScoringClaude = () => {
  const [contentType, setContentType] = useState('election');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onScore = async () => {
    if (!content.trim()) {
      setError('Please enter content before running Claude scoring.');
      return;
    }

    setError(null);
    setLoading(true);
    const { data, error: scoringError } = await contentQualityScoringService.scoreContent({
      content: content.trim(),
      contentType,
    });
    setResult(data);
    setError(scoringError || null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Content Quality Scoring (Claude)</h1>
        <p className="text-muted-foreground">
          Evaluate content for clarity, neutrality, and engagement before publishing.
        </p>

        <select
          className="border rounded px-3 py-2 bg-card"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="election">Election</option>
          <option value="moment">Moment</option>
          <option value="mcq">MCQ</option>
        </select>

        <textarea
          className="w-full min-h-44 border rounded p-3 bg-card"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste or write content to score..."
        />

        <button
          type="button"
          onClick={onScore}
          disabled={loading}
          className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-60"
        >
          {loading ? 'Scoring...' : 'Run Claude Scoring'}
        </button>

        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3 border rounded p-4 bg-card">
            <div>Clarity: {result.clarityScore}/100</div>
            <div>Neutrality: {result.neutralityScore}/100</div>
            <div>Engagement Prediction: {result.engagementPrediction}/100</div>
            <div>
              <div className="font-semibold">Suggestions</div>
              <ul className="list-disc pl-6">
                {(result.suggestions || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold">Rewritten Version</div>
              <p className="whitespace-pre-wrap">{result.rewrittenVersion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentQualityScoringClaude;
