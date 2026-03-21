import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { claudeCreatorSuccessService } from '../../../services/claudeCreatorSuccessService';

const CreatorHealthPanel = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setError(null);
      const result = await claudeCreatorSuccessService?.getCreatorHealthScores();
      if (result?.error) {
        setHealthData([]);
        setError(result?.error);
        return;
      }
      if (result?.data) {
        setHealthData(result?.data);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (creatorId) => {
    try {
      setAnalyzing(creatorId);
      await claudeCreatorSuccessService?.analyzeCreatorWithClaude(creatorId);
      await loadHealthData();
    } catch (error) {
      console.error('Error analyzing creator:', error);
    } finally {
      setAnalyzing(null);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskBadge = (level) => {
    const badges = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-red-100 text-red-700 border-red-200',
      critical: 'bg-red-200 text-red-800 border-red-300',
    };
    return badges?.[level] || badges?.medium;
  };

  const normalizeHealthScore = (score) => {
    const value = Number(score);
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
  };

  const normalizeChurnRiskPercent = (risk) => {
    const value = Number(risk);
    if (!Number.isFinite(value)) return 0;
    const ratio = value <= 1 ? value : value / 100;
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading creator health data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon name={Activity} size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Creator Health Monitoring</h2>
        </div>
        <p className="text-gray-600">
          Real-time health scores and engagement pattern analysis for all creators
        </p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
          {/not authenticated/i?.test(error)
            ? 'Sign in required to view creator health monitoring data.'
            : `Unable to load health data: ${error}`}
        </div>
      )}

      {/* Health Scores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {healthData?.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Icon name={AlertCircle} size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No creator health data available yet</p>
          </div>
        ) : (
          healthData?.map((creator) => (
            <div
              key={creator?.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                        getHealthColor(normalizeHealthScore(creator?.healthScore))
                      }`}
                    >
                      {normalizeHealthScore(creator?.healthScore)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Creator #{creator?.creatorId?.slice(0, 8)}</h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                          getRiskBadge(creator?.riskLevel)
                        }`}
                      >
                        {(creator?.riskLevel || 'medium')?.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAnalyze(creator?.creatorId)}
                  disabled={analyzing === creator?.creatorId}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {analyzing === creator?.creatorId ? 'Analyzing...' : 'Re-analyze'}
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Engagement Trend</span>
                  <div className="flex items-center gap-1">
                    {creator?.engagementTrend === 'increasing' ? (
                      <Icon name={TrendingUp} size={16} className="text-green-600" />
                    ) : creator?.engagementTrend === 'decreasing' ? (
                      <Icon name={TrendingDown} size={16} className="text-red-600" />
                    ) : (
                      <Icon name={Activity} size={16} className="text-gray-600" />
                    )}
                    <span className="font-medium capitalize">{creator?.engagementTrend}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Churn Risk</span>
                  <span className="font-medium">{normalizeChurnRiskPercent(creator?.churnRisk)}%</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Active</span>
                  <span className="font-medium">
                    {creator?.lastActiveAt
                      ? new Date(creator?.lastActiveAt)?.toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Monitored</span>
                  <span className="font-medium">
                    {creator?.monitoredAt
                      ? new Date(creator?.monitoredAt)?.toLocaleTimeString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreatorHealthPanel;