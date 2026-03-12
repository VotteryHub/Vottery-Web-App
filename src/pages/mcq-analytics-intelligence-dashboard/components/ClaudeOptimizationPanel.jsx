import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { claudeMCQOptimizationService } from '../../../services/claudeMCQOptimizationService';
import toast from 'react-hot-toast';

const ClaudeOptimizationPanel = ({ lowPerformingQuestions = [], electionTopic = '', loading = false }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expandedRec, setExpandedRec] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (priority === 'medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-green-400 bg-green-500/10 border-green-500/30';
  };

  const runOptimizationAnalysis = async () => {
    if (!lowPerformingQuestions?.length) {
      toast?.error('No low-performing questions to analyze');
      return;
    }
    setAnalyzing(true);
    const { data, error } = await claudeMCQOptimizationService?.getOptimizationRecommendations(lowPerformingQuestions);
    setAnalyzing(false);
    if (error) {
      toast?.error(error?.message || 'Analysis failed');
      return;
    }
    setRecommendations(data || []);
    toast?.success('Optimization analysis complete');
  };

  const generateNewQuestions = async () => {
    if (!electionTopic) {
      toast?.error('No election topic available');
      return;
    }
    setGenerating(true);
    const { data, error } = await claudeMCQOptimizationService?.generateQuestionSuggestions(electionTopic);
    setGenerating(false);
    if (error) {
      toast?.error(error?.message || 'Generation failed');
      return;
    }
    setSuggestions(data || []);
    toast?.success('New question suggestions generated');
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-violet-500/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Claude MCQ Optimization</h3>
          <p className="text-gray-400 text-sm">AI-powered question improvement recommendations</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('recommendations')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'recommendations' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}>
          Recommendations
        </button>
        <button onClick={() => setActiveTab('suggestions')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'suggestions' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}>
          New Questions
        </button>
      </div>

      {activeTab === 'recommendations' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">{lowPerformingQuestions?.length} low-performing questions (accuracy &lt; 40%)</p>
            <button
              onClick={runOptimizationAnalysis}
              disabled={analyzing || loading || lowPerformingQuestions?.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {!recommendations?.length && !analyzing && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Sparkles className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Click Analyze to get Claude recommendations</p>
            </div>
          )}

          {analyzing && (
            <div className="flex flex-col items-center justify-center py-10">
              <RefreshCw className="w-10 h-10 text-violet-400 animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Claude is analyzing questions...</p>
            </div>
          )}

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recommendations?.map((rec, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden ${getPriorityColor(rec?.priorityLevel)}`}>
                <button onClick={() => setExpandedRec(expandedRec === i ? null : i)} className="w-full flex items-center justify-between p-3 text-left">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium line-clamp-1">{rec?.issue || `Issue ${i + 1}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full border capitalize">{rec?.priorityLevel || 'medium'}</span>
                    {expandedRec === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {expandedRec === i && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="p-2 bg-black/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Recommendation</p>
                      <p className="text-sm">{rec?.recommendation}</p>
                    </div>
                    {rec?.rewrittenQuestion && (
                      <div className="p-2 bg-black/20 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Suggested Rewrite</p>
                        <p className="text-sm">{rec?.rewrittenQuestion}</p>
                      </div>
                    )}
                    {rec?.expectedImprovementPercent && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-xs text-green-400">Expected improvement: +{rec?.expectedImprovementPercent}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'suggestions' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">Topic: {electionTopic || 'Not specified'}</p>
            <button
              onClick={generateNewQuestions}
              disabled={generating || !electionTopic}
              className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {!suggestions?.length && !generating && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Sparkles className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Generate new question suggestions with Claude</p>
            </div>
          )}

          {generating && (
            <div className="flex flex-col items-center justify-center py-10">
              <Sparkles className="w-10 h-10 text-violet-400 animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Claude is generating questions...</p>
            </div>
          )}

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {suggestions?.map((q, i) => (
              <div key={i} className="p-3 bg-gray-700/50 rounded-xl border border-gray-600">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-white text-sm font-medium">{q?.questionText}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    q?.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    q?.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>{q?.difficulty}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {q?.options?.map((opt, j) => (
                    <div key={j} className={`text-xs p-1.5 rounded-lg ${opt === q?.correctAnswer ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-600/50 text-gray-400'}`}>
                      {String.fromCharCode(65 + j)}. {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClaudeOptimizationPanel;
