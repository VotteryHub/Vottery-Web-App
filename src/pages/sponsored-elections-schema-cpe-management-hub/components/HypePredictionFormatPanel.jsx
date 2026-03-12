import React from 'react';
import { TrendingUp, Zap, Award, Clock } from 'lucide-react';

const HypePredictionFormatPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Hype Prediction Election Format
        </h2>
        <p className="text-gray-600 mb-6">
          Anticipation-based campaigns that leverage gamification to drive engagement and viral amplification
        </p>

        {/* Timeline Predictions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Timeline Prediction Mechanics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-gray-900 mb-3">Movie Release Prediction</div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-blue-300">
                  <div className="text-sm font-medium text-gray-900">Question: Will this movie score above 80% on Rotten Tomatoes?</div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded font-medium text-sm hover:bg-green-200">
                      Yes, Above 80%
                    </button>
                    <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded font-medium text-sm hover:bg-red-200">
                      No, Below 80%
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    🎯 Correct predictions earn "Oracle" badge + 500 XP bonus
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-medium text-gray-900 mb-3">Product Launch Prediction</div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-purple-300">
                  <div className="text-sm font-medium text-gray-900">Question: How many units will sell in first week?</div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded font-medium text-sm hover:bg-purple-200">
                      &lt; 10K
                    </button>
                    <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded font-medium text-sm hover:bg-purple-200">
                      10K-50K
                    </button>
                    <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded font-medium text-sm hover:bg-purple-200">
                      50K-100K
                    </button>
                    <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded font-medium text-sm hover:bg-purple-200">
                      &gt; 100K
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    📊 Closest prediction wins exclusive early access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Viral Coefficient Tracking */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Viral Coefficient Tracking
          </h3>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">2.4x</div>
                <div className="text-sm text-gray-600 mt-1">Share Rate</div>
                <div className="text-xs text-gray-500">Avg shares per vote</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">68%</div>
                <div className="text-sm text-gray-600 mt-1">Engagement Rate</div>
                <div className="text-xs text-gray-500">Users who vote after viewing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">1.8x</div>
                <div className="text-sm text-gray-600 mt-1">Viral Multiplier</div>
                <div className="text-xs text-gray-500">Organic reach amplification</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">42s</div>
                <div className="text-sm text-gray-600 mt-1">Avg Watch Time</div>
                <div className="text-xs text-gray-500">For video content</div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Amplification Rewards */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Engagement Amplification Rewards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">🎖️</div>
                <div className="font-semibold text-gray-900">Early Adopter Bonus</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">First 100 voters:</span>
                  <span className="font-medium text-green-600">3x XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">First 500 voters:</span>
                  <span className="font-medium text-green-600">2x XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">All others:</span>
                  <span className="font-medium text-green-600">1.5x XP</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">🔮</div>
                <div className="font-semibold text-gray-900">Trend Identification</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Predict viral content early</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Earn "Trendsetter" badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Unlock exclusive campaigns</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">🎯</div>
                <div className="font-semibold text-gray-900">Accuracy Rewards</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct prediction:</span>
                  <span className="font-medium text-purple-600">500 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5 correct in a row:</span>
                  <span className="font-medium text-purple-600">Badge</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10 correct in a row:</span>
                  <span className="font-medium text-purple-600">Legendary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Campaign */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">🎬 Example: Movie Trailer Campaign</h3>
          <p className="text-purple-100 mb-4">
            A studio releases a blockbuster trailer and wants to measure hype:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Users watch the 2-minute trailer (tracked for engagement)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Vote: "Will this movie gross over $500M worldwide?"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Early voters get 3x XP, creating urgency and viral sharing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>After release, correct predictors earn "Film Oracle" badge + bonus rewards</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              <span>Studio gets real-time sentiment data + 50K engaged viewers in 48 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HypePredictionFormatPanel;