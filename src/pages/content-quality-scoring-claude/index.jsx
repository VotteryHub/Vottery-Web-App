import React, { useState } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <GeneralPageLayout title="Content Quality Scoring" showSidebar={true}>
      <div className="w-full py-0">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
            Content Quality Scoring
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium">
            Evaluate content for clarity, neutrality, and engagement before publishing.
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
          {/* Content Type Selector */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Content Type</label>
            <div className="flex gap-2">
              {[
                { value: 'election', label: 'Election', icon: 'Vote' },
                { value: 'moment', label: 'Moment', icon: 'Clock' },
                { value: 'mcq', label: 'MCQ', icon: 'CheckSquare' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setContentType(opt.value)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    contentType === opt.value
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <Icon name={opt.icon} size={14} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Content to Score</label>
            <textarea
              className="w-full min-h-[200px] border border-white/10 rounded-2xl p-5 bg-slate-950/50 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or write content to score..."
            />
          </div>

          {/* Score Button */}
          <button
            type="button"
            onClick={onScore}
            disabled={loading}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-[10px] uppercase tracking-widest hover:shadow-2xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
          >
            <Icon name="Sparkles" size={16} />
            {loading ? 'Scoring...' : 'Run Claude Scoring'}
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in">
              <Icon name="AlertCircle" size={20} className="text-red-400 flex-shrink-0" />
              <p className="text-sm font-bold text-red-400">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${getScoreBg(result.clarityScore)} rounded-2xl border p-6 text-center`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Clarity</p>
                  <p className={`text-4xl font-black ${getScoreColor(result.clarityScore)}`}>{result.clarityScore}</p>
                  <p className="text-[10px] font-bold text-slate-600 mt-1">/ 100</p>
                </div>
                <div className={`${getScoreBg(result.neutralityScore)} rounded-2xl border p-6 text-center`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neutrality</p>
                  <p className={`text-4xl font-black ${getScoreColor(result.neutralityScore)}`}>{result.neutralityScore}</p>
                  <p className="text-[10px] font-bold text-slate-600 mt-1">/ 100</p>
                </div>
                <div className={`${getScoreBg(result.engagementPrediction)} rounded-2xl border p-6 text-center`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Engagement</p>
                  <p className={`text-4xl font-black ${getScoreColor(result.engagementPrediction)}`}>{result.engagementPrediction}</p>
                  <p className="text-[10px] font-bold text-slate-600 mt-1">/ 100</p>
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="bg-white/5 rounded-2xl border border-white/5 p-6">
                  <h3 className="font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Icon name="Lightbulb" size={18} className="text-yellow-400" />
                    Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {result.suggestions.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Icon name="ChevronRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rewritten Version */}
              {result.rewrittenVersion && (
                <div className="bg-white/5 rounded-2xl border border-white/5 p-6">
                  <h3 className="font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Icon name="Wand2" size={18} className="text-purple-400" />
                    Rewritten Version
                  </h3>
                  <p className="text-slate-300 whitespace-pre-wrap font-medium leading-relaxed">{result.rewrittenVersion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default ContentQualityScoringClaude;
