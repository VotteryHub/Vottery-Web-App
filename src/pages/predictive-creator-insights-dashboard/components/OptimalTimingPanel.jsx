import React, { useState } from 'react';
import { Clock, Zap, Globe, TrendingUp, RefreshCw, CheckCircle } from 'lucide-react';


const OptimalTimingPanel = ({ creatorData }) => {
  const [timingData, setTimingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const MOCK_TIMING = {
    bestDays: [
      { day: 'Tuesday', score: 94, reason: 'Peak audience activity window' },
      { day: 'Thursday', score: 91, reason: 'High engagement before weekend' },
      { day: 'Wednesday', score: 87, reason: 'Mid-week decision-making peak' },
    ],
    bestHours: [
      { hour: '7:00 PM - 9:00 PM EST', score: 96, zone: 'Zone 1-3 (High Purchasing Power)' },
      { hour: '12:00 PM - 2:00 PM EST', score: 88, zone: 'Zone 4-6 (Middle Income)' },
      { hour: '8:00 AM - 10:00 AM EST', score: 82, zone: 'Zone 7-8 (Emerging Markets)' },
    ],
    zoneOptimization: [
      { zone: 'Ultra High ($100k+)', bestTime: '7-9 PM EST', engagement: '94%', revenue: '$45/vote' },
      { zone: 'High ($75k-100k)', bestTime: '6-8 PM EST', engagement: '89%', revenue: '$32/vote' },
      { zone: 'Middle ($45-75k)', bestTime: '12-2 PM EST', engagement: '76%', revenue: '$18/vote' },
    ],
    competitiveLandscape: 'Low competition on Tuesday evenings — 23% fewer elections active',
    confidence: 91
  };

  const analyzeOptimalTiming = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setTimingData(MOCK_TIMING);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Optimal Timing Intelligence
        </h3>
        <button
          onClick={analyzeOptimalTiming}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Analyze Timing'}
        </button>
      </div>
      {!timingData && !loading && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Click "Analyze Timing" to get AI-powered posting time recommendations</p>
        </div>
      )}
      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Analyzing audience behavior patterns...</p>
        </div>
      )}
      {timingData && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-indigo-700 dark:text-indigo-300">AI Confidence: <strong>{timingData?.confidence}%</strong> — {timingData?.competitiveLandscape}</span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Best Days to Post
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {timingData?.bestDays?.map((d, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{d?.day}</p>
                  <p className="text-2xl font-bold text-indigo-600">{d?.score}</p>
                  <p className="text-xs text-gray-500">{d?.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Best Hours by Zone
            </h4>
            <div className="space-y-2">
              {timingData?.bestHours?.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{h?.hour}</p>
                    <p className="text-xs text-gray-500">{h?.zone}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600">{h?.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Zone Revenue Optimization
            </h4>
            <div className="space-y-2">
              {timingData?.zoneOptimization?.map((z, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{z?.zone}</p>
                    <p className="text-xs text-gray-500">Best: {z?.bestTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{z?.revenue}</p>
                    <p className="text-xs text-gray-500">{z?.engagement} engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimalTimingPanel;
