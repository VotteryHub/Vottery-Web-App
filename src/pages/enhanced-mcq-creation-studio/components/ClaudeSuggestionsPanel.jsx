import React, { useState, useCallback } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Check, RotateCcw, Loader, ArrowRight, TrendingUp, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import claudeMCQOptimizationService from '../../../services/claudeMCQOptimizationService';
import { supabase } from '../../../lib/supabase';

const FeedbackRating = ({ suggestionId, onFeedback }) => {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleRate = async (rating) => {
    if (selected || saving) return;
    setSaving(true);
    setSelected(rating);
    try {
      await supabase?.from('mcq_suggestion_feedback')?.insert({
        suggestion_id: suggestionId,
        rating,
        created_at: new Date()?.toISOString(),
      });
    } catch (_) {}
    onFeedback?.(rating);
    setSaving(false);
  };

  const buttons = [
    { id: 'helpful', label: 'Helpful', icon: ThumbsUp, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100', activeColor: 'bg-green-500 text-white border-green-500' },
    { id: 'not_helpful', label: 'Not Helpful', icon: ThumbsDown, color: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 hover:bg-red-100', activeColor: 'bg-red-500 text-white border-red-500' },
    { id: 'try_alternative', label: 'Try Alternative', icon: RefreshCw, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-100', activeColor: 'bg-blue-500 text-white border-blue-500' },
  ];

  return (
    <div className="border-t border-purple-200 dark:border-purple-700 pt-3 mt-3">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Was this suggestion helpful?</p>
      <div className="flex gap-2">
        {buttons?.map(btn => {
          const BtnIcon = btn?.icon;
          const isActive = selected === btn?.id;
          return (
            <button
              key={btn?.id}
              onClick={() => handleRate(btn?.id)}
              disabled={!!selected || saving}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all disabled:cursor-default ${
                isActive ? btn?.activeColor : selected ? 'opacity-40 ' + btn?.color : btn?.color
              }`}
            >
              <BtnIcon size={11} />
              {btn?.label}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
          <Check size={10} /> Feedback saved — thank you!
        </p>
      )}
    </div>
  );
};

const ClaudeSuggestionsPanel = ({ question, onApply }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);
  const [appliedSnapshot, setAppliedSnapshot] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    if (!question?.questionText?.trim()) {
      setError('Please enter question text first.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuggestions(null);
    setFeedbackGiven(false);
    try {
      const result = await claudeMCQOptimizationService?.improveQuestionClarity([question]);
      if (result?.error) throw new Error(result.error.message);
      const improved = result?.data?.[0];
      if (!improved) throw new Error('No suggestions returned');

      // Also get alternative options
      const altResult = await claudeMCQOptimizationService?.generateAlternativeOptions(question, question?.options || []);
      const altOptions = altResult?.data?.distractors || [];

      setSuggestions({
        id: `suggestion_${Date.now()}`,
        originalText: question?.questionText,
        improvedText: improved?.improvedQuestion || question?.questionText,
        clarityScore: improved?.clarityScore || 80,
        improvements: improved?.improvements || [],
        alternativeOptions: altOptions,
        effectivenessScore: Math.min(100, (improved?.clarityScore || 80) + 5),
      });
    } catch (e) {
      setError(e?.message || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  }, [question]);

  const handleApply = (applyOptions = false) => {
    if (!suggestions) return;
    setAppliedSnapshot({ questionText: question?.questionText, options: [...(question?.options || [])] });
    const updates = { questionText: suggestions?.improvedText };
    if (applyOptions && suggestions?.alternativeOptions?.length > 0) {
      updates.options = suggestions.alternativeOptions.map((o, i) => ({
        id: `opt_${Date.now()}_${i}`,
        text: typeof o === 'string' ? o : o?.text || o,
        isCorrect: false,
      }));
    }
    onApply(updates);
    setShowDiff(false);
  };

  const handleUndo = () => {
    if (!appliedSnapshot) return;
    onApply(appliedSnapshot);
    setAppliedSnapshot(null);
  };

  const handleFeedback = async (rating) => {
    setFeedbackGiven(true);
    if (rating === 'try_alternative') {
      // Auto-fetch new suggestions on "try alternative"
      await fetchSuggestions();
    }
  };

  const improvementPercent = suggestions
    ? Math.max(0, suggestions?.effectivenessScore - (question?.accuracy || 50))
    : 0;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600" />
          <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">Claude AI Suggestions</span>
        </div>
        <div className="flex items-center gap-2">
          {appliedSnapshot && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={11} />Undo
            </button>
          )}
          <button
            onClick={fetchSuggestions}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <><Loader size={11} className="animate-spin" />Analyzing...</> : <><Sparkles size={11} />Get Suggestions</>}
          </button>
        </div>
      </div>
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-3">{error}</div>
      )}
      {suggestions && (
        <div className="space-y-3">
          {/* Effectiveness Score */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3">
            <TrendingUp size={16} className="text-green-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Clarity Score</span>
                <span className="text-xs font-bold text-green-600">{suggestions?.clarityScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${suggestions?.clarityScore}%` }} />
              </div>
            </div>
            {improvementPercent > 0 && (
              <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">+{improvementPercent?.toFixed(0)}% predicted</span>
            )}
          </div>

          {/* Before/After Diff */}
          <div>
            <button
              onClick={() => setShowDiff(!showDiff)}
              className="flex items-center gap-1.5 text-xs text-purple-700 dark:text-purple-400 font-medium mb-2 hover:underline"
            >
              {showDiff ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showDiff ? 'Hide' : 'Show'} Before/After Comparison
            </button>
            {showDiff && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                  <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Before</div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{suggestions?.originalText}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">After</div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{suggestions?.improvedText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Improvements List */}
          {suggestions?.improvements?.length > 0 && (
            <div className="space-y-1">
              {suggestions?.improvements?.map((imp, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <ArrowRight size={10} className="text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          )}

          {/* Apply Buttons - 1-click apply for wording and/or options */}
          <div className="flex flex-col gap-2">
            {suggestions?.improvedText !== suggestions?.originalText && (
              <button
                onClick={() => handleApply(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors"
              >
                <Check size={13} />Apply Wording Only
              </button>
            )}
            {suggestions?.alternativeOptions?.length > 0 && (
              <button
                onClick={() => handleApply(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Check size={13} />Apply Wording + Alternative Options
              </button>
            )}
          </div>

          {/* 1-Tap Feedback Rating */}
          <FeedbackRating
            suggestionId={suggestions?.id}
            onFeedback={handleFeedback}
          />
        </div>
      )}
    </div>
  );
};

export default ClaudeSuggestionsPanel;
