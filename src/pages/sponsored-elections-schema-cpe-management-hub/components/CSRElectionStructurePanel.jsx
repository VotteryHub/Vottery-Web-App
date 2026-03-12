import React from 'react';
import { Heart, DollarSign, TrendingUp, Users } from 'lucide-react';

const CSRElectionStructurePanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-green-600" />
          Corporate Social Responsibility Election Structure
        </h2>
        <p className="text-gray-600 mb-6">
          Purpose-driven campaigns that build positive brand sentiment through community benefit and transparent impact
        </p>

        {/* Cause Alignment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Cause Alignment Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-3xl mb-2">🌍</div>
              <div className="font-semibold text-gray-900">Environmental</div>
              <div className="text-sm text-gray-600 mt-1">Ocean cleanup, reforestation, carbon offset</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-3xl mb-2">🏫</div>
              <div className="font-semibold text-gray-900">Education</div>
              <div className="text-sm text-gray-600 mt-1">Scholarships, school supplies, literacy programs</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <div className="text-3xl mb-2">❤️</div>
              <div className="font-semibold text-gray-900">Healthcare</div>
              <div className="text-sm text-gray-600 mt-1">Medical research, hospital funding, wellness</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="text-3xl mb-2">🍽️</div>
              <div className="font-semibold text-gray-900">Hunger Relief</div>
              <div className="text-sm text-gray-600 mt-1">Food banks, meal programs, agriculture support</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-3xl mb-2">🏠</div>
              <div className="font-semibold text-gray-900">Housing</div>
              <div className="text-sm text-gray-600 mt-1">Homeless shelters, affordable housing, community development</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
              <div className="text-3xl mb-2">👶</div>
              <div className="font-semibold text-gray-900">Children's Welfare</div>
              <div className="text-sm text-gray-600 mt-1">Foster care, child protection, youth programs</div>
            </div>
          </div>
        </div>

        {/* Impact Measurement */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Impact Measurement Dashboard
          </h3>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$50,000</div>
                <div className="text-sm text-gray-600 mt-1">Total Donated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">12,450</div>
                <div className="text-sm text-gray-600 mt-1">Votes Cast</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600 mt-1">Charities Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">89%</div>
                <div className="text-sm text-gray-600 mt-1">Positive Sentiment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Benefit Tracking */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Community Benefit Tracking
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">Ocean Cleanup Initiative</div>
                <div className="text-sm font-medium text-green-600">60% of votes</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="text-sm text-gray-600">$30,000 allocated • 7,470 votes</div>
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">Reforestation Project</div>
                <div className="text-sm font-medium text-blue-600">30% of votes</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <div className="text-sm text-gray-600">$15,000 allocated • 3,735 votes</div>
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">Wildlife Conservation</div>
                <div className="text-sm font-medium text-purple-600">10% of votes</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
              <div className="text-sm text-gray-600">$5,000 allocated • 1,245 votes</div>
            </div>
          </div>
        </div>

        {/* Transparent Donation Flow */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Transparent Donation Flow
          </h3>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Brand Commits Donation Amount</div>
                  <div className="text-sm text-gray-600">$50,000 pledged for environmental causes</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Users Vote on Allocation</div>
                  <div className="text-sm text-gray-600">Community decides which charities receive funding</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Funds Distributed Transparently</div>
                  <div className="text-sm text-gray-600">Blockchain-verified transactions with public receipts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Impact Reports Shared</div>
                  <div className="text-sm text-gray-600">Quarterly updates on how funds were used and results achieved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Mechanisms */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Proof Mechanisms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-gray-900 mb-2">🏆 Participant Badges</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">"Changemaker" badge for CSR voters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Display on user profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Share achievements on social media</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-medium text-gray-900 mb-2">📊 Impact Certificates</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Downloadable impact certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Show contribution to specific causes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Blockchain-verified authenticity</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Campaign */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">🌱 Example: Environmental CSR Campaign</h3>
          <p className="text-green-100 mb-4">
            A major corporation wants to demonstrate environmental commitment:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Announce: "We're donating $100,000. You decide where it goes!"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Options: Ocean Cleanup, Reforestation, Renewable Energy, Wildlife Protection</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Users vote (0.8x CPE - lower cost for CSR campaigns)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Funds distributed based on vote percentages with full transparency</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              <span>Result: 25K engaged users, 95% positive brand sentiment, viral social sharing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRElectionStructurePanel;