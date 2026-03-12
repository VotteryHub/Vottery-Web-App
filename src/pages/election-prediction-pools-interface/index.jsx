import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { predictionPoolService } from '../../services/predictionPoolService';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import PredictionSliders from './components/PredictionSliders';
import LiveLeaderboard from './components/LiveLeaderboard';

import PredictionStats from './components/PredictionStats';

const ElectionPredictionPoolsInterface = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const electionId = searchParams?.get('election');

  const [election, setElection] = useState(null);
  const [elections, setElections] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPrediction, setUserPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resolutionData, setResolutionData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('predict');
  const [selectedElectionId, setSelectedElectionId] = useState(electionId || '');
  const leaderboardRef = useRef(null);

  // Load elections list
  useEffect(() => {
    const loadElections = async () => {
      try {
        const { data } = (await electionsService?.getAll?.()) || { data: [] };
        const activeElections = (data || [])?.filter(e => e?.status === 'active' || e?.status === 'open');
        setElections(activeElections);
        if (!selectedElectionId && activeElections?.length > 0) {
          setSelectedElectionId(activeElections?.[0]?.id);
        }
      } catch (err) {
        console.error('Failed to load elections:', err);
      }
    };
    loadElections();
  }, []);

  // Load election and predictions when election changes
  useEffect(() => {
    if (!selectedElectionId) { setLoading(false); return; }
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: electionData } = (await electionsService?.getById?.(selectedElectionId)) || {};
        setElection(electionData);

        // Load leaderboard
        const { data: lb } = await predictionPoolService?.getPredictionLeaderboard(selectedElectionId);
        setLeaderboard(lb || []);

        // Load user's existing prediction
        if (user?.id) {
          const { data: userPred } = await predictionPoolService?.getUserPrediction(selectedElectionId, user?.id);
          if (userPred) {
            setUserPrediction(userPred);
            setSubmitted(true);
            // Convert back to percentage for display
            const displayPreds = {};
            Object.entries(userPred?.predictions || {})?.forEach(([k, v]) => {
              displayPreds[k] = Math.round(parseFloat(v) * 100);
            });
            setPredictions(displayPreds);
          }
        }
      } catch (err) {
        setError(err?.message || 'Failed to load prediction data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedElectionId, user?.id]);

  // Real-time leaderboard subscription (updates every 15 seconds)
  useEffect(() => {
    if (!selectedElectionId) return;
    const channel = supabase
      ?.channel(`predictions_${selectedElectionId}`)
      ?.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'election_predictions',
        filter: `election_id=eq.${selectedElectionId}`
      }, async () => {
        const { data: lb } = await predictionPoolService?.getPredictionLeaderboard(selectedElectionId);
        setLeaderboard(lb || []);
      })
      ?.subscribe();

    const interval = setInterval(async () => {
      const { data: lb } = await predictionPoolService?.getPredictionLeaderboard(selectedElectionId);
      setLeaderboard(lb || []);
    }, 15000);

    return () => {
      supabase?.removeChannel(channel);
      clearInterval(interval);
    };
  }, [selectedElectionId]);

  // Initialize predictions from election options
  useEffect(() => {
    if (election && !submitted) {
      const options = election?.options || election?.candidates || [];
      if (options?.length > 0) {
        const equalShare = Math.floor(100 / options?.length);
        const initial = {};
        options?.forEach((opt, idx) => {
          const key = opt?.id || opt?.text || `option_${idx}`;
          initial[key] = idx === 0 ? 100 - (equalShare * (options?.length - 1)) : equalShare;
        });
        setPredictions(initial);
      }
    }
  }, [election, submitted]);

  const handleSliderChange = (optionKey, value) => {
    const numVal = parseInt(value) || 0;
    const otherKeys = Object.keys(predictions)?.filter(k => k !== optionKey);
    const remaining = 100 - numVal;
    const otherTotal = otherKeys?.reduce((sum, k) => sum + (predictions?.[k] || 0), 0);

    const newPreds = { ...predictions, [optionKey]: numVal };
    if (otherTotal > 0 && otherKeys?.length > 0) {
      otherKeys?.forEach(k => {
        newPreds[k] = Math.round((predictions?.[k] / otherTotal) * remaining);
      });
      // Fix rounding
      const newTotal = Object.values(newPreds)?.reduce((s, v) => s + v, 0);
      if (newTotal !== 100) {
        const lastKey = otherKeys?.[otherKeys?.length - 1];
        newPreds[lastKey] = Math.max(0, newPreds?.[lastKey] + (100 - newTotal));
      }
    }
    setPredictions(newPreds);
  };

  const handleSubmit = async () => {
    if (!user?.id) { setError('Please log in to submit predictions'); return; }
    if (!selectedElectionId) { setError('Please select an election'); return; }
    const total = Object.values(predictions)?.reduce((s, v) => s + v, 0);
    if (Math.abs(total - 100) > 1) { setError('Predictions must sum to 100%'); return; }

    setSubmitting(true);
    setError('');
    try {
      const { data, error: submitError } = await predictionPoolService?.createPrediction(
        selectedElectionId, user?.id, predictions
      );
      if (submitError) throw new Error(submitError.message);
      setUserPrediction(data);
      setSubmitted(true);
      setSuccess('Prediction submitted! +20 VP awarded. Good luck!');
      setTimeout(() => setSuccess(''), 5000);
      // Refresh leaderboard
      const { data: lb } = await predictionPoolService?.getPredictionLeaderboard(selectedElectionId);
      setLeaderboard(lb || []);
    } catch (err) {
      setError(err?.message || 'Failed to submit prediction');
    } finally {
      setSubmitting(false);
    }
  };

  const options = election?.options || election?.candidates || [];
  const totalPrediction = Object.values(predictions)?.reduce((s, v) => s + v, 0);
  const isValid = Math.abs(totalPrediction - 100) <= 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderNavigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Election Prediction Pools</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Predict outcomes using probability sliders • Earn VP based on accuracy</p>
            </div>
          </div>

          {/* Election Selector */}
          <div className="mt-4">
            <select
              value={selectedElectionId}
              onChange={e => { setSelectedElectionId(e?.target?.value); setSubmitted(false); setUserPrediction(null); }}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select an election to predict...</option>
              {elections?.map(e => (
                <option key={e?.id} value={e?.id}>{e?.title || e?.name || `Election ${e?.id?.slice(0, 8)}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
          {['predict', 'leaderboard', 'history']?.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'predict' ? '🎯 Predict' : tab === 'leaderboard' ? '🏆 Leaderboard' : '📊 History'}
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
            ✅ {success}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading prediction pool...</span>
          </div>
        ) : !selectedElectionId ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Select an Election</h3>
            <p className="text-gray-500 dark:text-gray-400">Choose an active election above to start predicting outcomes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'predict' && (
                <PredictionSliders
                  election={election}
                  options={options}
                  predictions={predictions}
                  onSliderChange={handleSliderChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  submitted={submitted}
                  isValid={isValid}
                  totalPrediction={totalPrediction}
                  userPrediction={userPrediction}
                />
              )}
              {activeTab === 'leaderboard' && (
                <LiveLeaderboard
                  leaderboard={leaderboard}
                  userId={user?.id}
                  electionTitle={election?.title || election?.name}
                />
              )}
              {activeTab === 'history' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Prediction History</h3>
                  {userPrediction ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Your Prediction</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(userPrediction?.created_at)?.toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            userPrediction?.is_resolved
                              ? 'bg-green-100 text-green-800' :'bg-yellow-100 text-yellow-800'
                          }`}>
                            {userPrediction?.is_resolved ? 'Resolved' : 'Pending'}
                          </span>
                        </div>
                        {userPrediction?.brier_score != null && (
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                              <p className="text-2xl font-bold text-purple-600">{(userPrediction?.brier_score)?.toFixed(4)}</p>
                              <p className="text-xs text-gray-500">Brier Score</p>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                              <p className="text-2xl font-bold text-green-600">+{userPrediction?.vp_awarded || 0} VP</p>
                              <p className="text-xs text-gray-500">VP Earned</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No predictions yet for this election</p>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <PredictionStats election={election} leaderboard={leaderboard} userId={user?.id} />
              {/* Mini Leaderboard */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">🏆 Top Predictors</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Updates every 15s</span>
                </div>
                {leaderboard?.slice(0, 5)?.map((entry, idx) => (
                  <div key={entry?.id} className={`flex items-center gap-3 py-2 ${
                    entry?.user_id === user?.id ? 'bg-purple-50 dark:bg-purple-900/20 rounded-lg px-2' : ''
                  }`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                      idx === 1 ? 'bg-gray-300 text-gray-700' :
                      idx === 2 ? 'bg-orange-400 text-orange-900': 'bg-gray-100 text-gray-600'
                    }`}>{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {entry?.user?.username || entry?.user?.full_name || 'Anonymous'}
                        {entry?.user_id === user?.id && ' (You)'}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                      {entry?.accuracyPercent != null ? `${entry?.accuracyPercent}%` : 'Pending'}
                    </span>
                  </div>
                ))}
                {leaderboard?.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No resolved predictions yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionPredictionPoolsInterface;
