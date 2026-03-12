import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Brain, RefreshCw, Calendar, Filter } from 'lucide-react';
import PerQuestionAccuracyPanel from './components/PerQuestionAccuracyPanel';
import AnswerDistributionPanel from './components/AnswerDistributionPanel';
import SentimentAnalysisPanel from './components/SentimentAnalysisPanel';
import DifficultyCorrelationPanel from './components/DifficultyCorrelationPanel';
import OverallMetricsPanel from './components/OverallMetricsPanel';
import ClaudeOptimizationPanel from './components/ClaudeOptimizationPanel';

const MCQAnalyticsIntelligenceDashboard = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [questions, setQuestions] = useState([]);
  const [freeTextResponses, setFreeTextResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [difficultyData, setDifficultyData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchAnalyticsData();
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const { data } = await supabase?.from('elections')?.select('id, title, topic')?.order('created_at', { ascending: false })?.limit(20);
      setElections(data || []);
      if (data?.length > 0) setSelectedElection(data?.[0]?.id);
    } catch (e) {}
  };

  const fetchAnalyticsData = async () => {
    if (!selectedElection) return;
    setLoading(true);
    try {
      const [questionsRes, responsesRes, attemptsRes, freeTextRes] = await Promise.all([
        supabase?.from('election_mcq_questions')?.select('*')?.eq('election_id', selectedElection)?.order('question_order', { ascending: true }),
        supabase?.from('voter_mcq_responses')?.select('*')?.eq('election_id', selectedElection),
        supabase?.from('voter_mcq_attempts')?.select('*')?.eq('election_id', selectedElection),
        supabase?.from('voter_free_text_responses')?.select('*')?.eq('election_id', selectedElection)
      ]);

      const qs = questionsRes?.data || [];
      const responses = responsesRes?.data || [];
      const attempts = attemptsRes?.data || [];
      const freeTexts = freeTextRes?.data || [];

      setFreeTextResponses(freeTexts);

      const enrichedQuestions = qs?.map(q => {
        const qResponses = responses?.filter(r => r?.question_id === q?.id);
        const totalResponses = qResponses?.length;
        const correctResponses = qResponses?.filter(r => r?.is_correct === true)?.length;
        const accuracy = totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0;

        const optionCounts = {};
        qResponses?.forEach(r => {
          const ans = r?.selected_answer || '';
          optionCounts[ans] = (optionCounts?.[ans] || 0) + 1;
        });

        const options = q?.options || [];
        const optionDistribution = options?.map(opt => ({
          text: opt,
          count: optionCounts?.[opt] || 0,
          percentage: totalResponses > 0 ? Math.round(((optionCounts?.[opt] || 0) / totalResponses) * 100) : 0,
          isCorrect: opt === q?.correct_answer
        }));

        return {
          ...q,
          questionText: q?.question_text || q?.text || '',
          accuracy,
          totalResponses,
          correctResponses,
          optionDistribution,
          difficulty: q?.difficulty || 'medium'
        };
      });

      setQuestions(enrichedQuestions);

      const diffStats = { easy: { count: 0, passRate: 0, avgAccuracy: 0, totalPass: 0 }, medium: { count: 0, passRate: 0, avgAccuracy: 0, totalPass: 0 }, hard: { count: 0, passRate: 0, avgAccuracy: 0, totalPass: 0 } };
      enrichedQuestions?.forEach(q => {
        const d = q?.difficulty || 'medium';
        if (diffStats?.[d]) {
          diffStats[d].count++;
          diffStats[d].avgAccuracy += q?.accuracy || 0;
        }
      });
      Object.keys(diffStats)?.forEach(d => {
        if (diffStats?.[d]?.count > 0) {
          diffStats[d].avgAccuracy = diffStats?.[d]?.avgAccuracy / diffStats?.[d]?.count;
          const passedAttempts = attempts?.filter(a => a?.passed);
          diffStats[d].passRate = attempts?.length > 0 ? (passedAttempts?.length / attempts?.length) * 100 : 0;
        }
      });
      setDifficultyData(diffStats);

      const totalAttempts = attempts?.length;
      const totalPassed = attempts?.filter(a => a?.passed)?.length;
      const avgScore = attempts?.length > 0 ? attempts?.reduce((sum, a) => sum + (a?.score_percentage || 0), 0) / attempts?.length : 0;
      const sortedByAccuracy = [...enrichedQuestions]?.sort((a, b) => (b?.accuracy || 0) - (a?.accuracy || 0));

      setMetrics({
        totalAttempts,
        totalPassed,
        passRate: totalAttempts > 0 ? (totalPassed / totalAttempts) * 100 : 0,
        avgScore,
        topAccuracy: sortedByAccuracy?.[0]?.accuracy || 0,
        questionRankings: sortedByAccuracy?.slice(0, 10)
      });

      setLastRefresh(new Date());
    } catch (e) {
      console.error('Analytics fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const lowPerformingQuestions = questions?.filter(q => (q?.accuracy || 0) < 40);
  const selectedElectionData = elections?.find(e => e?.id === selectedElection);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-700 bg-gray-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MCQ Analytics Intelligence</h1>
                <p className="text-gray-400 text-sm">Performance analysis & AI optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedElection}
                  onChange={(e) => setSelectedElection(e?.target?.value)}
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Election</option>
                  {elections?.map(e => (
                    <option key={e?.id} value={e?.id}>{e?.title || e?.id}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchAnalyticsData}
                disabled={loading || !selectedElection}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          {lastRefresh && (
            <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Last updated: {lastRefresh?.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {!selectedElection ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Brain className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">Select an election to view MCQ analytics</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerQuestionAccuracyPanel questions={questions} loading={loading} />
            <AnswerDistributionPanel questions={questions} loading={loading} />
            <SentimentAnalysisPanel freeTextResponses={freeTextResponses} loading={loading} />
            <DifficultyCorrelationPanel difficultyData={difficultyData} loading={loading} />
            <OverallMetricsPanel metrics={metrics} loading={loading} />
            <ClaudeOptimizationPanel
              lowPerformingQuestions={lowPerformingQuestions}
              electionTopic={selectedElectionData?.topic || selectedElectionData?.title || ''}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQAnalyticsIntelligenceDashboard;
