import React, { useState, useEffect } from 'react';
import { Eye, Clock, Target, TrendingUp, Users, Zap, Award } from 'lucide-react';

const PerformancePreviewPanel = ({ videoFile, captions, hashtags, audio }) => {
  const [predictions, setPredictions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (videoFile && captions?.length > 0 && hashtags?.length > 0) {
      analyzePerformance();
    }
  }, [videoFile, captions, hashtags, audio]);

  const analyzePerformance = async () => {
    setIsAnalyzing(true);
    // Simulate ML-based performance prediction
    setTimeout(() => {
      setPredictions({
        watchTimePrediction: {
          averageWatchTime: '12.5s',
          completionRate: 78,
          retentionCurve: [100, 95, 88, 82, 78, 75, 72, 70, 68, 65],
        },
        viralCoefficient: {
          score: 8.7,
          maxScore: 10,
          factors: [
            { name: 'Content Quality', score: 9.2 },
            { name: 'Hashtag Optimization', score: 8.8 },
            { name: 'Audio Trending Score', score: 9.5 },
            { name: 'Caption Engagement', score: 7.5 },
          ],
        },
        isometricDeckPlacement: {
          position: 3,
          totalCards: 50,
          visibilityScore: 92,
          estimatedImpressions: '125K - 250K',
        },
        audienceInsights: {
          primaryDemographic: '18-24',
          peakEngagementTime: '7-9 PM',
          estimatedShares: '8.5K - 15K',
          estimatedComments: '2.1K - 4.5K',
        },
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  if (!predictions) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Performance Preview</h3>
        </div>
        <div className="text-center py-12">
          <Target className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <p className="text-white/60 font-medium">
            Complete video setup to see performance predictions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Eye className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Performance Preview</h3>
      </div>
      {/* Viral Coefficient */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h4 className="font-bold text-white">Viral Coefficient</h4>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-yellow-400">
              {predictions?.viralCoefficient?.score}
            </p>
            <p className="text-xs text-white/40">/ {predictions?.viralCoefficient?.maxScore}</p>
          </div>
        </div>
        <div className="space-y-2">
          {predictions?.viralCoefficient?.factors?.map((factor, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-300">{factor?.name}</span>
                <span className="text-white font-bold">{factor?.score}/10</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  style={{ width: `${(factor?.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Isometric Deck Placement */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Award className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-white">Isometric Deck Placement</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400">Predicted Position</p>
            <p className="text-2xl font-bold text-white">
              #{predictions?.isometricDeckPlacement?.position}
            </p>
            <p className="text-xs text-gray-400">
              of {predictions?.isometricDeckPlacement?.totalCards} cards
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Visibility Score</p>
            <p className="text-2xl font-bold text-green-400">
              {predictions?.isometricDeckPlacement?.visibilityScore}%
            </p>
            <p className="text-xs text-gray-400">High visibility</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Estimated Impressions</p>
          <p className="text-lg font-bold text-white">
            {predictions?.isometricDeckPlacement?.estimatedImpressions}
          </p>
        </div>
      </div>
      {/* Watch Time Prediction */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-5 h-5 text-blue-400" />
          <h4 className="font-bold text-white">Watch Time Analytics</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-400">Avg Watch Time</p>
            <p className="text-xl font-bold text-white">
              {predictions?.watchTimePrediction?.averageWatchTime}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Completion Rate</p>
            <p className="text-xl font-bold text-green-400">
              {predictions?.watchTimePrediction?.completionRate}%
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-2">Retention Curve</p>
          <div className="flex items-end space-x-1 h-16">
            {predictions?.watchTimePrediction?.retentionCurve?.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Audience Insights */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-5 h-5 text-green-400" />
          <h4 className="font-bold text-white">Audience Insights</h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Primary Demographic</span>
            <span className="text-white font-bold">
              {predictions?.audienceInsights?.primaryDemographic}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Peak Engagement</span>
            <span className="text-white font-bold">
              {predictions?.audienceInsights?.peakEngagementTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Est. Shares</span>
            <span className="text-green-400 font-bold">
              {predictions?.audienceInsights?.estimatedShares}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Est. Comments</span>
            <span className="text-blue-400 font-bold">
              {predictions?.audienceInsights?.estimatedComments}
            </span>
          </div>
        </div>
      </div>
      {/* Optimization Tips */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-white">Optimization Tips</h4>
        </div>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-green-400">✓</span>
            <span>Strong viral potential - publish during peak hours</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-400">⚠</span>
            <span>Consider adding more engaging captions in first 3 seconds</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-400">✓</span>
            <span>Hashtag selection is optimal for maximum reach</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PerformancePreviewPanel;